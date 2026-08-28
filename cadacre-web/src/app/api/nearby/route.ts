import { NextResponse } from "next/server";

type OsmElement = {
  id: number;
  type: string;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

function elementPoint(element: OsmElement) {
  return element.lat !== undefined && element.lon !== undefined
    ? { lat: element.lat, lng: element.lon }
    : element.center
      ? { lat: element.center.lat, lng: element.center.lon }
      : null;
}

function distanceKm(first: { lat: number; lng: number }, second: { lat: number; lng: number }) {
  const latDistance = (first.lat - second.lat) * 111;
  const lngDistance = (first.lng - second.lng) * 111 * Math.cos((first.lat * Math.PI) / 180);
  return Math.sqrt(latDistance ** 2 + lngDistance ** 2);
}

function validCoordinate(value: string | null) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = validCoordinate(url.searchParams.get("lat"));
  const lng = validCoordinate(url.searchParams.get("lng"));

  if (lat === null || lng === null || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: "Valid latitude and longitude are required." }, { status: 400 });
  }

  const buildQuery = (radius: number) =>
    `[out:json][timeout:12];(nwr(around:${radius},${lat},${lng})[building];nwr(around:${radius},${lat},${lng})["addr:housenumber"];nwr(around:${radius},${lat},${lng})[amenity][name];);out center tags;`;
  try {
    const [osmResponse, addressResponse] = await Promise.all([
      fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(buildQuery(1000))}`, {
        next: { revalidate: 3600 },
        headers: { "User-Agent": "Cadacre/1.0 (public town research tool)" },
      }),
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&lat=${lat}&lon=${lng}`, {
        next: { revalidate: 3600 },
        headers: { "User-Agent": "Cadacre/1.0 (public town research tool)" },
      }),
    ]);

    if (!osmResponse.ok) throw new Error("Nearby map data unavailable");
    let osm = (await osmResponse.json()) as { elements?: OsmElement[] };
    let radiusMetres = 1000;
    if ((osm.elements ?? []).length === 0) {
      const widerResponse = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(buildQuery(5000))}`,
        {
          next: { revalidate: 3600 },
          headers: { "User-Agent": "Cadacre/1.0 (public town research tool)" },
        }
      );
      if (widerResponse.ok) {
        osm = (await widerResponse.json()) as { elements?: OsmElement[] };
        radiusMetres = 5000;
      }
    }
    const address = addressResponse.ok ? await addressResponse.json() : null;
    const elements = osm.elements ?? [];
    const buildings = elements.filter((element) => element.tags?.building).length;
    const addressedBuildings = elements.filter((element) => element.tags?.["addr:housenumber"]).length;
    const clickedPoint = { lat, lng };
    const nearestBuilding = elements
      .filter((element) => element.tags?.building)
      .map((element) => ({ element, point: elementPoint(element) }))
      .filter((entry): entry is { element: OsmElement; point: { lat: number; lng: number } } => entry.point !== null)
      .sort((first, second) => distanceKm(first.point, clickedPoint) - distanceKm(second.point, clickedPoint))[0];
    const places = elements
      .filter((element) => element.tags?.amenity && element.tags.name)
      .slice(0, 10)
      .map((element) => ({
        name: element.tags?.name,
        type: element.tags?.amenity,
      }));

    return NextResponse.json({
      address: address?.display_name ?? "Address not mapped",
      locationName:
        address?.address?.suburb ??
        address?.address?.town ??
        address?.address?.city ??
        address?.address?.municipality ??
        "Selected map location",
      postcode: address?.address?.postcode ?? null,
      buildings,
      addressedBuildings,
      nearestBuilding: nearestBuilding
        ? {
            distanceMetres: Math.round(distanceKm(nearestBuilding.point, clickedPoint) * 1000),
            type: nearestBuilding.element.tags?.building === "yes"
              ? "building footprint"
              : nearestBuilding.element.tags?.building ?? "building footprint",
            address: [
              nearestBuilding.element.tags?.["addr:housenumber"],
              nearestBuilding.element.tags?.["addr:street"],
            ].filter(Boolean).join(" ") || null,
          }
        : null,
      places,
      radiusMetres,
      coverage: elements.length === 0 ? "No mapped features found" : "Mapped features found",
      source: "OpenStreetMap contributors",
    });
  } catch {
    return NextResponse.json({ error: "Nearby map data is temporarily unavailable." }, { status: 502 });
  }
}