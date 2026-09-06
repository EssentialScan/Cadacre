# DESIGN.md — REITCompare
## Premium Product Design System & UX Specification

**Product:** REITCompare  
**Positioning:** The independent data layer for Australian property-backed investing  
**Design direction:** Premium, calm, analytical, modern, trustworthy  
**Theme:** Light mode only  
**Primary goal:** Make complex REIT data feel unusually clear, useful, and satisfying to explore without drifting into financial advice or recommendation design.

---

# 1. Design North Star

REITCompare should feel like a high-end financial data terminal redesigned for normal humans.

The product should communicate:

> **“Serious data, effortless to understand.”**

The visual experience is not a generic fintech dashboard and not a content-heavy finance blog. It is a **tool-first data product** with an editorial level of polish.

The design must consistently balance five qualities:

| Quality | What the user should feel |
|---|---|
| Trust | “These numbers are structured and transparent.” |
| Clarity | “I understand what I am looking at.” |
| Control | “I decide the filters, assumptions and thresholds.” |
| Progress | “I am getting somewhere every time I interact.” |
| Premium | “This is significantly better than a spreadsheet.” |

The interface should make users want to continue exploring because every interaction produces an immediate, understandable response — not because of aggressive gamification, fake urgency, dark patterns, or notification spam.

---

# 2. Core Design Principles

## 2.1 Data First, Decoration Second

Every visual element must earn its space.

Prefer:

- whitespace
- hierarchy
- typography
- restrained colour
- meaningful charts
- high-quality micro-interactions
- contextual explanations

Avoid:

- giant decorative gradients behind every section
- excessive glassmorphism
- oversized dashboard cards
- meaningless illustrations
- visual noise
- glowing neon finance aesthetics

---

## 2.2 Neutrality Must Be Visible

The product's no-AFSL positioning is not only a legal constraint; it should become part of the UX language.

The interface must visually distinguish between:

**Fact**
- `WALE: 4.8 years`
- `NTA discount: 12.4%`
- `Gearing: 37.1%`

and

**User action**
- `Sort by NTA discount`
- `Filter gearing < 40%`
- `Set alert at 15% discount`

The platform must not visually imply:

- “winner”
- “best”
- “buy this”
- “avoid this”
- “recommended”

Do not use badges such as:

- BEST
- TOP PICK
- BUY
- STRONG
- ATTRACTIVE
- UNDERVALUED

Instead use neutral metadata:

- `User filter`
- `Same sector`
- `Latest disclosed`
- `Historical range`
- `User-defined alert`
- `Model assumption`

Design should make the user's control obvious.

---

## 2.3 Progressive Disclosure

REIT data is dense. Do not show every number at once.

Layer the experience:

**Layer 1 — Snapshot**

The user sees the five or six most important facts.

**Layer 2 — Context**

The user reveals historical trends, comparisons and breakdowns.

**Layer 3 — Detail**

The user opens filings, tenant detail, debt maturity, property records and source metadata.

This creates a feeling of depth without creating cognitive overload.

---

## 2.4 Every Interaction Gets a Response

A premium product should feel alive.

When a user:

- changes a filter
- sorts a table
- opens a chart range
- saves a watchlist
- sets an alert
- changes an assumption
- selects a map area

the system should immediately acknowledge the interaction.

Use subtle feedback:

- number transitions
- row highlights
- skeleton-to-content morphs
- chart interpolation
- small checkmarks
- button state transitions
- contextual status text

Avoid unnecessary sound, confetti, flashing, bouncing, or reward loops.

---

# 3. Brand Personality

REITCompare should feel:

**Calm**
- not frantic
- not salesy

**Precise**
- labels have exact meaning
- units are explicit

**Confident**
- strong hierarchy
- decisive typography

**Approachable**
- plain-English explanations

**Technical**
- charts, tables, filters and source trails

**Independent**
- no editorial scoring language

A useful reference mood is:

> Bloomberg-level seriousness + Linear-level product polish + Apple-level visual restraint.

---

# 4. Visual Identity

## 4.1 Colour System

Light mode is mandatory.

Use a warm-neutral white rather than a sterile pure-white canvas.

### Base

