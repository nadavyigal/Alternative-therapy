import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { updateLeadStatus } from "@/lib/leads";
import { requireRole } from "@/lib/rbac";
import { getTherapistProfileByUserId } from "@/lib/therapist-profile";
import { lead } from "@/lib/schema";

const LEAD_STATUSES = new Set([
  "new",
  "contacted",
  "booked",
  "closed",
  "no_show",
]);

const toStringValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  let session;

  try {
    session = await requireRole("therapist");
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: { status?: unknown };
  try {
    body = (await req.json()) as { status?: unknown };
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const status = toStringValue(body?.status);
  if (!LEAD_STATUSES.has(status)) {
    return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
  }

  const profile = await getTherapistProfileByUserId(session.user.id);
  if (!profile) {
    return NextResponse.json({ error: "PROFILE_REQUIRED" }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(lead)
    .where(and(eq(lead.id, resolvedParams.id), eq(lead.therapistProfileId, profile.id)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const updated = await updateLeadStatus(existing.id, status as typeof existing.status);

  return NextResponse.json(
    { id: updated?.id ?? existing.id, status: updated?.status ?? status },
    { status: 200 }
  );
}
