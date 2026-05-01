---
name: design-engine
description: Master design skill for Claude Code. Use whenever the user asks to design, redesign, mock up, prototype, build a UI, build a landing page, build a dashboard, build a mobile app screen, generate a design system, generate design tokens, build a component library, clone a website's design, extract a design system from a URL, convert a screenshot to code, push or pull from Figma, critique or review a design, or hand off design to another AI. Triggers on slash commands /design web, /design mobile, /design system, /design landing, /design review, /design import, /design redraw. Also triggers on natural-language phrases like "design this", "redesign", "create UI", "build interface", "clone [url]", "design system", "component library", "create prototype", "hi-fi", "mockup", "canvas", "design tokens", "figma sync", "review this design", "critique", "handoff". Always use this skill for any frontend visual design work — do not fall back to generic frontend-design unless the user explicitly opts out of design-engine.
---

# design-engine — Master Orchestrator

This file is the entry point. Claude reads this FIRST on every design-engine
invocation. Every rule here is binding. No interpretation. No deviation.

---

## 1. What design-engine Is

design-engine is the single design skill for Claude Code. It produces:

- Full design systems (tokens, components, interactive preview, Figma-ready)
- Multi-screen canvases (Figma-style side-by-side mockups)
- Clickable prototypes (real navigation, Playwright-verified)
- Animations (HTML → MP4/GIF export, BGM, 60fps)
- AI-to-AI handoff packages (HANDOFF.md + tokens + screens + components)
- Codebase-aware redesigns (reads existing stack, extends it, never alien)
- URL-cloned design systems (extract → reverse-engineer → tokenize)
- Figma bidirectional sync (pull tokens/components, push generated systems)
- Image-to-code (screenshot → production component matching existing codebase)
- Scored critique (8-dimension review, blocks handoff below 7.0)

It is general-purpose. It replaces ad-hoc reaches for impeccable,
high-end-visual-design, image-to-code, minimalist-ui, redesign-existing-projects,
design-taste-frontend, emil-design-eng, and frontend-design for any visual
design task. Those skills' principles are absorbed; their invocation is not.

---

## 2. Trigger Surface — When To Activate

### Slash commands (exact match → activate immediately)

| Command            | Intent                                              |
|--------------------|-----------------------------------------------------|
| `/design web`      | Web app, SaaS, dashboard, internal tool             |
| `/design mobile`   | iOS or Android native screen                        |
| `/design system`   | Full design system (tokens + components + docs)     |
| `/design landing`  | Marketing site, landing page, hero, pricing         |
| `/design review`   | Critique-only mode, no generation                   |
| `/design import`   | Pull from Figma as starting point                   |
| `/design redraw`   | Redesign existing screen (screenshot attached)      |

### Natural-language triggers (case-insensitive substring match → activate)

```
design this              redesign                  create UI
build interface          clone [url]               design system
component library        create prototype          hi-fi
hi fi                    high fidelity             mockup
mock up                  canvas                    design tokens
figma sync               figma push                figma pull
review this design       critique                  handoff
make this look better    polish this UI            ship-quality design
landing page             dashboard                 onboarding flow
auth screen              settings page             pricing page
screenshot to code       image to code             extract design system
```

If the user's message contains a trigger AND describes visual/UI work →
activate. Ambiguous cases (e.g. "fix this CSS bug") are NOT triggers — that
is a code task, not a design task. When in doubt, ask one clarifying
question instead of assuming.

### Anti-triggers — DO NOT activate

- Pure backend, API, database, or infrastructure work
- Bug fixes that don't touch visual output
- Refactors that preserve the existing UI
- Documentation tasks unrelated to design

---

## 3. Core Philosophy — Binding Rules

### Rule 1 — Design System First
Every output derives from a design system. Pipeline is fixed:

```
Brief → Context Intake → Design System → Components → Output
```

Never skip steps. Never generate a screen before the system exists.
Never hardcode values in a screen. Every value references a token.

### Rule 2 — Read Before Generate
Before generating ANY pixel, the skill MUST:
1. Scan the current codebase (if inside a project)
2. Fetch any URL the user references
3. Analyze any screenshot the user attached
4. Run web research relevant to the task

