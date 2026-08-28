"use client";

import { useState } from "react";

export function PropertyWorth({
  address,
  areaMedian,
  research,
}: {
  address: string;
  areaMedian: number | null;
  research?: {
    locationName: string;
    postcode: string | null;
    medianRent: number | null;
    grossYieldPct: number | null;
    vacancyRatePct: number | null;
    buildings: number;
    addressedBuildings: number;
    amenities: { name?: string; type?: string }[];
    latitude?: number;
    longitude?: number;
  };
}) {
  const [requested, setRequested] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [officialSources, setOfficialSources] = useState<{ title: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function requestResearch() {
    if (!research) return;
    setLoading(true);
    try {
      const response = await fetch("/api/ai/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...research, address }),
      });
      const result = (await response.json()) as { summary?: string; message?: string; error?: string; officialSources?: { title: string; url: string }[] };
      setSummary(result.summary ?? result.message ?? result.error ?? "No AI summary returned.");
      setOfficialSources(result.officialSources ?? []);
    } catch {
      setSummary("AI research is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6 border-y border-ink-navy bg-white/30 px-4 py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono-figure text-[10px] uppercase tracking-[0.18em] text-survey-brass">
            Property worth
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink-navy">
            Worth checking, not worth guessing
          </h3>
        </div>
        <span className="rounded-sm border border-faded-rule px-2 py-1 font-mono-figure text-[10px] text-charcoal/50">
          AREA BENCHMARK
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
        {address}. Map data can locate a property, but it cannot tell us its
        condition, improvements, bedrooms, land size, or sale history.
      </p>
      {areaMedian !== null && (
        <div className="mt-4 flex items-end justify-between gap-4 border-t border-faded-rule pt-4">
          <div>
            <p className="text-xs text-charcoal/50">Nearest town median benchmark</p>
            <p className="mt-1 font-mono-figure text-2xl text-ink-navy">
              ${areaMedian.toLocaleString("en-AU")}
            </p>
          </div>
          <span className="max-w-[150px] text-right text-[11px] leading-relaxed text-charcoal/50">
            Not this property&apos;s value
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          setRequested(true);
          void requestResearch();
        }}
        className="mt-5 rounded-sm bg-ink-navy px-4 py-2.5 text-xs font-semibold text-parchment transition hover:bg-deep-forest"
      >
        {loading ? "Researching verified records…" : requested ? "Refresh AI research" : "Explain this location with AI"}
      </button>
      {requested && (
        <div className="mt-3 text-xs leading-relaxed text-charcoal/60">
          {summary ?? "The AI can summarize verified map and town facts, but it cannot create an exact property valuation."}
          {officialSources.length > 0 && (
            <div className="mt-4 border-t border-faded-rule pt-3">
              <p className="font-mono-figure text-[10px] uppercase tracking-wide text-deep-forest">Government catalogue matches</p>
              <ul className="mt-2 space-y-1">
                {officialSources.slice(0, 5).map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-survey-brass hover:text-ink-navy">{source.title} ↗</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}