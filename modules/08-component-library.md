# 08 — Component Library

Generates the full component set on top of the active design system
tokens (produced by module 07). Every component consumes CSS custom
properties — never hardcodes values.

Two binding rules govern this module. They appear up front because
violation is a hard defect.

> **Zero hardcoded values.** Every color, spacing, radius, shadow,
> font-size, line-height, tracking, duration, and easing must
> reference a CSS custom property from `tokens.css` (or a Tailwind
> class that resolves to one). Magic numbers in component source are
> a defect. The critique module flags them and blocks handoff.
>
> **One component per mode.** A component is NOT duplicated for dark.
> The same JSX + CSS works in both modes via the `.dark` class (or
> `[data-theme="dark"]`) on a parent. If a component needs different
> structure in dark, it's a system bug, not a component bug — fix the
> tokens.

---

## 1. Component List (Minimum Set)

Fourteen components ship by default. The numbers in parentheses are
the variant counts that must be implemented for that component.

```
 1. Button         (4 variants × 4 sizes × 6 states)
 2. Input          (3 types × 4 states + label + helper + error)
 3. Card           (3 variants × header/body/footer slots)
 4. Badge          (5 variants × 2 sizes)
 5. Nav            (sidebar + topbar variants × active state)
 6. Table          (sortable, hoverable, selectable, paginated)
 7. Modal          (overlay + close + focus trap + ESC)
 8. Toast          (4 variants × auto-dismiss + manual)
 9. Avatar         (image + fallback initials × 4 sizes)
10. Dropdown/Select (popover + keyboard nav + multi-select option)
11. Toggle/Switch  (controlled, on/off/disabled)
12. Checkbox       (checked, unchecked, indeterminate, disabled)
13. Radio          (single-select group, controlled)
14. Skeleton       (line, block, circle, with shimmer)
```

Total: 14 components. All MUST be generated for every system unless
the user explicitly opted out (e.g. `--components=button,input,card`
override).

Optional / extended set (generated only when the brief calls for them
or the matching pattern fired in module 05):
```
Tooltip · Popover · Menu · Tabs · Accordion · Breadcrumb ·
Pagination · Slider · Progress · Tag/Chip · Combobox · DatePicker ·
DataTable · CommandPalette · EmptyState · Spinner
```

When extended components are generated, they follow the same rules
as the core 14.

---

## 2. Universal Generation Rules

Apply to every component below.

### 2.1 Stack

Default output: React + TypeScript + Tailwind classes. The Tailwind
classes resolve to the design system's custom properties (set up by
`tokens.tailwind.js` from module 07). If the codebase uses CSS Modules
or styled-components, generate a parallel CSS-Modules version on
request — but the canonical reference output is React + Tailwind.

### 2.2 Token references — the only allowed values

For every CSS property, the source must be one of:
- A CSS variable: `var(--bg-surface)`, `var(--space-4)`, etc.
- A Tailwind class that maps to a token: `bg-surface`, `p-4`, `rounded-md`, `text-base`.
- A logical literal that has no token (e.g. `flex`, `relative`, `inline-block`).

Forbidden:
- Hex / rgb / hsl / oklch literals
- px / rem values that aren't `0` (use spacing tokens)
- Hardcoded shadow strings (use `shadow-sm`, `shadow-md`, etc.)
- Hardcoded transition values (`transition-colors`, `duration-fast`, `ease-out`)

### 2.3 States — every interactive component

Every interactive component implements all six states:

```
default     base resting state
hover       :hover (and synthesized via data-state="hover" for previews)
active      :active (pressed)
focus       :focus-visible only — never bare :focus
disabled    aria-disabled + visual + non-interactive
error       data-state="error" or aria-invalid + visual
```

Plus, when applicable: `loading` (with spinner or skeleton),
`indeterminate` (checkbox), `selected` / `checked`.

### 2.4 Accessibility

Every component MUST:
- Use the correct semantic element (`<button>` for buttons, NEVER `<div onClick>`).
- Use the correct ARIA role when the element doesn't carry it natively.
- Be keyboard operable — Tab to focus, Space/Enter to activate where
  applicable, Escape to dismiss overlays, arrow keys to navigate
  groups (radio, menu, tab, select).
- Trap focus inside modals and stay there until close.
- Restore focus to the trigger on close.
- Announce state changes via live regions where applicable (Toast,
  loading states).
- Have a visible `:focus-visible` ring using `var(--border-focus)` at
  2px width with 2px offset.

### 2.5 Dark mode

