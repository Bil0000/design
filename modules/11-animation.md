# 11 — Animation

Adapted from huashu-design's animation engine. Battle-tested. Produces
HTML animations that export to MP4 + GIF with BGM, palette
optimization, and 60fps motion-interpolated output.

This module is opt-in. Most design-engine flows do NOT activate it —
animations are a deliberate output kind, not a default. When it does
run, it produces a single export bundle independent of canvas /
prototype / system.

Inputs: brief, system tokens, scene description (or screen list to
sequence). Output dir:
`.design-engine/canvas/<timestamp>/animation/` plus root-level mp4 +
gif files in the same timestamped dir.

Two binding rules govern this module:

> **GPU-only motion.** Animate transform + opacity. No box-shadow,
> width/height, top/left transitions. The engine refuses non-GPU
> properties.
>
> **Watermark on exports only.** A `Created by design-engine` mark
> appears on MP4 and GIF outputs. It is NEVER added to prototypes,
> canvases, the system preview, or any HTML in the working area.

---

## 1. Activation

Run when ANY of:

- Command is `/design landing` AND the brief includes "animation",
  "reveal", "video", "MP4", "GIF", or "trailer".
- The active output_kind is `animation`.
- The user message contains: "create animation", "animate this",
  "feature reveal", "product launch animation", "make a trailer",
  "scrollytelling", "loop", "render to mp4", "render to gif".
- Module 00 (router) selected this module via the routing table for
  "create a launch animation" / similar patterns.

Skip when:

- The brief is for a full system / screens / canvas / prototype with
  no animation request.
- Static prototypes (which use micro-animations from module 08)
  satisfy the request.

Animation mode does not block the standard pipeline. It runs alongside
or independently. A typical flow:

```
brief → system → screens → animation (this module) → handoff
```

The handoff package includes the MP4 + GIF + the source HTML.

---

## 2. File Structure

```
.design-engine/canvas/<timestamp>/animation/
├── animation.html               source HTML — the running animation
├── animation.css                scoped styles + tokens.css inlined
├── animation.js                 Stage + Sprite + Easing + Interpolate runtime
├── scenes/
│   ├── 01-intro.html            optional per-scene fragments
│   ├── 02-feature-1.html
│   └── ...
├── frames/                      Playwright-captured PNG frame sequence
│   ├── 0000.png
│   ├── 0001.png
│   └── ...
├── audio/
│   └── <track-name>.m4a         the chosen BGM track
├── render/
│   ├── output.mp4               final 60fps MP4 (post-interpolation + BGM)
│   ├── output.gif               final palette-optimized GIF (loop)
│   ├── output-1080.mp4          1080p variant (when --variants)
│   ├── output-square.mp4        1:1 social variant (when --variants)
│   └── render.log               ffmpeg run log
└── meta.json                    duration, fps, scenes, BGM, watermark on/off
```

Root-level convenience symlinks (or copies on Windows):

```
.design-engine/canvas/<timestamp>/output.mp4   → animation/render/output.mp4
.design-engine/canvas/<timestamp>/output.gif   → animation/render/output.gif
```

So users can find the deliverables without spelunking.

---

## 3. The Animation Engine

Four components. All defined in `animation.js`. Plain JS, no framework.

### 3.1 Stage

The container/canvas that animations run inside. Manages the master
clock, scene scheduling, and lifecycle hooks.

```js
const stage = new Stage({
  width: 1920,
  height: 1080,
  duration: 12000,         // total ms
  fps: 25,                 // capture rate (engine internal — see §4)
  background: "var(--bg-base)",
  scenes: [scene1, scene2, scene3]
});

stage.onTick((t) => { /* every frame */ });
stage.onSceneEnter((scene) => { /* scene boundary */ });
stage.start();
```

Responsibilities:

- Owns the playhead (`t` in ms from 0).
- Resolves which scene is active at any `t` and renders only that
  scene's sprites.
- Manages crossfades between adjacent scenes (default 200ms).
- Mounts/unmounts sprites to keep the DOM small (max 80 active
  sprites at once — beyond, scenes split).
- Fires lifecycle hooks for capture (Playwright drives these).

### 3.2 Sprite

Individual animated element with a state machine. A sprite is a
positioned, animated DOM node with one or more keyframe tracks.

```js
const card = new Sprite({
  selector: ".feature-card",
  origin: "center",
  initial: { opacity: 0, x: 0, y: 40, scale: 0.96 },
  keyframes: [
    { at: 0,    state: { opacity: 0, y: 40, scale: 0.96 } },
    { at: 200,  state: { opacity: 1, y: 0,  scale: 1.00 }, easing: "spring" },
    { at: 4000, state: { opacity: 1 } },
    { at: 4400, state: { opacity: 0, y: -20 }, easing: "in" }
  ]
});
stage.add(card);
```

