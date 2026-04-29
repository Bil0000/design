# 01 — Context Intake

Fuses every context source the user provides into a single structured
"What I Know" object. Runs after the router. Feeds modules 02 (interview),
04 (codebase scan), 05 (research), 07 (system gen).

The output is deterministic: same inputs → same structure. Downstream
modules read fields, never re-parse the user's prose.

---

## 1. Sources Accepted (Full List)

```
TEXT
  - URL to clone                ("clone linear.app")
  - URL to import from          ("import figma.com/file/abc")
  - Description                 ("dark, premium, developer tool")
  - Competitor names            ("between Linear and Vercel")
  - Vibe references             ("feels like a $50k agency built it")
  - Brand words                 ("trustworthy, fast, opinionated")
  - Anti-references             ("not a typical SaaS template")
  - Audience descriptors        ("for senior backend engineers")
  - Stack hints                 ("we use Next.js + Tailwind")

VISUAL
  - Screenshot of an existing UI
  - Logo file (SVG / PNG)
  - Mood-board images (multiple files)
  - Exported Figma frame images
  - Photographs (textures, materials, brand photography)

CODE
  - Live codebase (cwd inside a project)
  - GitHub URL                  ("github.com/acme/app")
  - Pasted CSS / tokens
  - package.json snippet
  - tailwind.config snippet
  - Component source

FIGMA
  - File URL                    ("figma.com/file/<key>")
  - Frame URL                   ("?node-id=...")
  - Library URL
  - Raw file key

CONFIG
  - .design-engine.json (if present)
```

For each source the router stamped present, intake runs the matching
processor in §2–§7 below. Sources are processed in parallel where the
underlying tools allow (web fetches + Playwright runs + file reads).

---

## 2. Text Processing

### 2.1 URL detection and classification

For every URL token in the message, classify:

