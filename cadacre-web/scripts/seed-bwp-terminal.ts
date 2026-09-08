import { config } from "dotenv";
config({ path: ".env.local" });
import { getDb } from "../src/db/client";
import { reits, reitMetrics, reitHistoricalFinancials, reitTransactions, reitEvents, reitDocuments } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const db = getDb();
  if (!db) {
    throw new Error("Failed to initialize database connection.");
  }
  console.log("Seeding data terminal metrics for BWP...");

  const [bwp] = await db.select().from(reits).where(eq(reits.ticker, "BWP"));
  if (!bwp) {
    console.error("BWP not found in database. Please run basic seed first.");
    process.exit(1);
  }

  // Clear existing terminal data for BWP
  await db.delete(reitMetrics).where(eq(reitMetrics.reitId, bwp.id));
  await db.delete(reitHistoricalFinancials).where(eq(reitHistoricalFinancials.reitId, bwp.id));
  await db.delete(reitTransactions).where(eq(reitTransactions.reitId, bwp.id));
  await db.delete(reitEvents).where(eq(reitEvents.reitId, bwp.id));
  await db.delete(reitDocuments).where(eq(reitDocuments.reitId, bwp.id));

  // 1. Seed Metrics
  await db.insert(reitMetrics).values([
    {
      reitId: bwp.id,
      metricGroup: "valuation",
      metric: "NTA",
      value: "3.75",
      unit: "AUD",
      period: "FY24",
      asOfDate: "2024-06-30",
      sourceTitle: "FY24 Annual Report",
      sourceUrl: "https://www.bwptrust.com.au/investor-centre",
      sourceType: "annual_report",
      methodology: "reported",
      isCalculated: false,
    },
    {
      reitId: bwp.id,
      metricGroup: "valuation",
      metric: "NTA Discount",
      value: "1.2",
      unit: "%",
      period: "FY24",
      asOfDate: "2024-06-30",
      sourceTitle: "Calculated from Live Price / NTA",
      sourceType: "system",
      methodology: "(price - NTA) / NTA",
      isCalculated: true,
    },
    {
      reitId: bwp.id,
      metricGroup: "portfolio",
      metric: "Occupancy",
      value: "99.8",
      unit: "%",
      period: "FY24",
      asOfDate: "2024-06-30",
      sourceTitle: "FY24 Annual Report",
      sourceType: "annual_report",
      methodology: "reported",
    },
    {
      reitId: bwp.id,
      metricGroup: "portfolio",
      metric: "WALE",
      value: "3.6",
      unit: "years",
      period: "FY24",
      asOfDate: "2024-06-30",
      sourceTitle: "FY24 Annual Report",
      sourceType: "annual_report",
      methodology: "income_weighted",
    },
    {
      reitId: bwp.id,
      metricGroup: "portfolio",
      metric: "AUM",
      value: "2950000000",
      unit: "AUD",
      period: "FY24",
      asOfDate: "2024-06-30",
      sourceTitle: "FY24 Results Presentation",
      sourceType: "presentation",
      methodology: "reported",
    },
    {
      reitId: bwp.id,
      metricGroup: "debt",
      metric: "Gearing",
      value: "17.4",
      unit: "%",
      period: "FY24",
      asOfDate: "2024-06-30",
      sourceTitle: "FY24 Results Presentation",
      sourceType: "presentation",
      methodology: "look_through",
    },
    {
      reitId: bwp.id,
      metricGroup: "debt",
      metric: "Liquidity",
      value: "150000000",
      unit: "AUD",
      period: "FY24",
      asOfDate: "2024-06-30",
      sourceTitle: "FY24 Results Presentation",
      sourceType: "presentation",
      methodology: "cash_and_undrawn",
    }
  ]);

  // 2. Seed Historical Financials
  await db.insert(reitHistoricalFinancials).values([
    {
      reitId: bwp.id,
      financialYear: "FY22",
      operatingEarnings: 114000000,
      eps: 18.2,
      distribution: 18.29,
      nta: 3.86,
      gearing: 15.2,
      occupancy: 99.1,
      wale: 4.1,
    },
    {
      reitId: bwp.id,
      financialYear: "FY23",
      operatingEarnings: 116000000,
      eps: 18.3,
      distribution: 18.29,
      nta: 3.79,
      gearing: 16.5,
      occupancy: 99.5,
      wale: 3.9,
    },
    {
      reitId: bwp.id,
      financialYear: "FY24",
      operatingEarnings: 118000000,
      eps: 18.4,
      distribution: 18.29,
      nta: 3.75,
      gearing: 17.4,
      occupancy: 99.8,
      wale: 3.6,
    }
  ]);

  // 3. Update REIT entity info
  await db.update(reits).set({
    entityType: "registered managed investment scheme",
    businessModel: "Owning and managing commercial properties, predominantly large format retail properties leased to Bunnings Group Limited.",
    hq: "Perth, WA",
    website: "https://www.bwptrust.com.au",
    irPage: "https://www.bwptrust.com.au/investor-centre",
    structure: "BWP Management Limited (Responsible Entity)",
  }).where(eq(reits.id, bwp.id));

  // 4. Documents
  await db.insert(reitDocuments).values([
    {
      reitId: bwp.id,
      title: "FY24 Annual Report",
      documentType: "Annual Report",
      publishDate: "2024-08-06",
      reportingPeriod: "FY24",
      sourceUrl: "https://www.bwptrust.com.au",
    },
    {
      reitId: bwp.id,
      title: "FY24 Results Presentation",
      documentType: "Presentation",
      publishDate: "2024-08-06",
      reportingPeriod: "FY24",
      sourceUrl: "https://www.bwptrust.com.au",
    }
  ]);

  console.log("✅ BWP Data Terminal Seeding Complete.");
  process.exit(0);
}

main();
