# Epic 5 - Referrals & Admin

## Overview
Build partner referral flows, admin tooling, and (if still in MVP scope) group sessions v1.

## Scope
- Service request/referral system and partner management.
- Admin queues for credential verification and referrals.
- Reporting and analytics dashboards.
- Group sessions v1: event creation, attendee registration, reminders.

## User stories
- As a therapist, I can submit a referral request (insurance/tax/pension).
- As an admin, I can view and track referrals by partner and status.
- As an admin, I can verify therapist credentials.
- As a therapist, I can create a group event and share a registration link.
- As an attendee, I can register for a group session and receive reminders.

## Acceptance criteria
- Referral request can be submitted in <2 minutes and tracked by status.
- Admin can filter and export referrals by partner and status.
- Credential verification updates therapist profile status.
- Group event link is shareable and attendee list updates in real time.
- Reminders send based on event date/time.

## Technical requirements
- Add tables in `src/lib/schema.ts`:
  - serviceRequest, partner
  - groupEvent, groupEventAttendee (if in scope)
  - review (future)
- Admin pages:
  - `src/app/(admin)/credentials/page.tsx`
  - `src/app/(admin)/service-requests/page.tsx`
- Partner referral API route(s) under `src/app/api/service-requests/`.
- Analytics views in `src/app/(admin)/analytics/` (or dashboard).
- Reminder reuse from `src/lib/reminders.ts`.

## Dependencies
- Epic 2 (credentials).
- Epic 3 (email notifications).
- Epic 4 (reminders).

## Success metrics
- Referral conversion rate by partner.
- Admin verification turnaround time.
- Group event attendance rate (if in scope).
