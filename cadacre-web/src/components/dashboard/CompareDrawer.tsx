"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSyncExternalStore } from "react";
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

function Row({ label, cells }: { label: string; cells: React.ReactNode[] }) {
  return (
    <div
      className="grid items-center gap-3 border-b border-faded-rule py-2.5"
      style={{ gridTemplateColumns: `7rem repeat(${cells.length}, minmax(0, 1fr))` }}
    >
      <span className="text-xs text-charcoal/60">{label}</span>
      {cells.map((cell, i) => (
        <div key={i}>{cell}</div>
      ))}
    </div>
  );
}

export function CompareDrawer({
  towns,
  open,
  onRemove,
  onClose,
}: {
  towns: Town[];
  open: boolean;
  onRemove: (townId: string) => void;
  onClose: () => void;
}) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && towns.length >= 2 && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[9999] flex items-end justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <motion.div
            role="dialog"
            aria-label="Compare towns"
            className="pointer-events-auto max-h-[70vh] w-full max-w-3xl overflow-y-auto rounded-sm border border-faded-rule bg-parchment shadow-[0_-20px_60px_-25px_rgba(18,22,28,0.5)]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="h-1 w-full bg-survey-brass" aria-hidden />
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="font-mono-figure text-xs uppercase tracking-[0.2em] text-survey-brass">
                  Compare · {towns.length}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => towns.forEach((t) => onRemove(t.id))}
                    className="text-xs font-medium text-charcoal/60 hover:text-ink-navy"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="flex h-7 w-7 items-center justify-center rounded-sm border border-faded-rule text-charcoal/60 transition hover:border-ink-navy hover:text-ink-navy"
                  >
                    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                      <path d="M3 3l10 10M13 3L3 13" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <div className="min-w-[640px]">
                  <Row
                    label="Town"
                    cells={towns.map((t) => (
                      <div key={t.id} className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-display text-sm font-semibold text-ink-navy">{t.name}</p>
                          <p className="text-[10px] text-charcoal/45">{t.state}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove(t.id)}
                          aria-label={`Remove ${t.name} from comparison`}
                          className="text-charcoal/40 hover:text-red-700"
                        >
                          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                            <path d="M3 3l10 10M13 3L3 13" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  />
                  <Row
                    label="Median price"
                    cells={towns.map((t) => (
                      <span key={t.id} className="font-mono-figure text-sm text-ink-navy">
                        {money(t.medianPrice.value)}
                      </span>
                    ))}
                  />
                  <Row
                    label="Median rent"
                    cells={towns.map((t) => (
                      <span key={t.id} className="font-mono-figure text-sm text-ink-navy">
                        {money(t.medianRent.value)}
                      </span>
                    ))}
                  />
                  <Row
                    label="Gross yield"
                    cells={towns.map((t) => (
                      <span key={t.id} className="font-mono-figure text-sm text-ink-navy">
                        {pct(t.grossYieldPct.value)}
                      </span>
                    ))}
                  />
                  <Row
                    label="Vacancy"
                    cells={towns.map((t) => (
                      <span key={t.id} className="font-mono-figure text-sm text-ink-navy">
                        {pct(t.vacancyRatePct.value)}
                      </span>
                    ))}
                  />
                  <Row
                    label="Hazards"
                    cells={towns.map((t) => (
                      <HazardIcons key={t.id} bushfireRisk={t.bushfireRisk} floodRisk={t.floodRisk} />
                    ))}
                  />
                </div>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-charcoal/50">
                General public-data comparison, not personalised financial or
                investment advice.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
