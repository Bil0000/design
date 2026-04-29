// mobile-material v1.0.0 — design-engine
export const tokens = {
  name: "mobile-material", version: "1.0.0",
  modes: ["light", "dark"] as const, defaultMode: "light" as const,
  color: {
    primitive: {
      neutral: { 0: "oklch(1 0 0)", 10: "oklch(0.110 0.005 250)", 99: "oklch(0.985 0.003 250)", 100: "oklch(1 0 0)" },
      primary:   { 40: "oklch(0.420 0.140 280)", 80: "oklch(0.810 0.110 280)", 90: "oklch(0.890 0.080 280)" },
      secondary: { 40: "oklch(0.420 0.070 220)", 80: "oklch(0.810 0.060 220)" },
      tertiary:  { 40: "oklch(0.420 0.090 30)", 80: "oklch(0.810 0.080 30)" },
      error:     { 40: "oklch(0.420 0.200 22)", 80: "oklch(0.810 0.150 22)" },
    },
    semantic: {
      primary: "var(--primary)", onPrimary: "var(--on-primary)",
      primaryContainer: "var(--primary-container)", onPrimaryContainer: "var(--on-primary-container)",
      secondary: "var(--secondary)", onSecondary: "var(--on-secondary)",
      secondaryContainer: "var(--secondary-container)",
      tertiary: "var(--tertiary)", error: "var(--error)",
      background: "var(--background)", onBackground: "var(--on-background)",
      surface: "var(--surface)", surfaceVariant: "var(--surface-variant)",
      onSurface: "var(--on-surface)", onSurfaceVariant: "var(--on-surface-variant)",
      outline: "var(--outline)", outlineVariant: "var(--outline-variant)",
    },
    component: { fabBg: "var(--fab-bg)", fabText: "var(--fab-text)", appbarBg: "var(--appbar-bg)", navbarBg: "var(--navbar-bg)", cardBg: "var(--card-bg)", inputBg: "var(--input-bg)", modalBg: "var(--modal-bg)", modalOverlay: "var(--modal-overlay)" },
  },
  typography: {
    font: { display: "var(--font-display)", body: "var(--font-body)", mono: "var(--font-mono)" },
    size: {
      displayLarge:   { size: "57px", lineHeight: "1.12", letterSpacing: "-0.005em",  weight: 400 },
      displayMedium:  { size: "45px", lineHeight: "1.16", letterSpacing: "0",          weight: 400 },
      displaySmall:   { size: "36px", lineHeight: "1.22", letterSpacing: "0",          weight: 400 },
      headlineLarge:  { size: "32px", lineHeight: "1.25", letterSpacing: "0",          weight: 400 },
      headlineMedium: { size: "28px", lineHeight: "1.29", letterSpacing: "0",          weight: 400 },
      headlineSmall:  { size: "24px", lineHeight: "1.33", letterSpacing: "0",          weight: 400 },
      titleLarge:     { size: "22px", lineHeight: "1.27", letterSpacing: "0",          weight: 400 },
      titleMedium:    { size: "16px", lineHeight: "1.5",  letterSpacing: "0.009em",    weight: 500 },
      titleSmall:     { size: "14px", lineHeight: "1.43", letterSpacing: "0.007em",    weight: 500 },
      bodyLarge:      { size: "16px", lineHeight: "1.5",  letterSpacing: "0.031em",    weight: 400 },
      bodyMedium:     { size: "14px", lineHeight: "1.43", letterSpacing: "0.018em",    weight: 400 },
      bodySmall:      { size: "12px", lineHeight: "1.33", letterSpacing: "0.033em",    weight: 400 },
      labelLarge:     { size: "14px", lineHeight: "1.43", letterSpacing: "0.007em",    weight: 500 },
      labelMedium:    { size: "12px", lineHeight: "1.33", letterSpacing: "0.041em",    weight: 500 },
      labelSmall:     { size: "11px", lineHeight: "1.45", letterSpacing: "0.045em",    weight: 500 },
    },
  },
  spacing: { 0: "0", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "20px", 6: "24px", 8: "32px", 10: "40px", 12: "48px", 16: "64px" },
  radius:  { none: "0", xs: "4px", sm: "8px", md: "12px", lg: "16px", xl: "28px", full: "9999px" },
  border:  { thin: "1px", medium: "1.5px", thick: "2px" },
  touch:   { min: "48px" },
  elevation: { 0: "var(--elevation-0)", 1: "var(--elevation-1)", 2: "var(--elevation-2)", 3: "var(--elevation-3)", 4: "var(--elevation-4)", 5: "var(--elevation-5)" },
  motion: {
    duration: { instant: "0ms", fast: "100ms", normal: "200ms", slow: "300ms", deliberate: "500ms", spring: "550ms" },
    easing:   { out: "cubic-bezier(0, 0, 0, 1)", in: "cubic-bezier(0.3, 0, 1, 1)", inOut: "cubic-bezier(0.2, 0, 0, 1)", emphasized: "cubic-bezier(0.2, 0, 0, 1)", spring: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  },
} as const;
export type Tokens = typeof tokens;
export default tokens;
