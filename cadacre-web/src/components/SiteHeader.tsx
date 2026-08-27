import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-faded-rule bg-parchment/95 backdrop-blur supports-[backdrop-filter]:bg-parchment/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink-navy text-sm font-display font-semibold text-ink-navy">
            C
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink-navy">
            Cadacre
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-charcoal/80 md:flex">
          <a href="#how-it-works" className="hover:text-ink-navy">
            How it works
          </a>
          <a href="#sample" className="hover:text-ink-navy">
            Sample record
          </a>
          <a href="#pricing" className="hover:text-ink-navy">
            Pricing
          </a>
          <a href="#faq" className="hover:text-ink-navy">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="text-sm font-medium text-charcoal/80 transition hover:text-ink-navy">
                Log in
              </button>
            </SignInButton>
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="rounded-sm bg-ink-navy px-4 py-2 text-sm font-medium text-parchment transition hover:bg-ink-navy/90">
                Sign up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-charcoal/80 transition hover:text-ink-navy"
            >
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
