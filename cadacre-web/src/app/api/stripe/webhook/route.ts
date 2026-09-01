import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// Handles Cadacre subscription lifecycle events that happen outside a
// browser session (renewals, failed payments, cancellations) — the
// redirect-only flow in api/stripe/verify/route.ts only covers the initial
// checkout.
export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const body = await request.text();
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const client = await clerkClient();

  async function setSubscriptionStatus(clerkUserId: string, status: string) {
    await client.users.updateUserMetadata(clerkUserId, {
      privateMetadata: { subscriptionStatus: status },
    });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const clerkUserId = subscription.metadata?.clerkUserId;
      if (clerkUserId) {
        await setSubscriptionStatus(clerkUserId, subscription.status);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const clerkUserId = subscription.metadata?.clerkUserId;
      if (clerkUserId) {
        await setSubscriptionStatus(clerkUserId, "canceled");
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
