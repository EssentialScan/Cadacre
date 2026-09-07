import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { MapShowcaseSection } from "@/components/landing/MapShowcaseSection";
import { TransparencySection } from "@/components/landing/TransparencySection";
import { PremiumApiSection } from "@/components/landing/PremiumApiSection";
import { FaqFinalSection } from "@/components/landing/FaqFinalSection";
import { PropertySection } from "@/components/landing/PropertySection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8FA]">
        <SiteHeader />
        <main className="flex-1">
          <div className="bg-[#F7F8FA]"><HeroSection /></div>
          <div className="bg-[#FFFFFF]"><ProblemSection /></div>
          <div className="bg-[#F7F8FA]"><ProductShowcase /></div>
          <div className="bg-[#FFFFFF]"><MapShowcaseSection /></div>
          <div className="bg-[#F7F8FA]"><PropertySection /></div>
          <div className="bg-[#FFFFFF]"><TransparencySection /></div>
          <div className="bg-[#F7F8FA]"><PremiumApiSection /></div>
          <div className="bg-[#FFFFFF]"><FaqFinalSection /></div>
        </main>
        <SiteFooter />
    </div>
  );
}
