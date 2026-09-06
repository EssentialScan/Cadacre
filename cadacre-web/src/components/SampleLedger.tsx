import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";
import { DrawRule } from "@/components/motion/DrawRule";
import { HazardIcons } from "@/components/HazardIcons";
import { TownMapToggle } from "@/components/TownMapToggle";
import { getAllTowns } from "@/data";

const SAMPLE_IDS = ["orange-nsw", "wagga-wagga-nsw", "tamworth-nsw"];

function money(value: number | null): string {
  if (value === null) return "—";
  return `$${value.toLocaleString("en-AU")}`;
}

function pct(value: number | null): string {
  if (value === null) return "—";
  return `${value.toFixed(1)}%`;
}

export function SampleLedger() {
  const allTowns = getAllTowns();
  const sampleTowns = SAMPLE_IDS.map((id) => allTowns.find((t) => t.id === id)).filter(
    (t): t is NonNullable<typeof t> => t !== undefined
  );

  return (
    <section id="sample" className="border-t border-faded-rule grad-sample">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <SlideIn direction="left" className="lg:col-span-4 lg:sticky lg:top-24">
            <p className="font-mono-figure text-[10px] font-bold uppercase tracking-[0.3em] text-survey-brass">
              Sample record
            </p>
            <h2 className="mt-5 font-display font-bold leading-[1.05] text-ink-navy"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
              Three real rows. Exactly as filed.
            </h2>
            <p className="mt-4 text-sm text-charcoal/50 max-w-xs">
              Real figures, publicly sourced and dated — general information, not personalised advice.
            </p>
          </SlideIn>

          <ScaleReveal delay={0.1} className="lg:col-span-8">
            <div className="terminal-corners glass-panel rounded-xl overflow-hidden glow-blue">
              <DrawRule />
              <div
                className="grid grid-cols-[1fr_repeat(3,minmax(0,0.7fr))_minmax(0,0.5fr)] gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-parchment"
                style={{ background: "var(--survey-brass)" }}
              >
                <span>Town</span>
                <span>Price</span>
                <span>Yield</span>
                <span>Vacancy</span>
                <span>Risk</span>
              </div>
              {sampleTowns.map((row, i) => (
                <div
                  key={row.id}
                  className="ledger-row grid grid-cols-[1fr_repeat(3,minmax(0,0.7fr))_minmax(0,0.5fr)] items-center gap-2 px-6 py-6 transition-colors hover:bg-survey-brass/[0.03]"
                >
                  <span className="flex items-center gap-2.5 font-medium text-ink-navy">
                    <span className="font-mono-figure text-xs font-bold text-survey-brass/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {row.name}
                    <TownMapToggle town={row.name} state={row.state} />
                  </span>
                  <span className="font-mono-figure text-sm">{money(row.medianPrice.value)}</span>
                  <span className="font-mono-figure text-sm font-semibold text-teal-bright">{pct(row.grossYieldPct.value)}</span>
                  <span className="font-mono-figure text-sm">{pct(row.vacancyRatePct.value)}</span>
                  <HazardIcons bushfireRisk={row.bushfireRisk} floodRisk={row.floodRisk} />
                </div>
              ))}
            </div>
          </ScaleReveal>
        </div>
      </div>
    </section>
  );
}
