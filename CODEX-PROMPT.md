# TherapistOS - Codex Development Prompt

## Project Context

You are working on **TherapistOS**, a Hebrew-first, RTL-optimized two-sided marketplace platform for alternative therapists in Israel. This project follows the **BMAD-METHOD** (Breakthrough Method of Agile AI-Driven Development) for systematic, structured development.

### Project Goals (90 Days)
- 📊 **200 therapists** onboarded
- 📊 **1,000 client leads** generated
- 💰 **30+ partner conversions** (insurance/pension/tax services)
- 💰 **50+ paid subscriptions**

### Tech Stack
- **Frontend:** Next.js 16, React 19, TypeScript 5.9
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Better Auth (email/password + phone OTP for Israeli market)
- **AI:** OpenRouter (NOT OpenAI) for Hebrew message drafting
- **UI:** shadcn/ui + Tailwind CSS 4 (RTL configured)
- **File Storage:** Vercel Blob (production) / local filesystem (dev)
- **Package Manager:** pnpm

---

## 🎯 Your Mission

### Phase 1: Complete Project Documentation (Current Phase)
Generate comprehensive, production-ready documentation following BMAD methodology:

1. **Architecture Documentation** (ALREADY COMPLETE ✅)
   - Database schema with 14 tables defined
   - Authentication & authorization strategy
   - API routes structure
   - Security patterns

2. **Shard Documents** (TODO)
   - Break down `docs/prd.md` into Epic-specific files (Epic 1-5)
   - Break down `docs/architecture.md` into section-specific files
   - Create detailed implementation guides per Epic

3. **Story Generation** (TODO)
   - Use Scrum Master (SM) role to create user stories
   - Generate YAML story files in `docs/stories/`
   - Include tasks, acceptance criteria, tech specs

### Phase 2: Development Loop (Next Phase)
Once documentation is complete, begin structured development cycle:
- **SM** → Create next story from Epic
- **Dev** → Implement story with tests
- **QA** → Review and validate implementation

---

## 📁 Project Structure

```
TherapistOS/
├── .bmad-core/                      # BMAD agents & framework (67 files)
│   ├── agents/                      # PM, Architect, Dev, QA, SM agents
│   └── tasks/                       # BMAD task commands
├── .claude/commands/BMad/           # Claude Code BMAD integration
├── v0-ui-work/                      # V0 UI reference (DO NOT MODIFY)
├── docs/
│   ├── CLAUDE.md                    # Complete project instructions
│   ├── READY.md                     # Development readiness guide
│   ├── architecture.md              # System architecture (DONE ✅)
│   ├── prd.md                       # Product Requirements (NEEDS SHARDING)
│   ├── brief.md                     # Product brief
│   ├── user-journeys.md             # User flows
│   ├── prd/                         # Will contain Epic 1-5 shards
│   ├── architecture/                # Will contain architecture sections
│   └── stories/                     # Will contain user story YAML files
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (public)/                # Public routes (no auth)
│   │   ├── (auth)/                  # Auth pages
│   │   ├── (therapist)/             # Therapist-only routes
│   │   ├── (admin)/                 # Admin-only routes
│   │   ├── dashboard/               # ✅ V0 UI integrated
│   │   ├── login/                   # ✅ V0 UI integrated
│   │   ├── signup/                  # ✅ V0 UI integrated
│   │   ├── onboarding/              # ✅ V0 UI integrated
│   │   └── api/                     # API routes
│   ├── components/
│   │   ├── ui/                      # ✅ shadcn/ui components from V0
│   │   ├── dashboard-header.tsx    # ✅ V0 component
│   │   ├── therapist-sidebar.tsx   # ✅ V0 component
│   │   ├── theme-provider.tsx      # ✅ V0 component
│   │   ├── auth/                    # Auth components (TO BE BUILT)
│   │   ├── therapist/               # Therapist-specific (TO BE BUILT)
│   │   ├── directory/               # Public directory (TO BE BUILT)
│   │   └── admin/                   # Admin components (TO BE BUILT)
│   └── lib/
│       ├── auth.ts                  # Better Auth config (EXTEND)
│       ├── schema.ts                # Drizzle schema (EXTEND - 14 tables)
│       ├── rbac.ts                  # Role-based access (CREATE)
│       ├── phone-verification.ts    # OTP service (CREATE)
│       ├── email.ts                 # Email service Hebrew (CREATE)
│       └── env.ts                   # Environment config ✅
└── public/                          # ✅ V0 icons integrated
```

