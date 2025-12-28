# TherapistOS - Project Instructions for Claude Code & BMAD Agents

## Project Overview

**TherapistOS** is a two-sided marketplace platform for alternative therapists in Israel.

**Type:** Hebrew-first, mobile-optimized web platform
**Target Market:** Israel alternative/complementary therapy practitioners
**Tech Stack:** Next.js 16, React 19, TypeScript, PostgreSQL, Drizzle ORM, Better Auth
**Development Method:** BMAD-METHOD (Breakthrough Method of Agile AI-Driven Development)
**Goal (90 days):** 200 therapists onboarded, 1,000 client leads, first revenue

---

## ⚠️ CRITICAL REQUIREMENTS

### 1. Hebrew/RTL Support (MANDATORY)
- **ALL** UI must be RTL (Right-to-Left)
- Set `dir="rtl"` on all layouts and HTML elements
- Use Tailwind **logical properties** ONLY:
  - ✅ `ps-4` `pe-2` (padding-inline-start/end)
  - ✅ `ms-auto` `me-4` (margin-inline-start/end)
  - ❌ NEVER use `pl-4`, `pr-2`, `ml-auto`, `mr-4`
- **Heebo font** (Google Fonts) for all Hebrew text
- **All labels, buttons, forms, emails in Hebrew**
- English only in code, comments, and technical docs

### 2. Role-Based Access Control (RBAC)
**Four user roles:**
- **Client** - Browse directory, send leads
- **Therapist** - Manage profile, leads, bookings, request services
- **Admin** - Verify credentials, manage therapists, assign service requests
- **Partner** - View assigned service requests (V1+)

**Implementation:**
```typescript
import { requireRole } from "@/lib/rbac";
const session = await requireRole("therapist");
```

### 3. Phone Verification (Israeli Market)
- **Format:** +972-XX-XXX-XXXX
- OTP verification required for therapists
- Normalize: `05XXXXXXXX` → `+972-5X-XXX-XXXX`
- Implemented in `lib/phone-verification.ts`

### 4. File Upload Security
- **Allowed:** PDF, JPG, PNG only
- **Max size:** 5MB per file
- **Storage:** Vercel Blob (production) / local (dev)

### 5. AI Integration
- **Provider:** OpenRouter (NOT OpenAI directly)
- **Use case:** Hebrew message drafting
- **Model:** Use `OPENROUTER_MODEL` from env
- **Always editable** - drafts must be reviewable

### 6. Privacy & Compliance
- **NO medical records storage**
- **Disclaimers everywhere:** "This is not medical/emergency service"
- GDPR/Israel Privacy Law compliance

---

## Tech Stack (from Boilerplate)

- **Framework**: Next.js 16 with App Router, React 19, TypeScript 5.9
- **AI**: Vercel AI SDK 5 + OpenRouter (100+ models)
- **Auth**: Better Auth with Email/Password + Phone OTP (extended)
- **Database**: PostgreSQL + Drizzle ORM
- **UI**: shadcn/ui + Tailwind CSS 4 + RTL support
- **File Storage**: Vercel Blob / local filesystem
- **Package Manager**: pnpm

---

## Project Structure

```
TherapistOS/
├── .bmad-core/                      # BMAD agents & framework
│   ├── agents/                      # PM, Architect, Dev, QA, SM, etc.
│   └── tasks/                       # BMAD task commands
├── .claude/commands/BMad/           # Claude Code BMAD commands
│   ├── agents/                      # /analyst, /architect, /dev, /sm, /qa
│   └── tasks/                       # /shard-doc, /create-next-story
├── v0-ui-work/                      # V0-generated UI (reference)
│   ├── app/
│   ├── components/
│   └── lib/
├── docs/
│   ├── brief.md                     # Product brief
│   ├── prd.md                       # Full PRD
│   ├── user-journeys.md             # User flows
│   ├── architecture.md              # System architecture
│   ├── prd/                         # Sharded Epic files
│   ├── architecture/                # Sharded architecture sections
│   └── stories/                     # User stories (YAML)
├── src/
│   ├── app/
│   │   ├── (public)/                # Public routes (no auth)
│   │   ├── (auth)/                  # Auth pages
│   │   ├── (therapist)/             # Therapist-only routes
│   │   ├── (admin)/                 # Admin-only routes
│   │   └── api/
│   ├── components/
│   │   ├── auth/                    # From boilerplate
│   │   ├── therapist/               # Therapist-specific
│   │   ├── directory/               # Public directory
│   │   ├── admin/                   # Admin components
│   │   └── ui/                      # shadcn/ui
│   └── lib/
│       ├── auth.ts                  # Better Auth (extended)
│       ├── schema.ts                # Drizzle schema (EXTENDED)
│       ├── rbac.ts                  # Role-based access
│       ├── phone-verification.ts    # OTP service
│       └── email.ts                 # Email (Hebrew)
└── public/
    └── uploads/                     # Local file storage
```

