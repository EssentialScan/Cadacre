import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isSubscriber } from "@/lib/entitlements";
import { rankTowns, type RankWeights } from "@/lib/rankTowns";

export const runtime = "nodejs";

function csvCell(value: string | number | null): string {
  if (value === null) return "";
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (!(await isSubscriber(userId))) {
    return NextResponse.json({ error: "CSV export is a Cadacre subscriber feature." }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const budget = Number(searchParams.get("budget"));
  const targetYieldPct = Number(searchParams.get("yield"));
  if (!Number.isFinite(budget) || budget <= 0 || !Number.isFinite(targetYieldPct)) {
    return NextResponse.json({ error: "Invalid budget or yield." }, { status: 400 });
  }

  const weights: RankWeights | undefined =
    searchParams.has("weightAffordability") &&
    searchParams.has("weightYield") &&
    searchParams.has("weightVacancy")
      ? {
          affordability: Number(searchParams.get("weightAffordability")),
          yield: Number(searchParams.get("weightYield")),
          vacancy: Number(searchParams.get("weightVacancy")),
        }
      : undefined;

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