```css
--background: #F7F8FA;
--surface: #FFFFFF;
--surface-muted: #F1F3F5;
--surface-hover: #F8FAFC;

--border: #E5E7EB;
--border-strong: #D1D5DB;

--text-primary: #17202A;
--text-secondary: #59636E;
--text-muted: #8A949F;
```

### Primary accent

Use a sophisticated blue-green accent rather than saturated fintech blue.

```css
--accent: #0F766E;
--accent-hover: #0B5F59;
--accent-soft: #E8F5F3;
```

This communicates stability and property/finance without looking like a bank website.

### Semantic colours

```css
--positive: #16805D;
--positive-soft: #EAF7F1;

--negative: #C24141;
--negative-soft: #FCEEEE;

--warning: #B7791F;
--warning-soft: #FFF7E6;

--info: #356AE6;
--info-soft: #EEF3FF;
```

Semantic colours must never be used as a recommendation signal.

For example, a positive historical change may be green, but “green” must never mean “buy.”

---

## 4.2 Colour Usage Rules

Use colour sparingly.

Recommended approximate visual distribution:

- 70% neutral surfaces
- 20% text/borders
- 7% brand accent
- 3% semantic colour

Most screens should look predominantly neutral.

Accent colour is reserved for:

- primary actions
- selected filters
- active navigation
- focus states
- links
- important interaction feedback

---

# 5. Typography

Use a modern, highly legible sans-serif.

Recommended:

**Primary:** Inter  
**Alternative:** Geist Sans

For numerical/tabular data:

**Data:** Geist Mono or tabular-number enabled Inter

Recommended hierarchy:

```text
Display:      48 / 56 / 700
H1:           36 / 44 / 700
H2:           28 / 36 / 650
H3:           20 / 28 / 650
Body:         15 / 24 / 400
Small:        13 / 19 / 400
Micro:        11 / 16 / 600
```

Do not use excessively large headings inside data-heavy screens.

### Numerical styling

Financial numbers should use:

```css
font-variant-numeric: tabular-nums;
```

This keeps columns visually stable when numbers change.

Large metrics should feel engineered:

```text
12.4%
NTA discount
```

rather than:

```text
12.4%
A GREAT OPPORTUNITY
```

---

# 6. Layout System

Use a responsive 12-column grid on desktop.

```text
Desktop max-width: 1440px
Content max-width: 1280px
Wide data max-width: 1380px
Page side padding: 24–40px
Section gap: 48–80px
```

Grid:

```text
12 columns
24px gutters
```

At tablet:

```text
8 columns
20px gutters
```

At mobile:

```text
4 columns
16px gutters
```

Do not constrain data tables to narrow prose widths.

---

# 7. Spacing System

Use a 4px base scale.

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

Preferred rhythm:

- control → label: 6–8px
- card internal spacing: 20–24px
- card → card: 16–24px
- section → section: 56–80px
- page top → first major section: 32–48px

Large whitespace is important to the premium feeling.

---

# 8. Border Radius

Use moderate, consistent rounding.

```text
xs: 6px
sm: 8px
md: 12px
lg: 16px
xl: 20px
pill: 999px
```

Recommended:

- inputs: 10px
- buttons: 10px
- cards: 16px
- major panels: 18–20px
- pills: full radius

Do not make every component excessively rounded.

---

# 9. Elevation

Use shadows very lightly.

Default card:

```css
box-shadow:
  0 1px 2px rgb(15 23 42 / 0.04),
  0 4px 14px rgb(15 23 42 / 0.04);
```

Hover:

```css
box-shadow:
  0 2px 4px rgb(15 23 42 / 0.05),
  0 10px 28px rgb(15 23 42 / 0.07);
```

Avoid large floating shadows.

Borders should carry more visual structure than shadows.

---

# 10. Navigation

## 10.1 Desktop Header

Header should be compact, premium and persistent.

Structure:

```text
[REITCompare]   Explore   Map   Tools   API
                                  Search    Watchlist    [Account]
```

Height:

```text
64–72px
```

Use a white surface with a subtle bottom border.

The brand mark should be text-first, with a restrained geometric icon if one is used.

---

## 10.2 Search

