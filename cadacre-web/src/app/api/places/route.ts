import { NextResponse } from "next/server";

type PlaceElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: { name?: string; place?: string };
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: "Valid coordinates are required." }, { status: 400 });
  }

  const query = `[out:json][timeout:10];nwr(around:40000,${lat},${lng})[place][name];out center tags;`;
  try {
    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
      {
        next: { revalidate: 3600 },
        headers: { "User-Agent": "Cadacre/1.0 (public town research tool)" },
      }
    );
    if (!response.ok) throw new Error("Place data unavailable");
    const data = (await response.json()) as { elements?: PlaceElement[] };
    const places = (data.elements ?? [])
      .filter((place) => (place.lat !== undefined && place.lon !== undefined || place.center) && place.tags?.name)
      .slice(0, 150)
      .map((place) => {
        const point = place.lat !== undefined && place.lon !== undefined
          ? { lat: place.lat, lng: place.lon }
          : { lat: place.center!.lat, lng: place.center!.lon };
        return { id: place.id, name: place.tags?.name ?? "Unnamed place", type: place.tags?.place ?? "locality", ...point };
      });
    return NextResponse.json({ places, radiusKm: 40, source: "OpenStreetMap contributors" });
  } catch {
    return NextResponse.json({ error: "Place data is temporarily unavailable." }, { status: 502 });
  }
}