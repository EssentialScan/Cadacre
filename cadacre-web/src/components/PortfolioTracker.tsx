"use client";

import { useState, useTransition } from "react";
import {
  addPortfolioProperty,
  removePortfolioProperty,
} from "@/app/dashboard/actions";
import type { PortfolioProperty } from "@/app/dashboard/types";
import { estimateWeeklyRepayment, formatMoney, RBA_INVESTOR_VARIABLE_RATE } from "@/lib/investmentMath";

export function PortfolioTracker({
  initialProperties,
}: {
  initialProperties: PortfolioProperty[];
}) {
  const [properties, setProperties] = useState(initialProperties);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd(formData: FormData) {
    setError(null);
    const input = {
      nickname: String(formData.get("nickname") ?? ""),
      pricePaid: Number(formData.get("pricePaid")),
      purchaseDate: String(formData.get("purchaseDate") ?? ""),
      weeklyRent: Number(formData.get("weeklyRent")),
    };
    startTransition(async () => {
      try {
        const next = await addPortfolioProperty(input);
        setProperties(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function handleRemove(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        const next = await removePortfolioProperty(id);
        setProperties(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  const totalWeeklyRent = properties.reduce((sum, p) => sum + p.weeklyRent, 0);
  const totalWeeklyRepayment = properties.reduce(
    (sum, p) =>
      sum +
      estimateWeeklyRepayment({
        price: p.pricePaid,
        depositPct: 20,
        ratePct: RBA_INVESTOR_VARIABLE_RATE.ratePct,
        termYears: 30,
      }),
    0
  );

  return (
    <div>
      <form
        action={handleAdd}
        className="grid grid-cols-1 gap-4 rounded-sm border border-faded-rule bg-white/50 p-6 sm:grid-cols-2"
      >
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-ink-navy">
            Nickname
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            required
            placeholder="e.g. Orange investment"
            className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-4 py-2 text-sm outline-none focus:border-ink-navy"
          />
        </div>
        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-ink-navy">
            Purchase date
          </label>
          <input
            id="purchaseDate"
            name="purchaseDate"
            type="date"
            required
            className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-4 py-2 font-mono-figure text-sm outline-none focus:border-ink-navy"
          />
        </div>
        <div>
          <label htmlFor="pricePaid" className="block text-sm font-medium text-ink-navy">
            Price paid (AUD)
          </label>
          <input
            id="pricePaid"
            name="pricePaid"
            type="number"
            min={0}
            step={1000}
            required
            className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-4 py-2 font-mono-figure text-sm outline-none focus:border-ink-navy"
          />
        </div>
        <div>
          <label htmlFor="weeklyRent" className="block text-sm font-medium text-ink-navy">
            Weekly rent (AUD)
          </label>
          <input
            id="weeklyRent"
            name="weeklyRent"
            type="number"
            min={0}
            step={5}
            required
            className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-4 py-2 font-mono-figure text-sm outline-none focus:border-ink-navy"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="sm:col-span-2 rounded-sm bg-ink-navy px-6 py-3 text-sm font-semibold text-parchment transition hover:bg-ink-navy/90 disabled:cursor-not-allowed disabled:bg-ink-navy/40"
        >
          {isPending ? "Saving…" : "Add property"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      {properties.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <div className="min-w-140 rounded-sm border border-faded-rule">
            <div className="grid grid-cols-[1.2fr_repeat(3,minmax(0,0.8fr))_auto] gap-2 border-b border-ink-navy bg-ink-navy px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-parchment">
              <span>Property</span>
              <span>Price paid</span>
              <span>Weekly rent</span>
              <span>Est. weekly repayment</span>
              <span />
            </div>
            {properties.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[1.2fr_repeat(3,minmax(0,0.8fr))_auto] items-center gap-2 border-b border-faded-rule px-4 py-3 last:border-b-0"
              >
                <span className="font-medium text-ink-navy">{p.nickname}</span>
                <span className="font-mono-figure text-sm">{formatMoney(p.pricePaid)}</span>
                <span className="font-mono-figure text-sm">{formatMoney(p.weeklyRent)}</span>
                <span className="font-mono-figure text-sm">
                  {formatMoney(
                    estimateWeeklyRepayment({
                      price: p.pricePaid,
                      depositPct: 20,
                      ratePct: RBA_INVESTOR_VARIABLE_RATE.ratePct,
                      termYears: 30,
                    })
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(p.id)}
                  className="text-xs font-medium text-charcoal/50 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="grid grid-cols-[1.2fr_repeat(3,minmax(0,0.8fr))_auto] gap-2 bg-parchment px-4 py-3 font-semibold">
              <span className="text-ink-navy">Total</span>
              <span />
              <span className="font-mono-figure text-sm text-ink-navy">{formatMoney(totalWeeklyRent)}</span>
              <span className="font-mono-figure text-sm text-ink-navy">{formatMoney(totalWeeklyRepayment)}</span>
              <span />
            </div>
          </div>
        </div>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-charcoal/50">
        Estimated weekly repayment assumes a 20% deposit, {RBA_INVESTOR_VARIABLE_RATE.ratePct}%
        rate (RBA Table F5, as of {RBA_INVESTOR_VARIABLE_RATE.asOf}), 30-year term — illustrative
        only, not a loan quote or financial advice.
      </p>
    </div>
  );
}