Components themselves do nothing for dark mode. They use semantic
tokens (e.g. `bg-surface`, `text-primary`) that flip values via
`tokens.css` `.dark` block. Verify by toggling the preview's theme
switch — every component must look correct in both modes with zero
extra code.

### 2.6 Variants API

Use `cva` (class-variance-authority) for variant management when
shadcn-compatible, or a hand-rolled `clsx` + `cn` utility otherwise.
Variants are typed via `VariantProps<typeof componentVariants>` so
consumers get autocomplete.

### 2.7 File pair per component

Each component produces TWO files:

```
.design-engine/system/components/<name>.jsx          implementation
.design-engine/system/components/<name>.notes.md     companion docs
```

The .jsx is `.tsx` when TypeScript is detected in the codebase. The
companion notes file is identical in either case.

---

## 3. Per-Component Specs

Each spec lists: variants, sizes, states, props (TypeScript interface),
required token references, a11y requirements, distinctive details.

### 3.1 Button

```
Variants:  primary | secondary | ghost | destructive
Sizes:     sm | md | lg | icon
States:    default · hover · active · focus · disabled · loading
```

#### Props

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;     // shadcn-style polymorphic composition
}
```

#### Token references

```
Background:
  primary      bg-accent
  primary:hover bg-accent-hover
  primary:active bg-accent-press
  secondary    bg-elevated  (border border-default)
  ghost        bg-transparent (hover: bg-surface)
  destructive  bg-error

Text:
  primary      text-[var(--accent-text)]
  secondary    text-primary
  ghost        text-primary
  destructive  text-[var(--error-text)]

Padding:
  sm          h-8  px-3       text-sm
  md          h-10 px-4       text-sm
  lg          h-12 px-6       text-base
  icon        h-10 w-10 p-0   text-base

Radius:       rounded-md (or system's chosen default)
Focus:        outline outline-2 outline-offset-2 outline-[var(--border-focus)]
Transition:   transition-colors duration-fast ease-out
```

#### A11y

- Always a `<button>` unless `asChild` (then it must polymorphically
  forward role + keyboard).
- `aria-busy={loading}` and replace label with spinner when loading.
- Disabled uses `disabled` attribute + `aria-disabled` for AT.
- Focus ring on `:focus-visible` only.

#### Distinctive detail

Press state animates the button down 1px (`active:translate-y-px`)
using transform only. Never animate box-shadow.

### 3.2 Input

```
Types:    text | email | password | number | search
States:   default · hover · focus · disabled · error · readonly
Slots:    label · helper · error message · leftIcon · rightIcon
```

#### Props

```ts
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}
```

#### Token references

```
Container:    bg-input  (resolves to bg-surface)
Border:       border border-default
Radius:       rounded-md
Padding:      px-3 py-2 (sm) · px-4 py-2.5 (md) · px-5 py-3 (lg)
Text:         text-primary  text-sm | base
Placeholder:  text-tertiary
Focus border: border-focus  (the accent at 60%)
Error border: border-error
Helper text:  text-secondary  text-xs
Error text:   text-[var(--error-text)]  text-xs
```

#### A11y

- Wrap label + input via `<label>` (or `htmlFor` + `id`).
- Helper text: `aria-describedby={helperId}`.
- Error: `aria-invalid="true"` + `aria-errormessage={errorId}`.
- Visible focus ring on `:focus-visible`.

#### Distinctive detail

Error state animates the border color in over 100ms — never shakes
or flashes the entire input. Restraint over drama.

### 3.3 Card

```
Variants:  default · interactive · bordered
Slots:     header · body · footer · media
```

#### Props

```ts
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "bordered";
  asLink?: boolean;        // semantic <a> wrapper
  href?: string;
}
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {}
```

#### Token references

```
Container:    bg-surface
Border:       border border-subtle (default)
              border border-default (bordered variant)
Radius:       rounded-lg
Padding:      header p-4 · body p-4 · footer p-4 (or rhythm-tuned)
Hover (interactive variant):  bg-elevated
Transition:   transition-colors duration-fast ease-out
Light shadow: shadow-sm (light mode default variant)
              none (bordered variant)
              none (dark mode — uses border elevation instead)
