"use client";

type RecordLayer = {
  name: string;
  detail: string;
  status: "source";
  href: string;
};

export function PublicRecordLayers({ lat, lng }: { lat: number; lng: number }) {
  const layers: RecordLayer[] = [
    {
      name: "Planning and zoning",
      detail: "Zoning, development applications, heritage and build controls",
      status: "source",
      href: "https://www.planningportal.nsw.gov.au/spatialviewer/",
    },
    {
      name: "Flood and bushfire",
      detail: "NSW flood studies and bushfire-prone land source maps",
      status: "source",
      href: `https://flooddata.ses.nsw.gov.au/flood-projects/?lat=${lat}&lon=${lng}`,
    },
    {
      name: "Property boundary",
      detail: "NSW Digital Cadastre parcel boundaries",
      status: "source",
      href: "https://data.nsw.gov.au/data/dataset/spatial-services-nsw-cadastre",
    },
    {
      name: "G-NAF address record",
      detail: "Authoritative Australian geocoded address reference",
      status: "source",
      href: "https://data.gov.au/data/dataset/geocoded-national-address-file-g-naf",
    },
    {
      name: "ABS demographics",
      detail: "Population, households, income and regional statistics",
      status: "source",
      href: "https://www.abs.gov.au/census/find-census-data/community-profiles",
    },
    {
      name: "Rental and housing data",
      detail: "NSW rental bond and housing market datasets",
      status: "source",
      href: "https://www.nsw.gov.au/housing-and-construction/rental-forms-surveys-and-data/rental-bond-data",
    },
    {
      name: "Schools and transport",
      detail: "Public schools, stops, roads and infrastructure layers",
      status: "source",
      href: "https://data.nsw.gov.au/",
    },
    {
      name: "Free map context",
      detail: "Live mapped buildings, roads and named amenities",
      status: "source",
      href: "https://www.openstreetmap.org/copyright",
    },
  ];

  return (
    <section className="mt-6 border-t border-faded-rule pt-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-sm font-semibold text-ink-navy">Public record layers</h3>
        <span className="font-mono-figure text-[10px] uppercase tracking-wide text-charcoal/40">8 sources</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-charcoal/60">
        The dossier uses free public sources only. Open a source to inspect the
        official record for this pin; the live map context is queried above.
      </p>
      <div className="mt-4 divide-y divide-faded-rule border-y border-faded-rule">
        {layers.map((layer) => (
          <a
            key={layer.name}
            href={layer.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 py-3 transition hover:bg-survey-brass/5"
          >
            <span>
              <span className="block text-xs font-medium text-ink-navy">{layer.name}</span>
              <span className="mt-0.5 block text-[11px] text-charcoal/55">{layer.detail}</span>
            </span>
            <span className="shrink-0 font-mono-figure text-[9px] uppercase tracking-wide text-deep-forest">
              official source ↗
            </span>
          </a>
        ))}
      </div>
      <p className="mt-4 text-[10px] leading-relaxed text-charcoal/40">
        Source availability and licences vary by dataset. Cadacre does not
        publish an exact property value from public map layers.
      </p>
    </section>
  );
}