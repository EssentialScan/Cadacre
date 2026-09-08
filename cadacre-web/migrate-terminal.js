require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function run() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    console.log('Altering reits table...');
    await sql`ALTER TABLE reits ADD COLUMN IF NOT EXISTS entity_type text`;
    await sql`ALTER TABLE reits ADD COLUMN IF NOT EXISTS listing_date date`;
    await sql`ALTER TABLE reits ADD COLUMN IF NOT EXISTS hq text`;
    await sql`ALTER TABLE reits ADD COLUMN IF NOT EXISTS website text`;
    await sql`ALTER TABLE reits ADD COLUMN IF NOT EXISTS ir_page text`;
    await sql`ALTER TABLE reits ADD COLUMN IF NOT EXISTS business_model text`;
    await sql`ALTER TABLE reits ADD COLUMN IF NOT EXISTS structure text`;

    console.log('Altering reit_assets table...');
    await sql`ALTER TABLE reit_assets ADD COLUMN IF NOT EXISTS major_tenants jsonb`;
    await sql`ALTER TABLE reit_assets ADD COLUMN IF NOT EXISTS acquisition_date date`;
    await sql`ALTER TABLE reit_assets ADD COLUMN IF NOT EXISTS development_status text`;
    await sql`ALTER TABLE reit_assets ADD COLUMN IF NOT EXISTS development_value double precision`;
    await sql`ALTER TABLE reit_assets ADD COLUMN IF NOT EXISTS ownership_pct double precision`;

    console.log('Altering reit_distributions table...');
    await sql`ALTER TABLE reit_distributions ADD COLUMN IF NOT EXISTS franking_credits_pct double precision DEFAULT 0`;
    await sql`ALTER TABLE reit_distributions ADD COLUMN IF NOT EXISTS foreign_tax_credits_pct double precision DEFAULT 0`;
    await sql`ALTER TABLE reit_distributions ADD COLUMN IF NOT EXISTS amit_components jsonb`;

    console.log('Creating new tables...');
    await sql`
      CREATE TABLE IF NOT EXISTS reit_metrics (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        reit_id uuid NOT NULL REFERENCES reits(id) ON DELETE CASCADE,
        metric_group text NOT NULL,
        metric text NOT NULL,
        value text NOT NULL,
        unit text,
        period text,
        as_of_date date NOT NULL,
        source_url text,
        source_title text,
        source_date date,
        source_type text,
        methodology text,
        is_calculated boolean DEFAULT false,
        confidence text DEFAULT 'high',
        created_at timestamp with time zone NOT NULL DEFAULT now()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS reit_historical_financials (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        reit_id uuid NOT NULL REFERENCES reits(id) ON DELETE CASCADE,
        financial_year text NOT NULL,
        revenue double precision,
        operating_earnings double precision,
        eps double precision,
        distribution double precision,
        nta double precision,
        property_value double precision,
        gearing double precision,
        occupancy double precision,
        wale double precision,
        source_url text,
        created_at timestamp with time zone NOT NULL DEFAULT now()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS reit_transactions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        reit_id uuid NOT NULL REFERENCES reits(id) ON DELETE CASCADE,
        transaction_date date NOT NULL,
        type text NOT NULL,
        asset_name text NOT NULL,
        location text,
        counterparty text,
        value double precision,
        ownership_pct double precision,
        settlement_date date,
        reason text,
        source_url text,
        created_at timestamp with time zone NOT NULL DEFAULT now()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS reit_events (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        reit_id uuid NOT NULL REFERENCES reits(id) ON DELETE CASCADE,
        event_date timestamp with time zone NOT NULL,
        title text NOT NULL,
        event_type text NOT NULL,
        description text,
        source_url text,
        created_at timestamp with time zone NOT NULL DEFAULT now()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS reit_documents (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        reit_id uuid NOT NULL REFERENCES reits(id) ON DELETE CASCADE,
        title text NOT NULL,
        document_type text NOT NULL,
        publish_date date NOT NULL,
        reporting_period text,
        source_url text NOT NULL,
        created_at timestamp with time zone NOT NULL DEFAULT now()
      )
    `;

    console.log('Migration complete.');
  } catch (e) {
    console.error(e);
  }
}
run();
