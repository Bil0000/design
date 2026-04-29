# 03 — Clone Engine

The differentiator. Reverse-engineers any public website into a real
design system. 5-step pipeline: FETCH → EXTRACT → REVERSE-ENGINEER →
TOKENIZE → ADAPT. Output is a tokens.json structurally identical to
what module 07 produces, plus a decisions.md explaining every choice.

Modes:
```
--clone   <url>             Full extraction, full token system
--adapt   <url>             Extract structure, swap brand-specific tokens
--inspect <url>             Extract + reverse-engineer only, do not tokenize
--blend   <url1> <url2>     Extract both, merge best decisions
```

Default for `clone <url>` with no flag: --clone.

Inputs: `clone_target.url` from the "What I Know" object (and
`blend_partner_url` if --blend). Outputs: `clone-output.json` written
to `.design-engine/clones/<host>/<timestamp>/` plus a decisions.md.

---

## 1. STEP 1 — FETCH

Goal: collect every artifact the site exposes, in parallel where safe.

### 1.1 Required calls (always)

```
A. web_fetch(<url>)                              raw HTML/CSS/JS index
B. web_fetch(<url>/robots.txt)                   what's allowed + sitemap hint
C. Playwright screenshot of <url> at viewports:
     - 1440 (desktop)
     - 768  (tablet)
     - 375  (mobile)
   Wait for networkidle + 1s for animations to settle.
D. Playwright "computed-styles dump" against the rendered DOM (§2.2).
   Run document.styleSheets traversal + getComputedStyle on the
   sample elements listed in §2.1.
```

### 1.2 Discovery probes (run in parallel, tolerate 404)

For host `<h>`, attempt all of:

```
https://<h>/design
https://<h>/design-system
https://<h>/brand
https://<h>/brand-guidelines
https://<h>/style
https://<h>/styleguide
https://<h>/docs
https://<h>/handbook
https://<h>/fonts
https://<h>/about
https://<h>/changelog
https://<h>/blog                  (typography decisions in long copy)
https://<h>/pricing               (component density signal)
https://<h>/sitemap.xml
```

Any successful response → fetch HTML, run §1.1.D against it. Public
design system sites (`linear.app/design`, `vercel.com/design`) are
gold — extract directly from documented values.

### 1.3 CSS file harvest

From the main HTML response, collect every `<link rel="stylesheet">` and
every inline `<style>` block. For each external sheet, web_fetch the
absolute URL. Keep raw text — module §2 parses it.

### 1.4 Font harvest

Scan HTML + harvested CSS for:

```
<link href="https://fonts.googleapis.com/...">       Google Fonts
<link href="https://use.typekit.net/...">            Adobe Fonts
@font-face { src: url(...) }                         self-hosted
font-family: declarations across the document
```

Fetch the Google Fonts CSS and the @font-face URLs to get exact
filenames, weights, subsets. Note unicode-range to detect language
support.

### 1.5 Anti-scrape handling

If the main fetch returns:

| Failure                              | Response                                     |
|--------------------------------------|----------------------------------------------|
| 403 / Cloudflare challenge           | Retry once via Playwright (real browser).    |
| 429 rate limit                       | Backoff 5s, single retry.                    |
| robots.txt forbids the path          | Stop. Tell user: "<host> disallows scraping. Use --inspect on a public design page or supply screenshots." |
| HTML returned but body has < 200 chars | Site is JS-rendered. Force Playwright path. Wait for `body:has(*)` to be non-empty + networkidle. |
| Cookie / age / region wall           | Tell user. Do not bypass.                    |

### 1.6 JS-rendered sites

If the static HTML is a shell (no real content), default to Playwright
for everything. Use:

```
- waitUntil: 'networkidle'
- additional 1500ms idle for hydration
- scroll to bottom + back to top to trigger lazy CSS
- expand any "view all" / mobile-menu controls before sampling
```

Record `render_mode: ssr | csr | hybrid` in the clone output.

### 1.7 Output of FETCH

