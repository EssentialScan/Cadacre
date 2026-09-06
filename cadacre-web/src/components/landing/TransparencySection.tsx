"use client";

import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";
import { FileText, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function TransparencySection() {
  const [showSource, setShowSource] = useState(false);

  return (
    <section className="py-24 bg-white border-b border-border">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col items-start text-left">
            <SlideIn direction="up">
              <h2 className="font-display text-4xl md:text-[42px] font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                Every number should have a story.
              </h2>
            </SlideIn>
            
            <SlideIn direction="up" delay={0.1}>
              <p className="text-[17px] text-muted-foreground mb-8 leading-relaxed max-w-md">
                REITCompare provides a transparent source trail for every material metric. We don't hide our methodology or expect you to trust black-box calculations.
              </p>
            </SlideIn>
          </div>

          <div className="relative w-full h-[400px]">
            <ScaleReveal delay={0.2} className="w-full h-full relative flex items-center justify-center perspective-1000">
              
              <div className="relative z-10 w-full max-w-sm">
                {/* Metric Card */}
                <div 
                  className={`bg-white border transition-all duration-500 rounded-xl p-6 ${showSource ? 'border-brand-blue shadow-[0_8px_30px_rgba(15,118,110,0.12)] scale-[1.02] z-20' : 'border-border shadow-[0_4px_14px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] cursor-pointer'}`}
                  onClick={() => setShowSource(!showSource)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="font-display font-bold text-foreground text-lg">WALE</h4>
                    <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded">30 Jun 2026</span>
                  </div>
                  
                  <div className="mb-6">
                    <span className="font-mono-figure font-bold text-4xl text-brand-blue tracking-tight">5.1 <span className="text-xl text-muted-foreground font-medium">years</span></span>
                  </div>

                  <p className="text-sm font-medium text-foreground mb-1">Weighted Average Lease Expiry</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    The weighted average remaining term of leases across the portfolio.
                  </p>

                  <div className="flex items-center text-xs font-semibold text-brand-blue uppercase tracking-wider">
                    {showSource ? 'Close source' : 'View source'}
                    <ArrowRight className={`ml-1.5 h-3.5 w-3.5 transition-transform duration-300 ${showSource ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Source Document Flyout */}
                <AnimatePresence>
                  {showSource && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 16, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      className="absolute top-full left-0 w-full bg-background border border-border shadow-[0_10px_40px_rgba(15,23,42,0.08)] rounded-xl overflow-hidden z-10"
                    >
                      <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5">Source</p>
                          <p className="text-sm font-bold text-foreground">FY2026 Annual Report</p>
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <p className="text-xs text-muted-foreground mb-3">Published 14 Aug 2026 • Page 24</p>
                        {/* Fake document text */}
                        <div className="space-y-2 opacity-60">
                          <div className="w-full h-1.5 bg-muted rounded"></div>
                          <div className="w-5/6 h-1.5 bg-muted rounded"></div>
                          <div className="flex items-center gap-2 py-1">
                            <div className="w-1/3 h-1.5 bg-muted rounded"></div>
                            <div className="w-1/4 h-2.5 bg-brand-blue/30 rounded"></div>
                          </div>
                          <div className="w-4/6 h-1.5 bg-muted rounded"></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
              
              {/* Background decorative elements to make it feel like a desk/workspace */}
              <div className="absolute top-1/4 -right-4 w-64 h-64 bg-brand-blue/[0.02] rounded-full blur-3xl pointer-events-none" />
              
            </ScaleReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
