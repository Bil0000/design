# enterprise — Design System
*v1.0.0 · default mode: light · ambition baseline: A/B*

## Personality

High density. Accessibility-first. Conservative. WCAG AA+ throughout.

enterprise is the system you reach for when the audience is procurement-driven, regulated, or accessibility-mandated. Government, large enterprise, healthcare, finance back-office. AAA contrast where possible. Plex (or Inter) body. 14px baseline.

## Inspired by

IBM Carbon Design System (carbondesignsystem.com), Salesforce Lightning, Microsoft Fluent (less polish, more system). Plex Sans body, dense data tables, AAA contrast on body text, conservative palette.

## Audience

Enterprise platforms · government · healthcare · finance back-office · accessibility-mandated products · large-scale platforms with > 100 components.

Avoid for: consumer-warm products, brand-led startups, anything that needs distinctive personality.

## Distinctive

1. **AA+ contrast on every body text/bg pair.** AAA where possible.
2. **14px body baseline** — dense but readable.
3. **Plex Sans** (or Inter fallback) — neutral, scalable, multi-language.
4. **4px base** with strong half-step density.
5. **Carbon-blue accent** (oklch H 245°) — restrained, professional.
6. **2px focus ring** — visible always, never removed.
7. **Conservative motion** — 240ms standard, no spring.
8. **AAA contrast option** — alt token set when AAA is mandated.

## Token Anchors

```
Mode default:        light
Body size:           14px (sm baseline)
Type ratio:          1.250 (Major Third)
Spacing base:        4px
Radius default:      4px (sm) — minimal but not 0
Border default:      1px
Motion default:      240ms
Easing default:      ease-in-out
Elevation strategy:  shadow (light) · border (dark)
Accent hue:          oklch H 245° (Carbon-blue)
Accent chroma:       0.180 at L 0.50
Neutral hue:         oklch H 245° (cool)
Neutral chroma:      ≤ 0.012
A11y target:         WCAG AA min, AAA where ≥ 7.0 contrast feasible
```

## Do/Don't

Use AA contrast minimum. Use 2px focus ring always. Use Plex / Inter. Use 14px body. Use ease-in-out (not ease-out spring) for trust. Don't drop below AA. Don't remove focus rings. Don't use ambient gradients. Don't introduce a second accent.

## License

design-engine license. IBM Plex (OFL), Inter (OFL).
