import Link from "next/link";
import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";

const points = [
  { n: "01", title: "Add a watch", body: "Address, suburb, or entire LGA." },
  { n: "02", title: "We check daily", body: "Every DA, rezoning, planning decision." },
  { n: "03", title: "You get the alert", body: "Plain English. Direct link to the council." },
];

export function CouncilWatchTeaser() {
  return (
    <section className="relative border-t border-faded-rule overflow-hidden grad-council">
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:px-8">

        {/* Sanity-style: large section label + massive headline left, content right */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1fr] lg:items-start">
          <SlideIn direction="left" className="lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-survey-brass/20 bg-survey-brass/8 px-3 py-1 text-[11px] font-semibold text-survey-brass">
              Council Watch
            </div>
            <h2 className="mt-5 font-display font-bold leading-[1.05] text-ink-navy"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
              Know before<br />
              the scaffold<br />
              goes up.
            </h2>
            <p className="mt-5 text-base text-charcoal/55 max-w-xs">
              129/130 NSW LGAs. Sourced directly from the NSW Planning Portal.
            </p>
            <div className="mt-7">
              <Link
                href="/sign-up?redirect_url=/council-watch"
                className="group inline-flex items-center gap-2 rounded-full border border-survey-brass bg-survey-brass px-5 py-2.5 text-sm font-semibold text-parchment transition hover:bg-survey-brass/90"
              >
                Start your first watch — free
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </SlideIn>

          <div className="divide-y divide-faded-rule border-t border-faded-rule">
            {points.map((p, i) => (
              <ScaleReveal key={p.n} delay={i * 0.1}>
                <div className="flex items-start gap-6 py-8">
                  <span className="font-mono-figure text-xs font-bold text-survey-brass/40 mt-0.5 w-8 shrink-0">{p.n}</span>
                  <div>
                    <p className="font-display text-lg font-bold text-ink-navy">{p.title}</p>
                    <p className="mt-1.5 text-sm text-charcoal/55">{p.body}</p>
                  </div>
                </div>
              </ScaleReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
