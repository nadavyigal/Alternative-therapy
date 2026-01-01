CREATE TYPE "public"."credential_status" AS ENUM('pending', 'approved', 'rejected');
--> statement-breakpoint
CREATE TABLE "credential" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "therapist_profile_id" uuid NOT NULL,
  "title" text,
  "issuer" text,
  "issued_year" integer,
  "file_url" text NOT NULL,
  "status" "credential_status" DEFAULT 'pending' NOT NULL,
  "verified_by" text,
  "verified_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "credential" ADD CONSTRAINT "credential_therapist_profile_id_therapist_profile_id_fk" FOREIGN KEY ("therapist_profile_id") REFERENCES "public"."therapist_profile"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "credential" ADD CONSTRAINT "credential_verified_by_user_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
