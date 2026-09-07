import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { BigStatementSection } from "@/components/landing/BigStatementSection";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { MapShowcaseSection } from "@/components/landing/MapShowcaseSection";
import { TransparencySection } from "@/components/landing/TransparencySection";
import { PremiumApiSection } from "@/components/landing/PremiumApiSection";
import { Pricing } from "@/components/Pricing";
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
        .limit(100);
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
          <Pricing />
          <FaqFinalSection />
        </main>
        <SiteFooter />
    </div>
  );
}
