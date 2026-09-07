import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/db/client";
import { reits } from "@/db/schema";
import { desc, isNotNull } from "drizzle-orm";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";
import { isSubscriber } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard");
  }

  const proSubscriber = await isSubscriber(userId);

  const db = getDb();
  let allReits: any[] = [];
  
  if (db) {
    allReits = await db
      .select()
      .from(reits)
      .where(isNotNull(reits.yield))
      .orderBy(desc(reits.marketCap));
  }

  return <DashboardClient reits={allReits} isPro={proSubscriber} />;
}
