# 12 — Image-to-Code

Converts screenshots or design images into production code that fits
the existing codebase and design system. Extends user's existing
image-to-code skill with codebase awareness + token enforcement.

The module runs in four steps: ANALYZE → MATCH → GENERATE → OUTPUT.
Each step has explicit rules. Generation never silently guesses;
ambiguity is logged as a documented assumption.

Inputs: one or more images (UI screenshots, design exports), the
"What I Know" object, codebase scan, active design system. Output:
component + notes pair under `.design-engine/handoff/components/`
(or `.design-engine/system/components/` when the run is part of
system generation).

Two binding rules:

> **Match before you build.** A pattern that already exists in the
> codebase or component library must be reused (extended or
> composed). Duplicating an existing component is a defect.
>
> **No silent guesses.** Every value the analyzer can't read with
> confidence is recorded as an assumption in the component's
> `.notes.md` under `## Assumptions`, with the basis and a default
> resolved from the active design system.

---

## 1. Activation

Run when:

- Command is `/design redraw` (this module owns the redraw flow).
- Any other command + the user attached one or more screenshots
  classified as UI (module 01 §3.1).
- The user asks to "convert this screenshot", "image to code",
  "build this from a picture".

Skip when:

- The image is a logo (handled by module 01 §3.2).
- The image is a mood-board reference (it informs aesthetic; no
  code is generated for it).

If multiple UI screenshots were attached, run the pipeline once per
image. Outputs are independent (one screen per screenshot) unless
the user said "this is a flow" — then sequence them.

---

## 2. STEP 1 — ANALYZE SCREENSHOT

Seven extraction categories. Each produces a structured record. The
analyzer never returns null for a category — it returns either a
value with a confidence score, or an explicit "ambiguous" flag with
the reason.

### 2.1 Layout detection

Detect the dominant layout strategy of the image.

```
Outputs:
  primary_layout       flex | grid | absolute | mixed
  axis                 row | column            (when flex)
  columns              <int>                   (when grid)
  rows                 <int>                   (when grid)
  gap_px_estimate      <int>                   (consistent gap detected)
  gutter_px_estimate   <int>                   (outer container padding)
  density              sparse | balanced | dense
  regions              [header, sidebar, main, footer, overlay] presence flags
  alignment_signal     left | center | right | justify
  max_width_estimate   <int>                   (content column width)
```

Detection method:
- Identify the largest visually balanced grouping by edge alignment.
- Count repeating elements at the same Y or X coordinate (rows or
  columns).
- Measure the consistent pixel gap between repeats; the smallest
  consistent gap is the `gap_px_estimate`.
- Density: ratio of foreground pixels to total background area
  inside the content region (sparse < 0.30, balanced 0.30–0.55,
  dense > 0.55).

### 2.2 Component boundary identification

Walk the image, detect discrete components, label each.

```
For each component:
  type            button | input | card | nav-item | table-row | badge |
                  modal | toast | avatar | chart | list-item | divider |
                  hero | logo | icon | text | unknown
  bbox            { x, y, w, h }
  confidence      0.0–1.0
  variant_hints   [<text>, ...]    visual cues that imply a variant
  state_hint      default | hover | active | focus | disabled | error | unknown
  repeating       true | false     (one of N similar shapes)
  repeating_count <int | null>
```

Heuristics for type assignment:
- Bounded rectangle with text + accent fill → button.
- Bounded rectangle with thin border + placeholder/text inside → input.
- Bounded rectangle with multiple child sections separated by
  internal padding → card.
- Repeated horizontal bars with text + chevron → list-item.
- A small chip with token-like text and subtle bg → badge.
- A circle with image OR initials → avatar.
- A row of items along the top of the frame, evenly spaced → nav.

### 2.3 Typography extraction

Per text region in the image, estimate type metrics.

```
For each text region:
  bbox            { x, y, w, h }
  copy            <ocr text>             (best-effort OCR)
  size_estimate   <px>                   (cap height × ~1.4 → px)
  weight_estimate light | regular | medium | semibold | bold | unknown
                                         (stroke-width ratio test)
  family_hint     serif | sans | mono | display | unknown
                                         (presence of serifs at glyph
                                         feet; uniform stroke = mono;
                                         high contrast strokes = display)
  case            uppercase | titlecase | lowercase | mixed
  letter_spacing  tight | normal | wide  (kerning gap ratio test)
  color           <oklch sample>
  role_guess      h1 | h2 | h3 | body | caption | label | code | unknown
                  (size + weight + position rule of thumb)
```

