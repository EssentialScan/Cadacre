import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { BigStatementSection } from "@/components/landing/BigStatementSection";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { MapShowcaseSection } from "@/components/landing/MapShowcaseSection";
import { TransparencySection } from "@/components/landing/TransparencySection";
import { PremiumApiSection } from "@/components/landing/PremiumApiSection";
import { FaqFinalSection } from "@/components/landing/FaqFinalSection";
import { PropertySection } from "@/components/landing/PropertySection";
import { getDb } from "@/db/client";
import { reits, reitAssets } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const db = getDb();
  let showcaseReits: any[] = [];
  let heroAssets: any[] = [];
  
  if (db) {
    try {
      showcaseReits = await db
        .select()
        .from(reits)
        .orderBy(desc(reits.marketCap))
        .limit(10);
        
      heroAssets = await db
        .select({
          id: reitAssets.id,
          address: reitAssets.address,
          suburb: reitAssets.suburb,
          lat: reitAssets.lat,
          lng: reitAssets.lng,
          propertyType: reitAssets.propertyType,
          bookValue: reitAssets.bookValue,
          reitTicker: reits.ticker
        })
        .from(reitAssets)
        .innerJoin(reits, eq(reitAssets.reitId, reits.id))
        .limit(50);

      // Fallback to mock assets if DB is empty
      if (heroAssets.length === 0) {
        heroAssets = [
          { id: "mock-1", address: "1-3 Burrows Road", suburb: "Alexandria", state: "NSW", lat: -33.9118, lng: 151.1925, propertyType: "Industrial", bookValue: 45000000, reitTicker: "GPT" },
          { id: "mock-2", address: "Gateway, 1 Macquarie Place", suburb: "Sydney", state: "NSW", lat: -33.8622, lng: 151.2109, propertyType: "Office", bookValue: 800000000, reitTicker: "DXS" },
          { id: "mock-3", address: "Westfield Bondi Junction", suburb: "Bondi Junction", state: "NSW", lat: -33.8914, lng: 151.2497, propertyType: "Retail", bookValue: 2400000000, reitTicker: "SCG" },
          { id: "mock-4", address: "350 William Street", suburb: "West Melbourne", state: "VIC", lat: -37.8105, lng: 144.9548, propertyType: "Office", bookValue: 120000000, reitTicker: "DXS" },
          { id: "mock-5", address: "M2 Industry Park", suburb: "Dandenong South", state: "VIC", lat: -38.0319, lng: 145.2281, propertyType: "Industrial", bookValue: 65000000, reitTicker: "GMG" },
          { id: "mock-6", address: "Queen Victoria Building", suburb: "Sydney", state: "NSW", lat: -33.8715, lng: 151.2066, propertyType: "Retail", bookValue: 750000000, reitTicker: "VCX" },
          { id: "mock-7", address: "Brisbane Square", suburb: "Brisbane City", state: "QLD", lat: -27.4720, lng: 153.0232, propertyType: "Office", bookValue: 350000000, reitTicker: "CQR" },
          { id: "mock-8", address: "Kewdale Freight Terminal", suburb: "Kewdale", state: "WA", lat: -31.9790, lng: 115.9610, propertyType: "Industrial", bookValue: 82000000, reitTicker: "CIP" },
        ];
      }
    } catch (e) {
      console.warn("Failed to fetch data for home page", e);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8FA]">
        <SiteHeader />
        <main className="flex-1">
          <HeroSection heroAssets={heroAssets} />
          <ProblemSection />
          <BigStatementSection />
          <ProductShowcase initialReits={showcaseReits} />
          <MapShowcaseSection />
          <PropertySection />
          <TransparencySection />
          <PremiumApiSection />
          <FaqFinalSection />
        </main>
        <SiteFooter />
    </div>
  );
}
