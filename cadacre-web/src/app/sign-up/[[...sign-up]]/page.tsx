import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirect_url?: string }>;
}) {
  const { userId } = await auth();

  if (userId) {
    const params = searchParams ? await searchParams : undefined;
    redirect(params?.redirect_url || "/shortlist");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment">
      <SignUp />
    </div>
  );
}
