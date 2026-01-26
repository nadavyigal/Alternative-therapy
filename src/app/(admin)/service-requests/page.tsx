import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listPartners } from "@/lib/partners";
import {
  assignServiceRequestPartner,
  listServiceRequestsForAdmin,
  updateServiceRequestStatus,
  type ServiceRequestStatus,
} from "@/lib/service-requests";
import { requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const STATUS_LABELS: Record<ServiceRequestStatus, string> = {
  sent: "נשלח",
  contacted: "נוצר קשר",
  converted: "הומר",
  lost: "אבוד",
};

const STATUS_STYLES: Record<ServiceRequestStatus, string> = {
  sent: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  converted: "bg-emerald-100 text-emerald-800",
  lost: "bg-rose-100 text-rose-800",
};

const CATEGORY_LABELS: Record<string, string> = {
  insurance: "ביטוח",
  tax: "מס",
  pension: "פנסיה",
};

const STATUS_ORDER: ServiceRequestStatus[] = [
  "sent",
  "contacted",
  "converted",
  "lost",
];

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

const isServiceRequestStatus = (
  value?: string
): value is ServiceRequestStatus =>
  value === "sent" ||
  value === "contacted" ||
  value === "converted" ||
  value === "lost";

const isCategory = (value?: string) =>
  Boolean(value && CATEGORY_LABELS[value]);

type AdminServiceRequestsPageProps = {
  searchParams: Promise<{
    status?: string;
    partner?: string;
    category?: string;
  }>;
};

export default async function AdminServiceRequestsPage({
  searchParams,
}: AdminServiceRequestsPageProps) {
  const resolvedParams = await searchParams;
  const statusFilter = isServiceRequestStatus(resolvedParams?.status)
    ? resolvedParams?.status
    : undefined;
  const categoryFilter = isCategory(resolvedParams?.category)
    ? resolvedParams?.category
    : undefined;
  const partnerFilter = resolvedParams?.partner ?? "all";
  const partnerId =
    partnerFilter === "all"
      ? undefined
      : partnerFilter === "unassigned"
        ? null
        : partnerFilter;

  const adminFilters: Parameters<typeof listServiceRequestsForAdmin>[0] = {};
  if (statusFilter) adminFilters.status = statusFilter;
  if (categoryFilter) adminFilters.category = categoryFilter;
  if (partnerId !== undefined) adminFilters.partnerId = partnerId;

  const [requests, partners] = await Promise.all([
    listServiceRequestsForAdmin(adminFilters),
    listPartners(),
  ]);

  const filters = new URLSearchParams();
  if (statusFilter) {
    filters.set("status", statusFilter);
  }
  if (categoryFilter) {
    filters.set("category", categoryFilter);
  }
  if (partnerFilter && partnerFilter !== "all") {
    filters.set("partner", partnerFilter);
  }

  const queryString = filters.toString();
  const returnTo = queryString
    ? `/service-requests?${queryString}`
    : "/service-requests";
  const exportHref = queryString
    ? `/api/service-requests/export?${queryString}`
    : "/api/service-requests/export";

  async function handleStatusUpdate(formData: FormData) {
    "use server";
    await requireRole("admin");
    const requestId = String(formData.get("requestId") ?? "").trim();
    const nextStatus = String(formData.get("nextStatus") ?? "").trim();
    const redirectTo = String(formData.get("returnTo") ?? "/service-requests");
    const safeRedirect = redirectTo.startsWith("/service-requests")
      ? redirectTo
      : "/service-requests";

    if (!requestId || !isServiceRequestStatus(nextStatus)) {
      redirect(safeRedirect);
    }

    await updateServiceRequestStatus(requestId, nextStatus);
    revalidatePath("/service-requests");
    redirect(safeRedirect);
  }

  async function handlePartnerUpdate(formData: FormData) {
    "use server";
    await requireRole("admin");
    const requestId = String(formData.get("requestId") ?? "").trim();
    const partnerValue = String(formData.get("partnerId") ?? "").trim();
    const redirectTo = String(formData.get("returnTo") ?? "/service-requests");
    const safeRedirect = redirectTo.startsWith("/service-requests")
      ? redirectTo
      : "/service-requests";

    if (!requestId) {
      redirect(safeRedirect);
    }

    await assignServiceRequestPartner(
      requestId,
      partnerValue.length > 0 ? partnerValue : null
    );
    revalidatePath("/service-requests");
    redirect(safeRedirect);
  }

  return (
    <div dir="rtl" className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold">ניהול בקשות שירות</h1>
        <p className="text-sm text-muted-foreground">
          עקבו אחרי בקשות הפניה, שייכו שותפים ועדכנו סטטוסים בזמן אמת.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>סינון ותצוגה</CardTitle>
          <CardDescription>
            בחרו סטטוס, קטגוריה או שותף כדי להתמקד בבקשות הרלוונטיות.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-4" method="get">
            <div className="space-y-2">
              <label className="text-sm font-medium">סטטוס</label>
              <select
                name="status"
                defaultValue={statusFilter ?? "all"}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">הכל</option>
                {STATUS_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">קטגוריה</label>
              <select
                name="category"
                defaultValue={categoryFilter ?? "all"}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">הכל</option>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">שותף</label>
              <select
                name="partner"
                defaultValue={partnerFilter}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">הכל</option>
                <option value="unassigned">ללא שיוך</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-3">
              <Button type="submit" size="sm">
                סנן
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href="/service-requests">נקה</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              בקשות פעילות
              <Badge variant="secondary">{requests.length}</Badge>
            </CardTitle>
            <CardDescription>
              עדכנו סטטוסים, הצמידו שותף ובדקו פרטי בקשה.
            </CardDescription>
          </div>
          <Button asChild size="sm" variant="outline">
            <a href={exportHref}>ייצוא CSV</a>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              אין בקשות שירות שמתאימות למסננים שבחרתם.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="p-4 text-start text-sm font-medium">
                      מטפל/ת
                    </th>
                    <th className="p-4 text-start text-sm font-medium">בקשה</th>
                    <th className="p-4 text-start text-sm font-medium">שותף</th>
                    <th className="p-4 text-start text-sm font-medium">
                      סטטוס
                    </th>
                    <th className="p-4 text-start text-sm font-medium">
                      תאריך
                    </th>
                    <th className="p-4 text-start text-sm font-medium">
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(({ serviceRequest, therapistProfile, user, partner }) => {
                    const categoryLabel =
                      CATEGORY_LABELS[serviceRequest.category] ??
                      serviceRequest.category;
                    const details =
                      serviceRequest.details?.trim() || "ללא פירוט נוסף";

                    return (
                      <tr
                        key={serviceRequest.id}
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
                            <div className="font-medium">{categoryLabel}</div>
                            <div className="text-xs text-muted-foreground">
                              {details}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-2">
                            <div className="text-sm">
                              {partner?.name ?? "ללא שותף"}
                            </div>
                            <form
                              action={handlePartnerUpdate}
                              className="flex flex-wrap gap-2"
                            >
                              <input
                                type="hidden"
                                name="requestId"
                                value={serviceRequest.id}
                              />
                              <input
                                type="hidden"
                                name="returnTo"
                                value={returnTo}
                              />
                              <select
                                name="partnerId"
                                defaultValue={serviceRequest.partnerId ?? ""}
                                className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                              >
                                <option value="">ללא שיוך</option>
                                {partners.map((partnerOption) => (
                                  <option
                                    key={partnerOption.id}
                                    value={partnerOption.id}
                                  >
                                    {partnerOption.name}
                                  </option>
                                ))}
                              </select>
                              <Button size="sm" variant="outline">
                                עדכן
                              </Button>
                            </form>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={STATUS_STYLES[serviceRequest.status]}>
                            {STATUS_LABELS[serviceRequest.status]}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatDateTime(serviceRequest.createdAt)}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {STATUS_ORDER.map((status) => (
                              <form action={handleStatusUpdate} key={status}>
                                <input
                                  type="hidden"
                                  name="requestId"
                                  value={serviceRequest.id}
                                />
                                <input
                                  type="hidden"
                                  name="nextStatus"
                                  value={status}
                                />
                                <input
                                  type="hidden"
                                  name="returnTo"
                                  value={returnTo}
                                />
                                <Button
                                  size="sm"
                                  variant={
                                    serviceRequest.status === status
                                      ? "default"
                                      : "outline"
                                  }
                                  disabled={serviceRequest.status === status}
                                >
                                  {STATUS_LABELS[status]}
                                </Button>
                              </form>
                            ))}
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
