"use client";

import { useState } from "react";
import type { WatchKind } from "@/app/council-watch/types";
import { NORMALIZED_NSW_LGAS } from "@/lib/councilWatch/nswLgas";

export function AddWatchForm({
  coveredLgas,
  onSubmit,
  submitting,
  error,
}: {
  coveredLgas: string[];
  onSubmit: (input: {
    kind: WatchKind;
    label: string;
    addressLine?: string;
    suburbName?: string;
    lgaDisplayName?: string;
  }) => void;
  submitting: boolean;
  error: string | null;
}) {
  const [kind, setKind] = useState<WatchKind>("lga");
  const [label, setLabel] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [suburbName, setSuburbName] = useState("");
  const [lgaDisplayName, setLgaDisplayName] = useState("");

  const covered = new Set(coveredLgas);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ kind, label, addressLine, suburbName, lgaDisplayName });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-sm border border-faded-rule bg-white/60 p-6">
      <h2 className="font-display text-lg text-ink-navy">Add a watch</h2>

      <div className="mt-4 flex gap-2">
        {(["lga", "suburb", "address"] as WatchKind[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`rounded-sm border px-3 py-1.5 text-xs font-medium uppercase tracking-wide ${
              kind === k
                ? "border-ink-navy bg-ink-navy text-parchment"
                : "border-faded-rule text-charcoal/60 hover:border-ink-navy"
            }`}
          >
            {k === "lga" ? "Local government area" : k}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">Label</span>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. My investment property"
            className="mt-1 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 text-sm text-charcoal"
          />
        </label>

        {kind === "lga" && (
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
              Local government area
            </span>
            <select
              value={lgaDisplayName}
              onChange={(e) => setLgaDisplayName(e.target.value)}
              className="mt-1 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 text-sm text-charcoal"
            >
              <option value="">Select an LGA…</option>
              {NORMALIZED_NSW_LGAS.map(({ display, key }) => (
                <option key={display} value={display} disabled={!covered.has(key)}>
                  {display}
                  {covered.has(key) ? "" : " — not covered yet"}
                </option>
              ))}
            </select>
          </label>
        )}

        {kind === "suburb" && (
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">Suburb</span>
            <input
              type="text"
              value={suburbName}
              onChange={(e) => setSuburbName(e.target.value)}
              placeholder="e.g. Orange"
              className="mt-1 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 text-sm text-charcoal"
            />
            <span className="mt-1 block text-[11px] text-charcoal/45">
              Coverage depends on the suburb&apos;s LGA — you&apos;ll see an error if it isn&apos;t covered yet.
            </span>
          </label>
        )}

        {kind === "address" && (
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">Address</span>
            <input
              type="text"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="e.g. 12 Example Street, Orange NSW 2800"
              className="mt-1 w-full rounded-sm border border-faded-rule bg-parchment px-3 py-2 text-sm text-charcoal"
            />
            <span className="mt-1 block text-[11px] text-charcoal/45">
              Matches within ~300m where the source publishes coordinates, otherwise falls back to
              suburb-level — coverage depends on the address&apos;s LGA.
            </span>
          </label>
        )}
      </div>

      {error && <p className="mt-3 text-xs text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 rounded-sm bg-survey-brass px-5 py-2.5 text-sm font-semibold text-ink-navy transition hover:bg-survey-brass/90 disabled:opacity-50"
      >
        {submitting ? "Adding…" : "Add watch"}
      </button>
    </form>
  );
}
