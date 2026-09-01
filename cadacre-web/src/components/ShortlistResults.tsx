import type { ShortlistResult, LedgerRow } from "@/app/dashboard/types";
import { HazardIcons } from "@/components/HazardIcons";
import { TownMapToggle } from "@/components/TownMapToggle";
import { SensitivityExplorer } from "@/components/SensitivityExplorer";
import {
  buildDecisionSummary,
  getTownDecisionNarrative,
  getTownDecisionSensitivity,
  getTownDecisionTag,
} from "@/lib/rankTowns";

// Single subscription Payment Link (retired the separate one-time $39 link,
// AGENTS.md §2, 2026-08-30).
const STRIPE_PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL;

function money(value: number | null): string {
  if (value === null) return "unavailable";
  return `$${value.toLocaleString("en-AU")}`;
}

function pct(value: number | null): string {
  if (value === null) return "unavailable";
  return `${value.toFixed(1)}%`;
}

function buildStrategyMemo(input: { budget: number; targetYieldPct: number }, totalMatches: number, topTown: string | null): string {
  const weeklyRent = input.budget * 0.004; // Rough 0.4% annual / 52 weeks
  const monthlyRent = weeklyRent * 4.3;

  let strategy = "";

  if (input.targetYieldPct >= 6) {
    strategy = `Your strategy is yield-led: you're targeting a gross yield of at least ${input.targetYieldPct}% at a ${money(input.budget)} price point. This suggests you want strong cash flow to cover a mortgage or build equity quickly.`;
  } else if (input.targetYieldPct >= 4.5) {
    strategy = `Your strategy balances affordability and yield: ${money(input.budget)} budget, ${input.targetYieldPct}% gross yield minimum. You're looking for a realistic monthly cash flow without sacrificing too much upside.`;
  } else {
    strategy = `Your strategy is budget-first: ${money(input.budget)} is your ceiling, with ${input.targetYieldPct}% yield as a secondary filter. You're prioritizing getting into the market at a sustainable price.`;
  }

  let outcome = "";
  if (totalMatches > 5) {
    outcome = `${totalMatches} towns matched — you have plenty of options. The decision is less about "do any exist?" and more about which fits your lifestyle and risk tolerance best.`;
  } else if (totalMatches > 1) {
    outcome = `${totalMatches} towns matched — a solid shortlist. Each one represents a different risk/reward trade-off; review the narratives below to understand which assumptions matter most for you.`;
  } else if (totalMatches === 1) {
    outcome = `Only ${topTown} matched — your criteria are tight. This town is the only one on the public record that fits both your budget and yield target. That's either a strong signal or a sign that your assumptions need adjustment.`;
  }

  return `${strategy} ${outcome}`;
}