Global search should be prominent.

Placeholder:

> Search REITs, suburbs, tenants or metrics

Keyboard shortcut:

```text
⌘ K / Ctrl K
```

Opening search should use a smooth expansion into a command-palette style panel.

Search results should be grouped:

```text
REITs
Properties
Suburbs
Tenants
Glossary
Tools
```

---

# 11. Homepage Design

The homepage should immediately demonstrate that the product is interactive.

## Hero

Use a two-column desktop layout:

```text
LEFT
Independent REIT data,
made understandable.

Compare Australian REITs,
explore the assets behind them,
and build your own analysis.

[Explore REITs] [Explore the map]

RIGHT
Interactive live data preview
```

Do not use a stock photo hero.

The hero visual should be a miniature, animated product surface:

- metric cards
- tiny chart
- filter chip
- live table row
- subtle map movement

The product itself is the hero.

---

## Homepage trust strip

Immediately below hero:

```text
65+ REITs
1,500+ geocoded assets
National coverage
Factual data only
```

Keep claims factual and update automatically as the dataset changes.

---

## Primary tools

Three large cards:

```text
Compare REITs
Filter and sort public metrics

Explore property
See REIT-owned assets across Australia

Track your portfolio
Monitor holdings, distributions and tax components
```

Cards should have strong iconography and micro-preview content.

---

# 12. Comparison Table

This is a core product surface and should feel extremely polished.

## Header

```text
Compare REITs

[Search] [Sector] [Market cap] [Yield] [Gearing] [+ More filters]

Showing 42 REITs
[Save view]
```

---

## Table design

Use:

- sticky column headers
- horizontal scroll on mobile
- zebra striping only if needed
- subtle row hover
- compact but comfortable row height
- tabular numbers
- clear source/date metadata

Example:

```text
REIT        Sector       Yield      NTA      Gearing     WALE
GPT         Diversified  5.2%       -8.4%    28.7%       5.1y
...
```

Never highlight an item as “winner.”

When the user sorts:

```text
Sorted by: Yield ↓
```

Animate only the changing rows.

---

## Table interaction

On hover:

- row background transitions
- first cell gets a tiny accent indicator
- cursor changes appropriately

On row click:

- preserve table state when navigating back
- open detail page
- show a soft page transition

---

# 13. REIT Detail Page

## Above the fold

```text
[Back to compare]

GPT
GPT REIT

Diversified

Market cap     Yield     NTA premium/discount     Gearing     WALE

$X.XB          5.2%      -8.4%                     28.7%       5.1y

[Add to watchlist] [Set alert]
```

Use a restrained header.

No “bull case,” “bear case,” “our view,” “rating,” or recommendation section.

---

## Detail navigation

Use sticky section navigation:

```text
Overview
Performance
Distributions
Debt
Tenants
Assets
Announcements
Sources
```

This is especially useful on long data pages.

---

## Metric cards

Metric cards should answer:

1. What is the metric?
2. What is its current value?
3. What date does it represent?
4. Where did it come from?
5. What does it mean in plain English?

Example:

```text
WALE
5.1 years
30 Jun 2026

Weighted average lease expiry.

Source: FY2026 report
```

Use a tooltip or disclosure for definitions.

---

# 14. Charts

Charts should be minimal and information-rich.

Recommended:

- Recharts for standard React charts
- lightweight custom SVG for highly interactive microcharts

Chart rules:

- no 3D
- no chartjunk
- no excessive grid lines
- use direct labels where possible
- use consistent axis units
- clearly state date range
- show source/date metadata

Interactive hover state:

```text
30 Jun 2026
NTA: $6.82
```

The tooltip should feel like a precision instrument.

---

# 15. National Asset Map

The map is a signature feature.

Use Mapbox GL JS.

Default view:

```text
Australia
```

Allow the user to zoom into:

- state
- city
- suburb
- individual asset

Asset points should use subtle clustering.

Avoid a noisy wall of pins.

At zoomed-in levels, reveal progressively:

```text
Cluster → Property group → Individual asset
```

Clicking an asset opens an anchored detail panel rather than immediately navigating away.

Example:

