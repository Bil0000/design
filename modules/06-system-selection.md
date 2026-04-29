# 06 — System Selection

The selection UI for `/design system`. Reads the "What I Know" object,
shows a 16-option menu, captures choice + adaptation, then instantiates
the chosen system into `.design-engine/system/`.

This module is gated to `/design system`. Other commands skip directly
to module 07 (which uses the saved or AI-derived system without asking).

---

## 1. Activation Conditions

Run when:
- Command is `/design system`, AND
- `.design-engine.json` has no `system` set OR user said "pick a new
  system" / "switch system" in the message.

Skip when:
- `.design-engine.json` has `system` set AND brief unchanged →
  re-use, hand off to module 07.
- User explicitly named a system in the brief ("use saas-dark") →
  pre-select that option, jump to §4 (adaptation).

---

## 2. The Selection Menu — Exact Format

Print this block. Numbers are single-key replies. Letter keys are
reserved for adaptation (§4). WAIT for one of: a number 1–16, or
the letter `?` for help.

```
┌─ Pick a design system ─────────────────────────────────────────────┐

  PRE-BUILT (1–12)
   1. linear            Dark · dense · precise · monochromatic        ← devtools
   2. vercel            Black/white precision · doc-grade typography  ← docs/marketing
   3. stripe            Authoritative · financial-grade · trust       ← fintech/SaaS
   4. raycast           Premium dark · frosted · power-user density   ← productivity
   5. notion            Warm neutrals · content-first · readable      ← content tools
   6. saas-light        Modern SaaS light · Cal.com / Loom territory  ← general SaaS
   7. saas-dark         Modern SaaS dark · Resend / Planetscale       ← devtools/SaaS
   8. mobile-ios        iOS HIG · SF Pro · native patterns            ← iOS apps
   9. mobile-material   Material You · dynamic color · Android        ← Android apps
  10. editorial         Serif display · magazine-grade · long reads   ← publications
  11. minimal           Extreme restraint · 1 accent · max whitespace ← portfolio/agency
  12. enterprise        High density · A11Y AA+ · conservative        ← enterprise tools

  AI-GENERATED (13–16)
  13. From codebase     Extract a system from this project's existing tokens
  14. From Figma        Pull tokens + components from a Figma file (MCP)
  15. From brief        Generate a fresh system tuned to your description
  16. AI decides        Recommend the best fit, with reasoning ← (default)

└─ Reply with a number, or "?" for details. Default: 16 ─────────────┘
```

### 2.1 Behavior

- Bare Enter → 16.
- Number out of range or non-numeric (other than `?`) → re-print with
  "Pick 1–16."
- `?` alone → print one extended sentence per option (the `←` hints
  expanded into one line each), then re-print the menu.
- `? <n>` → print the long description for system n (see §3 below)
  and re-print the menu.

---

## 3. Pre-Built System Long Descriptions

Used when the user types `? <n>`. Each entry: who it fits, the
defining decisions, what to AVOID picking it for.

```
1. linear
   Fits: developer tools, issue trackers, internal power-user products.
   Decisions: dark base oklch(0.10 0.005 264), 13px body, 6px radius,
   monochrome accent ladder, mono in nav numerals, 100/150ms motion.
   Avoid for: consumer products, anything where accessibility-first
   beats density.

2. vercel
   Fits: documentation sites, developer marketing, hosting/infra.
   Decisions: pure white / pure black, radius 0, no shadows, body 16px,
   maximum contrast everywhere, no decoration.
   Avoid for: warm consumer apps, content products needing softness.

3. stripe
   Fits: fintech, payment, anything requiring trust + warmth.
   Decisions: warm off-white bg, multi-hue palette with restraint,
   serif display optional, dense data tables, 150ms motion.
   Avoid for: brutalist or austere brands.

4. raycast
   Fits: productivity launchers, power tools, command-driven apps.
   Decisions: oklch dark base, frosted glass with purpose,
   keyboard-first interaction, mono in chrome, accent at 0.18 chroma.
   Avoid for: low-density marketing or consumer products.

5. notion
   Fits: content tools, docs, note-taking, knowledge bases.
   Decisions: warm neutrals (H 60–80), Inter + Charter pairing,
   16–17px body for long reading, generous spacing, soft surfaces.
   Avoid for: dense data products.

6. saas-light
   Fits: general SaaS, scheduling, video, collaboration (Cal/Loom).
   Decisions: light background, balanced density, one brand accent,
   subtle shadows, 14–15px body, 8px radius.
   Avoid for: devtools, enterprise.

7. saas-dark
   Fits: modern devtools/SaaS dark mode (Resend, Planetscale, Railway).
   Decisions: oklch grey ramp 0–950, border-elevation system,
   accent ladder, 14px body, 6px radius, 100/150/250 motion.
   Avoid for: marketing-grade or consumer products.

8. mobile-ios
   Fits: native iOS feel, App Store apps.
   Decisions: SF Pro, iOS HIG spacing, 17px body baseline, sheet/blur
   surfaces, large titles, native gestures.
   Avoid for: web products.

9. mobile-material
   Fits: native Android feel, Material 3 / Material You.
   Decisions: Roboto / Google Sans, dynamic color tokens, elevation
   surfaces, FAB-pattern actions, 16px body baseline.
   Avoid for: iOS-only products, web products.

10. editorial
    Fits: magazines, long-form publications, publishers.
    Decisions: serif display + serif body, 18px body, generous line
    height (1.7), 1.250 (Major Third) ratio, drop caps allowed.
    Avoid for: dense product UI.

11. minimal
    Fits: portfolios, agency sites, single-product brands.
    Decisions: 1 accent max, max whitespace, 1.333 ratio, no shadows,
    radius 0 or 2px max, slow 300ms motion on hero only.
    Avoid for: information-dense products.

12. enterprise
    Fits: enterprise tools, government, accessibility-first products.
    Decisions: WCAG AAA contrast where possible, 14px body baseline,
    visible focus rings always, dense tables, conservative type.
    Avoid for: consumer brands, anything requiring delight.
```

