# AGENT.md — REITCompare
## The Data Layer for Australian Property-Backed Investing

**Version:** 3.0 (No-AFSL by Design)
**Last Updated:** 2026-09-06
**Author:** Technical Founder
**Status:** Bootstrap / Pre-Launch

---

## 0. What Changed From v2.0 and Why

v2.0 treated "avoid AFSL" as a temporary bootstrap posture with an eventual Authorised Representative pathway. That created ambiguity in exactly the features most likely to convert traffic (editorial picks, "similar/better" comparisons, forecasts) — the features that read as *advice* rather than *data*. v3.0 makes the no-AFSL boundary a **permanent architectural constraint**, not a phase, and re-specs every borderline feature so it stays inside the factual-information / mechanical-tool lane indefinitely. Four changes:

1. **AFSL/AR pathway removed entirely.** The product is a data and tooling company forever, not a data company with an advice option held in reserve. This isn't a compliance-cost decision — it's a product-identity decision: the moat is being the neutral, uncorrupted-by-recommendations data layer that advisers and fintechs can build *their* advice on top of. Staying unlicensed is the credibility asset, not a workaround.
2. **Editorial/ranking language stripped out.** "REIT of the Week," "compare with similar" (as a recommendation), and any "best of" framing are replaced with neutral, criteria-transparent, user-driven equivalents. The distinction that matters under Australian financial services law: presenting *what the data says* is information; presenting *what you should do about it* or *which one is better* is advice, licensed or not.
3. **Forecasting and index-building tools reframed as user-parameterized models, not recommendations.** Every output in this category is something the *user* configures and the *platform* computes mechanically — the platform never selects, ranks, or suggests a component, security, or course of action on its own initiative.
4. **A standing product-design rule replaces the "lawyer's letter once" approach.** Instead of a single compliance check-in, every new feature is run through a five-question checklist (§6.1) before it ships, so the constraint holds as the product grows rather than eroding feature-by-feature.

Nothing else about the strategy changes — the tool-first SEO thesis, the national-first schema, the B2B/API revenue ceiling, and the persona set from v2.0 all remain intact. This version narrows *how* features are presented, not *what* the product does.

---

## 1. Product Vision

### 1.1 One-Sentence Pitch
REITCompare is the independent data layer for Australian property-backed investing — a free comparison and discovery engine for A-REITs, with a premium toolset and a paid data API, that lets retail investors, advisers, and fintechs see what public filings hide, without ever telling anyone what to buy.

### 1.2 The Problem
- Retail investors have no REIT-specific tool; generic finance sites (Finder, Canstar) treat REITs like ordinary shares
- Key metrics (WALE, NTA discount, gearing, sector exposure, lease expiry) are buried in 100+ page annual reports
- No platform connects REIT ownership to physical addresses/suburbs anywhere in Australia — investors can't "see" what they own
- Advisers and fintech builders have the same data problem at higher stakes, and currently solve it with manual spreadsheets or expensive institutional terminals (Bloomberg, CoreLogic Enterprise) that are overkill and overpriced for their use case
- AI search is compressing the value of static comparison content; only interactive tools and proprietary datasets retain a reason for a user to visit
- Existing comparison sites that *do* rank or recommend products (Finder, Canstar) hold AFS licences for exactly that reason — there is real value in being the alternative that stays licence-free by staying strictly factual, since it's faster to ship, cheaper to run, and structurally can't be accused of pay-to-play bias

### 1.3 The Solution
A free, tool-first comparison engine with three revenue layers, none of which involve recommending, ranking, or rating specific financial products:
1. **Free tool layer** — comparison table, REIT detail pages, national asset map, glossary. Drives traffic and data-collection (watchlists, alerts) that builds switching cost.
2. **Premium layer ($/month, B2C)** — portfolio tracker with tax-component tracking, multi-condition alerts, screener saved views, distribution scenario modelling.
3. **Data/API layer ($$$/month, B2B)** — licensed access to the normalised REIT dataset and asset-geocoding layer for advisers, fintech builders, and REIT IR/comms teams who want a clean feed instead of scraping filings themselves. This is the layer with real revenue ceiling.

### 1.4 North Star Metric
**Weekly Active Tool Sessions** — a session where a user actively manipulates a filter, sets an alert, or queries the API (not a passive content pageview). This punishes content-farming and rewards the tool-first strategy in §0.

