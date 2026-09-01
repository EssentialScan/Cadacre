import { eq, inArray } from "drizzle-orm";
import { getDb } from "@/db/client";
import { watches, watchMatches, planningApplications } from "@/db/schema";
import { distanceKm } from "@/lib/geo";

type MatchReason =
  | "lga"
  | "suburb"
  | "suburb_substring_fallback"
  | "address_radius"
  | "suburb_fallback_no_coords";

function normalizedSuburb(value: string | null): string | null {
  return value ? value.trim().toUpperCase() : null;
}

/**
 * For each newly-ingested application id, find every watch sharing its LGA
 * and record a watch_matches row with an honest reason for how/how loosely
 * it matched. Idempotent (ON CONFLICT DO NOTHING on (watchId, applicationId))
 * — safe to call with the same ids more than once.
 */
export async function matchNewApplications(newApplicationIds: string[]): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  if (newApplicationIds.length === 0) return 0;

  const newApplications = await db
    .select()
    .from(planningApplications)
    .where(inArray(planningApplications.id, newApplicationIds));

  let matchCount = 0;

  for (const application of newApplications) {
    const candidateWatches = await db
      .select()
      .from(watches)
      .where(eq(watches.lgaName, application.lgaName));

    for (const watch of candidateWatches) {
      const reason = resolveMatchReason(watch, application);
      if (!reason) continue;

      await db
        .insert(watchMatches)
        .values({ watchId: watch.id, applicationId: application.id, matchReason: reason })
        .onConflictDoNothing({
          target: [watchMatches.watchId, watchMatches.applicationId],
        });
      matchCount += 1;
    }
  }

  return matchCount;
}

function resolveMatchReason(
  watch: typeof watches.$inferSelect,
  application: typeof planningApplications.$inferSelect
): MatchReason | null {
  if (watch.kind === "lga") {
    return "lga";
  }

  const watchSuburb = normalizedSuburb(watch.suburbName);
  const appSuburb = normalizedSuburb(application.suburb);

  if (watch.kind === "suburb") {
    if (watchSuburb && appSuburb && watchSuburb === appSuburb) return "suburb";
    if (watchSuburb && application.address.toUpperCase().includes(watchSuburb)) {
      return "suburb_substring_fallback";
    }
    return null;
  }

  // kind === "address"
  if (watch.lat !== null && watch.lng !== null && watch.radiusM !== null) {
    if (application.lat !== null && application.lng !== null) {
      const distanceMetres =
        distanceKm({ lat: watch.lat, lng: watch.lng }, { lat: application.lat, lng: application.lng }) * 1000;
      if (distanceMetres <= watch.radiusM) return "address_radius";
      return null;
    }
    // Source didn't publish coordinates for this application — fall back
    // to a suburb-level match so the watch still surfaces something,
    // honestly labeled as a looser match than the address radius the
    // subscriber actually asked for.
    if (watchSuburb && appSuburb && watchSuburb === appSuburb) return "suburb_fallback_no_coords";
  }

  return null;
}