---

## ⚠️ CRITICAL REQUIREMENTS (NON-NEGOTIABLE)

### 1. Hebrew/RTL Support (MANDATORY)
- **ALL UI MUST BE RTL** - set `dir="rtl"` on all layouts and HTML elements
- **Use Tailwind logical properties ONLY:**
  - ✅ CORRECT: `ps-4` `pe-2` `ms-auto` `me-4` (padding/margin-inline-start/end)
  - ❌ WRONG: `pl-4` `pr-2` `ml-auto` `mr-4` (directional properties will break RTL)
- **Heebo font** (Google Fonts) for all Hebrew text (already configured in layout)
- **All user-facing text in Hebrew:** labels, buttons, forms, emails, notifications
- **English ONLY in:** code, comments, technical docs, git commits

**Example:**
```tsx
// ✅ Correct RTL
<div className="ps-4 pe-2 ms-auto flex flex-row text-start" dir="rtl">
  <Button className="me-2">שמור</Button>
</div>

// ❌ Wrong - will break in RTL
<div className="pl-4 pr-2 ml-auto text-left">
  <Button className="mr-2">Save</Button>
</div>
```

### 2. Role-Based Access Control (RBAC)
**Four user roles:**
- **Client** - Browse directory, send leads to therapists
- **Therapist** - Manage profile, leads, bookings, request partner services
- **Admin** - Verify credentials, manage therapists, assign service requests
- **Partner** - View assigned service requests (insurance/pension/tax)

**Implementation pattern:**
```typescript
// Server Component
import { requireRole } from "@/lib/rbac";

export default async function TherapistDashboard() {
  await requireRole("therapist"); // Throws if not authenticated or wrong role
  // ... rest of component
}
```

### 3. Phone Verification (Israeli Market)
- **Format:** +972-XX-XXX-XXXX (Israeli format)
- **OTP verification required** for therapists (not clients)
- **Normalization:** `05XXXXXXXX` → `+972-5X-XXX-XXXX`
- **Implementation:** `lib/phone-verification.ts` (TO BE CREATED in Epic 1)

### 4. File Upload Security
- **Allowed types:** PDF, JPG, PNG ONLY
- **Max size:** 5MB per file
- **Validation:** MIME type + file extension + magic bytes
- **Storage:** Vercel Blob (prod) / local `public/uploads/` (dev)

### 5. AI Integration
- **Provider:** OpenRouter (NOT OpenAI directly)
- **Use case:** Hebrew message drafting for therapist-client communication
- **Model:** Use `OPENROUTER_MODEL` from env (default: `openai/gpt-4o-mini`)
- **Always editable:** AI drafts MUST be reviewable before sending

**Example:**
```typescript
import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

const { text } = await generateText({
  model: openrouter(process.env.OPENROUTER_MODEL!),
  system: "אתה עוזר לכתיבת הודעות בעברית למטפלים...",
  prompt: "צור הודעת תזכורת לפגישה...",
});
```

### 6. Privacy & Compliance
- **NO medical records storage** - this is a business platform, not a health system
- **Privacy disclaimers everywhere:** "This is not medical advice or emergency service"
- **GDPR/Israel Privacy Law compliance:** consent, data minimization, right to deletion
- **Audit logs:** track sensitive operations (credential verification, data exports)

---

## 📊 Database Schema (14 Tables)

### Core Tables (Epic 1)
1. **user** - Extend existing Better Auth table
   - Add: `role`, `phone`, `phoneVerified`, `locale`

### Therapist Tables (Epic 2)
2. **therapistProfile** - Public therapist info with SEO slug
3. **modality** - Treatment types (e.g., "דיקור סיני", "אוסטאופתיה")
4. **therapistModality** - Many-to-many junction
5. **issue** - Problems treated (e.g., "חרדה", "כאבי גב")
6. **therapistIssue** - Many-to-many junction
7. **credential** - Diplomas/certifications with admin verification

### Lead & Booking Tables (Epic 3-4)
8. **lead** - Client inquiries with status tracking
9. **booking** - Appointments with reminders

