# Anti-Patterns — AI Slop Prevention

Loaded by module 15 (critique) on every run. Loaded by modules 07, 08,
09, 10 on demand to inform generation. Every rule here is enforceable:
the critique module greps for it, scores against it, and blocks
handoff when the count is high enough.

The rules below are absolute. They override designer preferences when
in conflict. The user can override individual rules by explicit brief
("yes, I do want a purple gradient hero"), but the default is refusal.

---

## Section 1 — Never Do

Every entry: what it is · why it's slop · what to do instead.

### 1.1 Purple/blue gradients as hero or card backgrounds

What it is: The `from-violet-500 to-blue-500` (or `#6366F1 → #8B5CF6`)
linear gradient applied to a hero block, a card, or a "premium" CTA.

Why it's slop: Every Tailwind starter template since 2021 ships this.
Every "AI app" landing page has it. It signals "I picked the easy
option" and reads as instantly dated.

Do instead: One flat, intentional accent. If gradient is required,
use a single-hue gradient (oklch L variation) with deliberate
direction and angle. Or use color blocking with intent.

### 1.2 Rounded cards with left-side colored border accent

What it is: A card with `border-l-4 border-l-blue-500` to indicate
status / category / type.

Why it's slop: Identifies the design as "Bootstrap 4 alert
component, scaled up". Says nothing the bg color or a status dot
couldn't say with less visual weight.

Do instead: Use a status dot prefix (4px circle in the status hue) +
the standard card border. Or shift the entire card bg subtly
(`success-subtle` at 12% alpha). Never a thick colored stripe down
the side.

### 1.3 Sans-serif everywhere with no display personality

What it is: Inter for headings, Inter for body, Inter for chrome.
One typeface doing every job.

Why it's slop: The brand has no voice. Looks like every other SaaS
template. There's no typographic moment to remember.

Do instead: Pair display + body. Display can be a stronger character
face (Cal Sans, GT Eesti, Söhne, custom). Body stays neutral. Use
display only for sizes ≥ 24px. Don't introduce a third face unless
mono is needed for code/IDs.

### 1.4 Default Heroicons at default size and stroke weight

What it is: `<HeroIcon className="w-6 h-6 stroke-[2]" />` everywhere,
with no thought about whether they belong in the system.

Why it's slop: Heroicons at default settings is the "out of the box
shadcn" look. Strokes are too heavy at 16px chrome. The icon
personality fights with the type personality.

Do instead: Pick one icon family and customize: stroke 1.5 for line
icons, size matching the surrounding text (16px for sm, 20px for
base, 24px for lg). Or pick Lucide / Phosphor / custom for a different
character.

### 1.5 AI blue (#6366f1 / #8b5cf6) as primary

What it is: Indigo-500 / violet-500 as the brand primary because the
default Tailwind palette nudged that way.

Why it's slop: Everyone reaches for it. The brand color is therefore
not a brand color. Reads "ChatGPT-era SaaS template".

Do instead: Use any other hue you'd defend. If the brief actually
calls for blue, pick a specific oklch value with a reason
(`oklch(0.55 0.18 235)` reads as "tech blue" without the AI-template
stink). If the brief calls for purple, pick a real purple
(`oklch(0.55 0.20 295)`), not the default.

### 1.6 max-w-2xl centered everything

What it is: Every page is `<div className="max-w-2xl mx-auto px-4">…
</div>` regardless of content.

Why it's slop: Says "I'm using the Tailwind default reading-column
width because the docs do". Wastes desktop real estate on dashboards.
Looks the same as every blog template.

Do instead: Pick the container width per surface. Marketing/article:
~720–820px. Dashboard: full-width with a sidebar at 220–260px.
Settings: ~640px column inside a wider page. Always have a reason for
the chosen max-width.

### 1.7 Glassmorphism without clear purpose

What it is: `backdrop-blur-md bg-white/30` slapped on a card or modal
because it looks "premium".

Why it's slop: Without a busy/visual background behind it, glass blur
does nothing. Just a low-contrast card. Becomes accessibility risk
when text drops below 4.5:1.

Do instead: Use blur ONLY when there is meaningful content behind
that benefits from being softened (a fixed nav over a scrolled hero,
a modal over a real product UI). Otherwise, use opaque surfaces with
proper elevation.

### 1.8 Fake 3D elements that don't commit

