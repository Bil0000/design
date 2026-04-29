import * as React from "react";

/**
 * Nav — saas-dark
 * Variants: Sidebar (vertical, collapsible) · Topbar (horizontal, sticky)
 * NavItem:  default · active · hover · disabled · with-badge
 *
 * Distinctive detail: active indicator is a 2px-wide accent bar absolutely
 * positioned at the left edge, animated with translateX between items.
 *
 * Tokens consumed:
 *   --nav-bg · --nav-text · --nav-text-active · --nav-bg-active
 *   --accent · --space-2/3 · --radius-md · --duration-fast · --easing-out
 *   --border-subtle · --text-tertiary
 */

const cn = (...c) => c.filter(Boolean).join(" ");

export function NavSidebar({ items, collapsed = false, ariaLabel = "Primary", className }) {
  return (
    <nav
      aria-label={ariaLabel}
      data-collapsed={collapsed || undefined}
      className={cn(
        "flex flex-col h-full bg-[var(--nav-bg)] border-r border-[var(--border-subtle)]",
        "py-4 gap-2",
        collapsed ? "w-16" : "w-60",
        "transition-[width] duration-normal ease-out",
        className
      )}
    >
      {items.map((section, i) => (
        <div key={i} className="flex flex-col gap-1 px-3">
          {section.label && !collapsed ? (
            <div className="px-2 pb-1 pt-3 text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
              {section.label}
            </div>
          ) : null}
          <ul role="list" className="flex flex-col gap-0.5">
            {section.items.map((it) => (
              <li key={it.href}>
                <NavItem {...it} collapsed={collapsed} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function NavTopbar({ items, rightSlot, ariaLabel = "Primary", className }) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between gap-4 px-6 h-14",
        "bg-[var(--nav-bg)] border-b border-[var(--border-subtle)]",
        className
      )}
    >
      <ul role="list" className="flex items-center gap-1">
        {items.map((it) => (
          <li key={it.href}>
            <NavItem {...it} layout="horizontal" />
          </li>
        ))}
      </ul>
      {rightSlot ? <div className="flex items-center gap-2">{rightSlot}</div> : null}
    </nav>
  );
}

function NavItem({ label, href, icon, active, badge, disabled, collapsed, layout = "vertical" }) {
  return (
    <a
      href={disabled ? undefined : href}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "relative flex items-center gap-2 rounded-[var(--radius-md)]",
        "font-body text-sm",
        "transition-colors duration-fast ease-out",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]",
        layout === "vertical" ? "px-3 h-9" : "px-3 h-9",
        active
          ? "text-[var(--nav-text-active)] bg-[var(--nav-bg-active)]"
          : "text-[var(--nav-text)] hover:text-[var(--nav-text-active)] hover:bg-[var(--bg-surface)]",
        disabled && "opacity-50 pointer-events-none",
        collapsed && "justify-center px-0"
      )}
    >
      {/* Active indicator bar — only on vertical sidebar layout */}
      {active && layout === "vertical" ? (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-[var(--accent)] rounded-full"
        />
      ) : null}
      {icon ? <span aria-hidden="true" className="shrink-0">{icon}</span> : null}
      {!collapsed ? <span className="flex-1 truncate">{label}</span> : null}
      {!collapsed && badge !== undefined ? (
        <span
          className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-[var(--radius-sm)] px-1.5 font-mono text-xs bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
        >
          {badge}
        </span>
      ) : null}
    </a>
  );
}

export const Nav = { Sidebar: NavSidebar, Topbar: NavTopbar };
export default Nav;
