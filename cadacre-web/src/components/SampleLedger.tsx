const sampleTowns = [
  { town: "Bathurst, NSW", price: "$612,000", yield: "5.1%", vacancy: "1.2%" },
  { town: "Orange, NSW", price: "$588,000", yield: "5.4%", vacancy: "0.9%" },
  { town: "Dubbo, NSW", price: "$549,000", yield: "5.8%", vacancy: "1.0%" },
];

export function SampleLedger() {
  return (
    <section id="sample" className="border-b border-faded-rule bg-white/40">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold text-ink-navy">
          A sample record
        </h2>
        <p className="mt-3 max-w-xl text-sm text-charcoal/70">
          This is a placeholder example — not live data — showing the format
          your shortlist arrives in.
        </p>

        <div className="mt-10 rounded-sm border border-faded-rule">
          <div className="grid grid-cols-[1fr_repeat(3,minmax(0,0.7fr))] gap-2 border-b border-ink-navy bg-ink-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-parchment">
            <span>Town</span>
            <span>Median price</span>
            <span>Gross yield</span>
            <span>Vacancy rate</span>
          </div>
          {sampleTowns.map((row, i) => (
            <div
              key={row.town}
              className="ledger-row grid grid-cols-[1fr_repeat(3,minmax(0,0.7fr))] items-center gap-2 px-5 py-4"
            >
              <span className="flex items-center gap-2 font-medium text-ink-navy">
                <span className="font-mono-figure text-xs text-survey-brass">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {row.town}
              </span>
              <span className="font-mono-figure text-sm">{row.price}</span>
              <span className="font-mono-figure text-sm">{row.yield}</span>
              <span className="font-mono-figure text-sm">{row.vacancy}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-charcoal/50">
          Figures shown are illustrative placeholders, not current ABS/SQM
          data.
        </p>
      </div>
    </section>
  );
}
