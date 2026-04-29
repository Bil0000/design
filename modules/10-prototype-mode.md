# 10 — Prototype Mode

Fully interactive, clickable, navigable. Feels like the real app, not
a mockup. Buttons do things. Inputs accept typing. Modals open and
trap focus. Mobile prototypes look like a phone and respond like one.

Inputs: the **approved canvas** (module 09) + system tokens +
component library + brief. Output dir:
`.design-engine/prototype/<timestamp>/`. Output entry:
`index.html`.

Two binding rules govern this module:

> **Prototype is never built from scratch.** It is built from the
> approved canvas. Every screen in the prototype originates as the
> matching `screens/<id>.html` from `.design-engine/canvas/<latest>/`.
> Visual structure is preserved exactly; the prototype layer adds
> interaction, navigation, real data, and device chrome.
>
> **Playwright verifies every interaction before handoff.** A failed
> click test is a defect, not a warning. The verification report goes
> into HANDOFF.md.

---

## 1. Activation

Run when the resolved output mode is `P` (Prototype only) or `B`
(Both, after canvas approval).

Skip when:
- Mode is `C` (canvas only).
- Command is `/design system` or `/design review`.
- The canvas has not been approved (Both mode) — module 09 §11 holds
  the gate.

If the user invoked `P` mode without an existing canvas:
1. Run module 09 first to produce a canvas.
2. Auto-approve the canvas (skip §11 gate) since the user already
   committed to prototype-only.
3. Continue here.

This guarantees the binding rule above.

---

## 2. File Structure

```
.design-engine/prototype/<timestamp>/
├── index.html                  entry point — first screen wrapped in device frame
├── screens/
│   ├── dashboard.html
│   ├── dashboard-empty.html
│   ├── settings.html
│   ├── onboarding-1.html
│   ├── onboarding-2.html
│   ├── billing.html
│   └── 404.html
├── prototype.js                navigation + state manager + form handlers
├── prototype.css               minimal chrome additions (device frame fitting only)
├── assets/
│   ├── icons/                  SVG icons used across screens
│   ├── images/                 real product images (Wikimedia/Unsplash/Met)
│   ├── data/
│   │   ├── sample-data.json    realistic names/numbers/dates
│   │   └── credits.json        image-by-image attribution + license
│   └── frames/                 iphone-15-pro.html + android.html + browser.html
├── verification/
│   ├── playwright.config.ts    auto-generated test config
│   ├── tests.spec.ts           generated interaction tests
│   ├── report.html             after Playwright run
│   ├── report.json             machine-readable results
│   └── screenshots/            failure screenshots only
└── meta.json                   source canvas, system version, screen graph
```

Each `screens/<id>.html` is a near-copy of the canvas's
`screens/<id>.html`, plus:

- The chrome stripped (no review wrapper — canvas chrome lived in
  `canvas.html`, not the screens themselves).
- An import of `prototype.js` that wires interactions.
- `data-prototype-*` attributes added to interactive elements.
- Real data substituted for placeholders.

---

## 3. Promotion From Canvas

Concrete sequence:

1. Resolve the latest approved canvas: read
   `.design-engine/canvas/<latest>/feedback.json`. Reject if any
   screen has `status: "needs_work"` and is unresolved (handled by
   module 09 §11).
2. Copy each `canvas/<latest>/screens/<id>.html` →
   `prototype/<ts>/screens/<id>.html`.
3. For each copied screen:
   - Strip any `data-canvas-*` annotation hooks.
   - Replace placeholder `href="#"` and `onclick="return false"`
     instances with real navigation (§4).
   - Replace `data-state="hover"` test stubs with real `:hover`
     states (states are no longer forced).
   - Inject `<script src="../prototype.js" defer></script>`.
4. Copy `assets/` from canvas, augment with any new images needed
   (resolved during real-data injection).
5. Build `meta.json` with the source canvas id, screen graph, and
   list of interactions to verify.

The canvas → prototype copy is verbatim for visual structure. The
prototype layer adds behavior; it never re-styles.

---

## 4. Navigation System

Every clickable element with a route gets a real destination. The
prototype is fully self-navigable.

### 4.1 Route attribution at generation time

Module 09 / 10 inject `data-route` attributes on links and buttons:

```html
<a data-route="settings" class="...">Settings</a>
<button data-route="onboarding-2" class="...">Continue</button>
```

`prototype.js` intercepts clicks on `[data-route]` and:

1. Resolves the route to `screens/<route>.html`.
2. Pushes a history entry (so back / forward work).
3. Fetches the file and swaps the inner HTML of the device-frame
   viewport, OR navigates the iframe inside the device frame to the
   new file. Implementation: iframe-swap — preserves frame, simpler
   focus-management.

