import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is this financial advice?",
    a: "No. General information from public data only — not personalised financial or investment advice.",
  },
  {
    q: "Where does the data come from?",
    a: "Public ASX filings, annual reports, and structured data providers. If a metric is not disclosed, it is marked unavailable.",
  },
  {
    q: "Paid rankings?",
    a: "No sponsored placements, ever. We don't rank or recommend specific REITs.",
  },
  {
    q: "What's in the premium subscription?",
    a: "Tax-component tracking, advanced multi-condition alerts, portfolio performance vs benchmark, and B2B API access.",
  },
  {
    q: "Can I get a refund?",
    a: "Reach out directly — we review individually. You can also cancel any time to stop future charges.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-start">

          <SlideIn direction="left" className="lg:col-span-4 lg:sticky lg:top-24">
            <p className="font-mono-figure text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue">
              06 — Questions
            </p>
            <h2 className="mt-5 font-display font-bold leading-[1.05] text-foreground tracking-tight"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
              Frequently asked.
            </h2>
          </SlideIn>

          <div className="lg:col-span-8">
            <Accordion className="w-full border-t border-border/50">
              {faqs.map((item, i) => (
                <ScaleReveal key={item.q} delay={i * 0.05}>
                  <AccordionItem value={`item-${i}`} className="border-border/50 py-2">
                    <AccordionTrigger className="hover:no-underline font-display text-lg font-bold text-foreground text-left group transition-all">
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono-figure text-xs font-bold text-muted-foreground w-5 shrink-0 group-hover:text-brand-blue transition-colors">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{item.q}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-9 text-base leading-relaxed text-muted-foreground max-w-2xl">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                </ScaleReveal>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
