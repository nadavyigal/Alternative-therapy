import { NextResponse } from "next/server";
import { listLeadsForProfile } from "@/lib/leads";
import { requireRole } from "@/lib/rbac";
import { getTherapistProfileByUserId } from "@/lib/therapist-profile";

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

  const leads = await listLeadsForProfile(profile.id);

  return NextResponse.json({ leads });
}
