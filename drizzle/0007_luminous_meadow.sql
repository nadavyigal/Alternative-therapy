CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'booked', 'closed', 'no_show');
--> statement-breakpoint
CREATE TABLE "lead" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "therapist_profile_id" uuid NOT NULL,
  "client_name" text NOT NULL,
  "client_phone" text NOT NULL,
  "message" text,
  "status" "public"."lead_status" DEFAULT 'new' NOT NULL,
  "source" text DEFAULT 'profile' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead" ADD CONSTRAINT "lead_therapist_profile_id_therapist_profile_id_fk" FOREIGN KEY ("therapist_profile_id") REFERENCES "public"."therapist_profile"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "lead_profile_status_idx" ON "lead" ("therapist_profile_id","status");
