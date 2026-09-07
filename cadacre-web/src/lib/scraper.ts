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

export interface OfficialAsxAnnouncement {
  title: string;
  publishedAt: string;
  sourceUrl: string;
  isPriceSensitive: boolean;
}

/**
 * Scrapes official announcements directly from the ASX API.
 * This provides the official PDFs rather than just news articles.
 */
export async function scrapeOfficialAsxAnnouncements(ticker: string): Promise<{ success: boolean; data?: OfficialAsxAnnouncement[]; error?: string }> {
  try {
    const url = `https://www.asx.com.au/asx/1/company/${ticker}/announcements?count=20&market_coverage=all`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from ASX API. Status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
       return { success: true, data: [] };
    }

    const announcements = data.data.map((item: any) => ({
      title: item.header,
      publishedAt: item.document_release_date,
      // The API usually returns relative paths like /asxpdf/2024.../pdf...
      sourceUrl: item.url.startsWith("http") ? item.url : `https://www.asx.com.au${item.url}`,
      isPriceSensitive: item.price_sensitive || false,
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

import pdf from "pdf-parse";
import Groq from "groq-sdk";

export async function extractMetricsFromPdf(pdfUrl: string) {
  try {
    // Only initialize Groq if the key exists to avoid crashing if it's missing in dev
    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY is not set. Skipping PDF extraction.");
      return { ntaDiscount: null, gearing: null, wale: null };
    }
    
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error("Failed to download PDF");
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const data = await pdf(buffer);
    const text = data.text.substring(0, 30000); // Truncate to stay within LLM context limits
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a financial analyst. Extract NTA (Net Tangible Assets per unit or NTA backing), Gearing (percentage), and WALE (Weighted Average Lease Expiry in years) from the text. Note that for NTA, if you only find NTA backing value (e.g., $1.20), just return 0 for now as discount calculation requires current price. If a value isn't found, return null. Respond ONLY with a valid JSON object: {\"ntaDiscount\": number | null, \"gearing\": number | null, \"wale\": number | null}."
        },
        {
          role: "user",
          content: text
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
       return JSON.parse(content);
    }
  } catch (e) {
    console.error("PDF Extraction error:", e);
  }
  
  return { ntaDiscount: null, gearing: null, wale: null };
}