### 4.2 Special routes

```
data-route="back"           history.back()
data-route="forward"        history.forward()
data-route="external:..."   open in new tab (real external links)
data-route="modal:<id>"     open the in-screen modal with id
data-route="drawer:<id>"    open drawer
data-route="toast:<variant>:<title>"   fire a toast via Toast provider
data-route="signout"        navigate to login screen and clear demo state
```

### 4.3 Initial route

`index.html` loads the screen named `entry` in `meta.json` (defaults
to the first screen by order). The user can override at any time with
`?screen=<id>` in the URL.

### 4.4 Active state

The currently active screen receives `aria-current="page"` on its
matching nav item. `prototype.js` syncs this on every navigation.

---

## 5. Interaction Requirements

Every interactive element must work. No half-stubbed buttons. No
broken inputs.

### 5.1 Hover / focus / active

- Hover, focus-visible, and active states are CSS-driven via the
  component library (already correct from module 08).
- Focus ring is visible whenever Tab navigates to a focusable element.
- `:focus-visible` is required — bare `:focus` is forbidden.

### 5.2 Form inputs

- Inputs accept real typing. Default values are realistic.
- Validation runs on `blur` for individual fields and on submit for
  the whole form.
- Validation errors render via the Input component's error slot
  (module 08 §3.2). No popup dialogs.
- A "Submit" button on a form: by default, simulates success after
  500ms with a Toast (`success` variant) and navigates to the form's
  `data-success-route` if specified.
- Forms with `data-prototype="echo"` echo their values into a
  visible JSON dump on success — useful for review.

### 5.3 Drawers + modals

- Open via `data-route="modal:<id>"` or `data-route="drawer:<id>"`.
- Real focus trap. ESC closes. Click-on-overlay closes (unless
  `data-modal-persistent="true"`).
- The modal/drawer must be defined inline at the bottom of the
  screen file. `prototype.js` toggles `data-state="open"` to
  reveal it.
- Animation: same tokens as module 08 §3.7 (fade overlay + slide-up
  body). Reduced motion respected.

### 5.4 Tabs / accordions / disclosures

- Real keyboard support: arrow keys move between tabs, Home/End jump
  to first/last; Enter/Space toggles.
- Selected tab maintains state per session (sessionStorage), so
  navigating away and back returns to the same tab.

### 5.5 Tables

- Sorting is real — clicking a column header re-sorts the rendered
  rows client-side using the data in `assets/data/sample-data.json`.
- Row hover triggers the visible hover state (no fake forcing).
- Selectable rows: clicking the row checkbox toggles selection.
  Aggregate selection count appears in a sticky footer.

### 5.6 Toasts

- Fired by `data-route="toast:..."` triggers, by form submissions,
  and by destructive confirmations.
- Stack at the configured position. Auto-dismiss after 5s. Hover
  pauses dismiss.

### 5.7 Loading + skeletons

- Routes flagged `data-route-loading="true"` show a 600ms skeleton
  state on navigation before the new screen mounts. Demonstrates the
  loading pattern without impacting review pace.

### 5.8 Empty states

- A button or link with `data-route="<screen>-empty"` jumps to the
  matching empty-state screen. The user can review default vs empty
  side-by-side via the canvas, but the prototype lets them step
  through it.

### 5.9 What is NOT simulated

- Actual network requests. No fetch calls to real APIs.
- Auth. The "sign in" form succeeds with any input that passes basic
  validation.
- Persistence beyond sessionStorage (form data clears on full
  reload, except a `data-persist="true"` field).

---

## 6. Real Image Sourcing

No placeholder images. No `picsum.photos`. No "Image" boxes.

### 6.1 Source priority

```
1. User-supplied images       (passed in via the brief or in
                               .design-engine/assets/user/)
2. Brand assets               (logo, favicon — copied from public/)
3. Wikimedia Commons          freely licensed; preferred for portraits,
                              landscapes, products
4. Unsplash                   prefer "Unsplash+" curated set when
                              available; record the photographer
5. Met Museum Open Access     for art / artifacts
6. NASA Image Library         for space / earth imagery
```

### 6.2 Fetch sequence

For each image slot in a screen (avatars, hero photography, product
images, illustrations):

1. Determine the slot's intent from its surrounding context (avatar
   for "Mira Patel", hero photo for "team collaborating", product
   image for "leather wallet").
2. Search the priority sources in order. Web_fetch the API or page,
   pick a result that is licensed for unrestricted use.
3. Download to `assets/images/`. Filename:
   `<slot>-<short-hash>.<ext>`.
