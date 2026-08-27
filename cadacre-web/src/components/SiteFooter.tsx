export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-faded-rule bg-ink-navy text-parchment/80">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <span className="font-display text-lg font-semibold text-parchment">
              Cadacre
            </span>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-parchment/60">
              A plain, data-backed record of regional Australian towns for
              rentvesting — built from public housing data, not sponsored
              placements.
            </p>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold text-parchment">Site</p>
            <ul className="space-y-2 text-parchment/60">
              <li>
                <a href="#how-it-works" className="hover:text-parchment">
                  How it works
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-parchment">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-parchment">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold text-parchment">Legal</p>
            <ul className="space-y-2 text-parchment/60">
              <li>
                <a href="/terms" className="hover:text-parchment">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-parchment">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-parchment/15 pt-6 text-xs leading-relaxed text-parchment/50">
          <p>
            Cadacre provides general information based on public data (ABS,
            SQM Research) and is not personalised financial, investment, or
            legal advice. Cadacre is not a licensed financial advisor, real
            estate agency, or lending platform. Always do your own research
            and consider speaking with a licensed professional before making
            an investment decision.
          </p>
          <p className="mt-4">
            © {new Date().getFullYear()} Cadacre. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
