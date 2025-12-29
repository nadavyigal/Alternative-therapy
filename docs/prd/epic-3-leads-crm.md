# Epic 3 - Leads & CRM

## Overview
Enable clients to send inquiries and therapists to manage leads in a lightweight CRM.

## Scope
- Lead capture form on public profiles.
- Lead inbox for therapists with status workflow.
- Email notifications for new leads.
- Basic anti-spam (rate limiting / honeypot).

## User stories
- As a client, I can send an inquiry to a therapist.
- As a therapist, I can view and update lead status.
- As a therapist, I receive a notification when a new lead arrives.

## Acceptance criteria
- New lead creates a record and appears in therapist inbox.
- Lead status updates persist (New/Contacted/Booked/Closed/No-show).
- Email notification sent on new lead (or recorded if email disabled).
- Lead form is protected against spam (rate limit + honeypot).

## Technical requirements
- Add `lead` table in `src/lib/schema.ts`.
- Lead API: `src/app/api/leads/create/route.ts`.
- Lead form UI: `src/components/directory/contact-modal.tsx` (or equivalent).
- Lead inbox UI: `src/components/therapist/lead-inbox/`.
- Email templates in `src/lib/email.ts` (Hebrew).

## Dependencies
- Epic 2 (public profiles and directory).
- Epic 1 (auth + RBAC for therapist inbox).

## Success metrics
- Leads created per week.
- Lead response time (median).
- Lead-to-booking conversion rate.
