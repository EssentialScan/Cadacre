// One-time/manually-rerun snapshot generator for the Cadacre Pro rank-drift
// + hazard/infrastructure change tracking feature (Pro-only, see
// TownDetailDrawer.tsx's TownDriftPanel). No live database or cron exists
// in this repo — this follows the exact same checked-in-JSON pattern as
// scripts/aggregate-nsw-suburbs.js (src/data/generated/nswSuburbs.json),
// just importing the real rankTowns()/getAllTowns() TypeScript logic
// directly (via `npx tsx`) instead of reimplementing the scoring formula.
//
// Run manually: npx tsx scripts/generate-town-snapshot.ts
// Then commit the updated src/data/generated/townSnapshot.json.
//
// rank/valueScore only exist for a given {budget, targetYieldPct} pair
// (see rankTowns.ts), so this pins a fixed reference input rather than
// claiming there's a single "the" rank per town.
import fs from "fs";
import path from "path";
import { getAllTowns } from "../src/data";
import { rankTowns } from "../src/lib/rankTowns";

// Chosen so real 2026 towns actually qualify — the previous {500_000, 5}
// pair excluded every regional town (the cheapest, Cowra, is $480k at a
// 4.87% yield, just under the 5% floor), which meant every checked-in
// snapshot entry had rank: null and the rank-drift feature could never
// detect a change. See AGENTS.md's rank-drift section for context.
const REFERENCE_INPUT = { budget: 750_000, targetYieldPct: 4 };

const towns = getAllTowns();
const ranked = rankTowns(REFERENCE_INPUT, towns);
const rankedById = new Map(ranked.map((r) => [r.town.id, r]));

const asOf = new Date().toLocaleDateString("en-AU", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const entries = towns.map((town) => {
  const rankedEntry = rankedById.get(town.id);
  return {
    townId: town.id,
    name: town.name,
    rank: rankedEntry?.rank ?? null,
    valueScore: rankedEntry?.valueScore ?? null,
    bushfireLevel: town.bushfireRisk.level,
    floodLevel: town.floodRisk.level,
    infrastructureProjectTexts: town.infrastructureProjects.map((p) => p.text),
  };
});

const snapshot = { asOf, referenceInput: REFERENCE_INPUT, entries };

const outPath = path.join(__dirname, "..", "src", "data", "generated", "townSnapshot.json");
fs.writeFileSync(outPath, JSON.stringify(snapshot));
console.error(`Wrote ${entries.length} town entries to ${outPath} (as of ${asOf}).`);
