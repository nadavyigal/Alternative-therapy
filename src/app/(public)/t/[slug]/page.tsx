import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import {
  issue,
  modality,
  therapistIssue,
  therapistModality,
  therapistProfile,
} from "@/lib/schema";
import { eq, inArray } from "drizzle-orm";

type ProfilePageProps = {
  params: {
    slug: string;
  };
};

const formatPrice = (min?: number | null, max?: number | null) => {
  if (!min && !max) {
    return "מחיר ייעוץ לפי שיחה";
  }
  if (min && max) {
    return `${min}–${max} ש\"ח`;
  }
  return `${min ?? max} ש\"ח`;
};

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const [profile] = await db
    .select()
    .from(therapistProfile)
    .where(eq(therapistProfile.slug, params.slug))
    .limit(1);

  if (!profile || !profile.published) {
    notFound();
  }

  const [modalities, issues] = await Promise.all([
    db
      .select({ id: therapistModality.modalityId })
      .from(therapistModality)
      .where(eq(therapistModality.therapistProfileId, profile.id)),
    db
      .select({ id: therapistIssue.issueId })
      .from(therapistIssue)
      .where(eq(therapistIssue.therapistProfileId, profile.id)),
  ]);

  const modalityIds = modalities.map((row) => row.id);
  const issueIds = issues.map((row) => row.id);

  const [modalityRows, issueRows] = await Promise.all([
    modalityIds.length
      ? db
          .select({ id: modality.id, nameHe: modality.nameHe })
          .from(modality)
          .where(inArray(modality.id, modalityIds))
      : Promise.resolve([]),
    issueIds.length
      ? db
          .select({ id: issue.id, nameHe: issue.nameHe })
          .from(issue)
          .where(inArray(issue.id, issueIds))
      : Promise.resolve([]),
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold">{profile.displayName}</h1>
        <p className="text-sm text-muted-foreground">
          {profile.city || "מיקום גמיש"} •{" "}
          {profile.isOnline ? "אפשרות אונליין" : "טיפול פרונטלי"}
        </p>
      </div>

      <div className="grid gap-6 rounded-2xl border bg-card p-6 shadow-sm">
        {profile.bio && (
          <div>
            <h2 className="text-lg font-semibold">על המטפל/ת</h2>
            <p className="mt-2 text-sm text-muted-foreground">{profile.bio}</p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold">תעריף</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatPrice(profile.priceMin, profile.priceMax)}
          </p>
        </div>

        {(modalityRows.length > 0 || issueRows.length > 0) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {modalityRows.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold">שיטות טיפול</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {modalityRows.map((item) => item.nameHe).join(", ")}
                </p>
              </div>
            )}
            {issueRows.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold">תחומי טיפול</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {issueRows.map((item) => item.nameHe).join(", ")}
                </p>
              </div>
            )}
          </div>
        )}

        {(profile.whatsappPhone || profile.contactEmail) && (
          <div>
            <h2 className="text-lg font-semibold">יצירת קשר</h2>
            <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
              {profile.whatsappPhone && (
                <span>ווטסאפ: {profile.whatsappPhone}</span>
              )}
              {profile.contactEmail && <span>אימייל: {profile.contactEmail}</span>}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
        השירות אינו מהווה שירות רפואי או חירום. במקרה חירום יש לפנות לגורמי
        הרפואה או החירום המתאימים.
      </div>
    </div>
  );
}
