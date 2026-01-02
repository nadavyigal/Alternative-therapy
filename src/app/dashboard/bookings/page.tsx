import { BookingCalendar } from "@/components/therapist/booking-calendar"
import { AiMessageDraft } from "@/components/therapist/ai-message-draft"
import { DashboardHeader } from "@/components/dashboard-header"
import { TherapistSidebar } from "@/components/therapist-sidebar"
import { listBookingsForProfile } from "@/lib/bookings"
import { requireRole } from "@/lib/rbac"
import { getTherapistProfileByUserId } from "@/lib/therapist-profile"

type BookingCalendarItem = {
  id: string
  clientName: string
  scheduledAt: string
  durationMinutes: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  remindersEnabled: boolean
}

export default async function BookingsPage() {
  const session = await requireRole("therapist", { redirectTo: "/login" })
  const profile = await getTherapistProfileByUserId(session.user.id)
  const bookings = profile ? await listBookingsForProfile(profile.id) : []

  const calendarBookings: BookingCalendarItem[] = bookings.map((booking) => ({
    id: booking.id,
    clientName: booking.clientName,
    scheduledAt: booking.scheduledAt.toISOString(),
    durationMinutes: booking.durationMinutes ?? 60,
    status: booking.status,
    remindersEnabled: booking.remindersEnabled,
  }))

  return (
    <div dir="rtl" className="flex min-h-screen bg-background">
      <TherapistSidebar />
      <div className="flex-1">
        <DashboardHeader title="יומן פגישות" />
        <main className="space-y-8 p-8">
          <BookingCalendar
            bookings={calendarBookings}
            hasProfile={Boolean(profile)}
          />
          <AiMessageDraft bookings={calendarBookings} />
        </main>
      </div>
    </div>
  )
}
