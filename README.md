# design-engine

The single design skill for Claude Code. Brief → Design System → Components → Canvas / Prototype → Pixel-perfect handoff.

```
/design web          web app · SaaS · dashboard
/design mobile       iOS · Android
/design system       full design system (tokens + components + preview)
/design landing      marketing · hero · pricing
/design review       8-dimension scored critique
/design import       pull from Figma
/design redraw       redesign from a screenshot
```

---

## What It Does

```
You: /design web — analytics dashboard, dark, power-user

design-engine:
  1. scans your codebase (Next.js, Tailwind, shadcn detected)
  2. researches the category (Vercel Analytics, PostHog, Plausible)
  3. asks 3 questions to fill gaps in the brief
  4. generates a design system at .design-engine/system/
     — tokens.{json,css,ts,tailwind.js,figma.json}
     — 14 components (Button, Input, Card, …)
     — interactive system-preview.html
  5. generates a canvas of all screens
  6. waits for your approval
  7. generates a clickable prototype + Playwright-verifies 24/24 interactions
  8. critiques: 8 dimensions scored, handoff blocked < 7.0
  9. writes HANDOFF.md ready for Claude Code or Cursor
```

Nothing is ever written to `src/`. Everything lives in `.design-engine/`. You promote with `cp` when ready.

---

## How It Compares

| | huashu-design | Claude Design | **design-engine** |
|---|:---:|:---:|:---:|
| HTML output, opens in browser | ✓ | — | ✓ |
| Device frames (iPhone, browser) | ✓ | — | ✓ |
| Animation engine + MP4/GIF | ✓ | — | ✓ |
| Multi-screen canvas | — | ✓ | ✓ |
| Looks-good / Needs-work review gate | — | ✓ | ✓ |
| 5-dimension critique | ✓ | — | — |
| **8-dimension critique** | — | — | ✓ |
| Token system (oklch, 3-layer) | partial | ✓ | ✓ |
| Codebase scanning + extension | — | — | ✓ |
| URL clone with reverse-engineering | — | — | ✓ |
| Figma push **and** pull (MCP) | — | partial | ✓ |
| AI-to-AI HANDOFF.md | — | partial | ✓ |
| Pre-built systems library | — | — | ✓ (12) |
| Playwright-verified prototypes | — | — | ✓ |
| Self-contained interactive preview | — | partial | ✓ |
| Hardcoded anti-slop rules | — | — | ✓ (30+) |
| 20-philosophy Direction Advisor | partial | — | ✓ |

---

## Install

```bash
npx skills add Bil0000/design-engine --skill design-engine
```

Repo: https://github.com/Bil0000/design

Verify:

```
/design system
```

You should see the 16-option selection menu.

---

## Quick Start

```bash
cd your-project
claude
```

```
/design web — modern saas dashboard, dark, power user
```

design-engine asks ≤ 4 questions, confirms the brief, runs the pipeline. After 2–3 minutes:

```
open .design-engine/system/system-preview.html        # the design system
open .design-engine/canvas/<ts>/canvas.html            # all screens
open .design-engine/prototype/<ts>/index.html          # clickable prototype
cat  .design-engine/handoff/HANDOFF.md                 # implementation spec
```

To ship, `cp` from `.design-engine/handoff/` into your project.

---

## Slash Commands

| Command | Output | Typical use |
|---|---|---|
| `/design web` | system + canvas + prototype + handoff | SaaS, dashboards, internal tools |
| `/design mobile` | system + canvas + prototype + handoff (mobile frame) | iOS or Android native |
| `/design system` | system files + interactive preview | Brand-new system, or system-only flow |
| `/design landing` | landing page, full-bleed, optional ambient gradient | Marketing site, hero, pricing |
| `/design review` | critique only | Score an existing design |
| `/design import` | pulls from Figma → system files | Start from a Figma file |
| `/design redraw` | screenshot → composition + handoff | Convert UI screenshot to code |

Every command (except `system` / `review`) asks output mode:

```
[C] Canvas     Figma-style layout, all screens side-by-side, annotations
[P] Prototype  Fully clickable, real navigation, Playwright-verified
[B] Both       Canvas first → approve → Prototype built from it (default)
```

