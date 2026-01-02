"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type LeadCaptureFormProps = {
  therapistProfileId: string;
  therapistName: string;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

export function LeadCaptureForm({
  therapistProfileId,
  therapistName,
}: LeadCaptureFormProps) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  const isDisabled = status === "submitting" || status === "success";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!clientName.trim() || !clientPhone.trim()) {
      setError("אנא מלאו שם מלא וטלפון תקין.");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          therapistProfileId,
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim(),
          message: message.trim(),
          company: company.trim(),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const messageText =
          payload?.error === "INVALID_PHONE"
            ? "מספר הטלפון לא תקין. ודאו פורמט ישראלי (05X...)."
            : payload?.error === "RATE_LIMITED"
              ? "נשלחו יותר מדי פניות. נסו שוב בעוד כמה דקות."
              : "לא הצלחנו לשלוח את הפנייה. נסו שוב.";
        setError(messageText);
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setError("אירעה שגיאה לא צפויה. נסו שוב.");
      setStatus("error");
    }
  };

  return (
    <section
      aria-labelledby="lead-form-title"
      className="rounded-2xl border bg-card p-6 shadow-sm"
    >
      <div className="mb-4 space-y-2">
        <h2 id="lead-form-title" className="text-xl font-semibold">
          שליחת פנייה ל-{therapistName}
        </h2>
        <p className="text-sm text-muted-foreground">
          מלאו את הפרטים ונעביר את הפנייה ישירות למטפל/ת.
        </p>
      </div>

      {status === "success" ? (
        <div
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          הפנייה נשלחה בהצלחה. המטפל/ת יחזרו אליכם תוך 24-48 שעות.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="hidden" aria-hidden="true">
            <label htmlFor="company" className="text-sm font-medium">
              חברה
            </label>
            <Input
              id="company"
              name="company"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="clientName" className="text-sm font-medium">
              שם מלא
            </label>
            <Input
              id="clientName"
              name="clientName"
              value={clientName}
              onChange={(event) => setClientName(event.target.value)}
              placeholder="איך נקרא לך?"
              required
              disabled={isDisabled}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="clientPhone" className="text-sm font-medium">
              טלפון נייד
            </label>
            <Input
              id="clientPhone"
              name="clientPhone"
              value={clientPhone}
              onChange={(event) => setClientPhone(event.target.value)}
              placeholder="05X-XXXXXXX"
              required
              disabled={isDisabled}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              איך אפשר לעזור?
            </label>
            <Textarea
              id="message"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="כתבו בקצרה מה תרצו לשתף"
              rows={4}
              disabled={isDisabled}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={isDisabled}>
            {status === "submitting" ? "שולחים..." : "שליחת פנייה"}
          </Button>
        </form>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        הפלטפורמה אינה שירות חירום או ייעוץ רפואי. במקרה חירום יש לפנות ל-101
        או ל-100.
      </p>
    </section>
  );
}
