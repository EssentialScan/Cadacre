// Pure, formula-driven estimators — no fabricated data, just arithmetic on
// user-supplied inputs and NSW Revenue's own published transfer-duty
// brackets (source: revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty,
// 2024-25 general rate schedule, non-first-home-buyer). These are
// illustrative calculators, not a loan quote or financial advice — see the
// disclaimer rendered alongside them in InvestmentCalculator.tsx.

// Real RBA-published rate, used only as the calculator's starting point
// (still user-editable) — not the cash rate itself (4.35% as of the same
// date), which would understate what an investor actually pays. This is
// the "discounted" investor variable housing rate — closer to what banks
// actually offer than the "standard" headline rate few borrowers pay.
export const RBA_INVESTOR_VARIABLE_RATE = {
  ratePct: 7.13,
  asOf: "31 July 2026",
  source: "RBA Statistical Table F5 — Indicator Lending Rates (Housing loans; Banks; Variable; Discounted; Investor)",
  sourceUrl: "https://www.rba.gov.au/statistics/tables/csv/f5-data.csv",
};

export function estimateWeeklyRepayment({
  price,
  depositPct,
  ratePct,
  termYears,
}: {
  price: number;
  depositPct: number;
  ratePct: number;
  termYears: number;
}): number {
  const loanAmount = price * (1 - depositPct / 100);
  const monthlyRate = ratePct / 100 / 12;
  const totalPayments = termYears * 12;

  if (loanAmount <= 0 || totalPayments <= 0) return 0;

  const monthlyRepayment =
    monthlyRate === 0
      ? loanAmount / totalPayments
      : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));

  return (monthlyRepayment * 12) / 52;
}

// NSW general transfer duty brackets (non-first-home-buyer), 2024-25 schedule.
const NSW_DUTY_BRACKETS = [
  { upTo: 17_000, base: 0, rate: 0.0125, from: 0 },
  { upTo: 36_000, base: 212, rate: 0.015, from: 17_000 },
  { upTo: 97_000, base: 497, rate: 0.0175, from: 36_000 },
  { upTo: 364_000, base: 1_564, rate: 0.035, from: 97_000 },
  { upTo: 1_212_000, base: 10_909, rate: 0.045, from: 364_000 },
  { upTo: Infinity, base: 49_069, rate: 0.055, from: 1_212_000 },
];

export function estimateNswStampDuty(price: number): number {
  if (price <= 0) return 0;
  const bracket = NSW_DUTY_BRACKETS.find((b) => price <= b.upTo) ?? NSW_DUTY_BRACKETS[NSW_DUTY_BRACKETS.length - 1];
  return bracket.base + (price - bracket.from) * bracket.rate;
}

// Inverse of estimateWeeklyRepayment: given a weekly repayment budget, solve
// for the loan amount the standard amortization formula supports, then back
// out the equivalent purchase price from depositPct. Used to convert "what a
// renter currently pays per week" into an equivalent purchase budget.
export function estimateAffordablePrice({
  weeklyBudget,
  depositPct,
  ratePct,
  termYears,
}: {
  weeklyBudget: number;
  depositPct: number;
  ratePct: number;
  termYears: number;
}): number {
  if (weeklyBudget <= 0 || depositPct >= 100) return 0;

  const monthlyRepayment = (weeklyBudget * 52) / 12;
  const monthlyRate = ratePct / 100 / 12;
  const totalPayments = termYears * 12;

  if (totalPayments <= 0) return 0;

  const loanAmount =
    monthlyRate === 0
      ? monthlyRepayment * totalPayments
      : (monthlyRepayment * (1 - Math.pow(1 + monthlyRate, -totalPayments))) / monthlyRate;

  return loanAmount / (1 - depositPct / 100);
}

export interface CashFlowEstimate {
  weeklyRepayment: number;
  stampDuty: number;
  deposit: number;
  upfrontCost: number;
  netWeeklyCashFlow: number;
}

// Shared by InvestmentCalculator.tsx and the rent-vs-rentvest comparison page
// so both render identical numbers from identical logic.
export function computeCashFlowEstimate({
  price,
  rent,
  depositPct,
  ratePct,
  termYears,
}: {
  price: number;
  rent: number;
  depositPct: number;
  ratePct: number;
  termYears: number;
}): CashFlowEstimate {
  const weeklyRepayment = estimateWeeklyRepayment({ price, depositPct, ratePct, termYears });
  const stampDuty = estimateNswStampDuty(price);
  const deposit = price * (depositPct / 100);
  const upfrontCost = deposit + stampDuty;
  const netWeeklyCashFlow = rent - weeklyRepayment;

  return { weeklyRepayment, stampDuty, deposit, upfrontCost, netWeeklyCashFlow };
}

export function formatMoney(value: number): string {
  return `$${Math.round(value).toLocaleString("en-AU")}`;
}
