"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Match = {
  id: string;
  name: string;
  state: string;
  region: string;
  medianPrice: number | null;
  grossYieldPct: number | null;
  vacancyRatePct: number | null;
};

type ConciergeResponse = {
  configured?: boolean;
  answer?: string;
  matches?: Match[];
  message?: string;
  error?: string;
};

function money(value: number | null): string {
  if (value === null) return "Not available";
  return `$${value.toLocaleString("en-AU")}`;
}

function pct(value: number | null): string {
  if (value === null) return "Not available";
  return `${value.toFixed(1)}%`;
}

export function AiConciergeChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConciergeResponse | null>(null);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) return null;

  async function ask() {
    if (!question.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/ai/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = (await response.json()) as ConciergeResponse;
      setResult(data);
    } catch {
      setResult({ configured: true, error: "AI concierge unavailable — try again shortly." });
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[9999] flex items-end justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <motion.div
            role="dialog"
            aria-label="AI concierge"
            className="pointer-events-auto max-h-[70vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-faded-rule bg-parchment shadow-[0_-20px_60px_-25px_rgba(18,22,28,0.5)]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="h-1 w-full bg-survey-brass" aria-hidden />
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="font-mono-figure text-xs uppercase tracking-[0.2em] text-survey-brass">
                  AI concierge · Subscriber
                </p>
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

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && ask()}
                  placeholder="e.g. coastal towns under $600k with low bushfire risk"
                  className="flex-1 rounded-sm border border-faded-rule bg-white px-3 py-2 text-sm outline-none focus:border-ink-navy"
                />
                <button
                  type="button"
                  onClick={ask}
                  disabled={loading}
                  className="rounded-sm bg-ink-navy px-4 py-2 text-sm font-semibold text-parchment transition hover:bg-ink-navy/90 disabled:cursor-not-allowed disabled:bg-ink-navy/40"
                >
                  {loading ? "Asking…" : "Ask"}
                </button>
              </div>

              {result && result.configured === false && result.message && (
                <p className="mt-5 text-sm text-charcoal/60">{result.message}</p>
              )}
              {result?.error && (
                <p className="mt-5 text-sm text-red-700">{result.error}</p>
              )}
              {result?.answer && (
                <div className="mt-5">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-charcoal/80">
                    {result.answer}
                  </p>
                  {result.matches && result.matches.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                      <div className="min-w-140 rounded-sm border border-faded-rule">
                        <div className="grid grid-cols-[1.2fr_repeat(3,minmax(0,0.8fr))] gap-2 border-b border-ink-navy bg-ink-navy px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-parchment">
                          <span>Town</span>
                          <span>Median price</span>
                          <span>Gross yield</span>
                          <span>Vacancy</span>
                        </div>
                        {result.matches.map((m) => (
                          <div
                            key={m.id}
                            className="grid grid-cols-[1.2fr_repeat(3,minmax(0,0.8fr))] items-center gap-2 border-b border-faded-rule px-4 py-3 last:border-b-0"
                          >
                            <span className="font-medium text-ink-navy">{m.name}, {m.state}</span>
                            <span className="font-mono-figure text-sm">{money(m.medianPrice)}</span>
                            <span className="font-mono-figure text-sm">{pct(m.grossYieldPct)}</span>
                            <span className="font-mono-figure text-sm">{pct(m.vacancyRatePct)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <p className="mt-5 text-[11px] leading-relaxed text-charcoal/50">
                Answers are drawn strictly from Cadacre&apos;s own sourced town data — the AI never
                invents a price, yield, or risk level. General information, not personalised
                financial or investment advice.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
