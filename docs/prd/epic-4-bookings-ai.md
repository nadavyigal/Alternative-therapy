# Epic 4 - Bookings & AI

## Overview
Provide booking workflows, reminders, and Hebrew AI message drafting to reduce therapist admin time.

## Scope
- Booking creation from leads.
- Booking status management.
- Reminder scheduling (email; SMS/WhatsApp later).
- AI message drafting for replies and reminders.

## User stories
- As a therapist, I can create a booking from a lead.
- As a therapist, I can confirm/cancel bookings and track status.
- As a therapist, I can generate Hebrew reply drafts.
- As a client, I receive reminders before appointments.

## Acceptance criteria
- Therapist can create a booking in <60 seconds from a lead.
- Booking appears in dashboard with status (Pending/Confirmed/Completed/Cancelled).
- Reminders are scheduled automatically for confirmed bookings (24h and 2h).
- AI draft is generated in one click and is editable before sending.

## Technical requirements
- Add `booking` table in `src/lib/schema.ts`.
- Booking UI: `src/components/therapist/booking-form.tsx` (or calendar component).
- Reminder service: `src/lib/reminders.ts`.
- AI route: `src/app/api/ai/message-draft/route.ts` with OpenRouter.
- Ensure AI output includes no medical advice and is Hebrew.

## Dependencies
- Epic 3 (leads).
- Epic 1 (auth + RBAC).
- Email notifications (Epic 3).

## Success metrics
- Number of bookings created per week.
- Reminder delivery success rate.
- Reduction in no-show rate.