---

## Database Schema Extensions

### Extend Existing User Table
```typescript
export const user = pgTable("user", {
  // ... existing Better Auth fields
  role: text("role", {
    enum: ["client", "therapist", "admin", "partner"]
  }).notNull().default("client"),
  phone: text("phone"),
  phoneVerified: boolean("phone_verified").default(false),
  locale: text("locale").default("he"),
});
```

### New Tables (13 total)
1. **therapistProfile** - Public info with slug for SEO
2. **modality** - Treatment types (Hebrew/English)
3. **therapistModality** - Many-to-many
4. **issue** - Problems treated (חרדה, כאבי גב)
5. **therapistIssue** - Many-to-many
6. **credential** - Diplomas with verification
7. **lead** - Client inquiries with status
8. **booking** - Appointments with reminders
9. **serviceRequest** - Insurance/pension/tax
10. **partner** - Service providers
11. **groupEvent** - Group sessions (V1+)
12. **groupEventAttendee** - Registration (V1+)
13. **review** - Client feedback (V1+)

**Full schema:** See `docs/architecture/database-schema.md` (after /architect)

---

## Epic Breakdown (6 Weeks)

### Epic 1: Foundation & Auth (Week 1)
- Extend user table (role, phone)
- Phone OTP verification
- RBAC utilities
- Auth UI, basic dashboards

**Files:** `schema.ts`, `rbac.ts`, `phone-verification.ts`

### Epic 2: Profiles & Directory (Week 2)
- Therapist profile model
- Profile builder UI (Hebrew)
- Credential upload
- Public directory, SEO profiles

**Files:** `components/therapist/`, `app/(public)/t/[slug]/`

### Epic 3: Leads & CRM (Week 3)
- Lead model with status
- Lead capture form
- Lead inbox, email notifications

**Files:** `components/directory/contact-modal.tsx`, `lib/email.ts`

### Epic 4: Bookings & AI (Week 4)
- Booking model, reminders
- AI message drafting (Hebrew)
- Booking calendar

**Files:** `app/api/ai/message-draft/`, `lib/reminders.ts`

### Epic 5: Referrals & Admin (Weeks 5-6)
- ServiceRequest model
- Admin verification queue
- Partner assignment, analytics

**Files:** `app/(admin)/credentials/`, `app/(admin)/service-requests/`

---

## BMAD-METHOD Workflow (Cursor-Only)

**You are working within BMAD-METHOD. Follow strictly:**

### Phase 1: Architecture (One-Time)
```
/architect
Design complete system architecture based on docs/prd.md:
- Database schema (14 tables)
- API routes
- Auth + RBAC
- RTL/Hebrew strategy
- File storage
- Email templates
- AI integration

Save to docs/architecture.md
```

### Phase 2: Document Sharding
```
/bmad-master
*shard-doc docs/prd.md prd
```
→ Creates Epic 1-5 files

```
/bmad-master
*shard-doc docs/architecture.md architecture
```
→ Creates architecture sections

### Phase 3: Development Cycle
**For each Epic:**

**Step 1: Story Creation**
```
/sm
*create-next-story
```
→ Creates story YAML in `docs/stories/`

**Step 2: Implementation**
```
/dev
[Provide story file path]
```
→ Implements, tests, commits

**Step 3: Review (Optional)**
```
/qa
[Provide story file path]
```
→ Reviews, suggests improvements

**Repeat** for all stories in Epic, then next Epic.

---

## Environment Variables

```env
# Database
POSTGRES_URL="postgresql://..."

# Auth
BETTER_AUTH_SECRET="32-char-random"

# AI (Hebrew messages)
OPENROUTER_API_KEY="sk-or-v1-..."
OPENROUTER_MODEL="openai/gpt-4o-mini"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# File Storage (optional)
BLOB_READ_WRITE_TOKEN=""

# Email (optional)
RESEND_API_KEY=""

# SMS for OTP (optional, can mock)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
```

---

## Available Scripts (from Boilerplate)

