import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { booking } from "@/lib/schema";

export type Booking = typeof booking.$inferSelect;
export type BookingInsert = typeof booking.$inferInsert;
export type BookingStatus = Booking["status"];

export async function createBooking(input: BookingInsert) {
  const [record] = await db.insert(booking).values(input).returning();

  return record ?? null;
}

export async function listBookingsForProfile(therapistProfileId: string) {
  return db
    .select()
    .from(booking)
    .where(eq(booking.therapistProfileId, therapistProfileId))
    .orderBy(asc(booking.scheduledAt));
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const [record] = await db
    .update(booking)
    .set({ status })
    .where(eq(booking.id, id))
    .returning();

  return record ?? null;
}
