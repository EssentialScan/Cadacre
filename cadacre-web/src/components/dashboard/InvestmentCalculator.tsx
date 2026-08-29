"use client";

import { useState } from "react";
import { RBA_INVESTOR_VARIABLE_RATE, computeCashFlowEstimate, formatMoney as money } from "@/lib/investmentMath";

export function InvestmentCalculator({
  medianPrice,
  medianRent,
}: {
  medianPrice: number;
  medianRent: number;
}) {
  const [open, setOpen] = useState(false);
  const [depositPct, setDepositPct] = useState(20);
  const [ratePct, setRatePct] = useState(RBA_INVESTOR_VARIABLE_RATE.ratePct);
  const [termYears, setTermYears] = useState(30);

  const { weeklyRepayment, stampDuty, upfrontCost, netWeeklyCashFlow } = computeCashFlowEstimate({
    price: medianPrice,
    rent: medianRent,
    depositPct,
    ratePct,
    termYears,
  });

  return (
    <div className="mt-6 border border-faded-rule">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-display text-sm font-semibold text-ink-navy">Cash flow estimate</span>
        <svg
          viewBox="0 0 16 16"
          className={`h-3 w-3 text-charcoal/50 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-faded-rule p-4">
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1">
              <span className="font-mono-figure text-[9px] uppercase tracking-[0.14em] text-charcoal/45">Deposit %</span>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={depositPct}
                onChange={(e) => setDepositPct(Number(e.target.value))}
                className="rounded-sm border border-faded-rule bg-white px-2 py-1.5 font-mono-figure text-xs text-ink-navy outline-none focus:border-survey-brass"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-mono-figure text-[9px] uppercase tracking-[0.14em] text-charcoal/45">Rate %</span>
              <input
                type="number"
                min={0}
                max={20}
                step={0.1}
                value={ratePct}
                onChange={(e) => setRatePct(Number(e.target.value))}
                className="rounded-sm border border-faded-rule bg-white px-2 py-1.5 font-mono-figure text-xs text-ink-navy outline-none focus:border-survey-brass"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-mono-figure text-[9px] uppercase tracking-[0.14em] text-charcoal/45">Term (yrs)</span>
              <input
                type="number"
                min={1}
                max={40}
                step={1}
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="rounded-sm border border-faded-rule bg-white px-2 py-1.5 font-mono-figure text-xs text-ink-navy outline-none focus:border-survey-brass"
              />
            </label>
          </div>

          <div className="mt-4 divide-y divide-faded-rule border-y border-faded-rule">
            <div className="flex items-baseline justify-between py-2.5">
              <span className="text-sm text-charcoal/70">Est. weekly repayment</span>
              <span className="font-mono-figure text-sm text-ink-navy">{money(weeklyRepayment)}</span>
            </div>
            <div className="flex items-baseline justify-between py-2.5">
              <span className="text-sm text-charcoal/70">Est. NSW stamp duty</span>
              <span className="font-mono-figure text-sm text-ink-navy">{money(stampDuty)}</span>
            </div>
            <div className="flex items-baseline justify-between py-2.5">
              <span className="text-sm text-charcoal/70">Est. upfront cost (deposit + duty)</span>
              <span className="font-mono-figure text-sm text-ink-navy">{money(upfrontCost)}</span>
            </div>
            <div className="flex items-baseline justify-between py-2.5">
              <span className="text-sm font-medium text-charcoal/80">Net weekly cash flow</span>
              <span
                className={`font-mono-figure text-sm font-semibold ${
                  netWeeklyCashFlow >= 0 ? "text-deep-forest" : "text-red-700"
                }`}
              >
                {netWeeklyCashFlow >= 0 ? "+" : ""}
                {money(netWeeklyCashFlow)}
              </span>
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-charcoal/50">
            Rate pre-filled from the average investor variable rate banks were
            offering as of {RBA_INVESTOR_VARIABLE_RATE.asOf} (source: RBA Table
            F5) — actual rates vary by lender and borrower. Illustrative
            estimate from your inputs and published NSW transfer-duty rates —
            not a loan quote, pre-approval, or financial advice. Ignores LMI,
            ongoing costs (rates, strata, maintenance, insurance, agent fees),
            and tax. Confirm actual figures with a licensed lender or adviser
            before acting.
          </p>
        </div>
      )}
    </div>
  );
}
