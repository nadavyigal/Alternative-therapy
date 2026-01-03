import { TherapistSidebar } from "@/components/therapist-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, TrendingUp, FileText } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { requireRole } from "@/lib/rbac"
import { getTherapistProfileByUserId } from "@/lib/therapist-profile"
import {
  listServiceRequestsForProfileWithPartner,
  type ServiceRequestStatus,
} from "@/lib/service-requests"

const STATUS_LABELS: Record<ServiceRequestStatus, string> = {
  sent: "נשלח",
  contacted: "נוצר קשר",
  converted: "הומר",
  lost: "אבוד",
}

const STATUS_COLORS: Record<ServiceRequestStatus, string> = {
  sent: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  converted: "bg-emerald-100 text-emerald-700",
  lost: "bg-gray-100 text-gray-600",
}

const CATEGORY_LABELS: Record<string, string> = {
  insurance: "ביטוח",
  tax: "מיסוי",
  pension: "פנסיה",
}

const SUCCESS_LABELS: Record<string, string> = {
  insurance: "ביטוח",
  tax: "מיסוי",
  pension: "פנסיה",
}

const formatDateTime = (value: Date | string) => {
  const parsed = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return String(value)
  }

  return parsed.toLocaleString("he-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

type ServicesPageProps = {
  searchParams?: {
    success?: string
  }
}

export default async function ServicesPage({
  searchParams,
}: ServicesPageProps) {
  const session = await requireRole("therapist", { redirectTo: "/login" })
  const profile = await getTherapistProfileByUserId(session.user.id)
  const requests = profile
    ? await listServiceRequestsForProfileWithPartner(profile.id)
    : []
  const successKey = searchParams?.success ?? ""
  const successLabel = SUCCESS_LABELS[successKey]

  return (
    <div dir="rtl" className="flex min-h-screen bg-background">
      <TherapistSidebar />
      <div className="flex-1">
        <DashboardHeader title="שירותים מקצועיים" />
        <main className="p-8">
          <div className="mb-8 space-y-4">
            <p className="text-muted-foreground">
              ביטוח, פנסיה ומיסוי מקצועי כדי שתוכלו להתמקד בטיפול. מלאו בקשה ונציג יחזור אליכם.
            </p>
            {successLabel && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                הבקשה לשירות {successLabel} נשלחה בהצלחה. צוות השותפים יחזור אליכם בתוך 2-3 ימי עסקים.
              </div>
            )}
            {!profile && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                כדי לשלוח בקשה לשירותים מקצועיים יש להשלים פרופיל מטפל.
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-teal-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-teal-700" />
                </div>
                <CardTitle>ביטוח אחריות מקצועית</CardTitle>
                <CardDescription className="leading-relaxed">
                  ביטוח מקצועי מותאם לתחום הטיפול, כולל כיסוי למפגשים פרונטליים ואונליין.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/services/insurance">התחל בקשת ביטוח</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-orange-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-700" />
                </div>
                <CardTitle>ייעוץ פנסיוני לעצמאים</CardTitle>
                <CardDescription className="leading-relaxed">
                  תכנון פנסיוני מותאם לעצמאים, כדי למקסם את החיסכון והתשואות.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/services/pension">התחל בקשת פנסיה</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-teal-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-teal-700" />
                </div>
                <CardTitle>תכנון מס לעצמאים</CardTitle>
                <CardDescription className="leading-relaxed">
                  שירותי ייעוץ מס מותאמים למטפלים עצמאיים כדי להבטיח התנהלות תקינה.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/services/tax">התחל בקשת מס</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                בקשות פעילות
                <Badge variant="secondary">{requests.length}</Badge>
              </CardTitle>
              <CardDescription>
                מעקב אחר מצב הבקשות והשיבוץ לשותפים המקצועיים.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-right p-4 font-medium text-sm">סוג שירות</th>
                        <th className="text-right p-4 font-medium text-sm">סטטוס</th>
                        <th className="text-right p-4 font-medium text-sm">נשלח בתאריך</th>
                        <th className="text-right p-4 font-medium text-sm">שותף</th>
                        <th className="text-right p-4 font-medium text-sm">פרטים</th>
                        <th className="text-right p-4 font-medium text-sm">עודכן לאחרונה</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map(({ serviceRequest, partner }) => {
                        const categoryLabel =
                          CATEGORY_LABELS[serviceRequest.category] ??
                          serviceRequest.category
                        const details =
                          serviceRequest.details?.trim() || "לא צוינו פרטים נוספים"

                        return (
                          <tr
                            key={serviceRequest.id}
                            className="border-b border-border hover:bg-muted/30 transition-colors"
                          >
                            <td className="p-4 font-medium">{categoryLabel}</td>
                            <td className="p-4">
                              <Badge className={cn("text-xs", STATUS_COLORS[serviceRequest.status])}>
                                {STATUS_LABELS[serviceRequest.status]}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {formatDateTime(serviceRequest.createdAt)}
                            </td>
                            <td className="p-4 text-sm">
                              {partner?.name ?? "ללא שותף"}
                            </td>
                            <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">
                              {details}
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {formatDateTime(serviceRequest.updatedAt)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    עדיין לא נשלחו בקשות לשותפים מקצועיים.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    התחילו בקשת שירות חדשה כדי לקבל ליווי מקצועי.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
