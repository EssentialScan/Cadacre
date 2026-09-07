import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { reits, announcements } from "@/db/schema";
import { scrapeOfficialAsxAnnouncements, extractMetricsFromPdf } from "@/lib/scraper";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Max allowed on Vercel Hobby tier

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

    const results: any[] = [];
    let successCount = 0;
    let failCount = 0;
    let newAnnouncementsInserted = 0;

    const chunkSize = 5;
    for (let i = 0; i < allReits.length; i += chunkSize) {
      const chunk = allReits.slice(i, i + chunkSize);
      
      await Promise.all(chunk.map(async (reit) => {
        console.log(`[Announcements API] Fetching announcements for ${reit.ticker}...`);
        const scrapeResult = await scrapeOfficialAsxAnnouncements(reit.ticker);

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
                isPriceSensitive: ann.isPriceSensitive
              });
              
              newAnnouncementsInserted++;

              // Deep metrics extraction from financial reports
              const lowerTitle = ann.title.toLowerCase();
              if (lowerTitle.includes("annual report") || lowerTitle.includes("half yearly report") || lowerTitle.includes("financial report")) {
                console.log(`[Announcements API] Extracting deep metrics from ${reit.ticker} financial report...`);
                const metrics = await extractMetricsFromPdf(ann.sourceUrl);
                
                const updates: any = {};
                if (metrics.ntaDiscount != null) updates.ntaDiscount = metrics.ntaDiscount;
                if (metrics.gearing != null) updates.gearing = metrics.gearing;
                if (metrics.wale != null) updates.wale = metrics.wale;
                
                if (Object.keys(updates).length > 0) {
                  await db.update(reits).set(updates).where(eq(reits.id, reit.id));
                  console.log(`[Announcements API] Updated deep metrics for ${reit.ticker}:`, updates);
                }
              }
            }
          }
          
          successCount++;
          results.push({ ticker: reit.ticker, status: "success", count: scrapeResult.data.length });
        } else {
          console.error(`[Announcements API] Failed to scrape ${reit.ticker}: ${scrapeResult.error}`);
          failCount++;
          results.push({ ticker: reit.ticker, status: "error", error: scrapeResult.error });
        }
      }));
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
