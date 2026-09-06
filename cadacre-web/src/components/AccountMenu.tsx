import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

// Native <details>/<summary> — keyboard-accessible without extra JS, matches
// the "smallest working version" convention already used across this repo.
export function AccountMenu({ isSubscriber }: { isSubscriber: boolean }) {
  return (
    <details className="group relative">
      <summary className="cursor-pointer list-none text-sm font-medium text-charcoal/80 hover:text-ink-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-survey-brass [&::-webkit-details-marker]:hidden">
        Account
      </summary>
      <div className="absolute right-0 z-10 mt-2 w-56 rounded-sm border border-faded-rule bg-parchment shadow-[0_20px_40px_-20px_rgba(18,22,28,0.35)]">
        <p className="border-b border-faded-rule px-4 py-3 font-mono-figure text-[11px] uppercase tracking-wide text-charcoal/50">
          {isSubscriber ? "Subscriber" : "Free"}
        </p>
        <Link
          href="/account"
          className="block px-4 py-2.5 text-sm text-charcoal/80 hover:bg-white/60 hover:text-ink-navy focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-survey-brass"
        >
          {isSubscriber ? "Manage subscription" : "Upgrade"}
        </Link>
        <SignOutButton>
          <button
            type="button"
            className="block w-full px-4 py-2.5 text-left text-sm text-charcoal/80 hover:bg-white/60 hover:text-ink-navy focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-survey-brass"
          >
            Sign out
          </button>
        </SignOutButton>
      </div>
    </details>
  );
}
