import { FadeUp, Stagger, StaggerItem } from "@/components/motion/FadeIn";

const sources = [
  {
    name: "Australian Bureau of Statistics",
    detail: "Estimated Resident Population, by Local Government Area",
  },
  {
    name: "PRD Research Hub / Your Investment Property Mag",
    detail: "Median house price, weekly rent, gross rental yield",
  },
  {
    name: "NSW Rural Fire Service",
    detail: "Bush Fire Prone Land mapping, disaster-declaration history",
  },
  {
    name: "NSW State Emergency Service",
    detail: "Flood Data Portal, council flood studies",
  },
  {
    name: "State budget papers / Infrastructure Australia",
    detail: "Publicly announced hospitals, rail, roads, university campuses",
  },
  {
    name: "Open-Meteo",
    detail: "Historical climate normals",
  },
];

export function DataSources() {
  return (
    <section className="border-b border-faded-rule">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <FadeUp className="md:col-span-4">
            <p className="font-mono-figure text-xs uppercase tracking-[0.25em] text-survey-brass">
              03 — On the record
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink-navy">
              Every figure names its source.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
              No figure in Cadacre is estimated to look complete. Where a
              credible public source doesn&apos;t exist for a town, that field
              is marked unavailable — not filled in with a guess.
            </p>
          </FadeUp>

          <div className="md:col-span-8">
            <Stagger className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-faded-rule pt-8 sm:grid-cols-2">
              {sources.map((source) => (
                <StaggerItem key={source.name} className="border-b border-faded-rule pb-6">
                  <p className="font-display text-base font-semibold text-ink-navy">
                    {source.name}
                  </p>
                  <p className="mt-1 text-sm text-charcoal/65">{source.detail}</p>
                </StaggerItem>
              ))}
            </Stagger>
            <p className="mt-8 font-mono-figure text-xs uppercase tracking-wide text-charcoal/50">
              0 sponsored placements in the rankings
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
