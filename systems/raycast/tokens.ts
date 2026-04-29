// raycast v1.0.0 — design-engine

export const tokens = {
  name: "raycast",
  version: "1.0.0",
  modes: ["light", "dark"] as const,
  defaultMode: "dark" as const,

  color: {
    primitive: {
      grey: { 0: "oklch(1 0 0)", 50: "oklch(0.980 0.003 260)", 100: "oklch(0.950 0.005 260)", 200: "oklch(0.900 0.008 260)", 300: "oklch(0.795 0.011 260)", 400: "oklch(0.640 0.014 260)", 500: "oklch(0.490 0.014 260)", 600: "oklch(0.370 0.013 260)", 700: "oklch(0.270 0.011 260)", 800: "oklch(0.180 0.009 260)", 900: "oklch(0.130 0.007 260)", 950: "oklch(0.090 0.005 260)" },
      accent: { 50: "oklch(0.970 0.030 25)", 100: "oklch(0.940 0.060 25)", 200: "oklch(0.890 0.110 25)", 300: "oklch(0.830 0.150 25)", 400: "oklch(0.770 0.190 25)", 500: "oklch(0.700 0.220 25)", 600: "oklch(0.620 0.215 25)", 700: "oklch(0.520 0.190 25)", 800: "oklch(0.420 0.160 25)", 900: "oklch(0.330 0.130 25)", 950: "oklch(0.240 0.100 25)" },
      success: "oklch(0.700 0.155 145)", warning: "oklch(0.770 0.165 65)", error: "oklch(0.620 0.220 22)", info: "oklch(0.680 0.170 240)",
      chart: { 1: "oklch(0.700 0.220 25)", 2: "oklch(0.700 0.170 65)", 3: "oklch(0.620 0.150 145)", 4: "oklch(0.700 0.150 95)", 5: "oklch(0.640 0.180 280)", 6: "oklch(0.640 0.180 200)", 7: "oklch(0.640 0.140 320)", 8: "oklch(0.500 0.014 260)" },
    },
    semantic: {
      bgBase: "var(--bg-base)", bgSurface: "var(--bg-surface)", bgElevated: "var(--bg-elevated)", bgOverlay: "var(--bg-overlay)", bgInset: "var(--bg-inset)",
      textPrimary: "var(--text-primary)", textSecondary: "var(--text-secondary)", textTertiary: "var(--text-tertiary)", textDisabled: "var(--text-disabled)", textInverse: "var(--text-inverse)", textLink: "var(--text-link)",
      borderSubtle: "var(--border-subtle)", borderDefault: "var(--border-default)", borderStrong: "var(--border-strong)", borderFocus: "var(--border-focus)",
      accent: "var(--accent)", accentHover: "var(--accent-hover)", accentPress: "var(--accent-press)", accentSubtle: "var(--accent-subtle)", accentText: "var(--accent-text)",
      success: "var(--success)", successSubtle: "var(--success-subtle)", successText: "var(--success-text)",
      warning: "var(--warning)", warningSubtle: "var(--warning-subtle)", warningText: "var(--warning-text)",
      error: "var(--error)", errorSubtle: "var(--error-subtle)", errorText: "var(--error-text)",
      info: "var(--info)", infoSubtle: "var(--info-subtle)", infoText: "var(--info-text)",
    },
    component: {
      buttonBgPrimary: "var(--button-bg-primary)", buttonBgPrimaryHover: "var(--button-bg-primary-hover)", buttonBgPrimaryPress: "var(--button-bg-primary-press)", buttonTextPrimary: "var(--button-text-primary)",
      buttonBgSecondary: "var(--button-bg-secondary)", buttonTextSecondary: "var(--button-text-secondary)", buttonBorderSecondary: "var(--button-border-secondary)",
      buttonBgGhost: "var(--button-bg-ghost)", buttonBgGhostHover: "var(--button-bg-ghost-hover)", buttonTextGhost: "var(--button-text-ghost)",
      buttonBgDestructive: "var(--button-bg-destructive)", buttonTextDestructive: "var(--button-text-destructive)",
      inputBg: "var(--input-bg)", inputText: "var(--input-text)", inputPlaceholder: "var(--input-placeholder)", inputBorder: "var(--input-border)", inputBorderFocus: "var(--input-border-focus)", inputBorderError: "var(--input-border-error)",
      cardBg: "var(--card-bg)", cardBorder: "var(--card-border)", cardBgHover: "var(--card-bg-hover)",
      navBg: "var(--nav-bg)", navText: "var(--nav-text)", navTextActive: "var(--nav-text-active)", navBgActive: "var(--nav-bg-active)",
      tableRowBg: "var(--table-row-bg)", tableRowBgHover: "var(--table-row-bg-hover)", tableHeaderBg: "var(--table-header-bg)", tableCellBorder: "var(--table-cell-border)",
      badgeBg: "var(--badge-bg)", badgeText: "var(--badge-text)",
      modalBg: "var(--modal-bg)", modalOverlay: "var(--modal-overlay)", modalBorder: "var(--modal-border)",
      toastBg: "var(--toast-bg)",
    },
  },
  typography: {
    font: { display: "var(--font-display)", body: "var(--font-body)", mono: "var(--font-mono)" },
    size: {
      xs:       { size: "11px", lineHeight: "1.55", letterSpacing: "0.01em",   weight: 400 },
      smDense:  { size: "13px", lineHeight: "1.5",  letterSpacing: "0",        weight: 400 },
      sm:       { size: "14px", lineHeight: "1.5",  letterSpacing: "0",        weight: 400 },
      base:     { size: "15px", lineHeight: "1.55", letterSpacing: "-0.005em", weight: 400 },
      lg:       { size: "18px", lineHeight: "1.4",  letterSpacing: "-0.015em", weight: 500 },
      xl:       { size: "22px", lineHeight: "1.3",  letterSpacing: "-0.02em",  weight: 600 },
      "2xl":    { size: "28px", lineHeight: "1.2",  letterSpacing: "-0.03em",  weight: 600 },
      "3xl":    { size: "36px", lineHeight: "1.1",  letterSpacing: "-0.04em",  weight: 700 },
      "4xl":    { size: "48px", lineHeight: "1.0",  letterSpacing: "-0.05em",  weight: 700 },
    },
  },
  spacing: { 0: "0", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 6: "24px", 8: "32px", 12: "48px", 16: "64px", 24: "96px", 32: "128px" },
  radius:  { none: "0", sm: "4px", md: "6px", lg: "8px", xl: "12px", "2xl": "16px", full: "9999px" },
  border:  { thin: "1px", medium: "1.5px", thick: "2px" },
  blur:    { frost: "var(--blur-frost)" },
  shadow:  { xs: "var(--shadow-xs)", sm: "var(--shadow-sm)", md: "var(--shadow-md)", lg: "var(--shadow-lg)", xl: "var(--shadow-xl)", focus: "var(--shadow-focus)" },
  motion:  {
    duration: { instant: "0ms", fast: "100ms", normal: "120ms", slow: "200ms", deliberate: "350ms", spring: "300ms" },
    easing:   { out: "cubic-bezier(0, 0, 0.2, 1)", in: "cubic-bezier(0.4, 0, 1, 1)", inOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  },
} as const;
export type Tokens = typeof tokens;
export default tokens;
