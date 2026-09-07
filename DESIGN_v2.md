# DESIGN.md — REITCompare
## Real Estate SaaS Marketing & Product Design Specification

**Product:** REITCompare  
**Category:** Australian REIT / property-data intelligence SaaS  
**Theme:** Light mode  
**Design standard:** Premium, legitimate, established SaaS  
**Primary reference direction:** High-end real estate SaaS websites with strong product storytelling, restrained motion, real customer/product proof, editorial photography, clear information architecture, and deliberate section hierarchy.

---

# 0. DESIGN OBJECTIVE

REITCompare should look like a **real, established property technology company**, not a startup landing page assembled from generic UI patterns.

The attached real-estate SaaS references demonstrate the design language to learn from:

- strong opening statement
- confident editorial photography
- restrained colour systems
- clear product demonstrations
- large but controlled typography
- substantial whitespace
- sections with different visual identities
- real product proof
- customer/market credibility
- focused calls to action
- simple navigation
- subtle but purposeful motion
- strong dark/light contrast used selectively
- polished footer and enterprise-style information architecture

Do not copy any specific company's branding, assets, copy, layout, iconography, colour system, logos, testimonials, or exact compositions.

Instead, extract the underlying design principles and apply them to REITCompare.

The desired impression is:

> **“This looks like a legitimate property-data company that has been building this product for years.”**

Not:

> “This looks like a beautifully generated startup page.”

---

# 1. DESIGN PHILOSOPHY

## 1.1 Confidence Over Decoration

The page should feel confident enough to avoid excessive visual effects.

The strongest visual devices should be:

- typography
- photography
- actual product interfaces
- product scale
- whitespace
- section composition
- restrained colour
- information hierarchy

Not:

- floating 3D blobs
- random gradients
- excessive glassmorphism
- particle backgrounds
- decorative AI artwork
- continuous parallax
- large animated spheres

---

## 1.2 Product-Led Storytelling

The marketing page should demonstrate the product.

The generated images provide atmosphere and editorial context.

Real React UI provides proof.

For REITCompare:

```text
Generated imagery
= brand + property + atmosphere

Real UI
= product + credibility + conversion
```

This distinction is mandatory.

---

## 1.3 Real Estate SaaS, Not Fintech Trading

Avoid the visual language of:

- brokerages
- crypto exchanges
- trading terminals
- stock-market gambling interfaces
- dark finance dashboards

Instead use:

- property photography
- maps
- documents
- asset records
- financial metrics
- data tables
- portfolio utilities
- professional software UI

The product is property-data intelligence.

---

# 2. WHAT MAKES THE ATTACHED REFERENCES FEEL LEGITIMATE

The references do not try to make every section visually spectacular.

Instead they establish:

## Large visual chapters

A major image or product surface gets room to breathe.

## Consistent typography

The hierarchy remains strong throughout the page.

## Clear product proof

The user sees actual software.

## Distinct section rhythms

The next section feels meaningfully different from the previous one.

## Enterprise confidence

Navigation, footer, CTA, product structure and content all feel intentional.

## Real-world context

Photography and property imagery make the technology feel connected to an actual industry.

REITCompare should adopt these conventions.

---

# 3. TARGET BRAND FEEL

The product should feel:

**Established**  
Not experimental.

**Premium**  
Not luxurious for the sake of luxury.

**Professional**  
Not corporate or sterile.

**Modern**  
Not trend-driven.

**Property-native**  
Not generic financial software.

**Data-rich**  
Not intimidating.

**Independent**  
Not promotional or advisory.

---

# 4. VISUAL SYSTEM

## 4.1 Base Palette

```css
--background: #F7F8FA;
--surface: #FFFFFF;
--surface-soft: #F1F3F5;

--text-primary: #17202A;
--text-secondary: #59636E;
--text-muted: #8A949F;

--border: #E3E7EB;
--border-strong: #D2D8DE;

--brand: #0F766E;
--brand-dark: #0B5F59;
--brand-soft: #EAF5F3;
```

Optional secondary information colour:

