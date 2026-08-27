# AGENTS.md — Cadacre

This file gives any AI coding agent (Claude Code, etc.) working on this repo full context on what Cadacre is, who it's for, what's already built, and the constraints that must not be violated. Read this in full before making changes.

---

## 1. What Cadacre Is

**One-line pitch:** A web tool that gives Sydney buyers priced out of the local market a plain, data-backed shortlist of regional Australian towns to rentvest in — free of sponsored placements or sales pressure.

**The problem:** Sydney's median house price has pushed home ownership out of reach for most first-time buyers. The common workaround — rentvesting (buying an investment property elsewhere while renting where you live) — is well known, but choosing *where* to invest is guesswork. People currently rely on scattered spreadsheets, outdated blog posts, or advice from buyer's agents who have a financial incentive to point them somewhere specific.

**The solution:** User enters budget and target yield → Cadacre filters/ranks regional towns using public data (median price, gross rental yield, vacancy rate) → first 3 results free, full ranked report + downloadable PDF behind a one-time $39 payment.

**Target user:** Sydney-based renters/buyers, priced out of the local market, considering rentvesting or regional investing for the first time. Not sophisticated investors — assume limited property jargon knowledge.

**Explicitly NOT:** a licensed financial advice service, a real estate agency, a lending platform, or a marketplace connecting buyers to specific off-market deals. Do not build features that blur these lines without explicit legal review first (see Section 4).

---

## 2. Business Model & Roadmap

### Phase 1 (Current — Month 1 / MVP)
- Single paid tool, one-time $39 payment via Stripe Payment Link (no subscription)
- Free teaser (top 3 results) to drive top-of-funnel interest
- Manual/semi-manual report delivery is acceptable at this stage
- Free monthly "Rentvestor Index" content post (ungated, shareable) for brand-building and SEO — this is NOT a paid feature, keep it free indefinitely
- Small manually-curated community (WhatsApp/Discord) of first 20-50 users, traded free tool access for honest feedback and real outcome data

### Phase 2 (Month 2+, only after Phase 1 is validated with real paying customers)
- Consider recurring subscription tier (e.g. alerts on new towns entering budget range, a "deal screener" tool) — do not build until Phase 1's core loop (visit → survey → paywall → purchase) is proven to convert
- Consider expanding data sources beyond ABS/SQM

### Phase 3 (Not in scope yet — requires legal review before any code is written)
- "Concierge" referral service connecting buyers to vetted buyer's agents/conveyancers/property managers for a fee (~$500-1,000 flat fee, referral commission from providers)
- **DO NOT BUILD THIS WITHOUT EXPLICIT INSTRUCTION.** Conveyancing and buyer's-agent referral fee arrangements are regulated at the state level in Australia and require proper legal advice before implementation. This is a business-model decision, not a coding task — flag it back to the founder if asked to build referral/commission logic.
- Community "Trust Score" / reputation algorithms — treat as aspirational, not a near-term build

**Do not treat any hypothetical future revenue model (Concierge fees, crowd-sourced proprietary data, subscription LTV) as validated or committed. Only build what's explicitly requested for the current phase.**

---

## 3. Brand & Design System

**Name origin:** "Cadacre" riffs on *cadastre* — the real term for a government land/property record. The entire visual identity should read as "a modern land registry," not a generic SaaS dashboard.

**Design tokens (do not deviate without discussion):** token *names* below are
stable and used throughout the codebase (`bg-parchment`, `text-ink-navy`,
etc. in `src/app/globals.css`); the underlying hex values were updated
2026-08-27 to a "premium land registry" palette — near-black ink, warm ivory
canvas, antique gold accent, deep teal secondary. Changing the values in
`globals.css` cascades everywhere automatically since every component
references the token names, not hardcoded hex.
- Ink Navy `#12161C` — primary dark / headings
- Parchment `#F6F2E9` — primary background
- Survey Brass `#C6992F` (bright variant `#E0B64B`) — accent, CTAs
- Deep Forest `#1F4741` — secondary accent
- Faded Rule `#D9D2C1` — hairlines, dividers, disabled/locked states
- Charcoal `#2B2A25` — body text

**Typography:**
- Display: **Fraunces** (serif, characterful — used for most headlines, section titles, the numeral system in "How it works")
- Body/UI: **IBM Plex Sans** — also used bold/tight-tracked for the homepage Hero headline specifically, for a more corporate/professional feel than the serif elsewhere
- Data/figures: **IBM Plex Mono** — all numbers (prices, yields, percentages) should render in mono to reinforce the "recorded, not decorated" feel

**Logo:** `public/content.png` (1254×1254, square lockup — "CA" monogram over "CADACRE" wordmark, ivory background) — used in `SiteHeader.tsx` and `SiteFooter.tsx`. Keep it square-cropped as-is; don't stretch or reflow the lockup.

