import { sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { planningApplications } from "@/db/schema";
import type { ScrapedApplication } from "./adapters/types";

const CHUNK_SIZE = 300;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

/**
 * Upserts one adapter's scraped applications, deduped on (source,
 * externalId). Returns the ids of applications that were genuinely new
 * this run (not just a re-seen existing row) — matchNewApplications() only
 * needs to check those, not the whole table, on every cron run.
 */
export async function ingestAdapterResults(
  source: string,
  applications: ScrapedApplication[]
): Promise<string[]> {
  const db = getDb();
  if (!db) return [];
  if (applications.length === 0) return [];

  const newIds: string[] = [];
  const now = new Date();

  for (const batch of chunk(applications, CHUNK_SIZE)) {
    const rows = await db
      .insert(planningApplications)
      .values(
        batch.map((app) => ({
          source,
          externalId: app.externalId,
          lgaName: app.lgaName,
          councilName: app.councilName ?? null,
          address: app.address,
          suburb: app.suburb ?? null,
          postcode: app.postcode ?? null,
          lat: app.lat ?? null,
          lng: app.lng ?? null,
          description: app.description ?? null,
          applicationType: app.applicationType ?? null,
          status: app.status ?? null,
          lodgedDate: app.lodgedDate ?? null,
          decisionDate: app.decisionDate ?? null,
          sourceUrl: app.sourceUrl,
          rawPayload: app.raw ?? null,
          lastSeenAt: now,
        }))
      )
      .onConflictDoUpdate({
        target: [planningApplications.source, planningApplications.externalId],
        set: {
          lgaName: sql`excluded.lga_name`,
          councilName: sql`excluded.council_name`,
          address: sql`excluded.address`,
          suburb: sql`excluded.suburb`,
          postcode: sql`excluded.postcode`,
          lat: sql`excluded.lat`,
          lng: sql`excluded.lng`,
          description: sql`excluded.description`,
          applicationType: sql`excluded.application_type`,
          status: sql`excluded.status`,
          lodgedDate: sql`excluded.lodged_date`,
          decisionDate: sql`excluded.decision_date`,
          sourceUrl: sql`excluded.source_url`,
          rawPayload: sql`excluded.raw_payload`,
          lastSeenAt: now,
          updatedAt: now,
        },
      })
      // The classic Postgres upsert-returning trick: xmax = 0 means the
      // row's transaction-id-that-deleted-it is unset, i.e. this row was
      // just INSERTed, not UPDATEd by the ON CONFLICT branch.
      .returning({ id: planningApplications.id, inserted: sql<boolean>`(xmax = 0)` });

    for (const row of rows) {
      if (row.inserted) newIds.push(row.id);
    }
  }

  return newIds;
}
