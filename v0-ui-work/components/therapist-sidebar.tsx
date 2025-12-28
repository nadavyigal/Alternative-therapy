"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Shield, Plug, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: LayoutDashboard, label: "סקירה", href: "/dashboard" },
  { icon: Users, label: "פניות ממטופלים", href: "/dashboard/leads" },
  { icon: Shield, label: "שירותים אדמיניסטרטיביים", href: "/dashboard/services" },
  { icon: Plug, label: "אינטגרציות וחיבורים", href: "/dashboard/integrations" },
  { icon: User, label: "הפרופיל שלי", href: "/dashboard/profile" },
  { icon: Settings, label: "הגדרות", href: "/dashboard/settings" },
]

export function TherapistSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-sidebar border-l border-sidebar-border min-h-screen sticky top-0">
      <div className="p-6">
        <div className="text-2xl font-bold text-primary mb-8">פלטפורמה</div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
