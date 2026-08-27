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

**Design tokens (do not deviate without discussion):**
- Ink Navy `#1B2430` — primary dark / headings
- Parchment `#FAF7F0` — primary background
- Survey Brass `#B8894F` — accent, CTAs
- Deep Forest `#2F4538` — secondary accent
- Faded Rule `#C9C2B4` — hairlines, dividers, disabled/locked states
- Charcoal `#2A2A28` — body text

**Typography:**
- Display: **Fraunces** (serif, characterful — used for headlines, section titles, the numeral system in "How it works")
- Body/UI: **IBM Plex Sans**
- Data/figures: **IBM Plex Mono** — all numbers (prices, yields, percentages) should render in mono to reinforce the "recorded, not decorated" feel

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

---

## 6. Current Status Snapshot

- [x] Business concept validated through discussion, not yet through real users
- [x] Name selected: Cadacre (checked for trademark/brand collisions — none found as of naming)
- [x] Design direction and working front-end prototype built (`cadacre.html`)
- [ ] Real ABS/SQM data not yet integrated (placeholder data only)
- [ ] Stripe payment not yet live
- [ ] Terms of Service / Privacy Policy not yet drafted
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