```yaml
fetch:
  url:                <string>
  host:               <string>
  fetched_at:         <ISO>
  render_mode:        ssr | csr | hybrid
  status:             ok | partial | blocked
  pages:
    - url:            <string>
      html_chars:     <int>
      stylesheets:    [<absolute url>, ...]
      inline_styles:  <int>
      screenshots:    {1440: <path>, 768: <path>, 375: <path>}
      computed_dump:  <path to .json>
  fonts:
    - family:         <string>
      source:         google | adobe | self-hosted | system
      weights:        [<int>, ...]
      url:            <string | null>
  errors:             [<string>, ...]
```

---

## 2. STEP 2 — EXTRACT RAW VALUES

Goal: pull every concrete CSS value the site uses, untouched.

### 2.1 Sample elements (always)

Run getComputedStyle against — at minimum — these selectors. If a
selector is absent, skip and record absent.

```
DOCUMENT
  :root, html, body

TYPOGRAPHY
  h1, h2, h3, h4, h5, h6
  p, li, blockquote
  small, code, pre, kbd
  a:not([class])              "default" link
  strong, em

INTERACTIVE
  button, button[type="submit"], a.button, [role="button"]
  input[type="text"], input[type="email"], textarea, select
  label
  nav a (top-level)
  [role="tab"], [role="menuitem"]

CONTAINERS / SURFACES
  header, footer, main, section, aside
  [class*="card"], [data-testid*="card"]
  [class*="modal"], [class*="dialog"]
  [class*="popover"], [class*="tooltip"]

DATA DISPLAY
  table, th, td, tr
  [class*="badge"], [class*="tag"]
  [class*="avatar"]

FORM STATES
  :hover variants of buttons + links (synth via Playwright .hover)
  :focus-visible variants
  :disabled variants
```

### 2.2 Properties extracted per element

```
COLOR
  color, background-color, background-image
  border-color (top/right/bottom/left), outline-color
  fill, stroke
  caret-color, accent-color
  text-decoration-color

TYPOGRAPHY
  font-family, font-size, font-weight, font-style
  line-height, letter-spacing, word-spacing
  text-transform, text-decoration, font-feature-settings
  font-variation-settings (variable fonts)

LAYOUT
  display, position
  margin (4 sides), padding (4 sides), gap, row-gap, column-gap
  width, max-width, min-width, height
  flex-direction, justify-content, align-items, flex-wrap
  grid-template-columns, grid-template-rows

VISUAL
  border-width, border-style, border-radius (4 corners)
  outline-width, outline-style, outline-offset
  box-shadow, text-shadow, filter, backdrop-filter
  opacity, mix-blend-mode

MOTION
  transition (property, duration, timing-function, delay)
  animation-* (name, duration, timing-function, delay, iteration)

Z-LAYERS
  z-index
```

### 2.3 :root custom-property capture

From every `:root` (and `html`, `[data-theme="dark"]`, `.dark`, `:root[data-mode]`)
declaration, dump every `--*` custom property. These are the existing
token system (when present) and shortcut the rest of the pipeline
significantly.

### 2.4 Breakpoint detection

Scan harvested CSS for `@media` queries. Record:
```
breakpoints: [<min-width px>, ...]
```
Common signals: 640/768/1024/1280/1536 (Tailwind), 600/900/1200 (Material),
custom values are kept verbatim.

### 2.5 Extraction output

```yaml
extract:
  custom_properties:    {<name>: <value>, ...}
  custom_properties_dark: {<name>: <value>, ...}    # if dark theme detected
  by_selector:
    body:               {<property>: <value>, ...}
    h1:                 {...}
    button:             {...}
    "button:hover":     {...}
    ...
  fonts_declared:       [<family string>, ...]
  breakpoints:          [<int>, ...]
  z_indices:            [<int>, ...]
  raw_color_set:        [<color string>, ...]      # all unique colors found
  raw_font_size_set:    [<size string>, ...]
  raw_radius_set:       [<radius string>, ...]
  raw_shadow_set:       [<shadow string>, ...]
  raw_easing_set:       [<easing string>, ...]
  raw_duration_set:     [<duration string>, ...]
```

Numbers are stored with units intact (px, rem, em, %). Colors are
stored verbatim — conversion to oklch happens in TOKENIZE, not here.

---

## 3. STEP 3 — REVERSE-ENGINEER DECISIONS

