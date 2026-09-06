"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { ScaleReveal } from "@/components/motion/ScrollAnimations";
import { motion } from "framer-motion";
import { MapPin, Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-20 md:pt-28 md:pb-24 border-b border-border">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Copy */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <SlideIn direction="up" delay={0.1}>
              <div className="mb-6 inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                Australian REIT data, without the spreadsheet
              </div>
            </SlideIn>
            
            <SlideIn direction="up" delay={0.2}>
              <h1 className="font-display text-5xl md:text-[56px] font-bold tracking-[-0.04em] text-foreground leading-[1.05] mb-6">
                See what Australian REITs actually own.
              </h1>
            </SlideIn>
            
            <SlideIn direction="up" delay={0.3}>
              <p className="text-[17px] text-muted-foreground mb-10 max-w-lg leading-[1.6]">
                Compare A-REIT metrics, explore the properties behind them, and build your own analysis from structured public data.
              </p>
            </SlideIn>

            <SlideIn direction="up" delay={0.4} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/explore">
                <Button size="lg" className="btn-premium px-8 rounded-lg w-full sm:w-auto font-medium h-12 text-[15px]">
                  Explore REITs
                </Button>
              </Link>
              <Link href="#map">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-lg px-8 bg-white hover:bg-muted text-foreground border-border shadow-[0_1px_2px_rgba(15,23,42,0.04)] font-medium h-12 text-[15px]">
                  Explore the map
                </Button>
              </Link>
            </SlideIn>

            <SlideIn direction="up" delay={0.5} className="mt-12 flex items-center gap-6 border-t border-border pt-8 w-full">
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-[15px] mb-1">65+ REITs</span>
                <span className="text-[13px] text-muted-foreground">Tracked in dataset</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-[15px] mb-1">1,500+</span>
                <span className="text-[13px] text-muted-foreground">Mapped assets</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-[15px] mb-1">National</span>
                <span className="text-[13px] text-muted-foreground">Coverage</span>
              </div>
            </SlideIn>
          </div>

          {/* Right Column: Miniature Product Preview */}
          <div className="lg:col-span-7 relative w-full h-[540px] lg:h-[640px] perspective-1000">
            <ScaleReveal delay={0.3} className="w-full h-full relative">
              <motion.div 
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                className="absolute inset-0 bg-white border border-border rounded-xl shadow-premium overflow-hidden flex flex-col"
              >
                {/* Fake App Header */}
                <div className="h-14 border-b border-border bg-background/50 flex items-center px-5 gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="bg-white border border-border rounded-md h-8 w-48 flex items-center px-3 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                      <Search className="h-3.5 w-3.5 text-muted-foreground/60 mr-2" />
                      <span className="text-[11px] text-muted-foreground font-medium tracking-wide">Search REITs...</span>
                    </div>
                  </div>
                </div>

                {/* Fake App Body */}
                <div className="flex-1 p-6 relative bg-background/30">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-display font-semibold text-lg text-foreground tracking-tight">Compare REITs</h3>
                    <span className="text-xs text-muted-foreground font-medium tabular-nums">18 results</span>
                  </div>

                  {/* Fake Filters */}
                  <div className="flex gap-2 mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-border text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.02)] text-xs font-medium">
                      Sector: Industrial
                      <span className="opacity-40 ml-1">×</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-medium">
                      Yield &gt; 5%
                      <span className="opacity-60 ml-1 cursor-pointer">×</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-medium">
                      Gearing &lt; 40%
                      <span className="opacity-60 ml-1 cursor-pointer">×</span>
                    </div>
                  </div>

                  {/* Fake Table */}
                  <div className="border border-border rounded-lg bg-white overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                    <div className="grid grid-cols-4 gap-4 p-3 border-b border-border bg-background/50 text-[11px] uppercase font-bold tracking-wider text-muted-foreground">
                      <div>REIT</div>
                      <div className="text-right">Yield</div>
                      <div className="text-right">NTA</div>
                      <div className="text-right">Gearing</div>
                    </div>
                    
                    {/* Rows */}
                    <div className="grid grid-cols-4 gap-4 p-4 border-b border-border hover:bg-muted/30 transition-colors group">
                      <div className="flex flex-col">
                        <span className="font-bold text-[13px] text-foreground">GPT</span>
                        <span className="text-[11px] text-muted-foreground">Diversified</span>
                      </div>
                      <div className="text-right font-mono-figure font-medium text-[13px] tabular-nums pt-1">5.2%</div>
                      <div className="text-right font-mono-figure font-medium text-[13px] tabular-nums text-data-red pt-1">-8.4%</div>
                      <div className="text-right font-mono-figure font-medium text-[13px] tabular-nums pt-1">28.7%</div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 p-4 border-b border-border hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-bold text-[13px] text-foreground">DXS</span>
                        <span className="text-[11px] text-muted-foreground">Office</span>
                      </div>
                      <div className="text-right font-mono-figure font-medium text-[13px] tabular-nums pt-1">6.1%</div>
                      <div className="text-right font-mono-figure font-medium text-[13px] tabular-nums text-data-red pt-1">-12.1%</div>
                      <div className="text-right font-mono-figure font-medium text-[13px] tabular-nums pt-1">31.2%</div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-bold text-[13px] text-foreground">GMG</span>
                        <span className="text-[11px] text-muted-foreground">Industrial</span>
                      </div>
                      <div className="text-right font-mono-figure font-medium text-[13px] tabular-nums pt-1">1.2%</div>
                      <div className="text-right font-mono-figure font-medium text-[13px] tabular-nums text-data-green pt-1">+4.2%</div>
                      <div className="text-right font-mono-figure font-medium text-[13px] tabular-nums pt-1">8.5%</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScaleReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
