import { Check, X } from "lucide-react";

const comparisons = [
  {
    competitor: "Fractional Property (BrickX, DomaCom)",
    weakness: "High fees, illiquid, and often niche.",
    advantage: "Fully liquid, 100% free to compare, and no regulatory burden.",
  },
  {
    competitor: "Generic Comparison (Finder, Canstar)",
    weakness: "Shallow coverage and pay-to-play licensed ratings.",
    advantage: "Deep, REIT-specific metrics. Structurally neutral with no rankings to buy.",
  },
  {
    competitor: "Standard Trackers (Sharesight)",
    weakness: "Treats REITs like generic shares, ignoring complex distributions.",
    advantage: "REIT-native tax component tracking (Capital Gains, Tax Deferred, Foreign Income).",
  },
  {
    competitor: "Raw Exchange Data (ASX)",
    weakness: "Authoritative, but terrible user experience and hard to analyze.",
    advantage: "A friendly, tool-first layer built on top of raw, accurate data.",
  },
  {
    competitor: "Institutional Data (Bloomberg, CoreLogic)",
    weakness: "Enterprise-priced and overkill for individuals or small advisors.",
    advantage: "Right-sized, affordable, and opinion-free via our B2B data API.",
  },
];

export function CompetitivePositioningSection() {
  return (
    <section className="py-24 bg-white relative border-y border-border overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue/5 via-transparent to-transparent opacity-50" />
      
      <div className="mx-auto max-w-5xl px-6 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Why choose <span className="text-brand-blue">REITCompare</span>?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            There are plenty of ways to look at property and shares, but none of them are built specifically for the unique nuances of Australian REITs. Here is how we stack up.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider text-muted-foreground w-1/3">The Alternative</th>
                  <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider text-muted-foreground w-1/3 bg-data-red/5">Their Way</th>
                  <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider text-brand-blue w-1/3 bg-brand-blue/5">Our Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisons.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/10 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-foreground">
                      {item.competitor}
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground bg-data-red/5">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-data-red shrink-0 mt-0.5" />
                        <span>{item.weakness}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-foreground bg-brand-blue/5">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-brand-blue shrink-0 mt-0.5 stroke-[3]" />
                        <span>{item.advantage}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
