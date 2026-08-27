import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { HowItWorks } from "@/components/HowItWorks";
import { RecordBanner } from "@/components/RecordBanner";
import { SampleLedger } from "@/components/SampleLedger";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { SiteFooter } from "@/components/SiteFooter";
import { PaperGrain } from "@/components/PaperGrain";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <PaperGrain />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Hero />
          <ProblemSection />
          <HowItWorks />
          <RecordBanner />
          <SampleLedger />
          <Pricing />
          <Faq />
          <FinalCta />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
