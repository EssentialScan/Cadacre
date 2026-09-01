import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDecisionSummary,
  buildStressTestComparison,
  getTownDecisionNarrative,
  getTownDecisionSensitivity,
  getTownDecisionTag,
} from "@/lib/rankTowns";

test("classifies strong-yield, low-risk towns as yield-heavy", () => {
  const tag = getTownDecisionTag({
    medianPrice: { value: 500000 },
    grossYieldPct: { value: 6.8 },
    vacancyRatePct: { value: 1.2 },
    bushfireRisk: { level: null },
    floodRisk: { level: null },
    infrastructureProjects: [],
  } as any);

  assert.equal(tag, "yield-heavy");
});

test("classifies a cheap, moderate-yield town as budget-fit", () => {
  const tag = getTownDecisionTag({
    medianPrice: { value: 420000 },
    grossYieldPct: { value: 5.4 },
    vacancyRatePct: { value: 2.1 },
    bushfireRisk: { level: null },
    floodRisk: { level: null },
    infrastructureProjects: [{ text: "Regional health campus" }],
  } as any);

  assert.equal(tag, "budget-led");
});

test("builds a Sydney vs regional stress-test comparison", () => {
  const comparison = buildStressTestComparison({
    sydneyWeeklyRent: 600,
    regionalMedianPrice: 665000,
    regionalGrossYield: 5.8,
    annualWealthGrowth: 0.04,
    initialDeposit: 150000,
    years: 5,
  });

  assert.ok(comparison);
  assert.ok("sydneyWealthAfter" in comparison);
  assert.ok("regionalWealthAfter" in comparison);
  assert.ok("verdict" in comparison);
  assert.ok("sydneyNarrative" in comparison);
  assert.ok("regionalNarrative" in comparison);
  assert.ok(typeof comparison.verdict === "string");
});

test("identifies decision sensitivity levers for a town", () => {
  const sensitivity = getTownDecisionSensitivity({
    town: "Orange",
    medianPrice: 665000,
    grossYieldPct: 5.8,
    vacancyRatePct: 1.8,
    bushfireRisk: { level: null },
    floodRisk: { level: null },
    infrastructureProjects: [{ text: "Regional rail link" }],
  });

  assert.ok(sensitivity);
  assert.ok("primary" in sensitivity);
  assert.ok("ifBudgetRises" in sensitivity);
  assert.ok("ifYieldTightens" in sensitivity);
  assert.ok("ifRiskIncreases" in sensitivity);
});

test("creates a short decision narrative for a town", () => {
  const narrative = getTownDecisionNarrative({
    town: "Orange",
    medianPrice: { value: 665000 },
    grossYieldPct: { value: 5.8 },
    vacancyRatePct: { value: 1.8 },
    bushfireRisk: { level: null },
    floodRisk: { level: null },
    infrastructureProjects: [{ text: "Regional rail link" }],
  } as any);

  assert.match(narrative, /Orange/);
  assert.match(narrative, /yield|budget|risk|decision/i);
});

test("builds a decision summary from ranked towns", () => {
  const summary = buildDecisionSummary([
    {
      town: "Orange",
      medianPrice: 665000,
      grossYieldPct: 5.8,
      vacancyRatePct: 1.8,
      bushfireRisk: { level: null },
      floodRisk: { level: null },
      infrastructureProjects: [{ text: "Regional rail link" }],
    },
    {
      town: "Broken Hill",
      medianPrice: 420000,
      grossYieldPct: 6.9,
      vacancyRatePct: 3.6,
      bushfireRisk: { level: "Moderate" },
      floodRisk: { level: "High" },
      infrastructureProjects: [],
    },
  ]);

  assert.equal(summary.bestFit, "Orange");
  assert.equal(summary.riskAdjusted, "Orange");
  assert.equal(summary.caution, "Broken Hill");
});
