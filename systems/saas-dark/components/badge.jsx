import * as React from "react";

/**
 * Badge — saas-dark
 * Variants: default · success · warning · error · info
 * Sizes:    sm · md
 * Optional: dot prefix
 *
 * Tokens consumed:
 *   --badge-bg · --badge-text
 *   --success / --success-subtle / --success-text  (and warning/error/info)
 *   --radius-md · --space-1/2 · --text-xs
 *   --border-subtle
 */

const cn = (...c) => c.filter(Boolean).join(" ");

const VARIANT = {
  default: "bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--border-subtle)]",
  success: "bg-[var(--success-subtle)] text-[var(--success-text)]",
  warning: "bg-[var(--warning-subtle)] text-[var(--warning-text)]",
  error:   "bg-[var(--error-subtle)] text-[var(--error-text)]",
  info:    "bg-[var(--info-subtle)] text-[var(--info-text)]",
};

const DOT = {
  default: "bg-[var(--text-tertiary)]",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  error:   "bg-[var(--error)]",
  info:    "bg-[var(--info)]",
};

const SIZE = {
  sm: "h-5 px-2 text-xs gap-1",
  md: "h-6 px-2.5 text-xs gap-1.5",
};

export function Badge({ variant = "default", size = "sm", dot = false, className, children, ...rest }) {
  return (
    <span
      data-variant={variant}
      data-size={size}
      className={cn(
        "inline-flex items-center font-body font-medium whitespace-nowrap",
        "rounded-[var(--radius-md)]",
        VARIANT[variant],
        SIZE[size],
        className
      )}
      {...rest}
    >
      {dot ? (
        <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", DOT[variant])} />
      ) : null}
      {children}
    </span>
  );
}

export default Badge;
