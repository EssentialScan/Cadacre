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
  const [activeTab, setActiveTab] = useState("Screener");

  const rawData = initialReits && initialReits.length > 0 ? initialReits : [];
  
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
    <section id="screener" className="py-20 md:py-32 bg-transparent relative overflow-hidden">
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
                  <div 
                    onClick={() => setActiveTab("Screener")}
                    className={`px-3 py-2 text-[13px] rounded-lg cursor-pointer transition-colors ${activeTab === 'Screener' ? 'font-medium bg-white shadow-sm border border-border text-foreground' : 'text-muted-foreground hover:bg-white/50'}`}
                  >
                    Screener
                  </div>
                  <div 
                    onClick={() => setActiveTab("Portfolios")}
                    className={`px-3 py-2 text-[13px] rounded-lg cursor-pointer transition-colors flex justify-between items-center ${activeTab === 'Portfolios' ? 'font-medium bg-white shadow-sm border border-border text-foreground' : 'text-muted-foreground hover:bg-white/50'}`}
                  >
                    <span>Portfolios</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded">Demo</span>
                  </div>
                  <div 
                    onClick={() => setActiveTab("Alerts")}
                    className={`px-3 py-2 text-[13px] rounded-lg cursor-pointer transition-colors flex justify-between items-center ${activeTab === 'Alerts' ? 'font-medium bg-white shadow-sm border border-border text-foreground' : 'text-muted-foreground hover:bg-white/50'}`}
                  >
                    <span>Alerts</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded">Demo</span>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6 relative overflow-y-auto">
                <div className="bg-white rounded-xl border border-border shadow-sm min-h-full flex flex-col overflow-hidden">
                  
                  {activeTab === 'Screener' && (
                    <>
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
                    </>
                  )}

                  {activeTab === 'Portfolios' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="p-8 flex-1 flex flex-col"
                    >
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">SMSF Core Portfolio</h3>
                          <p className="text-[13px] text-muted-foreground mt-1">NTA-weighted analysis and tax components</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-mono-figure font-bold tracking-tight text-foreground">$142,500</div>
                          <div className="text-[13px] font-mono-figure text-data-green mt-1">+4.2% Total Return</div>
                        </div>
                      </div>
                      
                      <div className="bg-background/50 border border-border rounded-xl p-5 mb-6 flex gap-8">
                        <div>
                          <div className="text-[11px] uppercase font-bold text-muted-foreground mb-1">Portfolio WALE</div>
                          <div className="text-lg font-mono-figure font-medium">5.2 yrs</div>
                        </div>
                        <div>
                          <div className="text-[11px] uppercase font-bold text-muted-foreground mb-1">Avg Gearing</div>
                          <div className="text-lg font-mono-figure font-medium">28.4%</div>
                        </div>
                        <div>
                          <div className="text-[11px] uppercase font-bold text-muted-foreground mb-1">Tax-Deferred Yield</div>
                          <div className="text-lg font-mono-figure font-medium text-brand-blue">2.1%</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 px-3 py-2 bg-background text-[11px] uppercase font-bold tracking-wider text-muted-foreground border-b border-border/50">
                        <div className="col-span-2">Holding</div>
                        <div className="text-right">Value</div>
                        <div className="text-right">Weight</div>
                      </div>
                      
                      <div className="divide-y divide-border/30">
                        {[{t: "GMG", n: "Goodman Group", v: "$45,200", w: "31.7%"}, {t: "DXS", n: "Dexus", v: "$32,100", w: "22.5%"}, {t: "GPT", n: "GPT Group", v: "$28,400", w: "19.9%"}].map((h) => (
                          <div key={h.t} className="grid grid-cols-4 gap-4 px-3 py-3 items-center hover:bg-muted/20">
                            <div className="col-span-2 flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center font-bold text-[10px] text-brand-blue">{h.t}</div>
                              <span className="font-medium text-[13px]">{h.n}</span>
                            </div>
                            <div className="text-right font-mono-figure text-[13px] tabular-nums">{h.v}</div>
                            <div className="text-right font-mono-figure text-[13px] tabular-nums text-muted-foreground">{h.w}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-auto pt-6 flex justify-center">
                        <button className="text-[13px] font-medium text-brand-blue bg-brand-blue/10 px-4 py-2 rounded-md hover:bg-brand-blue/20 transition-colors">
                          Unlock Premium Tracker
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'Alerts' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="p-8 flex-1 flex flex-col"
                    >
                      <h3 className="text-lg font-bold text-foreground mb-1">Smart Alerts</h3>
                      <p className="text-[13px] text-muted-foreground mb-8">Set mechanical, non-opinionated thresholds for NTA and distributions.</p>
                      
                      <div className="space-y-4">
                        <div className="bg-white border border-border shadow-sm rounded-xl p-4 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-2 h-2 rounded-full bg-data-green"></div>
                              <span className="font-medium text-[14px]">NTA Discount Threshold</span>
                            </div>
                            <p className="text-[13px] text-muted-foreground">Notify when <span className="font-mono-figure font-medium text-foreground px-1 bg-muted rounded">Sector: Office</span> NTA discount exceeds <span className="font-mono-figure font-medium text-foreground px-1 bg-muted rounded">15%</span></p>
                          </div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-2 py-1 rounded">Active</div>
                        </div>
                        
                        <div className="bg-white border border-border shadow-sm rounded-xl p-4 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-2 h-2 rounded-full bg-data-green"></div>
                              <span className="font-medium text-[14px]">Distribution Announcement</span>
                            </div>
                            <p className="text-[13px] text-muted-foreground">Notify when <span className="font-mono-figure font-medium text-foreground px-1 bg-muted rounded">GMG</span> or <span className="font-mono-figure font-medium text-foreground px-1 bg-muted rounded">CIP</span> files new distribution</p>
                          </div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-2 py-1 rounded">Active</div>
                        </div>
                        
                        <div className="border border-dashed border-border rounded-xl p-4 flex items-center justify-center cursor-pointer hover:bg-muted/20 transition-colors">
                          <span className="text-[13px] font-medium text-brand-blue">+ Create New Alert</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
