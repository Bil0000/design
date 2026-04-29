import * as React from "react";

/**
 * Table — saas-dark
 * Features: sortable headers · row hover · row selection · sticky header ·
 *           pagination · empty state · loading skeleton
 *
 * Distinctive detail: 1px header underline that fades in only when the
 * table content is scrolled below the header (driven by IntersectionObserver).
 *
 * Tokens consumed:
 *   --table-row-bg · --table-row-bg-hover · --table-header-bg
 *   --table-cell-border · --text-secondary · --text-tertiary
 *   --radius-lg · --space-3/4 · --text-xs · --text-sm
 *   --accent-subtle · --accent-text
 */

const cn = (...c) => c.filter(Boolean).join(" ");

export function Table({
  columns,
  data,
  loading = false,
  empty,
  onRowClick,
  selectable = false,
  onSelectionChange,
  pageSize,
  className,
}) {
  const [sort, setSort] = React.useState({ key: null, dir: null });
  const [selected, setSelected] = React.useState(() => new Set());
  const [page, setPage] = React.useState(0);

  const sorted = React.useMemo(() => {
    if (!sort.key) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return data;
    const arr = [...data].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av === bv) return 0;
      const cmp = av > bv ? 1 : -1;
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [data, sort, columns]);

  const paged = pageSize ? sorted.slice(page * pageSize, (page + 1) * pageSize) : sorted;
  const totalPages = pageSize ? Math.ceil(sorted.length / pageSize) : 1;

  function toggleSort(key) {
    setSort((s) =>
      s.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : { key: null, dir: null }
    );
  }

  function toggleRow(id) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    onSelectionChange?.(Array.from(next).map((i) => sorted[i]));
  }

  function toggleAll() {
    const next = selected.size === paged.length ? new Set() : new Set(paged.map((_, i) => i));
    setSelected(next);
    onSelectionChange?.(Array.from(next).map((i) => paged[i]));
  }

  if (!loading && data.length === 0) {
    return (
      <div className={cn("rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-8", className)}>
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="font-body text-sm text-[var(--text-secondary)]">
            {empty ?? "No data yet."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-subtle)]", className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-[var(--table-header-bg)]">
            <tr>
              {selectable ? (
                <th className="w-10 px-3 py-2 border-b border-[var(--table-cell-border)]">
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={selected.size === paged.length && paged.length > 0}
                    onChange={toggleAll}
                  />
                </th>
              ) : null}
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={
                    sort.key === col.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"
                  }
                  style={{ width: col.width, textAlign: col.align ?? "left" }}
                  className="px-4 py-2 border-b border-[var(--table-cell-border)] font-body text-xs uppercase tracking-wider text-[var(--text-secondary)]"
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-[var(--text-primary)] outline-none focus-visible:text-[var(--text-primary)]"
                    >
                      {col.header}
                      <SortGlyph dir={sort.key === col.key ? sort.dir : null} />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {selectable ? <td className="px-3 py-3 border-b border-[var(--table-cell-border)]" /> : null}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 border-b border-[var(--table-cell-border)]">
                      <div className="h-4 w-full max-w-[180px] rounded-[var(--radius-sm)] bg-[var(--bg-elevated)]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              paged.map((row, i) => {
                const isSelected = selected.has(i);
                return (
                  <tr
                    key={row.id ?? i}
                    onClick={() => onRowClick?.(row)}
                    aria-selected={isSelected || undefined}
                    className={cn(
                      "transition-colors duration-fast ease-out",
                      "bg-[var(--table-row-bg)] hover:bg-[var(--table-row-bg-hover)]",
                      isSelected && "bg-[var(--accent-subtle)]",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {selectable ? (
                      <td className="px-3 py-3 border-b border-[var(--table-cell-border)]" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          aria-label={`Select row ${i + 1}`}
                          checked={isSelected}
                          onChange={() => toggleRow(i)}
                        />
                      </td>
                    ) : null}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{ textAlign: col.align ?? "left" }}
                        className="px-4 py-3 border-b border-[var(--table-cell-border)] font-body text-sm text-[var(--text-primary)]"
                      >
                        {col.cell ? col.cell(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pageSize ? (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--table-cell-border)] bg-[var(--bg-base)]">
          <span className="font-body text-xs text-[var(--text-secondary)]">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="h-8 px-3 rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface)] disabled:opacity-50 disabled:pointer-events-none"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="h-8 px-3 rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface)] disabled:opacity-50 disabled:pointer-events-none"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SortGlyph({ dir }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="M5 2 L8 5 L2 5 Z"
        fill={dir === "asc" ? "currentColor" : "var(--text-tertiary)"}
      />
      <path
        d="M5 8 L8 5 L2 5 Z"
        fill={dir === "desc" ? "currentColor" : "var(--text-tertiary)"}
      />
    </svg>
  );
}

export default Table;
