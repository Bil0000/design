# linear — Design System
*v1.0.0 · default mode: dark · ambition baseline: B/C*

---

## Personality

Density as aesthetic. Precision as identity. Linear is the system you
reach for when the audience is keyboard-first power users — issue
trackers, project managers, developer tools. Every choice — 13px
body, 6px radius, 4px base, 100ms motion, mono in chrome — converges
on speed for people who live in the app all day.

This is the densest pre-built system. It is the most opinionated.
Its restraint IS the look.

---

## Inspired by

The actual Linear app (linear.app):
- 13px body — the canonical density choice
- Cool grey ramp tilted toward blue-violet (~hue 252°)
- Single accent ladder, used sparingly for state communication
- Mono numerals in chrome (issue IDs, timestamps, status counts)
- Border elevation in dark — never shadows
- Active sidebar item with the sliding accent indicator
- Keyboard-first interaction baked into the chrome

Adjacent references: Height (height.app), Raycast (similar density
+ keyboard ergonomics), Mintlify (mono in numerals).

---

## Audience

- Software engineers, eng managers, technical founders
- Product managers in technical organizations
- Designers and developers using the same tool
- Power users who memorize keyboard shortcuts in week one
- Teams whose primary mode of work is the app, not Slack

Avoid this system for:
- Consumer-mass-market products (saas-light or notion)
- Marketing-grade landings (vercel for precision, stripe for warmth)
- Enterprise procurement audiences (enterprise system)

---

## What Makes It Distinctive

1. **13px body.** The density choice that defines the system. Every
   other size scales from this, not from 14 or 16.

2. **Cool blue-violet neutral.** Hue ~252°. Reads "technical" without
   reading "cold". Distinct from saas-dark's hue 264°.

3. **Mono in chrome.** IDs (`ENG-1234`), timestamps (`2h ago`),
   counts (`12`), version strings — all mono. Body stays sans.

4. **Sliding active indicator.** A persistent 2px-wide accent bar
   absolutely positioned at the left edge of the active sidebar
   item. Animated translateX between items. Never re-rendered.

5. **Border elevation only.** Dark mode lifts via L step ladder
   (0.10 → 0.13 → 0.17 → 0.22) plus visible borders. Zero shadows
   in dark mode tokens.

6. **Spring on delight, ease-out on chrome.** State changes are
   100ms ease-out (Stripe-territory micro-interaction precision).
   Hero / first-touch surfaces unlock spring (350ms cubic-bezier
   0.34, 1.56, 0.64, 1).

---

## Token Anchors

```
Mode default:        dark
Body size:           13px (sm-dense) — sm (14px) for non-density surfaces
Type ratio:          1.250 (Major Third)
Spacing base:        4px
Radius default:      6px (md)
Border default:      1px (thin)
Motion default:      100ms (fast)
Easing default:      ease-out for chrome, spring on delight surfaces
Elevation strategy:  border (dark) · shadow-xs (light)
Accent hue:          oklch H 268° (blue-violet)
Accent chroma:       0.180 at L 0.65
Neutral hue:         oklch H 252° (cool, slightly warm of pure cool)
Neutral chroma:      ≤ 0.018
```

---

## Do

- Use 13px body (`text-sm-dense`) on tables, lists, dense data.
- Use 14px (`text-sm`) on chrome around dense data (toolbars, tabs).
- Use mono for: issue IDs, version strings, timestamps, counts in
  chrome (badges with numbers), command palette shortcut chips.
- Use the sliding active indicator pattern on the sidebar.
- Use border elevation in dark — `bg-base` (L 0.10) → `bg-surface`
  (L 0.13) → `bg-elevated` (L 0.17) → `bg-overlay` (L 0.22).
- Negative tracking on every text size ≥ 20px.
- 100ms hover transitions, 150ms state changes, 250ms drawers/modals.
- One distinctive detail per screen: the sliding indicator counts.
- Display command palette (⌘K) chip and keyboard shortcuts visibly.

---

## Don't

- Don't bump body to 14px or 16px. The system breaks at 13.
- Don't use shadows in dark mode. Border elevation only.
- Don't introduce a second accent hue. One ladder, one identity.
- Don't use sans for IDs, numerals, or version strings. Mono.
- Don't animate the sidebar indicator with multiple bars or fade.
- Don't use icons larger than 16px in dense chrome.
- Don't put more than 3 different font sizes on one screen.
- Don't add gradients. Linear is flat.
- Don't soften corners beyond 8px (`radius-lg`). Most chrome stays at 6.

---

## License

Tokens, system docs released under the design-engine license. Inter
+ JetBrains Mono are OFL — replace with your licensed cuts before
shipping if redistribution requires it.
