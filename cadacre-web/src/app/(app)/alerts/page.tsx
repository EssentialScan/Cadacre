import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isSubscriber } from "@/lib/entitlements";
import { AlertsManager } from "@/components/AlertsManager";
import { Lock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Alerts | REITCompare",
  description: "Set metric threshold alerts for Australian REITs. Get notified when NTA discount, yield, or gearing crosses your defined thresholds.",
};

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const subscribed = await isSubscriber(userId);

  return (
    <div className="bg-parchment/30 pt-12 pb-24 h-full">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center rounded-full border border-border bg-white px-2.5 py-0.5 text-xs font-semibold text-brand-blue shadow-sm">
              Premium
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink-navy mb-3">
            Alerts
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
            Define metric thresholds. Get notified when NTA discount, yield, gearing, or WALE crosses
            a value you set — via email or webhook. Alerts state facts only, no buy/sell signals.
          </p>
        </div>

        {subscribed ? (
          <AlertsManager />
        ) : (
          <div className="max-w-lg">
            <div className="rounded-xl border border-border bg-white shadow-sm p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-brand-blue" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">Premium Feature</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Advanced alerts with webhook delivery are available to REITCompare subscribers.
              </p>
              <Link
                href="/account"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue/90 transition-colors"
              >
                View subscription options
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