### 1.5 Success Criteria (12 Months)
| Metric | Target |
|--------|--------|
| Organic monthly sessions | 60,000 |
| Registered users | 8,000 |
| Premium subscribers | 400 (~$4,800 MRR at $12/mo) |
| B2B API/data customers | 5 (~$3,000–$6,000 MRR combined) |
| Affiliate revenue | $1,000/month (deliberately de-prioritised) |
| Indexed REITs | 65+ (all ASX-listed A-REITs + top ASX-listed diversified LICs with property exposure) |
| Nationally geocoded assets | 1,500+ (not Sydney-only) |
| Total MRR | ~$9,000–$12,000 by month 12 |

---

## 2. Target Audience

### 2.1 Primary Persona: "The Rentvestor" (B2C wedge)
- Alex, 32, software engineer, Sydney, $120k/year, rents in Newtown
- Wants property-market exposure without the deposit; confused by which REITs give it
- Behaviour: Googles "best REITs Australia," "invest in property without buying"
- **Conversion path:** free tool → watchlist/alert (email capture) → premium portfolio tracker

### 2.2 Secondary Persona: "The SMSF Trustee" (B2C, higher LTV)
- Margaret, 58, retired teacher, SMSF in pension mode, $800k balance
- Needs distribution tax-component tracking; generic trackers get it wrong
- **Conversion path:** highest-intent premium subscriber; tax-component tracker is the killer feature for this segment specifically

### 2.3 Tertiary Persona: "The Curious First-Timer"
- Jordan, 24, grad analyst, $5k to invest, intimidated by stock-picking
- **Conversion path:** glossary + screener → newsletter → affiliate broker referral (low-effort monetisation, not core; a plain referral link is not itself financial product advice, so it stays outside the licensing regime as long as no recommendation accompanies it)

### 2.4 Persona: "The Adviser / Fintech Builder" (B2B, the revenue ceiling)
- A boutique financial adviser or a fintech building a property-exposure product who needs clean REIT + asset-location data and doesn't want to scrape ASX filings or pay for a Bloomberg terminal
- Pain: existing data (CoreLogic, Bloomberg) is enterprise-priced and overkill; DIY scraping is fragile and time-consuming
- A licensed adviser is exactly the customer who *wants* their data source to be unlicensed and opinion-free — it means the numbers are theirs to interpret, not pre-filtered through someone else's recommendation logic
- **Conversion path:** direct outreach once the dataset has 6+ months of history; API access, usage-based or flat monthly pricing

---

## 3. Core Features

### 3.1 MVP (Phase 1 — Months 1–3)

#### 3.1.1 REIT Comparison Table
Filterable/sortable table across all ASX-listed A-REITs (ticker, sector, market cap, yield, NTA premium/discount, gearing, WALE, top tenants, distribution dates). Sort order is always user-selected (by any column, ascending/descending) — the platform never applies a default "top picks" or composite score ordering. Mobile-responsive card view.

#### 3.1.2 Individual REIT Detail Page
Hero stats, sparkline charts, national asset map (not Sydney-only), top-10 tenants, distribution history, gearing/debt maturity, sector and geographic breakdowns, auto-scraped ASX announcements feed, a **"Peers in this sector"** module (same-sector, similar-market-cap REITs listed with matching metrics side by side, alphabetically or by user-chosen sort — explicitly not framed as "better than" or "instead of"), affiliate CTA.

#### 3.1.3 National Asset Discovery Map
- Interactive map of all geocoded REIT-owned assets Australia-wide, with Sydney built out first and deepest (launch focus) but the schema and UI built to scale nationally from day one
- Click a suburb/region → see which REITs own assets there, asset cards with address, type, acquisition date, book value

#### 3.1.4 Alert System (Free tier)
Email alerts on user-defined NTA discount thresholds and new distribution announcements. The user sets the trigger condition and the number; the system checks it mechanically. No system-generated or default thresholds, and no alert copy that characterises a triggered condition as a buy/sell signal — the notification states the fact ("X REIT's NTA discount crossed 15%") and nothing else.

#### 3.1.5 Tool-First Content Engine
- Auto-generated *interactive* comparison pages (a live filtered table state, not a static article) for long-tail queries: "Industrial REITs by Yield 2026," "REITs with Assets in Parramatta" — titled by the filter criteria itself, not by a superlative ("best," "top") the platform can't substantiate without a licence
- Glossary as a structured, linkable reference (feeds AI-search citations rather than fighting them)
- **"Filing Spotlight"** replaces the v2.0 "REIT of the Week" editorial slot: a weekly, purely factual write-up of one notable disclosure event (an acquisition, a gearing change, a distribution cut) — reports what happened and what the filing says, with no opinion on whether the security is attractive, no rating, and no forward-looking characterisation. Used for newsletter cross-promotion.

