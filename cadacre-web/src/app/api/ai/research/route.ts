import { NextResponse } from "next/server";

type ResearchRequest = {
  locationName: string;
  address: string;
  postcode: string | null;
  latitude?: number;
  longitude?: number;
  medianPrice: number | null;
  medianRent: number | null;
  grossYieldPct: number | null;
  vacancyRatePct: number | null;
  buildings: number;
  addressedBuildings: number;
  amenities: { name?: string; type?: string }[];
};

type CkanPackage = {
  title?: string;
  notes?: string;
  name?: string;
  metadata_modified?: string;
  organization?: { title?: string };
};

async function searchCatalogue(baseUrl: string, query: string) {
  const response = await fetch(
    `${baseUrl}/api/3/action/package_search?q=${encodeURIComponent(query)}&rows=5`,
    { next: { revalidate: 600 } }
  );
  if (!response.ok) return [];
  const result = (await response.json()) as { result?: { results?: CkanPackage[] } };
  return (result.result?.results ?? []).map((item) => ({
    title: item.title ?? "Untitled dataset",
    description: item.notes?.replace(/<[^>]*>/g, " ").slice(0, 500) ?? "No description published",
    organisation: item.organization?.title ?? "Government catalogue",
    updated: item.metadata_modified ?? "Date not published",
    url: `${baseUrl}/dataset/${item.name ?? ""}`,
  }));
}

function isRequest(value: unknown): value is ResearchRequest {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<ResearchRequest>;
  return typeof data.locationName === "string" && typeof data.address === "string";
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      configured: false,
      message: "Add GROQ_API_KEY to enable AI research summaries.",
    });
  }

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!isRequest(data)) {
    return NextResponse.json({ error: "Location research data is required." }, { status: 400 });
  }

  const catalogueQuery = [data.locationName, data.postcode, "property housing planning"]
    .filter(Boolean)
    .join(" ");
  const [nswDatasets, nationalDatasets] = await Promise.all([
    searchCatalogue("https://data.nsw.gov.au/data", catalogueQuery),
    searchCatalogue("https://www.data.gov.au/data", catalogueQuery),
  ]);

  const facts = JSON.stringify({
    location: data.locationName,
    address: data.address,
    postcode: data.postcode,
    medianPrice: data.medianPrice,
    medianRent: data.medianRent,
    grossYieldPct: data.grossYieldPct,
    vacancyRatePct: data.vacancyRatePct,
    mappedBuildings: data.buildings,
    addressedBuildings: data.addressedBuildings,
    nearbyAmenities: data.amenities,
    coordinates: { latitude: data.latitude ?? null, longitude: data.longitude ?? null },
    officialCatalogueResults: [...nswDatasets, ...nationalDatasets],
  });

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        temperature: 0.1,
        max_tokens: 450,
        messages: [
          {
            role: "system",
            content:
              "You are a cautious Australian property research assistant. Summarize only the supplied facts and official catalogue results. Never invent a property value, listing, sale, suburb statistic, government result, or real-time claim. Say unavailable when a field is null. Clearly distinguish town-level aggregates, dataset metadata, and an individual property. Mention the organisation and dataset URL when citing catalogue results. Use plain English in 3 short paragraphs and a 3-item evidence list. This is general information, not financial advice.",
          },
          { role: "user", content: `Verified source facts:\n${facts}` },
        ],
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      const message = response.status === 401
        ? "Groq rejected the key. Rotate it in the Groq console and update .env.local."
        : response.status === 403
          ? "This Groq key does not have access to the selected model."
          : response.status === 429
            ? "Groq rate limit reached. Try again shortly."
            : "Groq research is temporarily unavailable.";
      return NextResponse.json({ configured: true, error: message }, { status: response.status });
    }
    const result = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    return NextResponse.json({
      configured: true,
      summary: result.choices?.[0]?.message?.content ?? "No summary returned.",
      officialSources: [...nswDatasets, ...nationalDatasets].map((item) => ({ title: item.title, url: item.url })),
    });
  } catch {
    return NextResponse.json({ configured: true, error: "AI research could not reach Groq." }, { status: 502 });
  }
}