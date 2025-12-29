# Security

## Overview
Security is enforced at the API and UI layers. RBAC, input validation, and safe file handling are required for all sensitive actions.

## Core controls
- RBAC on every protected route (`src/lib/rbac.ts`).
- Server-side validation for all inputs (Zod or equivalent).
- Rate limiting + honeypot for public forms.
- Strict upload validation (type, size, magic bytes).
- No medical records stored (privacy-by-design).

## Sensitive operations
Audit the following actions (minimum):
- Credential verification (admin)
- Data exports
- Referral status changes

## Data protection
- Store only contact + scheduling metadata.
- Avoid storing sensitive health information or treatment details.
- Use environment variables for all secrets (never commit).

## Recommended enforcement points
- Layout guards in `src/app/(therapist)/layout.tsx` and `src/app/(admin)/layout.tsx`.
- API routes in `src/app/api/*`.
- Uploads in `src/app/api/uploads/*` and `src/lib/storage.ts`.
