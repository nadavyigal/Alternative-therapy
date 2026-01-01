# User Journeys + MVP Scope & Roadmap + Business Model & Pricing

---

## 1. Full User Journeys

### 1.1 Therapist – Signup → Profile → Verification → First Lead

**Main flow**

1. Therapist clicks an ad or link (“Get more clients & admin help”) and lands on a tailored landing page.
2. They click **“I’m a therapist”** → Sign-up.
3. Enter email + password (or Google/Facebook for therapists) → receive phone OTP → verify.
4. System identifies role = Therapist and shows welcome screen:
   - Short explanation of benefits.
   - Progress bar: Profile → Credentials → Publish → Get Leads.
5. Therapist fills **Profile step 1**:
   - Name, title, languages, start treating year (auto-calculate experience).
   - Profile photo (public).
6. Step 2:
   - Modalities (multi-select), issues they treat, target populations.
7. Step 3:
   - Locations (city, area), explicit in-person and online toggles, available days of week, price range (optional).
8. Therapist clicks **“Save and continue”**.
9. System shows **Credential upload** page:
   - Prompts: “Upload at least 1 diploma/certificate to build trust”.
10. Therapist uploads 1–3 documents, labels them (e.g., Reiki Level 2).
    - System extracts title/issuer/year from credentials (AI); therapist can edit.
    - Optional: upload professional liability insurance certificate or mark "no insurance" (internal only).
11. System sets credentials to Pending and shows:
   - “Your credentials will be reviewed within X business days.”
12. Therapist clicks **“Publish profile”**:
   - If minimum fields completed → profile becomes Published (with “Verification in progress” label).
13. Admin later verifies credential(s) and updates status to Verified.
14. Profile now shows “Verified credential” badge.
15. Client browsing the directory discovers the profile and sends a lead.
16. Therapist receives email: “New lead from [Platform]: [Client’s first name], click to view details.”
17. Therapist follow-up happens via phone, email, or later in-app messaging.

**Edge cases**

- **Incomplete profile**  
  - If they try to publish with missing required fields, system highlights missing sections and scrolls to first error.
- **No credentials uploaded**  
  - Therapist can still publish, but profile shows: “Credentials not yet verified”.
- **Admin rejects credential**  
  - Therapist gets email: “We could not verify this credential. Reason: …” and a CTA to upload a replacement.

---

### 1.2 Client – Discover → Filter → Evaluate Trust → Contact

**Main flow**

1. Client arrives on homepage (SEO, referral, ad).
2. Homepage shows two main CTAs: “Find a Therapist” and “I’m a Therapist”.
3. Client clicks **“Find a Therapist”**.
4. They see:
   - Top search bar: “What are you looking for?” (issue or modality).
   - Filters: modality, location (city), remote, language.
5. Client types “חרדה” (anxiety), selects location “תל אביב” and remote = “OK”.
6. System shows search results with therapist cards:
   - Each card: photo, name, key modalities, trust badges, short line of text, language icons.
7. Client scrolls and clicks a card with:
   - Verified credential + good number of reviews (later).
8. On profile page, client sees:
   - Detailed bio.
   - List of modalities & issues.
   - Credentials with verification status.
   - Reviews (if available).
   - Clear disclaimer: “This is not a medical/emergency service.”
9. Client clicks **“Contact therapist”**.
10. A modal pops up:
    - Fields: name, email, phone, short description, preferred contact.
    - Consent checkbox for privacy/terms.
11. Client submits; sees confirmation:
    - “Thank you, [Therapist] will aim to respond in 24–48 hours. For emergencies, contact XXXX.”
12. System creates Lead and notifies therapist.

**Edge cases**

- **Client wants urgent help**  
  - UI clearly states the platform is **not for emergencies**; show “If this is an emergency, contact…” message.
- **Abusive/harassing message**  
  - Automatic profanity filter; suspicious leads flagged with spamFlag for admin review before sending.
- **Client wants to contact multiple therapists**  
  - Allowed; we may rate-limit or add a note: “To help therapists respond, please choose up to X therapists.”

---

### 1.3 Therapist – Insurance ServiceRequest

**Main flow**

1. Therapist logs into dashboard.
2. Sees module: “Protect your practice – liability insurance for therapists”.
3. Clicks **“Get insurance”**.
4. Form opens with:
   - Pre-filled name, contact details, modalities, location.
   - Additional fields: clinic vs. home, approximate number of weekly clients, existing insurance yes/no.
5. Therapist completes & clicks **“Submit request”**.
6. System creates a ServiceRequest (type=Insurance, status=New).
7. Admin sees it in **ServiceRequest queue**:
   - Validates completeness.
   - If ok → sets status=Qualified; assigns Partner A (insurance agency).
8. Partner A sees the new request in their portal:
   - Contacts therapist by phone/email.
   - Gathers extra info, sends policy options offline.
9. Once policy is signed, partner marks status=Completed and optionally logs “Premium value”/policy type.
10. System updates status timeline; internal billing/commission process can later be triggered.

**Edge cases**

- **Partner rejects request** (not a fit)  
  - Marks status=ClosedNoFit with a reason.
  - Admin may reassign to another partner or inform therapist.
