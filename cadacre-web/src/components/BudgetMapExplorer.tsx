"use client";

import { useEffect, useRef, useState } from "react";
import type { Town } from "@/data/towns";
import { TownMapExplorer } from "@/components/map/TownMapExplorer";

function money(value: number | null) {
  return value === null ? "Not available" : `$${value.toLocaleString("en-AU")}`;
}

export function BudgetMapExplorer({ towns }: { towns: Town[] }) {
  const [budget, setBudget] = useState(650000);
  const [fullScreen, setFullScreen] = useState(false);
  const mapShellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullScreenChange = () => setFullScreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);
  const matches = towns.filter(
    (town) => town.medianPrice.value !== null && town.medianPrice.value <= budget
  );

  async function toggleFullScreen() {
    if (!document.fullscreenElement) {
      await mapShellRef.current?.requestFullscreen();
      setFullScreen(true);
    } else {
      await document.exitFullscreen();
      setFullScreen(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
      <div
        ref={mapShellRef}
        className={`relative overflow-hidden rounded-sm border border-ink-navy bg-[#dbe4df] shadow-[10px_10px_0_var(--faded-rule)] ${fullScreen ? "h-screen w-screen rounded-none shadow-none" : ""}`}
      >
        <button
          type="button"
          onClick={() => void toggleFullScreen()}
          className="absolute right-3 top-3 z-[1000] border border-ink-navy bg-parchment/95 px-3 py-2 font-mono-figure text-[10px] uppercase tracking-wide text-ink-navy shadow-sm transition hover:bg-survey-brass"
          aria-label={fullScreen ? "Exit full screen map" : "Open full screen map"}
        >
          {fullScreen ? "Exit map" : "Maximise map"}
        </button>
        <TownMapExplorer towns={towns} budget={budget} fullScreen={fullScreen} />
      </div>
      <aside className="h-fit rounded-sm border border-ink-navy bg-ink-navy p-5 text-parchment">
        <p className="font-mono-figure text-[10px] uppercase tracking-[0.2em] text-gold-bright">
          Budget lens
        </p>
        <label htmlFor="map-budget" className="mt-5 block font-display text-2xl">
          What can {money(budget)} reach?
        </label>
        <input
          id="map-budget"
          type="range"
          min={250000}
          max={1000000}
          step={25000}
          value={budget}
          onChange={(event) => setBudget(Number(event.target.value))}
          className="mt-6 w-full accent-gold-bright"
        />
        <div className="mt-2 flex justify-between font-mono-figure text-xs text-parchment/60">
          <span>$250k</span><span>$1m</span>
        </div>
        <p className="mt-7 border-t border-parchment/20 pt-4 font-mono-figure text-3xl text-gold-bright">
          {matches.length.toString().padStart(2, "0")}
        </p>
        <p className="mt-1 text-sm text-parchment/70">
          towns with a recorded median at or below this budget
        </p>
        <p className="mt-6 text-xs leading-relaxed text-parchment/50">
          Gold pins sit inside the budget lens. Click any pin for its complete
          public record, even when its median is above the selected amount.
        </p>
      </aside>
    </div>
  );
}