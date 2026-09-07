import { auth } from "@clerk/nextjs/server";
import { isSubscriber } from "@/lib/entitlements";
import { AppLayout } from "@/components/AppLayout";
import { redirect } from "next/navigation";

export default async function AppRouteLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard");
  }

  const proSubscriber = await isSubscriber(userId);

  return (
    <AppLayout isPro={proSubscriber}>
      {children}
    </AppLayout>
  );
}
