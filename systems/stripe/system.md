# stripe — Design System
*v1.0.0 · default mode: light · ambition baseline: B/C*

---

## Personality

Authoritative warmth. Financial-grade trust. Documentation precision.

stripe is the system you reach for when the product needs to feel
trustworthy AND human at the same time. Fintech, payments, billing,
SaaS that wants the warmth of a quality consumer brand without losing
the rigor of an enterprise tool.

The defining choices: warm off-white bg (paper-cream, not clinical
white), authoritative serif option for editorial moments, micro-
interaction precision at 100–150ms, the famous ambient gradient (only
in marketing hero), real product screenshots in marketing.

---

## Inspired by

The actual Stripe surfaces (stripe.com, stripe.com/docs, dashboard):
- Warm off-white bg (oklch L 0.985, hue 80°)
- Sohne (sans body) + custom serif display option
- Brand purple `#635BFF` ≈ oklch(0.555 0.215 280) — the iconic accent
- 16–17px body for documentation readability
- 100/150ms motion ladder (Stripe-territory micro-interaction precision)
- The famous ambient gradient: 3-stop soft mesh, marketing hero only
- Documentation-grade code blocks
- Real product UI screenshots, never abstractions

Adjacent references: Mailchimp (similar warmth), Mercury Bank
(Stripe-influenced), Linear (similar 100ms motion discipline).

---

## Audience

- Fintech product audiences (payments, banking, billing)
- SaaS that wants warmth + authority simultaneously
- Documentation-heavy products
- B2B brands targeting business buyers AND developers in the same surface
- Audiences who reward both precision AND approachability

Avoid this system for:
- Brutalist or cool-minimal brands (vercel, linear)
- Pure devtool audiences (saas-dark, linear)
- Anything that should feel sharp / industrial / cold

---

## What Makes It Distinctive

1. **Warm off-white base.** Background `oklch(0.985 0.005 80)`. Not
   clinical white. Reads as paper, not screen. The warmth IS the
   approachability.

2. **Stripe purple accent.** `oklch(0.555 0.215 280)` ≈ #635BFF. Used
   sparingly (1–2% surface coverage) for primary CTAs and brand
   touchpoints. Not a gradient hue — a flat brand color.

3. **Serif display option.** Display sizes can use a serif (Stripe's
   custom serif blend, or Mercury / Söhne Schmal). Body stays sans
   (Sohne / Inter fallback).

4. **100/150ms motion ladder.** Stripe-territory micro-interaction
   precision. Hovers happen at 100ms. State changes at 150ms.
   Anything 250ms+ is reserved for sheets and modals.

5. **Ambient gradient in marketing hero only.** A 3-stop soft mesh
   gradient (purple/coral/cyan) appears in landing-page heroes. NEVER
   in product chrome. Module 07 generates it conditionally based on
   surface (landing → yes, product → no).

6. **Documentation-grade code blocks.** Code is content. Render with
   real syntax highlighting, mono font, no decorative box, line
   numbers when over 5 lines.

---

## Token Anchors

```
Mode default:        light (dark equivalent shipped)
Body size:           16px (base)
Type ratio:          1.250 (Major Third)
Spacing base:        4px
Radius default:      8px (lg) — softer than Linear's 6, sharper than Notion's 12
Border default:      1px (thin)
Motion default:      150ms (normal)
Easing default:      ease-out
Elevation strategy:  shadow (light) · border + bg lift (dark)
Accent hue:          oklch H 280° (Stripe purple)
Accent chroma:       0.215 at L 0.555
Neutral hue:         oklch H 80° (warm, ~paper-cream)
Neutral chroma:      ≤ 0.012
```

---

## Do

- Use warm off-white `oklch(0.985 0.005 80)` for light mode bg.
- Use Stripe purple as the primary accent. Sparingly.
- Use the serif display ONLY at sizes ≥ 32px AND only on editorial
  / marketing surfaces. Product UI uses sans throughout.
- Use 100ms hover transitions, 150ms state changes, 250ms sheets.
- Render code blocks with proper syntax highlighting.
- Use real product screenshots in marketing. Never abstractions.
- Use the ambient gradient ONLY in marketing hero, behind type.
- Body 16px, line-height 1.6 for documentation feel.

---

## Don't

- Don't use clinical pure-white. The system is warm.
- Don't use Stripe purple in dashboard chrome. Sparingly only.
- Don't use serif in product UI. Editorial / marketing surfaces only.
- Don't extend the ambient gradient into product chrome.
- Don't use stock photos. Real screenshots only.
- Don't use 200ms+ on hover transitions. 100ms anchor.
- Don't add dark-mode shadows. Border + bg lift.
- Don't introduce a second accent color. One purple, no rivals.
- Don't use uppercase for body text or labels (warmth conflicts).

---

## License

Tokens, system docs released under design-engine license. Sohne is
commercial — replace with Inter (OFL) or licensed Sohne for
production. The serif option requires a commercial display face;
free alternatives include Source Serif 4 (OFL) or Crimson Pro (OFL).
