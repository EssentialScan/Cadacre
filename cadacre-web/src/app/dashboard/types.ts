import type { HazardFlag } from "@/data/towns";

export const FREE_COUNT = 3;

export type LedgerRow =
  | {
      locked: false;
      rank: number;
      valueScore: number;
      town: string;
      state: string;
      medianPrice: number | null;
      grossYieldPct: number | null;
      vacancyRatePct: number | null;
      bushfireRisk: HazardFlag;
      floodRisk: HazardFlag;
    }
  | { locked: true; rank: number };

export type ShortlistResult = {
  input: { budget: number; targetYieldPct: number };
  totalMatches: number;
  freeCount: number;
  unlocked: boolean;
  rows: LedgerRow[];
};
