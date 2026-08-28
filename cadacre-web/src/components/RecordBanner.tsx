import { FadeUp, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

const stats = [
  { value: "NSW", label: "Regional towns tracked, updated as sources refresh" },
  { value: "$39", label: "To unlock the full ranked record — once" },
  { value: "0", label: "Sponsored placements in the rankings" },
];

export function RecordBanner() {
  return (
    <section className="relative overflow-hidden border-b border-faded-rule bg-parchment text-ink-navy">
      <ParallaxImage
        src="/pexels-gaion-31344019.jpg"
        alt="Aerial view of a regional Australian town centre"
        className="absolute inset-0"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-parchment/88" />
      <div className="absolute inset-0 bg-linear-to-t from-parchment via-parchment/70 to-parchment/50" />
      <div className="terminal-grid absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <FadeUp className="max-w-xl">
          <p className="font-mono-figure text-xs uppercase tracking-[0.25em] text-survey-brass">
            03 — The record
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink-navy sm:text-4xl">
            Not a hot take. A record — sourced, dated, ranked.
          </h2>
        </FadeUp>

        <Stagger className="mt-16 grid grid-cols-1 gap-10 border-t border-faded-rule pt-10 sm:grid-cols-3">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <span className="font-display text-4xl font-semibold text-ink-navy">
                {stat.value}
              </span>
              <p className="mt-2 max-w-[16rem] font-mono-figure text-xs uppercase tracking-wide text-charcoal/60">
                {stat.label}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
