/** One normalized DA record as scraped, before DB upsert. */
export type ScrapedApplication = {
  externalId: string; // the source's own DA reference — stable across re-fetches
  lgaName: string; // normalized NSW LGA name, tagged by the adapter itself
  councilName?: string;
  address: string;
  suburb?: string;
  postcode?: string;
  lat?: number;
  lng?: number;
  description?: string;
  applicationType?: string;
  status?: string;
  lodgedDate?: string; // ISO "YYYY-MM-DD"
  decisionDate?: string; // ISO "YYYY-MM-DD"
  sourceUrl: string;
  raw?: unknown; // untouched source record, stored to planning_applications.raw_payload
};

/**
 * One pluggable per-source integration. Adapters are the only code that
 * knows a specific source's HTML/JSON/RSS shape — everything downstream
 * (dedup, matching, AI summaries, UI) only ever sees ScrapedApplication.
 * This is what lets "which councils we actually cover" stay an open,
 * evolving question without touching the DB, matching, cron, or UI layers.
 *
 * Real, sourced data only — same non-fabrication rule as everywhere else
 * in this codebase (AGENTS.md §5). If a source can't be verified working,
 * it doesn't get registered in adapters/index.ts; there is no
 * "best guess" adapter.
 */
export interface CouncilSourceAdapter {
  /** Stable key — never rename once data has been ingested under it, it's
   * half of the (source, externalId) dedup key in planning_applications. */
  readonly key: string;
  readonly label: string;
  /** Normalized LGA names this adapter can return applications for. The
   * watch-creation UI uses this to tell a subscriber, up front, whether
   * their LGA is actually covered — never silently accept an uncovered
   * watch that will just never produce alerts. */
  readonly coversLgas: string[];
  /** Everything currently available from the source right now (or a
   * bounded recent window for high-volume sources). Adapters don't
   * paginate/persist state between runs — the ingest step's upsert by
   * (source, externalId) plus lastSeenAt is what turns this into durable
   * history across repeated calls.
   *
   * `watchedLgas` (normalized LGA keys, see nswLgas.ts) lets a source with
   * broad but expensive-to-crawl coverage — e.g. a statewide portal with
   * thousands of pages — scope its own fetch to only the LGAs someone is
   * actually watching, instead of blindly crawling everything it could
   * theoretically serve. A small/fixed source (a hand-seeded list) can
   * ignore this and just return its whole set every time. */
  fetchApplications(context: { watchedLgas: string[] }): Promise<ScrapedApplication[]>;
}
