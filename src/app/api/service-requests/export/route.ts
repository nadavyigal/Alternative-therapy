import { NextResponse } from "next/server";

import {
  listServiceRequestsForAdmin,
  type ServiceRequestStatus,
} from "@/lib/service-requests";
import { requireRole } from "@/lib/rbac";

const STATUS_OPTIONS: ServiceRequestStatus[] = [
  "sent",
  "contacted",
  "converted",
  "lost",
];

const CATEGORY_OPTIONS = ["insurance", "tax", "pension"] as const;

const isStatus = (value: string | null): value is ServiceRequestStatus =>
  value !== null && STATUS_OPTIONS.includes(value as ServiceRequestStatus);

const isCategory = (
  value: string | null
): value is (typeof CATEGORY_OPTIONS)[number] =>
  value !== null && CATEGORY_OPTIONS.includes(value as (typeof CATEGORY_OPTIONS)[number]);

const toCsvValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value);
  if (text.includes('"') || text.includes(",") || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
};

export async function GET(request: Request) {
  try {
    await requireRole("admin");
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const categoryParam = searchParams.get("category");
  const status = isStatus(statusParam) ? statusParam : undefined;
  const category = isCategory(categoryParam) ? categoryParam : undefined;
  const partnerParam = searchParams.get("partner");
  const partnerId =
    partnerParam === "unassigned"
      ? null
      : partnerParam && partnerParam !== "all"
        ? partnerParam
        : undefined;

  const requests = await listServiceRequestsForAdmin({
    status,
    category,
    partnerId,
  });

  const header = [
    "id",
    "therapist_name",
    "email",
    "category",
    "status",
    "partner",
    "created_at",
    "details",
  ];

  const rows = requests.map(
    ({ serviceRequest, therapistProfile, user, partner }) => {
      const createdAt =
        serviceRequest.createdAt instanceof Date
          ? serviceRequest.createdAt.toISOString()
          : serviceRequest.createdAt;

      return [
        serviceRequest.id,
        therapistProfile.displayName,
        user.email,
        serviceRequest.category,
        serviceRequest.status,
        partner?.name ?? "",
        createdAt,
        serviceRequest.details ?? "",
      ];
    }
  );

  const csv = [header, ...rows]
    .map((row) => row.map(toCsvValue).join(","))
    .join("\n");

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="service-requests-${stamp}.csv"`,
    },
  });
}