Rules:

- Only `opacity`, `x`, `y`, `scale`, `rotate`, `blur` (filter),
  `colorIndex` (token-driven) accepted in keyframe state. Anything
  else throws at sprite construction.
- `x` / `y` translate via `transform: translate3d(x,y,0)` only.
- `scale` and `rotate` compose into the same transform string.
- `colorIndex` switches between pre-declared color tokens at the next
  keyframe; the engine never tweens raw colors (oklch interpolation
  is allowed via Interpolate §3.4 but the canonical sprite path is
  discrete switches at keyframe boundaries).

### 3.3 Easing — the full library

Every sprite keyframe references an easing by name. Library:

```
"linear"        cubic-bezier(0, 0, 1, 1)
"out"           cubic-bezier(0, 0, 0.2, 1)        entering / appearing
"in"            cubic-bezier(0.4, 0, 1, 1)        leaving / dismissing
"in-out"        cubic-bezier(0.4, 0, 0.2, 1)      transitions in place
"spring"        cubic-bezier(0.34, 1.56, 0.64, 1) delight, sparingly
"bounce"        custom 4-keyframe bounce          landing impacts only
"smooth"        cubic-bezier(0.45, 0, 0.55, 1)    long easing-in-out alt
"snap"          cubic-bezier(0.85, 0, 0.15, 1)    sharp midpoint transitions
"fast-out-slow-in" cubic-bezier(0.4, 0, 0.2, 1)   Material standard
"emphasized"    cubic-bezier(0.2, 0, 0, 1)        Material 3 "emphasized"
```

Defaults match SKILL.md §6 motion rules + system tokens (module 07
§1.10). Easing names map to the exact cubic-bezier values; the engine
also accepts a raw `[x1, y1, x2, y2]` array for custom curves.

### 3.4 Interpolate — value tweening

For values that shouldn't snap. Used by Stage internally; usable in
custom hooks.

```js
const v = Interpolate({
  from: 0,
  to:   1,
  t,                    // 0..1
  ease: "out"
});

const c = Interpolate.color({
  from: "oklch(0.10 0.005 264)",
  to:   "oklch(0.20 0.012 264)",
  t,
  ease: "in-out"
});
```

Supported types: number, oklch color, transform-string composite,
SVG path `d` attribute (rare; used for icon morphs only).

For oklch interpolation, mix in oklch color space — DON'T mix in sRGB
and convert. Keeps mid-tweens perceptually linear.

---

## 4. Frame Capture (Playwright)

Capture rate is **25 fps** at the engine level. The engine pauses the
master clock between frames so capture is deterministic.

### 4.1 Sequence

1. Open `animation.html` in Playwright with viewport matching the
   stage size.
2. Wait for `window.__designEngineAnim.ready === true`.
3. For each frame `n` from 0 to `floor(duration_ms * 25 / 1000) - 1`:
   - Call `window.__designEngineAnim.seek(n * 40)` (40ms per frame
     at 25 fps).
   - Wait for `window.__designEngineAnim.frameReady === true`.
   - `await page.screenshot({ path: "frames/" + pad(n) + ".png" })`.
   - Reset `frameReady = false`.
4. Close the page.

Determinism notes:

- All sprites must `requestAnimationFrame`-flush before
  `frameReady = true`. The engine handles this in its `seek` impl.
- Web fonts must be loaded before frame 0. The capture script
  awaits `document.fonts.ready`.
- Any image used in the animation must be preloaded before frame 0
  (no lazy decode mid-capture).

### 4.2 Why 25 fps base

25 fps is enough resolution for keyframe authoring while keeping
capture cost low (one-quarter the frames of 100 fps). The
post-process motion-interpolates to 60 fps for smooth playback.

---

## 5. MP4 / GIF Export Pipeline

Run after the frame sequence is captured.

### 5.1 60 fps interpolation

ffmpeg's `minterpolate` filter doubles + smooths the frame sequence:

```
ffmpeg -framerate 25 -i frames/%04d.png \
  -vf "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:vsbmf=1, format=yuv420p" \
  -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p \
  -movflags +faststart \
  render/output-no-audio.mp4
```

Notes:

- `minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:vsbmf=1` is the
  motion-compensated interpolation mode. Best quality among
  minterpolate options for clean GUI motion.
- `crf 18` is visually lossless for typical UI content while keeping
  files small.
- `yuv420p` for broad platform compatibility.

### 5.2 BGM mix

Add the chosen BGM track (§6) to the silent video:

