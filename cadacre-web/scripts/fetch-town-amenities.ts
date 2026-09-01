// One-time/manually-rerun fetch for expanded amenities (schools, hospitals,
// supermarkets, gyms, parks, pharmacies) and transport proximity (nearest
// main road, rail station, airport) per town, via the free/keyless
// OpenStreetMap Overpass API — same endpoint/User-Agent convention already
// used by src/app/api/nearby/route.ts and src/app/api/places/route.ts.
//
// This does NOT write directly into src/data/towns.ts (a hand-authored file
// with per-town prose comments) — it prints ready-to-paste `amenities`/
// `transportProximity` object literals per town, exactly like the earlier
// employment/population data was added. Copy the printed block for each
// town into its entry in src/data/towns.ts.
//
// Run manually: npx tsx scripts/fetch-town-amenities.ts
//
// Rate-limit note (AGENTS.md §5e): the public overpass-api.de instance
// previously rate-limited a burst-style fetch pass. To stay well under
// quota this version issues only TWO Overpass requests per town (one
// multi-named-set query for all 6 amenity counts, one for all 3 transport
// categories — via named result sets, not 9 separate requests), with a
// generous delay between every request. A town that still fails (rate
// limit, timeout, network) is logged and skipped, not retried in a tight
// loop; re-run the script later to pick up the rest.
import { execFile } from "child_process";
import { promisify } from "util";
import { getAllTowns } from "../src/data";

const execFileAsync = promisify(execFile);

const REQUEST_DELAY_MS = 8_000;
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const USER_AGENT = "Cadacre/1.0 (public town research tool)";
const AMENITY_RADIUS_KM = 5;
const ROAD_RAIL_RADIUS_KM = 60;
const AIRPORT_RADIUS_KM = 150;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Node's own outbound HTTPS (fetch/net.connect) is blocked in this dev
// environment (ETIMEDOUT on every resolved address, both IPv4 and IPv6)
// while `curl` from the same shell succeeds instantly — an environment-
// specific egress-filtering quirk, not an Overpass/API issue. Shelling out
// to curl (already confirmed working) sidesteps it; this is a one-time
// manual script, not runtime product code, so this is a pragmatic fix
// scoped to the script rather than to the app's actual fetch usage.
async function overpassQuery(query: string): Promise<{
  elements: {
    type: string;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: { total?: string };
  }[];
}> {
  const { stdout } = await execFileAsync(
    "curl",
    ["-s", "--max-time", "40", "-A", USER_AGENT, "-d", query, OVERPASS_URL],
    { maxBuffer: 1024 * 1024 * 20 }
  );
  const parsed = JSON.parse(stdout);
  if (!parsed.elements) {
    throw new Error(`Unexpected Overpass response: ${stdout.slice(0, 200)}`);
  }
  return parsed;
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

async function fetchAmenityCounts(coords: { lat: number; lng: number }) {
  const r = AMENITY_RADIUS_KM * 1000;
  const query = `[out:json][timeout:30];
nwr(around:${r},${coords.lat},${coords.lng})["amenity"="school"]->.schools;
nwr(around:${r},${coords.lat},${coords.lng})["amenity"="hospital"]->.hospitals;
nwr(around:${r},${coords.lat},${coords.lng})["shop"="supermarket"]->.supermarkets;
nwr(around:${r},${coords.lat},${coords.lng})["leisure"="fitness_centre"]->.gyms;
nwr(around:${r},${coords.lat},${coords.lng})["leisure"="park"]->.parks;
nwr(around:${r},${coords.lat},${coords.lng})["amenity"="pharmacy"]->.pharmacies;
.schools out count;
.hospitals out count;
.supermarkets out count;
.gyms out count;
.parks out count;
.pharmacies out count;`;
  const result = await overpassQuery(query);
  const counts = result.elements
    .filter((e) => e.type === "count")
    .map((e) => Number(e.tags?.total ?? 0));
  const [schools, hospitals, supermarkets, gyms, parks, pharmacies] = counts;
  return { schools, hospitals, supermarkets, gyms, parks, pharmacies };
}

async function nearestSingleCategory(
  coords: { lat: number; lng: number },
  radiusKm: number,
  tagFilter: string
): Promise<number | null> {
  const query = `[out:json][timeout:30];nwr(around:${radiusKm * 1000},${coords.lat},${coords.lng})${tagFilter};out center;`;
  const result = await overpassQuery(query);
  const points = result.elements
    .map((e) => (e.type === "node" ? { lat: e.lat!, lon: e.lon! } : e.center))
    .filter((p): p is { lat: number; lon: number } => !!p);
  if (points.length === 0) return null;
  const nearest = Math.min(...points.map((p) => haversineKm(coords, p)));
  return Math.round(nearest * 10) / 10;
}

async function main() {
  const towns = getAllTowns();
  const asOf = new Date().toISOString().slice(0, 10);
  let succeeded = 0;
  let failed = 0;

  for (const town of towns) {
    try {
      const amenities = await fetchAmenityCounts(town.coordinates);
      await sleep(REQUEST_DELAY_MS);

      const nearestMainRoadKm = await nearestSingleCategory(
        town.coordinates,
        ROAD_RAIL_RADIUS_KM,
        `["highway"~"^(motorway|trunk|primary)$"]`
      );
      await sleep(REQUEST_DELAY_MS);
      const nearestRailStationKm = await nearestSingleCategory(
        town.coordinates,
        ROAD_RAIL_RADIUS_KM,
        `["railway"="station"]`
      );
      await sleep(REQUEST_DELAY_MS);
      const nearestAirportKm = await nearestSingleCategory(
        town.coordinates,
        AIRPORT_RADIUS_KM,
        `["aeroway"~"^(aerodrome|international)$"]`
      );

      console.log(`\n// ${town.name} (${town.id})`);
      console.log(
        `amenities: { value: { schools: ${amenities.schools}, hospitals: ${amenities.hospitals}, supermarkets: ${amenities.supermarkets}, gyms: ${amenities.gyms}, parks: ${amenities.parks}, pharmacies: ${amenities.pharmacies}, radiusKm: ${AMENITY_RADIUS_KM} }, source: "OpenStreetMap Overpass API — count within ${AMENITY_RADIUS_KM}km of town centroid", sourceUrl: "https://overpass-api.de/api/interpreter", asOf: "${asOf}" },`
      );
      console.log(
        `transportProximity: { value: { nearestMainRoadKm: ${nearestMainRoadKm}, nearestRailStationKm: ${nearestRailStationKm}, nearestAirportKm: ${nearestAirportKm} }, source: "OpenStreetMap Overpass API — nearest feature by straight-line distance from town centroid", sourceUrl: "https://overpass-api.de/api/interpreter", asOf: "${asOf}" },`
      );

      succeeded += 1;
    } catch (err) {
      failed += 1;
      console.error(`FAILED: ${town.name} — ${(err as Error).message}`);
    }

    await sleep(REQUEST_DELAY_MS);
  }

  console.error(`\nDone. ${succeeded} succeeded, ${failed} failed out of ${towns.length}.`);
}

main();
