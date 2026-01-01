import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { credential } from "@/lib/schema";

export type Credential = typeof credential.$inferSelect;
export type CredentialInsert = typeof credential.$inferInsert;

export async function createCredential(input: CredentialInsert) {
  const [record] = await db.insert(credential).values(input).returning();
  return record ?? null;
}

export async function listCredentialsForProfile(therapistProfileId: string) {
  return db
    .select()
    .from(credential)
    .where(eq(credential.therapistProfileId, therapistProfileId))
    .orderBy(desc(credential.createdAt));
}