```
ffmpeg -i render/output-no-audio.mp4 -i audio/<track>.m4a \
  -filter_complex "[1:a]afade=t=in:st=0:d=0.6,afade=t=out:st=<duration_s - 0.6>:d=0.6[a]" \
  -map 0:v -map "[a]" \
  -c:v copy -c:a aac -b:a 192k \
  -shortest \
  render/output.mp4
```

Auto-fade: 600ms in + 600ms out. The fade-out start time equals
animation duration in seconds minus 0.6. Mute the original video
track; only BGM survives.

### 5.3 GIF palette optimization

Two-pass palette: generate then apply. Standard quality / file size
balance.

```
ffmpeg -i render/output.mp4 \
  -vf "fps=24,scale=1080:-1:flags=lanczos,palettegen=stats_mode=diff" \
  render/palette.png

ffmpeg -i render/output.mp4 -i render/palette.png \
  -filter_complex "fps=24,scale=1080:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=floyd_steinberg" \
  render/output.gif
```

Notes:

- 24 fps GIF (one frame less than capture; perceptually smooth, file
  smaller).
- 1080 max width by default (override with `--gif-width=720` etc.).
- `dither=floyd_steinberg` is the default; `dither=bayer:bayer_scale=5`
  is the option for larger flat areas of color.
- 256-color palette per frame after generation.

### 5.4 Variants (optional `--variants` flag)

```
output-1080.mp4    1080p downscale of the master (1080x607 or 1080x1080)
output-square.mp4  1:1 crop centered, 1080x1080, for social
output-9x16.mp4    1080x1920 portrait crop, for stories / shorts
output-poster.png  single frame at the visual peak (frame N detected
                   by the engine via its onPeakFrame hook)
```

All variants reference the same minterpolated source and the same
BGM mix.

### 5.5 Render log

`render/render.log` captures every ffmpeg command run + duration +
exit code. Useful when a render fails partway and the user needs to
re-run a step.

---

## 6. BGM Library — 6 Tracks

Audio files live in the skill's `assets/animation-engine/audio/` (not
checked here — sourced from huashu's library). Each track is licensed
for commercial use; license info ships with the export.

```
1. atlas         calm cinematic build
                 90 BPM · 0:30 fadeable to 0:14 / 0:30 / 1:00
                 Use: product launch hero, brand-forward reveals
                 Mood: confident, expansive, no urgency

2. cadence       crisp UI bed
                 110 BPM · 0:14 / 0:30
                 Use: feature highlight loop, marketing reels
                 Mood: clean, productive, momentum

3. lattice       glitchy electronic
                 120 BPM · 0:14 / 0:30
                 Use: developer tool launches, technical reveals
                 Mood: precise, modern, mildly playful

4. drift         ambient pad
                 70 BPM · 0:30 / 1:00
                 Use: onboarding loops, atmospheric backgrounds
                 Mood: meditative, low-pressure, soft

5. signal        upbeat pop-electronic
                 124 BPM · 0:14 / 0:30
                 Use: consumer app launches, social-media-ready clips
                 Mood: energetic, broadly appealing

6. monolith      orchestral swell
                 80 BPM · 0:30 / 1:00
                 Use: enterprise launches, milestone announcements,
                       trailers
                 Mood: weighty, important, ceremonial
```

### 6.1 Auto-selection rules

If the user doesn't pick a track, the engine picks based on brief
signals:

```
ambition D + landing                     → monolith
ambition C + devtool / technical brief   → lattice
ambition C + consumer brief              → signal
ambition B + product launch              → atlas
ambition B + feature reveal              → cadence
ambition A or onboarding loop            → drift
```

The auto-selection is logged in `meta.json`. The user can override
with `--bgm=<name>` or `--bgm=none` (silent export).

### 6.2 Length matching

Each track ships in cuts of varying length. The engine picks the
shortest cut that exceeds the animation duration, so trimming is
minimal. Auto-fade absorbs the extra tail.

---

## 7. Use Cases

Each use case is a starter scene set the engine can stamp out and
edit. The user invokes one via the command flag or natural language.

### 7.1 Product launch animation

```
Duration:      0:14 (default), 0:30 (extended)
Structure:     intro (1s) → product big-reveal (3s) → 3 features (3 × 2s) → close + CTA (4s)
Key sprites:   product hero card, feature tiles, headline, CTA button
Default BGM:   atlas (or monolith for ambition D)
Frame:         desktop or browser frame; full-bleed for landing
Watermark:     bottom-right, 50% opacity, system mono font
```

### 7.2 Feature reveal sequence

