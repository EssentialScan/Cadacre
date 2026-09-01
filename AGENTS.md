# AGENTS.md — Cadacre

This file gives any AI coding agent (Claude Code, etc.) working on this repo full context on what Cadacre is, who it's for, what's already built, and the constraints that must not be violated. Read this in full before making changes.

---

## 1. What Cadacre Is

**One-line pitch (revised 2026-08-30):** A monthly subscription that gives Sydney renters and
investors priced out of the local market continuous, data-backed intelligence on regional
Australian towns — where to rentvest, how your own rent compares, and an AI concierge to ask both
in plain English — free of sponsored placements or sales pressure.

**The problem:** Sydney's median house price has pushed home ownership out of reach for most
first-time buyers, and the rental market itself is in its own crisis — renters have no
data-backed way to know if their own rent is reasonable, let alone whether "rentvesting"
somewhere regional would leave them better off. The common workaround — rentvesting (buying an
investment property elsewhere while renting where you live) — is well known, but choosing *where*
to invest is guesswork. People currently rely on scattered spreadsheets, outdated blog posts, or
advice from buyer's agents who have a financial incentive to point them somewhere specific.

**The solution:** A single monthly subscription unlocks the full ranked shortlist of regional
towns (median price, gross rental yield, vacancy rate, and more), a rent-vs-rentvest comparison
and tracker, portfolio and scenario tools, and an AI concierge that answers plain-English
questions strictly from Cadacre's own sourced data. The free tier (dashboard map browsing, a
top-3 teaser ledger, and a single-suburb rent comparison) stays free indefinitely as the
top-of-funnel hook — the subscription is what turns browsing into acting. **This replaces the
original one-time-$39-report model** (see §2) — the founder found the one-time-purchase framing
didn't match the amount of ongoing value the product actually delivers.

**Target user:** Sydney-based renters *and* investors, priced out of the local market — renters
who want to know if their own rent is fair and whether relocating regionally makes sense, and
first-time or early rentvestors choosing where to invest. Not sophisticated investors — assume
limited property jargon knowledge.

**Explicitly NOT:** a licensed financial advice service, a real estate agency, a lending platform, or a marketplace connecting buyers to specific off-market deals. Do not build features that blur these lines without explicit legal review first (see Section 4).

---

## 2. Business Model & Roadmap

**Revised 2026-08-30 — single subscription tier, $39 report retired.** The model below supersedes
every earlier "$39 one-time" / "Phase 1 vs Phase 2 gate" framing in this file's history. **Update
(2026-08-30, same day):** the code migration this section originally described as pending has now
been done — see §5l for what shipped. This section now describes the live model, not just
direction.

### Current model: one subscription, one price, both audiences
- **Single monthly subscription** (name/price TBD) is the only paid product — no one-time $39
  report as a separate purchase. It unlocks: the full ranked shortlist + downloadable PDF, custom
  ranking weights, the multi-town scenario simulator, the portfolio tracker, CSV export, the
  relocation-readiness pack, rank-drift/hazard-and-infrastructure change alerts, the rent tracker,
  the rent-increase negotiation-letter generator, and the AI concierge chat (see new §5k) — i.e.
  everything currently split across the retired $39 report and this session's additive "Pro"
  layer, merged into one thing a subscriber gets.
- **Free tier, free indefinitely, no card required:** the dashboard map (browse every town's full
  public record), the top-3 teaser ledger, and the single-suburb rent-vs-rentvest comparison. This
  is the top-of-funnel hook — deliberately still generous, since the subscription's job is to
  convert engaged browsers, not to gate basic information.
- Free monthly "Rentvestor Index" content post (ungated, shareable) for brand-building and SEO —
  still NOT a paid feature, still free indefinitely.
- Manual/semi-manual delivery for anything not yet automated is still acceptable at this stage —
  unchanged working-principle from the original Phase 1.
- Small manually-curated community (WhatsApp/Discord) of first 20-50 users, traded free tool
  access for honest feedback and real outcome data — unchanged.

### Done (2026-08-30, same day) — see §5l for full detail
- Retired `api/stripe/verify-pro` and merged one-time-$39/Pro entitlement checks into a single
  `isSubscriber()` (`src/lib/entitlements.ts`); `api/stripe/verify` now verifies the (single)
  subscription checkout.
- Free-3/locked-rest ledger split unchanged in practice — only the paid side's copy changed from
  "$39 unlocks the rest" to "subscribe to unlock the rest, plus everything else."
- Built the AI concierge chat (§5k design → §5l implementation).

### Phase 3 (Not in scope yet — requires legal review before any code is written)
- "Concierge" referral service connecting buyers to vetted buyer's agents/conveyancers/property managers for a fee (~$500-1,000 flat fee, referral commission from providers)
- **DO NOT BUILD THIS WITHOUT EXPLICIT INSTRUCTION.** Conveyancing and buyer's-agent referral fee arrangements are regulated at the state level in Australia and require proper legal advice before implementation. This is a business-model decision, not a coding task — flag it back to the founder if asked to build referral/commission logic.
- Community "Trust Score" / reputation algorithms — treat as aspirational, not a near-term build
- Consider expanding data sources beyond ABS/SQM once the subscription model above is validated
  with real paying customers

### Phase 3 (Not in scope yet — requires legal review before any code is written)
- "Concierge" referral service connecting buyers to vetted buyer's agents/conveyancers/property managers for a fee (~$500-1,000 flat fee, referral commission from providers)
- **DO NOT BUILD THIS WITHOUT EXPLICIT INSTRUCTION.** Conveyancing and buyer's-agent referral fee arrangements are regulated at the state level in Australia and require proper legal advice before implementation. This is a business-model decision, not a coding task — flag it back to the founder if asked to build referral/commission logic.
- Community "Trust Score" / reputation algorithms — treat as aspirational, not a near-term build

**Do not treat any hypothetical future revenue model (Concierge fees, crowd-sourced proprietary data, subscription LTV) as validated or committed. Only build what's explicitly requested for the current phase.**

**Second feature area added 2026-08-30 — council/planning monitoring.** Alongside the core
rentvesting subscription described above, the founder has scoped a second major feature: tracking
DAs/rezonings/planning decisions for a user-chosen address, suburb, or LGA, with its own
free/Pro/Team pricing tiers. This is additive, not a replacement for the rentvesting product — see
new §5m for the full design direction and §6 for build status. How its tiers reconcile with the
single `isSubscriber()` entitlement model (§5l) is an open decision, not yet resolved.

---

## 3. Brand & Design System

**Name origin:** "Cadacre" riffs on *cadastre* — the real term for a government land/property record. The entire visual identity should read as "a modern land registry," not a generic SaaS dashboard.

