import { and, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { partner, serviceRequest, therapistProfile, user } from "@/lib/schema";

export type ServiceRequest = typeof serviceRequest.$inferSelect;
export type ServiceRequestInsert = typeof serviceRequest.$inferInsert;
export type ServiceRequestStatus = ServiceRequest["status"];
export type ServiceRequestQueueItem = {
  serviceRequest: ServiceRequest;
  therapistProfile: typeof therapistProfile.$inferSelect;
  user: typeof user.$inferSelect;
  partner: typeof partner.$inferSelect | null;
};
export type ServiceRequestWithPartner = {
  serviceRequest: ServiceRequest;
  partner: typeof partner.$inferSelect | null;
};

type ServiceRequestAdminFilters = {
  status?: ServiceRequestStatus;
  category?: string;
  partnerId?: string | null;
};

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

export async function listServiceRequestsForProfileWithPartner(
  therapistProfileId: string
) {
  return db
    .select({ serviceRequest, partner })
    .from(serviceRequest)
    .leftJoin(partner, eq(serviceRequest.partnerId, partner.id))
    .where(eq(serviceRequest.therapistProfileId, therapistProfileId))
    .orderBy(desc(serviceRequest.createdAt));
}

export async function listServiceRequestsForAdmin(
  filters: ServiceRequestAdminFilters = {}
) {
  const { status, category, partnerId } = filters;
  const whereClause = and(
    status ? eq(serviceRequest.status, status) : undefined,
    category ? eq(serviceRequest.category, category) : undefined,
    partnerId === null
      ? isNull(serviceRequest.partnerId)
      : partnerId
        ? eq(serviceRequest.partnerId, partnerId)
        : undefined
  );

  return db
    .select({
      serviceRequest,
      therapistProfile,
      user,
      partner,
    })
    .from(serviceRequest)
    .innerJoin(
      therapistProfile,
      eq(serviceRequest.therapistProfileId, therapistProfile.id)
    )
    .innerJoin(user, eq(therapistProfile.userId, user.id))
    .leftJoin(partner, eq(serviceRequest.partnerId, partner.id))
    .where(whereClause)
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
