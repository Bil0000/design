// enterprise v1.0.0 — design-engine
export const tokens = {
  name: "enterprise", version: "1.0.0",
  modes: ["light", "dark"] as const, defaultMode: "light" as const,
  color: {
    primitive: {
      grey: { 0: "oklch(1 0 0)", 50: "oklch(0.985 0.003 245)", 950: "oklch(0.090 0.005 245)" },
      accent: { 500: "oklch(0.580 0.180 245)", 600: "oklch(0.500 0.180 245)", 700: "oklch(0.420 0.165 245)" },
      success: "oklch(0.500 0.150 145)", warning: "oklch(0.640 0.155 65)", error: "oklch(0.500 0.220 22)", info: "oklch(0.500 0.180 245)",
    },
    semantic: { bgBase: "var(--bg-base)", bgSurface: "var(--bg-surface)", textPrimary: "var(--text-primary)", textSecondary: "var(--text-secondary)", borderDefault: "var(--border-default)", borderFocus: "var(--border-focus)", accent: "var(--accent)", accentText: "var(--accent-text)" },
    component: {},
  },
  typography: {
    font: { display: "var(--font-display)", body: "var(--font-body)", serif: "var(--font-serif)", mono: "var(--font-mono)" },
    size: {
      xs:    { size: "12px", lineHeight: "1.6",  letterSpacing: "0.01em",   weight: 400 },
      sm:    { size: "14px", lineHeight: "1.5",  letterSpacing: "0.005em",  weight: 400 },
      base:  { size: "14px", lineHeight: "1.5",  letterSpacing: "0",        weight: 400 },
      lg:    { size: "16px", lineHeight: "1.45", letterSpacing: "-0.005em", weight: 500 },
      xl:    { size: "20px", lineHeight: "1.3",  letterSpacing: "-0.015em", weight: 600 },
      "2xl": { size: "28px", lineHeight: "1.2",  letterSpacing: "-0.025em", weight: 600 },
      "3xl": { size: "36px", lineHeight: "1.15", letterSpacing: "-0.03em",  weight: 600 },
      "4xl": { size: "48px", lineHeight: "1.05", letterSpacing: "-0.035em", weight: 700 },
    },
  },
  spacing: { 0: "0", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "20px", 6: "24px", 8: "32px", 12: "48px", 16: "64px" },
  radius:  { none: "0", sm: "4px", md: "4px", lg: "6px", xl: "8px", "2xl": "12px", full: "9999px" },
  border:  { thin: "1px", medium: "2px", thick: "2px" },
  shadow:  { xs: "var(--shadow-xs)", sm: "var(--shadow-sm)", md: "var(--shadow-md)", lg: "var(--shadow-lg)", xl: "var(--shadow-xl)", focus: "var(--shadow-focus)" },
  motion:  {
    duration: { instant: "0ms", fast: "120ms", normal: "240ms", slow: "320ms", deliberate: "400ms", spring: "300ms" },
    easing:   { out: "cubic-bezier(0, 0, 0.2, 1)", in: "cubic-bezier(0.4, 0, 1, 1)", inOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.4, 0, 0.2, 1)" },
  },
} as const;
export type Tokens = typeof tokens;
export default tokens;
