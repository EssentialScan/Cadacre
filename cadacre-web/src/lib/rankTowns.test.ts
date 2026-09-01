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
    town: "Test",
    medianPrice: 500000,
    medianRent: 500,
    grossYieldPct: 6.8,
    vacancyRatePct: 1.2,
    bushfireRisk: { level: null },
    floodRisk: { level: null },
    infrastructureProjects: [],
  });

  assert.equal(tag, "yield-heavy");
});

test("classifies a cheap, moderate-yield town as budget-fit", () => {
  const tag = getTownDecisionTag({
    town: "Test",
    medianPrice: 420000,
    medianRent: 400,
    grossYieldPct: 5.4,
    vacancyRatePct: 2.1,
    bushfireRisk: { level: null },
    floodRisk: { level: null },
    infrastructureProjects: [{ text: "Regional health campus" }],
  });

  assert.equal(tag, "budget-led");
});

test("builds a Sydney vs regional stress-test comparison", () => {
  const comparison = buildStressTestComparison({
    sydneyWeeklyRent: 600,
    regionalMedianPrice: 665000,
    regionalGrossYieldPct: 5.8,
    depositPct: 20,
    ratePct: 7.13,
    termYears: 30,
  });

  assert.ok(comparison);
  assert.ok("regionalNetWeeklyCashFlow" in comparison);
  assert.ok("weeklyCashFlowDifference" in comparison);
  assert.ok("summary" in comparison);
  assert.ok("sydneyNarrative" in comparison);
  assert.ok("regionalNarrative" in comparison);
  assert.ok(typeof comparison.summary === "string");
  assert.ok(Number.isFinite(comparison.weeklyCashFlowDifference));
});

test("stress-test comparison never fabricates a multi-year projection", () => {
  const comparison = buildStressTestComparison({
    sydneyWeeklyRent: 600,
    regionalMedianPrice: 665000,
    regionalGrossYieldPct: 5.8,
    depositPct: 20,
    ratePct: 7.13,
    termYears: 30,
  });

  assert.ok(!("sydneyWealthAfter" in comparison));
  assert.ok(!("regionalWealthAfter" in comparison));
  assert.ok(!("verdict" in comparison));
});

test("identifies decision sensitivity levers for a town", () => {
  const sensitivity = getTownDecisionSensitivity({
    town: "Orange",
    medianPrice: 665000,
    medianRent: 550,
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

test("decision sensitivity uses real medianRent, not a guessed formula", () => {
  const sensitivity = getTownDecisionSensitivity({
    town: "Orange",
    medianPrice: 2000000, // deliberately high, so a price-based guess would be wrong
    medianRent: 60,
    grossYieldPct: 5.8,
    vacancyRatePct: 1.8,
    bushfireRisk: { level: null },
    floodRisk: { level: null },
    infrastructureProjects: [],
  });

  assert.match(sensitivity.primary, /60/);

  const unavailable = getTownDecisionSensitivity({
    town: "Orange",
    medianPrice: 665000,
    medianRent: null,
    grossYieldPct: 5.8,
    vacancyRatePct: 1.8,
    bushfireRisk: { level: null },
    floodRisk: { level: null },
    infrastructureProjects: [],
  });

  assert.match(unavailable.primary, /isn't published/);
});

test("creates a short decision narrative for a town", () => {
  const narrative = getTownDecisionNarrative({
    town: "Orange",
    medianPrice: 665000,
    medianRent: 550,
    grossYieldPct: 5.8,
    vacancyRatePct: 1.8,
    bushfireRisk: { level: null },
    floodRisk: { level: null },
    infrastructureProjects: [{ text: "Regional rail link" }],
  });

  assert.match(narrative, /Orange/);
  assert.match(narrative, /yield|budget|risk|decision/i);
});

test("builds a decision summary from ranked towns", () => {
  const summary = buildDecisionSummary([
    {
      town: "Orange",
      medianPrice: 665000,
      medianRent: 550,
      grossYieldPct: 5.8,
      vacancyRatePct: 1.8,
      bushfireRisk: { level: null },
      floodRisk: { level: null },
      infrastructureProjects: [{ text: "Regional rail link" }],
    },
    {
      town: "Broken Hill",
      medianPrice: 420000,
      medianRent: 350,
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
