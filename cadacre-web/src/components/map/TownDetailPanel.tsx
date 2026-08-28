"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Town } from "@/data/towns";
import { HazardIcons } from "@/components/HazardIcons";
import { NearbyContext, type NearbyResearchData } from "@/components/NearbyContext";
import { PropertyWorth } from "@/components/PropertyWorth";
import { PublicRecordLayers } from "@/components/PublicRecordLayers";

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
  location,
  onClose,
}: {
  town: Town | null;
  location?: { lat: number; lng: number } | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [resolvedLocation, setResolvedLocation] = useState<{
    name: string;
    address: string;
    postcode: string | null;
  } | null>(null);
  const [nearbyResearch, setNearbyResearch] = useState<NearbyResearchData | null>(null);

  // SSR-safe "are we mounted on the client" check for the portal below —
  // avoids a setState-in-effect (react-hooks/set-state-in-effect).
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!town && !location) return;
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
  }, [town, location, onClose]);

  if (!mounted) return null;

  const mapLocation = town?.coordinates ?? location;
  const mapsQuery = mapLocation
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        town ? `${town.name}, ${town.state}, Australia` : `${mapLocation.lat},${mapLocation.lng}`
      )}`
    : "";

  return createPortal(
    <AnimatePresence>
      {(town || location) && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
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
            className="relative z-10 flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-faded-rule bg-parchment shadow-[-20px_0_60px_-25px_rgba(18,22,28,0.45)]"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="h-1 w-full bg-survey-brass" aria-hidden />
            <div className="overflow-y-auto p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono-figure text-xs uppercase tracking-[0.2em] text-survey-brass">
                    {town?.state ?? "Map location"}
                  </p>
                  <h2
                    id="town-panel-heading"
                    className="mt-1 font-display text-2xl font-semibold text-ink-navy"
                  >
                    {town?.name ?? "Selected location"}
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

              <div className="mt-6 border border-ink-navy bg-white/60 p-4 shadow-[4px_4px_0_var(--faded-rule)]">
                <p className="font-mono-figure text-[10px] uppercase tracking-[0.18em] text-survey-brass">
                  Location summary
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-ink-navy">
                  {resolvedLocation?.name ?? town?.name ?? "Resolving location…"}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-charcoal/65">
                  {resolvedLocation?.address ?? (town ? `${town.name}, ${town.state}, Australia` : "Finding the address for this pin…")}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-faded-rule pt-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-charcoal/45">Postcode</p>
                    <p className="mt-1 font-mono-figure text-sm text-ink-navy">{resolvedLocation?.postcode ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-charcoal/45">Average price</p>
                    <p className="mt-1 font-mono-figure text-sm text-ink-navy">
                      {town?.medianPrice.value === null || !town ? "—" : `$${town.medianPrice.value.toLocaleString("en-AU")}`}
                    </p>
                  </div>
                </div>
              </div>

              {town ? <div className="mt-6 divide-y divide-faded-rule border-y border-faded-rule">
                <DataRow label="Median price" value={money(town.medianPrice.value)} />
                <DataRow label="Median rent (p.w.)" value={money(town.medianRent.value)} />
                <DataRow
                  label="Gross yield"
                  value={pct(town.grossYieldPct.value)}
                  note={town.derivedYield ? "(derived)" : undefined}
                />
                <DataRow label="Vacancy rate" value={pct(town.vacancyRatePct.value)} />
              </div> : <p className="mt-6 border-y border-faded-rule py-4 text-sm leading-relaxed text-charcoal/70">This point is outside a Cadacre town record. Nearby mapped buildings and amenities are shown below; property listings and valuations are not available from the public map layer.</p>}

              {mapLocation && (
                <NearbyContext
                  lat={mapLocation.lat}
                  lng={mapLocation.lng}
                  onLocationResolved={setResolvedLocation}
                  onContextResolved={setNearbyResearch}
                />
              )}

              {mapLocation && (
                <PropertyWorth
                  address={resolvedLocation?.address ?? (town ? `${town.name}, ${town.state}` : "This selected map location")}
                  areaMedian={town?.medianPrice.value ?? null}
                  research={resolvedLocation && nearbyResearch ? {
                    locationName: resolvedLocation.name,
                    postcode: resolvedLocation.postcode,
                    medianRent: town?.medianRent.value ?? null,
                    grossYieldPct: town?.grossYieldPct.value ?? null,
                    vacancyRatePct: town?.vacancyRatePct.value ?? null,
                    buildings: nearbyResearch.buildings,
                    addressedBuildings: nearbyResearch.addressedBuildings,
                    amenities: nearbyResearch.places,
                    latitude: mapLocation.lat,
                    longitude: mapLocation.lng,
                  } : undefined}
                />
              )}

              {mapLocation && <PublicRecordLayers lat={mapLocation.lat} lng={mapLocation.lng} />}

              {town && <div className="mt-5 flex items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-charcoal/50">
                  Hazards
                </span>
                <HazardIcons
                  bushfireRisk={town.bushfireRisk}
                  floodRisk={town.floodRisk}
                />
              </div>}

              {town && <div className="mt-6">
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
              </div>}

              {town?.notes && (
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
