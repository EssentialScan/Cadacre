import { getAllTowns, type Town } from "@/data";

export type RankInput = {
  budget: number;
  targetYieldPct: number;
};

export type RankedTown = {
  rank: number;
  town: Town;
};

export function rankTowns(input: RankInput, towns: Town[] = getAllTowns()): RankedTown[] {
  const qualifying = towns.filter((town) => {
    const price = town.medianPrice.value;
    const yieldPct = town.grossYieldPct.value;
    if (price === null || yieldPct === null) return false;
    return price <= input.budget && yieldPct >= input.targetYieldPct;
  });

  qualifying.sort((a, b) => {
    const yieldDiff = (b.grossYieldPct.value as number) - (a.grossYieldPct.value as number);
    if (yieldDiff !== 0) return yieldDiff;

    const priceDiff = (a.medianPrice.value as number) - (b.medianPrice.value as number);
    if (priceDiff !== 0) return priceDiff;

    return a.name.localeCompare(b.name);
  });

  return qualifying.map((town, i) => ({ rank: i + 1, town }));
}
