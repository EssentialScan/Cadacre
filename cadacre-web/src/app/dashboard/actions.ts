"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { rankTowns, type RankWeights } from "@/lib/rankTowns";
import { isSubscriber } from "@/lib/entitlements";
import {
  FREE_COUNT,
  type LedgerRow,
  type ShortlistResult,
  type PortfolioProperty,
  type RentTrackerBaseline,
} from "./types";

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
  weights?: RankWeights;
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

  const subscribed = await isSubscriber(userId);
  const ranked = rankTowns({
    budget,
    targetYieldPct,
    weights: subscribed ? input.weights : undefined,
  });

  const rows: LedgerRow[] = ranked.map(({ rank, town, valueScore }) => {
    const visible = subscribed || rank <= FREE_COUNT;
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
    input: { budget, targetYieldPct, weights: subscribed ? input.weights : undefined },
    totalMatches: ranked.length,
    freeCount: FREE_COUNT,
    subscribed,
    rows,
  };
}

async function requireSubscriber(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated.");
  }
  if (!(await isSubscriber(userId))) {
    throw new Error("This is a Cadacre subscriber feature.");
  }
  return userId;
}

function readPortfolio(metadata: Record<string, unknown> | undefined): PortfolioProperty[] {
  const raw = metadata?.portfolioProperties;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (entry): entry is PortfolioProperty =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as PortfolioProperty).id === "string" &&
      typeof (entry as PortfolioProperty).nickname === "string" &&
      typeof (entry as PortfolioProperty).pricePaid === "number" &&
      typeof (entry as PortfolioProperty).purchaseDate === "string" &&
      typeof (entry as PortfolioProperty).weeklyRent === "number"
  );
}

export async function getPortfolio(): Promise<PortfolioProperty[]> {
  const { userId } = await auth();
  if (!userId) return [];
  if (!(await isSubscriber(userId))) return [];

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return readPortfolio(user.privateMetadata);
}

export async function addPortfolioProperty(
  input: Omit<PortfolioProperty, "id">
): Promise<PortfolioProperty[]> {
  const userId = await requireSubscriber();

  if (!input.nickname.trim()) {
    throw new Error("Give the property a nickname.");
  }
  if (!Number.isFinite(input.pricePaid) || input.pricePaid <= 0) {
    throw new Error("Enter a purchase price greater than $0.");
  }
  if (!Number.isFinite(input.weeklyRent) || input.weeklyRent < 0) {
    throw new Error("Enter a weekly rent of $0 or more.");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const current = readPortfolio(user.privateMetadata);
  const next: PortfolioProperty[] = [
    ...current,
    { ...input, id: crypto.randomUUID() },
  ];

  await client.users.updateUserMetadata(userId, { privateMetadata: { portfolioProperties: next } });
  return next;
}

export async function removePortfolioProperty(id: string): Promise<PortfolioProperty[]> {
  const userId = await requireSubscriber();

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const current = readPortfolio(user.privateMetadata);
  const next = current.filter((entry) => entry.id !== id);

  await client.users.updateUserMetadata(userId, { privateMetadata: { portfolioProperties: next } });
  return next;
}

function readRentTrackerBaseline(
  metadata: Record<string, unknown> | undefined
): RentTrackerBaseline | null {
  const raw = metadata?.rentTrackerBaseline;
  if (
    typeof raw === "object" &&
    raw !== null &&
    typeof (raw as RentTrackerBaseline).suburbId === "string" &&
    typeof (raw as RentTrackerBaseline).asOf === "string" &&
    typeof (raw as RentTrackerBaseline).affordablePrice === "number" &&
    Array.isArray((raw as RentTrackerBaseline).matchedTownIds)
  ) {
    return raw as RentTrackerBaseline;
  }
  return null;
}

export async function getRentTrackerBaseline(): Promise<RentTrackerBaseline | null> {
  const { userId } = await auth();
  if (!userId) return null;
  if (!(await isSubscriber(userId))) return null;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return readRentTrackerBaseline(user.privateMetadata);
}

export async function saveRentTrackerBaseline(
  baseline: RentTrackerBaseline
): Promise<RentTrackerBaseline> {
  const userId = await requireSubscriber();

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, { privateMetadata: { rentTrackerBaseline: baseline } });
  return baseline;
}
