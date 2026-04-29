// stripe v1.0.0 — design-engine

export const tokens = {
  name: "stripe",
  version: "1.0.0",
  modes: ["light", "dark"] as const,
  defaultMode: "light" as const,

  color: {
    primitive: {
      grey: {
        0: "oklch(1.000 0.000 0)", 50: "oklch(0.985 0.005 80)", 100: "oklch(0.965 0.007 80)",
        200: "oklch(0.920 0.010 80)", 300: "oklch(0.840 0.012 80)", 400: "oklch(0.700 0.012 80)",
        500: "oklch(0.560 0.012 80)", 600: "oklch(0.430 0.010 80)", 700: "oklch(0.330 0.010 80)",
        800: "oklch(0.230 0.008 80)", 900: "oklch(0.160 0.006 80)", 950: "oklch(0.110 0.005 80)",
      },
      accent: {
        50: "oklch(0.970 0.030 280)", 100: "oklch(0.940 0.060 280)", 200: "oklch(0.880 0.110 280)",
        300: "oklch(0.800 0.150 280)", 400: "oklch(0.700 0.190 280)", 500: "oklch(0.620 0.215 280)",
        600: "oklch(0.555 0.215 280)", 700: "oklch(0.470 0.190 280)", 800: "oklch(0.380 0.160 280)",
        900: "oklch(0.300 0.130 280)", 950: "oklch(0.220 0.100 280)",
      },
      success: "oklch(0.580 0.150 145)", warning: "oklch(0.720 0.165 65)",
      error:   "oklch(0.580 0.220 22)",  info:    "oklch(0.620 0.180 240)",
      gradient: {
        purple: "oklch(0.660 0.220 290)",
        coral:  "oklch(0.720 0.180 25)",
        cyan:   "oklch(0.760 0.140 220)",
      },
      chart: {
        1: "oklch(0.555 0.215 280)", 2: "oklch(0.700 0.170 65)",  3: "oklch(0.580 0.150 145)",
        4: "oklch(0.700 0.150 95)",  5: "oklch(0.640 0.180 320)", 6: "oklch(0.700 0.180 30)",
        7: "oklch(0.620 0.140 200)", 8: "oklch(0.500 0.012 80)",
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
    font: {
      display:      "var(--font-display)",
      displaySerif: "var(--font-display-serif)",
      body:         "var(--font-body)",
      mono:         "var(--font-mono)",
    },
    size: {
      xs:    { size: "12px", lineHeight: "1.6",  letterSpacing: "0.005em",  weight: 400 },
      sm:    { size: "14px", lineHeight: "1.55", letterSpacing: "0",        weight: 400 },
      base:  { size: "16px", lineHeight: "1.6",  letterSpacing: "-0.005em", weight: 400 },
      lg:    { size: "18px", lineHeight: "1.5",  letterSpacing: "-0.01em",  weight: 500 },
      xl:    { size: "22px", lineHeight: "1.35", letterSpacing: "-0.02em",  weight: 600 },
      "2xl": { size: "30px", lineHeight: "1.2",  letterSpacing: "-0.03em",  weight: 600 },
      "3xl": { size: "42px", lineHeight: "1.1",  letterSpacing: "-0.04em",  weight: 700 },
      "4xl": { size: "60px", lineHeight: "1.0",  letterSpacing: "-0.05em",  weight: 700 },
      "5xl": { size: "84px", lineHeight: "0.95", letterSpacing: "-0.055em", weight: 700 },
    },
  },

  spacing: { 0: "0", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 6: "24px", 8: "32px", 12: "48px", 16: "64px", 24: "96px", 32: "128px" },
  radius:  { none: "0", sm: "4px", md: "6px", lg: "8px", xl: "12px", "2xl": "20px", full: "9999px" },
  border:  { thin: "1px", medium: "1.5px", thick: "2px" },
  shadow:  { xs: "var(--shadow-xs)", sm: "var(--shadow-sm)", md: "var(--shadow-md)", lg: "var(--shadow-lg)", xl: "var(--shadow-xl)", focus: "var(--shadow-focus)" },

  motion: {
    duration: { instant: "0ms", fast: "100ms", normal: "150ms", slow: "250ms", deliberate: "400ms", spring: "350ms" },
    easing:   { out: "cubic-bezier(0, 0, 0.2, 1)", in: "cubic-bezier(0.4, 0, 1, 1)", inOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  },

  // Marketing-only ambient gradient (do NOT use in product chrome)
  gradient: { hero: "var(--gradient-hero)" },
} as const;

export type Tokens = typeof tokens;
export default tokens;
