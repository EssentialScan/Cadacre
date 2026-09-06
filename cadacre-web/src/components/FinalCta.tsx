import Link from "next/link";
import { SlideIn } from "@/components/motion/ScrollAnimations";
import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-background">
      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}
      />
      
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-40 text-center sm:px-8">
        <SlideIn>
          <div className="mx-auto w-fit inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-4 py-1.5 text-xs font-semibold text-brand-blue mb-8">
            07 — Start
          </div>
          <h2 className="font-display font-bold leading-[1.02] text-foreground"
            style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)" }}>
            Compare A-REITs<br />
            with actual<br />
            <span className="text-brand-blue">data.</span>
          </h2>
          <p className="mt-8 text-base text-muted-foreground max-w-md mx-auto">
            View their assets nationally. Free to start, no credit card required.
          </p>
        </SlideIn>

        <SlideIn delay={0.2} className="mt-12 flex justify-center">
          <Magnetic>
            <Link href="/sign-up?redirect_url=/dashboard">
              <Button size="lg" className="rounded-full px-10 py-8 text-base shadow-md transition-all">
                Start comparing — free
              </Button>
            </Link>
          </Magnetic>
        </SlideIn>
      </div>
    </section>
  );
}
