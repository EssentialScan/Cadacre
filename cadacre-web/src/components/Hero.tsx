import { SignUpButton } from "@clerk/nextjs";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { Magnetic } from "@/components/motion/Magnetic";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] flex-col overflow-hidden bg-parchment text-ink-navy">
      <ParallaxImage
        src="/pexels-omergulen-19366884.jpg"
        alt="Golden-hour light on a regional apartment façade"
        className="absolute inset-0"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-parchment via-parchment/92 to-parchment/55" />
      <div className="absolute inset-0 bg-linear-to-r from-parchment/85 via-parchment/30 to-parchment/70" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 sm:px-8">
        <FadeUp className="pt-8">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono-figure text-[11px] uppercase tracking-[0.25em] text-charcoal/55">
            <span>Cadacre &middot; Regional Property Record</span>
            <span>Est. 2026 &middot; Australia</span>
          </div>
        </FadeUp>

        <div className="flex flex-1 flex-col justify-center py-16 sm:py-20">
          <FadeUp>
            <p className="font-mono-figure text-xs uppercase tracking-[0.3em] text-survey-brass">
              For Sydney renters priced out of Sydney
            </p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="mt-5 max-w-3xl font-sans text-[2.5rem] font-bold leading-[1.12] tracking-tight text-ink-navy sm:text-6xl md:text-[3.9rem]">
              Sydney closed the door.
              <br />
              The record found{" "}
              <span className="text-survey-brass">eighteen more.</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-charcoal/75 sm:text-lg">
              Enter your budget and target yield. Cadacre checks it against
              public housing records for regional Australia and hands back a
              ranked shortlist — median price, rental yield, vacancy rate.
              Sourced, dated, and never sponsored.
            </p>
          </FadeUp>

          <FadeUp delay={0.24} className="mt-10 flex flex-wrap items-center gap-5">
            <Magnetic>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="group relative overflow-hidden rounded-sm bg-ink-navy px-7 py-3.5 text-sm font-semibold text-parchment">
                  <span className="relative z-10">
                    Run your free shortlist
                  </span>
                  <span className="absolute inset-0 z-0 -translate-x-full bg-survey-brass/25 transition-transform duration-300 ease-out group-hover:translate-x-0" />
                </button>
              </SignUpButton>
            </Magnetic>
            <a
              href="#sample"
              className="group relative text-sm font-medium text-ink-navy"
            >
              See a sample record
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ink-navy transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          </FadeUp>
        </div>

        <Stagger className="grid grid-cols-2 gap-6 border-t border-faded-rule py-6 font-mono-figure text-xs uppercase tracking-wide text-charcoal/55 sm:grid-cols-4">
          <StaggerItem>
            <span className="block text-lg font-semibold text-ink-navy normal-case tracking-normal">
              18
            </span>
            Towns on file
          </StaggerItem>
          <StaggerItem>
            <span className="block text-lg font-semibold text-ink-navy normal-case tracking-normal">
              3 free
            </span>
            Results, no card
          </StaggerItem>
          <StaggerItem>
            <span className="block text-lg font-semibold text-ink-navy normal-case tracking-normal">
              $39
            </span>
            Full record, once
          </StaggerItem>
          <StaggerItem>
            <span className="block text-lg font-semibold text-ink-navy normal-case tracking-normal">
              0
            </span>
            Sponsored placements
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