```
Duration:      0:30
Structure:     intro headline (2s) → 5–6 features (4–5s each) → outro (3s)
Key sprites:   per-feature card + caption pair, transitions cross-fade
Default BGM:   cadence
Frame:         browser frame for product features; full-bleed for marketing
```

### 7.3 Onboarding animations (for prototypes)

```
Duration:      0:14 (loop)
Structure:     three steps in sequence, loop seamlessly
Key sprites:   illustration per step + label + progress dots
Default BGM:   drift (or none for in-product use)
Frame:         iphone-15-pro for mobile flows; browser otherwise
Output:        gif primary (loops in product), mp4 optional
Watermark:     none for in-product GIFs (hard exception — see §9)
```

### 7.4 Marketing video content

```
Duration:      0:30 or 1:00
Structure:     custom — driven by user-supplied scene script
Key sprites:   user-defined; engine still enforces GPU-only motion
Default BGM:   user choice; auto picks per ambition (§6.1)
Frame:         user choice; landing → full-bleed; product → browser frame
Variants:      auto-render --variants when --variants flag set
```

---

## 8. Device Frame Rules For Animations

Animations differ from prototypes — the frame is part of the
composition, not just review chrome.

```
Use a frame when:
  - The animation features the product UI itself (feature reveal,
    onboarding, product walkthrough).
  - The brief targets a specific surface (mobile → iphone frame).
  - The output is meant to feel like a recording of real software.

Use full-bleed (no frame) when:
  - The animation is brand / marketing / hero — the canvas IS the art.
  - The animation will be embedded in a marketing site whose own
    chrome already provides context.
  - The output is a 1:1 / 9:16 social variant (frames don't fit).

Default per use case:
  product launch        full-bleed
  feature reveal        browser frame (product UI feature)
                        full-bleed (marketing reveal)
  onboarding (mobile)   iphone-15-pro
  onboarding (web)      browser
  marketing video       per user choice
```

When a frame is used, the watermark sits inside the canvas of the
frame, not on the device chrome itself, so it survives any subsequent
re-cropping.

---

## 9. Watermark — Exports Only

Mark text: `Created by design-engine`. Renders in the system's mono
font at the size that yields ~14 px glyph height at the export
resolution. Color is `text-tertiary` at 50% opacity.

### 9.1 Where it appears

- `output.mp4` — yes
- `output.gif` — yes
- All MP4 / GIF variants — yes
- The single-frame poster PNG — yes

### 9.2 Where it does NOT appear

- `animation.html` (source) — no
- prototypes — no
- canvas — no
- system preview — no
- in-product onboarding GIFs (§7.3 hard exception when `--in-product`
  flag is set; the user is shipping the GIF inside their app and
  doesn't want a third-party watermark)

### 9.3 Implementation

The watermark is composited at the ffmpeg step, not in the HTML, so
it can never accidentally leak into non-export artifacts. ffmpeg
overlay filter:

```
-vf "drawtext=fontfile='<mono-font-path>':text='Created by design-engine':\
  x=w-tw-24:y=h-th-24:fontsize=14:fontcolor=0xB0B0B0@0.5"
```

Position: bottom-right, 24px inset from each edge. Font: the system
mono token (`var(--font-mono)`) resolved to its actual file path at
render time.

---

## 10. Status Output

```
Generating animation · 14s @ 25fps · scenes (3/3) · capturing frames (350) · interpolate to 60fps · BGM · GIF palette · watermark ...
```

After:

```
Animation ready: .design-engine/canvas/<timestamp>/animation/
  Source:    animation/animation.html
  Master:    animation/render/output.mp4   (60fps · 1920×1080 · 14.0s · 8.4 MB)
  GIF:       animation/render/output.gif   (24fps · 1080×608 · 4.1 MB)
  BGM:       atlas (auto-picked) · faded 0.6s in/out
  Frames:    350 captured · interpolated to 840
  Watermark: applied (export-only)
```

---

## 11. Output

Animation mode emits the directory in §2 plus the symlinked outputs
at the canvas root, populates the "What I Know" object:

```yaml
animation:
  generated_at:      <ISO>
  path:              .design-engine/canvas/<timestamp>/animation/
  duration_ms:       <int>
  fps_capture:       25
  fps_output:        60
  scenes:            <int>
  bgm_track:         <name>
  variants:          [<list>]
  outputs:
    mp4:             <path>
    gif:             <path>
    poster:          <path | null>
  watermark_applied: true | false
```

Hand off to:
- module 15 (critique) — adds an "animation" axis to the score
  (timing, restraint, motion discipline).
- module 16 (handoff) — bundles MP4 + GIF + source HTML in
  `handoff/assets/animations/`.

End of animation.
