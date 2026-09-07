import { getDb } from "../src/db/client";
import { reits } from "../src/db/schema";
import { scrapeReitMarketData } from "../src/lib/scraper";

const ASX_REITS = [
  "GMG", "SCG", "SGP", "MGR", "DXS", "CHC", "GPT", "VCX", "CIP", "CQR",
  "NSS", "BWP", "ARF", "HDN", "NSR", "CQE", "INA", "CLW", "RFF", "WPR",
  "WMA", "APZ", "COF", "CNI", "HPI", "AOF", "CDO", "REP", "HCW", "GDF",
  "ECF", "TGP", "GDI", "UMG", "BKG", "EGH", "TOT", "URF", "APA", "CMA"
  // Note: Add remaining long-tail micro-cap REITs here to reach 65+
];

// Helper to determine rough sector from ticker (in a real app, this would be scraped from ASX directory)
const getSector = (ticker: string): "Industrial" | "Retail" | "Office" | "Diversified" | "Specialized" => {
  const industrial = ["GMG", "CIP", "ECF"];
  const retail = ["SCG", "VCX", "CQR", "BWP", "HDN", "CQE", "HPI"];
  const office = ["DXS", "COF", "AOF", "GDI"];
  const specialized = ["NSR", "ARF", "RFF", "HCW", "INA", "CQE"];
  
  if (industrial.includes(ticker)) return "Industrial";
  if (retail.includes(ticker)) return "Retail";
  if (office.includes(ticker)) return "Office";
  if (specialized.includes(ticker)) return "Specialized";
  return "Diversified";
};

async function main() {
  const db = getDb();
  if (!db) {
    console.error("Database connection failed. Ensure DATABASE_URL is set.");
    process.exit(1);
  }

  console.log(`Seeding ${ASX_REITS.length} REITs...`);

  for (const ticker of ASX_REITS) {
    console.log(`Fetching data for ${ticker}...`);
    try {
      const result = await scrapeReitMarketData(ticker);
      if (result.success && result.data) {
        await db.insert(reits).values({
          ticker,
          name: `${ticker} FPO`, // Yahoo Finance doesn't return full name in simple quote sometimes, could fetch from summaryProfile
          sector: getSector(ticker),
          marketCap: result.data.marketCap || 0,
          yield: result.data.yield || 0,
          ntaDiscount: 0, // Requires PDF parsing
          gearing: 0, // Requires PDF parsing
          wale: 0, // Requires PDF parsing
        }).onConflictDoUpdate({
          target: reits.ticker,
          set: {
            marketCap: result.data.marketCap || 0,
            yield: result.data.yield || 0,
          }
        });
        console.log(`✅ Seeded ${ticker}`);
      } else {
        console.error(`❌ Failed to fetch ${ticker}: ${result.error}`);
      }
    } catch (e) {
      console.error(`❌ Error seeding ${ticker}:`, e);
    }
    // Rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("Seeding complete!");
  process.exit(0);
}

main();
