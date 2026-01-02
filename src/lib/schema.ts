import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  pgEnum,
  uuid,
  integer,
  unique,
} from "drizzle-orm/pg-core";

// IMPORTANT! ID fields should ALWAYS use UUID types, EXCEPT the BetterAuth tables.

export const userRole = pgEnum("user_role", [
  "client",
  "therapist",
  "admin",
  "partner",
]);

export const credentialStatus = pgEnum("credential_status", [
  "pending",
  "approved",
  "rejected",
]);

export const leadStatus = pgEnum("lead_status", [
  "new",
  "contacted",
  "booked",
  "closed",
  "no_show",
]);

export const bookingStatus = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

export const referralStatus = pgEnum("referral_status", [
  "sent",
  "contacted",
  "converted",
  "lost",
]);


export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    role: userRole("role").notNull().default("client"),
    phone: text("phone"),
    phoneVerified: boolean("phone_verified").notNull().default(false),
    locale: text("locale").notNull().default("he"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("user_email_idx").on(table.email)]
);

export const therapistProfile = pgTable(
  "therapist_profile",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    slug: text("slug").notNull().unique(),
    bio: text("bio"),
    city: text("city"),
    startedTreatingYear: integer("started_treating_year"),
    offersOnline: boolean("offers_online").notNull().default(false),
    offersInPerson: boolean("offers_in_person").notNull().default(false),
    availableDays: text("available_days").array(),
    profileImageUrl: text("profile_image_url"),
    isOnline: boolean("is_online").notNull().default(false),
    priceMin: integer("price_min"),
    priceMax: integer("price_max"),
    languages: text("languages").array(),
    whatsappPhone: text("whatsapp_phone"),
    contactEmail: text("contact_email"),
    insuranceStatus: text("insurance_status").notNull().default("unknown"),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  }
);

export const modality = pgTable("modality", {
  id: uuid("id").defaultRandom().primaryKey(),
  nameHe: text("name_he").notNull(),
  nameEn: text("name_en"),
  slug: text("slug").notNull().unique(),
  source: text("source").notNull().default("system"),
  createdByUserId: text("created_by_user_id").references(() => user.id),
});

export const issue = pgTable("issue", {
  id: uuid("id").defaultRandom().primaryKey(),
  nameHe: text("name_he").notNull(),
  nameEn: text("name_en"),
  slug: text("slug").notNull().unique(),
});

export const therapistModality = pgTable(
  "therapist_modality",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    therapistProfileId: uuid("therapist_profile_id")
      .notNull()
      .references(() => therapistProfile.id, { onDelete: "cascade" }),
    modalityId: uuid("modality_id")
      .notNull()
      .references(() => modality.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniquePair: unique("therapist_modality_unique").on(
      table.therapistProfileId,
      table.modalityId
    ),
  })
);

export const therapistIssue = pgTable(
  "therapist_issue",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    therapistProfileId: uuid("therapist_profile_id")
      .notNull()
      .references(() => therapistProfile.id, { onDelete: "cascade" }),
    issueId: uuid("issue_id")
      .notNull()
      .references(() => issue.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniquePair: unique("therapist_issue_unique").on(
      table.therapistProfileId,
      table.issueId
    ),
  })
);

export const credential = pgTable("credential", {
  id: uuid("id").defaultRandom().primaryKey(),
  therapistProfileId: uuid("therapist_profile_id")
    .notNull()
    .references(() => therapistProfile.id, { onDelete: "cascade" }),
  title: text("title"),
  issuer: text("issuer"),
  issuedYear: integer("issued_year"),
  fileUrl: text("file_url").notNull(),
  documentType: text("document_type").notNull().default("professional"),
  extractionConfidence: integer("extraction_confidence"),
  status: credentialStatus("status").notNull().default("pending"),
  verifiedBy: text("verified_by").references(() => user.id),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const lead = pgTable(
  "lead",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    therapistProfileId: uuid("therapist_profile_id")
      .notNull()
      .references(() => therapistProfile.id, { onDelete: "cascade" }),
    clientName: text("client_name").notNull(),
    clientPhone: text("client_phone").notNull(),
    message: text("message"),
    status: leadStatus("status").notNull().default("new"),
    source: text("source").notNull().default("profile"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("lead_profile_status_idx").on(
      table.therapistProfileId,
      table.status
    ),
  ]
);

export const booking = pgTable(
  "booking",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    therapistProfileId: uuid("therapist_profile_id")
      .notNull()
      .references(() => therapistProfile.id, { onDelete: "cascade" }),
    leadId: uuid("lead_id").references(() => lead.id, { onDelete: "set null" }),
    clientName: text("client_name").notNull(),
    scheduledAt: timestamp("scheduled_at").notNull(),
    durationMinutes: integer("duration_minutes").notNull().default(60),
    status: bookingStatus("status").notNull().default("pending"),
    remindersEnabled: boolean("reminders_enabled").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("booking_profile_scheduled_idx").on(
      table.therapistProfileId,
      table.scheduledAt
    ),
  ]
);

export const partner = pgTable("partner", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  category: text("category"),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const serviceRequest = pgTable(
  "service_request",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    therapistProfileId: uuid("therapist_profile_id")
      .notNull()
      .references(() => therapistProfile.id, { onDelete: "cascade" }),
    category: text("category").notNull(),
    status: referralStatus("status").notNull().default("sent"),
    details: text("details"),
    partnerId: uuid("partner_id").references(() => partner.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("service_request_profile_status_idx").on(
      table.therapistProfileId,
      table.status
    ),
  ]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("session_user_id_idx").on(table.userId),
    index("session_token_idx").on(table.token),
  ]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    index("account_provider_account_idx").on(table.providerId, table.accountId),
  ]
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
