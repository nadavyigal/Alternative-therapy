# Email Notifications

## Overview
Email is the MVP notification channel for TherapistOS. All templates must be written in Hebrew and include the platform disclaimer when relevant.

## Implementation files
- `src/lib/email.ts` - Email client and templates
- `src/lib/reminders.ts` - Reminder scheduling
- `src/app/api/leads/create/route.ts` - Trigger new lead email
- `src/app/api/bookings/*` - Trigger booking confirmations/reminders

## Template catalog (Hebrew)
- New lead notification to therapist
- Booking confirmation / reschedule
- Reminder 24h and 2h before appointment
- Referral request submission confirmation
- Credential verification result

## Example API
```ts
export async function sendLeadNotification(input: {
  therapistEmail: string;
  clientName: string;
  clientPhone: string;
  message?: string;
}) {
  // Compose Hebrew subject + body
  // Include disclaimer: "זה אינו ייעוץ רפואי ואינו שירות חירום"
}
```

## Delivery provider
- Use Resend or equivalent if `RESEND_API_KEY` is configured.
- If missing, log and surface a warning without blocking the request.

## Content requirements
- All user-facing email text must be Hebrew.
- Do not include medical advice or collect sensitive health data.
