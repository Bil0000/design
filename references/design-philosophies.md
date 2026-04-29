# Design Philosophies — The 20

The Direction Advisor's library. When the brief is vague, modules 02
(interview) and 06 (system-selection) draw three options from this
list — one each from three different schools — and present parallel
demos.

The 20 philosophies are organized into 5 schools. Pick across schools
to maximize the spread of options shown to the user.

---

## Schools at a glance

```
School 1 — Information Architecture
  01. Pentagram / Bierut
  02. Massimo Vignelli
  03. Edward Tufte
  04. IBM Design Language

School 2 — Motion & Kinetics
  05. Field.io
  06. Apple HIG
  07. Material Motion
  08. Stripe

School 3 — Minimalism
  09. Kenya Hara / Muji
  10. Dieter Rams
  11. Vercel
  12. Linear

School 4 — Experimental
  13. Stefan Sagmeister
  14. David Carson
  15. Brutalism
  16. Bento

School 5 — Cultural / Eastern
  17. Japanese Wabi-sabi
  18. Chinese Modern
  19. Bauhaus
  20. Swiss International
```

---

## 01 — Pentagram / Michael Bierut

**School:** Information Architecture
**Designer / firm:** Michael Bierut, Pentagram (NYC)

**Core principles**
- Typography is language. Choose voice over decoration.
- Swiss grid + American confidence.
- 60%+ negative space. Whitespace is structure, not absence.
- Asymmetric layouts with strong axes.
- One distinctive type decision per project.
- Editorial pacing: heroes earn their size.
- Restraint everywhere except the chosen statement.

**Visual signature**
Generous left-aligned columns, oversized display headlines, tight
tracking on display, photo-driven heroes anchored to the type. A
single accent color used sparingly.

**Typography**
Helvetica Now / Söhne / Untitled Sans for body. Display: a custom
serif (Caponi, Marfa Display) or geometric sans at large sizes. Tight
tracking on display (-0.04em+). Mono only for codes.

**Color**
Almost monochrome. One brand color used at 5–10% of the surface area
maximum. White or off-white as base.

**Best for**
Cultural institutions, publications, premium B2B brand sites,
identity systems, agency portfolios, books-and-museums.

**Not for**
Product UI for everyday use. Anything dense or data-heavy. Mobile-
first consumer apps.

**Reference**
Pentagram (pentagram.com), MIT Media Lab identity, Slack rebrand
(2019), New York Times Magazine, Fast Company redesign, AICP.

**How to generate**
- 1 brand hue, 1 accent. Neutrals tilted warm.
- Display 56–80px on landings; tighten tracking magnitude with size.
- Layout: 12-col grid with content blocks at 6/8/12 col widths,
  asymmetric rather than centered.
- Hero photography or oversized type. Avoid icons in heroes.
- Body 18–20px (editorial reading width).
- Motion: minimal, 250–400ms, deliberate.
- One distinctive moment: a typographic flourish, a custom display
  cut, a hand-drawn detail.

---

## 02 — Massimo Vignelli

**School:** Information Architecture
**Designer:** Massimo Vignelli (Italian, NYC studio)

**Core principles**
- A handful of typefaces, ever (his "12 typefaces I use").
- Grid as discipline. Every element on the grid.
- Geometric shapes derived from rules, not impulse.
- Limited palette — black, white, red, occasional yellow.
- Information hierarchy via size + weight, never decoration.
- Solve the problem then stop. No flourish.
- Typography is the design.

**Visual signature**
Mathematical layouts. Helvetica or Bodoni. Bright primary color
blocks. NYC subway map energy. Clear, grid-locked, indelible.

**Typography**
Helvetica Bold + Helvetica Regular (the canonical pair), or Bodoni
+ Bodoni for editorial. Two faces, two weights, full stop. Tight
tracking on caps, generous leading.

**Color**
Black + white + one chromatic accent (often red or yellow). No
gradients. No tints. Pure colors.

**Best for**
Wayfinding, transit systems, identity programs, modernist
publications, signage, pure-typographic editorial.

**Not for**
Warm or playful brands. Anything requiring photography. Modern
SaaS that needs personality.

**Reference**
NYC subway signage, American Airlines (1968 identity), Knoll
furniture, Bloomingdale's, Vignelli's Unimark work.

**How to generate**
- 2 typefaces max. Helvetica + nothing, or Bodoni + Helvetica for
  editorial.
- Pure color blocks. No drop shadow, no gradient, no rounded corners
  (radius 0 or 2px).
