"use client";

import Image from "next/image";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { AmbientSection } from "@/components/ambient/AmbientSection";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search, ChevronDown, Filter } from "lucide-react";

export function ProductShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Step 1: Interface appears
  const uiScale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);
  const uiOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  // Step 2: Filter dropdown opens
  const filterOpacity = useTransform(scrollYProgress, [0.25, 0.3], [0, 1]);
  const filterY = useTransform(scrollYProgress, [0.25, 0.3], [-10, 0]);

  // Step 3: Table rows filter out (opacity drops on non-matching)
  const nonMatchOpacity = useTransform(scrollYProgress, [0.35, 0.45], [1, 0.1]);

  // Step 4: Metric highlight (NTA)
  const highlightScale = useTransform(scrollYProgress, [0.5, 0.6], [1, 1.1]);
  const highlightColor = useTransform(scrollYProgress, [0.5, 0.6], ["transparent", "rgba(15,118,110,0.1)"]);

  // Step 5: Source document appears
  const sourceOpacity = useTransform(scrollYProgress, [0.7, 0.8], [0, 1]);
  const sourceX = useTransform(scrollYProgress, [0.7, 0.8], [20, 0]);

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-transparent border-b border-border relative overflow-hidden">
      <AmbientSection theme="technical" />
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <SlideIn direction="up">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-4 block">
              From raw disclosures to useful answers
            </span>
            <h2 className="font-display text-4xl md:text-[52px] font-bold tracking-tight text-foreground leading-[1.05]">
              Interactive intelligence.
            </h2>
          </SlideIn>
        </div>

        {/* Full-width Product Panel (horizontally scrollable below the desktop breakpoint so the table never squishes/overlaps) */}
        <div className="w-full overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
        <motion.div
          style={{ scale: uiScale, opacity: uiOpacity }}
          className="relative w-full max-w-[1380px] min-w-[860px] sm:min-w-0 mx-auto h-[650px] bg-[#F7F8FA] border border-border/80 rounded-[24px] shadow-[0_24px_64px_rgba(15,23,42,0.08)] overflow-hidden"
        >
          {/* Header */}
          <div className="h-14 bg-white border-b border-border px-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="h-8 w-64 bg-background rounded-md border border-border flex items-center px-3">
                <Search className="w-3.5 h-3.5 text-muted-foreground mr-2" />
                <span className="text-[12px] text-muted-foreground">Search REITs, sectors, metrics...</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 px-3 rounded-md border border-border bg-white flex items-center gap-2 text-[12px] font-medium shadow-sm">
                <Filter className="w-3.5 h-3.5" /> Filters
              </div>
            </div>
          </div>

          {/* Animated Dropdown Menu (Step 2) */}
          <motion.div
            style={{ opacity: filterOpacity, y: filterY }}
            className="absolute top-31 right-6 w-56 bg-white border border-border rounded-xl shadow-xl z-30 p-2"
          >
            <div className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider px-2 py-1.5 mb-1">Filter by Sector</div>
            <div className="px-2 py-1.5 text-[13px] hover:bg-muted rounded-md cursor-pointer flex items-center justify-between">Diversified</div>
            <div className="px-2 py-1.5 text-[13px] bg-brand-blue/10 text-brand-blue font-medium rounded-md flex items-center justify-between">
              Industrial <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
            </div>
            <div className="px-2 py-1.5 text-[13px] hover:bg-muted rounded-md cursor-pointer flex items-center justify-between">Retail</div>
          </motion.div>

          <div className="flex h-[calc(100%-3.5rem)]">
            {/* Sidebar */}
            <div className="w-56 border-r border-border bg-white/50 p-4">
              <div className="space-y-1">
                <div className="px-3 py-2 text-[13px] font-medium bg-white rounded-lg shadow-sm border border-border">Screener</div>
                <div className="px-3 py-2 text-[13px] text-muted-foreground hover:bg-white/50 rounded-lg">Portfolios</div>
                <div className="px-3 py-2 text-[13px] text-muted-foreground hover:bg-white/50 rounded-lg">Alerts</div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 relative">
              <div className="bg-white rounded-xl border border-border shadow-sm h-full overflow-hidden flex flex-col">
                <div className="grid grid-cols-6 gap-4 px-5 py-3 border-b border-border bg-background/50 text-[11px] uppercase font-bold tracking-wider text-muted-foreground">
                  <div className="col-span-2">REIT</div>
                  <div className="text-right">Sector</div>
                  <div className="text-right">Yield</div>
                  <div className="text-right">Gearing</div>
                  <div className="text-right">NTA Discount</div>
                </div>

                <div className="flex-1">
                  {[
                    { ticker: "GMG", name: "Goodman Group", sector: "Industrial", yield: "1.2%", gearing: "8.3%", nta: "+45.2%", match: true },
                    { ticker: "GPT", name: "GPT Group", sector: "Diversified", yield: "5.2%", gearing: "28.7%", nta: "-8.4%", match: false },
                    { ticker: "CIP", name: "Centuria Industrial", sector: "Industrial", yield: "5.8%", gearing: "32.1%", nta: "-14.2%", match: true },
                    { ticker: "DXS", name: "Dexus", sector: "Office", yield: "6.1%", gearing: "31.2%", nta: "-12.1%", match: false },
                    { ticker: "NSR", name: "National Storage", sector: "Industrial", yield: "4.5%", gearing: "24.5%", nta: "-2.1%", match: true },
                  ].map((row, i) => (
                    <motion.div 
                      key={row.ticker}
                      style={{ opacity: row.match ? 1 : nonMatchOpacity }}
                      className="grid grid-cols-6 gap-4 px-5 py-4 border-b border-border/50 items-center relative"
                    >
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center font-bold text-[10px] text-brand-blue">{row.ticker}</div>
                        <span className="font-medium text-[13px] text-foreground">{row.name}</span>
                      </div>
                      <div className="text-right text-[12px] text-muted-foreground">{row.sector}</div>
                      <div className="text-right font-mono-figure text-[13px] tabular-nums">{row.yield}</div>
                      <div className="text-right font-mono-figure text-[13px] tabular-nums">{row.gearing}</div>
                      
                      {/* Highlighted Metric (Step 4) */}
                      <motion.div 
                        style={row.ticker === "CIP" ? { scale: highlightScale, backgroundColor: highlightColor } : {}}
                        className={`text-right font-mono-figure text-[13px] tabular-nums px-2 py-1 rounded-md ${row.nta.startsWith('-') ? 'text-data-red' : 'text-data-green'}`}
                      >
                        {row.nta}
                      </motion.div>

                      {/* Source Document Popup (Step 5) */}
                      {row.ticker === "CIP" && (
                        <motion.div
                          style={{ opacity: sourceOpacity, x: sourceX }}
                          className="absolute right-[120%] top-1/2 -translate-y-1/2 w-64 bg-white border border-border rounded-xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] p-4 z-40 pointer-events-none"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-1.5 py-0.5 bg-brand-blue/10 text-brand-blue rounded text-[10px] font-bold uppercase tracking-wider">Source</span>
                            <span className="text-[11px] text-muted-foreground">FY24 Half Year Results</span>
                          </div>
                          <div className="w-full h-24 relative rounded border border-border overflow-hidden mb-2">
                            <Image src="/reitcompare-fragmented-information.jpg" alt="Document extract" fill className="object-cover opacity-80" />
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
                            <div className="absolute top-1/2 left-4 right-4 h-6 bg-yellow-200/40 border border-yellow-400/50 rounded flex items-center justify-between px-2 text-[10px] font-mono-figure text-yellow-900 font-bold">
                              <span>NTA per unit</span>
                              <span>$3.42</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-snug">Value extracted directly from page 14 of the statutory accounts.</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