### Partner Tables (Epic 5)
10. **serviceRequest** - Insurance/pension/tax requests
11. **partner** - Service providers (insurance agents, accountants)

### V1+ Tables (Future)
12. **groupEvent** - Group sessions/workshops
13. **groupEventAttendee** - Registration tracking
14. **review** - Client feedback with moderation

**Full schema details:** See `docs/architecture.md` section 1

---

## 🏗️ Epic Breakdown (6 Weeks)

### Epic 1: Foundation & Auth (Week 1)
**Goal:** Database foundation, authentication, RBAC

**Stories to create:**
1. Extend user table with role + phone fields
2. Implement RBAC utilities (`requireRole`, `hasRole`)
3. Create phone OTP verification service
4. Update layouts for Hebrew/RTL (DONE ✅)
5. Create role-based dashboard routing

**Files to implement:**
- `src/lib/schema.ts` - Add fields to user table
- `src/lib/rbac.ts` - RBAC utilities
- `src/lib/phone-verification.ts` - OTP service
- `src/app/(therapist)/layout.tsx` - Therapist layout with RBAC
- `src/app/(admin)/layout.tsx` - Admin layout with RBAC

### Epic 2: Profiles & Directory (Week 2)
**Goal:** Therapist profile creation, public directory, SEO

**Stories:**
1. Implement therapist profile schema (with modalities, issues)
2. Build profile builder UI (multi-step form in Hebrew)
3. Credential upload with validation
4. Public directory with search/filters
5. SEO-optimized therapist profile pages (`/t/[slug]`)

**Files:**
- `src/lib/schema.ts` - Add profile, modality, issue tables
- `src/components/therapist/profile-form/` - Multi-step form
- `src/app/(public)/directory/page.tsx` - Directory with search
- `src/app/(public)/t/[slug]/page.tsx` - Public profile (SSR for SEO)

### Epic 3: Leads & CRM (Week 3)
**Goal:** Lead capture, therapist inbox, notifications

**Stories:**
1. Implement lead model with status workflow
2. Build lead capture form (modal on profile page)
3. Create therapist lead inbox
4. Email notifications in Hebrew
5. Anti-spam protection (rate limiting, CAPTCHA)

**Files:**
- `src/lib/schema.ts` - Add lead table
- `src/components/directory/contact-modal.tsx` - Lead form
- `src/components/therapist/lead-inbox/` - Inbox UI
- `src/lib/email.ts` - Email service with Hebrew templates
- `src/app/api/leads/create/route.ts` - Lead creation API

### Epic 4: Bookings & AI (Week 4)
**Goal:** Booking system, AI message drafting, reminders

**Stories:**
1. Implement booking model
2. Build booking calendar UI
3. AI message drafting (Hebrew)
4. Automated reminders (email/SMS)
5. Booking status management

**Files:**
- `src/lib/schema.ts` - Add booking table
- `src/app/api/ai/message-draft/route.ts` - AI drafting
- `src/components/therapist/booking-form.tsx` - Booking UI
- `src/lib/reminders.ts` - Reminder service

### Epic 5: Referrals & Admin (Weeks 5-6)
**Goal:** Service requests, admin verification, partner management

**Stories:**
1. Implement serviceRequest model
2. Build admin credential verification queue
3. Create partner management
4. Analytics dashboard
5. Service request assignment workflow

**Files:**
- `src/lib/schema.ts` - Add serviceRequest, partner tables
- `src/app/(admin)/credentials/page.tsx` - Verification queue
- `src/app/(admin)/service-requests/page.tsx` - Request management
- `src/components/admin/` - Admin components

---

## 🔄 BMAD Development Workflow

### Current Status
- ✅ **Architecture Complete** - `docs/architecture.md` created
- ✅ **V0 UI Integrated** - UI components in `src/app/` and `src/components/`
- ⏳ **Ready to shard documents** - Next step below

---

### Step-by-Step BMAD Process

#### **STEP 1: Document Sharding** (DO THIS FIRST)

Break down large documents into Epic-specific sections for easier reference during development.

