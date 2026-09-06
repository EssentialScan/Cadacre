import { getDb } from "../src/db/client";
import { sql } from "drizzle-orm";

async function main() {
  const db = getDb();
  if (!db) {
    console.error("Database connection failed.");
    process.exit(1);
  }

  console.log("Creating tables...");
  
  const queries = [
    `DO $$ BEGIN
        CREATE TYPE "public"."sector" AS ENUM('Industrial', 'Retail', 'Office', 'Diversified', 'Specialized');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;`,
    
    `CREATE TABLE IF NOT EXISTS "reits" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "ticker" text NOT NULL,
        "name" text NOT NULL,
        "sector" "sector" NOT NULL,
        "market_cap" double precision,
        "yield" double precision,
        "nta_discount" double precision,
        "gearing" double precision,
        "wale" double precision,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "reits_ticker_unique" UNIQUE("ticker")
    );`,
    
    `CREATE TABLE IF NOT EXISTS "reit_assets" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "reit_id" uuid NOT NULL,
        "address" text NOT NULL,
        "suburb" text,
        "lat" double precision,
        "lng" double precision,
        "property_type" text,
        "book_value" double precision,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
    
    `CREATE TABLE IF NOT EXISTS "announcements" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "reit_id" uuid NOT NULL,
        "title" text NOT NULL,
        "published_at" timestamp with time zone NOT NULL,
        "source_url" text NOT NULL,
        "is_price_sensitive" boolean DEFAULT false,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,
    
    `DO $$ BEGIN
      ALTER TABLE "reit_assets" ADD CONSTRAINT "reit_assets_reit_id_reits_id_fk" FOREIGN KEY ("reit_id") REFERENCES "public"."reits"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;`,
    
    `DO $$ BEGIN
      ALTER TABLE "announcements" ADD CONSTRAINT "announcements_reit_id_reits_id_fk" FOREIGN KEY ("reit_id") REFERENCES "public"."reits"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;`,

    // Phase 2 Tables
    `CREATE TABLE IF NOT EXISTS "reit_prices" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "reit_id" uuid NOT NULL,
        "price_date" date NOT NULL,
        "close_price" double precision NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS "portfolio_holdings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" text NOT NULL,
        "reit_id" uuid NOT NULL,
        "units" double precision NOT NULL,
        "purchase_price" double precision NOT NULL,
        "purchase_date" date NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS "reit_distributions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "reit_id" uuid NOT NULL,
        "ex_date" date NOT NULL,
        "pay_date" date,
        "amount_cents" integer NOT NULL,
        "tax_deferred_pct" double precision DEFAULT 0,
        "cg_discount_pct" double precision DEFAULT 0,
        "foreign_income_pct" double precision DEFAULT 0,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS "alerts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" text NOT NULL,
        "reit_id" uuid,
        "name" text NOT NULL,
        "conditions" jsonb NOT NULL,
        "channels" jsonb NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "last_triggered_at" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS "api_keys" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" text NOT NULL,
        "key_hash" text NOT NULL UNIQUE,
        "key_prefix" text NOT NULL,
        "tier" text NOT NULL DEFAULT 'free',
        "request_count" bigint NOT NULL DEFAULT 0,
        "last_used_at" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,

    `DO $$ BEGIN
      ALTER TABLE "reit_prices" ADD CONSTRAINT "reit_prices_reit_id_fk" FOREIGN KEY ("reit_id") REFERENCES "public"."reits"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;`,

    `DO $$ BEGIN
      ALTER TABLE "portfolio_holdings" ADD CONSTRAINT "portfolio_holdings_reit_id_fk" FOREIGN KEY ("reit_id") REFERENCES "public"."reits"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;`,

    `DO $$ BEGIN
      ALTER TABLE "reit_distributions" ADD CONSTRAINT "reit_distributions_reit_id_fk" FOREIGN KEY ("reit_id") REFERENCES "public"."reits"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;`,

    `DO $$ BEGIN
      ALTER TABLE "alerts" ADD CONSTRAINT "alerts_reit_id_fk" FOREIGN KEY ("reit_id") REFERENCES "public"."reits"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;`
  ];

  try {
    for (const query of queries) {
      await db.execute(sql.raw(query));
    }
    console.log("Tables created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to create tables:", error);
    process.exit(1);
  }
}

main();
