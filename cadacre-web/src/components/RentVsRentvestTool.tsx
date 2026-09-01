"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Town } from "@/data";
import { rankTowns } from "@/lib/rankTowns";
import {
  RBA_INVESTOR_VARIABLE_RATE,
  computeCashFlowEstimate,
  estimateAffordablePrice,
  formatMoney,
} from "@/lib/investmentMath";
import { getRentTrackerBaseline, saveRentTrackerBaseline } from "@/app/dashboard/actions";
import type { RentTrackerBaseline } from "@/app/dashboard/types";

function money(value: number | null): string {
  if (value === null) return "Not available";
  return formatMoney(value);
}

const DEPOSIT_PCT = 20;
const TERM_YEARS = 30;

export function RentVsRentvestTool({
  sydneySuburbs,
  regionalTowns,
  resultCount = 3,
  isSubscriber,
}: {
  sydneySuburbs: Town[];
  regionalTowns: Town[];
  resultCount?: number;
  isSubscriber?: boolean;
}) {
  const [suburbId, setSuburbId] = useState(sydneySuburbs[0]?.id ?? "");
  const [baseline, setBaseline] = useState<RentTrackerBaseline | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSubscriber) return;
    getRentTrackerBaseline()
      .then(setBaseline)
      .catch(() => {});
  }, [isSubscriber]);

  const suburb = sydneySuburbs.find((t) => t.id === suburbId) ?? null;

  const affordablePrice = useMemo(() => {
    if (!suburb || suburb.medianRent.value === null) return null;
    return estimateAffordablePrice({
      weeklyBudget: suburb.medianRent.value,
      depositPct: DEPOSIT_PCT,
      ratePct: RBA_INVESTOR_VARIABLE_RATE.ratePct,
      termYears: TERM_YEARS,
    });
  }, [suburb]);

  const matches = useMemo(() => {
    if (affordablePrice === null || affordablePrice <= 0) return [];
    return rankTowns({ budget: affordablePrice, targetYieldPct: 0 }, regionalTowns).slice(
      0,
      resultCount
    );
  }, [affordablePrice, regionalTowns, resultCount]);

  const suburbCashFlow =
    suburb && suburb.medianPrice.value !== null && suburb.medianRent.value !== null
      ? computeCashFlowEstimate({
          price: suburb.medianPrice.value,
          rent: suburb.medianRent.value,
          depositPct: DEPOSIT_PCT,
          ratePct: RBA_INVESTOR_VARIABLE_RATE.ratePct,
          termYears: TERM_YEARS,
        })
      : null;

  return (
    <div>
      <label htmlFor="suburb" className="block text-sm font-medium text-ink-navy">
        Where do you currently rent?
      </label>
      <select
        id="suburb"
        value={suburbId}
        onChange={(e) => setSuburbId(e.target.value)}
        className="mt-2 w-full max-w-sm rounded-sm border border-faded-rule bg-parchment px-4 py-2 font-mono-figure text-sm outline-none focus:border-ink-navy"
      >
        {sydneySuburbs.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}, {t.state}
          </option>
        ))}
      </select>

      {suburb && (
        <div className="mt-8 overflow-x-auto">
          <div className="min-w-140 rounded-sm border border-faded-rule bg-white/60">
            <div className="grid grid-cols-[1.1fr_repeat(4,minmax(0,0.8fr))] gap-2 border-b border-ink-navy bg-ink-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-parchment">
              <span>Where</span>
              <span>Median price</span>
              <span>Weekly rent / repayment</span>
              <span>Stamp duty</span>
              <span>Net weekly cash flow</span>
            </div>

            <div className="grid grid-cols-[1.1fr_repeat(4,minmax(0,0.8fr))] items-center gap-2 border-b border-faded-rule px-5 py-4">
              <span className="font-medium text-ink-navy">
                {suburb.name}, {suburb.state}
                <span className="ml-2 font-mono-figure text-[9px] uppercase tracking-widest text-charcoal/45">
                  Sydney Metro — renting
                </span>
              </span>
              <span className="font-mono-figure text-sm">{money(suburb.medianPrice.value)}</span>
              <span className="font-mono-figure text-sm">{money(suburb.medianRent.value)}</span>
              <span className="font-mono-figure text-sm text-charcoal/40">—</span>
              <span className="font-mono-figure text-sm text-charcoal/40">—</span>
            </div>

            {matches.length === 0 && (
              <div className="px-5 py-6 text-sm text-charcoal/60">
                {affordablePrice === null
                  ? "This suburb's weekly rent isn't available, so an equivalent purchase budget can't be estimated."
                  : "No regional town in the current record matches this budget."}
              </div>
            )}

            {matches.map(({ town, rank }) => {
              const cashFlow =
                town.medianPrice.value !== null && town.medianRent.value !== null
                  ? computeCashFlowEstimate({
                      price: town.medianPrice.value,
                      rent: town.medianRent.value,
                      depositPct: DEPOSIT_PCT,
                      ratePct: RBA_INVESTOR_VARIABLE_RATE.ratePct,
                      termYears: TERM_YEARS,
                    })
                  : null;

              return (
                <div
                  key={town.id}
                  className="ledger-row grid grid-cols-[1.1fr_repeat(4,minmax(0,0.8fr))] items-center gap-2 px-5 py-4"
                >
                  <span className="flex items-center gap-2 font-medium text-ink-navy">
                    <span className="font-mono-figure text-xs text-survey-brass">
                      {String(rank).padStart(2, "0")}
                    </span>
                    {town.name}, {town.state}
                  </span>
                  <span className="font-mono-figure text-sm">{money(town.medianPrice.value)}</span>
                  <span className="font-mono-figure text-sm">
                    {cashFlow ? money(cashFlow.weeklyRepayment) : "Not available"}
                  </span>
                  <span className="font-mono-figure text-sm">
                    {cashFlow ? money(cashFlow.stampDuty) : "Not available"}
                  </span>
                  <span
                    className={`font-mono-figure text-sm font-semibold ${
                      cashFlow && cashFlow.netWeeklyCashFlow >= 0 ? "text-deep-forest" : "text-red-700"
                    }`}
                  >
                    {cashFlow
                      ? `${cashFlow.netWeeklyCashFlow >= 0 ? "+" : ""}${money(cashFlow.netWeeklyCashFlow)}`
                      : "Not available"}
                  </span>
                </div>
              );
            })}
          </div>

          {affordablePrice !== null && affordablePrice > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <p className="font-mono-figure text-xs text-charcoal/60">
                Equivalent purchase budget from {suburb.name}&rsquo;s median rent:{" "}
                <span className="text-ink-navy">{money(affordablePrice)}</span>
              </p>
              <Link
                href={`/shortlist?budget=${Math.round(affordablePrice)}&yield=0`}
                className="rounded-sm bg-ink-navy px-4 py-2 text-sm font-medium text-parchment transition hover:bg-ink-navy/90"
              >
                See the full ranked shortlist →
              </Link>
              {isSubscriber && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setSaving(true);
                    saveRentTrackerBaseline({
                      suburbId: suburb.id,
                      suburbName: suburb.name,
                      asOf: new Date().toLocaleDateString("en-AU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }),
                      affordablePrice,
                      matchedTownIds: matches.map((m) => m.town.id),
                    })
                      .then(setBaseline)
                      .finally(() => setSaving(false));
                  }}
                  className="rounded-sm border border-deep-forest px-4 py-2 text-sm font-medium text-deep-forest transition hover:bg-deep-forest/10 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Track this (Subscriber)"}
                </button>
              )}
            </div>
          )}

          {isSubscriber && baseline && baseline.suburbId === suburb.id && affordablePrice !== null && (
            <div className="mt-4 rounded-sm border border-survey-brass/40 bg-survey-brass/5 p-4 text-sm text-charcoal/75">
              Since you tracked {baseline.suburbName} on {baseline.asOf}, the equivalent budget
              moved from {money(baseline.affordablePrice)} to {money(affordablePrice)}
              {matches.length !== baseline.matchedTownIds.length && (
                <>
                  , newly matching {Math.max(matches.length - baseline.matchedTownIds.length, 0)}{" "}
                  more regional town{Math.abs(matches.length - baseline.matchedTownIds.length) === 1 ? "" : "s"}
                </>
              )}
              .
            </div>
          )}
        </div>
      )}

      {suburbCashFlow === null && suburb && (
        <p className="mt-4 text-xs text-charcoal/50">
          {suburb.name}&rsquo;s own price or rent record isn&rsquo;t complete enough to show a cash-flow
          comparison for the suburb itself, but the regional comparison above still uses its
          available rent figure where possible.
        </p>
      )}

      <p className="mt-6 text-xs leading-relaxed text-charcoal/50">
        General information based on public data, not personalised financial or investment advice.
        Cadacre is not a licensed financial advisor, real estate agency, or lending platform.
        Repayment, stamp duty, and cash-flow figures are illustrative estimates from published NSW
        transfer-duty rates and a real RBA-reported investor variable rate (as of{" "}
        {RBA_INVESTOR_VARIABLE_RATE.asOf}, source: RBA Table F5) — they ignore LMI, ongoing costs
        (rates, strata, maintenance, insurance, agent fees), and tax, and are not a loan quote,
        pre-approval, or financial advice. Confirm actual figures with a licensed lender or adviser
        before acting.
      </p>
    </div>
  );
}
