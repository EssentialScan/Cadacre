import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { reitComments, userProfiles } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reitId = searchParams.get("reitId");
    if (!reitId) return NextResponse.json({ error: "Missing reitId" }, { status: 400 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    const comments = await db
      .select({
        id: reitComments.id,
        content: reitComments.content,
        createdAt: reitComments.createdAt,
        userId: reitComments.userId,
        username: userProfiles.username,
      })
      .from(reitComments)
      .leftJoin(userProfiles, eq(reitComments.userId, userProfiles.userId))
      .where(eq(reitComments.reitId, reitId))
      .orderBy(desc(reitComments.createdAt));

    return NextResponse.json(comments);
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

    const inserted = await db.insert(reitComments).values({
      userId,
      reitId,
      content,
    }).returning();

    return NextResponse.json(inserted[0]);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
