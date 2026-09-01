"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Town } from "@/data/towns";
import {
  RBA_INVESTOR_VARIABLE_RATE,
  computeCashFlowEstimate,
  formatMoney,
} from "@/lib/investmentMath";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Cadacre subscriber feature — a same-day, multi-town cash-flow comparison across
// a user's saved towns. Deliberately no appreciation/breakeven-year
// projection: that would require speculative future price data, which
// AGENTS.md prohibits fabricating. This stays an honest today-only
// comparison, same math as InvestmentCalculator.tsx (computeCashFlowEstimate).
export function ScenarioSimulator({
  towns,
  open,
  onClose,
}: {
  towns: Town[];
  open: boolean;
  onClose: () => void;
}) {
  const [depositPct, setDepositPct] = useState(20);
  const [ratePct, setRatePct] = useState(RBA_INVESTOR_VARIABLE_RATE.ratePct);
  const [termYears, setTermYears] = useState(30);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) return null;

  const comparable = towns.filter(
    (t) => t.medianPrice.value !== null && t.medianRent.value !== null
  );

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[9999] flex items-end justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <motion.div
            role="dialog"
            aria-label="Scenario simulator"
            className="pointer-events-auto max-h-[70vh] w-full max-w-3xl overflow-y-auto rounded-sm border border-faded-rule bg-parchment shadow-[0_-20px_60px_-25px_rgba(18,22,28,0.5)]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="h-1 w-full bg-survey-brass" aria-hidden />
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="font-mono-figure text-xs uppercase tracking-[0.2em] text-survey-brass">
                  Scenario simulator
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-7 w-7 items-center justify-center rounded-sm border border-faded-rule text-charcoal/60 transition hover:border-ink-navy hover:text-ink-navy"
                >
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
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

              {comparable.length === 0 ? (
                <p className="mt-6 text-sm text-charcoal/60">
                  Save a few towns from the map (star icon in the town detail panel) to compare
                  them here.
                </p>
              ) : (
                <div className="mt-5 overflow-x-auto">
                  <div className="min-w-140 rounded-sm border border-faded-rule">
                    <div className="grid grid-cols-[1.2fr_repeat(4,minmax(0,0.8fr))] gap-2 border-b border-ink-navy bg-ink-navy px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-parchment">
                      <span>Town</span>
                      <span>Median price</span>
                      <span>Weekly repayment</span>
                      <span>Stamp duty</span>
                      <span>Net weekly cash flow</span>
                    </div>
                    {comparable.map((town) => {
                      const cashFlow = computeCashFlowEstimate({
                        price: town.medianPrice.value as number,
                        rent: town.medianRent.value as number,
                        depositPct,
                        ratePct,
                        termYears,
                      });
                      return (
                        <div
                          key={town.id}
                          className="grid grid-cols-[1.2fr_repeat(4,minmax(0,0.8fr))] items-center gap-2 border-b border-faded-rule px-4 py-3 last:border-b-0"
                        >
                          <span className="font-medium text-ink-navy">{town.name}, {town.state}</span>
                          <span className="font-mono-figure text-sm">{formatMoney(town.medianPrice.value as number)}</span>
                          <span className="font-mono-figure text-sm">{formatMoney(cashFlow.weeklyRepayment)}</span>
                          <span className="font-mono-figure text-sm">{formatMoney(cashFlow.stampDuty)}</span>
                          <span
                            className={`font-mono-figure text-sm font-semibold ${
                              cashFlow.netWeeklyCashFlow >= 0 ? "text-deep-forest" : "text-red-700"
                            }`}
                          >
                            {cashFlow.netWeeklyCashFlow >= 0 ? "+" : ""}
                            {formatMoney(cashFlow.netWeeklyCashFlow)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <p className="mt-4 text-[11px] leading-relaxed text-charcoal/50">
                Illustrative estimates from your inputs and published NSW transfer-duty rates —
                not a loan quote, pre-approval, or financial advice. Ignores LMI, ongoing costs,
                and tax, and does not project future price growth. Confirm actual figures with a
                licensed lender or adviser before acting.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
