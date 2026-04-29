# 09 — Canvas Mode

Figma-style multi-screen layout. All screens visible at once, side by
side. Designed for **review**, not interaction. The canvas is where
the user gives line-edit feedback before prototype generation runs.

Inputs: brief, system tokens, component library, screen list. Output
dir: `.design-engine/canvas/<timestamp>/`. Output file:
`canvas.html` (self-contained, opens in any browser).

Two binding rules govern this module:

> **Canvas always runs first in Both mode.** Module 10 (prototype) is
> blocked until the user has marked every section of the canvas.
>
> **Canvas is review chrome, not the design.** The annotation overlays,
> inspector, and feedback markers belong to canvas chrome only — they
> never leak into the screens themselves and they are stripped on
> export.

---

## 1. Activation

Run when the resolved output mode is `C` (Canvas) or `B` (Both).
Skip when:
- Mode is `P` (Prototype only) — module 10 runs directly.
- Command is `/design system` — system-preview.html replaces canvas.
- Command is `/design review` — critique only, no canvas.

In Both mode, this module owns the gate to module 10. Module 10 will
not start until §7's approval is recorded.

---

## 2. File Structure

```
.design-engine/canvas/<timestamp>/
├── canvas.html                    self-contained review surface
├── screens/
│   ├── 01-dashboard.html          one html per screen, isolated
│   ├── 02-settings.html
│   ├── 03-empty-state.html
│   └── ...
├── assets/
│   ├── icons/                     SVGs used by screens
│   ├── images/                    real product images (no stock)
│   └── frames/                    iphone-15-pro.html etc. (from skill assets)
├── annotations.json               hovered-element redline data
├── feedback.json                  Looks good / Needs work markers
└── meta.json                      system version, brief hash, screen list
```

The screens are real `.html` files because:
1. Each can be exported as a PNG via Playwright trivially.
2. Each can be promoted to `.design-engine/prototype/` on approval
   without re-rendering.
3. Each is small (no review chrome), so the canvas page can iframe
   them lightly.

`canvas.html` is the wrapper. It iframes `screens/*.html` inline and
overlays the chrome (annotations, inspector, feedback markers).

---

## 3. Canvas HTML — Document Structure

```
<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{brief.product} — Canvas — design-engine</title>
  <link href="<google-fonts>" rel="stylesheet">
  <style>/* tokens.css inlined */</style>
  <style>/* canvas chrome styles */</style>
</head>
<body>
  <header class="canvas-topbar">…</header>
  <main class="canvas-stage">
    <ol class="screens">
      <!-- repeated per screen -->
      <li class="screen-card" data-screen-id="dashboard">
        <header class="screen-header">…</header>
        <div class="screen-frame">
          <iframe src="screens/01-dashboard.html" loading="lazy"></iframe>
        </div>
        <footer class="screen-feedback">…</footer>
      </li>
    </ol>
  </main>
  <aside class="inspector">…</aside>
  <footer class="component-legend">…</footer>
  <script>/* canvas interactions */</script>
</body>
</html>
```

Two layout requirements:

- The stage is **horizontally scrollable** with `scroll-snap-type: x
  mandatory` and each screen card is `scroll-snap-align: start`. The
  user pans across the canvas the same way they would in Figma.
- The page is **also vertically scrollable** so the inspector and
  component legend can be reached on smaller viewports without losing
  the screen row.

---

## 4. Screen Layout

### 4.1 Per-screen frame

Each screen card contains, top to bottom:

```
┌────────────────────────────────┐
│  01 · Dashboard                │  screen-header
│  Web · 1440 × 900 · default    │  meta line
├────────────────────────────────┤
│ ╭────────────────────────────╮ │
│ │  device frame (per type)   │ │  screen-frame
│ │  ╭─────────────────╮       │ │
│ │  │   iframe        │       │ │
│ │  │   the actual UI │       │ │
│ │  ╰─────────────────╯       │ │
│ ╰────────────────────────────╯ │
├────────────────────────────────┤
│  [✓ Looks good]  [✗ Needs work]│  screen-feedback
│  notes ___________________     │  collapses to single row when neutral
└────────────────────────────────┘
```

### 4.2 Device frame selection

Frames live in `assets/frames/` (sourced from the skill's
`assets/frames/` directory). Pick one per screen:

```
surface = web                       browser.html
surface = web + landing             desktop.html (no chrome)
surface = web + dashboard product   browser.html
surface = mobile + iOS              iphone-15-pro.html
surface = mobile + android          android.html
surface = macos app                 macos-window.html
```

If the screen specifies its own frame, override.

### 4.3 Spacing + ordering

```
Gap between cards:   space-12 (48px)
Card padding:        space-4 around the frame
Card background:     bg-surface
Card border:         border-subtle  rounded-xl
Title:               text-primary  text-base  font-medium
Meta line:           text-tertiary  text-xs
```