### 3.2 Premium (Phase 2 — Months 4–6)

#### 3.2.1 Portfolio Tracker
CSV/manual import, NTA-weighted metrics, distribution calendar, **tax component tracking** (tax-deferred, capital gains, foreign income) — the single highest-conversion feature for the SMSF persona — performance vs. the ASX 200 A-REIT index. All outputs are arithmetic on the user's own holdings; the tracker never suggests a rebalancing action.

#### 3.2.2 Advanced Alerts
Multi-condition alerts (still entirely user-defined thresholds, AND/OR logic across metrics the user picks), SMS, Discord/Slack webhooks.

#### 3.2.3 National SuburbREIT Pro
Heatmap of median REIT yield by region (national, not Sydney-only), asset-level lease expiry/rent review/occupancy detail, development pipeline tracking. Pure data visualisation — no "hot suburb" or "avoid" labelling.

#### 3.2.4 REIT Data API
- REST API for the normalised REIT dataset and asset-geocoding layer
- Free tier heavily rate-limited (lead gen for B2B); paid tiers priced for advisers/fintechs, not retail power users
- Data only, no derived recommendations or scores in the response payload — API customers (many of whom hold their own AFSL) do their own interpretation, which is precisely the point of the product for that segment
- Scoped for months 4–6 specifically because the dataset needs ~3 months of accumulated history before anyone will pay for it — don't delay past month 6 or the B2B revenue layer never materialises in year one

### 3.3 Future (Phase 3 — Months 7–12)

#### 3.3.1 Property-Exposure Basket Builder
A tool where the **user** selects criteria (sector, region, yield range, gearing ceiling) and the platform mechanically assembles the matching ASX-security basket and backtests it against historical data. The platform never proposes a basket unprompted and never labels one basket as better than another — it is a calculator operating on user-supplied parameters, functionally equivalent to a spreadsheet with better data behind it.

#### 3.3.2 Distribution Scenario Modelling
Historical-trend extrapolation showing a range of future distribution scenarios (base/upside/downside) built from disclosed lease-expiry and rent-review data, with all assumptions shown alongside the output and explicit "this is a model of historical patterns, not a prediction or recommendation" labelling on every result. No single-point "predicted distribution" number is surfaced without its assumptions and range attached.

#### 3.3.3 Community Layer
User watchlists/notes, opt-in public portfolio sharing, per-REIT discussion — user-generated content, clearly attributed to users rather than the platform, with moderation guidelines that keep platform-authored replies factual.

#### 3.3.4 Permanent Non-Goal: No Personalisation, No Recommendations
Explicitly out of scope, forever, not just for now: personalised model portfolios, scored/rated recommendations, "advice" of any kind tailored to an individual's circumstances, and any AFSL or Authorised Representative arrangement. If a future business reason ever makes personalised advice attractive, that is a different company built on top of this dataset — not a phase of this one.

---

## 4. Technical Architecture

### 4.1 Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript | SSR for SEO/AI-citation crawlability, React for interactivity |
| Styling | Tailwind CSS + shadcn/ui | Rapid, accessible UI |
| State | Zustand + React Query | Server-state caching, client-state management |
| Maps | Mapbox GL JS | Custom data layers at national scale |
| Charts | Recharts | Lightweight, React-native |
| Backend | Next.js API Routes + tRPC | Type-safe, colocated |
| Database | Supabase (Postgres + PostGIS) | PostGIS added explicitly for national geospatial queries, not just Sydney bounding boxes |
| Data pipeline | Scheduled scrapers + BullMQ job queue | Structured logging from day one; plan for API sources as they appear |
| Search | Meilisearch | Fast filtering/search over REIT and asset data |
| API layer | Versioned REST API (`/api/v1/`) | Built with external B2B consumers in mind from month 1, even before it's sold |

### 4.2 Data Architecture Note
Design the schema so "Sydney" is a filter value, not a hardcoded assumption, anywhere in the codebase. This is the single highest-leverage engineering decision in this plan — it's the difference between a national data company and a Sydney hobby project, and it costs nothing extra to do correctly at month 1 versus a costly migration at month 8.

