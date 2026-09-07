import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/db/client";
import { portfolioHoldings, reits, reitDistributions } from "@/db/schema";
import { eq, gte, and } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  // 1. Get holdings
  const holdings = await db
    .select({
      id: portfolioHoldings.id,
      reitId: portfolioHoldings.reitId,
      units: portfolioHoldings.units,
      purchaseDate: portfolioHoldings.purchaseDate,
      ticker: reits.ticker,
      name: reits.name,
    })
    .from(portfolioHoldings)
    .innerJoin(reits, eq(portfolioHoldings.reitId, reits.id))
    .where(eq(portfolioHoldings.userId, userId));

  if (!holdings.length) {
    return NextResponse.json({
      summary: { totalEarned: 0, taxDeferredEarned: 0, cgDiscountEarned: 0, foreignIncomeEarned: 0 },
      holdings: [],
    });
  }

  const result = [];
  let sumTotal = 0;
  let sumTaxDef = 0;
  let sumCg = 0;
  let sumForeign = 0;

  // 2. For each holding, get distributions since purchase
  for (const h of holdings) {
    const dists = await db
      .select({
        amountCents: reitDistributions.amountCents,
        taxDeferredPct: reitDistributions.taxDeferredPct,
        cgDiscountPct: reitDistributions.cgDiscountPct,
        foreignIncomePct: reitDistributions.foreignIncomePct,
      })
      .from(reitDistributions)
      .where(
        and(
          eq(reitDistributions.reitId, h.reitId),
          gte(reitDistributions.exDate, h.purchaseDate)
        )
      );

    let holdingTotal = 0;
    let holdingTaxDef = 0;
    let holdingCg = 0;
    let holdingForeign = 0;

    for (const d of dists) {
      const distTotal = (d.amountCents / 100) * h.units;
      const distTaxDef = distTotal * ((d.taxDeferredPct || 0) / 100);
      const distCg = distTotal * ((d.cgDiscountPct || 0) / 100);
      const distForeign = distTotal * ((d.foreignIncomePct || 0) / 100);

      holdingTotal += distTotal;
      holdingTaxDef += distTaxDef;
      holdingCg += distCg;
      holdingForeign += distForeign;
    }

    sumTotal += holdingTotal;
    sumTaxDef += holdingTaxDef;
    sumCg += holdingCg;
    sumForeign += holdingForeign;

    result.push({
      id: h.id,
      ticker: h.ticker,
      name: h.name,
      units: h.units,
      taxComponents: {
        totalEarned: holdingTotal,
        taxDeferredEarned: holdingTaxDef,
        cgDiscountEarned: holdingCg,
        foreignIncomeEarned: holdingForeign,
      }
    });
  }

  return NextResponse.json({
    summary: {
      totalEarned: sumTotal,
      taxDeferredEarned: sumTaxDef,
      cgDiscountEarned: sumCg,
      foreignIncomeEarned: sumForeign,
    },
    holdings: result,
  });
}
