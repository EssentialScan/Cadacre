import { towns, type Town } from "./towns";
import { findPsiGrowthHistory } from "./nswSuburbs";

export type { Town, SourcedField } from "./towns";
export type { NswSuburb } from "./nswSuburbs";
export { getUncuratedNswSuburbs } from "./nswSuburbs";

export function getAllTowns(): Town[] {
  return towns.map((town) => {
    const psiGrowthHistory = findPsiGrowthHistory(town.name);
    return psiGrowthHistory ? { ...town, psiGrowthHistory } : town;
  });
}
