import { getDb } from "@/db/client";
import { userProfiles, portfolioHoldings, reits } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AppLayout } from "@/components/AppLayout";
import { AmbientSection } from "@/components/ambient/AmbientSection";
import CommunityClient from "./CommunityClient";
import { auth } from "@clerk/nextjs/server";
import { isSubscriber } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const db = getDb();
  let publicPortfolios = [];
  
  if (db) {
    const publicUsers = await db.select().from(userProfiles).where(eq(userProfiles.isPortfolioPublic, true));
    for (const user of publicUsers) {
      const holdings = await db
        .select({
          ticker: reits.ticker,
          name: reits.name,
          units: portfolioHoldings.units,
          purchasePrice: portfolioHoldings.purchasePrice
        })
        .from(portfolioHoldings)
        .innerJoin(reits, eq(portfolioHoldings.reitId, reits.id))
        .where(eq(portfolioHoldings.userId, user.userId));

      if (holdings.length > 0) {
        const totalValue = holdings.reduce((acc, h) => acc + (h.units * h.purchasePrice), 0);
        const weightings = holdings.map(h => ({
          ticker: h.ticker,
          name: h.name,
          weightPct: totalValue > 0 ? ((h.units * h.purchasePrice) / totalValue) * 100 : 0
        })).sort((a, b) => b.weightPct - a.weightPct);

        publicPortfolios.push({
          username: user.username,
          holdings: weightings
        });
      }
    }
  }

  const { userId } = await auth();
  const proSubscriber = userId ? await isSubscriber(userId) : false;

  return (
    <div className="pb-24 pt-8">
      <div className="mx-auto max-w-5xl px-6 relative z-10">
        <CommunityClient initialPortfolios={publicPortfolios} />
      </div>
    </div>
  );
}