Order is the order in `scope.screen_list`. Module 02 already established
this; canvas does not reorder. Empty / loading / error states for the
same screen group **adjacent to the parent screen**, not at the end.
Convention:

```
01 · Dashboard
02 · Dashboard — empty state
03 · Dashboard — error state
04 · Settings
05 · Settings — empty state
06 · Onboarding step 1
07 · Onboarding step 2
...
```

Numbers are auto-assigned by render order. Display them in the title.

### 4.4 State variations side-by-side

When a screen has interactive states (hover/active/focus/error/loading)
that should be reviewed, render those states as **separate cards**
adjacent to the default. Do NOT stack them in tabs. Reviewer sees them
all at once.

Convention:

```
04 · Settings
05 · Settings — primary CTA :hover
06 · Settings — input :focus
07 · Settings — destructive action confirm modal open
```

Visual variants are forced via `data-state` attributes inside the
screen iframe (matching the convention from module 08 §2.3). The
canvas wrapper script writes the attribute on iframe load.

---

## 5. Annotation System (Hover Redlines)

The differentiator that makes the canvas useful for review.

### 5.1 Trigger

The user moves the cursor over any element inside an iframe. The
canvas chrome listens for messages from the iframe (via `postMessage`)
and overlays redlines.

### 5.2 Overlay rendering

Redlines are drawn on a `<canvas>` element absolutely positioned over
the iframe. They show:

```
- Outer dimensions     (width × height in px) — top of the element
- Padding              (4 sides, in px) — inside the element
- Margin               (4 sides, in px) — outside the element
- Gap                  (when the element is a flex/grid container with children)
- Distance to nearest siblings (left + right, top + bottom)
```

Color coding (drawn from system tokens, not hardcoded):

```
Outer dimension  oklch(<accent> / 0.6)   1px solid line + label
Padding fill     oklch(<warning> / 0.15) translucent
Margin fill      oklch(<error> / 0.10)   translucent
Gap fill         oklch(<info> / 0.20)    translucent
```

Each measurement label is a small chip rendered above the relevant
edge with the token reference shown when possible:

```
24px  →  space-6
```

If the value snaps to a token, show the token name; otherwise show
the raw value with a yellow "off-token" warning marker.

### 5.3 Iframe → canvas communication

The screen HTML is generated with a small inlined script that, on
mouseover, posts:

```js
window.parent.postMessage({
  type: "design-engine:hover",
  rect: el.getBoundingClientRect(),
  iframe: window.frameElement?.dataset.screenId,
  styles: {
    width, height,
    padding: [pt, pr, pb, pl],
    margin:  [mt, mr, mb, ml],
    gap: el.style.gap || getComputedStyle(el).gap,
    siblings: { /* nearest sibling rects */ }
  },
  tokens: dataAttrToTokenMap(el)   // see §6.3
}, "*");
```

