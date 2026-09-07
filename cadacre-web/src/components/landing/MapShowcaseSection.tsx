"use client";

import Image from "next/image";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function MapShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Very subtle map transition/reveal
  const uiOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  return (
    <section id="map" ref={containerRef} className="py-24 bg-background border-b border-border min-h-[760px] flex flex-col justify-center relative overflow-hidden">
      
      {/* Background Image Layer (Edge-to-edge) */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/pexels-volkerthimm-27307400.jpg"
          alt="Architectural city or landscape representing Australian real estate"
          fill
          className="object-cover object-[80%_center] md:object-[center_55%]"
          sizes="100vw"
        />
        {/* Subtle gradient overlay to ensure text legibility and blend edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent pointer-events-none" />
      </div>

      {/* Interactive Map UI Layer (Reveals on scroll) */}
      <motion.div 
        className="absolute inset-0 z-10"
        style={{ opacity: uiOpacity }}
      >

        
        {/* Geographic Breadcrumbs */}
        <div className="absolute top-24 lg:top-32 left-6 lg:left-12 bg-white/90 backdrop-blur border border-border rounded-md px-3 py-1.5 shadow-sm z-10 flex items-center text-xs font-medium text-foreground">
          <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Australia</span>
          <span className="mx-2 text-muted-foreground/40">/</span>
          <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">NSW</span>
          <span className="mx-2 text-muted-foreground/40">/</span>
          <span className="text-foreground">Sydney Basin</span>
        </div>

        {/* Markers & Clusters */}
        <div className="absolute inset-0">
          {/* Central Selected Pin */}
          <div className="absolute top-1/2 left-1/2 lg:left-[70%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20">
            <div className="w-5 h-5 bg-brand-blue rounded-full shadow-md flex items-center justify-center relative z-10">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="absolute top-0 left-0 w-5 h-5 bg-brand-blue rounded-full animate-ping opacity-30" />
            
            {/* Selected Asset Card */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white border border-border shadow-[0_10px_28px_rgba(15,23,42,0.08)] rounded-xl p-5 w-72 pointer-events-none">
              <div className="flex items-start justify-between mb-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-blue">
                  Industrial
                </div>
                <span className="text-xs font-bold text-muted-foreground">GPT</span>
              </div>
              
              <h4 className="font-display font-bold text-[15px] text-foreground mb-1 leading-tight">1-3 Burrows Road</h4>
              <p className="text-[13px] text-muted-foreground mb-4">Alexandria, NSW 2015</p>
              
              <div className="flex justify-between items-end pt-3 border-t border-border">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-0.5 tracking-wider">Acquired</span>
                  <span className="font-medium text-foreground text-sm tabular-nums">2022</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-0.5 tracking-wider">Book Value</span>
                  <span className="font-medium text-foreground text-[15px] tabular-nums">$45.0m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Other pins */}
          <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-brand-blue/80 rounded-full shadow-sm" />
          <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-brand-blue/90 rounded-full shadow-sm" />
          <div className="absolute bottom-1/4 right-1/3 w-3.5 h-3.5 bg-brand-blue/80 rounded-full shadow-sm" />
          <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-brand-blue/80 rounded-full shadow-sm" />

          {/* Clusters */}
          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-brand-blue/95 text-white flex items-center justify-center rounded-full text-sm font-bold border-[3px] border-white shadow-md">14</div>
          <div className="absolute bottom-1/4 left-1/4 w-10 h-10 bg-brand-blue/95 text-white flex items-center justify-center rounded-full text-xs font-bold border-[3px] border-white shadow-md">8</div>
        </div>
      </motion.div>

      {/* Content Layer */}
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 w-full relative z-10">
        <div className="max-w-2xl text-left bg-background/80 backdrop-blur-md p-8 rounded-2xl border border-border shadow-sm inline-block">
          <SlideIn direction="up" delay={0.1}>
            <h2 className="font-display text-4xl md:text-[48px] font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              See the property behind the ticker.
            </h2>
          </SlideIn>
          
          <SlideIn direction="up" delay={0.2}>
            <p className="text-[17px] text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Explore properties by suburb, city and region and understand exactly where REIT exposure actually sits across Australia.
            </p>
          </SlideIn>

          <SlideIn direction="up" delay={0.3}>
            <button className="px-6 py-3 bg-brand-blue text-white rounded-lg text-sm font-medium shadow-md hover:bg-[#0B5F59] transition-colors">
              Explore the map
            </button>
          </SlideIn>
        </div>
      </div>

    </section>
  );
}