**Design tokens (do not deviate without discussion):** token *names* below are
stable and used throughout the codebase (`bg-parchment`, `text-ink-navy`,
etc. in `src/app/globals.css`); the underlying hex values were updated again
2026-08-28 to a light-mode "market terminal" palette — crisp near-white
canvas, near-black ink, terminal-blue signal accent, terminal-green
secondary, cool-gray hairline gridlines (explicitly requested as "Bloomberg
terminal, but light mode — must not be dark"). The accent itself moved from
amber/brass to blue later the same day, after the amber read as "brown" —
`survey-brass`/`gold-bright` keep their token *names* per the stability rule
even though the literal color is no longer brass-colored. Changing the
values in `globals.css` cascades everywhere automatically since every
component references the token names, not hardcoded hex — a handful of
pre-existing hardcoded hex usages (map pin SVGs, two `accent-[...]`
range-input colors) were converted to reference the same CSS custom
properties so they pick up palette changes too. Any new component must use
these token classes, never a literal hex.
- Ink Navy `#0E1015` — primary dark / headings
- Parchment `#F7F8FA` — primary background
- Survey Brass `#1D5FD6` (bright variant `#4C86F0`) — accent, CTAs, terminal-blue signal color
- Deep Forest `#0F7A4A` (bright variant `#12966B`) — secondary accent, terminal green
- Faded Rule `#D7DBE1` — hairlines, dividers, disabled/locked states
- Charcoal `#1B1D21` — body text

**Typography:** switched 2026-08-28 from Fraunces/IBM Plex Sans to the pairing
below — the founder wanted something that would read as institutional/
corporate enough for professional buyers, not a characterful editorial
startup font. Same `next/font/google` loading pattern in `layout.tsx`,
mapped through `--font-display`/`--font-sans` in `globals.css` so the
Tailwind class names (`font-display`, `font-sans`) didn't need to change
anywhere else in the codebase.
- Display: **Source Serif 4** (serious, legal/editorial-adjacent serif — used for headlines, section titles)
- Body/UI: **Public Sans** — the US federal government's own design-system typeface; chosen deliberately for the "official public record" association, which fits the cadastre/land-registry concept better than a generic startup sans
- Data/figures: **IBM Plex Mono** (unchanged) — all numbers (prices, yields, percentages) should render in mono to reinforce the "recorded, not decorated" feel

**Logo:** `public/content.png` (1254×1254, square lockup — "CA" monogram over "CADACRE" wordmark, ivory background) — used in `SiteHeader.tsx` and `SiteFooter.tsx`. Keep it square-cropped as-is; don't stretch or reflow the lockup.

**Signature UI element:** Results are displayed as a "ledger" — ruled rows, monospace figures, a check-mark per qualifying entry — not a generic dashboard card grid. Preserve this pattern when adding new result types.

**Voice:** Plain, factual, quietly confident. Never salesy or hype-driven. Copy should read like a land record, not a marketing page. Avoid superlatives ("the best," "amazing") — prefer specific, checkable claims.

**Homepage persuasion boundary (set 2026-08-28):** the founder asked for
"sales techniques" and "human psychology" on the homepage. Honest techniques
are fair game and now in use — loss aversion (Hero/FinalCta), anchoring
($39 vs. a week of Sydney rent, without inventing a specific buyer's-agent
fee figure), risk reversal (free-first framing surfaced next to the primary
CTA in `Pricing.tsx`/`FinalCta.tsx`, not just buried in the FAQ), and
authority-transfer via `DataSources.tsx` — a new section naming the real
institutions Cadacre's data actually comes from (ABS, PRD/YIP, NSW RFS, NSW
SES, Open-Meteo). **Fabricated social proof, testimonials, user counts, or
false urgency/scarcity are explicitly off the table** — the §6 snapshot
still shows zero real users/revenue, and AGENTS.md's no-fabrication rule
applies to marketing copy exactly as much as it applies to town data. If a
future request asks for a testimonial, a live user counter, or a countdown
timer, treat it the same as a request to fabricate a town's median price:
flag it rather than build it. `SampleLedger.tsx` on the homepage now pulls
three real, pinned towns (Orange, Wagga Wagga, Tamworth — chosen because all
three have a complete price/rent/yield/vacancy record) straight from
`getAllTowns()` instead of a hand-written "illustrative placeholder" — more
credible for an institutional audience, and it can never drift out of sync
with the real dataset.

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
8. **AI features (concierge chat, narrated summaries) must never originate a fact.** (Added
   2026-08-30 alongside the AI concierge design direction in §5k.) The model's role is strictly to
   phrase, filter, or summarize Cadacre's own already-sourced data — never to state a price, rate,
   risk level, or any other figure it wasn't handed. Every AI response carries the same "general
   information, not advice" framing as the rest of the product. If the AI provider is down or
   unconfigured, the feature must visibly degrade (a plain "AI concierge unavailable" state),
   never silently fall back to an invented answer. Only free or self-serve, pay-as-you-go API
   providers are permitted anywhere in the product — no API that requires a sales conversation or
   an enterprise contract to obtain a key (this was already true in practice — ABS, BOM/Open-Meteo,
   OSM Overpass, NSW BOCSAR, RBA, Groq are all self-serve — this makes it an explicit rule rather
   than an unstated convention).

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

### 5c. Dashboard town map + filter bar + detail drawer (separate from 5b, free/open)

`/dashboard` renders a full-viewport interactive map of every NSW town
immediately on load, no form interaction needed —
`src/components/dashboard/DashboardMapWorkspace.tsx` (orchestrator),
`src/components/map/TownMap.tsx` (Leaflet map), `MapFilterBar.tsx` (top-
center live filter bar), `TownDetailDrawer.tsx` (the click-through detail
panel). This is a **separate feature** from §5b's per-row Google Maps
toggle — different library, different purpose. Note: an earlier version of
this section referenced `TownMapExplorer.tsx`/`TownDetailPanel.tsx` as the
dashboard's map components — those files still exist and are still used by
`BudgetMapExplorer.tsx` (the `/explore` page), but the dashboard itself was
rebuilt on the leaner `DashboardMapWorkspace`/`TownDetailDrawer` pair
described here across several redesign passes on 2026-08-28.