- **Therapist unresponsive**  
  - Partner sets status=NoResponse; system may nudge therapist via email.

---

### 1.4 Therapist – Pension / קרן השתלמות Request

Similiar flow with pension-specific questions:

1. Therapist clicks “Optimize my pension & קרן השתלמות”.
2. Form asks:
   - Self-employed vs salaried/combination.
   - Monthly/annual income range.
   - Existing pension/קרן השתלמות? which provider?
3. Submission creates ServiceRequest(type=Pension).
4. Admin → Partner (pension advisor) assignment.
5. Partner consults, possibly moves/opens new products.
6. Status updated along the way until Completed/Closed.

---

### 1.5 Therapist – Annual Tax Filing Request

1. Therapist clicks “Get help with annual tax filing/bookkeeping”.
2. Form asks:
   - Business type (עוסק פטור / מורשה / חברה).
   - Approx revenue last year.
   - Any existing accountant/tax advisor?
3. System creates ServiceRequest(type=Tax).
4. Admin assigns to CPA/Tax advisor partner.
5. Partner onboards therapist (maybe invites to software).
6. Status updated through timeline.

---

### 1.6 Admin – Credential Verification Journey

1. Admin logs into admin panel.
2. Navigates to **“Credentials – Pending”** list.
3. Clicks an item:
   - Sees therapist profile summary + uploaded document.
4. Admin checks:
   - Legibility, plausible institution, dates.
   - For regulated roles, license number if provided.
5. Admin chooses:
   - **“Approve”** → sets Verified, adds optional note, triggers notification to therapist.
   - **“Reject”** → sets Rejected with a short reason (e.g., unreadable, unverifiable).
6. System updates profile badges accordingly.

**Edge cases**

- Suspicious repeated unverified credentials → escalate to manual investigation; possibly freeze publishing until clarified.

---

### 1.7 Admin – Review Moderation Journey (V1+)

1. Admin opens **“Reviews – Pending”**.
2. For each review:
   - Reads text, checks rating, flags for issues.
3. Approve or reject:
   - Approve → visible on therapist profile (with date and maybe partial name).
   - Reject → not shown; optional message to user for why.
4. Track flagged patterns (same IP, repeated content, extreme language).

---

### 1.8 Partner – Lead Handling Journey

1. Partner logs into their portal.
2. On **“My ServiceRequests”** list, sees new items assigned.
3. Clicks one:
   - Sees therapist contact info and service details.
4. Contacts therapist offline.
5. Updates status:
   - New → Contacted → ProposalSent → Completed OR ClosedNoFit.
6. Adds internal notes (not visible to client; some may be visible to therapist).

---

## 2. MVP Scope (Ruthless Prioritization)

### 2.1 MVP – Must-have

**Front-end**

- Basic marketing/home page (copy for therapists & clients).
- Therapist sign-up, login, and profile builder.
- Credential upload and display of verification status.
- Public directory with search and filters (modality, location, remote, language).
- Therapist profile page with credentials, description, and contact form.
- Client contact (lead) form + success page with disclaimers.
- Therapist “admin services” entry points (insurance/pension/tax) with forms.

**Back-end**

- User & auth with roles (Client/Therapist/Admin; Partner optional at MVP).
- Data models described in PRD (Therapist, Credential, Category, Lead, ServiceRequest, Partner).
- Admin panel:
  - List therapists and profiles.
  - Verify credentials.
  - View leads.
  - View and manage ServiceRequests, assign to partners.
- Email notifications for:
  - New therapist sign-up.
  - New lead to therapist.
  - Credential verification result.
- Basic analytics events (signup, publish, lead, ServiceRequest).

**Why:**
- Delivers visible value to both sides.
- Small-team feasible.
- Enables early business conversations with partners (show real funnel).

---

### 2.2 V1+ – Next

- Therapist dashboard (view leads & ServiceRequests, update lead status).
- Reviews system (client → review → moderation → publish).
- Partner portal (limited) to view and update ServiceRequests.
- In-platform messaging (simple thread per lead).
- Better verification flows for regulated licenses (fields, validation).
- More refined filters and search ranking (e.g., “verified first” toggle).

---

### 2.3 Later – Nice-to-have / V2+

- Payment processing and compliant invoicing.
- Lightweight practice management (income view, export to accountant).
- Smart matching & recommendation algorithms.
- Content hub (articles, webinars, FAQs).
- Native mobile apps (iOS/Android).

---

## 3. Roadmap (High-Level)

### Phase 0 – Discovery & Validation (before dev)

- Interviews: 10–15 therapists across modalities & maturity.
- Interviews/calls: 5–10 partners (insurance, pension, tax).
- Landing page for therapist waitlist; small ad test.
- Output: validated problem, clearer pricing expectations, prioritized features.

### Phase 1 – MVP Build (≈8 weeks; web-only)

- Weeks 1–2:
  - Finalize data model & taxonomy.
  - Implement auth + basic profile model.
  - Simple admin panel skeleton.

- Weeks 3–4:
  - Build profile builder UI.
  - Implement credential upload & verification.
  - Build directory and search.

