# 15 — Critique

8-dimension scored review. Runs after generation, before handoff.
Combines AI-judged design quality with deterministic automated
checks. Output is `.design-engine/critique.json` + a chat block with
scores and fixes. Handoff is gated on the result.

Inputs: everything in `.design-engine/system/`,
`.design-engine/canvas/<latest>/`,
`.design-engine/prototype/<latest>/`. Plus
`prototype/.../verification/report.json` if module 10 ran.

Two binding rules:

> **Automated checks are deterministic.** They produce numbers, not
> opinions. WCAG ratios, touch sizes, hardcoded-value grep, focus
> rings, Playwright pass-rate — all measured, not judged.
>
> **Fixes are concrete.** Every flagged issue carries a specific
> location (file + selector) and a copy-pasteable fix snippet.
> "Improve hierarchy" is not a fix. "Set `font-size: var(--text-2xl)`
> on `.dashboard-title` instead of `text-lg`" is.

---

## 1. Activation

Run after the last generative module of the active flow:

- After module 07 for `/design system`.
- After module 10 for `/design web|mobile|landing|redraw|import` in
  Both / Prototype mode.
- After module 09 for Canvas-only mode.
- Direct (no upstream generation) for `/design review` — operates on
  whatever exists in `.design-engine/`.
- After module 11 for animation flows.
- After module 14 for `/design system push`.

Always run before module 16 (handoff). Module 16 reads this output
and may block.

---

## 2. The 8 Dimensions

Each scored 0–10. The first five inherit huashu's vocabulary; the
last three integrate the user's existing skills' principles.

### 2.1 Philosophy Consistency

Does every choice serve the same intent? Are the system, screens,
components, and copy aligned to one design philosophy?

```
Evaluate:
  - Does the system pick a school (references/design-philosophies.md)
    and stay in it?
  - Does the brief's stated personality match the rendered output?
  - Are anti-words (the "avoid" list) actually avoided?
  - Are competing philosophies leaking in (e.g. brutalist radius 0
    + soft shadows + playful display font = three schools fighting)?
  - Are voice + visuals saying the same thing?

10/10  Every screen could be cropped without context and still feel
        like the same product. The brief's personality words are
        readable in the design.
5/10   The system is okay; some screens drift toward the comfortable
        SaaS default. A reader could plausibly mistake this for a
        different brand.
Common failure patterns:
  - System says "minimal" but screens use 4 different accent hues.
  - Brief says "premium" but the chosen radius scale is generic 8 px
    everywhere.
  - Display font is a strong personality face but the rest of the
    screen reverts to neutral defaults.
```

### 2.2 Visual Hierarchy

Is the information ordered by importance? Does the eye know where to
land first?

```
Evaluate:
  - Per screen, identify the primary action / message. Is it visually
    dominant by size, weight, color, OR placement?
  - Are secondary elements clearly de-emphasized (size, weight,
    color)?
  - Are there competing focal points (two big things shouting)?
  - Are spacing rhythms consistent? (Inconsistent gaps fragment
    hierarchy.)
  - Are headings actually larger than body, with negative tracking
    on display sizes?

10/10  First scan: the user's eye lands exactly where the designer
        intended. No competing focal points. Hierarchy reads at
        thumbnail size.
5/10   Hierarchy works in the central screen but breaks on edges
        (header / footer compete with main).
Common failure patterns:
  - Two h1-equivalents on the same screen.
  - Body text and tertiary text at the same color (no L step
    between them).
  - Cards with equal weight competing for primary attention.
  - Buttons all at the same prominence — no clear primary CTA.
```

### 2.3 Detail Execution

The thousand small things. Borrowed from huashu + the user's
"impeccable" skill principles.

```
Evaluate:
  - Negative tracking on every text size ≥ 20 px.
  - Optical alignment of icons to text baselines.
  - Consistent corner radius (no mix of 4/6/8 by accident).
  - Pixel-perfect spacing snap (no 17 px gaps).
  - Hover, focus-visible, active states present on every interactive.
  - Touch targets ≥ 44×44 (mobile).
  - Real content (no Lorem ipsum, no "Click me", no placeholder
    avatars).
  - Empty states designed (not just "No data").
  - Error states designed (not just red borders).
  - Loading states with skeletons or spinners (not blank).
  - One distinctive detail per screen (the screenshottable moment).

10/10  Every interaction has been considered. There is exactly one
        screenshottable moment per screen. Spacing snaps to tokens.
        Reduced-motion is handled.
5/10   The default states are fine; hover/focus are uneven; one
        screen has Lorem ipsum.
Common failure patterns:
  - Focus rings missing or replaced by `outline: none`.
  - Hover state is "just a darker color" with no easing.
  - Empty state is a centered "Nothing here" with no illustration or
    CTA.
  - Button text is "Click me" / "Submit" instead of the actual
    intent.
```

