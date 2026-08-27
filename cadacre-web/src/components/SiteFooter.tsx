import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-faded-rule bg-white/50 text-charcoal/80">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Image
              src="/content.png"
              alt="Cadacre"
              width={1254}
              height={1254}
              className="h-12 w-12"
            />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-charcoal/60">
              A plain, data-backed record of regional Australian towns for
              rentvesting — built from public housing data, not sponsored
              placements.
            </p>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold text-ink-navy">Site</p>
            <ul className="space-y-2 text-charcoal/60">
              <li>
                <a href="#how-it-works" className="hover:text-ink-navy">
                  How it works
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-ink-navy">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-ink-navy">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold text-ink-navy">Legal</p>
            <ul className="space-y-2 text-charcoal/60">
              <li>
                <a href="/terms" className="hover:text-ink-navy">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-ink-navy">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-faded-rule pt-6 text-xs leading-relaxed text-charcoal/50">
          <p>
            Cadacre provides general information based on public data and is
            not personalised financial, investment, or legal advice. Cadacre
            is not a licensed financial advisor, real estate agency, or
            lending platform. Always do your own research and consider
            speaking with a licensed professional before making an
            investment decision.
          </p>
          <p className="mt-4">
            © {new Date().getFullYear()} Cadacre. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
