import { FadeUp, Stagger, StaggerItem } from "@/components/motion/FadeIn";

const faqs = [
  {
    q: "Is this financial advice?",
    a: "No. Cadacre presents general information drawn from public data — median price, gross rental yield, and vacancy rate — as a starting point for your own research. It is not personalised financial or investment advice, and Cadacre is not a licensed advisor, real estate agency, or lending platform.",
  },
  {
    q: "Where does the data come from?",
    a: "Figures are drawn from public real estate data providers and market reports, each with its own reference date and source link. If a real figure isn't available for a town, it's marked as unavailable rather than estimated.",
  },
  {
    q: "Do you get paid to recommend specific towns?",
    a: "No. There are no sponsored placements in the ranked results. Any future paid or referral content will be clearly disclosed, separately from the ranking itself.",
  },
  {
    q: "What exactly do I get with the subscription?",
    a: "The full ranked list of every regional town that clears your budget and yield criteria plus a downloadable PDF report, custom ranking weights, the multi-town scenario simulator, the portfolio tracker, CSV export, the relocation-readiness pack, rank-drift and hazard alerts, the rent tracker, and the negotiation-letter generator. Cancel any time from your account page.",
  },
  {
    q: "Can I get a refund?",
    a: "Reach out to us directly if something doesn't match what was described — we review these individually rather than automating refund decisions. You can also cancel your subscription at any time to stop future charges.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-b border-faded-rule">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <FadeUp className="md:col-span-4">
            <p className="font-mono-figure text-xs uppercase tracking-[0.25em] text-survey-brass">
              06 — Questions
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-ink-navy">
              Frequently asked
            </h2>
          </FadeUp>

          <Stagger className="divide-y divide-faded-rule border-t border-faded-rule md:col-span-8">
            {faqs.map((item, i) => (
              <StaggerItem key={item.q}>
                <details className="group py-6">
                  <summary className="flex cursor-pointer list-none items-baseline gap-4 font-display text-base font-semibold text-ink-navy">
                    <span className="font-mono-figure text-xs text-charcoal/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{item.q}</span>
                    <span className="text-survey-brass transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pl-8 text-sm leading-relaxed text-charcoal/75">
                    {item.a}
                  </p>
                </details>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
