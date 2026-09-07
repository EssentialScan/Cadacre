"use client";

import Image from "next/image";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function PropertySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  // Parallax: ±8px movement during scroll
  const imageY = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  return (
    <section ref={containerRef} className="py-24 bg-white border-b border-border overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Large Editorial Image */}
          <div className="relative w-full h-[500px] lg:h-[680px] rounded-[24px] overflow-hidden shadow-sm">
            <motion.div style={{ y: imageY }} className="absolute inset-[-16px]">
              <Image 
                src="/reitcompare-property-asset.jpg"
                alt="Architectural view of a commercial property asset"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            
            {/* Glassmorphism Metadata Card Overlay */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-white/70 backdrop-blur-md border border-[rgba(23,32,42,0.08)] rounded-[16px] p-5 shadow-lg max-w-[240px]"
            >
              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-0.5 tracking-wider">Property</span>
                  <span className="font-semibold text-foreground text-sm">Industrial Logistics</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-0.5 tracking-wider">Location</span>
                  <span className="font-semibold text-foreground text-sm">Parramatta NSW</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-0.5 tracking-wider">Source</span>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-brand-blue/10 text-brand-blue rounded-md text-[11px] font-bold">
                    Public disclosure
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Copy */}
          <div className="flex flex-col items-start text-left">
            <SlideIn direction="up">
              <h2 className="font-display text-4xl md:text-[46px] font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                Understand the asset,
                <br />
                not just the numbers.
              </h2>
            </SlideIn>
            
            <SlideIn direction="up" delay={0.1}>
              <p className="text-[17px] text-muted-foreground mb-10 leading-relaxed max-w-lg">
                Stop analyzing abstract portfolios. We connect every financial metric directly to the concrete warehouses, offices, and retail centers that generate the returns.
              </p>
            </SlideIn>

            <SlideIn direction="up" delay={0.2}>
              <button className="text-[15px] font-medium text-brand-blue hover:text-[#0B5F59] transition-colors flex items-center group">
                Explore the properties
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </SlideIn>
          </div>

        </div>

      </div>
    </section>
  );
}