```css
--blue: #315FD4;
```

Use blue sparingly.

---

## 4.2 Colour Ratio

Target approximately:

```text
75% neutral
18% dark text/borders
5% brand colour
2% semantic colours
```

Do not build the page around a giant brand gradient.

---

# 5. TYPOGRAPHY

Recommended:

**Inter** or **Geist Sans**

Data:

**Geist Mono** or tabular Inter.

Use:

```css
font-variant-numeric: tabular-nums;
```

Hierarchy:

```text
Hero:              56–76px
Major statements:  48–72px
Editorial text:    40–56px
Section heading:   30–44px
Body:              16–18px
Meta:              12–14px
```

The reference websites use large headlines only at intentional moments.

Do not make every heading giant.

---

# 6. LAYOUT PRINCIPLES

Use a modular grid but allow major visual sections to break outside it.

```text
Standard content: 1180–1240px
Wide product:     1280–1380px
Immersive visual: 1400px+
Long-form text:   720–860px
```

The page should not feel constrained to a single centered column.

---

# 7. NAVIGATION

Simplify the marketing navigation.

Preferred:

```text
REITCompare

Compare
Map
Tools
API

                          Search
                          Log in
                          [Explore REITs]
```

Do not expose every authenticated product destination.

Portfolio and Alerts can live inside the application after login.

The marketing header should communicate:

> “This company knows its core product.”

Header height:

```text
68–72px
```

Use a subtle sticky state.

At top:

```text
background: transparent / near-white
```

On scroll:

```css
background: rgba(255,255,255,0.90);
backdrop-filter: blur(14px);
border-bottom: 1px solid rgba(23,32,42,0.08);
```

---

# 8. HERO DESIGN

The reference style suggests that the hero should be confident and visual rather than overloaded.

Use the current REITCompare direction:

> **See what Australian REITs actually own.**

Supporting copy:

> Compare A-REIT metrics, explore the properties behind them, and build your own analysis from structured public data.

CTA:

```text
Explore REITs
Explore the map
```

Supporting trust facts:

```text
65+ REITs
1,500+ mapped assets
National coverage
```

---

# 9. HERO COMPOSITION

Do not create a generic 50/50 SaaS hero.

Preferred composition:

```text
LEFT
eyebrow
large headline
supporting copy
CTA

RIGHT
large Australian property/data visual
```

But the right-hand visual should be substantially larger than a normal card.

Allow it to bleed toward the right edge.

The page should feel intentionally composed.

---

# 10. HERO ART DIRECTION

The generated Australian property visual should behave like **editorial campaign photography**.

Do not treat it as:

```text
<img>
```

inside a standard card.

Treat it as:

```text
hero visual
```

with:

- intentional crop
- subtle border
- subtle shadow
- controlled radius
- slight depth
- lots of surrounding whitespace

One small data panel is enough.

Do not stack UI cards all over it.

---

# 11. HERO MOTION

Keep motion extremely restrained.

Allowed:

- soft image reveal
- small atmospheric movement
- tiny status indicator pulse
- 6–10px scroll parallax
- CTA hover lift

Avoid:

- constant particle animation
- big moving gradients
- strong mouse parallax
- exaggerated 3D
- looping UI animations

The reference style is confident because it does not need constant motion.

---

# 12. FIRST VISUAL TRANSITION

Do not go directly from hero into another card-based section.

Create a visual pause.

Example:

```text
65+ REITs.
Thousands of properties.
One place to understand them.
```

Use strong typography and significant whitespace.

This gives the page editorial confidence.

---

# 13. PROBLEM SECTION

Use the annual-report/document image here.

Do not place it inside a generic card.

Treat it like an editorial composition inspired by premium property SaaS marketing:

```text
left: copy
right: large visual
```

but allow the visual to overlap or extend beyond the grid.

Copy:

> The data exists.  
> Finding it shouldn't be this hard.

Then three concise points:

```text
Annual reports
Important metrics buried across long disclosures.

Property records
The physical assets are difficult to connect to the numbers.

Spreadsheets
Comparison often requires manual collection and calculation.
```

