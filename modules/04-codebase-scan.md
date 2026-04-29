# 04 — Codebase Scan

Runs automatically when cwd is inside a project with frontend signals.
Read-only. Produces the Codebase Design Snapshot (shown to user) and
populates `codebase.stack` + `codebase.existing_system` on the
"What I Know" object.

The golden rule of this module is absolute and stated up front:

> **NOTHING IS EVER WRITTEN TO `src/`, `app/`, `pages/`, `components/`,
> `public/`, `styles/`, OR ANY EXISTING PROJECT FILE. ALL DESIGN-ENGINE
> OUTPUT GOES TO `.design-engine/`. THE ONLY EXCEPTIONS ARE
> `.design-engine.json` AND APPENDING `.design-engine/` TO `.gitignore`.**

Violation of this rule is a hard defect. The scan is read + analyze only.

---

## 1. Activation

Run this module if any of:
- cwd is a git repo with `package.json` containing a frontend dep
- `tailwind.config.{ts,js,mjs,cjs}` exists at any depth ≤ 3
- `app/`, `pages/`, `src/app/`, or `src/pages/` exists
- `index.html` at root with linked CSS

Skip if:
- cwd is not a git repo AND has no `package.json`
- only backend / non-frontend project (no React/Vue/Svelte/Solid/Angular,
  no `index.html`, no Tailwind)

Skip output: set `codebase.present = false` and continue.

---

## 2. File Reading Sequence

Read in parallel where possible. Each step records to a structured slot.

### 2.1 `package.json` — stack detection

Read `<root>/package.json`. Inspect `dependencies` + `devDependencies`.

Frameworks (mutually exclusive — first match wins):
```
next                  → Next.js
                       app/ vs pages/ presence resolves App Router vs Pages
remix                 → Remix
@remix-run/react      → Remix
gatsby                → Gatsby
nuxt | nuxt3          → Nuxt
@sveltejs/kit         → SvelteKit
svelte                → Svelte (no kit)
@angular/core         → Angular
solid-js              → Solid
@builder.io/qwik      → Qwik
astro                 → Astro
vite + react          → Vite + React
react (alone)         → CRA / custom React
preact                → Preact
vue (alone)           → Vue 3 / 2
```

Styling (collect all that match — coexistence common):
```
tailwindcss                         → Tailwind v3 / v4 (check version)
@tailwindcss/postcss + tailwindcss@4 → Tailwind v4
postcss-import + tailwind           → tailwind v3
@emotion/react | @emotion/styled    → Emotion
styled-components                   → styled-components
@stitches/react                     → Stitches
@vanilla-extract/css                → vanilla-extract
@chakra-ui/react                    → Chakra
*.module.css references             → CSS Modules
linaria                             → Linaria
panda-css | @pandacss/dev           → Panda
```

Component / UI libraries:
```
@radix-ui/*                         → Radix primitives
@headlessui/react                   → Headless UI
@mui/material                       → Material UI
antd                                → Ant Design
@mantine/core                       → Mantine
@chakra-ui/react                    → Chakra
shadcn signal: components.json AND
  components/ui/ + @radix-ui deps   → shadcn
@nextui-org/react                   → NextUI
react-aria-components               → React Aria
```

Motion / animation:
```
framer-motion | motion              → Framer Motion (motion = v11+)
@motionone/dom                      → Motion One
react-spring                        → React Spring
@react-spring/web                   → React Spring web
auto-animate                        → AutoAnimate
```

Icons:
```
lucide-react                        → Lucide
@heroicons/react                    → Heroicons
@radix-ui/react-icons               → Radix Icons
react-icons                         → react-icons (generic)
@phosphor-icons/react               → Phosphor
@iconify/react                      → Iconify
```

TypeScript: `typescript` in deps OR `tsconfig.json` exists.
Package manager: `pnpm-lock.yaml` / `yarn.lock` / `package-lock.json` /
`bun.lockb` (single signal each).
Node version: `engines.node` if set, else infer from lockfile.

Record the version of each framework + Tailwind precisely (semver from
package.json, then resolve from lockfile if present).

### 2.2 Tailwind config — palette + spacing + fonts

Try in order, first match wins:
```
tailwind.config.ts
tailwind.config.js
tailwind.config.mjs
tailwind.config.cjs
```

For Tailwind v4 (CSS-first), instead read `app/globals.css` (or
`src/app/globals.css`, `src/index.css`) for `@theme` blocks.

