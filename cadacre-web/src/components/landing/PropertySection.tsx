"use client";

import Image from "next/image";
import { useRef } from "react";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { motion, useScroll, useTransform } from "framer-motion";
import { AmbientSection } from "@/components/ambient/AmbientSection";

export function PropertySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  // Editorial Parallax
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section ref={containerRef} className="py-20 md:py-32 lg:py-48 bg-[#F7F8FA] border-b border-border overflow-hidden relative">
      <AmbientSection theme="property" />
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center relative">
          
          {/* Left: Magazine Style Image (60% width, irregular position) */}
          <div className="w-full lg:w-[60%] relative z-10 lg:-ml-12 lg:-mt-12">
            <motion.div style={{ y: imageY }} className="relative w-full aspect-[4/5] lg:aspect-[4/4] rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(15,23,42,0.12)]">
              <Image 
                src="/reitcompare-property-asset.jpg"
                alt="Architectural view of a commercial property asset"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              {/* Soft vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              
              {/* Glassmorphism Metadata Card */}
              <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl max-w-[260px]">
                <div className="space-y-4">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">Property</span>
                    <span className="font-semibold text-foreground text-sm">Industrial Logistics</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">Location</span>
                    <span className="font-semibold text-foreground text-sm">Parramatta NSW</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">Source</span>
                    <div className="inline-flex items-center px-2 py-1 bg-brand-blue/10 text-brand-blue rounded text-[11px] font-bold">
                      Public disclosure
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Giant Headline & Copy */}
          <motion.div style={{ y: textY }} className="w-full lg:w-[50%] lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 z-20 pt-16 lg:pt-0 lg:pl-16">
            <div className="bg-white/90 backdrop-blur-xl border border-white p-8 lg:p-12 rounded-[24px] shadow-[0_24px_48px_rgba(15,23,42,0.06)]">
              <SlideIn direction="up">
                <h2 className="font-display text-[48px] md:text-[64px] lg:text-[72px] font-bold tracking-tight text-foreground leading-[1] mb-8">
                  Know the<br />asset.
                </h2>
              </SlideIn>
              
              <SlideIn direction="up" delay={0.1}>
                <p className="text-[19px] text-muted-foreground mb-10 leading-relaxed font-medium">
                  Stop analyzing abstract portfolios. We connect every financial metric directly to the concrete warehouses, offices, and retail centers that generate the returns.
                </p>
              </SlideIn>

              <SlideIn direction="up" delay={0.2}>
                <button className="text-[16px] font-semibold text-brand-blue hover:text-[#0B5F59] transition-colors flex items-center group">
                  Explore property profiles
                  <span className="ml-3 group-hover:translate-x-1.5 transition-transform">&rarr;</span>
                </button>
              </SlideIn>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