The canvas script reads the message, transforms coordinates from
iframe-local to canvas-global (via the iframe's bounding rect), and
draws the overlay. On `mouseout` the overlay clears.

### 5.4 Pin / unpin

Clicking on an element in any iframe pins the annotation. A pinned
element keeps its overlay visible even after the cursor moves and
populates the inspector (§6). Clicking the same element again unpins.
The canvas scripts maintain a single pinned element across all
iframes.

### 5.5 Redline toggle

A button in the topbar toggles redlines globally on / off. Default:
on. Off is useful when the reviewer wants to evaluate the design
without measurement chrome distracting them.

### 5.6 Off-token detection

For every measurement reported, the canvas compares against the
system's token scale. If the value isn't an exact token (e.g.
`padding: 17px`), show:

```
17px  off-token  ⚠
```

These get logged to `annotations.json` so module 15 (critique) can
flag them too.

---

## 6. Inspector Panel

### 6.1 Layout

A 320px-wide panel docked to the right edge of the canvas. Always
visible on viewports ≥ 1440px; collapses to a slide-in drawer below
that.

```
┌──────────────────────────────────┐
│ INSPECTOR                        │
├──────────────────────────────────┤
│ <button>                         │   ← element selector / breadcrumbs
│   <span class="button-label">    │
├──────────────────────────────────┤
│ Computed                         │
│  width   240px                   │
│  height  40px                    │
│  padding 12px 24px (space-3 / 6) │
│  ...                             │
├──────────────────────────────────┤
│ Tokens used                      │
│  • bg          → bg-accent       │
│  • text        → accent-text     │
│  • radius      → radius-md (6px) │
│  • duration    → fast (100ms)    │
│  • easing      → out             │
├──────────────────────────────────┤
│ Component                        │
│  Button (variant=primary, size=md)│
│  → components/button.notes.md    │
├──────────────────────────────────┤
│ Notes                            │
│  • Press state animates -1px Y   │
│  • Focus ring 2px at border-focus│
└──────────────────────────────────┘
```

### 6.2 What it reads

The pinned element (§5.4). When unpinned, the inspector shows the
last hovered element with a "(hovered, not pinned)" label.

### 6.3 Token attribution

The screen-side script attaches `data-token-*` attributes on every
generated element pointing at the token references it uses:

```html
<button
  data-token-bg="bg-accent"
  data-token-text="accent-text"
  data-token-radius="radius-md"
  data-token-duration="fast"
  data-token-easing="out"
  data-component="button"
  data-component-variant="primary"
  data-component-size="md"
  ...
```

This is added at generation time (module 08 + module 09). The canvas
script reads the attributes — no inference needed at runtime.

### 6.4 Click-through to docs

The "Component" row of the inspector links to the component's
`notes.md` file (via `file://` if local, or copies the path on click).
Clicking opens it in the user's default markdown viewer where
available.

---

## 7. Feedback Mechanism — "Looks good" / "Needs work"

Every screen card has a feedback footer. Three states:

```
○ neutral (default)        — not yet reviewed
✓ Looks good (green)       — approved as-is
✗ Needs work (red) + notes — flagged with reviewer comment
```

### 7.1 Marking

```
[✓ Looks good]  [✗ Needs work]
```

- Click `Looks good` → state becomes approved. Card border tints
  `success` 30% opacity; the badge shows `✓` in success color.
- Click `Needs work` → reveals a notes textarea below. State becomes
  flagged. Card border tints `error` 30% opacity. Notes auto-save
  to `feedback.json`.

Both buttons are toggleable. Clicking the active one un-marks.

### 7.2 Persistence

`feedback.json` schema:

```json
{
  "canvas_id": "<timestamp>",
  "system_version": "1.0.0",
  "brief_hash": "<sha1>",
  "screens": {
    "dashboard": {
      "status": "approved" | "needs_work" | "neutral",
      "notes": "Header padding feels tight at 16; try 24.",
      "marked_at": "<ISO>"
    },
    "...": {}
  }
}
```

Auto-saves on every keystroke (debounced 500ms). On reload, the canvas
script re-reads `feedback.json` and restores marks.

### 7.3 Aggregate state at the top bar

The topbar shows a live tally:

```
Reviewed: 5 / 8   ·   ✓ 3   ✗ 2   ○ 3
```

Updates whenever any feedback state changes.

### 7.4 Section-level marking

When a screen has paired state cards (e.g. `Settings`, `Settings —
:hover`, `Settings — error`), provide a single "Mark all" affordance
above the group so the user can approve the whole section at once.

---

## 8. Component Legend (Bottom)

A horizontal strip at the bottom of the canvas listing every component
that appears anywhere in the screens.

```
COMPONENTS USED
[Button(P)] [Button(S)] [Card] [Input] [Nav.Sidebar] [Table] [Badge(success)] [Modal] [Toast(info)] [Avatar] ...
```

Each chip:
- Click → scrolls the canvas to the first occurrence of that component
  and pins it (so the inspector + redlines populate for that instance).
- Right-click / long-press → opens the component's `notes.md`.
- Color: `bg-elevated` chip with `text-primary` label and a small dot
  before the variant name in the variant's accent.

The legend is read from `meta.json`'s `components` field, which is
populated as screens are generated.

---

## 9. Topbar Controls

```
┌─ {brief.product} — Canvas ──────────────────────────────────────────┐
│  [theme toggle] [size 1440 ▾] [redline ⊟] [reviewed 5/8] [export ▾] │
└─────────────────────────────────────────────────────────────────────┘
```

- **Theme toggle**: same as system-preview (light/dark).
- **Size**: 375 / 768 / 1024 / 1440. Resizes the iframes via
  `--screen-width`. Iframes use the responsive design of the screens
  they hold; the device frame switches to mobile frames at ≤ 480.
- **Redline toggle**: §5.5.
- **Reviewed counter**: §7.3.
- **Export menu**: §10.

---

## 10. Export Options

Triggered from the topbar `Export ▾` menu. Each entry produces real
files in `.design-engine/canvas/<timestamp>/exports/`.

```
Per-screen PNG          Playwright screenshot of each screen iframe at
                        2x DPI; named <NN>-<screen>.png; saves under
                        exports/png/.

Full canvas PDF         Tile every screen + frame into a single PDF
                        page (or paginated when wide). Uses
                        Playwright's `page.pdf()` against canvas.html
                        with chrome hidden via `?print=true`.

Per-screen HTML         Copy of screens/<NN>-<screen>.html (already
                        present); the menu just opens the file.

Annotations JSON        Copy of annotations.json (off-token findings).

Feedback JSON           Copy of feedback.json (approval state).

Push to Figma           Copies `claude /design system push` snippet to
                        clipboard. Connects only when Figma MCP is
                        available; the canvas itself doesn't run MCP.
```

### 10.1 Print mode

`canvas.html?print=true` strips chrome (topbar, inspector,
component legend, feedback footers, redlines) and lays the screens
out for clean PDF export. Restores on reload without the query
parameter.

---

## 11. Approval Gate (Both Mode)

This is the binding rule re-stated, now with the procedure.

### 11.1 The gate

After canvas generation, the orchestrator pauses. It does NOT call
module 10 (prototype). The user must do one of:

- Mark every screen card (§7) and approve at least 80% of them
  (or 100% if there are ≤ 4 screens).
- Reply `approve all` in chat — same effect.
- Reply `approve <screen-id>` to mark individual cards from chat.
- Reply `regenerate` to re-run module 09 with the current feedback
  applied to the brief.

### 11.2 What "approval" means

Approval = `feedback.json.screens.*.status` is `approved` for ≥80%
(or 100% if ≤4) AND no `needs_work` is unaddressed. A `needs_work`
flag blocks until either resolved (re-marked approved after a
regeneration) or explicitly waived ("ship as-is, ignore that note").

### 11.3 Status update in chat

While the user reviews, the orchestrator stays silent. When the
threshold is reached:

```
Canvas approved (8/8 screens). Generating prototype...
```

If the user reaches 80% but has unaddressed `needs_work` flags:

```
Canvas review at 8/8. 2 screens flagged Needs work:
  • dashboard — "header padding feels tight"
  • settings — "destructive button color too saturated"
Regenerate with fixes, or "ship as-is, ignore" to proceed?
```

The user choosing `regenerate` re-runs module 09 with feedback
embedded into the brief (an `unresolved_notes` field). The user
choosing `ship as-is` proceeds to module 10 with the unresolved notes
recorded in HANDOFF.md so the implementing AI sees them.

### 11.4 Hard rule

Module 10 is never invoked while approval is incomplete. The router
won't route past the gate. SKILL.md §9 enforces this at the
orchestrator level.

---

## 12. Real Content (No Lorem Ipsum)

Canvas screens render with realistic data, not placeholder text.

```
- Names: a fixed list of plausible names (e.g. "Mira Patel", "Jonas
  Reuter", "Ife Okafor"). Stored in assets/sample-data.json.
- Numbers: realistic (not 1, 2, 3 — use values that match the product
  domain: revenue $48,210; users 12,847; latency 142ms).
- Dates: relative ("2h ago", "Mar 14"), spread across realistic
  windows (not all "today").
- Status messages: written in the brand voice from the brief; never
  "Lorem ipsum dolor sit amet".
- Images: pulled from Wikimedia / Unsplash / Met Museum where allowed
  by license (recorded in `meta.json`).
```

This isn't optional; it's part of every generated screen. Module 15
(critique) flags Lorem ipsum and "Click me" placeholders as defects.

---

## 13. Accessibility Of The Canvas Itself

The canvas chrome is itself accessible:

- Tab moves focus through topbar controls, then through screen cards
  (each card is focusable; Enter activates the card; Space toggles
  Looks good; the textarea reveals on Needs work).
- Arrow keys (← →) pan between screen cards horizontally when focus
  is on a card.
- ESC unpins any pinned annotation.
- All buttons have `aria-label`.
- The redline overlay has `aria-hidden="true"` (purely decorative).
- The inspector is `role="region"` with `aria-label="Inspector"`.

---

## 14. Status Output

```
Generating canvas · 8 screens · device frames · annotations · inspector ... 
```

After:

```
Canvas ready: .design-engine/canvas/<timestamp>/
  Screens:    8 (dashboard, dashboard-empty, settings, settings-empty, onboarding-1, onboarding-2, billing, error-404)
  Frames:     browser × 6 · iphone × 0
  Open:       open .design-engine/canvas/<timestamp>/canvas.html

Mark each screen Looks good or Needs work in the canvas, then
reply "approve all" to continue.   (Both mode → next: prototype.)
```

---

## 15. Output

Canvas mode emits `.design-engine/canvas/<timestamp>/` with all files
in §2, populates the "What I Know" object with:

```yaml
canvas:
  generated_at:     <ISO>
  path:             .design-engine/canvas/<timestamp>/
  screens:          [<screen-id>, ...]
  approval_state:   pending | partial | approved | regenerate
  off_token_count:  <int>     # from annotations.json
  unresolved_notes: [<short note>, ...]
```

Hand off to:
- **Both mode**: HALT until §11 approval. On approval, hand to
  module 10 (prototype).
- **Canvas-only mode**: hand directly to module 15 (critique), then
  module 16 (handoff).

End of canvas mode.
