"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { getShortlist } from "@/app/dashboard/actions";
import type { ShortlistResult } from "@/app/dashboard/types";
import { DEFAULT_RANK_WEIGHTS, type RankWeights } from "@/lib/rankTowns";
import { ShortlistResults } from "@/components/ShortlistResults";

type FormState = { result: ShortlistResult | null; error: string | null };

const initialState: FormState = { result: null, error: null };

async function submitAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const budget = Number(formData.get("budget"));
  const targetYieldPct = Number(formData.get("targetYieldPct"));
  const weights: RankWeights = {
    affordability: Number(formData.get("weightAffordability")),
    yield: Number(formData.get("weightYield")),
    vacancy: Number(formData.get("weightVacancy")),
  };

  try {
    const result = await getShortlist({ budget, targetYieldPct, weights });
    return { result, error: null };
  } catch (err) {
    return {
      result: null,
      error: err instanceof Error ? err.message : "Something went wrong.",
    };
  }
}

export function ShortlistForm({
  clerkUserId,
  defaultBudget,
  defaultYieldPct,
  autoSubmit,
  onBudgetChange,
  isSubscriber,
}: {
  clerkUserId: string;
  defaultBudget?: string;
  defaultYieldPct?: string;
  autoSubmit?: boolean;
  onBudgetChange?: (budget: number | undefined) => void;
  isSubscriber?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(submitAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [weights, setWeights] = useState<RankWeights>(DEFAULT_RANK_WEIGHTS);

  useEffect(() => {
    if (autoSubmit) {
      formRef.current?.requestSubmit();
    }
    // Only auto-submit once, on mount, right after an unlock redirect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <form
        ref={formRef}
        action={formAction}
        className="space-y-6 rounded-sm border border-faded-rule bg-white/50 p-6"
      >
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-ink-navy">
            Budget (AUD)
          </label>
          <input
            id="budget"
            name="budget"
            type="number"
            min={0}
            step={1000}
            required
            defaultValue={defaultBudget}
            placeholder="650000"
            onChange={(e) => {
              const value = Number(e.target.value);
              onBudgetChange?.(e.target.value && !Number.isNaN(value) ? value : undefined);
            }}
            className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-4 py-2 font-mono-figure text-sm outline-none focus:border-ink-navy"
          />
        </div>
        <div>
          <label
            htmlFor="targetYieldPct"
            className="block text-sm font-medium text-ink-navy"
          >
            Target gross yield (%)
          </label>
          <input
            id="targetYieldPct"
            name="targetYieldPct"
            type="number"
            min={0}
            max={20}
            step={0.1}
            required
            defaultValue={defaultYieldPct}
            placeholder="5.0"
            className="mt-2 w-full rounded-sm border border-faded-rule bg-parchment px-4 py-2 font-mono-figure text-sm outline-none focus:border-ink-navy"
          />
        </div>

        {isSubscriber ? (
          <div>
            <p className="text-sm font-medium text-ink-navy">
              Ranking weights <span className="text-charcoal/40">(Subscriber)</span>
            </p>
            <div className="mt-3 space-y-3">
              {(
                [
                  { key: "affordability" as const, label: "Affordability" },
                  { key: "yield" as const, label: "Gross yield" },
                  { key: "vacancy" as const, label: "Vacancy rate" },
                ]
              ).map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-xs text-charcoal/60">{label}</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={weights[key]}
                    onChange={(e) => setWeights((w) => ({ ...w, [key]: Number(e.target.value) }))}
                    className="flex-1 accent-survey-brass"
                  />
                  <span className="w-10 shrink-0 text-right font-mono-figure text-xs text-ink-navy">
                    {weights[key]}
                  </span>
                </div>
              ))}
            </div>
            <input type="hidden" name="weightAffordability" value={weights.affordability} />
            <input type="hidden" name="weightYield" value={weights.yield} />
            <input type="hidden" name="weightVacancy" value={weights.vacancy} />
          </div>
        ) : (
          <>
            <input type="hidden" name="weightAffordability" value={DEFAULT_RANK_WEIGHTS.affordability} />
            <input type="hidden" name="weightYield" value={DEFAULT_RANK_WEIGHTS.yield} />
            <input type="hidden" name="weightVacancy" value={DEFAULT_RANK_WEIGHTS.vacancy} />
          </>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-sm bg-ink-navy px-6 py-3 text-sm font-semibold text-parchment transition hover:bg-ink-navy/90 disabled:cursor-not-allowed disabled:bg-ink-navy/40"
        >
          {isPending ? "Searching public records…" : "Generate shortlist"}
        </button>
      </form>

      {state.error && (
        <p className="mt-4 text-sm text-red-700">{state.error}</p>
      )}

      {state.result && (
        <ShortlistResults result={state.result} clerkUserId={clerkUserId} />
      )}
    </div>
  );
}
