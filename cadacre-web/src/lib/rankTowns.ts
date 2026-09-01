import { getAllTowns, type Town } from "@/data";
import { computeCashFlowEstimate, formatMoney } from "@/lib/investmentMath";

// Subscriber custom-weighting feature — defaults match the original
// fixed 40/40/20 split. Free users always get the default; only a Pro
// subscriber's explicit weights are threaded through (see getShortlist in
// src/app/dashboard/actions.ts).
export type RankWeights = {
  affordability: number;
  yield: number;
  vacancy: number;
};

export const DEFAULT_RANK_WEIGHTS: RankWeights = { affordability: 40, yield: 40, vacancy: 20 };

export type RankInput = {
  budget: number;
  targetYieldPct: number;
  weights?: RankWeights;
};

export type RankedTown = {
  rank: number;
  town: Town;
  valueScore: number;
};

export type DecisionTag = "yield-heavy" | "balanced" | "budget-led" | "needs-review";

export type DecisionSummary = {
  bestFit: string | null;
  bestFitReason: string;
  riskAdjusted: string | null;
  riskAdjustedReason: string;
  caution: string | null;
  cautionReason: string;
};

export type TownDecisionSnapshot = {
  town: string;
  medianPrice: number | null;
  medianRent: number | null;
  grossYieldPct: number | null;
  vacancyRatePct: number | null;
  bushfireRisk?: { level: string | null } | null;
  floodRisk?: { level: string | null } | null;
  infrastructureProjects?: { text: string }[];
};

export function getTownDecisionNarrative(town: TownDecisionSnapshot): string {
  const yieldPct = unwrapValue(town.grossYieldPct);
  const vacancy = unwrapValue(town.vacancyRatePct);
  const medianPrice = unwrapValue(town.medianPrice);
  const riskPenalty = normalizeRisk(town.bushfireRisk?.level) + normalizeRisk(town.floodRisk?.level);
  const infraCount = town.infrastructureProjects?.length ?? 0;

  if (typeof yieldPct === "number" && yieldPct >= 6 && typeof vacancy === "number" && vacancy <= 2.5) {
    return `${town.town} reads as a yield-heavy option: the pricing is still within reach and the gross yield is strong, but the main trade-off is whether the vacancy and risk profile stay acceptable for your own budget.`;
  }

  if (typeof medianPrice === "number" && medianPrice <= 650000 && typeof yieldPct === "number" && yieldPct >= 4) {
    return `${town.town} is budget-led: it clears the affordability bar and keeps the cash-flow picture realistic, with the main decision being whether the weekly margin still works for your Sydney rent.`;
  }

  if (riskPenalty > 0 || infraCount > 0 || (typeof vacancy === "number" && vacancy > 3)) {
    return `${town.town} needs a closer look: the numbers can work, but the risk or vacancy profile means the decision is more sensitive to the exact assumptions you are making.`;
  }

  return `${town.town} sits in a balanced band: affordability, yield and vacancy are all broadly workable, so it becomes a lifestyle-or-convenience decision rather than a pure arithmetic one.`;
}

export type DecisionSensitivity = {
  primary: string;
  ifBudgetRises: string;
  ifYieldTightens: string;
  ifRiskIncreases: string;
};

