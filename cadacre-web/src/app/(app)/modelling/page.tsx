import { getDb } from "@/db/client";
import { reits } from "@/db/schema";
import ModellingClient from "./ModellingClient";
import { isNotNull } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export default async function ModellingPage() {
  const db = getDb();
  let availableReits: any[] = [];
  
  if (db) {
    availableReits = await db
      .select({
        id: reits.id,
        ticker: reits.ticker,
        name: reits.name,
      })
      .from(reits)
      .where(isNotNull(reits.yield));
  }

  return (
    <div className="pb-24 pt-8">
      <div className="mx-auto max-w-5xl px-6 relative z-10">
        <ModellingClient initialReits={availableReits} />
      </div>
    </div>
  );
}
