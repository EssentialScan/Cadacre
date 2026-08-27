import { SignUpButton } from "@clerk/nextjs";
import { FadeUp } from "@/components/motion/FadeIn";
import { Magnetic } from "@/components/motion/Magnetic";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-b border-faded-rule bg-white/40 text-ink-navy">
      <ParallaxImage
        src="/pexels-volkerthimm-27307400.jpg"
        alt="A regional residential street at dusk"
        className="absolute inset-0"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-parchment/90" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center sm:px-8">
        <FadeUp>
          <p className="font-mono-figure text-xs uppercase tracking-[0.25em] text-survey-brass">
            05 — Get started
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-ink-navy sm:text-5xl">
            You already have enough for a deposit.
            <br />
            Just not here.
          </h2>
          <p className="mt-5 text-sm text-charcoal/70 sm:text-base">
            Run the numbers on eighteen towns that might actually work —
            free, in under two minutes, no card required.
          </p>
        </FadeUp>
        <FadeUp delay={0.15} className="mt-10">
          <Magnetic>
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="group relative overflow-hidden rounded-sm bg-ink-navy px-7 py-3.5 text-sm font-semibold text-parchment">
                <span className="relative z-10">Run your free shortlist</span>
                <span className="absolute inset-0 z-0 -translate-x-full bg-survey-brass/25 transition-transform duration-300 ease-out group-hover:translate-x-0" />
              </button>
            </SignUpButton>
          </Magnetic>
        </FadeUp>
      </div>
    </section>
  );
}
