import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { reits } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reitId, rentGrowth = 3, interestRateShock = 0 } = body;

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // 1. Fetch the selected REIT
    const [reit] = await db
      .select({
        id: reits.id,
        ticker: reits.ticker,
        name: reits.name,
        yield: reits.yield,
        gearing: reits.gearing,
        wale: reits.wale,
      })
      .from(reits)
      .where(eq(reits.id, reitId))
      .limit(1);

    if (!reit) {
      return NextResponse.json({ error: "REIT not found" }, { status: 404 });
    }

    if (reit.yield == null || reit.gearing == null) {
      return NextResponse.json({ error: "Missing required financial metrics for this REIT" }, { status: 400 });
    }

    // 2. Extrapolate 5-year scenarios
    // Base Case: Compound rent growth
    // Downside: Interest rate shock applied to the geared portion
    // Upside: Assume 1.5x rent growth as a mechanical upper bound
    
    const currentYield = reit.yield;
    const gearingDecimal = reit.gearing / 100;
    const shockDecimal = interestRateShock / 10000; // bps to decimal (e.g. 100bps = 0.01)
    const baseGrowthDecimal = rentGrowth / 100;
    
    // Gearing drag: If debt costs go up by the shock amount, it reduces the distribution available to equity
    // A simplified mechanical proxy: reduction in yield = Shock * Gearing
    const gearingDrag = shockDecimal * gearingDecimal * 100; // converted back to percentage points

    const projections = [];
    const currentYear = new Date().getFullYear();

    for (let year = 0; year <= 5; year++) {
      // Compounding factors
      const baseMultiplier = Math.pow(1 + baseGrowthDecimal, year);
      const upsideMultiplier = Math.pow(1 + (baseGrowthDecimal * 1.5), year);
      
      // Calculate paths
      const baseYield = currentYield * baseMultiplier;
      const upsideYield = currentYield * upsideMultiplier;
      
      // Downside assumes base growth but subtracts the accumulating gearing drag 
      // (assuming debt is progressively refinanced at the higher shocked rate over time)
      const downsideYield = (currentYield * baseMultiplier) - (gearingDrag * (year / 5));

      projections.push({
        year: (currentYear + year).toString(),
        base: Number(baseYield.toFixed(2)),
        upside: Number(upsideYield.toFixed(2)),
        downside: Number(Math.max(0, downsideYield).toFixed(2)), // Floor at 0
      });
    }

    return NextResponse.json({
      reit,
      projections,
      assumptions: [
        `Base Rent Growth: ${rentGrowth}% p.a.`,
        `Interest Rate Shock: +${interestRateShock} bps`,
        `Gearing Drag applied over 5 years: -${gearingDrag.toFixed(2)}%`,
        `WALE (Weighted Average Lease Expiry): ${reit.wale ?? 'Unknown'} years`
      ]
    });

  } catch (error) {
    console.error("Modelling API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
