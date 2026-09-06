"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const groups = [
  {
    id: "council",
    label: "Council Watch",
    tagline: "Know before the scaffold goes up.",
    color: "text-survey-brass",
    bg: "bg-survey-brass",
    steps: [
      { n: "01", title: "Add a watch", body: "Address, suburb, or full LGA. One free watch, no card." },
      { n: "02", title: "We check the portal daily", body: "Every DA, rezoning, and planning decision matched against your watch." },
      { n: "03", title: "Plain-English alert", body: "Short summary + direct link to the council listing. Never a rating." },
    ],
  },
  {
    id: "shortlist",
    label: "Rentvesting shortlist",
    tagline: "Find where to buy when you can't buy here.",
    color: "text-teal-bright",
    bg: "bg-teal-bright",
    steps: [
      { n: "01", title: "Browse the map free", body: "Every regional town's public record — price, yield, vacancy." },
      { n: "02", title: "Compare your rent", body: "One free suburb check against Cadacre's rent-vs-rentvest data." },
      { n: "03", title: "Subscribe for the rest", body: "Full ranked shortlist, scenario tools, portfolio tracker, AI concierge." },
    ],
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const group = groups[active];

  return (
    <section id="how-it-works" className="border-t border-faded-rule grad-how">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">

        <SlideIn>
          <p className="font-mono-figure text-[10px] font-bold uppercase tracking-[0.3em] text-survey-brass">
            02 — How it works
          </p>
          <h2 className="mt-5 font-display font-bold leading-[1.05] text-ink-navy"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
            Two ways to see what&apos;s coming.
          </h2>
        </SlideIn>

        {/* Sanity-style numbered tab list */}
        <div className="mt-12 flex gap-1 rounded-full border border-faded-rule bg-white/60 p-1 backdrop-blur-sm w-fit">
          {groups.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setActive(i)}
              className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200 ${
                active === i ? "text-parchment" : "text-charcoal/60 hover:text-ink-navy"
              }`}
            >
              {active === i && (
                <motion.span
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-full bg-ink-navy"
                  transition={{ duration: 0.3, ease: EASE }}
                />
              )}
              <span className="relative z-10">{g.label}</span>
            </button>
          ))}
        </div>

        {/* Content area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-10 grid gap-8 md:grid-cols-3"
          >
            {group.steps.map((step, si) => (
              <ScaleReveal key={step.n} delay={si * 0.08}>
                <div className="glass-panel rounded-xl p-7 h-full border-t-2 border-faded-rule hover:border-survey-brass/30 transition-colors">
                  <span className={`font-mono-figure text-xs font-bold ${group.color}`}>{step.n}</span>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink-navy leading-snug">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{step.body}</p>
                </div>
              </ScaleReveal>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