```

#### A11y

- Default variant: regular `<div>` (or `<article>` when semantically a
  standalone unit).
- Interactive variant: `<a>` if `href` is provided (visit), else
  `<button>` (action). Keyboard activation included automatically.
- Cards used as list items live inside `<ul>` / `<ol>`.

#### Distinctive detail

Interactive variant lifts 1px on hover via `transform: translateY(-1px)`.
Never animates shadow.

### 3.4 Badge

```
Variants:  default · success · warning · error · info
Sizes:     sm · md
```

#### Props

```ts
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  dot?: boolean;     // shows a status dot prefix
}
```

#### Token references

```
default      bg-elevated   text-primary    border border-subtle
success      bg-success-subtle    text-[var(--success-text)]
warning      bg-warning-subtle    text-[var(--warning-text)]
error        bg-error-subtle      text-[var(--error-text)]
info         bg-info-subtle       text-[var(--info-text)]

sm           h-5 px-2  text-xs
md           h-6 px-2.5 text-xs

Radius:      rounded (full when system uses pill chrome) | rounded-md
```

#### A11y

- Decorative badges: `<span>`. Status badges that convey meaning
  beyond the text: include `aria-label` describing the state.

### 3.5 Nav

Two variants in one file: `Sidebar` and `Topbar`. Both consume the same
`NavItem` building block.

```
Sidebar:  vertical · fixed-left · collapsible · grouped
Topbar:   horizontal · sticky-top · with right action area
NavItem:  default · active · hover · disabled · with badge
```

#### Props

```ts
interface NavSidebarProps {
  items: NavSection[];
  collapsed?: boolean;
  onCollapseChange?: (next: boolean) => void;
}
interface NavTopbarProps {
  items: NavItem[];
  rightSlot?: React.ReactNode;
}
interface NavSection {
  label?: string;
  items: NavItem[];
}
interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  badge?: string | number;
}
```

#### Token references

```
Sidebar bg:        bg-base
Sidebar border:    border-r border-subtle
Item default:      text-secondary  hover:text-primary  hover:bg-surface
Item active:       text-primary    bg-elevated
Item gap:          gap-2 px-3 py-2 rounded-md
Section label:     text-tertiary text-xs uppercase tracking-wider
Topbar bg:         bg-base/80  backdrop-blur (only when system supports it)
Topbar border:     border-b border-subtle
```

#### A11y

- `<nav>` element with `aria-label`.
- Active item: `aria-current="page"`.
- Sidebar groups: `<ul>` with `role="list"`.
- Collapsible toggle: real `<button>` with `aria-expanded`.

#### Distinctive detail

Active indicator is a 2px-wide accent bar absolutely positioned at the
left edge of the active item — animated horizontally between items
via `transform: translateX(...)`, never re-rendering. (Pattern from
Linear / Resend.)

### 3.6 Table

Sortable, hoverable, selectable rows, paginated, with keyboard nav.

```
Features:  sortable headers · row hover · row selection ·
           sticky header · pagination · empty state · loading
```

#### Props

```ts
interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  empty?: React.ReactNode;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  onSelectionChange?: (rows: T[]) => void;
  pageSize?: number;
}
interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}
```

#### Token references

```
Container border: rounded-lg overflow-hidden border border-subtle
Header bg:        bg-surface
Header text:      text-secondary text-xs uppercase tracking-wider
Row bg:           bg-base
Row hover:        bg-surface
Row selected:     bg-accent-subtle
Cell border:      border-b border-subtle
Cell padding:     px-4 py-3
Pagination:       text-sm  text-secondary  with Button (ghost, sm)
```

#### A11y

- Real `<table>` semantics (`<thead>`, `<tbody>`, `<th>`).
- Sortable headers: `<button>` inside `<th>` with `aria-sort`.
- Row selection: `<input type="checkbox">` with proper `aria-label`.
- Keyboard: arrow keys move between rows; Enter activates `onRowClick`.

#### Distinctive detail

Sticky header that remains visible during scroll. Subtle 1px border
under the header that fades in only when content is scrolled (driven
by IntersectionObserver). The detail communicates state without
shouting.

### 3.7 Modal

```
Features:  backdrop · close button · ESC · focus trap · scroll lock ·
           focus restore · animated entry/exit
Sizes:     sm · md · lg · xl · full
```

#### Props

```ts
interface ModalProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
}
interface ModalHeader {} interface ModalBody {} interface ModalFooter {}
```

#### Token references

```
Overlay:       fixed inset-0 bg-[oklch(0_0_0/0.6)]
               backdrop-blur-[2px] (when system supports)
Container:     bg-elevated rounded-xl border border-subtle
Padding:       p-6 (header/body/footer slots)
Width sm/md/lg: max-w-sm | max-w-md | max-w-2xl | max-w-4xl | full
Animation:     fade overlay (opacity duration-fast)
               slide-up + scale-in body (transform duration-normal ease-out)
