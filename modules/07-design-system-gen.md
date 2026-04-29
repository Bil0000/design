# 07 — Design System Generation

The core generative module. Produces every artifact downstream modules
consume. Three sections in this file:

  Section 1: Token generation (5 file formats)
  Section 2: system-preview.html generation (self-contained, interactive)
  Section 3: SYSTEM.md generation (human + AI readable)

Inputs (from the "What I Know" object): brief, codebase.stack,
references_research, system selection (or origin = from-brief, from-codebase,
from-figma, from-clone). Output dir: `.design-engine/system/`.

Two binding rules everywhere in this module:

> Every color is `oklch(L C H[ / A])`. No hex, no rgb, no hsl in the
> primary token files. (Hex equivalents go to `tokens.legacy.json`
> only.)
>
> Every component value references a token. Hardcoded values are a
> defect.

---

## SECTION 1 — TOKEN GENERATION

### 1.1 Architecture — Three Layers

Every token belongs to exactly one layer. Layers reference downward.

```
Layer 1 — PRIMITIVE
  Raw values. No semantic meaning. Named by what they ARE.
  grey-50 ... grey-950        green-500          blue-700
  size-12 size-14 size-16     space-1 ... space-32

Layer 2 — SEMANTIC
  Meaningful names. Reference primitives.
  bg-base    → grey-950
  text-primary → grey-50
  accent     → green-500
  border-default → grey-700

Layer 3 — COMPONENT
  Component-specific. Reference semantics.
  button-bg-primary  → accent
  button-text-primary → text-inverse
  card-bg            → bg-surface
  input-border       → border-default
```

Components NEVER reference primitives directly. Semantics NEVER
reference component tokens. Walking up the layers is one-way.

### 1.2 Color — Primitive Scale

Generate an 11-step ramp per neutral + per accent, in oklch.
Standard L stops (used in EVERY system, do not deviate):

```
L stops:  1.000  0.980  0.950  0.900  0.800  0.650  0.500  0.380  0.280  0.200  0.140  0.100
Step:     0      50     100    200    300    400    500    600    700    800    900    950
```

(Twelve stops total — the 0 step is pure white, included so
inverse-on-light components have a clean reference.)

Per ramp: chroma + hue determined by brief / clone / pre-built source.
Examples:

```
neutral cool (saas-dark default):
  grey-0    oklch(1.000 0.000 0)
  grey-50   oklch(0.980 0.003 264)
  grey-100  oklch(0.950 0.005 264)
  grey-200  oklch(0.900 0.008 264)
  grey-300  oklch(0.800 0.012 264)
  grey-400  oklch(0.650 0.018 264)
  grey-500  oklch(0.500 0.020 264)
  grey-600  oklch(0.380 0.018 264)
  grey-700  oklch(0.280 0.015 264)
  grey-800  oklch(0.200 0.012 264)
  grey-900  oklch(0.140 0.008 264)
  grey-950  oklch(0.100 0.005 264)

accent green:
  accent-50 ... accent-950  same L stops, chroma 0.219 (or brief-derived)
                            hue 149 (or brief-derived)
```

Chroma rules:
- Neutral chroma stays ≤ 0.020.
- Accent chroma 0.15–0.24 at L 0.5–0.7. Drop to 0.05 at L ≤ 0.2 and L ≥ 0.95
  to avoid muddy / fluorescent extremes.
- Hue stays constant within a ramp.

### 1.3 Color — Semantic Layer

Generate ALL of the following. Defaults shown for saas-dark template;
adjust per chosen system / clone.

