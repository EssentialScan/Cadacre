import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RentVsRentvestTool } from "@/components/RentVsRentvestTool";
import { getAllTowns, getSydneyMetroTowns } from "@/data";
import { isSubscriber } from "@/lib/entitlements";

export default async function RentVsRentvestPage() {
  const allTowns = getAllTowns();
  const sydneySuburbs = getSydneyMetroTowns().filter((t) => t.medianRent.value !== null);
  const regionalTowns = allTowns.filter((t) => (t.region ?? "Regional NSW") === "Regional NSW");

  const { userId } = await auth();
  const proSubscriber = userId ? await isSubscriber(userId) : false;

  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14">
        <p className="font-mono-figure text-xs uppercase tracking-[0.2em] text-deep-forest">
          Rent vs rentvest
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-tight text-ink-navy md:text-6xl">
          What your Sydney rent actually buys somewhere else.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal/70">
          Pick the Sydney suburb you currently rent in. Cadacre converts its median weekly rent
          into an equivalent purchase budget, then shows the regional NSW towns that budget
          affords — with the same cash-flow math used throughout the record.
        </p>

        <div className="mt-10">
          <RentVsRentvestTool
            sydneySuburbs={sydneySuburbs}
            regionalTowns={regionalTowns}
            isSubscriber={proSubscriber}
          />
        </div>

        <p className="mt-10 text-sm text-charcoal/60">
          Want every regional town ranked against this budget, not just the top matches?{" "}
          <Link href="/shortlist" className="text-survey-brass hover:underline">
            Run the full shortlist →
          </Link>{" "}
          or{" "}
          <Link href="/dashboard" className="text-survey-brass hover:underline">
            browse the free map
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
