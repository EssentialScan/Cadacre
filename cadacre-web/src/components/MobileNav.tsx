"use client";

import { useState } from "react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { WatchBadge } from "./WatchBadge";

// Signed-in mobile fallback for SiteHeader's Council Watch / Shortlist /
// Dashboard / Account group, which is hidden below `lg`. The signed-out
// Log in / Sign up buttons stay always-visible (unchanged), and the
// marketing nav (Rent vs rentvest, Explore map, etc.) has no mobile
// fallback per the 2026-09-05 scope — this menu only covers the signed-in
// app links, per this pass's explicit scope.
export function MobileNav({
  unreadCount,
  isSubscriber,
}: {
  unreadCount: number;
  isSubscriber: boolean;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="flex h-9 w-9 items-center justify-center rounded-sm border border-faded-rule text-ink-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-survey-brass"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span className="relative block h-3 w-4" aria-hidden>
          <span
            className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-200 ${open ? "translate-y-[5px] rotate-45" : ""}`}
          />
          <span
            className={`absolute left-0 top-[5px] h-px w-4 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`absolute left-0 top-[10px] h-px w-4 bg-current transition-transform duration-200 ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full border-b border-faded-rule bg-parchment px-6 py-4 shadow-[0_20px_40px_-20px_rgba(18,22,28,0.35)]"
        >
          <nav className="flex flex-col gap-4 text-sm font-medium text-charcoal/80">
            <Link
              href="/council-watch"
              onClick={close}
              className="flex items-center gap-2 hover:text-ink-navy"
            >
              Council Watch
              <WatchBadge count={unreadCount} />
            </Link>
            <Link href="/shortlist" onClick={close} className="hover:text-ink-navy">
              Shortlist
            </Link>
            <Link href="/dashboard" onClick={close} className="hover:text-ink-navy">
              Dashboard
            </Link>
            <div className="border-t border-faded-rule pt-4">
              <p className="font-mono-figure text-[11px] uppercase tracking-wide text-charcoal/50">
                {isSubscriber ? "Subscriber" : "Free"}
              </p>
              <Link
                href="/account"
                onClick={close}
                className="mt-2 block hover:text-ink-navy"
              >
                {isSubscriber ? "Manage subscription" : "Upgrade"}
              </Link>
              <SignOutButton>
                <button type="button" className="mt-2 block text-left hover:text-ink-navy">
                  Sign out
                </button>
              </SignOutButton>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