```
Backgrounds:
  bg-base       grey-950   (light mode: grey-0)
  bg-surface    grey-900             grey-50
  bg-elevated   grey-800             grey-100
  bg-overlay    grey-700             grey-200
  bg-inset      oklch(0.07 0.005 264)   grey-100

Text:
  text-primary    grey-50      grey-900
  text-secondary  grey-400     grey-600
  text-tertiary   grey-600     grey-400
  text-disabled   grey-700     grey-300
  text-inverse    grey-950     grey-0
  text-link       accent       accent
  text-link-hover accent-hover accent-hover

Borders:
  border-subtle   grey-800   grey-100
  border-default  grey-700   grey-200
  border-strong   grey-600   grey-300
  border-focus    accent at 60% opacity

Accent:
  accent          oklch(<brand>)
  accent-hover    L+0.03
  accent-press    L-0.04
  accent-subtle   accent at 0.12 alpha
  accent-text     contrast pair (text on accent surfaces)

Status (every variant: default + subtle + text):
  success         oklch(0.720 0.170 145)
  success-subtle  success at 0.12 alpha
  success-text    contrast pair
  warning         oklch(0.780 0.180 65)
  warning-subtle  warning at 0.12 alpha
  warning-text    contrast pair
  error           oklch(0.620 0.220 20)
  error-subtle    error at 0.12 alpha
  error-text      contrast pair
  info            oklch(0.680 0.180 240)
  info-subtle     info at 0.12 alpha
  info-text       contrast pair

Chart palette (8 colors, colorblind-safe — Okabe–Ito-derived in oklch):
  chart-1  oklch(0.620 0.180 220)   blue
  chart-2  oklch(0.700 0.170 65)    orange
  chart-3  oklch(0.620 0.150 145)   green
  chart-4  oklch(0.700 0.150 95)    yellow
  chart-5  oklch(0.580 0.180 290)   purple
  chart-6  oklch(0.700 0.180 30)    vermillion
  chart-7  oklch(0.640 0.140 200)   sky
  chart-8  oklch(0.500 0.020 264)   neutral (anchor)
```

Light + dark variants are BOTH generated for systems that support both
modes. Each block is duplicated with the inverse mapping (bg ↔ text,
elevation flipped).

### 1.4 Color — Component Layer

Generated per component, referencing semantics. The default set:

```
button-bg-primary       accent
button-bg-primary-hover accent-hover
button-bg-primary-press accent-press
button-text-primary     accent-text
button-bg-secondary     bg-elevated
button-text-secondary   text-primary
button-border-secondary border-default
button-bg-ghost         transparent
button-text-ghost       text-primary
button-bg-destructive   error
button-text-destructive error-text

input-bg                bg-surface
input-text              text-primary
input-placeholder       text-tertiary
input-border            border-default
input-border-focus      border-focus
input-border-error      error

card-bg                 bg-surface
card-border             border-subtle
card-bg-hover           bg-elevated

nav-bg                  bg-base
nav-text                text-secondary
nav-text-active         text-primary
nav-bg-active           bg-elevated

table-row-bg            bg-base
table-row-bg-hover      bg-surface
table-header-bg         bg-surface
table-cell-border       border-subtle

badge-bg                bg-elevated
badge-text              text-primary
badge-bg-success        success-subtle
badge-text-success      success-text
[same for warning, error, info]

modal-bg                bg-elevated
modal-overlay           oklch(0 0 0 / 0.6)
modal-border            border-subtle

toast-bg                bg-elevated
toast-border-success    success
[same for warning, error, info]
```

### 1.5 Typography — Typefaces

Three slots. Each carries the family + fallback chain + provider note.

```
display:  primary heading face        (Cal Sans, Inter Display, ...)
body:     UI + paragraphs             (Inter, system-ui, ...)
mono:     code, IDs, tabular numbers  (JetBrains Mono, ...)
```

Per slot, generate:
```
family            "Cal Sans", "Inter", system-ui, sans-serif
provider          google | adobe | self-hosted | system
weights_loaded    [400, 500, 600, 700]
features          ["ss01", "cv11", "tnum"]
license_note      free | OFL | commercial — link if available
fallback_metrics  size-adjust + ascent-override + descent-override
                  (for fallback fonts that don't match — generated via
                  https://github.com/seek-oss/capsize-derived rules)
```

### 1.6 Typography — Scale

Major Third ratio (1.250) by default. Editorial uses 1.250 too.
Minimal uses 1.333 (Perfect Fourth). Mobile-ios uses 1.125 (Major
Second). Override per system.

Per stop, generate `[size, line-height, letter-spacing, weight]`.
Letter-spacing rule: NEGATIVE for all sizes ≥ 20px. Magnitude grows
with size.

```
xs        12px   1.6   +0.01em   400
sm-dense  13px   1.5   0          400    (only if dense system)
sm        14px   1.5   0          400
base      16px   1.6   -0.01em   400
lg        20px   1.4   -0.02em   500
xl        24px   1.3   -0.02em   600
2xl       32px   1.2   -0.03em   600
3xl       40px   1.1   -0.04em   700
4xl       56px   1.0   -0.05em   700
5xl       72px   0.95  -0.05em   700  (landing-only)
```

