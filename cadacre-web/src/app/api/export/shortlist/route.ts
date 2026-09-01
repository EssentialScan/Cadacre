import { NextRequest, NextResponse } from "next/server";
import { requireSubscriberApi } from "@/lib/apiAuth";
import { rankTowns, type RankWeights } from "@/lib/rankTowns";

export const runtime = "nodejs";

function csvCell(value: string | number | null): string {
  if (value === null) return "";
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export async function GET(request: NextRequest) {
  const gate = await requireSubscriberApi("CSV export");
  if ("response" in gate) return gate.response;

  const { searchParams } = request.nextUrl;
  const budget = Number(searchParams.get("budget"));
  const targetYieldPct = Number(searchParams.get("yield"));
  if (!Number.isFinite(budget) || budget <= 0 || !Number.isFinite(targetYieldPct)) {
    return NextResponse.json({ error: "Invalid budget or yield." }, { status: 400 });
  }

  let weights: RankWeights | undefined;
  if (
    searchParams.has("weightAffordability") &&
    searchParams.has("weightYield") &&
    searchParams.has("weightVacancy")
  ) {
    const affordability = Number(searchParams.get("weightAffordability"));
    const yieldWeight = Number(searchParams.get("weightYield"));
    const vacancy = Number(searchParams.get("weightVacancy"));
    if (
      !Number.isFinite(affordability) || affordability < 0 ||
      !Number.isFinite(yieldWeight) || yieldWeight < 0 ||
      !Number.isFinite(vacancy) || vacancy < 0
    ) {
      return NextResponse.json({ error: "Invalid ranking weights." }, { status: 400 });
    }
    weights = { affordability, yield: yieldWeight, vacancy };
  }

  const ranked = rankTowns({ budget, targetYieldPct, weights });

  const header = [
    "rank",
    "town",
    "state",
    "value_score",
    "median_price",
    "gross_yield_pct",
    "vacancy_rate_pct",
    "bushfire_risk",
    "flood_risk",
  ];
  const rows = ranked.map(({ rank, town, valueScore }) =>
    [
      rank,
      town.name,
      town.state,
      valueScore,
      town.medianPrice.value,
      town.grossYieldPct.value,
      town.vacancyRatePct.value,
      town.bushfireRisk.level,
      town.floodRisk.level,
    ]
      .map(csvCell)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="cadacre-shortlist.csv"',
    },
  });
}
