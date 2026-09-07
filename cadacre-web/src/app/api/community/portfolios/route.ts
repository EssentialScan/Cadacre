import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { userProfiles, portfolioHoldings, reits } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    // 1. Fetch public users
    const publicUsers = await db.select().from(userProfiles).where(eq(userProfiles.isPortfolioPublic, true));
    
    // 2. Fetch their holdings
    const results = [];
    for (const user of publicUsers) {
      const holdings = await db
        .select({
          ticker: reits.ticker,
          name: reits.name,
          units: portfolioHoldings.units,
          purchasePrice: portfolioHoldings.purchasePrice
        })
        .from(portfolioHoldings)
        .innerJoin(reits, eq(portfolioHoldings.reitId, reits.id))
        .where(eq(portfolioHoldings.userId, user.userId));

      if (holdings.length > 0) {
        // Calculate weightings
        const totalValue = holdings.reduce((acc, h) => acc + (h.units * h.purchasePrice), 0);
        const weightings = holdings.map(h => ({
          ticker: h.ticker,
          name: h.name,
          weightPct: totalValue > 0 ? ((h.units * h.purchasePrice) / totalValue) * 100 : 0
        })).sort((a, b) => b.weightPct - a.weightPct);

        results.push({
          username: user.username,
          holdings: weightings
        });
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
