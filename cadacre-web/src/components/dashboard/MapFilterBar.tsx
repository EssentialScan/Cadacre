"use client";

import { useMemo } from "react";
import type { Town } from "@/data/towns";
import { matchesFilters, type TownMapFilters } from "@/lib/townFilters";

export type { TownMapFilters as MapFilters };

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="font-mono-figure text-[9px] uppercase tracking-[0.16em] text-charcoal/45"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean | undefined;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex h-[30px] items-center gap-1.5 self-end rounded-sm border border-faded-rule bg-white/80 px-2.5 text-[11px] font-medium text-ink-navy"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked ?? false}
        className="h-3 w-3 accent-survey-brass"
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

const inputClass =
  "w-24 rounded-sm border border-faded-rule bg-white/80 px-2.5 py-1.5 font-mono-figure text-xs text-ink-navy placeholder:text-charcoal/30 outline-none transition focus:border-survey-brass focus:bg-white";

export function MapFilterBar({
  towns,
  filters,
  onFiltersChange,
  defaultBudget,
  defaultYieldPct,
  savedTownIds,
}: {
  towns: Town[];
  filters: TownMapFilters;
  onFiltersChange: (filters: TownMapFilters) => void;
  defaultBudget?: string;
  defaultYieldPct?: string;
  savedTownIds?: Set<string>;
}) {
  const matchCount = useMemo(
    () => towns.filter((t) => matchesFilters(t, filters, { savedTownIds })).length,
    [towns, filters, savedTownIds]
  );
  const filtersActive =
    filters.budget !== undefined ||
    filters.minYieldPct !== undefined ||
    filters.maxVacancyPct !== undefined ||
    filters.maxRent !== undefined ||
    filters.hideBushfireRisk ||
    filters.hideFloodRisk ||
    filters.infrastructureOnly ||
    filters.savedOnly ||
    filters.minPopulationGrowthPct !== undefined;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-4 z-[900] flex justify-center">
      <div className="terminal-corners pointer-events-auto inline-flex flex-col gap-3 rounded-sm border border-faded-rule bg-parchment/70 px-4 py-3 shadow-[0_24px_60px_-20px_rgba(18,22,28,0.25)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono-figure text-[9px] uppercase tracking-[0.22em] text-survey-brass">
            Screen
          </span>
          <span className="font-mono-figure text-[10px] tabular-nums text-charcoal/50">
            {filtersActive ? `${matchCount} / ${towns.length}` : `${towns.length} towns`}
          </span>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <Field label="Budget" htmlFor="bar-budget">
            <input
              id="bar-budget"
              type="number"
              min={0}
              step={1000}
              defaultValue={defaultBudget}
              placeholder="650,000"
              onChange={(e) => {
                const value = Number(e.target.value);
                onFiltersChange({ ...filters, budget: e.target.value && !Number.isNaN(value) ? value : undefined });
              }}
              className={inputClass}
            />
          </Field>

          <Field label="Min yield %" htmlFor="bar-yield">
            <input
              id="bar-yield"
              type="number"
              min={0}
              max={20}
              step={0.1}
              defaultValue={defaultYieldPct}
              placeholder="5.0"
              onChange={(e) => {
                const value = Number(e.target.value);
                onFiltersChange({ ...filters, minYieldPct: e.target.value && !Number.isNaN(value) ? value : undefined });
              }}
              className={inputClass}
            />
          </Field>

          <Field label="Max vacancy %" htmlFor="bar-vacancy">
            <input
              id="bar-vacancy"
              type="number"
              min={0}
              max={100}
              step={0.1}
              placeholder="Any"
              onChange={(e) => {
                const value = Number(e.target.value);
                onFiltersChange({ ...filters, maxVacancyPct: e.target.value && !Number.isNaN(value) ? value : undefined });
              }}
              className={inputClass}
            />
          </Field>

          <Field label="Max rent p.w." htmlFor="bar-rent">
            <input
              id="bar-rent"
              type="number"
              min={0}
              step={10}
              placeholder="Any"
              onChange={(e) => {
                const value = Number(e.target.value);
                onFiltersChange({ ...filters, maxRent: e.target.value && !Number.isNaN(value) ? value : undefined });
              }}
              className={inputClass}
            />
          </Field>

          <Field label="Min pop. growth %" htmlFor="bar-pop-growth">
            <input
              id="bar-pop-growth"
              type="number"
              step={0.5}
              placeholder="Any"
              onChange={(e) => {
                const value = Number(e.target.value);
                onFiltersChange({ ...filters, minPopulationGrowthPct: e.target.value && !Number.isNaN(value) ? value : undefined });
              }}
              className={inputClass}
            />
          </Field>

          <Toggle
            id="bar-bushfire"
            label="Hide bushfire risk"
            checked={filters.hideBushfireRisk}
            onChange={(checked) => onFiltersChange({ ...filters, hideBushfireRisk: checked })}
          />
          <Toggle
            id="bar-flood"
            label="Hide flood risk"
            checked={filters.hideFloodRisk}
            onChange={(checked) => onFiltersChange({ ...filters, hideFloodRisk: checked })}
          />
          <Toggle
            id="bar-infra"
            label="Has infrastructure"
            checked={filters.infrastructureOnly}
            onChange={(checked) => onFiltersChange({ ...filters, infrastructureOnly: checked })}
          />
          <Toggle
            id="bar-saved"
            label="Saved only"
            checked={filters.savedOnly}
            onChange={(checked) => onFiltersChange({ ...filters, savedOnly: checked })}
          />

          {filtersActive && (
            <button
              type="button"
              onClick={() => onFiltersChange({})}
              className="h-[30px] self-end rounded-sm border border-faded-rule px-2.5 text-[11px] font-medium text-charcoal/60 transition hover:border-survey-brass hover:text-survey-brass"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
