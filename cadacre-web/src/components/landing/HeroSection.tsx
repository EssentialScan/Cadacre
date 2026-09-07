"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AmbientSection } from "@/components/ambient/AmbientSection";
import { NationalAssetMap } from "@/components/NationalAssetMap";
import { Lock } from "lucide-react";

export function HeroSection({ heroAssets }: { heroAssets?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 12]);

  return (
    <section ref={containerRef} className="relative overflow-visible bg-transparent pt-16 pb-20 md:pt-28 md:pb-24">
      <AmbientSection theme="hero" />
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Copy */}
          <div className="lg:col-span-5 flex flex-col items-start text-left z-20">
            <SlideIn direction="up" delay={0.1}>
              <div className="mb-6 inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground shadow-sm">
                Australian REIT data
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
          </div>

          {/* Right Column: Generated Image with Art Direction */}
          <div className="lg:col-span-7 relative w-full h-[400px] sm:h-[500px] lg:h-[600px] flex justify-end">
            <motion.div 
              style={{ y }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full lg:w-[110%] lg:-mr-[10%] rounded-[24px] overflow-visible shadow-[0_8px_30px_rgba(23,32,42,0.06)] border border-[rgba(23,32,42,0.08)]"
            >
              {/* Map Container with Masking */}
              <div
                className="absolute inset-0 rounded-[24px] overflow-hidden lg:[mask-image:linear-gradient(to_right,transparent_0%,black_15%)] lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_15%)] bg-muted/30"
              >
                <div className="relative w-full h-full">
                  <NationalAssetMap assets={heroAssets || []} initialViewState={{ longitude: 133.7751, latitude: -25.2744, zoom: 3 }} isLockedSample={true} />
                </div>
              </div>

              {/* Product UI Overlay */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 bg-white/90 backdrop-blur-md border border-[rgba(23,32,42,0.08)] rounded-[14px] p-4 sm:p-5 shadow-lg w-48 sm:w-56"
              >
                <div className="flex items-center gap-2 mb-3/50 pb-3">
                  <div className="w-5 h-5 rounded bg-brand-blue/10 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-sm bg-brand-blue"></div>
                  </div>
                  <span className="font-semibold text-[13px] tracking-tight">REITCompare</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center group relative cursor-help">
                    <span className="text-[12px] text-muted-foreground transition-colors group-hover:text-foreground">Coverage</span>
                    <span className="text-[12px] font-medium text-foreground underline decoration-border underline-offset-2 group-hover:decoration-brand-blue transition-colors">65+ REITs</span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#17202A] text-white text-[10px] rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
                      Representing 98% of the ASX-listed A-REIT market capitalization.
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center group relative cursor-help">
                    <span className="text-[12px] text-muted-foreground transition-colors group-hover:text-foreground">Assets</span>
                    <span className="text-[12px] font-medium text-foreground underline decoration-border underline-offset-2 group-hover:decoration-brand-blue transition-colors">1,500+</span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#17202A] text-white text-[10px] rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
                      Individually geocoded and tracked physical properties across Australia.
                    </div>
                  </div>
                  
                  <div className="pt-2 mt-2 border-t border-border/50 flex justify-between items-center group relative cursor-help">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-data-green animate-pulse"></div>
                      <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Live sync</span>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">Updated 2h ago</span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#17202A] text-white text-[10px] rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed text-right">
                      Last synchronized with ASX disclosures and pricing data.
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
