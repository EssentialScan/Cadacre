"use client";

import Image from "next/image";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Code2, ChevronRight, Database } from "lucide-react";
import { AmbientSection } from "@/components/ambient/AmbientSection";
import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";
import { Button } from "@/components/ui/button";

export function PremiumApiSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="py-20 md:py-32 lg:py-48 bg-[#101820] relative overflow-hidden border-b border-white/5">
      <AmbientSection theme="dark-api" />
      
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left: Typography */}
          <div className="flex flex-col items-start justify-center text-left">
            <SlideIn direction="up">
              <div className="inline-flex items-center gap-2 mb-8 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
                <Database className="h-4 w-4 text-brand-blue" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">REITCompare Pro & API</span>
              </div>
              <h2 className="font-display text-[48px] lg:text-[64px] font-bold tracking-tight text-white leading-[1.05] mb-8">
                Need the data,
                <br />
                not just a dashboard?
              </h2>
              <p className="text-[19px] text-white/60 mb-12 leading-relaxed max-w-md font-medium">
                Track your portfolio with saved views, or use structured Australian REIT data directly inside your own product, workflow or research stack via our API.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button size="lg" className="rounded-lg bg-white text-[#101820] hover:bg-white/90 border-none h-14 text-[15px] font-bold px-8 w-full sm:w-auto transition-colors">
                  Explore API
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-lg bg-transparent border-white/20 text-white hover:bg-white/10 h-14 text-[15px] font-medium px-8 w-full sm:w-auto transition-colors">
                  <Code2 className="h-4 w-4 mr-2 text-white/70" />
                  View documentation
                </Button>
              </div>
            </SlideIn>
          </div>

          {/* Right: Code & Image Overlap */}
          <div className="relative w-full lg:h-[600px]">
            <ScaleReveal delay={0.2} className="relative lg:absolute lg:inset-0 w-full lg:h-full">

              {/* Image Base - decorative, hidden on mobile to avoid clashing with the code snippets */}
              <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-[120%] h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
                <Image
                  src="/reitcompare-api-data.jpg"
                  alt="REITCompare Pro dashboard and API visualization"
                  fill
                  className="object-cover opacity-50 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#101820] via-transparent to-transparent opacity-80" />
              </div>

              {/* Floating Code Snippets */}
              <div className="relative lg:absolute lg:inset-0 flex flex-col justify-center items-start lg:-ml-12 gap-6 lg:gap-8 z-20 pointer-events-none">
                
                {/* Snippet 1 */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="bg-[#1C2733]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.5)] font-mono text-sm w-full max-w-[360px] pointer-events-auto"
                >
                  <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-white/40">Request</div>
                    <div className="ml-auto text-brand-blue text-[11px] font-bold">GET /api/v1/reits/GPT</div>
                  </div>
                  <div className="p-5 text-white/80 leading-relaxed text-[12px] sm:text-[13px]">
<pre><code>{`{
  "ticker": "GPT",
  "sector": "Diversified",
  "yield": 0.052,
  "nta": {
    "value": 6.82,
    "discount": -0.084
  }
}`}</code></pre>
                  </div>
                </motion.div>

                {/* Snippet 2 */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="bg-[#1C2733]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.5)] font-mono text-sm w-full max-w-[300px] pointer-events-auto lg:ml-12"
                >
                  <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-white/40">Webhook Alert</div>
                  </div>
                  <div className="p-4 text-white/80 leading-relaxed text-[12px]">
<pre><code>{`{
  "event": "NTA_DISCOUNT",
  "threshold": "> 15%",
  "triggered_at": "2026-08-14"
}`}</code></pre>
                  </div>
                </motion.div>

              </div>
            </ScaleReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
