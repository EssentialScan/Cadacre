import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  const accountUrl = new URL("/account", request.url);

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!userId || !secretKey) {
    return NextResponse.redirect(accountUrl);
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const stripeCustomerId = user.privateMetadata?.stripeCustomerId;
  if (typeof stripeCustomerId !== "string") {
    return NextResponse.redirect(accountUrl);
  }

  try {
    const stripe = new Stripe(secretKey);
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: accountUrl.toString(),
    });
    return NextResponse.redirect(portalSession.url);
  } catch {
    return NextResponse.redirect(accountUrl);
  }
}