### 2.4 Functionality

Does it work? Are interactions wired? Do form inputs accept input?
Do modals trap focus?

```
Evaluate:
  - Playwright report: all interactions verified.
  - Every [data-route] resolves.
  - Forms validate and submit successfully.
  - Modals open + ESC close + click-overlay close + focus trap.
  - Keyboard navigation reaches every interactive.
  - aria-* attributes present and consistent with state.
  - prefers-reduced-motion respected.
  - Mobile-only: no horizontal scroll, touch targets ≥ 44.

10/10  Playwright run is 100% green. Every assertion passed without
        retries.
5/10   Most things work; the form on settings doesn't submit; one
        modal doesn't restore focus on close.
Common failure patterns:
  - Buttons that look interactive but have no handler.
  - Dropdown opens but arrow keys don't navigate.
  - ESC closes modal but focus jumps to <body>.
  - Two consecutive Tab presses skip a focusable element.
```

### 2.5 Innovation

Does the design have at least one decision that wasn't grabbed from
the SaaS default catalog? At ambition C / D, this dimension carries
more weight.

```
Evaluate:
  - Identify the most distinctive decision in the system. Is it
    intentional? Is it grounded in the brief?
  - Identify the most distinctive interaction in the prototype. Same
    questions.
  - Are at least N distinctive details present (N=1 for ambition B,
    N=2 for C, N=3 for D)?
  - Does the design break a convention with intent (or just by
    accident)?
  - Does it ALSO show restraint — i.e. not breaking conventions
    randomly?

10/10  Two intentional, brief-grounded distinctive details. Strangers
        would screenshot this. Restraint shown elsewhere (no
        gratuitous risk).
5/10   Polished and clearly professional but indistinguishable from
        another modern SaaS.
Common failure patterns:
  - Every screen is mid-level competent with zero memorable detail.
  - Innovation in the wrong place: hero animation good, settings
    page is generic.
  - Risk-taking that contradicts the brief (playful flourish on a
    fintech product).
```

### 2.6 Taste & Aesthetic Fit

Borrowed from the user's design-taste-frontend skill principles.

```
Evaluate:
  - Color palette is intentional, not "Tailwind defaults".
  - Type pairing makes sense (display + body harmonize, mono is used
    only where mono belongs).
  - No clichés (purple/blue gradients, glass without purpose,
    AI blue primary, max-w-2xl centered everything).
  - Spacing rhythm reads as deliberate, not arbitrary.
  - Density matches audience and ambition.
  - Voice (UI copy) matches visuals.

10/10  The aesthetic is specific and self-aware. The system commits.
        Nothing here is the obvious default.
5/10   It looks fine. It looks like a 2023 SaaS template that's been
        polished. The defaults are not actively wrong.
Common failure patterns:
  - Inter + indigo primary + 8 px radius + slate greys = generic
    SaaS soup.
  - Mixing serif display + script accent + sans body = three
    voices.
  - Heroicons line at default 24 px stroke 2 with no thought to
    whether they suit the system.
```

### 2.7 Code Quality

Borrowed from the frontend-design skill principles.

```
Evaluate:
  - Zero hardcoded values in components (audit pass from module 08
    §6 must succeed).
  - All a11y rules in module 08 §2.4 met.
  - No `<div onClick>` (use button).
  - No `outline: none` without a replacement.
  - Components compose via the existing system; no duplicates.
  - Variants implemented via cva or equivalent, not props that
    branch on if/else inline.
  - Token references (CSS variables / Tailwind classes), never raw
    values.
  - Animations on transform + opacity only.
  - Each component has its sibling .notes.md with all sections.
  - TypeScript types complete (no `any` in props).

10/10  The audit passes silently. Code is copy-paste ready into the
        target codebase with zero edits.
5/10   Most of the audit passes; a handful of files have hardcoded
        values; one component uses `<div role="button">` instead of
        a real button.
Common failure patterns:
  - `style={{ background: '#eee' }}` instead of token reference.
  - Hover state via `:hover` background change AND a transition on
    box-shadow.
  - One component still uses Heroicons defaults; another uses
    Lucide.
```

### 2.8 Interaction Polish

