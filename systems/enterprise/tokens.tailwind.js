// enterprise v1.0.0 — design-engine
module.exports = {
  theme: {
    extend: {
      colors: {
        grey: { 0: "var(--color-grey-0)", 50: "var(--color-grey-50)", 100: "var(--color-grey-100)", 200: "var(--color-grey-200)", 300: "var(--color-grey-300)", 400: "var(--color-grey-400)", 500: "var(--color-grey-500)", 600: "var(--color-grey-600)", 700: "var(--color-grey-700)", 800: "var(--color-grey-800)", 900: "var(--color-grey-900)", 950: "var(--color-grey-950)" },
        bg: { base: "var(--bg-base)", surface: "var(--bg-surface)", elevated: "var(--bg-elevated)", overlay: "var(--bg-overlay)", inset: "var(--bg-inset)" },
        text: { primary: "var(--text-primary)", secondary: "var(--text-secondary)", tertiary: "var(--text-tertiary)", disabled: "var(--text-disabled)", inverse: "var(--text-inverse)", link: "var(--text-link)" },
        border: { subtle: "var(--border-subtle)", DEFAULT: "var(--border-default)", strong: "var(--border-strong)", focus: "var(--border-focus)" },
        accent: { DEFAULT: "var(--accent)", hover: "var(--accent-hover)", press: "var(--accent-press)", subtle: "var(--accent-subtle)", text: "var(--accent-text)" },
        success: { DEFAULT: "var(--success)", subtle: "var(--success-subtle)", text: "var(--success-text)" },
        warning: { DEFAULT: "var(--warning)", subtle: "var(--warning-subtle)", text: "var(--warning-text)" },
        error:   { DEFAULT: "var(--error)",   subtle: "var(--error-subtle)",   text: "var(--error-text)" },
        info:    { DEFAULT: "var(--info)",    subtle: "var(--info-subtle)",    text: "var(--info-text)" },
      },
      fontFamily: { display: "var(--font-display)", body: "var(--font-body)", sans: "var(--font-body)", serif: "var(--font-serif)", mono: "var(--font-mono)" },
      fontSize: {
        xs:    ["12px", { lineHeight: "1.6",  letterSpacing: "0.01em",   fontWeight: "400" }],
        sm:    ["14px", { lineHeight: "1.5",  letterSpacing: "0.005em",  fontWeight: "400" }],
        base:  ["14px", { lineHeight: "1.5",  letterSpacing: "0",        fontWeight: "400" }],
        lg:    ["16px", { lineHeight: "1.45", letterSpacing: "-0.005em", fontWeight: "500" }],
        xl:    ["20px", { lineHeight: "1.3",  letterSpacing: "-0.015em", fontWeight: "600" }],
        "2xl": ["28px", { lineHeight: "1.2",  letterSpacing: "-0.025em", fontWeight: "600" }],
        "3xl": ["36px", { lineHeight: "1.15", letterSpacing: "-0.03em",  fontWeight: "600" }],
        "4xl": ["48px", { lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "700" }],
      },
      spacing: { 0: "0", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "20px", 6: "24px", 8: "32px", 12: "48px", 16: "64px" },
      borderRadius: { none: "0", sm: "4px", md: "4px", lg: "6px", xl: "8px", "2xl": "12px", full: "9999px" },
      borderWidth: { DEFAULT: "1px", thin: "1px", medium: "2px", thick: "2px" },
      boxShadow: { xs: "var(--shadow-xs)", sm: "var(--shadow-sm)", md: "var(--shadow-md)", lg: "var(--shadow-lg)", xl: "var(--shadow-xl)", focus: "var(--shadow-focus)" },
      transitionDuration: { instant: "0ms", fast: "120ms", normal: "240ms", slow: "320ms", deliberate: "400ms", spring: "300ms" },
      transitionTimingFunction: { out: "cubic-bezier(0, 0, 0.2, 1)", in: "cubic-bezier(0.4, 0, 1, 1)", "in-out": "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.4, 0, 0.2, 1)" },
    },
  },
};
