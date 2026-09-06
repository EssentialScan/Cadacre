import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { reits, reitPrices } from "@/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
import { authenticateApiKey, apiError } from "@/lib/apiKeyAuth";

export const runtime = "nodejs";

/**
 * GET /api/v1/prices?tickers=GMG,SCG,DXS
 * Returns the latest close price for each requested ticker.
 */
export async function GET(req: NextRequest) {
  const auth = await authenticateApiKey(req);
  if (!auth.ok) return apiError(auth.error, auth.status);

  const db = getDb();
  if (!db) return apiError("DB unavailable", 503);

  const tickerParam = req.nextUrl.searchParams.get("tickers");
  if (!tickerParam) return apiError("Missing ?tickers= query param", 400);

  const tickers = tickerParam.split(",").map(t => t.trim().toUpperCase()).slice(0, 20);

  // Fetch REIT ids for the requested tickers
  const reitRows = await db
    .select({ id: reits.id, ticker: reits.ticker })
    .from(reits)
    .where(inArray(reits.ticker, tickers));

  if (!reitRows.length) return NextResponse.json({ data: [], meta: { count: 0 } });

  // For each REIT, get the latest price
  const reitIds = reitRows.map(r => r.id);
  const priceRows = await db
    .select()
    .from(reitPrices)
    .where(inArray(reitPrices.reitId, reitIds))
    .orderBy(desc(reitPrices.priceDate));

  // Deduplicate — keep only latest per reitId
  const seen = new Set<string>();
  const latestPrices = priceRows.filter(p => {
    if (seen.has(p.reitId)) return false;
    seen.add(p.reitId);
    return true;
  });

  // Merge ticker back in
  const reitMap = Object.fromEntries(reitRows.map(r => [r.id, r.ticker]));
  const data = latestPrices.map(p => ({
    ticker: reitMap[p.reitId],
    priceDate: p.priceDate,
    closePrice: p.closePrice,
  }));

  return NextResponse.json({ data, meta: { count: data.length } }, {
    headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=30" },
  });
}