Usage rules (added to system.md):
- Max 3 different font sizes per screen
- Max 2 weights in any single visual group
- Display font only on sizes ≥ 24px (xl and up)
- Mono for: code, IDs, tabular numbers, version strings
- Body for everything else, including small chrome text

### 1.7 Spacing

4px base by default. 8px for material / mobile-material. Stops:

```
1   4px        2   8px        3   12px       4   16px
6   24px       8   32px       12  48px       16  64px
24  96px       32  128px

Named aliases:
  gutter-xs    space-2     8px
  gutter-sm    space-3     12px
  gutter-md    space-4     16px
  gutter-lg    space-6     24px
  gutter-xl    space-8     32px
  section-y-sm space-12    48px
  section-y    space-16    64px
  section-y-lg space-24    96px
```

Rule: never invent stops. Anything between two stops snaps DOWN to the
lower stop. The handful of legitimate exceptions (e.g. exact 18px gap
demanded by a baseline grid) get explicit named tokens, not arbitrary
values.

### 1.8 Borders + Radius

```
Radius scale:
  none   0
  sm     4px
  md     6px
  lg     8px
  xl     12px
  2xl    16px
  3xl    24px        (large landing surfaces only)
  full   9999px      (avatars, pills only)

Border widths:
  thin     1px       (default for all surfaces)
  medium   1.5px     (focus rings only)
  thick    2px       (only for systems that opted in: minimal/brutalist)

Rules:
  - Default surface border = thin.
  - Focus ring = medium, oklch(<accent> / 0.35), offset 2px.
  - Avatars round to full. Pills round to full. Everything else picks
    sm/md/lg from the system's chosen radius personality.
  - Mixed radii on one screen are forbidden — pick one and commit.
```

### 1.9 Shadows + Elevation

Light mode uses shadow scale. Dark mode does NOT — it uses border
elevation. This is a hard split.

#### Light mode shadow scale (oklch black with alpha)

```
shadow-xs   0 1px 2px 0   oklch(0 0 0 / 0.04)
shadow-sm   0 2px 4px -1px oklch(0 0 0 / 0.06)
            0 1px 2px -1px oklch(0 0 0 / 0.04)
shadow-md   0 4px 8px -2px oklch(0 0 0 / 0.08)
            0 2px 4px -2px oklch(0 0 0 / 0.04)
shadow-lg   0 12px 24px -4px oklch(0 0 0 / 0.10)
            0 4px 8px -4px  oklch(0 0 0 / 0.06)
shadow-xl   0 24px 48px -8px oklch(0 0 0 / 0.14)
            0 8px 16px -8px  oklch(0 0 0 / 0.08)

Focus ring: outline 0 0 0 3px oklch(<accent> / 0.35), offset 2px.
```

If the chosen system tints shadows (Stripe-style premium tinting),
swap `oklch(0 0 0 / a)` → `oklch(0 0.04 264 / a)` (or appropriate
brand neutral hue). Document the tint in system.md.

#### Dark mode — border elevation system (no shadows)

Surfaces lift via successively lighter backgrounds + visible borders.
This is the documented, enforced replacement for shadows in dark mode.

```
Layer        bg              border
base         bg-base         (no border — ground plane)
surface      bg-surface      border-subtle
elevated     bg-elevated     border-default
overlay      bg-overlay      border-default
modal        bg-elevated     border-default + outer border-subtle ring

Elevation cues:
  - 0 (base):     no border, no surface tint
  - 1 (surface):  +0.04 L, border-subtle
  - 2 (elevated): +0.06 L, border-default
  - 3 (overlay):  +0.10 L, border-default
  - 4 (modal):    +0.06 L from base + 1px outer ring at +0.04 L
```

NO `box-shadow` rules in dark mode tokens. Generated dark-mode
component CSS contains zero shadow declarations. The critique module
flags any shadow in dark output as a defect.

### 1.10 Motion

