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
    END $$;`
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
