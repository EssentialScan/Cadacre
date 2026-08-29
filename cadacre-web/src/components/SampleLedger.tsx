import { FadeUp, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { DrawRule } from "@/components/motion/DrawRule";
import { HazardIcons } from "@/components/HazardIcons";
import { TownMapToggle } from "@/components/TownMapToggle";
import { getAllTowns } from "@/data";

// Pinned for a stable homepage sample — all three have a complete
// price/rent/yield/vacancy record, so nothing here reads as "unavailable".
const SAMPLE_IDS = ["orange-nsw", "wagga-wagga-nsw", "tamworth-nsw"];

function money(value: number | null): string {
  if (value === null) return "Not available";
  return `$${value.toLocaleString("en-AU")}`;
}

function pct(value: number | null): string {
  if (value === null) return "Not available";
  return `${value.toFixed(1)}%`;
}

export function SampleLedger() {
  const allTowns = getAllTowns();
  const sampleTowns = SAMPLE_IDS.map((id) => allTowns.find((t) => t.id === id)).filter(
    (t): t is NonNullable<typeof t> => t !== undefined
  );

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
              Three real rows from the current record, shown exactly as they
              appear in a shortlist — not a mocked-up example.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="md:col-span-8">
            <div className="rounded-sm border border-faded-rule bg-parchment shadow-[0_30px_60px_-30px_rgba(18,22,28,0.25)]">
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
                    key={row.id}
                    className="ledger-row grid grid-cols-[1fr_repeat(3,minmax(0,0.7fr))_minmax(0,0.55fr)] items-center gap-2 px-5 py-4"
                  >
                    <span className="flex items-center gap-2 font-medium text-ink-navy">
                      <span className="font-mono-figure text-xs text-survey-brass">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {row.name}, {row.state}
                      <TownMapToggle town={row.name} state={row.state} />
                    </span>
                    <span className="font-mono-figure text-sm">{money(row.medianPrice.value)}</span>
                    <span className="font-mono-figure text-sm">{pct(row.grossYieldPct.value)}</span>
                    <span className="font-mono-figure text-sm">{pct(row.vacancyRatePct.value)}</span>
                    <HazardIcons
                      bushfireRisk={row.bushfireRisk}
                      floodRisk={row.floodRisk}
                    />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
            <p className="mt-4 text-xs text-charcoal/50">
              Real figures from the current record, each sourced and dated —
              general information, not personalised financial advice.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
