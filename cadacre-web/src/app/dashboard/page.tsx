import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <header className="border-b border-faded-rule">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink-navy text-sm font-display font-semibold text-ink-navy">
              C
            </span>
            <span className="font-display text-xl font-semibold text-ink-navy">
              Cadacre
            </span>
          </Link>
          <UserButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <p className="font-mono-figure text-xs uppercase tracking-[0.2em] text-survey-brass">
          Dashboard
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink-navy">
          Welcome{user?.firstName ? `, ${user.firstName}` : ""}.
        </h1>
        <p className="mt-2 text-sm text-charcoal/70">
          Enter your budget and target yield to generate your shortlist.
        </p>

        <form className="mt-10 space-y-6 rounded-sm border border-faded-rule bg-white/50 p-6">
          <div>
            <label className="block text-sm font-medium text-ink-navy">
              Budget (AUD)
            </label>
            <input
              type="number"
              placeholder="650000"
              className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-4 py-2 font-mono-figure text-sm outline-none focus:border-ink-navy"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-navy">
              Target gross yield (%)
            </label>
            <input
              type="number"
              placeholder="5.0"
              className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-4 py-2 font-mono-figure text-sm outline-none focus:border-ink-navy"
              disabled
            />
          </div>
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-sm bg-ink-navy/40 px-6 py-3 text-sm font-semibold text-parchment"
          >
            Generate shortlist — coming soon
          </button>
        </form>

        <p className="mt-6 text-xs text-charcoal/50">
          The live town dataset (ABS / SQM Research) isn&apos;t wired up yet.
          This is a placeholder dashboard shell — the filtering engine ships
          next.
        </p>

        <div className="mt-10 rounded-sm border border-faded-rule bg-white/30 p-5 text-xs leading-relaxed text-charcoal/60">
          Cadacre provides general information based on public data and is not
          personalised financial, investment, or legal advice.
        </div>
      </main>
    </div>
  );
}
