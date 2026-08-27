import { SignUpButton } from "@clerk/nextjs";

export function FinalCta() {
  return (
    <section className="border-b border-faded-rule bg-deep-forest">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-semibold text-parchment">
          Your budget already qualifies you for somewhere.
        </h2>
        <p className="mt-3 text-sm text-parchment/70">
          It takes under two minutes to see your first three towns — free,
          no card required.
        </p>
        <div className="mt-8">
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="rounded-sm bg-survey-brass px-7 py-3 text-sm font-semibold text-ink-navy transition hover:bg-survey-brass/90">
              Run your free shortlist
            </button>
          </SignUpButton>
        </div>
      </div>
    </section>
  );
}