No excessive body copy.

---

# 14. EDITORIAL IMAGE TREATMENT

Generated imagery should not always have:

```text
border-radius
box-shadow
card border
```

Rotate between:

### Treatment A
Framed product surface

### Treatment B
Large editorial image

### Treatment C
Edge-to-edge visual

### Treatment D
Image with overlapping metadata panel

This is critical to avoiding a templated feel.

---

# 15. PRODUCT DEMONSTRATION

The next major chapter should be the product.

Use:

> **From raw disclosures to useful answers.**

The actual comparison interface should become a major visual object.

Do not present a tiny screenshot.

Make it approximately:

```text
80–90% of viewport width
```

inside a wide product stage.

The product itself should be crisp and real.

---

# 16. PRODUCT STAGE

Use:

```text
background: #FFFFFF
border: 1px solid #E3E7EB
border-radius: 16–20px
box-shadow: 0 12px 40px rgba(15,23,42,.06);
```

Avoid excessive glassmorphism.

---

# 17. PRODUCT DEMO INTERACTION

Create an authored interaction sequence.

On entering viewport:

```text
table visible
↓
filter selected
↓
result count updates
↓
rows rearrange
↓
metric detail opens
```

Run once.

Do not loop continuously.

The animation communicates:

> “This is real software.”

---

# 18. PRODUCT TABS

Use:

```text
Compare
Map
Portfolio
Alerts
```

Tabs should be clean and understated.

Active state:

- dark text
- thin accent line
- subtle background

Do not use bright filled pills everywhere.

---

# 19. MAP AS A MAJOR VISUAL CHAPTER

The Australia asset map should be one of the strongest sections.

Do not place it in a small card.

Create an immersive map environment.

Recommended height:

```text
720–900px desktop
```

Use the generated map visual as the reference for the actual Mapbox experience.

---

# 20. MAP COMPOSITION

Possible layout:

```text
small eyebrow

See the property
behind the ticker.

short copy

        ┌──────────────────────────────┐
        │                              │
        │       LARGE AUSTRALIA MAP    │
        │                              │
        └──────────────────────────────┘
```

The map should visually dominate.

Copy should not obstruct important map areas.

---

# 21. MAP INTERACTION

Actual Mapbox experience:

- clustered markers
- smooth geographic zoom
- selected asset
- property card
- filters
- state/suburb exploration

The interface should communicate discovery.

Never use map colour to imply:

- better
- worse
- attractive
- avoid

---

# 22. PROPERTY PHOTOGRAPHY SECTION

After the immersive map, deliberately become quieter.

Use the property image as a large editorial photograph.

Headline:

> **Understand the asset, not just the numbers.**

This section should have more visual breathing room.

Do not add a grid of feature cards underneath.

---

# 23. PROPERTY PHOTO TREATMENT

Use a wide image with:

- architectural crop
- minimal border
- subtle shadow
- large but controlled corner radius

Optional metadata overlay:

```text
PROPERTY
Industrial

LOCATION
Parramatta NSW

SOURCE
Public disclosure
```

Only one overlay.

---

# 24. DATA TRANSPARENCY SECTION

Use:

> **Every number should have a story.**

This section should feel like information design.

Show:

```text
WALE
5.1 years

30 Jun 2026
```

Then:

```text
Source
FY2026 Annual Report
```

Then:

```text
Methodology
```

Create a subtle visual relationship between these.

This is a better trust signal than generic badges.

---

# 25. LARGE STATISTIC

The references use large statistics as visual anchors.

REITCompare should have one or two.

Primary:

```text
65+
```

Then:

```text
REITs mapped to the source.
```

Use:

```text
120–180px
```

on desktop.

The number should feel editorial, not promotional.

Do not animate it like a stock ticker.

---

# 26. DARK INFRASTRUCTURE SECTION

Retain ONE major dark chapter.

Use:

```text
#101820
```

or:

```text
#0F171E
```

This should become the API/data infrastructure section.

The contrast is important because most of the page is light.

