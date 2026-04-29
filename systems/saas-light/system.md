# saas-light — Design System
*v1.0.0 · default mode: light · ambition baseline: B*

## Personality

Modern SaaS light. Cal.com / Loom territory. Clean, professional, balanced density. The default that actually works.

saas-light is the system you reach for when the brief says "modern SaaS, light mode, polished" and you want something that lands well without being divisive. Inter body, balanced spacing, single brand accent, subtle shadows.

## Inspired by

cal.com, loom.com, posthog.com, vercel-light moments. Inter Sans body, single accent (commonly green or blue), subtle shadows, 8px radius default, 14-15px body.

## Audience

General SaaS · scheduling · video · collaboration · prosumer SaaS · B2B mid-market.

Avoid for: dense devtools (saas-dark/linear), brutalist brands (vercel), warm content products (notion).

## Distinctive

1. **Balanced density** — 15px body, not 13 (Linear) or 17 (notion).
2. **Subtle shadows** with cool-neutral tint.
3. **Single brand accent** (configurable; default green oklch H 152°).
4. **8px radius** default — neither sharp (Vercel 0) nor soft (Notion 12).
5. **Cool-neutral grey ramp** (hue 240°) — slight blue tilt without being cold.
6. **Inter throughout** + JetBrains Mono for code/IDs.

## Token Anchors

```
Mode default:        light
Body size:           15px (base)
Type ratio:          1.250 (Major Third)
Spacing base:        4px
Radius default:      8px (lg)
Border default:      1px
Motion default:      150ms
Easing default:      ease-out
Elevation strategy:  shadow (light) · border (dark)
Accent hue:          oklch H 152° (green)
Accent chroma:       0.180 at L 0.55
Neutral hue:         oklch H 240° (cool, slight blue)
Neutral chroma:      ≤ 0.012
```

## Do/Don't

Use 15px body. Use subtle shadows in light. Use border elevation in dark. One accent. 8px radius. Don't go denser than 14px. Don't introduce a second accent. Don't use shadows in dark.

## License

design-engine license. Inter (OFL), JetBrains Mono (OFL).