Family hint is a hint, not a guarantee. The matched system's body /
display / mono fonts are used in generation regardless. If the
screenshot's family hint disagrees with the system's family, log it
as an assumption.

### 2.4 Color sampling

Sample colors from semantically meaningful regions.

```
Outputs:
  background_dominant      oklch value
  text_primary             oklch value
  text_secondary           oklch value (estimated from lower-contrast text)
  accent_candidate         oklch value (most-saturated repeating color)
  status_colors            { success?, warning?, error?, info? }
                           (only when distinct status indicators detected)
  mode                     light | dark   (background L < 0.30 → dark)
  warmth                   warm | cool | neutral
                           (hue of background neutral)
```

Sampling method:
- Take the median color of a 20×20 patch from the largest flat
  background area for `background_dominant`.
- Take the median color of long horizontal text strokes for
  `text_primary`.
- Run k-means (k=8) on the foreground; the most chromatic cluster
  with C > 0.10 is `accent_candidate`.

Convert all sampled values to oklch immediately. The screenshot
itself is sRGB; the conversion is via Cam16 → oklch — accept ±0.01
L drift.

### 2.5 Spacing rhythm

Identify the base spacing unit of the image.

```
Outputs:
  base_unit_estimate    4 | 6 | 8 | 12 | unknown
  consistent            true | false       (does it stay consistent?)
  observed_stops        [<int px>, ...]    distinct gap values found
  outliers              [<int px>, ...]    gaps that don't snap
```

Detection:
- Collect every detectable padding/margin/gap value from component
  boundaries.
- Test divisibility by 4, 6, 8, 12. Highest-rate divisor wins.
- An outlier is any value that's not a multiple of the chosen base.

### 2.6 Interactive element hints

For each component identified as interactive, classify the visual
treatment.

```
Buttons:
  treatment        raised | flat | ghost | outline | unknown
                   (raised = subtle shadow; flat = solid no shadow;
                    ghost = no fill; outline = border + transparent fill)
  intent           primary | secondary | destructive | unknown
                   (most-saturated → primary; muted → secondary;
                   warm-red → destructive)

Links:
  color            oklch value
  underline        true | false
  weight           regular | medium

Inputs:
  treatment        bordered | filled | underlined | unknown
  state            empty | populated | error | focus | disabled

Cards:
  clickable        true | false   (subtle hover affordance, chevron, link arrow)
```

These guide variant selection in STEP 3 — they don't dictate.

### 2.7 Iconography + imagery

```
Icons detected:
  count                 <int>
  style                 line | solid | duotone | mixed | unknown
  stroke_weight         thin | regular | bold | unknown
  vendor_hint           lucide-like | heroicons-like | phosphor-like | unknown

Images detected:
  count                 <int>
  treatment             photo | illustration | abstract | brand-shape
  rounded               none | sm | md | lg | full
```

Vendor hint is best-effort (visual fingerprinting); generation uses
whatever the codebase already imports.

---

## 3. STEP 2 — MATCH TO CODEBASE

Match identified components to existing implementations BEFORE
generating any new code.

### 3.1 Pre-requisite

Run `modules/04-codebase-scan.md` if it hasn't already run in this
session. STEP 2 cannot proceed without `codebase.existing_system`
and `codebase.components` populated.

If `codebase.present == false`:
- Skip §3.2; jump to §3.3 (match against the active design-engine
  component library only).
- Note the absence in the analysis report.

### 3.2 Match against codebase components

For each detected component (from §2.2), find the closest match in
`codebase.components`. Comparison signals:

```
type_match              detected.type aligns with component name (button → button)
variant_match           detected.variant_hints align with cva variants
size_match              detected bbox aligns with size variants (sm/md/lg)
primitives_match        detected interaction signals align with imported
                        Radix / Headless UI primitives
```

Score each candidate. Threshold: combined score ≥ 0.65 → confident
match. Below 0.65 → fall through to §3.3.

When matched:
- Record the component path in the output.
- Record the props that produce the desired variant + size.
- Do NOT regenerate the component. Use it.

### 3.3 Match against design-engine system components

Same procedure as §3.2 but against
`.design-engine/system/components/` (the modules 07/08 output).

Pre-built system shadcn-compatible components are usually a 1:1 match
for codebases that use shadcn. The match resolves naturally.

### 3.4 Compose, don't rebuild