| Pattern                                              | Class                  |
|------------------------------------------------------|------------------------|
| `figma.com/file/...`, `figma.com/design/...`         | figma_url              |
| `github.com/<owner>/<repo>`                          | github_repo            |
| `dribbble.com`, `behance.net`, `mobbin.com`          | inspiration            |
| Anything else (https://*)                            | clone_target / reference |

Routing per class:
- `figma_url` → handed to module 13 with the file key extracted.
- `github_repo` → fetch `package.json`, `tailwind.config.*`, `README.md`,
  `globals.css`, `app/layout.tsx` (or equivalent) via raw.githubusercontent
  URLs. Feed results to the codebase signals block (§4.4).
- `inspiration` → store the URL in `references[]`. Do NOT clone.
- `clone_target` → handed to module 03 (clone-engine) for the full
  5-step pipeline. Intake also web_fetches the home page to capture
  meta tags (title, description, og:image) for the brief.

### 2.2 Description parsing

Extract from free-text description, in priority order:

```
personality_words   → adjectives describing how it should feel
audience_words      → nouns/phrases describing who it's for
domain_words        → product domain (fintech, devtools, healthcare)
brand_words         → product name, brand, tagline if mentioned
anti_words          → "not", "avoid", "no" + descriptor
quantifiers         → "premium", "budget", "$50k agency", "side project"
ambition_signal     → "ship-quality", "iconic", "stunning", "clean and simple"
```

Map ambition_signal → ambition level (A/B/C/D, see SKILL.md):

| Signal phrases                             | Ambition |
|--------------------------------------------|----------|
| "simple", "clean", "ship fast", "MVP"      | A        |
| "polished", "professional", "no rough edges" | B      |
| "stunning", "screenshottable", "distinctive" | C      |
| "iconic", "category-defining", "redefine"  | D        |
| (none detected)                            | unset    |

### 2.3 Competitor / reference name extraction

Phrases like "like X", "between X and Y", "Linear-style" → push X (and Y)
to `references[].name`. For each named reference, mark
`references[].source = "user-named"` and trigger module 05 to research it
(unless `--no-research`).

---

## 3. Visual Processing

### 3.1 Screenshot of existing UI

For every attached image classified as a UI screenshot, extract:

```
layout
  - frame: web | mobile | tablet (inferred from aspect ratio)
  - grid: column count, gutter estimate
  - regions: header / sidebar / main / footer / overlay (which exist)
  - density: sparse | balanced | dense (whitespace ratio estimate)

components
  - list of discrete components visible (button, nav, card, table, ...)
  - per component: rough bounding box, repeated count if a list

color
  - dominant background color (sample from a flat region)
  - dominant text color
  - accent / brand color (sample from CTA-like elements)
  - mode: light | dark (background lightness)

typography
  - estimated body size (px, from a paragraph or list row)
  - estimated heading scale (relative to body)
  - serif vs sans vs mono (per region)
  - apparent weights (regular / medium / semibold / bold)

spacing
  - apparent base unit (4 / 6 / 8 px)
  - gutter consistency (consistent | inconsistent)

icon system
  - line vs solid, stroke weight estimate
  - corner radius signal (sharp | soft | pill)

interactive hints
  - which elements look clickable
  - any visible hover/active state
```

If multiple screenshots are provided, run extraction on each, then
diff them — record which decisions are consistent across the set
(those are the design-system signals) versus which are screen-specific.

### 3.2 Logo file

Extract:

```
brand_colors        → top 3 colors by area (oklch values)
geometry            → wordmark | symbol | combination
shape_personality   → angular | rounded | organic | geometric
weight_signal       → light | regular | bold
case_signal         → all-caps | title-case | mixed
serif_signal        → serif | sans | display | script
```

Use these as seeds for the design system, NOT as a hard mandate. The
brief still drives final decisions.

### 3.3 Mood-board images

For each non-UI image (texture, photograph, scene):

```
palette             → dominant colors (oklch, top 5)
mood_words          → 2-3 words inferred from the imagery
composition         → minimal | layered | maximalist
materiality         → digital | tactile | photographic | illustrated
```

Aggregate across the set: which words repeat → mood_consensus.

### 3.4 Exported Figma frame images

Treat as UI screenshots (§3.1) but mark `source = "figma-export"` so
downstream modules know they came from a designer's intent, not a
shipped product.

---

## 4. Code Processing

### 4.1 Live codebase detection

If cwd is a git repo with frontend signals (any of: `package.json` with
React/Vue/Svelte/Solid/Angular dep, presence of `app/` or `pages/`,
`tailwind.config.*`, `globals.css`, `index.html` at root) → flag
`codebase_present = true` and call `modules/04-codebase-scan.md`. The
scan's output is merged into the `stack` and `existing_system` fields.

If cwd is a repo with only backend signals → set `codebase_present = false`,
note it for the brief (so we don't pretend to "extend" something that
doesn't exist), but still record the project root.

### 4.2 GitHub URL

If a `github_repo` URL is provided and cwd is NOT that repo:

1. Fetch `https://raw.githubusercontent.com/<owner>/<repo>/HEAD/package.json`
2. Fetch `tailwind.config.{ts,js,mjs}` (try each)
3. Fetch `app/globals.css` and `styles/globals.css` (try each)
4. Fetch `README.md` (for stack mentions in prose)
5. Try `app/layout.tsx`, `pages/_app.tsx`, `src/app/layout.tsx` for
   font imports + theme setup
6. Feed results to the same scan format module 04 produces.

Do not clone the repo. Do not fetch component source unless the user
explicitly asked for it.

### 4.3 Pasted CSS / tokens

For pasted CSS:

```
- Extract :root custom properties (--*) → record as token candidates
- Extract @font-face declarations → record fonts
- Extract color values, group by usage region (bg, text, border)
- Extract media query breakpoints
- Extract animation/transition declarations
```

For pasted JSON tokens (`{ "color": { ... } }`-shaped):
- Treat as authoritative — do not infer, just structure.

For tailwind.config snippets:
- Extract `theme.extend.{colors,spacing,fontFamily,fontSize,...}`
- Note plugins enabled

### 4.4 Codebase signals block

After §4.1–§4.3, intake produces:

```
stack:
  framework      Next.js 14 App Router | Vite + React 18 | ...
  styling        Tailwind v3 | CSS Modules | styled-components | vanilla
  ui_lib         shadcn | Radix | Mantine | Headless UI | none
  motion         Framer Motion | Motion One | CSS only | none
  icons          Lucide | Heroicons | custom | none
  fonts          [list of declared fonts]
  typescript     true | false

existing_system:
  has_tokens          true | false
  token_locations     ["tailwind.config.ts", "globals.css"]
  conflicts           ["primary defined in 2 places"]
  components_found    47
  custom_components   12
  dark_mode           ".dark class" | "data-theme" | "media query" | none
```

---

## 5. Figma Processing

If any `figma_url` was detected OR `/design import` was the command:

1. Extract file key from the URL (`/file/<KEY>/...` or `/design/<KEY>/...`).
2. Verify Figma MCP is connected. If not → emit a hard message:
   `Figma MCP not connected. Connect it or remove the Figma input.`
   Do not silently skip.
3. Hand off to `modules/13-figma-pull.md` with the file key (and node id
   if a frame URL was given). 13's structured output is merged back as:

```
figma:
  file_key            <key>
  variables           [token list]
  styles              [color/text/effect styles]
  components          [component name, variants, properties]
  pages               [page names]
  pulled_at           ISO timestamp
```

For inspirational Figma URLs (the user wants to reference, not pull),
detect via phrase ("like this Figma file") and store under
`references[].url` instead of triggering the pull.

---

## 6. Config Processing

If `.design-engine.json` exists at project root, load it. Its values
become defaults that downstream modules use unless the current message
overrides them:

```
saved_config:
  system            saas-dark | linear | ...
  version           1.0.0
  adapted           true | false
  stack             nextjs-tailwind-shadcn
  mode              C | P | B
  figmaFileKey      <key> | null
  lastSync          ISO timestamp | null
  brief_hash        <hash of last confirmed brief>
```

If the parsed brief from the current message hashes to `brief_hash` →
the brief is unchanged → flag `entry_point = skip-system` (router uses
this to short-circuit modules 06/07/08).

---

## 7. Parallelism Rules

Run in parallel:
- Web fetches (URLs, GitHub raw files, Figma file metadata)
- Playwright screenshots (clone targets)
- Local file reads (codebase scan)
- Image analysis (multiple screenshots)

Run sequentially:
- Figma MCP calls (rate-limited)
- Anything that mutates `.design-engine/`

Each parallel task writes to its own field of the "What I Know" object.
A final merge step assembles the result.

---

## 8. The "What I Know" Object — Authoritative Schema

Emitted as YAML internally (not shown to user verbatim). Every field
is always present; absent data is `null` or `[]`, never omitted.

```yaml
brief:
  raw_message:        <verbatim user message>
  command:            /design web | mobile | system | landing | review | import | redraw
  flags:              [--clone, --adapt, ...]
  ambition:           A | B | C | D | unset
  brief_hash:         <sha1 of canonicalized brief>

identity:
  product_name:       <string | null>
  domain:             <string | null>           # fintech, devtools, healthcare, ...
  brand_words:        [<string>, ...]
  anti_words:         [<string>, ...]

aesthetic:
  personality_words:  [<string>, ...]
  mode:               light | dark | both | unset
  density:            sparse | balanced | dense | unset
  vibe_phrase:        <string | null>           # "feels like a $50k agency built it"
  mood_consensus:     [<word>, ...]             # from §3.3

audience:
  who:                <string | null>           # "senior backend engineers"
  segment:            developer | business | consumer | enterprise | unset
  technical_level:    technical | mixed | non-technical | unset

stack:
  framework:          <string | null>
  styling:            <string | null>
  ui_lib:             <string | null>
  motion:             <string | null>
  icons:              <string | null>
  fonts:              [<string>, ...]
  typescript:         true | false | null

scope:
  output_kind:        system | screen | flow | landing | animation | review | unset
  screen_list:        [<string>, ...]           # named screens to produce
  surface:            web | mobile | both | unset
  output_mode:        C | P | B | unresolved

references:
  - name:             <string | null>
    url:              <string | null>
    source:           user-named | mood-board | inspiration-url | clone-target
    notes:            <string | null>

visual_inputs:
  ui_screenshots:     [<extracted §3.1 record>, ...]
  logo:               <extracted §3.2 record | null>
  mood_board:         [<extracted §3.3 record>, ...]
  figma_exports:      [<extracted §3.4 record>, ...]

codebase:
  present:            true | false
  root:               <abs path | null>
  stack:              <§4.4 stack block | null>
  existing_system:    <§4.4 existing_system block | null>
  github_url:         <string | null>

pasted_code:
  css:                [<extracted §4.3 record>, ...]
  tokens:             [<token tree>, ...]
  tailwind_config:    [<extracted theme.extend>, ...]

figma:
  file_key:           <string | null>
  pulled:             true | false
  variables:          [...]
  styles:             [...]
  components:         [...]

clone_target:
  url:                <string | null>
  mode:               clone | adapt | inspect | blend | null
  blend_partner_url:  <string | null>

saved_config:
  <copy of §6 block, or null if file absent>

gaps:
  - dimension:        identity | aesthetic | audience | stack | scope | reference
    field:            <field path, e.g. "audience.who">
    reason:           <one-line explanation of why this is needed>
    blocking:         true | false
```

---

## 9. Gap Detection — Feeding Module 02

After populating the object, walk the 6 dimensions and emit a `gaps[]`
entry for every required field that is null/empty AND cannot be inferred
with high confidence from another source.

### 9.1 Required fields per dimension

```
identity     → identity.domain  (or identity.product_name)
aesthetic    → aesthetic.personality_words (≥2)  AND  aesthetic.mode
audience     → audience.segment
stack        → stack.framework  AND  stack.styling
scope        → scope.output_kind  AND  scope.surface
reference    → at least one entry in references[]
                 OR clone_target.url
                 OR visual_inputs.ui_screenshots length ≥ 1
```

### 9.2 Inference allowed before declaring a gap

- `stack.*` from `codebase.stack` (high confidence) → no gap
- `aesthetic.mode` from `visual_inputs.ui_screenshots[*].color.mode`
  if all screenshots agree → no gap
- `audience.segment` from `identity.domain` for obvious cases
  (fintech → business, devtools → developer) → no gap
- `scope.surface` from command (`/design mobile` → mobile) → no gap

### 9.3 Blocking vs non-blocking

- `blocking = true`: required to generate anything sensible. Module 02
  must ask. Examples: scope.output_kind, aesthetic.mode (if no signals).
- `blocking = false`: nice to have. Module 02 may ask up to its 4-question
  budget. Examples: identity.product_name, audience.technical_level.

The interview module trims the gap list to the top 4 (all blocking
first, then non-blocking by importance) before asking.

---

## 10. Confidence + Provenance

Every populated field carries an implicit provenance — the source it
came from. Maintain provenance internally so downstream modules can
explain decisions in HANDOFF.md ("dark mode chosen because: screenshot
showed dark UI, brief said 'developer tool'").

Sources, ranked by trust (highest first):
```
1. saved_config (.design-engine.json)
2. codebase scan (live)
3. Figma pull
4. github_repo fetch
5. clone_target extraction
6. user prose (current message)
7. visual inference (screenshot / logo / mood board)
8. inferred from cross-source rules (§9.2)
```

If two sources disagree, the higher-trust one wins. Conflicts between
codebase and brief (e.g. brief says "Tailwind", codebase has CSS Modules)
→ raise a non-blocking gap that asks the user to confirm.

---

## 11. Output

Intake emits the "What I Know" object internally and prints exactly
ONE line to the user:

```
Context: <N visual> · <codebase|no codebase> · <N references> · <N gaps>
```

Example: `Context: 1 screenshot · codebase · 2 references · 3 gaps`

Then hands off to:
- `modules/04-codebase-scan.md` if `codebase.present` and not yet run
  (the call may have already happened in §4.1; if so, skip).
- `modules/03-clone-engine.md` if `clone_target.url`.
- `modules/12-image-to-code.md` if a UI screenshot is present and the
  command is not `/design redraw` (redraw owns 12 itself).
- `modules/13-figma-pull.md` if `figma.file_key` and not yet pulled.
- Otherwise → `modules/05-web-research.md`.

End of context intake.
