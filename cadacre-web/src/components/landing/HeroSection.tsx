"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 12]);

  return (
    <section ref={containerRef} className="relative overflow-visible bg-background pt-16 pb-20 md:pt-28 md:pb-24 border-b border-border">
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
              {/* Image Container with Masking */}
              <div 
                className="absolute inset-0 rounded-[24px] overflow-hidden"
                style={{
                  maskImage: "linear-gradient(to right, transparent 0%, black 15%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%)"
                }}
              >
                <Image 
                  src="/reitcompare-australian-property-data.jpg"
                  alt="Australian commercial property landscape with subtle property-data visualisation"
                  fill
                  priority
                  className="object-cover object-right"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                />
              </div>

              {/* Product UI Overlay */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 bg-white/90 backdrop-blur-md border border-[rgba(23,32,42,0.08)] rounded-[14px] p-4 sm:p-5 shadow-lg w-48 sm:w-56"
              >
                <div className="flex items-center gap-2 mb-3 border-b border-border/50 pb-3">
                  <div className="w-5 h-5 rounded bg-brand-blue/10 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-sm bg-brand-blue"></div>
                  </div>
                  <span className="font-semibold text-[13px] tracking-tight">REITCompare</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-muted-foreground">Coverage</span>
                    <span className="text-[12px] font-medium text-foreground">65+ REITs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-muted-foreground">Assets</span>
                    <span className="text-[12px] font-medium text-foreground">1,500+</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-border/50 flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-data-green animate-pulse"></div>
                      <span className="text-[10px] text-muted-foreground">Live sync</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">Updated 2h ago</span>
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
