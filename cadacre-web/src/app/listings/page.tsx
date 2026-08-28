import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MarketScout } from "@/components/MarketScout";
import { getAllTowns } from "@/data";

export default function ListingsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14">
        <Link href="/explore" className="font-mono-figure text-xs uppercase tracking-[0.2em] text-survey-brass">← Back to atlas</Link>
        <div className="mt-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="font-mono-figure text-xs uppercase tracking-[0.2em] text-deep-forest">Market scout</p>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-tight text-ink-navy md:text-6xl">Filter the record.</h1>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-charcoal/70">Tune the shortlist like a buyer: price first, income second, then open the live listings for photos and exact details.</p>
        </div>
        <MarketScout towns={getAllTowns()} />
      </main>
      <SiteFooter />
    </div>
  );
}