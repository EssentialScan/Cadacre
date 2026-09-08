import Link from "next/link";
import { Magnetic } from "@/components/motion/Magnetic";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { HeroMapLoader } from "@/components/map/HeroMapLoader";
import { Counter } from "@/components/motion/Counter";
import { Button } from "@/components/ui/button";
import type { Town } from "@/data/towns";
import { AmbientHeroBackground } from "@/components/ambient/AmbientHeroBackground";

export function Hero({ towns }: { towns: Town[] }) {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      
      {/* Ambient atmospheric background — self-contained client component */}
      <AmbientHeroBackground />

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 relative z-10 py-20">
        {/* Eyebrow */}
        <SlideIn delay={0.05}>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-[11px] font-medium text-brand-blue">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse" />
            Independent Data Layer · A-REITs
          </div>
        </SlideIn>

        {/* Headline */}
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_480px]">
          <div>
            <SlideIn delay={0.1}>
              <h1 className="font-display font-bold leading-[1.05] tracking-tight text-foreground"
                style={{ fontSize: "clamp(3rem, 6.5vw, 5.5rem)" }}>
                See what<br />
                the filings<br />
                <span className="text-brand-blue">hide.</span>
              </h1>
            </SlideIn>

            <SlideIn delay={0.25} className="mt-7 max-w-lg">
              <p className="text-lg leading-relaxed text-muted-foreground">
                A free comparison and discovery engine for Australian property-backed investing. No ratings, no recommendations, just data.
              </p>
            </SlideIn>

            <SlideIn delay={0.35} className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link href="/explore">
                  <Button size="lg" className="rounded-lg btn-premium px-8">
                    Explore the map
                  </Button>
                </Link>
              </Magnetic>
              <Link href="#compare">
                <Button variant="outline" size="lg" className="rounded-lg shadow-sm hover:bg-muted/50 transition-colors bg-white px-8">
                  Compare REITs
                </Button>
              </Link>
            </SlideIn>

            {/* Stats strip */}
            <SlideIn delay={0.5} className="mt-14 flex flex-wrap gap-x-12 gap-y-6 border-t border-border/60 pt-8">
              {[
                { to: 65, suffix: "+", label: "A-REITs indexed" },
                { to: 1500, suffix: "+", label: "Geocoded assets" },
                { to: 0, suffix: "", label: "Sponsored ratings" },
              ].map(({ to, suffix, label }) => (
                <div key={label}>
                  <div className="font-display text-3xl font-bold text-foreground tabular-nums tracking-tight">
                    <Counter to={to} suffix={suffix} />
                  </div>
                  <div className="mt-1 text-xs font-medium text-muted-foreground">{label}</div>
                </div>
              ))}
            </SlideIn>
          </div>

          {/* Map panel */}
          <SlideIn delay={0.3} direction="right" className="lg:mt-4 relative z-20">
            {/* Parallax wrapper for the image/panel */}
            <div className="relative group lg:w-[115%] lg:-mr-[15%] transition-transform duration-1000 ease-out hover:-translate-y-1">
              {/* Soft atmospheric shadow */}
              <div 
                className="absolute -inset-6 rounded-[2rem] opacity-40 blur-3xl pointer-events-none bg-blend-multiply"
                style={{ background: 'radial-gradient(circle, rgba(15,118,110,0.08) 0%, transparent 70%)' }} 
              />
              
              <div className="relative overflow-hidden rounded-lg bg-white border border-border shadow-[0_8px_32px_rgba(15,23,42,0.06)] h-full min-h-[440px]">
                <HeroMapLoader towns={towns} />
              </div>
              
              {/* Live Data Indicator */}
              <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-left-6 lg:right-auto bg-white  border border-border rounded-lg shadow-sm py-2.5 px-4 flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-blue"></span>
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase leading-none mb-1">Live Status</span>
                  <span className="text-[13px] font-medium text-foreground leading-none">Data updated 2h ago</span>
                </div>
              </div>
            </div>
          </SlideIn>
        </div>
      </div>
    </section>
  );
}

