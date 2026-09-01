import { clerkClient } from "@clerk/nextjs/server";

// Stripe subscription statuses that should still grant access. "trialing"
// is a live trial; "past_due" is Stripe's own retry grace period (the
// subscription isn't canceled yet). Anything else (canceled, unpaid,
// incomplete, incomplete_expired, paused) is not entitled. Keeping this as
// a set (rather than matching only the literal "active") avoids silently
// locking out a paying customer whose webhook wrote a different live status
// — see api/stripe/webhook/route.ts, which writes the raw Stripe status.
const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["active", "trialing", "past_due"]);

// Single entitlement for the merged subscription model (AGENTS.md §2,
// 2026-08-30) — the earlier separate `unlocked` ($39 one-time report) and
// `subscriptionStatus` (Pro) checks are merged into one. `unlocked` is kept
// as a legacy fallback so anyone who already paid the retired one-time $39
// report stays entitled without needing to resubscribe.
export async function isSubscriber(userId: string): Promise<boolean> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const status = user.privateMetadata?.subscriptionStatus;
  return (
    (typeof status === "string" && ACTIVE_SUBSCRIPTION_STATUSES.has(status)) ||
    user.privateMetadata?.unlocked === true
  );
}
