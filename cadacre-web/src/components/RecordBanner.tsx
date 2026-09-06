import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

const stats = [
  { value: "NSW", label: "Tracked" },
  { value: "Monthly", label: "Subscription" },
  { value: "0", label: "Paid placements" },
];

export function RecordBanner() {
  return (
    <section className="relative overflow-hidden border-t border-faded-rule grad-record">
      <ParallaxImage
        src="/pexels-gaion-31344019.jpg"
        alt="Aerial view of a regional Australian town"
        className="absolute inset-0"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-parchment/91" />
      <div className="terminal-grid absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <SlideIn>
          <p className="font-mono-figure text-[10px] font-bold uppercase tracking-[0.3em] text-survey-brass">
            04 — The record
          </p>
          <h2 className="mt-5 font-display font-bold leading-[1.05] text-ink-navy"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
            Not a hot take.<br />A record.
          </h2>
        </SlideIn>

        <div className="mt-16 grid grid-cols-3 divide-x divide-faded-rule border-t border-faded-rule">
          {stats.map((s, i) => (
            <ScaleReveal key={s.label} delay={i * 0.1}>
              <div className="pt-8 pl-8 first:pl-0">
                <span className="font-display text-4xl font-bold text-survey-brass sm:text-5xl"
                  style={{ textShadow: "0 0 28px rgba(0,85,255,0.18)" }}>
                  {s.value}
                </span>
                <p className="mt-2 font-mono-figure text-[10px] uppercase tracking-widest text-charcoal/45">{s.label}</p>
              </div>
            </ScaleReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