---

## 4. AI-Generated Options (13–16)

### 4.1 Option 13 — From codebase

Triggers `modules/04-codebase-scan.md` (skip if already run). Builds a
system from:

```
- tailwind.config.ts theme.extend (colors / fonts / spacing / radius / shadow)
- :root custom properties from globals.css / tokens.css
- @font-face declarations
- components/ui/ inventory (variants imply token expectations)
- Logo SVG color extraction
```

Pipeline:
1. Walk every captured value through the same TOKENIZE pass module 03
   uses (Step 4 of the clone engine). This produces a clean
   primitive → semantic → component layered system.
2. Fill gaps from the closest pre-built template (chosen by closest L
   on bg-base + closest accent hue).
3. Mark the system as `from-codebase` in `.design-engine.json`.
4. If the codebase had conflicts (module 04 §3.2), surface them ONE
   more time as a confirmation block before instantiation:

   ```
   Conflict: --primary in globals.css = #4F46E5
             colors.primary in tailwind.config = #6366F1

   Pick one for the system source of truth:
     [1] globals.css value (#4F46E5)
     [2] tailwind value (#6366F1)
     [3] Average to #5A4DDC and use that
   ```

### 4.2 Option 14 — From Figma

Hand off to `modules/13-figma-pull.md`. Requires Figma MCP connected.

Pipeline:
1. If `figma.file_key` already set in "What I Know", use it. Otherwise
   prompt:
   ```
   Paste the Figma file URL or key:
   ```
2. Module 13 returns `figma.variables`, `figma.styles`, `figma.components`.
3. Run TOKENIZE on the result (same pass as 4.1) — Figma variables
   become primitives, styles become semantics, components become
   component tokens.
4. Mark the system as `from-figma` and store `figmaFileKey` in config.
5. If Figma MCP is not connected:
   ```
   Figma MCP not connected. Connect it (Settings → MCP) and run
   /design system again, or pick another option (1–13, 15, 16).
   ```

### 4.3 Option 15 — From brief

Pipeline:
1. Confirm the brief (`brief.identity` + `brief.aesthetic` +
   `brief.audience` must be set; if any are missing run a 1-question
   reach into module 02).
2. Hand off the brief to `modules/07-design-system-gen.md` with an
   `origin: from-brief` flag. Module 07 generates from scratch using:
   - The brief's accent hue (or a derived one from logo)
   - The closest pre-built skeleton matched to the brief's
     personality_words
   - Modifications layered on top per ambition level
3. Mark the system as `custom` in `.design-engine.json`.

### 4.4 Option 16 — AI decides (default)

This is the default and the most important option. The AI makes a
recommendation with explicit reasoning, shows it, and proceeds only
on user approval (or auto-accepts after 10 seconds in non-interactive
mode — but always prints the reasoning first).

Reasoning chain — execute every step in this exact order:

