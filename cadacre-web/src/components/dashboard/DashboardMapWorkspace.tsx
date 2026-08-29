"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getSavedTownIds, toggleSavedTown } from "@/app/dashboard/actions";
import { CompareDrawer } from "@/components/dashboard/CompareDrawer";
import { MapFilterBar } from "@/components/dashboard/MapFilterBar";
import { TownDetailDrawer } from "@/components/dashboard/TownDetailDrawer";
import type { Town } from "@/data/towns";
import type { TownMapFilters } from "@/lib/townFilters";

const TownMap = dynamic(
  () => import("@/components/map/TownMap").then((m) => m.TownMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-white/30">
        <span className="font-mono-figure text-xs text-charcoal/50">
          Loading map…
        </span>
      </div>
    ),
  }
);

const MAX_COMPARE = 4;

export function DashboardMapWorkspace({
  towns,
  defaultBudget,
  defaultYieldPct,
}: {
  towns: Town[];
  defaultBudget?: string;
  defaultYieldPct?: string;
}) {
  const [filters, setFilters] = useState<TownMapFilters>({
    budget: defaultBudget && !Number.isNaN(Number(defaultBudget)) ? Number(defaultBudget) : undefined,
    minYieldPct: defaultYieldPct && !Number.isNaN(Number(defaultYieldPct)) ? Number(defaultYieldPct) : undefined,
  });
  const [selectedTownId, setSelectedTownId] = useState<string | null>(null);
  const [savedTownIds, setSavedTownIds] = useState<Set<string>>(new Set());
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const selectedTown = towns.find((t) => t.id === selectedTownId) ?? null;
  const compareTowns = towns.filter((t) => compareIds.includes(t.id));

  useEffect(() => {
    getSavedTownIds()
      .then((ids) => setSavedTownIds(new Set(ids)))
      .catch(() => {});
  }, []);

  async function handleToggleSave() {
    if (!selectedTownId) return;
    const next = await toggleSavedTown(selectedTownId);
    setSavedTownIds(new Set(next));
  }

  function handleToggleCompare() {
    if (!selectedTownId) return;
    setCompareIds((prev) => {
      if (prev.includes(selectedTownId)) {
        return prev.filter((id) => id !== selectedTownId);
      }
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, selectedTownId];
    });
  }

  function handleRemoveFromCompare(townId: string) {
    setCompareIds((prev) => prev.filter((id) => id !== townId));
  }

  return (
    <div className="relative h-full w-full">
      <TownMap
        towns={towns}
        budget={filters.budget}
        minYieldPct={filters.minYieldPct}
        maxVacancyPct={filters.maxVacancyPct}
        maxRent={filters.maxRent}
        hideBushfireRisk={filters.hideBushfireRisk}
        hideFloodRisk={filters.hideFloodRisk}
        infrastructureOnly={filters.infrastructureOnly}
        savedOnly={filters.savedOnly}
        savedTownIds={savedTownIds}
        minPopulationGrowthPct={filters.minPopulationGrowthPct}
        region={filters.region}
        fullScreen
        onSelectTown={setSelectedTownId}
      />

      <MapFilterBar
        towns={towns}
        filters={filters}
        onFiltersChange={setFilters}
        defaultBudget={defaultBudget}
        defaultYieldPct={defaultYieldPct}
        savedTownIds={savedTownIds}
      />

      {compareIds.length >= 2 && (
        <button
          type="button"
          onClick={() => setCompareOpen(true)}
          className="pointer-events-auto absolute bottom-24 left-3 z-[900] rounded-sm border border-survey-brass bg-parchment/90 px-3 py-2 font-mono-figure text-[11px] font-semibold uppercase tracking-wide text-survey-brass shadow-[0_12px_30px_-15px_rgba(18,22,28,0.4)] backdrop-blur-md transition hover:bg-white"
        >
          Compare · {compareIds.length}
        </button>
      )}

      <p className="pointer-events-none absolute bottom-3 right-3 z-[900] max-w-xs rounded-sm border border-faded-rule bg-parchment/80 px-3 py-1.5 text-right font-mono-figure text-[9px] leading-relaxed text-charcoal/55 backdrop-blur-md">
        General public-data information, not personalised financial or investment advice.
      </p>

      <TownDetailDrawer
        town={selectedTown}
        isSaved={selectedTownId ? savedTownIds.has(selectedTownId) : false}
        onToggleSave={handleToggleSave}
        isComparing={selectedTownId ? compareIds.includes(selectedTownId) : false}
        canAddToCompare={compareIds.length < MAX_COMPARE}
        onToggleCompare={handleToggleCompare}
        onClose={() => setSelectedTownId(null)}
      />

      <CompareDrawer
        towns={compareTowns}
        open={compareOpen}
        onRemove={handleRemoveFromCompare}
        onClose={() => setCompareOpen(false)}
      />
    </div>
  );
}