The differentiator. Don't copy values; understand why they were chosen.
For every signal in the extract, derive the design decision behind it
and record reasoning. Downstream tokenization fills gaps using the same
reasoning.

### 3.1 Reasoning rules — mapping table

Each rule: signal → decision → why. Apply every rule that matches.
Rules can compound (multiple may fire on the same site).

```
TYPOGRAPHY DENSITY

R-T-01  body font-size = 13px
        → density-first product, data-heavy, power-user audience
        → reduce default spacing scale (use 4px base, not 8)

R-T-02  body font-size = 14px
        → tight productivity tool, prosumer
        → balanced density

R-T-03  body font-size = 16px
        → consumer-grade, accessibility-first
        → standard density (Tailwind defaults work)

R-T-04  body font-size ≥ 18px
        → editorial / marketing-grade reading
        → large spacing scale, heading scale ratio ≥ 1.333

R-T-05  display heading uses font-feature-settings: 'ss01' or 'cv11'
        → premium type stack (Inter/Cal Sans/Söhne territory)
        → unlock variable-weight + tabular-num features

R-T-06  letter-spacing on display headings is negative (≤ -0.02em)
        → tight, confident, post-2020 SaaS
        → mandatory negative tracking on all sizes ≥ 20px

R-T-07  letter-spacing on small caps / labels is positive (≥ 0.04em)
        → enterprise / editorial signal labels
        → adopt for category labels

R-T-08  mono font appears in body, not just code
        → developer tool / terminal-native identity
        → use mono in nav numerals, status pills, IDs

R-T-09  serif font on headings + sans on body
        → editorial or premium consumer
        → adopt the serif for display only, never for UI chrome

COLOR

R-C-01  background = pure #FFFFFF
        → maximum contrast, zero ambiguity (Vercel territory)
        → text = pure black, no warm hint

R-C-02  background = warm off-white (oklch L≈0.98, C 0.005-0.012, H 60-90)
        → approachable, not clinical (Stripe / Notion territory)
        → text gets matching warm tint, not cool grey

R-C-03  background = cool off-white (oklch L≈0.98, C ≤ 0.005, H 220-260)
        → technical / enterprise
        → grey scale tilts cool

R-C-04  dark mode bg = pure #000
        → OLED-aware, contrast-maximal (Vercel dark)
        → all surfaces are borders, not lifts

R-C-05  dark mode bg = oklch L 0.10-0.14, neutral
        → modern saas-dark (Resend / Planetscale / Linear)
        → use border-elevation system, no shadows

R-C-06  one accent hue, used everywhere
        → opinionated, brand-led
        → keep monochrome accent ladder (subtle/default/hover/press)

R-C-07  multi-hue palette (3+ hues, balanced)
        → status-rich product (analytics, dashboards)
        → expand to full status set + chart palette

R-C-08  saturation drops dramatically from 500 to 950 step
        → photorealistic / oklch-aware system
        → tokenize in oklch

R-C-09  AI blue (#6366f1 / #8b5cf6) in primary
        → late-2010s SaaS template
        → flag as anti-pattern, propose distinct accent in adapt mode

SPACING + LAYOUT

R-S-01  padding values cluster on multiples of 4 only
        → 4px base unit
        → token spacing scale 4/8/12/16/24/32/48/64/96/128

R-S-02  padding values cluster on multiples of 8 only
        → 8px base unit (Material territory)
        → token scale starts at 8

R-S-03  consistent gutter across all containers (e.g. 24px everywhere)
        → systematic, opinionated layout
        → enforce same gutter in generated screens

R-S-04  inconsistent gutters (12 / 16 / 20 / 24 mixed)
        → system inconsistency / no token discipline
        → in --clone do not preserve; pick the dominant value

R-S-05  max-width caps at 1280 or 1440
        → desktop-first, web-app
        → desktop breakpoint at 1280, focus there

R-S-06  max-width caps at 768 / 896 (typical text column)
        → editorial / blog territory
        → shorter measure, larger body text

RADIUS + BORDERS

R-R-01  border-radius = 0 everywhere
        → brutalist / ultra-minimal / Vercel territory
        → keep 0 in tokens, no soft surfaces anywhere

R-R-02  border-radius small (4–6px)
        → precise / professional / Linear territory
        → md = 6, no fully-rounded surfaces except avatars

R-R-03  border-radius medium (8–12px)
        → modern saas
        → lg = 12, cards rounded, buttons less

R-R-04  border-radius large (16+ px)
        → consumer / playful / Notion-light territory
        → 2xl = 16, soft surfaces

R-R-05  border-radius full / pill on buttons
        → consumer / marketing
        → unlock pill primary CTA, only there

R-R-06  border-width = 1px almost everywhere
        → standard (every modern system)
        → token: 1px default, 1.5px focus only

R-R-07  border-width = 2px everywhere
        → playful / outlined / brand-statement
        → token: 2px default; expect bolder type

SHADOWS + ELEVATION

R-E-01  multiple shadow declarations using rgba black
        → light-mode shadow system, no dark equivalent
        → in dark mode, replace with border elevation

R-E-02  shadows use HSL with non-black tint (cool blue or warm yellow)
        → premium / hand-tuned shadows
        → preserve tint in token

R-E-03  no box-shadow, only borders
        → flat / Vercel / Linear territory
        → border-elevation system in BOTH modes

R-E-04  layered shadows (3+ stacked) on cards
        → Material territory
        → adopt elevation curve (z=0,1,2,4,8,16,24)

MOTION

R-M-01  transition duration 100–150ms
        → Stripe-territory micro-interaction precision
        → token: fast 100, normal 150

R-M-02  transition duration 200–300ms
        → product UI standard
        → token: slow 250

R-M-03  transition duration ≥ 400ms
        → marketing / hero animation
        → token: deliberate 400, only on first-touch surfaces

R-M-04  cubic-bezier(0, 0, 0.2, 1) (ease-out)
        → entering / appearing motion
        → use for enter

R-M-05  cubic-bezier(0.4, 0, 1, 1) (ease-in)
        → leaving / dismissing motion
        → use for exit

R-M-06  no transitions on interactive elements
        → austere / brutalist
        → respect: no hover transitions in clone, instant state changes

R-M-07  every interactive element transitions transform + opacity
        → animation discipline (Stripe / Linear)
        → enforce GPU-only motion in tokens

DENSITY / IDENTITY (compound)

R-X-01  body 13px + radius ≤ 6 + multi-mode + mono in nav
        → power-user devtool (Linear pattern)
        → set ambition C, density dense, surface web

R-X-02  body 16px + radius 0 + pure black text on white + sans-only
        → Vercel pattern: documentation-grade precision
        → set density balanced, ambition C/D, mode light

R-X-03  body 16px + warm off-white bg + serif headings
        → Stripe / Mailchimp pattern: financial-trust + warmth
        → set audience business, density balanced

R-X-04  body 14px + dark bg + monochrome accent
        → modern saas-dark (Resend / Planetscale / Railway)
        → ambition B/C, density dense, mode dark
```

