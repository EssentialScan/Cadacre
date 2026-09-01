import { getAllTowns, type Town } from "@/data";

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
  const riskPenalty = normalizeRisk(town.bushfireRisk?.level) + normalizeRisk(town.floodRisk?.level);

  let primary = "The numbers are workable within your inputs.";
  if (typeof medianPrice === "number" && typeof yieldPct === "number") {
    const weeklyRent = medianPrice * 0.004; // rough 0.4% annual gross / 52 weeks
    if (weeklyRent > 130) {
      primary = `The weekly cash flow is tight (~$${Math.round(weeklyRent)}) — any yield dip hurts.`;
    } else if (weeklyRent < 80) {
      primary = `Strong cash flow (~$${Math.round(weeklyRent)}/week) is a cushion against downside risk.`;
    }
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
  sydneyWealthAfter: number;
  regionalWealthAfter: number;
  wealthDifference: number;
  verdict: string;
  sydneyNarrative: string;
  regionalNarrative: string;
};

export function buildStressTestComparison(input: {
  sydneyWeeklyRent: number;
  regionalMedianPrice: number;
  regionalGrossYield: number;
  annualWealthGrowth: number;
  initialDeposit: number;
  years: number;
}): StressTestComparison {
  // Sydney scenario: rent stays high, accumulate savings & baseline wealth growth
  const sydneyYearlyRent = input.sydneyWeeklyRent * 52;
  const sydneyWealthAfter =
    input.initialDeposit * Math.pow(1 + input.annualWealthGrowth, input.years) -
    sydneyYearlyRent * input.years; // Rough: savings are reduced by cumulative rent

  // Regional scenario: buy with mortgage, gain equity + rental income
  const mortgageLTV = 0.8; // Borrow 80% of purchase price
  const loanAmount = input.regionalMedianPrice * mortgageLTV;
  const yearlyRentalIncome = input.regionalMedianPrice * (input.regionalGrossYield / 100);
  const yearlyMortgagePayment = loanAmount * 0.07; // ~7% blended rate (conservative)
  const yearlyNetCashFlow = yearlyRentalIncome - yearlyMortgagePayment - 2500; // ~$50/week for maintenance/rates
  const equityGainPerYear = yearlyMortgagePayment - yearlyRentalIncome * 0.2; // Principal paydown
  const regionalWealthAfter =
    input.initialDeposit * Math.pow(1 + input.annualWealthGrowth, input.years) +
    yearlyNetCashFlow * input.years +
    equityGainPerYear * input.years;

  const difference = regionalWealthAfter - sydneyWealthAfter;
  const sydneyNarrative =
    sydneyWealthAfter > 0
      ? `After ${input.years} years, staying in Sydney with rent at $${input.sydneyWeeklyRent}/week leaves you with ~$${Math.round(sydneyWealthAfter).toLocaleString("en-AU")} in wealth (savings + baseline growth). You keep lifestyle flexibility.`
      : `After ${input.years} years, Sydney rent at $${input.sydneyWeeklyRent}/week is eating most of your wealth accumulation. You're priced out of local ownership.`;
  const regionalNarrative =
    difference > 0
      ? `Regional ownership with a $${input.regionalMedianPrice.toLocaleString("en-AU")} purchase and $${input.initialDeposit.toLocaleString("en-AU")} deposit leaves you with ~$${Math.round(regionalWealthAfter).toLocaleString("en-AU")} after ${input.years} years (equity + net cash flow + baseline growth). The extra wealth is worth the lifestyle trade-off.`
      : `Even with regional yield, the wealth path is weaker than staying in Sydney. The break-even point is further out, or your assumptions need tightening.`;

  let verdict = "Sydney stays ahead.";
  if (difference > sydneyWealthAfter * 0.5) {
    verdict = `Regional investment wins: ~$${Math.round(Math.abs(difference)).toLocaleString("en-AU")} more wealth after ${input.years} years.`;
  } else if (difference > 0) {
    verdict = `Regional pulls ahead, but it's close. The decision hinges on your tolerance for lifestyle change and leverage risk.`;
  } else if (difference > sydneyWealthAfter * -0.25) {
    verdict = `Sydney is slightly safer, but the regional option isn't far behind. Consider a longer time horizon.`;
  } else {
    verdict = `Sydney is clearly ahead at ${input.years}-year horizon. Regional makes sense only if you're willing to wait longer for the equity payoff.`;
  }

  return {
    sydneyWealthAfter: Math.round(sydneyWealthAfter),
    regionalWealthAfter: Math.round(regionalWealthAfter),
    wealthDifference: Math.round(difference),
    verdict,
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

  const scored = rows
    .map((row) => {
      const yieldPct = row.grossYieldPct ?? 0;
      const vacancy = row.vacancyRatePct ?? 3.5;
      const riskPenalty = normalizeRisk(row.bushfireRisk?.level) + normalizeRisk(row.floodRisk?.level);
      const maxPrice = Math.max(...rows.map((item) => item.medianPrice ?? 0));
      const minPrice = Math.min(...rows.map((item) => item.medianPrice ?? maxPrice));
      const priceRange = Math.max(maxPrice - minPrice, 1);
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
