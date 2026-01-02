type LeadNotificationInput = {
  therapistName: string;
  therapistEmail: string;
  clientName: string;
  clientPhone: string;
  message?: string | null;
  profileSlug?: string | null;
};

type EmailResult = {
  ok: boolean;
  skipped?: boolean;
  error?: string;
};

const getAppUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "";

export async function sendLeadNotification(
  input: LeadNotificationInput
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM || "";

  if (!apiKey || !from) {
    console.warn(
      "[email] Lead notification skipped: RESEND_API_KEY/RESEND_FROM_EMAIL missing."
    );
    return { ok: false, skipped: true };
  }

  const profileUrl =
    input.profileSlug && getAppUrl()
      ? `${getAppUrl()}/t/${input.profileSlug}`
      : "";

  const messageLine = input.message?.trim()
    ? `הודעה: ${input.message.trim()}`
    : "הודעה: לא צוינה הודעה.";

  const text = [
    `שלום ${input.therapistName},`,
    "",
    "קיבלת פנייה חדשה דרך TherapistOS.",
    "",
    `שם הפונה: ${input.clientName}`,
    `טלפון: ${input.clientPhone}`,
    messageLine,
    profileUrl ? `קישור לפרופיל: ${profileUrl}` : "",
    "",
    "נא לחזור לפונה בתוך 24-48 שעות.",
    "",
    "הפלטפורמה אינה שירות חירום או ייעוץ רפואי. במקרה חירום יש לפנות למוקדי החירום הרשמיים.",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.therapistEmail],
      subject: `פנייה חדשה מ-${input.clientName}`,
      text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.warn(
      `[email] Lead notification failed (${response.status}): ${errorText || response.statusText}`
    );
    return { ok: false, error: errorText || response.statusText };
  }

  return { ok: true };
}
