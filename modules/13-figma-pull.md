# 13 — Figma Pull

Pulls tokens, styles, and component structure from a Figma file via
the Figma MCP. Outputs a tokens.json structurally identical to the
one module 07 produces, plus a `figma-audit.md` documenting what was
found and what was inferred.

This module requires the Figma MCP to be connected. The MCP gate
runs first; nothing else proceeds until the gate is satisfied.

Inputs: `figma.file_key` (and optional `node_id`) from the
"What I Know" object. Output dir: `.design-engine/system/` (writes
tokens) plus `.design-engine/system/figma-audit.md`.

Two binding rules govern this module:

> **MCP gate first.** If the Figma MCP isn't connected, this module
> halts with explicit reconnect instructions. It never silently
> falls back or skips.
>
> **Inference is documented.** Every value derived rather than
> directly read from Figma is recorded in `figma-audit.md` with the
> reason and the source data that justified it.

---

## 1. MCP Availability Check

The first thing this module does. It precedes URL parsing, file-key
extraction, anything.

### 1.1 The check

Probe for any registered MCP server whose tool surface includes the
Figma calls used below (`get_variable_defs`, `get_design_context`,
`get_libraries`, `get_styles`, `get_metadata`, or equivalents).

```
1. List registered MCP servers in the current session.
2. For each, inspect the available tools. Match any that look like:
     get_variable_defs · get_design_context · get_libraries ·
     get_styles · get_metadata · get_local_variables · get_components ·
     figma.* · figma_*
3. If at least one server exposes `get_variable_defs` AND
   `get_design_context` (the minimum needed for a meaningful pull),
   proceed.
4. If neither is available, halt with §1.2.
```

### 1.2 Halt message

Print exactly:

```
Figma MCP is not connected. design-engine needs it to read variables,
styles, and component structure from your file.

To connect:
  1. Open Claude Code settings → MCP servers.
  2. Add Figma MCP. (Common options: figma-developer-mcp,
     figma-context-mcp, or the official Figma MCP — any that exposes
     get_variable_defs and get_design_context will work.)
  3. Authorize with a Figma personal access token that has read access
     to the target file.
  4. Restart this session and run /design import again.

Or skip Figma:
  /design system        pick a pre-built or generate from the brief
  /design system 13     use option 13 (from codebase) instead
```

Do not silently try a different module. Do not fall back to image
extraction. Wait for the user to either reconnect (then resume) or
choose another path.

### 1.3 Partial-tool handling

If only some tools are available (e.g. `get_variable_defs` but not
`get_libraries`), proceed but skip the unavailable steps. Note each
skipped step in `figma-audit.md`.

---

## 2. Activation

Run when:

- Command is `/design import`.
- The user provides a Figma URL (recognized via `figma.com/file/...`
  or `figma.com/design/...` or `figma.com/board/...`).
- System selection (module 06) chose option 14 — From Figma.
- `.design-engine.json` has `figmaFileKey` set AND the user said
  "sync", "pull from figma", "refresh from figma" (the short-circuit
  in §7).

Skip when none of the above apply.

---

## 3. The Pull Workflow — 5 Steps

### 3.1 Step 1 — Extract file key

Recognized URL forms:

```
https://figma.com/file/{KEY}/...
https://www.figma.com/file/{KEY}/...
https://figma.com/design/{KEY}/...
https://www.figma.com/design/{KEY}/...
https://figma.com/board/{KEY}/...
https://www.figma.com/board/{KEY}/...
```

Plus a node id when one is provided:

```
?node-id={NODE-ID}    or    ?node-id=12-34
```

Parsing:

```
fileKey  = first segment after /file|design|board/
nodeId   = the value of the "node-id" query parameter, if present
           (replace "-" with ":" if the MCP wants the URL-form id)
```

If `figma.file_key` is already populated on the "What I Know" object
(set by module 01), use that. The user can also paste a raw key
(no URL) — accept any 22-character alphanumeric token.

If parsing fails, ask once:

```
Couldn't read a Figma file key from your input. Paste the file URL
(or just the key) — I'll use it.
```

### 3.2 Step 2 — Pull variables

```
result = mcp.get_variable_defs(fileKey, { nodeId? })
```

Expected shape (best-effort across MCP variants):

```
collections: [
  { id, name, defaultModeId, modes: [...] }, ...
]
variables: [
  {
    id,
    name,           "color/grey/950" | "spacing/4" | "radius/md" | ...
    type,           COLOR | FLOAT | STRING | BOOLEAN
    collectionId,
    valuesByMode: { <modeId>: <value> }
  }, ...
]
```

