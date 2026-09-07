"use client";

import Image from "next/image";
import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function TransparencySection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-24 lg:py-32 bg-[#F7F8FA] border-b border-border overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="flex flex-col items-start text-left order-2 lg:order-1">
            <SlideIn direction="up">
              <h2 className="font-display text-4xl md:text-[46px] font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                Every number
                <br />
                should have a story.
              </h2>
            </SlideIn>
            
            <SlideIn direction="up" delay={0.1}>
              <p className="text-[17px] text-muted-foreground mb-10 leading-relaxed max-w-lg">
                REITCompare provides a transparent source trail for every material metric. We don't hide our methodology or expect you to trust black-box calculations.
              </p>
            </SlideIn>

            <SlideIn direction="up" delay={0.2}>
              <button className="text-[15px] font-medium text-brand-blue hover:text-[#0B5F59] transition-colors flex items-center group">
                View our methodology
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </SlideIn>
          </div>

          <div className="relative w-full order-1 lg:order-2">
            <ScaleReveal delay={0.2} className="w-full">
              
              {/* Museum/Editorial Frame */}
              <div 
                className="relative bg-white border border-[#E5E7EB] rounded-[18px] p-4 lg:p-6 shadow-[0_8px_30px_rgba(23,32,42,0.06)]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                
                {/* Main Visual */}
                <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[460px] rounded-xl overflow-hidden border border-border/50">
                  <Image 
                    src="/reitcompare-data-transparency.jpg"
                    alt="Abstract visualization representing data transparency and connected nodes"
                    fill
                    className="object-cover transition-transform duration-700 ease-out"
                    style={{ transform: isHovered ? 'scale(1.03)' : 'scale(1)' }}
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/5 to-transparent pointer-events-none mix-blend-multiply" />
                </div>

                {/* Overlay Metadata Panel */}
                <motion.div 
                  className="absolute -left-6 sm:-left-12 lg:-left-20 top-1/2 -translate-y-1/2 bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0_12px_40px_rgba(23,32,42,0.12)] p-6 w-[280px] z-20 hidden sm:block"
                >
                  <div className="space-y-6 relative">
                    
                    {/* Value Node */}
                    <div className="relative">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Metric</span>
                        <span className="text-[11px] font-medium text-muted-foreground bg-[#F7F8FA] px-2 py-0.5 rounded">30 Jun 2026</span>
                      </div>
                      <h4 className="font-display font-bold text-xl text-foreground mb-1">WALE</h4>
                      <div className="font-mono-figure font-bold text-3xl text-brand-blue tracking-tight">
                        5.1 <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest ml-1">years</span>
                      </div>
                      
                      {/* Connection Dot 1 */}
                      <div className="absolute top-1/2 -right-6 w-2 h-2 rounded-full bg-brand-blue z-20" />
                    </div>

                    <div className="w-full h-px bg-border"></div>

                    {/* Source Node */}
                    <div className="relative">
                      <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Source</span>
                      <p className="text-[14px] font-semibold text-foreground leading-snug">FY2026 Annual Report</p>
                      <p className="text-[12px] text-muted-foreground mt-1">Page 24, Note 3(b)</p>
                      
                      {/* Connection Dot 2 */}
                      <div className="absolute top-1/2 -right-6 w-2 h-2 rounded-full bg-brand-blue z-20" />
                    </div>

                    {/* SVG Connector Line */}
                    <svg className="absolute -right-[60px] top-0 h-full w-[60px] pointer-events-none z-10 overflow-visible" style={{ left: '100%' }}>
                      <motion.path 
                        d="M 0 35 C 40 35, 20 100, 60 100" 
                        fill="transparent" 
                        stroke="#0F766E" 
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ 
                          pathLength: isHovered ? 1 : 0, 
                          opacity: isHovered ? 1 : 0 
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    </svg>

                  </div>
                </motion.div>

                {/* Mobile Fallback Panel */}
                <div className="mt-4 bg-[#F7F8FA] border border-border rounded-xl p-4 sm:hidden">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">WALE</span>
                      <div className="font-mono-figure font-bold text-2xl text-brand-blue tracking-tight">
                        5.1 <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">yrs</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Source</span>
                      <span className="text-xs font-semibold text-foreground">FY26 Annual Report</span>
                    </div>
                  </div>
                </div>

              </div>

            </ScaleReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