---

# 27. API SECTION

Headline:

> **Need the data, not just a dashboard?**

Supporting text should be concise.

Show:

```text
real API endpoint
real code block
real structured response
generated infrastructure visual
```

The image can sit behind the UI.

Do not make it a generic dark tech illustration.

---

# 28. API VISUAL LANGUAGE

Use:

- charcoal
- white
- muted teal
- restrained blue-grey

Avoid:

- neon
- hacker grids
- cyberpunk
- glowing servers
- blockchain visuals
- futuristic city imagery

This is a data infrastructure product.

---

# 29. API ANIMATION

A single scripted flow is enough:

```text
GET /api/v1/reits

request
↓
structured response
↓
complete
```

Use subtle line/typing animation.

Do not continually re-run it.

---

# 30. TRUST / LEGITIMACY SECTION

The property SaaS references use customer proof and market credibility.

REITCompare should NOT invent testimonials or customer logos.

Until real customer proof exists, use:

```text
Source transparency
National coverage
65+ REITs
1,500+ assets
Structured data
Methodology
```

This gives the page legitimacy without fabricated social proof.

Once genuine customer evidence exists, introduce a real:

```text
Customer voices
Customer logos
Case studies
```

section.

---

# 31. “BUILT DIFFERENTLY” SECTION

Use three core principles:

```text
01
Tool-first

02
Transparent

03
Independent
```

Make the numbers large and quiet.

The typography should carry the section.

Avoid three identical icon cards.

---

# 32. FAQ

Keep FAQ highly functional.

Recommended width:

```text
760–860px
```

No giant illustration.

No decorative card grid.

Interaction:

```text
+
→
×
```

with a 220–280ms transition.

---

# 33. FINAL CTA

The references finish with a confident, simple CTA.

REITCompare:

> **Start with the data.**

Supporting:

> Explore Australian REITs, properties and metrics in one place.

CTA:

```text
Explore REITs
```

Secondary:

```text
Explore the map
```

The CTA should feel like the natural conclusion of the story.

---

# 34. FINAL CTA BACKGROUND

Do not use another photograph.

Use:

- soft white
- barely visible warm/teal atmosphere
- perhaps very subtle architectural lines

The effect should be quiet.

---

# 35. FOOTER

The footer should look like a legitimate SaaS company.

Columns:

```text
Product
Compare
Map
Tools
Portfolio
Alerts

Resources
Glossary
Methodology
API
Filing Spotlight

Company
About
Contact

Legal
Terms
Privacy
Disclosures
```

Do not over-design the footer.

---

# 36. SECTION RHYTHM

The final page should have deliberate visual rhythm.

Recommended:

```text
HERO
light, editorial, photographic

↓

EDITORIAL PROBLEM
warm, document-focused

↓

LARGE TYPOGRAPHIC STATEMENT
quiet, oversized

↓

PRODUCT SHOWCASE
high-density software

↓

MAP
immersive, large

↓

PROPERTY
photographic, quiet

↓

TRANSPARENCY
information design

↓

65+
typographic anchor

↓

API
dark, technical

↓

BUILT DIFFERENTLY
white, manifesto

↓

FAQ
quiet

↓

CTA
soft atmospheric

↓

FOOTER
minimal
```

Do not allow two or three consecutive sections to use the same composition.

---

# 37. SECTION BACKGROUND STRATEGY

Use contrast, not constant gradients.

Recommended:

```text
Hero:           #F7F8FA
Problem:        warm near-white
Statement:      #F5F7F8
Product:        #FFFFFF
Map:            #F2F5F5
Property:       #FFFFFF
Transparency:   #F7F8FA
65+:            #FFFFFF
API:            #101820
Principles:     #FFFFFF
FAQ:            #F7F8FA
CTA:            #FFFFFF
Footer:         #F5F7F8
```

This creates visual chapters.

---

# 38. GRADIENT POLICY

Gradients may exist, but they must never become the main design.

Use:

- one soft hero atmosphere
- one soft map atmosphere
- one dark API atmosphere
- one soft CTA atmosphere

