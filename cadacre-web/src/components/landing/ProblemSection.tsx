"use client";

import { SlideIn } from "@/components/motion/ScrollAnimations";
import { FileText, Map as MapIcon, Table2 } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="py-24 bg-background border-b border-border">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        
        <SlideIn direction="up">
          <div className="max-w-2xl mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              The data exists.
              <br />
              Finding it shouldn't be this hard.
            </h2>
            <p className="text-[17px] text-muted-foreground leading-relaxed">
              REITCompare turns raw public information into a usable interface.
            </p>
          </div>
        </SlideIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <SlideIn direction="up" delay={0.1}>
            <div className="bg-white border border-border rounded-xl p-8 shadow-[0_1px_2px_rgba(15,23,42,0.02)] h-full flex flex-col group">
              <div className="h-40 w-full bg-background rounded-lg border border-border mb-8 overflow-hidden relative flex flex-col p-4">
                {/* Miniature Annual Report UI */}
                <div className="w-full flex items-center justify-between mb-3 border-b border-border/50 pb-2">
                  <div className="w-16 h-2 bg-muted rounded"></div>
                  <div className="w-8 h-2 bg-muted rounded"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="w-full h-1.5 bg-muted rounded"></div>
                  <div className="w-5/6 h-1.5 bg-muted rounded"></div>
                  <div className="w-4/6 h-1.5 bg-muted rounded"></div>
                </div>
                {/* Highlighted metric */}
                <div className="mt-auto bg-brand-blue/5 border border-brand-blue/20 rounded p-2 flex justify-between items-center group-hover:bg-brand-blue/10 transition-colors">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">WALE (Years)</span>
                  <span className="text-[11px] font-mono-figure font-bold text-brand-blue">5.1</span>
                </div>
              </div>
              <h3 className="font-semibold text-[17px] text-foreground mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Annual reports
              </h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Important metrics are buried across long disclosures and filings.
              </p>
            </div>
          </SlideIn>

          {/* Card 2 */}
          <SlideIn direction="up" delay={0.2}>
            <div className="bg-white border border-border rounded-xl p-8 shadow-[0_1px_2px_rgba(15,23,42,0.02)] h-full flex flex-col group">
              <div className="h-40 w-full bg-background rounded-lg border border-border mb-8 overflow-hidden relative flex items-center justify-center">
                {/* Miniature Map UI */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,#000_1px,transparent_0)] bg-[length:16px_16px]" />
                <div className="relative w-full h-full p-4 flex items-center justify-center">
                  <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-brand-blue rounded-full shadow-sm group-hover:scale-125 transition-transform" />
                  <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-brand-blue rounded-full shadow-sm group-hover:scale-125 transition-transform" />
                  <div className="absolute top-2/3 right-1/3 w-2.5 h-2.5 bg-brand-blue rounded-full shadow-sm group-hover:scale-125 transition-transform" />
                  
                  {/* Disconnected marker popup */}
                  <div className="absolute top-1/3 left-1/2 -translate-y-full -translate-x-1/2 mb-2 bg-white border border-border shadow-sm rounded p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-1 bg-muted rounded mb-1"></div>
                    <div className="w-8 h-1 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-[17px] text-foreground mb-2 flex items-center gap-2">
                <MapIcon className="h-4 w-4 text-muted-foreground" />
                Property exposure
              </h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                It is difficult to connect a REIT to the physical assets it owns.
              </p>
            </div>
          </SlideIn>

          {/* Card 3 */}
          <SlideIn direction="up" delay={0.3}>
            <div className="bg-white border border-border rounded-xl p-8 shadow-[0_1px_2px_rgba(15,23,42,0.02)] h-full flex flex-col group">
              <div className="h-40 w-full bg-background rounded-lg border border-border mb-8 overflow-hidden relative flex flex-col p-4">
                {/* Miniature Spreadsheet UI */}
                <div className="flex gap-1 mb-2">
                  <div className="h-4 flex-1 bg-muted/50 rounded border border-border/50"></div>
                  <div className="h-4 flex-1 bg-muted/50 rounded border border-border/50"></div>
                  <div className="h-4 flex-1 bg-muted/50 rounded border border-border/50"></div>
                </div>
                <div className="flex gap-1 mb-2">
                  <div className="h-4 flex-1 bg-white rounded border border-border"></div>
                  <div className="h-4 flex-1 bg-white rounded border border-border group-hover:border-brand-blue/50 transition-colors"></div>
                  <div className="h-4 flex-1 bg-white rounded border border-border"></div>
                </div>
                <div className="flex gap-1 mb-2">
                  <div className="h-4 flex-1 bg-white rounded border border-border"></div>
                  <div className="h-4 flex-1 bg-white rounded border border-border group-hover:border-brand-blue/50 transition-colors"></div>
                  <div className="h-4 flex-1 bg-white rounded border border-border"></div>
                </div>
                <div className="flex gap-1 mb-2">
                  <div className="h-4 flex-1 bg-white rounded border border-border"></div>
                  <div className="h-4 flex-1 bg-brand-blue/10 rounded border border-brand-blue/30 relative overflow-hidden transition-colors">
                    <div className="absolute inset-y-0 left-0 bg-brand-blue/20 w-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                  </div>
                  <div className="h-4 flex-1 bg-white rounded border border-border"></div>
                </div>
              </div>
              <h3 className="font-semibold text-[17px] text-foreground mb-2 flex items-center gap-2">
                <Table2 className="h-4 w-4 text-muted-foreground" />
                Spreadsheets
              </h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Comparisons often require manual collection, cleaning and calculation.
              </p>
            </div>
          </SlideIn>
        </div>
      </div>
    </section>
  );
}
