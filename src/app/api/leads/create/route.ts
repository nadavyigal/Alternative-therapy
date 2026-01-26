import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sendLeadNotification } from "@/lib/email";
import { createLead } from "@/lib/leads";
import { therapistProfile, user } from "@/lib/schema";

type LeadPayload = {
  therapistProfileId?: unknown;
  clientName?: unknown;
  clientPhone?: unknown;
  message?: unknown;
  company?: unknown;
};

const toStringValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const getClientIp = (req: Request) => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0];
    return firstIp?.trim() ?? "unknown";
  }
  return req.headers.get("x-real-ip") || "unknown";
};

const checkRateLimit = (key: string) => {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return false;
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);
  return true;
};

export async function POST(req: Request) {
  let body: LeadPayload;

  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const therapistProfileId = toStringValue(body?.therapistProfileId);
  const clientName = toStringValue(body?.clientName);
  const clientPhone = toStringValue(body?.clientPhone);
  const message = toStringValue(body?.message);
  const company = toStringValue(body?.company);

  if (company) {
    return NextResponse.json({ error: "SPAM" }, { status: 400 });
  }

  const clientIp = getClientIp(req);
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  if (!therapistProfileId || !clientName || !clientPhone) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  const [profile] = await db
    .select()
    .from(therapistProfile)
    .innerJoin(user, eq(therapistProfile.userId, user.id))
    .where(
      and(
        eq(therapistProfile.id, therapistProfileId),
        eq(therapistProfile.published, true)
      )
    )
    .limit(1);

  if (!profile) {
    return NextResponse.json({ error: "PROFILE_NOT_FOUND" }, { status: 404 });
  }

  try {
    const record = await createLead({
      therapistProfileId,
      clientName,
      clientPhone,
      message: message || null,
      source: "profile",
    });

    if (!record) {
      return NextResponse.json({ error: "CREATE_FAILED" }, { status: 500 });
    }

    const therapistName = profile.therapist_profile.displayName;
    const therapistEmail =
      profile.therapist_profile.contactEmail || profile.user.email;

    if (therapistEmail) {
      sendLeadNotification({
        therapistName,
        therapistEmail,
        clientName,
        clientPhone,
        message: message || null,
        profileSlug: profile.therapist_profile.slug,
      }).catch((error) => {
        console.warn(
          `[email] Lead notification failed to send: ${
            error instanceof Error ? error.message : "unknown error"
          }`
        );
      });
    }

    return NextResponse.json(
      { id: record.id, status: record.status },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_PHONE") {
      return NextResponse.json({ error: "INVALID_PHONE" }, { status: 400 });
    }

    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
