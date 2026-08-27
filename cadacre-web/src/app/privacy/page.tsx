import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DraftNotice } from "@/components/DraftNotice";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="font-display text-3xl font-semibold text-ink-navy">
            Privacy Policy
          </h1>
          <DraftNotice />

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-charcoal/80">
            <section>
              <h2 className="font-display text-lg font-semibold text-ink-navy">
                1. What we collect
              </h2>
              <p className="mt-2">
                Account data: your email address and name, collected via
                Clerk when you sign up or log in. Payment data: if you unlock
                a report, Stripe processes your payment — Cadacre never sees
                or stores your card number. We don&apos;t run analytics or
                email-capture on the site at this stage, so no other personal
                data is collected beyond what&apos;s described here.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-ink-navy">
                2. Why we collect it
              </h2>
              <p className="mt-2">
                To let you sign in and access your dashboard, to track
                whether you&apos;ve unlocked the full report so we don&apos;t
                ask you to pay twice, and to generate the PDF report from the
                budget and target yield you enter.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-ink-navy">
                3. Who we share it with
              </h2>
              <p className="mt-2">
                Clerk (authentication) and Stripe (payment processing) are
                the only third parties involved in handling your data. We do
                not sell personal data to anyone.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-ink-navy">
                4. Cookies
              </h2>
              <p className="mt-2">
                We use Clerk&apos;s session cookies to keep you signed in.
                We don&apos;t use advertising or tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-ink-navy">
                5. Data retention and deletion
              </h2>
              <p className="mt-2">
                We keep account data for as long as your account exists. To
                request deletion of your account and associated data, email
                support@cadacre.com.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-ink-navy">
                6. Contact
              </h2>
              <p className="mt-2">
                Questions about this policy: support@cadacre.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
