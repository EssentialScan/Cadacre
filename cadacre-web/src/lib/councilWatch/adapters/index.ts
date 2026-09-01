import type { CouncilSourceAdapter } from "./types";
import { nswPlanningPortalAdapter } from "./nswPlanningPortal";

// The only place adapters get registered. Add real, verified scrapers here
// as they're built — nothing else in this feature needs to change to pick
// them up.
//
// Phase 2 (AGENTS.md §5m) replaced the Phase 1 manual-seed adapter with a
// real live one: the NSW Planning Portal's public DA Exhibitions listing
// (see nswPlanningPortal.ts for the full verification — CC BY 4.0, no
// robots.txt block, no API key, ~129 of 130 NSW LGAs queryable). It covers
// both LGAs the manual seed covered (Cessnock, Greater Hume Shire) and
// everything else the portal itself publishes, so `manualSeedAdapter` is no
// longer registered here — it's superseded, not deleted (see manualSeed.ts,
// still useful for offline/local-dev testing without hitting the network).
export const ADAPTERS: CouncilSourceAdapter[] = [nswPlanningPortalAdapter];

export function getCoveredLgas(): Set<string> {
  return new Set(ADAPTERS.flatMap((adapter) => adapter.coversLgas));
}
