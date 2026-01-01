import Link from "next/link";

import { and, eq, inArray } from "drizzle-orm";

import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import {
  issue,
  modality,
  therapistIssue,
  therapistModality,
  therapistProfile,
} from "@/lib/schema";
import { listIssues, listModalities } from "@/lib/therapy-taxonomy";

type DirectorySearchParams = {
  city?: string;
  modalityId?: string;
  issueId?: string;
  online?: string;
};

const toOptionalValue = (value?: string) =>
  value ? value.trim() : "";

const isTruthy = (value?: string) => value === "1";

const mapValues = <T,>(rows: T[], key: keyof T) =>
  rows.map((row) => row[key]).filter(Boolean) as string[];

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams?: DirectorySearchParams;
}) {
  const city = toOptionalValue(searchParams?.city);
  const modalityId = toOptionalValue(searchParams?.modalityId);
  const issueId = toOptionalValue(searchParams?.issueId);
  const onlineOnly = isTruthy(searchParams?.online);

  const [modalities, issues] = await Promise.all([
    listModalities(),
    listIssues(),
  ]);

  let profileIdsFilter: string[] | null = null;

  if (modalityId) {
    const rows = await db
      .select({ id: therapistModality.therapistProfileId })
      .from(therapistModality)
      .where(eq(therapistModality.modalityId, modalityId));
    profileIdsFilter = mapValues(rows, "id");
  }

  if (issueId) {
    const rows = await db
      .select({ id: therapistIssue.therapistProfileId })
      .from(therapistIssue)
      .where(eq(therapistIssue.issueId, issueId));
    const issueProfileIds = mapValues(rows, "id");
    profileIdsFilter = profileIdsFilter
      ? profileIdsFilter.filter((id) => issueProfileIds.includes(id))
      : issueProfileIds;
  }

  const filters = [eq(therapistProfile.published, true)];

  if (city) {
    filters.push(eq(therapistProfile.city, city));
  }

  if (onlineOnly) {
    filters.push(eq(therapistProfile.isOnline, true));
  }

  if (profileIdsFilter && profileIdsFilter.length === 0) {
    profileIdsFilter = ["__none__"];
  }

  if (profileIdsFilter) {
    filters.push(inArray(therapistProfile.id, profileIdsFilter));
  }

  const profiles = await db
    .select()
    .from(therapistProfile)
    .where(and(...filters))
    .orderBy(therapistProfile.displayName);

  const profileIds = profiles.map((profile) => profile.id);
  const modalityRows = profileIds.length
    ? await db
        .select({
          profileId: therapistModality.therapistProfileId,
          id: modality.id,
          nameHe: modality.nameHe,
        })
        .from(therapistModality)
        .innerJoin(modality, eq(therapistModality.modalityId, modality.id))
        .where(inArray(therapistModality.therapistProfileId, profileIds))
    : [];
  const issueRows = profileIds.length
    ? await db
        .select({
          profileId: therapistIssue.therapistProfileId,
          id: issue.id,
          nameHe: issue.nameHe,
        })
        .from(therapistIssue)
        .innerJoin(issue, eq(therapistIssue.issueId, issue.id))
        .where(inArray(therapistIssue.therapistProfileId, profileIds))
    : [];

  const modalitiesByProfile = new Map<string, typeof modalityRows>();
  for (const row of modalityRows) {
    const list = modalitiesByProfile.get(row.profileId) ?? [];
    list.push(row);
    modalitiesByProfile.set(row.profileId, list);
  }

  const issuesByProfile = new Map<string, typeof issueRows>();
  for (const row of issueRows) {
    const list = issuesByProfile.get(row.profileId) ?? [];
    list.push(row);
    issuesByProfile.set(row.profileId, list);
  }

  const formatPrice = (min?: number | null, max?: number | null) => {
    if (!min && !max) {
      return "מחיר ייעוץ לפי שיחה";
    }
    if (min && max) {
      return `${min}–${max} ש"ח`;
    }
    return `${min ?? max} ש"ח`;
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold">ספריית מטפלים</h1>
        <p className="text-sm text-muted-foreground">
          מצאו מטפל/ת לפי התמחות, מיקום וסוג טיפול.
        </p>
      </div>

      <form
        className="mb-10 grid gap-4 rounded-2xl border bg-card p-6 shadow-sm md:grid-cols-4"
        method="get"
      >
        <div className="grid gap-2">
          <label htmlFor="city" className="text-sm font-medium">
            עיר
          </label>
          <Input
            id="city"
            name="city"
            placeholder="לדוגמה: ירושלים"
            defaultValue={city}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="modalityId" className="text-sm font-medium">
            שיטת טיפול
          </label>
          <select
            id="modalityId"
            name="modalityId"
            defaultValue={modalityId}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">כל השיטות</option>
            {modalities.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nameHe}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label htmlFor="issueId" className="text-sm font-medium">
            תחום טיפול
          </label>
          <select
            id="issueId"
            name="issueId"
            defaultValue={issueId}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">כל התחומים</option>
            {issues.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nameHe}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-between gap-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="online"
              value="1"
              defaultChecked={onlineOnly}
              className="h-4 w-4 accent-teal-600"
            />
            טיפול אונליין בלבד
          </label>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-4 text-sm font-semibold text-white hover:bg-teal-500"
            >
              חיפוש
            </button>
            <Link
              href="/directory"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              ניקוי פילטרים
            </Link>
          </div>
        </div>
      </form>

      {profiles.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          לא נמצאו מטפלים לפי המסננים שבחרת.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {profiles.map((profile) => {
            const profileModalities = modalitiesByProfile.get(profile.id) ?? [];
            const profileIssues = issuesByProfile.get(profile.id) ?? [];

            return (
              <div
                key={profile.id}
                className="rounded-2xl border bg-card p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{profile.displayName}</h2>
                    <p className="text-sm text-muted-foreground">
                      {profile.city || "מיקום גמיש"} •{" "}
                      {profile.isOnline ? "כולל אונליין" : "פרונטלי בלבד"}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-teal-700">
                    {formatPrice(profile.priceMin, profile.priceMax)}
                  </span>
                </div>

                {profile.bio && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {profile.bio}
                  </p>
                )}

                <div className="mt-4 grid gap-3 text-sm">
                  {profileModalities.length > 0 && (
                    <div>
                      <span className="font-semibold">שיטות:</span>{" "}
                      {profileModalities.map((item) => item.nameHe).join(", ")}
                    </div>
                  )}
                  {profileIssues.length > 0 && (
                    <div>
                      <span className="font-semibold">תחומים:</span>{" "}
                      {profileIssues.map((item) => item.nameHe).join(", ")}
                    </div>
                  )}
                  {(profile.whatsappPhone || profile.contactEmail) && (
                    <div className="flex flex-wrap gap-3 text-sm">
                      {profile.whatsappPhone && (
                        <span>ווטסאפ: {profile.whatsappPhone}</span>
                      )}
                      {profile.contactEmail && (
                        <span>אימייל: {profile.contactEmail}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/t/${profile.slug}`}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-teal-200 bg-teal-50 px-4 text-sm font-semibold text-teal-800 hover:bg-teal-100"
                  >
                    לצפייה בפרופיל
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10 rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
        השירות אינו מהווה שירות רפואי או חירום. במקרה חירום יש לפנות לגורמי
        הרפואה או החירום המתאימים.
      </div>
    </div>
  );
}