Everything else should remain largely neutral.

Avoid the previous “moving coloured background” look becoming a permanent visual motif.

The goal is legitimacy.

---

# 39. MOTION SYSTEM

Motion should feel like premium product design.

Use:

```text
micro interaction: 120–180ms
normal transition: 200–320ms
section reveal:    450–700ms
ambient:           20–50s
```

Do not animate everything.

---

# 40. MOTION SHOULD EXPLAIN PRODUCT BEHAVIOUR

Good:

```text
filter changes
table updates
map zooms
source connects
API responds
```

Bad:

```text
random particles
floating blobs
constant image zooms
bouncing icons
animated gradients everywhere
```

The best animation is product explanation.

---

# 41. SCROLL REVEALS

Use subtle reveal animations.

Default:

```text
opacity: 0
transform: translateY(12px)
```

to:

```text
opacity: 1
transform: translateY(0)
```

Do not use dramatic stagger sequences.

The entire section should feel like it arrived intentionally.

---

# 42. HOVER SYSTEM

### Buttons

1px lift + subtle shadow.

### Product UI

small border emphasis.

### Images

maximum 1–1.5% scale.

### Links

subtle colour/underline transition.

### Map

actual data interaction.

Do not make everything move.

---

# 43. REMOVE EXCESSIVE ROUNDING

The current aesthetic risks looking over-generated if everything is rounded.

Use:

```text
Controls: 8–10px
Cards: 12–16px
Major panels: 16–20px
Images: 16–20px
```

Do not use 28–32px radius universally.

---

# 44. SHADOW SYSTEM

Prefer borders first.

Default:

```css
box-shadow:
0 4px 18px rgba(15,23,42,.04);
```

Major product surface:

```css
box-shadow:
0 12px 40px rgba(15,23,42,.06);
```

Avoid floating-everything visuals.

---

# 45. ICONOGRAPHY

Use Lucide.

Icons should be:

- consistent
- minimal
- functional

No emojis.

Do not use icon grids as filler.

---

# 46. BUTTON SYSTEM

Primary:

```text
Explore REITs
```

Filled brand colour.

Secondary:

```text
Explore the map
```

White with subtle border.

Do not make five different CTA styles.

---

# 47. MICROCOPY

Preferred:

```text
Explore
Compare
View source
See history
Open filing
Create alert
Save view
Explore assets
View methodology
```

Avoid:

```text
Find the winner
Beat the market
Don't miss out
Act now
Best REIT
Top pick
Huge opportunity
```

The product is factual and user-controlled.

---

# 48. CONTENT DENSITY

Avoid both extremes:

Too much:

```text
large text
large paragraph
large paragraph
large paragraph
```

Too little:

```text
tiny heading
tiny copy
huge empty space
```

Every section should have a clear information payload.

Use concise copy.

---

# 49. REAL ESTATE VISUAL LANGUAGE

The visual world should subtly communicate:

- commercial property
- urban development
- logistics
- office
- retail
- geography
- documents
- asset ownership
- financial structure

Avoid cliché residential real estate imagery:

- suburban homes
- keys
- “sold” signs
- smiling agents
- couple holding house key

REITCompare is commercial/property-data infrastructure.

---

# 50. AUTHENTICITY RULE

Do not make the product look more technologically sophisticated than it actually is.

For example:

If the real product uses a table, show a table.

If the map is Mapbox, show a map.

If data is sourced from filings, show source information.

Do not create fake holographic interfaces that the product cannot actually deliver.

---

# 51. PRODUCT / IMAGE RELATIONSHIP

Generated images should provide emotional context.

Real UI provides functional proof.

Example:

```text
PROPERTY PHOTOGRAPH
+
actual asset metadata UI
```

This feels stronger than either alone.

---

# 52. RESPONSIVE DESIGN

Desktop is the flagship presentation.

Tablet should preserve hierarchy.

Mobile should be deliberately composed.

Do not shrink desktop sections until they become tiny.

### Mobile hero

```text
headline
copy
CTA
trust metrics
hero visual
```

