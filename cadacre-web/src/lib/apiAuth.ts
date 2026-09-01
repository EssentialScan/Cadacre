import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isSubscriber } from "@/lib/entitlements";

// Shared subscriber gate for API routes — every route that requires an
// active Cadacre subscription should call this instead of re-copying the
// auth()+isSubscriber() 401/403 block. Returns the userId on success, or a
// NextResponse the caller should return immediately.
export async function requireSubscriberApi(
  featureLabel: string
): Promise<{ userId: string } | { response: NextResponse }> {
  const { userId } = await auth();
  if (!userId) {
    return { response: NextResponse.json({ error: "Not authenticated." }, { status: 401 }) };
  }
  if (!(await isSubscriber(userId))) {
    return { response: NextResponse.json({ error: `${featureLabel} is a Cadacre subscriber feature.` }, { status: 403 }) };
  }
  return { userId };
}