In **Both** mode, prototype generation is gated on canvas approval. Mark each screen Looks good / Needs work in the canvas, reply `approve all`, prototype runs.

---

## Pre-Built Systems

12 systems ship out of the box. Each is a complete token set (oklch colors, type scale with tracking + line-height, spacing, radius, motion) + system docs.

| System | Personality | Pick when |
|---|---|---|
| **linear** | Dark · dense · monochromatic · 13px body · 100ms motion · mono in chrome | Devtools, issue trackers, power-user productivity |
| **vercel** | Pure black / pure white · radius 0 · no shadows · Geist Sans + Geist Mono | Documentation, infrastructure, dev marketing |
| **stripe** | Warm cream bg · authoritative serif option · 100/150ms motion · #635BFF accent | Fintech, payments, billing — trust + warmth |
| **raycast** | Premium dark · frosted glass surfaces · 14px body · brand red accent | Productivity launchers, command-driven apps |
| **notion** | Warm cream paper · Charter serif option · 17px body · 1.7 line-height | Content tools, docs, note-taking |
| **saas-light** | Cal/Loom territory · 15px body · subtle shadows · Inter | General SaaS — the default that lands |
| **saas-dark** | Resend/Planetscale territory · oklch dark ramp · border elevation | Modern SaaS dark mode (canonical template) |
| **mobile-ios** | SF Pro · 17pt body · iOS spacing · 44pt touch · system blue | Native iOS / iPadOS / macOS apps |
| **mobile-material** | Roboto · M3 type scale · 8dp base · FAB pattern · ripple feedback | Native Android, Material 3 |
| **editorial** | 19px serif body · 1.7 line-height · 1.333 ratio · Lyon Display | Magazines, longform publications |
| **minimal** | 80%+ whitespace · 1 accent max · radius 0–2px · single typeface | Portfolios, agencies, premium consumer |
| **enterprise** | IBM Plex · 14px body · AAA contrast option · 2px focus ring always | Government, healthcare, regulated industries |

Pick directly:

```
/design system
> 7      # saas-dark
> B      # adapt to your brand
```

Or let the AI decide:

```
/design system
> 16     # AI decides (default)
```

The AI scores all 12 against your brief + codebase + competitor research, recommends the best fit with reasoning, and offers two alternates.

---

## Clone Engine

Reverse-engineer any public website into a real design system.

```
clone linear.app
```

5-step pipeline runs:

1. **FETCH** — Playwright + computed-styles dump + discovery probes (`/design`, `/brand`, `/docs`)
2. **EXTRACT** — every value from `:root`, `body`, `h1–h6`, `button`, `input`, `[role=card]`, computed
3. **REVERSE-ENGINEER** — 30+ reasoning rules: `body 13px → density-first power user`, `radius 0 → brutalist commitment`, `mono in chrome → devtool identity`, `100ms motion → Stripe-territory micro-interaction`
4. **TOKENIZE** — cluster + snap to canonical 12-stop oklch ramp, fill gaps with same logic
5. **ADAPT** (optional) — keep structure, swap brand surface (accent hue, display font)

Modes:

```
clone linear.app                    full extraction
clone linear.app --adapt            keep density + rhythm + motion, swap brand color/font
clone linear.app --inspect          show decisions before tokenizing
clone --blend linear.app vercel.com merge best decisions from both
```

Every fired rule is logged in `decisions.md`. The handoff cites the reasoning per token.

Worked example for `clone linear.app`:

```
R-T-01  body 13px              density-first, power-user
R-T-08  mono in nav numerals   devtool identity
R-C-05  dark bg L 0.14         modern saas-dark
R-R-02  radius 6px             precise / professional
R-S-01  base 4                 tight spacing
R-E-03  borders not shadows    flat dark territory
R-M-01  100ms transitions      Stripe-territory
R-X-01  compound: power-user devtool
```

---

## Figma Integration

Bidirectional sync via Figma MCP.

**Pull** (use Figma as source of truth):

```
/design import https://figma.com/file/abc/...
```