- **Implementation:** `leaflet` + `react-leaflet` with **OpenStreetMap**
  tiles — no API key, no billing, works immediately (same reasoning as §5b:
  don't wire up a billed Google Maps JS API key speculatively). Custom
  brand `DivIcon` pins avoid Leaflet's classic broken-default-marker-icon
  bundler issue and reference the CSS custom properties in `globals.css`
  (not hardcoded hex) so they pick up palette changes automatically. The
  map component is loaded via `next/dynamic(..., { ssr: false })` since
  Leaflet touches `window` at import time. Zoom controls are pinned to the
  map's bottom-left (`zoomControl={false}` + `<ZoomControl position="bottomleft" />`)
  and scroll-wheel zoom is enabled, since the map is the full section (no
  page-scroll to protect).
- **Live filtering, not a paywalled ranked list:** `MapFilterBar.tsx` dims
  non-matching pins in real time as the user edits fields — it does **not**
  call a server action or show a ranked/locked ledger. The earlier
  "Generate shortlist" paywall CTA was deliberately removed from this bar
  (2026-08-28, explicit ask) so the map stays a pure "browse and filter the
  public record" tool. **Update (2026-08-29): the paywall flow is
  reconnected as its own page — `/shortlist` (`src/app/shortlist/page.tsx`)
  — not rebuilt into this bar.** See §5i for the full rationale and details;
  `ShortlistForm.tsx`/`ShortlistResults.tsx`/`getShortlist` are no longer
  unreferenced.
- Filter fields, all driven by `src/lib/townFilters.ts`'s `matchesFilters()`
  (shared by the map and the bar so they can never drift out of sync) —
  every field checks a real, already-sourced `Town` field, nothing
  fabricated: max budget (`medianPrice`), min gross yield, max vacancy rate,
  max weekly rent (`medianRent`), hide-bushfire-risk / hide-flood-risk
  (checked independently against each town's `bushfireRisk`/`floodRisk`
  level), and "has infrastructure" (`infrastructureProjects.length > 0`).
- **Fully open, not paywall-gated:** clicking any pin shows that town's
  full record for free to anyone on the dashboard — a deliberate product
  decision (confirmed with the founder), not an oversight.
- **Town-level only, same as everything else in §5a/§5b:** the drawer shows
  price/yield/vacancy/hazard-flags/infrastructure — never a property-level
  rating. Address-level lookup happens only via the "Open in Google Maps"
  link-out inside the drawer (reuses the exact URL pattern from
  `TownMapToggle.tsx`), never as a Cadacre-generated layer.
- **`coordinates: { lat, lng }`** was added to every `Town` in
  `src/data/towns.ts` — public town-centroid coordinates (a geographic
  fact, not a sourced dataset figure), used only for pin placement.
- **Known gotcha if you touch this again:** Leaflet's internal panes use
  `z-index` values up to ~700-1000 (markers/tooltips/popups), and
  `.leaflet-container` doesn't establish its own stacking context — so
  anything meant to render *above* the map needs a z-index well past
  Tailwind's `z-50` ceiling. `TownDetailDrawer` uses `z-[9999]`; don't drop
  it back to a "normal" z-index. The drawer is deliberately **not** a
  blocking modal — its backdrop wrapper is `pointer-events-none` with only
  the panel itself `pointer-events-auto`, so the map stays pannable/
  zoomable/clickable while the drawer is open (explicit ask, 2026-08-28) —
  don't reintroduce a full-screen click-catching backdrop.
- **Visual language, light-mode "market terminal" (must not go dark):** the
  header/filter-bar/drawer all use light glass fills
  (`bg-parchment/70`–`95`) — an earlier pass made these `bg-ink-navy` fills
  for a "terminal" look and had to be corrected back to light, since the
  brand explicitly must not be dark. Terminal character comes instead from:
  a `.terminal-grid` faint graph-paper background (CSS class in
  `globals.css`, used behind the Hero stat strip and `RecordBanner`), small
  `.terminal-corners` HUD-style corner brackets (also in `globals.css`, used
  on `MapFilterBar` and the `TownDetailDrawer` header), dense mono-figure
  labels, and a genuinely-live client clock (`LiveClock.tsx`, real browser
  time via `useSyncExternalStore` + `setInterval` — not a fabricated
  price-feed ticker) in the dashboard header. Still explicitly avoided: any
  scrolling "live price" ticker (implies a real-time market feed Cadacre
  doesn't have) — price-history charts turned out to be viable in a narrow,
  honest form; see §5d.
- **Pre-existing bug found during verification of this feature (not
  introduced by it):** the budget input in `ShortlistForm.tsx` used
  `min={1} step={1000}`, which made HTML5 number-input step validation
  reject round values like `700000` — fixed (`min={0}`) 2026-08-28. The form
  is no longer unreferenced — see §5i.

### 5d. Investor-value features: calculators, compare/watchlist, price trend

Added 2026-08-28 in response to "what features would make this more
valuable for real estate investors" — all three stay strictly town-level
and non-fabricated, same rules as everywhere else in this file.

- **Investment calculators** (`src/lib/investmentMath.ts`,
  `InvestmentCalculator.tsx`, embedded as a collapsible section in
  `TownDetailDrawer.tsx`): a mortgage/cash-flow estimator (standard
  amortization formula on user-entered deposit %/rate/term) and an NSW
  transfer-duty (stamp duty) estimator using NSW Revenue's published 2024-25
  general-rate bracket schedule. Both are pure arithmetic on user inputs and
  a published tax formula, not a prediction — still carries a visible
  disclaimer ("not a loan quote... confirm with a licensed lender/adviser")
  per §4's no-personalised-advice rule. Only rendered when the town has both
  a `medianPrice` and `medianRent` figure to pre-fill from.
- **Watchlist ("saved towns")** — the alerts/saved-search idea from Section
  2's Phase 2 roadmap was explicitly **not** built as email/notification
  infrastructure (that's still gated behind "Phase 1 validated with real
  paying customers," which hasn't happened — Stripe isn't live, per §6).
  Instead it was scoped down to a simple star/save toggle, persisted in
  Clerk `privateMetadata.savedTownIds` (`toggleSavedTown`/`getSavedTownIds`
  in `src/app/dashboard/actions.ts`, same storage mechanism already used for
  the `unlocked` flag — no new database was introduced). `MapFilterBar.tsx`
  gained a "Saved only" toggle. If real email alerts are wanted later, that
  gate still applies — check with the founder before building the
  notification/mailer side of it.
- **Compare** — click "Compare" in `TownDetailDrawer.tsx` on up to 4 towns
  (`compareIds` state in `DashboardMapWorkspace.tsx`); a floating pill
  ("Compare · N") appears once 2+ are selected and opens
  `CompareDrawer.tsx`, a side-by-side ledger-style table (same non-blocking
  portal/`z-[9999]` pattern as `TownDetailDrawer`).
- **Price trend** (`priceHistory` field on `Town` in `src/data/towns.ts`,
  rendered by `PriceTrendChart.tsx` — a small dependency-free inline SVG
  line chart, not a charting library) — a real research pass (web search
  across all 18 towns) found that clean, independently-verifiable
  multi-year median-price series are **not obtainable from free web
  sources** for almost every town: portal charts (CoreLogic/Domain/YIP) are
  JS-rendered so only the current single point is fetchable, Domain
  suburb-profile pages 403 automated fetches, and most news mentions are
  isolated single points from inconsistent sources. Only **Goulburn**
  produced two independently-fetched, named-source data points (2022:
  $672,500; 2023: $665,500 — Ray White Goulburn principal, quoted in About
  Regional). Every other town has no `priceHistory` and the drawer shows
  "Not enough public data to show a trend" rather than a gap or a guess —
  this is the expected, honest outcome per §5's no-fabrication rule, not a
  bug. **If real historical trend data is wanted for more towns later,** a
  licensed CoreLogic/PropTrack feed or manually mining PRD Research Hub's
  downloadable half-yearly PDF market updates (one per town, e.g.
  `prd.com.au/documents/.../PRD_Tweed_Heads_Market_Update_H1_2024_FINAL.pdf`
  — these contain real historical tables in PDF form) are the two credible
  paths; free-text web search is not sufficient for this specific field.

### 5e. Population, climate, and amenity data (free public APIs)

Added 2026-08-28 in response to "which free APIs could add value" — three
new sourced fields on `Town` (`src/data/towns.ts`), same rules as
everywhere else in this file: real structured API responses only, nothing
estimated or interpolated when a town's data couldn't be fetched.

- **Population** (`population` field) — ABS Estimated Resident Population,
  resolved per town via a spatial (point-in-polygon) query against the ABS
  `ABS_ERP_2001_2021_LGA` ArcGIS FeatureServer
  (`geo.abs.gov.au/arcgis/rest/services/Hosted/ABS_ERP_2001_2021_LGA/FeatureServer/0`)
  using each town's existing `coordinates` — this resolved cleanly for all
  18 towns, with `growthPct` computed from the LGA's 2016→2021 ERP change.
  This is a much more tractable endpoint than the SDMX-based ABS Data API
  originally considered — worth reusing this ArcGIS-feature-service pattern
  if more ABS regional data is wanted later.
- **Climate** (`climate` field) — Open-Meteo's free, keyless historical
  weather archive API, queried per town's coordinates for 2021-01-01 to
  2023-12-31 daily data, averaged into summer max / winter min / annual
  rainfall normals. Succeeded for all 18 towns. **Licensing note:**
  Open-Meteo's free tier is scoped to non-commercial use per their terms;
  Cadacre does charge $39 for its paid tier, so this is worth a proper
  licensing check (or budgeting for their paid tier) before this becomes a
  real revenue product — flagged, not resolved, by this pass.
- **Amenities** (`amenities` field) — OpenStreetMap Overpass API, counting
  schools/hospitals/supermarkets within 5km of each town's coordinates.
  **Only resolved for 2 of 18 towns (Bathurst, Dubbo)** — the public
  `overpass-api.de` instance rate-limited our IP partway through the first
  pass (confirmed via its own error message:
  `Dispatcher_Client::request_read_and_idx::rate_limited`), and a retry via
  the `overpass.kumi.systems` mirror after a cooldown also failed to
  connect. This is an honest partial result, not a bug — every other town
  has no `amenities` field and the drawer shows "Not available" rather than
  a fabricated or zero count. **If broader amenity coverage is wanted
  later:** space requests out much further (one town every 10-15s rather
  than the ~5s used here), or self-host a small Overpass instance — don't
  just re-run the same burst pattern against the public instance again.
- All three surface in `TownDetailDrawer.tsx` (Population, Avg summer
  max/winter min, Avg annual rainfall, Nearby amenities) using the drawer's
  existing "Not available" fallback convention. `population.growthPct` also
  drives a new "Min pop. growth %" filter in `MapFilterBar.tsx` /
  `townFilters.ts`, following the same optional-threshold pattern as the
  existing budget/yield/vacancy/rent filters.

### 5f. Crime, employment, and a real RBA mortgage rate (free public APIs, round 2)

Added 2026-08-29 after another "what free APIs could add value" pass. The
user also proposed a buyer's-agent/real-estate-agent directory and local
news headlines — outcomes below, both handled differently than the four
data fields, worth reading before touching either area again.

- **Buyer's-agent/real-estate-agent directory — explicitly declined by the
  founder**, not silently dropped. This is functionally the "Concierge"
  referral service Section 2 Phase 3 already gates behind legal review; when
  asked, the founder chose to skip it entirely rather than override the gate
  or build a lighter link-out version. Don't resurrect this without the
  founder raising it again.
- **Local news headlines — NOT built, real licensing blocker found.**
  Google News RSS (`news.google.com/rss/search`) works technically (free,
  keyless, real headlines), but the feed's own copyright notice says it is
  "made available solely for... personal, non-commercial use. Any other use
  of the feed is expressly prohibited." Cadacre charges $39 for its paid
  tier, so embedding this feed in the product is a real ToS conflict, not a
  vibe — flagged to the founder rather than built and glossed over. If news
  headlines are wanted later, the credible paths are a licensed news API
  (e.g. NewsAPI.org's paid tier, Bing News Search) or an RSS source whose
  terms actually permit commercial embedding — re-check terms before
  reusing the Google News approach.
- **RBA mortgage rate** (`RBA_INVESTOR_VARIABLE_RATE` in
  `src/lib/investmentMath.ts`) — real data from RBA Statistical Table F5
  (Indicator Lending Rates), specifically "Housing loans; Banks; Variable;
  Discounted; Investor" (7.13% as of 31 July 2026), **not** the RBA cash
  rate (4.35% same period) — the cash rate alone would have understated
  what an investor actually pays and made the calculator's numbers look
  better than reality. `InvestmentCalculator.tsx`'s rate field now defaults
  from this real figure (still user-editable) instead of a guessed 6.0%.
- **Crime** (`crimeRate` field on `Town`) — NSW BOCSAR's free, directly
  downloadable `LGA_trends.xlsx` (no API, just a real spreadsheet — fetched
  and parsed once, not a live dependency). Rather than one blanket "total
  crime" number, it's the sum of six property-crime offence rates per
  100,000 population (break and enter dwelling/non-dwelling, motor vehicle
  theft, steal from motor vehicle, steal from dwelling, malicious damage to
  property) — the subset actually relevant to a property investor, not
  violent crime or drug offences. Resolved cleanly for all 18 towns.
  LGA-level aggregate only, per §5a's town-level rule.
- **Employment** (`employment` field on `Town`) — same ArcGIS
  point-in-polygon pattern as `population`, against
  `ABS_Education_and_employment_by_2021_LGA`. Unlike the population layer's
  earlier-assumed "cryptic DBR codes" risk, this layer's fields turned out
  to have clear, human-readable aliases (e.g. `lf_42016` = "Unemployment
  rate (%) (Data year: 2016)") — fully resolved for all 18 towns, no
  guessing needed. **Data year is 2016** (the most recent this specific
  layer publishes) — the UI states this explicitly rather than implying
  it's current.
- All new fields surface in `TownDetailDrawer.tsx` using the existing
  "Not available" fallback convention (moot here since coverage is 18/18 on
  both, but kept for consistency with every other field in the dataset).

### 5g. Sydney Metro suburbs (dashboard-only, excluded from the paid shortlist)

Added 2026-08-29 in response to "add more towns/suburbs in Sydney, does not
have to be regional." This is a deliberate departure from the rest of the
dataset (regional NSW only), so it's kept clearly tagged and scoped down
rather than silently blended in.

- **16 real Sydney suburbs** added to `src/data/towns.ts`, spanning outer
  (Mount Druitt, St Marys, Campbelltown, Penrith, Liverpool, Blacktown,
  Fairfield), middle-ring (Parramatta, Bankstown, Auburn, Merrylands,
  Hurstville) and inner/expensive (Chatswood, Bondi, Manly, Mosman) price
  points — sourced the same way as the existing regional dataset (Your
  Investment Property Mag / CoreLogic suburb pages, 12 months to May 2026;
  house medians, not units). Gross yield is each page's own published
  figure (`derivedYield: false`). Vacancy rate is `null` for all 16 (not
  published on any of the source pages — an honest gap, not a bug, matching
  the existing regional towns' vacancy coverage). No credible per-suburb
  NSW RFS/SES bushfire/flood source was found for these established metro
  suburbs, so those fields are `null` throughout too. A handful carry a real
  sourced infrastructure project (Sydney Metro West/City & Southwest/Western
  Sydney Airport Line, the Liverpool Hospital redevelopment); the rest have
  none because nothing current and well-sourced surfaced quickly.
- **New `region?: "Sydney Metro" | "Regional NSW"` field on `Town`**
  (`src/data/towns.ts`) — `undefined` means "Regional NSW" (every town added
  before this field existed), so none of the original 18 needed touching.
  New Sydney entries set it explicitly.
- **Filterable and visually tagged, not hidden:** `MapFilterBar.tsx` gained
  an All / Regional NSW / Sydney Metro toggle, wired through
  `TownMapFilters.region` → `matchesFilters()` in `src/lib/townFilters.ts` →
  `TownMap.tsx`'s pin dimming, same plumbing pattern as every other filter.
  `TownDetailDrawer.tsx`'s header now shows the region next to the state
  code.
- **Deliberately excluded from the paid ranked shortlist:** Cadacre's core
  pitch (§1/§2) is a *regional* rentvesting product — `rankTowns()` in
  `src/lib/rankTowns.ts` now filters to `region !== "Sydney Metro"` before
  scoring/ranking, regardless of what budget/yield the user enters, so a
  Sydney suburb can never appear in the $39 report. (This ranking path is
  still unreferenced by any current UI per §5c's paywall note — the filter
  is there so the positioning holds if/when that flow is rebuilt.) Sydney
  suburbs remain fully visible and browsable on the free dashboard map,
  purely for comparison (e.g. "what does the Sydney suburb I'm priced out of
  look like next to this regional town").

### 5h. Full NSW suburb coverage + sale-price growth chart (dashboard-only)

Added 2026-08-29 in response to "add every single suburb in NSW" — infeasible
via per-suburb manual research (no free bulk price/rent/yield source exists
for ~3,000+ localities), so the founder pointed to specific bulk/official
datasets to use instead and asked for a per-suburb growth line graph. Two
new data pipelines, both one-time scripts under `cadacre-web/scripts/`, not
live dependencies of the running app:

- **`scripts/fetch-abs-sal.sh` → ABS Digital Boundary Files, Suburbs and
  Localities (SAL), CC BY 4.0.** Paginates
  `geo.abs.gov.au/arcgis/rest/services/ASGS2021/SAL/FeatureServer/0`
  (2,000-record page limit) filtered to NSW, pulling real name + centroid
  for every gazetted NSW suburb/locality — **4,542 real records**, no
  fabrication, no manual research needed. This is the same ArcGIS
  FeatureServer pattern already used for `population`/`employment` (§5e/§5f),
  against a different layer.
- **`scripts/fetch-valuer-general-psi.sh` + `scripts/aggregate-nsw-
  suburbs.js` → NSW Valuer General Bulk Property Sales Information (PSI).**
  **LICENCE WARNING: PSI is CC BY-NC-ND 4.0 (Non-Commercial, No-
  Derivatives)** — conflicts with Cadacre's $39 paid report. Per an
  explicit founder decision, PSI-derived data is **dashboard-only, never
  read by `src/app/api/report/route.tsx` or any paid-report path** — treat
  any new consumer of `psiGrowthHistory` (on `Town`) or `growthHistory` (on
  `NswSuburb`) the same way. This is flagged as an unresolved legal
  question pending the founder's own review, the same treatment as the
  Concierge feature gate (§2 Phase 3) — not a silent workaround assumed
  safe. **Research note:** NSW Valuer General's *other* bulk dataset, Bulk
  Land Value, is genuinely CC BY 4.0 with no such conflict — but unlike PSI
  it is **not self-service**; the download page states access requires
  emailing the Valuer General directly ("to ensure compliance with
  licensing terms"). If the founder does that and obtains it, prefer Land
  Value over PSI and retire the PSI pipeline. PSI itself, by contrast, is
  freely downloadable with no registration — real statewide sale records
  back to 1990 at `valuergeneral.nsw.gov.au/__psi/yearly/<year>.zip`
  (fixed-format `;`-delimited "B" sale records; Nature of Property `R` =
  residential dwelling — houses, units, and townhouses are **not**
  separable from this field alone, so `psiGrowthHistory`/`growthHistory`
  is explicitly labeled "median sale price" or "residential dwellings
  combined," never "house price," in every UI surface — see the disclosure
  copy in `TownDetailDrawer.tsx` and `NswSuburbsLayer.tsx`). Pulled years
  2016–2025, aggregated to median sale price per suburb per year, only kept
  where a suburb had **≥5 sales in that year** (avoids noisy medians on tiny
  localities) and **≥2 qualifying years** (so a trend line is possible) —
  **2,184 of the 4,542 suburbs** ended up with a real growth series; the
  rest show "Not enough public sale-price data for a trend," same
  null-not-guessed convention as everywhere else.
- **Generated output:** `src/data/generated/nswSuburbs.json` (checked into
  the repo, ~1.4MB — not re-fetched live; re-run the three scripts in order
  to refresh it), loaded via `src/data/nswSuburbs.ts`, which exposes
  `getUncuratedNswSuburbs()` (everything except the 34 curated `Town`
  entries, name-matched and excluded to avoid duplicate pins) and
  `findPsiGrowthHistory(townName)` (used by `getAllTowns()` in
  `src/data/index.ts` to attach a real growth chart onto curated towns too,
  where one exists).
- **Map rendering:** `src/components/map/NswSuburbsLayer.tsx`, following
  the exact viewport-bounds + zoom-level cap pattern `SmallPlacesLayer.tsx`
  already uses for OSM-sourced places (not a marker-clustering library —
  simpler, and consistent with the codebase's existing "smallest working
  version" convention) — small dot pins, only rendered above zoom 9, capped
  at 80/250/600 depending on zoom, so ~4,500 markers never render at once.
  Clicking one opens a popup with the suburb's name and growth chart (if
  it has one) — not the full `TownDetailDrawer` (these suburbs don't have
  the curated dataset's price/yield/hazard fields, so a lighter popup is
  honest about what's actually known). The generated JSON is imported
  inside this client-only, `next/dynamic(ssr:false)`-loaded module rather
  than passed down as page props, so its ~1.4MB doesn't bloat the
  dashboard's server-rendered payload.
- **Not done this pass:** the `/explore` page's separate map component
  (`TownMapExplorer.tsx`, see §5c) does not have this layer — only the
  `/dashboard` map does.

### 5i. Ranked shortlist reconnected as `/shortlist` (the $39 paid flow)

Added 2026-08-29, in response to a competitive-strategy question ("how do
we stand out from data-browsing sites like OpenStats/Heatmaps.com.au/
OnTheHouse/SQM Research when we can't compete on raw data breadth?"). The
answer: those sites are all data terminals — you still have to do the
analysis yourself. Cadacre's actual wedge is turning two inputs into a
*decision* (a scored, ranked shortlist + a "before you proceed" checklist),
not another map to browse. That flow was fully built (§5c/§6) but had been
completely unreferenced since the map's paywall CTA was removed — meaning
**there was no UI path to Cadacre's $39 product at all**, and worse, the
homepage's own copy (`Hero.tsx`: "Enter your budget and target yield... a
ranked shortlist... in under two minutes"; `Pricing.tsx`: "Run the free
shortlist first") was actively promising a flow that didn't exist behind
the sign-up button. This was a real product gap, not just a marketing one.

- **New page: `src/app/shortlist/page.tsx`.** Server component, auth-gated
  (added to `isProtectedRoute` in `src/proxy.ts` alongside `/dashboard`),
  reads `userId` via Clerk `auth()` and renders the existing, already-
  polished `ShortlistForm.tsx` → `ShortlistResults.tsx` → `getShortlist`
  server action (`src/app/dashboard/actions.ts`) → `rankTowns.ts` chain
  completely unchanged — none of that code needed modification, it was
  correct and just needed a page to live on. Also unchanged: the free-3/
  locked-rest split, the Stripe Payment Link unlock CTA, and the
  `/api/report` PDF link, all already wired inside `ShortlistResults.tsx`.
- **Stripe redirect updated:** `src/app/api/stripe/verify/route.ts` redirected
  to `/dashboard?budget=...&yield=...&unlocked=1` on a successful payment —
  changed to `/shortlist` (same query-param contract), since that's where
  the form/results now live. `ShortlistPage` reads `unlocked`/`unlock_error`
  and auto-resubmits the form (`autoSubmit` prop, already existed on
  `ShortlistForm`) so a paying user lands straight on their now-unlocked
  full report instead of an empty form.
- **Every sign-up/sign-in entry point on the homepage updated:**
  `Hero.tsx`, `Pricing.tsx`, `FinalCta.tsx`, and `SiteHeader.tsx`'s
  `SignUpButton`/`SignInButton` `forceRedirectUrl` all changed from
  `/dashboard` to `/shortlist` — these are exactly the buttons whose
  surrounding copy promises the shortlist experience, so they now land
  users on the page that actually delivers it. `SiteHeader.tsx`'s
  signed-in nav gained a "Shortlist" link alongside the existing
  "Dashboard" link.
- **Two-way link between the two surfaces, not a replacement:** the free
  `/dashboard` map and the paid `/shortlist` decision page are positioned
  as complementary, not competing — `/shortlist`'s header links back to
  "Browse the free map," and `/dashboard`'s header gained a "Get your
  ranked shortlist" CTA linking to `/shortlist`. Browsing stays free and
  open (§5c); the shortlist stays the paid decision product.
- **Nothing in `rankTowns.ts`/`ShortlistResults.tsx`/the PDF report route
  needed to change for the Sydney Metro exclusion (§5g) or the PSI
  dashboard-only restriction (§5h)** — both were already scoped correctly
  (region-filtered ranking; PSI data was never plumbed into the report
  route in the first place), so reconnecting this flow didn't reopen either
  of those constraints.
- **Pre-existing anomaly found, not touched:** a nested, tracked
  `cadacre-web/cadacre-web/.next/` directory exists in the repo (committed
  in a same-day commit titled "Refactor code structure for improved
  readability and maintainability" — not from this work, and not something
  this pass created or committed). It makes bare `npm run lint` report ~200
  problems from bundled `.next` chunk files, since ESLint's flat-config
  `.next/**` ignore doesn't match nested at that depth. Verification this
  pass used `npx eslint src` instead to confirm the actual source changes
  are clean. Flagged for the founder to decide whether to `git rm` it —
  not removed unilaterally since it's already-committed history, not
  uncommitted working-tree cruft.

### 5j. Strategic positioning: competition strategy and experimental directions

Added 2026-08-31 as an explicit operating principle for future product decisions. The repo must not try to out-compete data-browsing platforms on raw breadth of market listings or chart count. Cadacre's real wedge is to turn user inputs into a decision: a ranked shortlist, a rent-vs-rentvest comparison, a before-you-proceed checklist, and a grounded AI explanation of what matters.

- **Core strategic rule:** do not compete on “we have more data than the big property research sites.” Compete on “we make the decision easier to trust and easier to act on.” This is the product position already reflected in §5i's shortlist flow: a scored, ranked shortlist + decision checklist is materially different from a data terminal.
- **Position Cadacre as a decision lab, not a data portal.** Use language like “test your rentvesting hypothesis,” “run a regional experiment,” “stress-test your Sydney rent against a regional alternative,” and “compare the decision, not just the numbers.” This is more distinctive and easier to explain than generic real-estate portal language.
- **Prefer experiments over static dashboards.** The product should embody user-driven decision experiments, not just charts and filters. Good examples include: Sydney-to-regional stress test, reverse “stay-in-Sydney” comparison, risk-and-tradeoff assessment, and “what changes the decision?” views.
- **Own the trade-off layer, not the raw data layer.** The most defensible product value is to surface the tension between affordability, yield, risk, lifestyle fit, and operational friction. The user need is not “more numbers”; it is “what does this actually mean for my life and finances?”
- **Grounded AI is a moat when used as a decision partner.** The AI concierge should translate natural-language questions into real filters, run them against Cadacre's actual dataset, and answer only from that data. It should feel like an analyst or research partner, not a general property chatbot. Good prompt patterns include: “Is this town realistic for my current Sydney rent?”, “Which towns preserve cash flow without creating lifestyle strain?”, and “What are the real downside trade-offs here?”
- **Build decision artifacts, not just data surfaces.** Generate outputs users can act on: a shortlist, a rent-vs-rentvest summary, a risk summary, a decision memo, a before-you-proceed checklist, or a PDF report. These outputs make Cadacre feel like a tool for action rather than a generic portal.
- **Keep the user in a narrow niche.** The product should be purpose-built for Sydney renters and first-time investors priced out of the local market, not a general market database for every buyer, landlord, and property professional. The niche is more defensible than trying to cover every suburb and every dataset on earth.
- **Experimental direction to test in product:**
  - “Rentvestor Lab” flow: user enters Sydney rent + budget + target yield + risk tolerance; product ranks towns and explains the trade-offs.
  - “Sydney vs regional” comparison mode: show the user what would happen if they keep renting in Sydney versus buying in another town.
  - “Town personality” cards: each town is described as affordable-but-risks, yield-heavy-but-fragile, or lifestyle-fit-but-low-margin.
  - “Decision summary” cards: highlight best fit, best risk-adjusted fit, and towns that seem cheap but require additional due diligence.
- **Do not build a generic portal with more charts than competitors.** If the product cannot explain why a user should trust Cadacre over a data site, then it is not achieving the real wedge. The wedge is decision support, not market coverage.
- **Risk-aware framing remains non-negotiable.** Every feature must explain that results are general information based on public data and not a recommendation or personalized financial advice. Cadacre should make trade-offs visible, not prescriptive.
- **Product principle:** the best future experiments are the ones that answer a real human question in plain English while staying grounded in the dataset. The product should feel like an evidence-backed decision engine for people who are priced out of their local market and need a practical next move.

### 5j. Cadacre Pro — monthly subscription tier (2026-08-30, Phase 2 pulled forward)

**Superseded same-day, and since merged — see §5l.** Later on 2026-08-30 the founder decided to
retire the $39 report entirely and merge it with this "Pro" layer into one single subscription
tier, and that merge was completed the same day (§5l): `isReportUnlocked`/`isProSubscriber` no
longer exist, replaced by one `isSubscriber`. The bullets below describe the code *as originally
built* in this entry — read them alongside §5l for the current state, not as the live design.

Added at the founder's explicit request, consciously overriding the Phase 1→2 gate in §2 (real
paying customers on the $39 flow still hasn't happened — see §6). Built entirely on the repo's
existing infrastructure — Clerk `privateMetadata` for all per-user state, a checked-in generated
JSON snapshot for history, no new database/cron/email provider — same "smallest working version"
convention as the rest of the codebase.

- **Entitlement (superseded, see §5l):** `src/lib/entitlements.ts` — `isReportUnlocked`/`isProSubscriber`, two
  independent Clerk `privateMetadata` booleans (`unlocked` vs `subscriptionStatus`). Pro is
  additive, not a replacement for the $39 one-time report unlock.
- **Billing:** `src/app/api/stripe/verify-pro/route.ts` (redirect-based initial-checkout
  verification, same pattern as the existing `$39` `verify` route) plus a new
  `src/app/api/stripe/webhook/route.ts` (the first real Stripe webhook in this repo — needed
  because, unlike a one-time payment, a subscription has a lifecycle: renewals, failed payments,
  cancellations, none of which a redirect alone can observe) and
  `src/app/api/stripe/portal/route.ts` (Stripe billing portal hand-off). New
  `src/app/account/page.tsx` is the repo's first account/settings surface. Requires a real
  recurring Stripe Price + Payment Link + registered webhook endpoint before it's live — same
  not-yet-configured status the $39 Payment Link already has (see §6); `NEXT_PUBLIC_STRIPE_PRO_PAYMENT_LINK_URL`
  and `STRIPE_WEBHOOK_SECRET` are documented in `.env.local.example` but unset.
- **Custom ranking weights** — `rankTowns.ts`'s previously-hardcoded 40/40/20 affordability/yield/
  vacancy split is now a `weights` field on `RankInput` (default unchanged), exposed as sliders in
  `ShortlistForm.tsx` only for Pro subscribers; free users always get the original default.
- **Multi-town scenario simulator** (`ScenarioSimulator.tsx`, dashboard-only) — same-day cash-flow
  comparison across a user's saved towns. Deliberately **no appreciation/breakeven-year
  projection** — that would require fabricating future price data, which this file prohibits.
- **Portfolio tracker** (`src/app/portfolio`) — user-entered properties (price paid, purchase
  date, weekly rent) stored in Clerk `privateMetadata.portfolioProperties`, same read-modify-write
  pattern as the existing saved-towns watchlist. User's own numbers, not town-linked, so no
  fabricated-data concern.
- **CSV export** (`src/app/api/export/shortlist`) — Pro-gated, re-runs `rankTowns` server-side.
- **Relocation-readiness pack** (`RelocationReadinessPack.tsx`, dashboard drawer) — composes
  already-sourced employment/amenities/climate/population/crime fields into one panel. No new
  data, no scoring/recommendation framing (§4) — plain descriptive sentences only.
- **Rank-drift + hazard/infrastructure change tracking** — `scripts/generate-town-snapshot.ts`
  (new devDependency: `tsx`, so the script can import the real `rankTowns`/`getAllTowns` logic
  directly instead of reimplementing the scoring formula) writes a checked-in
  `src/data/generated/townSnapshot.json` at a fixed reference `{budget, targetYieldPct}` (rank/
  valueScore only exist per-input, not as a stored `Town` property). `src/lib/townDrift.ts` diffs
  the live data against it; `TownDriftPanel.tsx` (Pro-gated) shows only real changes, no noise for
  unchanged towns. A free, ungated "record last updated {date}" line also appears in the drawer
  for everyone. **Manually rerun, same convention as `aggregate-nsw-suburbs.js`** — not wired into
  `npm run`, not a live cron.
- **Rent tracker** (Pro perk layered on the existing free `/rent-vs-rentvest` tool, §5i) — a
  signed-in Pro subscriber can save a baseline for a suburb (`privateMetadata.rentTrackerBaseline`)
  and see an in-app "since you tracked this" delta banner on a later visit. **No email is
  sent** — no email provider exists in this repo — this is an honest "since your last visit"
  mechanism, not a fabricated monthly-cadence promise.
- **Rent-increase negotiation letter** (`src/app/tools/negotiation-letter`) — compares a proposed
  rent increase against a Sydney suburb's real sourced median rent, generates a downloadable PDF
  via the same `@react-pdf/renderer` pattern as the shortlist report. Carries its own "not legal
  advice, not a tenants' advocate or law firm" disclaimer, distinct from the financial-advice
  disclaimer family used elsewhere.
- **Not done this pass:** a buyer's-agent-directory-style feature was never on this list (already
  declined in §5f); nothing here touches the Concierge gate in §2 Phase 3.

### 5k. AI concierge chat (design direction, 2026-08-30 — built same day, see §5l)

The flagship AI feature for the new single subscription (§2), chosen specifically because it's
buildable on infrastructure this repo already has: `GROQ_API_KEY`/`GROQ_MODEL` are already
configured (`.env.local.example`), and `src/app/api/ai/research/route.ts` already establishes the
exact anti-hallucination pattern this feature reuses rather than reinvents. Groq is a free/
pay-as-you-go, self-serve API (no sales contact) — satisfies the new §4 rule 8 by construction,
not by exception.

- **Grounding pattern (reused, not new):** `api/ai/research/route.ts`'s system prompt already
  instructs the model to summarize only supplied facts, never invent a value, and say
  "unavailable" for nulls — the concierge's system prompt should be the same family of instruction,
  just generalized from one location's facts to the full `getAllTowns()` record.
- **Query pattern (the "complex algorithm" angle):** a natural-language question ("coastal towns
  under $600k with low bushfire risk") is sent to the model with instructions to output a
  **structured filter object** matching `TownMapFilters`/`RankInput` shapes (`src/lib/
  townFilters.ts`, `src/lib/rankTowns.ts`) — the model's only job is translating language into
  real filter parameters. The app then runs that filter through the existing, deterministic
  `matchesFilters`/`rankTowns` functions and only *then* asks the model to phrase a short answer
  from the real filtered results. The model never computes a number or asserts a fact outside
  what those deterministic functions returned — this is what makes it a genuinely more
  sophisticated feature without reopening any fabrication risk.
- **Failure mode:** if `GROQ_API_KEY` is unset or Groq errors, show a plain "AI concierge
  unavailable" state (same graceful-degradation convention `api/ai/research/route.ts` already
  uses for a missing key) — never a fallback invented answer.
- **Gating:** subscriber-only, per the single-tier model in §2.
- **Built same day — see §5l** for the actual route/component/schema that shipped.

### 5l. Entitlement merge + AI concierge shipped (2026-08-30, same day as §5j/§5k)

Both follow-ups flagged at the end of the §2 revision were implemented immediately after, per
the founder's request.

- **Entitlement merge:** `src/lib/entitlements.ts` now exports a single `isSubscriber(userId)` —
  `subscriptionStatus === "active"` OR the legacy `unlocked === true` (grandfathers anyone who
  already paid the retired one-time $39 report so they stay entitled without resubscribing).
  `isReportUnlocked`/`isProSubscriber` are gone; every caller (`dashboard/actions.ts`,
  `api/report`, `api/export/shortlist`, `api/negotiation-letter`, `ShortlistForm`,
  `DashboardMapWorkspace`, `TownDetailDrawer`, `RentVsRentvestTool`, and the account/portfolio/
  negotiation-letter pages) now calls/accepts `isSubscriber` instead.
- **Billing consolidated:** `api/stripe/verify-pro/route.ts` was deleted; `api/stripe/verify/
  route.ts` now does subscription verification directly (mode `"subscription"`, tags the Stripe
  subscription with `metadata.clerkUserId` for webhook attribution, sets `subscriptionStatus`/
  `stripeCustomerId`) and redirects to `/shortlist?subscribed=1` (same budget/yield-passthrough
  and auto-resubmit UX the old $39 flow had). `.env.local.example` now documents a single
  `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL` (recurring Price) instead of two separate links.
  `ShortlistResults.tsx`, `shortlist/page.tsx`, and `account/page.tsx` all reuse this one link.
  Still not live — same not-yet-configured status as before, now for one Payment Link instead of
  two.
  **Not part of this migration, flagged for a human decision instead of auto-resolved:** existing
  users who set up the *old* two-Payment-Link config (a real `NEXT_PUBLIC_STRIPE_PRO_PAYMENT_LINK_URL`)
  before this merge would need to reconfigure — moot today since neither was ever live (§6), but
  worth knowing if this reads oddly against a future Stripe dashboard snapshot.
- **Marketing/legal copy updated to match:** every "$39"/"one-time payment"/"no subscription"
  reference in `Hero.tsx`, `Pricing.tsx`, `FinalCta.tsx`, `HowItWorks.tsx`, `Faq.tsx`,
  `RecordBanner.tsx`, and `terms/page.tsx` was rewritten for the subscription model (including the
  Terms' payment/refund clauses — cancel-anytime language replacing the old one-time-refund
  policy). This is a real legal-copy change; **still pending professional legal review**, same
  caveat the Terms page already carries.
- **AI concierge, built:** `api/ai/concierge/route.ts` (POST, subscriber-gated) — two Groq calls,
  exactly as designed in §5k: (1) translates the question into a JSON filter object matching
  `TownMapFilters`, sanitized field-by-field (never trusts the model's JSON shape blindly), (2)
  runs it through `matchesFilters` over `getAllTowns()`, sorts matches by median price, caps at 8,
  and only then asks the model to phrase a short answer strictly from those real matched towns'
  fields. Degrades to `{configured: false}` if `GROQ_API_KEY` is unset — no invented fallback.
  `AiConciergeChat.tsx` (dashboard-only, subscriber-gated bottom-sheet, same portal/z-index
  pattern as `ScenarioSimulator`/`CompareDrawer`) is the UI, wired into
  `DashboardMapWorkspace.tsx` alongside the Scenario Simulator toggle.
- **Branding cleanup:** "Cadacre Pro" as a named tier is retired from all UI copy/comments (single
  tier now) — replaced with plain "Subscriber"/"Cadacre subscriber feature" wording throughout.
- Builds, type-checks, and lints clean (`npx eslint src` / `npx tsc --noEmit`); dev-server
  route smoke-test only this pass (protected routes redirect, public routes 200, concierge POST
  returns 401 unauthenticated, `/api/stripe/verify` redirects to `/shortlist?subscribe_error=1`
  without a session) — **not yet verified end-to-end with a real signed-in subscriber or a real
  Groq-backed concierge answer** (no Stripe Payment Link/webhook registered, and this pass didn't
  exercise the concierge with a real `GROQ_API_KEY` set).

### 5m. Council/planning monitoring — new feature area (design direction, 2026-08-30, not yet built)

Added at the founder's request as a **second major feature alongside** the rentvesting product
described in §1-§5l — not a replacement for it. Nothing in this section changes any existing
rentvesting flow, dataset, or entitlement check; everything here is net-new surface area.

- **What it does:** a user tracks any address, suburb, or LGA. The system pulls new development
  applications (DAs), planning permit decisions, rezoning proposals, and council meeting minutes
  for that area and generates plain-English AI alert summaries (email/SMS/push), e.g. "A DA was
  lodged for a 6-storey apartment block 200m from your address; council votes 15 March" or "Your
  suburb was rezoned from low-density to medium-density." Each alert carries an **opportunity
  score** (zoning change, proximity to infrastructure projects, density bonuses). Users define
  saved-search watchlists (e.g. "any DA within 500m of my investment property"). A historical view
  shows past planning decisions alongside free state sales data, to build trust in the scoring.
- **Grounding pattern — reuse, don't reinvent:** apply the exact same rule §4 item 8 already
  states for the AI concierge (§5k/§5l): the model's role is strictly to phrase/summarize
  already-scraped source documents (address, application type, date, decision) — it must never
  invent a fact, a date, or a decision. If the AI provider is down or unconfigured, degrade to a
  plain "unavailable" state, same convention as `api/ai/concierge/route.ts`. Opportunity scoring
  and any historical price-correlation classifier are **descriptive/statistical only** — never
  phrased as a recommendation, a "buy signal," or "hot pick" language, per §4's existing
  no-spruiking rule. This is the same legal posture the rest of the product already follows,
  applied to a new data type — not a new open question.
- **Data sources — all free, self-serve** (same §4 item 8 "no sales-contact-gated API" rule
  applies): council websites/RSS feeds (scraped), NSW ePlanning API for DAs, Planning Victoria
  open data for scheme amendments, Queensland's DA Tracker, data.nsw.gov.au/data.vic.gov.au open
  data portals for property sales and zoning, state gazette notices for rezoning announcements,
  OSM Nominatim for geocoding. Same non-fabrication rule as the town dataset (§5): if no credible
  source exists for a given council/area, say "not mapped" rather than guess — never estimate a
  plausible-looking value.
- **Infrastructure gap — explicit, nothing below exists in this repo today:**
  - **No scheduler/cron.** `scripts/` (top-level) contains only manual one-off data-prep scripts
    run by hand to regenerate static JSON (`aggregate-nsw-suburbs.js`,
    `generate-town-snapshot.ts`, etc.) — none of them are scheduled jobs. Periodic council-source
    polling needs new infrastructure (e.g. Cloudflare Workers Cron Triggers, consistent with the
    Cloudflare-adjacent tooling already available to this project).
  - **No database.** Every existing feature persists through Clerk `privateMetadata` (entitlement
    flags, saved towns, portfolio properties) or checked-in static/generated JSON
    (`src/data/generated/`) — there is no Postgres/Supabase/Prisma/Drizzle anywhere in this repo.
    Watchlists, tracked addresses/LGAs, a scraped-document store, and alert history cannot
    reasonably live in Clerk metadata the way the current features do — this needs real
    relational storage (Postgres via Neon or Supabase's free tier is the natural fit, matching the
    "migrate to Supabase once data needs grow" note already in §5's intended stack). Don't attempt
    to shoehorn this feature's state into `privateMetadata`.
- **Pricing — specific to this feature, not yet reconciled with §2's single-tier model:** Free (1
  watchlist, weekly email digest, limited alerts), Pro ($19-39/mo: unlimited watchlists,
  real-time alerts, AI summaries, historical impact reports, exportable PDFs), Team/Agency
  ($99+/mo: multiple users, API access, white-label reports for clients), plus an optional
  one-time "$9.99 Property Risk Report" upsell for casual/non-subscribed users. **Open decision,
  not resolved by this doc update:** whether this becomes a second entitlement dimension
  alongside the existing `isSubscriber()` check (§5l), or gets folded into an expanded version of
  the single subscription. Do not implement either direction without the founder confirming which.
- **Explicitly not yet built:** no scraper, no database, no AI alert pipeline, no watchlist UI, no
  new Stripe price/tier wired up, no opportunity-scoring classifier. This section is design
  direction only — same status the AI concierge had in the original §5k before it shipped in §5l.
  Reusable patterns already in this repo worth starting from when this is built: the Leaflet/OSM
  map components (§5c) for a map overlay of tracked addresses/alerts, and the grounded two-call AI
  pattern in `api/ai/concierge/route.ts` (§5l) for turning scraped documents into a plain-English
  summary.

---

## 6. Current Status Snapshot

- [x] Business concept validated through discussion, not yet through real users
- [x] Name selected: Cadacre (checked for trademark/brand collisions — none found as of naming)
- [x] Design direction and working front-end prototype built (`cadacre.html`)
- [x] Production Next.js app built end-to-end: Clerk auth-gated dashboard →
      budget/yield form → ranking engine → free-3 teaser ledger → Stripe
      Payment Link paywall → `/api/stripe/verify` unlock → downloadable PDF
      report (`cadacre-web/`). Builds and lints clean. **Note (2026-08-28):**
      the dashboard UI path into this flow was removed when the map's
      "Generate shortlist" CTA was dropped in favor of pure live filtering
      (see §5c). **Update (2026-08-29):** reconnected as its own page,
      `/shortlist` — see §5i. Every homepage sign-up CTA now lands there
      instead of `/dashboard`. Builds and type-checks clean (verified via
      `npx eslint src`, not bare `npm run lint` — see §5i's note on a
      pre-existing, unrelated nested `.next` directory in the repo); not
      yet verified end-to-end with a real Stripe test payment.
      **Superseded 2026-08-30 (see §5l):** the founder decided to retire this
      $39 one-time flow in favor of a single monthly subscription, and the
      migration was completed the same day — `api/stripe/verify` now
      verifies the subscription checkout directly, `api/stripe/verify-pro`
      is deleted, and `unlocked`/`subscriptionStatus` are merged into one
      `isSubscriber()` check (legacy `unlocked: true` users stay entitled).
- [x] Town dataset is real, sourced, non-fabricated data (18 NSW regional
      towns; PRD market updates + Your Investment Property Mag/CoreLogic
      suburb data, each figure carrying its own source URL and as-of date;
      unavailable figures are `null`, never guessed) — **note:** sourced
      from PRD/YIP, not literally ABS/SQM as Section 5 specifies; revisit if
      ABS/SQM-specific sourcing is required, and vacancy rate is missing for
      most YIP-sourced towns.
- [x] 16 Sydney Metro suburbs added (2026-08-29), tagged
      `region: "Sydney Metro"` and excluded from the paid ranked shortlist
      (regional-only positioning preserved) — free-browse/compare only on
      the dashboard map. See §5g. Same YIP/CoreLogic sourcing, same
      `null`-not-guessed rule; vacancy rate and bushfire/flood risk are
      `null` for all 16 (not published/found). Builds, type-checks, and
      lints clean; not yet verified end-to-end in a signed-in browser
      session.
- [x] Full NSW suburb coverage + sale-price growth chart shipped
      (2026-08-29) — 4,542 real NSW suburbs (ABS SAL boundaries, CC BY 4.0)
      rendered on the dashboard map beyond the 34 curated towns; 2,184 of
      them have a real multi-year growth chart from NSW Valuer General Bulk
      PSI sale records. See §5h — **PSI is CC BY-NC-ND 4.0, dashboard-only,
      flagged pending founder legal review**, never in the paid report.
      Builds, type-checks, and lints clean; map performance (viewport+zoom
      capped rendering) and a handful of generated records spot-checked
      manually, not yet verified end-to-end in a signed-in browser session.
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
- [x] Investor-value features shipped (2026-08-28) — investment/stamp-duty
      calculators, a 4-town compare drawer, a Clerk-metadata-backed "saved
      towns" watchlist (scoped down from full email alerts per the Phase 2
      gate in Section 2), and a price-trend chart with real sourced data for
      1 of 18 towns (Goulburn) — the rest honestly show "not enough public
      data," not a fabricated trend. Builds and lints clean; not yet
      verified end-to-end in a signed-in browser session (build/lint only
      this pass) — see §5d for the full breakdown and follow-up paths.
- [x] Free public API data shipped (2026-08-28) — real ABS population
      (18/18 towns), Open-Meteo climate normals (18/18 towns), and
      OpenStreetMap Overpass amenity counts (2/18 towns — Overpass
      rate-limited the fetch pass; the rest honestly show "not available,"
      not a fabricated count). New "Min pop. growth %" map filter. Builds
      and lints clean; not yet verified end-to-end in a signed-in browser
      session — see §5e for the full breakdown, licensing caveat on
      Open-Meteo, and the amenity-coverage follow-up path.
- [x] Crime, employment, and a real RBA rate shipped (2026-08-29) — NSW
      BOCSAR property-crime rate and ABS unemployment/participation rate,
      both real and resolved for all 18 towns; the investment calculator's
      rate field now defaults from a real RBA investor mortgage rate instead
      of a guess. A buyer's-agent-directory idea was explicitly declined by
      the founder (Concierge gate, §2 Phase 3); a local-news-headlines idea
      was researched but not built — Google News RSS's own terms restrict it
      to personal, non-commercial use, which conflicts with Cadacre's paid
      tier. See §5f for the full breakdown. Builds and lints clean; not yet
      verified end-to-end in a signed-in browser session.
- [x] Terms of Service / Privacy Policy drafted in-app (`/terms`, `/privacy`)
      — both carry a visible "pending professional legal review" notice and
      must not be treated as final until a lawyer signs off.
- [ ] Stripe payment not yet *live* — code path is complete but
      `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL` / `STRIPE_SECRET_KEY` are unset;
      needs a real Stripe Payment Link created and a live test payment run
      before this can be marked done (see Section 6 rule below).
- [x] Single Cadacre subscription tier shipped (2026-08-30, in two same-day
      passes — see §5j then §5l) — the full feature list (custom ranking
      weights, scenario simulator, portfolio tracker, CSV export,
      relocation-readiness pack, rank-drift/hazard alerts, rent tracker,
      negotiation-letter generator) plus the AI concierge chat, all behind
      one merged `isSubscriber()` entitlement; the earlier "Cadacre Pro"
      naming and the separate one-time $39 flow are both retired. Phase 2
      gate in §2 explicitly overridden by the founder, not silently bypassed.
      Builds, type-checks, and lints clean (`npx eslint src` / `npx tsc
      --noEmit`); dev-server route smoke-test only this pass (protected
      routes redirect correctly, public routes 200, `/api/ai/concierge`
      returns 401 unauthenticated, `/api/stripe/verify` redirects to
      `/shortlist?subscribe_error=1` without a session) — **not yet
      verified end-to-end with a real signed-in subscriber or a real
      Groq-backed concierge answer** (no Stripe Payment Link/webhook
      registered yet, and this pass didn't exercise the concierge with a
      real `GROQ_API_KEY` set).
- [x] AI concierge chat shipped (2026-08-30, same day as the subscription
      merge — see §5l) — `api/ai/concierge/route.ts` + `AiConciergeChat.tsx`,
      exactly per the §5k design: NL question → Groq-translated structured
      filter → deterministic `matchesFilters` → Groq phrases the answer
      strictly from the real matched towns. Degrades to a plain
      "unavailable" state if `GROQ_API_KEY` is unset. Subscriber-gated,
      dashboard-only. Not yet exercised with a real Groq key in this pass.
- [ ] Legal review of ToS/Privacy not yet done
- [ ] Domain not yet purchased
- [ ] Zero real users, zero real revenue
- [ ] Council/planning monitoring feature (2026-08-30) — design direction documented in §5m as a
      second feature area alongside the rentvesting product. Nothing built yet: no scraper, no
      database, no AI alert pipeline, no watchlist UI, no new Stripe tier. Requires new
      infrastructure (scheduler, real database) this repo does not currently have.

**When picking up work on this repo, check this section first and update it as milestones are actually completed — do not mark items complete based on code existing if they haven't been verified working end-to-end (e.g. a Stripe integration isn't "done" until a real test payment has succeeded).**

---

## 7. Working Principles for Any Agent on This Project

- Prefer the smallest working version of any feature over a fully-featured build — this project is optimized for fastest path to first real dollar, not architectural completeness.
- Never invent data, testimonials, user counts, or revenue figures in copy or code comments. If a placeholder is needed, label it explicitly as a placeholder.
- Preserve the "ledger" design language and Old-English/land-record brand voice in any new UI — do not default to generic SaaS dashboard patterns.
- Flag legal-sensitive features (Section 4) back to the founder rather than building them speculatively.
- When in doubt about scope, default to what's explicitly described in the current §2 model (as
  of 2026-08-30: the single subscription tier and its free-tier hook) rather than adding new paid
  tiers, referral mechanics, or Phase 3 features unless told otherwise.
