PRD — TherapistOS (Israel Alternative Therapists Portal + Admin OS)
1) Overview

Product: TherapistOS
Type: Free therapist portal + admin operating system + partner referral marketplace (Israel, Hebrew-first).
Core idea: Therapists get a free profile + leads. Revenue comes from (1) paid “Admin AI” tools and (2) referral fees from vetted partners (professional liability insurance, tax/accounting help, group-session tools).

2) Objectives
Business objectives (first 90 days)

Onboard 200 therapists (free)

Generate 1,000 client leads routed to therapists

Achieve first revenue via:

≥30 partner conversions (insurance/tax), and/or

≥50 paid subscriptions to Admin tools

Product objectives

Reduce therapist admin time (scheduling + reminders)

Increase lead→booking conversion

Enable group-session logistics with minimal friction

3) Success metrics
North Star

Weekly booked appointments created via TherapistOS

Supporting metrics

Therapist Activation Rate: % who complete profile + enable a contact/booking method

Lead→Booking Conversion Rate

No-show Rate (tracked for therapists who use reminders)

WAU Therapists (weekly active therapists)

Revenue per Activated Therapist

Partner Conversion Rate (by partner type: insurance vs tax)

4) Target users & personas
Primary users (MVP focus)

Solo therapist (1:1)
Needs: quick lead handling, scheduling, reminders, simple CRM

Group facilitator (workshops/series)
Needs: group scheduling, attendee management, reminders, video links

Secondary users

Clients (discovery + contact/booking)

Partners (insurance agents, accountants)

5) Problem statement

Therapists lose revenue and time due to admin overhead (scheduling, no-shows, tax/compliance uncertainty, group logistics). Existing directories provide discovery but don’t solve workflow pain or build retention.

6) Positioning

“Admin OS למטפלים”: a workflow tool that also brings leads, not just a listing site.

7) Scope
In scope for MVP (2–6 weeks)

Therapist profile (public SEO page)

Lead capture + inbox

Basic scheduling (simple availability OR calendar connection)

Lightweight CRM pipeline

Partner referral flows + tracking

Group sessions v1 (create event, collect attendees, send reminders + link)

Explicitly out of scope (MVP)

Reviews/ratings

In-platform payments

Advanced matching algorithm

Storing medical/sensitive health records

8) Key user journeys
Journey A — Therapist onboarding

Sign up

Create profile (bio, modalities, city/online, pricing range, WhatsApp CTA)

Publish profile

(Optional) add availability / connect calendar
Outcome: Therapist is “Activated”

Journey B — Client lead → booking

Client visits profile / browse directory

Sends lead (form) OR clicks WhatsApp

Therapist responds + schedules time

Booking confirmed + reminders sent
Outcome: Booking created

Journey C — Partner referral

Therapist clicks “Need insurance / tax help”

Submits short request form

Partner receives lead (email/CRM) with tracking token

Conversion marked (manual initially)
Outcome: Referral conversion recorded

Journey D — Group session

Therapist creates group event (title, date/time or “TBD”)

Shares link to attendees

Attendees register (name + phone/email)

Automated reminders + video link sent
Outcome: Group attendance increased, admin reduced

9) Functional requirements
9.1 Auth & accounts

Email-based sign up/login (MVP)

Therapist-only social login: Google + Facebook (OAuth), assigns therapist role

Therapist role (later: admin, partner)

Acceptance criteria

User can sign up and return to dashboard

Session persists; logout works

9.2 Therapist profile (public)

Fields (MVP)

Display name, photo, short bio

Modalities (multi-select)

City/region + “online”

Pricing range (optional)

Languages

Start treating year (stored) with auto-calculated experience

Offers: in-person and/or online (explicit yes/no)

Available days of week (for availability display)

Custom modality entry (creates a new modality that becomes filterable)

Insurance certificate (internal only, not shown on public profile)

Contact CTA: WhatsApp link + “Send inquiry” form button

SEO

Public URL slug (e.g., /t/{name}-{id})

Indexable pages, fast load

Acceptance criteria

Therapist can publish/unpublish profile

Profile photo upload works and renders on the public profile

Profile page renders correctly on mobile

Profile includes at least one contact method

9.3 Directory browsing (minimal)

Browse list with filters: modality, city/online

Search by name (optional MVP+)

Acceptance criteria

Client can filter and open a profile within 3 clicks

9.4 Lead capture + inbox

Client inquiry form: name, phone, message

Lead stored and visible in therapist dashboard

Lead status: New / Contacted / Booked / Closed / No-show

Notifications (MVP)

Email notification to therapist on new lead (or dashboard only if you prefer ultra-lean)

Acceptance criteria

New lead creates record + appears in inbox

Therapist can update lead status

9.5 Scheduling (basic)

Option A (fastest MVP): therapist sets 3–10 weekly availability blocks (e.g., Mon 9–12)
Option B (MVP+): connect Google Calendar for conflict checking (optional)

