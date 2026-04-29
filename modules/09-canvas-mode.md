# 09 — Canvas Mode

Figma-style multi-screen layout. All screens visible at once, side by
side. Designed for **review**, not interaction. The canvas is where
the user gives line-edit feedback before prototype generation runs.

Inputs: brief, system tokens, component library, screen list. Output
dir: `.design-engine/canvas/<timestamp>/`. Output file:
`canvas.html` (self-contained, opens in any browser).

Three binding rules govern this module:

> **Canvas always runs first in Both mode.** Module 10 (prototype) is
> blocked until the user has marked every section of the canvas.
>
> **Canvas is review chrome, not the design.** The annotation overlays,
> inspector, and feedback markers belong to canvas chrome only — they
> never leak into the screens themselves and they are stripped on
> export.
>
> **Annotations are OFF by default.** No green borders, callout boxes,
> tooltip badges, label overlays, or explanatory text render on top
> of screen content. Canvas output must look client-presentable with
> zero scaffolding visible. Annotations only activate when the user
> explicitly passes the `--annotate` flag. See §0 Clean Canvas Rule.

---

## 0. Clean Canvas Rule

The design must stand alone without explanation. If it needs labels
to be understood, the design failed — not the annotation system.

### 0.1 Default state

```
Annotations:        OFF
Redline overlays:   OFF
Inspector panel:    HIDDEN
Off-token markers:  collected silently to annotations.json (no UI)
Component legend:   HIDDEN
Feedback markers:   shown (this is the canvas's review purpose)
```

The canvas opens looking like a Figma frames row a designer would
hand to a client. Screens, device frames, screen titles, feedback
buttons. Nothing else.

### 0.2 What is NEVER rendered on top of screens — in ANY mode

```
✗ Green / red / blue borders around elements
✗ Callout boxes pointing at UI
✗ Tooltip overlays describing components
✗ Label badges naming tokens or components floating over the design
✗ "off-token" warning chips on top of content
✗ Component name pills overlaid on elements
✗ Inspector breadcrumbs floating on screen
✗ Token reference labels overlaid on elements
✗ Any text or visual element that obscures, covers, or sits ON TOP
  of screen content — even when --annotate is on
```

Hard placement rule, applies to every mode including `--annotate`:

> **Annotations NEVER overlay screen content. They live in a
> dedicated strip BELOW the screen frame.** The screen at all times
> must be fully visible and unobstructed. If a pointer is needed
> to associate a callout with an element, it is a thin line
> originating in the annotation strip pointing UP to the element —
> never a box, border, or fill drawn ON the element.

Spacing redlines (padding/margin/gap measurement overlays) are the
ONE exception — they sit on the screen by necessity. They are
gated by a separate flag: `--annotate --redlines` together. Default
`--annotate` does NOT enable redlines.

Module 15 (critique) §3.8 greps for any of the forbidden overlays
appearing inside screen DOM and flags as a hard defect — regardless
of mode.

### 0.3 The `--annotate` flag

Annotations re-enable only when explicitly requested:

```
/design web                         clean canvas (default — no strip, no redlines)
/design web --annotate              annotation strip BELOW each screen (§5)
/design web --annotate --redlines   strip + measurement redlines on screens
```

Equivalent message-level toggles: "show annotations" / "annotate the
canvas" → enables the strip. "Show redlines" / "show spacing" →
enables the redline overlay (requires annotations on first).

Without the flag, no strip renders, no redlines render. Inspector
and component legend are also gated to `--annotate`.

### 0.4 Persistence

Per session. The flag does not persist to `.design-engine.json`. Each
canvas generation starts clean unless `--annotate` is passed again.

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

Each screen card contains, top to bottom (default — clean canvas):

