"use client";

import { useState } from "react";
import Image from "next/image";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Check } from "lucide-react";

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState("Compare");

  const tabs = ["Compare", "Map", "Portfolio", "Alerts"];

  return (
    <section className="py-24 bg-white border-b border-border relative overflow-hidden">
      {/* Radial Glow Backdrop */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(15,118,110,.07), transparent 55%)'
        }}
      />
      
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SlideIn direction="up">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              From raw disclosures
              <br />
              to useful answers.
            </h2>
            <p className="text-[17px] text-muted-foreground leading-relaxed">
              Search, filter, compare and explore without building the spreadsheet yourself.
            </p>
          </SlideIn>
        </div>

        {/* Custom Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-1 p-1 bg-background border border-border rounded-lg shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-white border border-border/50 rounded-md shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Showcase Content */}
        <div 
          className="relative w-full max-w-[1180px] mx-auto h-[500px] lg:h-[600px]"
          style={{
            transform: 'perspective(1600px) rotateX(1deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          <AnimatePresence mode="wait">
            {activeTab === "Compare" && (
              <motion.div
                key="Compare"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white border border-[#E5E7EB] rounded-[20px] lg:rounded-[24px] shadow-[0_8px_40px_rgba(23,32,42,0.08)] overflow-hidden flex flex-col"
              >
                {/* Image Background Layer */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src="/reitcompare-reit-comparison.jpg"
                    alt="REIT comparison interface background visual"
                    fill
                    className="object-cover opacity-30 pointer-events-none"
                    priority
                  />
                </div>
                
                {/* Foreground UI overlay */}
                <div className="relative z-10 flex flex-col h-full bg-white/70 backdrop-blur-[2px]">
                  {/* Header */}
                  <div className="p-4 border-b border-border/60 flex items-center justify-between bg-white/60 backdrop-blur-sm">
                    <h3 className="font-display font-semibold text-lg text-foreground">Compare REITs</h3>
                    <div className="bg-white border border-border rounded-md px-3 py-1.5 flex items-center shadow-sm w-48">
                      <Search className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                      <span className="text-xs text-muted-foreground font-medium">Search...</span>
                    </div>
                  </div>
                  {/* Toolbar */}
                  <div className="p-4 border-b border-border/60 flex gap-2 bg-white/40 backdrop-blur-sm">
                    <button className="px-3 py-1.5 bg-white border border-border rounded-md text-xs font-medium text-foreground flex items-center gap-2 shadow-sm hover:bg-muted transition-colors">
                      Sector <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-border rounded-md text-xs font-medium text-foreground flex items-center gap-2 shadow-sm hover:bg-muted transition-colors">
                      Yield <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <button className="px-3 py-1.5 bg-brand-blue border border-brand-blue text-white rounded-md text-xs font-medium flex items-center gap-2 shadow-sm">
                      Gearing &lt; 40% <span className="opacity-80 ml-1">×</span>
                    </button>
                    <div className="ml-auto flex items-center text-xs text-muted-foreground font-medium tabular-nums">42 REITs</div>
                  </div>
                  {/* Table */}
                  <div className="flex-1 overflow-hidden p-4">
                    <div className="bg-white/90 backdrop-blur-md rounded-xl border border-border shadow-sm h-full overflow-hidden flex flex-col">
                      <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-border text-[11px] uppercase font-bold tracking-wider text-muted-foreground bg-background/50">
                        <div className="col-span-2">REIT</div>
                        <div className="text-right">Yield</div>
                        <div className="text-right">NTA</div>
                        <div className="text-right cursor-pointer text-foreground flex items-center justify-end gap-1 group">
                          Gearing <span className="text-brand-blue group-hover:translate-y-[1px] transition-transform">↓</span>
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto">
                        {[
                          { ticker: "GPT", sector: "Diversified", yield: "5.2%", nta: "-8.4%", gearing: "28.7%" },
                          { ticker: "DXS", sector: "Office", yield: "6.1%", nta: "-12.1%", gearing: "31.2%" },
                          { ticker: "MGR", sector: "Diversified", yield: "4.8%", nta: "-4.2%", gearing: "33.5%" },
                          { ticker: "SCG", sector: "Retail", yield: "5.5%", nta: "-15.6%", gearing: "36.8%" },
                        ].map((row, i) => (
                          <motion.div 
                            key={row.ticker}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className="grid grid-cols-5 gap-4 px-4 py-4 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                          >
                            <div className="col-span-2 flex flex-col">
                              <span className="font-bold text-[13px] text-foreground">{row.ticker}</span>
                              <span className="text-[11px] text-muted-foreground">{row.sector}</span>
                            </div>
                            <div className="text-right font-mono-figure font-medium text-[13px] tabular-nums pt-1">{row.yield}</div>
                            <div className="text-right font-mono-figure font-medium text-[13px] tabular-nums pt-1 text-data-red">{row.nta}</div>
                            <div className="text-right font-mono-figure font-medium text-[13px] tabular-nums pt-1">{row.gearing}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Map" && (
              <motion.div
                key="Map"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-[#F2F4F7] border border-[#E5E7EB] rounded-[20px] lg:rounded-[24px] shadow-[0_8px_40px_rgba(23,32,42,0.08)] overflow-hidden relative"
              >
                {/* Fake map background */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_2px_2px,#0F766E_1px,transparent_0)] bg-[length:24px_24px]" />
                
                {/* Search overlay */}
                <div className="absolute top-6 left-6 bg-white border border-border rounded-lg shadow-sm w-64 p-2 flex items-center z-10">
                  <Search className="h-4 w-4 text-muted-foreground ml-2 mr-3" />
                  <span className="text-sm text-foreground font-medium">Sydney, NSW</span>
                </div>

                {/* Map Pins */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <div className="w-4 h-4 bg-brand-blue rounded-full shadow-md z-10 relative" />
                  <div className="absolute top-0 left-0 w-4 h-4 bg-brand-blue rounded-full animate-ping opacity-50" />
                  
                  {/* Property Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white border border-border shadow-[0_8px_24px_rgba(15,23,42,0.12)] rounded-lg p-4 w-64 z-20 pointer-events-none"
                  >
                    <h4 className="font-display font-bold text-sm text-foreground mb-1">123 Example Street</h4>
                    <p className="text-xs text-muted-foreground mb-3">Parramatta NSW</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Type</span>
                        <span className="font-medium text-brand-blue">Industrial</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Owner</span>
                        <span className="font-medium text-foreground">GPT</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Acquired</span>
                        <span className="font-medium text-foreground tabular-nums">2022</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Book Value</span>
                        <span className="font-medium text-foreground tabular-nums">$145m</span>
                      </div>
                    </div>
                    
                    <div className="text-brand-blue text-xs font-semibold flex items-center">
                      View property <span className="ml-1">→</span>
                    </div>
                  </motion.div>
                </motion.div>
                
                {/* Other clustered pins */}
                <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-brand-blue/90 text-white flex items-center justify-center rounded-full text-[10px] font-bold border-2 border-white shadow-md z-10">12</div>
                <div className="absolute top-2/3 right-1/4 w-10 h-10 bg-brand-blue/90 text-white flex items-center justify-center rounded-full text-xs font-bold border-2 border-white shadow-md z-10">45</div>
              </motion.div>
            )}

            {activeTab === "Portfolio" && (
              <motion.div
                key="Portfolio"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-background border border-[#E5E7EB] rounded-[20px] lg:rounded-[24px] shadow-[0_8px_40px_rgba(23,32,42,0.08)] overflow-hidden flex flex-col p-8"
              >
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">Portfolio</h3>
                    <p className="font-mono-figure font-bold text-4xl text-foreground tracking-tight">$184,200</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-border rounded-md text-sm font-medium shadow-sm hover:bg-muted transition-colors">Performance</button>
                    <button className="px-4 py-2 bg-brand-blue text-white rounded-md text-sm font-medium shadow-sm">Holdings</button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                    <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Yield</p>
                    <p className="font-mono-figure font-bold text-2xl text-foreground">5.1%</p>
                  </div>
                  <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                    <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Distributions</p>
                    <p className="font-mono-figure font-bold text-2xl text-data-green">+$7,820</p>
                  </div>
                  <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                    <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Holdings</p>
                    <p className="font-mono-figure font-bold text-2xl text-foreground">8</p>
                  </div>
                </div>

                <div className="bg-white border border-border rounded-xl shadow-sm flex-1 p-5 flex flex-col">
                  <h4 className="font-semibold text-sm mb-4">Holdings Allocation</h4>
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1 bg-background rounded flex items-end p-2 border border-border/50">
                      <motion.div initial={{ height: 0 }} animate={{ height: '70%' }} transition={{ duration: 0.8 }} className="w-full bg-brand-blue rounded-sm" />
                    </div>
                    <div className="flex-1 bg-background rounded flex items-end p-2 border border-border/50">
                      <motion.div initial={{ height: 0 }} animate={{ height: '40%' }} transition={{ duration: 0.8 }} className="w-full bg-brand-blue/80 rounded-sm" />
                    </div>
                    <div className="flex-1 bg-background rounded flex items-end p-2 border border-border/50">
                      <motion.div initial={{ height: 0 }} animate={{ height: '85%' }} transition={{ duration: 0.8 }} className="w-full bg-brand-blue rounded-sm" />
                    </div>
                    <div className="flex-1 bg-background rounded flex items-end p-2 border border-border/50">
                      <motion.div initial={{ height: 0 }} animate={{ height: '20%' }} transition={{ duration: 0.8 }} className="w-full bg-brand-blue/60 rounded-sm" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-3 px-2 text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                    <span>GPT</span>
                    <span>SCG</span>
                    <span>GMG</span>
                    <span>DXS</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Alerts" && (
              <motion.div
                key="Alerts"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-background border border-[#E5E7EB] rounded-[20px] lg:rounded-[24px] shadow-[0_8px_40px_rgba(23,32,42,0.08)] overflow-hidden flex items-center justify-center p-8"
              >
                <div className="w-full max-w-sm bg-white border border-border rounded-xl shadow-md overflow-hidden">
                  <div className="p-5 border-b border-border bg-background/50">
                    <h3 className="font-display font-semibold text-foreground">Create Alert</h3>
                  </div>
                  <div className="p-5 space-y-5">
                    
                    <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                      <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">When</span>
                      <div className="border border-border rounded-md px-3 py-2 text-sm font-medium flex justify-between bg-background shadow-sm">
                        NTA Discount <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                      <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Crosses</span>
                      <div className="border border-border rounded-md px-3 py-2 text-sm font-medium font-mono-figure bg-background shadow-sm">
                        15%
                      </div>
                    </div>

                    <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                      <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">For</span>
                      <div className="border border-border rounded-md px-3 py-2 text-sm font-medium flex justify-between bg-background shadow-sm">
                        GPT <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="mt-6 p-4 bg-data-green/5 border border-data-green/20 rounded-lg flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-data-green flex items-center justify-center text-white shrink-0 mt-0.5">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground mb-1">Alert created</p>
                        <p className="text-xs text-muted-foreground">We'll notify you when the condition is met.</p>
                      </div>
                    </motion.div>
                    
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
