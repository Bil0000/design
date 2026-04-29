# mobile-ios — Design System
*v1.0.0 · default mode: light (with dark equivalent) · ambition baseline: B*

## Personality

iOS HIG-compliant. SF Pro everywhere. Native feel. Adaptive light/dark with semantic colors.

mobile-ios is the system you reach for when shipping iOS / iPadOS / macOS apps that should feel like Apple's own — Health, Fitness, Notes, Settings. Native components, dynamic type respect, sheet presentations, blur and translucency.

## Inspired by

Apple's Human Interface Guidelines (developer.apple.com/design/human-interface-guidelines). SF Pro Display + SF Pro Text (optical-size split at 20pt). System color tokens: label / secondaryLabel / tertiaryLabel; systemBlue / systemGreen / systemRed. Adaptive light/dark.

Adjacent: Things 3, Bear, Streaks, Linear's macOS app, Apple's first-party apps.

## Audience

Native iOS / iPadOS / macOS apps · Apple-ecosystem-focused products · brand sites that target Apple users.

Avoid for: cross-platform products that should feel "anywhere", Android-first.

## Distinctive

1. **SF Pro everywhere** with optical-size split: SF Pro Display ≥ 20pt, SF Pro Text < 20pt.
2. **iOS spacing**: 16pt outer margins, 20pt content margins, 44pt minimum touch targets.
3. **systemBlue accent** as the iOS default; configurable per app brand.
4. **Sheet presentations** from bottom (slide-up + corner-radius).
5. **Adaptive semantic tokens** that flip between light + dark per system preference.
6. **Blur and translucency** on chrome (nav bars, tab bars).
7. **Dynamic type** support — sizes scale with user preference.

## Token Anchors

```
Mode default:        light (system preference)
Body size:           17pt (iOS body baseline)
Type ratio:          1.125 (Major Second — iOS spacing)
Spacing base:        4pt
Radius default:      10pt (iOS card)
Touch target min:    44 × 44 pt
Motion default:      350ms (iOS transitions)
Easing default:      iOS spring (cubic-bezier 0.32, 0.72, 0.0, 1.0)
Elevation strategy:  blur + tint (chrome) · shadow (cards in light) · border (dark)
Accent hue:          oklch H 250° (systemBlue)
Accent chroma:       0.180 at L 0.55
Neutral hue:         oklch H 0° (true neutral, follows iOS)
```

## Do/Don't

Use SF Pro. Use system color tokens. Use 44pt min touch targets. Respect dynamic type. Use sheet from bottom for modals. Use blur on nav bars over content. Don't use centered alignment for body. Don't use < 17pt for body. Don't fight the platform.

## License

design-engine license. SF Pro is Apple's; free for use in Apple-platform apps. Substitute with Inter for cross-platform / web fallback.
