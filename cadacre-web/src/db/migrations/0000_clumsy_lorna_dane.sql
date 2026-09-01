CREATE TYPE "public"."watch_kind" AS ENUM('address', 'suburb', 'lga');--> statement-breakpoint
CREATE TABLE "planning_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text NOT NULL,
	"external_id" text NOT NULL,
	"lga_name" text NOT NULL,
	"council_name" text,
	"address" text NOT NULL,
	"suburb" text,
	"postcode" text,
	"lat" double precision,
	"lng" double precision,
	"description" text,
	"application_type" text,
	"status" text,
	"lodged_date" date,
	"decision_date" date,
	"source_url" text NOT NULL,
	"raw_payload" jsonb,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "planning_applications_source_external_id_key" UNIQUE("source","external_id")
);
--> statement-breakpoint
CREATE TABLE "watch_matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"watch_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"matched_at" timestamp with time zone DEFAULT now() NOT NULL,
	"match_reason" text NOT NULL,
	"ai_summary" text,
	"ai_summary_generated_at" timestamp with time zone,
	"viewed_at" timestamp with time zone,
	CONSTRAINT "watch_matches_watch_id_application_id_key" UNIQUE("watch_id","application_id")
);
--> statement-breakpoint
CREATE TABLE "watches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"kind" "watch_kind" NOT NULL,
	"label" text NOT NULL,
	"lga_name" text NOT NULL,
	"suburb_name" text,
	"address_line" text,
	"lat" double precision,
	"lng" double precision,
	"radius_m" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "watch_matches" ADD CONSTRAINT "watch_matches_watch_id_watches_id_fk" FOREIGN KEY ("watch_id") REFERENCES "public"."watches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_matches" ADD CONSTRAINT "watch_matches_application_id_planning_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."planning_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "planning_applications_lga_name_idx" ON "planning_applications" USING btree ("lga_name");--> statement-breakpoint
CREATE INDEX "planning_applications_suburb_idx" ON "planning_applications" USING btree ("suburb");--> statement-breakpoint
CREATE INDEX "planning_applications_lodged_date_idx" ON "planning_applications" USING btree ("lodged_date");--> statement-breakpoint
CREATE INDEX "watch_matches_watch_id_idx" ON "watch_matches" USING btree ("watch_id");--> statement-breakpoint
CREATE INDEX "watches_user_id_idx" ON "watches" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "watches_lga_name_idx" ON "watches" USING btree ("lga_name");