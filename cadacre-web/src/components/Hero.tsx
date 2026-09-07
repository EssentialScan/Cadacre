import Link from "next/link";
import { Magnetic } from "@/components/motion/Magnetic";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { HeroMapLoader } from "@/components/map/HeroMapLoader";
import { Counter } from "@/components/motion/Counter";
import { Button } from "@/components/ui/button";
import type { Town } from "@/data/towns";
import { AmbientDataBackground } from "@/components/ambient/AmbientDataBackground";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export function Hero({ towns }: { towns: Town[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  // Fade out ambient background slightly when scrolling away from hero
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  return (
    <section ref={containerRef} className="relative overflow-hidden min-h-[90vh] flex items-center">
      
      <motion.div className="absolute inset-0" style={{ opacity }}>
        <AmbientDataBackground />
      </motion.div>

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
          <SlideIn delay={0.3} direction="right" className="lg:mt-4 relative group">
            {/* Ambient Glow */}
            <motion.div 
              className="absolute -inset-4 rounded-3xl bg-brand-blue/[0.03] blur-2xl pointer-events-none"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="overflow-hidden rounded-xl bg-white border border-border shadow-premium h-full min-h-[400px] transition-all hover:shadow-premium-hover relative z-10">
              <HeroMapLoader towns={towns} />
            </div>
            <p className="mt-4 text-[11px] font-medium text-muted-foreground/60 text-right uppercase tracking-wider relative z-10">
              Real assets, live from public filings
            </p>
          </SlideIn>
        </div>
      </div>
    </section>
  );
}
