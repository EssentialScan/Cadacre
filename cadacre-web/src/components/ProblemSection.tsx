import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";

const points = [
  {
    n: "01",
    title: "Rezonings happen without you.",
    body: "DAs are public record. Nobody's watching them for you.",
  },
  {
    n: "02",
    title: "Sydney already priced you out.",
    body: "Rentvesting is the workaround. Choosing where is the hard part.",
  },
];

export function ProblemSection() {
  return (
    <section className="border-t border-faded-rule grad-problem">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:items-start">

          <SlideIn direction="left" className="md:col-span-4 md:sticky md:top-24">
            <p className="font-mono-figure text-[10px] font-bold uppercase tracking-[0.3em] text-survey-brass">
              01 — The problem
            </p>
            <h2 className="mt-5 font-display font-bold leading-[1.05] text-ink-navy"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
              You find out too late.
            </h2>
          </SlideIn>

          <div className="md:col-span-7 md:col-start-6 divide-y divide-faded-rule border-t border-faded-rule">
            {points.map((point, i) => (
              <ScaleReveal key={point.n} delay={i * 0.1}>
                <div className="grid grid-cols-[3rem_1fr] gap-4 py-10">
                  <span className="font-mono-figure text-xs text-survey-brass/50 pt-1">{point.n}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink-navy">{point.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/55">{point.body}</p>
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