```
Durations:
  instant       0ms
  fast          100ms     (Stripe-territory micro-interactions)
  normal        150ms     (default state changes)
  slow          250ms     (drawer, sheet, modal)
  deliberate    400ms     (hero / first-touch surfaces)

Easing:
  ease-out      cubic-bezier(0, 0, 0.2, 1)        entering / appearing
  ease-in       cubic-bezier(0.4, 0, 1, 1)        leaving / dismissing
  ease-in-out   cubic-bezier(0.4, 0, 0.2, 1)      transitions in place
  spring        cubic-bezier(0.34, 1.56, 0.64, 1) delight, sparingly

Rules:
  - Only animate transform + opacity. No box-shadow transitions.
  - Max 3 simultaneous animations on a screen.
  - Exiting motion lasts 80% of entering motion.
  - prefers-reduced-motion: cut all durations to 0 except entrance fade.
```

### 1.11 Token File Outputs — Five Formats

Write to `.design-engine/system/` simultaneously.

#### `tokens.json` — canonical, oklch
```json
{
  "$schema": "design-engine.token.schema.v1",
  "version": "1.0.0",
  "color": {
    "primitive": { "grey": { "0": "oklch(1 0 0)", "...": "..." } },
    "semantic": {
      "light": { "bg-base": "{color.primitive.grey.0}", "...": "..." },
      "dark":  { "bg-base": "{color.primitive.grey.950}", "...": "..." }
    },
    "component": { "button-bg-primary": "{color.semantic.accent}" }
  },
  "typography": { "...": "..." },
  "spacing":     { "...": "..." },
  "radius":      { "...": "..." },
  "shadow":      { "...": "..." },
  "motion":      { "...": "..." }
}
```
References use the `{path.to.token}` form. Resolution happens in the
build step that produces the other formats.

#### `tokens.css` — CSS custom properties

```css
:root {
  /* primitive */
  --color-grey-0: oklch(1 0 0);
  --color-grey-50: oklch(0.980 0.003 264);
  /* ... */

  /* semantic (light) */
  --bg-base: var(--color-grey-0);
  --text-primary: var(--color-grey-900);
  /* ... */

  /* component */
  --button-bg-primary: var(--accent);
  /* ... */

  /* typography, spacing, radius, motion */
  --font-display: "Cal Sans", "Inter", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --text-xs: 12px; --text-xs-line: 1.6; --text-xs-tracking: 0.01em;
  /* ... */
  --space-1: 4px; /* ... */
  --radius-sm: 4px; /* ... */
  --duration-fast: 100ms;
  --easing-out: cubic-bezier(0, 0, 0.2, 1);
}

.dark, [data-theme="dark"] {
  --bg-base: var(--color-grey-950);
  --text-primary: var(--color-grey-50);
  /* ... full dark semantic remap */
}

@media (prefers-reduced-motion: reduce) {
  :root { --duration-fast: 0ms; --duration-normal: 0ms; --duration-slow: 0ms; --duration-deliberate: 0ms; }
}
```

#### `tokens.ts` — typed export

```ts
export const tokens = {
  color: {
    primitive: { grey: { 0: "oklch(1 0 0)", /* ... */ } },
    semantic:  { light: { bgBase: "var(--bg-base)", /* ... */ }, dark: { /* ... */ } },
    component: { buttonBgPrimary: "var(--button-bg-primary)" }
  },
  typography: { /* ... */ },
  spacing:    { /* ... */ },
  radius:     { /* ... */ },
  motion:     { /* ... */ }
} as const;

export type Tokens = typeof tokens;
```