What it is: A button with a fake bevel + drop shadow + inset shadow
that's trying to look 3D but reads as half-baked.

Why it's slop: Either commit to skeuomorphism OR commit to flat. The
in-between is uncanny. Most generated UIs land in the in-between
because the model averaged across training data.

Do instead: Pick flat (modern default — Linear, Vercel, Stripe) OR
pick committed dimensional (Notion 2014, Material 3). Don't half-step.

### 1.9 Emoji as UI icons

What it is: 🚀 next to "Get started", ⚡ next to "Performance",
✨ next to "AI features".

Why it's slop: Emoji rendering varies wildly across platforms.
Decoration without information. Reads "Notion landing page knockoff".

Do instead: Use real icons (Lucide / Phosphor / custom SVG). Emoji
have one legitimate UI use: status indicators in user-generated
content (e.g. reaction picker).

### 1.10 Stock-photo aesthetics

What it is: Hero photos of diverse-team-laughing-at-laptop, the
generic gradient mesh background, the abstract "data" visualization
that means nothing.

Why it's slop: The visual is a placeholder for thinking. Good design
hero imagery says something specific to the product.

Do instead: Real product UI screenshots. Real photos relevant to the
domain (manufacturing site for B2B manufacturing tool; not generic
office). Bespoke illustrations or generative mark systems.

### 1.11 More than 3 different font sizes on one screen

What it is: A screen with 12px / 13px / 14px / 16px / 18px / 20px /
24px text, all visible at once.

Why it's slop: No hierarchy. Eye doesn't know where to land. The
"more sizes = more information" reflex.

Do instead: 3 sizes max. One for primary copy, one for chrome, one
for the screen's hierarchy peak. Use weight + color to differentiate
within the same size.

### 1.12 More than 2 weights in one visual group

What it is: Headings at 700, sub at 600, body at 500, captions at
400 — all touching each other.

Why it's slop: Weight noise. Every level fighting for attention.

Do instead: 2 weights per group max. Use color (text-primary vs
text-secondary) and size to differentiate the third tier.

### 1.13 Shadows in dark mode

What it is: `shadow-md` on a card while in dark theme.

Why it's slop: Black shadows on a dark bg are invisible or muddy.
Photo-realistic depth doesn't apply when the substrate isn't
photo-realistic.

Do instead: Border elevation. Surfaces lift via background L step
(+0.04 / +0.06 / +0.10) plus a 1px border. Dark-mode tokens enforce
this with `--shadow-*: none` on `.dark`.

### 1.14 Hardcoded color values in generated code

What it is: `style={{ color: '#374151' }}` or
`className="text-[#374151]"`.

Why it's slop: Couples the component to one theme. Breaks dark mode.
Drift over time as new colors are introduced ad-hoc.

Do instead: Token references only. `text-secondary` (Tailwind class)
or `var(--text-secondary)` (CSS var). Critique module greps for hex
literals and blocks handoff at ≥ 5 matches.

### 1.15 Box-shadow transitions on hover

What it is: `transition: box-shadow 300ms ease`. Card lifts on hover
by gaining a bigger shadow.

Why it's slop: Box-shadow forces a paint, runs on the CPU compositor,
chops on cheap devices. Reads as a generic "lift on hover" without
intent.

Do instead: `transform: translateY(-1px)` (or `translateY(-2px)` for
more lift). GPU composited. Snappier. Pair with a subtle bg color
change if more emphasis is needed.

### 1.16 Lorem ipsum or "Click me" in prototypes

What it is: Placeholder text in production-grade mockups. "Lorem
ipsum dolor sit amet". "Click me". "Submit".

Why it's slop: Nothing about the product is communicated. Reviewer
can't evaluate if the design actually works.

Do instead: Real product copy. Real names ("Mira Patel"). Real
numbers ("$48,210", "142ms"). Real timestamps ("2h ago"). Module 09
+ 10 enforce this with a sample-data injection step.

### 1.17 Tailwind arbitrary values when a token exists

What it is: `p-[17px]`, `text-[#1A1A1A]`, `gap-[14px]` when there's a
token for 16, the existing text-primary color, and gap-3 (12).

Why it's slop: Bypasses the system. Drifts spacing. Breaks dark
mode. Critique flags every arbitrary value.

Do instead: Snap to the token. If the token doesn't fit, the system
is wrong; expand it via `/design system`.

