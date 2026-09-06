"use client";

import { useState } from "react";
import { DashboardHome } from "./DashboardHome";

export function DashboardTabs() {
  const [tab, setTab] = useState<"home" | "map">("home");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 gap-1 border-b border-faded-rule bg-parchment px-6 pt-2">
        {(["home", "map"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-current={tab === t}
            className={`rounded-t-sm border border-b-0 border-faded-rule px-4 py-2 text-sm font-medium capitalize transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-survey-brass ${
              tab === t
                ? "bg-white/60 text-ink-navy"
                : "bg-transparent text-charcoal/60 hover:text-ink-navy"
            }`}
          >
            {t === "home" ? "Home" : "Map"}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {tab === "home" ? (
          <DashboardHome />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-charcoal/50">National Asset Map coming in Phase 1.</p>
          </div>
        )}
      </div>
    </div>
  );
}
