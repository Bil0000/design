import * as React from "react";

/**
 * Toast — saas-dark
 * Variants: default · success · warning · error · info
 * Features: auto-dismiss · pause on hover · manual close · stacking ·
 *           live region announcement · slide-in animation
 *
 * Tokens consumed:
 *   --toast-bg · --border-subtle · --text-primary · --text-secondary
 *   --success / --warning / --error / --info
 *   --radius-lg · --space-3/4 · --duration-normal · --easing-out
 *   --shadow-md  (light mode only)
 */

const cn = (...c) => c.filter(Boolean).join(" ");

const ToastContext = React.createContext({ push: () => {}, dismiss: () => {} });

const POSITION = {
  "top-right":     "top-4 right-4 items-end",
  "top-center":    "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right":  "bottom-4 right-4 items-end",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

let id = 0;

export function ToastProvider({ position = "top-right", children }) {
  const [toasts, setToasts] = React.useState([]);
  const timers = React.useRef(new Map());

  const dismiss = React.useCallback((tid) => {
    setToasts((arr) => arr.filter((t) => t.id !== tid));
    const tm = timers.current.get(tid);
    if (tm) {
      clearTimeout(tm);
      timers.current.delete(tid);
    }
  }, []);

  const schedule = React.useCallback(
    (tid, duration) => {
      timers.current.set(tid, setTimeout(() => dismiss(tid), duration));
    },
    [dismiss]
  );

  const pause = (tid) => {
    const tm = timers.current.get(tid);
    if (tm) {
      clearTimeout(tm);
      timers.current.delete(tid);
    }
  };

  const resume = (tid, duration) => {
    if (!timers.current.has(tid)) schedule(tid, duration);
  };

  const push = React.useCallback(
    (toast) => {
      const tid = ++id;
      const next = { id: tid, duration: 5000, variant: "default", ...toast };
      setToasts((arr) => [...arr, next]);
      schedule(tid, next.duration);
      return tid;
    },
    [schedule]
  );

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className={cn(
          "fixed z-50 flex flex-col gap-2 pointer-events-none",
          POSITION[position]
        )}
      >
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onClose={() => dismiss(t.id)}
            onPause={() => pause(t.id)}
            onResume={() => resume(t.id, t.duration)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastContext);
}

const ICONS = {
  success: "M2 7 L6 11 L12 3",
  warning: "M7 2 L13 12 L1 12 Z",
  error:   "M2 2 L12 12 M12 2 L2 12",
  info:    "M7 6 L7 11 M7 3.5 L7 4",
};

const ICON_COLOR = {
  default: "var(--text-tertiary)",
  success: "var(--success)",
  warning: "var(--warning)",
  error:   "var(--error)",
  info:    "var(--info)",
};

function ToastItem({ toast, onClose, onPause, onResume }) {
  const role = toast.variant === "warning" || toast.variant === "error" ? "alert" : "status";
  const aria = role === "alert" ? "assertive" : "polite";

  return (
    <div
      role={role}
      aria-live={aria}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocus={onPause}
      onBlur={onResume}
      className={cn(
        "pointer-events-auto w-80 max-w-[calc(100vw-2rem)]",
        "bg-[var(--toast-bg)] border border-[var(--border-subtle)]",
        "rounded-[var(--radius-lg)] shadow-md dark:shadow-none",
        "p-4 flex items-start gap-3"
      )}
      style={{ animation: "dei-toast-in var(--duration-normal) var(--easing-out)" }}
    >
      {toast.variant !== "default" ? (
        <span aria-hidden="true" className="shrink-0 mt-0.5">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path
              d={ICONS[toast.variant]}
              fill="none"
              stroke={ICON_COLOR[toast.variant]}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
      <div className="flex-1 min-w-0">
        <div className="font-body text-sm font-medium text-[var(--text-primary)]">{toast.title}</div>
        {toast.description ? (
          <div className="font-body text-xs text-[var(--text-secondary)] mt-0.5">
            {toast.description}
          </div>
        ) : null}
        {toast.action ? (
          <button
            type="button"
            onClick={() => {
              toast.action.onClick();
              onClose();
            }}
            className="font-body text-xs font-medium mt-2 text-[var(--text-link)] hover:text-[var(--text-link-hover)] transition-colors duration-fast ease-out outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)] rounded-[var(--radius-sm)]"
          >
            {toast.action.label}
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="shrink-0 h-6 w-6 inline-flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors duration-fast ease-out outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2 2 L8 8 M8 2 L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <style>{`
        @keyframes dei-toast-in { from { transform: translate3d(8px,0,0); opacity: 0 } to { transform: translate3d(0,0,0); opacity: 1 } }
      `}</style>
    </div>
  );
}

export default ToastProvider;