### 1.18 Inline styles on production components

What it is: `<div style={{padding: '20px', background: '#fafafa'}}>`
in component source.

Why it's slop: Defeats CSS specificity. Defeats theming. Drifts from
the system. Dilutes the component's contract.

Do instead: className with token-mapped Tailwind classes, OR a CSS
file with `var(--*)` references. Inline styles only for one-off
runtime values that genuinely can't live in CSS (e.g.
`style={{ width: dynamicPx }}`).

### 1.19 outline: none without replacement

What it is: `*:focus { outline: none }` to "clean up" the focus
ring.

Why it's slop: Removes accessibility for keyboard users. People who
rely on Tab navigation see no focus state. Lighthouse and critique
both flag.

Do instead: `:focus-visible { outline: 2px solid var(--border-focus);
outline-offset: 2px }` with the focus token. Never naked `outline: none`.

### 1.20 div with onClick instead of button

What it is: `<div onClick={handle}>Submit</div>` because the dev
didn't want default button styling.

Why it's slop: Not keyboard reachable by default. Not announced as
clickable by screen readers. ARIA workarounds add complexity that
real `<button>` solves for free.

Do instead: `<button>` with reset styles
(`appearance: none; background: transparent; border: 0; padding: 0;
cursor: pointer`) when you want a clean slate. The element type is
the contract.

### 1.21 Color-only state communication

What it is: A red border on an invalid input with no text, no icon,
no aria-invalid.

Why it's slop: 1 in 12 men have a form of color blindness. Color +
nothing else fails them. Also fails the accessibility spec.

Do instead: Color + icon + text + aria. Error border, error icon
inside the field, error message below, `aria-invalid="true"`,
`aria-errormessage`.

### 1.22 Centered everything alignment

What it is: Every block of text centered. Every button centered.
Every card centered.

Why it's slop: Centered text is hard to read above 60 characters.
Centering everything destroys the visual axis the eye uses to scan.
Reads as "I don't know what to do, so I split the difference".

Do instead: Default to left-aligned (or right for RTL). Center for
dialog titles, hero headlines, and singular focus moments only.

### 1.23 Generic chip with "AI" label

What it is: A small pill with the label "AI", "Powered by AI", or a
sparkle emoji to indicate AI features.

Why it's slop: 2023–2024 cliché. Says nothing specific about what
the AI does. Sparkle iconography is generic.

Do instead: Describe the action: "Generate", "Suggest", "Summarize".
Use the actual feature name. If a marker is needed, design something
brand-specific (a small stroke version of the brand symbol).

### 1.24 Two adjacent CTAs at equal weight

What it is: A pair of buttons "Get started" and "Learn more" at the
same size, weight, and prominence.

Why it's slop: No primary action. User has to read both to choose.
Slows down decisions. The eye has nowhere to land.

Do instead: One primary (filled, brand color), one secondary (ghost
or outline). Hierarchy shows priority. Or remove the secondary if it
isn't earning its space.

### 1.25 The "scroll for more" affordance on a screen with no fold

What it is: A "Scroll ↓" indicator on a screen that fits in one
viewport.

Why it's slop: The signal lies. Trains users to ignore future
affordances.

Do instead: Remove it. If the screen genuinely needs more content
than fits, redesign the hierarchy to fit OR cut content.

### 1.26 Animated "..." or skeleton on a 50ms operation

What it is: A loading spinner shown for actions that complete
instantly because "loading states are best practice".

Why it's slop: Adds latency without adding information. The user
sees a flash of spinner that wasn't needed.

Do instead: Show loading only after a 200ms threshold. Operations
under 200ms render directly. Operations over 200ms show a loading
state (skeleton preferred over spinner for known-shape content).

### 1.27 Stacking radius values

What it is: Outer card `rounded-xl`, inner padding box `rounded-lg`,
inner button `rounded-md`. Three radii nested.

Why it's slop: Visual noise. Eye sees four different curves in one
component. Violates "commit to one radius personality".

Do instead: Pick one or two radii max within a component. Outer
container + inner controls is the typical split (16 / 6, or 12 / 6).

### 1.28 Random rotation / tilt for "playfulness"

What it is: A card or photo with `transform: rotate(-2deg)` because
it looks fun.

Why it's slop: One-off whimsy without a system. Conflicts with the
grid. Fails any sane production audit.

