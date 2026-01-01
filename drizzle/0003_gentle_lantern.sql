CREATE EXTENSION IF NOT EXISTS "pgcrypto";
--> statement-breakpoint
CREATE TABLE "therapist_profile" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL,
  "display_name" text NOT NULL,
  "slug" text NOT NULL,
  "bio" text,
  "city" text,
  "is_online" boolean DEFAULT false NOT NULL,
  "price_min" integer,
  "price_max" integer,
  "languages" text[],
  "whatsapp_phone" text,
  "contact_email" text,
  "published" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "therapist_profile" ADD CONSTRAINT "therapist_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "therapist_profile" ADD CONSTRAINT "therapist_profile_user_id_unique" UNIQUE ("user_id");
--> statement-breakpoint
ALTER TABLE "therapist_profile" ADD CONSTRAINT "therapist_profile_slug_unique" UNIQUE ("slug");
