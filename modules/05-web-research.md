# 05 — Web Research

Runs by default before generation. Five search modes — each fires
based on what the brief contains. Output is a structured Research Brief
fed to modules 06 (system-selection), 07 (system-gen), 09 (canvas),
10 (prototype).

Two binding rules apply to every mode:

> **Always web_fetch the actual page** after finding it in search
> results. Snippets lie. Titles lie. Read the source.
>
> **Prefer primary sources** — official design system docs, GitHub
> repos with token files, brand guideline pages, the company's own
> docs. Blogs and tweets only when they cite primary sources.

---

## 1. Activation

Run by default whenever any generative pipeline is active and the
brief lacks zero ambiguity. Skip when:

- `--no-research` flag set
- The brief is fully concrete: explicit reference + explicit ambition +
  explicit aesthetic words + screenshots provided
- `/design review` command (critique only, no research)
- `/design import` and Figma already pulled (system is the source)

Each mode below has its own trigger predicate. Multiple modes can run
in the same invocation. Run all triggered modes in parallel.

---

## 2. Common Search Discipline

Every search obeys:

1. **Length:** 2–6 words. Specific. Year-bounded when applicable
   (append `2025` for currency).
2. **Uniqueness:** Never repeat the exact same query in one session.
3. **Result handling:** Pick at most 3 promising results per query.
   Web_fetch each chosen URL. Skim. Discard irrelevant.
4. **Source ranking** (highest first):
   ```
   1. Official design system page (e.g. linear.app/design, atlassian.design)
   2. Company GitHub repos (token files, component source)
   3. Documented brand guidelines (brand pages, /press kit)
   4. Mobbin / Page Collective / Refero (UI screenshot archives)
   5. Dribbble / Behance projects with primary-source links
   6. Articles citing primary sources (CSS-Tricks, Smashing if recent)
   7. Blog posts without citations              ← last resort
   8. Reddit / Twitter / HN threads             ← anecdote only
   ```
5. **Recency:** Bias toward 2024–2025. SaaS conventions shifted
   meaningfully in the last 18 months. Anything older than 2022 is
   reference-only, not best-practice.
6. **Stop early:** When two independent sources agree, stop searching
   that question. Diminishing returns.

---

## 3. Mode 1 — Competitor Intelligence

### 3.1 Trigger

The brief mentions a product category but no specific reference, OR
the brief asks for "a dashboard / SaaS / app for X" without naming
existing products in the space.

### 3.2 Query templates

```
"<category> dashboard UI design 2025"
"<category> app UI 2025"
"best <category> SaaS interface"
"top <category> tools design comparison"
"<category> dashboard examples"
```

Example for category = analytics:
```
analytics dashboard UI design 2025
best analytics SaaS interface
top analytics tools design comparison
analytics dashboard examples
```

### 3.3 Fetch + extract

For each promising hit, web_fetch the page. Extract:

```
- Named competitors that appear repeatedly across hits
- Common layout convention (sidebar nav, top tabs, drawer, etc.)
- Common dashboard primitives (KPI tiles, time-range selector, charts)
- What's becoming uncommon (signals to avoid copying)
- Differentiation opportunities — what every competitor does
  identically (the convention) vs where there is variation (the
  decision space)
```

### 3.4 Output slot

```yaml
competitors:
  category:                 <string>
  named:                    [<product>, <product>, ...]
  shared_patterns:          [<one-liner>, ...]
  decision_space:           [<one-liner>, ...]
  obsolete_patterns:        [<one-liner>, ...]
```

For each `named` entry, queue a Mode 5 (Brand Deep Dive) lookup.

---

## 4. Mode 2 — Inspiration / Reference Targeting

### 4.1 Trigger

Brief contains a specific reference: "Linear-like", "feel like Stripe",
"between Vercel and Resend", `references[].name` populated.

### 4.2 Query templates

For each named reference R:
```
<R> design system
<R> UI screenshots
<R> design language
<R> brand guidelines
<R> design system documentation
<R> typography
<R> color palette
<R> design philosophy
```

### 4.3 Fetch sequence

Try in order, stop after the first 2 succeed:
```
1. <R>.com/design                    (linear.app/design, vercel.com/design)
2. <R>.com/brand                     (stripe.com/brand)
3. <R>.com/design-system
4. github.com/<R>                    (search for design-tokens, ui repos)
5. <R>.com/handbook
6. mobbin.com/apps/<R>               (UI screenshot archive)
7. Top 3 search results from query templates (only if above 404 or absent)
```

### 4.4 Extract

