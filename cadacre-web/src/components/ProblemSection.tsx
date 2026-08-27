const points = [
  {
    title: "Sydney is off the table",
    body: "Median house prices have pushed most first-time buyers out of the local market entirely. Renting where you live and buying elsewhere — rentvesting — is the common workaround.",
  },
  {
    title: "But 'elsewhere' is guesswork",
    body: "Most people choose a town from a spreadsheet a friend sent them, a blog post from three years ago, or a buyer's agent with a financial incentive to point them at a specific listing.",
  },
  {
    title: "The data already exists",
    body: "Median price, gross rental yield, and vacancy rate are all public record. Cadacre just puts them in one ranked, filterable place — nothing proprietary, nothing sold to you as insider knowledge.",
  },
];

export function ProblemSection() {
  return (
    <section className="border-b border-faded-rule bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold text-ink-navy">
          Choosing where to invest shouldn&apos;t be guesswork.
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {points.map((point) => (
            <div key={point.title}>
              <h3 className="font-display text-lg font-semibold text-ink-navy">
                {point.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
