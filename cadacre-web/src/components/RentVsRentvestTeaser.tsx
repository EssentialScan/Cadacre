import Link from "next/link";
import { FadeUp } from "@/components/motion/FadeIn";
import { RentVsRentvestTool } from "@/components/RentVsRentvestTool";
import { getAllTowns, getSydneyMetroTowns } from "@/data";

export function RentVsRentvestTeaser() {
  const allTowns = getAllTowns();
  const sydneySuburbs = getSydneyMetroTowns().filter((t) => t.medianRent.value !== null);
  const regionalTowns = allTowns.filter((t) => (t.region ?? "Regional NSW") === "Regional NSW");

  if (sydneySuburbs.length === 0) return null;

  return (
    <section className="border-b border-faded-rule bg-parchment">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <FadeUp className="max-w-2xl">
          <p className="font-mono-figure text-xs uppercase tracking-[0.25em] text-survey-brass">
            Rent vs rentvest
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink-navy sm:text-4xl">
            What your rent already buys, somewhere else.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
            Pick the Sydney suburb you rent in and see the closest regional match today — the
            full comparison, with cash-flow figures for every match, is one click away.
          </p>
        </FadeUp>

        <FadeUp delay={0.1} className="mt-10 rounded-sm border border-faded-rule bg-white/50 p-6">
          <RentVsRentvestTool sydneySuburbs={sydneySuburbs} regionalTowns={regionalTowns} resultCount={1} />
        </FadeUp>

        <p className="mt-6 text-sm text-charcoal/60">
          <Link href="/rent-vs-rentvest" className="text-survey-brass hover:underline">
            See the full comparison →
          </Link>
        </p>
      </div>
    </section>
  );
}
