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
import { motion } from "framer-motion";
import { AmbientSection } from "@/components/ambient/AmbientSection";

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
      <section className="py-20 md:py-32 bg-transparent relative overflow-hidden">
        <AmbientSection theme="neutral" />
        <div className="mx-auto max-w-6xl px-6 sm:px-8 relative z-10">
          <div className="text-center mb-20">
            <SlideIn direction="up">
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">Built differently.</h2>
            </SlideIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <SlideIn direction="up" delay={0.1}>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-blue/5 flex items-center justify-center mb-6 shadow-sm border border-brand-blue/10">
                  <Settings className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-3">Tool-first</h3>
                <p className="text-[16px] text-muted-foreground leading-relaxed font-medium">
                  Interactive tools instead of static finance content. You drive the analysis.
                </p>
              </div>
            </SlideIn>
            
            <SlideIn direction="up" delay={0.2}>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-blue/5 flex items-center justify-center mb-6 shadow-sm border border-brand-blue/10">
                  <Eye className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-3">Transparent</h3>
                <p className="text-[16px] text-muted-foreground leading-relaxed font-medium">
                  Sources, dates and methodology stay visible. No black-box metrics.
                </p>
              </div>
            </SlideIn>
            
            <SlideIn direction="up" delay={0.3}>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-blue/5 flex items-center justify-center mb-6 shadow-sm border border-brand-blue/10">
                  <Shield className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-3">Independent</h3>
                <p className="text-[16px] text-muted-foreground leading-relaxed font-medium">
                  No platform-generated recommendations. Clean, unbiased factual data.
                </p>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-transparent relative overflow-hidden">
        <AmbientSection theme="neutral" />
        <div className="mx-auto max-w-4xl px-6 sm:px-8 relative z-10">
          <SlideIn direction="up">
            <h2 className="font-display text-4xl font-bold tracking-tight text-foreground text-center mb-16">Frequently Asked Questions</h2>
          </SlideIn>
          
          <SlideIn direction="up" delay={0.1}>
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(23,32,42,0.04)] border border-border/60 p-6 md:p-10">
              <Accordion className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/60 last:border-0 py-3">
                    <AccordionTrigger className="text-[17px] font-semibold text-foreground hover:no-underline hover:text-brand-blue text-left transition-colors">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[16px] text-muted-foreground leading-relaxed pt-2 pb-6">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </SlideIn>
        </div>
      </section>

      {/* Final CTA Section - Premium Glassmorphic */}
      <section className="py-24 md:py-40 bg-transparent relative overflow-hidden">
        <AmbientSection theme="cta" />
        {/* Subtle Background Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(15, 118, 110, 0.15) 1px, transparent 0)",
            backgroundSize: "32px 32px"
          }}
        />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-4xl px-6 sm:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_40px_100px_rgba(15,23,42,0.1)] rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden"
          >
            {/* Inner Glow */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent" />
            
            <h2 className="font-display text-4xl md:text-[56px] font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Start with the <span className="text-brand-blue">data.</span>
            </h2>
            
            <p className="text-[19px] text-muted-foreground mb-12 leading-relaxed max-w-lg mx-auto font-medium">
              Explore Australian REITs, properties and metrics without building the spreadsheet yourself.
            </p>
  
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explore">
                <Button size="lg" className="rounded-xl bg-brand-blue hover:bg-[#0B5F59] text-white shadow-[0_8px_24px_rgba(15,118,110,0.25)] h-14 px-10 text-[16px] font-bold w-full sm:w-auto transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  Explore REITs
                </Button>
              </Link>
              <Link href="#map">
                <Button variant="outline" size="lg" className="rounded-xl bg-white border-border shadow-sm hover:bg-[#F7F8FA] text-foreground h-14 px-10 text-[16px] font-bold w-full sm:w-auto transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  Explore the map
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
