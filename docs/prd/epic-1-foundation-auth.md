# Epic 1 - Foundation & Auth

## Overview
Establish the authentication foundation, role-based access control, and Israeli phone verification that the rest of the platform depends on.

## Scope
- Extend the Better Auth user table with role, phone, phoneVerified, locale.
- Implement RBAC utilities and enforce them in protected layouts.
- Add therapist-only phone OTP verification flow.
- Add therapist-only social login (Google/Facebook) with role assignment.
- Ensure baseline RTL/Heebo configuration in root layouts.

## User stories
- As a therapist, I can sign up and log in with email so I can access my dashboard.
- As an admin, I can rely on user roles to restrict access to admin tools.
- As a therapist, I can verify my Israeli phone number so my profile can be activated.
- As a client, I can browse public pages without authentication.

## Acceptance criteria
- User can sign up and return to the correct dashboard based on role.
- Therapist can sign up with Google/Facebook; OAuth assigns therapist role; not available to clients.
- Session persists across refresh; logout clears session.
- Role defaults to `client` and can be set to `therapist`, `admin`, `partner`.
- Phone is normalized to +972 format and stored.
- Phone verification is required for therapists before profile publish.
- RBAC blocks unauthorized access (redirect or 403).
- All auth UI strings are Hebrew (e.g., "התחבר", "הרשמה").

## Technical requirements
- Update `src/lib/schema.ts` (Drizzle) with new user fields.
- Add `src/lib/rbac.ts` with `requireRole` and `hasRole`.
- Add `src/lib/phone-verification.ts` with:
  - normalizeIsraeliPhone()
  - sendOtp()
  - verifyOtp()
- Update route group layouts:
  - `src/app/(therapist)/layout.tsx`
  - `src/app/(admin)/layout.tsx`
- Use Better Auth session APIs in `src/lib/auth.ts` and `src/lib/auth-client.ts`.
- Configure Better Auth social providers (Google/Facebook) and env vars; show options only for therapist onboarding.

## Dependencies
- None. This epic is the foundation for all other epics.

## Success metrics
- Signup completion rate (therapists + clients).
- Percentage of therapist accounts with verified phone.
- Zero unauthorized access to protected routes.