- Strict 12-col grid. All elements align.
- 1 chromatic color (red default, yellow alt).
- Body 16–18px Helvetica Regular.
- Motion: instantaneous. No transitions on layout. Hover state =
  color change only.

---

## 03 — Edward Tufte

**School:** Information Architecture
**Designer:** Edward Tufte (writer / educator)

**Core principles**
- Data-ink ratio: maximize information, minimize chartjunk.
- Small multiples beat one big chart.
- Sparklines: word-sized graphics inline with prose.
- Layer information; reveal on demand.
- Avoid 3D, gradients, drop-shadows on data.
- The grid is the author's tool, not the reader's distraction.
- Reading is editing — every removable element is a victim.

**Visual signature**
Dense, calm pages. Numbers everywhere. Tiny inline charts. Generous
margins for marginalia. Off-white paper, black ink, occasional muted
red.

**Typography**
ET Book (his own typeface), Bembo, or any restrained serif. 14–16px
body. Generous line-height (1.55+). Margins for sidenotes (in
Markdown: footnotes inline).

**Color**
Off-white #FFFFFA, black, occasional muted red (#820000). No
chromatic palette beyond.

**Best for**
Analytical dashboards, scientific publications, financial data,
reports, longform nonfiction, visualizations.

**Not for**
Anything aspirational, anything with hero photography, brand-led
products, mobile-first consumer apps, marketing.

**Reference**
edwardtufte.com, *The Visual Display of Quantitative Information*
(book), Bret Victor's essays, Observable notebooks (in Tufte mode).

