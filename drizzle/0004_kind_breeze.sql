CREATE TABLE "modality" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name_he" text NOT NULL,
  "name_en" text,
  "slug" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "modality" ADD CONSTRAINT "modality_slug_unique" UNIQUE ("slug");
--> statement-breakpoint
CREATE TABLE "issue" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name_he" text NOT NULL,
  "name_en" text,
  "slug" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "issue" ADD CONSTRAINT "issue_slug_unique" UNIQUE ("slug");
--> statement-breakpoint
CREATE TABLE "therapist_modality" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "therapist_profile_id" uuid NOT NULL,
  "modality_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "therapist_issue" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "therapist_profile_id" uuid NOT NULL,
  "issue_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "therapist_modality" ADD CONSTRAINT "therapist_modality_unique" UNIQUE ("therapist_profile_id","modality_id");
--> statement-breakpoint
ALTER TABLE "therapist_issue" ADD CONSTRAINT "therapist_issue_unique" UNIQUE ("therapist_profile_id","issue_id");
--> statement-breakpoint
ALTER TABLE "therapist_modality" ADD CONSTRAINT "therapist_modality_therapist_profile_id_therapist_profile_id_fk" FOREIGN KEY ("therapist_profile_id") REFERENCES "public"."therapist_profile"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "therapist_modality" ADD CONSTRAINT "therapist_modality_modality_id_modality_id_fk" FOREIGN KEY ("modality_id") REFERENCES "public"."modality"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "therapist_issue" ADD CONSTRAINT "therapist_issue_therapist_profile_id_therapist_profile_id_fk" FOREIGN KEY ("therapist_profile_id") REFERENCES "public"."therapist_profile"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "therapist_issue" ADD CONSTRAINT "therapist_issue_issue_id_issue_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issue"("id") ON DELETE cascade ON UPDATE no action;
