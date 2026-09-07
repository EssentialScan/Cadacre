import { SiteHeader } from "@/components/SiteHeader";
import { NationalAssetMap } from "@/components/NationalAssetMap";
import { MapPin } from "lucide-react";
import { getDb } from "@/db/client";
import { reitAssets, reits } from "@/db/schema";
import { eq } from "drizzle-orm";

export const metadata = {
  title: "National Asset Discovery Map | REITCompare",
  description: "Explore the physical assets owned by Australian REITs on an interactive map.",
};

export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
  const db = getDb();
  let assets: any[] = [];
  
  if (db) {
    try {
      const dbAssets = await db
        .select({
          id: reitAssets.id,
          reitTicker: reits.ticker,
          address: reitAssets.address,
          suburb: reitAssets.suburb,
          state: reitAssets.state,
          lat: reitAssets.lat,
          lng: reitAssets.lng,
          propertyType: reitAssets.propertyType,
          bookValue: reitAssets.bookValue,
        })
        .from(reitAssets)
        .leftJoin(reits, eq(reits.id, reitAssets.reitId));
        
      assets = dbAssets.map(a => ({
        ...a,
        reitTicker: a.reitTicker || "UNK",
      }));
    } catch (e) {
      console.warn("Database error.", e);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      
      {/* 
        We use a specific layout here for a "full screen" map experience,
        similar to CoreLogic or realestate.com.au
      */}
      <main className="flex-1 flex flex-col h-[calc(100vh-73px)]">
        
        {/* Map Header / Filters Placeholder */}
        <div className="bg-white border-b border-border py-4 px-6 shadow-sm z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-blue/10 rounded-lg">
              <MapPin className="h-5 w-5 text-brand-blue" />
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground text-xl tracking-tight leading-none">
                National Asset Discovery
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Showing {assets.length} geocoded assets nationally
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="px-4 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground bg-muted/20">
              Filters coming soon
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative w-full h-full">
          <NationalAssetMap assets={assets} />
          
          {/* Legend Overlay */}
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] border border-border/50 z-10 pointer-events-none">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Asset Types</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-foreground">
                <span className="w-3 h-3 rounded-full bg-brand-blue opacity-80"></span>
                Industrial & Logistics
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <span className="w-3 h-3 rounded-full bg-brand-blue opacity-80"></span>
                Retail & Shopping Centres
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <span className="w-3 h-3 rounded-full bg-brand-blue opacity-80"></span>
                Commercial Office
              </li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}