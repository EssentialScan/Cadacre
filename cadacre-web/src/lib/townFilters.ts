import type { Town } from "@/data/towns";

export type TownMapFilters = {
  budget?: number;
  minYieldPct?: number;
  maxVacancyPct?: number;
  maxRent?: number;
  hideBushfireRisk?: boolean;
  hideFloodRisk?: boolean;
  infrastructureOnly?: boolean;
  savedOnly?: boolean;
  minPopulationGrowthPct?: number;
  region?: "Sydney Metro" | "Regional NSW";
};

export type TownFilterContext = {
  // Saved-town membership lives outside the Town record itself (it's
  // per-user, stored via Clerk metadata — see dashboard/actions.ts), so
  // it's threaded in as a lookup set rather than a field on Town.
  savedTownIds?: Set<string>;
};

const HIGH_HAZARD_LEVELS = new Set(["High", "Very High", "Extreme"]);

export function matchesFilters(
  town: Town,
  { budget, minYieldPct, maxVacancyPct, maxRent, hideBushfireRisk, hideFloodRisk, infrastructureOnly, savedOnly, minPopulationGrowthPct, region }: TownMapFilters,
  context: TownFilterContext = {}
): boolean {
  if (region !== undefined && (town.region ?? "Regional NSW") !== region) {
    return false;
  }
  if (budget !== undefined && town.medianPrice.value !== null && town.medianPrice.value > budget) {
    return false;
  }
  if (minYieldPct !== undefined && town.grossYieldPct.value !== null && town.grossYieldPct.value < minYieldPct) {
    return false;
  }
  if (maxVacancyPct !== undefined && town.vacancyRatePct.value !== null && town.vacancyRatePct.value > maxVacancyPct) {
    return false;
  }
  if (maxRent !== undefined && town.medianRent.value !== null && town.medianRent.value > maxRent) {
    return false;
  }
  if (
    hideBushfireRisk &&
    town.bushfireRisk.level !== null &&
    HIGH_HAZARD_LEVELS.has(town.bushfireRisk.level)
  ) {
    return false;
  }
  if (
    hideFloodRisk &&
    town.floodRisk.level !== null &&
    HIGH_HAZARD_LEVELS.has(town.floodRisk.level)
  ) {
    return false;
  }
  if (infrastructureOnly && town.infrastructureProjects.length === 0) {
    return false;
  }
  if (savedOnly && !context.savedTownIds?.has(town.id)) {
    return false;
  }
  if (
    minPopulationGrowthPct !== undefined &&
    town.population?.value?.growthPct !== undefined &&
    town.population.value.growthPct < minPopulationGrowthPct
  ) {
    return false;
  }
  return true;
}