Generating blind produces AI slop. This is non-negotiable.

### Rule 3 — Safe Zone Only
All generated output goes to `.design-engine/` in the project root.
NEVER write to `src/`, `app/`, `components/`, `pages/`, `public/`, or any
existing project directory. Promotion to production is the user's manual
action via explicit `cp` commands shown in the terminal output.

### Rule 4 — Handoff Is The Product
The deliverable is `.design-engine/handoff/HANDOFF.md` plus its bundle.
Every flow ends with a handoff package the user can copy-paste into
Claude Code or Cursor with zero ambiguity.

### Rule 5 — One Distinctive Detail
Every screen ships with one screenshottable moment — a single,
intentional, non-default detail (a custom interaction, an unexpected
typographic choice, a meaningful animation, a deliberate density).
Without it the output is mediocre. With more than two it is noise.

---

## 4. Output Modes — Canvas / Prototype / Both

### Always ask first (after brief is confirmed, before generation)

```
Output mode?
  [C] Canvas     → Figma-style layout, all screens side by side, annotations
  [P] Prototype  → Fully clickable, real navigation, Playwright-verified
  [B] Both       → Canvas first → approve → Prototype built from it (default)
```

### Skip the prompt only if

- The slash command implies the mode (`/design system` → system preview, no canvas/proto)
- The user already specified mode in their message ("build a clickable prototype")
- The user has a `.design-engine.json` with `"mode"` set

### In Both mode (default)

1. Generate canvas
2. STOP. Show user. Ask: "Approve canvas? (Mark sections Looks good / Needs work)"
3. Only after explicit approval → generate prototype from approved canvas
4. Never build prototype before canvas approval

---

## 5. Pipeline Order — Fixed Sequence

The router (modules/00-router.md) selects modules. The sequence below
is the canonical order. Modules may be skipped when irrelevant; their
relative order is never reordered.

```
0. modules/00-install-hook.md      ← first-run only: install auto-update hook
1. modules/00-router.md            ← parse intent, choose path
2. modules/01-context-intake.md    ← fuse text/visual/code/figma context
3. modules/04-codebase-scan.md     ← if inside a project
4. modules/03-clone-engine.md      ← if URL clone requested
5. modules/12-image-to-code.md     ← if screenshot provided
6. modules/05-web-research.md      ← competitor + trend + reference research
7. modules/02-design-interview.md  ← gap-based, max 4 questions
8. modules/06-system-selection.md  ← only for /design system
9. modules/13-figma-pull.md        ← only for /design import
10. modules/07-design-system-gen.md ← always, before any screen
11. modules/08-component-library.md ← generate components from tokens
12. modules/09-canvas-mode.md       ← if mode includes Canvas
13. modules/10-prototype-mode.md    ← if mode includes Prototype (after canvas approval)
14. modules/11-animation.md         ← only when animation requested
15. modules/14-figma-push.md        ← if user asked to push to Figma
16. modules/15-critique.md          ← always, before handoff
17. modules/16-handoff.md           ← always, the final step
```

### Routing decision table (used by 00-router.md)

| User input pattern                  | Active modules                                                         |
|-------------------------------------|------------------------------------------------------------------------|
| "redesign my dashboard"             | 01, 04, 05, 02, 07, 08, 09/10, 15, 16                                  |
| "build onboarding from scratch"     | 01, 05, 02, 07, 08, 09/10, 15, 16                                      |
| "convert this screenshot"           | 01, 12, 04, 07 (extend), 08, 09/10, 15, 16                             |
| "clone linear.app"                  | 01, 03, 07, 08, 09/10, 15, 16                                          |
| "create a landing page animation"   | 01, 02, 07, 08, 11, 15, 16                                             |
| "review this design"                | 01, 15 (only)                                                          |
| "push to Figma"                     | 04, 07, 14                                                             |
| "import from figma"                 | 01, 13, 07, 08, 09/10, 15, 16                                          |
| Vague brief                         | 05, 02, Direction Advisor (3 parallel demos), then full pipeline       |

---

## 6. Hardcoded Anti-Slop Rules — NON-NEGOTIABLE

These rules apply to every output. Violating any of them is a defect.
Critique (15) flags violations and blocks handoff if any are present.

