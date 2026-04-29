import * as React from "react";

/**
 * Input — saas-dark
 * Types:    text · email · password · number · search
 * Sizes:    sm · md · lg
 * Slots:    label · helper · error · leftIcon · rightIcon
 * States:   default · hover · focus · disabled · readonly · error
 *
 * Tokens consumed:
 *   --input-bg · --input-text · --input-placeholder · --input-border
 *   --input-border-focus · --input-border-error
 *   --radius-md · --space-2/3/4 · --text-sm · --text-xs
 *   --duration-fast · --easing-out · --text-secondary · --error-text
 */

const cn = (...c) => c.filter(Boolean).join(" ");

const SIZE = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-3.5 text-sm",
  lg: "h-12 px-4 text-base",
};

let uid = 0;
const useId = () => React.useMemo(() => `dei-${++uid}`, []);

export const Input = React.forwardRef(function Input(
  {
    label,
    helper,
    error,
    leftIcon,
    rightIcon,
    size = "md",
    type = "text",
    id: idProp,
    className,
    disabled,
    ...rest
  },
  ref
) {
  const id = idProp || useId();
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label ? (
        <label
          htmlFor={id}
          className="font-body text-sm text-[var(--text-primary)]"
        >
          {label}
        </label>
      ) : null}

      <div className="relative">
        {leftIcon ? (
          <span
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none"
          >
            {leftIcon}
          </span>
        ) : null}

        <input
          ref={ref}
          id={id}
          type={type}
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={cn(helperId, errorId) || undefined}
          aria-errormessage={errorId}
          className={cn(
            "w-full font-body bg-[var(--input-bg)] text-[var(--input-text)]",
            "placeholder:text-[var(--input-placeholder)]",
            "border border-[var(--input-border)]",
            "rounded-[var(--radius-md)]",
            "transition-colors duration-fast ease-out",
            "outline-none focus:border-[var(--input-border-focus)]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-[var(--input-border-error)]",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            SIZE[size],
            className
          )}
          {...rest}
        />

        {rightIcon ? (
          <span
            aria-hidden="true"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none"
          >
            {rightIcon}
          </span>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} className="font-body text-xs text-[var(--error-text)]">
          {error}
        </p>
      ) : helper ? (
        <p id={helperId} className="font-body text-xs text-[var(--text-secondary)]">
          {helper}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
