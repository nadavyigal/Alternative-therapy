# API Routes

## Overview
API routes live under `src/app/api/` and follow Next.js App Router conventions. All protected routes must enforce RBAC via `requireRole`.

## Core endpoints
| Method | Route | Auth | Purpose | File |
| --- | --- | --- | --- | --- |
| POST | `/api/leads/create` | Public | Create a lead from a profile page | `src/app/api/leads/create/route.ts` |
| GET | `/api/leads` | Therapist | List therapist leads | `src/app/api/leads/route.ts` |
| PATCH | `/api/leads/[id]` | Therapist | Update lead status | `src/app/api/leads/[id]/route.ts` |
| POST | `/api/bookings/create` | Therapist | Create booking | `src/app/api/bookings/create/route.ts` |
| PATCH | `/api/bookings/[id]` | Therapist | Update booking status | `src/app/api/bookings/[id]/route.ts` |
| POST | `/api/phone-verification/send` | Auth | Send phone OTP | `src/app/api/phone-verification/send/route.ts` |
| POST | `/api/phone-verification/verify` | Auth | Verify phone OTP | `src/app/api/phone-verification/verify/route.ts` |
| POST | `/api/ai/message-draft` | Therapist | Generate AI draft (Hebrew) | `src/app/api/ai/message-draft/route.ts` |
| POST | `/api/uploads/credential` | Therapist | Upload credential file | `src/app/api/uploads/credential/route.ts` |
| POST | `/api/service-requests/create` | Therapist | Create partner referral | `src/app/api/service-requests/create/route.ts` |
| GET | `/api/admin/credentials` | Admin | Review credential queue | `src/app/api/admin/credentials/route.ts` |
| PATCH | `/api/admin/credentials/[id]` | Admin | Approve/reject credential | `src/app/api/admin/credentials/[id]/route.ts` |
| GET | `/api/admin/referrals` | Admin | List referrals | `src/app/api/admin/referrals/route.ts` |
| PATCH | `/api/admin/referrals/[id]` | Admin | Update referral status | `src/app/api/admin/referrals/[id]/route.ts` |

## Request/response examples

### Create lead
```json
POST /api/leads/create
{
  "therapistProfileId": "uuid",
  "clientName": "דנה לוי",
  "clientPhone": "+972-52-123-4567",
  "message": "אשמח לקבוע פגישה"
}
```

```json
{
  "id": "uuid",
  "status": "new"
}
```

### AI message draft
```json
POST /api/ai/message-draft
{
  "intent": "lead_reply",
  "context": {
    "clientName": "דנה",
    "requestedTime": "2025-01-12T10:00:00Z"
  }
}
```

```json
{
  "text": "היי דנה, תודה שפנית..."
}
```

## Routing conventions
- Public routes (no auth) live under `(public)` pages and public APIs.
- Therapist/admin APIs must call `requireRole` inside route handlers.
- All inputs are validated server-side (Zod or equivalent).