#### `tokens.tailwind.js` — Tailwind config extension

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg:      { base: "var(--bg-base)", surface: "var(--bg-surface)", elevated: "var(--bg-elevated)", overlay: "var(--bg-overlay)" },
        text:    { primary: "var(--text-primary)", secondary: "var(--text-secondary)", tertiary: "var(--text-tertiary)", inverse: "var(--text-inverse)" },
        border:  { subtle: "var(--border-subtle)", DEFAULT: "var(--border-default)", strong: "var(--border-strong)" },
        accent:  { DEFAULT: "var(--accent)", hover: "var(--accent-hover)", subtle: "var(--accent-subtle)" },
        success: "var(--success)", warning: "var(--warning)", error: "var(--error)", info: "var(--info)"
      },
      fontFamily: { display: "var(--font-display)", body: "var(--font-body)", mono: "var(--font-mono)" },
      fontSize: {
        xs: ["12px", { lineHeight: "1.6", letterSpacing: "0.01em" }],
        /* ... */
      },
      spacing: { 1: "4px", 2: "8px", 3: "12px", /* ... */ },
      borderRadius: { sm: "4px", md: "6px", lg: "8px", xl: "12px", "2xl": "16px", full: "9999px" },
      transitionDuration: { fast: "100ms", normal: "150ms", slow: "250ms", deliberate: "400ms" },
      transitionTimingFunction: { out: "cubic-bezier(0,0,0.2,1)", in: "cubic-bezier(0.4,0,1,1)", spring: "cubic-bezier(0.34,1.56,0.64,1)" }
    }
  }
};
```

#### `tokens.figma.json` — Figma Variables import format

```json
{
  "version": "1",
  "metadata": { "tokenSetOrder": ["primitive", "semantic-light", "semantic-dark", "component"] },
  "primitive": { "color": { "grey-0": { "type": "color", "value": "oklch(1 0 0)" } /* ... */ } },
  "semantic-light": { "bg-base": { "type": "color", "value": "{primitive.color.grey-0}" } /* ... */ },
  "semantic-dark":  { "bg-base": { "type": "color", "value": "{primitive.color.grey-950}" } /* ... */ },
  "component":      { "button-bg-primary": { "type": "color", "value": "{semantic-light.accent}" } /* ... */ }
}
```

The Figma variables import plugin reads this format directly. Module
14 (figma-push) consumes the same file when pushing.

#### `tokens.legacy.json` — hex equivalents (last resort)

Same shape as tokens.json but every oklch value is converted to hex
for tools that don't yet support oklch. tokens.json remains the source
of truth.

---

## SECTION 2 — `system-preview.html` Generation

A single self-contained HTML file. No build step. Open in any browser.
External requests allowed only for fonts (Google Fonts CDN or
self-hosted via `@font-face` data URIs if --offline flag was given).

The file must:
- Render correctly on a fresh browser with no extension or server.
- Update light/dark mode without reloading.
- Support keyboard navigation across sections.
- Stay under 500 KB total.

### 2.1 Document Structure

```
<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{system.name} — design-engine</title>
  <link href="<google-fonts-url-for-display+body+mono>" rel="stylesheet">
  <style>/* tokens.css inlined verbatim */</style>
  <style>/* preview-only chrome styles */</style>
</head>
<body>
  <header class="topbar">…</header>
  <div class="layout">
    <aside class="sidebar">…</aside>
    <main class="content">…</main>
  </div>
  <script>/* preview interactions */</script>
</body>
</html>
```

The tokens.css is inlined so the file works offline. Component samples
also use the same custom properties — they update when the user toggles
modes via the topbar.

### 2.2 Top Bar

```
[ system.name + version ] [ theme toggle ] [ size selector ] [ export ▼ ] [ Figma sync · last synced ]
```

Behaviors:
- **Theme toggle** (sun/moon icon): toggles `data-theme="light"|"dark"`
  on `<html>`. All components update via custom properties. Persisted
  to localStorage.
- **Size selector**: pill group `[ 375 | 768 | 1440 ]`. Sets the
  `--preview-width` custom property on `main.content`. Components
  inside re-flow.
- **Export** (▼ menu): list with all download buttons (§2.10).
- **Figma sync**: pill showing `Connected` or `Not connected`. When
  connected, displays `last sync · 12m ago` and a `Push now` action.
  Hooks into module 14 (figma-push) — clicking issues a `figma-push`
  message back to the orchestrator (the preview can't run MCP itself,
  so it copies a `claude /design system push` snippet to clipboard
  and shows a toast).

### 2.3 Left Sidebar Navigation

```
Overview
Colors
Typography
Spacing
Borders
Shadows
Motion
Components
Brand
Critique Report
```

Each entry scrolls to its `<section id="...">`. The active section is
highlighted via IntersectionObserver on the section headers. Keyboard:
`j/k` or `↑/↓` move between sections.

### 2.4 Overview Section

Renders:
- System name, version, origin (pre-built / from-codebase / from-clone / etc.)
- 4 stats: token count, component count, ambition level, mode support
- Two thumbnail panels: a sample dashboard card and a sample landing
  hero (built from the system) so the user sees real surfaces, not
  swatches.

### 2.5 Colors Section

For each ramp (greys + accent + every status hue):
- 11-step row of swatches.
- Each swatch shows the L step number on hover.
- Tooltip on hover lists: `oklch(...)`, `#hex`, `rgb(r g b)`, `hsl(h s% l%)`.
- Click any swatch → copies the oklch value to clipboard. A toast
  confirms (`grey-700 → clipboard`).