```text
123 Example Street
Parramatta NSW

Industrial
Owned by GPT
Acquired: 2022
Book value: $145m

[View property]
```

---

# 16. Map Interaction Psychology

The map should create a sense of discovery.

Use:

- smooth camera transitions
- cluster expansion
- selected-property pulse
- gentle panel slide
- breadcrumbs showing geographic context

Do not use:

- constant map movement
- flashing asset markers
- auto-playing tours
- artificial “hotspot” scores

The feeling should be:

> “There is more structure here than I expected.”

---

# 17. Filtering UX

Filters should feel fast and reversible.

Use compact chips:

```text
Sector: Industrial ×
Yield > 5% ×
Gearing < 40% ×
```

Primary filter control:

```text
[+ Add filter]
```

When a filter is applied:

1. chip appears immediately
2. results update
3. result count animates
4. relevant table values update
5. undo option briefly appears

Example:

```text
42 REITs → 18 REITs
```

Animate the number, not the entire page.

---

# 18. Saved Views

Saved views are a premium-feeling productivity feature.

Example:

```text
My saved views

Industrial
Yield > 5%
Gearing < 40%

Assets in NSW
Sector: Industrial

Income
Distribution yield > 4%
```

Each view should show:

- filter criteria
- last updated
- result count
- rename
- duplicate
- delete

The platform should never create a saved view for the user as a recommendation.

---

# 19. Portfolio Tracker

Premium screen structure:

```text
Portfolio
$184,200

Holdings     8
Yield        5.1%
NTA exposure ...
Distributions ...

[Performance] [Income] [Tax components]
```

The portfolio should feel calm rather than like a trading terminal.

Avoid red/green flashing price movements.

Primary focus:

- portfolio composition
- distributions
- tax components
- user-defined metrics
- historical performance

---

# 20. Alerts

Alert creation should feel like setting a small programmable rule.

Example:

```text
Create alert

WHEN
NTA discount

CROSSES
15%

FOR
GPT

Notify me by
Email ✓
SMS
Webhook

[Create alert]
```

Confirmation:

```text
Alert created
We'll notify you when the condition is met.
```

Never say:

```text
Great choice!
```

Never frame a trigger as an investment signal.

---

# 21. Scenario Modelling

Scenario tools must clearly display assumptions.

Use a split layout:

```text
ASSUMPTIONS             OUTPUT

Lease growth      2%    Base
Occupancy         95%   $X.XX
Rent reviews      ...   Range

                    Downside — $X.XX
                    Base     — $X.XX
                    Upside   — $X.XX
```

Always show:

```text
Model
Uses user-selected assumptions.
Not a prediction or recommendation.
```

Do not make the “base” case visually dominant to the point that it looks like the platform's forecast.

---

# 22. Premium Upgrade Design

Premium conversion should be confident, not manipulative.

Good:

```text
Go deeper with REITCompare Pro

Track your portfolio, save advanced views,
and build multi-condition alerts.

$12/month

[Start Pro]
```

Bad:

```text
ONLY 3 SPOTS LEFT!
```

Never use:

- fake scarcity
- fake countdowns
- obscured cancellation
- pre-selected paid plans
- guilt language
- repeated modal interruptions

---

# 23. Psychology of the Interface

The product should use positive interaction psychology without dark patterns.

## 23.1 Progress

Users should always understand what has changed.

Examples:

```text
42 → 18 results
3 filters active
1 alert created
View saved
Portfolio imported
```

This reinforces a feeling of competence.

---

## 23.2 Agency

Users feel ownership when the system reflects their choices.

Prefer:

```text
Your filters
Your saved view
Your alert
Your assumptions
```

This aligns with the product's factual, user-driven positioning.

---

## 23.3 Curiosity

Use progressive disclosure to create depth.

A metric can invite exploration:

```text
NTA discount
-12.4%
View history →
```

Then:

```text
5-year range
...
```

Then:

```text
Source documents →
```

Each layer answers the next natural question.

---

## 23.4 Completion

Interactions should have satisfying micro-confirmations.

Examples:

```text
✓ Saved
✓ Alert created
✓ Added to watchlist
✓ Filter applied
```

Keep these under approximately 2 seconds unless they are attached to a real async operation.

