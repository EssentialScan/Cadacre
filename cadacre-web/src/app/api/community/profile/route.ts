import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { userProfiles } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    const profile = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return NextResponse.json(profile.length > 0 ? profile[0] : null);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { username, isPortfolioPublic } = body;

    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    const [existing] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));

    if (existing) {
      const updated = await db.update(userProfiles)
        .set({ username: username ?? existing.username, isPortfolioPublic: isPortfolioPublic ?? existing.isPortfolioPublic })
        .where(eq(userProfiles.userId, userId))
        .returning();
      return NextResponse.json(updated[0]);
    } else {
      const inserted = await db.insert(userProfiles)
        .values({ userId, username, isPortfolioPublic: isPortfolioPublic ?? false })
        .returning();
      return NextResponse.json(inserted[0]);
    }
  } catch (error) {
    console.error("Profile API error", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
