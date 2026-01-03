import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  listCredentialsForAdmin,
  updateCredentialStatus,
  type CredentialQueueItem,
  type CredentialStatus,
} from "@/lib/credentials";
import { requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const STATUS_LABELS: Record<CredentialStatus, string> = {
  pending: "ממתין",
  approved: "אושר",
  rejected: "נדחה",
};

const STATUS_STYLES: Record<CredentialStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

const DOCUMENT_LABELS: Record<string, string> = {
  professional: "תעודה מקצועית",
  insurance: "אישור ביטוח",
};

const formatDateTime = (value: Date | string) => {
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleString("he-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMetadata = (row: CredentialQueueItem) => {
  const { credential } = row;
  const parts = [
    DOCUMENT_LABELS[credential.documentType] ?? "מסמך",
    credential.issuer ? `מנפיק: ${credential.issuer}` : null,
    credential.issuedYear ? `שנת הנפקה: ${credential.issuedYear}` : null,
  ].filter(Boolean);

  return parts.join(" · ");
};

export default async function AdminCredentialsPage() {
  const credentials = await listCredentialsForAdmin("pending");
  const pendingCount = credentials.length;

  async function handleStatusUpdate(formData: FormData) {
    "use server";
    const session = await requireRole("admin");
    const credentialId = String(formData.get("credentialId") ?? "").trim();
    const nextStatus = String(formData.get("nextStatus") ?? "").trim();

    if (!credentialId || (nextStatus !== "approved" && nextStatus !== "rejected")) {
      redirect("/credentials");
    }

    await updateCredentialStatus(
      credentialId,
      nextStatus as CredentialStatus,
      session.user.id
    );

    revalidatePath("/credentials");
    redirect("/credentials");
  }

  return (
    <div dir="rtl" className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold">אימות תעודות מטפלים</h1>
        <p className="text-sm text-muted-foreground">
          בדקו את המסמכים שהועלו ואשרו או דחו את האימות.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            בקשות אימות ממתינות
            <Badge variant="secondary">{pendingCount}</Badge>
          </CardTitle>
          <CardDescription>
            כל אישור או דחייה יעדכנו את סטטוס התעודה ואת פרופיל המטפל.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {credentials.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              אין כרגע תעודות ממתינות לאימות.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="p-4 text-start text-sm font-medium">מטפל/ת</th>
                    <th className="p-4 text-start text-sm font-medium">
                      פרטי תעודה
                    </th>
                    <th className="p-4 text-start text-sm font-medium">
                      הוגש בתאריך
                    </th>
                    <th className="p-4 text-start text-sm font-medium">סטטוס</th>
                    <th className="p-4 text-start text-sm font-medium">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {credentials.map((row) => {
                    const { credential, therapistProfile, user } = row;
                    const metadata = formatMetadata(row);
                    const title =
                      credential.title ||
                      DOCUMENT_LABELS[credential.documentType] ||
                      "מסמך ללא כותרת";

                    return (
                      <tr
                        key={credential.id}
                        className="border-b border-border align-top"
                      >
                        <td className="p-4">
                          <div className="font-medium">
                            {therapistProfile.displayName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.email}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="font-medium">{title}</div>
                            {metadata ? (
                              <div className="text-xs text-muted-foreground">
                                {metadata}
                              </div>
                            ) : null}
                            <a
                              href={credential.fileUrl}
                              className="text-xs font-medium text-teal-700 hover:underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              צפייה בקובץ
                            </a>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatDateTime(credential.createdAt)}
                        </td>
                        <td className="p-4">
                          <Badge className={STATUS_STYLES[credential.status]}>
                            {STATUS_LABELS[credential.status]}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            <form action={handleStatusUpdate}>
                              <input
                                type="hidden"
                                name="credentialId"
                                value={credential.id}
                              />
                              <input
                                type="hidden"
                                name="nextStatus"
                                value="approved"
                              />
                              <Button size="sm">אשר</Button>
                            </form>
                            <form action={handleStatusUpdate}>
                              <input
                                type="hidden"
                                name="credentialId"
                                value={credential.id}
                              />
                              <input
                                type="hidden"
                                name="nextStatus"
                                value="rejected"
                              />
                              <Button size="sm" variant="outline">
                                דחה
                              </Button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
