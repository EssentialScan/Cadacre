import { getDb } from "../src/db/client";
import { reits } from "../src/db/schema";

/**
 * Seed missing REITs directly into the database without Yahoo Finance.
 * Uses hardcoded data from public sources.
 */
const MISSING_REITS = [
  { ticker: "GPT", name: "GPT Group", sector: "Diversified" as const, marketCap: 9800000000, yield: 5.1 },
  { ticker: "VCX", name: "Vicinity Centres", sector: "Retail" as const, marketCap: 10200000000, yield: 5.4 },
  { ticker: "BWP", name: "BWP Trust", sector: "Retail" as const, marketCap: 2400000000, yield: 4.2 },
  { ticker: "ARF", name: "Arena REIT", sector: "Specialized" as const, marketCap: 1800000000, yield: 4.8 },
  { ticker: "NSR", name: "National Storage REIT", sector: "Specialized" as const, marketCap: 3200000000, yield: 3.9 },
  { ticker: "HDN", name: "HomeCo Daily Needs REIT", sector: "Retail" as const, marketCap: 1500000000, yield: 5.6 },
  { ticker: "CHC", name: "Charter Hall Group", sector: "Diversified" as const, marketCap: 8500000000, yield: 3.2 },
  { ticker: "SGP", name: "Stockland", sector: "Diversified" as const, marketCap: 12000000000, yield: 4.5 },
  { ticker: "MGR", name: "Mirvac Group", sector: "Diversified" as const, marketCap: 8200000000, yield: 4.3 },
  { ticker: "CLW", name: "Charter Hall Long WALE REIT", sector: "Diversified" as const, marketCap: 3500000000, yield: 5.8 },
  { ticker: "COF", name: "Centuria Office REIT", sector: "Office" as const, marketCap: 900000000, yield: 7.2 },
  { ticker: "AOF", name: "Australian Unity Office Fund", sector: "Office" as const, marketCap: 450000000, yield: 6.8 },
  { ticker: "GDI", name: "GDI Property Group", sector: "Office" as const, marketCap: 380000000, yield: 7.5 },
  { ticker: "WPR", name: "Waypoint REIT", sector: "Specialized" as const, marketCap: 1900000000, yield: 5.3 },
  { ticker: "RFF", name: "Rural Funds Group", sector: "Specialized" as const, marketCap: 750000000, yield: 5.0 },
  { ticker: "INA", name: "Ingenia Communities", sector: "Specialized" as const, marketCap: 1600000000, yield: 3.1 },
  { ticker: "HPI", name: "Hotel Property Investments", sector: "Specialized" as const, marketCap: 520000000, yield: 5.9 },
  { ticker: "APZ", name: "Aspen Group", sector: "Diversified" as const, marketCap: 350000000, yield: 4.7 },
];

async function main() {
  const db = getDb();
  if (!db) {
    console.error("Database connection failed.");
    process.exit(1);
  }

  console.log(`Seeding ${MISSING_REITS.length} missing REITs...`);

  for (const reit of MISSING_REITS) {
    await db.insert(reits).values({
      ticker: reit.ticker,
      name: reit.name,
      sector: reit.sector,
      marketCap: reit.marketCap,
      yield: reit.yield,
      ntaDiscount: 0,
      gearing: 0,
      wale: 0,
    }).onConflictDoUpdate({
      target: reits.ticker,
      set: {
        name: reit.name,
        marketCap: reit.marketCap,
        yield: reit.yield,
      }
    });
    console.log(`✅ ${reit.ticker} — ${reit.name}`);
  }

  console.log("\nDone!");
  process.exit(0);
}

main();