```
STEP 1. READ CODEBASE SIGNALS (if codebase.present)
   Inputs: codebase.stack, codebase.existing_system
   Decisions surfaced:
     - mode (light/dark/both) from current theme strategy
     - density baseline from current body font-size
     - radius preference from existing components
     - motion presence (does the project animate?)
   If codebase says "Tailwind + shadcn dark" → systems
     7 (saas-dark), 4 (raycast), 1 (linear) bias upward.

STEP 2. RESEARCH COMPETITOR POSITIONING (use research.competitors
   from module 05)
   Decisions surfaced:
     - what's standard in this category
     - what's underused (the differentiation opportunity)
   If category = devtools and three competitors all do dense dark →
     system 1 (linear) or 7 (saas-dark) score high.
   If category = fintech → system 3 (stripe) scores high.
   If category = content / blog → systems 5 (notion), 10 (editorial)
     score high.

STEP 3. EXTRACT BRAND SIGNALS (logo / screenshot)
   Inputs: visual_inputs.logo, visual_inputs.ui_screenshots
   Decisions surfaced:
     - brand hue (warm / cool / neutral)
     - geometric vs organic
     - serif vs sans personality
   These act as TIE-BREAKERS, not lead signals.

STEP 4. REASON ABOUT AUDIENCE SOPHISTICATION
   Inputs: audience.segment, audience.technical_level
   Mapping:
     developer + technical    → 1, 7, 4
     business + mixed         → 6, 3
     consumer + non-technical → 5, 10, 11
     enterprise               → 12, 3
     creator / agency / brand → 11, 10, 2

STEP 5. APPLY AMBITION LEVEL
   Ambition A → bias toward conservative templates (6, 12, 5).
   Ambition B → balanced (default mappings).
   Ambition C → distinctive templates (1, 4, 11).
   Ambition D → unlock 10 (editorial) or any system + heavy
     adaptation. May propose `from-brief` (option 15) instead.

STEP 6. SCORE EACH PRE-BUILT (1-12) AND PICK TOP 3
   Score = sum of weights from steps 1–5.
   Codebase weight: 3
   Competitor / category weight: 3
   Brand signals weight: 1 (tie-breaker)
   Audience weight: 2
   Ambition weight: 2
   Pick the top-scoring system as the recommendation. Pick #2 and #3
   as alternates to mention.

STEP 7. PRESENT THE RECOMMENDATION
```

Output format for STEP 7:

```
AI recommendation: <system-name>

Why:
  • <signal>: <evidence from the brief / codebase / research>
  • <signal>: <evidence>
  • <signal>: <evidence>

Alternates if you want a different direction:
  • <alt 1>  — <one-line on what would change>
  • <alt 2>  — <one-line on what would change>

Proceed with <recommended>?
  [Y] Yes (default)
  [1–12] Pick a pre-built directly
  [13/14/15] Switch to codebase / Figma / brief instead
  [B] Blend <recommended> with another → I'll ask which
```

Worked example for "redesign my analytics SaaS dashboard, dark mode,
power-user, codebase is Next.js + Tailwind + shadcn":

```
AI recommendation: saas-dark (#7)

Why:
  • Codebase: Next.js + Tailwind + shadcn already in dark mode →
    systems 1, 4, 7 are native fits. Of those, 7 is the closest
    structural match to shadcn defaults.
  • Category: analytics SaaS — three competitors (Vercel Analytics,
    Plausible, Posthog) cluster on saas-dark territory; differentiation
    space is in micro-interaction polish, not the base palette.
  • Audience: power-user technical → density-leaning system.
  • Ambition: B — saas-dark hits "polished and premium" baseline
    without C-level risk.

Alternates:
  • linear (#1) — denser, 13px body, more opinionated. Pick this if
    you want to push closer to a true devtool feel.
  • raycast (#4) — frosted-glass premium dark. Pick this if your
    brand has a "tool you summon" personality.

Proceed with saas-dark? [Y/1–12/13/14/15/B]
```

WAIT for a response. On Y / Enter → continue. On a number → switch.
On B → run the blend prompt (§5).

---

## 5. Adaptation Workflow

After a system is chosen (any of 1–16 resolved to a concrete system),
ask the adaptation question. ONE prompt, three options.

```
Use it how?

  [A] As-is             Generate the system unchanged
  [B] Adapt to my brand Keep structure; swap accent hue + display font
  [L] Blend             Mix with a second system — I'll ask which

Default: B (if a brand signal exists), A otherwise.
```

### 5.1 As-is

Copy the chosen system's files (tokens, components, preview) verbatim
to `.design-engine/system/`. Generate a tokens.figma.json if the user
has a Figma file bound. No adaptation runs.

### 5.2 Adapt to brand

Run the same adaptation procedure as `clone-engine --adapt` (module 03 §5):

```
KEPT (from chosen system):
  - density / spacing / radius / motion / type ratio
  - elevation strategy (shadow vs border)
  - layout layer architecture

SWAPPED (replaced with brand):
  - accent hue + ramp (from logo / brief)
  - display font (from brief)
  - neutral hue rotation (within ±10° of chosen system) toward
    brand's warm/cool preference
```

Write `adapt-delta.md` to `.design-engine/system/` documenting the
delta. Mark `adapted: true` in `.design-engine.json`.

### 5.3 Blend

Prompt:
```
Blend with which system? Pick a number 1–12.
```

