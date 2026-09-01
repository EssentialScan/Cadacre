import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  doublePrecision,
  integer,
  jsonb,
  date,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// A subscriber's tracked address/suburb/LGA (AGENTS.md §5m). `lgaName` is
// resolved once at creation time (see src/lib/councilWatch/geocode.ts) and
// is what the matching query actually joins on; suburb/address are
// additionally stored for display and for the tighter match refinement.
export const watchKindEnum = pgEnum("watch_kind", ["address", "suburb", "lga"]);

export const watches = pgTable(
  "watches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(), // Clerk userId — no FK, Clerk is the source of truth
    kind: watchKindEnum("kind").notNull(),
    label: text("label").notNull(), // display label — the user's own input
    lgaName: text("lga_name").notNull(), // normalized (uppercase/trimmed)
    suburbName: text("suburb_name"), // set for kind='suburb' and kind='address'
    addressLine: text("address_line"), // set for kind='address' only
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    radiusM: integer("radius_m"), // set for kind='address' only
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("watches_user_id_idx").on(table.userId),
    index("watches_lga_name_idx").on(table.lgaName),
  ]
);

// One normalized development-application record, deduped across repeated
// scrapes by (source, externalId). rawPayload keeps the untouched scraped
// record so a bad normalization can be reprocessed without re-fetching.
export const planningApplications = pgTable(
  "planning_applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    source: text("source").notNull(), // adapter key, e.g. "manual-seed"
    externalId: text("external_id").notNull(), // the source's own DA reference
    lgaName: text("lga_name").notNull(), // normalized, tagged by the adapter
    councilName: text("council_name"), // raw display name from the source
    address: text("address").notNull(),
    suburb: text("suburb"),
    postcode: text("postcode"),
    lat: doublePrecision("lat"), // nullable — most sources won't publish this
    lng: doublePrecision("lng"),
    description: text("description"),
    applicationType: text("application_type"),
    status: text("status"), // free text — statuses vary too much per council for an enum
    lodgedDate: date("lodged_date"),
    decisionDate: date("decision_date"),
    sourceUrl: text("source_url").notNull(),
    rawPayload: jsonb("raw_payload"),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("planning_applications_source_external_id_key").on(table.source, table.externalId),
    index("planning_applications_lga_name_idx").on(table.lgaName),
    index("planning_applications_suburb_idx").on(table.suburb),
    index("planning_applications_lodged_date_idx").on(table.lodgedDate),
  ]
);

// A watch matched against an application. Generated only by the cron's
// matching step, never by the client. aiSummary is nullable and stays null
// until Groq actually succeeds — never a fabricated fallback (same rule as
// the AI concierge, see api/ai/concierge/route.ts).
export const watchMatches = pgTable(
  "watch_matches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    watchId: uuid("watch_id")
      .notNull()
      .references(() => watches.id, { onDelete: "cascade" }),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => planningApplications.id, { onDelete: "cascade" }),
    matchedAt: timestamp("matched_at", { withTimezone: true }).notNull().defaultNow(),
    // Always honest about why/how loosely it matched — surfaced in the UI.
    // One of: "lga" | "suburb" | "suburb_substring_fallback" |
    // "address_radius" | "suburb_fallback_no_coords".
    matchReason: text("match_reason").notNull(),
    aiSummary: text("ai_summary"),
    aiSummaryGeneratedAt: timestamp("ai_summary_generated_at", { withTimezone: true }),
    viewedAt: timestamp("viewed_at", { withTimezone: true }), // drives "new since you last checked"
  },
  (table) => [
    unique("watch_matches_watch_id_application_id_key").on(table.watchId, table.applicationId),
    index("watch_matches_watch_id_idx").on(table.watchId),
  ]
);

export const watchesRelations = relations(watches, ({ many }) => ({
  matches: many(watchMatches),
}));
export const watchMatchesRelations = relations(watchMatches, ({ one }) => ({
  watch: one(watches, { fields: [watchMatches.watchId], references: [watches.id] }),
  application: one(planningApplications, {
    fields: [watchMatches.applicationId],
    references: [planningApplications.id],
  }),
}));