4. Append the attribution to `assets/data/credits.json`:
   ```json
   {
     "file": "assets/images/avatar-mira-a3f.jpg",
     "source": "Wikimedia Commons",
     "url": "https://commons.wikimedia.org/wiki/File:...",
     "license": "CC BY-SA 4.0",
     "author": "Photographer Name"
   }
   ```

### 6.3 Avatar fallback

When no real avatar fits, the Avatar component (module 08 §3.9) falls
back to initials over a tonal background. Never use a generic
silhouette PNG.

### 6.4 Attribution

`credits.json` is shipped with the prototype. The prototype's footer
links to a `credits.html` page that renders the file as a readable
list. This satisfies attribution requirements for CC-licensed images.

---

## 7. Device Frame Wrapping

`index.html` wraps the active screen in a device frame appropriate to
the surface.

### 7.1 Frame selection

Drawn from `.design-engine/prototype/<ts>/assets/frames/`.

```
surface = web · product UI       browser.html         (window chrome, dot row, address bar)
surface = web · landing          desktop.html         (no chrome — full viewport)
surface = web · macos app feel   macos-window.html
surface = mobile · ios           iphone-15-pro.html   (notch/dynamic island, home indicator)
surface = mobile · android       android.html         (rounded corners, navigation bar)
surface = tablet                 ipad.html            (when the brief explicitly targets tablet)
```

The frame is an HTML/CSS wrapper that sandboxes the screen iframe at
the correct viewport size. The frame itself is static; only the
iframe's content navigates.

### 7.2 Address bar / status bar realism

- Browser frame: the address bar shows `https://<brief.product>.app/<route>`
  and updates on each navigation. Refresh icon does nothing
  (cosmetic).
- iOS frame: status bar shows real time (updated every minute) and
  a full battery / cellular icon.
- Android frame: same status bar + the Material navigation bar.

### 7.3 Multi-frame view

A small selector in the corner allows switching between web / mobile
frames if the brief covers both surfaces. The screen file is the same
— responsive CSS reflows it for the chosen frame's viewport.

---

## 8. Mobile-Specific Rules

When `surface = mobile`, the prototype enforces:

```
Touch targets:
  - Min 44 × 44 px on iOS, 48 × 48 dp on Android.
  - Spacing between adjacent targets ≥ 8 px.
  - Buttons in lists get full-width tap area.

Safe areas:
  - top: env(safe-area-inset-top) padding for content under notch
  - bottom: env(safe-area-inset-bottom) for content above home
    indicator / nav bar
  - The frame asset already accounts for these; the screen content
    must respect the safe area in its layout.

Gestures:
  - Back gesture (swipe right from edge) navigates back. Implemented
    via touchstart/touchmove on the iframe wrapper.
  - Pull-to-refresh on list screens triggers a 600ms skeleton then
    re-renders. Pure cosmetic — no real fetch.
  - Sheet / drawer opens with slide-up; can be dismissed by drag-down.
    Drag offset is real; release > 30% commits the dismiss.

Native patterns:
  - iOS: large titles in nav, "Cancel"/"Done" placement, sheet
    presentation for modals, sticky bottom action bar.
  - Android: FAB pattern when the brief signals it, top app bar,
    bottom nav, Material You ripple on tap (CSS-only ripple).

Performance:
  - Images served at the matching DPR (no 4× hero on a phone).
  - Animations cut to fade-only when prefers-reduced-motion is on.
```

---

## 9. Playwright Verification

### 9.1 Setup

`prototype.js` exposes a global `__designEngineProbe` that returns the
list of interactive elements + their expected behavior on the current
screen. Playwright reads this during tests.

`verification/playwright.config.ts` is generated:

```ts
export default {
  testDir: ".",
  use: {
    headless: true,
    baseURL: "file://<absolute path to index.html>",
    trace: "on-first-retry",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile",  use: { viewport: { width: 390, height: 844 } } }
  ]
};
```

The `mobile` project is included only when `surface` includes mobile.

### 9.2 Generated tests

`verification/tests.spec.ts` is auto-written. One test per screen,
plus one per cross-screen flow.

