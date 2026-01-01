import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/therapist/profile-form/profile-form";
import { createCredential } from "@/lib/credentials";
import { requireRole } from "@/lib/rbac";
import { upload } from "@/lib/storage";
import {
  createTherapistProfile,
  getTherapistProfileByUserId,
  updateTherapistProfile,
} from "@/lib/therapist-profile";
import {
  getTherapistIssues,
  getTherapistModalities,
  ensureModality,
  listIssues,
  listModalities,
  setTherapistIssues,
  setTherapistModalities,
} from "@/lib/therapy-taxonomy";

type ProfilePageProps = {
  searchParams?: {
    saved?: string;
    error?: string;
  };
};

const toStringValue = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const toOptionalNumber = (value: string) => {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toOptionalText = (value: string) => (value ? value : null);

const toOptionalYear = (value: string) => {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  if (parsed < 1900 || parsed > currentYear) {
    return null;
  }

  return parsed;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\u0590-\u05ff-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const toIdList = (entries: FormDataEntryValue[]) =>
  entries.filter((entry): entry is string => typeof entry === "string");

const PROFILE_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const PROFILE_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const INSURANCE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);
const INSURANCE_EXTENSIONS = new Set([".pdf", ".jpg", ".jpeg", ".png"]);
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

const isAllowedFile = (
  file: File,
  allowedTypes: Set<string>,
  allowedExtensions: Set<string>
) => {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  const mimeAllowed = file.type ? allowedTypes.has(file.type) : false;
  return allowedExtensions.has(extension) || mimeAllowed;
};

export default async function TherapistProfilePage({
  searchParams,
}: ProfilePageProps) {
  const session = await requireRole("therapist");
  const [profile, modalities, issues] = await Promise.all([
    getTherapistProfileByUserId(session.user.id),
    listModalities(),
    listIssues(),
  ]);

  const [selectedModalities, selectedIssues] = await Promise.all([
    profile ? getTherapistModalities(profile.id) : Promise.resolve([]),
    profile ? getTherapistIssues(profile.id) : Promise.resolve([]),
  ]);

  const selectedModalityIds = new Set(
    selectedModalities.map((row) => row.modality.id)
  );
  const selectedIssueIds = new Set(selectedIssues.map((row) => row.issue.id));

  const statusMessage = (() => {
    if (searchParams?.saved) {
      return (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          הפרופיל נשמר בהצלחה.
        </div>
      );
    }

    if (searchParams?.error === "displayName") {
      return (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          יש להזין שם תצוגה כדי לשמור את הפרופיל.
        </div>
      );
    }

    if (searchParams?.error === "phone") {
      return (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          כדי לפרסם את הפרופיל יש לאמת מספר טלפון.
        </div>
      );
    }

    if (searchParams?.error) {
      return (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          לא הצלחנו לשמור את הפרופיל. נסו שוב.
        </div>
      );
    }

    return null;
  })();

  async function saveProfile(formData: FormData) {
    "use server";
    const freshSession = await requireRole("therapist");
    const displayName = toStringValue(formData, "displayName");

    if (!displayName) {
      redirect("/therapist/profile?error=displayName");
    }

    const slugInput = toStringValue(formData, "slug");
    const slug = slugify(slugInput || displayName);

    if (!slug) {
      redirect("/therapist/profile?error=slug");
    }

    const bio = toOptionalText(toStringValue(formData, "bio"));
    const city = toOptionalText(toStringValue(formData, "city"));
    const whatsappPhone = toOptionalText(toStringValue(formData, "whatsappPhone"));
    const contactEmail = toOptionalText(toStringValue(formData, "contactEmail"));
    const startedTreatingYear = toOptionalYear(
      toStringValue(formData, "startedTreatingYear")
    );
    const languagesRaw = toStringValue(formData, "languages");
    const languages = languagesRaw
      ? languagesRaw
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : null;
    const offersOnline = formData.get("offersOnline") === "on";
    const offersInPerson = formData.get("offersInPerson") === "on";
    const availableDays = toIdList(formData.getAll("availableDays"));
    const noInsurance = formData.get("noInsurance") === "on";

    const wantsPublished = formData.get("published") === "on";
    const phoneVerified = Boolean(
      (freshSession.user as { phoneVerified?: boolean }).phoneVerified
    );

    const profilePayload = {
      displayName,
      slug,
      bio,
      city,
      startedTreatingYear,
      offersOnline,
      offersInPerson,
      availableDays: availableDays.length > 0 ? availableDays : null,
      isOnline: offersOnline,
      priceMin: toOptionalNumber(toStringValue(formData, "priceMin")),
      priceMax: toOptionalNumber(toStringValue(formData, "priceMax")),
      languages,
      whatsappPhone,
      contactEmail,
      published: phoneVerified ? wantsPublished : false,
    };

    try {
      const profileImageFile = formData.get("profileImage");
      let profileImageUrl: string | null = null;
      if (profileImageFile instanceof File && profileImageFile.size > 0) {
        if (profileImageFile.size > MAX_UPLOAD_SIZE) {
          redirect("/therapist/profile?error=save");
        }
        if (
          !isAllowedFile(
            profileImageFile,
            PROFILE_IMAGE_TYPES,
            PROFILE_IMAGE_EXTENSIONS
          )
        ) {
          redirect("/therapist/profile?error=save");
        }

        const buffer = Buffer.from(await profileImageFile.arrayBuffer());
        const { url } = await upload(buffer, profileImageFile.name, "profile-images", {
          maxSize: MAX_UPLOAD_SIZE,
        });
        profileImageUrl = url;
      }

      const existing = await getTherapistProfileByUserId(freshSession.user.id);
      const insuranceStatus = noInsurance
        ? "none"
        : existing?.insuranceStatus === "none"
          ? "unknown"
          : undefined;
      const record = existing
        ? await updateTherapistProfile(freshSession.user.id, {
            ...profilePayload,
            ...(insuranceStatus ? { insuranceStatus } : {}),
            ...(profileImageUrl ? { profileImageUrl } : {}),
          })
        : await createTherapistProfile({
            ...profilePayload,
            ...(insuranceStatus ? { insuranceStatus } : {}),
            ...(profileImageUrl ? { profileImageUrl } : {}),
            userId: freshSession.user.id,
          });

      if (!record) {
        redirect("/therapist/profile?error=save");
      }

      const customModalitiesRaw = toStringValue(formData, "customModalities");
      const customNames = customModalitiesRaw
        ? customModalitiesRaw.split(",").map((item) => item.trim()).filter(Boolean)
        : [];
      const createdModalities = await Promise.all(
        customNames.map((name) => ensureModality(name, freshSession.user.id))
      );
      const customModalityIds = createdModalities
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .map((item) => item.id);
      const selectedModalityIds = toIdList(formData.getAll("modalityIds"));
      const modalityIds = Array.from(
        new Set([...selectedModalityIds, ...customModalityIds])
      );

      await Promise.all([
        setTherapistModalities(record.id, modalityIds),
        setTherapistIssues(
          record.id,
          toIdList(formData.getAll("issueIds"))
        ),
      ]);

      const insuranceFile = formData.get("insuranceFile");
      if (insuranceFile instanceof File && insuranceFile.size > 0) {
        if (insuranceFile.size > MAX_UPLOAD_SIZE) {
          redirect("/therapist/profile?error=save");
        }
        if (
          !isAllowedFile(
            insuranceFile,
            INSURANCE_TYPES,
            INSURANCE_EXTENSIONS
          )
        ) {
          redirect("/therapist/profile?error=save");
        }

        const buffer = Buffer.from(await insuranceFile.arrayBuffer());
        const { url } = await upload(buffer, insuranceFile.name, "credentials", {
          maxSize: MAX_UPLOAD_SIZE,
        });

        await createCredential({
          therapistProfileId: record.id,
          fileUrl: url,
          documentType: "insurance",
        });

        await updateTherapistProfile(freshSession.user.id, {
          insuranceStatus: "insured",
        });
      }

      if (wantsPublished && !phoneVerified) {
        redirect("/therapist/profile?error=phone");
      }

      redirect("/therapist/profile?saved=1");
    } catch {
      redirect("/therapist/profile?error=save");
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold">בניית פרופיל מטפל</h1>
        <p className="text-sm text-muted-foreground">
          עדכן/י את הפרטים כדי להופיע בספריית המטפלים.
        </p>
      </div>

      <ProfileForm
        action={saveProfile}
        profile={profile}
        modalities={modalities}
        issues={issues}
        selectedModalityIds={selectedModalityIds}
        selectedIssueIds={selectedIssueIds}
        statusMessage={statusMessage}
      />
    </div>
  );
}
