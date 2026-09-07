import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { reits } from "@/db/schema";
import { eq, lte, gte, and, isNotNull } from "drizzle-orm";
import YahooFinanceClass from "yahoo-finance2";

const yahooFinance = new (YahooFinanceClass as any)();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sector, maxGearing, minYield } = body;

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // Build mechanical filter conditions
    const conditions = [];
    if (sector && sector !== "All") conditions.push(eq(reits.sector, sector));
    if (maxGearing) conditions.push(lte(reits.gearing, Number(maxGearing)));
    if (minYield) conditions.push(gte(reits.yield, Number(minYield)));
    
    // Ensure we only include REITs that have data
    conditions.push(isNotNull(reits.yield));

    // Execute query
    const matchingReits = await db
      .select({
        id: reits.id,
        ticker: reits.ticker,
        name: reits.name,
        sector: reits.sector,
        yield: reits.yield,
        gearing: reits.gearing,
      })
      .from(reits)
      .where(and(...conditions));

    if (matchingReits.length === 0) {
      return NextResponse.json({ basket: [], backtest: [] });
    }

    // Limit to top 10 to avoid excessive Yahoo Finance API calls in real-time
    const basket = matchingReits.slice(0, 10);

    // Backtesting: Pull 1 year of historical monthly data for the basket
    const period1 = new Date();
    period1.setFullYear(period1.getFullYear() - 1); // 1 year ago
    
    const backtestDataMap = new Map<string, number>(); // date -> total portfolio value
    let startingPortfolioValue = 10000; // Arbitrary $10k starting value
    
    // Equal weighting: split the $10k equally among the basket
    const initialAllocationPerReit = startingPortfolioValue / basket.length;

    // Fetch historical data for each REIT
    for (const reit of basket) {
      try {
        const yahooTicker = `${reit.ticker}.AX`;
        const history = await yahooFinance.historical(yahooTicker, {
          period1: period1.toISOString().split('T')[0],
          interval: '1mo', // Monthly data points
        });

        if (history.length > 0) {
          // Determine the starting price to calculate how many units we bought
          const firstPrice = history[0].close;
          const unitsOwned = initialAllocationPerReit / firstPrice;

          for (const point of history) {
            const dateStr = point.date.toISOString().split('T')[0].substring(0, 7); // YYYY-MM
            const currentValue = unitsOwned * point.close;
            
            backtestDataMap.set(dateStr, (backtestDataMap.get(dateStr) || 0) + currentValue);
          }
        }
      } catch (e) {
        console.error(`Failed to fetch history for ${reit.ticker}`, e);
      }
    }

    // Format backtest data for Recharts
    const backtestChartData = Array.from(backtestDataMap.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate aggregated stats
    const avgYield = basket.reduce((acc, r) => acc + (r.yield || 0), 0) / basket.length;
    const avgGearing = basket.reduce((acc, r) => acc + (r.gearing || 0), 0) / basket.length;

    return NextResponse.json({
      basket,
      stats: {
        count: basket.length,
        avgYield,
        avgGearing,
      },
      backtest: backtestChartData
    });

  } catch (error) {
    console.error("Basket API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