For composite shapes (e.g. a card with header + body + button + badge):
- Match each child against the existing libraries (§3.2/§3.3).
- Generate ONLY the parent composition — a new component that imports
  and assembles the matched children.

Example: a "ProjectCard" detected in the image becomes:

```tsx
// .design-engine/handoff/components/project-card.tsx
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProjectCard({ name, status, onOpen }) { /* ... */ }
```

The `Card`, `Button`, `Badge` imports point at the existing codebase
paths (or the design-engine system fallback when no codebase
component exists).

### 3.5 What gets generated

```
Generated:
  - The composition / wrapper component for the screenshot's overall pattern.
  - Any TRULY NEW primitives the analyzer detected that have no match
    in the codebase or system library (rare — usually nothing).

NOT generated:
  - Any component that matched in §3.2 or §3.3.
  - Any duplicate of an existing component, even if "improved".
```

### 3.6 New-primitive policy

When a detected component scores below 0.65 against everything:

1. First, check if it's actually one of the 14 core components
   under a different visual treatment. If so, generate it as a new
   variant of the existing component (not a new component).
2. If it's genuinely new (e.g. a Stepper that the codebase lacks),
   generate it as a fresh component AND add a `## Assumptions` line
   noting that this primitive isn't covered by the existing system.
3. Never invent more than two new primitives per screenshot. Beyond
   that, the analyzer flags the screenshot as too far from the
   system — the user is asked to either expand the system first
   (`/design system`) or accept lower fidelity.

---

## 4. STEP 3 — GENERATE CODE

Generate the composition component + a sibling notes file. Output
React + TypeScript + Tailwind classes by default (matching
modules 07/08); switch to CSS Modules or styled-components on
codebase signal.

### 4.1 Token enforcement

Same rules as module 08 §2.2:
- Every color, spacing, radius, shadow, font-size, line-height,
  duration is a token reference (CSS variable or Tailwind class).
- Hardcoded values are a defect.
- The same self-audit pass (module 08 §6) runs on output.

The analyzer's sampled values from §2.4 / §2.5 are mapped to the
nearest token in the active system:

```
Detected color  oklch(0.62 0.20 240)
                                     │
                                     ↓ nearest match in tokens
Active system   accent  (oklch(0.65 0.21 244))
                                     │
                                     ↓ used as
Code            bg-accent
```

