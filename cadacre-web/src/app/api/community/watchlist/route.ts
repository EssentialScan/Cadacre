import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { watchlists, reits } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    const items = await db
      .select({
        id: watchlists.id,
        reitId: watchlists.reitId,
        ticker: reits.ticker,
        name: reits.name,
      })
      .from(watchlists)
      .innerJoin(reits, eq(watchlists.reitId, reits.id))
      .where(eq(watchlists.userId, userId));

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { reitId } = body;

    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    // Check if exists
    const [existing] = await db.select().from(watchlists).where(
      and(eq(watchlists.userId, userId), eq(watchlists.reitId, reitId))
    );

    if (existing) {
      // Remove it
      await db.delete(watchlists).where(eq(watchlists.id, existing.id));
      return NextResponse.json({ action: "removed" });
    } else {
      // Add it
      await db.insert(watchlists).values({ userId, reitId });
      return NextResponse.json({ action: "added" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
