"use client";

import Image from "next/image";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { motion } from "framer-motion";
import { FileText, Map as MapIcon, Table2 } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="py-24 bg-background border-b border-border overflow-visible">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          
          {/* Left Column: Text & Problems */}
          <div className="lg:w-2/5 flex flex-col justify-center">
            <SlideIn direction="up">
              <h2 className="font-display text-4xl md:text-[44px] font-bold tracking-tight text-foreground mb-6 leading-tight">
                The data exists.<br/>
                Finding it shouldn't be this hard.
              </h2>
              <p className="text-[17px] text-muted-foreground leading-relaxed mb-12">
                REITCompare turns raw, fragmented public information into a structured, usable interface.
              </p>
            </SlideIn>

            <div className="space-y-8 relative z-10">
              <SlideIn direction="up" delay={0.1}>
                <div className="flex gap-4 group">
                  <div className="mt-1 w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center shadow-sm group-hover:border-brand-blue/30 group-hover:bg-brand-blue/5 transition-colors">
                    <FileText className="h-4 w-4 text-muted-foreground group-hover:text-brand-blue transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[17px] text-foreground mb-1">Annual reports</h3>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                      Important metrics are buried across long disclosures and filings.
                    </p>
                  </div>
                </div>
              </SlideIn>

              <SlideIn direction="up" delay={0.2}>
                <div className="flex gap-4 group">
                  <div className="mt-1 w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center shadow-sm group-hover:border-brand-blue/30 group-hover:bg-brand-blue/5 transition-colors">
                    <MapIcon className="h-4 w-4 text-muted-foreground group-hover:text-brand-blue transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[17px] text-foreground mb-1">Property exposure</h3>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                      It is difficult to connect a REIT to the physical assets it owns.
                    </p>
                  </div>
                </div>
              </SlideIn>

              <SlideIn direction="up" delay={0.3}>
                <div className="flex gap-4 group">
                  <div className="mt-1 w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center shadow-sm group-hover:border-brand-blue/30 group-hover:bg-brand-blue/5 transition-colors">
                    <Table2 className="h-4 w-4 text-muted-foreground group-hover:text-brand-blue transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[17px] text-foreground mb-1">Spreadsheets</h3>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                      Comparisons often require manual collection, cleaning and calculation.
                    </p>
                  </div>
                </div>
              </SlideIn>
            </div>
          </div>

          {/* Right Column: Editorial Image */}
          <div className="lg:w-[60%] relative mt-8 lg:mt-16">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-[4/3] lg:aspect-[3/2] lg:w-[110%] rounded-[20px] overflow-hidden border border-[#E5E7EB] z-0 -mr-[10%]"
            >
              <Image 
                src="/reitcompare-fragmented-information.jpg"
                alt="Visual representation of fragmented financial information"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
