import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirect_url?: string }>;
}) {
  const { userId } = await auth();
  const params = searchParams ? await searchParams : undefined;

  if (userId) {
    redirect(params?.redirect_url || "/shortlist");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment">
      <SignUp {...(params?.redirect_url ? { forceRedirectUrl: params.redirect_url } : {})} />
    </div>
  );
}