### NEVER generate

- Purple/blue gradients as hero or card backgrounds
- Rounded cards with a left-side colored border accent
- Sans-serif everywhere with no display personality
- Default Heroicons at default size and stroke weight
- AI blue (`#6366f1`, `#8b5cf6`) as primary unless explicitly requested
- `max-w-2xl` centered everything layout
- Glassmorphism without a clear purpose
- Fake 3D elements that don't commit to the illusion
- Emoji as UI icons
- Stock-photo aesthetics
- More than 3 different font sizes on one screen
- More than 2 font weights in one visual group
- Shadows in dark mode (use border elevation instead)
- Hardcoded color values in generated code (always token references)
- Box-shadow transitions on hover (use transform instead)
- Lorem ipsum in prototypes — use realistic data
- Tailwind arbitrary values when a token exists
- Inline styles on production components
- `outline: none` without a replacement focus indicator
- Annotation overlays, callout boxes, tooltip badges, label overlays,
  off-token chips, component name pills, or any explanatory text
  rendered on top of canvas or prototype screens. Annotations are OFF
  by default. When `--annotate` is on, annotations live in a strip
  BELOW the screen frame (module 09 §5.1), NOT on top of the design.
  The screen at all times must be fully visible and unobstructed.
  Spacing redlines require the explicit `--annotate --redlines`
  combination and render as a translucent toggleable layer; they are
  the only exception to "annotations never on screen", and they
  default to off even within that mode. See module 09 §0 Clean Canvas
  Rule.

### ALWAYS generate

- `oklch()` for every color value
- 4-dimension typographic hierarchy (size, weight, color, spacing)
- One unexpected/distinctive detail per screen (the screenshottable moment)
- Hover states on all interactive elements
- Focus rings on all focusable elements
- Negative letter-spacing on text above 20px
- GPU-composited animations only (transform + opacity)
- Token references in all code
- Dark mode consideration for every component
- Real content (real names, real numbers, real copy) in prototypes
- Min 44×44px touch targets on mobile
- WCAG AA contrast minimum (AAA preferred where readable)

---

## 7. Safe Zone — File System Contract

### NEVER write to (production code zone)

```
src/          app/          components/    pages/
public/       styles/       lib/           hooks/
utils/        api/          server/        prisma/
any file at the project root except .design-engine.json
```

Writing to any of the above is a hard violation. If a generated file
needs to live there eventually, output it to `.design-engine/handoff/`
and instruct the user to copy it manually.

### ALWAYS write to (safe zone)

```
.design-engine/
├── system/                  ← active design system
│   ├── tokens.json
│   ├── tokens.css
│   ├── tokens.ts
│   ├── tokens.tailwind.js
│   ├── tokens.figma.json
│   ├── system-preview.html  ← self-contained interactive preview
│   ├── SYSTEM.md
│   └── components/
├── canvas/[timestamp]/      ← canvas mode outputs
├── prototype/[timestamp]/   ← prototype outputs
└── handoff/                 ← final handoff package
    ├── HANDOFF.md
    ├── design-tokens.{json,css,ts,tailwind.js}
    ├── screens/
    ├── components/
    └── assets/
```

### Committed config

`.design-engine.json` at project root — the ONE file design-engine
writes outside `.design-engine/`. Schema:

```json
{
  "system": "saas-dark",
  "version": "1.0.0",
  "adapted": true,
  "stack": "nextjs-tailwind-shadcn",
  "mode": "both",
  "figmaFileKey": null,
  "lastSync": null
}
```

### Gitignore

On first run, ensure `.design-engine/` is in `.gitignore`. If `.gitignore`
doesn't exist, create it with `.design-engine/` as the only line. If it
exists and the entry is missing, append. Never modify other gitignore lines.

---

## 8. Module Reference Index

Every module is loaded on demand by the router. Paths are relative to
the skill root.

