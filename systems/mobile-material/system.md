# mobile-material — Design System
*v1.0.0 · default mode: light (with dark equivalent) · ambition baseline: B*

## Personality

Material 3 / Material You. Roboto. Dynamic color tokens. Elevation surfaces. Native Android.

mobile-material is the system you reach for when shipping native Android apps that should feel like Google's own — Gmail, Calendar, Maps. Material You's adaptive palette, M3 type scale, FAB pattern, ripple feedback, top app bar that scrolls.

## Inspired by

Material 3 (m3.material.io). Roboto / Google Sans, M3 type scale (display/headline/title/body/label), dynamic color tokens (primary/secondary/tertiary + onColor variants), tonal elevation, FAB pattern.

## Audience

Native Android apps · cross-platform apps prioritizing Android · Google-ecosystem-focused products.

Avoid for: iOS-first, Apple-ecosystem brand sites, brand-led products needing distinct identity.

## Distinctive

1. **Roboto / Google Sans** with M3 type scale (display 57/45/36, headline 32/28/24, title 22/16/14, body 16/14/12, label 14/12/11).
2. **Dynamic color tokens**: primary/secondary/tertiary + onPrimary/onSecondary/onTertiary + container variants.
3. **8dp base unit** (Material standard).
4. **FAB pattern** (Floating Action Button) for primary action.
5. **Bottom navigation** for ≤ 5 destinations.
6. **Tonal elevation** (light) + container surfaces (dark).
7. **Ripple feedback** on every tappable surface.

## Token Anchors

```
Mode default:        light
Body size:           16px (body-large)
Type ratio:          custom M3 (per role)
Spacing base:        8px (Material standard, with 4dp half-step)
Radius default:      12px (M3 medium)
Touch target min:    48 × 48 dp
Motion default:      300ms (M3 standard)
Easing default:      M3 standard (cubic-bezier 0.2, 0, 0, 1)
Elevation strategy:  shadow + tonal (light) · container surface (dark)
Accent hue:          oklch H 250° (Material You-style purple-blue, configurable)
Accent chroma:       0.140 at L 0.42
```

## Do/Don't

Use Roboto + Google Sans. Use M3 type roles. Use 8dp base. Use FAB for primary action. Use 48dp min touch targets. Use ripple feedback. Don't use iOS sheet patterns. Don't use SF Pro. Don't fight Material conventions.

## License

design-engine license. Roboto + Google Sans (OFL/Apache).
