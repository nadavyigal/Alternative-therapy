Product Brief — “TherapistOS” (Israel Alternative Therapy Portal + Admin Services)
1) Product snapshot

What it is: A free, therapist-first portal in Israel where alternative therapists create a profile and receive client leads/referrals, while the business monetizes through an “admin operating system” (AI scheduling + reminders + group-session logistics) and partner referrals (professional liability insurance + tax filing/accounting help + other ops tools).

Primary wedge: Save therapists time + increase booked sessions (not “just another directory”).

2) Problem

Alternative therapists in Israel struggle with:

Scheduling chaos (WhatsApp ping-pong, cancellations, no-shows, messy calendars)

Admin burden (tax submissions, receipts/invoices, forms)

Risk anxiety (professional liability insurance decisions, consent/disclaimer forms)

Group-session logistics (finding times, payments, reminders, Zoom/Meet links)

Client acquisition uncertainty (not converting attention into bookings)

Existing directories help discovery but don’t remove admin pain or create workflow stickiness.

3) Target users & personas
Primary user (start here): Therapists (supply)

Solo therapist (1:1 mostly)

Needs: scheduling, reminders, fewer no-shows, simple intake, WhatsApp-first flow

Group facilitator (workshops/series)

Needs: group scheduling, payment links, attendee management, reminders, video links

Small clinic owner (2–10 therapists) (later)

Needs: shared calendar, team routing, reports, multi-practitioner profiles

Secondary users

Clients seeking a therapist (location/modality/price/availability)

Partners: insurance agents, accountants/bookkeepers, tools providers

4) Value proposition
For therapists

Free profile + lead capture that actually turns into bookings

Admin AI + automations: coordinate appointments, reduce no-shows, manage groups

Trusted “compliance & admin help” marketplace (insurance + tax help) in one place

For clients

Find relevant therapists fast + contact/book without friction

For partners

Qualified inbound leads with tracking and transparency

5) Goals & success metrics
Business goals (first 90 days)

Onboard 200 therapists (free)

Generate 1,000 leads to therapists

Achieve first revenue via:

30+ partner conversions (insurance/tax consults), and/or

50+ paid subscriptions for Admin tools

Product metrics (North Star)

Weekly booked appointments created via platform

Supporting metrics:

Therapist activation: % completing profile + adding availability

Lead-to-booking conversion rate

No-show rate reduction (before/after)

WAU therapists (weekly active users)

Partner conversion rate + revenue per activated therapist

6) Positioning & messaging

“Admin OS למטפלים” (Therapist Operating System)

Not “עוד אינדקס”, but a workflow tool that also brings leads.

Trust principles:

Verified badges (ID + certificate upload + optional screening call)

Clear disclaimers (not medical advice; platform role)

Clear referral disclosure (“may earn referral fee”)

7) MVP scope (2–6 weeks)
MVP must-have (max 6)

Therapist profile page (free)

Bio, modalities, locations/online, pricing range, languages, photos

Lead capture

Form + WhatsApp CTA + lead inbox

Basic scheduling

Availability slots OR Google Calendar connect

Simple CRM

Lead statuses: New → Contacted → Booked → Completed / No-show

Partner referral flows + tracking

Insurance + tax help request forms, tracked referrals, disclosure

Group session MVP

Create group event → collect interest → send Meet/Zoom link + reminders

Not now (explicit)

Reviews/ratings system

In-platform payments (use links initially)

Complex matching algorithms

Storing sensitive health records

8) Core user journeys
Therapist journey

Sign up → create profile (10 min)

Connect WhatsApp + (optional) calendar

Receive lead → reply with suggested times (assisted)

Booked → reminders auto-sent

Option: “Need insurance/tax help” → referral flow

Client journey

Search/browse (modality/city/online/price)

View profile → click WhatsApp or request booking

Receive confirmation + reminders

Partner journey

Receive qualified inquiry with context

Convert → mark as converted (or via tracking link)

Monthly reporting + payouts (manual at first)

9) Feature set (full product vision)
Directory + discovery

Modality pages, city pages, online-only filter

Availability indicator (later)

Verified badge tiers

Scheduling & comms (TherapistOS)

AI scheduling assistant (Hebrew-first)

Reminder engine (WhatsApp/SMS/email)

Reschedule flow + cancellation policy messaging

Intake templates (non-medical) + consent/disclaimer templates

Group sessions

Time poll / availability collection

Attendee list + reminder cadence

Video link automation (Meet/Zoom)

Series management (multiple sessions)

Admin marketplace

Insurance referral flow

Accountant/tax help flow

Optional add-ons later: invoicing tools, clinic room rentals, CRM integrations

Monetization

Free: profile + lead capture

Paid: “Admin AI” tiers

Referral fees: insurance/accounting/tools

(Later) premium visibility, but only if it doesn’t damage trust

10) Monetization model (recommended hybrid)
Subscription tiers (example)

Free: profile + lead form + basic inbox

Pro (₪49–₪99/mo): scheduling assistant, reminders, CRM, templates

Group (₪99–₪199/mo): group workflows + series + attendee management

Clinic (custom): multi-therapist routing + shared calendar + reports

Referral revenue

Insurance + accounting conversions tracked per therapist

Transparent disclosure on every flow

11) Data model (high level)

User (therapist/admin)

TherapistProfile (bio, modalities, cities, pricing, languages, verified status)

Availability (slots or external calendar link)

Lead (client contact, source, message, status, timestamps)

Booking (time, therapist, client, status)

Reminder (channel, schedule, delivery status)

GroupEvent (title, dates, attendee list, link, reminder plan)

PartnerReferral (type: insurance/tax, therapist, status, partner, tracking token)

12) Integrations (phased)

Phase 1 (MVP):

WhatsApp deep links (no API required)

Google Calendar optional connect

Meet/Zoom manual link paste

Phase 2+:

WhatsApp Business API / SMS provider (optional)

Payments links (Stripe/Tranzila/PayBox/etc.)

Zoom API automation (if needed)

13) Non-functional requirements

Hebrew-first UX; bilingual optional later

Mobile-first (therapists live on WhatsApp)

Fast profile pages (SEO-ready)

Basic security: email/phone verification, spam protection, rate limits

Minimal sensitive data storage (avoid health info in MVP)

14) Risks & mitigations

Crowded directory space → lead with “Admin OS” wedge + concierge onboarding

Trust/fraud → verification tiers + moderation + transparent referrals

Compliance ambiguity → disclaimers + avoid medical claims + minimal health data

Two-sided marketplace cold start → acquire therapists first; demand via SEO + partnerships + group events

15) Go-to-market (first 30 days)

30 therapist interviews → onboard 20 “founding therapists” with done-for-you profiles

Launch 10 modality+city pages + 10 practical admin articles (therapist-intent keywords)

Close 2 partners (insurance + accountant) with written referral terms

Run 2 pilot group events to prove “group engine” value

16) Roadmap (30/60/90)
0–30: Validate + MVP

Profiles + leads + basic scheduling + referral tracking

Concierge scheduling pilot to validate value

31–60: Stickiness

Reminder engine + reschedule

Group session v1

First paid tier

61–90: Scale

Verified system + more SEO pages

Partner expansion + reporting

Clinic/team features exploration

17) Open questions (to answer while building)

Best initial niche (breathwork / Satya / coaches / etc.)?

Preferred comms channel: WhatsApp-only vs multi-channel?

Subscription vs referral emphasis (which hits revenue faster)?

What level of verification is feasible without heavy ops?

Do therapists want payments inside platform or just links?