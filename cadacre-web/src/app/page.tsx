import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { RentVsRentvestTeaser } from "@/components/RentVsRentvestTeaser";
import { HowItWorks } from "@/components/HowItWorks";
import { DataSources } from "@/components/DataSources";
import { RecordBanner } from "@/components/RecordBanner";
import { SampleLedger } from "@/components/SampleLedger";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { SiteFooter } from "@/components/SiteFooter";
import { PaperGrain } from "@/components/PaperGrain";
import { getAllTowns } from "@/data";

export default function Home() {
  const towns = getAllTowns();
  const heroTowns = towns.filter((t) => (t.region ?? "Regional NSW") === "Regional NSW");

  return (
    <div className="relative flex min-h-screen flex-col">
      <PaperGrain />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Hero towns={heroTowns} />
          <ProblemSection />
          <RentVsRentvestTeaser />
          <HowItWorks />
          <DataSources />
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