**Signature UI element:** Results are displayed as a "ledger" — ruled rows, monospace figures, a check-mark per qualifying entry — not a generic dashboard card grid. Preserve this pattern when adding new result types.

**Voice:** Plain, factual, quietly confident. Never salesy or hype-driven. Copy should read like a land record, not a marketing page. Avoid superlatives ("the best," "amazing") — prefer specific, checkable claims.

**Existing prototype:** `cadacre.html` — a single-file static prototype with working client-side filtering logic on sample data. This is the reference implementation for visual style and interaction pattern; production build should preserve the design language exactly.

---

## 4. Legal & Compliance Constraints (Non-Negotiable)

These apply to every feature, every piece of copy, and every code change. If a requested feature conflicts with these, flag it rather than building it silently.

1. **Never present output as personalized financial or investment advice.** All copy must frame results as "general information based on public data," not recommendations. Every report and every page displaying town rankings must carry a visible disclaimer.
2. **Property investment advice is currently unregulated in Australia (no AFSL required)** — but do not let this become an excuse for spruiking-style language ("you should buy here," "guaranteed returns," "hot pick"). Keep language descriptive, not prescriptive.
3. **No personalized "you should buy this specific property" outputs.** Only aggregate/ranked town-level data, never individual property recommendations.
4. **Community features (forum, WhatsApp, Discord) require moderation for defamation risk** — users naming specific agents/brokers/developers negatively creates real publisher liability. Any community feature must include a visible moderation policy and ToS clause stating user posts are their own opinions.
5. **Any future referral link or sponsored content must be clearly disclosed** per Australian Consumer Law — no exceptions, no "soft" disclosure.
6. **Required legal documents before any real payment is taken:** Terms of Service (must state general-information-only positioning) and Privacy Policy (required given email/personal data collection). Do not enable live Stripe payments in any environment before these are live on the site.
7. **Do not build the Concierge/referral commission feature** without the founder confirming legal review has happened (see Section 2, Phase 3).

---

## 5. Tech Stack & Data

**Current state:** Single static HTML/CSS/JS file (`cadacre.html`), client-side only, no backend, no database, sample/placeholder town data hardcoded in JS.

**Intended stack for production build (adjust if founder specifies otherwise):**
- Frontend: Next.js or plain React, deployed to Vercel
- Data storage: Start with a Google Sheet as the town dataset (simplest to edit manually) or migrate to Supabase once data needs grow
- Payments: Stripe (Payment Links for MVP simplicity; move to Stripe Checkout API only if a real backend is added)
- PDF generation: any standard PDF library, templated from user's survey inputs
- Analytics: Plausible or Google Analytics
- Email capture: Mailchimp or ConvertKit

**Data sources for the town dataset (real data required before production launch — current dataset is placeholder/sample only):**
- Australian Bureau of Statistics (ABS) — abs.gov.au — for regional demographic and housing data
- SQM Research — free vacancy rate data
- Do not fabricate or estimate data points if real source data is unavailable — mark as "data unavailable" rather than guessing a plausible-looking number.

**Sample dataset fields per town:** name, state, median_price, gross_yield_pct, vacancy_rate_pct — expand only with real, sourced data, never invented figures.

### 5a. Hazard flags & infrastructure projects (town-level, sourced)

Added on top of the core price/yield/vacancy fields. Same non-negotiable rule
applies: **real, sourced data only — never fabricated, never estimated.** If
no credible official source is found for a town, the field is marked
`"Not mapped"` / omitted, exactly like a missing price or yield figure.

- **Bushfire risk flag** — sourced from the relevant state emergency service
  (NSW: NSW RFS Bush Fire Prone Land mapping / disaster declaration history).
  Displayed in the ledger as a small icon next to the town, town-level only.
- **Flood risk flag** — sourced from the relevant state emergency service
  (NSW: NSW SES flood information, council flood studies, BOM flood
  classifications, disaster declaration history). Same display rule as
  bushfire.
- **Publicly announced infrastructure projects** — new hospitals, highways,
  rail lines, university campuses, defence bases. Sourced from state
  government budget papers, Infrastructure Australia, or council websites.
  Stored and rendered as plain text, e.g.:
  `"Inland Rail corridor — planned completion 2027 (source: ARTC)"`.
  Shown in the full PDF report per town (not crammed into the free ledger).
- **Granularity rule (hard constraint):** all of the above stays at
  **town-level**. Never drop to property-level hazard or infrastructure
  analysis — that would imply a specific-address assessment Cadacre is not
  licensed or positioned to make (see Section 4). The PDF report's
  "Before you proceed" checklist exists specifically to push
  property-specific verification (exact-address bushfire/flood risk,
  building/pest inspection, insurance quotes, etc.) back onto the buyer and
  their own professionals, not onto Cadacre.