Extract from `theme.extend` (and root `theme` if non-extend overrides):
```
colors:        named map → token candidates  (note nested vs flat)
spacing:       {key: value} → custom spacing scale
fontFamily:    arrays per slot
fontSize:      arrays of [size, {lineHeight, letterSpacing}]
borderRadius:  custom stops
boxShadow:     custom shadows
animation/keyframes:  custom motion
screens:       breakpoints
plugins:       list (typography, forms, container-queries, etc.)
```

For each color value, classify:
- raw hex/rgb/hsl/oklch literal → primitive candidate
- `var(--*)` reference → bridges into the CSS custom-property system

Record:
```
tailwind:
  version:           "3.4.0" | "4.0.0" | ...
  config_path:       <path>
  custom_palette:    {<name>: <value | scale>, ...}
  custom_spacing:    {...}
  custom_radius:     {...}
  custom_shadow:     {...}
  custom_fonts:      {...}
  plugins:           [<name>, ...]
  uses_css_vars:     true | false
```

### 2.3 CSS custom-property files — variables

Files to read (try each, all that exist contribute):
```
app/globals.css                  Next.js App Router
src/app/globals.css              Next.js App Router (src layout)
src/index.css                    Vite
src/styles/globals.css           common
styles/globals.css               common
src/styles/tokens.css            explicit tokens
src/styles/variables.css         explicit variables
public/styles/*.css              static
src/app/(layout)/*.css           grouped layouts
```

For each file, parse:
```
:root { --*: ... }                       light-mode tokens
:root[data-theme="dark"], .dark, [data-mode="dark"] { --*: ... }
                                         dark-mode tokens
@layer base { :root { --*: ... } }       Tailwind v3 layered
@theme { --*: ... }                      Tailwind v4 theme
@font-face { ... }                       self-hosted fonts
@import url(...)                         imported sheets
@keyframes ...                           custom animations
```

Record per file:
```
- path:            <path>
  custom_props:    {<name>: <value>, ...}
  dark_props:      {<name>: <value>, ...}
  fontfaces:       [<family/url>, ...]
  imports:         [<url>, ...]
  keyframes:       [<name>, ...]
```

### 2.4 `components/ui/` — component inventory

Look in priority order (first existing wins as the canonical UI dir):
```
src/components/ui/
components/ui/
src/ui/
ui/
src/components/design-system/
```

Also check `components.json` at root (shadcn config). If present, read:
```
{
  "style": "default" | "new-york",
  "tailwind": {...},
  "rsc": true,
  "aliases": {...}
}
```

For each `.tsx`/`.jsx`/`.vue`/`.svelte` file in the canonical UI dir:
- Capture filename → component name
- Detect variant API (cva, tv, recipe) — record the variant keys
- Check for `cn(...)` / `clsx(...)` usage signal of utility-first
- Detect Radix primitives imported (`@radix-ui/react-*`)

Record:
```
ui_dir:               <path | null>
shadcn:               true | false
shadcn_style:         "default" | "new-york" | null
component_count:      <int>
components:
  - name:             button
    path:             <path>
    variants:         ["default", "secondary", "ghost", "destructive"]
    sizes:            ["sm", "default", "lg", "icon"]
    primitives:       ["@radix-ui/react-slot"]
    cva:              true | false
```

Outside the canonical UI dir, scan up to 200 component files in
`components/`, `src/components/`, `app/**/components/` for **custom**
components NOT mirrored in the UI dir. Record those as
`custom_components` with their path. Do not deeply analyze each — a
count + path list is enough.

### 2.5 `public/` — logo + favicon

Read directory listing only. Look for:
```
public/logo.{svg,png,webp}
public/logo-dark.{svg,png,webp}
public/logo-light.{svg,png,webp}
public/favicon.{ico,svg,png}
public/icon.{svg,png}             Next.js convention
public/apple-icon.{png,svg}
app/icon.{svg,png}                Next.js convention
app/favicon.ico
public/brand/**                   if present
```

For SVG logos: read the file, extract `fill=` and `stroke=` color values
into `brand_colors`. Record viewBox + path complexity (rough character
count) as `brand_geometry_signal`.

For raster (PNG/WEBP/JPG) logos: skip color extraction (too noisy
without a dedicated sampler). Note the file path so the user can drop
it into the brief.

Favicon color: extract the dominant hue from the SVG favicon if
present; skip raster favicons.

### 2.6 Other signals