### 4.3 Publishing/CMS Constraint
Any content field that renders as user-facing copy (Filing Spotlight, glossary entries, long-tail comparison page titles, alert copy templates) is versioned and passes through the pre-publish checklist in §6.1 before shipping. This is a lightweight lint rule, not a manual legal review each time — see §6.1 for the exact checks.

---

## 5. Monetisation Priority

1. **Premium subscriptions** (recurring, scalable, retail) — primary B2C revenue
2. **Data/API licensing** (recurring, high-ACV, B2B) — the actual growth ceiling; prioritise landing the first paying adviser/fintech customer as a proof point over hitting retail subscriber vanity metrics
3. **Affiliate revenue** — kept as a low-effort, no-cost-to-build revenue stream, explicitly de-prioritised, because affiliate terms are a single point of failure outside founder control

---

## 6. Legal & Compliance

### 6.1 The Permanent No-AFSL Design Constraint
This is an architectural rule, not a bootstrap-phase workaround. The product publishes factual data and mechanical tools only, indefinitely:
- **Do:** publish factual public data, general information about REITs as an asset class, calculators that operate purely on user-input assumptions, affiliate links, user-defined mechanical alerts, sector-level or aggregate market commentary
- **Never:** recommend or rank specific REITs, imply one REIT is preferable to another, give personal financial or tailored tax advice, operate a managed investment scheme, arrange deals in financial products, attach a "buy/hold/sell"-style characterisation to any data point

**Five-question pre-publish checklist** — applied to every new feature or content template before it ships, not just at launch:
1. Does the output change based on anything about an individual user's personal circumstances (other than data they've mechanically input, like their own portfolio)? If yes → stop, that's personal advice territory.
2. Does the platform itself select, rank, or highlight one security over another, rather than the user choosing the sort/filter? If yes → reframe as user-driven or drop it.
3. Does any copy use evaluative language ("best," "top," "attractive," "avoid," "recommended") about a specific security? If yes → rewrite to state the underlying fact instead.
4. Is a forecast or model output ever shown without its assumptions and range attached in the same view? If yes → add them or don't ship the number alone.
5. Would a reasonable person reading this feel told what to do, rather than shown what the data says? If yes → it needs rework regardless of how the first four questions score.

### 6.2 Required Disclaimers
Every page: general-information-only disclaimer, affiliate disclosure, data-accuracy disclaimer, general-nature tax disclaimer. Terms of Service: no warranty on data accuracy, user assumes investment risk, no liability for losses.

### 6.3 Australian Consumer Law
No misleading claims ("guaranteed returns"), all performance data historical and clearly labelled, no unsubstantiated testimonials, no superlative claims about a specific security that the platform can't substantiate as objective fact.

### 6.4 Legal Review Cadence
Lawyer's letter at month 1 confirming the MVP feature set sits outside the financial-product-advice definition, **plus a standing instruction to the same lawyer to review any new feature that fails the §6.1 checklist** rather than a one-time sign-off. This is cheaper than it sounds — most features will clearly pass or clearly need rework without needing a fresh formal letter each time.

---

## 7. Competitive Positioning

| Competitor | Type | Weakness | Our Advantage |
|-----------|------|----------|---------------|
| BrickX | Fractional property | Illiquid, high fees, now in administration | Liquid, free, no regulatory burden |
| DomaCom | Fractional property | Niche, limited liquidity | Broader REIT coverage, zero fees to compare |
| Finder / Canstar | Generic comparison | Shallow REIT coverage, licensed ratings create pay-to-play optics | Deep REIT-specific metrics, no rankings to buy or bias, structurally neutral |
| Sharesight | Portfolio tracker | Treats REITs like normal shares | REIT-native tax treatment and metrics |
| ASX | Exchange | Authoritative but terrible UX | Friendly, tool-first layer on raw data |
| Bloomberg / CoreLogic Enterprise | Institutional data | Enterprise-priced, overkill for small advisers/fintechs | Right-sized, affordable, opinion-free B2B data API |

### 7.1 Defensibility
1. **National asset-geocoding dataset** — the actual data moat, not a Sydney-only novelty
2. **Accumulated user data** (watchlists, portfolios, alert history) — switching cost compounds over time
3. **Speed-to-normalise** new filings faster than competitors — an operational moat
4. **API lock-in** — once a fintech integrates the data feed, switching cost is high
5. **AI-citation presence** — being the structured source AI answer engines cite
6. **Licence-free neutrality** — a real, durable differentiator against Finder/Canstar-style comparison sites, since staying unlicensed and unranked is a credibility signal for advisers, not just a compliance shortcut

