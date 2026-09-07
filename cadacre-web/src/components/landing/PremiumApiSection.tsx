"use client";

import Image from "next/image";
import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";
import { Button } from "@/components/ui/button";
import { Code2, Database, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function PremiumApiSection() {
  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8">
        
        <div className="bg-[#17202A] rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-2xl border border-white/5 relative">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-0">
            
            <div className="xl:col-span-5 p-10 sm:p-14 lg:p-20 flex flex-col items-start justify-center text-left relative z-10">
              <SlideIn direction="up">
                <div className="inline-flex items-center gap-2 mb-8 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
                  <Database className="h-4 w-4 text-brand-blue" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">REITCompare Pro & API</span>
                </div>
                <h2 className="font-display text-4xl lg:text-[52px] font-bold tracking-tight text-white leading-[1.1] mb-6">
                  Need the data,
                  <br />
                  not just a dashboard?
                </h2>
                <p className="text-[18px] text-white/60 mb-10 leading-relaxed max-w-md">
                  Track your portfolio with saved views, or use structured Australian REIT data directly inside your own product, workflow or research stack via our API.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button size="lg" className="rounded-lg bg-white text-[#17202A] hover:bg-white/90 border-none h-14 text-[15px] font-bold px-8 w-full sm:w-auto transition-colors">
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

            <div className="xl:col-span-7 relative min-h-[500px] xl:min-h-full border-t xl:border-t-0 xl:border-l border-white/5 bg-[#0D131A]/50">
              <ScaleReveal delay={0.2} className="absolute inset-0 w-full h-full">
                
                {/* Generated Background Dashboard Visual */}
                <Image 
                  src="/reitcompare-api-data.jpg"
                  alt="REITCompare Pro dashboard and API visualization"
                  fill
                  className="object-cover object-left-top opacity-60 mix-blend-screen"
                />

                {/* Gradient fade to merge image with container */}
                <div className="absolute inset-0 bg-gradient-to-t xl:bg-gradient-to-l from-[#17202A] via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b xl:bg-gradient-to-r from-[#17202A] via-transparent to-transparent pointer-events-none opacity-50" />

                {/* Floating API Snippets Overlay */}
                <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-center items-end gap-6 z-20 pointer-events-none">
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="bg-[#1C2733]/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono text-sm w-full max-w-sm pointer-events-auto transform hover:-translate-y-1 transition-transform"
                  >
                    <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5">
                      <div className="text-[10px] font-bold tracking-widest uppercase text-white/40">Request</div>
                      <div className="ml-auto text-[#66E2A5] text-[11px] font-bold">GET /api/v1/reits/GPT</div>
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

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="bg-[#1C2733]/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono text-sm w-full max-w-[280px] pointer-events-auto mr-12 transform hover:-translate-y-1 transition-transform"
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

      </div>
    </section>
  );
}