Close button:  Button variant="ghost" size="icon"
```

#### A11y

- `role="dialog"` + `aria-modal="true"`.
- `aria-labelledby` references the header id.
- `aria-describedby` references the body id when descriptive.
- Focus trap from open until close. Focus restored to the original
  trigger on close.
- ESC closes (overridable via prop).
- Inert background: `inert` attribute on the rest of the document
  while open.
- Reduced-motion: skip the slide-up; only fade.

#### Distinctive detail

Backdrop blur during open uses `backdrop-filter: blur(8px) saturate(120%)`
when the system supports it. Disabled in `--no-backdrop-blur` systems.

### 3.8 Toast

```
Variants:  success · warning · error · info
Features:  auto-dismiss · pause on hover · manual close · stack ·
           live region announcement
```

#### Props

```ts
interface Toast {
  id: string;
  variant?: "success" | "warning" | "error" | "info" | "default";
  title: string;
  description?: string;
  duration?: number;     // ms, default 5000
  action?: { label: string; onClick: () => void };
}
interface ToastProviderProps {
  position?: "top-right" | "top-center" | "bottom-right" | "bottom-center";
}
```

#### Token references

```
Container:      bg-elevated  border border-subtle  rounded-lg
                shadow-md (light mode)  /  none (dark mode)
Padding:        p-4
Icon column:    text-success | warning | error | info  (left of title)
Title:          text-primary  text-sm  font-medium
Description:    text-secondary  text-xs
Close:          Button variant="ghost" size="icon"
Animation:      slide-in-from-right (or top, per position) duration-normal ease-out
                slide-out 80% of duration-normal
```

#### A11y

- `role="status"` + `aria-live="polite"` for default/success/info.
- `role="alert"` + `aria-live="assertive"` for warning/error.
- Provider mounts a portal at the document root.

#### Distinctive detail

Hover anywhere over a toast pauses its auto-dismiss timer. Works at
the provider level so multiple stacked toasts share the pause behavior.

### 3.9 Avatar

```
Sizes:     xs (24) · sm (32) · md (40) · lg (56) · xl (80)
Fallback:  initials when image fails or absent
States:    online · offline · away  (status dot)
```

#### Props

```ts
interface AvatarProps {
  src?: string;
  alt: string;
  initials?: string;       // explicit override; otherwise derived from alt
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away";
}
```

#### Token references

```
Container:    rounded-full bg-elevated  text-primary
Border:       (none by default, ring-2 ring-bg-base when overlapping in groups)
Initials:     text-sm | base | lg per size
Status dot:   absolute bottom/right · ring-2 ring-bg-base ·
              bg-success | text-secondary | bg-warning per status
Sizes:        h-6 w-6 / h-8 w-8 / h-10 w-10 / h-14 w-14 / h-20 w-20
```

#### A11y

- Always include `alt`. If purely decorative, use `aria-hidden="true"`
  with `alt=""`.
- Avatars-as-links: wrap with `<a>` and a descriptive `aria-label`.

### 3.10 Dropdown / Select

```
Features:  popover · keyboard nav · search/filter · multi-select ·
           grouped options · async loading
```

Built on Radix `<Select>` or headless implementation. Same token usage
either way.

#### Props

```ts
interface SelectProps<T> {
  value?: T;
  onValueChange?: (next: T) => void;
  placeholder?: string;
  options: Array<{ label: string; value: T; group?: string; disabled?: boolean }>;
  searchable?: boolean;
  multiple?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}
```

#### Token references

```
Trigger:        Input-like (bg-input border border-default rounded-md)
Trigger active: border-focus
Popover:        bg-elevated  border border-subtle  rounded-lg
                shadow-md (light) | none (dark) — uses bg lift instead
Option:         px-3 py-2  text-primary
Option hover:   bg-surface
Option selected: bg-accent-subtle  text-[var(--accent-text)]
Group label:    text-tertiary text-xs uppercase tracking-wider px-3 pt-2
Animation:      fade + scale-in (duration-fast ease-out)
```

#### A11y

- `role="combobox"` (when searchable) or `role="listbox"`.
- `aria-expanded`, `aria-controls`, `aria-activedescendant`.
- Keyboard: ↑/↓ moves through options, Enter selects, Esc closes,
  type-ahead matches.

### 3.11 Toggle / Switch

```
States:  off · on · disabled · loading
```

#### Props

```ts
interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (next: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  label?: string;        // visible label
}
```

#### Token references

```
Track off:      bg-elevated  border border-default
Track on:       bg-accent
Thumb:          bg-bg-base (dark) | bg-bg-surface (light)
                rounded-full
