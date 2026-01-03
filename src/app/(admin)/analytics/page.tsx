import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  listServiceRequestsForAdmin,
  type ServiceRequestStatus,
} from "@/lib/service-requests"
import { listCredentialsForAdmin, type CredentialStatus } from "@/lib/credentials"
import { requireRole } from "@/lib/rbac"

const STATUS_ORDER: ServiceRequestStatus[] = [
  "sent",
  "contacted",
  "converted",
  "lost",
]

const STATUS_LABELS: Record<ServiceRequestStatus, string> = {
  sent: "נשלח",
  contacted: "נוצר קשר",
  converted: "הומר",
  lost: "אבוד",
}

const CATEGORY_ORDER = ["insurance", "tax", "pension"] as const

const CATEGORY_LABELS: Record<string, string> = {
  insurance: "ביטוח",
  tax: "מיסוי",
  pension: "פנסיה",
}

const CREDENTIAL_STATUS_ORDER: CredentialStatus[] = [
  "pending",
  "approved",
  "rejected",
]

const CREDENTIAL_STATUS_LABELS: Record<CredentialStatus, string> = {
  pending: "ממתין",
  approved: "מאושר",
  rejected: "נדחה",
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("he-IL").format(value)

const formatPercent = (value: number) =>
  `${Number.isFinite(value) ? value.toFixed(1) : "0.0"}%`

const formatDurationHours = (hours: number) => {
  if (!Number.isFinite(hours) || hours <= 0) {
    return "—"
  }

  if (hours >= 48) {
    return `${(hours / 24).toFixed(1)} ימים`
  }

  return `${Math.round(hours)} שעות`
}

export default async function AdminAnalyticsPage() {
  await requireRole("admin")

  const [requests, credentials] = await Promise.all([
    listServiceRequestsForAdmin(),
    listCredentialsForAdmin(),
  ])

  const totalRequests = requests.length
  const statusCounts = STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = 0
      return acc
    },
    {} as Record<ServiceRequestStatus, number>
  )
  const categoryCounts = CATEGORY_ORDER.reduce(
    (acc, category) => {
      acc[category] = 0
      return acc
    },
    {} as Record<(typeof CATEGORY_ORDER)[number], number>
  )

  const partnerStats = new Map<
    string,
    { name: string; total: number; converted: number }
  >()

  requests.forEach(({ serviceRequest, partner }) => {
    statusCounts[serviceRequest.status] += 1

    if (CATEGORY_ORDER.includes(serviceRequest.category as (typeof CATEGORY_ORDER)[number])) {
      const categoryKey = serviceRequest.category as (typeof CATEGORY_ORDER)[number]
      categoryCounts[categoryKey] += 1
    }

    const partnerName = partner?.name ?? "לא משויך"
    const entry = partnerStats.get(partnerName) ?? {
      name: partnerName,
      total: 0,
      converted: 0,
    }
    entry.total += 1
    if (serviceRequest.status === "converted") {
      entry.converted += 1
    }
    partnerStats.set(partnerName, entry)
  })

  const convertedCount = statusCounts.converted ?? 0
  const conversionRate =
    totalRequests > 0 ? (convertedCount / totalRequests) * 100 : 0

  const totalCredentials = credentials.length
  const credentialStatusCounts = CREDENTIAL_STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = 0
      return acc
    },
    {} as Record<CredentialStatus, number>
  )

  const verificationDurations = credentials
    .filter(({ credential }) => credential.verifiedAt)
    .map(({ credential }) => {
      const verifiedAt = credential.verifiedAt as Date
      return verifiedAt.getTime() - credential.createdAt.getTime()
    })
    .filter((duration) => duration > 0)

  credentials.forEach(({ credential }) => {
    credentialStatusCounts[credential.status] += 1
  })

  const averageVerificationHours =
    verificationDurations.length > 0
      ? verificationDurations.reduce((sum, value) => sum + value, 0) /
        verificationDurations.length /
        (1000 * 60 * 60)
      : 0

  const partnerRows = Array.from(partnerStats.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)

  return (
    <div dir="rtl" className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold">אנליטיקות מנהל</h1>
        <p className="text-sm text-muted-foreground">
          תמונת מצב מהירה על הפניות לשותפים ואישורי מסמכים.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              סה״כ הפניות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatNumber(totalRequests)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              שיעור המרה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatPercent(conversionRate)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {formatNumber(convertedCount)} המרות מתוך {formatNumber(totalRequests)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              אישורים בהמתנה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatNumber(credentialStatusCounts.pending)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              זמן אימות ממוצע
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatDurationHours(averageVerificationHours)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>סטטוס הפניות</CardTitle>
            <CardDescription>התפלגות סטטוסים לכל הפניות.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {totalRequests === 0 ? (
              <p className="text-sm text-muted-foreground">
                אין עדיין הפניות להצגה.
              </p>
            ) : (
              STATUS_ORDER.map((status) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm">{STATUS_LABELS[status]}</span>
                  <Badge variant="secondary">
                    {formatNumber(statusCounts[status])}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>סטטוס מסמכים</CardTitle>
            <CardDescription>התפלגות אימותי המסמכים.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {totalCredentials === 0 ? (
              <p className="text-sm text-muted-foreground">
                אין עדיין מסמכים להצגה.
              </p>
            ) : (
              CREDENTIAL_STATUS_ORDER.map((status) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm">
                    {CREDENTIAL_STATUS_LABELS[status]}
                  </span>
                  <Badge variant="secondary">
                    {formatNumber(credentialStatusCounts[status])}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>קטגוריות שירות</CardTitle>
            <CardDescription>פילוח לפי תחום שירות.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {totalRequests === 0 ? (
              <p className="text-sm text-muted-foreground">
                אין עדיין נתוני קטגוריות.
              </p>
            ) : (
              CATEGORY_ORDER.map((category) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm">{CATEGORY_LABELS[category]}</span>
                  <Badge variant="secondary">
                    {formatNumber(categoryCounts[category])}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ביצועי שותפים</CardTitle>
            <CardDescription>Top 6 לפי נפח הפניות.</CardDescription>
          </CardHeader>
          <CardContent>
            {partnerRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                אין עדיין שותפים להצגה.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-right p-2 text-xs font-medium">
                        שותף
                      </th>
                      <th className="text-right p-2 text-xs font-medium">
                        סה״כ
                      </th>
                      <th className="text-right p-2 text-xs font-medium">
                        המרות
                      </th>
                      <th className="text-right p-2 text-xs font-medium">
                        אחוז המרה
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {partnerRows.map((row) => {
                      const rate =
                        row.total > 0 ? (row.converted / row.total) * 100 : 0
                      return (
                        <tr key={row.name} className="border-b border-border">
                          <td className="p-2 text-sm">{row.name}</td>
                          <td className="p-2 text-sm text-muted-foreground">
                            {formatNumber(row.total)}
                          </td>
                          <td className="p-2 text-sm text-muted-foreground">
                            {formatNumber(row.converted)}
                          </td>
                          <td className="p-2 text-sm text-muted-foreground">
                            {formatPercent(rate)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
