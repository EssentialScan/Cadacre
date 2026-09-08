import { config } from "dotenv";
config({ path: ".env.local" });
import { getDb } from "../src/db/client";
import { reits, reitMetrics, reitHistoricalFinancials, reitTransactions, reitEvents, reitDocuments } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const db = getDb();
  console.log("Seeding data terminal metrics for GMG...");

  const [gmg] = await db.select().from(reits).where(eq(reits.ticker, "GMG"));
  if (!gmg) {
    console.error("GMG not found in database. Please run basic seed first.");
    process.exit(1);
  }

  // Clear existing terminal data for GMG
  await db.delete(reitMetrics).where(eq(reitMetrics.reitId, gmg.id));
  await db.delete(reitHistoricalFinancials).where(eq(reitHistoricalFinancials.reitId, gmg.id));
  await db.delete(reitTransactions).where(eq(reitTransactions.reitId, gmg.id));
  await db.delete(reitEvents).where(eq(reitEvents.reitId, gmg.id));
  await db.delete(reitDocuments).where(eq(reitDocuments.reitId, gmg.id));

  // 1. Seed Metrics
  await db.insert(reitMetrics).values([
    {
      reitId: gmg.id,
      metricGroup: "valuation",
      metric: "NTA",
      value: "9.38",
      unit: "AUD",
      period: "FY26",
      asOfDate: "2026-06-30",
      sourceTitle: "FY26 Annual Report",
      sourceUrl: "https://www.goodman.com/investor-centre/reports-and-presentations",
      sourceType: "annual_report",
      methodology: "reported",
      isCalculated: false,
    },
    {
      reitId: gmg.id,
      metricGroup: "valuation",
      metric: "NTA Discount",
      value: "2.5",
      unit: "%",
      period: "FY26",
      asOfDate: "2026-06-30",
      sourceTitle: "Calculated from Live Price / NTA",
      sourceType: "system",
      methodology: "(price - NTA) / NTA",
      isCalculated: true,
    },
    {
      reitId: gmg.id,
      metricGroup: "portfolio",
      metric: "Occupancy",
      value: "99.0",
      unit: "%",
      period: "FY26",
      asOfDate: "2026-06-30",
      sourceTitle: "FY26 Annual Report",
      sourceType: "annual_report",
      methodology: "reported",
    },
    {
      reitId: gmg.id,
      metricGroup: "portfolio",
      metric: "WALE",
      value: "5.1",
      unit: "years",
      period: "FY26",
      asOfDate: "2026-06-30",
      sourceTitle: "FY26 Annual Report",
      sourceType: "annual_report",
      methodology: "income_weighted",
    },
    {
      reitId: gmg.id,
      metricGroup: "portfolio",
      metric: "AUM",
      value: "79500000000",
      unit: "AUD",
      period: "FY26",
      asOfDate: "2026-06-30",
      sourceTitle: "FY26 Results Presentation",
      sourceType: "presentation",
      methodology: "reported",
    },
    {
      reitId: gmg.id,
      metricGroup: "debt",
      metric: "Gearing",
      value: "8.3",
      unit: "%",
      period: "FY26",
      asOfDate: "2026-06-30",
      sourceTitle: "FY26 Results Presentation",
      sourceType: "presentation",
      methodology: "look_through",
    },
    {
      reitId: gmg.id,
      metricGroup: "debt",
      metric: "Liquidity",
      value: "3500000000",
      unit: "AUD",
      period: "FY26",
      asOfDate: "2026-06-30",
      sourceTitle: "FY26 Results Presentation",
      sourceType: "presentation",
      methodology: "cash_and_undrawn",
    }
  ]);

  // 2. Seed Historical Financials
  await db.insert(reitHistoricalFinancials).values([
    {
      reitId: gmg.id,
      financialYear: "FY22",
      operatingEarnings: 1528000000,
      eps: 81.3,
      distribution: 30.0,
      nta: 8.37,
      gearing: 8.5,
      occupancy: 98.7,
      wale: 5.2,
    },
    {
      reitId: gmg.id,
      financialYear: "FY23",
      operatingEarnings: 1783000000,
      eps: 94.3,
      distribution: 30.0,
      nta: 9.12,
      gearing: 8.3,
      occupancy: 99.0,
      wale: 5.4,
    },
    {
      reitId: gmg.id,
      financialYear: "FY24",
      operatingEarnings: 2049000000,
      eps: 107.5,
      distribution: 30.0,
      nta: 9.38,
      gearing: 8.3,
      occupancy: 99.0,
      wale: 5.1,
    }
  ]);

  // 3. Update REIT entity info
  await db.update(reits).set({
    entityType: "stapled group",
    businessModel: "Integrated property group (Own, Develop, Manage)",
    hq: "Sydney, NSW",
    website: "https://www.goodman.com",
    irPage: "https://www.goodman.com/investor-centre",
    structure: "Goodman Limited, Goodman Industrial Trust, Goodman Logistics (HK) Limited",
  }).where(eq(reits.id, gmg.id));

  console.log("✅ GMG Data Terminal Seeding Complete.");
  process.exit(0);
}

main();