Per-variable handling:

```
type=COLOR    → record under primitive.color or directly map to
                semantic if name implies it
type=FLOAT    → categorize by name prefix:
                  spacing/* → spacing token
                  radius/*  → radius token
                  text/*    → font-size or line-height (depends on suffix)
                  shadow/*  → shadow primitive
type=STRING   → typography family / token alias
type=BOOLEAN  → mode flags (light/dark, density toggles)
```

Multi-mode variables (light + dark) populate both `semantic.light`
and `semantic.dark` in the resulting tokens.json. Single-mode
variables go to whichever mode the file declares as default; the
opposite mode is inferred (§4) and flagged.

### 3.3 Step 3 — Pull design context

```
context = mcp.get_design_context(fileKey, { nodeId? })
```

Walk the returned tree. Extract for each layer:

```
layer
  name             string
  type             FRAME | COMPONENT | INSTANCE | TEXT | RECTANGLE | ELLIPSE | VECTOR | LINE | GROUP
  layout           AUTO_LAYOUT? { direction, gap, padding, alignment }
  fills            [<paint>]    (resolves to color tokens when bound to variables)
  strokes          [<paint>]
  cornerRadius     <number | mixed>
  effects          [<shadow | blur>]
  styleId          <id?>        (text or effect style binding)
  textStyle        { fontFamily, fontWeight, fontSize, lineHeight, letterSpacing, textTransform }
  componentProperties {<key>: <value>}     (variants + properties)
  children         [...recurse]
```

Two outputs from the walk:

```
component_inventory
  - name (component name)
  - variant matrix (each variant + property)
  - bbox / size variants if encoded as properties
  - layer composition summary

style_observations
  - text styles: aggregate of textStyle records grouped by named text style
  - effect styles: aggregate of effects (shadow lists)
  - layout patterns: dominant gaps and paddings
  - fill patterns: dominant fills used (when not bound to a variable)
```

Layers without a bound variable are still useful — they reveal the
ad hoc values the file uses, which feed inference (§4).

### 3.4 Step 4 — Pull libraries

```
libraries = mcp.get_libraries(fileKey)
styles    = mcp.get_styles(fileKey)            (when available)
```

Libraries reveal shared components attached to the file. Each entry:

```
library
  id
  name
  variables_count
  components_count
  source_file_key       (the file the library lives in)
```

For each shared library, optionally pull its variables too via a
follow-up `get_variable_defs(source_file_key)`. Skip if the user
opted out (`--no-shared-libraries` flag).

`get_styles` returns local color / text / effect styles. These map
1:1 to tokens when no variable equivalent exists:

```
PAINT  style → color (primitive or semantic depending on name)
TEXT   style → typography stop
EFFECT style → shadow primitive
```

### 3.5 Step 5 — Build tokens.json

Run the same TOKENIZE pipeline as module 03 §4 (clone engine), but
with Figma values as input instead of CSS extraction.

```
1. Color pipeline: collect every variable + style of type COLOR.
   Cluster + snap to the canonical 12-stop L scale (module 07 §1.2).
   Map names to primitive vs semantic vs component layer based on the
   variable's name prefix:
     primitive    "color/...", "primitives/...", "color-primitive/..."
     semantic     "bg/...", "text/...", "border/...", "accent/...", "surface/..."
     component    "button/...", "card/...", "input/...", "<comp>/..."

2. Typography pipeline: aggregate text styles. For each, extract
   family + size + line-height + tracking + weight. Snap sizes to
   the canonical scale (module 07 §1.6) — log the original size
   if it doesn't match a stop.

3. Spacing: combine FLOAT variables under "spacing/*" + the layout
   gaps/padding observed in §3.3. Run the spacing snap (module 07
   §1.7).

4. Radius: FLOAT variables under "radius/*" + cornerRadius
   observations. Snap to none/sm/md/lg/xl/2xl/full.

5. Shadows / effects: from EFFECT styles + any "shadow/*" variables.
   Cluster by intensity, map to sm/md/lg/xl. If the file targets
   dark mode and uses shadows, override per the dark-mode rule
   (module 07 §1.9) — replace with the border-elevation system and
   note the override.

6. Motion: Figma rarely encodes motion in variables. If absent (the
   normal case), pull motion tokens from the closest pre-built
   template matched by the resulting palette (default: saas-dark for
   dark systems, saas-light for light). Log this as inferred.
```