→ runs `get_variable_defs` + `get_design_context` + `get_libraries` + `get_styles`. Builds `tokens.json`. Logs read-direct vs inferred in `figma-audit.md`.

**Push** (send a generated system back to Figma):

```
push to figma
```

→ Plugin API JS via MCP. Creates the variable collection (Light + Dark modes), color/spacing/radius/duration variables, text styles per scale stop, effect styles, COMPONENT_SET frames per component (every variant × size × state via `combineAsVariants`), plus an Overview page with the full style guide.

Idempotent: re-pushing updates by name, no duplicates. Resumable on partial failure with `--resume`.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Pushed to Figma
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  47 variables · 8 text styles · 4 effect styles · 8 components · 1 overview page
  https://figma.com/design/abc/your-system
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Handoff

The deliverable. `.design-engine/handoff/HANDOFF.md` plus its bundle.

```
.design-engine/handoff/
├── HANDOFF.md                      AI implementation spec
├── README.md                       human-facing
├── design-tokens.{json,css,ts,tailwind.js,figma.json,legacy.json}
├── SYSTEM.md                       system docs
├── critique.json                   8-dimension scores
├── screens/
│   ├── 01-dashboard.png            full-res Playwright screenshot
│   ├── 01-dashboard.html           source HTML
│   ├── 01-dashboard.notes.md       per-element measurements + tokens
│   └── 01-dashboard.spec.json      machine-readable bbox + token map
├── components/
│   └── button.tsx + button.notes.md  (× 14 components)
├── assets/{icons,images,animations,credits.json}
└── verification/{report.html,report.json,screenshots/}
```

Hand off to Claude Code:

```
> Read .design-engine/handoff/HANDOFF.md and implement the dashboard.
```

Hand off to Cursor:

```bash
cp .design-engine/handoff/HANDOFF.md ./CURSOR.md
# then in Cursor: @CURSOR.md implement the dashboard
```

Promote tokens + components into `src/`:

```bash
cp .design-engine/handoff/components/* ./src/components/design/
cp .design-engine/handoff/design-tokens.css ./src/styles/tokens.css
cp .design-engine/handoff/design-tokens.tailwind.js ./tailwind.tokens.js
```

HANDOFF.md is precision-grade: every measurement in px or token name, every interaction with timing + easing, every state enumerated, every ARIA attribute named, every screen with a `DO NOTs` section. The implementing AI ships pixel-perfect with zero clarifying questions.

---

## Critique

8 dimensions, scored 0–10:

```
Philosophy:    9/10
Hierarchy:     8/10
Detail:        9/10
Functionality: 8/10   (Playwright 23/24 ✓)
Innovation:    8/10
Taste:         9/10
Code Quality:  9/10   (0 hardcoded values · 0 a11y violations)
Interaction:   9/10
─────────────────────
Overall: 8.6/10  ✓ HANDOFF APPROVED
```

Gates:

- `< 7.0` → handoff blocked, required fixes listed (each with location + fix snippet)
- `7.0–8.5` → handoff with warnings recorded in HANDOFF.md
- `> 8.5` → approved

Hard blocks regardless of overall: any single dimension < 4, Playwright pass-rate < 0.75, ≥ 5 hardcoded color literals, WCAG AA failure on body text.

Automated checks (deterministic):

- WCAG 2.1 contrast on every text/bg pair (AA + AAA)
- Touch target sizes (44×44 iOS, 48×48 Android)
- Focus ring presence on every interactive
- Hardcoded value grep (hex, rgb, raw px, box-shadow strings, bare `:focus`, `<div onClick>`)
- Playwright interaction verification

---

## Anti-Slop

30+ hardcoded rules in `references/anti-patterns.md`. Sample:

```
NEVER GENERATE:
- Purple/blue gradients as hero or card backgrounds
- Cards with left-side colored border accent
- AI blue (#6366f1 / #8b5cf6) as primary unless requested
- max-w-2xl centered everything
- Glassmorphism without purpose
- Box-shadow transitions on hover (use transform)
- Lorem ipsum in prototypes
- Shadows in dark mode
- Hardcoded color values in components
- More than 3 font sizes per screen

ALWAYS GENERATE:
- oklch() for every color value
- Negative letter-spacing on text ≥ 20px
- One distinctive detail per screen (the screenshottable moment)
- Focus rings on every interactive (focus-visible)
- Real content (real names, real numbers, real timestamps)
- 44×44 touch targets on mobile
```

