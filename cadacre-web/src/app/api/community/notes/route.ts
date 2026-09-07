import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { reitNotes } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const reitId = searchParams.get("reitId");
    if (!reitId) return NextResponse.json({ error: "Missing reitId" }, { status: 400 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    const [note] = await db
      .select()
      .from(reitNotes)
      .where(and(eq(reitNotes.userId, userId), eq(reitNotes.reitId, reitId)));

    return NextResponse.json(note || null);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { reitId, content } = body;

    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    const [existing] = await db
      .select()
      .from(reitNotes)
      .where(and(eq(reitNotes.userId, userId), eq(reitNotes.reitId, reitId)));

    if (existing) {
      const [updated] = await db.update(reitNotes)
        .set({ content, updatedAt: new Date() })
        .where(eq(reitNotes.id, existing.id))
        .returning();
      return NextResponse.json(updated);
    } else {
      const [inserted] = await db.insert(reitNotes)
        .values({ userId, reitId, content })
        .returning();
      return NextResponse.json(inserted);
    }
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
