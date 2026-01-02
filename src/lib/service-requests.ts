import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { serviceRequest } from "@/lib/schema";

export type ServiceRequest = typeof serviceRequest.$inferSelect;
export type ServiceRequestInsert = typeof serviceRequest.$inferInsert;
export type ServiceRequestStatus = ServiceRequest["status"];

export async function createServiceRequest(input: ServiceRequestInsert) {
  const [record] = await db.insert(serviceRequest).values(input).returning();
  return record ?? null;
}

export async function listServiceRequestsForProfile(
  therapistProfileId: string
) {
  return db
    .select()
    .from(serviceRequest)
    .where(eq(serviceRequest.therapistProfileId, therapistProfileId))
    .orderBy(desc(serviceRequest.createdAt));
}

export async function updateServiceRequestStatus(
  id: string,
  status: ServiceRequestStatus
) {
  const [record] = await db
    .update(serviceRequest)
    .set({ status })
    .where(eq(serviceRequest.id, id))
    .returning();

  return record ?? null;
}

export async function assignServiceRequestPartner(
  id: string,
  partnerId: string | null
) {
  const [record] = await db
    .update(serviceRequest)
    .set({ partnerId })
    .where(eq(serviceRequest.id, id))
    .returning();

  return record ?? null;
}
