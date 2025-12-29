import { cn } from "@/lib/utils"
import { TherapistSidebar } from "@/components/therapist-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowUpRight, Shield, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const recentLeads = [
    { id: 1, name: "שרה לוי", date: "לפני שעתיים", issue: "טיפול בחרדה", status: "חדש" },
    { id: 2, name: "דוד כהן", date: "אתמול", issue: "טיפול זוגי", status: "יצירת קשר" },
    { id: 3, name: "רחל אברהם", date: "לפני 2 ימים", issue: "דיכאון", status: "תואם פגישה" },
  ]

  const statusColors: Record<string, string> = {
    חדש: "bg-teal-100 text-teal-700",
    "יצירת קשר": "bg-blue-100 text-blue-700",
    "תואם פגישה": "bg-orange-100 text-orange-700",
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-background">
      <TherapistSidebar />
      <div className="flex-1">
        <DashboardHeader title="סקירה" />
        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">פניות חדשות החודש</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-xs text-teal-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+20% מהחודש הקודם</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">פניות פתוחות</CardTitle>
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
                <p className="text-xs text-muted-foreground mt-1">ממתינות למענה</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">בקשות שירות פתוחות</CardTitle>
                <Shield className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2</div>
                <p className="text-xs text-muted-foreground mt-1">ביטוח + פנסיה</p>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-900">סטטוס אימות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                    ממתין לאימות
                  </Badge>
                </div>
                <p className="text-xs text-amber-700 mt-2">המסמכים שלך בבדיקה</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Leads */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>פניות אחרונות ממטופלים</CardTitle>
                    <CardDescription>המטופלים שפנו אליך לאחרונה</CardDescription>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/dashboard/leads" className="flex items-center gap-1">
                      <span>צפייה בכל</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <div className="font-medium">{lead.name}</div>
                            <Badge className={cn("text-xs", statusColors[lead.status])}>{lead.status}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">{lead.issue}</div>
                          <div className="text-xs text-muted-foreground mt-1">{lead.date}</div>
                        </div>
                        <Button size="sm" variant="outline">
                          פתח
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Services */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>שירותים אדמיניסטרטיביים</CardTitle>
                  <CardDescription>ביטוח, פנסיה ומס במקום אחד</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link
                    href="/dashboard/services/insurance"
                    className="block p-4 border border-border rounded-lg hover:border-teal-300 hover:bg-teal-50/50 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-teal-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm mb-1 group-hover:text-teal-700 transition-colors">
                          ביטוח אחריות מקצועית
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed">כיסוי מותאם למטפלים</div>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/services/pension"
                    className="block p-4 border border-border rounded-lg hover:border-teal-300 hover:bg-teal-50/50 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 text-orange-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm mb-1 group-hover:text-teal-700 transition-colors">
                          פנסיה וקרן השתלמות
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed">תכנון פיננסי לעצמאיים</div>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/services/tax"
                    className="block p-4 border border-border rounded-lg hover:border-teal-300 hover:bg-teal-50/50 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-teal-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm mb-1 group-hover:text-teal-700 transition-colors">
                          דיווח שנתי ומס
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed">סיוע בדיווח למס הכנסה</div>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* GreenInvoice Teaser */}
              <Card className="mt-6 bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
                <CardHeader>
                  <CardTitle className="text-base">חיבור לחשבונית ירוקה</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    סנכרנו נתונים על חשבוניות מטיפולים – במקום אחד
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/dashboard/integrations">חיבור עכשיו</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
