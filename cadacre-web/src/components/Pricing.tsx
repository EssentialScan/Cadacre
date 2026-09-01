import Link from "next/link";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { DrawRule } from "@/components/motion/DrawRule";
import { Magnetic } from "@/components/motion/Magnetic";

const included = [
  "Full ranked list of every qualifying regional town, plus a downloadable PDF",
  "Custom ranking weights, multi-town scenario simulator, and CSV export",
  "Portfolio tracker, rank-drift and hazard alerts, and the relocation-readiness pack",
  "Rent tracker and negotiation-letter generator for renters",
  "One month of free access to the Rentvestor Index newsletter",
];

export function Pricing() {
  return (
    <section id="pricing" className="border-b border-faded-rule bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:items-start">
          <FadeUp className="md:col-span-5">
            <p className="font-mono-figure text-xs uppercase tracking-[0.25em] text-survey-brass">
              05 — Access
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink-navy">
              One subscription. Renters and investors, both covered.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
              A wrong regional pick — or an unfair rent increase you didn&apos;t catch — can cost
              a lot more than this. Browse the free dashboard map and run the free shortlist
              teaser first; subscribe when you&apos;re ready to act on it.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="md:col-span-6 md:col-start-7">
            <DrawRule />
            <div className="flex items-baseline justify-between pt-8">
              <span className="font-mono-figure text-xs uppercase tracking-[0.2em] text-charcoal/50">
                Monthly subscription
              </span>
              <span className="font-display text-5xl font-semibold text-ink-navy">
                Cadacre
              </span>
            </div>

            <Stagger className="mt-8 divide-y divide-faded-rule border-t border-faded-rule">
              {included.map((item) => (
                <StaggerItem
                  key={item}
                  className="flex items-start gap-3 py-3 text-sm text-charcoal/80"
                >
                  <span className="mt-0.5 font-mono-figure text-deep-forest">
                    ✓
                  </span>
                  <span>{item}</span>
                </StaggerItem>
              ))}
            </Stagger>

            <Magnetic strength={0.15} className="mt-10 block w-full">
              <Link
                href="/sign-up?redirect_url=/shortlist"
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-sm bg-ink-navy px-6 py-3 text-sm font-semibold text-parchment"
              >
                <span className="relative z-10">Run the free shortlist first</span>
                <span className="absolute inset-0 z-0 -translate-x-full bg-survey-brass/30 transition-transform duration-300 ease-out group-hover:translate-x-0" />
              </Link>
            </Magnetic>
            <p className="mt-4 text-xs text-charcoal/50">
              No card required to browse or run the free teaser — subscribe only when you want
              the full ranked list and every other tool.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
