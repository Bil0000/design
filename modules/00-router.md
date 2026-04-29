# 00 — Router

Traffic director for design-engine. Runs first on every invocation.
Reads user input + attached context. Outputs a deterministic execution
plan: command mode, active modules, order, output mode, entry point.

This module decides. It does not ask the user what to do unless input
is genuinely ambiguous (see §7). Default behavior: route, don't suggest.

---

## 1. Inputs The Router Reads

### From the user message

- Slash command (exact prefix match): `/design web|mobile|system|landing|review|import|redraw`
- Trigger phrases (substring, case-insensitive — see SKILL.md §2)
- URLs (any `http(s)://...` token)
- File attachments (screenshots, logos, mood-board images, exported frames)
- Code blocks (CSS, JSX, JSON tokens, package.json snippets)
- Figma references (`figma.com/file/...`, `figma.com/design/...`, file keys)
- Flags: `--clone`, `--adapt`, `--inspect`, `--blend`, `--canvas`, `--prototype`, `--both`, `--no-research`, `--mode=...`, `--ambition=A|B|C|D`

### From the environment

- Current working directory + git repo presence
- Existence of `package.json`, `tailwind.config.*`, `app/`, `pages/`, `src/`
- Existence of `.design-engine/` (init state)
- Existence of `.design-engine.json` (config + saved mode/system)
- Connected MCP servers (Figma MCP availability for push/pull)

### Context type inventory (every possible source — full list)

```
Text:    URL, description, competitor names, vibe references, brand words
Visual:  screenshot, logo, mood board, exported Figma frames, photos
Code:    live codebase, GitHub URL, pasted CSS, pasted tokens, package.json
Figma:   file URL, frame URL, library URL, file key
Config:  .design-engine.json (system, mode, stack, figmaFileKey)
Flags:   CLI flags listed above
```

The router enumerates which of these are present and stamps a Context
Inventory before routing.

---

## 2. Command Detection — Decision Order

Apply in order. First match wins.

```
1. Explicit slash command       → use that command's mode
2. Explicit flag (--mode=X)     → use that mode
3. Phrase match (table §3)      → infer command
4. URL-only message             → /design web with --clone
5. Image-only message           → /design redraw
6. Figma URL only               → /design import
7. Otherwise                    → ambiguous, see §7
```

---

## 3. Phrase → Command Inference Table

Substring match, case-insensitive. First row that matches wins.

| Phrase contains                                                | Command           |
|----------------------------------------------------------------|-------------------|
| "design system", "tokens", "component library"                 | `/design system`  |
| "landing", "marketing site", "hero", "pricing page"            | `/design landing` |
| "mobile", "ios", "android", "app screen"                       | `/design mobile`  |
| "review", "critique", "audit"                                  | `/design review`  |
| "import from figma", "from figma", "pull figma", "figma file"  | `/design import`  |
| "redraw", "redesign this screenshot", "convert this screenshot"| `/design redraw`  |
| "redesign", "rebuild ui", "fix the design"                     | `/design web`*    |
| "dashboard", "saas", "admin", "internal tool", "settings page" | `/design web`     |
| "clone <url>"                                                  | `/design web` + `--clone <url>` |
| "animation", "animated reveal", "video", "mp4", "gif"          | inherit, add module 11 |
| "push to figma"                                                | inherit, add module 14 |

\* If the redesign target is mobile (image shows phone frame, message
mentions iOS/Android), promote to `/design mobile`.

---

## 4. Active-Module Selection — Master Decision Table

Every command has a base pipeline. Context adds optional modules.
Numbers reference `modules/NN-*.md`.

### Base pipelines per command

| Command            | Base modules (in order)                                           |
|--------------------|-------------------------------------------------------------------|
| `/design web`      | 01, 04, 05, 02, 07, 08, 09\|10, 15, 16                            |
| `/design mobile`   | 01, 04, 05, 02, 07, 08, 09\|10, 15, 16                            |
| `/design system`   | 01, 04, 06, 07, 08, 15, 16                                        |
| `/design landing`  | 01, 04, 05, 02, 07, 08, 09\|10, 15, 16                            |
| `/design review`   | 01, 15                                                            |
| `/design import`   | 01, 13, 07, 08, 09\|10, 15, 16                                    |
| `/design redraw`   | 01, 12, 04, 07, 08, 09\|10, 15, 16                                |

