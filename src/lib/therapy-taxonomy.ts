import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  issue,
  modality,
  therapistIssue,
  therapistModality,
} from "@/lib/schema";

const uniqueValues = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean)));

export async function listModalities() {
  return db.select().from(modality).orderBy(asc(modality.nameHe));
}

export async function listIssues() {
  return db.select().from(issue).orderBy(asc(issue.nameHe));
}

export async function getTherapistModalities(therapistProfileId: string) {
  return db
    .select()
    .from(modality)
    .innerJoin(
      therapistModality,
      eq(modality.id, therapistModality.modalityId)
    )
    .where(eq(therapistModality.therapistProfileId, therapistProfileId))
    .orderBy(asc(modality.nameHe));
}

export async function getTherapistIssues(therapistProfileId: string) {
  return db
    .select()
    .from(issue)
    .innerJoin(therapistIssue, eq(issue.id, therapistIssue.issueId))
    .where(eq(therapistIssue.therapistProfileId, therapistProfileId))
    .orderBy(asc(issue.nameHe));
}

export async function setTherapistModalities(
  therapistProfileId: string,
  modalityIds: string[]
) {
  const uniqueIds = uniqueValues(modalityIds);

  await db.transaction(async (tx) => {
    await tx
      .delete(therapistModality)
      .where(eq(therapistModality.therapistProfileId, therapistProfileId));

    if (uniqueIds.length === 0) {
      return;
    }

    await tx.insert(therapistModality).values(
      uniqueIds.map((modalityId) => ({
        therapistProfileId,
        modalityId,
      }))
    );
  });
}

export async function setTherapistIssues(
  therapistProfileId: string,
  issueIds: string[]
) {
  const uniqueIds = uniqueValues(issueIds);

  await db.transaction(async (tx) => {
    await tx
      .delete(therapistIssue)
      .where(eq(therapistIssue.therapistProfileId, therapistProfileId));

    if (uniqueIds.length === 0) {
      return;
    }

    await tx.insert(therapistIssue).values(
      uniqueIds.map((issueId) => ({
        therapistProfileId,
        issueId,
      }))
    );
  });
}
