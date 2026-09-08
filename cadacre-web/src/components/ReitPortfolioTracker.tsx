"use client";

import { useState, useEffect, useTransition } from "react";
import { Plus, Trash2, TrendingUp, DollarSign, BarChart3, Calendar, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Holding {
  id: string;
  ticker: string | null;
  name: string | null;
  sector: string | null;
  units: number;
  purchasePrice: number;
  purchaseDate: string;
  yield: number | null;
  ntaDiscount: number | null;
  gearing: number | null;
  wale: number | null;
}

export function ReitPortfolioTracker() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taxData, setTaxData] = useState<any>(null);
  const [loadingTax, setLoadingTax] = useState(true);
  const [activeTab, setActiveTab] = useState<"holdings" | "tax">("holdings");

  const loadHoldings = async () => {
    setLoading(true);
    setLoadingTax(true);
    try {
      const [resHoldings, resTax] = await Promise.all([
        fetch("/api/portfolio"),
        fetch("/api/portfolio/tax")
      ]);
      if (resHoldings.ok) setHoldings(await resHoldings.json());
      if (resTax.ok) setTaxData(await resTax.json());
    } finally {
      setLoading(false);
      setLoadingTax(false);
    }
  };

  useEffect(() => { loadHoldings(); }, []);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reitTicker: data.ticker,
          units: Number(data.units),
          purchasePrice: Number(data.purchasePrice),
          purchaseDate: data.purchaseDate,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to add holding");
      } else {
        form.reset();
        setShowForm(false);
        loadHoldings();
      }
    });
  };

  const handleRemove = (id: string) => {
    startTransition(async () => {
      await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
      loadHoldings();
    });
  };

  // Computed portfolio metrics
  const totalCostBasis = holdings.reduce((s, h) => s + h.units * h.purchasePrice, 0);
  const weightedYield = holdings.length
    ? holdings.reduce((s, h) => s + (h.yield || 0) * (h.units * h.purchasePrice), 0) / totalCostBasis
    : 0;
  const weightedNtaDiscount = holdings.length
    ? holdings.reduce((s, h) => s + (h.ntaDiscount || 0) * (h.units * h.purchasePrice), 0) / totalCostBasis
    : 0;
  const weightedGearing = holdings.length
    ? holdings.reduce((s, h) => s + (h.gearing || 0) * (h.units * h.purchasePrice), 0) / totalCostBasis
    : 0;

  const fmt = (n: number) => `$${n >= 1_000_000 ? (n / 1_000_000).toFixed(2) + "M" : n.toFixed(2)}`;
  const fmtPct = (n: number | null) => n == null ? "—" : `${n.toFixed(1)}%`;

  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-brand-blue opacity-70" />
              <p className="text-xs font-medium text-muted-foreground">Cost Basis</p>
            </div>
            <p className="text-2xl font-display font-bold text-foreground tabular-nums">{fmt(totalCostBasis)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-data-green opacity-70" />
              <p className="text-xs font-medium text-muted-foreground">Wtd. Yield on Cost</p>
            </div>
            <p className="text-2xl font-display font-bold text-brand-blue tabular-nums">{fmtPct(weightedYield)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-brand-blue opacity-70" />
              <p className="text-xs font-medium text-muted-foreground">Wtd. NTA Disc/Prem</p>
            </div>
            <p className={`text-2xl font-display font-bold tabular-nums ${weightedNtaDiscount > 0 ? "text-data-red" : "text-data-green"}`}>
              {weightedNtaDiscount > 0 ? "-" : "+"}{fmtPct(Math.abs(weightedNtaDiscount))}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-muted-foreground opacity-70" />
              <p className="text-xs font-medium text-muted-foreground">Wtd. Gearing</p>
            </div>
            <p className="text-2xl font-display font-bold text-foreground tabular-nums">{fmtPct(weightedGearing)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("holdings")}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === "holdings" ? "border-brand-blue text-brand-blue" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Holdings
        </button>
        <button
          onClick={() => setActiveTab("tax")}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === "tax" ? "border-brand-blue text-brand-blue" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Distributions & Tax
        </button>
      </div>

      {activeTab === "holdings" ? (
        <Card className="bg-white border border-border shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4 pt-5 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Holdings</CardTitle>
          <div className="flex gap-2">
            <button
              onClick={loadHoldings}
              className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-brand-blue/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add holding
            </button>
          </div>
        </CardHeader>

        {showForm && (
          <div className="border-b border-border/50 p-5 bg-muted/10">
            <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Ticker</label>
                <input
                  name="ticker" required placeholder="e.g. GMG"
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 uppercase"
                  style={{ textTransform: "uppercase" }}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Units</label>
                <input
                  name="units" type="number" min="1" step="1" required placeholder="500"
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Purchase Price (AUD)</label>
                <input
                  name="purchasePrice" type="number" min="0.01" step="0.01" required placeholder="35.50"
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Purchase Date</label>
                <input
                  name="purchaseDate" type="date" required
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit" disabled={isPending}
                  className="flex-1 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Adding…" : "Add"}
                </button>
                <button
                  type="button" onClick={() => setShowForm(false)}
                  className="px-3 py-2 border border-border text-sm rounded-md hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
        )}

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading holdings…</div>
          ) : holdings.length === 0 ? (
            <div className="p-10 text-center">
              <Calendar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">No holdings yet</p>
              <p className="text-sm text-muted-foreground">Add your first REIT holding above to start tracking.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/50">
                  <TableHead>REIT</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                  <TableHead className="text-right">Purchase Price</TableHead>
                  <TableHead className="text-right">Cost Basis</TableHead>
                  <TableHead className="text-right">Yield</TableHead>
                  <TableHead className="text-right">NTA Disc/Prem</TableHead>
                  <TableHead className="text-right">Gearing</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map(h => (
                  <TableRow key={h.id} className="hover:bg-muted/30 border-b border-border/30">
                    <TableCell>
                      <span className="font-display font-bold text-foreground">{h.ticker}</span>
                      <div className="text-xs text-muted-foreground">{h.name}</div>
                    </TableCell>
                    <TableCell className="text-sm">{h.sector}</TableCell>
                    <TableCell className="text-right font-mono-figure text-sm">{h.units.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono-figure text-sm">${h.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-mono-figure text-sm font-semibold">{fmt(h.units * h.purchasePrice)}</TableCell>
                    <TableCell className="text-right font-mono-figure text-sm text-brand-blue">{fmtPct(h.yield)}</TableCell>
                    <TableCell className="text-right font-mono-figure text-sm">
                      <span className={(h.ntaDiscount || 0) > 0 ? "text-data-red" : "text-data-green"}>
                        {(h.ntaDiscount || 0) > 0 ? "-" : "+"}{fmtPct(Math.abs(h.ntaDiscount || 0))}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono-figure text-sm text-muted-foreground">{fmtPct(h.gearing)}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleRemove(h.id)}
                        className="p-1.5 rounded text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      ) : (
        <div className="space-y-6">
          {loadingTax ? (
            <div className="p-8 text-center text-muted-foreground text-sm border border-border rounded-xl bg-white shadow-sm">Loading tax data…</div>
          ) : !taxData || taxData.holdings.length === 0 ? (
            <div className="p-10 text-center border border-border rounded-xl bg-white shadow-sm">
              <Calendar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">No distributions yet</p>
              <p className="text-sm text-muted-foreground">We haven't recorded any distributions for your holdings since their purchase dates.</p>
            </div>
          ) : (
            <>
              {/* Tax Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-white border border-border shadow-sm">
                  <CardContent className="p-5">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Total Earned</p>
                    <p className="text-2xl font-display font-bold text-foreground tabular-nums">{fmt(taxData.summary.totalEarned)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-brand-blue/20 bg-brand-blue/5 shadow-sm">
                  <CardContent className="p-5">
                    <p className="text-xs font-medium text-brand-blue mb-1">Tax Deferred (Advantage)</p>
                    <p className="text-2xl font-display font-bold text-brand-blue tabular-nums">{fmt(taxData.summary.taxDeferredEarned)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border border-border shadow-sm">
                  <CardContent className="p-5">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Capital Gains</p>
                    <p className="text-2xl font-display font-bold text-foreground tabular-nums">{fmt(taxData.summary.cgDiscountEarned)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border border-border shadow-sm">
                  <CardContent className="p-5">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Foreign Income</p>
                    <p className="text-2xl font-display font-bold text-foreground tabular-nums">{fmt(taxData.summary.foreignIncomeEarned)}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tax Table */}
              <Card className="bg-white border border-border shadow-sm">
                <CardHeader className="border-b border-border/50 bg-muted/20 pb-4 pt-5">
                  <CardTitle className="text-base font-semibold">Distribution Breakdown by Holding</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b border-border/50">
                        <TableHead>REIT</TableHead>
                        <TableHead className="text-right">Units</TableHead>
                        <TableHead className="text-right">Total Dist.</TableHead>
                        <TableHead className="text-right">Tax Deferred</TableHead>
                        <TableHead className="text-right">Capital Gains</TableHead>
                        <TableHead className="text-right">Foreign Inc.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taxData.holdings.map((h: any) => (
                        <TableRow key={h.id} className="hover:bg-muted/30 border-b border-border/30">
                          <TableCell>
                            <span className="font-display font-bold text-foreground">{h.ticker}</span>
                            <div className="text-xs text-muted-foreground">{h.name}</div>
                          </TableCell>
                          <TableCell className="text-right font-mono-figure text-sm">{h.units.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono-figure text-sm font-semibold">{fmt(h.taxComponents.totalEarned)}</TableCell>
                          <TableCell className="text-right font-mono-figure text-sm text-brand-blue font-medium">{fmt(h.taxComponents.taxDeferredEarned)}</TableCell>
                          <TableCell className="text-right font-mono-figure text-sm">{fmt(h.taxComponents.cgDiscountEarned)}</TableCell>
                          <TableCell className="text-right font-mono-figure text-sm">{fmt(h.taxComponents.foreignIncomeEarned)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed mt-8">
        Portfolio metrics are based on the numbers you enter and current REIT data from our database.
        General information only — not personalised financial or investment advice.
        NTA, yield, and gearing figures reflect the latest available data, not real-time prices.
      </p>
    </div>
  );
}