```ts
import { test, expect } from "@playwright/test";

test("dashboard renders and primary CTA is reachable", async ({ page }) => {
  await page.goto("?screen=dashboard");
  await expect(page.locator("[data-screen-id=dashboard]")).toBeVisible();
  const cta = page.locator('[data-route]:has-text("Create new")');
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/screen=onboarding-1/);
});

test("settings form accepts input and submits", async ({ page }) => {
  await page.goto("?screen=settings");
  const name = page.locator('input[name="display_name"]');
  await name.fill("Mira Patel");
  await expect(name).toHaveValue("Mira Patel");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.locator(".toast")).toContainText("Saved");
});

test("modal opens, traps focus, closes with ESC", async ({ page }) => {
  await page.goto("?screen=billing");
  await page.getByRole("button", { name: "Cancel plan" }).click();
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
});

test("nav between screens preserves theme + back works", async ({ page }) => {
  await page.goto("?screen=dashboard");
  await page.locator('[data-route="settings"]').click();
  await expect(page).toHaveURL(/screen=settings/);
  await page.goBack();
  await expect(page).toHaveURL(/screen=dashboard/);
});

test("every [data-route] resolves to a real screen", async ({ page }) => {
  await page.goto("?screen=dashboard");
  const routes = await page.locator("[data-route]").evaluateAll(els =>
    els.map(e => e.getAttribute("data-route"))
  );
  for (const r of routes) {
    if (!r || r.startsWith("external:") || r.startsWith("toast:")) continue;
    await page.goto(`?screen=${r.replace(/^modal:|^drawer:/, "")}`);
    await expect(page.locator("[data-screen-id]")).toBeVisible();
  }
});
```

### 9.3 What gets tested

For every screen:

```
- Renders without console errors.
- All [data-route] targets resolve to real screen files.
- All buttons + links are keyboard reachable via Tab.
- Visible focus ring on the focused element.
- All form inputs accept text and validate on blur.
- All modals open + ESC close + click-overlay close + focus trap.
- All toasts auto-dismiss after their configured duration.
- All [aria-*] attributes match expected values per state.
- prefers-reduced-motion: animations cut, behavior unchanged.
- Mobile project only: touch targets ≥ 44x44 (or 48 dp on Android),
  no horizontal scroll at the device width.
```

### 9.4 Failure handling

Playwright runs in `headless: true`. Failures:

- Capture a screenshot to `verification/screenshots/<test-name>.png`.
- Record the failing locator and the assertion.
- Mark the corresponding interaction in `report.json` as `failed`.

The module re-runs each failed test once. Persistent failures bubble
up as defects.

### 9.5 Verification report

After the run, write `verification/report.json`:

```json
{
  "ran_at": "<ISO>",
  "totals": { "tests": 24, "passed": 23, "failed": 1, "skipped": 0 },
  "by_screen": {
    "dashboard":    { "passed": 4, "failed": 0 },
    "settings":     { "passed": 3, "failed": 1 }
  },
  "failures": [
    {
      "test": "settings form accepts input and submits",
      "screen": "settings",
      "expected": "toast contains 'Saved'",
      "actual": "toast not visible after submit",
      "screenshot": "verification/screenshots/settings-form.png"
    }
  ],
  "summary_line": "23/24 interactions verified ✓"
}
```

`verification/report.html` renders the JSON as a human-readable page,
linking failure screenshots inline.

### 9.6 Status output to user

```
Prototype verification: 23/24 interactions verified ✓
  Failure: settings form — toast not visible after submit
  See: verification/report.html for details + screenshots.

Fix and re-verify, or acknowledge to continue?
  [F] Fix         I'll regenerate the failing screen
  [A] Acknowledge ship as-is, log defect to HANDOFF.md
```

A clean run prints:

```
Prototype verification: 24/24 interactions verified ✓
```

And module 15 (critique) consumes the same report.

### 9.7 Hard rule

If verification has unacknowledged failures and ambition is C or D,
HANDOFF.md (module 16) is blocked. The user must either fix or
explicitly acknowledge the failures. Below ambition C, the report is
embedded as a warning in HANDOFF.md but doesn't block.

---

## 10. Status Output

```
Generating prototype · copying 8 screens · wiring routes · injecting real data · fetching images (4) · running Playwright (24 tests) ...
```

After:

```
Prototype ready: .design-engine/prototype/<timestamp>/
  Entry:        open .design-engine/prototype/<timestamp>/index.html
  Screens:      8
  Routes:       17 wired
  Images:       4 (Wikimedia × 2, Unsplash × 1, Met × 1) — see assets/data/credits.json
  Verification: 24/24 ✓

Next: critique → handoff (auto)
```

---

## 11. Output

Prototype mode emits the directory in §2, populates the "What I Know"
object:

```yaml
prototype:
  generated_at:    <ISO>
  path:            .design-engine/prototype/<timestamp>/
  source_canvas:   .design-engine/canvas/<timestamp>/
  screens:         [<screen-id>, ...]
  verification:
    total:         <int>
    passed:        <int>
    failed:        <int>
    acknowledged:  <bool>
  images_used:     <int>
  routes_wired:    <int>
```

Hand off to:
- module 15 (critique) — always, before handoff.
- module 16 (handoff) — after critique passes.

End of prototype mode.
