import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { partner } from "@/lib/schema";

export type Partner = typeof partner.$inferSelect;
export type PartnerInsert = typeof partner.$inferInsert;

export async function createPartner(input: PartnerInsert) {
  const [record] = await db.insert(partner).values(input).returning();
  return record ?? null;
}

export async function listPartners() {
  return db.select().from(partner).orderBy(asc(partner.name));
}

export async function getPartnerById(id: string) {
  const [record] = await db
    .select()
    .from(partner)
    .where(eq(partner.id, id))
    .limit(1);

  return record ?? null;
}
