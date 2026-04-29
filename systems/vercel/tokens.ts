// vercel v1.0.0 — design-engine

export const tokens = {
  name: "vercel",
  version: "1.0.0",
  modes: ["light", "dark"] as const,
  defaultMode: "light" as const,

  color: {
    primitive: {
      grey: {
        0: "oklch(1.000 0.000 0)", 50: "oklch(0.980 0.000 0)", 100: "oklch(0.945 0.000 0)",
        200: "oklch(0.890 0.000 0)", 300: "oklch(0.800 0.000 0)", 400: "oklch(0.640 0.000 0)",
        500: "oklch(0.500 0.000 0)", 600: "oklch(0.380 0.000 0)", 700: "oklch(0.270 0.000 0)",
        800: "oklch(0.180 0.000 0)", 900: "oklch(0.110 0.000 0)", 950: "oklch(0.040 0.000 0)",
        1000: "oklch(0.000 0.000 0)",
      },
      accent: {
        50: "oklch(0.970 0.030 230)", 100: "oklch(0.930 0.060 230)", 200: "oklch(0.870 0.110 230)",
        300: "oklch(0.800 0.140 230)", 400: "oklch(0.700 0.160 230)", 500: "oklch(0.600 0.180 230)",
        600: "oklch(0.520 0.180 230)", 700: "oklch(0.440 0.165 230)", 800: "oklch(0.360 0.140 230)",
        900: "oklch(0.280 0.110 230)", 950: "oklch(0.200 0.080 230)",
      },
      success: "oklch(0.640 0.180 145)", warning: "oklch(0.760 0.165 65)",
      error:   "oklch(0.620 0.220 22)",  info:    "oklch(0.640 0.180 230)",
      chart: {
        1: "oklch(0.600 0.180 230)", 2: "oklch(0.700 0.170 65)",  3: "oklch(0.620 0.150 145)",
        4: "oklch(0.700 0.150 95)",  5: "oklch(0.600 0.180 320)", 6: "oklch(0.700 0.180 30)",
        7: "oklch(0.640 0.140 200)", 8: "oklch(0.500 0.000 0)",
      },
    },
    semantic: {
      bgBase: "var(--bg-base)", bgSurface: "var(--bg-surface)", bgElevated: "var(--bg-elevated)",
      bgOverlay: "var(--bg-overlay)", bgInset: "var(--bg-inset)",
      textPrimary: "var(--text-primary)", textSecondary: "var(--text-secondary)",
      textTertiary: "var(--text-tertiary)", textDisabled: "var(--text-disabled)",
      textInverse: "var(--text-inverse)", textLink: "var(--text-link)",
      borderSubtle: "var(--border-subtle)", borderDefault: "var(--border-default)",
      borderStrong: "var(--border-strong)", borderFocus: "var(--border-focus)",
      accent: "var(--accent)", accentHover: "var(--accent-hover)", accentPress: "var(--accent-press)",
      accentSubtle: "var(--accent-subtle)", accentText: "var(--accent-text)",
      success: "var(--success)", successSubtle: "var(--success-subtle)", successText: "var(--success-text)",
      warning: "var(--warning)", warningSubtle: "var(--warning-subtle)", warningText: "var(--warning-text)",
      error: "var(--error)", errorSubtle: "var(--error-subtle)", errorText: "var(--error-text)",
      info: "var(--info)", infoSubtle: "var(--info-subtle)", infoText: "var(--info-text)",
    },
    component: {
      buttonBgPrimary: "var(--button-bg-primary)", buttonBgPrimaryHover: "var(--button-bg-primary-hover)",
      buttonBgPrimaryPress: "var(--button-bg-primary-press)", buttonTextPrimary: "var(--button-text-primary)",
      buttonBgSecondary: "var(--button-bg-secondary)", buttonTextSecondary: "var(--button-text-secondary)",
      buttonBorderSecondary: "var(--button-border-secondary)",
      buttonBgGhost: "var(--button-bg-ghost)", buttonBgGhostHover: "var(--button-bg-ghost-hover)",
      buttonTextGhost: "var(--button-text-ghost)",
      buttonBgDestructive: "var(--button-bg-destructive)", buttonTextDestructive: "var(--button-text-destructive)",
      inputBg: "var(--input-bg)", inputText: "var(--input-text)", inputPlaceholder: "var(--input-placeholder)",
      inputBorder: "var(--input-border)", inputBorderFocus: "var(--input-border-focus)", inputBorderError: "var(--input-border-error)",
      cardBg: "var(--card-bg)", cardBorder: "var(--card-border)", cardBgHover: "var(--card-bg-hover)",
      navBg: "var(--nav-bg)", navText: "var(--nav-text)", navTextActive: "var(--nav-text-active)", navBgActive: "var(--nav-bg-active)",
      tableRowBg: "var(--table-row-bg)", tableRowBgHover: "var(--table-row-bg-hover)",
      tableHeaderBg: "var(--table-header-bg)", tableCellBorder: "var(--table-cell-border)",
      badgeBg: "var(--badge-bg)", badgeText: "var(--badge-text)",
      modalBg: "var(--modal-bg)", modalOverlay: "var(--modal-overlay)", modalBorder: "var(--modal-border)",
      toastBg: "var(--toast-bg)",
    },
  },

  typography: {
    font: { display: "var(--font-display)", body: "var(--font-body)", mono: "var(--font-mono)" },
    size: {
      xs:    { size: "12px", lineHeight: "1.6",  letterSpacing: "0",        weight: 400 },
      sm:    { size: "14px", lineHeight: "1.55", letterSpacing: "0",        weight: 400 },
      base:  { size: "16px", lineHeight: "1.6",  letterSpacing: "-0.005em", weight: 400 },
      lg:    { size: "20px", lineHeight: "1.4",  letterSpacing: "-0.02em",  weight: 500 },
      xl:    { size: "24px", lineHeight: "1.25", letterSpacing: "-0.025em", weight: 600 },
      "2xl": { size: "32px", lineHeight: "1.15", letterSpacing: "-0.035em", weight: 600 },
      "3xl": { size: "44px", lineHeight: "1.05", letterSpacing: "-0.045em", weight: 700 },
      "4xl": { size: "60px", lineHeight: "1.0",  letterSpacing: "-0.055em", weight: 700 },
      "5xl": { size: "80px", lineHeight: "0.95", letterSpacing: "-0.06em",  weight: 700 },
    },
  },

  spacing: { 0: "0", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 6: "24px", 8: "32px", 12: "48px", 16: "64px", 24: "96px", 32: "128px" },
  // ZERO RADIUS across the system — Vercel commitment
  radius:  { none: "0", sm: "0", md: "0", lg: "0", xl: "0", "2xl": "0", full: "9999px" },
  border:  { thin: "1px", medium: "1.5px", thick: "2px" },
  // No shadows — borders carry elevation
  shadow:  { xs: "none", sm: "none", md: "none", lg: "none", xl: "none", focus: "var(--shadow-focus)" },

  motion: {
    duration: { instant: "0ms", fast: "100ms", normal: "150ms", slow: "200ms", deliberate: "300ms", spring: "300ms" },
    easing:   { out: "cubic-bezier(0, 0, 0.2, 1)", in: "cubic-bezier(0.4, 0, 1, 1)", inOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  },
} as const;

export type Tokens = typeof tokens;
export default tokens;
