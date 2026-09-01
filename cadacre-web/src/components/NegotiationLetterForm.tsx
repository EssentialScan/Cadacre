"use client";

import { useState } from "react";
import type { Town } from "@/data/towns";

export function NegotiationLetterForm({ suburbs }: { suburbs: Town[] }) {
  const [suburbId, setSuburbId] = useState(suburbs[0]?.id ?? "");
  const [currentRent, setCurrentRent] = useState("");
  const [proposedRent, setProposedRent] = useState("");

  const suburb = suburbs.find((t) => t.id === suburbId) ?? null;
  const current = Number(currentRent);
  const proposed = Number(proposedRent);
  const increasePct =
    Number.isFinite(current) && current > 0 && Number.isFinite(proposed)
      ? ((proposed - current) / current) * 100
      : null;

  const downloadUrl =
    suburb && Number.isFinite(current) && current > 0 && Number.isFinite(proposed) && proposed > 0
      ? `/api/negotiation-letter?suburbId=${encodeURIComponent(suburb.id)}&currentRent=${current}&proposedRent=${proposed}`
      : undefined;

  return (
    <div className="rounded-sm border border-faded-rule bg-white/50 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="suburb" className="block text-sm font-medium text-ink-navy">
            Suburb
          </label>
          <select
            id="suburb"
            value={suburbId}
            onChange={(e) => setSuburbId(e.target.value)}
            className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 font-mono-figure text-sm outline-none focus:border-ink-navy"
          >
            {suburbs.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}, {t.state}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="currentRent" className="block text-sm font-medium text-ink-navy">
            Current rent (p.w.)
          </label>
          <input
            id="currentRent"
            type="number"
            min={0}
            step={5}
            value={currentRent}
            onChange={(e) => setCurrentRent(e.target.value)}
            placeholder="650"
            className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 font-mono-figure text-sm outline-none focus:border-ink-navy"
          />
        </div>
        <div>
          <label htmlFor="proposedRent" className="block text-sm font-medium text-ink-navy">
            Proposed rent (p.w.)
          </label>
          <input
            id="proposedRent"
            type="number"
            min={0}
            step={5}
            value={proposedRent}
            onChange={(e) => setProposedRent(e.target.value)}
            placeholder="720"
            className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 font-mono-figure text-sm outline-none focus:border-ink-navy"
          />
        </div>
      </div>

      {suburb && (
        <p className="mt-5 text-sm text-charcoal/70">
          {suburb.name}&apos;s sourced median rent is{" "}
          <span className="font-mono-figure text-ink-navy">
            ${suburb.medianRent.value?.toLocaleString("en-AU")}/week
          </span>
          {increasePct !== null && (
            <>
              . Your proposed increase is{" "}
              <span className="font-mono-figure text-ink-navy">
                {increasePct >= 0 ? "+" : ""}
                {increasePct.toFixed(1)}%
              </span>
              .
            </>
          )}
        </p>
      )}

      {downloadUrl ? (
        <a
          href={downloadUrl}
          className="mt-5 inline-block rounded-sm bg-ink-navy px-5 py-2.5 text-sm font-semibold text-parchment transition hover:bg-ink-navy/90"
        >
          Download negotiation letter (PDF)
        </a>
      ) : (
        <p className="mt-5 text-xs text-charcoal/50">
          Enter your current and proposed rent to generate a letter.
        </p>
      )}
    </div>
  );
}
