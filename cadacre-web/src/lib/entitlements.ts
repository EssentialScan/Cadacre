import { clerkClient } from "@clerk/nextjs/server";

// Single entitlement for the merged subscription model (AGENTS.md §2,
// 2026-08-30) — the earlier separate `unlocked` ($39 one-time report) and
// `subscriptionStatus` (Pro) checks are merged into one. `unlocked` is kept
// as a legacy fallback so anyone who already paid the retired one-time $39
// report stays entitled without needing to resubscribe.
export async function isSubscriber(userId: string): Promise<boolean> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (
    user.privateMetadata?.subscriptionStatus === "active" ||
    user.privateMetadata?.unlocked === true
  );
}
