"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { Town } from "@/data/towns";
import { TownDetailPanel } from "@/components/map/TownDetailPanel";

const TownMap = dynamic(
  () => import("@/components/map/TownMap").then((m) => m.TownMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] w-full items-center justify-center rounded-sm border border-faded-rule bg-white/30 md:h-[520px]">
        <span className="font-mono-figure text-xs text-charcoal/50">
          Loading map…
        </span>
      </div>
    ),
  }
);

export function TownMapExplorer({ towns }: { towns: Town[] }) {
  const [selectedTownId, setSelectedTownId] = useState<string | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const selectedTown = towns.find((t) => t.id === selectedTownId) ?? null;

  function handleSelectTown(townId: string) {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setSelectedTownId(townId);
  }

  function handleClose() {
    setSelectedTownId(null);
    lastFocusedRef.current?.focus?.();
  }

  return (
    <>
      <TownMap towns={towns} onSelectTown={handleSelectTown} />
      <TownDetailPanel town={selectedTown} onClose={handleClose} />
    </>
  );
}