```
┌────────────────────────────────┐
│  01 · Dashboard                │  screen-header
│  Web · 1440 × 900 · default    │  meta line
├────────────────────────────────┤
│ ╭────────────────────────────╮ │
│ │  device frame (per type)   │ │  screen-frame  (NEVER touched)
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

When `--annotate` is on, an **annotation strip slots BELOW the
screen-frame and ABOVE the screen-feedback footer** — never inside
or on top of the frame:

```
┌────────────────────────────────┐
│  01 · Dashboard                │  screen-header
├────────────────────────────────┤
│ ╭────────────────────────────╮ │
│ │  device frame (per type)   │ │  screen-frame  (clean — numbered
│ │  ╭─────────────────╮       │ │   markers ① ② ③ are tiny, only
│ │  │   the actual UI │       │ │   present when --annotate, and
│ │  ╰─────────────────╯       │ │   sit at element top-right corner
│ ╰────────────────────────────╯ │   inside their own absolute layer
├────────────────────────────────┤   that NEVER overlaps content)
│  ANNOTATIONS                   │  annotation-strip  (§5)
│  ① Tension graph — single …   │
│  ② Activity table — sticky …  │
│  ③ Sidebar nav — sliding …    │
├────────────────────────────────┤
│  [✓ Looks good]  [✗ Needs work]│  screen-feedback
└────────────────────────────────┘
```

The strip is part of the screen-card chrome, not part of the screen
itself. Print mode (§10.1) and PNG export (§10) strip the
annotation-strip + feedback footer + header — exports show only the
device frame contents.

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

## 5. Annotation System — Strip Below Frame

Opt-in only via `--annotate`. Disabled by default per §0 Clean Canvas
Rule.

The hard placement rule (restating §0.2):

> Annotations live in a strip BELOW the screen frame. The screen at
> all times must be fully visible and unobstructed. Never overlay
> annotations on top of screen content.

### 5.1 The annotation strip — placement + structure

When `--annotate` is on, each screen card gets an annotation strip
slotted between the screen-frame and the screen-feedback footer
(§4.1). Strip width matches the card width. Strip height is
content-driven (typically 120–280px).

```
.screen-card
  > .screen-header
  > .screen-frame              ← clean, untouched UI
  > .annotation-strip          ← THIS — added only when --annotate
      > h4 ANNOTATIONS
      > ol.callout-list
          > li.callout
              .callout-marker     ① (matching the marker on the frame)
              .callout-element    "Tension graph"
              .callout-decision   "Single bar per person, not a grid.
                                   Reveals overlap at a glance."
              .callout-token      "Uses --color-focus-high oklch(0.72 0.15 95)"
  > .screen-feedback           ← Looks good / Needs work
```

Background: `bg-surface`. Border-top: 1px `border-subtle`. Padding
`space-4`. Type body 14px, callouts 13px to compress.

### 5.2 Callout format — the canonical entry

Each callout is one line that scans top-to-bottom:

```
① Tension graph — single bar per person, not grid.
  Reveals overlap at a glance.
  Uses --color-focus-high oklch(0.72 0.15 95)
```

Four parts, in order:

```
1. Marker         ① ② ③ ...    — circled number, system mono font
2. Element name   "Tension graph", "Activity table", "Sidebar nav"
3. Design decision  one short sentence on what was decided AND why
4. Token used     "Uses --token-name oklch(...)" or "Uses {token-name}"
                  — exact CSS variable + resolved value
```

If a callout doesn't reference a token (e.g. it describes a layout
decision), part 4 is omitted. Never invent a token reference to fill
the slot.

Maximum 5 callouts per screen. If a screen needs more, the design is
not standing on its own — split the screen into sections with their
own cards.

### 5.3 Optional: tiny element marker on the frame

A circled number marker (e.g. `①`) MAY appear at the top-right
corner of the element being called out, inside an absolute layer
that sits above the iframe but is constrained to a 16×16px square
in the corner. The marker:

```
✓ 16 × 16 px circle
✓ accent bg, accent-text fg, system mono numeral
✓ Always at element top-right corner; never centered, never large
✓ NEVER covers content the user needs to read
✓ Hover the marker → strip's matching callout highlights briefly
```

The marker is the ONLY thing allowed inside the iframe's overlay
layer in `--annotate` mode. No callout boxes, no tooltip text, no
borders. If the element is too small to host a 16×16 marker without
covering content, the marker is omitted and the strip callout drops
its number prefix (just `—` instead of `①`).

### 5.4 Inline pointer line (optional)

When the spatial relationship between callout and element is
unclear from the marker alone, render a thin 1px line:

```
- Origin: top edge of the matching callout in the strip
- Target: bottom-right of the marker on the frame
- Path:   straight line, 1px, oklch(<text-tertiary>) at 60% opacity
- NEVER crosses screen content — line stays in the gutter between
  the screen-frame and the strip