export function ShortlistResults({
  result,
  clerkUserId,
}: {
  result: ShortlistResult;
  clerkUserId: string;
}) {
  const { rows, totalMatches, freeCount, subscribed, input } = result;
  const lockedCount = Math.max(totalMatches - freeCount, 0);
  const hasLocked = !subscribed && lockedCount > 0;
  const unlockedRows = rows.filter((r) => !r.locked);
  const topTown = unlockedRows.length > 0 ? unlockedRows[0].town : null;
  const strategyMemo = buildStrategyMemo(input, totalMatches, topTown);

  if (totalMatches === 0) {
    return (
      <div className="mt-8 rounded-sm border border-faded-rule bg-white/40 p-6 text-sm text-charcoal/70">
        No towns in the current record match a budget of {money(input.budget)}{" "}
        at a {pct(input.targetYieldPct)} target yield. Try a higher budget or
        a lower target yield.
      </div>
    );
  }

  const unlockUrl = STRIPE_PAYMENT_LINK
    ? `${STRIPE_PAYMENT_LINK}?client_reference_id=${encodeURIComponent(clerkUserId)}`
    : undefined;

  const reportUrl = `/api/report?budget=${input.budget}&yield=${input.targetYieldPct}`;
  const csvParams = new URLSearchParams({
    budget: String(input.budget),
    yield: String(input.targetYieldPct),
  });
  if (input.weights) {
    csvParams.set("weightAffordability", String(input.weights.affordability));
    csvParams.set("weightYield", String(input.weights.yield));
    csvParams.set("weightVacancy", String(input.weights.vacancy));
  }
  const csvUrl = `/api/export/shortlist?${csvParams.toString()}`;

  const summary = buildDecisionSummary(
    rows
      .filter((row) => !row.locked)
      .map((row) => ({
        town: row.town,
        medianPrice: row.medianPrice,
        medianRent: row.medianRent,
        grossYieldPct: row.grossYieldPct,
        vacancyRatePct: row.vacancyRatePct,
        bushfireRisk: row.bushfireRisk,
        floodRisk: row.floodRisk,
        infrastructureProjects: row.infrastructureProjects,
      }))
  );

  return (
    <div className="mt-8">
      <div className="rounded-sm border-l-4 border-survey-brass bg-blue-50/30 p-5">
        <h2 className="font-display text-lg text-ink-navy">Your shortlist strategy</h2>
        <p className="mt-3 leading-relaxed text-charcoal/80">{strategyMemo}</p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          { label: "Best fit", value: summary.bestFit, note: summary.bestFitReason },
          { label: "Risk-adjusted fit", value: summary.riskAdjusted, note: summary.riskAdjustedReason },
          { label: "Watch closely", value: summary.caution, note: summary.cautionReason },
        ].map((entry) => (
          <div
            key={entry.label}
            className="rounded-sm border border-faded-rule bg-white/60 p-4"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
              {entry.label}
            </p>
            <p className="mt-2 font-display text-lg text-ink-navy">
              {entry.value ?? "—"}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-charcoal/70">{entry.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-sm border border-faded-rule">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[1fr_repeat(4,minmax(0,0.7fr))_minmax(0,0.55fr)] gap-2 border-b border-ink-navy bg-ink-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-parchment">
            <span>Town</span>
            <span>Median price</span>
            <span>Gross yield</span>
            <span>Vacancy rate</span>
            <span>Value signal</span>
            <span>Hazards</span>
          </div>

          {rows.map((row) => (
            <div
              key={row.rank}
              className={`ledger-row grid grid-cols-[1fr_repeat(4,minmax(0,0.7fr))_minmax(0,0.55fr)] items-center gap-2 px-5 py-4 ${
                row.locked ? "text-charcoal/30" : "text-charcoal"
              }`}
            >
              {row.locked ? (
                <>
                  <span className="flex items-center gap-2">
                    <span className="font-mono-figure text-xs">
                      {String(row.rank).padStart(2, "0")}
                    </span>
                    Locked
                  </span>
                  <span className="font-mono-figure text-sm">—</span>
                  <span className="font-mono-figure text-sm">—</span>
                  <span className="font-mono-figure text-sm">—</span>
                  <span className="font-mono-figure text-sm">—</span>
                  <span className="font-mono-figure text-sm">—</span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-2 font-medium text-ink-navy">
                    <span className="font-mono-figure text-xs text-survey-brass">
                      {String(row.rank).padStart(2, "0")}
                    </span>
                    <span className="flex flex-col">
                      <span className="flex items-center gap-2">
                        {row.town}, {row.state}
                        <TownMapToggle town={row.town} state={row.state} />
                      </span>
                      {(() => {
                        const snapshot = {
                          town: row.town,
                          medianPrice: row.medianPrice,
                          medianRent: row.medianRent,
                          grossYieldPct: row.grossYieldPct,
                          vacancyRatePct: row.vacancyRatePct,
                          bushfireRisk: row.bushfireRisk,
                          floodRisk: row.floodRisk,
                          infrastructureProjects: row.infrastructureProjects,
                        };
                        const tag = getTownDecisionTag(snapshot);
                        const narrative = getTownDecisionNarrative(snapshot);
                        const sensitivity = getTownDecisionSensitivity(snapshot);
                        const tagLabel =
                          tag === "yield-heavy"
                            ? "yield-heavy"
                            : tag === "budget-led"
                              ? "budget-led"
                              : tag === "balanced"
                                ? "balanced"
                                : "needs review";

                        return (
                          <>
                            <span className="mt-1 text-[10px] uppercase tracking-[0.14em] text-charcoal/60">
                              {tagLabel}
                            </span>
                            <span className="mt-1 max-w-[26rem] text-[10px] leading-relaxed text-charcoal/55">
                              {narrative}
                            </span>
                            <span className="mt-2 max-w-[26rem] text-[9px] leading-relaxed text-charcoal/45 italic">
                              {sensitivity.primary} If yield tightens, {sensitivity.ifYieldTightens.toLowerCase()}
                            </span>
                          </>
                        );
                      })()}
                    </span>
                  </span>
                  <span
                    className={
                      row.medianPrice === null
                        ? "text-xs text-charcoal/50"
                        : "font-mono-figure text-sm"
                    }
                  >
                    {money(row.medianPrice)}
                  </span>
                  <span
                    className={
                      row.grossYieldPct === null
                        ? "text-xs text-charcoal/50"
                        : "font-mono-figure text-sm"
                    }
                  >
                    {pct(row.grossYieldPct)}
                  </span>
                  <span
                    className={
                      row.vacancyRatePct === null
                        ? "text-xs text-charcoal/50"
                        : "font-mono-figure text-sm"
                    }
                  >
                    {pct(row.vacancyRatePct)}
                  </span>
                  <span className="font-mono-figure text-sm text-deep-forest">
                    {row.valueScore}/100
                  </span>
                  <HazardIcons
                    bushfireRisk={row.bushfireRisk}
                    floodRisk={row.floodRisk}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-charcoal/50">
        {totalMatches} town{totalMatches === 1 ? "" : "s"} in the current
        record match your criteria.
        {hasLocked &&
          ` The first ${freeCount} are shown in full; ${lockedCount} more are locked.`}
      </p>
      <p className="mt-1 text-xs text-charcoal/50">
        Value signal is a relative screening measure across this record: lower
        price, stronger gross yield, and lower vacancy score higher. It is not
        an appraisal, prediction, or investment recommendation.
      </p>
      <p className="mt-1 text-xs text-charcoal/50">
        Bushfire/flood icons are a town-level indicator only (source: state
        emergency services) — always verify the exact address separately
        before acting. The map pin opens Google Maps, where you can look up
        a specific property yourself; Cadacre&apos;s own ranking stays
        town-level.
      </p>

      {hasLocked && (
        <div className="mt-6 flex flex-col items-start gap-3 rounded-sm border border-ink-navy bg-white/50 p-5">
          <p className="text-sm text-charcoal/80">
            Subscribe to unlock the full ranked list, a downloadable PDF report, CSV export,
            custom ranking weights, and every other Cadacre tool.
          </p>
          {unlockUrl ? (
            <a
              href={unlockUrl}
              className="rounded-sm bg-survey-brass px-5 py-2.5 text-sm font-semibold text-ink-navy transition hover:bg-survey-brass/90"
            >
              Subscribe to Cadacre
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="Payments not yet configured"
              className="cursor-not-allowed rounded-sm bg-ink-navy/40 px-5 py-2.5 text-sm font-semibold text-parchment"
            >
              Payments not yet configured
            </button>
          )}
        </div>
      )}

      {subscribed && (
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={reportUrl}
            className="inline-block rounded-sm bg-deep-forest px-5 py-2.5 text-sm font-semibold text-parchment transition hover:bg-deep-forest/90"
          >
            Download PDF report
          </a>
          <a
            href={csvUrl}
            className="inline-block rounded-sm border border-deep-forest px-5 py-2.5 text-sm font-semibold text-deep-forest transition hover:bg-deep-forest/10"
          >
            Download CSV
          </a>
        </div>
      )}

      {subscribed && (
        <div className="mt-14 space-y-4 border-t border-faded-rule pt-10">
          <SensitivityExplorer
            towns={rows.filter((r): r is Extract<LedgerRow, { locked: false }> => !r.locked)}
            initialBudget={input.budget}
            initialYield={input.targetYieldPct}
          />
        </div>
      )}
    </div>
  );
}
