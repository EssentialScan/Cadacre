import { SignUpButton } from "@clerk/nextjs";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { DrawRule } from "@/components/motion/DrawRule";
import { Magnetic } from "@/components/motion/Magnetic";

const included = [
  "Full ranked list of every qualifying regional town",
  "Median price, gross yield, and vacancy rate per town",
  "Downloadable PDF report built from your inputs",
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
              One number. No subscription. No catch.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
              A wrong regional pick can cost a lot more than a buyer&apos;s
              agent fee. This costs $39 and takes about two minutes to run.
              Run the free shortlist first — you only pay to unlock the full
              ranked report.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="md:col-span-6 md:col-start-7">
            <DrawRule />
            <div className="flex items-baseline justify-between pt-8">
              <span className="font-mono-figure text-xs uppercase tracking-[0.2em] text-charcoal/50">
                One-time payment
              </span>
              <span className="font-display text-5xl font-semibold text-ink-navy">
                $39
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
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="group relative w-full overflow-hidden rounded-sm bg-ink-navy px-6 py-3 text-sm font-semibold text-parchment">
                  <span className="relative z-10">Unlock the full record</span>
                  <span className="absolute inset-0 z-0 -translate-x-full bg-survey-brass/30 transition-transform duration-300 ease-out group-hover:translate-x-0" />
                </button>
              </SignUpButton>
            </Magnetic>
            <p className="mt-4 text-xs text-charcoal/50">
              No subscription, no recurring charge. Run the free shortlist
              first — you only pay to unlock the full ranked list.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
