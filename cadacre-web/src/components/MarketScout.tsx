"use client";

import { useState } from "react";
import type { Town } from "@/data/towns";

function money(value: number | null) {
  return value === null ? "Not available" : `$${value.toLocaleString("en-AU")}`;
}

function pct(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

function searchUrl(town: Town, portal: "domain" | "realestate") {
  const query = encodeURIComponent(`${town.name} ${town.state}`);
  return portal === "domain"
    ? `https://www.domain.com.au/sale/?excludedeposittaken=1&suburb=${query}`
    : `https://www.realestate.com.au/buy/in-${query}/list-1`;
}

export function MarketScout({ towns }: { towns: Town[] }) {
  const [budget, setBudget] = useState(650000);
  const [minimumYield, setMinimumYield] = useState(4);
  const [sort, setSort] = useState<"yield" | "price">("yield");
  const results = towns
    .filter((town) => town.medianPrice.value !== null && town.medianPrice.value <= budget)
    .filter((town) => town.grossYieldPct.value === null || town.grossYieldPct.value >= minimumYield)
    .sort((a, b) => {
      if (sort === "price") {
        return (a.medianPrice.value ?? Number.MAX_SAFE_INTEGER) - (b.medianPrice.value ?? Number.MAX_SAFE_INTEGER);
      }
      return (b.grossYieldPct.value ?? -1) - (a.grossYieldPct.value ?? -1);
    });

  return (
    <div className="mt-8">
      <div className="grid gap-3 border-y border-ink-navy py-4 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-end">
        <label className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
          Maximum median
          <input
            type="range"
            min={250000}
            max={1000000}
            step={25000}
            value={budget}
            onChange={(event) => setBudget(Number(event.target.value))}
            className="mt-3 block w-full accent-survey-brass"
          />
          <span className="font-mono-figure text-ink-navy">{money(budget)}</span>
        </label>
        <label className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
          Minimum yield
          <input
            type="range"
            min={0}
            max={8}
            step={0.5}
            value={minimumYield}
            onChange={(event) => setMinimumYield(Number(event.target.value))}
            className="mt-3 block w-full accent-survey-brass"
          />
          <span className="font-mono-figure text-ink-navy">{minimumYield.toFixed(1)}%</span>
        </label>
        <label className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
          Order by
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as "yield" | "price")}
            className="mt-3 block w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 text-sm font-normal normal-case text-ink-navy"
          >
            <option value="yield">Gross yield</option>
            <option value="price">Lowest price</option>
          </select>
        </label>
        <p className="font-mono-figure text-sm text-deep-forest">{results.length} records</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {results.map((town) => (
          <article key={town.id} className="group overflow-hidden rounded-sm border border-faded-rule bg-white/50 transition hover:-translate-y-1 hover:border-survey-brass hover:shadow-[6px_6px_0_var(--faded-rule)]">
            <div className="relative flex h-32 items-end justify-between overflow-hidden bg-deep-forest p-4 text-parchment">
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(135deg,transparent_45%,var(--gold-bright)_46%,transparent_48%),linear-gradient(45deg,transparent_45%,var(--parchment)_46%,transparent_48%)] [background-size:28px_28px]" />
              <span className="relative font-mono-figure text-[10px] uppercase tracking-[0.2em] text-gold-bright">{town.state} / public record</span>
              <span className="relative font-display text-3xl">{town.name.slice(0, 1)}</span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-xl font-semibold text-ink-navy">{town.name}</h2>
                <span className="font-mono-figure text-xs text-survey-brass">{pct(town.grossYieldPct.value)} yield</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-y-3 border-y border-faded-rule py-4 text-xs">
                <span className="text-charcoal/60">Median</span><span className="text-right font-mono-figure text-ink-navy">{money(town.medianPrice.value)}</span>
                <span className="text-charcoal/60">Vacancy</span><span className="text-right font-mono-figure text-ink-navy">{pct(town.vacancyRatePct.value)}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={searchUrl(town, "domain")} target="_blank" rel="noopener noreferrer" className="rounded-sm bg-ink-navy px-3 py-2 text-xs font-semibold text-parchment transition hover:bg-deep-forest">View Domain listings ↗</a>
                <a href={searchUrl(town, "realestate")} target="_blank" rel="noopener noreferrer" className="rounded-sm border border-faded-rule px-3 py-2 text-xs font-semibold text-ink-navy transition hover:border-survey-brass">realestate.com.au ↗</a>
              </div>
            </div>
          </article>
        ))}
      </div>
      {results.length === 0 && <p className="border border-faded-rule p-8 text-center text-sm text-charcoal/60">No records match these filters. Widen the budget or lower the yield threshold.</p>}
      <p className="mt-6 text-xs leading-relaxed text-charcoal/50">
        This page filters Cadacre&apos;s sourced town records. Listing photos,
        addresses, and availability remain on the linked portals because no
        licensed real-time listings feed is connected yet.
      </p>
    </div>
  );
}