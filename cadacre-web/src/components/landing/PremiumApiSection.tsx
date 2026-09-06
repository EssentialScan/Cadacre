"use client";

import { SlideIn, ScaleReveal } from "@/components/motion/ScrollAnimations";
import { Button } from "@/components/ui/button";
import { Check, Code2, Database } from "lucide-react";

export function PremiumApiSection() {
  return (
    <section className="py-24 bg-background border-b border-border">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        
        {/* Premium Upgrade Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="flex flex-col items-start text-left">
            <SlideIn direction="up">
              <h2 className="font-display text-4xl font-bold tracking-tight text-foreground mb-4">
                For when looking isn't enough.
              </h2>
            </SlideIn>
            <SlideIn direction="up" delay={0.1}>
              <p className="text-[17px] text-muted-foreground mb-8 leading-relaxed max-w-md">
                Track your portfolio, save advanced views, and automate the data you care about.
              </p>
            </SlideIn>
          </div>
          
          <div className="relative flex justify-center lg:justify-end">
            <ScaleReveal delay={0.2} className="w-full max-w-sm">
              <div className="bg-white border border-border shadow-[0_10px_40px_rgba(15,23,42,0.06)] rounded-2xl overflow-hidden flex flex-col">
                <div className="p-8 border-b border-border/50 bg-background/30 text-center">
                  <h3 className="font-display font-bold text-2xl text-foreground mb-2">REITCompare Pro</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-mono-figure font-bold text-4xl text-foreground">$12</span>
                    <span className="text-sm font-medium text-muted-foreground">/ month</span>
                  </div>
                </div>
                <div className="p-8 flex-1">
                  <ul className="space-y-4 mb-8">
                    {[
                      "Portfolio tracking",
                      "Advanced alerts",
                      "Saved views",
                      "Tax-component tracking",
                      "Distribution calendar"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-[15px] font-medium text-foreground">
                        <Check className="h-4 w-4 text-brand-blue" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button size="lg" className="w-full rounded-lg btn-premium h-12 text-[15px] font-medium">
                    Start Pro
                  </Button>
                </div>
              </div>
            </ScaleReveal>
          </div>
        </div>

        {/* B2B / API Section */}
        <div className="bg-[#17202A] rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            <div className="p-12 lg:p-16 flex flex-col items-start justify-center text-left">
              <SlideIn direction="up">
                <div className="inline-flex items-center gap-2 mb-6">
                  <Database className="h-5 w-5 text-brand-blue" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Developers & Institutions</span>
                </div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-white mb-4">
                  Need the data, not another dashboard?
                </h2>
                <p className="text-[17px] text-muted-foreground mb-10 leading-relaxed max-w-md">
                  Use structured Australian REIT and asset data inside your own product, workflow or research stack.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button size="lg" className="rounded-lg bg-brand-blue hover:bg-[#0B5F59] text-white border-none h-12 text-[15px] font-medium px-8 w-full sm:w-auto transition-colors">
                    Explore API
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-lg bg-transparent border-white/20 text-white hover:bg-white/10 h-12 text-[15px] font-medium px-8 w-full sm:w-auto transition-colors">
                    <Code2 className="h-4 w-4 mr-2" />
                    View documentation
                  </Button>
                </div>
              </SlideIn>
            </div>

            <div className="bg-[#0D131A] p-8 lg:p-12 border-l border-white/10 flex items-center">
              <ScaleReveal delay={0.2} className="w-full">
                <div className="bg-[#1C2733] border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono text-sm w-full">
                  <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5">
                    <div className="flex gap-1.5 mr-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    </div>
                    <div className="text-[11px] font-bold tracking-widest uppercase text-white/40">Request</div>
                    <div className="ml-auto text-[#66E2A5] text-[11px] font-bold">GET /api/v1/reits/GPT</div>
                  </div>
                  <div className="p-6 overflow-x-auto text-white/80 leading-relaxed">
<pre><code>{`{
  "ticker": "GPT",
  "sector": "Diversified",
  "yield": 0.052,
  "gearing": 0.287,
  "nta": {
    "value": 6.82,
    "date": "2026-06-30",
    "discount": -0.084
  },
  "assets": {
    "count": 134,
    "bookValue": 16200000000
  }
}`}</code></pre>
                  </div>
                </div>
              </ScaleReveal>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
