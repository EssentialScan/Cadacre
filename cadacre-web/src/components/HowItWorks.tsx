const steps = [
  {
    n: "I",
    title: "Enter your numbers",
    body: "Your budget and the gross rental yield you're targeting. No account required to see your first results.",
  },
  {
    n: "II",
    title: "Cadacre filters the record",
    body: "Every regional town is checked against ABS median price data and SQM vacancy rates. Only towns that clear your criteria make the list.",
  },
  {
    n: "III",
    title: "See your ranked shortlist",
    body: "The top 3 towns are shown free, ranked by yield. The full ranked list — plus a downloadable report — unlocks for a one-time $39.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-faded-rule">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold text-ink-navy">
          How it works
        </h2>
        <p className="mt-3 max-w-xl text-sm text-charcoal/70">
          Three steps, drawn entirely from public housing data.
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="border-t-2 border-ink-navy pt-5">
              <span className="font-display text-2xl font-semibold text-survey-brass">
                {step.n}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink-navy">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
