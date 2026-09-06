import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { reits, announcements } from "@/db/schema";
import { scrapeReitAnnouncements } from "@/lib/scraper";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const { searchParams } = new URL(request.url);
  const secretParams = searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && secretParams !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    console.error("[Announcements API] Database connection not configured.");
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    console.log("[Announcements API] Starting scheduled scrape run...");
    const startTime = Date.now();

    const allReits = await db.select({ id: reits.id, ticker: reits.ticker }).from(reits);
    
    if (allReits.length === 0) {
      return NextResponse.json({ message: "No REITs configured" }, { status: 200 });
    }

    const results = [];
    let successCount = 0;
    let failCount = 0;
    let newAnnouncementsInserted = 0;

    for (const reit of allReits) {
      console.log(`[Announcements API] Fetching announcements for ${reit.ticker}...`);
      const scrapeResult = await scrapeReitAnnouncements(reit.ticker);

      if (scrapeResult.success && scrapeResult.data) {
        for (const ann of scrapeResult.data) {
          // Check if this announcement already exists by URL
          const existing = await db.select({ id: announcements.id })
            .from(announcements)
            .where(eq(announcements.sourceUrl, ann.sourceUrl));

          if (existing.length === 0) {
            // Insert announcement
            await db.insert(announcements).values({
              reitId: reit.id,
              title: ann.title,
              publishedAt: new Date(ann.publishedAt),
              sourceUrl: ann.sourceUrl,
              isPriceSensitive: ann.title.toLowerCase().includes("price sensitive")
            });
            
            newAnnouncementsInserted++;
          }
        }
        
        successCount++;
        results.push({ ticker: reit.ticker, status: "success", count: scrapeResult.data.length });
      } else {
        console.error(`[Announcements API] Failed to scrape ${reit.ticker}: ${scrapeResult.error}`);
        failCount++;
        results.push({ ticker: reit.ticker, status: "error", error: scrapeResult.error });
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return NextResponse.json({
      message: "Scraping completed",
      metrics: {
        totalProcessed: allReits.length,
        successCount,
        failCount,
        newAnnouncementsInserted,
        durationMs: Date.now() - startTime,
      },
      results
    });
  } catch (error) {
    console.error("[Announcements API] Unhandled exception:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
