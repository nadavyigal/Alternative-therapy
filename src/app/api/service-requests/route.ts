import { NextResponse } from "next/server";

import { requireRole } from "@/lib/rbac";
import { getTherapistProfileByUserId } from "@/lib/therapist-profile";
import {
  createServiceRequest,
  listServiceRequestsForProfileWithPartner,
} from "@/lib/service-requests";

const CATEGORY_OPTIONS = ["insurance", "tax", "pension"] as const;

type ServiceRequestCategory = (typeof CATEGORY_OPTIONS)[number];

type ServiceRequestPayload = {
  category?: unknown;
  details?: unknown;
  consent?: unknown;
};

const toStringValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const isCategory = (value: string): value is ServiceRequestCategory =>
  CATEGORY_OPTIONS.includes(value as ServiceRequestCategory);

const serializeDate = (value: Date | string) =>
  value instanceof Date ? value.toISOString() : value;

export async function GET() {
  let session;

  try {
    session = await requireRole("therapist");
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const profile = await getTherapistProfileByUserId(session.user.id);
  if (!profile) {
    return NextResponse.json({ error: "PROFILE_REQUIRED" }, { status: 400 });
  }

  const requests = await listServiceRequestsForProfileWithPartner(profile.id);

  const payload = requests.map(({ serviceRequest, partner }) => ({
    ...serviceRequest,
    createdAt: serializeDate(serviceRequest.createdAt),
    updatedAt: serializeDate(serviceRequest.updatedAt),
    partner: partner ? { id: partner.id, name: partner.name } : null,
  }));

  return NextResponse.json({ requests: payload });
}

export async function POST(request: Request) {
  let session;

  try {
    session = await requireRole("therapist");
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: ServiceRequestPayload;

  try {
    body = (await request.json()) as ServiceRequestPayload;
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const category = toStringValue(body?.category);
  const details = toStringValue(body?.details);
  const consent = body?.consent === true;

  if (!consent) {
    return NextResponse.json({ error: "CONSENT_REQUIRED" }, { status: 400 });
  }

  if (!isCategory(category)) {
    return NextResponse.json({ error: "INVALID_CATEGORY" }, { status: 400 });
  }

  const profile = await getTherapistProfileByUserId(session.user.id);
  if (!profile) {
    return NextResponse.json({ error: "PROFILE_REQUIRED" }, { status: 400 });
  }

  const record = await createServiceRequest({
    therapistProfileId: profile.id,
    category,
    details: details.length > 0 ? details.slice(0, 4000) : null,
  });

  if (!record) {
    return NextResponse.json({ error: "CREATE_FAILED" }, { status: 500 });
  }

  return NextResponse.json(
    { id: record.id, status: record.status },
    { status: 201 }
  );
}
