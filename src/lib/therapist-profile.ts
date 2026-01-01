import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { therapistProfile } from "@/lib/schema";

export type TherapistProfile = typeof therapistProfile.$inferSelect;
export type TherapistProfileInsert = typeof therapistProfile.$inferInsert;
export type TherapistProfileUpdate = Partial<
  Omit<TherapistProfileInsert, "id" | "userId" | "createdAt" | "updatedAt">
>;

const stripUndefined = <T extends Record<string, unknown>>(input: T) =>
  Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  ) as Partial<T>;

export async function getTherapistProfileByUserId(userId: string) {
  const [profile] = await db
    .select()
    .from(therapistProfile)
    .where(eq(therapistProfile.userId, userId))
    .limit(1);

  return profile ?? null;
}

export async function getTherapistProfileBySlug(slug: string) {
  const [profile] = await db
    .select()
    .from(therapistProfile)
    .where(eq(therapistProfile.slug, slug))
    .limit(1);

  return profile ?? null;
}

export async function createTherapistProfile(input: TherapistProfileInsert) {
  const [profile] = await db
    .insert(therapistProfile)
    .values(input)
    .returning();

  return profile ?? null;
}

export async function updateTherapistProfile(
  userId: string,
  input: TherapistProfileUpdate
) {
  const updates = stripUndefined(input);

  if (Object.keys(updates).length === 0) {
    return getTherapistProfileByUserId(userId);
  }

  const [profile] = await db
    .update(therapistProfile)
    .set(updates)
    .where(eq(therapistProfile.userId, userId))
    .returning();

  return profile ?? null;
}
