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
    isOnline: boolean("is_online").notNull().default(false),
    priceMin: integer("price_min"),
    priceMax: integer("price_max"),
    languages: text("languages").array(),
    whatsappPhone: text("whatsapp_phone"),
    contactEmail: text("contact_email"),
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
  status: credentialStatus("status").notNull().default("pending"),
  verifiedBy: text("verified_by").references(() => user.id),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

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
