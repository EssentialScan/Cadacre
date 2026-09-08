import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  doublePrecision,
  integer,
  boolean,
  date,
  jsonb,
  bigint,
} from "drizzle-orm/pg-core";
import { relations, InferSelectModel } from "drizzle-orm";

export type Reit = InferSelectModel<typeof reits>;
export type ReitAsset = InferSelectModel<typeof reitAssets>;
export type Announcement = InferSelectModel<typeof announcements>;
export type ReitPrice = InferSelectModel<typeof reitPrices>;
export type PortfolioHolding = InferSelectModel<typeof portfolioHoldings>;
export type ReitDistribution = InferSelectModel<typeof reitDistributions>;
export type Alert = InferSelectModel<typeof alerts>;
export type ApiKey = InferSelectModel<typeof apiKeys>;
export type ReitMetric = InferSelectModel<typeof reitMetrics>;
export type ReitHistoricalFinancial = InferSelectModel<typeof reitHistoricalFinancials>;
export type ReitTransaction = InferSelectModel<typeof reitTransactions>;
export type ReitEvent = InferSelectModel<typeof reitEvents>;
export type ReitDocument = InferSelectModel<typeof reitDocuments>;

export const sectorEnum = pgEnum("sector", ["Industrial", "Retail", "Office", "Diversified", "Specialized"]);

export const reits = pgTable(
  "reits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ticker: text("ticker").notNull().unique(),
    name: text("name").notNull(),
    sector: sectorEnum("sector").notNull(),
    marketCap: doublePrecision("market_cap"),
    yield: doublePrecision("yield"),
    ntaDiscount: doublePrecision("nta_discount"),
    gearing: doublePrecision("gearing"),
    entityType: text("entity_type"),
    listingDate: date("listing_date"),
    hq: text("hq"),
    website: text("website"),
    irPage: text("ir_page"),
    businessModel: text("business_model"),
    structure: text("structure"),
    wale: doublePrecision("wale"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  }
);

export const reitAssets = pgTable(
  "reit_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reitId: uuid("reit_id")
      .notNull()
      .references(() => reits.id, { onDelete: "cascade" }),
    address: text("address").notNull(),
    suburb: text("suburb"),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    propertyType: text("property_type"),
    bookValue: doublePrecision("book_value"),
    occupancyRate: doublePrecision("occupancy_rate"), // percentage
    wale: doublePrecision("wale"), // years
    capRate: doublePrecision("cap_rate"), // percentage
    gla: integer("gla"), // sqm
    majorTenant: text("major_tenant"),
    majorTenants: jsonb("major_tenants"),
    acquisitionDate: date("acquisition_date"),
    developmentStatus: text("development_status"),
    developmentValue: doublePrecision("development_value"),
    ownershipPct: doublePrecision("ownership_pct"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }
);

export const reitsRelations = relations(reits, ({ many }) => ({
  assets: many(reitAssets),
}));

export const reitAssetsRelations = relations(reitAssets, ({ one }) => ({
  reit: one(reits, { fields: [reitAssets.reitId], references: [reits.id] }),
}));

export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reitId: uuid("reit_id")
      .notNull()
      .references(() => reits.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
    sourceUrl: text("source_url").notNull(),
    isPriceSensitive: boolean("is_price_sensitive").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }
);

export const announcementsRelations = relations(announcements, ({ one }) => ({
  reit: one(reits, { fields: [announcements.reitId], references: [reits.id] }),
}));

// ── Phase 2 Tables ──────────────────────────────────────────────────────────

