const faqs = [
  {
    q: "Is this financial advice?",
    a: "No. Cadacre presents general information drawn from public data — median price, gross rental yield, and vacancy rate — as a starting point for your own research. It is not personalised financial or investment advice, and Cadacre is not a licensed advisor, real estate agency, or lending platform.",
  },
  {
    q: "Where does the data come from?",
    a: "Median price and demographic figures come from the Australian Bureau of Statistics (ABS). Vacancy rates come from SQM Research. If a real figure isn't available for a town, it's marked as unavailable rather than estimated.",
  },
  {
    q: "Do you get paid to recommend specific towns?",
    a: "No. There are no sponsored placements in the ranked results. Any future paid or referral content will be clearly disclosed, separately from the ranking itself.",
  },
  {
    q: "What exactly do I get for $39?",
    a: "The full ranked list of every regional town that clears your budget and yield criteria, plus a downloadable PDF report. It's a one-time payment — there is no subscription.",
  },
  {
    q: "Can I get a refund?",
    a: "Reach out to us directly if the report doesn't match what was described — we review these individually rather than automating refund decisions.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-b border-faded-rule">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold text-ink-navy">
          Frequently asked
        </h2>
        <div className="mt-10 divide-y divide-faded-rule">
          {faqs.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base font-semibold text-ink-navy">
                {item.q}
                <span className="ml-4 text-survey-brass transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