Borrowed from the emil-design-eng skill — the invisible details that
make software feel great.

```
Evaluate:
  - Animation timing matches the system tokens (no off-token 200ms
    when fast/normal/slow are 100/150/250).
  - Easing curves match purpose (out for entering, in for leaving).
  - Hover transitions ≤ 100 ms; meaningful state changes ≤ 250 ms.
  - Active state has tactile feedback (1 px translate, scale 0.98).
  - Focus rings appear on Tab navigation but not on click (focus-
    visible).
  - Loading states are designed; spinners use real SVG or token-
    referenced animation.
  - Reduced motion respected: no shake, no parallax.
  - Toast / modal / drawer entrance is choreographed (not just an
    opacity flash).

10/10  Every interaction feels intentional. The product sells itself
        in 5 seconds of use. No animation feels generic.
5/10   The defaults are fine; some hovers are abrupt; one loading
        state is just a blank background.
Common failure patterns:
  - Press states animate `box-shadow` (off-spec).
  - 300 ms hover transitions (too slow).
  - Fade-in modals with no spatial cue (just opacity).
  - Tab focus and click focus both show a ring (focus-visible
    missing).
```

---

## 3. Automated Checks

These run before AI scoring. They produce facts, not judgments. Each
check writes to `critique.json` under `automated.<check>`. AI scorers
read these results when grading the relevant dimension.

### 3.1 WCAG contrast

Compute APCA OR WCAG 2.1 contrast for every text/bg combination
generated. Default: WCAG 2.1 ratios for portability; APCA reported
alongside as supplementary.

Inputs:
- Every text-* token over every bg-* token in the active mode(s).
- Every accent-text over accent-bg pairing.
- Every status-text over status-subtle pairing.
- Every component layer that overlays text on a bg (button label on
  button bg, badge label on badge bg, table cell text on row bg, etc.).

Thresholds:
```
Body text                   AA   ≥ 4.5  ·  AAA ≥ 7.0
Large text (≥ 18.66 px or
  ≥ 14 px bold)             AA   ≥ 3.0  ·  AAA ≥ 4.5
UI components / graphics    AA   ≥ 3.0
Disabled text               (excluded from WCAG; report only)
```

Output per pair:

```json
{
  "fg": "text-primary", "bg": "bg-base", "mode": "dark",
  "ratio": 14.6, "aa": true, "aaa": true, "size_class": "body"
}
```

Failures cap dimension 2.6 (Taste) at 7 and dimension 2.7 (Code
Quality) at 8 unless they're in disabled / placeholder slots.

### 3.2 Touch target

For every interactive element rendered in mobile screens or device
frames, measure `getBoundingClientRect`:

```
iOS targets:        require ≥ 44 × 44 px
Android targets:    require ≥ 48 × 48 dp
Spacing between adjacent targets:  ≥ 8 px
```

Use Playwright in the prototype's mobile project (already configured
by module 10 §9.1) to walk every `[role="button"]`, `<button>`,
`<a>`, `<input>`, `<select>` and report sizes.

Output:

```json
{ "selector": ".tab-bar a:nth-child(2)", "w": 36, "h": 36, "passed": false, "platform": "ios" }
```

Any failure caps dimension 2.4 (Functionality) at 7 in mobile flows.

### 3.3 Focus ring

For every interactive element, force `:focus-visible` and verify the
computed `outline-width` (or `box-shadow` ring) is ≥ 2 px and
visually distinct from the bg.

Procedure:
1. Playwright: `await element.focus()` after a Tab press (to trigger
   `:focus-visible`).
2. Read `getComputedStyle(el).outline` and `box-shadow`.
3. Verify outline width ≥ 2 px and outline-color contrast vs the
   nearest bg ≥ 3.0.
4. If neither outline nor box-shadow contributes a visible ring, fail.

Failure caps dimensions 2.3 (Detail) and 2.7 (Code Quality) at 6.

### 3.4 Hardcoded values

Run `grep` patterns over every generated component file in
`.design-engine/system/components/` and
`.design-engine/handoff/components/`:

```
1. Hex literals:        grep -E "#[0-9a-fA-F]{3,8}\\b"
2. rgb()/hsl()/oklch literals in JSX/TSX:
                        grep -E "(rgb|rgba|hsl|hsla|oklch)\\("
                        (oklch is allowed in tokens.css; this check
                         targets component source files only)
3. Raw px values not in {0, 1px, 9999px}:
                        grep -E "[^0-9]([2-9]|[1-9][0-9]+)px"
4. box-shadow string literals (e.g. "0 1px 2px ..."):
                        grep -E "box-shadow:|boxShadow:"
                        (then verify each match references a token)
5. Bare :focus without -visible:
                        grep -E ":focus[^-]"
6. <div onClick> patterns:
                        grep -E "<div[^>]*onClick"
```

