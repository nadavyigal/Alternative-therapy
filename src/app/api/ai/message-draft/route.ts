import { NextResponse } from "next/server";
import { z } from "zod";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { requireRole } from "@/lib/rbac";

const intentSchema = z.enum([
  "lead_reply",
  "booking_confirmation",
  "reschedule",
  "reminder",
]);

const requestSchema = z.object({
  intent: intentSchema,
  context: z.object({
    clientName: z.string().min(1).max(120),
    requestedTime: z.string().max(120).optional(),
    notes: z.string().max(1000).optional(),
  }),
});

type DraftIntent = z.infer<typeof intentSchema>;

const INTENT_LABELS: Record<DraftIntent, string> = {
  lead_reply: "מענה לליד חדש",
  booking_confirmation: "אישור פגישה",
  reschedule: "תיאום מחדש",
  reminder: "תזכורת לפגישה",
};

const SYSTEM_PROMPT = [
  "את/ה עוזר/ת למטפלים אלטרנטיביים בישראל.",
  "כתוב/י טיוטת הודעה קצרה, מקצועית וחמה בעברית.",
  "אל תכלול ייעוץ רפואי, אבחנות או הבטחות טיפוליות.",
  "אל תבקש מידע רפואי רגיש או פרטים אישיים שלא נמסרו.",
  "אל תמציא פרטים שלא סופקו.",
  "סיים/י בבקשה קצרה לאישור או תגובה.",
  "החזר/י טקסט בלבד ללא כותרות או תבליטים.",
].join(" ");

const formatRequestedTime = (value?: string) => {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
};

export async function POST(req: Request) {
  try {
    await requireRole("therapist");
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "INVALID_REQUEST",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_NOT_CONFIGURED" },
      { status: 500 }
    );
  }

  const { intent, context } = parsed.data;
  const openrouter = createOpenRouter({ apiKey });
  const requestedTime = formatRequestedTime(context.requestedTime);

  const prompt = [
    `סוג הודעה: ${INTENT_LABELS[intent]}`,
    `שם המטופל/ת: ${context.clientName}`,
    requestedTime ? `זמן רלוונטי: ${requestedTime}` : "",
    context.notes?.trim() ? `הקשר נוסף: ${context.notes.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const { text } = await generateText({
      model: openrouter(process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      prompt,
    });

    return NextResponse.json({ text: text.trim() });
  } catch (error) {
    return NextResponse.json(
      {
        error: "DRAFT_FAILED",
        details: error instanceof Error ? error.message : "unknown error",
      },
      { status: 500 }
    );
  }
}