Booking record

client name, date/time, status: Pending/Confirmed/Completed/Cancelled

Acceptance criteria

Therapist can create a booking from a lead in <60 seconds

Booking appears in therapist dashboard list

9.6 Reminders (MVP)

For confirmed bookings: send reminder message templates (initially email; WhatsApp/SMS later)

Reminder timing: 24h + 2h before (configurable later)

Acceptance criteria

System schedules reminders automatically when booking is confirmed

Therapist can disable reminders per booking

9.7 Partner referral flows + tracking

Referral categories (MVP):

Professional liability insurance

Tax/accounting help

Flow

Simple request form (therapist details auto-filled)

Store referral with tracking token + status: Sent / Contacted / Converted / Lost

Export/report view (admin)

Acceptance criteria

Therapist submits referral request in <2 minutes

Admin can see referrals by partner and status

9.8 Group sessions v1

Therapist creates event: title, description, date/time (or TBD), video link (manual paste)

Attendee registration form

Reminder messages (email MVP; WhatsApp/SMS later)

Attendance list view

Acceptance criteria

Therapist can create event and share link

Attendee list updates in real-time

Reminders send based on event date/time

10) AI requirements (minimum viable)

Goal: reduce therapist admin workload without overbuilding.

AI v1 features

Message drafting for lead replies (Hebrew-first):

propose 3 time options

confirmation message

reschedule message

Reminder copy generation (tone presets)

Credential document extraction: suggest title/issuer/issued year from uploads; therapist can edit

Constraints

No medical advice generation

No sensitive health information processing required for MVP

Acceptance criteria

Therapist can generate a reply draft in 1 click

Draft is editable before sending

11) Non-functional requirements

Mobile-first UI

Fast public pages (SEO)

Basic security: rate limiting on forms, spam protection (honeypot/recaptcha optional)

Privacy-by-design: avoid storing health info; store only contact + scheduling metadata

Auditability for partner referrals (who submitted, timestamp, status history)

12) Analytics & instrumentation

Track events:

therapist_signup_completed

profile_published

lead_created

lead_status_changed

booking_created / booking_confirmed

reminder_scheduled / reminder_sent

referral_submitted / referral_converted

group_event_created / attendee_registered

Dashboards (admin):

active therapists

leads per therapist

bookings per week

referral conversions by partner

13) Roles & permissions (MVP)

Therapist: manage profile, leads, bookings, events, referrals

Admin: manage therapists (verification flags), partners, referral reporting

Partner (optional in MVP): not required; can be email-based intake

14) Rollout plan

Private beta with 10–20 therapists (concierge onboarding)

Public launch with “Founding therapists” badge

Add paid tier once retention signal exists (WAU + bookings)

15) Risks & mitigations

Crowded directory market: lead with Admin OS wedge, not listings

Trust issues: verification tier + transparency about referrals

Low therapist activation: done-for-you onboarding + default templates

Compliance/privacy: no medical records; disclaimers; strict data minimization

Partner dependency: sign 2–3 partners early; keep referral pipeline portable

16) Open questions (must answer during discovery)

Best starting niche (breathwork vs coaches vs Satya etc.)?

WhatsApp-only vs email-first MVP?

Availability model: manual weekly slots vs calendar connect?

Subscription pricing sensitivity in Israel

Verification: minimal (phone) vs stronger (cert upload)

17) User stories + acceptance criteria (MVP)
Stories — Therapist

As a therapist, I can create and publish a profile so clients can find me.
AC: publish/unpublish works; profile shows contact CTA; mobile renders well.

As a therapist, I can receive and manage leads in an inbox.
AC: lead appears instantly; status updates persist.

As a therapist, I can create a booking from a lead and confirm it.
AC: booking created; status confirmed; reminders scheduled.

As a therapist, I can create a group session and collect attendees.
AC: shareable link; attendee list updates; reminders send.

As a therapist, I can request insurance/tax help via a referral form.
AC: referral recorded with status; admin can report.

Stories — Client

As a client, I can filter therapists and contact one quickly.
AC: filters work; contact action succeeds.

18) Implementation plan (2–6 weeks)
Week 1 — Foundations + Profiles

Auth + therapist dashboard shell

Profile create/edit + public profile page

Basic directory list + filters (minimal)

Week 2 — Leads + CRM

Lead capture form + inbox

Lead status pipeline

Email notification (optional)

Week 3 — Bookings + reminders

Booking creation/confirmation

Reminder scheduler (email MVP)

Minimal AI: message drafting UI (generate + edit)

Week 4 — Referrals + group sessions v1

Partner referral forms + tracking

Group event create + attendee registration + reminders

Admin reporting page

Week 5–6 (buffer / MVP+)

Google Calendar connect (optional)

Anti-spam hardening

“Verified” badge workflow (cert upload + admin flag)

Polish + mobile UX + SEO improvements