For the semantic layer:
- A grid of named tokens. Each cell shows: name, the bg color filled
  in, the value, the primitive it references.
- Toggling theme (top bar) instantly updates the values shown.

For the component layer:
- A grouped list per component. Each row: token name, value, swatch.

#### Contrast matrix
- A 2D grid: every text color × every bg color.
- Each cell shows the WCAG contrast ratio + a badge (`AAA`, `AA`, `AA Large`, `Fail`).
- Cells under 4.5:1 are flagged in red border.

#### Chart palette + colorblind sim
- 8-color row.
- Toggle: Normal | Protanopia | Deuteranopia | Tritanopia. (Use a
  single inline JS function applying the standard transformation
  matrices to render alternate swatches; do NOT rely on external libs.)

### 2.6 Typography Section

For each typeface slot (display / body / mono):
- Family name, weights loaded, provider, license note.
- Specimen: full Latin alphabet upper + lower, digits 0–9, common
  punctuation `! ? : ; , . & @ #`.
- Weight strip: each loaded weight rendered at 24px with the weight
  number.

For the scale:
- One row per stop. Columns: token name, size, line-height, tracking,
  weight, live specimen ("The quick brown fox..." rendered at that
  spec).
- Two action buttons per row: `Copy CSS` (`font: var(--text-2xl)...`)
  and `Copy Tailwind class` (`text-2xl`).

A "Real copy" panel renders one realistic UI block (a card title +
two paragraphs + a small label) using the actual sizes — to show how
sizes interact, not just isolated specimens.

### 2.7 Spacing Section

For each step:
- A horizontal bar at the actual width of the value, plus a label
  showing the value (`16px`) and the token name (`space-4`).
- Three copy buttons: `Copy value` (`16px`), `Copy CSS var`
  (`var(--space-4)`), `Copy Tailwind class` (`p-4`).

A "redline annotation toggle" sits at the top right of the section.
When enabled, hovering over any sample card / button in the rest of
the preview overlays redlines showing padding + margin + gap values.

### 2.8 Borders Section

- Radius scale: 7 sample squares (none, sm, md, lg, xl, 2xl, full)
  with token name + value + copy button.
- Border widths: 3 sample boxes showing thin / medium / thick.
- Focus ring sample: a button with `:focus-visible` triggered on click.

### 2.9 Shadows Section

Light mode block:
- 5 sample cards, each at one elevation step. Hovering each reveals
  the box-shadow value.

Dark mode block (renders only when theme=dark):
- 5 stacked surfaces showing the border-elevation system. Each panel
  visible at +L tinting + visible border. A note reads:
  `Dark mode uses border elevation, not shadows.`
- A red "DON'T" panel showing what shadow-in-dark looks like, struck
  through, with the rule citation.

### 2.10 Motion Section

For each duration token (instant / fast / normal / slow / deliberate):
- A clickable button labeled with the duration.
- On click, a small dot translates 200px to the right using that
  duration with `easing-out`.

For each easing curve (out / in / in-out / spring):
- An inline SVG drawing the cubic-bezier curve in a 200x200 grid.
- A small play button under each curve animates a square along the X
  axis with that easing applied.
- Cubic-bezier values shown as text under each curve.

Side note: this section is design-engine's differentiator vs Claude
Design (which has no motion section). Make it shine.

### 2.11 Components Section

Render each component (button, card, input, nav, table, badge, modal,
toast, plus dropdown / toggle / checkbox / radio / skeleton / avatar)
as a fully interactive instance.

For each component:
- A live render area on the left.
- A side panel on the right with:
  - State switcher: pill group `default | hover | active | focus | disabled | error`.
    Selecting a state forces the visual via `data-state` attribute on
    the live render — NOT by faking pointer state. Real focus is also
    available via tabbing.
  - Variant switcher (component-dependent): primary / secondary / ghost / destructive, etc.
  - Size switcher: sm / md / lg / xl when applicable.