Sizes (md):     track h-6 w-10 · thumb h-5 w-5
Sizes (sm):     track h-5 w-9  · thumb h-4 w-4
Animation:      thumb translate-x via transform duration-fast ease-out
```

#### A11y

- Real `<button role="switch">` with `aria-checked`.
- Space/Enter toggles.
- Visible label associated via `aria-labelledby` or wrapping `<label>`.

### 3.12 Checkbox

```
States:  unchecked · checked · indeterminate · disabled · error
```

#### Props

```ts
interface CheckboxProps {
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean;
  onCheckedChange?: (next: boolean | "indeterminate") => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  size?: "sm" | "md";
}
```

#### Token references

```
Box:            h-4 w-4  rounded  border border-default  bg-input
Box checked:    bg-accent  border-accent
Indeterminate:  same bg as checked, render a hyphen icon instead of check
Check icon:     stroke-[var(--accent-text)]
Error:          border-error
Label:          text-primary text-sm  ml-2
Description:    text-secondary text-xs ml-6
```

#### A11y

- Real `<input type="checkbox">` (visually hidden) + custom box. Or
  `role="checkbox"` if pure-div implementation.
- Indeterminate state: set `inputRef.current.indeterminate = true`
  for native; `aria-checked="mixed"` for ARIA.

### 3.13 Radio (Group)

```
Features:  single-select group · keyboard arrow navigation
```

#### Props

```ts
interface RadioGroupProps {
  value?: string;
  onValueChange?: (next: string) => void;
  options: Array<{ value: string; label: string; description?: string; disabled?: boolean }>;
  orientation?: "vertical" | "horizontal";
  size?: "sm" | "md";
}
```

#### Token references

```
Circle:           h-4 w-4 rounded-full border border-default bg-input
Circle checked:   border-accent  with inner dot bg-accent
Inner dot:        h-2 w-2 rounded-full bg-accent
Label / desc:     same as Checkbox
```

#### A11y

- `role="radiogroup"` on the wrapper with `aria-label`.
- Each option is a real `<input type="radio">` (visually hidden) +
  custom circle, inside `<label>`.
- Arrow keys move selection, Tab moves between groups.

### 3.14 Skeleton

```
Variants:  line · block · circle · with shimmer
```

#### Props

```ts
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "block" | "circle";
  width?: number | string;
  height?: number | string;
  shimmer?: boolean;
}
```

#### Token references

```
Bg:            bg-elevated  (with subtle gradient when shimmer is on)
Radius:        rounded (line) · rounded-md (block) · rounded-full (circle)
Shimmer:       background-image linear-gradient using bg-elevated and
               bg-overlay; animate background-position 1.2s infinite ease-in-out.
```

#### A11y

- `role="status"` + `aria-busy="true"` + `aria-label="Loading"` on
  the parent region containing the skeleton.
- Respect prefers-reduced-motion: shimmer becomes a static lighter
  bg.

#### Distinctive detail

Shimmer uses two-stop gradient with the lighter stop at 25% width
moving from -50% to 150%, NOT a fade pulse. The rhythm is felt without
being noticed.

---

## 4. Companion `notes.md` Format

For every component, generate a sibling `<name>.notes.md` with this
exact structure.

```markdown
# {Component name}
*{system.name} · {system.version} · generated {ISO timestamp}*

## Purpose
{One paragraph. Why this component exists, when to reach for it,
when not to.}

## Variants
| Variant | Use case |
|---|---|
| {variant} | {one-line use case} |
...

## Sizes
| Size | Height | Use case |
|---|---|---|
| sm | 32px | Tight chrome, table actions |
| md | 40px | Default — most surfaces |
| lg | 48px | Hero CTAs, primary actions |

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| variant | "primary" \| ... | "primary" | ... |
...

## States
| State | Trigger | Visual |
|---|---|---|
| default | resting | base |
| hover | :hover | bg-accent-hover |
| active | :active | bg-accent-press + translateY(1px) |
| focus | :focus-visible | 2px outline at border-focus + 2px offset |
| disabled | aria-disabled | 50% opacity, no pointer |
| loading | loading prop | spinner replaces label, aria-busy |

## Accessibility
- {bullet}
- {bullet}
- {keyboard table if applicable}