/** Daily closing prices — populated by the scrape-prices cron */
export const reitPrices = pgTable("reit_prices", {
  id: uuid("id").defaultRandom().primaryKey(),
  reitId: uuid("reit_id").notNull().references(() => reits.id, { onDelete: "cascade" }),
  priceDate: date("price_date").notNull(),
  closePrice: doublePrecision("close_price").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** User REIT portfolio holdings — one row per lot */
export const portfolioHoldings = pgTable("portfolio_holdings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(), // Clerk userId
  reitId: uuid("reit_id").notNull().references(() => reits.id, { onDelete: "cascade" }),
  units: doublePrecision("units").notNull(),
  purchasePrice: doublePrecision("purchase_price").notNull(), // per unit AUD
  purchaseDate: date("purchase_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Historical distribution payments per REIT */
export const reitDistributions = pgTable("reit_distributions", {
  id: uuid("id").defaultRandom().primaryKey(),
  reitId: uuid("reit_id").notNull().references(() => reits.id, { onDelete: "cascade" }),
  exDate: date("ex_date").notNull(),
  payDate: date("pay_date"),
  amountCents: integer("amount_cents").notNull(), // cents per unit
  taxDeferredPct: doublePrecision("tax_deferred_pct").default(0),
  cgDiscountPct: doublePrecision("cg_discount_pct").default(0),
  foreignIncomePct: doublePrecision("foreign_income_pct").default(0),
  frankingCreditsPct: doublePrecision("franking_credits_pct").default(0),
  foreignTaxCreditsPct: doublePrecision("foreign_tax_credits_pct").default(0),
  amitComponents: jsonb("amit_components"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** User-defined alerts (metric threshold triggers) */
export const alerts = pgTable("alerts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  reitId: uuid("reit_id").references(() => reits.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  conditions: jsonb("conditions").notNull().$type<AlertCondition[]>(),
  channels: jsonb("channels").notNull().$type<AlertChannel[]>(),
  isActive: boolean("is_active").notNull().default(true),
  lastTriggeredAt: timestamp("last_triggered_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** B2B API keys */
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  keyHash: text("key_hash").notNull().unique(), // SHA-256 of the raw key
  keyPrefix: text("key_prefix").notNull(), // first 8 chars — shown in UI for identification
  tier: text("tier").notNull().default("free"), // "free" | "paid"
  requestCount: bigint("request_count", { mode: "number" }).notNull().default(0),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Phase 2 Type helpers ────────────────────────────────────────────────────

export interface AlertCondition {
  metric: "yield" | "ntaDiscount" | "gearing" | "wale" | "marketCap";
  operator: "gt" | "lt" | "gte" | "lte";
  value: number;
}

export interface AlertChannel {
  type: "email" | "webhook";
  destination: string; // email address or webhook URL
}

// ── Phase 2 Relations ───────────────────────────────────────────────────────

export const reitPricesRelations = relations(reitPrices, ({ one }) => ({
  reit: one(reits, { fields: [reitPrices.reitId], references: [reits.id] }),
}));

export const portfolioHoldingsRelations = relations(portfolioHoldings, ({ one }) => ({
  reit: one(reits, { fields: [portfolioHoldings.reitId], references: [reits.id] }),
}));

export const reitDistributionsRelations = relations(reitDistributions, ({ one }) => ({
  reit: one(reits, { fields: [reitDistributions.reitId], references: [reits.id] }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  reit: one(reits, { fields: [alerts.reitId], references: [reits.id] }),
}));

// --- Phase 3 Community Layer ---

export const userProfiles = pgTable("user_profiles", {
  userId: text("user_id").primaryKey(), // Clerk userId
  username: text("username").notNull().unique(),
  isPortfolioPublic: boolean("is_portfolio_public").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const watchlists = pgTable("watchlists", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  reitId: uuid("reit_id").notNull().references(() => reits.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reitNotes = pgTable("reit_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  reitId: uuid("reit_id").notNull().references(() => reits.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reitComments = pgTable("reit_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(), // Will join with userProfiles on read
  reitId: uuid("reit_id").notNull().references(() => reits.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const watchlistsRelations = relations(watchlists, ({ one }) => ({
  reit: one(reits, { fields: [watchlists.reitId], references: [reits.id] }),
}));

export const reitCommentsRelations = relations(reitComments, ({ one }) => ({
  reit: one(reits, { fields: [reitComments.reitId], references: [reits.id] }),
}));


export const savedScreenerViews = pgTable("saved_screener_views", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  sector: text("sector"),
  minYield: doublePrecision("min_yield"),
  maxGearing: doublePrecision("max_gearing"),
  minNtaDiscount: doublePrecision("min_nta_discount"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});


// ── Phase 4: REIT Intelligence Terminal Data Model ────────────────────────────

export const reitMetrics = pgTable("reit_metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  reitId: uuid("reit_id").notNull().references(() => reits.id, { onDelete: "cascade" }),
  metricGroup: text("metric_group").notNull(),
  metric: text("metric").notNull(),
  value: text("value").notNull(),
  unit: text("unit"),
  period: text("period"),
  asOfDate: date("as_of_date").notNull(),
  sourceUrl: text("source_url"),
  sourceTitle: text("source_title"),
  sourceDate: date("source_date"),
  sourceType: text("source_type"),
  methodology: text("methodology"),
  isCalculated: boolean("is_calculated").default(false),
  confidence: text("confidence").default("high"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reitHistoricalFinancials = pgTable("reit_historical_financials", {
  id: uuid("id").defaultRandom().primaryKey(),
  reitId: uuid("reit_id").notNull().references(() => reits.id, { onDelete: "cascade" }),
  financialYear: text("financial_year").notNull(),
  revenue: doublePrecision("revenue"),
  operatingEarnings: doublePrecision("operating_earnings"),
  eps: doublePrecision("eps"),
  distribution: doublePrecision("distribution"),
  nta: doublePrecision("nta"),
  propertyValue: doublePrecision("property_value"),
  gearing: doublePrecision("gearing"),
  occupancy: doublePrecision("occupancy"),
  wale: doublePrecision("wale"),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reitTransactions = pgTable("reit_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  reitId: uuid("reit_id").notNull().references(() => reits.id, { onDelete: "cascade" }),
  transactionDate: date("transaction_date").notNull(),
  type: text("type").notNull(),
  assetName: text("asset_name").notNull(),
  location: text("location"),
  counterparty: text("counterparty"),
  value: doublePrecision("value"),
  ownershipPct: doublePrecision("ownership_pct"),
  settlementDate: date("settlement_date"),
  reason: text("reason"),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reitEvents = pgTable("reit_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  reitId: uuid("reit_id").notNull().references(() => reits.id, { onDelete: "cascade" }),
  eventDate: timestamp("event_date", { withTimezone: true }).notNull(),
  title: text("title").notNull(),
  eventType: text("event_type").notNull(),
  description: text("description"),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reitDocuments = pgTable("reit_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  reitId: uuid("reit_id").notNull().references(() => reits.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  documentType: text("document_type").notNull(),
  publishDate: date("publish_date").notNull(),
  reportingPeriod: text("reporting_period"),
  sourceUrl: text("source_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reitMetricsRelations = relations(reitMetrics, ({ one }) => ({
  reit: one(reits, { fields: [reitMetrics.reitId], references: [reits.id] }),
}));

export const reitHistoricalFinancialsRelations = relations(reitHistoricalFinancials, ({ one }) => ({
  reit: one(reits, { fields: [reitHistoricalFinancials.reitId], references: [reits.id] }),
}));

export const reitTransactionsRelations = relations(reitTransactions, ({ one }) => ({
  reit: one(reits, { fields: [reitTransactions.reitId], references: [reits.id] }),
}));

export const reitEventsRelations = relations(reitEvents, ({ one }) => ({
  reit: one(reits, { fields: [reitEvents.reitId], references: [reits.id] }),
}));

export const reitDocumentsRelations = relations(reitDocuments, ({ one }) => ({
  reit: one(reits, { fields: [reitDocuments.reitId], references: [reits.id] }),
}));