### 3.2 Decision record format

For every fired rule, write a record:

```yaml
- rule:    R-C-04
  signal:  "background-color of body is rgb(0,0,0)"
  decision: "Use pure black base; no shadows in dark mode; surfaces via borders."
  why:     "OLED-aware contrast-maximal pattern; matches Vercel dark."
```

The full set is written to `decisions.md` in the clone output dir.
HANDOFF.md later quotes these in its "design rationale" section.

### 3.3 Conflict resolution between rules

If two rules contradict (e.g. R-S-01 base 4 vs R-S-02 base 8 because
both bases appear in the data), pick by frequency: count how many
extracted values are exact multiples of each candidate base. Highest
match-rate wins. Record both in `decisions.md` with the chosen one
flagged.

---

## 4. STEP 4 — TOKENIZE

Goal: produce a tokens.json identical in shape to module 07's output,
using the extracted + reasoned values, filling gaps via the rules.

### 4.1 Color pipeline

1. Take `extract.raw_color_set`. Convert every value (hex, rgb, hsl,
   named) to oklch. Drop alpha.
2. Cluster by hue. Merge clusters within ±2° hue and ±0.02 lightness
   (these are usually the same color rounded by a designer).
3. For each cluster, identify role from sample-element usage:
   - if used in `body { color }`: text scale candidate
   - if used in `body { background-color }`: bg scale candidate
   - if used in `button { background-color }` for primary buttons: accent
   - if used in `[class*="error"]`: error
   - same pattern for success/warning/info