## Tokens used
- bg-accent · accent-hover · accent-press
- text-[var(--accent-text)]
- focus-ring at border-focus
- duration-fast · ease-out
{Full list — every token this component reads.}

## Usage
### Example 1 — primary CTA
\`\`\`tsx
<Button variant="primary" size="lg">Get started</Button>
\`\`\`

### Example 2 — secondary action with icon
\`\`\`tsx
<Button variant="secondary" leftIcon={<ChevronLeftIcon />}>Back</Button>
\`\`\`

### Example 3 — destructive with loading
\`\`\`tsx
<Button variant="destructive" loading>Delete forever</Button>
\`\`\`

## Copy-paste snippet
\`\`\`tsx
import { Button } from "@/components/design/button";

<Button variant="primary" size="md" onClick={handle}>
  Continue
</Button>
\`\`\`

## Anti-patterns
- ❌ Using `<div onClick>` instead of `<button>`.
- ❌ Animating `box-shadow` on hover.
- ❌ Hardcoding hex values in className overrides.
- ❌ Removing the focus ring without an alternative.

## Distinctive detail
{The one screenshottable moment in this component.
For Button: 1px translateY on active.}
```

Generation rules:
- Every column is real data (no `...` left in tables).
- Every example is a working JSX snippet, not pseudocode.
- Anti-patterns are specific (cite exact rule violations from SKILL.md §6).
- Token list is exhaustive — if a class uses 6 tokens, list all 6.

---

## 5. File Output Structure

```
.design-engine/system/components/
├── button.tsx              (or .jsx if no TypeScript)
├── button.notes.md
├── input.tsx
├── input.notes.md
├── card.tsx
├── card.notes.md
├── badge.tsx
├── badge.notes.md
├── nav.tsx
├── nav.notes.md
├── table.tsx
├── table.notes.md
├── modal.tsx
├── modal.notes.md
├── toast.tsx
├── toast.notes.md
├── avatar.tsx
├── avatar.notes.md
├── select.tsx
├── select.notes.md
├── switch.tsx
├── switch.notes.md
├── checkbox.tsx
├── checkbox.notes.md
├── radio.tsx
├── radio.notes.md
├── skeleton.tsx
├── skeleton.notes.md
└── _shared/
    ├── cn.ts               (className merge util)
    ├── icons.tsx           (only the icons used by core components)
    └── focus-ring.css      (the universal focus ring class)
```

Each component file imports from `_shared/cn.ts` and (optionally)
`_shared/icons.tsx`. No other internal imports — components stay
copy-pasteable individually.

---

## 6. Verification — Self-Audit Before Handoff

Before this module returns, run a self-audit pass over every generated
file:

```
1. grep for hex literals (`#[0-9a-f]{3,8}`) → must return zero hits.
2. grep for rgb(/rgba(/hsl(/oklch( in JSX/TSX → must return zero hits
   (oklch is allowed only in tokens.css).
3. grep for px values that aren't 0, 1px (focus offset), or 9999px →
   must return zero hits.
4. grep for box-shadow string literals in JSX/TSX → zero hits.
5. grep for `:focus` (bare) without `-visible` → zero hits.
6. grep for `<div` followed by `onClick` → zero hits (use button).
7. Confirm every component file has a sibling .notes.md.
8. Confirm every .notes.md has all required sections from §4.
```

Failures of any check are a hard defect. Module 15 (critique) re-runs
these checks and blocks handoff if any fail.

---

## 7. Status Output

While generating, print a single updating status line:

```
Components · button · input · card · badge · nav · table · modal · toast (8/14) ...
```

After completion:

```
Components ready: .design-engine/system/components/
  Generated:   14 components
  Variants:    Button(4) · Input(5) · Card(3) · Badge(5) · Nav(2) · Table · Modal(5) · Toast(4) · Avatar(5) · Select · Switch · Checkbox · Radio · Skeleton(3)
  Files:       28 (.tsx + .notes.md per component) + _shared/
  Audit:       0 hardcoded values · 0 a11y violations · 0 shadow-in-dark
```

---

## 8. Output

This module emits:
- 14 component files + 14 notes files in
  `.design-engine/system/components/`.
- `_shared/cn.ts`, `_shared/icons.tsx`, `_shared/focus-ring.css`.
- An audit summary written to
  `.design-engine/system/components/audit.json` consumed by module 15.

Hand off to:
- module 09 (canvas) or 10 (prototype) — components are now available
  for screen composition.
- module 15 (critique) for `/design system` flows ending here.

End of component library generation.
