"use client";

import Link from "next/link";

export function DashboardHome() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-faded-rule pb-6">
        <div>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink-navy">Dashboard</h1>
        </div>
      </div>
      <section className="mt-8">
        <p className="text-charcoal/70">
          The REIT portfolio tracker and advanced alerts are coming in Phase 2.
        </p>
        <Link
          href="/comparison"
          className="mt-4 inline-block rounded-sm bg-survey-brass px-4 py-2 text-sm font-medium text-parchment transition hover:bg-survey-brass/90"
        >
          Compare A-REITs
        </Link>
      </section>
    </div>
  );
}
