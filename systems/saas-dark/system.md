# saas-dark — Design System
*v1.0.0 · default mode: dark · ambition baseline: B*

---

## Personality

Precise. Modern. Developer-grade. No fluff.

saas-dark is the system you reach for when the product is built for
people who live in the keyboard. Every choice — 14px body, 6px radius,
100ms motion, oklch grey ramp tinted neutral-cool, accent green at
brand-confidence chroma — converges on speed and clarity for technical
audiences.

This is the canonical template. Every other pre-built system in
design-engine ships under the same architectural rules, with
personality variations on top.

---

## Inspired by

- **Resend** — the dark-mode neutral ramp + accent restraint
- **Planetscale** — accent ladder + status palette discipline
- **Railway** — frosted-glass with purpose, motion timing
- **Linear** — density commitment, mono in nav numerals
- **Vercel** — flat surface treatment, no shadows in dark
- **Stripe** — micro-interaction precision (100ms standard)

The system synthesizes the patterns these products converge on. None
is copied; the rules underneath are.

---

## Audience

- Developers, technical founders, devops, data engineers
- Power users who keep the app open all day
- Teams that adopt new tools by reading docs, not watching demos
- Audiences with high tolerance for density when it earns its keep

Avoid this system for: consumer mass-market products, content-heavy
publications, fintech needing maximum trust through warmth, or any
brand that wants to feel approachable to non-technical users. Pick
saas-light, stripe, notion, or editorial instead.

---

## What Makes It Distinctive

1. **Border elevation, never shadows in dark.** The lift system uses
   bg-base / bg-surface / bg-elevated / bg-overlay (each +0.04–0.06
   L) plus visible borders. Shadows are a light-mode artifact.

2. **oklch everything.** No hex, no rgb. Every color sits on a
   perceptually-linear scale. Dark mode tokens are derived
   mathematically, not hand-tuned.

3. **One accent ladder.** accent · accent-hover · accent-press ·
   accent-subtle. No gradient. No second brand color. The discipline
   IS the look.

4. **Density without crowding.** 14px body + 4px base unit + 6px
   radius. Information-dense. Spacious enough to breathe.

5. **Motion ladder anchored at 100ms.** Stripe-territory micro-
   interaction precision. Hovers happen at fast (100ms). State
   changes at normal (150ms). Anything 250ms+ is reserved for
   modals and drawers — never for hovers.

---

## Design Principles

1. **Density is a feature.** Use space deliberately, not generously.
2. **One distinctive detail per screen.** The screenshottable moment.
3. **Border elevation in dark, never shadow.** Surfaces lift via L step + border.
4. **Motion only for state communication.** Nothing decorative.
5. **Hardcoded values are a defect.** Tokens or nothing.

---

## Token Anchors

```
Mode default:        dark
Body size:           14px (sm) — sm-dense (13px) available for tables
Type ratio:          1.250 (Major Third)
Spacing base:        4px
Radius default:      6px (md)
Border default:      1px (thin)
Motion default:      150ms (normal)
Easing default:      cubic-bezier(0,0,0.2,1) (out)
Elevation strategy:  border (dark) · shadow (light)
Accent hue:          oklch H 149° (green)
Accent chroma:       0.219 at L 0.5–0.7
Neutral hue:         oklch H 264° (cool)
Neutral chroma:      ≤ 0.020
```

---

## Do

- Use `var(--bg-base)` etc. in every component. Reference tokens, not
  values.
- Use the 12-stop oklch grey ramp. Don't invent intermediate steps.
- Pair display (Cal Sans) only with body sizes ≥ 24px.
- Use mono (JetBrains Mono) for code, IDs, version strings, and
  tabular numerals — never as body.
- Apply negative tracking on every text size ≥ 20px.
- Show focus rings on `:focus-visible` only. Never `outline: none`
  without a replacement.
- Animate transform + opacity. GPU-only.
- In dark mode, lift surfaces via `bg-base` → `bg-surface` →
  `bg-elevated` ladder + visible borders.
- Use `accent-subtle` (12% alpha tint) for accent-tinted backgrounds
  on selected/active states. Never a flat accent fill.

---

## Don't

- Don't use shadows in dark mode. Use border elevation.
- Don't introduce a second accent hue. One ladder, one identity.
- Don't use AI blue (`#6366f1`, `#8b5cf6`) as primary. Anti-pattern.
- Don't use purple/blue gradients as hero or card backgrounds.
- Don't add rounded cards with left-side colored border accent. Old
  pattern.
- Don't animate `box-shadow`, `width`, `height`, `top`, or `left`.
- Don't put more than 3 different font sizes on one screen.
- Don't put more than 2 weights in any visual group.
- Don't use Heroicons at default 24px stroke 2 without adapting to
  the chrome scale (16/20 typical).
- Don't use Lorem ipsum, "Click me", or stock-photo aesthetics in
  prototypes. Real content, always.

---

## Components Shipped

8 components in `components/`. Every one consumes tokens via CSS
variables or Tailwind classes. Zero hardcoded values.

```
button.jsx    primary · secondary · ghost · destructive  +  sm/md/lg/icon
input.jsx     text · email · password · number · search  +  label/helper/error
card.jsx      default · interactive · bordered  +  header/body/footer slots
nav.jsx       Sidebar · Topbar  +  active state with translateX indicator
table.jsx     sortable · hoverable · selectable · paginated  +  sticky header
badge.jsx     default · success · warning · error · info  +  sm/md
modal.jsx     fade overlay + slide-up body + focus trap + ESC close
toast.jsx     success · warning · error · info · default  +  pause-on-hover
```

The full 14-component set (avatar, select, switch, checkbox, radio,
skeleton + the above 8) is generated by module 08 when the system is
adopted. The 8 here are the canonical starters.

---

## When To Adapt

saas-dark is most useful as a base for:
- Adapting to your brand: keep structure, swap accent hue + display font.
- Blending with another system: blend with linear (denser) or vercel
  (more contrast) for character variations.

Adapt via `/design system` → option 7 → `[B] Adapt to my brand` or
`[L] Blend`.

---

## License

The system tokens, components, and preview are released as part of
design-engine. Free to use, modify, fork, ship.

Fonts: Inter and JetBrains Mono are OFL. Cal Sans is free for
commercial use (cal.com/cal-sans). Replace with your licensed fonts
before shipping if redistribution requires it.
