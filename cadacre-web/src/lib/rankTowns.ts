import { getAllTowns, type Town } from "@/data";

export type RankInput = {
  budget: number;
  targetYieldPct: number;
};

export type RankedTown = {
  rank: number;
  town: Town;
  valueScore: number;
};

export function rankTowns(input: RankInput, towns: Town[] = getAllTowns()): RankedTown[] {
  const comparableTowns = towns.filter(
    (town) => town.medianPrice.value !== null && town.grossYieldPct.value !== null
  );
  const prices = comparableTowns.map((town) => town.medianPrice.value as number);
  const yields = comparableTowns.map((town) => town.grossYieldPct.value as number);
  const vacancies = comparableTowns
    .map((town) => town.vacancyRatePct.value)
    .filter((value): value is number => value !== null);
  const min = (values: number[]) => Math.min(...values);
  const max = (values: number[]) => Math.max(...values);
  const range = (values: number[]) => max(values) - min(values) || 1;
  const score = (town: Town) => {
    const price = town.medianPrice.value as number;
    const yieldPct = town.grossYieldPct.value as number;
    const vacancy = town.vacancyRatePct.value;
    const affordability = ((max(prices) - price) / range(prices)) * 40;
    const yieldScore = ((yieldPct - min(yields)) / range(yields)) * 40;
    const vacancyWeight = vacancy === null ? 0 : 20;
    const vacancyScore = vacancy === null
      ? 0
      : ((max(vacancies) - vacancy) / range(vacancies)) * vacancyWeight;
    const availableWeight = 80 + vacancyWeight;
    return Math.round(((affordability + yieldScore + vacancyScore) / availableWeight) * 100);
  };

  const qualifying = towns.filter((town) => {
    const price = town.medianPrice.value;
    const yieldPct = town.grossYieldPct.value;
    if (price === null || yieldPct === null) return false;
    return price <= input.budget && yieldPct >= input.targetYieldPct;
  });

  qualifying.sort((a, b) => {
    const scoreDiff = score(b) - score(a);
    if (scoreDiff !== 0) return scoreDiff;

    const priceDiff = (a.medianPrice.value as number) - (b.medianPrice.value as number);
    if (priceDiff !== 0) return priceDiff;

    return a.name.localeCompare(b.name);
  });

  return qualifying.map((town, i) => ({ rank: i + 1, town, valueScore: score(town) }));
}
