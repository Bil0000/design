import * as React from "react";

/**
 * Card — saas-dark
 * Variants: default · interactive · bordered
 * Slots:    Header · Body · Footer · Media
 *
 * Tokens consumed:
 *   --card-bg · --card-border · --card-bg-hover
 *   --radius-lg · --space-4 · --duration-fast · --easing-out
 *   --shadow-sm  (light mode only — dark mode uses border elevation)
 */

const cn = (...c) => c.filter(Boolean).join(" ");

const VARIANT = {
  default:
    "bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm dark:shadow-none",
  bordered:
    "bg-[var(--card-bg)] border border-[var(--border-default)]",
  interactive:
    "bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm dark:shadow-none " +
    "cursor-pointer hover:bg-[var(--card-bg-hover)] hover:-translate-y-px " +
    "transition-[transform,background-color] duration-fast ease-out " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
};

export function Card({
  variant = "default",
  asLink = false,
  href,
  className,
  children,
  ...rest
}) {
  const baseClass = cn(
    "rounded-[var(--radius-lg)] overflow-hidden",
    VARIANT[variant],
    className
  );

  if (asLink && href) {
    return (
      <a href={href} className={baseClass} {...rest}>
        {children}
      </a>
    );
  }

  if (variant === "interactive") {
    return (
      <button type="button" className={cn(baseClass, "text-left w-full")} {...rest}>
        {children}
      </button>
    );
  }

  return (
    <div className={baseClass} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        "p-4 flex items-start justify-between gap-3",
        "border-b border-[var(--card-border)]",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...rest }) {
  return (
    <div className={cn("p-4 font-body text-sm text-[var(--text-primary)]", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        "p-4 flex items-center justify-end gap-2",
        "border-t border-[var(--card-border)]",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardMedia({ className, children, ...rest }) {
  return (
    <div className={cn("w-full overflow-hidden bg-[var(--bg-elevated)]", className)} {...rest}>
      {children}
    </div>
  );
}

export default Card;
