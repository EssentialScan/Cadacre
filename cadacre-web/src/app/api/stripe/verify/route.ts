import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  const { searchParams } = request.nextUrl;
  const budget = searchParams.get("budget");
  const targetYield = searchParams.get("yield");
  const sessionId = searchParams.get("session_id");

  const redirectBase = new URL("/dashboard", request.url);
  if (budget) redirectBase.searchParams.set("budget", budget);
  if (targetYield) redirectBase.searchParams.set("yield", targetYield);

  function failure() {
    const url = new URL(redirectBase);
    url.searchParams.set("unlock_error", "1");
    return NextResponse.redirect(url);
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!userId || !sessionId || !secretKey) {
    return failure();
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return failure();
    }
    if (session.client_reference_id !== userId) {
      return failure();
    }

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      privateMetadata: { unlocked: true },
    });

    const url = new URL(redirectBase);
    url.searchParams.set("unlocked", "1");
    return NextResponse.redirect(url);
  } catch {
    return failure();
  }
}