Each match is recorded with file + line. Failures bring
dimension 2.7 (Code Quality) down by 1 per match (capped at 5 below
ceiling), and surface as required fixes (§5).

### 3.5 Playwright interaction verification

Read `.design-engine/prototype/<latest>/verification/report.json`
(produced by module 10 §9.5).

Compute pass rate:

```
pass_rate = passed / total
```

Mapping to dimension 2.4 (Functionality):

```
pass_rate ≥ 0.98   ceiling 10
pass_rate ≥ 0.90   ceiling  8
pass_rate ≥ 0.75   ceiling  6
pass_rate <  0.75  ceiling  4
```

Each failed test surfaces as a required fix (§5) — the user must
either fix or acknowledge before handoff.

### 3.6 Component audit reuse

Read `.design-engine/system/components/audit.json` (from module 08
§6 + 12 §6). Any failure there lowers dimension 2.7 by exactly the
same logic as §3.4 (single source of truth — no double counting).

### 3.7 Off-token spacing (canvas annotations)

Read `.design-engine/canvas/<latest>/annotations.json`. Count
`off-token` values. Each off-token entry lowers dimension 2.3
(Detail) by 0.5 (capped to a 3-point reduction).

---

## 4. Scoring Pipeline

### 4.1 Dimension scoring

For each of the 8 dimensions:

1. Apply automated check ceilings + reductions per §3.
2. Run an AI scorer pass that reads:
   - The dimension's evaluation criteria (§2).
   - The artifacts in `.design-engine/system/`,
     `canvas/.../canvas.html`, `prototype/.../index.html`,
     `prototype/.../screens/*.html`.
   - The brief.
   - The automated check results.
3. The AI scorer returns:
   - A score (0–10) honoring the ceiling.
   - 0–5 specific issues, each with location + fix.
   - 0–3 highlights (what was done well).
4. Persist to `critique.json`.

### 4.2 Overall score

```
overall = mean of the 8 dimensions
```

Round to 1 decimal. No weighting — at this stage every dimension
matters equally.

### 4.3 Gates

```
overall ≥ 8.5    HANDOFF APPROVED            module 16 runs
7.0 ≤ overall < 8.5  HANDOFF WITH WARNINGS   module 16 runs, warnings recorded in HANDOFF.md
overall < 7.0    HANDOFF BLOCKED             module 16 does not run; required fixes shown
```

Additional hard blocks (regardless of overall):

```
- Any single dimension < 4.0       blocked
- Playwright pass_rate < 0.75      blocked (unless user `--acknowledge`)
- ≥ 5 hardcoded-value matches      blocked (auto-fix is small; just do it)
- WCAG AA failures on body text    blocked
```

Below ambition C, the AA-on-body-text block is the ONLY hard block
beyond pass_rate; other hard blocks downgrade to required fixes.

---

## 5. Required Fix Format

Every issue produced by §3 or §4 is a "fix entry" with this exact
shape:

```yaml
- id:          C-2.7-03
  dimension:   "Code Quality"
  severity:    block | warn | nit
  where:
    file:      .design-engine/handoff/components/project-card.tsx
    selector:  .project-card .meta
    line:      42
  problem: |
    Hardcoded color literal `#374151` in className override.
  fix: |
    Replace with token reference. Two options — pick one:
    
    (a) Tailwind class:
        - className="text-[#374151]"
        + className="text-secondary"
    
    (b) CSS variable:
        - style={{ color: '#374151' }}
        + style={{ color: 'var(--text-secondary)' }}
  rationale: |
    Hardcoded values prevent the component from following dark mode
    and break when tokens change. SKILL.md §6 + module 08 §2.2.
