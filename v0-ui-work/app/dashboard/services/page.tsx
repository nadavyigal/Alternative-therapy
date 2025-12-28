import { TherapistSidebar } from "@/components/therapist-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, TrendingUp, FileText, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const activeRequests = [
  {
    id: 1,
    type: "ביטוח",
    status: "בטיפול",
    date: "2025-01-10",
    partner: "חברת הביטוח ABC",
    lastUpdate: "התקבלה הצעה ראשונה",
  },
  {
    id: 2,
    type: "פנסיה",
    status: "דרוש מידע",
    date: "2025-01-08",
    partner: "יועץ פנסיוני XYZ",
    lastUpdate: "נדרשים מסמכים נוספים",
  },
]

const statusColors: Record<string, string> = {
  חדש: "bg-teal-100 text-teal-700",
  בטיפול: "bg-blue-100 text-blue-700",
  "דרוש מידע": "bg-orange-100 text-orange-700",
  הושלם: "bg-green-100 text-green-700",
  נסגר: "bg-gray-100 text-gray-600",
}

export default function ServicesPage() {
  return (
    <div dir="rtl" className="flex min-h-screen bg-background">
      <TherapistSidebar />
      <div className="flex-1">
        <DashboardHeader title="שירותים אדמיניסטרטיביים" />
        <main className="p-8">
          <div className="mb-8">
            <p className="text-muted-foreground">ביטוח, פנסיה ומס – עם גורמים מקצועיים מורשים</p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-teal-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-teal-700" />
                </div>
                <CardTitle>ביטוח אחריות מקצועית</CardTitle>
                <CardDescription className="leading-relaxed">
                  ביטוח אחריות מקצועית למטפלים – מותאם לתחום הפעילות שלך
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/services/insurance">פתיחת בקשת ביטוח</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-orange-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-700" />
                </div>
                <CardTitle>פנסיות וקרנות השתלמות</CardTitle>
                <CardDescription className="leading-relaxed">
                  התאמת פנסיה וקרנות השתלמות לעצמאיים ולמטפלים
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/services/pension">פתיחת בקשת פנסיה</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-teal-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-teal-700" />
                </div>
                <CardTitle>דיווח שנתי ומס</CardTitle>
                <CardDescription className="leading-relaxed">עזרה בדיווח שנתי למס הכנסה וניהול ספרים</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/services/tax">פתיחת בקשת מס</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Active Requests */}
          <Card>
            <CardHeader>
              <CardTitle>בקשות פעילות</CardTitle>
              <CardDescription>מעקב אחר הבקשות שלך לשירותים אדמיניסטרטיביים</CardDescription>
            </CardHeader>
            <CardContent>
              {activeRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-right p-4 font-medium text-sm">סוג</th>
                        <th className="text-right p-4 font-medium text-sm">סטטוס</th>
                        <th className="text-right p-4 font-medium text-sm">תאריך פתיחה</th>
                        <th className="text-right p-4 font-medium text-sm">גורם מטפל</th>
                        <th className="text-right p-4 font-medium text-sm">עדכון אחרון</th>
                        <th className="text-right p-4 font-medium text-sm">פעולות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeRequests.map((request) => (
                        <tr key={request.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-medium">{request.type}</td>
                          <td className="p-4">
                            <Badge className={cn("text-xs", statusColors[request.status])}>{request.status}</Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{request.date}</td>
                          <td className="p-4 text-sm">{request.partner}</td>
                          <td className="p-4 text-sm text-muted-foreground">{request.lastUpdate}</td>
                          <td className="p-4">
                            <Button size="sm" variant="ghost" className="flex items-center gap-1">
                              <span>צפייה</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">אין לך בקשות פעילות כרגע</p>
                  <p className="text-sm text-muted-foreground">התחילו בקשה חדשה מהכרטיסים למעלה</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
