# Cadacre — 30-Day MVP Checklist (Updated)

**Where you actually are right now:** a working front-end prototype (form, filtering logic, ledger-style results, paywall UI) built and reviewed. Nothing is live, no real data, no real payment, no legal docs, zero users. This checklist starts from here, not from zero.

**What's in scope for this 30 days, and what's explicitly NOT:**
- IN: real data, live payment, legal basics, first paying customer, a small manually-curated founding group, one monthly "Rentvestor Index" post
- OUT (not this month): Concierge/referral service, Trust Score algorithms, subscription tier, crowd-sourced yield data — these need real users and real legal review first, not day-30 ambition

---

## Week 1: Make the Prototype Real (Days 1-7)

- [ ] **Day 1:** Pull real data for 40-60 regional towns (median price, gross rental yield, vacancy rate) from ABS and SQM Research's free vacancy data. Replace the sample dataset in the prototype with this real data.
- [ ] **Day 2:** Set up a Stripe account. Create a Stripe Payment Link for the $39 report (no backend code needed) and wire the "Unlock full report" button to it.
- [ ] **Day 3:** Build the actual PDF/report delivery — even a manual process is fine at this stage (Stripe sends you a payment notification, you personally email the buyer a PDF built from their inputs). Automate later.
- [ ] **Day 4:** Draft Terms of Service and Privacy Policy (Claude first draft), including the general-information disclaimer. Get a cheap paid review (Sprintlaw/LawPath) given the property-advice sensitivity.
- [ ] **Day 5:** Buy the domain (`cadacre.com` and/or `.com.au`), deploy the site via Vercel or Netlify.
- [ ] **Day 6:** Set up Plausible or Google Analytics. Set up a simple Mailchimp/ConvertKit form to capture emails from visitors who don't buy yet.
- [ ] **Day 7:** Full end-to-end test yourself: visit the live site, run the survey, hit paywall, pay via Stripe test mode, receive the report. Fix anything broken.

---

## Week 2: First Real Users (Days 8-14)

- [ ] **Day 8:** Switch Stripe to live mode. Soft-launch to your personal network — 15-20 direct messages, not a public post yet.
- [ ] **Day 9:** Personally follow up with everyone who visited but didn't buy. Ask why, directly — this is your most valuable feedback source.
- [ ] **Day 10:** Publish the first free "Rentvestor Index" — a one-page, ungated post (LinkedIn + a relevant Facebook group) naming the top 3 regional towns this month by yield/affordability, with a link to the full tool for a personalized shortlist. This is your cheapest, highest-leverage brand-building move — do it monthly from here on.
- [ ] **Day 11-12:** Post genuinely useful (non-promotional) answers in property investing Facebook groups and r/AusPropertyChat / r/AusFinance threads, linking to the tool only when it's the actual best answer to someone's question.
- [ ] **Day 13:** **Target: first paying customer by this point.**
- [ ] **Day 14:** Review real funnel numbers: visits → survey completions → paywall views → purchases. This tells you exactly where to fix next.

---

## Week 3: Seed a Small Community (Days 15-21)

- [ ] **Day 15:** Set up a free WhatsApp or Discord group. Personally invite every buyer and every engaged waitlist/email signup — frame it as "help me build this with you," not "join our platform."
- [ ] **Day 16-17:** Offer the $39 report free to your first 20-30 group members in exchange for honest feedback and, if they've actually invested, their real outcome (what they bought, what actually happened) — this is how you start building real data, not public ABS numbers, but don't oversell this as a "moat" yet. It's 20 people, not a network effect.
- [ ] **Day 18:** Set clear, simple ground rules for the group from day one: no unsolicited promotion, no buyer's-agent/broker self-promotion without disclosure. You will need to moderate this personally — don't assume automation solves it yet.
- [ ] **Day 19-20:** Have at least 3-5 real conversations with group members about what they actually want next (more towns? financing help? a community meetup?). Let this guide Month 2, not assumptions.
- [ ] **Day 21:** Publish your second "Rentvestor Index" post, referencing one real insight or question from the community if appropriate (with permission).

---

## Week 4: Review and Plan (Days 22-30)

- [ ] **Day 22-24:** Write an honest retrospective: real visitor numbers, real conversion rate, real revenue, real community engagement. No projections — just what happened.
- [ ] **Day 25:** Decide, based on evidence not excitement, whether the core loop (tool → payment → community) is working well enough to invest more time, or needs a real pivot in positioning/pricing/audience.
- [ ] **Day 26-27:** If it's working: identify the single next highest-leverage build for Month 2 (more data sources, automating report delivery, or growing the Index's reach) — pick one, not several.
- [ ] **Day 28:** If a referral/Concierge-style revenue model still appeals to you, this is the point to get a proper legal consultation on it — specifically the buyer's-agent/conveyancer referral fee structure — before building anything, not after.
- [ ] **Day 29-30:** Write your Month 2 plan. Keep it to one primary focus.

---

## Guardrails Worth Repeating

- Never claim a "10/10 business" outcome for anything not yet built or tested — plan for the version that exists, not the aspirational one
- Keep the free Index genuinely free and ungated — its value is in being cited and shared, not converting directly
- Don't build the Concierge/referral revenue model until you've had it reviewed given the regulatory sensitivity of referral fees in conveyancing/buyer's agent services
- Community moderation is your job this month — no algorithm replaces it yet at this size

---

## What "MVP Done" Looks Like on Day 30

A live site with real data, at least one real paying customer, a small (20-50 person) engaged community you've personally onboarded, two published Index posts, and an honest, evidence-based read on whether to keep building.
