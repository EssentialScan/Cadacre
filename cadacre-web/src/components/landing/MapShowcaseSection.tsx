"use client";

import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";
import { MapPin } from "lucide-react";

export function MapShowcaseSection() {
  return (
    <section id="map" className="py-24 bg-background border-b border-border">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-5 flex flex-col items-start text-left order-2 lg:order-1">
            <SlideIn direction="up" delay={0.1}>
              <h2 className="font-display text-4xl md:text-[42px] font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                A REIT is more than a ticker.
                <br />
                See the physical assets behind the numbers.
              </h2>
            </SlideIn>
            
            <SlideIn direction="up" delay={0.2}>
              <p className="text-[17px] text-muted-foreground mb-8 leading-relaxed">
                Explore properties by suburb, city and region and understand exactly where REIT exposure actually sits.
              </p>
            </SlideIn>

            <SlideIn direction="up" delay={0.3}>
              <button className="text-[15px] font-medium text-brand-blue hover:text-[#0B5F59] transition-colors flex items-center group">
                Explore the national map
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </SlideIn>
          </div>

          <div className="lg:col-span-7 relative w-full h-[500px] lg:h-[600px] order-1 lg:order-2">
            <ScaleReveal delay={0.2} className="w-full h-full">
              <div className="absolute inset-0 bg-[#F2F4F7] border border-border rounded-xl shadow-[0_4px_24px_rgba(15,23,42,0.04)] overflow-hidden">
                {/* Fake Map Grid */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_2px_2px,#0F766E_1px,transparent_0)] bg-[length:32px_32px]" />
                
                {/* Geographic Breadcrumbs */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur border border-border rounded-md px-3 py-1.5 shadow-sm z-10 flex items-center text-xs font-medium text-foreground">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Australia</span>
                  <span className="mx-2 text-muted-foreground/40">/</span>
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">NSW</span>
                  <span className="mx-2 text-muted-foreground/40">/</span>
                  <span className="text-foreground">Sydney Basin</span>
                </div>

                {/* Markers & Clusters */}
                <div className="absolute inset-0 flex items-center justify-center">
                  
                  {/* Central Selected Pin */}
                  <div className="relative group cursor-pointer z-20">
                    <div className="w-5 h-5 bg-brand-blue rounded-full shadow-md flex items-center justify-center relative z-10">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute top-0 left-0 w-5 h-5 bg-brand-blue rounded-full animate-ping opacity-30" />
                    
                    {/* Selected Asset Card (Always open for demo) */}
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

                {/* Map Controls */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                  <div className="bg-white border border-border shadow-sm rounded-md flex flex-col overflow-hidden">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-muted text-foreground transition-colors">+</button>
                    <div className="w-full h-px bg-border"></div>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-muted text-foreground transition-colors">-</button>
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
