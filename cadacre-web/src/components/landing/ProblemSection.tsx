"use client";

import Image from "next/image";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FileText, Map as MapIcon, Table2 } from "lucide-react";
import { AmbientSection } from "@/components/ambient/AmbientSection";

export function ProblemSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Extremely subtle parallax on the image
  const imageY = useTransform(scrollYProgress, [0, 1], ["-2%", "4%"]);

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-transparent overflow-hidden relative">
      <AmbientSection theme="warm" />
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 relative">
        <div className="flex flex-col lg:flex-row relative z-10">
          
          {/* Left Column: Overlapping Text & Problems */}
          <div className="lg:w-[45%] relative z-20 flex flex-col justify-center lg:pr-12 lg:pt-24 lg:pb-24">
            {/* White floating panel for editorial overlap */}
            <div className="absolute inset-0 bg-white  rounded-lg shadow-[0_8px_32px_rgba(15,23,42,0.04)] lg:block hidden -ml-8 -mr-8 lg:mr-0 z-0"></div>
            
            <div className="relative z-10 lg:p-8">
              <SlideIn direction="up">
                <h2 className="font-display text-4xl md:text-[52px] font-bold tracking-tight text-foreground mb-8 leading-[1.05]">
                  The data exists.<br/>
                  <span className="text-muted-foreground">Finding it shouldn't be this hard.</span>
                </h2>
                <p className="text-[17px] text-muted-foreground leading-relaxed mb-12 max-w-[420px]">
                  REITCompare turns raw, fragmented public information into a structured, usable interface.
                </p>
              </SlideIn>

              <div className="space-y-10">
                <SlideIn direction="up" delay={0.1}>
                  <div className="flex gap-5 group">
                    <div className="mt-1 w-12 h-12 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-[19px] text-foreground mb-2">Annual reports</h3>
                      <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[340px]">
                        Important metrics are buried across long disclosures and filings.
                      </p>
                    </div>
                  </div>
                </SlideIn>

                <SlideIn direction="up" delay={0.2}>
                  <div className="flex gap-5 group">
                    <div className="mt-1 w-12 h-12 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                      <MapIcon className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-[19px] text-foreground mb-2">Property exposure</h3>
                      <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[340px]">
                        It is difficult to connect a REIT to the physical assets it owns.
                      </p>
                    </div>
                  </div>
                </SlideIn>

                <SlideIn direction="up" delay={0.3}>
                  <div className="flex gap-5 group">
                    <div className="mt-1 w-12 h-12 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                      <Table2 className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-[19px] text-foreground mb-2">Spreadsheets</h3>
                      <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[340px]">
                        Comparisons often require manual collection, cleaning and calculation.
                      </p>
                    </div>
                  </div>
                </SlideIn>
              </div>
            </div>
          </div>

          {/* Right Column: Large Editorial Image Spread */}
          <div className="lg:w-[65%] lg:absolute lg:right-0 lg:top-0 lg:bottom-0 flex items-center mt-12 lg:mt-0 z-10 pointer-events-none">
            {/* Warm paper-like surface behind the image */}
            <div className="absolute right-0 top-[10%] bottom-[10%] w-full lg:w-[120%] bg-[#FDFBF7] rounded-l-[40px] z-0 pointer-events-none"></div>
            
            <motion.div
              style={{ y: imageY }}
              className="relative w-full aspect-[4/3] lg:aspect-[14/10] rounded-lg lg:rounded-l-2xl lg:rounded-r-none overflow-hidden shadow-[0_8px_32px_rgba(15,23,42,0.08)] z-10 lg:ml-[-5%]"
            >
              <Image 
                src="/reitcompare-fragmented-information.jpg"
                alt="Visual representation of fragmented financial information"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
