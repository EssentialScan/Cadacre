import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { savedScreenerViews } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { isSubscriber } from "@/lib/entitlements";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    const views = await db.select().from(savedScreenerViews).where(eq(savedScreenerViews.userId, userId));
    return NextResponse.json(views);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, sector, minYield, maxGearing, minNtaDiscount } = body;

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    // Check limit
    const proSubscriber = await isSubscriber(userId);
    const existingViews = await db.select().from(savedScreenerViews).where(eq(savedScreenerViews.userId, userId));
    
    if (!proSubscriber && existingViews.length >= 3) {
      return NextResponse.json({ error: "Free tier is limited to 3 saved views. Upgrade to Pro for unlimited views." }, { status: 403 });
    }

    const inserted = await db.insert(savedScreenerViews).values({
      userId,
      name,
      sector: sector === "All" ? null : sector,
      minYield: minYield ? parseFloat(minYield) : null,
      maxGearing: maxGearing ? parseFloat(maxGearing) : null,
      minNtaDiscount: minNtaDiscount ? parseFloat(minNtaDiscount) : null,
    }).returning();

    return NextResponse.json(inserted[0]);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    await db.delete(savedScreenerViews).where(eq(savedScreenerViews.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
