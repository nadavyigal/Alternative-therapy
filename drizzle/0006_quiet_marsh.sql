ALTER TABLE "therapist_profile" ADD COLUMN "started_treating_year" integer;
--> statement-breakpoint
ALTER TABLE "therapist_profile" ADD COLUMN "offers_online" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "therapist_profile" ADD COLUMN "offers_in_person" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "therapist_profile" ADD COLUMN "available_days" text[];
--> statement-breakpoint
ALTER TABLE "therapist_profile" ADD COLUMN "profile_image_url" text;
--> statement-breakpoint
ALTER TABLE "therapist_profile" ADD COLUMN "insurance_status" text DEFAULT 'unknown' NOT NULL;
--> statement-breakpoint
ALTER TABLE "modality" ADD COLUMN "source" text DEFAULT 'system' NOT NULL;
--> statement-breakpoint
ALTER TABLE "modality" ADD COLUMN "created_by_user_id" text;
--> statement-breakpoint
ALTER TABLE "modality" ADD CONSTRAINT "modality_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "credential" ADD COLUMN "document_type" text DEFAULT 'professional' NOT NULL;
--> statement-breakpoint
ALTER TABLE "credential" ADD COLUMN "extraction_confidence" integer;
