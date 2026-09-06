import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/db/client";
import { alerts, reits } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { AlertCondition, AlertChannel } from "@/db/schema";

export const runtime = "nodejs";

/** GET /api/alerts — list user's alerts */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const userAlerts = await db
    .select({
      id: alerts.id,
      name: alerts.name,
      conditions: alerts.conditions,
      channels: alerts.channels,
      isActive: alerts.isActive,
      lastTriggeredAt: alerts.lastTriggeredAt,
      createdAt: alerts.createdAt,
      reitTicker: reits.ticker,
      reitName: reits.name,
    })
    .from(alerts)
    .leftJoin(reits, eq(reits.id, alerts.reitId))
    .where(eq(alerts.userId, userId));

  return NextResponse.json(userAlerts);
}

/** POST /api/alerts — create a new alert */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const body = await req.json();
  const { name, reitTicker, conditions, channels } = body as {
    name: string;
    reitTicker?: string;
    conditions: AlertCondition[];
    channels: AlertChannel[];
  };

  if (!name || !conditions?.length || !channels?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let reitId: string | undefined;
  if (reitTicker) {
    const [reit] = await db
      .select({ id: reits.id })
      .from(reits)
      .where(eq(reits.ticker, reitTicker.toUpperCase()))
      .limit(1);
    if (!reit) return NextResponse.json({ error: `Unknown ticker: ${reitTicker}` }, { status: 404 });
    reitId = reit.id;
  }

  const [alert] = await db.insert(alerts).values({
    userId,
    reitId: reitId || null,
    name,
    conditions,
    channels,
  }).returning();

  return NextResponse.json(alert, { status: 201 });
}

/** DELETE /api/alerts?id=... */
export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await db.delete(alerts).where(and(eq(alerts.id, id), eq(alerts.userId, userId)));
  return NextResponse.json({ success: true });
}
