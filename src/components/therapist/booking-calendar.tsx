"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { CalendarClock, CheckCircle2, CircleSlash, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled"

type BookingItem = {
  id: string
  clientName: string
  scheduledAt: string
  durationMinutes: number
  status: BookingStatus
  remindersEnabled: boolean
}

type BookingCalendarProps = {
  bookings: BookingItem[]
  hasProfile: boolean
}

type BookingWithDate = BookingItem & {
  scheduledDate: Date
  dateKey: string
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "ממתינה",
  confirmed: "מאושרת",
  completed: "הושלמה",
  cancelled: "בוטלה",
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  completed: "bg-slate-100 text-slate-600",
  cancelled: "bg-rose-100 text-rose-700",
}

const STATUS_FILTERS: Array<{ value: BookingStatus | "all"; label: string }> = [
  { value: "all", label: "הכל" },
  { value: "pending", label: STATUS_LABELS.pending },
  { value: "confirmed", label: STATUS_LABELS.confirmed },
  { value: "completed", label: STATUS_LABELS.completed },
  { value: "cancelled", label: STATUS_LABELS.cancelled },
]

const formatDateKey = (value: Date) => value.toLocaleDateString("en-CA")

const formatDateLabel = (value: Date) =>
  value.toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

const formatTime = (value: Date) =>
  value.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  })

export function BookingCalendar({ bookings, hasProfile }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all")

  const normalizedBookings = useMemo<BookingWithDate[]>(() => {
    return bookings
      .map((booking) => {
        const scheduledDate = new Date(booking.scheduledAt)
        return {
          ...booking,
          scheduledDate,
          dateKey: formatDateKey(scheduledDate),
        }
      })
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
  }, [bookings])

  const bookedDays = useMemo(() => {
    const uniqueDays = new Map<string, Date>()
    for (const booking of normalizedBookings) {
      if (!uniqueDays.has(booking.dateKey)) {
        const normalizedDate = new Date(booking.scheduledDate)
        normalizedDate.setHours(0, 0, 0, 0)
        uniqueDays.set(booking.dateKey, normalizedDate)
      }
    }
    return Array.from(uniqueDays.values())
  }, [normalizedBookings])

  const bookingsForSelectedDate = useMemo(() => {
    if (!selectedDate) {
      return []
    }

    const selectedKey = formatDateKey(selectedDate)
    return normalizedBookings.filter((booking) => {
      const matchesDate = booking.dateKey === selectedKey
      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter
      return matchesDate && matchesStatus
    })
  }, [normalizedBookings, selectedDate, statusFilter])

  const selectedLabel = selectedDate
    ? formatDateLabel(selectedDate)
    : "בחרו תאריך"

  if (!hasProfile) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>יומן פגישות</CardTitle>
          <CardDescription>
            נא להשלים פרופיל מטפל/ת כדי להתחיל לנהל יומן פגישות.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/therapist/profile">השלמת פרופיל</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="h-5 w-5 text-teal-600" />
              יומן חודשי
            </CardTitle>
            <CardDescription>
              בחרו תאריך כדי לראות את הפגישות באותו היום.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              dir="rtl"
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ booked: bookedDays }}
              modifiersClassNames={{
                booked:
                  "bg-teal-50 text-teal-700 font-semibold hover:bg-teal-100",
              }}
              weekStartsOn={0}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">יומן פגישות</CardTitle>
              <CardDescription>{selectedLabel}</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/leads">הוספת פגישה מליד</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2">
              {STATUS_FILTERS.map((filter) => (
                <Button
                  key={filter.value}
                  variant={statusFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setStatusFilter(filter.value as BookingStatus | "all")
                  }
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            {bookingsForSelectedDate.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                אין פגישות לתאריך הזה. נסו לבחור יום אחר.
              </div>
            ) : (
              <div className="space-y-4">
                {bookingsForSelectedDate.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 text-base font-semibold">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(booking.scheduledDate)}</span>
                      </div>
                      <Badge className={cn("text-xs", STATUS_STYLES[booking.status])}>
                        {STATUS_LABELS[booking.status]}
                      </Badge>
                      {booking.remindersEnabled ? (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle2 className="me-1 h-3 w-3" />
                          תזכורות פעילות
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          <CircleSlash className="me-1 h-3 w-3" />
                          תזכורות כבויות
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {booking.clientName}
                      </span>
                      <span>-</span>
                      <span>{booking.durationMinutes} ????</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