Do instead: If the brief calls for playful, design the playful
moment with intent (a tilted ticket stub, a hand-drawn underline) and
commit to it across the system. Random rotation in production code
is wrong.

### 1.29 The "feature card" with icon, headline, paragraph, and link

What it is: A card grid showing 6 features, each with the same
shape: 24px icon top-left + 16px headline + 14px description + tiny
"Learn more →" link.

Why it's slop: Every B2B SaaS landing page from 2018–2024 has this.
Says nothing about the actual brand.

Do instead: Vary the formats. One feature gets the hero treatment
with a real screenshot. The others get text-only callouts. Or use a
single richer feature interactive (e.g. an inline live demo).

### 1.30 Five-tone gradient background

What it is: A "mesh gradient" that blends 5 colors across the full
page background.

Why it's slop: 2022 cliché. Hides type contrast. Reads "AI tool
landing page".

Do instead: One flat background. Or one subtle radial gradient with
a single hue (5–10% brightness change across the surface).

---

## Section 2 — Visual Clichés By Category

Specific patterns to recognize. Some are not bad in isolation; the
sin is the unconsidered execution.

### 2.1 Dark mode clichés

```
✗ Pure black bg + dark grey cards + box shadows
  → instead: oklch L 0.10 base + L 0.14 surface + L 0.20 elevated +
    visible borders, no shadows
✗ Bright accent at full saturation on dark surfaces
  → instead: drop chroma 5–10% on dark accents to avoid eye strain;
    or keep saturated but reduce L slightly
✗ Reusing the light-mode shadow scale, just inverted
  → instead: replace shadows with border elevation entirely
✗ White text on near-black bg (16:1+ ratio is too high; reads harsh)
  → instead: text-primary at L 0.95 (not 1.0), text-secondary at L 0.65
✗ Single dark-mode style with no consideration for OLED black
  → instead: pick a stance — "saas-dark" mid-grey base or "vercel-dark"
    pure black — and commit
```

### 2.2 SaaS clichés

```
✗ Top nav with logo + 3 menu items + "Sign in" + filled "Get started"
  → not bad shape, but the execution is template. Differentiate via
    type, density, or layout.
✗ Hero with "Stop X. Start Y." headline pattern
  → cliché phrase. Write the actual value prop.
✗ "Trusted by" logo bar with 5 fake/grayed-out company logos
  → only show real logos. If you don't have them, omit the strip.
✗ Three pricing tiers with "Most Popular" middle tier in accent color
  → fine pattern, but ensure the highlighted tier visually deserves
    its weight (more content, real differentiation)
✗ Dashboard with 4 stat cards at the top, each with an "↑ 12%" delta
  → fine layout. The slop is "+12%" on every card with no real data
    semantics. Show actual deltas, label them, color-code by direction.
✗ "Activity feed" with avatar + verb + object + timestamp, all the
  same shape, every row
  → break rhythm. Group by time. Vary card heights when content varies.
```

### 2.3 Landing page clichés

```
✗ Auto-rotating testimonial carousel
  → kills accessibility. List 3 testimonials inline.
✗ Feature grid of 6 cards, each with icon + headline + description
  → see 1.29.
✗ FAQ accordion with 8 questions, all the same shape
  → fine, but write real questions worth asking. "How does it work?"
    is filler.
✗ Footer with 5 columns × 6 links each
  → over-link. Most landing pages need 2 columns × 4 links.
✗ "Built with" tech stack badge row
  → only matters for dev tools. Otherwise, drop.
✗ Newsletter signup pop-up after 5 seconds
  → don't.
```

### 2.4 Dashboard clichés

```
✗ "Recent activity" widget with the same 5 events shape
✗ Sidebar with 12 nav items, some without icons, all at the same depth
  → group by section, indent sub-items, max ~8 top-level items
✗ Empty state that's just a centered "No data yet" string
  → design the empty state. It's 30%+ of the time the user spends.
✗ Filters as a horizontal scroll bar of tag pills
  → unusable beyond 5 filters. Use a proper filter UI (sidebar, popover).
✗ "Add new" button as a giant accent-filled CTA top-right
  → fine when the page IS about adding new. Otherwise, secondary.
✗ Time-range selector at the top showing "Last 7 days" by default
  → fine pattern, but make the picker keyboard accessible and animate
    the comparison line on the chart, not the entire chart re-rendering.
```

---

