import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export const USER_ROLES = ["client", "therapist", "admin", "partner"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function hasRole(
  userRole: UserRole | null | undefined,
  allowed: UserRole[]
) {
  if (!userRole) {
    return false;
  }

  return allowed.includes(userRole);
}

type RequireRoleOptions = {
  redirectTo?: string;
};

export async function requireRole(
  role: UserRole | UserRole[],
  options?: RequireRoleOptions
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const allowedRoles = Array.isArray(role) ? role : [role];
  const sessionRole = (session?.user as { role?: UserRole } | undefined)?.role;

  if (!session?.user || !hasRole(sessionRole, allowedRoles)) {
    if (options?.redirectTo) {
      redirect(options.redirectTo);
    }

    throw new Error("UNAUTHORIZED");
  }

  return session;
}
