import { NextResponse } from "next/server";
import { requireSubscriberApi } from "@/lib/apiAuth";
import { getAllTowns } from "@/data";
import { matchesFilters, type TownMapFilters } from "@/lib/townFilters";

// AI concierge chat (AGENTS.md §5k, §4 rule 8) — a natural-language question
// is translated by the model into a structured filter object, which is then
// run through the existing, deterministic matchesFilters() — the model
// never computes or invents a number, it only maps language to real filter
// parameters. A second, separate call phrases a short answer strictly from
// the real matched towns. Subscriber-gated, same Groq self-serve API this
// repo already uses in api/ai/research/route.ts.

const MAX_MATCHES = 8;

type ParsedFilters = TownMapFilters;

function sanitizeFilters(raw: unknown): ParsedFilters {
  if (!raw || typeof raw !== "object") return {};
  const data = raw as Record<string, unknown>;
  const filters: ParsedFilters = {};

  if (typeof data.budget === "number" && Number.isFinite(data.budget) && data.budget > 0) {
    filters.budget = data.budget;
  }
  if (typeof data.minYieldPct === "number" && Number.isFinite(data.minYieldPct)) {
    filters.minYieldPct = data.minYieldPct;
  }
  if (typeof data.maxVacancyPct === "number" && Number.isFinite(data.maxVacancyPct)) {
    filters.maxVacancyPct = data.maxVacancyPct;
  }
  if (typeof data.maxRent === "number" && Number.isFinite(data.maxRent) && data.maxRent > 0) {
    filters.maxRent = data.maxRent;
  }
  if (typeof data.hideBushfireRisk === "boolean") {
    filters.hideBushfireRisk = data.hideBushfireRisk;
  }
  if (typeof data.hideFloodRisk === "boolean") {
    filters.hideFloodRisk = data.hideFloodRisk;
  }
  if (typeof data.infrastructureOnly === "boolean") {
    filters.infrastructureOnly = data.infrastructureOnly;
  }
  if (typeof data.minPopulationGrowthPct === "number" && Number.isFinite(data.minPopulationGrowthPct)) {
    filters.minPopulationGrowthPct = data.minPopulationGrowthPct;
  }
  if (data.region === "Sydney Metro" || data.region === "Regional NSW") {
    filters.region = data.region;
  }
  return filters;
}

async function callGroq(apiKey: string, model: string, messages: { role: string; content: string }[], jsonMode: boolean) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      max_tokens: 500,
      messages,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Groq request failed (${response.status})`);
  }
  const result = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  return result.choices?.[0]?.message?.content ?? "";
}

export async function POST(request: Request) {
  const gate = await requireSubscriberApi("The AI concierge");
  if ("response" in gate) return gate.response;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      configured: false,
      message: "AI concierge unavailable — add GROQ_API_KEY to enable it.",
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const question =
    body && typeof body === "object" && typeof (body as { question?: unknown }).question === "string"
      ? (body as { question: string }).question.trim()
      : "";
  if (!question) {
    return NextResponse.json({ error: "A question is required." }, { status: 400 });
  }

  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  let filters: ParsedFilters;
  try {
    const filterJson = await callGroq(
      apiKey,
      model,
      [
        {
          role: "system",
          content:
            "You translate a renter/investor's natural-language question into a JSON filter object over Cadacre's town record. Output ONLY a JSON object with any of these optional keys: budget (number, AUD), minYieldPct (number), maxVacancyPct (number), maxRent (number, weekly AUD), hideBushfireRisk (boolean), hideFloodRisk (boolean), infrastructureOnly (boolean), minPopulationGrowthPct (number), region (\"Sydney Metro\" or \"Regional NSW\"). Omit any key you can't infer. Never include any other keys or explanatory text — JSON only.",
        },
        { role: "user", content: question },
      ],
      true
    );
    filters = sanitizeFilters(JSON.parse(filterJson));
  } catch {
    return NextResponse.json({ configured: true, error: "AI concierge could not reach Groq." }, { status: 502 });
  }

  const allTowns = getAllTowns();
  const matched = allTowns
    .filter((town) => matchesFilters(town, filters))
    .filter((town) => town.medianPrice.value !== null)
    .sort((a, b) => (a.medianPrice.value as number) - (b.medianPrice.value as number))
    .slice(0, MAX_MATCHES);

  const facts = JSON.stringify({
    question,
    appliedFilters: filters,
    matchedTowns: matched.map((t) => ({
      name: t.name,
      state: t.state,
      region: t.region ?? "Regional NSW",
      medianPrice: t.medianPrice.value,
      grossYieldPct: t.grossYieldPct.value,
      vacancyRatePct: t.vacancyRatePct.value,
      bushfireRisk: t.bushfireRisk.level,
      floodRisk: t.floodRisk.level,
    })),
    totalMatchesBeforeLimit: allTowns.filter((town) => matchesFilters(town, filters)).length,
  });

  try {
    const answer = await callGroq(
      apiKey,
      model,
      [
        {
          role: "system",
          content:
            "You are a cautious Australian property research assistant. Answer strictly from the supplied matchedTowns facts — never invent a town, price, yield, or risk level not present in the data. If matchedTowns is empty, say so plainly rather than guessing. Mention town-level hazard flags are Cadacre's own characterization, not an official rating. Keep the answer to 2-3 short sentences plus a bullet list of the matched towns' names. This is general information, not personalised financial or investment advice.",
        },
        { role: "user", content: `Facts:\n${facts}` },
      ],
      false
    );

    return NextResponse.json({
      configured: true,
      answer,
      filters,
      matches: matched.map((t) => ({
        id: t.id,
        name: t.name,
        state: t.state,
        region: t.region ?? "Regional NSW",
        medianPrice: t.medianPrice.value,
        grossYieldPct: t.grossYieldPct.value,
        vacancyRatePct: t.vacancyRatePct.value,
      })),
    });
  } catch {
    return NextResponse.json({ configured: true, error: "AI concierge could not reach Groq." }, { status: 502 });
  }
}
