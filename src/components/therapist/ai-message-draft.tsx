"use client"

import { useMemo, useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type DraftIntent = "lead_reply" | "booking_confirmation" | "reschedule" | "reminder"

type BookingDraftItem = {
  id: string
  clientName: string
  scheduledAt: string
}

type AiMessageDraftProps = {
  bookings: BookingDraftItem[]
}

const INTENT_LABELS: Record<DraftIntent, string> = {
  lead_reply: "מענה לליד",
  booking_confirmation: "אישור פגישה",
  reschedule: "תיאום מחדש",
  reminder: "תזכורת",
}

const formatBookingTime = (value: string) => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed)
}

const toMessage = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback

const mapError = (value: unknown) => {
  switch (value) {
    case "OPENROUTER_NOT_CONFIGURED":
      return "חסר מפתח OpenRouter בסביבת העבודה."
    case "INVALID_REQUEST":
      return "פרטי הבקשה אינם תקינים. בדקו את השדות."
    case "UNAUTHORIZED":
      return "אין הרשאה ליצור טיוטת הודעה."
    default:
      return "לא ניתן ליצור טיוטה כרגע. נסו שוב בעוד רגע."
  }
}

export function AiMessageDraft({ bookings }: AiMessageDraftProps) {
  const initialBooking = bookings[0]
  const [intent, setIntent] = useState<DraftIntent>("booking_confirmation")
  const [selectedBookingId, setSelectedBookingId] = useState(
    initialBooking?.id ?? ""
  )
  const [clientName, setClientName] = useState(initialBooking?.clientName ?? "")
  const [requestedTime, setRequestedTime] = useState(
    initialBooking ? formatBookingTime(initialBooking.scheduledAt) : ""
  )
  const [notes, setNotes] = useState("")
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const bookingMap = useMemo(() => {
    return new Map(bookings.map((booking) => [booking.id, booking]))
  }, [bookings])

  const bookingOptions = useMemo(() => {
    return bookings.map((booking) => ({
      id: booking.id,
      label: `${booking.clientName} - ${formatBookingTime(booking.scheduledAt)}`,
    }))
  }, [bookings])

  const handleBookingChange = (value: string) => {
    if (value === "none") {
      setSelectedBookingId("")
      return
    }

    setSelectedBookingId(value)
    const booking = bookingMap.get(value)
    if (booking) {
      setClientName(booking.clientName)
      setRequestedTime(formatBookingTime(booking.scheduledAt))
    }
  }

  const handleGenerate = async () => {
    setError(null)
    const trimmedName = clientName.trim()
    const trimmedTime = requestedTime.trim()
    const trimmedNotes = notes.trim()

    if (!trimmedName) {
      setError("יש להזין שם מטופל/ת.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/message-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent,
          context: {
            clientName: trimmedName,
            requestedTime: trimmedTime || undefined,
            notes: trimmedNotes || undefined,
          },
        }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        setError(mapError(payload?.error))
        return
      }

      const text = toMessage(payload?.text, "").trim()
      if (!text) {
        setError("המערכת לא החזירה טיוטה. נסו שוב.")
        return
      }

      setDraft(text)
    } catch {
      setError("אירעה שגיאה ביצירת הטיוטה. נסו שוב.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setIntent("booking_confirmation")
    setSelectedBookingId("")
    setClientName("")
    setRequestedTime("")
    setNotes("")
    setDraft("")
    setError(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-5 w-5 text-amber-500" />
          טיוטת הודעה עם AI
        </CardTitle>
        <CardDescription>
          צור טיוטה קצרה בעברית, ערוך אותה ושלח ללקוח בערוץ המועדף עליך.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="draft-intent">סוג הודעה</Label>
              <Select value={intent} onValueChange={(value) => setIntent(value as DraftIntent)}>
                <SelectTrigger id="draft-intent" className="w-full">
                  <SelectValue placeholder="בחר סוג הודעה" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INTENT_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="draft-booking">פגישה</Label>
              <Select
                value={selectedBookingId || "none"}
                onValueChange={handleBookingChange}
                disabled={bookingOptions.length === 0}
              >
                <SelectTrigger id="draft-booking" className="w-full">
                  <SelectValue placeholder="בחר פגישה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">ללא פגישה</SelectItem>
                  {bookingOptions.map((booking) => (
                    <SelectItem key={booking.id} value={booking.id}>
                      {booking.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {bookingOptions.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  אין פגישות זמינות כרגע, ניתן להזין ידנית את פרטי ההודעה.
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="draft-client">שם המטופל/ת</Label>
              <Input
                id="draft-client"
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                placeholder="לדוגמה: יעל כהן"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="draft-time">זמן רלוונטי (אופציונלי)</Label>
              <Input
                id="draft-time"
                value={requestedTime}
                onChange={(event) => setRequestedTime(event.target.value)}
                placeholder="לדוגמה: יום חמישי 14:30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="draft-notes">הקשר נוסף (אופציונלי)</Label>
              <Textarea
                id="draft-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="הוסף פרטים קצרים שחשוב לשלב בהודעה."
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="draft-text">טיוטת הודעה</Label>
              <Textarea
                id="draft-text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="לחץ על 'צור טיוטה' כדי לקבל הצעה."
                className="min-h-[220px]"
              />
            </div>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    יוצר טיוטה...
                  </>
                ) : (
                  "צור טיוטה"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleClear}>
                נקה שדות
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              הטיוטה נועדה לעזרה בלבד ואינה תחליף לשיקול דעת מקצועי.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
