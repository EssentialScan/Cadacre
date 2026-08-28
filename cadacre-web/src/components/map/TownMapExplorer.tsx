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

export function TownMapExplorer({
  towns,
  budget,
  onMapClick,
  fullScreen,
}: {
  towns: Town[];
  budget?: number;
  onMapClick?: (lat: number, lng: number) => void;
  fullScreen?: boolean;
}) {
  const [selectedTownId, setSelectedTownId] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const selectedTown = towns.find((t) => t.id === selectedTownId) ?? null;
  const selectedContextTown = selectedLocation
    ? towns.reduce((nearest, town) => {
        const nearestDistance = Math.hypot(
          nearest.coordinates.lat - selectedLocation.lat,
          nearest.coordinates.lng - selectedLocation.lng
        );
        const townDistance = Math.hypot(
          town.coordinates.lat - selectedLocation.lat,
          town.coordinates.lng - selectedLocation.lng
        );
        return townDistance < nearestDistance ? town : nearest;
      })
    : null;

  function handleSelectTown(townId: string) {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setSelectedLocation(null);
    setSelectedTownId(townId);
  }

  function handleMapClick(lat: number, lng: number) {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setSelectedTownId(null);
    setSelectedLocation({ lat, lng });
  }

  function handleClose() {
    setSelectedTownId(null);
    setSelectedLocation(null);
    lastFocusedRef.current?.focus?.();
  }

  return (
    <>
      <TownMap
        towns={towns}
        budget={budget}
        selectedLocation={selectedLocation}
        selectedContextTown={selectedContextTown}
        fullScreen={fullScreen}
        onMapClick={onMapClick ?? handleMapClick}
        onSelectTown={handleSelectTown}
      />
      <TownDetailPanel town={selectedTown} location={selectedLocation} onClose={handleClose} />
    </>
  );
}
