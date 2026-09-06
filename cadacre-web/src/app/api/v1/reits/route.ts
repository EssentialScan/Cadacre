import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { reits } from "@/db/schema";
import { authenticateApiKey, apiError } from "@/lib/apiKeyAuth";

export const runtime = "nodejs";

/**
 * GET /api/v1/reits
 * Returns all REITs with current metrics.
 * Auth: Bearer <api_key>
 */
export async function GET(req: NextRequest) {
  const auth = await authenticateApiKey(req);
  if (!auth.ok) return apiError(auth.error, auth.status);

  const db = getDb();
  if (!db) return apiError("DB unavailable", 503);

  const data = await db.select().from(reits);

  return NextResponse.json({
    data,
    meta: {
      count: data.length,
      tier: auth.payload.tier,
    },
  }, {
    headers: {
      "x-ratelimit-tier": auth.payload.tier,
      "cache-control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}