- **PDF report "Before you proceed" checklist** — 5-7 items a rentvestor
  should verify independently before acting on the shortlist (e.g. confirm
  the *exact address's* bushfire/flood risk via council Section 10.7
  certificate, get a building/pest inspection, get insurance quotes before
  purchasing, verify rental appraisal with local property managers, check
  zoning/nearby planned developments, speak to a licensed advisor). This
  checklist is the mechanism that keeps the product legally and honestly
  town-level (see Section 4, item 3) while still being genuinely useful.
- **Important research finding (2026-08-27):** neither NSW RFS nor NSW SES
  publishes a single official Low/Moderate/High/Extreme rating per town —
  RFS Bush Fire Prone Land mapping is parcel/vegetation-category level, and
  SES doesn't issue a categorical adjective per LGA either. The `level` on
  each town's `bushfireRisk`/`floodRisk` in `src/data/towns.ts` is
  **Cadacre's own characterization**, assigned only where there's solid
  documented evidence (an explicit official statement, a declared disaster,
  or quantified flood-study findings) — otherwise `level: null` ("Not
  mapped"), never a guess. Every UI/PDF surface of these fields must keep
  saying this is Cadacre's characterization, not a quoted agency rating —
  see the disclaimer text in `src/app/api/report/route.tsx` and the tooltip
  copy in `src/components/HazardIcons.tsx` for the exact wording to reuse.

### 5b. Google Maps (town-level entry point, not property-level analysis)

Each ledger row (web ledger and the homepage sample ledger) has a small map
pin next to the town name (`src/components/TownMapToggle.tsx`) that toggles
an inline embedded Google Map for that town, plus a link to open it in
Google Maps directly.

- **Implementation:** the keyless Google Maps embed
  (`https://www.google.com/maps?q=<query>&output=embed`) — no API key or
  billing required, works immediately. This is intentionally the simplest
  thing that works; there is no `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` configured
  anywhere in this repo yet.
- **Upgrade path:** a richer multi-marker interactive map (e.g. all ranked
  towns pinned on one map with an info-window of their ledger data) would
  need the Maps JavaScript API, which requires a billed Google Cloud API
  key. Don't wire that up speculatively — do it when asked, and add the key
  to `.env.local.example` with setup notes at that point.
- **Granularity boundary (important):** the map lets a user pan/zoom/street-
  view to a specific address *inside Google's own product* once they click
  through — that's fine, it's the user doing their own lookup, not Cadacre
  publishing a property-level assessment. Do not use this map integration to
  add any Cadacre-generated property-level rating, pin annotation, or
  recommendation layer on top of it — that would violate the town-level-only
  rule in Section 4 and §5a above. The UI copy next to the map pin ("opens
  Google Maps, where you can look up a specific property yourself") exists
  to keep that boundary explicit to users — keep it if you touch this code.

### 5c. Dashboard town map + detail panel (separate from 5b, free/open)

`/dashboard` now renders an interactive map of all 18 towns immediately on
load, above the budget/yield form — `src/components/map/TownMapExplorer.tsx`
(orchestrator), `TownMap.tsx` (Leaflet map), `TownDetailPanel.tsx` (the
click-through detail dialog). This is a **separate feature** from §5b's
per-row Google Maps toggle — different library, different purpose:

- **Implementation:** `leaflet` + `react-leaflet` with **OpenStreetMap**
  tiles — no API key, no billing, works immediately (same reasoning as §5b:
  don't wire up a billed Google Maps JS API key speculatively). Custom
  brand `DivIcon` pins avoid Leaflet's classic broken-default-marker-icon
  bundler issue. The map component is loaded via
  `next/dynamic(..., { ssr: false })` since Leaflet touches `window` at
  import time.
- **Fully open, not paywall-gated:** unlike the ranked shortlist (free-3 +
  $39 unlock), clicking any of the 18 pins shows that town's full record
  for free to anyone on the dashboard — this is a deliberate product
  decision (confirmed with the founder), not an oversight. The map is a
  general "browse the public record" tool; the $39 paywall stays exactly
  where it already was, on the personalized budget/yield-ranked shortlist
  + PDF report. Don't add paywall gating to the map without it being
  explicitly requested again.
- **Town-level only, same as everything else in §5a/§5b:** the panel shows
  price/yield/vacancy/hazard-flags/infrastructure — never a property-level
  rating. Address-level lookup happens only via the "Open in Google Maps"
  link-out inside the panel (reuses the exact URL pattern from
  `TownMapToggle.tsx`), never as a Cadacre-generated layer.
- **`coordinates: { lat, lng }`** was added to every `Town` in
  `src/data/towns.ts` — public town-centroid coordinates (a geographic
  fact, not a sourced dataset figure), used only for pin placement.
- **Known gotcha if you touch this again:** Leaflet's internal panes use
  `z-index` values up to ~700-1000 (markers/tooltips/popups), and
  `.leaflet-container` doesn't establish its own stacking context — so
  anything meant to render *above* the map (like this modal) needs a
  z-index well past Tailwind's `z-50` ceiling. The panel backdrop uses
  `z-[9999]` for this reason; don't drop it back to a "normal" z-index.
- **Pre-existing bug found during verification of this feature (not
  introduced by it):** the budget input in `ShortlistForm.tsx` uses
  `min={1} step={1000}`, which makes HTML5 number-input step validation
  reject round values like `700000` (only `699001`/`700001`-style values
  pass) — confirmed via an end-to-end Clerk test-mode sign-up + Playwright
  session. Worth fixing (e.g. `min={0} step={1000}`) next time this file
  is touched.

---

## 6. Current Status Snapshot

- [x] Business concept validated through discussion, not yet through real users
- [x] Name selected: Cadacre (checked for trademark/brand collisions — none found as of naming)
- [x] Design direction and working front-end prototype built (`cadacre.html`)
- [x] Production Next.js app built end-to-end: Clerk auth-gated dashboard →
      budget/yield form → ranking engine → free-3 teaser ledger → Stripe
      Payment Link paywall → `/api/stripe/verify` unlock → downloadable PDF
      report (`cadacre-web/`). Builds and lints clean.
- [x] Town dataset is real, sourced, non-fabricated data (18 NSW regional
      towns; PRD market updates + Your Investment Property Mag/CoreLogic
      suburb data, each figure carrying its own source URL and as-of date;
      unavailable figures are `null`, never guessed) — **note:** sourced
      from PRD/YIP, not literally ABS/SQM as Section 5 specifies; revisit if
      ABS/SQM-specific sourcing is required, and vacancy rate is missing for
      most YIP-sourced towns.
- [x] Hazard flags & infrastructure projects shipped (2026-08-27) — all 18
      towns now carry sourced `bushfireRisk`/`floodRisk` (NSW RFS/SES,
      disaster-declaration history; `null` where no credible source was
      found — see §5a caveat above) and `infrastructureProjects` (state
      budget papers / Infrastructure Australia / council sites). Shown as
      small icons in the web ledger (`HazardIcons.tsx`) and as a full
      table column + infrastructure notes + a 7-item "Before you proceed"
      checklist in the PDF report (`api/report/route.tsx`). Town-level only.
- [x] Google Maps entry point shipped (2026-08-27) — a map pin next to each
      town in the ledger toggles a keyless embedded map + link-out to
      Google Maps (`TownMapToggle.tsx`); no API key configured/needed for
      this. See §5b for the granularity boundary and the upgrade path if a
      full multi-marker map (needs a billed Maps JS API key) is wanted later.
- [x] Dashboard town map + detail panel shipped (2026-08-27) — Leaflet/OSM
      interactive map on `/dashboard`, all 18 towns pinned, visible before
      any form interaction; clicking a pin opens a full town-level detail
      panel. Free/open, not paywall-gated (deliberate — see §5c). Verified
      end-to-end via a real Clerk test-mode sign-up + Playwright session
      (not just build/lint) — a real z-index stacking bug (Leaflet panes
      rendering above the modal) was caught and fixed this way; see §5c.
- [x] Logo shipped (2026-08-27) — `public/content.png` wired into
      `SiteHeader.tsx` and `SiteFooter.tsx`.
- [x] Terms of Service / Privacy Policy drafted in-app (`/terms`, `/privacy`)
      — both carry a visible "pending professional legal review" notice and
      must not be treated as final until a lawyer signs off.
- [ ] Stripe payment not yet *live* — code path is complete but
      `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL` / `STRIPE_SECRET_KEY` are unset;
      needs a real Stripe Payment Link created and a live test payment run
      before this can be marked done (see Section 6 rule below).
- [ ] Legal review of ToS/Privacy not yet done
- [ ] Domain not yet purchased
- [ ] Zero real users, zero real revenue

**When picking up work on this repo, check this section first and update it as milestones are actually completed — do not mark items complete based on code existing if they haven't been verified working end-to-end (e.g. a Stripe integration isn't "done" until a real test payment has succeeded).**

---

## 7. Working Principles for Any Agent on This Project

- Prefer the smallest working version of any feature over a fully-featured build — this project is optimized for fastest path to first real dollar, not architectural completeness.
- Never invent data, testimonials, user counts, or revenue figures in copy or code comments. If a placeholder is needed, label it explicitly as a placeholder.
- Preserve the "ledger" design language and Old-English/land-record brand voice in any new UI — do not default to generic SaaS dashboard patterns.
- Flag legal-sensitive features (Section 4) back to the founder rather than building them speculatively.
- When in doubt about scope (e.g., "should I build the subscription tier"), default to Phase 1 scope only unless told otherwise.
