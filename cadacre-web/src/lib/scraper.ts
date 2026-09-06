import yahooFinance from "yahoo-finance2";

export interface ScrapedReitData {
  ticker: string;
  marketCap: number | null;
  yield: number | null;
  timestamp: string;
}

export interface ScraperResult {
  success: boolean;
  data?: ScrapedReitData;
  error?: string;
}

/**
 * Scrapes real-time market data for an ASX REIT using yahoo-finance2.
 * Note: Yahoo Finance requires the '.AX' suffix for Australian stocks.
 */
export async function scrapeReitMarketData(ticker: string): Promise<ScraperResult> {
  const yahooTicker = `${ticker}.AX`;
  
  try {
    // We want the quote for Market Cap and the summary detail for Dividend Yield
    const [quote, quoteSummary] = await Promise.all([
      yahooFinance.quote(yahooTicker),
      yahooFinance.quoteSummary(yahooTicker, { modules: ["summaryDetail"] })
    ]);

    // Format the data
    // Market cap is usually returned in raw dollars
    const marketCap = (quote as any).marketCap || null;
    
    // Dividend yield is usually returned as a decimal (e.g., 0.052 for 5.2%)
    // We multiply by 100 to store it as a percentage in our DB schema
    const rawYield = (quoteSummary as any).summaryDetail?.dividendYield;
    const yieldPercentage = rawYield != null ? rawYield * 100 : null;

    return {
      success: true,
      data: {
        ticker,
        marketCap,
        yield: yieldPercentage,
        timestamp: new Date().toISOString(),
      }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export interface ScrapedAnnouncement {
  title: string;
  publishedAt: string;
  sourceUrl: string;
}

export async function scrapeReitAnnouncements(ticker: string): Promise<{ success: boolean; data?: ScrapedAnnouncement[]; error?: string }> {
  const yahooTicker = `${ticker}.AX`;
  
  try {
    const result = await yahooFinance.search(yahooTicker, { newsCount: 5 });
    
    if (!(result as any).news || (result as any).news.length === 0) {
      return { success: true, data: [] };
    }

    const announcements = (result as any).news.map((item: any) => ({
      title: item.title,
      publishedAt: new Date(item.providerPublishTime * 1000).toISOString(),
      sourceUrl: item.link,
    }));

    return {
      success: true,
      data: announcements
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}
