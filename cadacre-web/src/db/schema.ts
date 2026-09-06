import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  doublePrecision,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations, InferSelectModel } from "drizzle-orm";

export type Reit = InferSelectModel<typeof reits>;
export type ReitAsset = InferSelectModel<typeof reitAssets>;
export type Announcement = InferSelectModel<typeof announcements>;

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