4. Build the 11-step grey ramp from the dominant neutral cluster.
   Snap to standard L values: 1.000, 0.980, 0.950, 0.900, 0.800,
   0.650, 0.500, 0.380, 0.280, 0.200, 0.140, 0.100. Preserve hue and
   chroma from the clustered neutral (if site is warm-tinted, the ramp
   is warm-tinted).
5. Build the accent ramp from the accent cluster, same L stops.
6. For status colors, take the closest existing values; if absent,
   generate from the standard saas-dark template (SPEC §saas-dark).
7. Map to semantic tokens (bg-base/surface/elevated/overlay,
   text-primary/secondary/tertiary/disabled/inverse,
   border-subtle/default/strong/focus, accent + variants).
   Use the rules in references/token-architecture.md.

### 4.2 Typography pipeline

1. From `extract.raw_font_size_set`, dedupe and sort.
2. Find the body size (sample of `body { font-size }`). Anchor scale to it.
3. Identify the ratio between consecutive used sizes. Snap to the closest
   musical ratio: 1.125 (Major Second), 1.200 (Minor Third), 1.250
   (Major Third), 1.333 (Perfect Fourth).
4. Generate 8 stops centered on body using the ratio. Map to:
   xs / sm / base / lg / xl / 2xl / 3xl / 4xl. Preserve any unique
   off-ramp size (e.g. 13px dense table size) as a separate
   `sm-dense` token if it was prominent.
5. Per stop, lift line-height, letter-spacing, recommended weight from
   the closest matching extracted record.
6. Fonts: copy the exact `font-family` stack found in `body`, `h1`,
   `code` to display/body/mono. If only one font is declared,
   suggest pairings via rules R-T-08, R-T-09 in decisions.md.

### 4.3 Spacing pipeline

1. Take every padding/margin/gap value in `extract.by_selector`.
2. Identify the base unit (R-S-01/02). Snap all values to multiples
   of the base.
3. Build the canonical scale: base × {1,2,3,4,6,8,12,16,24,32}.
4. If the site uses non-standard stops (e.g. 14, 20), keep those as
   a `space-extra` map flagged in decisions.md (do not pollute the
   primary scale).

### 4.4 Radius / borders / shadows / motion

- Radius: cluster `extract.raw_radius_set`, snap to none/sm/md/lg/xl/2xl/full.
- Borders: dominant width → `border-default`. Anything thicker → `border-strong`.
- Shadows: cluster by intensity (sum of opacity + blur). Map to sm/md/lg/xl.
- Motion: cluster `extract.raw_duration_set`. Map to fast/normal/slow/deliberate.
  Cluster easing curves; map to ease-out (enter), ease-in (exit), spring (delight).

### 4.5 Gap filling

When a slot is empty (e.g. site has no defined `2xl` heading size),
fill it using:

1. The mathematical extension of the established scale (ratio × last stop).
2. The default values from the closest pre-built system (SPEC §saas-dark
   template) IF and only IF the established scale is consistent.
3. Otherwise, mark the slot `inferred: true` in decisions.md.

### 4.6 Conflict resolution (twenty-greys problem)

If extraction surfaces 20 different greys, do NOT preserve all of them.
The TOKENIZE step always produces a clean 11-step grey ramp. Map every
extracted value to its nearest stop. Record the count per stop in
decisions.md ("0.500 absorbed 4 source values").

### 4.7 oklch enforcement

Every color in the output tokens.json is in `oklch(L C H)` form. The
clone-output also keeps a `tokens.legacy.json` with hex equivalents
for tools that don't support oklch, but tokens.json itself is oklch only.

### 4.8 Output of TOKENIZE

```
.design-engine/clones/<host>/<timestamp>/
├── tokens.json
├── tokens.css
├── tokens.legacy.json
├── decisions.md
└── source/
    ├── extract.json          (raw step-2 dump)
    ├── computed-dump.json    (step-1 D dump)
    ├── screenshots/{1440,768,375}.png
    └── stylesheets/*.css
```

