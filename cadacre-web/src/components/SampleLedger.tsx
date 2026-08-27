import { FadeUp, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { DrawRule } from "@/components/motion/DrawRule";
import { TiltCard } from "@/components/motion/TiltCard";
import { HazardIcons } from "@/components/HazardIcons";
import { TownMapToggle } from "@/components/TownMapToggle";

const sampleTowns = [
  {
    name: "Bathurst",
    state: "NSW",
    price: "$612,000",
    yield: "5.1%",
    vacancy: "1.2%",
    bushfireRisk: { level: "Moderate" as const, source: "illustrative" },
    floodRisk: { level: "Low" as const, source: "illustrative" },
  },
  {
    name: "Orange",
    state: "NSW",
    price: "$588,000",
    yield: "5.4%",
    vacancy: "0.9%",
    bushfireRisk: { level: "Low" as const, source: "illustrative" },
    floodRisk: { level: "Low" as const, source: "illustrative" },
  },
  {
    name: "Dubbo",
    state: "NSW",
    price: "$549,000",
    yield: "5.8%",
    vacancy: "1.0%",
    bushfireRisk: { level: "Low" as const, source: "illustrative" },
    floodRisk: { level: "Moderate" as const, source: "illustrative" },
  },
];

export function SampleLedger() {
  return (
    <section id="sample" className="border-b border-faded-rule bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <FadeUp className="md:col-span-4">
            <p className="font-mono-figure text-xs uppercase tracking-[0.25em] text-survey-brass">
              Sample record
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink-navy">
              What arrives in your inbox
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
              A placeholder example — not live data — showing the format
              your shortlist arrives in.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="md:col-span-8">
            <TiltCard className="rounded-sm border border-faded-rule bg-parchment shadow-[0_30px_60px_-30px_rgba(18,22,28,0.25)]">
              <DrawRule />
              <div className="grid grid-cols-[1fr_repeat(3,minmax(0,0.7fr))_minmax(0,0.55fr)] gap-2 border-b border-ink-navy bg-ink-navy px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-parchment">
                <span>Town</span>
                <span>Median price</span>
                <span>Gross yield</span>
                <span>Vacancy rate</span>
                <span>Hazards</span>
              </div>
              <Stagger>
                {sampleTowns.map((row, i) => (
                  <StaggerItem
                    key={row.name}
                    className="ledger-row grid grid-cols-[1fr_repeat(3,minmax(0,0.7fr))_minmax(0,0.55fr)] items-center gap-2 px-5 py-4"
                  >
                    <span className="flex items-center gap-2 font-medium text-ink-navy">
                      <span className="font-mono-figure text-xs text-survey-brass">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {row.name}, {row.state}
                      <TownMapToggle town={row.name} state={row.state} />
                    </span>
                    <span className="font-mono-figure text-sm">{row.price}</span>
                    <span className="font-mono-figure text-sm">{row.yield}</span>
                    <span className="font-mono-figure text-sm">{row.vacancy}</span>
                    <HazardIcons
                      bushfireRisk={row.bushfireRisk}
                      floodRisk={row.floodRisk}
                    />
                  </StaggerItem>
                ))}
              </Stagger>
            </TiltCard>
            <p className="mt-4 text-xs text-charcoal/50">
              Figures and hazard icons shown are illustrative placeholders,
              not current market or emergency-service data.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
