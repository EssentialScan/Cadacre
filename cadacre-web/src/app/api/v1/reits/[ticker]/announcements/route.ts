import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { reits, announcements } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
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

  const limit = Number(req.nextUrl.searchParams.get("limit") || "20");

  const data = await db
    .select()
    .from(announcements)
    .where(eq(announcements.reitId, reit.id))
    .orderBy(desc(announcements.publishedAt))
    .limit(Math.min(limit, 100));

  return NextResponse.json({ data, meta: { count: data.length } }, {
    headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=30" },
  });
}
