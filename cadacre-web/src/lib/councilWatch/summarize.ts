import { isNull, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { watchMatches, planningApplications } from "@/db/schema";
import { callGroq } from "@/lib/groq";

// Same grounding discipline as api/ai/concierge/route.ts: the model only
// ever phrases facts it was handed, never asserts one of its own. Single
// call (not the concierge's two-call filter-then-phrase pattern) because
// the facts here are already deterministic DB fields — there's no
// natural-language question to translate first.
export async function generatePendingAiSummaries(limit: number): Promise<number> {
  const db = getDb();
  const apiKey = process.env.GROQ_API_KEY;
  if (!db || !apiKey) return 0;

  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  const pending = await db
    .select({
      matchId: watchMatches.id,
      address: planningApplications.address,
      description: planningApplications.description,
      applicationType: planningApplications.applicationType,
      status: planningApplications.status,
      lodgedDate: planningApplications.lodgedDate,
      decisionDate: planningApplications.decisionDate,
      councilName: planningApplications.councilName,
    })
    .from(watchMatches)
    .innerJoin(planningApplications, eq(watchMatches.applicationId, planningApplications.id))
    .where(isNull(watchMatches.aiSummary))
    .limit(limit);

  let summarized = 0;

  for (const row of pending) {
    const facts = JSON.stringify({
      address: row.address,
      description: row.description,
      applicationType: row.applicationType,
      status: row.status,
      lodgedDate: row.lodgedDate,
      decisionDate: row.decisionDate,
      council: row.councilName,
    });

    try {
      const summary = await callGroq(
        apiKey,
        model,
        [
          {
            role: "system",
            content:
              "You phrase a 1-2 sentence plain-English summary of a development application, strictly from the supplied facts. Never invent an address, date, status, or detail not present in the facts — if a field is missing, simply omit it, don't guess. No advice or opinion, just a factual restatement.",
          },
          { role: "user", content: `Facts:\n${facts}` },
        ],
        false
      );
      if (summary.trim()) {
        await db
          .update(watchMatches)
          .set({ aiSummary: summary.trim(), aiSummaryGeneratedAt: new Date() })
          .where(eq(watchMatches.id, row.matchId));
        summarized += 1;
      }
    } catch {
      // Leave aiSummary null — the UI falls back to the real raw fields,
      // never a fabricated placeholder. Try again next cron run.
    }
  }

  return summarized;
}