```

### 5.1 ID scheme

`C-<dimension-section>-<sequence>` — e.g. `C-2.7-03` is the third
issue in dimension 2.7 (Code Quality). Stable across reruns when the
underlying issue is the same — module 15 keys by file + selector +
problem hash to keep IDs persistent.

### 5.2 Severity meanings

```
block   handoff is blocked until resolved or `--acknowledge`d
warn    handoff proceeds; warning embedded in HANDOFF.md
nit     informational; not surfaced unless user asks for "all"
```

### 5.3 Fix snippets

Every block-severity fix carries a copy-pasteable snippet (the `fix:`
block above). For diff-style fixes, use the ` - ` / ` + ` convention.
For multi-step fixes, number the steps. Never use vague language like
"consider", "perhaps", "you might".

---

## 6. Output

### 6.1 `critique.json` schema

```json
{
  "ran_at": "<ISO>",
  "system": "<name>",
  "version": "<sem>",
  "ambition": "B",
  "overall": 8.6,
  "gate": "approved | warnings | blocked",
  "blocking_reason": null,
  "dimensions": {
    "philosophy_consistency":   { "score": 9, "issues": [...], "highlights": [...] },
    "visual_hierarchy":         { "score": 8, "issues": [...], "highlights": [...] },
    "detail_execution":         { "score": 9, "issues": [...], "highlights": [...] },
    "functionality":            { "score": 8, "issues": [...], "highlights": [...] },
    "innovation":               { "score": 8, "issues": [...], "highlights": [...] },
    "taste":                    { "score": 9, "issues": [...], "highlights": [...] },
    "code_quality":             { "score": 9, "issues": [...], "highlights": [...] },
    "interaction_polish":       { "score": 9, "issues": [...], "highlights": [...] }
  },
  "automated": {
    "wcag":            { "pairs": <int>, "fail_aa": <int>, "fail_aaa": <int> },
    "touch_targets":   { "checked": <int>, "failed": <int> },
    "focus_ring":      { "checked": <int>, "failed": <int> },
    "hardcoded":       { "matches": <int>, "files": [...] },
    "playwright":      { "total": <int>, "passed": <int>, "pass_rate": 0.96 },
    "off_token":       { "count": <int> }
  },
  "fixes": [ /* §5 entries, severity-sorted */ ]
}
```

### 6.2 Chat output

The terminal block printed to the user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Critique — {system.name} v{version}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Philosophy:    9/10
  Hierarchy:     8/10
  Detail:        9/10
  Functionality: 8/10   (Playwright 23/24 ✓)
  Innovation:    8/10
  Taste:         9/10
  Code Quality:  9/10   (0 hardcoded values · 0 a11y violations)
  Interaction:   9/10
  ─────────────────────
  Overall:       8.6/10   ✓ HANDOFF APPROVED

  3 highlights:
    • Sidebar active indicator slides between items via translateX
    • Empty states use illustrated states with realistic CTAs
    • Border-elevation system in dark mode is consistent across all components

  2 warnings (non-blocking):
    • Settings form: toast not visible after submit (Playwright)
    • Pricing card: shadow used in dark mode (one occurrence)

  See: .design-engine/critique.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Blocked variant:

```
  Overall:       6.4/10   ✗ HANDOFF BLOCKED

  Blocking reasons:
    • Code Quality: 5 hardcoded color literals in components/
    • Functionality: Playwright pass rate 0.71 (below 0.75)
    • WCAG: text-secondary on bg-elevated fails AA (3.8:1)

  Required fixes (3):
    [C-2.7-01] components/project-card.tsx:42 — replace #374151 with text-secondary
    [C-2.7-02] components/badge.tsx:18       — replace #FACC15 with var(--warning)
    [C-2.4-01] settings form submit          — toast portal mounted outside frame

  Fix and re-run, or run with --acknowledge to ship as-is.
```

### 6.3 system-preview integration

The Critique Report section of `system-preview.html` (module 07
§2.13) reads `critique.json` to render scores + issues inline. No
re-rendering needed; the preview is data-driven.

---

## 7. Re-Run Behavior

After fixes are applied, re-running this module:

1. Re-runs all automated checks.
2. Re-runs the AI scorers on the dimensions whose underlying
   artifacts changed (computed via file hashes — unchanged dimensions
   keep their previous scores to save tokens).
3. Issues that no longer apply are dropped.
4. New issues get fresh IDs.
5. Persistent issues keep their IDs.

---

## 8. Output

This module emits `critique.json`, prints the §6.2 chat block, and
populates the "What I Know" object:

```yaml
critique:
  ran_at:           <ISO>
  overall:          <float>
  gate:             approved | warnings | blocked
  blocking_reasons: [<one-liner>, ...]
  fix_count:        { block: <int>, warn: <int>, nit: <int> }
  json_path:        .design-engine/critique.json
```

Hand off to:
- module 16 (handoff) — only when `gate ∈ {approved, warnings}` or
  the user invoked `--acknowledge` after a blocked critique.

End of critique.
