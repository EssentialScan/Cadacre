import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";

const sources = [
  { abbr: "ASX", name: "Australian Securities Exchange", detail: "Filings and prices" },
  { abbr: "OM", name: "Open-Meteo", detail: "Climate normals for assets" },
];

export function DataSources() {
  return (
    <section className="border-t border-faded-rule grad-data">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">

        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <SlideIn direction="left" className="md:col-span-4 md:sticky md:top-24">
            <p className="font-mono-figure text-[10px] font-bold uppercase tracking-[0.3em] text-survey-brass">
              03 — Sources
            </p>
            <h2 className="mt-5 font-display font-bold leading-[1.05] text-ink-navy"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
              Every figure cites its source.
            </h2>
            <p className="mt-4 text-sm text-charcoal/50 max-w-xs">
              If a real source doesn&apos;t exist, it&apos;s marked unavailable. Never estimated.
            </p>
          </SlideIn>

          {/* Sanity-style: bento grid of source cards */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {sources.map((src, i) => (
                <ScaleReveal key={src.abbr} delay={i * 0.06}>
                  <div className="group glass-panel rounded-xl p-5 h-full border border-faded-rule/60 transition hover:border-survey-brass/25 hover:shadow-[0_0_0_1px_rgba(0,85,255,0.12)]">
                    <span className="font-mono-figure text-xl font-bold text-ink-navy/25 group-hover:text-survey-brass/50 transition-colors">
                      {src.abbr}
                    </span>
                    <p className="mt-3 text-xs font-semibold text-ink-navy leading-snug">{src.name}</p>
                    <p className="mt-1 text-xs text-charcoal/45">{src.detail}</p>
                  </div>
                </ScaleReveal>
              ))}
            </div>
            <p className="mt-6 font-mono-figure text-[10px] uppercase tracking-widest text-charcoal/35">
              0 sponsored placements in the rankings
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
