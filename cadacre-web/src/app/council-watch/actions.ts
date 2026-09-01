"use server";

import { and, desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { isSubscriber } from "@/lib/entitlements";
import { getDb } from "@/db/client";
import { watches, watchMatches, planningApplications } from "@/db/schema";
import { forwardGeocode, reverseGeocode } from "@/lib/councilWatch/geocode";
import { normalizeLgaName } from "@/lib/councilWatch/nswLgas";
import { getAllTowns } from "@/data";
import { getUncuratedNswSuburbs } from "@/data/nswSuburbs";
import type { Watch, WatchWithMatches, WatchKind } from "./types";

const MAX_WATCHES_PER_SUBSCRIBER = 10;
const DEFAULT_ADDRESS_RADIUS_M = 300;

async function requireSubscriber(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated.");
  }
  if (!(await isSubscriber(userId))) {
    throw new Error("This is a Cadacre subscriber feature.");
  }
  return userId;
}

function toWatch(row: typeof watches.$inferSelect): Watch {
  return {
    id: row.id,
    kind: row.kind,
    label: row.label,
    lgaName: row.lgaName,
    suburbName: row.suburbName,
    addressLine: row.addressLine,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listWatchesWithMatches(): Promise<WatchWithMatches[]> {
  const userId = await requireSubscriber();
  const db = getDb();
  if (!db) return [];

  const rows = await db.select().from(watches).where(eq(watches.userId, userId)).orderBy(desc(watches.createdAt));

  const results: WatchWithMatches[] = [];
  for (const row of rows) {
    const matches = await db
      .select({
        id: watchMatches.id,
        watchId: watchMatches.watchId,
        matchReason: watchMatches.matchReason,
        matchedAt: watchMatches.matchedAt,
        aiSummary: watchMatches.aiSummary,
        viewedAt: watchMatches.viewedAt,
        application: {
          id: planningApplications.id,
          address: planningApplications.address,
          suburb: planningApplications.suburb,
          description: planningApplications.description,
          applicationType: planningApplications.applicationType,
          status: planningApplications.status,
          lodgedDate: planningApplications.lodgedDate,
          decisionDate: planningApplications.decisionDate,
          sourceUrl: planningApplications.sourceUrl,
          councilName: planningApplications.councilName,
        },
      })
      .from(watchMatches)
      .innerJoin(planningApplications, eq(watchMatches.applicationId, planningApplications.id))
      .where(eq(watchMatches.watchId, row.id))
      .orderBy(desc(watchMatches.matchedAt));

    results.push({
      ...toWatch(row),
      matches: matches.map((m) => ({
        id: m.id,
        watchId: m.watchId,
        matchReason: m.matchReason,
        matchedAt: m.matchedAt.toISOString(),
        aiSummary: m.aiSummary,
        viewedAt: m.viewedAt ? m.viewedAt.toISOString() : null,
        application: m.application,
      })),
    });
  }

  return results;
}

export async function createWatch(input: {
  kind: WatchKind;
  label: string;
  addressLine?: string;
  suburbName?: string;
  lgaDisplayName?: string;
  radiusM?: number;
}): Promise<WatchWithMatches[]> {
  const userId = await requireSubscriber();
  const db = getDb();
  if (!db) throw new Error("Council watch isn't configured yet.");

  const existing = await db.select({ id: watches.id }).from(watches).where(eq(watches.userId, userId));
  if (existing.length >= MAX_WATCHES_PER_SUBSCRIBER) {
    throw new Error(`You can track up to ${MAX_WATCHES_PER_SUBSCRIBER} watches at a time.`);
  }

  const label = input.label.trim();
  if (!label) throw new Error("Enter a label for this watch.");

  if (input.kind === "lga") {
    const lgaDisplayName = (input.lgaDisplayName ?? "").trim();
    if (!lgaDisplayName) throw new Error("Choose a local government area.");
    await db.insert(watches).values({
      userId,
      kind: "lga",
      label,
      lgaName: normalizeLgaName(lgaDisplayName),
    });
  } else if (input.kind === "suburb") {
    const suburbName = (input.suburbName ?? "").trim();
    if (!suburbName) throw new Error("Choose a suburb.");
    const coordinates = resolveSuburbCoordinates(suburbName);
    if (!coordinates) throw new Error("Couldn't find that suburb's location.");
    const geocoded = await reverseGeocode(coordinates.lat, coordinates.lng);
    if (!geocoded?.lgaName) throw new Error("Couldn't resolve the local government area for that suburb.");
    await db.insert(watches).values({
      userId,
      kind: "suburb",
      label,
      lgaName: geocoded.lgaName,
      suburbName,
      lat: coordinates.lat,
      lng: coordinates.lng,
    });
  } else {
    const addressLine = (input.addressLine ?? "").trim();
    if (!addressLine) throw new Error("Enter an address.");
    const geocoded = await forwardGeocode(addressLine);
    if (!geocoded) throw new Error("Couldn't find that address.");
    if (!geocoded.lgaName) throw new Error("Couldn't resolve the local government area for that address.");
    await db.insert(watches).values({
      userId,
      kind: "address",
      label,
      lgaName: geocoded.lgaName,
      suburbName: geocoded.suburb,
      addressLine,
      lat: geocoded.lat,
      lng: geocoded.lng,
      radiusM: input.radiusM ?? DEFAULT_ADDRESS_RADIUS_M,
    });
  }

  return listWatchesWithMatches();
}

function resolveSuburbCoordinates(suburbName: string): { lat: number; lng: number } | null {
  const normalized = suburbName.trim().toUpperCase();
  const town = getAllTowns().find((t) => t.name.toUpperCase() === normalized);
  if (town) return town.coordinates;
  const suburb = getUncuratedNswSuburbs().find((s) => s.name.toUpperCase() === normalized);
  return suburb ? suburb.coordinates : null;
}

export async function deleteWatch(id: string): Promise<WatchWithMatches[]> {
  const userId = await requireSubscriber();
  const db = getDb();
  if (!db) return [];
  await db.delete(watches).where(and(eq(watches.id, id), eq(watches.userId, userId)));
  return listWatchesWithMatches();
}

export async function markMatchViewed(matchId: string): Promise<void> {
  const userId = await requireSubscriber();
  const db = getDb();
  if (!db) return;
  // Scope the update to the requesting user's own watches — a matchId
  // belonging to someone else's watch is silently a no-op, not an error.
  const [match] = await db
    .select({ watchId: watchMatches.watchId })
    .from(watchMatches)
    .where(eq(watchMatches.id, matchId));
  if (!match) return;
  const [owned] = await db
    .select({ id: watches.id })
    .from(watches)
    .where(and(eq(watches.id, match.watchId), eq(watches.userId, userId)));
  if (!owned) return;
  await db.update(watchMatches).set({ viewedAt: new Date() }).where(eq(watchMatches.id, matchId));
}