## Section 3 — Typography Mistakes

```
✗ No negative letter-spacing on display sizes (≥ 20px)
  → set -0.02em at 20–24, scale to -0.05em at 56+
✗ Default Tailwind font-size + line-height (no thought given)
  → tune line-height per stop: tighter on display (1.1 at 40+),
    looser on body (1.6 at 16)
✗ Three+ font families on one screen (display + body + mono + serif)
  → cap at 3 (display + body + mono), never 4
✗ Bold body text everywhere because it "looks confident"
  → 400 body weight is the contract; 500/600 is for emphasis only
✗ Uppercase headings without tracking
  → uppercase always needs +0.04em tracking minimum
✗ Center-aligned long body text
  → impossible to read past 60 chars; left-align by default
✗ Body line-height < 1.4 or > 1.7
  → 1.5 or 1.6 for body. 1.4 only for compact UI text. 1.7+ only for
    editorial long-form.
✗ Underlined links inside buttons
  → buttons aren't text links; remove the underline
✗ Unspecified fallback fonts (just "Inter")
  → always include a system fallback chain: "Inter", system-ui,
    -apple-system, sans-serif
✗ The same font family used for code as for body
  → use mono for code, IDs, version strings
✗ Tabular numerals not enabled where they belong
  → for any column of numbers, set font-variant-numeric: tabular-nums
✗ Quotes rendered as straight ' instead of curly ' '
  → typographic quotes everywhere; never straight in production copy
✗ "..." (three periods) instead of … (ellipsis)
  → always single-character ellipsis
✗ "x" or "*" used as multiplication or stars
  → use × (U+00D7) and ★/☆ proper glyphs
```

---

## Section 4 — Color Mistakes

### The purple problem

The default Tailwind primary is indigo (`#6366F1`). The default
"premium" gradient is indigo → violet. The default "AI feature"
chip is purple. Together, these defaults produced an entire era of
indistinguishable products in 2022–2024.

If your brief doesn't explicitly call for purple/violet, don't use
it. If it does, use a deliberate purple at a specific oklch value
chosen for the brand (e.g. `oklch(0.55 0.20 295)`) and commit to it
as the only chromatic decision.

### The gradient addiction

```
✗ Multi-color gradients (3+ stops, contrasting hues)
  → reads as 2022 SaaS / AI generic
✗ Diagonal gradients without intent
  → only use gradient direction when it amplifies meaning
✗ Gradient on text headlines
  → kills readability + contrast
✗ Gradient on icons
  → muddy at small sizes
✗ Gradients on dark mode
  → almost always wrong; surfaces should be flat with border
    elevation
```

If you must gradient: same hue, two L stops only, subtle (≤ 5% L
spread), as a background of a hero or section header.

### Other color failures

```
✗ Using all 12 hues from the Tailwind palette
  → pick 1 brand hue + 4 status hues + neutrals; that's it
✗ Saturation drift across surfaces (header is C 0.18, sidebar C 0.05)
  → keep chroma consistent within roles
✗ Pure black (#000) text on pure white (#FFF) at 16px
  → contrast is too high; reads harsh. Tone text to L 0.10 minimum on
    pure white, or warm bg to L 0.98 to soften.
✗ Random hue-shifts within a "neutral" ramp
  → the grey ramp must keep one hue across all stops
✗ Status colors on saturated backgrounds (e.g. red text on red bg)
  → use the *-subtle / *-text token pair instead
✗ The "Tailwind slate" default for dark mode neutrals
  → too cold for most products; pick a warmth (H 220–270 cool, H
    40–80 warm) deliberately
✗ Different accent for hover and active that aren't on the same ramp
  → accent-hover is +0.03 L, accent-press is -0.04 L, same hue +
    chroma; don't shift hue on state
```

---

## Section 5 — Spacing Mistakes

```
✗ Arbitrary px values (17px, 23px, 14px) sprinkled through
  → snap to the scale. If 16 is too tight, use 24. Don't invent 18.
✗ Inconsistent gutters across the same screen (16 here, 20 there, 24 there)
  → pick one gutter for the screen. Vary only by section, with reason.
✗ 8 different padding values on one component
  → component padding has at most 2 stops (e.g. p-4 outer, p-3 inner)
✗ Spacing chosen by visual intuition with no system
  → always to a stop. If your eye says "off", check the stop choice.
✗ Tight spacing on dense data + the same tight spacing on marketing
  → rhythm should match the surface; dashboard ≠ landing
✗ No vertical rhythm (heading + paragraph + heading mashed together)
  → space-* tokens exist for this; gap-6 between sections, gap-3 within
✗ Spacing tied to font-size (line-height-based) on UI chrome
  → line-height controls intra-paragraph; spacing controls inter-block
✗ Edge-to-edge content with no breathing room
  → keep at least space-4 from a container edge for chrome elements
```