---

## 23.5 Cognitive Fluency

Use repeated patterns.

Once users understand:

```text
Metric
Value
Date
Definition
Source
```

reuse that structure everywhere.

Consistency lowers cognitive load and makes the product feel trustworthy.

---

# 24. Motion System

Animations should be subtle enough that users barely notice the mechanism, but noticeable enough that the interface feels responsive.

Use Framer Motion / Motion for React.

Recommended timing:

```text
Micro interaction: 120–180ms
Button hover:       150ms
Panel transition:   220–320ms
Page transition:    250–400ms
Chart entrance:     500–800ms
Large map movement: 400–900ms
```

Use easing:

```text
cubic-bezier(0.22, 1, 0.36, 1)
```

This produces a premium, controlled deceleration.

---

# 25. Specific Animations

## 25.1 Button

On hover:

- move up 1px
- subtle shadow increase
- background colour transition

On press:

- scale to ~0.98

Never use large bounce effects.

---

## 25.2 Metric Numbers

When data changes:

- interpolate numerical value
- duration: 300–500ms
- do not flash colour unless semantic context truly requires it

This creates satisfying feedback while preserving readability.

---

## 25.3 Filters

When filter chips appear:

```text
opacity: 0 → 1
scale: 0.96 → 1
width: natural
```

When removed, collapse smoothly rather than disappearing instantly.

---

## 25.4 Table Rows

When sorting/filtering:

- animate layout movement
- avoid re-rendering the whole table visually
- highlight newly visible/changed rows for ~600ms

The animation should explain the data transformation.

---

## 25.5 Cards

On hover:

```text
translateY(-2px)
```

Keep movement subtle.

Cards should feel responsive, not like they are physically bouncing.

---

## 25.6 Page Transitions

Use soft opacity + small vertical movement:

```text
opacity: 0 → 1
y: 6px → 0
```

Avoid large slide transitions that make navigation feel like a mobile app.

---

# 26. Skeleton Loading

Never show a blank page while data loads.

Use skeleton states matching the final geometry.

Example:

```text
████████████
████

████████████
████████████
```

Skeletons should be quiet and low contrast.

Prefer skeleton → actual content morphing over a hard replacement.

---

# 27. Empty States

Empty states are product education moments.

Example:

```text
No REITs match those filters.

Try removing one filter, or broaden the
yield range.

[Clear filters]
```

Do not say:

```text
Oops! Nothing here!
```

The tone should remain professional.

---

# 28. Error States

Errors must be factual and actionable.

Example:

```text
We couldn't load the asset data.

The underlying data service did not respond.

[Retry] [View status]
```

Do not blame the user.

Never hide uncertainty.

---

# 29. Data Freshness

Every material dataset should show freshness.

Examples:

```text
Updated 2 hours ago
```

or

```text
As disclosed: 30 Jun 2026
```

For stale information:

```text
Last available disclosure:
31 Mar 2026
```

This is a core trust feature.

---

# 30. Sources & Provenance

Data provenance should be easy to inspect.

Every important metric should provide a source trail.

Example:

```text
Source
FY2026 Annual Report
Published 14 Aug 2026

[Open disclosure]
```

For derived calculations:

```text
Calculated from:
Market price
NTA per security

Methodology →
```

This is particularly important for professional/B2B users.

---

# 31. Glossary UX

Glossary definitions should appear contextually.

Click/hover on:

```text
WALE ?
```

opens:

```text
Weighted Average Lease Expiry

The weighted average remaining term
of leases across the portfolio.

[Read full definition]
```

Do not force users to leave the current page.

---

# 32. Responsive Design

## Desktop

Optimise for:

```text
1280–1600px
```

Use multi-column layouts and dense data tables.

## Tablet

Collapse secondary navigation and allow horizontal data interaction.

## Mobile

The mobile experience must be a real product, not simply a shrunk desktop.

Prioritise:

1. search
2. key metrics
3. filters
4. short tables/cards
5. charts
6. map

For dense comparison tables, switch to stacked cards.

Example:

```text
GPT

Yield       5.2%
Gearing     28.7%
WALE        5.1y
NTA         -8.4%

[View details]
```