**How to generate**
- ET Book or Bembo serif. Body 14–16px. Line-height 1.55.
- Off-white bg (#FFFFFA), text #111.
- Muted red accent (#820000) at 1–2% coverage max.
- Sparklines + small multiples, NOT large charts.
- Margins for sidenotes (left or right).
- Tables with hairline borders only.
- Zero rounded corners, zero shadows, zero icons (only typographic
  glyphs and rules).
- Charts: line + dot, no fill, axis lines only when necessary.

---

## 04 — IBM Design Language (Carbon)

**School:** Information Architecture
**Company:** IBM (Carbon Design System)

**Core principles**
- Systematic. Tokens before components. Components before pages.
- Scalable across thousands of products.
- Enterprise clarity. AAA contrast where possible.
- Plex (their typeface) for everything. One family, four weights.
- 4px base spacing, 16-col fluid grid.
- Motion: standard, productive, expressive — three tiers.
- Accessibility is a primary requirement, not a feature.

**Visual signature**
Carbon-blue accent. Dense data tables. Highly systematized
components. Slightly stiff, very legible. Reads "this works at scale".

**Typography**
IBM Plex Sans (body), IBM Plex Mono (code), IBM Plex Serif
(editorial only). 14px body baseline.

**Color**
Carbon blue (#0F62FE) primary. Cool grey neutrals. Status colors
restrained.

**Best for**
Enterprise software, government, large-scale platforms, AI/ML
tooling, anything where >100 components must coexist.

**Not for**
Consumer-warm products, distinctive brand-led startups. Carbon is
generic by design — that's the point at IBM scale, but a startup
inheriting it inherits IBM-ness.

**Reference**
IBM Cloud, Watson, Carbon Design System (carbondesignsystem.com),
TurboTax (uses Carbon-derived patterns).

**How to generate**
- IBM Plex Sans body, Plex Mono code.
- Carbon blue accent + cool slate neutrals.
- 4px base, 16-col grid.
- Component-system thinking: define tokens fully, generate every
  variant.
- AAA contrast on body text.
- Motion: 240ms standard duration, ease-in-out.
- Density: high — 32px button height, 14px body, 13px in tables.

---

## 05 — Field.io

**School:** Motion & Kinetics
**Studio:** Field.io (London / Berlin)

**Core principles**
- Motion as the primary medium of communication.
- Physics: real friction, real momentum, real inertia.
- Generative design — code-driven imagery.
- Loops that don't loop. Endless variation.
- Sound as design (when surface allows).
- Type as kinetic material, not static labels.
- Every state has a between-state.

**Visual signature**
Black / dark backgrounds. Vibrant chromatic accent. Continuously
animating WebGL or SVG type compositions. Cursor-aware reactive
elements. Hero loops that read as art.

**Typography**
Custom kinetic typefaces (their own, or variable fonts). Often
oversized + always animating. Mono for technical chrome.

**Color**
Pure black or near-black. One vivid accent (chromatic, often
blue/cyan/magenta). High-saturation moments.

**Best for**
Brand sites for technical/creative companies (Sonos, Nike, Adobe).
Product launches. Identity reels. Anything where the medium itself
demonstrates capability.

**Not for**
Productivity tools. Dashboards. Forms-heavy products. Performance-
sensitive surfaces. Mobile-first consumer apps where battery matters.

**Reference**
field.io, the Sonos brand site (early-2020s), Adobe Substance,
Acne Studios moments, Universal Everything.

**How to generate**
- Always-running canvas/WebGL/SVG composition as hero.
- Cursor / scroll reactivity.
- Vivid chromatic accent on black bg.
- Variable type at hero sizes, weight or width animating.
- Motion ladder skews longer (200–600ms) to allow the physics to land.
- Spring easing dominant.
- One distinctive interaction per section.
- Performance budget enforced — animations must run at 60 fps on
  mid-tier hardware.

---

## 06 — Apple HIG

**School:** Motion & Kinetics
**Company:** Apple (Human Interface Guidelines)

**Core principles**
- Animation has purpose: transitions communicate spatial relationships.
- Continuity: things that come and go follow the natural arc of where
  they belong.
- Direct manipulation: gestures are the primary input.
- Hierarchy through depth (iOS 16+ Dynamic Island).
- SF Pro (or SF Compact) is the typeface. No exceptions.
- Restraint in chrome, energy in moments.
- Physical materials: vibrancy, blur, lensing.

**Visual signature**
SF Pro at every size. Generous spacing. Blur and translucency. Sheets
that slide up, modals that scale-and-fade, transitions that emerge
from their trigger element.

**Typography**
SF Pro (display + body), SF Mono. Optical sizing: SF Pro Display ≥
20pt, SF Pro Text < 20pt. iOS dynamic type respects user preferences.

**Color**
System colors (label, secondaryLabel, tertiaryLabel; systemBlue;
systemFill). Adaptive light/dark with semantic tokens.

**Best for**
Native iOS / macOS / iPadOS apps. Web apps that target Apple-ecosystem
users. Brand sites for Apple-adjacent products.

**Not for**
Cross-platform products that should feel "anywhere". Android-first
products. Web products that reach broad demographics.

**Reference**
Apple's own apps (Health, Fitness, Notes, Settings), Things 3, Bear,
Linear (web app borrows HIG patterns).

**How to generate**
- SF Pro everywhere. Optical size split at 20pt.
- iOS spacing: 16/20pt margins, 44pt minimum touch targets.
- Sheets present from bottom; modals from center; popovers from
  trigger.
- Blur on chrome over content (nav bars, side bars).
- Motion: 250–400ms with spring physics for delightful actions, 150–
  200ms ease-out for chrome.
- Color: adaptive semantic tokens, not raw values.
- Haptics implied at every state change in native; on web, subtle
  scale to indicate "press".

---

## 07 — Material Motion (Material 3)

**School:** Motion & Kinetics
**Company:** Google (Material Design)

**Core principles**
- Shared element transitions: an element that lives in two places
  animates between them.
- Container transform: a card opens INTO a detail view, becoming the
  view.
- Standard easing: motion is fast in, slow out, never linear.
- Three duration tiers: short (50–100), medium (250–500), long (500+).
- Material You: dynamic color extracted from the user's wallpaper.
- Elevation: real shadows + tonal surfaces.
- Tap ripple from the touch point.

**Visual signature**
Layered surfaces with elevation. Floating action button (FAB).
Top app bar that scrolls and shrinks. Bottom navigation. Ripple
feedback. Material You's adaptive palette.

**Typography**
Roboto / Roboto Flex / Google Sans. Display 48–96, Headline 24–32,
Title 16–22, Body 14–16. Numerics tabular for data.

**Color**
Material color tokens (primary, secondary, tertiary + onColor variants
for each). Tonal palettes derived programmatically from a single
seed color.

**Best for**
Native Android apps. Cross-platform apps that prioritize Android.
Anything with motion-as-explanation requirements.

**Not for**
iOS-first apps (HIG patterns conflict). Brand-led products that need
deliberate identity (Material is intentionally generic across apps).

**Reference**
Google apps (Gmail, Calendar, Maps), Material 3 demo
(material.io), most modern Android apps.

**How to generate**
- Roboto / Google Sans. Material 3 type scale.
- Material You tokens (primary, secondary, tertiary, onPrimary, etc.).
- 8px base unit (Material standard).
- Elevation shadows on light mode; tonal surfaces on dark.
- FAB pattern when there is a primary action floating from screen.
- Bottom nav for ≤ 5 destinations.
- Motion: 300ms standard, fast-out-slow-in, container-transform on
  detail navigation.
- Ripple effect on every tappable surface.

---

## 08 — Stripe

**School:** Motion & Kinetics
**Company:** Stripe

**Core principles**
- Micro-interaction precision. 100–150ms standard.
- Trust through detail: every state designed, every edge case handled.
- Authoritative warmth: serif for editorial, sans for chrome.
- Documentation-grade code blocks.
- Dense data without crowding.
- One distinctive ambient effect (the "Stripe gradient").
- Motion choreography: hero animations with multiple shapes coordinated.

**Visual signature**
Warm off-white bg. Serif headings (Stripe's custom). Sans body
(Sohne). Subtle ambient gradient backgrounds (their signature).
Generous use of authentic UI screenshots in marketing.

**Typography**
Custom serif (Stripe Sans / serif blend) + Sohne body. 16–17px body.
Code: Sohne Mono.

**Color**
Warm off-white #F6F9FC base, near-black text. Brand purple
#635BFF as accent (rare). Their famous ambient gradient (3-color
soft mesh) for hero backgrounds only.

**Best for**
Fintech, payments, billing platforms, SaaS that wants warmth +
authority. Documentation-heavy marketing.

**Not for**
Brutalist or minimal-cool brands. Mobile-only consumer apps.

**Reference**
stripe.com, stripe.com/docs, Stripe Atlas, Mailchimp (similar
warmth), Mercury Bank (Stripe-influenced).

**How to generate**
- Warm off-white bg. Body 16px serif-OR-sans (sans for chrome,
  serif for editorial blocks).
- Brand purple at 1–2% coverage maximum.
- Ambient gradient (3-stop soft mesh) ONLY in marketing hero.
- 100/150ms motion standard, ease-out.
- Documentation-grade code blocks with proper syntax highlighting.
- Real screenshots, not stylized abstractions.
- Tables with subtle row striping at 2% bg shift.

---

## 09 — Kenya Hara / Muji

**School:** Minimalism
**Designer:** Kenya Hara (Muji art director)

**Core principles**
- Ma (negative space) is a positive element.
- Subtraction, not addition. The design is what's removed.
- Material truth: paper looks like paper, wood like wood, screen like
  screen.
- Quiet beauty: nothing shouts.
- One distinctive choice that registers as Hara, not as decoration.
- Sensory restraint: no chromatic loudness.
- The Japanese spatial concept of MA between elements.

**Visual signature**
Vast white. Tiny chromatic accent (often muted earth tone). Single
photograph or illustration centered with extreme breathing room.
Type understated, often Helvetica or a humanist sans.

**Typography**
Yu Gothic / Hiragino Kaku Gothic for Japanese; Helvetica Neue or
Akkurat for Latin. 14–16px body, generous leading (1.7+). Display
sizes restrained, never bombastic.

**Color**
Off-white or paper-white base. One muted accent (rust, sage, slate).
Neutrals tilted warm to feel like paper, not screen.

**Best for**
Lifestyle brands, premium consumer goods, hospitality, museums,
publications. Anything where calm = quality.

**Not for**
Productivity, dashboards, dense data. Anything that NEEDS to shout.

**Reference**
muji.com, kenyahara.com, japanese product design (Naoto Fukasawa's
work), Aesop, hospitality-grade brand sites.

**How to generate**
- 80%+ negative space.
- 1 muted earth-tone accent at 1–2% coverage.
- Hero: a single photograph or quiet illustration, centered, with
  vast surrounding space.
- Body 14–16px, line-height 1.7.
- Layout: editorial column at 60–70 ch, never edge-to-edge.
- Motion: deliberate (400–600ms), often fade only.
- Distinctive moment: a single typographic detail or a hairline rule
  that organizes the page.

---

## 10 — Dieter Rams

**School:** Minimalism
**Designer:** Dieter Rams (Braun)

**Core principles**
The 10 principles, abbreviated:
1. Innovative
2. Useful
3. Aesthetic
4. Understandable
5. Unobtrusive
6. Honest
7. Long-lasting
8. Thorough down to the last detail
9. Environmentally friendly
10. As little design as possible

**Visual signature**
Industrial precision. Off-white surfaces. Grids of products. Tiny
typography. One pure color (often Braun orange or pure red) used
ceremonially.

**Typography**
Akzidenz-Grotesk, Helvetica, or Univers. Tiny body sizes (12–14px).
Tight tracking. Clear hierarchy via size, not weight.

**Color**
Whites, light greys, blacks. One vivid color used for affordance
(record button red, "on" indicator green) only.

**Best for**
Industrial-design adjacent brands, tools-for-makers, premium hardware
companies, photography portfolios, modernist publications.

**Not for**
Consumer marketing. Anything warm or playful. Most modern SaaS.

**Reference**
Apple's product photography (post-2007 — Jony Ive cited Rams),
Braun's catalog (any era), Vitsoe, Leica.

**How to generate**
- Off-white surfaces. 95% neutral.
- 1 chromatic color used ceremonially (an "on" indicator, a status).
- 4–8px base unit (precision).
- Typography small + tight + clear. 12–14px body.
- No decoration. Function-first composition.
- Motion: instant or near-instant. No flourish.

---

## 11 — Vercel

**School:** Minimalism
**Company:** Vercel

**Core principles**
- Black is black. White is white. Maximum contrast.
- Radius 0. Commit to flat.
- Documentation-grade typography (Geist Sans + Geist Mono).
- Deliberate negative space.
- Performance is the design.
- Motion present but extremely restrained (150ms).
- Code is content; render it beautifully.

**Visual signature**
Pure black or pure white surfaces. No radius. No shadows. Tiny accent
(often a single brand element). Code blocks that are art.

**Typography**
Geist Sans + Geist Mono. 16px body. Tight, modern, geometric. Display
sizes use the same family at heavier weight.

**Color**
Pure white #FFFFFF or pure black #000000. Greys at extreme L
distance. One accent (cyan, magenta, or green per Vercel sub-brand).

**Best for**
Developer tools, hosting, infrastructure, documentation sites.
Brand sites for tech-fluent audiences.

**Not for**
Warm consumer products. Anything requiring softness. Older audiences.

**Reference**
vercel.com, nextjs.org, Resend, Linear (similar discipline).

**How to generate**
- Pure black + pure white surfaces.
- Radius 0 everywhere. No exceptions.
- Geist Sans + Geist Mono.
- 16px body. Line-height 1.6.
- One accent at < 1% coverage.
- Motion: 150ms standard, ease-out, transform + opacity only.
- Code blocks: render with full syntax highlighting, mono font, no
  background "boxes" — just inline color shifts.

---

## 12 — Linear

**School:** Minimalism
**Company:** Linear

**Core principles**
- Density as aesthetic. 13px body.
- Precision as identity. 6px radius. 4px base. 100ms motion.
- Keyboard-first interaction.
- Mono numerals in chrome (issue IDs, status pills).
- One accent ladder, used sparingly.
- Border elevation in dark, never shadow.
- Real-time everywhere (presence indicators, live updates).
- Empty states are designed.

**Visual signature**
Dark mode default. Tight density. Issue lists, project boards,
keyboard hints visible. Mono ID chips. Active sidebar item with the
sliding accent indicator.

**Typography**
Inter Display (their own modification of Inter) + Inter Variable +
Berkeley Mono. 13px body, dense lines (1.5).

**Color**
oklch L 0.10 base + L 0.14 surface ladder. Single accent (purple in
their case, but the ladder pattern matters more than the hue).

**Best for**
Developer tools, project management, issue trackers, internal
tools. Power-user productivity.

**Not for**
Consumer apps, marketing-grade interfaces, enterprise procurement
buyer audiences.

**Reference**
linear.app, height.app, raycast (similar density), planetscale (similar
dark-mode aesthetics).

**How to generate**
- Dark default, oklch grey ramp.
- 13px body, 4px base, 6px radius, 100/150ms motion.
- Border elevation, no shadows.
- Mono in IDs / status / numeric chrome.
- Keyboard hints visible (cmd+K, /, ?).
- Active sidebar item with translateX accent bar.
- Empty states designed with realistic mock data + CTA.
- Single accent ladder (subtle/default/hover/press).

---

## 13 — Stefan Sagmeister

**School:** Experimental
**Designer:** Stefan Sagmeister (Sagmeister & Walsh)

**Core principles**
- Emotional first. Rule-breaking second. Restraint never.
- Design as autobiography. The designer is in the work.
- Type as image. Image as type.
- Risk is the strategy.
- Repetition with variation.
- Beauty matters. Beauty is the function.
- Hand-made marks in a digital world.

**Visual signature**
Hand-crafted typography. Photographic compositions where letters are
made of physical objects. Bold conceptual moves. Maximalist, not
minimalist. Color used boldly.

**Typography**
Custom every time. Display is hand-drawn or photographed. Body might
be Akzidenz or a serif, but the display is the project.

**Color**
Saturated. Often clashing intentionally. Brand color shifts per piece.

**Best for**
Identity work, album covers, creative portfolios, cultural projects,
brand films. Anything where personality > consistency.

**Not for**
Productivity tools. Systems. Anything requiring multi-product scale.

**Reference**
sagmeisterwalsh.com, Lou Reed album covers, Aizone branding,
Sagmeister's "Now Is Better".

**How to generate**
- Custom display type, often photographic or hand-drawn.
- Maximalist composition: type at 200+ px, image-letter compositions.
- Saturated color, deliberately uncomfortable pairings.
- Hero is a moment, not a layout.
- Body type stays restrained (a clean Akzidenz or serif) so display
  can shout.

---

## 14 — David Carson

**School:** Experimental
**Designer:** David Carson (Ray Gun magazine)

**Core principles**
- Anti-grid. Layout as feeling.
- Type breaks rules: overlap, rotate, scale freely.
- Reading order is interpretive, not enforced.
- Texture and physicality at every level.
- The mistake is the design.
- Photo + type fused, not arranged.
- "Don't mistake legibility for communication" — Carson.

**Visual signature**
Overlapping type, intentional misalignment, distressed textures,
photographic backgrounds with type punching through. Surf and
skate aesthetics. 90s grunge.

**Typography**
Multiple typefaces per spread, sometimes per word. Custom letterforms.
Distressed / textured cuts.

**Color**
Photographic palette. Black, white, occasional saturated overlays
(red, yellow). Texture matters more than color.

**Best for**
Music, fashion, skate / surf brands, magazines, art books, identity
work in cultural / counter-cultural spaces.

**Not for**
Anything requiring legibility, accessibility, or productivity.
Enterprise. SaaS. Mobile UI.

**Reference**
*Ray Gun* magazine archives, *Beach Culture*, davidcarsondesign.com,
many late-90s music posters.

**How to generate**
- Layered overlapping type. Multiple faces per layout.
- Grid abandoned. Eyeline determined by composition.
- Photographic textures.
- Color secondary to texture.
- Body type is still readable; display goes wild.
- Likely renders only as marketing / hero / cultural surfaces, not as
  product UI.

---

## 15 — Brutalism (Web)

**School:** Experimental
**Movement:** Web Brutalism (~2014–present)

**Core principles**
- Honest about being a website. No skeuomorphism.
- Default browser styles, lightly tuned.
- Times New Roman or system fonts.
- 0 radius. 0 shadows. Visible borders.
- Function-first. Beauty is incidental.
- Primary colors used at full saturation.
- Anti-corporate, anti-template aesthetic.

**Visual signature**
White bg, black text, blue underlined links, full-saturation colors,
visible borders, no animations. Looks like a 1996 personal site —
intentionally.

**Typography**
Times New Roman, Arial, Helvetica, or system-ui. Default browser
sizes (16px body) with little tuning.

**Color**
Pure white, pure black, blue links, occasional pure red / yellow /
green status. No greys.

**Best for**
Tech zines, personal sites, ironic brand statements, indie / counter-
cultural products, dev portfolios that reject the SaaS template.

**Not for**
Anything aspiring to "premium". Enterprise. Most SaaS. Most
e-commerce.

**Reference**
brutalistwebsites.com, balenciaga.com (mid-2010s), karenchengdesign.com,
many indie hacker portfolios.

**How to generate**
- Times New Roman or system-ui body.
- Default link styles (blue + underline).
- Black border boxes.
- Radius 0. Shadow none.
- No animations. Instant state changes.
- Bg: pure white. Text: pure black.
- One full-saturation accent (red, blue, yellow).

---

## 16 — Bento

**School:** Experimental
**Pattern:** Bento Grid (popularized by Apple in 2010s, now ubiquitous)

**Core principles**
- Grid is content. Information as tiles, not flow.
- Each tile is self-contained: one idea, one image, one stat.
- Asymmetric tile sizes for hierarchy.
- Edges are the design.
- Density meets composition.
- Reads at all zoom levels.

**Visual signature**
A grid of variously-sized rectangular tiles. Each tile a different
content type (stat, image, quote, feature). Apple-style "this is
what we shipped" hero sections.

**Typography**
Sans body. Display sizes per tile, tuned to tile size. Restrained
hierarchy within each tile.

**Color**
Each tile can have its own bg color, contributing to the overall
visual rhythm. Cohesive hue family.

**Best for**
Product launch pages, "what's new" sections, app feature tours,
portfolio summaries, dashboard overviews.

**Not for**
Long-form reading. Step-by-step flows. Mobile (bento doesn't
gracefully reflow to single column).

**Reference**
apple.com (post-2020 product pages), arc.net, framer's marketing
hero, raycast.com.

**How to generate**
- 12-col grid with 6-8 tiles of varying sizes.
- Each tile self-contained: ONE message per tile.
- Asymmetry: hero tile 8/12 cols, secondary 4/12, tertiary 3/12.
- Per-tile color tinting to differentiate.
- Mobile: stack vertically; consider hiding tertiary tiles.
- Motion: tile reveal on scroll, staggered.

---

## 17 — Japanese Wabi-sabi

**School:** Cultural / Eastern
**Movement:** Japanese aesthetic philosophy

**Core principles**
- Imperfection as beauty.
- Asymmetry over symmetry.
- Modesty, simplicity.
- Natural materials, organic textures.
- The beauty of impermanence (mono no aware).
- Emptiness is presence.
- Quiet over loud.

**Visual signature**
Off-white papery backgrounds. Organic, slightly imperfect lines.
Asymmetric layouts. Natural photography (wood, stone, water).
Hand-drawn or letterpress-influenced typography.

**Typography**
Humanist sans (Spectral, Yu Mincho, Source Han Sans). Body 15–16px.
Generous leading. Slightly imperfect baseline.

**Color**
Earth tones. Sumi black ink. Vermilion accent. Sand, moss, bone.

**Best for**
Lifestyle brands, hospitality, premium consumer goods, sustainable /
craft brands, small luxury, Japanese-market products.

**Not for**
Tech, productivity, sharp brand statements, Western enterprise.

**Reference**
muji.com (overlap with Hara), shibui.fm, Kinfolk magazine,
boutique Japanese hospitality sites.

**How to generate**
- Off-white papery bg with subtle texture.
- Earth-tone palette: sand, moss, vermillion, sumi.
- Humanist sans + occasional brush mark.
- Asymmetric layouts. Wide left or right margin.
- Photography: natural materials, subdued light.
- Motion: slow (400ms+), fade-led.

---

## 18 — Chinese Modern

**School:** Cultural / Eastern
**Movement:** Modern Chinese design (post-2010 mainland aesthetic)

**Core principles**
- Balance + harmony (yin-yang) over Western asymmetry.
- Red as ceremonial accent (not warning).
- Calligraphy-influenced display type.
- Geometric grid + organic photography.
- East-meets-West typography (Latin + Hanzi pairing).
- High contrast, deliberate density.

**Visual signature**
Bold red accent. Hanzi typography paired with Latin. Symmetric or
quasi-symmetric layouts. Photography of materials, architecture,
and people.

**Typography**
Source Han Sans / Noto Sans CJK + Latin pair. Hanzi at display sizes.
Latin as supporting text. Calligraphy moments in heroes.

**Color**
Vermilion / cinnabar red as the brand accent. Black ink. Off-white
or warm-cream bg.

**Best for**
Brands with Chinese-market presence, tea / craft / heritage brands,
museums, cultural institutions, restaurant brands.

**Not for**
SaaS, dashboards, anything where the cultural specificity isn't
wanted.

**Reference**
PINWU (pinwu.net), BLUE BOTTLE Asia campaigns, Heytea brand work,
contemporary Chinese book design.

**How to generate**
- Vermilion red accent at 5% coverage.
- Hanzi + Latin typography pair. Hanzi at display sizes.
- Symmetric or near-symmetric grid.
- Photography of materials / craft / architecture.
- Motion: deliberate, ceremonial pacing.

---

## 19 — Bauhaus

**School:** Cultural / Eastern (German modernism — kept here for
historical lineage to Swiss + Eastern modernism)
**Movement:** Bauhaus (1919–1933, Weimar / Dessau)

**Core principles**
- Form follows function.
- Geometric primitives (circle, square, triangle) as the alphabet.
- Primary colors: red, yellow, blue.
- Sans-serif: typography is industrial, not decorative.
- Grid as moral commitment.
- The artist and the engineer are one.
- Less is more (Mies, Bauhaus director).

**Visual signature**
Geometric shape compositions. Primary color blocks. Sans-serif
display + body. Grid-locked layouts. Bold simplicity.

**Typography**
Bauhaus 93, Futura, Universal (Bayer's typeface). Geometric
sans-serif. Even uppercase compositions.

**Color**
Red, yellow, blue at full saturation. Black, white. No tints.

**Best for**
Cultural institutions, art schools, modernist publications, identity
programs that want a 20th-century-modernism feel.

**Not for**
Most modern products. Bauhaus reads as historical reference, not
contemporary product.

**Reference**
bauhaus.de, Bauhaus Foundation Dessau, Herbert Bayer's posters,
Lyonel Feininger's Cathedral.

**How to generate**
- Futura (or Universal) as primary face.
- Primary colors red / yellow / blue at full saturation.
- Geometric primitives in compositions.
- Strict grid.
- Black body type on white bg.

---

## 20 — Swiss International (International Typographic Style)

**School:** Cultural / Eastern (Swiss modernism)
**Movement:** Swiss International Style (1950s onward)

**Core principles**
- Helvetica is the typeface. Or Univers. Or Akzidenz.
- The grid is the design.
- Asymmetric balance.
- Sans-serif for everything.
- Photography over illustration.
- Mathematical proportion (root rectangles, golden ratio).
- Negative space as compositional element.

**Visual signature**
Helvetica everywhere. Strict grids. Photography or pure typographic
posters. Black + red. Tight, clean, unornamented.

**Typography**
Helvetica or Univers. One family, one to two weights, multiple sizes.
Body 14–16px. Tight tracking on display.

**Color**
Black on white. Red as a single accent. No other chromatic moves.

**Best for**
Wayfinding, transit, modernist publications, museum identities,
documentation systems, design schools.

**Not for**
Warm consumer brands, anything requiring photographic richness or
playfulness.

**Reference**
SBB Swiss Federal Railways identity, *Neue Grafik* magazine, Otl
Aicher's Munich Olympics, Müller-Brockmann posters.

**How to generate**
- Helvetica or Univers. One face. Two weights.
- 8-col or 12-col grid. Strict alignment.
- Black on white. Red accent only.
- Asymmetric balance: text-block left, photo or rule right (or
  reverse).
- Photography: documentary, single light source.
- Motion: minimal. Layout transitions only when surface allows.

---

## How To Pick 3 From Different Schools

When the brief is vague and the Direction Advisor presents 3 parallel
demos, draw across the school spread to maximize the user's signal.
Each option must be:

1. **From a different school.** Three Minimalism options is one option
   shown three times.
2. **Plausible for the brief.** Don't show Brutalism for a fintech
   brand and waste the slot.
3. **Distinguishable at thumbnail size.** The user looks at three
   tiles; if two read the same, you've wasted one.

### Selection algorithm

Given a brief, score each of the 20 philosophies on (a) brief fit and
(b) novelty vs the user's references. For each school, take the
highest-scoring philosophy. Pick the top 3 schools by score.

```
brief signal               most likely schools
─────────────────────────  ──────────────────────────────────────
"developer tool"           Minimalism (11/12), Information (04)
"fintech / trust"          Motion (08), Information (01/02)
"consumer / lifestyle"     Cultural (17/18), Minimalism (09)
"AI / generative tech"     Motion (05), Minimalism (11), Experimental (16)
"creative agency"          Experimental (13/14), Information (01)
"editorial / publishing"   Information (01/03), Cultural (17)
"government / enterprise"  Information (04), Minimalism (10)
"art / culture"            Experimental (13/14), Cultural (17/18/19/20)
```

When two options score equal within a school, pick the more
distinctive one at thumbnail size.

### Presentation pattern (used by module 02 + 06)

```
DIRECTION A — <Philosophy 01 from School X>
  Body 16px serif, hero with custom display, 1 muted accent.
  Feels like: <reference>.

DIRECTION B — <Philosophy 11 from School Y>
  Pure black/white, radius 0, mono in chrome.
  Feels like: <reference>.

DIRECTION C — <Philosophy 16 from School Z>
  Bento grid, 8 tiles, asymmetric hierarchy, color rhythm.
  Feels like: <reference>.

Reply A, B, or C — or describe a fourth direction.
```

The user picks. The pipeline runs from there.

---

## How This Document Is Used

- Module 02 (interview) reads this when ambition is C/D and brief is
  vague — the Direction Advisor uses §How-to-pick to render 3 options.
- Module 06 (system-selection) reads it to map the 12 pre-built
  systems to their parent philosophies (saas-dark + linear sit in
  School 3; vercel sits in School 3; stripe sits in School 2;
  editorial sits in School 1; minimal sits in School 3).
- Module 07 (system-gen) reads the chosen philosophy's "How to
  generate" section to inform token + component decisions.
- Module 15 (critique) scores Philosophy Consistency (dimension 2.1)
  against the chosen philosophy's principles.

When in doubt, drift toward the school that matches the brief's
audience. When the brief contradicts itself, surface the
contradiction in the interview before generating.
