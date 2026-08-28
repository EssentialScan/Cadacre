import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BudgetMapExplorer } from "@/components/BudgetMapExplorer";
import { getAllTowns } from "@/data";

export default function ExplorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14">
        <Link href="/listings" className="font-mono-figure text-xs uppercase tracking-[0.2em] text-survey-brass">Next: market scout →</Link>
        <p className="mt-10 font-mono-figure text-xs uppercase tracking-[0.2em] text-deep-forest">The regional atlas</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-tight text-ink-navy md:text-7xl">Start with a place. Let the numbers follow.</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal/70">Move the budget lens, then click any town. Every pin opens a public record of price, rent, yield, vacancy, hazards and announced infrastructure.</p>
        <BudgetMapExplorer towns={getAllTowns()} />
        <p className="mt-6 text-xs leading-relaxed text-charcoal/50">General information based on public data. Town-level aggregates only, not property advice or a specific-property valuation.</p>
      </main>
      <SiteFooter />
    </div>
  );
}