---

# 33. Accessibility

Target WCAG 2.2 AA.

Requirements:

- keyboard navigable controls
- visible focus indicators
- semantic HTML
- sufficient colour contrast
- ARIA only where necessary
- motion reduction support
- accessible table headings
- chart summaries for screen readers
- no meaning conveyed by colour alone

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

In reduced-motion mode:

- remove nonessential transitions
- disable animated number interpolation
- disable page transitions
- preserve functional state changes

---

# 34. Interaction Components

Preferred component set:

### Navigation

- Header
- Command Search
- Breadcrumbs
- Tabs
- Section Nav

### Data

- Metric Card
- Data Table
- Data Row
- Sparkline
- Chart Card
- Source Badge
- Freshness Indicator

### Controls

- Button
- Input
- Select
- Multi-select
- Slider
- Date range
- Filter Chip
- Toggle
- Segmented Control

### Feedback

- Toast
- Tooltip
- Popover
- Dialog
- Skeleton
- Empty State
- Error State

### Product

- Watchlist Button
- Alert Builder
- Saved View
- Asset Card
- Map Detail Panel
- Scenario Control
- Upgrade Panel

---

# 35. Recommended Third-Party Packages

The existing architecture allows several premium UX libraries.

Recommended:

```text
Tailwind CSS
shadcn/ui
Radix UI
Motion / Framer Motion
Lucide React
Recharts
Mapbox GL JS
Zustand
TanStack Query
TanStack Table
cmdk
date-fns
nuqs
sonner
```

### Usage guidance

**Radix UI**
Use for accessible primitives:
- dialog
- popover
- dropdown
- tooltip
- tabs

**Motion**
Use for:
- layout transitions
- micro-interactions
- chart entrances
- route transitions

**TanStack Table**
Use for:
- sortable comparison tables
- filtering
- pagination
- column visibility

**cmdk**
Use for the global command/search interface.

**Sonner**
Use for lightweight confirmation toasts.

**Lucide**
Use for consistent interface icons.

Do not install a package merely for visual novelty. Every dependency must solve a real interaction problem.

---

# 36. Iconography

Use Lucide icons.

Icons should be:

- 16px inside controls
- 18–20px in cards
- 24px for major empty states

Avoid mixed icon styles.

Never use icons as decorative noise.

---

# 37. Buttons

## Primary

Used for:

- Explore REITs
- Save view
- Create alert
- Start Pro

Style:

- solid accent
- white text
- 10px radius
- compact but generous horizontal padding

## Secondary

Used for:

- View map
- Learn more
- Open source

Style:

- white/light surface
- border
- dark text

## Tertiary

Used for:

- reset
- back
- metadata

Minimal visual weight.

---

# 38. Forms

Every form field should have:

- visible label
- clear unit
- concise helper text
- validation
- keyboard support

Use inline validation rather than giant error blocks.

Example:

```text
NTA discount threshold
[ 15 ] %

We'll alert you when the user-defined
threshold is crossed.
```

---

# 39. Premium Dashboard Composition

The premium dashboard should use deliberate hierarchy:

```text
┌───────────────────────────────────────────────┐
│ Portfolio                                    │
│ $184,200                    [Add holding]    │
├───────────────────────────────────────────────┤
│ Value       Yield       Distributions        │
│ $184k       5.1%        $7,820               │
├──────────────────────┬────────────────────────┤
│ Performance          │ Income calendar        │
│ chart                │                        │
├──────────────────────┴────────────────────────┤
│ Holdings table                               │
└───────────────────────────────────────────────┘
```

The top of the page should answer:

> “What is happening with my portfolio?”

without telling the user what to do.

---

# 40. B2B / API Experience

The B2B/API area should visually diverge slightly toward developer tooling while retaining the main brand.

Use:

- darker code snippets only inside code blocks if needed
- monospace for API examples
- clean docs navigation
- request/response examples
- schema tables
- endpoint badges

Example:

```text
GET /api/v1/reits

Returns normalised REIT metadata,
metrics and source timestamps.
```

Do not make the whole site developer-dark-mode. The product remains light mode.

---

# 41. Landing Page for API

Positioning:

```text
Australian REIT data,
without the spreadsheet work.

Normalised metrics.
National asset locations.
Structured disclosure data.

[View API docs] [Request access]
```

Show actual response samples.

Trust should come from transparency rather than marketing superlatives.

---

# 42. Motion Do / Don't

## Do

- animate layout changes
- animate meaningful numerical changes
- use subtle hover elevation
- use progressive disclosure
- make loading states graceful
- use camera transitions on maps
- respect reduced-motion settings

## Don't

- autoplay distracting animations
- animate every icon
- use infinite bouncing
- shake controls
- flash warnings
- use confetti for basic actions
- create fake urgency
- hide important information behind motion

---

# 43. Performance Rules

Premium design must also feel fast.

Targets:

```text
LCP < 2.5s
INP < 200ms
CLS < 0.1
```

Design implications:

- avoid shipping giant animation libraries when CSS will work
- lazy-load Mapbox
- virtualise large tables
- defer below-fold charts
- use skeletons
- optimise images
- avoid layout shifts
- keep initial JS lean

For a data-heavy page, visual polish is worthless if the interface feels slow.

---

# 44. SEO / AI-Citation Design

Because the product is tool-first:

Every important tool state should have semantic HTML.

Use:

- real headings
- descriptive page titles
- stable URLs for filter states where useful
- structured metric labels
- schema markup where appropriate
- descriptive definitions
- source timestamps

Avoid rendering critical data exclusively inside canvas/WebGL.

The data itself should remain crawlable where appropriate.

---

# 45. No-AFSL Presentation Rules

The interface must consistently pass the following product-design test:

### Question 1
Does the platform personalise the output using individual circumstances?

If yes, stop and redesign.

### Question 2
Does the platform itself select or rank a security?

If yes, redesign as user-controlled filtering or remove it.

### Question 3
Does UI copy imply “best”, “top”, “recommended”, “avoid”, or similar?

Replace it with the underlying factual metric.

### Question 4
Does a model display assumptions and range?

If not, do not display the output.

### Question 5
Would a reasonable user interpret the page as telling them what to do?

If yes, redesign.

These rules should be reflected in visual design, copy, badges, colour, hierarchy and interaction — not only legal footer text.

---

# 46. Page-Level Disclaimer Treatment

Do not make every page look like a legal document.

Use a compact persistent footer treatment:

```text
REITCompare provides general information and mechanical tools,
not personal financial advice. Data may contain errors or delays.
```

For scenario modelling:

```text
This is a user-parameterised model using stated assumptions.
It is not a prediction or recommendation.
```

For tax component tracking:

```text
Tax information is general in nature and should be checked
against current tax guidance and professional advice.
```

The UI should make disclaimers understandable rather than hiding them in tiny text.

---

# 47. Watchlist Design

Watchlists create recurring utility.

Example:

```text
Watchlist
8 REITs

GPT      Yield 5.2%   NTA -8.4%
VCX      Yield 5.6%   NTA -12.1%
GMG      Yield 3.4%   NTA +...
```

Allow users to:

- add
- remove
- reorder
- add notes
- set alerts

Do not display:

```text
Strongest
Weakest
Best opportunity
```

---

# 48. Data Density Modes

Professional users may want more information.

Offer:

```text
Density
Comfortable
Compact
```

This is a premium-quality productivity feature.

Comfortable:

- more whitespace
- larger rows
- easier scanning

Compact:

- more rows
- tighter spacing
- stronger table utility

---

# 49. Command Palette

`⌘K / Ctrl K`

Example commands:

```text
Search REITs
Search assets
Compare REITs
Open saved view
Create alert
Open map
Open portfolio
Go to API docs
```

Recent actions can appear below, but never show sensitive portfolio information in suggestions if it could create privacy issues.

---

# 50. Microcopy

Preferred tone:

```text
View history
Explore assets
See source
Add filter
Save view
Create alert
Open filing
Learn about WALE
```

Avoid:

```text
Crush the market
Find the winner
Best REITs
Don't miss this
Act now
Huge opportunity
```

The product should sound intelligent rather than promotional.

---

# 51. Trust Signals

Use quiet trust markers:

```text
Source: FY2026 Annual Report
Updated: 2h ago
Coverage: Australia
Methodology
```

A user should always be able to answer:

> Where did this number come from?

and:

> When was it last updated?

---

# 52. Visual Hierarchy Rules

On any screen, users should be able to identify within approximately one second:

1. Where am I?
2. What am I looking at?
3. What can I do?
4. What changed?
5. Where did this data come from?

If these answers are unclear, reduce decoration and strengthen hierarchy.

---

# 53. Design QA Checklist

Before shipping a screen:

### Visual

- [ ] Light mode only
- [ ] Consistent spacing scale
- [ ] No visual clutter
- [ ] Strong typography hierarchy
- [ ] Accent colour used sparingly
- [ ] No unnecessary gradients
- [ ] No decorative dashboard noise

### Interaction

- [ ] Buttons have clear states
- [ ] Filters are reversible
- [ ] Loading state exists
- [ ] Empty state exists
- [ ] Error state exists
- [ ] Success feedback exists
- [ ] Motion is subtle
- [ ] Reduced motion supported

### Trust

- [ ] Data freshness shown where relevant
- [ ] Sources discoverable
- [ ] Definitions available
- [ ] Derived values explain methodology
- [ ] No recommendation language

### Compliance

- [ ] User controls filters/parameters
- [ ] Platform does not rank securities
- [ ] No personalised recommendations
- [ ] Forecasts show assumptions/ranges
- [ ] No “buy/hold/sell” framing

### Responsive

- [ ] Desktop tested
- [ ] Tablet tested
- [ ] Mobile tested
- [ ] Table overflow handled
- [ ] Map usable on touch
- [ ] Touch targets at least 44px

### Accessibility

- [ ] Keyboard navigation
- [ ] Focus states
- [ ] Colour contrast
- [ ] Semantic headings
- [ ] Accessible labels
- [ ] Reduced motion

---

# 54. Recommended Frontend File Structure

```text
src/
  app/
    page.tsx
    compare/
    reits/
    map/
    portfolio/
    alerts/
    tools/
    api/

  components/
    ui/
    navigation/
    data/
    charts/
    map/
    filters/
    portfolio/
    alerts/
    marketing/

  design/
    tokens.ts
    motion.ts
    chart-theme.ts
    table-theme.ts

  lib/
    analytics/
    formatting/
    compliance/
    data/

  styles/
    globals.css
```

Design tokens should be centralised rather than duplicated across components.

---

# 55. Design Token Example

```ts
export const motion = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  chart: 0.65,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

export const shadow = {
  card: "0 1px 2px rgb(15 23 42 / 0.04), 0 4px 14px rgb(15 23 42 / 0.04)",
  hover: "0 2px 4px rgb(15 23 42 / 0.05), 0 10px 28px rgb(15 23 42 / 0.07)",
};
```

---

# 56. Analytics for UX Improvement

Measure behaviour without turning the product into a gambling loop.

Track:

```text
filter_applied
comparison_sorted
reIT_opened
asset_opened
source_opened
watchlist_added
alert_created
saved_view_created
portfolio_imported
upgrade_viewed
upgrade_started
```

Important UX metric:

**Weekly Active Tool Sessions**

The design should optimise for meaningful tool use, not raw pageviews.

---

# 57. The “Premium Feel” Test

A new visitor should perceive three things quickly:

### Within 1 second

“This looks credible.”

### Within 5 seconds

“I can see useful REIT data immediately.”

### Within 30 seconds

“I understand how to explore it myself.”

### Within 2 minutes

“This is substantially easier than doing this in a spreadsheet.”

That is the standard.

---

# 58. Final Design Direction

REITCompare should not look like:

- a crypto dashboard
- a generic SaaS admin template
- a brokerage trading screen
- a finance blog
- a glossy marketing landing page
- an over-animated consumer app

It should look like:

> **A premium, independent Australian property-data instrument.**

The user's mental model should be:

```text
I choose the question.
REITCompare gives me the data.
I can inspect the method.
I can inspect the source.
I decide what it means.
```

That is the visual expression of the product's central strategic advantage:

**neutral, transparent, user-controlled data tooling.**
