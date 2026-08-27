import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ShortlistForm } from "@/components/ShortlistForm";
import { TownMapExplorer } from "@/components/map/TownMapExplorer";
import { FadeUp } from "@/components/motion/FadeIn";
import { getAllTowns } from "@/data";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await currentUser();
  const params = await searchParams;

  const budgetParam = typeof params.budget === "string" ? params.budget : undefined;
  const yieldParam = typeof params.yield === "string" ? params.yield : undefined;
  const justUnlocked = params.unlocked === "1";
  const unlockError = params.unlock_error === "1";

  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <header className="border-b border-faded-rule">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/content.png"
              alt="Cadacre"
              width={1254}
              height={1254}
              priority
              className="h-12 w-12"
            />
          </Link>
          <UserButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono-figure text-xs uppercase tracking-[0.2em] text-survey-brass">
            Dashboard
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink-navy">
            Welcome{user?.firstName ? `, ${user.firstName}` : ""}.
          </h1>
          <p className="mt-2 text-sm text-charcoal/70">
            Enter your budget and target yield to generate your shortlist.
          </p>

          {justUnlocked && (
            <p className="mt-4 rounded-sm border border-deep-forest bg-deep-forest/10 px-4 py-3 text-sm text-deep-forest">
              Payment confirmed — your full report is unlocked below.
            </p>
          )}
          {unlockError && (
            <p className="mt-4 rounded-sm border border-red-700 bg-red-50 px-4 py-3 text-sm text-red-700">
              We couldn&apos;t confirm that payment. If you were charged, contact
              support@cadacre.com and we&apos;ll sort it out.
            </p>
          )}
        </div>

        <FadeUp className="mt-8">
          <p className="mx-auto max-w-3xl text-sm text-charcoal/70">
            Browse all 18 towns on the map — click a pin for the full record.
          </p>
          <div className="mt-4">
            <TownMapExplorer towns={getAllTowns()} />
          </div>
        </FadeUp>

        <div className="mx-auto max-w-3xl">
          <div className="mt-8 rounded-sm border border-faded-rule bg-white/30 p-5 text-xs leading-relaxed text-charcoal/60">
            Cadacre provides general information based on public data and is not
            personalised financial, investment, or legal advice.
          </div>

          <div className="mt-6">
            {user && (
              <ShortlistForm
                clerkUserId={user.id}
                defaultBudget={budgetParam}
                defaultYieldPct={yieldParam}
                autoSubmit={justUnlocked && Boolean(budgetParam && yieldParam)}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-faded-rule">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-charcoal/50">
          <span>© {new Date().getFullYear()} Cadacre. All rights reserved.</span>
          <span className="flex gap-4">
            <Link href="/terms" className="hover:text-ink-navy">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-ink-navy">
              Privacy Policy
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
