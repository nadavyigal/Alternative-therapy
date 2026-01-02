CREATE TYPE "public"."referral_status" AS ENUM('sent', 'contacted', 'converted', 'lost');--> statement-breakpoint
CREATE TABLE "partner" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"email" text,
	"phone" text,
	"website" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"therapist_profile_id" uuid NOT NULL,
	"category" text NOT NULL,
	"status" "referral_status" DEFAULT 'sent' NOT NULL,
	"details" text,
	"partner_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "service_request" ADD CONSTRAINT "service_request_therapist_profile_id_therapist_profile_id_fk" FOREIGN KEY ("therapist_profile_id") REFERENCES "public"."therapist_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_request" ADD CONSTRAINT "service_request_partner_id_partner_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partner"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "service_request_profile_status_idx" ON "service_request" USING btree ("therapist_profile_id","status");