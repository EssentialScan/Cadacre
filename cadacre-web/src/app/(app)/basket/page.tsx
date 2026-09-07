"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AmbientSection } from "@/components/ambient/AmbientSection";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

export default function BasketBuilderPage() {
  const [sector, setSector] = useState("All");
  const [maxGearing, setMaxGearing] = useState("40");
  const [minYield, setMinYield] = useState("4");
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    basket: any[];
    stats: any;
    backtest: any[];
  } | null>(null);

  const handleBuildBasket = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/basket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector, maxGearing, minYield })
      });
      
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error("Failed to build basket", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8FA]">
      <main className="flex-1 pb-24">
        <AmbientSection theme="technical" />
        
        <div className="mx-auto max-w-5xl px-6 relative z-10 pt-16">
          <div className="mb-12">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
              Property-Exposure Basket Builder
            </h1>
            <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
              Mechanically assemble a basket of ASX REITs based on strict parameters, and backtest an equal-weighted $10,000 investment over the last 12 months.
            </p>
            
            <div className="mt-4 p-4 bg-brand-blue/5 border border-brand-blue/20 rounded-xl">
              <p className="text-sm text-brand-blue font-medium">
                <strong>Disclaimer:</strong> This is a mechanical calculator. It does not provide recommendations or financial advice. It simply filters historical data based on the precise inputs you provide.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="md:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="font-bold text-foreground">Constraints</h3>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Sector</label>
                <select 
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none"
                >
                  <option value="All">All Sectors</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Retail">Retail</option>
                  <option value="Office">Office</option>
                  <option value="Diversified">Diversified</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Max Gearing (%) : {maxGearing}%
                </label>
                <input 
                  type="range" 
                  min="0" max="60" step="5"
                  value={maxGearing}
                  onChange={(e) => setMaxGearing(e.target.value)}
                  className="w-full accent-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Min Yield (%) : {minYield}%
                </label>
                <input 
                  type="range" 
                  min="0" max="10" step="0.5"
                  value={minYield}
                  onChange={(e) => setMinYield(e.target.value)}
                  className="w-full accent-brand-blue"
                />
              </div>

              <button 
                onClick={handleBuildBasket}
                disabled={loading}
                className="w-full bg-brand-blue text-white font-medium rounded-lg px-4 py-2.5 flex items-center justify-center hover:bg-brand-blue/90 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Build Basket & Backtest"}
              </button>
            </div>

            {/* Results */}
            <div className="md:col-span-2 space-y-6">
              {!results && !loading && (
                <div className="h-full border-2 border-dashed border-border rounded-2xl flex items-center justify-center bg-white/50 min-h-[400px]">
                  <p className="text-muted-foreground text-sm">Configure constraints and run the builder.</p>
                </div>
              )}

              {loading && (
                <div className="h-full border border-border rounded-2xl flex flex-col items-center justify-center bg-white min-h-[400px]">
                  <Loader2 className="w-8 h-8 text-brand-blue animate-spin mb-4" />
                  <p className="text-muted-foreground text-sm">Fetching live historical data...</p>
                </div>
              )}

              {results && !loading && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                      <div className="text-xs uppercase font-bold text-muted-foreground mb-1">Total REITs</div>
                      <div className="text-2xl font-mono-figure font-bold text-foreground">{results.stats.count}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                      <div className="text-xs uppercase font-bold text-muted-foreground mb-1">Avg Yield</div>
                      <div className="text-2xl font-mono-figure font-bold text-brand-blue">{results.stats.avgYield.toFixed(2)}%</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                      <div className="text-xs uppercase font-bold text-muted-foreground mb-1">Avg Gearing</div>
                      <div className="text-2xl font-mono-figure font-bold text-foreground">{results.stats.avgGearing.toFixed(1)}%</div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="font-bold text-foreground mb-6">1-Year Historical Backtest ($10,000 Equal-Weighted)</h3>
                    <div className="h-[300px] w-full">
                      {results.backtest && results.backtest.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={results.backtest}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748B'}} tickMargin={10} minTickGap={30} />
                            <YAxis 
                              domain={['dataMin - 500', 'dataMax + 500']} 
                              tick={{fontSize: 12, fill: '#64748B'}} 
                              tickFormatter={(val) => `$${val.toLocaleString()}`}
                              width={80}
                            />
                            <Tooltip 
                              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Portfolio Value']}
                              labelStyle={{ color: '#0F172A', fontWeight: 'bold', marginBottom: '4px' }}
                              contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#005A9C" 
                              strokeWidth={3}
                              dot={false}
                              activeDot={{ r: 6, fill: '#005A9C', stroke: '#fff', strokeWidth: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                          Not enough historical data available for these assets.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-muted/20">
                      <h3 className="font-bold text-foreground">Matching Securities</h3>
                    </div>
                    <div className="divide-y divide-border">
                      {results.basket.map((reit) => (
                        <div key={reit.ticker} className="px-6 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-background border border-border flex items-center justify-center font-bold text-xs text-brand-blue">
                              {reit.ticker}
                            </div>
                            <div>
                              <div className="font-medium text-sm text-foreground">{reit.name}</div>
                              <div className="text-xs text-muted-foreground">{reit.sector}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono-figure text-sm font-medium">{reit.yield?.toFixed(2)}% Yield</div>
                            <div className="text-xs text-muted-foreground font-mono-figure">{reit.gearing?.toFixed(1)}% Gearing</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