- Two code panels under the live render (collapsed by default):
  `JSX` and `CSS`. Each has a copy button.
- A `Dark/Light` per-component toggle so the user can compare without
  flipping the whole page.

The buttons, inputs, and modals must be functional — clicking the
modal's trigger really opens the modal, focus is trapped, ESC closes
it, etc.

### 2.12 Brand Section

Renders:
- Logo (if provided in intake).
- Brand colors as a row of swatches (separate from the semantic palette).
- Anti-words list (the things this system explicitly avoids).
- Personality words from the brief.
- Distinctive details list — the screenshottable moments designed
  into this system (one bullet each, with a thumbnail when possible).

### 2.13 Critique Report Section

Reads from `.design-engine/system/critique.json` if module 15 has run.
Otherwise renders an empty state with a `Run critique` button that
issues a `claude /design review` snippet to clipboard.

When the critique is present, render:
- 8 dimension scores (radar chart inline SVG).
- A list of issues per dimension, each with the suggested fix.
- The overall score + handoff readiness badge (`approved` / `warnings` / `blocked`).

### 2.14 Export Panel

Triggered by the top bar `Export ▼` menu. Lists download buttons:

```
tokens.json                  primary, oklch
tokens.css                   :root + .dark
tokens.ts                    typed export
tokens.tailwind.js           Tailwind extension
tokens.figma.json            Figma variables import
tokens.legacy.json           hex equivalents
components.zip               all JSX/CSS components
SYSTEM.md                    docs (this section §3)
HANDOFF.md                   AI implementation spec (module 16)
Push to Figma                copies `claude /design system push` to clipboard
```

Downloads are real `<a download>` links pointing at sibling files in
`.design-engine/system/`. They work without a server because the
preview lives next to those files.

### 2.15 Self-Containment Verification

After generation, the preview file must satisfy:
- No `<script src="https://...">` (no remote JS dependency)
- No `import` statements
- No external image URLs except for the user's logo and any references
  the user supplied (those stay local under `assets/`)
- One `<link rel="stylesheet" href="https://fonts.googleapis.com/...">`
  is permitted; in `--offline` mode, fonts are inlined as
  `@font-face { src: url(data:font/...) }`.
- File size ≤ 500 KB for the default system; up to 1.5 MB allowed
  when `--offline` inlines fonts.

---

## SECTION 3 — `SYSTEM.md` Generation

The human + AI readable system document. This is what Claude Code
reads when implementing from the design system. It must be exhaustive
enough that an AI agent can implement any screen using only this file
+ the tokens.

### 3.1 Output Path

`.design-engine/system/SYSTEM.md`

### 3.2 Required Sections (in this order)

