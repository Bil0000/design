import * as React from "react";

/**
 * Modal — saas-dark
 * Sizes:    sm · md · lg · xl · full
 * Features: overlay · close button · ESC close · focus trap · scroll lock ·
 *           focus restore on close · animated entry/exit
 *
 * Tokens consumed:
 *   --modal-bg · --modal-overlay · --modal-border
 *   --radius-xl · --space-4/6 · --duration-fast · --duration-normal · --easing-out
 *   --border-subtle · --text-primary · --text-secondary
 */

const cn = (...c) => c.filter(Boolean).join(" ");

const SIZE = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-2xl",
  xl:   "max-w-4xl",
  full: "max-w-[95vw] max-h-[95vh]",
};

export function Modal({
  open,
  onOpenChange,
  size = "md",
  closeOnOverlayClick = true,
  initialFocus,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  children,
}) {
  const dialogRef = React.useRef(null);
  const triggerRef = React.useRef(null);

  // Trap focus + ESC + scroll lock
  React.useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      dialogRef.current
        ? Array.from(
            dialogRef.current.querySelectorAll(
              'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
            )
          )
        : [];

    const initial = initialFocus?.current ?? focusables()[0] ?? dialogRef.current;
    initial?.focus();

    function onKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
        return;
      }
      if (e.key === "Tab") {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      triggerRef.current?.focus?.();
    };
  }, [open, onOpenChange, initialFocus]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      data-state="open"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        aria-hidden="true"
        onClick={closeOnOverlayClick ? () => onOpenChange(false) : undefined}
        className="absolute inset-0 bg-[var(--modal-overlay)]"
        style={{ animation: "dei-fade-in var(--duration-fast) var(--easing-out)" }}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "relative w-full bg-[var(--modal-bg)] border border-[var(--modal-border)]",
          "rounded-[var(--radius-xl)] shadow-lg dark:shadow-none",
          "outline-none focus:outline-none",
          SIZE[size]
        )}
        style={{ animation: "dei-modal-enter var(--duration-normal) var(--easing-out)" }}
      >
        {children}
      </div>
      <style>{`
        @keyframes dei-fade-in    { from { opacity: 0 } to { opacity: 1 } }
        @keyframes dei-modal-enter{ from { transform: translate3d(0,12px,0) scale(0.98); opacity: 0 } to { transform: translate3d(0,0,0) scale(1); opacity: 1 } }
      `}</style>
    </div>
  );
}

export function ModalHeader({ className, children, onClose, ...rest }) {
  return (
    <div className={cn("flex items-start justify-between gap-3 p-6 pb-4", className)} {...rest}>
      <div className="font-body text-lg font-semibold text-[var(--text-primary)]">{children}</div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="h-8 w-8 inline-flex items-center justify-center rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors duration-fast ease-out outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

export function ModalBody({ className, children, ...rest }) {
  return (
    <div className={cn("px-6 pb-6 font-body text-sm text-[var(--text-primary)]", className)} {...rest}>
      {children}
    </div>
  );
}

export function ModalFooter({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 px-6 py-4",
        "border-t border-[var(--border-subtle)]",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Modal;