export function getTownDecisionSensitivity(town: TownDecisionSnapshot): DecisionSensitivity {
  const yieldPct = unwrapValue(town.grossYieldPct);
  const vacancy = unwrapValue(town.vacancyRatePct);
  const medianPrice = unwrapValue(town.medianPrice);
  const weeklyRent = unwrapValue(town.medianRent);
  const riskPenalty = normalizeRisk(town.bushfireRisk?.level) + normalizeRisk(town.floodRisk?.level);

  let primary = "The numbers are workable within your inputs.";
  if (typeof weeklyRent === "number") {
    if (weeklyRent > 130) {
      primary = `The weekly rent is on the higher side (~$${Math.round(weeklyRent)}) — any yield dip hurts.`;
    } else if (weeklyRent < 80) {
      primary = `Rent is modest (~$${Math.round(weeklyRent)}/week), which is a cushion against downside risk.`;
    }
  } else {
    primary = "Weekly rent isn't published for this town, so cash-flow sensitivity can't be estimated here.";
  }

  let ifBudgetRises = "A 5–10% price rise would push the cash flow margin thinner.";
  if (typeof medianPrice === "number" && medianPrice > 700000) {
    ifBudgetRises = "This town is already at the edge of affordability — a price rise could break the fit.";
  } else if (typeof medianPrice === "number" && medianPrice < 500000) {
    ifBudgetRises = "A price rise would still leave room to manoeuvre.";
  }

  let ifYieldTightens = "A 0.5–1% yield drop is a major shift for the cash-flow calculation.";
  if (typeof yieldPct === "number" && yieldPct > 6.5) {
    ifYieldTightens = "Even with a 1% yield drop, the returns stay competitive.";
  } else if (typeof yieldPct === "number" && yieldPct < 4.5) {
    ifYieldTightens = "Below ~4%, the case for this town becomes much weaker.";
  }

  let ifRiskIncreases = "An upgrade to a higher risk flag would need a real reassessment.";
  if (riskPenalty === 0) {
    ifRiskIncreases = "The town has no major risk flags now, but even a low-level flag could tip the balance.";
  } else if (riskPenalty >= 3) {
    ifRiskIncreases = "Risk is already a factor — further deterioration would make it hard to justify.";
  }

  return {
    primary,
    ifBudgetRises,
    ifYieldTightens,
    ifRiskIncreases,
  };
}

export type StressTestComparison = {
  sydneyWeeklyRent: number;
  regionalWeeklyRent: number;
  regionalWeeklyRepayment: number;
  regionalStampDuty: number;
  regionalUpfrontCost: number;
  regionalNetWeeklyCashFlow: number;
  weeklyCashFlowDifference: number;
  summary: string;
  sydneyNarrative: string;
  regionalNarrative: string;
};

// Today-only cash-flow comparison — deliberately no multi-year wealth
// projection or price-appreciation assumption (AGENTS.md §5j prohibits
// fabricating future price/wealth data for this feature family). Reuses
// the same amortizing mortgage math as InvestmentCalculator/
// ScenarioSimulator via computeCashFlowEstimate so numbers agree across
// the app, instead of an independent flat-rate approximation.
export function buildStressTestComparison(input: {
  sydneyWeeklyRent: number;
  regionalMedianPrice: number;
  regionalGrossYieldPct: number;
  depositPct: number;
  ratePct: number;
  termYears: number;
}): StressTestComparison {
  const regionalWeeklyRent = (input.regionalMedianPrice * (input.regionalGrossYieldPct / 100)) / 52;
  const cashFlow = computeCashFlowEstimate({
    price: input.regionalMedianPrice,
    rent: regionalWeeklyRent,
    depositPct: input.depositPct,
    ratePct: input.ratePct,
    termYears: input.termYears,
  });

  const weeklyCashFlowDifference = cashFlow.netWeeklyCashFlow + input.sydneyWeeklyRent;

  const sydneyNarrative = `Staying in Sydney at $${Math.round(input.sydneyWeeklyRent)}/week in rent is a fixed weekly cost, with no offsetting rental income or equity.`;
  const regionalNarrative =
    cashFlow.netWeeklyCashFlow >= 0
      ? `The regional purchase's estimated rent covers the mortgage repayment today, netting ~$${Math.round(cashFlow.netWeeklyCashFlow)}/week, on top of a ~${formatMoney(cashFlow.upfrontCost)} upfront cost (deposit + stamp duty).`
      : `The regional purchase runs an estimated net shortfall of ~$${Math.round(Math.abs(cashFlow.netWeeklyCashFlow))}/week after the mortgage repayment, on top of a ~${formatMoney(cashFlow.upfrontCost)} upfront cost (deposit + stamp duty).`;

  const summary =
    weeklyCashFlowDifference >= 0
      ? `Today, the regional path leaves you ~$${Math.round(weeklyCashFlowDifference)}/week better off than the Sydney rent figure, before any equity or future price change.`
      : `Today, the regional path costs ~$${Math.round(Math.abs(weeklyCashFlowDifference))}/week more out of pocket than the Sydney rent figure, before any equity or future price change.`;

  return {
    sydneyWeeklyRent: Math.round(input.sydneyWeeklyRent),
    regionalWeeklyRent: Math.round(regionalWeeklyRent),
    regionalWeeklyRepayment: Math.round(cashFlow.weeklyRepayment),
    regionalStampDuty: Math.round(cashFlow.stampDuty),
    regionalUpfrontCost: Math.round(cashFlow.upfrontCost),
    regionalNetWeeklyCashFlow: Math.round(cashFlow.netWeeklyCashFlow),
    weeklyCashFlowDifference: Math.round(weeklyCashFlowDifference),
    summary,
    sydneyNarrative,
    regionalNarrative,
  };
}

