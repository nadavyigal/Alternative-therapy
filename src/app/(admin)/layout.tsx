import type { ReactNode } from "react";
import { requireRole } from "@/lib/rbac";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireRole("admin", { redirectTo: "/login" });

  return <div dir="rtl">{children}</div>;
}
