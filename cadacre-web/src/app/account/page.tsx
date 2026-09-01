import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isSubscriber } from "@/lib/entitlements";

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const subscribed = await isSubscriber(userId);
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const hasStripeCustomerId = typeof user.privateMetadata?.stripeCustomerId === "string";
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL;
  const subscribeUrl = paymentLink
    ? `${paymentLink}?client_reference_id=${encodeURIComponent(userId)}`
    : undefined;

  return (
    <div className="min-h-screen bg-parchment">
      <header className="sticky top-0 z-50 border-b border-faded-rule bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/content.png" alt="Cadacre" width={1254} height={1254} priority className="h-9 w-9 rounded-sm" />
            <span className="hidden font-mono-figure text-[10px] uppercase tracking-[0.3em] text-charcoal/45 sm:inline">
              Account
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

      <main className="mx-auto max-w-2xl px-6 py-14 sm:px-8">
        <p className="font-mono-figure text-xs uppercase tracking-[0.25em] text-survey-brass">
          Account
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink-navy sm:text-4xl">
          Your subscription
        </h1>

        <div className="mt-8 rounded-sm border border-faded-rule bg-white/50 p-6">
          {subscribed ? (
            <>
              <p className="font-mono-figure text-xs uppercase tracking-widest text-deep-forest">
                Active
              </p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                Your subscription unlocks the full ranked shortlist and PDF report, custom
                ranking weights, the multi-town scenario simulator, the portfolio tracker, CSV
                export, the relocation-readiness pack, rank-drift and hazard alerts, the rent
                tracker, and the negotiation-letter generator.
              </p>
              {hasStripeCustomerId ? (
                <a
                  href="/api/stripe/portal"
                  className="mt-5 inline-block rounded-sm bg-ink-navy px-5 py-2.5 text-sm font-medium text-parchment transition hover:bg-ink-navy/90"
                >
                  Manage subscription
                </a>
              ) : (
                <p className="mt-5 text-sm text-charcoal/50">
                  Your access comes from an earlier one-time purchase, not a Stripe subscription,
                  so there&apos;s no billing subscription to manage here.
                </p>
              )}
            </>
          ) : (
            <>
              <p className="font-mono-figure text-xs uppercase tracking-widest text-charcoal/50">
                Not subscribed
              </p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                One monthly subscription unlocks everything beyond the free dashboard map, the
                top-3 teaser ledger, and the single-suburb rent comparison.
              </p>
              {subscribeUrl ? (
                <a
                  href={subscribeUrl}
                  className="mt-5 inline-block rounded-sm bg-ink-navy px-5 py-2.5 text-sm font-medium text-parchment transition hover:bg-ink-navy/90"
                >
                  Subscribe to Cadacre
                </a>
              ) : (
                <p className="mt-5 text-sm text-charcoal/50">
                  Subscriptions aren&apos;t configured yet.
                </p>
              )}
            </>
          )}
        </div>

        <p className="mt-10 text-xs leading-relaxed text-charcoal/45">
          General information based on public data, not personalised financial or investment
          advice. See our{" "}
          <Link href="/terms" className="underline hover:text-ink-navy">Terms</Link> for full
          detail.
        </p>
      </main>
    </div>
  );
}
