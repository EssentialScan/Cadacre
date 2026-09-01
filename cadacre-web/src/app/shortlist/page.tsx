import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ShortlistForm } from "@/components/ShortlistForm";
import { RentvestorLab } from "@/components/RentvestorLab";
import { isSubscriber } from "@/lib/entitlements";

export default async function ShortlistPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const params = await searchParams;
  const budgetParam = typeof params.budget === "string" ? params.budget : undefined;
  const yieldParam = typeof params.yield === "string" ? params.yield : undefined;
  const justSubscribed = params.subscribed === "1";
  const subscribeError = params.subscribe_error === "1";
  const subscribed = await isSubscriber(userId);

  return (
    <div className="min-h-screen bg-parchment">
      <header className="sticky top-0 z-50 border-b border-faded-rule bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/content.png" alt="Cadacre" width={1254} height={1254} priority className="h-9 w-9 rounded-sm" />
            <span className="hidden font-mono-figure text-[10px] uppercase tracking-[0.3em] text-charcoal/45 sm:inline">
              Ranked Shortlist
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-charcoal/70 hover:text-ink-navy">
              Browse the free map
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-14 sm:px-8">
        <p className="font-mono-figure text-xs uppercase tracking-[0.25em] text-survey-brass">
          The decision, not the data
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink-navy sm:text-4xl">
          Enter your budget and target yield. Get a ranked shortlist.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal/70 sm:text-base">
          The free dashboard map is for browsing every town on the record at your own pace.
          This is the other half of Cadacre: two numbers in, and public housing data — median
          price, gross yield, vacancy rate — gets checked against every regional town and
          scored for you. First 3 results are always free. Subscribe to unlock the full ranked
          list and a downloadable PDF report.
        </p>

        {justSubscribed && (
          <div className="mt-6 rounded-sm border border-deep-forest bg-deep-forest/10 px-5 py-3 text-sm text-deep-forest">
            Subscription confirmed — your full ranked report is unlocked below.
          </div>
        )}
        {subscribeError && (
          <div className="mt-6 rounded-sm border border-red-700 bg-red-700/10 px-5 py-3 text-sm text-red-700">
            We couldn&apos;t confirm that subscription. If you were charged, contact support and
            we&apos;ll unlock your account manually.
          </div>
        )}

        <div className="mt-10">
          <ShortlistForm
            clerkUserId={userId}
            defaultBudget={budgetParam}
            defaultYieldPct={yieldParam}
            autoSubmit={justSubscribed && Boolean(budgetParam && yieldParam)}
            isSubscriber={subscribed}
          />
        </div>

        <div className="mt-16 space-y-6 border-t border-faded-rule pt-10">
          <div>
            <h2 className="font-display text-2xl text-ink-navy">Or test your scenario first</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              Not sure if regional rentvesting makes sense for your Sydney rent? Run a stress test:
              compare staying in Sydney against investing regionally, side by side. Adjust your own assumptions
              to see when the decision tips.
            </p>
          </div>
          <RentvestorLab />
        </div>

        <p className="mt-10 text-xs leading-relaxed text-charcoal/45">
          General information based on public data, not personalised financial or investment
          advice. Cadacre ranks towns, never individual properties. See our{" "}
          <Link href="/terms" className="underline hover:text-ink-navy">Terms</Link> for full
          detail.
        </p>
      </main>
    </div>
  );
}
