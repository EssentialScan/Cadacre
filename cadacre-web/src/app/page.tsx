import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { MapShowcaseSection } from "@/components/landing/MapShowcaseSection";
import { TransparencySection } from "@/components/landing/TransparencySection";
import { PremiumApiSection } from "@/components/landing/PremiumApiSection";
import { FaqFinalSection } from "@/components/landing/FaqFinalSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <HeroSection />
          <ProblemSection />
          <ProductShowcase />
          <MapShowcaseSection />
          <TransparencySection />
          <PremiumApiSection />
          <FaqFinalSection />
        </main>
        <SiteFooter />
    </div>
  );
}
