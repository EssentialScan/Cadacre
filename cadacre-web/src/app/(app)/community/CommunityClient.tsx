"use client";

import { useState } from "react";
import { Users, AlertTriangle } from "lucide-react";

export default function CommunityClient({ initialPortfolios }: { initialPortfolios: any[] }) {
  const [portfolios] = useState(initialPortfolios);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
          Community Portfolios
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
          Discover how other investors are weighting their exposures across the ASX REIT sector.
        </p>

        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700 font-medium">
            <strong>Platform Disclaimer:</strong> The portfolios listed below are user-generated and do not represent the views or recommendations of the platform. This data is for educational purposes only.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-border rounded-xl">
            <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No public portfolios available yet.</p>
          </div>
        ) : (
          portfolios.map((portfolio, idx) => (
            <div key={idx} className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold">
                  {portfolio.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">@{portfolio.username}</h3>
                  <p className="text-xs text-muted-foreground">Public Strategy</p>
                </div>
              </div>

              <div className="space-y-3">
                {portfolio.holdings.slice(0, 5).map((h: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-figure text-xs font-bold text-muted-foreground w-8">{h.ticker}</span>
                      <span className="text-sm text-foreground truncate max-w-[120px]">{h.name}</span>
                    </div>
                    <div className="text-sm font-mono-figure font-bold">
                      {h.weightPct.toFixed(1)}%
                    </div>
                  </div>
                ))}
                {portfolio.holdings.length > 5 && (
                  <div className="text-xs text-muted-foreground text-center pt-2 mt-2 border-t border-border/50">
                    + {portfolio.holdings.length - 5} more positions
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
