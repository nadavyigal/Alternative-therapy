import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { credential, therapistProfile, user } from "@/lib/schema";

export type Credential = typeof credential.$inferSelect;
export type CredentialInsert = typeof credential.$inferInsert;
export type CredentialStatus = Credential["status"];

export type CredentialQueueItem = {
  credential: Credential;
  therapistProfile: typeof therapistProfile.$inferSelect;
  user: typeof user.$inferSelect;
};

const INSURANCE_STATUS_BY_CREDENTIAL_STATUS: Record<
  CredentialStatus,
  string | null
> = {
  pending: null,
  approved: "verified",
  rejected: "rejected",
};

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

export async function listCredentialsForAdmin(status?: CredentialStatus) {
  let query = db
    .select({
      credential,
      therapistProfile,
      user,
    })
    .from(credential)
    .innerJoin(
      therapistProfile,
      eq(credential.therapistProfileId, therapistProfile.id)
    )
    .innerJoin(user, eq(therapistProfile.userId, user.id))
    .orderBy(desc(credential.createdAt));

  if (status) {
    query = query.where(eq(credential.status, status));
  }

  return query;
}

export async function updateCredentialStatus(
  credentialId: string,
  status: CredentialStatus,
  verifiedBy: string
) {
  const [record] = await db
    .update(credential)
    .set({ status, verifiedBy, verifiedAt: new Date() })
    .where(and(eq(credential.id, credentialId), eq(credential.status, "pending")))
    .returning();

  if (!record) {
    return null;
  }

  if (record.documentType === "insurance") {
    const insuranceStatus = INSURANCE_STATUS_BY_CREDENTIAL_STATUS[status];
    if (insuranceStatus) {
      await db
        .update(therapistProfile)
        .set({ insuranceStatus })
        .where(eq(therapistProfile.id, record.therapistProfileId));
    }
  }

  return record;
}
