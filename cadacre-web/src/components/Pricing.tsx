import { SignUpButton } from "@clerk/nextjs";

const included = [
  "Full ranked list of every qualifying regional town",
  "Median price, gross yield, and vacancy rate per town",
  "Downloadable PDF report built from your inputs",
  "One month of free access to the Rentvestor Index newsletter",
];

export function Pricing() {
  return (
    <section id="pricing" className="border-b border-faded-rule bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-lg rounded-sm border border-ink-navy bg-parchment p-8 text-center shadow-sm">
          <p className="font-mono-figure text-xs uppercase tracking-[0.2em] text-survey-brass">
            One-time payment
          </p>
          <p className="mt-3 font-display text-5xl font-semibold text-ink-navy">
            $39
          </p>
          <p className="mt-1 text-sm text-charcoal/60">
            No subscription. No recurring charge.
          </p>

          <ul className="mt-8 space-y-3 text-left text-sm text-charcoal/80">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-deep-forest">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="mt-8 w-full rounded-sm bg-ink-navy px-6 py-3 text-sm font-semibold text-parchment transition hover:bg-ink-navy/90">
              Get your full report
            </button>
          </SignUpButton>

          <p className="mt-4 text-xs text-charcoal/50">
            Run the free shortlist first — you only pay to unlock the full
            ranked report.
          </p>
        </div>
      </div>
    </section>
  );
}
