import type { ReactNode } from "react";
import { requireRole } from "@/lib/rbac";

type TherapistLayoutProps = {
  children: ReactNode;
};

export default async function TherapistLayout({
  children,
}: TherapistLayoutProps) {
  await requireRole("therapist", { redirectTo: "/login" });

  return <div dir="rtl">{children}</div>;
}