`09|10` resolves from the output mode (§5). 02 is omitted when the brief
has zero gaps. 04 is omitted when not inside a project. 05 is omitted
with `--no-research` or when the brief is fully concrete.

### Context-driven additions / overrides

| Context signal                         | Add / change                                |
|----------------------------------------|---------------------------------------------|
| URL present + clone intent             | insert 03 between 04 and 05                 |
| Screenshot present + not `/design redraw` | insert 12 between 04 and 05              |
| Figma URL present + not `/design import` | insert 13 between 04 and 05               |
| `push to figma` phrase                 | append 14 before 15                         |
| Animation request                      | append 11 before 15                         |
| `--no-research`                        | remove 05                                   |
| Brief already complete                 | remove 02                                   |
| Outside a project                      | remove 04                                   |
| `.design-engine.json` exists with system | skip 06 (use stored system)               |

### Full pattern → pipeline reference table

| User input pattern                              | Final module sequence                              |
|-------------------------------------------------|----------------------------------------------------|
| "redesign my dashboard"                         | 01, 04, 05, 02, 07, 08, 09\|10, 15, 16             |
| "build onboarding from scratch"                 | 01, 05, 02, 07, 08, 09\|10, 15, 16                 |
| "convert this screenshot to code"               | 01, 12, 04, 07, 08, 09\|10, 15, 16                 |
| "clone linear.app"                              | 01, 03, 07, 08, 09\|10, 15, 16                     |
| "clone linear.app --adapt"                      | 01, 03 (adapt mode), 02, 07, 08, 09\|10, 15, 16    |
| "blend linear.app and vercel.com"               | 01, 03 (blend mode), 07, 08, 09\|10, 15, 16        |
| "create a launch animation"                     | 01, 02, 07, 08, 11, 15, 16                         |
| "review this design"                            | 01, 15                                             |
| "push my system to Figma"                       | 04, 07, 14                                         |
| "import from figma <url>"                       | 01, 13, 07, 08, 09\|10, 15, 16                     |
| "build a design system for a fintech app"       | 01, 04, 05, 02, 06, 07, 08, 15, 16                 |
| Vague ("make something cool")                   | 01, 05, 02, Direction Advisor (3 demos), then full |

---

## 5. Output Mode Resolution

### Resolution order

```
1. Explicit flag --canvas / --prototype / --both          → use it
2. Phrase ("clickable prototype", "canvas only")          → use it
3. Slash command implies it (/design system → preview)    → no question
4. .design-engine.json has "mode" set                     → use it
5. Otherwise                                              → ASK (§5.1)
```

### 5.1 The output mode prompt — exact text

After brief is confirmed and before any generation runs:

```
Output mode?
  [C] Canvas     → Figma-style layout, all screens side by side (clean — no overlays. --annotate adds a strip BELOW each screen; --annotate --redlines adds spacing measurements)
  [P] Prototype  → Fully clickable, real navigation, Playwright-verified
  [B] Both       → Canvas first → approve → Prototype built from it (default)

Reply with C, P, or B (Enter for B).
```

WAIT for response. Do not generate without a selection. Bare Enter = B.

### 5.2 Mapping mode → modules

| Mode | Modules used |
|------|--------------|
| C    | 09           |
| P    | 10           |
| B    | 09 → wait for approval → 10 |

Replace `09|10` placeholders in the pipeline with the resolved module(s).

---

## 6. Entry-Point Resolution — Full vs Partial Flow

| Entry point             | Trigger                                                | Skip steps           |
|-------------------------|--------------------------------------------------------|----------------------|
| Full flow               | First run in project, system not yet generated         | none                 |
| Skip-system flow        | `.design-engine/system/` exists, brief unchanged       | 06, 07, 08           |
| System-only             | `/design system`                                       | 09, 10               |
| Critique-only           | `/design review`                                       | 02, 04–14            |
| Handoff regen           | "regenerate handoff", system unchanged                 | 02, 06–14            |
| Figma-push only         | "push to figma", system exists                         | 02, 05, 06, 09–13    |
| Animation-only          | "make an animation", system exists                     | 06, 09, 10           |