### Mobile product

Full-width UI with horizontal interactions.

### Mobile map

Large focused map viewport.

### Mobile property

image above text.

### Mobile API

code below copy.

---

# 53. MOBILE VISUAL SIMPLICITY

On mobile:

- remove complex decorative effects
- reduce gradient intensity
- no mouse interaction
- reduce parallax
- preserve section contrast
- keep typography strong

The page should feel like an excellent mobile site, not a compressed desktop.

---

# 54. ACCESSIBILITY

Target WCAG 2.2 AA.

Required:

- semantic HTML
- visible focus
- keyboard navigation
- accessible buttons
- accessible table headings
- chart summaries
- sufficient contrast
- reduced motion
- minimum 44px touch targets

Support:

```css
@media (prefers-reduced-motion: reduce)
```

---

# 55. PERFORMANCE

Targets:

```text
LCP < 2.5s
INP < 200ms
CLS < 0.1
```

Use:

- AVIF/WebP
- responsive image sizes
- lazy loading
- real UI instead of image-heavy screenshots
- lazy-loaded Mapbox
- efficient Motion usage

Do not use background video.

---

# 56. TECH STACK

Recommended:

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Radix UI
Motion
Lucide React
Recharts
Mapbox GL JS
TanStack Table
TanStack Query
cmdk
sonner
```

Only introduce a dependency when it solves a genuine product or interaction problem.

---

# 57. COMPONENT ARCHITECTURE

```text
components/
  marketing/
    Header
    Hero
    EditorialSection
    ProductShowcase
    MapSection
    PropertySection
    TransparencySection
    StatisticSection
    ApiSection
    PrinciplesSection
    FAQ
    FinalCTA
    Footer

  product/
    ComparisonTable
    Map
    Portfolio
    AlertBuilder
    MetricCard
    SourcePanel

  ambient/
    AmbientGradient
    ArchitecturalTexture
    ContourLines
```

Keep the marketing layer separate from actual product components.

---

# 58. NO-AFSL VISUAL LANGUAGE

The interface must make user agency visually obvious.

The platform presents:

```text
facts
data
sources
calculations
user-selected filters
user-selected assumptions
```

The platform must not visually imply:

```text
best
winner
recommended
avoid
buy
sell
```

This applies to:

- badges
- colours
- hierarchy
- cards
- headlines
- CTA copy
- sorting defaults
- visual emphasis

---

# 59. SOURCE / PROVENANCE DESIGN

For important metrics use a consistent pattern:

```text
METRIC
5.1 years

As disclosed:
30 Jun 2026

Source:
FY2026 Annual Report

Methodology →
```

This pattern should become a recognizable REITCompare design element.

---

# 60. TRUST WITHOUT FAKE SOCIAL PROOF

Before real customer evidence exists:

Do not create:

- fake testimonials
- fake logos
- invented customer counts
- fake awards

Instead emphasise:

- actual data coverage
- source transparency
- methodology
- product screenshots
- real functionality
- national scope

This is much more credible.

---

# 61. MARKETING COPY STYLE

Use concise, confident, specific language.

Examples:

> See what Australian REITs actually own.

> From raw disclosures to useful answers.

> See the property behind the ticker.

> Understand the asset, not just the numbers.

> Every number should have a story.

> Need the data, not just a dashboard?

These lines feel like product positioning rather than generic startup slogans.

---

# 62. SEO WITHOUT CONTENT FARMING

Use:

- semantic headings
- structured data
- descriptive page titles
- stable URLs
- crawlable product information
- source/methodology content

The page should support the tool-first SEO strategy.

Do not turn the landing page into an article.

---

# 63. CONVERSION STRATEGY

The visitor journey should be:

```text
ATTENTION
See a high-quality product.

↓

CLARITY
Understand what it does.

↓

PROOF
See the real interface.

↓

DISCOVERY
Explore the map and property layer.

↓

TRUST
See sources and methodology.

↓

UTILITY
Understand portfolio/tools/API.

↓

