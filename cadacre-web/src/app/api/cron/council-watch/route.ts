import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { watches } from "@/db/schema";
import { ADAPTERS } from "@/lib/councilWatch/adapters";
import { ingestAdapterResults } from "@/lib/councilWatch/ingest";
import { matchNewApplications } from "@/lib/councilWatch/match";
import { generatePendingAiSummaries } from "@/lib/councilWatch/summarize";

export const runtime = "nodejs";
export const maxDuration = 60;

// Council/planning-monitoring cron (AGENTS.md §5m). Vercel Cron invokes
// this on schedule (see vercel.json, added in Phase 3) with an
// `Authorization: Bearer $CRON_SECRET` header once CRON_SECRET is set in
// the environment. In Phase 1 this is triggered manually (curl with the
// bearer secret) to prove the pipeline before any live schedule exists.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "Cron not configured." }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const db = getDb();
  const watchedLgas = db
    ? (await db.selectDistinct({ lgaName: watches.lgaName }).from(watches)).map((w) => w.lgaName)
    : [];

  const fetchResults = await Promise.allSettled(
    ADAPTERS.map((adapter) => adapter.fetchApplications({ watchedLgas }))
  );

  const ingestResults: { source: string; newCount?: number; error?: string }[] = [];
  let newApplicationIds: string[] = [];

  for (let i = 0; i < ADAPTERS.length; i++) {
    const adapter = ADAPTERS[i];
    const result = fetchResults[i];
    if (result.status === "rejected") {
      // One broken adapter never blocks ingestion for every other source —
      // honest partial failure, not all-or-nothing.
      ingestResults.push({ source: adapter.key, error: String(result.reason) });
      continue;
    }
    const newIds = await ingestAdapterResults(adapter.key, result.value);
    ingestResults.push({ source: adapter.key, newCount: newIds.length });
    newApplicationIds = newApplicationIds.concat(newIds);
  }

  const newMatches = await matchNewApplications(newApplicationIds);
  const summarized = await generatePendingAiSummaries(50);

  return NextResponse.json({ ok: true, ingestResults, newMatches, summarized });
}
