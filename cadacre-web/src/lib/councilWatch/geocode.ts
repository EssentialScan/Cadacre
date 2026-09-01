import { normalizeLgaName } from "./nswLgas";

const USER_AGENT = "Cadacre/1.0 (public town research tool)";

type NominatimAddress = {
  suburb?: string;
  town?: string;
  city?: string;
  municipality?: string;
  county?: string;
  postcode?: string;
};

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
};

export type GeocodedAddress = {
  lat: number;
  lng: number;
  displayName: string;
  suburb: string | null;
  lgaName: string | null; // normalized — see nswLgas.ts's normalizeLgaName
  postcode: string | null;
};

function toGeocodedAddress(result: NominatimResult): GeocodedAddress {
  const address = result.address ?? {};
  const rawLga = address.municipality ?? address.county ?? address.city ?? null;
  return {
    lat: Number(result.lat),
    lng: Number(result.lon),
    displayName: result.display_name,
    suburb: address.suburb ?? address.town ?? null,
    lgaName: rawLga ? normalizeLgaName(rawLga) : null,
    postcode: address.postcode ?? null,
  };
}

// One-off lookup at watch-creation time — deliberately NOT cached
// (next: {revalidate}) the way nearby/route.ts and places/route.ts cache
// repeated map-pan queries at the same coordinates; a free-text address
// search won't repeat often enough to benefit, and this must never be
// called in bulk against scraped DA rows (Nominatim's usage policy
// prohibits bulk/systematic geocoding — planning_applications.lat/lng
// stays null unless a source happens to publish coordinates itself).
export async function forwardGeocode(query: string): Promise<GeocodedAddress | null> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=au&limit=1&q=${encodeURIComponent(query)}`,
    { headers: { "User-Agent": USER_AGENT } }
  );
  if (!response.ok) throw new Error("Geocoding unavailable");
  const results = (await response.json()) as NominatimResult[];
  return results[0] ? toGeocodedAddress(results[0]) : null;
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodedAddress | null> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=14&lat=${lat}&lon=${lng}`,
    { headers: { "User-Agent": USER_AGENT } }
  );
  if (!response.ok) throw new Error("Geocoding unavailable");
  const result = (await response.json()) as NominatimResult;
  return result?.address ? toGeocodedAddress(result) : null;
}
