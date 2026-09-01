import Link from "next/link";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { Magnetic } from "@/components/motion/Magnetic";
import { HeroMapLoader } from "@/components/map/HeroMapLoader";
import type { Town } from "@/data/towns";

export function Hero({ towns }: { towns: Town[] }) {
  return (
    <section className="relative overflow-hidden bg-parchment text-ink-navy">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-8">
        <FadeUp className="pt-8">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono-figure text-[11px] uppercase tracking-[0.25em] text-charcoal/55">
            <span>Cadacre &middot; Regional Property Record</span>
            <span>Est. 2026 &middot; Australia</span>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 items-center gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <FadeUp>
              <p className="font-mono-figure text-xs uppercase tracking-[0.3em] text-survey-brass">
                For Sydney renters priced out of the market
              </p>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h1 className="mt-5 max-w-xl font-sans text-[2.3rem] font-bold leading-[1.12] tracking-tight text-ink-navy sm:text-5xl md:text-[3.4rem]">
                Sydney closed the door.
                <br />
                <span className="text-survey-brass">The record stayed open.</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="mt-7 max-w-lg text-base leading-relaxed text-charcoal/75 sm:text-lg">
                Enter your budget and target yield. Cadacre checks it against
                public housing records for regional Australia and returns a
                ranked shortlist — median price, rental yield, vacancy rate —
                in under two minutes. Sourced, dated, and never sponsored.
              </p>
            </FadeUp>

            <FadeUp delay={0.24} className="mt-10 flex flex-wrap items-center gap-5">
              <Magnetic>
                <Link
                  href="/sign-up?redirect_url=/shortlist"
                  className="group relative inline-flex overflow-hidden rounded-sm bg-ink-navy px-7 py-3.5 text-sm font-semibold text-parchment"
                >
                  <span className="relative z-10">Run your free shortlist</span>
                  <span className="absolute inset-0 z-0 -translate-x-full bg-survey-brass/25 transition-transform duration-300 ease-out group-hover:translate-x-0" />
                </Link>
              </Magnetic>
              <Link
                href="/#sample"
                className="group relative text-sm font-medium text-ink-navy"
              >
                See a sample record
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ink-navy transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            </FadeUp>
          </div>

          <FadeUp delay={0.3} className="lg:col-span-5">
            <div className="terminal-corners overflow-hidden rounded-sm border border-faded-rule bg-white/60 shadow-[0_30px_60px_-30px_rgba(18,22,28,0.25)]">
              <div className="h-70 sm:h-85 lg:h-100">
                <HeroMapLoader towns={towns} />
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal/50">
              Real regional towns, live from the current record — hover a pin,
              or click through to the full map.
            </p>
          </FadeUp>
        </div>

        <div className="relative border-t border-faded-rule">
          <div className="terminal-grid absolute inset-0 bg-parchment/75" aria-hidden />
          <Stagger className="relative grid grid-cols-2 gap-6 py-6 font-mono-figure text-xs uppercase tracking-wide text-charcoal/55 sm:grid-cols-4">
            <StaggerItem>
              <span className="block text-lg font-semibold text-ink-navy normal-case tracking-normal">
                NSW
              </span>
              Regional towns on file
            </StaggerItem>
            <StaggerItem>
              <span className="block text-lg font-semibold text-ink-navy normal-case tracking-normal">
                3 free
              </span>
              Results, no card
            </StaggerItem>
            <StaggerItem>
              <span className="block text-lg font-semibold text-ink-navy normal-case tracking-normal">
                Monthly
              </span>
              One subscription, everything
            </StaggerItem>
            <StaggerItem>
              <span className="block text-lg font-semibold text-ink-navy normal-case tracking-normal">
                0
              </span>
              Sponsored placements
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
