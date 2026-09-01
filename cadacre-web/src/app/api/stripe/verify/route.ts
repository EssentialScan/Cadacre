import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// Verifies the single Cadacre subscription Payment Link's checkout redirect
// (AGENTS.md §2, 2026-08-30 — the earlier separate one-time $39 report
// verification and the earlier separate "Cadacre Pro" subscription verification have been
// merged into this one route). Only handles the initial checkout; renewal/
// cancellation state changes that happen outside a browser session are
// handled by api/stripe/webhook/route.ts.
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  const { searchParams } = request.nextUrl;
  const budget = searchParams.get("budget");
  const targetYield = searchParams.get("yield");
  const sessionId = searchParams.get("session_id");

  const redirectBase = new URL("/shortlist", request.url);
  if (budget) redirectBase.searchParams.set("budget", budget);
  if (targetYield) redirectBase.searchParams.set("yield", targetYield);

  function failure() {
    const url = new URL(redirectBase);
    url.searchParams.set("subscribe_error", "1");
    return NextResponse.redirect(url);
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!userId || !sessionId || !secretKey) {
    return failure();
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.mode !== "subscription" || session.payment_status !== "paid") {
      return failure();
    }
    if (session.client_reference_id !== userId) {
      return failure();
    }

    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    const client = await clerkClient();

    // These two writes are independent (Stripe subscription metadata vs.
    // Clerk user metadata) — run them concurrently instead of back-to-back.
    await Promise.all([
      subscriptionId
        // Tag the subscription itself with the Clerk user id so later
        // customer.subscription.updated/.deleted webhook events (which carry
        // no client_reference_id) can still be attributed without a lookup.
        ? stripe.subscriptions.update(subscriptionId, { metadata: { clerkUserId: userId } })
        : Promise.resolve(),
      client.users.updateUserMetadata(userId, {
        privateMetadata: {
          subscriptionStatus: "active",
          stripeCustomerId:
            typeof session.customer === "string" ? session.customer : session.customer?.id,
        },
      }),
    ]);

    const url = new URL(redirectBase);
    url.searchParams.set("subscribed", "1");
    return NextResponse.redirect(url);
  } catch {
    return failure();
  }
}
