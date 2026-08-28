// Pure, formula-driven estimators — no fabricated data, just arithmetic on
// user-supplied inputs and NSW Revenue's own published transfer-duty
// brackets (source: revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty,
// 2024-25 general rate schedule, non-first-home-buyer). These are
// illustrative calculators, not a loan quote or financial advice — see the
// disclaimer rendered alongside them in InvestmentCalculator.tsx.

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
