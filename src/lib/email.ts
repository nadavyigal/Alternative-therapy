type LeadNotificationInput = {
  therapistName: string;
  therapistEmail: string;
  clientName: string;
  clientPhone: string;
  message?: string | null;
  profileSlug?: string | null;
};

type AuthEmailInput = {
  to: string;
  name?: string | null;
  url: string;
};

type ResendEmailInput = {
  to: string | string[];
  subject: string;
  text: string;
};

type EmailResult = {
  ok: boolean;
  skipped?: boolean;
  error?: string;
};

const getAppUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "";

const getResendConfig = () => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM || "";

  if (!apiKey || !from) {
    return null;
  }

  return { apiKey, from };
};

async function sendResendEmail(input: ResendEmailInput): Promise<EmailResult> {
  const config = getResendConfig();

  if (!config) {
    console.warn(
      "[email] Email skipped: RESEND_API_KEY/RESEND_FROM_EMAIL missing."
    );
    return { ok: false, skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.warn(
      `[email] Email failed (${response.status}): ${
        errorText || response.statusText
      }`
    );
    return { ok: false, error: errorText || response.statusText };
  }

  return { ok: true };
}

export async function sendLeadNotification(
  input: LeadNotificationInput
): Promise<EmailResult> {
  const profileUrl =
    input.profileSlug && getAppUrl()
      ? `${getAppUrl()}/t/${input.profileSlug}`
      : "";

  const messageLine = input.message?.trim()
    ? `הודעת הלקוח: ${input.message.trim()}`
    : "הודעת הלקוח: לא צורפה הודעה.";

  const text = [
    `שלום ${input.therapistName},`,
    "",
    "נכנסה פניה חדשה דרך TherapistOS.",
    "",
    `שם הלקוח: ${input.clientName}`,
    `טלפון: ${input.clientPhone}`,
    messageLine,
    profileUrl ? `קישור לפרופיל: ${profileUrl}` : "",
    "",
    "אנא חזרו ללקוח בתוך 24-48 שעות.",
    "",
    "תזכורת: אין למסור ייעוץ רפואי או לבקש מידע רפואי רגיש באימייל.",
  ]
    .filter(Boolean)
    .join("\n");

  return sendResendEmail({
    to: input.therapistEmail,
    subject: `פניה חדשה מ-${input.clientName}`,
    text,
  });
}

export async function sendPasswordResetEmail(
  input: AuthEmailInput
): Promise<EmailResult> {
  const greeting = input.name?.trim() ? `שלום ${input.name.trim()},` : "שלום,";

  const text = [
    greeting,
    "",
    "קיבלנו בקשה לאיפוס הסיסמה לחשבון TherapistOS שלך.",
    "כדי לאפס את הסיסמה, לחצו על הקישור:",
    input.url,
    "",
    "אם לא ביקשתם איפוס, אפשר להתעלם מההודעה הזו.",
    "",
    "תודה, צוות TherapistOS",
  ].join("\n");

  return sendResendEmail({
    to: input.to,
    subject: "איפוס סיסמה ל-TherapistOS",
    text,
  });
}

export async function sendVerificationEmail(
  input: AuthEmailInput
): Promise<EmailResult> {
  const greeting = input.name?.trim() ? `שלום ${input.name.trim()},` : "שלום,";

  const text = [
    greeting,
    "",
    "כדי לאמת את כתובת האימייל שלך ב-TherapistOS, לחצו על הקישור:",
    input.url,
    "",
    "אם לא ביקשתם להירשם, אפשר להתעלם מההודעה הזו.",
    "",
    "תודה, צוות TherapistOS",
  ].join("\n");

  return sendResendEmail({
    to: input.to,
    subject: "אימות כתובת אימייל ב-TherapistOS",
    text,
  });
}