function normalizeRisk(level: string | null | undefined): number {
  if (!level) return 0;
  const weights = {
    Low: 1,
    Moderate: 2,
    High: 3,
    "Very High": 4,
    Extreme: 5,
  } as const;
  return weights[level as keyof typeof weights] ?? 0;
}

function unwrapValue<T>(value: T | { value: T } | null | undefined): T | null {
  if (value == null) return null;
  if (typeof value === "object" && "value" in value) {
    return (value as { value: T }).value ?? null;
  }
  return value as T;
}

export function getTownDecisionTag(town: TownDecisionSnapshot): DecisionTag {
  const yieldPct = unwrapValue(town.grossYieldPct);
  const vacancy = unwrapValue(town.vacancyRatePct);
  const medianPrice = unwrapValue(town.medianPrice);
  const riskPenalty = normalizeRisk(town.bushfireRisk?.level) + normalizeRisk(town.floodRisk?.level);
  const infraCount = town.infrastructureProjects?.length ?? 0;

  const isHighYield = typeof yieldPct === "number" && yieldPct >= 6;
  const isLowVacancy = typeof vacancy === "number" && vacancy <= 2.5;
  const isCheapEnough = typeof medianPrice === "number" && medianPrice <= 650000;

  if (isHighYield && isLowVacancy && riskPenalty <= 2) {
    return "yield-heavy";
  }

  if (isCheapEnough && typeof yieldPct === "number" && yieldPct >= 4 && riskPenalty <= 2) {
    return "budget-led";
  }

  if (typeof yieldPct === "number" && yieldPct >= 4.5 && riskPenalty <= 3) {
    return "balanced";
  }

  if (infraCount > 0 || riskPenalty > 0 || (typeof vacancy === "number" && vacancy > 3)) {
    return "needs-review";
  }

  return "needs-review";
}

export function buildDecisionSummary(rows: TownDecisionSnapshot[]): DecisionSummary {
  if (rows.length === 0) {
    return {
      bestFit: null,
      bestFitReason: "No towns to compare.",
      riskAdjusted: null,
      riskAdjustedReason: "No towns to compare.",
      caution: null,
      cautionReason: "No towns to compare.",
    };
  }

  const maxPrice = Math.max(...rows.map((item) => item.medianPrice ?? 0));
  const minPrice = Math.min(...rows.map((item) => item.medianPrice ?? maxPrice));
  const priceRange = Math.max(maxPrice - minPrice, 1);

  const scored = rows
    .map((row) => {
      const yieldPct = row.grossYieldPct ?? 0;
      const vacancy = row.vacancyRatePct ?? 3.5;
      const riskPenalty = normalizeRisk(row.bushfireRisk?.level) + normalizeRisk(row.floodRisk?.level);
      const priceNormalised = row.medianPrice === null
        ? 0
        : (maxPrice - row.medianPrice) / priceRange;
      const infraScore = (row.infrastructureProjects?.length ?? 0) * 0.75;
      const score =
        yieldPct * 3 +
        (6 - vacancy) * 2 +
        priceNormalised * 10 +
        infraScore -
        riskPenalty * 12;

      return { ...row, score, riskPenalty, priceNormalised };
    })
    .sort((a, b) => b.score - a.score);

  const bestFit = scored[0];
  const riskAdjusted = [...scored]
    .sort((a, b) => (b.score - b.riskPenalty * 6) - (a.score - a.riskPenalty * 6))[0];
  const caution = [...scored]
    .sort((a, b) => {
      const aRisk = a.riskPenalty + (a.vacancyRatePct ?? 0);
      const bRisk = b.riskPenalty + (b.vacancyRatePct ?? 0);
      return bRisk - aRisk;
    })[0];

  const reasonFor = (item: typeof scored[number], mode: "best" | "risk" | "caution") => {
    const yieldText = item.grossYieldPct === null ? "yield not available" : `${item.grossYieldPct.toFixed(1)}% gross yield`;
    const priceText = item.medianPrice === null ? "price not available" : `$${item.medianPrice.toLocaleString("en-AU")}`;
    const riskText = item.riskPenalty > 0 ? "some risk flags" : "no major risk flags";

    if (mode === "best") {
      return `${item.town} balances affordability and yield (${yieldText}, ${priceText}) with ${riskText}.`;
    }
    if (mode === "risk") {
      return `${item.town} stays strongest once risk is weighted in, even with a tighter affordability profile.`;
    }
    return `${item.town} looks more exposed: higher vacancy or risk flags could make it a weaker fit.`;
  };

  return {
    bestFit: bestFit?.town ?? null,
    bestFitReason: bestFit ? reasonFor(bestFit, "best") : "No towns to compare.",
    riskAdjusted: riskAdjusted?.town ?? null,
    riskAdjustedReason: riskAdjusted ? reasonFor(riskAdjusted, "risk") : "No towns to compare.",
    caution: caution?.town ?? null,
    cautionReason: caution ? reasonFor(caution, "caution") : "No towns to compare.",
  };
}