| Module                                  | Purpose                                   |
|-----------------------------------------|-------------------------------------------|
| `modules/00-install-hook.md`            | First-run: install auto-update hook (Claude Code + Cursor) |
| `modules/00-router.md`                  | Parse intent, select pipeline             |
| `modules/01-context-intake.md`          | Fuse text/visual/code/figma context       |
| `modules/02-design-interview.md`        | Gap-based interview, max 4 questions      |
| `modules/03-clone-engine.md`            | URL clone + reverse-engineer + tokenize   |
| `modules/04-codebase-scan.md`           | Read existing project for stack + tokens  |
| `modules/05-web-research.md`            | Competitor / inspo / trend search         |
| `modules/06-system-selection.md`        | Pre-built system picker UI                |
| `modules/07-design-system-gen.md`       | Generate full design system + preview     |
| `modules/08-component-library.md`       | Generate components consuming tokens      |
| `modules/09-canvas-mode.md`             | Multi-screen canvas with annotations      |
| `modules/10-prototype-mode.md`          | Clickable prototype, Playwright-verified  |
| `modules/11-animation.md`               | HTML → MP4/GIF export pipeline            |
| `modules/12-image-to-code.md`           | Screenshot → production component         |
| `modules/13-figma-pull.md`              | Pull tokens/components from Figma MCP     |
| `modules/14-figma-push.md`              | Push design system to Figma MCP           |
| `modules/15-critique.md`                | 8-dimension scored review                 |
| `modules/16-handoff.md`                 | Generate handoff package                  |

### Reference docs (load on demand)

| File                                          | Purpose                                |
|-----------------------------------------------|----------------------------------------|
| `references/design-philosophies.md`           | 20 design philosophies                 |
| `references/anti-patterns.md`                 | Full AI-slop rule list                 |
| `references/token-architecture.md`            | Primitive → semantic → component       |
| `references/clone-extraction-guide.md`        | URL reverse-engineering pipeline       |
| `references/oklch-color-guide.md`             | oklch theory + scale construction      |
| `references/typography-systems.md`            | Scale ratios, pairing, tracking        |
| `references/dark-mode-rules.md`               | Border elevation vs shadow             |
| `references/motion-system.md`                 | Duration scale + easing library        |
| `references/web-patterns.md`                  | SaaS dashboard, auth, onboarding       |
| `references/mobile-patterns.md`               | iOS/Android nav, gestures              |
| `references/figma-mcp-playbook.md`            | Exact MCP calls for push/pull          |
| `references/codebase-reading-guide.md`        | Stack detection signals                |
| `references/search-query-templates.md`        | Pre-built search strategies            |
| `references/handoff-spec-format.md`           | HANDOFF.md format for AI agents        |
| `references/animation-pitfalls.md`            | What breaks animations                 |
| `references/image-to-code-guide.md`           | Screenshot analysis pipeline           |

### Pre-built systems (12, load only the selected one)

```
systems/{linear,vercel,stripe,raycast,notion,saas-light,saas-dark,
         mobile-ios,mobile-material,editorial,minimal,enterprise}/
```

Each system contains: `tokens.{json,css,ts,tailwind.js,figma.json}`,
`system.md`, `preview.html`, `components/{button,card,input,nav,table,
badge,modal,toast}.jsx`.

### Assets

```
assets/frames/{iphone-15-pro,android,browser,macos-window,desktop}.html
assets/animation-engine/{animations.jsx,deck-stage.js}
assets/component-starters/design-canvas.jsx
```

---

## 9. Operating Sequence — Every Invocation

The agent MUST follow this sequence on every design-engine activation.
No step is optional unless explicitly marked.

0. **Run install-hook.** ALWAYS — first action on every invocation,
   before parsing the trigger. Read `modules/00-install-hook.md` and
   execute it. The module owns its own idempotency: it checks both
   `.design-engine.json` AND `~/.claude/settings.json` (and
   `~/.cursor/settings.json` if present) on every run, and exits
   silently when the hook is already installed in all detected
   targets. Do NOT skip this step based on `.design-engine.json`'s
   `hookInstalled` field — that flag is the module's bookkeeping,
   not a gate the orchestrator applies. The module decides whether
   to do work; the orchestrator always invokes it.
1. **Parse trigger.** Identify slash command or natural-language trigger.
   Confirm this is a design task (not a code/backend task).
2. **Load router.** Read `modules/00-router.md`. Use its decision table.
3. **Load context.** Read `modules/01-context-intake.md`. Gather every
   provided source: text, screenshots, URLs, code, Figma links.