oklch enforcement is the same as module 07: every color in tokens.json
is `oklch(L C H)`. Hex equivalents go to `tokens.legacy.json`.

---

## 4. Gap Handling — Inference

Figma files are usually incomplete. Use the same design logic the
clone engine's REVERSE-ENGINEER step uses (module 03 §3) to infer
missing slots, and document each inference in `figma-audit.md`.

### 4.1 Missing semantic layer (variables only)

Many Figma files define primitive colors but never wire them to
semantic tokens. When `bg-base`, `text-primary`, etc. are absent:

1. Identify the dominant background fill across `FRAME` layers.
2. Use it as `bg-base`. Walk the L scale to assign `bg-surface`
   (+0.04 L), `bg-elevated` (+0.06 L), `bg-overlay` (+0.10 L).
3. The dominant text fill becomes `text-primary`. Lower-contrast
   text fills (>= 1 step lighter) become `text-secondary` and
   `text-tertiary`.
4. The most chromatic non-neutral fill becomes the accent.

Each inference is logged.

### 4.2 Missing dark mode

When the file is light-only:

1. Generate the dark mode by the standard transformation:
   - Invert the L scale on the neutral ramp
   - Apply the border-elevation system (no shadows)
   - Keep the accent ramp's hue + chroma; recompute its L stops to
     remain readable on dark surfaces (target ≥ 4.5:1 vs `bg-base`)
2. Mark the dark mode as inferred in figma-audit.md.

### 4.3 Missing typography metadata

When text styles lack tracking or line-height:

1. Use module 07 defaults at the matched size stop.
2. Apply the negative-tracking rule for sizes ≥ 20px.
3. Log the substitution.

### 4.4 Missing motion

Pull from the matched pre-built template (§3.5 Step 5 case 6).

### 4.5 Missing components

If the file lacks one or more of the 14 core components, generate
those from the resulting tokens via module 08 (component-library)
on the next step. The Figma file's components, where present, are
recorded in figma-audit.md and become reference material — they're
not assumed to override the canonical set.

### 4.6 Inference rules (mirroring clone-engine §3)

Apply every reasoning rule that fires:

```
- Body font-size signal              R-T-01..04
- Negative tracking signal            R-T-06
- Mono in chrome signal               R-T-08
- Pure-white / pure-black signal      R-C-01, R-C-04
- Warm vs cool neutral signal         R-C-02, R-C-03
- 4 vs 8 px base signal               R-S-01, R-S-02
- Radius personality                  R-R-01..05
- Shadow vs border elevation          R-E-01, R-E-03
- Motion ladder                       R-M-01..05
```

Each rule that fires becomes a row in `figma-audit.md`.

---

## 5. Outputs

### 5.1 tokens.json + sibling files

Module 13 produces the same five files as module 07:

```
.design-engine/system/
├── tokens.json          oklch, primitive → semantic → component
├── tokens.css           :root + .dark blocks
├── tokens.ts            typed export
├── tokens.tailwind.js   Tailwind config extension
├── tokens.figma.json    re-export of the source (for round-trip push)
├── tokens.legacy.json   hex equivalents
└── figma-audit.md       see §5.2
```

Module 13 hands these to module 07 only when component generation
also needs to run; if `/design import` is the only command, this
module owns the writes.

### 5.2 `figma-audit.md`

A flat, reviewer-friendly document summarizing the pull. Format:

