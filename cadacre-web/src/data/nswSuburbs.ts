import generated from "./generated/nswSuburbs.json";
import { towns } from "./towns";

// Full NSW suburb/locality coverage — ABS Digital Boundary Files (Suburbs
// and Localities, CC BY 4.0) for name + coordinates, plus a real multi-year
// growth series derived from NSW Valuer General Bulk Property Sales
// Information (PSI). See scripts/fetch-abs-sal.sh, scripts/fetch-valuer-
// general-psi.sh, scripts/aggregate-nsw-suburbs.js, and AGENTS.md §5h.
//
// LICENCE WARNING: `growthHistory` is PSI-derived and PSI is CC BY-NC-ND
// 4.0 (Non-Commercial, No-Derivatives) — this must stay dashboard-only,
// never read by the paid report path. See the same warning on
// `Town.psiGrowthHistory` in src/data/towns.ts.
export type NswSuburb = {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  growthHistory?: { year: number; medianSalePrice: number; saleCount: number }[];
};

const allSuburbs = generated as NswSuburb[];

function normalizeName(name: string): string {
  return name
    .toUpperCase()
    .replace(/\(NSW\)/g, "")
    .replace(/\s*-\s*/g, " ")
    .replace(/[^A-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const curatedNames = new Set(towns.map((town) => normalizeName(town.name)));

/**
 * All ~4,500 NSW suburbs NOT already covered by the curated `Town[]` dataset
 * (which has richer price/rent/yield/hazard data) — for the free dashboard
 * map's full-coverage layer. Curated towns keep rendering via their own
 * pin/drawer as before; this is everything else.
 */
export function getUncuratedNswSuburbs(): NswSuburb[] {
  return allSuburbs.filter((suburb) => !curatedNames.has(normalizeName(suburb.name)));
}

/** Looks up a real PSI growth series for a curated Town by name, if one exists. */
export function findPsiGrowthHistory(townName: string): NswSuburb["growthHistory"] | undefined {
  const norm = normalizeName(townName);
  return allSuburbs.find((suburb) => normalizeName(suburb.name) === norm)?.growthHistory;
}
