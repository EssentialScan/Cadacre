import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirect_url?: string }>;
}) {
  const { userId } = await auth();
  const params = searchParams ? await searchParams : undefined;

  if (userId) {
    redirect(params?.redirect_url || "/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment">
      <SignIn {...(params?.redirect_url ? { forceRedirectUrl: params.redirect_url } : {})} />
    </div>
  );
}
