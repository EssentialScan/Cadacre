import { NationalAssetMap } from "@/components/NationalAssetMap";
import { ExploreClient } from "./ExploreClient";
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
          lat: reitAssets.lat,
          lng: reitAssets.lng,
          propertyType: reitAssets.propertyType,
          bookValue: reitAssets.bookValue,
          occupancyRate: reitAssets.occupancyRate,
          wale: reitAssets.wale,
          capRate: reitAssets.capRate,
          gla: reitAssets.gla,
          majorTenant: reitAssets.majorTenant,
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
    <ExploreClient assets={assets} />
  );
}