---

## 8. Roadmap

### Phase 1: Foundation (Months 1–3)
- [x] Infrastructure (Vercel, Supabase + PostGIS, Redis) - *Vercel and Neon (Postgres) are set up.*
- [x] Scrapers for ASX prices, filings, announcements - *Prices, announcements, and PDF metric extractors exist.*
- [x] Seed database with 65+ A-REITs, schema built national-first - *Real REITs and 67 national property assets seeded.*
- [x] Comparison table, REIT detail pages, national asset map (Sydney built deepest)
- [ ] Affiliate links live
- [ ] Lawyer's letter confirming the MVP feature set is factual information, not financial product advice
- [ ] Launch MVP publicly

### Phase 2: Growth (Months 4–6)
- [ ] Premium subscription (Stripe)
- [ ] Portfolio tracker with tax-component tracking
- [ ] Advanced alert system
- [ ] REIT Data API — ship no later than month 6
- [ ] Expand geocoded assets past Sydney into 2–3 more capital cities
- [ ] First 100 premium subscribers, first paying API customer

### Phase 3: Scale (Months 7–9)
- [ ] Distribution scenario modelling
- [ ] Community/watchlist sharing
- [ ] Active B2B sales motion: target 5 paying adviser/fintech customers
- [ ] 30,000+ monthly sessions

### Phase 4: Platform (Months 10–12)
- [ ] Property-exposure basket builder (user-parameterized, national)
- [ ] Mobile app (React Native)
- [ ] White-label data widgets for media
- [ ] $9,000–$12,000+ total MRR

---

## 9. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| ASX blocks scraping | Medium | High | Multiple data sources; respectful rate limiting; plan for paid API sources |
| Data inaccuracies | Medium | High | Human validation queue; disclaimers; user reporting |
| Regulatory scrutiny (ASIC) | Low | Critical | Lawyer's letter at month 1; §6.1 pre-publish checklist applied to every new feature, not just launch; standing legal-review relationship rather than one-off sign-off |
| Feature creep back into advice territory | Medium | High | §6.1 checklist is mandatory before any feature ships; product/eng owns enforcement, not just legal |
| Competitor replicates dataset | Medium | Medium | Speed-to-normalise as an operational moat; national scope raises the replication bar vs. Sydney-only |
| AI search cannibalises content traffic | High | High | Tool-first strategy (§0); structured data optimised to be the cited source, not just a clicked link |
| REIT market downturn reduces retail interest | Medium | Medium | B2B/API revenue layer is largely uncorrelated with retail sentiment cycles |
| Affiliate program terms change | Medium | Low | Deliberately de-prioritised revenue stream (§5); diversify across 5+ brokers regardless |
| Technical debt from rapid scraping | High | Medium | Structured logging; documented scrapers from day one |
| Burnout (solo founder) | High | High | Ruthless MVP scoping; automate everything possible; 6-month checkpoint; do not run this alongside another concurrent venture |

---

## 10. Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-09-06 | Scrapped Cadacre in favour of REITCompare | Cleaner wedge, clearer monetisation path, avoids diluting solo-founder focus across two overlapping property ventures |
| 2026-09-06 | National-first data schema, Sydney-first UI build | Avoids a costly re-architecture later; costs nothing extra to do correctly now |
| 2026-09-06 | Tool-first SEO over content-first SEO | Defends against AI-search compression of comparison-content traffic |
| 2026-09-06 | B2B API/data layer pulled forward to Phase 2 | Retail-only monetisation caps this as a lifestyle business; B2B is the actual revenue ceiling |
| 2026-09-06 | No-AFSL made permanent; AFSL/AR pathway removed entirely | Licence-free neutrality is a durable competitive advantage against Finder/Canstar, not just a compliance shortcut; removes ambiguity in feature design going forward |
| 2026-09-06 | "REIT of the Week" replaced with "Filing Spotlight"; "compare with similar" reframed as neutral peer listing | Editorial picks and comparative recommendations are the clearest path into general-advice territory; neutral, criteria-transparent equivalents preserve the engagement value without the licensing risk |
| 2026-09-06 | Distribution forecasting and index-building reframed as user-parameterized models | A platform-generated single-point prediction or platform-selected basket reads as advice; a user-configured calculator with disclosed assumptions does not |

---

*This document is a living specification. Update as product, market, and technical requirements evolve. The §6.1 checklist should be applied retroactively any time this document is revised to add a new feature.*
