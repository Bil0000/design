// mobile-ios v1.0.0 — design-engine
module.exports = {
  theme: {
    extend: {
      colors: {
        grey: { 0: "var(--color-grey-0)", 50: "var(--color-grey-50)", 100: "var(--color-grey-100)", 200: "var(--color-grey-200)", 300: "var(--color-grey-300)", 400: "var(--color-grey-400)", 500: "var(--color-grey-500)", 600: "var(--color-grey-600)", 700: "var(--color-grey-700)", 800: "var(--color-grey-800)", 900: "var(--color-grey-900)", 950: "var(--color-grey-950)" },
        bg: { base: "var(--bg-base)", surface: "var(--bg-surface)", elevated: "var(--bg-elevated)", overlay: "var(--bg-overlay)", grouped: "var(--bg-grouped)" },
        label: { primary: "var(--label-primary)", secondary: "var(--label-secondary)", tertiary: "var(--label-tertiary)", quaternary: "var(--label-quaternary)" },
        fill:  { primary: "var(--fill-primary)", secondary: "var(--fill-secondary)", tertiary: "var(--fill-tertiary)", quaternary: "var(--fill-quaternary)" },
        separator: { DEFAULT: "var(--separator)", opaque: "var(--separator-opaque)" },
        accent: { DEFAULT: "var(--accent)", text: "var(--accent-text)" },
        system: { blue: "var(--color-system-blue)", green: "var(--color-system-green)", orange: "var(--color-system-orange)", red: "var(--color-system-red)", yellow: "var(--color-system-yellow)", purple: "var(--color-system-purple)", pink: "var(--color-system-pink)", teal: "var(--color-system-teal)", indigo: "var(--color-system-indigo)" },
        success: { DEFAULT: "var(--success)" }, warning: { DEFAULT: "var(--warning)" },
        error:   { DEFAULT: "var(--error)" },   info:    { DEFAULT: "var(--info)" },
      },
      fontFamily: { display: "var(--font-display)", body: "var(--font-body)", sans: "var(--font-body)", rounded: "var(--font-rounded)", mono: "var(--font-mono)" },
      fontSize: {
        "caption-2": ["11px", { lineHeight: "1.27", letterSpacing: "0.005em",  fontWeight: "400" }],
        "caption-1": ["12px", { lineHeight: "1.33", letterSpacing: "0",        fontWeight: "400" }],
        footnote:    ["13px", { lineHeight: "1.38", letterSpacing: "-0.005em", fontWeight: "400" }],
        subhead:     ["15px", { lineHeight: "1.33", letterSpacing: "-0.01em",  fontWeight: "400" }],
        callout:     ["16px", { lineHeight: "1.31", letterSpacing: "-0.015em", fontWeight: "400" }],
        body:        ["17px", { lineHeight: "1.29", letterSpacing: "-0.022em", fontWeight: "400" }],
        headline:    ["17px", { lineHeight: "1.29", letterSpacing: "-0.022em", fontWeight: "600" }],
        "title-3":   ["20px", { lineHeight: "1.25", letterSpacing: "-0.022em", fontWeight: "400" }],
        "title-2":   ["22px", { lineHeight: "1.27", letterSpacing: "-0.026em", fontWeight: "400" }],
        "title-1":   ["28px", { lineHeight: "1.21", letterSpacing: "-0.022em", fontWeight: "400" }],
        "large-title":["34px",{ lineHeight: "1.21", letterSpacing: "-0.022em", fontWeight: "700" }],
      },
      spacing: { 0: "0", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "20px", 6: "24px", 8: "32px", 12: "48px", 16: "64px" },
      borderRadius: { none: "0", sm: "6px", md: "10px", lg: "14px", xl: "20px", "2xl": "28px", full: "9999px" },
      borderWidth: { DEFAULT: "1px", thin: "0.5px", medium: "1px", thick: "2px" },
      backdropBlur: { thin: "20px", regular: "40px", thick: "60px", "ultra-thin": "10px" },
      boxShadow: { xs: "var(--shadow-xs)", sm: "var(--shadow-sm)", md: "var(--shadow-md)", lg: "var(--shadow-lg)", xl: "var(--shadow-xl)", focus: "var(--shadow-focus)" },
      transitionDuration: { instant: "0ms", fast: "150ms", normal: "250ms", slow: "350ms", deliberate: "500ms", spring: "550ms" },
      transitionTimingFunction: { out: "cubic-bezier(0, 0, 0.2, 1)", in: "cubic-bezier(0.4, 0, 1, 1)", "in-out": "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.32, 0.72, 0, 1)" },
    },
  },
};
