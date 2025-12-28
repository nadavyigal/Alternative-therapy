"use client"

import { useState } from "react"
import { TherapistSidebar } from "@/components/therapist-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plug, CheckCircle2, RefreshCw, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function IntegrationsPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)

  const handleConnect = () => {
    setIsConnecting(true)
    // Simulate OAuth connection
    setTimeout(() => {
      setIsConnected(true)
      setLastSync(new Date().toLocaleString("he-IL"))
      setIsConnecting(false)
      setShowConnectModal(false)
    }, 2000)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setLastSync(null)
  }

  const handleSync = () => {
    setLastSync(new Date().toLocaleString("he-IL"))
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-background">
      <TherapistSidebar />
      <div className="flex-1">
        <DashboardHeader title="אינטגרציות וחיבורים" />
        <main className="p-8">
          <div className="max-w-4xl">
            <p className="text-muted-foreground mb-8">חברו מערכות קיימות כדי לקבל תמונה מלאה יותר</p>

            {/* GreenInvoice Integration */}
            <Card className={isConnected ? "border-teal-300 bg-teal-50/30" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center">
                      <Plug className="w-8 h-8 text-green-700" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        חשבונית ירוקה
                        {isConnected && <Badge className="bg-teal-100 text-teal-700">מחובר</Badge>}
                      </CardTitle>
                      <CardDescription className="mt-1">מערכת לניהול חשבוניות ודוחות פיננסיים לעצמאיים</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!isConnected ? (
                  // Disconnected State
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed">
                      חיבור לחשבונית ירוקה מאפשר לראות סיכום הכנסות מהטיפולים במקום אחד, ולשתף מידע אוטומטית עם רואה
                      החשבון שלך.
                    </p>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>סנכרון אוטומטי של חשבוניות</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>דוחות הכנסות חודשיים</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>קישור לפניות מטופלים</span>
                    </div>
                    <div className="pt-4">
                      <Button onClick={() => setShowConnectModal(true)} className="gap-2">
                        <Plug className="w-4 h-4" />
                        חיבור לחשבונית ירוקה
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">החיבור מתבצע דרך חשבון חשבונית ירוקה שלך</p>
                    </div>
                  </div>
                ) : (
                  // Connected State
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-sm text-teal-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>החיבור פעיל</span>
                    </div>

                    {lastSync && <div className="text-sm text-muted-foreground">סנכרון אחרון: {lastSync}</div>}

                    {/* Integration Metrics */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-background border border-border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-1">חשבוניות החודש</div>
                        <div className="text-2xl font-bold">28</div>
                      </div>
                      <div className="bg-background border border-border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-1">הכנסות החודש</div>
                        <div className="text-2xl font-bold">42,500 ₪</div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                      <div className="font-medium mb-1">חיבור לרואה חשבון</div>
                      <p>נתונים אלו זמינים גם לרואה החשבון שלך אם שיתפת גישה בבקשת המס</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                      <Button variant="outline" onClick={handleSync} className="gap-2 bg-transparent">
                        <RefreshCw className="w-4 h-4" />
                        סנכרון ידני עכשיו
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDisconnect}
                        className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                      >
                        <XCircle className="w-4 h-4" />
                        ניתוק חיבור
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <a href="#" className="hover:underline">
                        צפייה בפרטים מלאים בחשבונית ירוקה ←
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Coming Soon Integrations */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">אינטגרציות נוספות בקרוב</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="opacity-60">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      Google Calendar
                      <Badge variant="secondary" className="text-xs">
                        בקרוב
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">סנכרון פגישות עם הלוח שנה שלך</p>
                  </CardContent>
                </Card>

                <Card className="opacity-60">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      Zoom
                      <Badge variant="secondary" className="text-xs">
                        בקרוב
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">יצירת פגישות אונליין ישירות מהמערכת</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Connect Modal */}
      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>חיבור לחשבונית ירוקה</DialogTitle>
            <DialogDescription>נפתח חלון חדש לכניסה לחשבונית ירוקה שלך</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!isConnecting ? (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                  <p className="font-medium mb-2">מה קורה בתהליך?</p>
                  <ul className="space-y-1 text-xs">
                    <li>1. תתבקשו להתחבר לחשבון חשבונית ירוקה</li>
                    <li>2. תאשרו גישה לקריאת חשבוניות ודוחות</li>
                    <li>3. החיבור יושלם אוטומטית</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  אנחנו לא שומרים את הסיסמה שלכם, רק מקבלים הרשאה לקרוא נתונים
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-teal-600" />
                <p className="text-sm text-muted-foreground">מתחבר לחשבונית ירוקה...</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConnectModal(false)} disabled={isConnecting}>
              ביטול
            </Button>
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? "מתחבר..." : "המשך לחשבונית ירוקה"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