```
- Specific decisions, not vague vibes:
    body font name + fallback
    body font-size px
    accent color hex/oklch
    radius scale (or single value)
    motion duration (the company's "house tempo")
    spacing base unit
    shadow vs border-elevation strategy
    icon system (line/fill, weight)
- Documented design principles (the words they use)
- Anti-patterns the company explicitly rejects
- Distinctive interaction patterns (the screenshottable moments)
```

### 4.5 Output slot

```yaml
references_research:
  - name:                   <string>
    primary_source:         <url> | null
    body_font:              <string> | null
    body_size_px:           <int> | null
    accent_color:           <string> | null
    radius:                 <string> | null
    motion_ms:              <string> | null
    spacing_base:           <int> | null
    elevation_strategy:     "shadow" | "border" | "mixed" | null
    documented_principles:  [<one-liner>, ...]
    distinctive_details:    [<one-liner>, ...]
    sources_used:           [<url>, ...]
```

This is the highest-signal mode. Module 07 reads `references_research`
verbatim when grounding decisions.

---

## 5. Mode 3 — Design Trend Awareness

### 5.1 Trigger

Always run unless `--no-research` or `/design review`. Cheap, fast,
prevents shipping stale aesthetics.

### 5.2 Query templates

Pick the matching set based on the surface (web vs mobile) and
output_kind (system / screen / landing).

```
Web app / SaaS dashboard:
  SaaS dashboard UI patterns 2025
  modern SaaS interface trends 2025
  product UI design 2025
  what makes a SaaS app feel premium 2025

Landing page:
  modern SaaS landing page 2025
  best landing page design trends 2025
  hero section design patterns 2025

Mobile:
  iOS app UI trends 2025
  Android Material You patterns 2025
  mobile app design 2025

System:
  design tokens architecture 2025
  oklch color system design 2025
  CSS variables design system 2025
  primitive semantic component tokens
```

### 5.3 Extract

```
- Conventions becoming standard in 2024–2025
- Conventions becoming dated (purple gradients, glassmorphism unmotivated)
- New primitives entering the vocabulary (e.g. command palette as default)
- Motion conventions (durations, easing curves)
- Color trends (warm neutrals, oklch adoption, OLED-aware dark)
- Typography trends (variable fonts, optical sizing, negative tracking)
```

### 5.4 Output slot

```yaml
trends:
  surface:                  web | mobile | landing | system
  emerging:                 [<one-liner>, ...]
  declining:                [<one-liner>, ...]
  current_baseline:         [<one-liner>, ...]
  sources:                  [<url>, ...]
```

Module 07 reads `declining` to add to the anti-pattern list for THIS
generation. Generic anti-slop rules (SKILL.md §6) still apply; trends
augment them.

---

## 6. Mode 4 — Component Pattern Research

### 6.1 Trigger

The brief mentions a specific complex component or pattern that
benefits from precedent: tables, calendars, command palettes, kanban
boards, file trees, drag-and-drop, multi-step forms.

### 6.2 Query templates

```
best data table UI 2025
data table interaction patterns SaaS
calendar UI patterns 2025
command palette design 2025
kanban board UI design 2025
file tree component design
multi step form design 2025
filter ui pattern dashboard 2025
inline edit pattern table
empty state design SaaS 2025
```

### 6.3 Fetch sequence

```
1. The vendors that ship the canonical version (Linear for issues,
   Notion for tables, Vercel for command-K, Raycast for command palette).
2. The npm package READMEs of the leading library implementations
   (TanStack Table, react-aria, cmdk, dnd-kit) — primary source for
   the interaction model, not the visual.
3. Mobbin screenshots of products doing this pattern well.
4. Generic "best X UI 2025" results (last priority).
```

### 6.4 Extract

```
- Required interactions for the pattern (sort, filter, multi-select,
  keyboard navigation, etc.)
- Optional polish interactions that mark the difference between
  baseline and premium (sticky headers + virtualized rows + sticky
  footer summary, for tables)
- Common pitfalls (e.g. tables without keyboard nav, calendars with
  day cells too small for touch)
- Accessibility expectations (ARIA roles, focus management)
```

### 6.5 Output slot

```yaml
patterns:
  - name:                   data table | calendar | command palette | ...
    required:               [<one-liner>, ...]
    polish:                 [<one-liner>, ...]
    pitfalls:               [<one-liner>, ...]
    a11y:                   [<one-liner>, ...]
    references:             [<url>, ...]
```

Module 08 (component-library) reads this when generating the matching
component, ensuring required interactions are implemented and pitfalls
are avoided.

---

## 7. Mode 5 — Brand Deep Dive

### 7.1 Trigger

The brief contains "feel like <company>" or `references[].name` is set
AND we want concrete decisions, not vibes.

### 7.2 Query templates

