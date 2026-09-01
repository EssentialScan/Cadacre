"use client";

import { useState } from "react";
import { buildStressTestComparison } from "@/lib/rankTowns";

export function RentvestorLab() {
  const [sydneyRent, setSydneyRent] = useState<number>(600);
  const [deposit, setDeposit] = useState<number>(150000);
  const [regionalPrice, setRegionalPrice] = useState<number>(665000);
  const [regionalYield, setRegionalYield] = useState<number>(5.8);
  const [years, setYears] = useState<number>(5);
  const [submitted, setSubmitted] = useState(false);

  const comparison = buildStressTestComparison({
    sydneyWeeklyRent: sydneyRent,
    regionalMedianPrice: regionalPrice,
    regionalGrossYield: regionalYield,
    annualWealthGrowth: 0.04,
    initialDeposit: deposit,
    years,
  });

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-sm border border-faded-rule bg-white/60 p-6">
        <h2 className="font-display text-2xl text-ink-navy">Rentvestor Lab</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          Compare two futures: keep renting in Sydney, or invest regionally.
          Adjust the numbers to test your own scenario.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
              Your Sydney rent (per week)
            </label>
            <input
              type="number"
              value={sydneyRent}
              onChange={(e) => setSydneyRent(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 font-mono-figure text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
              Initial deposit ($)
            </label>
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 font-mono-figure text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
              Regional median price ($)
            </label>
            <input
              type="number"
              value={regionalPrice}
              onChange={(e) => setRegionalPrice(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 font-mono-figure text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
              Regional gross yield (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={regionalYield}
              onChange={(e) => setRegionalYield(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 font-mono-figure text-charcoal"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
              Time horizon (years)
            </label>
            <div className="mt-2 flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="20"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="flex-1"
              />
              <span className="font-mono-figure text-sm text-ink-navy">{years}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setSubmitted(true)}
          className="mt-6 rounded-sm bg-survey-brass px-5 py-2.5 font-semibold text-ink-navy transition hover:bg-survey-brass/90"
        >
          Run comparison
        </button>
      </div>

      {submitted && (
        <div className="space-y-4">
          {/* Verdict */}
          <div className="rounded-sm border border-ink-navy bg-white/50 p-5">
            <p className="font-display text-lg text-ink-navy">{comparison.verdict}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
                  Sydney path
                </p>
                <p className="mt-1 font-display text-xl text-charcoal/70">
                  ${comparison.sydneyWealthAfter.toLocaleString("en-AU")}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-charcoal/60">
                  {comparison.sydneyNarrative}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
                  Regional path
                </p>
                <p className="mt-1 font-display text-xl text-deep-forest">
                  ${comparison.regionalWealthAfter.toLocaleString("en-AU")}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-charcoal/60">
                  {comparison.regionalNarrative}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-faded-rule pt-4">
              <p className="text-xs text-charcoal/50">
                <strong>Assumptions:</strong> 4% annual wealth growth (baseline stock market return), 7% mortgage rate, $50/week
                maintenance. Regional purchase uses {Math.round(((regionalPrice * 0.8) / regionalPrice) * 100)}% LVR. Results are illustrative, not advice.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