The critique module greps the rule set against generated code and blocks handoff on violations.

---

## Project Structure (in your project)

```
your-project/
├── src/                            ← never touched by design-engine
├── .design-engine/                 ← safe working area, gitignored
│   ├── system/                     ← active design system
│   ├── canvas/<ts>/                ← canvas mode outputs
│   ├── prototype/<ts>/             ← prototype outputs
│   └── handoff/                    ← final handoff package
└── .design-engine.json             ← config, committed to git
```

`.design-engine.json` is the one file committed. Teammates running `/design` get the same system + brief.

---

## Contributing

### Add a new pre-built system

1. Pick a name and a real-world reference (a company, a magazine, a designer).
2. Read [SPEC.md](SPEC.md) §saas-dark — the canonical template.
3. Create `systems/<name>/` with these 6 files:

```
systems/<name>/
├── system.md             personality, inspired-by, audience, do, don't, license
├── tokens.json           canonical, oklch, full primitive + semantic + component
├── tokens.css            :root + .dark blocks
├── tokens.ts             typed export
├── tokens.tailwind.js    theme.extend
└── tokens.figma.json     Figma variables import format
```

4. Anchor the system on real values. Don't invent — research the reference and capture actual decisions:
   - Body size (the canonical density choice)
   - Type ratio (1.125 / 1.250 / 1.333)
   - Spacing base (4 / 6 / 8 px)
   - Radius personality (0 / 2 / 6 / 8 / 12)
   - Motion ladder (100/150/250 vs 240/300/500 vs custom)
   - Elevation strategy (shadow vs border)
   - Accent hue + chroma at L 0.5–0.7
4. Update `modules/06-system-selection.md` to add your system to the menu (option 1–12 slot).
5. Update `references/design-philosophies.md` if your system is from a school not yet covered.
6. Run `/design system → <your number>` end-to-end. Critique should pass.
7. Open a PR with a screenshot of the rendered preview.

### Add a new module

Modules live in `modules/`. Each module has a single responsibility (router, intake, codebase scan, …). Read [SKILL.md](SKILL.md) §8 for the registry. New modules slot into the pipeline order — don't reorder existing modules.

### Add a new component to the library

1. Pick the component (e.g. `Tooltip`, `Combobox`, `Slider`).
2. Read `modules/08-component-library.md` for the contract.
3. Implement in `systems/saas-dark/components/<name>.jsx` (the canonical reference). Other systems inherit unless they override.
4. Write the sibling `<name>.notes.md`.
5. Pass the self-audit: zero hardcoded values, full ARIA, focus-visible only, transform + opacity animations.

### Reporting bugs

Include:
- The slash command + brief that triggered the bug
- The contents of `.design-engine/critique.json` if generated
- Output of `cat .design-engine.json`
- Stack trace if any

### Skill versioning

design-engine follows semver. Token files in `systems/*/tokens.json` carry their own `version` field — bump on changes that affect existing token references.

---

## License

MIT. Use freely. Modify freely. Ship freely.

Fonts ship with the systems where the licenses allow:

- **OFL** (free for commercial use): Inter, JetBrains Mono, Source Serif 4, IBM Plex, Roboto
- **Apache**: Google Sans
- **Free for use**: Cal Sans (cal.com/cal-sans), Charter
- **Commercial — substitute before shipping**: Geist (Vercel — actually OFL), Lyon, Sohne, Berkeley Mono

Image attribution: prototypes pull from Wikimedia Commons, Unsplash, Met Open Access, NASA. Per-image credits in `assets/credits.json`.

---

## Links

- [SKILL.md](SKILL.md) — master orchestrator (the entry point Claude reads)
- [SPEC.md](SPEC.md) — full specification
- [references/](references/) — anti-patterns, design philosophies, handoff format, more
- [systems/](systems/) — 12 pre-built systems
- [modules/](modules/) — 17 pipeline modules
