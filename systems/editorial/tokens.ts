// editorial v1.0.0 — design-engine
export const tokens = {
  name: "editorial", version: "1.0.0",
  modes: ["light", "dark"] as const, defaultMode: "light" as const,
  color: {
    primitive: {
      grey: { 0: "oklch(1 0 0)", 50: "oklch(0.985 0.005 60)", 950: "oklch(0.100 0.005 60)" },
      accent: { 400: "oklch(0.700 0.190 22)", 500: "oklch(0.580 0.220 22)", 600: "oklch(0.500 0.220 22)" },
      success: "oklch(0.500 0.150 145)", warning: "oklch(0.650 0.165 65)", error: "oklch(0.500 0.220 22)", info: "oklch(0.520 0.150 240)",
    },
    semantic: { bgBase: "var(--bg-base)", bgSurface: "var(--bg-surface)", textPrimary: "var(--text-primary)", textSecondary: "var(--text-secondary)", borderSubtle: "var(--border-subtle)", borderDefault: "var(--border-default)", accent: "var(--accent)", accentText: "var(--accent-text)" },
    component: { dropCapColor: "var(--drop-cap-color)" },
  },
  typography: {
    font: { display: "var(--font-display)", body: "var(--font-body)", chrome: "var(--font-chrome)", mono: "var(--font-mono)" },
    size: {
      xs:    { size: "13px", lineHeight: "1.5",  letterSpacing: "0.01em",   weight: 400 },
      sm:    { size: "15px", lineHeight: "1.5",  letterSpacing: "0",        weight: 400 },
      base:  { size: "19px", lineHeight: "1.7",  letterSpacing: "0",        weight: 400 },
      lg:    { size: "23px", lineHeight: "1.5",  letterSpacing: "-0.005em", weight: 400 },
      xl:    { size: "30px", lineHeight: "1.3",  letterSpacing: "-0.015em", weight: 500 },
      "2xl": { size: "40px", lineHeight: "1.15", letterSpacing: "-0.025em", weight: 600 },
      "3xl": { size: "54px", lineHeight: "1.05", letterSpacing: "-0.035em", weight: 700 },
      "4xl": { size: "72px", lineHeight: "1.0",  letterSpacing: "-0.04em",  weight: 700 },
      "5xl": { size: "96px", lineHeight: "0.95", letterSpacing: "-0.045em", weight: 700 },
    },
  },
  spacing: { 0: "0", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 6: "24px", 8: "32px", 12: "48px", 16: "64px", 24: "96px", 32: "128px" },
  radius:  { none: "0", sm: "0", md: "0", lg: "0", xl: "0", "2xl": "0", full: "9999px" },
  border:  { thin: "1px", medium: "1.5px", thick: "2px" },
  shadow:  { xs: "none", sm: "none", md: "none", lg: "none", xl: "none", focus: "var(--shadow-focus)" },
  motion:  {
    duration: { instant: "0ms", fast: "150ms", normal: "200ms", slow: "300ms", deliberate: "500ms", spring: "400ms" },
    easing:   { out: "cubic-bezier(0, 0, 0.2, 1)", in: "cubic-bezier(0.4, 0, 1, 1)", inOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  },
} as const;
export type Tokens = typeof tokens;
export default tokens;
