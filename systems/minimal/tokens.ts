// minimal v1.0.0 — design-engine
export const tokens = {
  name: "minimal", version: "1.0.0",
  modes: ["light", "dark"] as const, defaultMode: "light" as const,
  color: {
    primitive: {
      grey: { 0: "oklch(1 0 0)", 50: "oklch(0.985 0 0)", 950: "oklch(0.080 0 0)" },
      accent: { 500: "oklch(0.500 0.140 22)" },
      success: "oklch(0.500 0.130 145)", warning: "oklch(0.640 0.150 65)", error: "oklch(0.480 0.190 22)", info: "oklch(0.500 0.150 240)",
    },
    semantic: { bgBase: "var(--bg-base)", textPrimary: "var(--text-primary)", borderDefault: "var(--border-default)", accent: "var(--accent)", accentText: "var(--accent-text)" },
    component: {},
  },
  typography: {
    font: { display: "var(--font-display)", body: "var(--font-body)", mono: "var(--font-mono)" },
    size: {
      xs:    { size: "13px", lineHeight: "1.55", letterSpacing: "0.01em",   weight: 400 },
      sm:    { size: "15px", lineHeight: "1.55", letterSpacing: "0",        weight: 400 },
      base:  { size: "17px", lineHeight: "1.65", letterSpacing: "-0.005em", weight: 400 },
      lg:    { size: "22px", lineHeight: "1.4",  letterSpacing: "-0.015em", weight: 400 },
      xl:    { size: "29px", lineHeight: "1.25", letterSpacing: "-0.025em", weight: 500 },
      "2xl": { size: "39px", lineHeight: "1.1",  letterSpacing: "-0.035em", weight: 500 },
      "3xl": { size: "52px", lineHeight: "1.0",  letterSpacing: "-0.045em", weight: 600 },
      "4xl": { size: "69px", lineHeight: "0.95", letterSpacing: "-0.05em",  weight: 600 },
      "5xl": { size: "92px", lineHeight: "0.9",  letterSpacing: "-0.06em",  weight: 600 },
    },
  },
  spacing: { 0: "0", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 6: "24px", 8: "32px", 12: "48px", 16: "64px", 24: "96px", 32: "128px", 48: "192px", 64: "256px" },
  radius:  { none: "0", sm: "0", md: "2px", lg: "2px", xl: "2px", "2xl": "2px", full: "9999px" },
  border:  { thin: "1px", medium: "1px", thick: "1.5px" },
  shadow:  { xs: "none", sm: "none", md: "none", lg: "none", xl: "none", focus: "var(--shadow-focus)" },
  motion:  {
    duration: { instant: "0ms", fast: "150ms", normal: "200ms", slow: "300ms", deliberate: "500ms", spring: "400ms" },
    easing:   { out: "cubic-bezier(0, 0, 0.2, 1)", in: "cubic-bezier(0.4, 0, 1, 1)", inOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  },
} as const;
export type Tokens = typeof tokens;
export default tokens;
