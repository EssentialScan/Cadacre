import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isSubscriber } from "@/lib/entitlements";
import { getSydneyMetroTowns } from "@/data";
import { NegotiationLetterForm } from "@/components/NegotiationLetterForm";

export default async function NegotiationLetterPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const subscribed = await isSubscriber(userId);
  const suburbs = getSydneyMetroTowns().filter((t) => t.medianRent.value !== null);

  return (
    <div className="min-h-screen bg-parchment">
      <header className="sticky top-0 z-50 border-b border-faded-rule bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/content.png" alt="Cadacre" width={1254} height={1254} priority className="h-9 w-9 rounded-sm" />
            <span className="hidden font-mono-figure text-[10px] uppercase tracking-[0.3em] text-charcoal/45 sm:inline">
              Negotiation Letter
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/rent-vs-rentvest" className="text-sm font-medium text-charcoal/70 hover:text-ink-navy">
              Rent vs rentvest
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14 sm:px-8">
        <p className="font-mono-figure text-xs uppercase tracking-[0.25em] text-survey-brass">
          Subscriber feature
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink-navy sm:text-4xl">
          Rent-increase negotiation letter
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/70">
          Compare a proposed rent increase against your suburb&apos;s real, sourced median rent,
          and download a data-backed letter to send to your landlord or agent.
        </p>

        {subscribed ? (
          <div className="mt-10">
            <NegotiationLetterForm suburbs={suburbs} />
          </div>
        ) : (
          <div className="mt-10 rounded-sm border border-faded-rule bg-white/50 p-6">
            <p className="text-sm text-charcoal/70">
              The negotiation letter generator is a Cadacre subscriber feature.
            </p>
            <Link
              href="/account"
              className="mt-4 inline-block rounded-sm bg-ink-navy px-5 py-2.5 text-sm font-medium text-parchment transition hover:bg-ink-navy/90"
            >
              View subscription options
            </Link>
          </div>
        )}

        <p className="mt-10 text-xs leading-relaxed text-charcoal/45">
          General information based on public data, not legal advice. Cadacre is not a tenants&apos;
          advocate, solicitor, or law firm — for a formal dispute, contact the NSW Rental
          Commissioner or a licensed tenants&apos; advocacy service.
        </p>
      </main>
    </div>
  );
}
