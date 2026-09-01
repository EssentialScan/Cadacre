import type { CouncilSourceAdapter, ScrapedApplication } from "./types";
import seedData from "@/data/councilWatchSeed/manual-seed.json";

// Phase 1 adapter (AGENTS.md §5m plan) — a handful of real DA records
// hand-copied from the NSW Planning Portal's public daex pages
// (planningportal.nsw.gov.au/daex/...), transcribed by hand rather than
// scraped programmatically. Same non-fabrication discipline as every other
// dataset in this repo — real, sourced, dated records, just not yet fed by
// a live automated source. Proves the ingest → match → AI-summary → UI
// pipeline end-to-end; see src/data/councilWatchSeed/manual-seed.json for
// the source URLs. Replace/supplement with a real live adapter in Phase 2.
export const manualSeedAdapter: CouncilSourceAdapter = {
  key: "manual-seed",
  label: "Manually verified seed data (Phase 1)",
  coversLgas: ["CESSNOCK", "GREATER HUME SHIRE"],
  async fetchApplications(): Promise<ScrapedApplication[]> {
    // Fixed, tiny, hand-verified set — always returned in full regardless
    // of which LGAs are actually being watched.
    return seedData as ScrapedApplication[];
  },
};
