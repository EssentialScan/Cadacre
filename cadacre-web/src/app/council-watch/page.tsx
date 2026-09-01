import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isSubscriber } from "@/lib/entitlements";
import { getDb } from "@/db/client";
import { getCoveredLgas } from "@/lib/councilWatch/adapters";
import { listWatchesWithMatches } from "./actions";
import { CouncilWatchPanel } from "@/components/councilWatch/CouncilWatchPanel";

export default async function CouncilWatchPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const subscribed = await isSubscriber(userId);
  const configured = getDb() !== null;
  const watches = subscribed && configured ? await listWatchesWithMatches() : [];

  return (
    <div className="min-h-screen bg-parchment">
      <header className="sticky top-0 z-50 border-b border-faded-rule bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/content.png" alt="Cadacre" width={1254} height={1254} priority className="h-9 w-9 rounded-sm" />
            <span className="hidden font-mono-figure text-[10px] uppercase tracking-[0.3em] text-charcoal/45 sm:inline">
              Council Watch
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-charcoal/70 hover:text-ink-navy">
              Dashboard
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-14 sm:px-8">
        <p className="font-mono-figure text-xs uppercase tracking-[0.25em] text-survey-brass">
          Subscriber feature
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink-navy sm:text-4xl">
          Council watch
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal/70">
          Track an address, suburb, or local government area and see new development applications
          that match, in plain English. Currently covers a small hand-verified set of NSW councils
          — see each area&apos;s coverage below before adding a watch.
        </p>

        {!subscribed ? (
          <div className="mt-10 rounded-sm border border-faded-rule bg-white/50 p-6">
            <p className="text-sm text-charcoal/70">Council watch is a Cadacre subscriber feature.</p>
            <Link
              href="/account"
              className="mt-4 inline-block rounded-sm bg-ink-navy px-5 py-2.5 text-sm font-medium text-parchment transition hover:bg-ink-navy/90"
            >
              View subscription options
            </Link>
          </div>
        ) : !configured ? (
          <div className="mt-10 rounded-sm border border-faded-rule bg-white/50 p-6">
            <p className="text-sm text-charcoal/70">Council watch isn&apos;t configured yet.</p>
          </div>
        ) : (
          <div className="mt-10">
            <CouncilWatchPanel initialWatches={watches} coveredLgas={Array.from(getCoveredLgas())} />
          </div>
        )}

        <p className="mt-10 text-xs leading-relaxed text-charcoal/45">
          General information based on public planning-application records, not personalised
          financial, investment, or legal advice. Match reasons are shown for every alert — some
          are looser than others (e.g. suburb-level rather than an exact address radius) depending
          on what the source published. Always verify directly with the relevant council before
          acting.
        </p>
      </main>
    </div>
  );
}
