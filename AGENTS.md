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
  public record" tool. **This means `ShortlistForm.tsx`, `ShortlistResults.tsx`,
  and the `getShortlist` server action (`src/app/dashboard/actions.ts`) are
  currently unreferenced anywhere in the app** — the Stripe/report backend
  routes are intact, but there is no UI path to the $39 paywall + PDF
  report described in Section 2's Phase 1 business model. This was flagged
  to the founder when it happened; rebuild that flow (its own page, a
  modal, etc.) before relying on it as the revenue path again.
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
  reject round values like `700000` — fixed (`min={0}`) 2026-08-28, though
  the form itself is currently unreferenced (see the paywall note above).

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
      (see §5c) — the backend (`getShortlist`, Stripe routes, PDF route) is
      still intact and correct, but nothing in the current UI calls it.
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
