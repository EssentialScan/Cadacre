"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

function getSnapshot() {
  return new Intl.DateTimeFormat("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Australia/Sydney",
  }).format(new Date());
}

function getServerSnapshot() {
  return "--:--:--";
}

// A genuinely live (real browser/timezone clock), not a fabricated data
// feed — kept deliberately modest so it doesn't read as a live market-data
// ticker Cadacre doesn't actually have (see AGENTS.md: never fabricate data).
export function LiveClock() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <span className="font-mono-figure text-[10px] tabular-nums text-charcoal/45">
      SYD {time}
    </span>
  );
}
