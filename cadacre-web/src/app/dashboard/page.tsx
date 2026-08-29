import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { DashboardMapWorkspace } from "@/components/dashboard/DashboardMapWorkspace";
import { LiveClock } from "@/components/dashboard/LiveClock";
import { getAllTowns } from "@/data";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const budgetParam = typeof params.budget === "string" ? params.budget : undefined;
  const yieldParam = typeof params.yield === "string" ? params.yield : undefined;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-parchment">
      <header className="relative h-14 shrink-0 border-b border-faded-rule bg-parchment/95 shadow-[0_1px_0_rgba(29,95,214,0.12)] backdrop-blur">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/content.png"
              alt="Cadacre"
              width={1254}
              height={1254}
              priority
              className="h-8 w-8 rounded-sm"
            />
            <span className="hidden font-mono-figure text-[10px] uppercase tracking-[0.3em] text-charcoal/45 sm:inline">
              Live Town Record
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <LiveClock />
            <span className="hidden font-mono-figure text-[10px] uppercase tracking-[0.2em] text-survey-brass md:inline">
              NSW · Regional towns
            </span>
            <Link
              href="/shortlist"
              className="hidden rounded-sm bg-survey-brass px-3 py-1.5 text-[11px] font-semibold text-ink-navy transition hover:bg-survey-brass/90 sm:inline-block"
            >
              Get your ranked shortlist
            </Link>
            <span className="hidden gap-3 text-[10px] text-charcoal/40 md:flex">
              <Link href="/terms" className="hover:text-ink-navy">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-ink-navy">
                Privacy
              </Link>
            </span>
            <UserButton
              appearance={{
                elements: { userButtonAvatarBox: "h-7 w-7" },
              }}
            />
          </div>
        </div>
      </header>

      <section className="relative min-h-0 w-full flex-1">
        <DashboardMapWorkspace
          towns={getAllTowns()}
          defaultBudget={budgetParam}
          defaultYieldPct={yieldParam}
        />
      </section>
    </div>
  );
}
