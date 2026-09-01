import type { CouncilSourceAdapter } from "./types";
import { manualSeedAdapter } from "./manualSeed";

// The only place adapters get registered. Add real, verified scrapers here
// as they're built (Phase 2 of the council-watch plan) — nothing else in
// this feature needs to change to pick them up.
export const ADAPTERS: CouncilSourceAdapter[] = [manualSeedAdapter];

export function getCoveredLgas(): Set<string> {
  return new Set(ADAPTERS.flatMap((adapter) => adapter.coversLgas));
}
