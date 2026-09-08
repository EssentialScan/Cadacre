import Link from "next/link";
import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";
import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

const included = [
  "Filterable comparison table across all ASX-listed A-REITs",
  "Interactive national asset map (Sydney built deepest)",
  "Email alerts on NTA discount thresholds and distributions",
  "Individual REIT detail pages with peer modules",
  "No ratings, no recommendations, just data",
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-start">

          <SlideIn direction="left" className="lg:col-span-5 lg:sticky lg:top-24">
            <p className="font-mono-figure text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue">
              05 — Access
            </p>
            <h2 className="mt-5 font-display font-bold leading-[1.05] text-foreground"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              Tool-first data.<br />
              Free to compare.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground max-w-sm">
              REITCompare is currently in early access with a generous free tier. Premium portfolio tools coming soon.
            </p>
          </SlideIn>

          <ScaleReveal delay={0.15} className="lg:col-span-6 lg:col-start-7">
            <Card className="bg-white shadow-sm border border-border transition-all hover:shadow-md rounded-xl">
              <CardHeader className="pb-8">
                <div className="flex items-baseline justify-between">
                  <CardDescription className="font-mono-figure text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue">Free</CardDescription>
                  <CardTitle className="font-display text-3xl font-bold text-foreground tracking-tight">REITCompare</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="border-t border-border/50 pt-8 pb-8">
                <ul className="space-y-4">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-4 text-sm text-muted-foreground font-medium">
                      <span className="font-mono-figure font-bold text-data-green mt-0.5 shrink-0">
                        ✓
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex-col">
                <Magnetic strength={0.15} className="block w-full">
                  <Link href="/sign-up?redirect_url=/dashboard" className="w-full">
                    <Button size="lg" className="w-full rounded-lg btn-premium">
                      Start comparing — free
                    </Button>
                  </Link>
                </Magnetic>
                <p className="mt-4 text-center text-xs text-muted-foreground/50">
                  B2B API and Premium Portfolio features launching in Phase 2.
                </p>
              </CardFooter>
            </Card>
          </ScaleReveal>
        </div>
      </div>
    </section>
  );
}
