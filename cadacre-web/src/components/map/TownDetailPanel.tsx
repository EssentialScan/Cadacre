"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Town } from "@/data/towns";
import { HazardIcons } from "@/components/HazardIcons";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function money(value: number | null): string {
  if (value === null) return "Not available";
  return `$${value.toLocaleString("en-AU")}`;
}

function pct(value: number | null): string {
  if (value === null) return "Not available";
  return `${value.toFixed(1)}%`;
}

function DataRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <span className="text-sm text-charcoal/70">{label}</span>
      <span className="text-right">
        <span
          className={`font-mono-figure text-sm ${
            value === "Not available" ? "text-charcoal/40" : "text-ink-navy"
          }`}
        >
          {value}
        </span>
        {note && (
          <span className="ml-2 text-[11px] text-charcoal/40">{note}</span>
        )}
      </span>
    </div>
  );
}

export function TownDetailPanel({
  town,
  onClose,
}: {
  town: Town | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // SSR-safe "are we mounted on the client" check for the portal below —
  // avoids a setState-in-effect (react-hooks/set-state-in-effect).
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!town) return;
    closeButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [town, onClose]);

  if (!mounted) return null;

  const mapsQuery = town
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${town.name}, ${town.state}, Australia`
      )}`
    : "";

  return createPortal(
    <AnimatePresence>
      {town && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <motion.div
            className="absolute inset-0 bg-ink-navy/40 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="town-panel-heading"
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-sm border border-faded-rule bg-parchment shadow-[0_30px_60px_-25px_rgba(18,22,28,0.45)]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="h-1 w-full bg-survey-brass" aria-hidden />
            <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono-figure text-xs uppercase tracking-[0.2em] text-survey-brass">
                    {town.state}
                  </p>
                  <h2
                    id="town-panel-heading"
                    className="mt-1 font-display text-2xl font-semibold text-ink-navy"
                  >
                    {town.name}
                  </h2>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-faded-rule text-charcoal/60 transition hover:border-ink-navy hover:text-ink-navy"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  >
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 divide-y divide-faded-rule border-y border-faded-rule">
                <DataRow label="Median price" value={money(town.medianPrice.value)} />
                <DataRow label="Median rent (p.w.)" value={money(town.medianRent.value)} />
                <DataRow
                  label="Gross yield"
                  value={pct(town.grossYieldPct.value)}
                  note={town.derivedYield ? "(derived)" : undefined}
                />
                <DataRow label="Vacancy rate" value={pct(town.vacancyRatePct.value)} />
              </div>

              <div className="mt-5 flex items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-charcoal/50">
                  Hazards
                </span>
                <HazardIcons
                  bushfireRisk={town.bushfireRisk}
                  floodRisk={town.floodRisk}
                />
              </div>

              <div className="mt-6">
                <h3 className="font-display text-sm font-semibold text-ink-navy">
                  Infrastructure
                </h3>
                {town.infrastructureProjects.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {town.infrastructureProjects.map((project, i) => (
                      <li key={i} className="text-sm leading-relaxed text-charcoal/75">
                        {project.text}
                        {project.sourceUrl && (
                          <>
                            {" "}
                            <a
                              href={project.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-survey-brass hover:text-survey-brass/80"
                            >
                              source
                            </a>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-charcoal/50">
                    No publicly announced projects on file for this town.
                  </p>
                )}
              </div>

              {town.notes && (
                <p className="mt-4 text-xs leading-relaxed text-charcoal/50">
                  {town.notes}
                </p>
              )}

              <p className="mt-6 text-[11px] leading-relaxed text-charcoal/50">
                Cadacre provides general information based on public data and
                is not personalised financial, investment, or legal advice.
                Figures shown are town-level aggregates, not an assessment of
                any specific property.
              </p>

              <a
                href={mapsQuery}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-xs font-medium text-survey-brass hover:text-survey-brass/80"
              >
                Open in Google Maps — search a specific address →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
