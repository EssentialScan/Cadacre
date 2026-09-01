import type { Town } from "@/data/towns";
import { findSnapshotEntry, getSnapshotReferenceInput } from "@/data/townSnapshot";
import { rankTowns } from "@/lib/rankTowns";
import { getAllTowns } from "@/data";

export type TownDrift = {
  rankChanged: { from: number | null; to: number | null } | null;
  bushfireChanged: { from: string | null; to: string | null } | null;
  floodChanged: { from: string | null; to: string | null } | null;
  newInfrastructureProjects: string[];
};

// Computes what's changed for a town since the last checked-in snapshot
// (scripts/generate-town-snapshot.ts). Pro-only surface (TownDriftPanel).
// `null → level` and `level → null` both count as real changes, not "no
// change" — a town going from "not mapped" to a real hazard rating is
// exactly the kind of update this feature exists to surface.
export function computeTownDrift(town: Town): TownDrift {
  const entry = findSnapshotEntry(town.id);
  if (!entry) {
    return {
      rankChanged: null,
      bushfireChanged: null,
      floodChanged: null,
      newInfrastructureProjects: [],
    };
  }

  const referenceInput = getSnapshotReferenceInput();
  const currentRanked = rankTowns(referenceInput, getAllTowns());
  const currentEntry = currentRanked.find((r) => r.town.id === town.id);
  const currentRank = currentEntry?.rank ?? null;

  const rankChanged = currentRank !== entry.rank ? { from: entry.rank, to: currentRank } : null;
  const bushfireChanged =
    town.bushfireRisk.level !== entry.bushfireLevel
      ? { from: entry.bushfireLevel, to: town.bushfireRisk.level }
      : null;
  const floodChanged =
    town.floodRisk.level !== entry.floodLevel
      ? { from: entry.floodLevel, to: town.floodRisk.level }
      : null;
  const newInfrastructureProjects = town.infrastructureProjects
    .map((p) => p.text)
    .filter((text) => !entry.infrastructureProjectTexts.includes(text));

  return { rankChanged, bushfireChanged, floodChanged, newInfrastructureProjects };
}

export function hasAnyDrift(drift: TownDrift): boolean {
  return (
    drift.rankChanged !== null ||
    drift.bushfireChanged !== null ||
    drift.floodChanged !== null ||
    drift.newInfrastructureProjects.length > 0
  );
}