```

If a line would have to cross the frame to reach the element, the
line is omitted. The marker carries the association.

### 5.5 Spacing redlines — separate flag, separate layer

Padding/margin/gap measurement overlays sit on the screen by
necessity. They are NOT enabled by `--annotate` alone. They require
the explicit two-flag combination:

```
/design web --annotate --redlines
```

Or message: "show redlines" (after annotations already on).

When both flags are active:
- Redlines render as a translucent overlay layer per the spec in the
  earlier version of §5.2 (color-coded fills + measurement chips).
- The redline layer is toggleable in the topbar with a `[redlines ⊟]`
  button — default OFF inside that mode too. User clicks to reveal.
- The strip-based callouts (§5.1–5.4) remain primary; redlines are
  diagnostic detail summoned on demand.

The screen-frame's child UI is NEVER permanently obscured. Redlines
are translucent, dismissible, and gated behind two opt-ins.

### 5.6 Iframe → canvas communication (when redlines on)

The screen HTML is generated with a small inlined script that posts
on hover, used only when redlines are active:

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
  tokens: dataAttrToTokenMap(el)
}, "*");
```

When redlines are off, the listener is not attached.

### 5.7 Pin / unpin — strip mode

In annotation strip mode, "pinning" applies to the strip-callout
relationship: clicking a callout in the strip scrolls the screen to
center the corresponding element and pulses the marker. Clicking
again resets. No element-level overlays appear from this action —
only the marker pulse + scroll.

### 5.8 Off-token detection

Off-token values are collected silently in `annotations.json`
regardless of mode (critique module 15 §3.7 reads this).

In `--annotate` mode without redlines: off-token findings appear as
a list at the bottom of the annotation strip:

```
OFF-TOKEN VALUES
  • padding 17px on .header (closest stop: space-4 / 16px)
  • gap 14px on .filters    (closest stop: space-3 / 12px)
```

In `--annotate --redlines` mode: an off-token chip appears next to
the redline measurement. Never as a free-floating chip on top of
content outside the redline overlay.

In default mode: no UI. The data is captured, the visual is
suppressed entirely.

---

## 6. Inspector Panel — opt-in only

Hidden by default per §0 Clean Canvas Rule. Renders only when
`--annotate` flag is passed. Without the flag, the canvas DOM omits
the inspector entirely.

### 6.1 Layout (when enabled)

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

## 8. Component Legend (Bottom) — opt-in only

Hidden by default per §0 Clean Canvas Rule. Renders only when
`--annotate` flag is passed. Without the flag, the canvas omits the
legend strip and the bottom of the canvas is just whitespace.

When enabled: a horizontal strip at the bottom of the canvas listing
every component that appears anywhere in the screens.

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

Default (clean canvas):

```
┌─ {brief.product} — Canvas ──────────────────────────────────────────┐
│  [theme toggle] [size 1440 ▾] [reviewed 5/8] [export ▾]             │
└─────────────────────────────────────────────────────────────────────┘
```

With `--annotate` (strip below each frame):

```
┌─ {brief.product} — Canvas ──────────────────────────────────────────┐
│  [theme toggle] [size 1440 ▾] [reviewed 5/8] [export ▾]             │
└─────────────────────────────────────────────────────────────────────┘
   (no extra topbar control — strips are part of the cards)
```

With `--annotate --redlines`:

```
┌─ {brief.product} — Canvas ──────────────────────────────────────────┐
│  [theme toggle] [size 1440 ▾] [redlines ⊟] [reviewed 5/8] [export ▾]│
└─────────────────────────────────────────────────────────────────────┘
```

- **Theme toggle**: same as system-preview (light/dark).
- **Size**: 375 / 768 / 1024 / 1440. Resizes the iframes via
  `--screen-width`. Iframes use the responsive design of the screens
  they hold; the device frame switches to mobile frames at ≤ 480.
- **Redlines toggle** (only when `--annotate --redlines` was passed):
  §5.5. Default OFF inside that mode — user clicks to reveal.
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

`canvas.html?print=true` strips ALL chrome (topbar, inspector if
present, component legend if present, feedback footers, redlines if
on) and lays the screens out for clean PDF export. Restores on reload
without the query parameter. Note: default canvas is already mostly
chrome-free per §0 Clean Canvas Rule, so print mode mainly removes
feedback footers + topbar.

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
