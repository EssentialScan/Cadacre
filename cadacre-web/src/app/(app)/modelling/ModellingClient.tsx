"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Loader2, AlertTriangle } from "lucide-react";

export default function ModellingClient({ initialReits }: { initialReits: any[] }) {
  const [reitId, setReitId] = useState(initialReits.length > 0 ? initialReits[0].id : "");
  const [rentGrowth, setRentGrowth] = useState("3.0");
  const [interestRateShock, setInterestRateShock] = useState("100");
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    reit: any;
    projections: any[];
    assumptions: string[];
    error?: string;
  } | null>(null);

  const handleRunModel = async () => {
    if (!reitId) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/modelling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          reitId, 
          rentGrowth: parseFloat(rentGrowth), 
          interestRateShock: parseInt(interestRateShock) 
        })
      });
      
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error("Failed to run model", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
          Distribution Scenario Modelling
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
          Mechanically extrapolate future distribution scenarios based on explicit macroeconomic assumptions.
        </p>
        
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700 font-medium">
            <strong>Mandatory AFSL Disclaimer:</strong> This is a mechanical model of historical patterns, not a prediction or recommendation. It extrapolates mathematical scenarios based solely on the assumptions you provide below. The platform does not endorse these outcomes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="md:col-span-1 space-y-6 bg-white p-6 rounded-lg border border-border shadow-sm">
          <h3 className="font-bold text-foreground">Macro Assumptions</h3>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Target REIT</label>
            <select 
              value={reitId}
              onChange={(e) => setReitId(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none"
            >
              {initialReits.map(r => (
                <option key={r.id} value={r.id}>{r.ticker} - {r.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Base Rent Growth: {rentGrowth}% p.a.
            </label>
            <input 
              type="range" 
              min="0" max="8" step="0.5"
              value={rentGrowth}
              onChange={(e) => setRentGrowth(e.target.value)}
              className="w-full accent-brand-blue"
            />
            <p className="text-[11px] text-muted-foreground mt-1">Simulates compounding yield growth</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Interest Rate Shock: +{interestRateShock} bps
            </label>
            <input 
              type="range" 
              min="0" max="300" step="25"
              value={interestRateShock}
              onChange={(e) => setInterestRateShock(e.target.value)}
              className="w-full accent-brand-blue"
            />
            <p className="text-[11px] text-muted-foreground mt-1">Applied proportionally to the REIT's gearing ratio over 5 years</p>
          </div>

          <button 
            onClick={handleRunModel}
            disabled={loading || !reitId}
            className="w-full bg-brand-blue text-white font-medium rounded-lg px-4 py-2.5 flex items-center justify-center hover:bg-brand-blue/90 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Run Scenario Model"}
          </button>
        </div>

        {/* Results */}
        <div className="md:col-span-2 space-y-6">
          {!results && !loading && (
            <div className="h-full border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-white/50 min-h-[450px]">
              <p className="text-muted-foreground text-sm">Configure assumptions and run the model.</p>
            </div>
          )}

          {loading && (
            <div className="h-full border border-border rounded-lg flex flex-col items-center justify-center bg-white min-h-[450px]">
              <Loader2 className="w-8 h-8 text-brand-blue animate-spin mb-4" />
              <p className="text-muted-foreground text-sm">Computing mechanical scenarios...</p>
            </div>
          )}

          {results && !loading && !results.error && (
            <div className="bg-white p-6 rounded-lg border border-border shadow-sm flex flex-col min-h-[450px]">
              <div className="mb-6">
                <h3 className="font-bold text-foreground text-lg">{results.reit.ticker} - 5 Year Distribution Yield Scenarios</h3>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {results.assumptions.map((assump: string, idx: number) => (
                    <div key={idx} className="bg-muted/30 px-3 py-1.5 rounded-md border border-border/50 font-mono-figure text-xs">
                      {assump}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.projections} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUpside" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDownside" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="year" tick={{fontSize: 12, fill: '#64748B'}} tickMargin={10} />
                    <YAxis 
                      tick={{fontSize: 12, fill: '#64748B'}} 
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip 
                      formatter={(value: any, name: any) => {
                        if (typeof value !== 'number') return [String(value), String(name)];
                        return [`${value.toFixed(2)}%`, String(name).charAt(0).toUpperCase() + String(name).slice(1)];
                      }}
                      labelStyle={{ color: '#0F172A', fontWeight: 'bold', marginBottom: '4px' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    
                    <Area type="monotone" dataKey="upside" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorUpside)" name="Upside Case" />
                    <Area type="monotone" dataKey="base" stroke="#0F172A" strokeWidth={3} fill="none" name="Base Case" />
                    <Area type="monotone" dataKey="downside" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorDownside)" name="Downside Case" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {results?.error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
              {results.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