ACTION
Explore the product.
```

Conversion should emerge naturally from demonstrated utility.

---

# 64. PRIMARY CTA HIERARCHY

Primary throughout public site:

```text
Explore REITs
```

Secondary:

```text
Explore the map
```

Premium:

```text
Start Pro
```

B2B:

```text
Explore API
```

Keep the hierarchy consistent.

---

# 65. PAGE LENGTH

The page can be long, but it should never feel repetitive.

Long-form SaaS pages work when each section answers a new question.

Use:

```text
short section
large section
short section
immersive section
editorial section
data section
dark section
short section
```

Do not make every section equally tall.

---

# 66. VISUAL ANCHORS

The visitor should remember these four things:

### 1. Hero
Australian property + REIT data.

### 2. Product
Actual comparison tool.

### 3. Map
National property intelligence.

### 4. Dark API section
Underlying data infrastructure.

Everything else reinforces those anchors.

---

# 67. DESIGN QA — “DOES THIS LOOK LEGIT?”

Before shipping, inspect the page at 100% and ask:

### Does the site look like a company?

If it feels like a template, reduce decoration and increase content authority.

### Does the product look real?

If not, replace static screenshots with real UI.

### Does the page have visual peaks?

If not, increase scale selectively.

### Are there too many cards?

If yes, convert some to editorial compositions.

### Is every section equally bright?

If yes, add deliberate contrast.

### Is animation doing too much?

If yes, remove half of it.

### Is the page trying too hard?

If yes, simplify.

---

# 68. DO NOT COPY THE REFERENCES

Use the attached real-estate SaaS references only for their design principles.

Do NOT reproduce:

- their branding
- navigation arrangement exactly
- colour palettes exactly
- logos
- typography pairing exactly
- customer stories
- headlines
- illustrations
- section order exactly
- page-specific graphics

REITCompare should feel like the same **quality tier**, not the same website.

---

# 69. FINAL COMPOSITION

The intended experience:

```text
==================================================
HERO
==================================================

Confident statement
+
large Australian property visual
+
subtle atmosphere


==================================================
EDITORIAL PROBLEM
==================================================

Annual reports / fragmented data
+
large document visual


==================================================
TYPOGRAPHIC STATEMENT
==================================================

65+ REITs.
Thousands of properties.
One place to understand them.


==================================================
PRODUCT
==================================================

Actual interactive comparison experience.


==================================================
MAP
==================================================

Immersive Australian property intelligence.


==================================================
PROPERTY
==================================================

Large architectural photograph
+
“Understand the asset...”


==================================================
TRANSPARENCY
==================================================

Metric
→ source
→ methodology


==================================================
STATISTIC
==================================================

65+


==================================================
API
==================================================

Dark infrastructure chapter
+
actual code
+
data visual


==================================================
PRINCIPLES
==================================================

01 Tool-first
02 Transparent
03 Independent


==================================================
FAQ
==================================================

Quiet, spacious, useful.


==================================================
FINAL CTA
==================================================

Start with the data.


==================================================
FOOTER
==================================================

Simple and enterprise-grade.
```

---

# 70. FINAL CREATIVE DIRECTIVE

Build REITCompare as though it is already a **successful Australian property-data SaaS company**.

Do not make it look like a startup trying to convince the visitor that it is impressive.

Make the interface itself prove that.

Use the attached real-estate SaaS references as the standard for:

- professionalism
- hierarchy
- product storytelling
- section composition
- credibility
- visual restraint
- enterprise polish

The page should feel:

> **established, useful, trustworthy and expensive to build.**

The “cool” factor should come from:

**excellent product UI + strong editorial art direction + confident typography + controlled contrast + sophisticated photography + subtle motion.**

Not from:

**gradients + particles + floating cards + excessive animations.**

The ideal result is:

> **A premium real-estate data company website, not a generic SaaS landing page.**

The design system should make the user's mental model:

```text
I can explore.
I can compare.
I can inspect.
I can trace the source.
I can use the tools.
I decide what the data means.
```

That is the visual identity of REITCompare.