```markdown
# Figma Pull Audit
*file:`{fileKey}` · pulled {ISO timestamp} · MCP server `{serverName}`*

## Sources used
- get_variable_defs            ✓     {N variables across {M} collections}
- get_design_context           ✓     {K layers walked}
- get_libraries                ✓     {L libraries — names…}     (or skipped)
- get_styles                   ✓     {C color, T text, E effect styles}
- get_metadata                 ✓     {file name, last modified}

## What was read directly from Figma
| Token slot              | Source                                | Value                  |
|---|---|---|
| primitive.color.grey-950| variable color/grey/950               | oklch(0.10 0.005 264)  |
| semantic.bg-base        | variable surface/base                 | {color.grey.950}       |
| accent                  | variable brand/accent                 | oklch(0.72 0.22 149)   |
| spacing.4               | variable spacing/16                   | 16                     |
| radius.md               | variable radius/md                    | 6                      |
| typography.body         | text style "Body / Regular"           | Inter 14/1.5/0/400     |
| ...                     | ...                                   | ...                    |

## What was inferred
| Token slot                  | Inferred value         | Reason                                   |
|---|---|---|
| semantic.bg-surface         | grey-900               | bg-base detected, +0.04 L step rule      |
| semantic.text-secondary     | grey-400               | second-tier text fill at ΔL 0.30 vs primary |
| dark mode (entire layer)    | generated              | file is light-only; inverted L scale     |
| motion.fast                 | 100ms                  | no motion variables; pre-built template  |
| ...                         | ...                    | ...                                      |

## Reasoning rules fired
- R-C-04: bg observed near pure black → no shadows in dark mode (using border-elevation)
- R-S-01: spacing values cluster on multiples of 4 → 4px base
- R-T-01: body 13px → density-first, power-user
- ...

## Gaps
- No motion variables in file. Inferred from saas-dark template.
- No prefers-reduced-motion variant. Standard motion-cut rules applied.
- No focus-ring token. Generated from accent at 60% opacity, 2px outline + 2px offset.

## Components found
| Name | Variants | Properties                                  |
|---|---|---|
| Button | primary, secondary, ghost, destructive | size: sm/md/lg, leftIcon, rightIcon |
| Card   | default, interactive                  | header, footer flags                |
| ...    | ...                                   | ...                                 |

## Shared libraries
- {LibraryName} ({source_file_key}) — pulled
- {LibraryName} (skipped, opted out)

## Round-trip notes
The pulled tokens are written back to `tokens.figma.json` so you can
push the now-canonical system back into Figma later (module 14) and
keep the file in sync.
```

The audit is written even when the pull is partial (some MCP tools
unavailable). Skipped sources show `—` instead of `✓` with a one-line
reason.

---

## 6. Conflict With Existing System

If `.design-engine/system/` already has tokens (from a prior run
or another origin), the pull does NOT silently overwrite. Three
options shown to the user:

```
Existing system in .design-engine/system/ (origin: {origin}).
Figma pull found {N} tokens.

  [R] Replace        Overwrite the system with the Figma pull.
  [M] Merge          Merge Figma values into the existing system,
                     Figma wins on conflicts.
  [B] Branch         Write the Figma pull to .design-engine/system-figma/
                     and keep the current system untouched.

Default: M.
```

Wait for the choice. Apply it deterministically.

---

## 7. Short-Circuit Rule — Sync Before Manual Context

If `.design-engine.json.figmaFileKey` is set on the current project,
this module's existence implies the user already chose Figma as the
source of truth. The router (module 00) and intake (module 01) honor
it by:

1. On any new `/design *` invocation, before running module 02
   (interview), check the timestamp of the last pull (`lastSync` in
   config) against the current Figma file's `lastModified`
   (`get_metadata`).
2. If the file is newer than `lastSync`, prompt:

   ```
   Your Figma file was updated {N} hours after the last sync. Pull
   the latest before continuing? [Y]es (default) / [N]o
   ```

3. On Y → run the §3 workflow. On N → continue with the locally
   stored tokens.

This keeps the local tokens.json honest without forcing a pull on
every run.

---

## 8. Status Output

```
Pulling from Figma · {fileName} · variables (124) · context (840 layers) · libraries (3) · styles (28) · tokenizing · audit ...
```

After:

```
Figma pull ready: .design-engine/system/
  Source:        figma.com/file/{KEY} ({fileName})
  Read direct:   124 variables · 28 styles · 3 libraries
  Inferred:      18 tokens · dark mode generated · motion from saas-dark
  Components:    {K} found, recorded in figma-audit.md
  Audit:         .design-engine/system/figma-audit.md
  lastSync:      {ISO}
```

---

## 9. Output

Module 13 emits the system files (§5.1) + figma-audit.md, populates
the "What I Know" object:

```yaml
figma:
  file_key:           {KEY}
  pulled_at:          <ISO>
  variables_read:     <int>
  styles_read:        <int>
  libraries_read:     <int>
  components_read:    <int>
  tokens_inferred:    <int>
  audit_path:         .design-engine/system/figma-audit.md
  lastSync:           <ISO>
```

And updates `.design-engine.json`:

```
figmaFileKey:    {KEY}
lastSync:        <ISO>
system:          "from-figma"   (when this is the chosen system)
```

Hand off to:
- module 07 only when component generation is needed beyond what
  Figma supplied (the usual case — Figma rarely ships React).
- module 08 (component-library) directly when the system is already
  written by this module.
- module 09 / 10 / 15 / 16 per the active command.

End of figma pull.
