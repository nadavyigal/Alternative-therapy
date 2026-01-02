"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { TherapistSidebar } from "@/components/therapist-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MessageCircle, Phone } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type LeadStatus = "new" | "contacted" | "booked" | "closed" | "no_show"

type Lead = {
  id: string
  clientName: string
  clientPhone: string
  message: string | null
  status: LeadStatus
  source: string | null
  createdAt: string
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "חדש",
  contacted: "נוצר קשר",
  booked: "נקבע",
  closed: "נסגר",
  no_show: "לא הגיע/ה",
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-teal-100 text-teal-700 hover:bg-teal-200",
  contacted: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  booked: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  closed: "bg-gray-100 text-gray-600 hover:bg-gray-200",
  no_show: "bg-rose-100 text-rose-700 hover:bg-rose-200",
}

const STATUS_FILTERS: Array<{ value: LeadStatus | "all"; label: string }> = [
  { value: "all", label: "הכל" },
  { value: "new", label: STATUS_LABELS.new },
  { value: "contacted", label: STATUS_LABELS.contacted },
  { value: "booked", label: STATUS_LABELS.booked },
  { value: "closed", label: STATUS_LABELS.closed },
  { value: "no_show", label: STATUS_LABELS.no_show },
]

const SOURCE_LABELS: Record<string, string> = {
  profile: "טופס אתר",
}

const formatDateTime = (value: string) => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  const date = parsed.toLocaleDateString("he-IL")
  const time = parsed.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  })
  return `${date} ${time}`
}

function LeadsContent() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<LeadStatus | null>(null)

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) ?? null

  useEffect(() => {
    let isActive = true

    const loadLeads = async () => {
      setIsLoading(true)
      setError("")
      try {
        const response = await fetch("/api/leads")
        if (!response.ok) {
          const message =
            response.status === 401
              ? "יש להתחבר כדי לצפות בפניות."
              : "לא הצלחנו לטעון פניות כרגע."
          throw new Error(message)
        }
        const data = (await response.json()) as { leads?: Lead[] }
        if (isActive) {
          setLeads(Array.isArray(data.leads) ? data.leads : [])
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : "אירעה שגיאה לא צפויה.")
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadLeads()

    return () => {
      isActive = false
    }
  }, [])

  const filteredLeads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return leads.filter((lead) => {
      const matchesStatus = filterStatus === "all" || lead.status === filterStatus
      if (!query) {
        return matchesStatus
      }

      const message = (lead.message ?? "").toLowerCase()
      const name = lead.clientName.toLowerCase()
      const phone = lead.clientPhone.toLowerCase()
      const matchesSearch =
        name.includes(query) || message.includes(query) || phone.includes(query)

      return matchesStatus && matchesSearch
    })
  }, [filterStatus, leads, searchQuery])

  const updateStatus = async (status: LeadStatus) => {
    if (!selectedLead) {
      return
    }

    setUpdatingStatus(status)
    setError("")

    try {
      const response = await fetch(`/api/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("לא הצלחנו לעדכן את הסטטוס.")
      }

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === selectedLead.id ? { ...lead, status } : lead
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "אירעה שגיאה לא צפויה.")
    } finally {
      setUpdatingStatus(null)
    }
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-background">
      <TherapistSidebar />
      <div className="flex-1">
        <DashboardHeader title="פניות ממטופלים" />
        <main className="p-8">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1 relative">
                  <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="חיפוש לפי שם, הודעה או טלפון..."
                    className="pe-10 text-right"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_FILTERS.map((filter) => (
                    <Button
                      key={filter.value}
                      variant={filterStatus === filter.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus(filter.value)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
              {error && (
                <p className="mt-4 text-sm text-destructive">{error}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 text-sm text-muted-foreground">
                  טוענים פניות...
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">
                  אין פניות תואמות להצגתן כרגע.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="text-right p-4 font-medium text-sm">
                          שם הפונה
                        </th>
                        <th className="text-right p-4 font-medium text-sm">
                          התקבלה
                        </th>
                        <th className="text-right p-4 font-medium text-sm">
                          מקור
                        </th>
                        <th className="text-right p-4 font-medium text-sm">
                          הודעה
                        </th>
                        <th className="text-right p-4 font-medium text-sm">
                          סטטוס
                        </th>
                        <th className="text-right p-4 font-medium text-sm">
                          פעולות
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => {
                        const sourceLabel =
                          SOURCE_LABELS[lead.source ?? ""] ?? "טופס אתר"
                        return (
                          <tr
                            key={lead.id}
                            className="border-b border-border hover:bg-muted/30 transition-colors"
                          >
                            <td className="p-4 font-medium">{lead.clientName}</td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {formatDateTime(lead.createdAt)}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2 text-sm">
                                <MessageCircle className="w-4 h-4" />
                                <span>{sourceLabel}</span>
                              </div>
                            </td>
                            <td className="p-4 text-sm max-w-xs truncate">
                              {lead.message || "לא צוינה הודעה"}
                            </td>
                            <td className="p-4">
                              <Badge className={cn("text-xs", STATUS_COLORS[lead.status])}>
                                {STATUS_LABELS[lead.status]}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedLeadId(lead.id)}
                              >
                                הצגה
                              </Button>
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
        </main>
      </div>

      <Sheet
        open={Boolean(selectedLead)}
        onOpenChange={(open) => !open && setSelectedLeadId(null)}
      >
        <SheetContent side="left" className="w-full sm:max-w-lg">
          {selectedLead && (
            <>
              <SheetHeader>
                <SheetTitle className="text-right">{selectedLead.clientName}</SheetTitle>
                <SheetDescription className="text-right">
                  פרטי פנייה ותיעוד סטטוס
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6" dir="rtl">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">פרטי יצירת קשר</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedLead.clientPhone}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      התקבלה: {formatDateTime(selectedLead.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">הודעת הפונה</h3>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
                    {selectedLead.message || "לא צוינה הודעה."}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">עדכון סטטוס</h3>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.filter((filter) => filter.value !== "all").map(
                      (filter) => (
                        <Button
                          key={filter.value}
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => updateStatus(filter.value as LeadStatus)}
                          disabled={updatingStatus !== null}
                        >
                          {updatingStatus === filter.value ? "מעדכנים..." : filter.label}
                        </Button>
                      )
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    סטטוס נוכחי:{" "}
                    <span className="font-medium">
                      {STATUS_LABELS[selectedLead.status]}
                    </span>
                  </div>
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
