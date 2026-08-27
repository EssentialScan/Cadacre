"use client";

import { useState } from "react";

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 14.5S13 9.8 13 6.3a5 5 0 1 0-10 0C3 9.8 8 14.5 8 14.5Z" />
      <circle cx="8" cy="6.3" r="1.7" />
    </svg>
  );
}

// Google Maps, keyless embed — no API key or billing required. Good enough
// to let a user pan/zoom/street-view into the town and search a specific
// address themselves; Cadacre's own ranked data stays town-level (see
// AGENTS.md §5a/§5b). Upgrading to a full multi-marker interactive map
// would need the Maps JavaScript API + a billed API key.
export function TownMapToggle({ town, state }: { town: string; state: string }) {
  const [open, setOpen] = useState(false);
  const query = `${town}, ${state}, Australia`;

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={`View ${town} on Google Maps`}
        aria-expanded={open}
        className="inline-flex items-center justify-center text-charcoal/40 transition hover:text-ink-navy"
      >
        <PinIcon className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute left-1/2 top-6 z-20 w-72 -translate-x-1/2 rounded-sm border border-faded-rule bg-parchment p-2 shadow-[0_20px_40px_-20px_rgba(18,22,28,0.35)]">
          <iframe
            title={`Map of ${town}, ${state}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
            className="h-44 w-full rounded-sm border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-center text-[11px] font-medium text-survey-brass hover:text-survey-brass/80"
          >
            Open in Google Maps — search a specific address →
          </a>
        </div>
      )}
    </span>
  );
}
