import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { apiKeys } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";

const FREE_TIER_LIMIT = 100; // requests per day (approximate — enforced on lifetime count for simplicity)
const PAID_TIER_LIMIT = 10000;

export interface ApiKeyPayload {
  userId: string;
  tier: string;
  keyId: string;
}

export async function authenticateApiKey(req: NextRequest): Promise<
  { ok: true; payload: ApiKeyPayload } | { ok: false; status: number; error: string }
> {
  const authHeader = req.headers.get("authorization");
  const key = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!key) {
    return { ok: false, status: 401, error: "Missing Authorization: Bearer <key> header" };
  }

  const db = getDb();
  if (!db) return { ok: false, status: 503, error: "DB unavailable" };

  const keyHash = createHash("sha256").update(key).digest("hex");

  const [record] = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.keyHash, keyHash))
    .limit(1);

  if (!record) {
    return { ok: false, status: 401, error: "Invalid API key" };
  }

  const limit = record.tier === "paid" ? PAID_TIER_LIMIT : FREE_TIER_LIMIT;
  if (record.requestCount >= limit) {
    return { ok: false, status: 429, error: `Rate limit exceeded. Upgrade to paid tier for ${PAID_TIER_LIMIT} requests.` };
  }

  // Increment request count async (fire-and-forget, don't block response)
  db.update(apiKeys)
    .set({ requestCount: record.requestCount + 1, lastUsedAt: new Date() })
    .where(eq(apiKeys.id, record.id))
    .catch(() => {});

  return {
    ok: true,
    payload: { userId: record.userId, tier: record.tier, keyId: record.id },
  };
}

export function apiError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}
