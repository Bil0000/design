# editorial — Design System
*v1.0.0 · default mode: light · ambition baseline: C/D*

## Personality

Magazine. Long-form publication. Serif-led. Generous proportions.

editorial is the system you reach for when reading is the act — magazines, longform publications, books, essays, narrative content. Body 19px serif, line-height 1.7, drop-cap allowed, asymmetric layouts.

## Inspired by

The New York Times Magazine, *Pitchfork*, *The New Yorker*, *Smithsonian* — long-form publications that prioritize the read. Charter / Lyon / Source Serif body, Söhne or Untitled Sans for chrome only.

## Audience

Publishers · magazines · longform blogs · book publishers · writers' platforms · editorial brands.

Avoid for: dashboards, devtools, anything dense.

## Distinctive

1. **19px serif body.** Anchored on Charter or Source Serif. Not 16, not 17 — the editorial scale demands more.
2. **Line-height 1.7.** Long-form reading rhythm.
3. **Asymmetric grid.** Left-aligned text column, right-margin sidenotes possible.
4. **Drop caps allowed** at section starts.
5. **Display serif** for hero headlines (Lyon Display, Caslon, custom).
6. **Sans only for UI chrome** — captions, navigation, pull-quotes if intentional.
7. **Generous spacing** — 1.333 ratio (Perfect Fourth), not Major Third.

## Token Anchors

```
Mode default:        light
Body size:           19px (base)
Type ratio:          1.333 (Perfect Fourth)
Spacing base:        4px
Radius default:      0 (editorial — no soft corners)
Border default:      1px
Motion default:      300ms
Easing default:      ease-out (slow, deliberate)
Elevation strategy:  hairline border (light) · subtle bg shift (dark)
Accent hue:          oklch H 22° (warm red)
Accent chroma:       0.220 at L 0.50
Neutral hue:         oklch H 60° (warm paper-cream)
Neutral chroma:      ≤ 0.012
```

## Do/Don't

Use serif body. Use 19px body. Use 1.7 line-height. Use generous spacing. Use sans for chrome only. Drop cap section starts allowed. Don't use 16px body. Don't use radius. Don't use sans for body. Don't crowd content.

## License

design-engine license. Source Serif 4 (OFL), Charter (free), Lyon (commercial — substitute). Inter (OFL) for chrome.
