import type { ShortlistResult } from "@/app/dashboard/types";
import { HazardIcons } from "@/components/HazardIcons";
import { TownMapToggle } from "@/components/TownMapToggle";

const STRIPE_PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL;

function money(value: number | null): string {
  if (value === null) return "unavailable";
  return `$${value.toLocaleString("en-AU")}`;
}

function pct(value: number | null): string {
  if (value === null) return "unavailable";
  return `${value.toFixed(1)}%`;
}

export function ShortlistResults({
  result,
  clerkUserId,
}: {
  result: ShortlistResult;
  clerkUserId: string;
}) {
  const { rows, totalMatches, freeCount, unlocked, input } = result;
  const lockedCount = Math.max(totalMatches - freeCount, 0);
  const hasLocked = !unlocked && lockedCount > 0;

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

  return (
    <div className="mt-8">
      <div className="rounded-sm border border-faded-rule">
        <div className="grid grid-cols-[1fr_repeat(3,minmax(0,0.7fr))_minmax(0,0.55fr)] gap-2 border-b border-ink-navy bg-ink-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-parchment">
          <span>Town</span>
          <span>Median price</span>
          <span>Gross yield</span>
          <span>Vacancy rate</span>
          <span>Hazards</span>
        </div>

        {rows.map((row) => (
          <div
            key={row.rank}
            className={`ledger-row grid grid-cols-[1fr_repeat(3,minmax(0,0.7fr))_minmax(0,0.55fr)] items-center gap-2 px-5 py-4 ${
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
              </>
            ) : (
              <>
                <span className="flex items-center gap-2 font-medium text-ink-navy">
                  <span className="font-mono-figure text-xs text-survey-brass">
                    {String(row.rank).padStart(2, "0")}
                  </span>
                  {row.town}, {row.state}
                  <TownMapToggle town={row.town} state={row.state} />
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
                <HazardIcons
                  bushfireRisk={row.bushfireRisk}
                  floodRisk={row.floodRisk}
                />
              </>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-charcoal/50">
        {totalMatches} town{totalMatches === 1 ? "" : "s"} in the current
        record match your criteria.
        {hasLocked &&
          ` The first ${freeCount} are shown in full; ${lockedCount} more are locked.`}
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
            Unlock the full ranked list and a downloadable PDF report for a
            one-time $39.
          </p>
          {unlockUrl ? (
            <a
              href={unlockUrl}
              className="rounded-sm bg-survey-brass px-5 py-2.5 text-sm font-semibold text-ink-navy transition hover:bg-survey-brass/90"
            >
              Unlock full report — $39 one-time
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

      {unlocked && (
        <div className="mt-6">
          <a
            href={reportUrl}
            className="inline-block rounded-sm bg-deep-forest px-5 py-2.5 text-sm font-semibold text-parchment transition hover:bg-deep-forest/90"
          >
            Download PDF report
          </a>
        </div>
      )}
    </div>
  );
}
