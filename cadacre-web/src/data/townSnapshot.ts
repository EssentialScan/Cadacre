import generated from "./generated/townSnapshot.json";
import type { HazardLevel } from "./towns";

export type TownSnapshotEntry = {
  townId: string;
  name: string;
  rank: number | null;
  valueScore: number | null;
  bushfireLevel: HazardLevel | null;
  floodLevel: HazardLevel | null;
  infrastructureProjectTexts: string[];
};

export type TownSnapshot = {
  asOf: string;
  referenceInput: { budget: number; targetYieldPct: number };
  entries: TownSnapshotEntry[];
};

const snapshot = generated as TownSnapshot;

export function getSnapshotAsOf(): string {
  return snapshot.asOf;
}

export function getSnapshotReferenceInput(): TownSnapshot["referenceInput"] {
  return snapshot.referenceInput;
}

export function findSnapshotEntry(townId: string): TownSnapshotEntry | undefined {
  return snapshot.entries.find((entry) => entry.townId === townId);
}
