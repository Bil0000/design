# notion — Design System
*v1.0.0 · default mode: light · ambition baseline: B*

## Personality

Warm neutrals. Content-first. Highly readable. Quiet UI that gets out of the way of the writing.

notion is the system for content tools, docs, note-taking, knowledge bases. Long-form reading is the test. UI chrome stays understated; type leads.

## Inspired by

notion.so — warm off-white bg, Inter body + Charter / Lyon serif option for editorial blocks, generous spacing, soft surfaces, restrained accent. Adjacent: Craft, Bear, Roam Research.

## Audience

Content creators · knowledge workers · note-takers · writers · documentation teams · long-form reading audiences.

Avoid for: data-dense dashboards, devtools, brutalist brands.

## Distinctive

1. **Warm neutrals** — hue 60° (paper-cream tone). Backgrounds feel like paper.
2. **17px body** — long-form reading anchor.
3. **Charter serif option** for editorial blocks (long passages, document content).
4. **Soft surfaces** — radius 12px (xl) default for cards.
5. **Minimal accent** — grey-led system; brand color used only for action affordance.
6. **Generous line-height** (1.7 for body, 1.5 for chrome).

## Token Anchors

```
Mode default:        light (dark equivalent shipped)
Body size:           17px (base — note: bumped from typical 16)
Type ratio:          1.250 (Major Third)
Spacing base:        4px
Radius default:      12px (xl) — softer than Stripe
Border default:      1px
Motion default:      150ms
Easing default:      ease-out
Elevation strategy:  shadow (light) · border + bg lift (dark)
Accent hue:          oklch H 220° (muted blue)
Accent chroma:       0.140 at L 0.55 (intentionally restrained)
Neutral hue:         oklch H 60° (warm paper-cream)
Neutral chroma:      ≤ 0.012
```

## Do

Use 17px body for documents. Use Charter / serif for editorial blocks (long passages). Generous line-height (1.7) on body. Restrained accent — most chrome is grey. Soft 12px radius. Warm-toned shadows.

## Don't

Don't use cool clinical whites. Don't go denser than 15px on chrome. Don't introduce a saturated brand color. Don't use serif for UI chrome. Don't sharpen radius below 8px.

## License

Tokens released under design-engine license. Inter (OFL), Charter is freely available; replace with a licensed serif if redistribution requires.