export function rankTowns(input: RankInput, allTowns: Town[] = getAllTowns()): RankedTown[] {
  const weights = input.weights ?? DEFAULT_RANK_WEIGHTS;
  // Cadacre's paid shortlist/report is explicitly a *regional* rentvesting
  // product (see AGENTS.md §1/§2) — Sydney Metro suburbs are shown on the
  // free dashboard map for browsing/comparison only and must never surface
  // in the ranked shortlist, regardless of how budget/yield inputs are set.
  const towns = allTowns.filter((town) => (town.region ?? "Regional NSW") === "Regional NSW");
  const comparableTowns = towns.filter(
    (town) => town.medianPrice.value !== null && town.grossYieldPct.value !== null
  );
  const prices = comparableTowns.map((town) => town.medianPrice.value as number);
  const yields = comparableTowns.map((town) => town.grossYieldPct.value as number);
  const vacancies = comparableTowns
    .map((town) => town.vacancyRatePct.value)
    .filter((value): value is number => value !== null);
  const min = (values: number[]) => Math.min(...values);
  const max = (values: number[]) => Math.max(...values);
  const range = (values: number[]) => max(values) - min(values) || 1;
  const score = (town: Town) => {
    const price = town.medianPrice.value as number;
    const yieldPct = town.grossYieldPct.value as number;
    const vacancy = town.vacancyRatePct.value;
    const affordability = ((max(prices) - price) / range(prices)) * weights.affordability;
    const yieldScore = ((yieldPct - min(yields)) / range(yields)) * weights.yield;
    const vacancyWeight = vacancy === null ? 0 : weights.vacancy;
    const vacancyScore = vacancy === null
      ? 0
      : ((max(vacancies) - vacancy) / range(vacancies)) * vacancyWeight;
    const availableWeight = weights.affordability + weights.yield + vacancyWeight || 1;
    return Math.round(((affordability + yieldScore + vacancyScore) / availableWeight) * 100);
  };

  const qualifying = towns.filter((town) => {
    const price = town.medianPrice.value;
    const yieldPct = town.grossYieldPct.value;
    if (price === null || yieldPct === null) return false;
    return price <= input.budget && yieldPct >= input.targetYieldPct;
  });

  qualifying.sort((a, b) => {
    const scoreDiff = score(b) - score(a);
    if (scoreDiff !== 0) return scoreDiff;

    const priceDiff = (a.medianPrice.value as number) - (b.medianPrice.value as number);
    if (priceDiff !== 0) return priceDiff;

    return a.name.localeCompare(b.name);
  });

  return qualifying.map((town, i) => ({ rank: i + 1, town, valueScore: score(town) }));
}
