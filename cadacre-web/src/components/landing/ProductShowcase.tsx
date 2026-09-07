"use client";

import Image from "next/image";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { AmbientSection } from "@/components/ambient/AmbientSection";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

export function ProductShowcase({ initialReits }: { initialReits?: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  const defaultReits = [
    { ticker: "GMG", name: "Goodman Group", sector: "Industrial", yield: 1.2, gearing: 8.3, ntaDiscount: -45.2 },
    { ticker: "GPT", name: "GPT Group", sector: "Diversified", yield: 5.2, gearing: 28.7, ntaDiscount: 8.4 },
    { ticker: "CIP", name: "Centuria Industrial", sector: "Industrial", yield: 5.8, gearing: 32.1, ntaDiscount: 14.2 },
    { ticker: "DXS", name: "Dexus", sector: "Office", yield: 6.1, gearing: 31.2, ntaDiscount: 12.1 },
    { ticker: "NSR", name: "National Storage", sector: "Industrial", yield: 4.5, gearing: 24.5, ntaDiscount: 2.1 },
  ];

  const rawData = initialReits && initialReits.length > 0 ? initialReits : defaultReits;
  
  const formattedData = rawData.map(r => ({
    ticker: r.ticker,
    name: r.name,
    sector: r.sector,
    yield: r.yield ? `${r.yield.toFixed(1)}%` : "-",
    gearing: r.gearing ? `${r.gearing.toFixed(1)}%` : "-",
    nta: r.ntaDiscount ? `${r.ntaDiscount > 0 ? '-' : '+'}${Math.abs(r.ntaDiscount).toFixed(1)}%` : "-",
    ntaRaw: r.ntaDiscount || 0
  }));

  const filteredReits = formattedData.filter(r => {
    const matchesSearch = r.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === "All" || r.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const sectors = ["All", ...Array.from(new Set(formattedData.map(r => r.sector)))];

  return (
    <section className="py-20 md:py-32 bg-transparent relative overflow-hidden">
      <AmbientSection theme="technical" />
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <SlideIn direction="up">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-4 block">
              From raw disclosures to useful answers
            </span>
            <h2 className="font-display text-4xl md:text-[52px] font-bold tracking-tight text-foreground leading-[1.05]">
              Interactive intelligence.
            </h2>
            <p className="text-muted-foreground mt-4">Try it yourself. Search real ASX REIT data right here.</p>
          </SlideIn>
        </div>

        <div className="w-full overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
          <div className="relative w-full max-w-[1380px] min-w-[860px] sm:min-w-0 mx-auto h-[650px] bg-[#F7F8FA] border border-border/80 rounded-[24px] shadow-[0_24px_64px_rgba(15,23,42,0.08)] overflow-hidden">
            {/* Header */}
            <div className="h-14 bg-white px-6 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-6 w-full max-w-md">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="h-9 w-full bg-background rounded-md border border-border flex items-center px-3 focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all">
                  <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search REITs, sectors, metrics..." 
                    className="w-full bg-transparent text-[13px] outline-none text-foreground placeholder:text-muted-foreground/60"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="ml-2 text-muted-foreground hover:text-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-9 px-4 rounded-md border text-[13px] font-medium shadow-sm flex items-center gap-2 transition-colors ${showFilters || sectorFilter !== 'All' ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' : 'bg-white border-border text-foreground hover:bg-muted/50'}`}
                >
                  <Filter className="w-4 h-4" /> 
                  {sectorFilter !== "All" ? sectorFilter : "Filters"}
                </button>

                {/* Filters Dropdown */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-12 right-0 w-56 bg-white border border-border rounded-xl shadow-xl z-50 p-2"
                    >
                      <div className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider px-2 py-1.5 mb-1">Filter by Sector</div>
                      {sectors.map(sector => (
                        <button
                          key={sector}
                          onClick={() => { setSectorFilter(sector); setShowFilters(false); }}
                          className={`w-full text-left px-3 py-2 text-[13px] rounded-md flex items-center justify-between transition-colors ${sectorFilter === sector ? 'bg-brand-blue/10 text-brand-blue font-medium' : 'hover:bg-muted text-foreground'}`}
                        >
                          {sector}
                          {sectorFilter === sector && <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex h-[calc(100%-3.5rem)]">
              {/* Sidebar */}
              <div className="w-56 border-r border-border bg-white/50 p-4 shrink-0">
                <div className="space-y-1">
                  <div className="px-3 py-2 text-[13px] font-medium bg-white rounded-lg shadow-sm border border-border">Screener</div>
                  <div className="px-3 py-2 text-[13px] text-muted-foreground hover:bg-white/50 rounded-lg cursor-pointer">Portfolios</div>
                  <div className="px-3 py-2 text-[13px] text-muted-foreground hover:bg-white/50 rounded-lg cursor-pointer">Alerts</div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6 relative overflow-y-auto">
                <div className="bg-white rounded-xl border border-border shadow-sm min-h-full flex flex-col">
                  <div className="grid grid-cols-6 gap-4 px-5 py-4 bg-background/80 text-[11px] uppercase font-bold tracking-wider text-muted-foreground border-b border-border/50 sticky top-0 z-20 backdrop-blur-sm">
                    <div className="col-span-2">REIT</div>
                    <div className="text-right">Sector</div>
                    <div className="text-right">Yield</div>
                    <div className="text-right">Gearing</div>
                    <div className="text-right">NTA Discount</div>
                  </div>

                  <div className="flex-1 divide-y divide-border/30">
                    {filteredReits.length > 0 ? filteredReits.map((row) => (
                      <div 
                        key={row.ticker}
                        className="grid grid-cols-6 gap-4 px-5 py-4 items-center hover:bg-muted/30 transition-colors group relative cursor-pointer"
                        onClick={() => setSelectedTicker(selectedTicker === row.ticker ? null : row.ticker)}
                      >
                        <div className="col-span-2 flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center font-bold text-[10px] text-brand-blue">{row.ticker}</div>
                          <span className="font-medium text-[13px] text-foreground">{row.name}</span>
                        </div>
                        <div className="text-right text-[12px] text-muted-foreground">{row.sector}</div>
                        <div className="text-right font-mono-figure text-[13px] tabular-nums">{row.yield}</div>
                        <div className="text-right font-mono-figure text-[13px] tabular-nums">{row.gearing}</div>
                        
                        <div className="flex justify-end relative">
                          <div className={`text-right font-mono-figure text-[13px] tabular-nums px-2 py-1 rounded-md transition-all ${selectedTicker === row.ticker ? 'bg-brand-blue/10 scale-110 shadow-sm' : ''} ${row.ntaRaw > 0 ? 'text-data-red' : 'text-data-green'}`}>
                            {row.nta}
                          </div>

                          {/* Source Document Popup */}
                          <AnimatePresence>
                            {selectedTicker === row.ticker && row.ntaRaw !== 0 && (
                              <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="absolute right-12 top-1/2 -translate-y-1/2 w-64 bg-white border border-border rounded-xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] p-4 z-40 cursor-default"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-1.5 py-0.5 bg-brand-blue/10 text-brand-blue rounded text-[10px] font-bold uppercase tracking-wider">Source</span>
                                  <span className="text-[11px] text-muted-foreground">Recent Financial Report</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug">This value was automatically extracted from the latest statutory filing via the REITCompare API.</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )) : (
                      <div className="p-10 text-center text-muted-foreground text-[13px]">
                        No REITs match your search or filter.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
