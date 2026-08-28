"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { rankTowns } from "@/lib/rankTowns";
import { FREE_COUNT, type LedgerRow, type ShortlistResult } from "./types";

async function isUnlocked(userId: string): Promise<boolean> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return user.privateMetadata?.unlocked === true;
}

function readSavedTownIds(metadata: Record<string, unknown> | undefined): string[] {
  const raw = metadata?.savedTownIds;
  return Array.isArray(raw) ? raw.filter((id): id is string => typeof id === "string") : [];
}

export async function getSavedTownIds(): Promise<string[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return readSavedTownIds(user.privateMetadata);
}

export async function toggleSavedTown(townId: string): Promise<string[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated.");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const current = readSavedTownIds(user.privateMetadata);
  const next = current.includes(townId)
    ? current.filter((id) => id !== townId)
    : [...current, townId];

  await client.users.updateUserMetadata(userId, { privateMetadata: { savedTownIds: next } });
  return next;
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

  const rows: LedgerRow[] = ranked.map(({ rank, town, valueScore }) => {
    const visible = unlocked || rank <= FREE_COUNT;
    if (!visible) {
      return { locked: true, rank };
    }
    return {
      locked: false,
      rank,
      valueScore,
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