**Command 1: Shard PRD**
```
Task: Shard the PRD document into Epic-specific files

Read the file: docs/prd.md

Create 5 new files in docs/prd/ directory:
- docs/prd/epic-1-foundation-auth.md
- docs/prd/epic-2-profiles-directory.md
- docs/prd/epic-3-leads-crm.md
- docs/prd/epic-4-bookings-ai.md
- docs/prd/epic-5-referrals-admin.md

Each file should contain:
1. Epic title and overview
2. User stories from that Epic
3. Acceptance criteria
4. Technical requirements
5. Dependencies on previous Epics
6. Success metrics

Use clear markdown formatting with Hebrew text where applicable.
```

**Command 2: Shard Architecture**
```
Task: Shard the architecture document into section-specific files

Read the file: docs/architecture.md

Create files in docs/architecture/ directory:
- docs/architecture/01-database-schema.md (full table definitions)
- docs/architecture/02-authentication-authorization.md (auth strategy + RBAC)
- docs/architecture/03-api-routes.md (all API endpoints)
- docs/architecture/04-rtl-hebrew-strategy.md (internationalization)
- docs/architecture/05-file-storage.md (upload handling)
- docs/architecture/06-email-notifications.md (email templates)
- docs/architecture/07-ai-integration.md (OpenRouter setup)
- docs/architecture/08-component-architecture.md (UI patterns)
- docs/architecture/09-security.md (security requirements)
- docs/architecture/10-performance-seo.md (optimization strategy)

Each file should be detailed, code-complete, and reference specific implementation files.
```

---

#### **STEP 2: Story Creation** (Scrum Master Role)

For each Epic, create detailed user stories in YAML format.

**Command: Create Next Story**
```
Task: Create the next user story for Epic 1

Context:
- Epic: Epic 1 - Foundation & Auth
- Reference: docs/prd/epic-1-foundation-auth.md
- Architecture: docs/architecture/02-authentication-authorization.md

Create a YAML file: docs/stories/epic-1-story-1-extend-user-table.yaml

Include:
1. Story metadata (ID, title, Epic, priority)
2. User story ("As a... I want... So that...")
3. Tasks (specific implementation steps)
4. Acceptance criteria (testable conditions)
5. Technical specs (files to create/modify, dependencies)
6. Test requirements
7. Definition of Done checklist

Follow this structure:
---
story:
  id: "1.1"
  epic: "Epic 1 - Foundation & Auth"
  title: "Extend user table with role and phone fields"
  priority: "P0"
  estimatedHours: 4

userStory: |
  As a platform administrator
  I want to extend the user table with role and phone verification fields
  So that we can implement role-based access control and Israeli phone verification

tasks:
  - id: "1.1.1"
    description: "Update user table schema in src/lib/schema.ts"
    files: ["src/lib/schema.ts"]
  - id: "1.1.2"
    description: "Generate and run database migration"
    files: ["drizzle/migrations/*"]
  - id: "1.1.3"
    description: "Update TypeScript types"
    files: ["src/lib/schema.ts"]

acceptanceCriteria:
  - "User table includes role field (client, therapist, admin, partner)"
  - "User table includes phone and phoneVerified fields"
  - "User table includes locale field (default: 'he')"
  - "Database migration runs successfully"
  - "TypeScript types are correct"

technicalSpecs:
  database:
    - "Add role ENUM column"
    - "Add phone VARCHAR(20) column"
    - "Add phoneVerified BOOLEAN column"
    - "Add locale VARCHAR(5) column"

  dependencies:
    - "Drizzle ORM installed"
    - "PostgreSQL database configured"

tests:
  - "Unit test: Schema validation"
  - "Integration test: Database migration"
  - "Type check passes"

definitionOfDone:
  - "[ ] Code written and reviewed"
  - "[ ] Tests pass"
  - "[ ] Migration runs successfully"
  - "[ ] TypeScript compiles without errors"
  - "[ ] Code committed to git"
  - "[ ] Story marked complete"
---
```

**Repeat for all stories in Epic 1:**
- Story 1.1: Extend user table
- Story 1.2: Implement RBAC utilities
- Story 1.3: Create phone OTP service
- Story 1.4: Create role-based layouts
- Story 1.5: Update auth flow for phone verification

---

#### **STEP 3: Development** (Developer Role)

Implement each story following the YAML specification.

