import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isSubscriber } from "@/lib/entitlements";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ApiKeyManager } from "@/components/ApiKeyManager";
import { UserButton } from "@clerk/nextjs";
import { getDb } from "@/db/client";
import { apiKeys } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Account | REITCompare",
  description: "Manage your REITCompare subscription, alerts, and API keys.",
};

export const dynamic = "force-dynamic";

const FEATURES = [
  "REIT Portfolio Tracker with weighted metrics",
  "Tax component tracking (tax-deferred, capital gains, foreign income)",
  "Multi-condition alerts with webhook delivery",
  "Full access to the REIT Data API",
  "Saved screener views",
];

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const subscribed = await isSubscriber(userId);
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const hasStripeCustomerId = typeof user.privateMetadata?.stripeCustomerId === "string";
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL;
  const subscribeUrl = paymentLink
    ? `${paymentLink}?client_reference_id=${encodeURIComponent(userId)}`
    : undefined;

  // Load API keys for this user
  const db = getDb();
  const userApiKeys = db
    ? await db.select({
        id: apiKeys.id,
        keyPrefix: apiKeys.keyPrefix,
        tier: apiKeys.tier,
        requestCount: apiKeys.requestCount,
        lastUsedAt: apiKeys.lastUsedAt,
        createdAt: apiKeys.createdAt,
      }).from(apiKeys).where(eq(apiKeys.userId, userId))
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 bg-parchment/30 pt-12 pb-24">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <div className="mb-10 flex items-start justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-ink-navy mb-2">Account</h1>
              <p className="text-muted-foreground text-sm">{user.emailAddresses[0]?.emailAddress}</p>
            </div>
            <UserButton />
          </div>

          {/* Subscription Card */}
          <div className="rounded-xl border border-border bg-white shadow-premium p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-foreground">Subscription</h2>
              <div className={`flex items-center gap-1.5 text-sm font-semibold ${subscribed ? "text-data-green" : "text-muted-foreground"}`}>
                {subscribed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {subscribed ? "Active" : "Free plan"}
              </div>
            </div>

            {subscribed ? (
              <>
                <ul className="space-y-2 mb-5">
                  {FEATURES.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-data-green shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {hasStripeCustomerId ? (
                  <a
                    href="/api/stripe/portal"
                    className="inline-flex items-center px-5 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Manage billing
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Your access was granted directly — no billing subscription to manage.
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Upgrade to unlock the REIT Portfolio Tracker, advanced alerts, and full API access.
                </p>
                <ul className="space-y-2 mb-5">
                  {FEATURES.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-4 w-4 rounded-full border border-border shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-display text-3xl font-bold text-foreground">$12</span>
                  <span className="text-muted-foreground text-sm">/ month AUD</span>
                </div>
                {subscribeUrl ? (
                  <a
                    href={subscribeUrl}
                    className="inline-flex items-center px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue/90 transition-colors"
                  >
                    Subscribe to REITCompare
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Subscriptions not yet configured.</p>
                )}
              </>
            )}
          </div>

          {/* API Keys Card */}
          <div className="rounded-xl border border-border bg-white shadow-premium p-6 mb-8">
            <div className="mb-4">
              <h2 className="font-display text-lg font-bold text-foreground mb-1">Data API Keys</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use these keys to access the{" "}
                <Link href="/api/v1/reits" className="underline hover:text-foreground">REITCompare REST API</Link>.
                Free tier includes 100 requests. Keys are hashed — store them securely after generation.
              </p>
            </div>
            <ApiKeyManager initialKeys={userApiKeys as any} />
          </div>

          {/* Quick links */}
          <div className="rounded-xl border border-border bg-white shadow-premium p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Quick links</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/portfolio", label: "Portfolio Tracker" },
                { href: "/comparison", label: "REIT Screener" },
                { href: "/explore", label: "Asset Map" },
                { href: "/terms", label: "Terms of Service" },
              ].map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center px-4 py-3 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-8 text-xs text-muted-foreground leading-relaxed">
            General information only — not personalised financial or investment advice.
            See our <Link href="/terms" className="underline hover:text-foreground">Terms</Link> for full detail.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
