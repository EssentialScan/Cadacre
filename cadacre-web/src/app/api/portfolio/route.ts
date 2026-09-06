import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/db/client";
import { portfolioHoldings, reits, reitPrices } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export const runtime = "nodejs";

/** GET /api/portfolio — list holdings with live price + cost basis metrics */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const holdings = await db
    .select({
      id: portfolioHoldings.id,
      units: portfolioHoldings.units,
      purchasePrice: portfolioHoldings.purchasePrice,
      purchaseDate: portfolioHoldings.purchaseDate,
      ticker: reits.ticker,
      name: reits.name,
      sector: reits.sector,
      yield: reits.yield,
      ntaDiscount: reits.ntaDiscount,
      gearing: reits.gearing,
      wale: reits.wale,
    })
    .from(portfolioHoldings)
    .leftJoin(reits, eq(reits.id, portfolioHoldings.reitId))
    .where(eq(portfolioHoldings.userId, userId));

  return NextResponse.json(holdings);
}

/** POST /api/portfolio — add a new holding */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const body = await req.json();
  const { reitTicker, units, purchasePrice, purchaseDate } = body;

  if (!reitTicker || !units || !purchasePrice || !purchaseDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Lookup REIT
  const [reit] = await db
    .select({ id: reits.id })
    .from(reits)
    .where(eq(reits.ticker, reitTicker.toUpperCase()))
    .limit(1);

  if (!reit) {
    return NextResponse.json({ error: `Unknown REIT ticker: ${reitTicker}` }, { status: 404 });
  }

  const [holding] = await db.insert(portfolioHoldings).values({
    userId,
    reitId: reit.id,
    units: Number(units),
    purchasePrice: Number(purchasePrice),
    purchaseDate: String(purchaseDate),
  }).returning();

  return NextResponse.json(holding, { status: 201 });
}

/** DELETE /api/portfolio?id=... — remove a holding */
export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await db
    .delete(portfolioHoldings)
    .where(and(eq(portfolioHoldings.id, id), eq(portfolioHoldings.userId, userId)));

  return NextResponse.json({ success: true });
}
