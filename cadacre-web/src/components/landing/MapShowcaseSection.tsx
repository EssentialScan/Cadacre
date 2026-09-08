"use client";

import Image from "next/image";
import Link from "next/link";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AmbientSection } from "@/components/ambient/AmbientSection";

export function MapShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Cinematic map background scale and opacity
  const bgScale = useTransform(scrollYProgress, [0, 0.4], [1.1, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  
  // UI layer reveal
  const uiOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const uiY = useTransform(scrollYProgress, [0.3, 0.5], [40, 0]);

  return (
    <section id="map" ref={containerRef} className="py-0 bg-background relative overflow-hidden min-h-[100vh] flex items-center">
      <AmbientSection theme="map" />
      
      {/* Cinematic Background Image Layer */}
      <motion.div 
        style={{ scale: bgScale, opacity: bgOpacity }}
        className="absolute inset-0 z-0 origin-center"
      >
        <Image 
          src="/pexels-volkerthimm-27307400.jpg"
          alt="Architectural city or landscape representing Australian real estate"
          fill
          className="object-cover object-[80%_center] md:object-[center_55%]"
          sizes="100vw"
          priority
        />
        {/* Dark cinematic vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent pointer-events-none" />
      </motion.div>

      {/* Interactive Map UI Layer (Reveals on scroll) - hidden on mobile to avoid colliding with the headline */}
      <motion.div
        style={{ opacity: uiOpacity, y: uiY }}
        className="absolute inset-0 z-10 pointer-events-none hidden lg:block"
      >
        {/* Geographic Breadcrumbs */}
        <div className="absolute top-32 left-8 lg:left-24 bg-white  border border-white/10 rounded-md px-4 py-2 shadow-sm flex items-center text-xs font-medium text-white pointer-events-auto">
          <span className="text-white/70 hover:text-white cursor-pointer transition-colors">Australia</span>
          <span className="mx-2 text-white/30">/</span>
          <span className="text-white/70 hover:text-white cursor-pointer transition-colors">NSW</span>
          <span className="mx-2 text-white/30">/</span>
          <span className="text-white">Sydney Basin</span>
        </div>

        {/* Central Selected Pin & Card */}
        <div className="absolute top-[45%] left-1/2 lg:left-[65%] -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-pointer">
          <div className="w-6 h-6 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center relative z-10">
            <div className="w-2.5 h-2.5 bg-brand-blue rounded-full"></div>
          </div>
          <div className="absolute top-0 left-0 w-6 h-6 bg-white rounded-full animate-ping opacity-40" />
          
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 bg-white border border-white/20 shadow-[0_24px_48px_rgba(0,0,0,0.2)] rounded-lg p-5 w-80">
            <div className="flex items-start justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-blue">
                Industrial
              </div>
              <span className="text-xs font-bold text-muted-foreground">GPT</span>
            </div>
            
            <h4 className="font-display font-bold text-[17px] text-foreground mb-1 leading-tight">1-3 Burrows Road</h4>
            <p className="text-[13px] text-muted-foreground mb-5">Alexandria, NSW 2015</p>
            
            <div className="flex justify-between items-end pt-3 border-t border-border">
              <div>
                <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-0.5 tracking-wider">Acquired</span>
                <span className="font-medium text-foreground text-[15px] tabular-nums">2022</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-0.5 tracking-wider">Book Value</span>
                <span className="font-medium text-data-green text-[17px] tabular-nums">$45.0m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Other subtle pins & clusters */}
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-white  rounded-full shadow-sm" />
        <div className="absolute top-[30%] left-1/4 w-4 h-4 bg-white  rounded-full shadow-sm" />
        <div className="absolute bottom-1/4 right-1/3 w-3.5 h-3.5 bg-white  rounded-full shadow-sm" />
        
        {/* Glowing Clusters */}
        <div className="absolute top-1/3 right-[15%] w-14 h-14 bg-white  text-white flex items-center justify-center rounded-full text-sm font-bold border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">14</div>
        <div className="absolute bottom-[20%] left-[30%] w-12 h-12 bg-white  text-white flex items-center justify-center rounded-full text-xs font-bold border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">8</div>
      </motion.div>

      {/* Foreground Content Layer */}
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 relative z-20 pointer-events-none">
        {/* Massive Overlapping Text Block */}
        <div className="max-w-xl text-left pointer-events-auto">
          <SlideIn direction="up">
            <h2 className="font-display text-[56px] md:text-[72px] font-bold tracking-tight text-white leading-[1.05] mb-6 shadow-sm">
              See the property<br />behind the ticker.
            </h2>
          </SlideIn>
          
          <SlideIn direction="up" delay={0.1}>
            <p className="text-[19px] text-white/80 mb-10 leading-relaxed max-w-md font-medium">
              Explore portfolios by suburb, city and region to understand exactly where geographic exposure sits across Australia.
            </p>
          </SlideIn>

          <SlideIn direction="up" delay={0.2}>
            <Link href="/explore">
              <button className="px-8 py-4 bg-white text-foreground rounded-lg text-[15px] font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-[1.02] active:scale-95 transition-transform flex items-center gap-3">
                Explore the Map <span className="text-brand-blue">&rarr;</span>
              </button>
            </Link>
          </SlideIn>
        </div>
      </div>

    </section>
  );
}
