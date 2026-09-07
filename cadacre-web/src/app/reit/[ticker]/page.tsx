import { notFound } from "next/navigation";
import { seedReits } from "@/data/reitSeed";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DistributionChart } from "@/components/DistributionChart";
import { NationalAssetMap } from "@/components/NationalAssetMap";
import { MapPin, Building2, TrendingUp, Percent, Clock, Briefcase } from "lucide-react";
import { getDb } from "@/db/client";
import { reits, reitAssets } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import CommunitySection from "./CommunitySection";

export const dynamic = 'force-dynamic';

export default async function ReitDetailPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const db = getDb();
  
  if (!db) return notFound();

  const [dbReit] = await db
    .select()
    .from(reits)
    .where(eq(reits.ticker, ticker.toUpperCase()))
    .limit(1);

  if (!dbReit) {
    notFound();
  }

  // Fetch assets for this REIT
  const dbAssets = await db
    .select()
    .from(reitAssets)
    .where(eq(reitAssets.reitId, dbReit.id));

  const reitAssetsMapped = dbAssets.map(a => ({
    ...a,
    reitTicker: dbReit.ticker,
    state: "NSW", // Fallback
  }));

  // Fetch peers in same sector
  const dbPeers = await db
    .select()
    .from(reits)
    .where(eq(reits.sector, dbReit.sector))
    .limit(5);
  
  const peers = dbPeers.filter(p => p.ticker !== dbReit.ticker);

  // Fallback for missing fields not yet in DB schema
  const mockReit = seedReits.find((r) => r.ticker.toUpperCase() === ticker.toUpperCase());
  const description = mockReit?.description || "A premier Australian Real Estate Investment Trust.";
  const topTenants = mockReit?.topTenants || [];
  const geoExposure = mockReit?.geoExposure || [];
  const distributionHistory = mockReit?.distributionHistory || [];

  const formatCurrency = (val: number | null) => {
    if (val == null) return "-";
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  const formatPercent = (val: number | null) => val == null ? "-" : `${val.toFixed(1)}%`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      
      <main className="flex-1 bg-background pt-12 pb-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          
          {/* Header Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center rounded-full border border-border bg-white px-2.5 py-0.5 text-xs font-semibold text-muted-foreground shadow-sm">
                {dbReit.sector}
              </span>
              <span className="text-sm font-medium text-muted-foreground/60">ASX:{dbReit.ticker}</span>
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-foreground mb-3">
              {dbReit.name}
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            <Card className="bg-white shadow-premium border border-border transition-all hover:shadow-premium-hover">
              <CardContent className="p-5 flex flex-col items-center text-center justify-center">
                <Briefcase className="h-5 w-5 text-brand-blue mb-2 opacity-80" />
                <p className="text-xs font-medium text-muted-foreground mb-1">Market Cap</p>
                <p className="text-xl font-display font-bold text-foreground tabular-nums tracking-tight">
                  {formatCurrency(dbReit.marketCap)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-premium border border-border transition-all hover:shadow-premium-hover">
              <CardContent className="p-5 flex flex-col items-center text-center justify-center">
                <TrendingUp className="h-5 w-5 text-data-green mb-2 opacity-80" />
                <p className="text-xs font-medium text-muted-foreground mb-1">Yield</p>
                <p className="text-xl font-display font-bold text-brand-blue tabular-nums tracking-tight">
                  {formatPercent(dbReit.yield)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-premium border border-border transition-all hover:shadow-premium-hover">
              <CardContent className="p-5 flex flex-col items-center text-center justify-center">
                <Percent className="h-5 w-5 text-brand-blue mb-2 opacity-80" />
                <p className="text-xs font-medium text-muted-foreground mb-1">NTA Disc/Prem</p>
                <p className={`text-xl font-display font-bold tabular-nums tracking-tight ${(dbReit.ntaDiscount || 0) > 0 ? "text-data-red" : "text-data-green"}`}>
                  {(dbReit.ntaDiscount || 0) > 0 ? "-" : "+"}{formatPercent(Math.abs(dbReit.ntaDiscount || 0))}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-premium border border-border transition-all hover:shadow-premium-hover">
              <CardContent className="p-5 flex flex-col items-center text-center justify-center">
                <Building2 className="h-5 w-5 text-brand-blue mb-2 opacity-80" />
                <p className="text-xs font-medium text-muted-foreground mb-1">Gearing</p>
                <p className="text-xl font-display font-bold text-foreground tabular-nums tracking-tight">
                  {formatPercent(dbReit.gearing)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-premium border border-border transition-all hover:shadow-premium-hover">
              <CardContent className="p-5 flex flex-col items-center text-center justify-center">
                <Clock className="h-5 w-5 text-brand-blue mb-2 opacity-80" />
                <p className="text-xs font-medium text-muted-foreground mb-1">WALE</p>
                <p className="text-xl font-display font-bold text-foreground tabular-nums tracking-tight">
                  {dbReit.wale?.toFixed(1) || "-"} yrs
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Distribution Chart */}
              <Card className="bg-white shadow-premium border border-border overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-muted/20 pb-4 pt-5">
                  <CardTitle className="text-base font-semibold">Distribution History</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-72 w-full">
                    <DistributionChart data={distributionHistory} />
                  </div>
                </CardContent>
              </Card>

              {/* National Asset Map */}
              <Card className="bg-white shadow-premium border border-border overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-muted/20 pb-4 pt-5 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-blue" />
                    Asset Locations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[400px] w-full">
                    <NationalAssetMap assets={reitAssetsMapped} />
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Column */}
            <div className="space-y-8">
              
              {/* Top Tenants */}
              <Card className="bg-white shadow-premium border border-border">
                <CardHeader className="border-b border-border/50 bg-muted/20 pb-4 pt-5">
                  <CardTitle className="text-base font-semibold">Top Tenants</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-border/50">
                    {topTenants.map((tenant, i) => (
                      <li key={i} className="flex justify-between items-center py-3 px-5 hover:bg-muted/30 transition-colors">
                        <span className="text-sm font-medium text-foreground">{tenant.name}</span>
                        <span className="text-sm text-brand-blue font-mono-figure">{formatPercent(tenant.percentage)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Geo Exposure */}
              <Card className="bg-white shadow-premium border border-border">
                <CardHeader className="border-b border-border/50 bg-muted/20 pb-4 pt-5">
                  <CardTitle className="text-base font-semibold">Geographic Exposure</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-border/50">
                    {geoExposure.map((geo, i) => (
                      <li key={i} className="flex justify-between items-center py-3 px-5 hover:bg-muted/30 transition-colors">
                        <span className="text-sm font-medium text-foreground">{geo.state}</span>
                        <span className="text-sm text-brand-blue font-mono-figure">{formatPercent(geo.percentage)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Peers */}
              <Card className="bg-white shadow-premium border border-border">
                <CardHeader className="border-b border-border/50 bg-muted/20 pb-4 pt-5">
                  <CardTitle className="text-base font-semibold">Peers in {dbReit.sector}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {peers.length > 0 ? (
                    <ul className="divide-y divide-border/50">
                      {peers.map((peer, i) => (
                        <li key={i} className="py-3 px-5 hover:bg-muted/30 transition-colors">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-foreground">{peer.ticker}</span>
                            <span className="text-sm text-brand-blue font-mono-figure tracking-tight">{formatPercent(peer.yield)} Yield</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground truncate w-40">{peer.name}</span>
                            <span className="text-xs text-muted-foreground font-mono-figure">MC: {formatCurrency(peer.marketCap)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-5 text-sm text-muted-foreground text-center">
                      No other tracked peers in this sector yet.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Affiliate Links - Monetization Wedge */}
              <Card className="bg-white shadow-premium border border-brand-blue/20 bg-gradient-to-b from-white to-brand-blue/5">
                <CardHeader className="pb-4 pt-5">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    Invest in {dbReit.ticker}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Compare brokers and start investing in {dbReit.name} today. Capital at risk.
                  </p>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-3">
                  <a href={`https://pearler.com/invest/shares/asx/${dbReit.ticker.toLowerCase()}?utm_source=reitcompare&utm_medium=affiliate`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full px-4 py-3 bg-white border border-border rounded-lg shadow-sm hover:border-brand-blue hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">P</div>
                      <span className="text-sm font-medium">Pearler</span>
                    </div>
                    <span className="text-xs font-semibold text-brand-blue group-hover:underline">View Broker →</span>
                  </a>
                  
                  <a href={`https://hellostake.com/au/asx/${dbReit.ticker.toLowerCase()}?utm_source=reitcompare&utm_medium=affiliate`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full px-4 py-3 bg-white border border-border rounded-lg shadow-sm hover:border-brand-blue hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-xs">S</div>
                      <span className="text-sm font-medium">Stake</span>
                    </div>
                    <span className="text-xs font-semibold text-brand-blue group-hover:underline">View Broker →</span>
                  </a>
                  
                  <a href={`https://www.cmcmarkets.com/en-au/invest?utm_source=reitcompare&utm_medium=affiliate`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full px-4 py-3 bg-white border border-border rounded-lg shadow-sm hover:border-brand-blue hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">C</div>
                      <span className="text-sm font-medium">CMC Markets</span>
                    </div>
                    <span className="text-xs font-semibold text-brand-blue group-hover:underline">View Broker →</span>
                  </a>
                  <p className="text-[10px] text-muted-foreground/60 text-center pt-2">
                    We may receive a commission if you open an account through these links. This does not constitute financial advice.
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* Community Layer */}
          <div className="mt-12">
            <CommunitySection reitId={dbReit.id} ticker={dbReit.ticker} />
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
