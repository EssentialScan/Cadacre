import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ComparisonTable } from "@/components/ComparisonTable";
import { getDb } from "@/db/client";
import { reits } from "@/db/schema";

export const metadata = {
  title: "A-REIT Comparison | REITCompare",
  description: "Compare ASX-listed A-REITs by yield, NTA discount, gearing, and WALE.",
};

export const dynamic = 'force-dynamic';

export default async function ComparisonPage() {
  const db = getDb();
  const dbReits = db ? await db.select().from(reits) : [];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-parchment/30">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink-navy">
              A-REIT Comparison
            </h1>
            <p className="mt-3 text-lg text-charcoal/60">
              Filter and sort all ASX-listed property trusts. No ratings, just the data.
            </p>
          </div>
          
          <ComparisonTable reits={dbReits} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
