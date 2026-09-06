import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { reits, reitAssets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authenticateApiKey, apiError } from "@/lib/apiKeyAuth";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const auth = await authenticateApiKey(req);
  if (!auth.ok) return apiError(auth.error, auth.status);

  const { ticker } = await params;
  const db = getDb();
  if (!db) return apiError("DB unavailable", 503);

  const [reit] = await db
    .select({ id: reits.id })
    .from(reits)
    .where(eq(reits.ticker, ticker.toUpperCase()))
    .limit(1);

  if (!reit) return apiError(`REIT not found: ${ticker}`, 404);

  const assets = await db
    .select()
    .from(reitAssets)
    .where(eq(reitAssets.reitId, reit.id));

  return NextResponse.json({ data: assets, meta: { count: assets.length } }, {
    headers: { "cache-control": "public, s-maxage=300, stale-while-revalidate=60" },
  });
}
