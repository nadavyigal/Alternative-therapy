import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { normalizeIsraeliPhone } from "@/lib/phone-verification";
import { lead } from "@/lib/schema";

export type Lead = typeof lead.$inferSelect;
export type LeadInsert = typeof lead.$inferInsert;
export type LeadStatus = Lead["status"];

export async function createLead(input: LeadInsert) {
  const normalizedPhone = normalizeIsraeliPhone(input.clientPhone);
  const [record] = await db
    .insert(lead)
    .values({ ...input, clientPhone: normalizedPhone })
    .returning();

  return record ?? null;
}

export async function listLeadsForProfile(therapistProfileId: string) {
  return db
    .select()
    .from(lead)
    .where(eq(lead.therapistProfileId, therapistProfileId))
    .orderBy(desc(lead.createdAt));
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const [record] = await db
    .update(lead)
    .set({ status })
    .where(eq(lead.id, id))
    .returning();

  return record ?? null;
}