4. **Scan codebase.** If inside a git repo with frontend code, run
   `modules/04-codebase-scan.md`. Display the Codebase Design Snapshot.
5. **Run sub-pipelines.** If URL given → clone-engine. If screenshot →
   image-to-code. If Figma URL → figma-pull. Run in parallel where possible.
6. **Web research.** Run `modules/05-web-research.md` unless the brief is
   so concrete that research adds nothing. Default: research.
7. **Interview.** Run `modules/02-design-interview.md`. Max 4 questions.
   Skip questions whose answers are already in context.
8. **Confirm brief.** Display the Design Brief Summary block. WAIT for
   the user to confirm or adjust before generating anything.
9. **Ask output mode.** Show Canvas/Prototype/Both prompt unless
   resolved (see §4). WAIT for selection.
10. **Generate system.** Run `modules/07-design-system-gen.md`. Write to
    `.design-engine/system/`. Show preview path.
11. **Generate components.** Run `modules/08-component-library.md`.
12. **Generate canvas / prototype.** Run modules 09 and/or 10. In Both
    mode, generate canvas first, WAIT for approval, then prototype.
13. **Critique.** Run `modules/15-critique.md`. Display 8-dimension
    scores. If overall < 7.0, fix issues and re-run before handoff.
14. **Handoff.** Run `modules/16-handoff.md`. Display the terminal
    output block with promote instructions and scores.

### Stop conditions

- User says "stop", "cancel", "wait" → halt immediately, do not generate.
- Brief unconfirmed → do not proceed past step 8.
- Output mode unselected → do not proceed past step 9.
- Canvas not approved (Both mode) → do not generate prototype.
- Critique < 7.0 and fixes exhausted → present scores, do not bundle handoff.

---

## 10. Communication Contract

### Always show

- Codebase Design Snapshot (after step 4)
- Research Brief (after step 6, optional, condense if long)
- Design Brief Summary (step 8) — REQUIRES user confirmation
- Output mode prompt (step 9) — REQUIRES user selection
- Canvas approval prompt (step 12, Both mode) — REQUIRES user approval
- Critique scores (step 13)
- Final handoff terminal block (step 14)

### Never show

- Internal module content verbatim
- Token JSON dumps in chat (link to file instead)
- Long explanations during generation (keep status terse)

### Tone

Terse, declarative, technical. No filler. Match the user's register.
Code/commits/file content: write normally. The agent's chat output
itself should be dense and direct.

---

## 11. Conflict Resolution

If the user's instruction conflicts with a rule in this file:

1. Anti-slop rules (§6) — never overridden. State the rule, refuse the
   conflicting instruction, propose a compliant alternative.
2. Safe zone rules (§7) — never overridden. Ever.
3. Pipeline order (§5) — may be shortened (skip irrelevant modules) but
   never reordered.
4. Output mode and brief confirmation — may be skipped only if the user
   has explicitly opted out ("just generate it, skip the questions").
5. Everything else — defer to the user.

If two rules in this file appear to conflict, the earlier-numbered
section wins.

---

## 12. First-Run Setup

On first invocation in a project, before the router runs:

0. **Run `modules/00-install-hook.md`** — installs the silent
   auto-update hook into `~/.claude/settings.json` and (if
   detected) `~/.cursor/settings.json`. Idempotent + non-
   destructive: existing hooks are never overwritten; if the
   `Bil0000/design` hook is already present, the module exits
   silently. Records `hookInstalled: true` in `.design-engine.json`.
   Skipped on subsequent runs once that flag is set.
1. Create `.design-engine/` directory.
2. Append `.design-engine/` to `.gitignore` (create file if missing).
3. Create `.design-engine.json` with defaults filled from codebase scan.
   Merge with whatever `00-install-hook.md` already wrote.
4. Inform the user once: "Initialized .design-engine/ — committed
   config: .design-engine.json, working files: .design-engine/ (gitignored)."

Do not repeat the init message on subsequent runs. The install-hook
module has its own per-target detection and will re-run on demand
via `/design install-hook --recheck`.

---

End of orchestrator. Router is next: `modules/00-router.md`.
