"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Town } from "@/data/towns";
import { HazardIcons } from "@/components/HazardIcons";
import { InvestmentCalculator } from "@/components/dashboard/InvestmentCalculator";
import { PriceTrendChart } from "@/components/dashboard/PriceTrendChart";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function money(value: number | null): string {
  if (value === null) return "Not available";
  return `$${value.toLocaleString("en-AU")}`;
}

function pct(value: number | null): string {
  if (value === null) return "Not available";
  return `${value.toFixed(1)}%`;
}

function DataRow({ label, value, note }: { label: string; value: string; note?: string }) {
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
        {note && <span className="ml-2 text-[11px] text-charcoal/40">{note}</span>}
      </span>
    </div>
  );
}

export function TownDetailDrawer({
  town,
  isSaved,
  onToggleSave,
  isComparing,
  canAddToCompare,
  onToggleCompare,
  onClose,
}: {
  town: Town | null;
  isSaved?: boolean;
  onToggleSave?: () => void;
  isComparing?: boolean;
  canAddToCompare?: boolean;
  onToggleCompare?: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${town.name}, ${town.state}, Australia`)}`
    : "";

  return createPortal(
    <AnimatePresence>
      {town && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[9999] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby="town-drawer-heading"
            className="pointer-events-auto relative z-10 flex h-full w-full max-w-md flex-col overflow-hidden border-l border-faded-rule bg-parchment shadow-[-20px_0_60px_-25px_rgba(18,22,28,0.45)]"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="h-1 w-full bg-survey-brass" aria-hidden />
            <div className="overflow-y-auto p-6 sm:p-8">
              <div className="terminal-corners flex items-start justify-between gap-4 border border-faded-rule bg-white/50 p-4">
                <div>
                  <p className="font-mono-figure text-xs uppercase tracking-[0.2em] text-survey-brass">
                    {town?.state}
                  </p>
                  <h2 id="town-drawer-heading" className="mt-1 font-display text-2xl font-semibold text-ink-navy">
                    {town?.name}
                  </h2>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={onToggleSave}
                    aria-pressed={isSaved}
                    aria-label={isSaved ? "Remove from saved towns" : "Save town"}
                    title={isSaved ? "Remove from saved towns" : "Save town"}
                    className={`flex h-8 w-8 items-center justify-center rounded-sm border transition ${
                      isSaved
                        ? "border-survey-brass text-survey-brass"
                        : "border-faded-rule text-charcoal/60 hover:border-ink-navy hover:text-ink-navy"
                    }`}
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round">
                      <path d="M8 1.5l2.02 4.09 4.52.66-3.27 3.19.77 4.5L8 11.77l-4.04 2.17.77-4.5-3.27-3.19 4.52-.66L8 1.5Z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={onToggleCompare}
                    disabled={!isComparing && !canAddToCompare}
                    aria-pressed={isComparing}
                    title={isComparing ? "Remove from comparison" : "Add to comparison"}
                    className={`flex h-8 items-center gap-1 rounded-sm border px-2 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      isComparing
                        ? "border-survey-brass text-survey-brass"
                        : "border-faded-rule text-charcoal/60 hover:border-ink-navy hover:text-ink-navy"
                    }`}
                  >
                    {isComparing ? "Comparing" : "Compare"}
                  </button>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-faded-rule text-charcoal/60 transition hover:border-ink-navy hover:text-ink-navy"
                  >
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                      <path d="M3 3l10 10M13 3L3 13" />
                    </svg>
                  </button>
                </div>
              </div>

              {town && (
                <>
                  <div className="mt-6 divide-y divide-faded-rule border-y border-faded-rule">
                    <DataRow label="Median price" value={money(town.medianPrice.value)} />
                    <DataRow label="Median rent (p.w.)" value={money(town.medianRent.value)} />
                    <DataRow
                      label="Gross yield"
                      value={pct(town.grossYieldPct.value)}
                      note={town.derivedYield ? "(derived)" : undefined}
                    />
                    <DataRow label="Vacancy rate" value={pct(town.vacancyRatePct.value)} />
                    <DataRow
                      label="Population (LGA)"
                      value={town.population?.value ? town.population.value.estimate.toLocaleString("en-AU") : "Not available"}
                      note={
                        town.population?.value?.growthPct !== undefined
                          ? `${town.population.value.growthPct >= 0 ? "+" : ""}${town.population.value.growthPct.toFixed(1)}% (5yr)`
                          : undefined
                      }
                    />
                    <DataRow
                      label="Avg summer max / winter min"
                      value={
                        town.climate?.value
                          ? `${town.climate.value.avgSummerMaxC.toFixed(1)}°C / ${town.climate.value.avgWinterMinC.toFixed(1)}°C`
                          : "Not available"
                      }
                    />
                    <DataRow
                      label="Avg annual rainfall"
                      value={town.climate?.value ? `${town.climate.value.annualRainfallMm.toLocaleString("en-AU")} mm` : "Not available"}
                    />
                    <DataRow
                      label="Property crime (LGA, per 100k)"
                      value={town.crimeRate?.value ? town.crimeRate.value.propertyOffencesPer100k.toLocaleString("en-AU") : "Not available"}
                      note={town.crimeRate?.value ? town.crimeRate.value.period : undefined}
                    />
                    <DataRow
                      label="Unemployment rate (LGA)"
                      value={town.employment?.value ? pct(town.employment.value.unemploymentRatePct) : "Not available"}
                      note={town.employment?.value ? `as of ${town.employment?.asOf}` : undefined}
                    />
                  </div>

                  <div className="mt-4">
                    <h3 className="font-display text-sm font-semibold text-ink-navy">
                      Nearby amenities{town.amenities?.value ? ` (within ${town.amenities.value.radiusKm}km)` : ""}
                    </h3>
                    {town.amenities?.value ? (
                      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-sm border border-faded-rule bg-white/50 py-2">
                          <p className="font-mono-figure text-lg text-ink-navy">{town.amenities.value.schools}</p>
                          <p className="text-[10px] uppercase tracking-wide text-charcoal/50">Schools</p>
                        </div>
                        <div className="rounded-sm border border-faded-rule bg-white/50 py-2">
                          <p className="font-mono-figure text-lg text-ink-navy">{town.amenities.value.hospitals}</p>
                          <p className="text-[10px] uppercase tracking-wide text-charcoal/50">Hospitals</p>
                        </div>
                        <div className="rounded-sm border border-faded-rule bg-white/50 py-2">
                          <p className="font-mono-figure text-lg text-ink-navy">{town.amenities.value.supermarkets}</p>
                          <p className="text-[10px] uppercase tracking-wide text-charcoal/50">Supermarkets</p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-charcoal/50">Not available.</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <h3 className="font-display text-sm font-semibold text-ink-navy">Price trend</h3>
                    {town.priceHistory?.value ? (
                      <PriceTrendChart history={town.priceHistory.value} />
                    ) : (
                      <p className="mt-2 text-xs text-charcoal/50">
                        Not enough public data to show a trend.
                      </p>
                    )}
                  </div>

                  {town.medianPrice.value !== null && town.medianRent.value !== null && (
                    <InvestmentCalculator medianPrice={town.medianPrice.value} medianRent={town.medianRent.value} />
                  )}

                  <div className="mt-5 flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wide text-charcoal/50">Hazards</span>
                    <HazardIcons bushfireRisk={town.bushfireRisk} floodRisk={town.floodRisk} />
                  </div>

                  <div className="mt-6">
                    <h3 className="font-display text-sm font-semibold text-ink-navy">Infrastructure</h3>
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
                    <p className="mt-4 text-xs leading-relaxed text-charcoal/50">{town.notes}</p>
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
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
