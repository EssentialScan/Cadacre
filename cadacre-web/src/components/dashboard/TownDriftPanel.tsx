"use client";

import { useMemo } from "react";
import type { Town } from "@/data/towns";
import { computeTownDrift, hasAnyDrift } from "@/lib/townDrift";
import { getSnapshotAsOf } from "@/data/townSnapshot";

// Cadacre subscriber feature — shows what changed for this town since the last
// checked-in record snapshot (scripts/generate-town-snapshot.ts). Renders
// nothing when there's no real change, to avoid noise. A free, ungated
// "record last updated {asOf}" line can live elsewhere (freshness signal);
// this itemized diff detail is the Pro-gated part.
export function TownDriftPanel({ town }: { town: Town }) {
  // computeTownDrift re-ranks the whole curated town list — memoize on
  // town.id so it only re-runs when the selected town changes, not on
  // every re-render of the co-mounted drawer (e.g. typing in
  // InvestmentCalculator's inputs).
  const drift = useMemo(() => computeTownDrift(town), [town]);
  if (!hasAnyDrift(drift)) return null;

  const asOf = getSnapshotAsOf();

  return (
    <div className="mt-6 border border-survey-brass/40 bg-survey-brass/5">
      <div className="border-b border-survey-brass/40 px-4 py-3">
        <span className="font-display text-sm font-semibold text-ink-navy">
          Since the {asOf} record <span className="text-charcoal/40">(Subscriber)</span>
        </span>
      </div>
      <ul className="space-y-2 p-4 text-sm leading-relaxed text-charcoal/75">
        {drift.rankChanged && (
          <li>
            Rank at this record&apos;s reference budget/yield moved from{" "}
            {drift.rankChanged.from ?? "unranked"} to {drift.rankChanged.to ?? "unranked"}.
          </li>
        )}
        {drift.bushfireChanged && (
          <li>
            Bushfire risk changed from {drift.bushfireChanged.from ?? "not mapped"} to{" "}
            {drift.bushfireChanged.to ?? "not mapped"}.
          </li>
        )}
        {drift.floodChanged && (
          <li>
            Flood risk changed from {drift.floodChanged.from ?? "not mapped"} to{" "}
            {drift.floodChanged.to ?? "not mapped"}.
          </li>
        )}
        {drift.newInfrastructureProjects.map((text, i) => (
          <li key={i}>New infrastructure project on file: {text}</li>
        ))}
      </ul>
    </div>
  );
}
