import Image from "next/image";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[9998] bg-white  border-b border-border shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/content.png"
            alt="REITCompare"
            width={1254}
            height={1254}
            priority
            className="h-10 w-10"
          />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            REIT<span className="text-primary">Compare</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 whitespace-nowrap text-sm font-medium text-muted-foreground lg:flex xl:gap-7">
          <Link href="/explore" className="transition hover:text-primary">
            Asset Map
          </Link>
          <Link href="/#pricing" className="transition hover:text-primary">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <Link href="/sign-in?redirect_url=/dashboard">
              <Button variant="ghost" className="text-sm">Log in</Button>
            </Link>
            <Link href="/sign-up?redirect_url=/dashboard">
              <Button className="text-sm">Sign up</Button>
            </Link>
          </Show>
          <Show when="signed-in">
            <div className="hidden items-center gap-5 whitespace-nowrap lg:flex xl:gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground transition hover:text-primary"
              >
                Dashboard
              </Link>
            </div>
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
