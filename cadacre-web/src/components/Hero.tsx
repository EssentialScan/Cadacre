import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";

export function Hero() {
  return (
    <section className="border-b border-faded-rule bg-parchment">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <p className="mb-4 font-mono-figure text-xs uppercase tracking-[0.2em] text-survey-brass">
            Regional investment records · Australia
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-ink-navy sm:text-5xl">
            Priced out of Sydney? Here&apos;s where the numbers say to look
            instead.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-charcoal/80">
            Enter your budget and target yield. Cadacre searches public
            housing records — median price, rental yield, vacancy rate — and
            returns a plain, ranked shortlist of regional towns. No sponsored
            placements, no buyer&apos;s agent pushing you toward their listing.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="rounded-sm bg-survey-brass px-6 py-3 text-sm font-semibold text-ink-navy transition hover:bg-survey-brass/90">
                Run your free shortlist
              </button>
            </SignUpButton>
            <a
              href="#sample"
              className="text-sm font-medium text-ink-navy underline decoration-faded-rule underline-offset-4 hover:decoration-ink-navy"
            >
              See a sample record →
            </a>
          </div>

          <p className="mt-6 text-xs text-charcoal/60">
            First 3 results free. Full ranked report is a one-time $39 — no
            subscription.
          </p>
        </div>

        <LedgerPreviewCard />
      </div>
    </section>
  );
}

function LedgerPreviewCard() {
  const rows = [
    { town: "Bathurst, NSW", price: "$612,000", yield: "5.1%", vacancy: "1.2%", locked: false },
    { town: "Orange, NSW", price: "$588,000", yield: "5.4%", vacancy: "0.9%", locked: false },
    { town: "Dubbo, NSW", price: "$549,000", yield: "5.8%", vacancy: "1.0%", locked: false },
    { town: "———", price: "———", yield: "———", vacancy: "———", locked: true },
    { town: "———", price: "———", yield: "———", vacancy: "———", locked: true },
  ];

  return (
    <div className="rounded-sm border border-faded-rule bg-white/60 shadow-sm">
      <div className="flex items-center justify-between border-b border-faded-rule px-5 py-3">
        <span className="font-display text-sm font-semibold text-ink-navy">
          Shortlist — Budget $650,000 · Target yield 5%
        </span>
        <span className="font-mono-figure text-xs text-charcoal/50">
          Sample
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 border-b border-faded-rule px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-charcoal/50">
        <span>Town</span>
        <span>Median</span>
        <span>Yield</span>
        <span>Vacancy</span>
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className={`ledger-row grid grid-cols-4 gap-2 px-5 py-3 text-sm ${
            row.locked ? "text-charcoal/30" : "text-charcoal"
          }`}
        >
          <span className={row.locked ? "" : "font-medium text-ink-navy"}>
            {row.locked ? "Locked" : row.town}
          </span>
          <span className="font-mono-figure">{row.price}</span>
          <span className="font-mono-figure">{row.yield}</span>
          <span className="font-mono-figure">{row.vacancy}</span>
        </div>
      ))}
      <div className="border-t border-faded-rule px-5 py-3 text-center">
        <Link
          href="#pricing"
          className="text-xs font-medium text-survey-brass hover:text-survey-brass/80"
        >
          Unlock the full ranked record — $39 one-time →
        </Link>
      </div>
    </div>
  );
}
