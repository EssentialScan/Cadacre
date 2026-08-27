"use client";

import { useActionState, useEffect, useRef } from "react";
import { getShortlist } from "@/app/dashboard/actions";
import type { ShortlistResult } from "@/app/dashboard/types";
import { ShortlistResults } from "@/components/ShortlistResults";

type FormState = { result: ShortlistResult | null; error: string | null };

const initialState: FormState = { result: null, error: null };

async function submitAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const budget = Number(formData.get("budget"));
  const targetYieldPct = Number(formData.get("targetYieldPct"));

  try {
    const result = await getShortlist({ budget, targetYieldPct });
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
}: {
  clerkUserId: string;
  defaultBudget?: string;
  defaultYieldPct?: string;
  autoSubmit?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(submitAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

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
            min={1}
            step={1000}
            required
            defaultValue={defaultBudget}
            placeholder="650000"
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
