# Database Schema

## Overview
- PostgreSQL with Drizzle ORM.
- Source of truth: `src/lib/schema.ts`.
- Better Auth tables (`user`, `session`, `account`, `verification`) use text IDs.
- All new domain tables use UUID primary keys.
- Migrations live in `drizzle/migrations/`.

## Enums
- user_role: client | therapist | admin | partner
- lead_status: new | contacted | booked | closed | no_show
- booking_status: pending | confirmed | completed | cancelled
- credential_status: pending | approved | rejected
- referral_status: sent | contacted | converted | lost
- group_event_status: draft | published | cancelled
- review_status: pending | approved | rejected

## Tables

### user (Better Auth extension)
- id (text, pk)
- name (text, not null)
- email (text, unique, not null)
- emailVerified (boolean, default false)
- image (text, nullable)
- role (user_role, default client)
- phone (text, nullable)
- phoneVerified (boolean, default false)
- locale (text, default "he")
- createdAt, updatedAt (timestamp)

### session / account / verification
- Existing Better Auth tables in `src/lib/schema.ts`.

### therapistProfile
- id (uuid, pk)
- userId (text, fk -> user.id, unique)
- displayName (text, not null)
- slug (text, unique, indexed)
- bio (text)
- city (text)
- isOnline (boolean, default false)
- priceMin, priceMax (integer, nullable)
- languages (text[], optional)
- whatsappPhone (text, normalized +972)
- contactEmail (text, optional)
- published (boolean, default false)
- createdAt, updatedAt

### modality
- id (uuid, pk)
- nameHe (text, not null)
- nameEn (text, optional)
- slug (text, unique)

### therapistModality
- therapistProfileId (uuid, fk)
- modalityId (uuid, fk)
- unique composite (therapistProfileId, modalityId)

### issue
- id (uuid, pk)
- nameHe (text, not null)
- nameEn (text, optional)
- slug (text, unique)

### therapistIssue
- therapistProfileId (uuid, fk)
- issueId (uuid, fk)
- unique composite

### credential
- id (uuid, pk)
- therapistProfileId (uuid, fk)
- title (text)
- issuer (text)
- issuedYear (integer, nullable)
- fileUrl (text, not null)
- status (credential_status, default pending)
- verifiedBy (text, fk -> user.id, nullable)
- verifiedAt (timestamp, nullable)
- createdAt, updatedAt

### lead
- id (uuid, pk)
- therapistProfileId (uuid, fk)
- clientName (text, not null)
- clientPhone (text, not null)
- message (text)
- status (lead_status, default new)
- source (text, default "profile")
- createdAt, updatedAt

### booking
- id (uuid, pk)
- therapistProfileId (uuid, fk)
- leadId (uuid, fk, nullable)
- clientName (text)
- scheduledAt (timestamp, not null)
- durationMinutes (integer, default 60)
- status (booking_status, default pending)
- remindersEnabled (boolean, default true)
- createdAt, updatedAt

### serviceRequest
- id (uuid, pk)
- therapistProfileId (uuid, fk)
- category (text: insurance | tax | pension)
- status (referral_status, default sent)
- details (text)
- partnerId (uuid, fk, nullable)
- createdAt, updatedAt

### partner
- id (uuid, pk)
- name (text, not null)
- category (text)
- email (text)
- phone (text)
- website (text)
- createdAt, updatedAt

### groupEvent (V1+)
- id (uuid, pk)
- therapistProfileId (uuid, fk)
- title (text, not null)
- description (text)
- startsAt (timestamp, nullable for TBD)
- locationOrLink (text)
- status (group_event_status, default draft)
- createdAt, updatedAt

### groupEventAttendee (V1+)
- id (uuid, pk)
- groupEventId (uuid, fk)
- name (text, not null)
- phone (text, nullable)
- email (text, nullable)
- createdAt

### review (V1+)
- id (uuid, pk)
- therapistProfileId (uuid, fk)
- rating (integer, 1-5)
- content (text)
- status (review_status, default pending)
- createdAt

## Reference implementation snippet

```ts
import { pgTable, text, uuid, timestamp, boolean, integer, pgEnum } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["client", "therapist", "admin", "partner"]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  // ... Better Auth fields
  role: userRole("role").notNull().default("client"),
  phone: text("phone"),
  phoneVerified: boolean("phone_verified").notNull().default(false),
  locale: text("locale").notNull().default("he"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```
