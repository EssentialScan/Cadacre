import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white mt-12">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <Image src="/content.png" alt="REITCompare" width={1254} height={1254} className="h-10 w-10" />
              <span className="font-display text-lg font-bold text-foreground">
                REIT<span className="text-brand-blue">Compare</span>
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground/60">
              The data layer for Australian property-backed investing.
            </p>
          </div>

          <div className="flex gap-16 text-sm">
            <nav className="space-y-2">
              <p className="mb-3 font-display font-bold text-foreground text-xs uppercase tracking-widest">Site</p>
              {[
                { href: "#how-it-works", label: "How it works" },
                { href: "#pricing", label: "Pricing" },
                { href: "#faq", label: "FAQ" },
              ].map(({ href, label }) => (
                <a key={href} href={href} className="block text-xs text-muted-foreground transition hover:text-brand-blue">
                  {label}
                </a>
              ))}
            </nav>
            <nav className="space-y-2">
              <p className="mb-3 font-display font-bold text-foreground text-xs uppercase tracking-widest">Legal</p>
              {[
                { href: "/terms", label: "Terms" },
                { href: "/privacy", label: "Privacy" },
              ].map(({ href, label }) => (
                <a key={href} href={href} className="block text-xs text-muted-foreground transition hover:text-brand-blue">
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-border/50 pt-6 text-[11px] leading-relaxed text-muted-foreground/40">
          <p>
            REITCompare provides general information based on public data and is not personalised financial, investment, tax or legal advice.
            REITCompare is not a licensed financial advisor and does not provide financial product advice. We may earn a commission from affiliate links on this site.
            Always do your own research and speak with a licensed professional before making an investment decision.
          </p>
          <p className="mt-3">© {new Date().getFullYear()} REITCompare.</p>
        </div>
      </div>
    </footer>
  );
}