**Command: Implement Story**
```
Task: Implement Story 1.1 - Extend user table

Reference: docs/stories/epic-1-story-1-extend-user-table.yaml

Steps:
1. Read the story YAML file
2. Understand all tasks and acceptance criteria
3. Implement each task:
   - Update src/lib/schema.ts
   - Generate migration: pnpm db:generate
   - Review migration file
   - Run migration: pnpm db:migrate
4. Verify acceptance criteria
5. Run tests: pnpm lint && pnpm typecheck
6. Commit with message:
   feat(auth): extend user table with role and phone fields

   - Add role ENUM (client, therapist, admin, partner)
   - Add phone VARCHAR(20) for Israeli phone numbers
   - Add phoneVerified BOOLEAN
   - Add locale VARCHAR(5) default 'he'

   Closes #1.1
7. Update story YAML: status: "completed"
```

**Development Guidelines:**
- **TypeScript strict mode** - no `any`, proper types
- **ESLint clean** - run `pnpm lint` after changes
- **Functional components** - use hooks, no class components
- **Server Components by default** - only use 'use client' when necessary
- **Error handling** - try/catch for async, proper error boundaries
- **Hebrew text** - all user-facing strings in Hebrew

---

#### **STEP 4: QA Review** (QA Role)

Review implementation for quality, security, and adherence to requirements.

**Command: Review Story**
```
Task: Review Story 1.1 implementation

Reference: docs/stories/epic-1-story-1-extend-user-table.yaml

Review checklist:
1. Code Quality
   - [ ] TypeScript types correct
   - [ ] No ESLint warnings
   - [ ] Code follows project conventions
   - [ ] No hardcoded values (use constants)

2. Functionality
   - [ ] All tasks completed
   - [ ] Acceptance criteria met
   - [ ] Database migration successful
   - [ ] No breaking changes

3. Security
   - [ ] No sensitive data exposed
   - [ ] Input validation present
   - [ ] SQL injection prevention (Drizzle parameterization)

4. Testing
   - [ ] Tests written and passing
   - [ ] Edge cases covered
   - [ ] Error cases handled

5. Documentation
   - [ ] Code comments for complex logic
   - [ ] README updated if needed
   - [ ] Story marked complete

Create review report:
- Pass ✅ / Needs fixes ⚠️ / Fail ❌
- List any issues found
- Recommendations for improvement
```

---

#### **STEP 5: Repeat**

Continue Step 2-4 for all stories in Epic 1, then move to Epic 2-5.

**Progress tracking:**
- Epic 1: Stories 1.1 → 1.2 → 1.3 → 1.4 → 1.5
- Epic 2: Stories 2.1 → 2.2 → 2.3 → 2.4 → 2.5
- Epic 3: Stories 3.1 → 3.2 → 3.3 → 3.4 → 3.5
- Epic 4: Stories 4.1 → 4.2 → 4.3 → 4.4 → 4.5
- Epic 5: Stories 5.1 → 5.2 → 5.3 → 5.4 → 5.5

---

## 🔧 Development Commands

**Setup (ONE TIME):**
```bash
cd TherapistOS
pnpm install              # Install all dependencies
```

**Development (UI PREVIEW - NO DATABASE NEEDED):**
```bash
pnpm dev                  # Start dev server on http://localhost:3000
                          # V0 UI will be visible immediately
                          # Auth/database features won't work until .env configured
```

**Full Development (AFTER .env.local CONFIGURED):**
```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Run migrations
pnpm db:migrate

# 3. Start dev server
pnpm dev

# 4. Open http://localhost:3000
```

**Database Operations:**
```bash
pnpm db:generate          # Generate migration from schema changes
pnpm db:migrate           # Run pending migrations
pnpm db:push              # Push schema directly (dev only)
pnpm db:studio            # Open Drizzle Studio GUI
```

**Quality Checks (RUN AFTER EVERY CHANGE):**
```bash
pnpm lint                 # ESLint
pnpm typecheck            # TypeScript
pnpm check                # Both lint + typecheck
```

**Git Workflow:**
```bash
git checkout -b feature/epic-1-story-1
# ... make changes ...
pnpm check                # Must pass before commit
git add .
git commit -m "feat(auth): extend user table with role and phone"
git push origin feature/epic-1-story-1
```

---

## 📚 Key Reference Files

