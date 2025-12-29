"use client"

import { Suspense, useState } from "react"
import { TherapistSidebar } from "@/components/therapist-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, Mail, Phone, MessageCircle } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const allLeads = [
  {
    id: 1,
    name: "שרה לוי",
    date: "2025-01-15",
    time: "14:30",
    channel: "טלפון",
    issue: "טיפול בחרדה חברתית, קשיים בעבודה",
    status: "חדש",
    phone: "050-1234567",
    email: "sarah@example.com",
  },
  {
    id: 2,
    name: "דוד כהן",
    date: "2025-01-14",
    time: "10:15",
    channel: "אימייל",
    issue: "טיפול זוגי, בעיות תקשורת",
    status: "יצירת קשר",
    phone: "052-9876543",
    email: "david@example.com",
  },
  {
    id: 3,
    name: "רחל אברהם",
    date: "2025-01-13",
    time: "16:45",
    channel: "וואטסאפ",
    issue: "דיכאון, קשיי שינה",
    status: "תואם פגישה",
    phone: "054-5555555",
    email: "rachel@example.com",
  },
  {
    id: 4,
    name: "יוסי מזרחי",
    date: "2025-01-12",
    time: "09:00",
    channel: "טלפון",
    issue: "ADHD, קשיי ריכוז",
    status: "חדש",
    phone: "053-7777777",
    email: "yossi@example.com",
  },
  {
    id: 5,
    name: "מיכל ישראלי",
    date: "2025-01-11",
    time: "13:20",
    channel: "אימייל",
    issue: "הפרעות אכילה",
    status: "סגור",
    phone: "050-9999999",
    email: "michal@example.com",
  },
]

const statusColors: Record<string, string> = {
  חדש: "bg-teal-100 text-teal-700 hover:bg-teal-200",
  "יצירת קשר": "bg-blue-100 text-blue-700 hover:bg-blue-200",
  "תואם פגישה": "bg-orange-100 text-orange-700 hover:bg-orange-200",
  סגור: "bg-gray-100 text-gray-600 hover:bg-gray-200",
}

function LeadsContent() {
  const [selectedLead, setSelectedLead] = useState<(typeof allLeads)[0] | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("הכל")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLeads = allLeads.filter((lead) => {
    const matchesStatus = filterStatus === "הכל" || lead.status === filterStatus
    const matchesSearch = lead.name.includes(searchQuery) || lead.issue.includes(searchQuery)
    return matchesStatus && matchesSearch
  })

  return (
    <div dir="rtl" className="flex min-h-screen bg-background">
      <TherapistSidebar />
      <div className="flex-1">
        <DashboardHeader title="פניות ממטופלים" />
        <main className="p-8">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="חיפוש לפי שם או נושא..."
                    className="pr-10 text-right"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["הכל", "חדש", "יצירת קשר", "תואם פגישה", "סגור"].map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leads Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="text-right p-4 font-medium text-sm">שם מטופל/ת</th>
                      <th className="text-right p-4 font-medium text-sm">תאריך</th>
                      <th className="text-right p-4 font-medium text-sm">ערוץ מועדף</th>
                      <th className="text-right p-4 font-medium text-sm">תקציר</th>
                      <th className="text-right p-4 font-medium text-sm">סטטוס</th>
                      <th className="text-right p-4 font-medium text-sm">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium">{lead.name}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {lead.date} {lead.time}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm">
                            {lead.channel === "טלפון" && <Phone className="w-4 h-4" />}
                            {lead.channel === "אימייל" && <Mail className="w-4 h-4" />}
                            {lead.channel === "וואטסאפ" && <MessageCircle className="w-4 h-4" />}
                            <span>{lead.channel}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm max-w-xs truncate">{lead.issue}</td>
                        <td className="p-4">
                          <Badge className={cn("text-xs", statusColors[lead.status])}>{lead.status}</Badge>
                        </td>
                        <td className="p-4">
                          <Button size="sm" variant="outline" onClick={() => setSelectedLead(lead)}>
                            פתח
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Lead Details Drawer */}
      <Sheet open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <SheetContent side="left" className="w-full sm:max-w-lg">
          {selectedLead && (
            <>
              <SheetHeader>
                <SheetTitle className="text-right">{selectedLead.name}</SheetTitle>
                <SheetDescription className="text-right">פרטי הפנייה ואפשרויות טיפול</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6" dir="rtl">
                {/* Contact Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">פרטי התקשרות</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedLead.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedLead.email}</span>
                    </div>
                  </div>
                </div>

                {/* Issue Details */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">פרטי הפנייה</h3>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">{selectedLead.issue}</div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {selectedLead.date} בשעה {selectedLead.time}
                    </span>
                    <Badge variant="outline">{selectedLead.channel}</Badge>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">עדכון סטטוס</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      סימון יצירת קשר
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      תואם פגישה
                    </Button>
                  </div>
                  <Button size="sm" variant="outline" className="w-full text-muted-foreground bg-transparent">
                    סגירה – לא רלוונטי
                  </Button>
                </div>

                {/* Internal Notes */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">הערות פנימיות</h3>
                  <Textarea placeholder="הוסיפו הערות לעצמכם (לא נראות למטופל)" className="text-right" rows={4} />
                  <Button size="sm" className="w-full">
                    שמירת הערה
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function LeadsPage() {
  return (
    <Suspense fallback={null}>
      <LeadsContent />
    </Suspense>
  )
}