After selection, merge using the same priority rules as
`clone-engine --blend` (module 03 §7), substituting "system 1" and
"system 2" for the two chosen pre-built systems. Write
`blend-rationale.md` to `.design-engine/system/`. Mark
`adapted: true`.

---

## 6. Conflict With Existing Project Tokens

When the user picks a system but the codebase already has tokens
defined (module 04 found them), the project's tokens are preserved,
not overwritten. The chosen system writes to `.design-engine/system/`,
not to `src/`. The user manually promotes via the handoff package
(module 16).

If the user explicitly asks "replace my tokens with this system":
- Still write to `.design-engine/system/` first.
- Generate a `migration.md` that lists every existing project token
  with its proposed replacement value and the reasoning.
- Show the user the migration count + sample diff.
- The user runs the actual replacement themselves with `cp` or a
  diff tool. design-engine never edits `src/`.

If the user has an irreconcilable conflict (e.g. their `--primary` is
purple but the chosen system mandates green), generate the system
unchanged AND write the diff. Tell the user:

```
Existing --primary=#5B21B6 doesn't match saas-dark's accent (oklch
0.72 0.22 149 = green). Both are kept: yours in src/, new system in
.design-engine/system/. See migration.md for the proposed swap.
```

---

## 7. Instantiation — How The System Lands In `.design-engine/system/`

After §4 (selection) + §5 (adaptation), produce these files:

```
.design-engine/system/
├── tokens.json                  ← canonical, oklch
├── tokens.css                   ← :root + .dark blocks
├── tokens.ts                    ← typed export
├── tokens.tailwind.js           ← tailwind.config extension
├── tokens.figma.json            ← Figma variables import format
├── tokens.legacy.json           ← hex equivalents for non-oklch tools
├── system.md                    ← philosophy + rules + do/dont
├── system-preview.html          ← self-contained interactive preview (module 07)
├── adapt-delta.md               ← only if adapted
├── blend-rationale.md           ← only if blended
├── migration.md                 ← only if replacing existing project tokens
└── components/
    ├── button.jsx
    ├── card.jsx
    ├── input.jsx
    ├── nav.jsx
    ├── table.jsx
    ├── badge.jsx
    ├── modal.jsx
    └── toast.jsx
```

Token + components copy/derivation:
- For options 1–12: copy from `systems/<name>/` in the skill, then
  apply adaptation if §5 chose B or L.
- For option 13: write tokens derived from codebase. Components are
  copied from the closest pre-built template (matched by stack: shadcn
  → saas-dark/saas-light components).
- For option 14: write tokens derived from Figma. Components fall
  back to the closest pre-built (Figma rarely ships React components).
- For option 15: full generation by module 07. This module hands off
  before instantiating; module 07 owns the file write.
- For option 16: resolves to one of 1–12 (post-recommendation), then
  follows that path.

The component files always reference tokens via CSS variables or
Tailwind class names — never hardcoded values. SKILL.md §6 enforces.

`.design-engine.json` is updated:
```
system:    <name | "from-codebase" | "from-figma" | "custom">
adapted:   <true | false>
version:   bumped patch (or "1.0.0" on first instantiation)
```

---

## 8. "Adapting To Your Project..." Status Output

While instantiation runs (it can take 5–20 seconds when adaptation +
component derivation are involved), print a single status line that
updates as work progresses. Use a one-line format, not a multi-line
log:

```
Adapting saas-dark → your brand · accent ramp · neutral tint · components (3/8) ...
```

Stages, in order:
```
1. Reading chosen system tokens
2. Building accent ramp (only if adapt/blend)
3. Tinting neutral ramp (only if adapt)
4. Resolving conflicts (only if option 13/14)
5. Writing tokens.{json,css,ts,tailwind.js,figma.json}
6. Generating components (1/8 → 8/8)
7. Generating system-preview.html
8. Writing system.md / adapt-delta.md / migration.md
```

After completion, print exactly:

```
System ready: .design-engine/system/<name>/
  Preview: open .design-engine/system/system-preview.html
  Docs:    .design-engine/system/system.md

Next:  /design web   (build screens on this system)
       /design landing
       /design mobile
```

---

## 9. Output

System selection emits:
- The instantiated `.design-engine/system/` (per §7)
- Updated `.design-engine.json` with system name, adapted flag, version
- The "What I Know" object's `system` slot:
  ```yaml
  system:
    name:           <selection>
    origin:         pre-built | from-codebase | from-figma | from-brief
    adapted:        <bool>
    blend_partner:  <name | null>
    instantiated_at: <ISO>
  ```

Hand off to:
- module 07 (system-gen) for option 15, since the system isn't
  instantiated yet — module 07 owns generation from brief.
- module 15 (critique) for any other option, if `/design system` was
  the only command (system-only flow).
- Otherwise → continue to module 08 (component-library), 09 (canvas),
  and so on per the router's plan.

End of system selection.
