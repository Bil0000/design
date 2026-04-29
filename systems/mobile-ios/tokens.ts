// mobile-ios v1.0.0 — design-engine
export const tokens = {
  name: "mobile-ios", version: "1.0.0",
  modes: ["light", "dark"] as const, defaultMode: "light" as const,
  color: {
    primitive: {
      grey: { 0: "oklch(1 0 0)", 50: "oklch(0.985 0 0)", 950: "oklch(0.100 0 0)" },
      systemBlue:   "oklch(0.620 0.190 250)",
      systemGreen:  "oklch(0.700 0.180 145)",
      systemOrange: "oklch(0.760 0.180 60)",
      systemRed:    "oklch(0.620 0.220 22)",
      systemYellow: "oklch(0.840 0.150 95)",
      systemPurple: "oklch(0.560 0.180 290)",
      systemPink:   "oklch(0.700 0.180 350)",
      systemTeal:   "oklch(0.700 0.130 200)",
      systemIndigo: "oklch(0.500 0.180 270)",
    },
    semantic: {
      bgBase: "var(--bg-base)", bgSurface: "var(--bg-surface)", bgGrouped: "var(--bg-grouped)",
      labelPrimary: "var(--label-primary)", labelSecondary: "var(--label-secondary)", labelTertiary: "var(--label-tertiary)", labelQuaternary: "var(--label-quaternary)",
      fillPrimary: "var(--fill-primary)", fillSecondary: "var(--fill-secondary)", fillTertiary: "var(--fill-tertiary)", fillQuaternary: "var(--fill-quaternary)",
      separator: "var(--separator)", separatorOpaque: "var(--separator-opaque)",
      accent: "var(--accent)", success: "var(--success)", warning: "var(--warning)", error: "var(--error)",
    },
    component: { buttonBgPrimary: "var(--button-bg-primary)", inputBg: "var(--input-bg)", cardBg: "var(--card-bg)", modalBg: "var(--modal-bg)", modalOverlay: "var(--modal-overlay)", tabbarBg: "var(--tabbar-bg)", navbarBg: "var(--navbar-bg)" },
  },
  typography: {
    font: { display: "var(--font-display)", body: "var(--font-body)", rounded: "var(--font-rounded)", mono: "var(--font-mono)" },
    size: {
      caption2:   { size: "11px", lineHeight: "1.27", letterSpacing: "0.005em",  weight: 400 },
      caption1:   { size: "12px", lineHeight: "1.33", letterSpacing: "0",         weight: 400 },
      footnote:   { size: "13px", lineHeight: "1.38", letterSpacing: "-0.005em",  weight: 400 },
      subhead:    { size: "15px", lineHeight: "1.33", letterSpacing: "-0.01em",   weight: 400 },
      callout:    { size: "16px", lineHeight: "1.31", letterSpacing: "-0.015em",  weight: 400 },
      body:       { size: "17px", lineHeight: "1.29", letterSpacing: "-0.022em",  weight: 400 },
      headline:   { size: "17px", lineHeight: "1.29", letterSpacing: "-0.022em",  weight: 600 },
      title3:     { size: "20px", lineHeight: "1.25", letterSpacing: "-0.022em",  weight: 400 },
      title2:     { size: "22px", lineHeight: "1.27", letterSpacing: "-0.026em",  weight: 400 },
      title1:     { size: "28px", lineHeight: "1.21", letterSpacing: "-0.022em",  weight: 400 },
      largeTitle: { size: "34px", lineHeight: "1.21", letterSpacing: "-0.022em",  weight: 700 },
    },
  },
  spacing: { 0: "0", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "20px", 6: "24px", 8: "32px", 12: "48px", 16: "64px" },
  radius: { none: "0", sm: "6px", md: "10px", lg: "14px", xl: "20px", "2xl": "28px", full: "9999px" },
  border: { thin: "0.5px", medium: "1px", thick: "2px" },
  touch:  { min: "44px" },
  shadow: { xs: "var(--shadow-xs)", sm: "var(--shadow-sm)", md: "var(--shadow-md)", lg: "var(--shadow-lg)", xl: "var(--shadow-xl)", focus: "var(--shadow-focus)" },
  blur:   { thin: "var(--blur-thin)", regular: "var(--blur-regular)", thick: "var(--blur-thick)", ultraThin: "var(--blur-ultra-thin)" },
  motion: {
    duration: { instant: "0ms", fast: "150ms", normal: "250ms", slow: "350ms", deliberate: "500ms", spring: "550ms" },
    easing:   { out: "cubic-bezier(0, 0, 0.2, 1)", in: "cubic-bezier(0.4, 0, 1, 1)", inOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.32, 0.72, 0, 1)" },
  },
} as const;
export type Tokens = typeof tokens;
export default tokens;