```bash
pnpm dev          # Start dev (DON'T run - ask user)
pnpm build        # Build (runs db:migrate first)
pnpm lint         # ALWAYS run after changes
pnpm typecheck    # ALWAYS run after changes
pnpm db:generate  # Generate migrations
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema
pnpm db:studio    # Database GUI
```

---

## Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint - fix all warnings
- Prettier - auto-format
- Functional components with hooks
- Server Components by default

### Naming
- **Files:** kebab-case (`user-profile.tsx`)
- **Components:** PascalCase (`UserProfile`)
- **Functions:** camelCase (`getUserById`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

### Git Workflow
- **Branch:** `feature/epic-X-story-Y`
- **Commit:**
  ```
  feat(auth): add phone OTP for Israeli market

  - Implement normalizeIsraeliPhone()
  - Create verify-phone page
  - Add SMS via Twilio

  Closes #1.2
  ```

### Hebrew/RTL Rules
```tsx
// ✅ Correct
<div className="ps-4 pe-2 ms-auto" dir="rtl">
<div className="flex flex-row text-start">

// ❌ Wrong
<div className="pl-4 pr-2 ml-auto">
<div className="text-left">
```

---

## CRITICAL BOILERPLATE RULES

### 1. ALWAYS run after changes:
```bash
pnpm lint && pnpm typecheck
```

### 2. NEVER start dev server yourself
Ask user to provide output if needed.

### 3. Use OpenRouter, NOT OpenAI
```typescript
// ✅ Correct
import { openrouter } from "@openrouter/ai-sdk-provider";

// ❌ Wrong
import { openai } from "@ai-sdk/openai";
```

### 4. Auth Pattern
**Server:**
```typescript
import { auth } from "@/lib/auth";
const session = await auth.api.getSession({ headers: await headers() });
```

**Client:**
```typescript
import { useSession } from "@/lib/auth-client";
const { data: session } = useSession();
```

### 5. Database Pattern
```typescript
import { db } from "@/lib/db";
import { user } from "@/lib/schema";

await db.select().from(user);
```

### 6. File Storage
```typescript
import { upload, deleteFile } from "@/lib/storage";

const result = await upload(buffer, "file.png", "folder");
await deleteFile(result.url);
```

---

## Common Tasks

**Add protected route:**
```typescript
// app/(therapist)/dashboard/page.tsx
import { requireRole } from "@/lib/rbac";

export default async function DashboardPage() {
  await requireRole("therapist");
  return <div dir="rtl">...</div>;
}
```

**Database changes:**
1. Update `schema.ts`
2. `pnpm db:generate`
3. `pnpm db:migrate`

**Add Hebrew AI message:**
```typescript
// app/api/ai/message-draft/route.ts
const { text } = await generateText({
  model: openrouter(process.env.OPENROUTER_MODEL!),
  system: "אתה עוזר לכתיבת הודעות בעברית...",
  prompt: "צור הודעה...",
});
```

---

## Common Pitfalls

1. ❌ Using `pl-4` instead of `ps-4`
2. ❌ Forgetting `dir="rtl"` on layouts
3. ❌ Storing medical records
4. ❌ Missing RBAC checks
5. ❌ Not validating file uploads
6. ❌ Hardcoding English text
7. ❌ Missing privacy disclaimers
8. ❌ Skipping phone verification
9. ❌ Using OpenAI directly
10. ❌ Breaking BMAD workflow

---

## Quick Reference

**BMAD Agents:** `/architect`, `/sm`, `/dev`, `/qa`, `/po`, `/pm`, `/analyst`

**BMAD Tasks:** `*shard-doc`, `*create-next-story`, `*validate-next-story`

**Figma:** https://www.figma.com/make/VXHMl4iyy3KheFrNvV6QVo/Responsive-Web-Platform-UI

**V0 UI Reference:** `v0-ui-work/` folder

---

## 90-Day Goals

- 📊 200 therapists onboarded
- 📊 1,000 client leads
- 💰 30+ partner conversions
- 💰 50+ paid subscriptions

---

## Final Notes

- **Hebrew first, always**
- **Mobile-first design**
- **SEO matters** - therapist profiles must rank
- **Security critical** - uploads, auth, RBAC
- **BMAD workflow mandatory** - SM → Dev → QA
- **Document everything**
- **Test on real devices**
- **Privacy by design** - no medical records

**When in doubt:**
1. Check this CLAUDE.md
2. Read Epic in `docs/prd/`
3. Review `docs/architecture/`
4. Ask `/bmad-orchestrator`
5. Use `/po` for requirements

**Good luck building TherapistOS! 🚀**
