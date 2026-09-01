"use client";

import { useState } from "react";
import { getTownDecisionTag, type TownDecisionSnapshot } from "@/lib/rankTowns";
import { HazardIcons } from "@/components/HazardIcons";
import { TownMapToggle } from "@/components/TownMapToggle";
import type { LedgerRow } from "@/app/dashboard/types";

type UnlockedRow = Extract<LedgerRow, { locked: false }>;

const TAG_LABEL: Record<string, string> = {
  "yield-heavy": "yield-heavy",
  "budget-led": "budget-led",
  balanced: "balanced",
  "needs-review": "needs review",
};

export function SensitivityExplorer({ towns, initialBudget, initialYield }: {
  towns: UnlockedRow[];
  initialBudget: number;
  initialYield: number;
}) {
  const [budget, setBudget] = useState(initialBudget);
  const [targetYield, setTargetYield] = useState(initialYield);

  // Real-time filter: which towns still match the adjusted criteria. A null
  // price/yield (data genuinely unavailable) never excludes a town, matching
  // the convention matchesFilters() uses everywhere else in the app.
  const matching = towns.filter(
    (town) =>
      (town.medianPrice === null || town.medianPrice <= budget) &&
      (town.grossYieldPct === null || town.grossYieldPct >= targetYield)
  );

  const matchedCount = matching.length;
  const droppedCount = Math.max(towns.length - matchedCount, 0);
  const budgetDrift = ((initialBudget - budget) / initialBudget) * 100;
  const yieldDrift = ((targetYield - initialYield) / initialYield) * 100;

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-sm border border-faded-rule bg-white/60 p-6">
        <h2 className="font-display text-2xl text-ink-navy">Sensitivity: What if you adjust?</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          Drag the sliders below to test how a tighter budget or higher yield target changes your shortlist.
          Watch which towns fall out of reach.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
              Max budget: ${budget.toLocaleString("en-AU")}
              {budgetDrift !== 0 && (
                <span className="ml-2 text-[10px] text-charcoal/40">
                  ({budgetDrift > 0 ? "+" : ""}{budgetDrift.toFixed(0)}% from original)
                </span>
              )}
            </label>
            <input
              type="range"
              min={300000}
              max={900000}
              step={10000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="mt-3 w-full accent-survey-brass"
            />
            <div className="mt-2 flex justify-between text-[10px] text-charcoal/40">
              <span>$300k</span>
              <span>$900k</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
              Min gross yield: {targetYield.toFixed(1)}%
              {yieldDrift !== 0 && (
                <span className="ml-2 text-[10px] text-charcoal/40">
                  ({yieldDrift > 0 ? "+" : ""}{yieldDrift.toFixed(0)}% from original)
                </span>
              )}
            </label>
            <input
              type="range"
              min={3}
              max={8}
              step={0.1}
              value={targetYield}
              onChange={(e) => setTargetYield(Number(e.target.value))}
              className="mt-3 w-full accent-survey-brass"
            />
            <div className="mt-2 flex justify-between text-[10px] text-charcoal/40">
              <span>3.0%</span>
              <span>8.0%</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-sm border-l-4 border-survey-brass bg-blue-50/40 p-4">
          <p className="text-sm font-medium text-ink-navy">
            {matchedCount} of {towns.length} towns still fit
            {droppedCount > 0 && (
              <span className="text-charcoal/70">
                . {droppedCount} town{droppedCount === 1 ? "" : "s"} dropped out.
              </span>
            )}
          </p>
          <p className="mt-1 text-xs text-charcoal/60">
            Tightening your assumptions helps you understand which towns are on the edge and most sensitive to market moves.
          </p>
        </div>
      </div>

      {/* Matching towns ledger */}
      {matchedCount > 0 && (
        <div className="rounded-sm border border-faded-rule overflow-hidden">
          <div className="grid grid-cols-[1fr_repeat(4,minmax(0,0.7fr))_minmax(0,0.55fr)] gap-2 border-b border-ink-navy bg-ink-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-parchment">
            <span>Town</span>
            <span>Median price</span>
            <span>Gross yield</span>
            <span>Vacancy rate</span>
            <span>Value signal</span>
            <span>Hazards</span>
          </div>

          {matching.map((town) => {
            const snapshot: TownDecisionSnapshot = {
              town: town.town,
              medianPrice: town.medianPrice,
              medianRent: town.medianRent,
              grossYieldPct: town.grossYieldPct,
              vacancyRatePct: town.vacancyRatePct,
              bushfireRisk: town.bushfireRisk,
              floodRisk: town.floodRisk,
              infrastructureProjects: town.infrastructureProjects,
            };
            const tag = getTownDecisionTag(snapshot);

            return (
              <div
                key={town.town}
                className="ledger-row grid grid-cols-[1fr_repeat(4,minmax(0,0.7fr))_minmax(0,0.55fr)] items-center gap-2 px-5 py-4 border-b border-faded-rule text-charcoal"
              >
                <span className="flex items-center gap-2 font-medium text-ink-navy">
                  <span className="flex flex-col">
                    <span className="flex items-center gap-2">
                      {town.town}, {town.state}
                      <TownMapToggle town={town.town} state={town.state} />
                    </span>
                    <span className="mt-1 text-[10px] uppercase tracking-[0.14em] text-charcoal/60">
                      {TAG_LABEL[tag]}
                    </span>
                  </span>
                </span>
                <span className="font-mono-figure text-sm">
                  {town.medianPrice !== null ? `$${town.medianPrice.toLocaleString("en-AU")}` : "—"}
                </span>
                <span className="font-mono-figure text-sm">
                  {town.grossYieldPct !== null ? `${town.grossYieldPct.toFixed(1)}%` : "—"}
                </span>
                <span className="font-mono-figure text-sm">
                  {town.vacancyRatePct !== null ? `${town.vacancyRatePct.toFixed(1)}%` : "—"}
                </span>
                <span className="font-mono-figure text-sm text-deep-forest">
                  {town.valueScore}/100
                </span>
                <HazardIcons bushfireRisk={town.bushfireRisk} floodRisk={town.floodRisk} />
              </div>
            );
          })}
        </div>
      )}

      {matchedCount === 0 && (
        <div className="rounded-sm border border-faded-rule bg-white/40 p-6 text-sm text-charcoal/70">
          No towns match your adjusted criteria. Try a higher budget or lower yield target.
        </div>
      )}
    </div>
  );
}
