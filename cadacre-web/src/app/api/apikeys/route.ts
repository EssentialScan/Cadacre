import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/db/client";
import { apiKeys } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";
import { isSubscriber } from "@/lib/entitlements";

export const runtime = "nodejs";

/** GET /api/apikeys — list user's API keys (without revealing the full key) */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const keys = await db
    .select({
      id: apiKeys.id,
      keyPrefix: apiKeys.keyPrefix,
      tier: apiKeys.tier,
      requestCount: apiKeys.requestCount,
      lastUsedAt: apiKeys.lastUsedAt,
      createdAt: apiKeys.createdAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.userId, userId));

  return NextResponse.json(keys);
}

/** POST /api/apikeys — generate a new API key */
export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const subscribed = await isSubscriber(userId);

  // Generate a secure random key: "reit_" prefix + 32 random hex bytes
  const rawKey = "reit_" + randomBytes(24).toString("hex");
  const keyHash = createHash("sha256").update(rawKey).digest("hex");
  const keyPrefix = rawKey.slice(0, 12); // "reit_" + 7 chars shown in UI

  const [record] = await db.insert(apiKeys).values({
    userId,
    keyHash,
    keyPrefix,
    tier: subscribed ? "paid" : "free",
    requestCount: 0,
  }).returning({
    id: apiKeys.id,
    keyPrefix: apiKeys.keyPrefix,
    tier: apiKeys.tier,
    createdAt: apiKeys.createdAt,
  });

  // Return the raw key ONCE — it cannot be retrieved again
  return NextResponse.json({ ...record, key: rawKey }, { status: 201 });
}

/** DELETE /api/apikeys?id=... — revoke a key */
export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await db.delete(apiKeys).where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)));
  return NextResponse.json({ success: true });
}
