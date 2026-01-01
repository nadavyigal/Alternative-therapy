# Authentication & Authorization

## Overview
TherapistOS uses Better Auth for email/password authentication, with a therapist-only phone OTP verification step. Role-based access control (RBAC) gates protected pages and API routes.

## Implementation files
- `src/lib/auth.ts` - Better Auth server configuration
- `src/lib/auth-client.ts` - Client session hooks
- `src/lib/schema.ts` - User table extensions
- `src/lib/rbac.ts` - RBAC helpers
- `src/lib/phone-verification.ts` - OTP utilities
- `src/app/(therapist)/layout.tsx` - Therapist route guard
- `src/app/(admin)/layout.tsx` - Admin route guard

## Auth flow
1. Therapists can sign up with email/password or Google/Facebook; clients use email/password.
2. Role defaults to `client` (or is assigned to `therapist` during onboarding).
3. Therapist users complete phone OTP verification before profile publish.
4. Sessions are managed by Better Auth and persisted via the `session` table.

## RBAC utilities
`src/lib/rbac.ts` exposes helpers that are used in server components and API routes.

```ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole = "client" | "therapist" | "admin" | "partner";

export async function requireRole(
  role: UserRole | UserRole[],
  options?: { redirectTo?: string }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const allowedRoles = Array.isArray(role) ? role : [role];
  const sessionRole = session?.user?.role as UserRole | undefined;

  if (!session?.user || !sessionRole || !hasRole(sessionRole, allowedRoles)) {
    if (options?.redirectTo) {
      redirect(options.redirectTo);
    }

    throw new Error("UNAUTHORIZED");
  }

  return session;
}

export function hasRole(userRole: UserRole | undefined, allowed: UserRole[]) {
  return Boolean(userRole && allowed.includes(userRole));
}
```

### Layout enforcement
```tsx
// src/app/(therapist)/layout.tsx
import { requireRole } from "@/lib/rbac";

export default async function TherapistLayout({ children }) {
  await requireRole("therapist", { redirectTo: "/login" });
  return <div dir="rtl">{children}</div>;
}
```

## Phone OTP verification
- Required for therapists only.
- Normalize numbers to +972-XX-XXX-XXXX.
- Store phone and `phoneVerified` on the user record.

```ts
export function normalizeIsraeliPhone(input: string) {
  // Example: 05XXXXXXXX -> +972-5X-XXX-XXXX
}
```

### OTP utilities
```ts
export async function sendOtp(phone: string) {
  // Normalize, generate code, store with TTL
}

export async function verifyOtp(phone: string, code: string) {
  // Validate code and expiration
}
```

### Onboarding verification
- Onboarding calls the phone verification endpoints:
  - `POST /api/phone-verification/send`
  - `POST /api/phone-verification/verify`
- Profile publish should be gated on `user.phoneVerified === true`.

## Session access patterns
**Server:**
```ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({ headers: await headers() });
```

**Client:**
```ts
import { useSession } from "@/lib/auth-client";

const { data: session } = useSession();
```
