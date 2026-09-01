"use client";

import { useState, useTransition } from "react";
import { createWatch, deleteWatch, markMatchViewed } from "@/app/council-watch/actions";
import type { WatchWithMatches, WatchKind } from "@/app/council-watch/types";
import { AddWatchForm } from "./AddWatchForm";
import { WatchList } from "./WatchList";

export function CouncilWatchPanel({
  initialWatches,
  coveredLgas,
}: {
  initialWatches: WatchWithMatches[];
  coveredLgas: string[];
}) {
  const [watches, setWatches] = useState(initialWatches);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd(input: {
    kind: WatchKind;
    label: string;
    addressLine?: string;
    suburbName?: string;
    lgaDisplayName?: string;
  }) {
    setError(null);
    startTransition(async () => {
      try {
        const next = await createWatch(input);
        setWatches(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      try {
        const next = await deleteWatch(id);
        setWatches(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setDeletingId(null);
      }
    });
  }

  function handleView(matchId: string) {
    // Optimistic — the alert is what matters, a failed viewed-flag write
    // isn't worth surfacing as an error to the user.
    setWatches((prev) =>
      prev.map((w) => ({
        ...w,
        matches: w.matches.map((m) => (m.id === matchId ? { ...m, viewedAt: new Date().toISOString() } : m)),
      }))
    );
    markMatchViewed(matchId).catch(() => {});
  }

  return (
    <div className="space-y-8">
      <AddWatchForm coveredLgas={coveredLgas} onSubmit={handleAdd} submitting={isPending} error={error} />
      <WatchList watches={watches} onDelete={handleDelete} onView={handleView} deletingId={deletingId} />
    </div>
  );
}
