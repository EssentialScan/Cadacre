import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { reits } from "@/db/schema";
import { scrapeReitMarketData } from "@/lib/scraper";
import { eq } from "drizzle-orm";

// Prevents Next.js from caching this route, ensuring it runs on every request
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Security check: ensure the request is authorized by Vercel Cron
  // In development, you can pass ?secret=YOUR_CRON_SECRET to trigger it manually
  const authHeader = request.headers.get("authorization");
  const { searchParams } = new URL(request.url);
  const secretParams = searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && secretParams !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    // We cannot proceed without a DB connection.
    // Structured logging: log the error so the monitoring system catches it.
    console.error("[Scraper API] Database connection not configured.");
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    console.log("[Scraper API] Starting scheduled scrape run...");
    const startTime = Date.now();

    // 1. Fetch all active REITs from our database
    const allReits = await db.select({ id: reits.id, ticker: reits.ticker }).from(reits);
    
    if (allReits.length === 0) {
      console.log("[Scraper API] No REITs found in the database to scrape.");
      return NextResponse.json({ message: "No REITs configured" }, { status: 200 });
    }

    const results = [];
    let successCount = 0;
    let failCount = 0;

    // 2. Iterate and scrape each REIT
    // Using a simple for-loop instead of Promise.all to avoid rate-limiting from Yahoo Finance
    for (const reit of allReits) {
      console.log(`[Scraper API] Fetching data for ${reit.ticker}...`);
      const scrapeResult = await scrapeReitMarketData(reit.ticker);

      if (scrapeResult.success && scrapeResult.data) {
        // 3. Upsert the new data into the database
        const updateData: any = { updatedAt: new Date() };
        
        // Only update fields if we successfully got a non-null value
        if (scrapeResult.data.marketCap !== null) {
          updateData.marketCap = scrapeResult.data.marketCap;
        }
        if (scrapeResult.data.yield !== null) {
          updateData.yield = scrapeResult.data.yield;
        }

        await db
          .update(reits)
          .set(updateData)
          .where(eq(reits.id, reit.id));

        console.log(`[Scraper API] Successfully updated ${reit.ticker}.`);
        successCount++;
        results.push({ ticker: reit.ticker, status: "success", data: scrapeResult.data });
      } else {
        console.error(`[Scraper API] Failed to scrape ${reit.ticker}: ${scrapeResult.error}`);
        failCount++;
        results.push({ ticker: reit.ticker, status: "error", error: scrapeResult.error });
      }
      
      // Small delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const durationMs = Date.now() - startTime;
    console.log(`[Scraper API] Run complete in ${durationMs}ms. Success: ${successCount}, Fail: ${failCount}`);

    return NextResponse.json({
      message: "Scraping completed",
      metrics: {
        totalProcessed: allReits.length,
        successCount,
        failCount,
        durationMs,
      },
      results
    });
  } catch (error) {
    console.error("[Scraper API] Unhandled exception during scraping run:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
