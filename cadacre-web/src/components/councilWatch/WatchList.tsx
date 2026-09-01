"use client";

import type { WatchWithMatches } from "@/app/council-watch/types";

const MATCH_REASON_LABEL: Record<string, string> = {
  lga: "matched by local government area",
  suburb: "matched by suburb",
  suburb_substring_fallback: "matched by suburb (address text match)",
  address_radius: "matched within your address radius",
  suburb_fallback_no_coords: "matched by suburb — source didn't publish coordinates for an exact radius check",
};

function formatDate(value: string | null): string {
  if (!value) return "unavailable";
  return new Date(value).toLocaleDateString("en-AU", { year: "numeric", month: "short", day: "numeric" });
}

export function WatchList({
  watches,
  onDelete,
  onView,
  deletingId,
}: {
  watches: WatchWithMatches[];
  onDelete: (id: string) => void;
  onView: (matchId: string) => void;
  deletingId: string | null;
}) {
  if (watches.length === 0) {
    return (
      <div className="rounded-sm border border-faded-rule bg-white/40 p-6 text-sm text-charcoal/60">
        No watches yet — add one above to start tracking development applications.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {watches.map((watch) => (
        <div key={watch.id} className="rounded-sm border border-faded-rule bg-white/60">
          <div className="flex items-center justify-between border-b border-faded-rule px-5 py-3">
            <div>
              <p className="font-medium text-ink-navy">{watch.label}</p>
              <p className="text-[11px] uppercase tracking-wide text-charcoal/50">
                {watch.kind} · {watch.lgaName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDelete(watch.id)}
              disabled={deletingId === watch.id}
              className="text-xs font-medium text-charcoal/50 hover:text-red-700 disabled:opacity-50"
            >
              {deletingId === watch.id ? "Removing…" : "Remove"}
            </button>
          </div>

          {watch.matches.length === 0 ? (
            <p className="px-5 py-4 text-sm text-charcoal/50">
              No matching applications yet — this watch is live and will pick up new matches.
            </p>
          ) : (
            <ul className="divide-y divide-faded-rule">
              {watch.matches.map((match) => (
                <li
                  key={match.id}
                  className={`px-5 py-4 ${match.viewedAt ? "" : "bg-survey-brass/5"}`}
                  onClick={() => !match.viewedAt && onView(match.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-navy">{match.application.address}</p>
                      {match.aiSummary ? (
                        <p className="mt-1 text-sm leading-relaxed text-charcoal/75">{match.aiSummary}</p>
                      ) : (
                        <p className="mt-1 text-sm leading-relaxed text-charcoal/75">
                          {match.application.description ?? "No description on file."}
                        </p>
                      )}
                      <p className="mt-2 text-[11px] text-charcoal/50">
                        {match.application.applicationType ?? "Type unavailable"} ·{" "}
                        {match.application.status ?? "Status unavailable"} · Lodged{" "}
                        {formatDate(match.application.lodgedDate)}
                        {match.application.decisionDate && (
                          <> · Decided {formatDate(match.application.decisionDate)}</>
                        )}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-wide text-charcoal/40">
                        {MATCH_REASON_LABEL[match.matchReason] ?? match.matchReason}
                      </p>
                    </div>
                    {!match.viewedAt && (
                      <span className="shrink-0 rounded-full bg-survey-brass px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-navy">
                        New
                      </span>
                    )}
                  </div>
                  <a
                    href={match.application.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs font-medium text-survey-brass hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View on council site →
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
