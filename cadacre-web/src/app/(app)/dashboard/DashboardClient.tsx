"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, X, ArrowRight, Activity, Map, PieChart, TrendingUp, Bell, Save, Trash2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function DashboardClient({ reits, isPro }: { reits: any[], isPro: boolean }) {
  const { isSignedIn } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [minYield, setMinYield] = useState("");
  const [maxGearing, setMaxGearing] = useState("");
  const [minNtaDiscount, setMinNtaDiscount] = useState("");
  
  const [savedViews, setSavedViews] = useState<any[]>([]);
  const [saveName, setSaveName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/screener/views")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setSavedViews(data);
        });
    }
  }, [isSignedIn]);

  const formattedData = reits.map(r => ({
    ...r,
    yieldStr: r.yield ? `${r.yield.toFixed(1)}%` : "-",
    gearingStr: r.gearing ? `${r.gearing.toFixed(1)}%` : "-",
    ntaStr: r.ntaDiscount ? `${r.ntaDiscount > 0 ? '-' : '+'}${Math.abs(r.ntaDiscount).toFixed(1)}%` : "-",
    ntaRaw: r.ntaDiscount || 0
  }));

  const filteredReits = formattedData.filter(r => {
    const matchesSearch = r.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === "All" || r.sector === sectorFilter;
    const matchesYield = minYield === "" || (r.yield !== null && r.yield >= parseFloat(minYield));
    const matchesGearing = maxGearing === "" || (r.gearing !== null && r.gearing <= parseFloat(maxGearing));
    const matchesNta = minNtaDiscount === "" || (r.ntaDiscount !== null && r.ntaDiscount >= parseFloat(minNtaDiscount));
    return matchesSearch && matchesSector && matchesYield && matchesGearing && matchesNta;
  });

  const sectors = ["All", ...Array.from(new Set(formattedData.map(r => r.sector)))];
  const avgYield = reits.reduce((acc, r) => acc + (r.yield || 0), 0) / (reits.length || 1);
  const avgGearing = reits.reduce((acc, r) => acc + (r.gearing || 0), 0) / (reits.length || 1);

  const handleSaveView = async () => {
    if (!saveName.trim()) return;
    setSaveError("");
    
    const res = await fetch("/api/screener/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: saveName,
        sector: sectorFilter,
        minYield,
        maxGearing,
        minNtaDiscount
      })
    });
    
    const data = await res.json();
    if (data.error) {
      setSaveError(data.error);
    } else {
      setSavedViews([...savedViews, data]);
      setShowSaveDialog(false);
      setSaveName("");
    }
  };

  const applyView = (view: any) => {
    setSectorFilter(view.sector || "All");
    setMinYield(view.minYield !== null ? view.minYield.toString() : "");
    setMaxGearing(view.maxGearing !== null ? view.maxGearing.toString() : "");
    setMinNtaDiscount(view.minNtaDiscount !== null ? view.minNtaDiscount.toString() : "");
  };

  const deleteView = async (id: string, e: any) => {
    e.stopPropagation();
    await fetch(`/api/screener/views?id=${id}`, { method: "DELETE" });
    setSavedViews(savedViews.filter(v => v.id !== id));
  };

  const clearFilters = () => {
    setSectorFilter("All");
    setMinYield("");
    setMaxGearing("");
    setMinNtaDiscount("");
    setSearchTerm("");
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Command Center</h1>
          <p className="text-muted-foreground mt-1 text-sm">Welcome back. Here's a live overview of the ASX REIT sector.</p>
        </div>
        {!isPro && (
          <div className="bg-brand-blue/10 border border-brand-blue/20 px-4 py-2 rounded-lg text-sm text-brand-blue font-medium">
            Free Tier Active
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-bold text-muted-foreground mb-1">Tracked Securities</div>
            <div className="text-2xl font-mono-figure font-bold text-foreground">{reits.length}</div>
          </div>
          <Activity className="w-8 h-8 text-muted-foreground/30" />
        </div>
        <div className="bg-white p-5 rounded-xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-bold text-muted-foreground mb-1">Sector Avg Yield</div>
            <div className="text-2xl font-mono-figure font-bold text-brand-blue">{avgYield.toFixed(2)}%</div>
          </div>
          <TrendingUp className="w-8 h-8 text-brand-blue/20" />
        </div>
        <div className="bg-white p-5 rounded-xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-bold text-muted-foreground mb-1">Sector Avg Gearing</div>
            <div className="text-2xl font-mono-figure font-bold text-foreground">{avgGearing.toFixed(1)}%</div>
          </div>
          <PieChart className="w-8 h-8 text-muted-foreground/30" />
        </div>
      </div>



      {/* Main Screener Workspace */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Screener Workspace</h2>
          {savedViews.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Saved Views:</span>
              {savedViews.map(view => (
                <button 
                  key={view.id} 
                  onClick={() => applyView(view)}
                  className="flex items-center gap-1.5 text-[11px] font-bold bg-brand-blue/10 text-brand-blue px-2.5 py-1 rounded hover:bg-brand-blue/20 transition-colors"
                >
                  {view.name}
                  <Trash2 onClick={(e) => deleteView(view.id, e)} className="w-3 h-3 text-brand-blue/50 hover:text-red-500 ml-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-[700px]">
          
          {/* Top Search & Actions */}
          <div className="h-16 border-b border-border/50 px-6 flex items-center justify-between bg-background/50">
            <div className="flex items-center gap-3 w-full max-w-md">
              <div className="h-9 w-full bg-white rounded-md border border-border flex items-center px-3 focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all">
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
            
            <div className="flex items-center gap-3">
              <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">
                Clear Filters
              </button>
              <button 
                onClick={() => setShowSaveDialog(!showSaveDialog)}
                disabled={!isSignedIn}
                className="h-9 px-4 rounded-md border border-border bg-white text-[13px] font-medium hover:bg-muted/50 flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-muted-foreground" />
                Save View
              </button>
            </div>
          </div>

          {/* Expanded Filter Panel */}
          <div className="px-6 py-4 border-b border-border/50 bg-white grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative">
            {showSaveDialog && (
              <div className="absolute top-4 right-6 bg-white border border-border shadow-lg rounded-xl p-4 w-72 z-10 animate-in fade-in zoom-in-95">
                <h4 className="font-bold text-sm mb-2">Save Custom View</h4>
                <p className="text-xs text-muted-foreground mb-3">Save the current filter configuration to quickly access it later.</p>
                <input 
                  type="text" 
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  placeholder="e.g. High Yield Industrial"
                  className="w-full h-9 rounded border border-border px-3 text-sm mb-2"
                />
                {saveError && <p className="text-xs text-red-500 mb-2">{saveError}</p>}
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowSaveDialog(false)} className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground">Cancel</button>
                  <button onClick={handleSaveView} className="bg-brand-blue text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-brand-blue/90">Save</button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Sector</label>
              <select 
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-[13px] outline-none focus:ring-2 focus:ring-brand-blue/20"
              >
                {sectors.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sectors' : s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Min Yield (%)</label>
              <input 
                type="number" step="0.1" placeholder="e.g. 5.5"
                value={minYield}
                onChange={(e) => setMinYield(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-[13px] outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Max Gearing (%)</label>
              <input 
                type="number" step="1" placeholder="e.g. 30"
                value={maxGearing}
                onChange={(e) => setMaxGearing(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-[13px] outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Min NTA Discount (%)</label>
              <input 
                type="number" step="1" placeholder="e.g. 10"
                value={minNtaDiscount}
                onChange={(e) => setMinNtaDiscount(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-border bg-white text-[13px] outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-muted/20 text-[11px] uppercase font-bold tracking-wider text-muted-foreground border-b border-border/50">
            <div className="col-span-2">REIT</div>
            <div className="text-right">Sector</div>
            <div className="text-right">Yield</div>
            <div className="text-right">Gearing</div>
            <div className="text-right">NTA Discount</div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/30">
            {filteredReits.length > 0 ? filteredReits.map((row) => (
              <Link href={`/reit/${row.ticker}`} key={row.ticker} className="grid grid-cols-6 gap-4 px-6 py-4 items-center hover:bg-muted/10 transition-colors cursor-pointer">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center font-bold text-[10px] text-brand-blue shrink-0">{row.ticker}</div>
                  <span className="font-medium text-[13px] text-foreground truncate">{row.name}</span>
                </div>
                <div className="text-right text-[12px] text-muted-foreground">{row.sector}</div>
                <div className="text-right font-mono-figure text-[13px] tabular-nums">{row.yieldStr}</div>
                <div className="text-right font-mono-figure text-[13px] tabular-nums">{row.gearingStr}</div>
                <div className="flex justify-end">
                  <div className={`text-right font-mono-figure text-[13px] tabular-nums px-2 py-1 rounded-md ${row.ntaRaw > 0 ? 'text-data-red bg-data-red/10' : 'text-data-green bg-data-green/10'}`}>
                    {row.ntaStr}
                  </div>
                </div>
              </Link>
            )) : (
              <div className="p-10 text-center text-muted-foreground text-[13px] flex flex-col items-center">
                <Search className="w-8 h-8 text-muted-foreground/30 mb-3" />
                No REITs match your custom view.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
