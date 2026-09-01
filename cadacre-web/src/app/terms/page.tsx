import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DraftNotice } from "@/components/DraftNotice";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="font-display text-3xl font-semibold text-ink-navy">
            Terms of Service
          </h1>
          <DraftNotice />

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-charcoal/80">
            <section>
              <h2 className="font-display text-lg font-semibold text-ink-navy">
                1. What Cadacre is
              </h2>
              <p className="mt-2">
                Cadacre is a general-information tool that ranks regional
                Australian towns using public data (median house price, gross
                rental yield, and vacancy rate) against a budget and target
                yield you provide. Cadacre is not a licensed financial or
                investment advisor, not a real estate agency, and not a
                lending platform. Nothing on this site is personalised
                financial, investment, or legal advice.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-ink-navy">
                2. No individual property recommendations
              </h2>
              <p className="mt-2">
                Cadacre ranks towns, not specific properties. We never
                recommend a particular property, agent, or vendor, and we
                receive no sponsored placement or referral fee for any town
                appearing in your results.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-ink-navy">
                3. Payment
              </h2>
              <p className="mt-2">
                The full ranked report, and every other Cadacre tool beyond the free dashboard
                map, top-3 teaser, and single-suburb rent comparison, requires an active monthly
                subscription. You can cancel at any time from your account page; access continues
                until the end of the current billing period. Payments are processed by Stripe;
                Cadacre does not see or store your card details.
              </p>
              <p className="mt-2">
                Refunds: because reports and tools are generated instantly from public data at
                the time of use, we don&apos;t offer refunds for a billing period already used.
                If something went wrong with your payment or subscription, contact
                support@cadacre.com and we&apos;ll make it right.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-ink-navy">
                4. Data accuracy
              </h2>
              <p className="mt-2">
                Figures are sourced from public data (ABS, SQM Research, and
                other public real estate data providers), each with its own
                reference date. Some figures may be out of date or marked
                &quot;unavailable&quot; when no credible source could be
                found — we do not estimate or invent figures. Cadacre does
                not guarantee the accuracy, completeness, or currency of any
                figure and is not liable for decisions made based on this
                information.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-ink-navy">
                5. Prohibited use
              </h2>
              <p className="mt-2">
                Reports are for your personal use. You may not resell,
                republish, or redistribute a Cadacre report or the underlying
                ranked data.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-ink-navy">
                6. Governing law
              </h2>
              <p className="mt-2">
                These terms are governed by the laws of New South Wales,
                Australia.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-ink-navy">
                7. Contact
              </h2>
              <p className="mt-2">
                Questions or disputes: support@cadacre.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
