// saas-light v1.0.0 — design-engine
export const tokens = {
  name: "saas-light", version: "1.0.0",
  modes: ["light", "dark"] as const, defaultMode: "light" as const,
  color: {
    primitive: {
      grey: { 0: "oklch(1 0 0)", 50: "oklch(0.985 0.003 240)", 100: "oklch(0.965 0.005 240)", 900: "oklch(0.160 0.006 240)", 950: "oklch(0.110 0.005 240)" },
      accent: { 500: "oklch(0.620 0.180 152)", 600: "oklch(0.550 0.180 152)", 700: "oklch(0.470 0.165 152)" },
      success: "oklch(0.580 0.180 145)", warning: "oklch(0.720 0.170 65)", error: "oklch(0.580 0.220 22)", info: "oklch(0.620 0.180 240)",
    },
    semantic: { bgBase: "var(--bg-base)", bgSurface: "var(--bg-surface)", textPrimary: "var(--text-primary)", textSecondary: "var(--text-secondary)", borderSubtle: "var(--border-subtle)", borderDefault: "var(--border-default)", accent: "var(--accent)", accentSubtle: "var(--accent-subtle)", accentText: "var(--accent-text)", success: "var(--success)", warning: "var(--warning)", error: "var(--error)", info: "var(--info)" },
    component: { buttonBgPrimary: "var(--button-bg-primary)", inputBg: "var(--input-bg)", cardBg: "var(--card-bg)", modalBg: "var(--modal-bg)", modalOverlay: "var(--modal-overlay)" },
  },
  typography: {
    font: { display: "var(--font-display)", body: "var(--font-body)", mono: "var(--font-mono)" },
    size: {
      xs:    { size: "12px", lineHeight: "1.6",  letterSpacing: "0.005em",  weight: 400 },
      sm:    { size: "14px", lineHeight: "1.55", letterSpacing: "0",        weight: 400 },
      base:  { size: "15px", lineHeight: "1.55", letterSpacing: "-0.005em", weight: 400 },
      lg:    { size: "18px", lineHeight: "1.45", letterSpacing: "-0.01em",  weight: 500 },
      xl:    { size: "22px", lineHeight: "1.3",  letterSpacing: "-0.02em",  weight: 600 },
      "2xl": { size: "30px", lineHeight: "1.2",  letterSpacing: "-0.03em",  weight: 600 },
      "3xl": { size: "40px", lineHeight: "1.1",  letterSpacing: "-0.04em",  weight: 700 },
      "4xl": { size: "56px", lineHeight: "1.0",  letterSpacing: "-0.05em",  weight: 700 },
    },
  },
  spacing: { 0: "0", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 6: "24px", 8: "32px", 12: "48px", 16: "64px", 24: "96px", 32: "128px" },
  radius:  { none: "0", sm: "4px", md: "6px", lg: "8px", xl: "12px", "2xl": "16px", full: "9999px" },
  border:  { thin: "1px", medium: "1.5px", thick: "2px" },
  shadow:  { xs: "var(--shadow-xs)", sm: "var(--shadow-sm)", md: "var(--shadow-md)", lg: "var(--shadow-lg)", xl: "var(--shadow-xl)", focus: "var(--shadow-focus)" },
  motion:  { duration: { instant: "0ms", fast: "100ms", normal: "150ms", slow: "250ms", deliberate: "400ms", spring: "350ms" }, easing: { out: "cubic-bezier(0, 0, 0.2, 1)", in: "cubic-bezier(0.4, 0, 1, 1)", inOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.34, 1.56, 0.64, 1)" } },
} as const;
export type Tokens = typeof tokens;
export default tokens;