```
README.md                         scan for "stack", "tech", "built with"
DESIGN.md / STYLE.md              if present, read fully — it's a brief
.storybook/                       presence signals component discipline
storybook-static/                 presence signals running Storybook
playwright.config.*               testing infra signal (not design)
.figma/                           local Figma plugin output if present
prettier config + eslint config   not relevant to design
```

---

## 3. Inconsistency / Conflict / Gap Detection

Three categories. Each becomes a finding line in the Snapshot (§5)
and a non-blocking gap in the "What I Know" object.

### 3.1 Inconsistency — multiple variants without hierarchy

Trigger when the same UI category has ≥ 3 distinct implementations
that aren't intentional variants.

| Signal                                                         | Inconsistency                  |
|----------------------------------------------------------------|--------------------------------|
| ≥ 3 different button styles in components/ that aren't variants of one Button component | "3 button variants, no clear hierarchy" |
| ≥ 3 different card paddings used across files                  | "Card spacing inconsistent (3 values found)" |
| ≥ 2 modal implementations                                      | "Two modal systems — one Radix, one custom" |
| ≥ 3 colors used in primary CTA across pages                    | "Primary CTA color drifts across pages" |
| ≥ 2 sets of font sizes (one in tailwind.config, another in CSS) | "Font sizes defined in two places" |
| Spacing values not snapping to a base unit                     | "Spacing uses non-multiples of 4 / 8" |

Detection: walk the captured component records + tailwind config + CSS
custom props. Count distinct values per category. Threshold per row.

### 3.2 Conflict — same token defined in two places

Trigger when the same logical token has two source-of-truth definitions
that disagree (or even just coexist).

| Signal                                                                  | Conflict                              |
|-------------------------------------------------------------------------|---------------------------------------|
| `--primary` defined in globals.css AND `colors.primary` in tailwind config | "Primary color defined in 2 places — values match? Check." |
| `font-sans` in tailwind config AND `--font-sans` in CSS                 | "Font stack defined in 2 places."     |
| `--radius` in CSS AND `borderRadius` in tailwind                        | "Radius defined in 2 places."         |
| `darkMode: 'class'` in config AND `prefers-color-scheme` in CSS         | "Dark mode triggered by both class and media query." |
| Two `:root { --primary: ... }` blocks with different values             | "Token redefined within same file."   |

For each conflict, compare the values. Report `match` or `mismatch`.
Mismatches block until acknowledged (user is asked which wins in the
interview, see 02 §3.13).

### 3.3 Missing system — gaps in the existing system

Trigger when expected system pieces are absent.

| Signal                                                  | Missing                          |
|---------------------------------------------------------|----------------------------------|
| No card elevation token (no shadow + no surface tint)   | "No consistent card elevation system" |
| No focus ring custom property + no focus utility class  | "No focus ring system"           |
| No status colors (success/warning/error/info)           | "No status color system"         |
| No motion duration tokens                               | "No motion timing system"        |
| Dark mode declared but < 50% of color tokens have dark variants | "Dark mode partially implemented" |
| No semantic tokens (only primitives)                    | "Tokens are primitive-only — no semantic layer" |
| Type scale has fewer than 5 sizes                       | "Type scale shallow — fewer than 5 sizes" |

Each finding: a one-line label + a two-line explanation kept internally
for HANDOFF.md context.

---

## 4. Stack Resolution

After the file reads, collapse the signals into one stack string used
in `.design-engine.json` and elsewhere:

```
<framework>-<styling>[-<ui-lib>]
```

Examples:
```
nextjs-tailwind-shadcn
nextjs-tailwind
vite-react-tailwind-shadcn
remix-tailwind
sveltekit-tailwind
nuxt-tailwind
nextjs-emotion
vite-react-css-modules
```

Record alongside the structured stack block (01 §4.4 schema).

---

## 5. Codebase Design Snapshot — Output Format

Print exactly this block to the user (filling in real values).

```
Codebase Design Snapshot — <Project Name>
─────────────────────────────────────────
Stack:        <framework> <version>, <styling> <version>, <ui_lib>, <motion_lib>
TypeScript:   <yes | no>

Colors:       Primary <hex/oklch>, accent <value>
              <Inconsistency line if any, e.g. "3 different accent values found">
Typography:   <body font> body, <display font> display, <mono font> mono
              Type scale: <N sizes> defined  <"shallow" if < 5>
Spacing:      <base unit detected>  ·  <"Tailwind defaults" | "customized" | "ad-hoc">
Radius:       <values found>
Shadows:      <count> defined  ·  <"flat" if 0>
Motion:       <count> duration tokens  ·  <count> easing tokens
Dark mode:    <strategy>  ·  <coverage estimate>

Components:   <ui_dir count> in <ui_dir>  ·  <custom_count> custom outside

GAPS FOUND:
  → <finding 1>
  → <finding 2>
  → <finding 3>

CONFLICTS:
  → <conflict 1, with values>

Working within your stack. Fixing gaps in .design-engine/. Confirm →
```

