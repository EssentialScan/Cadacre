import type { HazardFlag, InfrastructureProject } from "@/data/towns";
import type { RankWeights } from "@/lib/rankTowns";

export const FREE_COUNT = 3;

export type LedgerRow =
  | {
      locked: false;
      rank: number;
      valueScore: number;
      town: string;
      state: string;
      medianPrice: number | null;
      medianRent: number | null;
      grossYieldPct: number | null;
      vacancyRatePct: number | null;
      bushfireRisk: HazardFlag;
      floodRisk: HazardFlag;
      infrastructureProjects: InfrastructureProject[];
    }
  | { locked: true; rank: number };

export type ShortlistResult = {
  input: { budget: number; targetYieldPct: number; weights?: RankWeights };
  totalMatches: number;
  freeCount: number;
  subscribed: boolean;
  rows: LedgerRow[];
};

// User-entered, not town-linked — the user's own numbers, so no
// fabricated-data concern (subscriber-only feature, see src/app/portfolio).
export type PortfolioProperty = {
  id: string;
  nickname: string;
  pricePaid: number;
  purchaseDate: string;
  weeklyRent: number;
};

// Subscriber-only "since your last visit" rent-tracker baseline (see
// RentVsRentvestTool.tsx) — no email is sent, this is purely an in-app
// diff against the last time the user saved a baseline for a suburb.
export type RentTrackerBaseline = {
  suburbId: string;
  suburbName: string;
  asOf: string;
  affordablePrice: number;
  matchedTownIds: string[];
};
