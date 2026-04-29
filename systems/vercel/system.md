# vercel — Design System
*v1.0.0 · default mode: light (with dark equivalent) · ambition baseline: C*

---

## Personality

Black is black. White is white. Maximum contrast. Documentation-grade.
Performance is the design.

vercel is the system you reach for when the brand demands absolute
precision and zero decoration. It commits: radius 0, no shadows,
pure-contrast palette, Geist Sans + Geist Mono, body 16px. Every
removed flourish is the message.

This is the canonical "developer marketing" system in design-engine.

---

## Inspired by

The actual Vercel surfaces (vercel.com, nextjs.org, Resend
documentation):
- Pure black (`#000000`) and pure white (`#FFFFFF`) primary surfaces
- Radius 0 across chrome and content
- No shadows — surfaces lift via borders only
- Geist Sans + Geist Mono — the typeface family Vercel released
- 16px body — readable, doc-grade
- Single brand accent used sparingly (often a sub-product signal)
- Fast motion (100–150ms ease-out)

Adjacent references: Resend (Vercel-influenced precision), Linear
landing (similar restraint), nextjs.org docs.

---

## Audience

- Developers and tech-fluent product audiences
- Marketing for infrastructure, hosting, frameworks, dev tools
- Documentation sites
- Brand sites where the medium IS demonstrating capability
- Audiences who reward precision over warmth

Avoid this system for:
- Warm consumer products (saas-light or notion)
- Older / non-technical audiences (saas-light, stripe)
- Anything where softness or approachability is required

---

## What Makes It Distinctive

1. **Pure black + pure white.** No off-whites. No near-blacks. The
   commitment is the look. Light bg = #FFFFFF. Dark bg = #000000.

2. **Radius 0 across the entire system.** Buttons, cards, inputs,
   modals — all sharp corners. Avatars are the single exception
   (full radius for circles).

3. **No shadows.** Light mode: hairline borders carry elevation. Dark
   mode: bg lift + borders. No `box-shadow` declarations anywhere.

4. **Geist Sans + Geist Mono.** Vercel released these typefaces. They
   are the system's voice. Optical-sized variable fonts.

5. **Body 16px.** Documentation-readable. Not 13/14 (devtool dense)
   nor 18 (editorial). The middle that reads as "documentation".

6. **Single brand accent.** Used at < 1% surface coverage. Often a
   sub-product hue (Vercel's blue, Resend's green, etc.).

---

## Token Anchors

```
Mode default:        light (dark equivalent shipped)
Body size:           16px (base)
Type ratio:          1.250 (Major Third)
Spacing base:        4px
Radius default:      0 (none)
Border default:      1px (thin, hairline)
Motion default:      150ms (normal)
Easing default:      ease-out
Elevation strategy:  border (both modes — light + dark)
Accent hue:          oklch H 230° (blue, Vercel-ish)
Accent chroma:       0.180 at L 0.55
Neutral hue:         oklch H 0° (truly neutral, no tint)
Neutral chroma:      0.000 (pure greyscale, no hue)
```

---

## Do

- Use pure white `oklch(1 0 0)` for light mode bg.
- Use pure black `oklch(0 0 0)` for dark mode bg.
- Use radius 0 everywhere except avatars + pills.
- Use 1px hairline borders for elevation in BOTH modes.
- Use Geist Sans for body + display, Geist Mono for code/IDs.
- Render code blocks beautifully — syntax highlighting, mono, no box.
- Animate transform + opacity at 100–150ms. Nothing slower except
  the rare hero moment.
- Body 16px line-height 1.6 for documentation feel.
- Single accent at < 1% coverage. Use it on the actual brand mark
  and one CTA per surface.

---

## Don't

- Don't use off-whites. White is `#FFFFFF`. Period.
- Don't use near-blacks. Black is `#000000`. Period.
- Don't add box-shadows. Borders carry elevation in both modes.
- Don't round corners. Radius 0 across the system.
- Don't introduce a second brand color unless it's a documented
  sub-product hue.
- Don't use serif fonts. The system is sans + mono only.
- Don't soften with warmth. The system is cool / neutral.
- Don't add gradients of any kind.
- Don't add icons with stroke ≠ 1.5 at the standard sizes.

---

## License

Tokens, system docs released under design-engine license. Geist Sans
+ Geist Mono are OFL (Vercel's gift to the open ecosystem) — both are
free for commercial redistribution.