Rules:
- Empty rows: omit the row entirely (don't print "Shadows: —").
- GAPS FOUND section: omit if zero findings.
- CONFLICTS section: omit if zero. If present, render BEFORE GAPS so
  the user sees them first.
- Always end with the "Confirm →" line. WAIT for confirmation before
  proceeding. The user can also reply with edits ("dark mode is
  intentionally partial — skip that gap"); apply and re-print.

---

## 6. `.design-engine.json` — Config File

Created on first scan in a project. Lives at the project root. The
ONLY file design-engine writes outside `.design-engine/`. Committed
to git.

### 6.1 Schema

```json
{
  "system": "saas-dark",
  "version": "1.0.0",
  "adapted": false,
  "stack": "nextjs-tailwind-shadcn",
  "mode": "both",
  "figmaFileKey": null,
  "lastSync": null,
  "briefHash": null,
  "scanCache": {
    "scannedAt": "2026-04-28T22:00:00Z",
    "frameworkVersion": "next@14.2.0",
    "tailwindVersion": "3.4.0",
    "componentCount": 47
  }
}
```

Field semantics:
- `system`: name of the active design system. Either a pre-built id
  (`linear`, `vercel`, `saas-dark`, ...), `from-codebase`, `from-figma`,
  `from-clone:<host>`, or `custom`.
- `version`: semantic version of THIS project's design system. Bump
  when tokens change.
- `adapted`: true if the system was adapted (clone --adapt or pre-built
  modified). False if used as-is.
- `stack`: the §4 stack string.
- `mode`: default output mode (`canvas` | `prototype` | `both`).
- `figmaFileKey`: bound Figma file (null until pull/push runs).
- `lastSync`: ISO timestamp of last Figma sync.
- `briefHash`: sha1 of last confirmed Design Brief Summary; module 01
  uses this to detect brief changes and skip steps.
- `scanCache`: lightweight cache of the last scan; used to skip
  re-scanning when the codebase hasn't materially changed.

### 6.2 Creation rules

- First scan → write the file with sensible defaults derived from
  detected stack. `system` defaults to `from-codebase`.
- Subsequent scans → read existing config, update `scanCache` only.
  Do NOT overwrite `system`, `mode`, `figmaFileKey`, `briefHash`
  unless the user explicitly asked for a reset.
- If the file is malformed → back it up to `.design-engine.json.bak`
  and write a fresh one. Tell the user once.

### 6.3 Editing rules

- Bump `version` (semver) when tokens change.
- Update `lastSync` after every Figma push or pull.
- Update `briefHash` after every Design Brief confirmation.
- Do NOT auto-commit. The user controls git.

---

## 7. `.gitignore` — What Gets Added

Two contracts. Both apply to the user's project root, not the skill
directory.

### 7.1 What IS added

Append the line `.design-engine/` (with trailing slash) if not already
present in `.gitignore`. This excludes the working area (system,
canvas, prototype, handoff) from version control. The handoff package
is rebuildable from `.design-engine.json` + the design system module,
so it's safe to gitignore.

### 7.2 What is NOT added

Do NOT add `.design-engine.json`. That file IS committed. Teammates
who run `/design` automatically get the same system + config.

### 7.3 Procedure

```
1. Check for <root>/.gitignore.
2. If absent → create it with one line: ".design-engine/\n"
3. If present and the line is missing → append "\n.design-engine/\n"
4. Never modify other lines. Never sort or reformat.
5. Never add `.design-engine.json` to gitignore.
6. Verify with a final read after writing.
```

If the project is not a git repo → skip gitignore handling entirely.
The `.design-engine/` directory still gets created; it's just not
gitignored anywhere.

---

## 8. Output

Codebase scan emits the Codebase Design Snapshot (§5) to the user,
populates `codebase.*` on the "What I Know" object, ensures
`.design-engine.json` exists, and ensures `.design-engine/` is in
`.gitignore` if applicable.

Hand off to:
- module 02 (interview) if there are still gaps after the scan
- module 05 (research) otherwise, unless the brief is fully concrete
- module 13 (figma-pull) only if explicitly part of the pipeline

End of codebase scan.
