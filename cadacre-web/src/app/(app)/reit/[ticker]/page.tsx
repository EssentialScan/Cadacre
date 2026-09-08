import { notFound } from "next/navigation";
import { getDb } from "@/db/client";
import { reits, reitAssets, reitMetrics, reitHistoricalFinancials, reitTransactions, reitEvents, reitDocuments } from "@/db/schema";
import { eq } from "drizzle-orm";
import YahooFinance from "yahoo-finance2";
import Link from "next/link";
import { MapPin, ArrowRight, Download, Eye, Bell, MessageSquare, ExternalLink, Calendar, FileText, Building2 } from "lucide-react";
import { MetricCard } from "@/components/reit/MetricCard";
import { HistoricalFinancials } from "@/components/reit/HistoricalFinancials";
import { NationalAssetMap } from "@/components/NationalAssetMap";

export const dynamic = 'force-dynamic';

export default async function ReitDetailPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const db = getDb();
  
  if (!db) return notFound();

  // 1. Fetch Core REIT Data
  const [dbReit] = await db
    .select()
    .from(reits)
    .where(eq(reits.ticker, ticker.toUpperCase()))
    .limit(1);

  if (!dbReit) {
    notFound();
  }

  // 2. Fetch Terminal Data Models
  const metrics = await db.select().from(reitMetrics).where(eq(reitMetrics.reitId, dbReit.id));
  const financials = await db.select().from(reitHistoricalFinancials).where(eq(reitHistoricalFinancials.reitId, dbReit.id));
  const transactions = await db.select().from(reitTransactions).where(eq(reitTransactions.reitId, dbReit.id));
  const events = await db.select().from(reitEvents).where(eq(reitEvents.reitId, dbReit.id));
  const documents = await db.select().from(reitDocuments).where(eq(reitDocuments.reitId, dbReit.id));
  
  // 3. Fetch Portfolio Assets
  const assets = await db.select().from(reitAssets).where(eq(reitAssets.reitId, dbReit.id));
  const reitAssetsMapped = assets.map(a => ({
    ...a,
    reitTicker: dbReit.ticker,
    state: "NSW", // Fallback
  }));

  // 4. Yahoo Finance Live Data
  let quoteData = null;
  try {
    const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
    const symbol = `${ticker.toUpperCase()}.AX`;
    quoteData = await yf.quote(symbol);
  } catch (error) {
    console.error("Failed to fetch live price:", error);
  }

  // Helper to extract specific metric
  const getMetric = (metricName: string) => {
    return metrics.find(m => m.metric.toLowerCase() === metricName.toLowerCase());
  };

  const nta = getMetric("NTA");
  const ntaDiscount = getMetric("NTA Discount");
  const occupancy = getMetric("Occupancy");
  const wale = getMetric("WALE");
  const gearing = getMetric("Gearing");
  const liquidity = getMetric("Liquidity");
  const aum = getMetric("AUM");

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-24">
      {/* ── HEADER ── */}
      <header className="bg-slate-900 text-white border-b border-slate-800 pt-10 pb-8 px-6 lg:px-12 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-brand-blue/20 text-brand-blue-light border border-brand-blue/30 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                {dbReit.ticker}
              </span>
              <span className="text-slate-400 text-sm font-medium">
                {dbReit.entityType || "Property Trust"} • {dbReit.sector}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              {dbReit.name}
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
              {dbReit.businessModel || "An Australian Real Estate Investment Trust."}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <Eye className="w-4 h-4" /> Watchlist
            </button>
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <Bell className="w-4 h-4" /> Set Alert
            </button>
          </div>
        </div>
      </header>

      {/* ── STICKY NAVIGATION ── */}
      <div className="bg-white border-b border-slate-200 sticky top-[138px] z-30 px-6 lg:px-12 shadow-sm">
        <div className="max-w-7xl mx-auto flex overflow-x-auto hide-scrollbar">
          {["Overview", "Portfolio", "Financials", "Debt & Capital", "Documents"].map(tab => (
            <a key={tab} href={`#${tab.toLowerCase().replace(/ /g, '-')}`} className="whitespace-nowrap px-4 py-4 text-sm font-bold text-slate-500 hover:text-brand-blue border-b-2 border-transparent hover:border-brand-blue transition-colors">
              {tab}
            </a>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 space-y-16">
        
        {/* ── OVERVIEW & LIVE SNAPSHOT ── */}
        <section id="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-mt-48">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-display font-bold text-slate-900 border-b border-slate-200 pb-2">Market Snapshot</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Live Price</span>
                <span className="font-display font-bold text-slate-900 text-2xl">${quoteData?.regularMarketPrice?.toFixed(2) || "-"}</span>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Market Cap</span>
                <span className="font-display font-bold text-slate-900 text-2xl">{quoteData?.marketCap ? `$${(quoteData.marketCap / 1e9).toFixed(2)}B` : "-"}</span>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Trailing Yield</span>
                <span className="font-display font-bold text-slate-900 text-2xl">{quoteData?.trailingAnnualDividendYield ? `${(quoteData.trailingAnnualDividendYield * 100).toFixed(2)}%` : "-"}</span>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">P/E Ratio</span>
                <span className="font-display font-bold text-slate-900 text-2xl">{quoteData?.trailingPE?.toFixed(1) || "-"}</span>
              </div>
            </div>

            <h2 className="text-xl font-display font-bold text-slate-900 border-b border-slate-200 pb-2 mt-10">Valuation & NAV</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard 
                label="NTA per Security" 
                value={nta?.value || null} 
                unit={nta?.unit} 
                sourceTitle={nta?.sourceTitle}
                sourceDate={nta?.sourceDate}
                methodology={nta?.methodology}
                isCalculated={nta?.isCalculated}
              />
              <MetricCard 
                label="NTA Premium/Discount" 
                value={ntaDiscount?.value || null} 
                unit={ntaDiscount?.unit}
                sourceTitle={ntaDiscount?.sourceTitle}
                methodology={ntaDiscount?.methodology}
                isCalculated={ntaDiscount?.isCalculated}
              />
              <MetricCard 
                label="Assets Under Mgmt" 
                value={aum?.value ? `$${(Number(aum.value) / 1e9).toFixed(1)}` : null} 
                unit="Billion"
                sourceTitle={aum?.sourceTitle}
                methodology={aum?.methodology}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-fit">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              Company Profile
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">Headquarters</span>
                <span className="font-medium text-slate-900 text-right">{dbReit.hq || "Not disclosed"}</span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">Structure</span>
                <span className="font-medium text-slate-900 text-right max-w-[150px]">{dbReit.structure || "Not disclosed"}</span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">Website</span>
                {dbReit.website ? (
                  <a href={dbReit.website} target="_blank" className="font-medium text-brand-blue hover:underline flex items-center gap-1">Visit <ExternalLink className="w-3 h-3"/></a>
                ) : (
                  <span className="font-medium text-slate-900">Not disclosed</span>
                )}
              </li>
            </ul>
          </div>
        </section>

        {/* ── PORTFOLIO AT A GLANCE ── */}
        <section id="portfolio" className="space-y-6 scroll-mt-48">
          <h2 className="text-2xl font-display font-bold text-slate-900 border-b border-slate-200 pb-2">Portfolio at a glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard 
                label="Portfolio Occupancy" 
                value={occupancy?.value || null} 
                unit={occupancy?.unit} 
                sourceTitle={occupancy?.sourceTitle}
                methodology={occupancy?.methodology}
              />
              <MetricCard 
                label="Portfolio WALE" 
                value={wale?.value || null} 
                unit={wale?.unit}
                sourceTitle={wale?.sourceTitle}
                methodology={wale?.methodology}
              />
              <MetricCard 
                label="Physical Assets" 
                value={assets.length} 
                sourceTitle="REITCompare Database"
                isCalculated={true}
              />
          </div>

          <div className="h-[500px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative mt-8">
            <NationalAssetMap assets={reitAssetsMapped as any} />
          </div>
        </section>

        {/* ── FINANCIALS ── */}
        <section id="financials" className="space-y-6 scroll-mt-48">
          <h2 className="text-2xl font-display font-bold text-slate-900 border-b border-slate-200 pb-2">Historical Financials</h2>
          <HistoricalFinancials data={financials} />
        </section>

        {/* ── DEBT & CAPITAL ── */}
        <section id="debt-&-capital" className="space-y-6 scroll-mt-48">
          <h2 className="text-2xl font-display font-bold text-slate-900 border-b border-slate-200 pb-2">Debt & Capital Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard 
                label="Gearing" 
                value={gearing?.value || null} 
                unit={gearing?.unit} 
                sourceTitle={gearing?.sourceTitle}
                methodology={gearing?.methodology}
              />
              <MetricCard 
                label="Available Liquidity" 
                value={liquidity?.value ? `$${(Number(liquidity.value) / 1e9).toFixed(2)}B` : null} 
                sourceTitle={liquidity?.sourceTitle}
                methodology={liquidity?.methodology}
              />
          </div>
        </section>
        
        {/* ── DOCUMENTS ── */}
        <section id="documents" className="space-y-6 scroll-mt-48">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2">
            <h2 className="text-2xl font-display font-bold text-slate-900">Document Centre</h2>
          </div>
          
          {documents.length > 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <ul className="divide-y divide-slate-100">
                {documents.map(doc => (
                  <li key={doc.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>
                        <span className="text-xs text-slate-500">{doc.documentType} • Published: {doc.publishDate}</span>
                      </div>
                    </div>
                    <a href={doc.sourceUrl} target="_blank" className="text-brand-blue hover:text-brand-blue-dark font-medium text-sm flex items-center gap-1 bg-brand-blue/5 px-3 py-1.5 rounded-md">
                      Open <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-8 border border-slate-200 rounded-xl bg-slate-50 text-center">
              <p className="text-slate-500 font-medium">No documents publicly disclosed.</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
