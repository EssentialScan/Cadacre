"use client";

import { useState } from "react";
import { buildStressTestComparison } from "@/lib/rankTowns";
import { RBA_INVESTOR_VARIABLE_RATE, formatMoney } from "@/lib/investmentMath";

export function RentvestorLab() {
  const [sydneyRent, setSydneyRent] = useState<number>(600);
  const [depositPct, setDepositPct] = useState<number>(20);
  const [regionalPrice, setRegionalPrice] = useState<number>(665000);
  const [regionalYield, setRegionalYield] = useState<number>(5.8);
  const [ratePct, setRatePct] = useState<number>(RBA_INVESTOR_VARIABLE_RATE.ratePct);
  const [termYears, setTermYears] = useState<number>(30);
  const [submitted, setSubmitted] = useState(false);

  const safeRegionalPrice = Math.max(regionalPrice, 1);

  const comparison = buildStressTestComparison({
    sydneyWeeklyRent: sydneyRent,
    regionalMedianPrice: safeRegionalPrice,
    regionalGrossYieldPct: regionalYield,
    depositPct,
    ratePct,
    termYears,
  });

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-sm border border-faded-rule bg-white/60 p-6">
        <h2 className="font-display text-2xl text-ink-navy">Rentvestor Lab</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          Compare today&apos;s numbers: keep renting in Sydney, or buy regionally.
          Adjust the inputs to test your own scenario.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
              Your Sydney rent (per week)
            </label>
            <input
              type="number"
              min={0}
              value={sydneyRent}
              onChange={(e) => setSydneyRent(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 font-mono-figure text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
              Deposit (%)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={depositPct}
              onChange={(e) => setDepositPct(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 font-mono-figure text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
              Regional median price ($)
            </label>
            <input
              type="number"
              min={1}
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
              min={0}
              value={regionalYield}
              onChange={(e) => setRegionalYield(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 font-mono-figure text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
              Mortgage rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              min={0}
              value={ratePct}
              onChange={(e) => setRatePct(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 font-mono-figure text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
              Loan term (years)
            </label>
            <input
              type="number"
              min={1}
              max={40}
              value={termYears}
              onChange={(e) => setTermYears(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 font-mono-figure text-charcoal"
            />
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
          <div className="rounded-sm border border-ink-navy bg-white/50 p-5">
            <p className="font-display text-lg text-ink-navy">{comparison.summary}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
                  Sydney path (today)
                </p>
                <p className="mt-1 font-display text-xl text-charcoal/70">
                  -{formatMoney(comparison.sydneyWeeklyRent)}/week
                </p>
                <p className="mt-2 text-xs leading-relaxed text-charcoal/60">
                  {comparison.sydneyNarrative}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
                  Regional path (today)
                </p>
                <p
                  className={`mt-1 font-display text-xl ${
                    comparison.regionalNetWeeklyCashFlow >= 0 ? "text-deep-forest" : "text-charcoal/70"
                  }`}
                >
                  {comparison.regionalNetWeeklyCashFlow >= 0 ? "+" : "-"}
                  {formatMoney(Math.abs(comparison.regionalNetWeeklyCashFlow))}/week
                </p>
                <p className="mt-2 text-xs leading-relaxed text-charcoal/60">
                  {comparison.regionalNarrative}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-faded-rule pt-4">
              <p className="text-xs text-charcoal/50">
                <strong>Assumptions:</strong> {ratePct}% mortgage rate over a {termYears}-year term,{" "}
                {depositPct}% deposit, plus estimated NSW transfer duty. This is a today-only cash-flow
                comparison — it does not project future price growth, rent growth, or equity. Results are
                illustrative, not advice; confirm actual figures with a licensed lender or adviser.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
