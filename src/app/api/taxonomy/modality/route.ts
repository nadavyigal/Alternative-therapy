import { NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { ensureModality } from "@/lib/therapy-taxonomy";

export async function POST(req: Request) {
  let session;

  try {
    session = await requireRole("therapist");
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const nameHe =
    typeof (body as { nameHe?: unknown })?.nameHe === "string"
      ? (body as { nameHe: string }).nameHe.trim()
      : "";

  if (!nameHe) {
    return NextResponse.json({ error: "MISSING_NAME" }, { status: 400 });
  }

  const modality = await ensureModality(nameHe, session.user.id);
  if (!modality) {
    return NextResponse.json({ error: "INVALID_NAME" }, { status: 400 });
  }

  return NextResponse.json(
    { id: modality.id, nameHe: modality.nameHe, slug: modality.slug },
    { status: 201 }
  );
}
