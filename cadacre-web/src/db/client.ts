import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type Db = ReturnType<typeof drizzle<typeof schema>>;

// Returns null if DATABASE_URL isn't set — callers must treat this as an
// honest "not configured" state (same convention as GROQ_API_KEY gating in
// api/ai/concierge/route.ts), never throw or silently no-op. neon-http is
// fetch-based, so there's no persistent connection to leak across
// serverless invocations — safe to call this per request.
export function getDb(): Db | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return drizzle(neon(url), { schema });
}