```
<company> typography choices
<company> color palette design system
<company> design system documentation
<company> brand guidelines
<company> press kit
<company> uses what font
<company> CSS variables
<company> github design tokens
```

### 7.3 Fetch sequence

Same as Mode 2 §4.3. Mode 5 is a more aggressive, more focused version
of Mode 2 — it's run only when we need actual values to ground a
decision (e.g. before adapting a clone, or before picking an accent).

### 7.4 Extract

Same fields as Mode 2 §4.4 but go deeper:
```
- Hex/oklch values from inspecting the brand page (Playwright if needed)
- Exact font names + license (Cal Sans, GT Eesti, Inter, etc.)
- Exact tracking values from the typography page if documented
- Iconography vendor (Phosphor, Lucide, custom)
- Photography style (if applicable to landing pages)
```

### 7.5 Output slot

Merges into `references_research` (§4.5) under the matching name. Mode
2 may have populated null fields; Mode 5 fills them.

---

## 8. Research Brief — Output Format

After all triggered modes finish, compile the Research Brief. It is
ALWAYS written internally to:
```
.design-engine/research/<timestamp>.md
```

Whether it's also shown to the user depends on §9.

### 8.1 Format

```markdown
# Research Brief — <project name | command>
*<ISO timestamp> · modes: <list of modes that ran>*

## Where this category sits today
<2–4 sentences. Convention vs decision-space, drawn from competitors.>

## Reference grounding
For each named reference:
### <Reference name>
- Body type: <font> · <size>
- Accent: <color>
- Radius: <values>
- Motion: <durations>
- Elevation: <strategy>
- Distinctive: <one-liner, one-liner>
- Sources: [<url>, <url>]

## Trends in 2025
**Emerging:** <list>
**Declining:** <list>
**Baseline:** <list>

## Component precedents
For each pattern queried:
### <Pattern name>
- Must have: <list>
- Polish: <list>
- Pitfalls to avoid: <list>

## Implications for this brief
<3–6 bullets. Specific design directions this research suggests.
Each bullet maps to a token or component decision module 07/08
should make.>

## Sources cited
<flat list of every URL fetched>
```

### 8.2 Implications section is mandatory

Every Research Brief ends with the `Implications for this brief`
section. This is the bridge from research to generation. Examples:

```
- Use border-elevation in dark mode (Linear, Vercel, Resend all do)
- Body 14px, not 16, given the dense-saas reference profile
- Motion ladder 100/150/250 (Stripe-territory) given the productivity audience
- Skip purple/blue gradients; declining hard in 2025
- Command palette is now baseline for devtools, not a flourish
- Tables need keyboard navigation + virtualization at 200+ rows
```

Module 07 reads these almost verbatim into its decisions.md.

---

## 9. When To Show The Brief

Default: do **not** dump the full brief into chat. The brief is a
working artifact; chat output should be terse.

### 9.1 Always show this one-liner

```
Research: <N modes> · <N sources> · <N implications> → .design-engine/research/<ts>.md
```

### 9.2 Show the Implications section inline IF

- Ambition is C or D (the user is investing in distinctive design and
  benefits from seeing the grounding)
- The brief had `--show-research` flag
- Research surfaced a CONTRADICTION with the brief (e.g. user said
  "feels like Linear" but research shows Linear is dense and the
  user's audience is non-technical). In that case, show the implication
  and ask one clarifying question before proceeding.

### 9.3 Never dump

The full reference grounding tables, full source list, or full pattern
precedents. Those live in the file. Don't paste them in chat.

---

## 10. Conflict Resolution

If two research findings contradict (e.g. Mode 2 says Linear uses 13px
body, Mode 5 finds 14px on the marketing site):

1. Per-source: marketing pages and product pages often diverge — the
   product is denser. Use the one that matches the user's `output_kind`
   (product → product page; landing → marketing page).
2. Recency wins: the more recent source survives.
3. Primary > derivative: a value from `<host>/design` beats a value
   from a blog post.
4. If still unresolved → record both in the brief, mark conflict,
   pick the value matching the closest pre-built system, document
   why.

---

## 11. Output

Web research emits the Research Brief file, populates the
"What I Know" object's `research` slot:

```yaml
research:
  ran:                      true
  modes:                    [competitors, references_research, trends, patterns]
  sources_count:            <int>
  brief_path:               <path>
  implications:             [<one-liner>, ...]   # full list duplicated for downstream
  conflicts:                [<short note>, ...]
```

Then prints the §9.1 one-liner (and the Implications inline if §9.2
applies) and hands off to:

- module 02 (interview) if research surfaced a contradiction needing
  user input
- module 06 (system-selection) for `/design system`
- module 07 (system-gen) otherwise

End of web research.
