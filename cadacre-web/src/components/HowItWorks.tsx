import { FadeUp, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { DrawRule } from "@/components/motion/DrawRule";

const steps = [
  {
    n: "I",
    title: "Enter your numbers",
    body: "Budget, and the gross yield you need to make the sums work. Fifteen seconds. No account, no card.",
  },
  {
    n: "II",
    title: "Cadacre checks the record",
    body: "Every regional town on file is checked against your criteria — median price, gross yield, vacancy rate. Only the ones that clear the bar make your list.",
  },
  {
    n: "III",
    title: "Get your ranked shortlist",
    body: "Top 3 towns, free, ranked by yield. Subscribe monthly to unlock the full list, a downloadable report, and every other Cadacre tool — less than a week of Sydney rent.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-faded-rule">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <FadeUp>
            <p className="font-mono-figure text-xs uppercase tracking-[0.25em] text-survey-brass">
              02 — Method
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-ink-navy sm:text-4xl">
              Three steps. No sales pitch.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="max-w-xs text-sm text-charcoal/60">
              Drawn entirely from public housing data — nothing proprietary,
              nothing withheld until you pay.
            </p>
          </FadeUp>
        </div>

        <Stagger className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {steps.map((step) => (
            <StaggerItem key={step.n}>
              <DrawRule className="mb-5" />
              <span className="font-display text-3xl font-semibold text-survey-brass">
                {step.n}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink-navy">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
                {step.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