If the snap distance exceeds:
- ΔL > 0.04 OR Δhue > 8° OR ΔC > 0.04 → log as an assumption ("Detected
  background lighter than `bg-elevated` by ΔL 0.06; mapped anyway. If
  the original tone is required, expand the system or override.").

### 4.2 Composition rules

- Layout via the matched layout strategy from §2.1 (flex / grid).
- Responsive: use Tailwind breakpoints from the active system.
  Stack vertically below `md` if the image showed a multi-column
  desktop layout.
- States: include hover / focus-visible / active / disabled per
  module 08 §2.3 even if the screenshot didn't depict them.
- A11y: same rules as module 08 §2.4.

### 4.3 Variant inference

If the screenshot showed multiple visually similar elements with
clear styling differences (e.g. three buttons: filled, outlined,
ghost), generate them as variants of ONE composition, not three
separate components. Variants follow `cva` (or the codebase's
variant pattern).

### 4.4 Unknown copy

Where OCR couldn't read the text confidently, the generated component
uses props for those slots and lists the slot in notes.md as an
assumption. Never invent copy.

### 4.5 Filename convention

```
.design-engine/handoff/components/<kebab-name>.tsx
.design-engine/handoff/components/<kebab-name>.notes.md
```

Name derives from the dominant component type + a short descriptor:
```
ProjectCard            project-card.tsx
PricingTable           pricing-table.tsx
HeroAuth               hero-auth.tsx
StatGrid               stat-grid.tsx
```

If the screenshot is a full screen (not a single component), the
output is named after the screen (e.g. `dashboard.tsx`) and lives in
`.design-engine/handoff/screens/` instead.

---

## 5. STEP 4 — OUTPUT

### 5.1 Files written

Single-component case:
```
.design-engine/handoff/components/<name>.tsx
.design-engine/handoff/components/<name>.notes.md
```

Full-screen case:
```
.design-engine/handoff/screens/<name>.tsx           or .html
.design-engine/handoff/screens/<name>.notes.md
.design-engine/handoff/screens/<name>.png           original screenshot copied for reference
```

### 5.2 The `.notes.md` format

```markdown
# {Component name}
*generated by image-to-code · system {system.name} · {ISO timestamp}*

## What I detected
- **Layout:** {layout summary in one sentence}
- **Components:** {list of matched and generated components}
- **Color:** {dominant background, text, accent}
- **Typography:** {body family hint, sizes detected}
- **Spacing base:** {detected base unit}
- **Mode:** {light | dark}

## Match results
| Detected | Match | Source | Confidence |
|---|---|---|---|
| Card  | Card     | src/components/ui/card.tsx | 0.92 |
| Button (filled) | Button (variant=primary) | src/components/ui/button.tsx | 0.88 |
| Badge (success) | Badge (variant=success) | system | 0.81 |
| Stepper | (new) | generated | n/a |

## Generated
- **{ComponentName}** — {one-sentence purpose}
- **{Other if any}**

## Tokens used
{Full list — every CSS variable / Tailwind class consumed.}

## Assumptions
{Each assumption is one bullet. Format: WHAT was assumed · WHY · the
fallback used.}

- **Body font size 15px** · OCR yielded 14–16 cluster · used
  `text-sm` (14px from system) — adjust if the source was 16px.
- **Accent hue oklch(0.65 0.21 244)** · sampled from CTA fill at
  ΔL 0.03 vs system accent · mapped to `bg-accent` — no override.
- **Stepper component** · no match in codebase or system library ·
  generated fresh; consider promoting via `/design system`.
- **Toast copy** · OCR couldn't read; left as `{toast.message}`
  prop — pass the actual copy at usage.
- **Hover state** · screenshot showed default only · added a
  hover state per module 08 conventions.

## Reference
- Source screenshot: `screens/{name}.png`
- Original brief: {brief summary line}

## Promotion
```
cp .design-engine/handoff/components/{name}.tsx ./src/components/
```
```

### 5.3 Notes section requirements

- Every assumption rendered. Empty `## Assumptions` is allowed only
  when the analyzer reported zero ambiguity flags.
- Match results table — exhaustive. Every detected component is a
  row. No `etc.`.
- Tokens used — exhaustive list, same rule as module 08 §4.

### 5.4 Parallel image handling

When multiple screenshots were attached:

1. Run STEPS 1–3 per image, in parallel.
2. Cross-image deduplication: if two images yielded the same generated
   component name, merge their assumptions, keep the higher-confidence
   matches, and emit one file. Document the merge in notes.md.
3. Final output: one `.tsx` + `.notes.md` per distinct generated
   thing, plus a top-level `image-to-code.report.md` summarizing the
   set.

---

## 6. Verification — Same Self-Audit As Module 08

Before output is finalized, the same audit checks from module 08 §6
run on every generated file:

```
1. No hex / rgb / hsl literals in JSX.
2. No raw px values except 0, 1px, 9999px.
3. No box-shadow string literals.
4. No bare :focus.
5. No <div onClick>.
6. Notes file exists, all sections present, assumptions section
   either populated or explicitly empty (no "[TODO]").
7. Imports point at real, existing paths in the codebase or system.
```

Failures block handoff. Module 15 re-runs the same checks.

---

## 7. Status Output

```
Image-to-code · analyzing screenshot · matching to codebase (12 components found) · generating composition · 0 hardcoded values · writing notes ...
```

After:

```
Image-to-code ready: .design-engine/handoff/components/
  Detected:    14 components · 4 layouts · accent oklch(0.65 0.21 244)
  Matched:     12 to codebase (87%) · 2 from system library
  Generated:   1 composition (ProjectCard) + 0 new primitives
  Tokens:      18 used · 0 hardcoded values
  Assumptions: 4 logged → see project-card.notes.md
```

---

## 8. Output

This module emits:
- The generated component(s) + their notes files.
- An `image-to-code.report.md` at
  `.design-engine/handoff/` summarizing the run.
- Updates to the "What I Know" object:
  ```yaml
  image_to_code:
    ran_at:           <ISO>
    inputs:           [<file>, ...]
    detected:         <int>
    matched:          <int>
    generated:        <int>
    new_primitives:   <int>
    assumptions:      <int>
    files:            [<path>, ...]
  ```

Hand off to:
- module 09 (canvas) when the broader command also requested screen
  generation.
- module 15 (critique) directly when the run is image-to-code-only
  (the user attached a screenshot and didn't ask for canvas /
  prototype).

End of image-to-code.