**Essential Reading:**
1. **[CLAUDE.md](CLAUDE.md)** - Complete project instructions (must read!)
2. **[READY.md](READY.md)** - Development readiness checklist
3. **[docs/architecture.md](docs/architecture.md)** - System architecture
4. **[docs/prd.md](docs/prd.md)** - Product requirements

**BMAD Framework:**
- **.bmad-core/agents/** - Agent role definitions (SM, Dev, QA, etc.)
- **.bmad-core/tasks/** - Task templates and workflows
- **.bmad-core/templates/story-tmpl.yaml** - Story YAML template

**V0 UI Reference:**
- **v0-ui-work/** - Original V0 generated code (DO NOT MODIFY)
- **src/app/** - Integrated V0 pages (EXTEND AS NEEDED)
- **src/components/** - Integrated V0 components (EXTEND AS NEEDED)

---

## ⚠️ Common Pitfalls to Avoid

1. ❌ Using `pl-4` instead of `ps-4` (breaks RTL)
2. ❌ Forgetting `dir="rtl"` on layouts
3. ❌ Storing medical records (privacy violation)
4. ❌ Missing RBAC checks on protected routes
5. ❌ Not validating file uploads (security risk)
6. ❌ Hardcoding English text (must be Hebrew)
7. ❌ Missing privacy disclaimers (legal requirement)
8. ❌ Skipping phone verification for therapists
9. ❌ Using OpenAI directly instead of OpenRouter
10. ❌ Breaking BMAD workflow (always follow SM → Dev → QA)

---

## 🎬 Getting Started (YOUR IMMEDIATE NEXT STEPS)

### Phase 1: Documentation Completion

**TASK 1: Shard PRD Document**
```
Read docs/prd.md and create 5 Epic-specific files in docs/prd/ directory.
Each file should extract the relevant sections for that Epic with full details.
```

**TASK 2: Shard Architecture Document**
```
Read docs/architecture.md and create 10 section-specific files in docs/architecture/ directory.
Each file should be detailed, code-complete, and implementation-ready.
```

**TASK 3: Create First Story (Epic 1, Story 1)**
```
Create docs/stories/epic-1-story-1-extend-user-table.yaml following the YAML template above.
This will be the first story to implement in the development phase.
```

**TASK 4: Create Remaining Epic 1 Stories**
```
Create stories 1.2 through 1.5 for Epic 1 in YAML format.
```

Once documentation is complete, we'll begin the development loop:
**SM → Dev → QA** for each story.

---

## 📞 Questions & Clarifications

**If you need clarification on:**
- Hebrew translations → Ask for specific text
- RBAC implementation → Refer to docs/architecture/02-authentication-authorization.md
- Database schema → Refer to docs/architecture/01-database-schema.md
- UI patterns → Check v0-ui-work/ for reference
- BMAD process → Read .bmad-core/agents/*.md

**Environment Setup:**
- Can run `pnpm dev` immediately without .env (UI preview mode)
- Full functionality requires .env.local with database credentials
- See .env.example for required variables

---

## ✅ Success Criteria

**Documentation Phase Complete When:**
- [ ] All PRD sections sharded into Epic files
- [ ] All architecture sections sharded into topic files
- [ ] All Epic 1 stories created in YAML format
- [ ] Story templates validated and consistent
- [ ] Ready to begin development loop

**Epic 1 Complete When:**
- [ ] User table extended with role + phone fields
- [ ] RBAC utilities implemented and tested
- [ ] Phone OTP verification service working
- [ ] Role-based layouts created
- [ ] Auth flow updated for phone verification
- [ ] All tests passing
- [ ] All code reviewed and approved

**Project Complete When:**
- [ ] All 5 Epics implemented
- [ ] 200+ therapists onboarded
- [ ] 1,000+ leads generated
- [ ] Revenue-generating features live
- [ ] Platform stable and scalable

---

## 🚀 Ready to Begin!

Start with **TASK 1: Shard PRD Document** above and work systematically through the documentation phase. Follow the BMAD methodology strictly for consistent, high-quality results.

**Remember:**
- Hebrew-first, RTL everywhere
- RBAC on all protected routes
- Privacy and security by design
- Follow BMAD workflow: SM → Dev → QA
- Quality over speed - do it right the first time

**Good luck building TherapistOS!** 🇮🇱