---

## 5. STEP 5 — ADAPT (only when --adapt)

Default --clone is the structural-fidelity path: keep everything.
--adapt changes that contract: keep the structural decisions, swap the
brand-specific surface values.

### 5.1 What is KEPT (structure)

- Density (font sizes, line heights, spacing scale base unit)
- Spacing rhythm (the multiples used, the gutter cadence)
- Radius scale (all stops)
- Border discipline (default width, focus width)
- Shadow / elevation strategy (border-elevation vs shadow-stack)
- Motion timing (durations, easing curves, transition discipline)
- Type scale ratio (Major Third / Perfect Fourth / etc)
- Layer architecture (which surfaces stack, how)
- The reasoning rules that fired (preserved in decisions.md)

### 5.2 What is SWAPPED (brand surface)

- Brand accent hue (replaced from user brief / logo)
- Logo + brand colors
- Brand-specific font choices (display + body — replaced if user has a
  preference; mono is usually preserved unless user says otherwise)
- Status hue palette (use defaults unless brief specifies)
- Hero copy / brand voice (downstream content, not a token concern)

### 5.3 Swap procedure

1. Take the cloned tokens.json.
2. Build the user's accent ramp (oklch, same L stops as the clone's
   neutral) from the brief's accent hue (or extract from logo §3.2 of
   intake).
3. Replace `accent`, `accent-hover`, `accent-press`, `accent-subtle`
   semantic tokens.
4. If the user's logo has a serif/display character that contradicts
   the clone's font choice, swap `display` font but keep size/weight/
   tracking decisions.
5. Re-tint the neutral ramp toward the brand's neutral preference
   (warm/cool/neutral) while preserving exact L values. Do NOT change
   chroma magnitude; only hue rotation within ±10°.
6. Re-derive semantic borders (border-focus picks up the new accent).

### 5.4 Delta documentation

Write `adapt-delta.md`:

```
KEPT (structure preserved from <host>):
  - Body 13px, Major Third type ratio
  - 4px base spacing
  - Dark-mode border elevation system (no shadows)
  - 100/150/250ms motion ladder, ease-out enter

SWAPPED (replaced with your brand):
  - Accent: <old hue> → <new hue>
  - Display font: <old> → <new>
  - Neutral hue: <old H>° → <new H>° (chroma preserved)

UNCHANGED REASONING RULES (still active):
  R-T-01, R-C-04, R-R-02, R-M-01, R-M-04, R-X-04
```

---

## 6. --inspect MODE

Stops after STEP 3. Produces only `decisions.md` and a Brief preview
card. No tokens.json. Used to show the user what the clone WOULD look
like before committing to TOKENIZE.

Output to user:

```
Clone inspection — <host>
─────────────────────────
Body 13px        →  density-first, power-user
Pure-black bg    →  OLED-aware, no shadows in dark
Radius 6px       →  precise, professional
Mono in nav      →  developer-tool identity
100/150ms motion →  Stripe-territory micro-interaction precision

12 reasoning rules fired. See clones/<host>/<ts>/decisions.md.

Continue to tokenize?  [Y]es  [A]dapt to my brand  [B]lend with another  [N]o
```

---

## 7. --blend MODE

Run STEP 1–3 against both URLs in parallel. Then merge:

1. Load `decisions[]` from both clones.
2. For each design slot (color, type, spacing, radius, motion, layout),
   present the two source values and pick the better one by these
   priorities:

   ```
   COLOR        → user brief tilts the choice (warmer / cooler / accent)
   TYPOGRAPHY   → take the side with the stronger reasoning rule fired
                  (e.g. R-T-06 negative tracking beats absent tracking)
   SPACING      → take the more disciplined / consistent side (R-S-03 wins R-S-04)
   RADIUS       → take the more opinionated extreme (0 or pill > 8px middle)
   MOTION       → take the faster ladder if both products are productivity
                  apps; the slower ladder if either is marketing-grade
   LAYOUT       → take the denser side if brief is devtool, sparser if landing
   ```

