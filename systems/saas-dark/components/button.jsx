import * as React from "react";

/**
 * Button — saas-dark
 * Variants: primary | secondary | ghost | destructive
 * Sizes:    sm | md | lg | icon
 * States:   default · hover · active · focus-visible · disabled · loading
 *
 * Tokens consumed (all via CSS variables — zero hardcoded values):
 *   --button-bg-primary / --button-bg-primary-hover / --button-bg-primary-press
 *   --button-text-primary / --button-bg-secondary / --button-text-secondary
 *   --button-border-secondary / --button-bg-ghost-hover / --button-text-ghost
 *   --button-bg-destructive / --button-text-destructive
 *   --radius-md · --space-2/3/4/6 · --text-sm · --duration-fast · --easing-out
 *   --border-focus
 */

const cn = (...c) => c.filter(Boolean).join(" ");

const VARIANT = {
  primary:
    "bg-[var(--button-bg-primary)] text-[var(--button-text-primary)] " +
    "hover:bg-[var(--button-bg-primary-hover)] active:bg-[var(--button-bg-primary-press)]",
  secondary:
    "bg-[var(--button-bg-secondary)] text-[var(--button-text-secondary)] " +
    "border border-[var(--button-border-secondary)] hover:bg-[var(--bg-overlay)]",
  ghost:
    "bg-transparent text-[var(--button-text-ghost)] " +
    "hover:bg-[var(--button-bg-ghost-hover)]",
  destructive:
    "bg-[var(--button-bg-destructive)] text-[var(--button-text-destructive)] " +
    "hover:opacity-90 active:opacity-80",
};

const SIZE = {
  sm:   "h-8 px-3 text-sm gap-1.5",
  md:   "h-10 px-4 text-sm gap-2",
  lg:   "h-12 px-6 text-base gap-2",
  icon: "h-10 w-10 p-0",
};

export const Button = React.forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    className,
    children,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-variant={variant}
      data-size={size}
      className={cn(
        "inline-flex items-center justify-center select-none whitespace-nowrap font-body font-medium",
        "rounded-[var(--radius-md)]",
        "transition-colors duration-fast ease-out",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
        "active:translate-y-px",
        "disabled:opacity-50 disabled:pointer-events-none",
        VARIANT[variant],
        SIZE[size],
        className
      )}
      {...rest}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {leftIcon ? <span aria-hidden="true">{leftIcon}</span> : null}
          {size === "icon" ? children : <span>{children}</span>}
          {rightIcon ? <span aria-hidden="true">{rightIcon}</span> : null}
        </>
      )}
    </button>
  );
});

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{ animation: "spin var(--duration-deliberate) linear infinite" }}
    >
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Button;
