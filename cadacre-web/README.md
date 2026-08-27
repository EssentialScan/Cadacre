# Cadacre — web app

Next.js (App Router) build of the Cadacre landing page + authenticated
dashboard shell. See [`/AGENTS.md`](../AGENTS.md) at the repo root for the
full product/brand/legal brief this build follows.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4** — brand tokens (Ink Navy / Parchment / Survey Brass /
  Deep Forest / Faded Rule / Charcoal) defined in `src/app/globals.css`
- **Clerk** (`@clerk/nextjs`) — auth, modal sign-in/sign-up, route protection
  via `src/proxy.ts`
- Fonts: Fraunces (display), IBM Plex Sans (body), IBM Plex Mono (figures)

## Local setup

```bash
npm install
```

Copy the env template and fill in your own Clerk keys (get them from
https://dashboard.clerk.com → API Keys, or run `npx clerk@latest init` /
`npx clerk@latest env pull` to provision automatically):

```bash
cp .env.local.example .env.local
```

Then run the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000`. Signing up or logging in redirects to
`/dashboard`, which is protected by Clerk in `src/proxy.ts`.

> A `.env.local` with a real dev Clerk instance was auto-provisioned during
> the initial build via `npx clerk@latest init`. It is **not** committed
> (gitignored) — anyone cloning this repo needs to provide their own keys or
> re-run that command.

## Structure

- `src/app/page.tsx` — landing page (hero, problem, how-it-works, sample
  ledger, pricing, FAQ, final CTA)
- `src/app/dashboard/page.tsx` — protected dashboard shell (survey form is a
  placeholder; the ABS/SQM filtering engine isn't wired up yet)
- `src/components/` — landing page sections + `SiteHeader` (nav + auth
  buttons)
- `src/proxy.ts` — Clerk middleware protecting `/dashboard(.*)`

## What's still placeholder (see `AGENTS.md` Section 6)

- No real ABS/SQM town dataset — the sample ledger on the landing page is
  explicitly labeled illustrative, not live data
- Dashboard survey form doesn't run the filtering engine yet
- No Stripe payment wiring yet — pricing section is UI only
- No Terms of Service / Privacy Policy pages yet (linked in footer, not
  built) — required before real payments per `AGENTS.md` Section 4
