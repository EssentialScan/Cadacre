"use client";

import { SlideIn } from "@/components/motion/ScrollAnimations";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Settings, Eye, Shield } from "lucide-react";

export function FaqFinalSection() {
  const faqs = [
    {
      q: "What is REITCompare?",
      a: "REITCompare is an independent data platform that makes it easy to explore, compare, and analyze Australian Real Estate Investment Trusts (A-REITs) and the physical properties they own."
    },
    {
      q: "Where does the data come from?",
      a: "All data is sourced directly from public disclosures, including annual reports, half-year results, ASX announcements, and statutory filings. We do not use third-party analyst estimates or fabricated 'black-box' calculations."
    },
    {
      q: "How often is the data updated?",
      a: "Metrics are updated shortly after new public disclosures are released to the market. Market pricing and related calculations (like NTA discount/premium) are updated daily."
    },
    {
      q: "Can I compare REITs?",
      a: "Yes. The core of the platform is a flexible screening tool that allows you to filter and sort REITs by sector, yield, gearing, WALE, and discount to NTA."
    },
    {
      q: "Can I explore individual properties?",
      a: "Yes. Our national asset map allows you to explore over 1,500 geocoded properties owned by Australian REITs, so you can see exactly where your exposure lies."
    },
    {
      q: "Does REITCompare provide financial advice?",
      a: "No. REITCompare provides factual information and user-controlled analysis tools. We do not provide personal or general financial advice, recommendations, or 'buy/sell' ratings."
    },
    {
      q: "What is included in Pro?",
      a: "REITCompare Pro ($12/month) adds portfolio tracking, advanced user-defined alerts, saved comparison views, and detailed distribution/tax-component tracking."
    },
    {
      q: "What is the REIT Data API?",
      a: "The API is a B2B offering for developers, fintechs, and advisors who need clean, structured Australian REIT and property data piped directly into their own applications or workflows."
    }
  ];

  return (
    <>
      {/* Differentiation Section */}
      <section className="py-24 bg-white border-b border-border">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="text-center mb-16">
            <SlideIn direction="up">
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">Built differently.</h2>
            </SlideIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <SlideIn direction="up" delay={0.1}>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center mb-6">
                  <Settings className="h-5 w-5 text-brand-blue" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-3">Tool-first</h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  Interactive tools instead of static finance content.
                </p>
              </div>
            </SlideIn>
            
            <SlideIn direction="up" delay={0.2}>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center mb-6">
                  <Eye className="h-5 w-5 text-brand-blue" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-3">Transparent</h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  Sources, dates and methodology stay visible.
                </p>
              </div>
            </SlideIn>
            
            <SlideIn direction="up" delay={0.3}>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center mb-6">
                  <Shield className="h-5 w-5 text-brand-blue" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-3">Independent</h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  No platform-generated recommendations. You control the analysis.
                </p>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background border-b border-border">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <SlideIn direction="up">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground text-center mb-12">Frequently Asked Questions</h2>
          </SlideIn>
          
          <SlideIn direction="up" delay={0.1}>
            <Accordion className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-border py-2">
                  <AccordionTrigger className="text-[15px] font-medium text-foreground hover:no-underline hover:text-brand-blue text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[15px] text-muted-foreground leading-relaxed pt-2 pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SlideIn>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-white border-b border-border text-center">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <SlideIn direction="up">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Start with the data.
            </h2>
          </SlideIn>
          
          <SlideIn direction="up" delay={0.1}>
            <p className="text-[17px] text-muted-foreground mb-10 leading-relaxed max-w-lg mx-auto">
              Explore Australian REITs, properties and metrics without building the spreadsheet yourself.
            </p>
          </SlideIn>

          <SlideIn direction="up" delay={0.2} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore">
              <Button size="lg" className="rounded-lg btn-premium h-12 px-8 text-[15px] font-medium w-full sm:w-auto">
                Explore REITs
              </Button>
            </Link>
            <Link href="#map">
              <Button variant="outline" size="lg" className="rounded-lg bg-white border-border shadow-sm hover:bg-muted text-foreground h-12 px-8 text-[15px] font-medium w-full sm:w-auto">
                Explore the map
              </Button>
            </Link>
          </SlideIn>
        </div>
      </section>
    </>
  );
}
