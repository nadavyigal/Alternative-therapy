import { NextResponse } from "next/server";

import { createCredential } from "@/lib/credentials";
import { requireRole } from "@/lib/rbac";
import { upload } from "@/lib/storage";
import { getTherapistProfileByUserId } from "@/lib/therapist-profile";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);
const ALLOWED_EXTENSIONS = new Set([".pdf", ".jpg", ".jpeg", ".png"]);

const toStringValue = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const parseIssuedYear = (value: string) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const isAllowedFile = (file: File) => {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  const mimeAllowed = file.type ? ALLOWED_MIME_TYPES.has(file.type) : false;
  return ALLOWED_EXTENSIONS.has(extension) || mimeAllowed;
};

export async function POST(req: Request) {
  let session;

  try {
    session = await requireRole("therapist");
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "MISSING_FILE" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "FILE_TOO_LARGE" }, { status: 400 });
  }

  if (!isAllowedFile(file)) {
    return NextResponse.json({ error: "UNSUPPORTED_FILE" }, { status: 400 });
  }

  const profile = await getTherapistProfileByUserId(session.user.id);
  if (!profile) {
    return NextResponse.json({ error: "PROFILE_REQUIRED" }, { status: 400 });
  }

  const title = toStringValue(formData.get("title"));
  const issuer = toStringValue(formData.get("issuer"));
  const issuedYear = parseIssuedYear(toStringValue(formData.get("issuedYear")));

  const buffer = Buffer.from(await file.arrayBuffer());
  const { url } = await upload(buffer, file.name, "credentials", {
    maxSize: MAX_FILE_SIZE,
  });

  const record = await createCredential({
    therapistProfileId: profile.id,
    title: title || undefined,
    issuer: issuer || undefined,
    issuedYear,
    fileUrl: url,
  });

  return NextResponse.json(
    {
      id: record?.id ?? null,
      url,
    },
    { status: 201 }
  );
}
