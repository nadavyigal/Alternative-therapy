import { NextResponse } from "next/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
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

const extractJsonBlock = (value: string) => {
  const start = value.indexOf("{");
  const end = value.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return value.slice(start, end + 1);
};

const toConfidence = (value: unknown) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return undefined;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
};

const extractCredentialMetadata = async (file: File) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (file.type !== "application/pdf" && !file.type.startsWith("text/")) {
    return null;
  }

  const rawText = await file.text();
  const text = rawText.replace(/\s+/g, " ").trim().slice(0, 4000);

  if (!text) {
    return null;
  }

  const openrouter = createOpenRouter({ apiKey });
  const { text: responseText } = await generateText({
    model: openrouter(process.env.OPENROUTER_MODEL || "openai/gpt-5-mini"),
    prompt: [
      "Extract the credential title, issuer organization, and issued year from the text below.",
      "Return JSON only: {\"title\": string|null, \"issuer\": string|null, \"issuedYear\": number|null, \"confidence\": number}.",
      "Confidence is 0-100.",
      "",
      text,
    ].join("\n"),
  });

  const jsonBlock = extractJsonBlock(responseText);
  if (!jsonBlock) {
    return null;
  }

  try {
    const parsed = JSON.parse(jsonBlock) as {
      title?: string | null;
      issuer?: string | null;
      issuedYear?: number | null;
      confidence?: number;
    };

    return {
      title: parsed.title ?? undefined,
      issuer: parsed.issuer ?? undefined,
      issuedYear:
        typeof parsed.issuedYear === "number" ? parsed.issuedYear : undefined,
      extractionConfidence: toConfidence(parsed.confidence),
    };
  } catch {
    return null;
  }
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
  const documentType = toStringValue(formData.get("documentType")) || "professional";

  if (!["professional", "insurance"].includes(documentType)) {
    return NextResponse.json({ error: "INVALID_DOCUMENT_TYPE" }, { status: 400 });
  }

  let extracted;
  if (!title || !issuer || issuedYear === undefined) {
    extracted = await extractCredentialMetadata(file);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { url } = await upload(buffer, file.name, "credentials", {
    maxSize: MAX_FILE_SIZE,
  });

  const record = await createCredential({
    therapistProfileId: profile.id,
    title: title || extracted?.title,
    issuer: issuer || extracted?.issuer,
    issuedYear: issuedYear ?? extracted?.issuedYear,
    fileUrl: url,
    documentType,
    extractionConfidence: extracted?.extractionConfidence,
  });

  return NextResponse.json(
    {
      id: record?.id ?? null,
      url,
    },
    { status: 201 }
  );
}
