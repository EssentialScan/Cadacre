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
    state: text("state"),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    propertyType: text("property_type"),
    bookValue: doublePrecision("book_value"),
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
