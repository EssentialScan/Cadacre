require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function run() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    await sql`ALTER TABLE reit_assets ADD COLUMN IF NOT EXISTS occupancy_rate double precision`;
    await sql`ALTER TABLE reit_assets ADD COLUMN IF NOT EXISTS wale double precision`;
    await sql`ALTER TABLE reit_assets ADD COLUMN IF NOT EXISTS cap_rate double precision`;
    await sql`ALTER TABLE reit_assets ADD COLUMN IF NOT EXISTS gla integer`;
    await sql`ALTER TABLE reit_assets ADD COLUMN IF NOT EXISTS major_tenant text`;
    console.log('Altered table successfully');
  } catch (e) {
    console.error(e);
  }
}
run();
