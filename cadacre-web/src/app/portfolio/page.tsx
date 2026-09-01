import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isSubscriber } from "@/lib/entitlements";
import { getPortfolio } from "@/app/dashboard/actions";
import { PortfolioTracker } from "@/components/PortfolioTracker";

export default async function PortfolioPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const subscribed = await isSubscriber(userId);
  const properties = subscribed ? await getPortfolio() : [];

  return (
    <div className="min-h-screen bg-parchment">
      <header className="sticky top-0 z-50 border-b border-faded-rule bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/content.png" alt="Cadacre" width={1254} height={1254} priority className="h-9 w-9 rounded-sm" />
            <span className="hidden font-mono-figure text-[10px] uppercase tracking-[0.3em] text-charcoal/45 sm:inline">
              Portfolio Tracker
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
          Portfolio tracker
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal/70">
          Your own properties, your own numbers — enter what you paid and what it rents for, and
          Cadacre estimates the cash flow the same way it does for every town on the record.
        </p>

        {subscribed ? (
          <div className="mt-10">
            <PortfolioTracker initialProperties={properties} />
          </div>
        ) : (
          <div className="mt-10 rounded-sm border border-faded-rule bg-white/50 p-6">
            <p className="text-sm text-charcoal/70">
              The portfolio tracker is a Cadacre subscriber feature.
            </p>
            <Link
              href="/account"
              className="mt-4 inline-block rounded-sm bg-ink-navy px-5 py-2.5 text-sm font-medium text-parchment transition hover:bg-ink-navy/90"
            >
              View subscription options
            </Link>
          </div>
        )}

        <p className="mt-10 text-xs leading-relaxed text-charcoal/45">
          General information based on the numbers you enter, not personalised financial or
          investment advice. Ignores LMI, ongoing costs, and tax.
        </p>
      </main>
    </div>
  );
}
