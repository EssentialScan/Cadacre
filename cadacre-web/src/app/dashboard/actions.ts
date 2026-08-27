"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { rankTowns } from "@/lib/rankTowns";
import { FREE_COUNT, type LedgerRow, type ShortlistResult } from "./types";

async function isUnlocked(userId: string): Promise<boolean> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return user.privateMetadata?.unlocked === true;
}

export async function getShortlist(input: {
  budget: number;
  targetYieldPct: number;
}): Promise<ShortlistResult> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated.");
  }

  const budget = Number(input.budget);
  const targetYieldPct = Number(input.targetYieldPct);

  if (!Number.isFinite(budget) || budget <= 0) {
    throw new Error("Enter a budget greater than $0.");
  }
  if (!Number.isFinite(targetYieldPct) || targetYieldPct < 0 || targetYieldPct > 20) {
    throw new Error("Enter a target yield between 0% and 20%.");
  }

  const ranked = rankTowns({ budget, targetYieldPct });
  const unlocked = await isUnlocked(userId);

  const rows: LedgerRow[] = ranked.map(({ rank, town }) => {
    const visible = unlocked || rank <= FREE_COUNT;
    if (!visible) {
      return { locked: true, rank };
    }
    return {
      locked: false,
      rank,
      town: town.name,
      state: town.state,
      medianPrice: town.medianPrice.value,
      grossYieldPct: town.grossYieldPct.value,
      vacancyRatePct: town.vacancyRatePct.value,
      bushfireRisk: town.bushfireRisk,
      floodRisk: town.floodRisk,
    };
  });

  return {
    input: { budget, targetYieldPct },
    totalMatches: ranked.length,
    freeCount: FREE_COUNT,
    unlocked,
    rows,
  };
}
