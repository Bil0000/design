# raycast — Design System
*v1.0.0 · default mode: dark · ambition baseline: C*

## Personality

Premium dark. Frosted glass with purpose. Power-user density. Keyboard-first.

raycast is the system you reach for when the product feels summoned, not opened — command palettes, launchers, productivity tools. Frosted glass is functional (real content behind it benefits from softening), the brand red is unmistakable, and density is matched to keyboard-first interaction.

## Inspired by

raycast.app — frosted dark surfaces over real product content, brand red `#FF6363`, mono in command-palette chrome, 13–14px body, opinionated keyboard hints visible in chrome.

## Audience

Productivity power users · macOS / cross-platform launchers · keyboard-first interfaces · creative-tech audiences.

Avoid for: marketing-grade landings, consumer-mass-market, anything that should feel "approachable to non-power users".

## Distinctive

1. **Brand red accent** — oklch(0.700 0.220 25), used on the active state of palette items.
2. **Frosted dark surfaces** — backdrop-blur with purpose (over real content only).
3. **Body 14px** — slightly less dense than Linear, more than saas-dark.
4. **Berkeley Mono in chrome** — shortcuts, hotkey chips, command-palette IDs.
5. **8px radius** — softer than Linear's 6, sharp enough to feel precise.
6. **Border elevation in dark** + subtle inner glow on focused command-palette items.

## Token Anchors

```
Mode default:        dark
Body size:           14px (sm)
Type ratio:          1.250 (Major Third)
Spacing base:        4px
Radius default:      8px (lg)
Border default:      1px
Motion default:      120ms (between fast and normal)
Easing default:      ease-out
Elevation strategy:  border + frosted blur (dark) · shadow (light)
Accent hue:          oklch H 25° (warm red)
Accent chroma:       0.220 at L 0.70
Neutral hue:         oklch H 260° (cool, slight blue-violet)
Neutral chroma:      ≤ 0.014
```

## Do

Use frosted blur ONLY when real content is behind the surface. Use the brand red sparingly. Use mono for shortcut chips. Border elevation in dark. 120ms motion default.

## Don't

Don't use frosted blur on flat surfaces. Don't introduce a second accent color. Don't use shadows in dark mode. Don't bump the radius past 12.

## License

Tokens released under design-engine license. Inter + Berkeley Mono → swap with licensed cuts before shipping if redistribution requires.