- Weeks 5–6:
  - Implement lead/contact flows.
  - Implement ServiceRequest forms and admin view.
  - Basic analytics and error monitoring.

- Weeks 7–8:
  - Polish UI, handle edge cases.
  - Onboard 10–20 early therapists.
  - Soft-launch with limited marketing.

### Phase 2 – V1+ (≈8–12 weeks after MVP live)

- Therapist dashboard and partner portal.
- Reviews & moderation.
- In-platform messaging.
- Additional metrics dashboards.
- Iterate search & UX based on usage.

### Phase 3 – V2+ (post-PMF)

- Payments & basic accounting.
- More automation for partners.
- Mobile apps.
- Advanced personalization.

---

## 4. Business Model & Pricing

### 4.1 Revenue Streams

#### 4.1.1 Partner Referral Revenue (Primary Early Revenue)

For each **ServiceRequest (Insurance / Pension / Tax)**:

- Platform sends a qualified lead to a licensed partner.
- Possible fee structures (to be negotiated and validated):
  - **Per qualified lead** – fixed fee per lead that meets agreed criteria.
  - **Per closed deal** – fee or revenue share when the therapist signs a policy/engagement.
- Initially focus on:
  - Small group of high-quality partners.
  - Transparent contracts outlining attribution & payment.

Pros:
- Low friction for therapists (they don’t pay for admin help directly).
- High LTV per therapist if multiple services over time.

Cons:
- Need strong partner relationships.
- Requires clear lead quality and tracking to justify fees.

---

#### 4.1.2 Therapist Subscriptions (Freemium → Paid)

Start with **Free** to fill supply, then introduce **Pro** and **Clinic** tiers when value is clear.

**Free tier**
- Public profile with core information.
- Appears in directory & search.
- Receives client leads.
- Can submit admin ServiceRequests.

**Pro tier** (Solo therapist)
- Everything in Free.
- “Verified credentials” badge (after verification).
- Boosted visibility in search (e.g., above non-verified profiles).
- Simple CRM-lite for leads:
  - Mark statuses.
  - Notes & reminders.
- Basic analytics (profile views, leads per period).

**Clinic/Plus tier** (multi-therapist)
- Everything in Pro.
- Multiple therapist profiles under one clinic.
- Shared admin view for leads and ServiceRequests.
- Optional dedicated support (maybe later).

Pricing:  
- Initial **assumptions only**, TBD via interviews:
  - Pro: monthly subscription in low-mid hundreds ₪.
  - Clinic: higher tier with discount per therapist seat.
- Run pricing experiments after MVP traction (landing-page A/B tests, survey-based discrete-choice experiments, then real upgrade behavior).

---

#### 4.1.3 Lead Fees (Optional / Later)

- Optionally, once trust and value are clear, introduce:
  - Pay-per-lead model for certain categories (e.g., high-intent issue-based leads).
- Safeguards:
  - No charge for spam or obviously low-quality leads.
  - Simple dispute resolution.
  - Full transparency: “You pay X ₪ per qualified inquiry from new clients.”

This likely comes **after**:
- Strong evidence that therapists get real value from the leads.
- Clear metrics on lead to booking conversion rates.

---

### 4.2 Funnel & Unit Economics (Conceptual)

#### 4.2.1 Therapist Funnel (Example Hypothesis)

- 100% – therapists who land on site (traffic from marketing).
- 35% – start sign-up.
- 70% of sign-ups – publish a profile (24.5% of total).
- 60% of published profiles – receive ≥1 lead per month once demand is built.
- 20–30% of therapists with leads – create at least one admin ServiceRequest within a year.

These ratios will be measured, not assumed. They’re starting points for planning.

#### 4.2.2 Economics Drivers

- **Revenue per therapist** (over a year) could include:
  - Subscription ARPU (if Pro/Plus).
  - Portion of partner referral revenue attributed to that therapist’s admin services.

- **Revenue per partner**:
  - Completed ServiceRequests leading to policies/engagements × referral rate.

- **Key levers:**
  - Therapist acquisition cost (T-CAC): ads, events, outreach.
  - Partner acquisition & retention cost.
  - Conversion rate from ServiceRequest → closed partner deal.

Aim:  
- Achieve **LTV (therapist)** at least **3–5× therapist acquisition cost**.
- Develop repeatable playbook: more therapists → more leads → more ServiceRequests → more partner revenue.

---

### 4.3 Pricing & Validation Plan

- **Therapist side:**
  - Use interviews and surveys to test willingness to pay for:
    - Trust-building (verification, badges).
    - Visibility (boosted search ranking).
    - Admin convenience (bundled services, simple dashboard).
  - Launch with promotional or free Pro for early adopters; measure upgrade behavior when pricing introduces.

- **Partner side:**
  - Use calls and pilots to find:
    - Acceptable fee-per-lead or % of closed deal.
    - Minimum lead quality standards partners require.
  - Focus on 2–3 strong partners in each vertical and grow from there.

- Iterate models with real data:
  - If partner revenue is strong and stable → therapist pricing can stay lower.
  - If partner revenue is limited → more value must be packaged in therapist subscriptions.

---