---

## Section 6 — The $10K Designer Checklist

Twenty-three specific items elite designers do that AI defaults skip.
Pass 18 of 23 and the design feels paid-for.

```
1.  Display headings have negative tracking, magnitude growing with size.
    20px → -0.02em, 56px → -0.05em.

2.  At least one type style has font-feature-settings enabled
    (ss01, cv11, tnum, etc.) for the chosen typeface.

3.  The body font has a fallback metric override (size-adjust + ascent)
    so Inter and the Inter fallback land on the same x-height.

4.  Numerals in tables and metrics are tabular (font-variant-numeric:
    tabular-nums) so columns of numbers align.

5.  Buttons have a 1px translateY on :active. Not box-shadow change —
    transform.

6.  Focus rings appear on Tab navigation but not on click (focus-visible
    is wired correctly).

7.  Hover transitions are 100ms, not 300ms. Faster than the user's
    perception of "lag" but slower than a snap.

8.  Empty states are designed (not a centered "No data") with an
    illustration or icon, a one-sentence explanation, and a primary
    next action.

9.  Error states show: the error text, an icon, the field outline,
    aria-invalid AND aria-errormessage.

10. Loading states use Skeleton (shape-aware) for known-shape content,
    Spinner only for unknown-duration unknown-shape operations.

11. The active sidebar item's accent indicator slides between items
    via translateX, not re-rendered separately each time.

12. There's exactly one screenshottable moment per screen (a custom
    micro-interaction, an unexpected typographic detail, a
    deliberate density). One. Not zero. Not three.

13. Dark mode uses border elevation (no shadows). The L step ladder
    on bg-* tokens is intentional.

14. The system commits to one icon family + one stroke weight + one
    default size. Doesn't mix Lucide and Heroicons.

15. Real content in the prototype: realistic names, realistic
    numbers, realistic timestamps, realistic copy. No "Lorem ipsum",
    no "John Doe", no "$1,000", no "2 days ago" everywhere.

16. UI copy avoids "Click here", "Submit", "OK". Uses verbs that
    describe the action ("Create project", "Save changes",
    "Continue").

17. Modals trap focus. ESC closes. Focus restores to the trigger on
    close. Body becomes inert. None of that is "for later".

18. Forms validate on blur (per field) AND on submit (whole form).
    Errors don't all flash at once.

19. Touch targets on mobile are ≥ 44 × 44 px with ≥ 8px between
    adjacent targets.

20. prefers-reduced-motion cuts animations to 0 except minimal
    fades. Not "I'll just leave it; it's fine."

21. Scroll bars are styled (Webkit + Firefox + Edge) to match the
    system. Default browser scrollbars give the design away.

22. The first paint is correct. No flash of white before dark theme
    applies. Use `data-theme` set early in `<head>` or persist via
    SSR/cookie.

23. The favicon and the og-image are both designed. They are not
    placeholder squares.
```

Most AI-generated designs hit 5–8 of these. The slop-free target is
18+. Module 15 (critique) checks each item where it can be measured
automatically.

---

## How This Document Is Used

- Module 07 reads §1 + §3 + §4 + §5 when generating the system —
  the rules influence token choices and component defaults.
- Module 08 reads §1.13 / §1.14 / §1.15 / §1.18 / §1.19 / §1.20 /
  §1.21 / §1.27 when generating components.
- Module 09 + 10 read §6 to set the bar for "elite-feeling" output.
- Module 15 (critique) treats every entry as a check. Automated
  checks fire on §1.13–§1.20 directly. AI scoring uses §1.1–§1.12,
  §2, §3.last-half, §4, §5, §6 as the rubric.
- Module 16 (handoff) embeds the entries that fired warnings into
  HANDOFF.md so the implementing AI sees them.

When in doubt: read the brief, then read this document, then
generate. The brief tells you what to make. This document tells you
what not to make it look like.