```markdown
# {system.name} — Design System
*Version {version} · origin {origin} · ambition {A|B|C|D} · {ISO timestamp}*

## 1. Philosophy
{2–4 sentences. The "why" of this system. For pre-built systems, lift
from systems/<name>/system.md. For from-clone, lift the headline of
clone-engine's decisions.md. For from-brief, derive from
brief.aesthetic.personality_words + audience + ambition.}

## 2. Identity
- **Product:** {identity.product_name | "—"}
- **Domain:** {identity.domain}
- **Audience:** {audience.segment} ({audience.technical_level})
- **Personality:** {personality_words joined " · "}
- **Avoid:** {anti_words joined " · "}

## 3. Design Principles
{Five short principles. For pre-built, lift from systems/<name>/system.md.
For derived systems, generate from the fired reasoning rules
(clone-engine §3.1) + ambition level. Each principle is one sentence,
imperative voice.}

Example:
- Density is a feature. Use space deliberately, not generously.
- One distinctive detail per screen. The screenshottable moment.
- Border elevation in dark, never shadow.
- Motion for state communication only. Nothing decorative.
- Hardcoded values are a defect. Tokens or nothing.

## 4. Tokens

### 4.1 Color
List every primitive ramp + every semantic token + every component
token. For each, show: name, value (oklch), reference (if semantic).
Render as a table. Both light and dark blocks for systems that support
both. Include the WCAG contrast badge for every text/bg pairing.

### 4.2 Typography
- Display / body / mono families with full fallback chains.
- Full scale table: token name, size, line-height, tracking, weight.
- Usage rules (max 3 sizes per screen, max 2 weights per group, etc.).

### 4.3 Spacing
- Base unit.
- Full scale.
- Named aliases (gutter-sm/md/lg, section-y/etc.).

### 4.4 Borders + Radius
- Radius scale.
- Border widths.
- Focus ring spec.

### 4.5 Shadows + Elevation
- Light shadow scale.
- Dark border-elevation system, with the explicit "no shadows in dark"
  rule restated.
- Light → dark mapping table (for components that change strategy by
  mode).

### 4.6 Motion
- Duration scale.
- Easing curves with cubic-bezier values.
- Rules.

## 5. Components
For each generated component:
### {component-name}
- Purpose.
- Variants list.
- Sizes list.
- States supported.
- Props table (name, type, default, description).
- Usage example (one realistic JSX snippet).
- Accessibility notes (ARIA roles, keyboard, focus management).
- Anti-patterns (what NOT to do with this component).

## 6. Layout Rules
- Default container max-width.
- Grid recommendation (12-column desktop, 4-column mobile).
- Gutter cadence.
- Stack rules (vertical rhythm).
- Responsive breakpoints from the system.

## 7. Iconography
- Vendor (Lucide / Heroicons / custom / etc.).
- Default size (16/20/24).
- Stroke weight.
- Usage rules (one icon family per screen, no emoji as icons).

## 8. Voice + Copy Hints
{Optional. Generated only when brief includes brand_words or
anti_words. One short paragraph.}

## 9. AI Implementation Notes
*This section is read by Claude Code, Cursor, and other AI agents
implementing from this system.*

- Token import path: `import "@/styles/tokens.css"` (after the user
  promotes the file, see HANDOFF.md).
- Tailwind: extend with `tokens.tailwind.js`.
- Type usage: `import { tokens } from "@/styles/tokens"`.
- NEVER use raw hex/rgb in components. Always reference tokens.
- NEVER use shadow in dark mode. Use border elevation.
- ALWAYS include hover, focus-visible, active, disabled states on
  interactive components.
- ALWAYS include `aria-*` attributes per component spec.
- Animation: `transition: transform var(--duration-normal) var(--easing-out), opacity ...`. Never animate box-shadow.
- Focus ring class: `outline outline-2 outline-offset-2 outline-[var(--border-focus)]`.
- Dark mode trigger: the `.dark` class on `<html>` (or
  `[data-theme="dark"]`) — both work.

## 10. Promotion to src/
{Generated by module 16, but if it ran, mirror its instructions here:}
```
cp .design-engine/handoff/design-tokens.css ./src/styles/tokens.css
cp .design-engine/handoff/components/* ./src/components/design/
```
{Do not modify this section by hand; it's regenerated on every handoff.}

## 11. Anti-Slop Rules (binding)
{Verbatim list from SKILL.md §6, scoped to this system. Plus any
trend-decline items added by module 05's research brief.}

## 12. Changelog
{Generated on every regeneration of the system. Append-only.}
```

### 3.3 Generation Rules

- Tables MUST list every token. No `...` or `etc.`.
- Examples MUST use realistic copy (not "Lorem ipsum", not "Click me").
- Prose MUST be tight. No filler. Each principle one sentence.
- Component sections MUST include working JSX, not pseudocode.
- Anti-patterns MUST be specific ("Don't use shadow in dark mode" not
  "be careful with shadows").
- A11y notes MUST cite the role and the keyboard interactions.

---

## 4. Status Output During Generation

Print a single status line that updates as work progresses:

```
Generating system · color ramps · typography · spacing · components (3/8) · preview · system.md ...
```

After completion, print:

```
System ready: .design-engine/system/
  Tokens:    tokens.{json,css,ts,tailwind.js,figma.json,legacy.json}
  Components: 8 generated
  Preview:   open .design-engine/system/system-preview.html
  Docs:      .design-engine/system/SYSTEM.md
```

---

## 5. Output

This module emits the full `.design-engine/system/` directory and
updates `.design-engine.json` (`version` bumped, `system` set,
`adapted` flag if applicable).

Hand off to:
- module 08 (component-library) — only when generating beyond the
  default 8 components, or when the system originated from option 13/14
  and components weren't copied from a template.
- module 09 (canvas) / 10 (prototype) — when the active command
  needs screens.
- module 15 (critique) — for `/design system` flows that end here.

End of design system generation.