3. Document the choice + source in `blend-rationale.md`:

   ```
   - Spacing base unit: 4 (from linear.app)         R-S-01 fired stronger
   - Radius scale: 0 (from vercel.com)              brutalist commitment
   - Type scale ratio: 1.250 (from linear.app)      Major Third
   - Body font: Inter (both used it — kept)
   - Display font: Cal Sans (linear.app)
   - Accent hue: from user brief (oklch 0.72 0.22 149)
   - Motion ladder: 100/150/250 (from linear.app)
   ```

4. Run STEP 4 (TOKENIZE) on the merged decision set.

---

## 8. Worked Examples

### 8.1 `clone linear.app`

Expected fires:
```
R-T-01  body 13px            density-first, power-user
R-T-06  display tracking -0.04em  tight modern
R-T-08  mono in nav numerals     devtool identity
R-C-05  dark bg L≈0.14            modern saas-dark
R-R-02  radius 6px               precise / professional
R-S-01  base 4                   tight spacing
R-E-03  borders not shadows      flat dark territory
R-M-01  100ms transitions         Stripe-territory micro-interaction
R-M-07  transform/opacity only    GPU motion discipline
R-X-01  compound: power-user devtool
```

Decisions.md headline:
> Linear is a precision instrument. Every choice — 13px body, 4px base,
> 6px radius, 100ms motion — converges on density and speed for users
> who live in their keyboard.

### 8.2 `clone vercel.com`

Expected fires:
```
R-T-03  body 16px            consumer-readable, doc-grade
R-T-06  display tracking neg   modern
R-C-01  pure white bg            maximum contrast
R-C-04  pure black bg (dark)     OLED-aware
R-R-01  radius 0 everywhere      brutalist precision
R-R-06  border 1px               standard
R-E-03  no shadows               flat
R-M-01  150ms                    standard precision
R-X-02  compound: documentation-grade precision
```

Decisions.md headline:
> Vercel commits to absolute contrast: white is white, black is black,
> radius is zero. Every removed decoration is the message.

### 8.3 `--adapt linear.app` to a fintech brand

KEPT: 13px body, 4px base, 6px radius, motion ladder, dark-mode border
elevation, mono font in numerals.
SWAPPED: green accent (Linear's purple) → fintech brand's blue (oklch
0.55 0.18 250); neutral hue rotated cool (H 230) from Linear's slight
warm-cool neutral. Display font kept (Inter). Mono kept (JetBrains Mono).

### 8.4 `--blend linear.app vercel.com`

```
- spacing base   → 4 (Linear)
- radius         → 0 (Vercel) — commitment beats neutrality
- body size      → 14 (compromise: Linear 13 too dense for general SaaS)
- type ratio     → 1.250 (Linear)
- bg light/dark  → 1.000 / 0.100 (Vercel-style maximum contrast)
- motion         → 100/150/250 (Linear)
- mono in chrome → preserved (Linear)
- shadows        → none (both agree)
```

Result: a precise, dense, zero-radius, maximum-contrast, OLED-aware
system with developer-tool DNA. Distinctive without copying either.

---

## 9. Failure Modes + Reporting

If FETCH is blocked (§1.5) and no --inspect fallback can run, return
this to the user (not silent):

```
Clone failed for <host>: <reason>.

Options:
  1. Provide screenshots — I'll run image-to-code instead (module 12).
  2. Pick a pre-built system — /design system.
  3. Link a public design page (e.g. /design, /brand).
```

If TOKENIZE encounters values that can't be reconciled (e.g. extraction
returned nothing usable for a critical slot), generate the slot from
the closest pre-built system template and mark `inferred: true` in
decisions.md.

---

## 10. Output

Clone engine emits the clone-output directory (§4.8) and writes its
tokens.json into `.design-engine/system/` if the user accepts. The
"What I Know" object is updated:

```
clone_target.completed:    true
clone_target.tokens_path:  <path to tokens.json>
clone_target.decisions_md: <path>
clone_target.fired_rules:  [<rule id>, ...]
```

Hand off to:
- module 02 if the brief still has gaps after the clone
- module 07 (system-gen) to wrap tokens into the full preview HTML
- module 08 (component-library) to generate components on top

End of clone engine.
