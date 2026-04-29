# minimal — Design System
*v1.0.0 · default mode: light · ambition baseline: C/D*

## Personality

Extreme restraint. One accent maximum. Maximum whitespace. The design is what is removed.

minimal is the system you reach for when the brief is portfolio, agency, single-product brand, or any surface where calm = quality. 80%+ negative space. Typography leads. One chromatic decision.

## Inspired by

Kenya Hara / Muji aesthetic. Aesop brand sites. Fonts In Use (the meta-design site). Read Receipts. Mostly-typographic editorial sites.

## Audience

Portfolios · agencies · single-product brands · cultural institutions · premium consumer goods.

Avoid for: dashboards, devtools, dense data, anything that needs to shout.

## Distinctive

1. **80%+ negative space** — content occupies less of the surface than whitespace.
2. **One accent maximum** — used at < 1% surface area.
3. **1.333 ratio (Perfect Fourth)** — wider scale jumps for clear hierarchy.
4. **Radius 0 or 2px max** — nothing soft.
5. **No shadows anywhere** — borders only, hairline.
6. **Slow motion** — 300ms+ on hero only, instant elsewhere.
7. **Single typeface family** — body and display from the same family, weight does the work.

## Token Anchors

```
Mode default:        light
Body size:           17px (base)
Type ratio:          1.333 (Perfect Fourth)
Spacing base:        4px (with massive multipliers)
Radius default:      0
Border default:      1px (hairline)
Motion default:      150ms (chrome) · 400ms (hero only)
Easing default:      ease-out
Elevation strategy:  none — borders only
Accent hue:          oklch H 0° (true neutral by default; brief overrides)
Accent chroma:       0.000 by default; if accent picked, low (≤ 0.140)
Neutral hue:         oklch H 0° (true neutral)
```

## Do/Don't

Use generous whitespace. Use one accent. Use one typeface family. Use weight for hierarchy. No shadows, no rounding. Slow motion on hero only. Don't add a second color. Don't soften corners. Don't shout.

## License

design-engine license. Inter (OFL) + iA Writer Mono (OFL).
