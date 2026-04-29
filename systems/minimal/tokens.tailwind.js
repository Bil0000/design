// minimal v1.0.0 — design-engine
module.exports = {
  theme: {
    extend: {
      colors: {
        grey: { 0: "var(--color-grey-0)", 50: "var(--color-grey-50)", 100: "var(--color-grey-100)", 200: "var(--color-grey-200)", 300: "var(--color-grey-300)", 400: "var(--color-grey-400)", 500: "var(--color-grey-500)", 600: "var(--color-grey-600)", 700: "var(--color-grey-700)", 800: "var(--color-grey-800)", 900: "var(--color-grey-900)", 950: "var(--color-grey-950)" },
        bg: { base: "var(--bg-base)", surface: "var(--bg-surface)", overlay: "var(--bg-overlay)" },
        text: { primary: "var(--text-primary)", secondary: "var(--text-secondary)", tertiary: "var(--text-tertiary)", disabled: "var(--text-disabled)", inverse: "var(--text-inverse)", link: "var(--text-link)" },
        border: { subtle: "var(--border-subtle)", DEFAULT: "var(--border-default)", strong: "var(--border-strong)", focus: "var(--border-focus)" },
        accent: { DEFAULT: "var(--accent)", hover: "var(--accent-hover)", subtle: "var(--accent-subtle)", text: "var(--accent-text)" },
        success: { DEFAULT: "var(--success)", subtle: "var(--success-subtle)", text: "var(--success-text)" },
        warning: { DEFAULT: "var(--warning)", subtle: "var(--warning-subtle)", text: "var(--warning-text)" },
        error:   { DEFAULT: "var(--error)",   subtle: "var(--error-subtle)",   text: "var(--error-text)" },
        info:    { DEFAULT: "var(--info)",    subtle: "var(--info-subtle)",    text: "var(--info-text)" },
      },
      fontFamily: { display: "var(--font-display)", body: "var(--font-body)", sans: "var(--font-body)", mono: "var(--font-mono)" },
      fontSize: {
        xs:    ["13px", { lineHeight: "1.55", letterSpacing: "0.01em",   fontWeight: "400" }],
        sm:    ["15px", { lineHeight: "1.55", letterSpacing: "0",        fontWeight: "400" }],
        base:  ["17px", { lineHeight: "1.65", letterSpacing: "-0.005em", fontWeight: "400" }],
        lg:    ["22px", { lineHeight: "1.4",  letterSpacing: "-0.015em", fontWeight: "400" }],
        xl:    ["29px", { lineHeight: "1.25", letterSpacing: "-0.025em", fontWeight: "500" }],
        "2xl": ["39px", { lineHeight: "1.1",  letterSpacing: "-0.035em", fontWeight: "500" }],
        "3xl": ["52px", { lineHeight: "1.0",  letterSpacing: "-0.045em", fontWeight: "600" }],
        "4xl": ["69px", { lineHeight: "0.95", letterSpacing: "-0.05em",  fontWeight: "600" }],
        "5xl": ["92px", { lineHeight: "0.9",  letterSpacing: "-0.06em",  fontWeight: "600" }],
      },
      spacing: { 0: "0", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 6: "24px", 8: "32px", 12: "48px", 16: "64px", 24: "96px", 32: "128px", 48: "192px", 64: "256px" },
      borderRadius: { none: "0", sm: "0", md: "2px", lg: "2px", xl: "2px", "2xl": "2px", full: "9999px" },
      borderWidth: { DEFAULT: "1px", thin: "1px", medium: "1px", thick: "1.5px" },
      boxShadow: { xs: "none", sm: "none", md: "none", lg: "none", xl: "none", focus: "var(--shadow-focus)" },
      transitionDuration: { instant: "0ms", fast: "150ms", normal: "200ms", slow: "300ms", deliberate: "500ms", spring: "400ms" },
      transitionTimingFunction: { out: "cubic-bezier(0, 0, 0.2, 1)", in: "cubic-bezier(0.4, 0, 1, 1)", "in-out": "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
    },
  },
};