Detection of existing system: presence of `.design-engine/system/tokens.json`.
Detection of brief change: compare current parsed brief against
`.design-engine.json`'s last-known brief hash. If different → full flow.

---

## 7. Ambiguous Input Handling

### Ambiguity definition

Input is ambiguous when ALL of:
- No slash command
- No phrase from §3 matches
- No URL, no screenshot, no Figma link
- Message is < 8 words OR is a generic verb without a target

### Resolution — ask exactly ONE clarifying question

Use this exact format:

```
Tell me what to design. Options:

  1. Web app / dashboard       (/design web)
  2. Mobile screen             (/design mobile)
  3. Design system / tokens    (/design system)
  4. Landing / marketing       (/design landing)
  5. Review existing design    (/design review)
  6. Import from Figma         (/design import)
  7. Redraw a screenshot       (/design redraw)

Reply with the number or describe what you want.
```

WAIT for response. Re-route on the answer. Never guess past one question.

### Borderline cases — DO NOT ask, DO route

- "design something for me" + screenshot → `/design redraw`
- "make this prettier" + screenshot → `/design redraw`
- "build a design" + URL → `/design web` with `--clone`
- "design this" + Figma URL → `/design import`
- "a design system" alone → `/design system`

---

## 8. Conflict Resolution Within Router

If two signals conflict, apply this precedence (highest first):

```
1. Explicit slash command
2. Explicit flag
3. Attached file type (screenshot → redraw, figma url → import)
4. Phrase match
5. .design-engine.json saved defaults
```

If conflict remains after step 5, ask the §7 question.

---

## 9. Router Output — Execution Plan

The router emits a single structured plan before any module runs.
Format (internal — not shown to user verbatim):

```yaml
command: /design web
context_inventory:
  text: ["redesign my dashboard"]
  visual: []
  code: ["package.json detected"]
  figma: []
  url: []
flags: []
entry_point: full
output_mode: B            # C | P | B | unresolved
ambition: B               # A | B | C | D | unset
modules:
  - 01-context-intake
  - 04-codebase-scan
  - 05-web-research
  - 02-design-interview
  - 07-design-system-gen
  - 08-component-library
  - 09-canvas-mode
  - (await canvas approval)
  - 10-prototype-mode
  - 15-critique
  - 16-handoff
gates:
  - brief_confirmed
  - output_mode_selected
  - canvas_approved (if mode B)
  - critique_score >= 7.0
```

If `output_mode == unresolved`, the router schedules the §5.1 prompt
immediately after step 8 (brief confirmation) of the SKILL.md operating
sequence.

---

## 10. Hard Rules — Router May Not Violate

1. Never reorder modules. Skip is allowed; reorder is not.
2. Never run 09 (canvas) and 10 (prototype) simultaneously in B mode —
   canvas first, await approval, then prototype.
3. Never skip 15 (critique) or 16 (handoff) on a generative path.
   `/design review` is the only exception (15 only, no 16).
4. Never generate before the brief is confirmed and the output mode
   is resolved.
5. Never write to `src/` or any production directory. Safe zone is
   `.design-engine/` (SKILL.md §7).
6. Never assume a system exists — always check
   `.design-engine/system/tokens.json` before skipping 07.
7. If MCP for Figma is not connected and the pipeline includes 13 or 14,
   pause and tell the user: "Figma MCP not connected. Connect it or
   remove the Figma step." Do not silently skip.

---

## 11. Hand-Off To Next Module

After emitting the execution plan:

1. Print a one-line route summary to the user:
   `Routing: /design web · context: codebase · mode: pending · 9 modules`
2. Load `modules/01-context-intake.md` and execute it.
3. Subsequent modules are dispatched in the planned order. The router
   does not need to be re-read until the next user turn that changes
   intent.

End of router.
