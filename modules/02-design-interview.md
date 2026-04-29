# 02 — Design Interview

Gap-based interview. Reads `gaps[]` from the "What I Know" object,
asks ONLY about gaps, hard cap 4 questions, then confirms a Design Brief
Summary before any generation runs.

Tone: senior designer, not intake form. One sentence framing per
question. Concrete options, not open-ended. Skip whatever is already
known. Never re-ask anything answered earlier in the conversation.

---

## 1. The 6 Dimensions — Coverage Criteria

For each dimension, list the exact fields that must be set for
"covered". If any required field is null/empty after inference (see
01-context-intake §9.2), the dimension has a gap and lands in the
question pool.

### 1.1 IDENTITY — what is this?
Covered when at least ONE of:
- `identity.product_name` is set
- `identity.domain` is set
- `references[].name` contains a clear product analogue ("like Linear")

### 1.2 AESTHETIC — how should it feel?
Covered when ALL of:
- `aesthetic.personality_words` length ≥ 2
- `aesthetic.mode` ∈ {light, dark, both}
- `aesthetic.density` is set OR can be inferred from references/screenshots

### 1.3 AUDIENCE — who uses it?
Covered when:
- `audience.segment` ∈ {developer, business, consumer, enterprise}
- (technical_level is bonus, not required)

### 1.4 STACK — what tech?
Covered when:
- `codebase.present == true` (scan supplies stack), OR
- `stack.framework` AND `stack.styling` are both set from prose, OR
- The output is `/design system` and the user explicitly said
  "stack-agnostic" / "framework-free"

### 1.5 SCOPE — what are we shipping?
Covered when ALL of:
- `scope.output_kind` is set
- `scope.surface` is set (or implied by command)
- `scope.screen_list` is non-empty for screen-producing commands
  (`/design web`, `/design mobile`, `/design landing`, `/design redraw`)

### 1.6 REFERENCE — enough visual material?
Covered when at least ONE of:
- `references[]` has ≥ 1 entry
- `clone_target.url` is set
- `visual_inputs.ui_screenshots` has ≥ 1 entry
- `visual_inputs.mood_board` has ≥ 1 entry
- `figma.pulled == true`

---

## 2. Gap Selection — Picking The 4

The intake module produced `gaps[]` with `blocking: true|false`. Apply:

```
1. Take all blocking gaps, ordered: SCOPE > AESTHETIC > IDENTITY > AUDIENCE > STACK > REFERENCE
2. If fewer than 4, fill remaining slots with non-blocking gaps in same order.
3. Never exceed 4 questions total.
4. If 0 gaps → skip directly to §6 (brief summary).
5. Always include AMBITION as an extra prompt if not set, but only
   when slots permit (count it as a question against the 4-cap).
```

---

## 3. Question Bank

Each entry: the dimension/field, the exact question, the option set.
Pick options that are concrete and force a decision. Never write
open-ended "tell me about your audience". Always offer 3–5 named choices
plus a free-text fallback.

### 3.1 SCOPE — output_kind

```
What are we shipping first?

  1. Full design system (tokens + components + docs)
  2. A single screen (you'll tell me which)
  3. A flow (3–6 connected screens)
  4. Marketing / landing page
  5. Animation or product reveal

Reply with the number.
```

### 3.2 SCOPE — screen_list

```
Which screens? Pick all that apply or list your own.

  - Dashboard / home
  - Settings
  - Auth (sign in, sign up, reset)
  - Onboarding
  - Pricing / billing
  - Empty state / first run
  - Custom: ___
```

### 3.3 SCOPE — surface

```
Web, mobile, or both?

  [W] Web (responsive desktop-first)
  [M] Mobile (iOS or Android)
  [B] Both
```

### 3.4 AESTHETIC — personality

```
Pick 2–3 that fit. Skip the rest.

  precise · warm · technical · editorial · playful · austere
  serious · dense · airy · confident · understated · expressive

Or describe in your words.
```

### 3.5 AESTHETIC — mode

```
Light, dark, or both?

  [L] Light only
  [D] Dark only
  [B] Both (system follows OS)

Default: B for products, L for landing, D for devtools.
```

### 3.6 AESTHETIC — density

```
How dense?

  [S] Sparse — lots of whitespace, marketing-grade calm
  [M] Medium — standard product density
  [D] Dense — Linear-style, data-heavy, power users

Most SaaS products want M. Devtools want D. Landing wants S.
```

### 3.7 IDENTITY — product

```
What is this product, in one sentence? Or just give me a name and
domain (e.g. "Acme — fintech for freelancers").
```

### 3.8 IDENTITY — domain (when name unknown)

```
What domain?

  fintech · devtools · healthcare · e-commerce · creator · enterprise
  consumer social · education · productivity · other: ___
```

### 3.9 AUDIENCE — segment

```
Who's this for?

  [D] Developers / technical users
  [B] Business users / professionals
  [C] Consumers / general public
  [E] Enterprise buyers / decision makers
```

### 3.10 STACK — framework + styling

```
What stack? (Skip if you don't have one yet — I'll output framework-free
HTML + tokens.)

  React + Tailwind         (most common)
  React + CSS Modules
  Next.js + Tailwind + shadcn
  Vue / Nuxt + Tailwind
  Svelte / SvelteKit
  Vanilla HTML + CSS
  Other: ___
```

### 3.11 REFERENCE — analogue

```
Anything I should look at? Pick one or more, or paste a URL.

  - Linear (precise, dark, dense devtool)
  - Vercel (black/white precision, doc-grade)
  - Stripe (financial trust, warm authority)
  - Notion (warm, content-first)
  - Raycast (premium dark, frosted)
  - Resend / Planetscale (modern saas-dark)
  - Or: paste a URL / "no reference"
```

### 3.12 AMBITION — level (always-optional 4th slot)

```
How ambitious?

  [A] Clean & functional      ship fast, conservative choices
  [B] Polished & premium      clearly professional, no rough edges  ← default
  [C] Stunning & distinctive  people screenshot this
  [D] Iconic                  redefines the category
```

### 3.13 Stack-conflict confirmation (only when intake flagged it)

```
I see <X> in the codebase but you said <Y>. Which wins?

  [1] Use codebase (<X>) — extend what's there
  [2] Override with <Y> — generate a new system
  [3] Side-by-side — keep <X> intact, output <Y> in .design-engine/
```

---

## 4. Phrasing Rules

1. **Always offer named options.** Free text only as fallback.
2. **Default to one chord, not a paragraph.** Numbered or letter-keyed
   replies (`1`, `D`, `C/P/B`).
3. **Never combine two questions in one prompt.** Each question covers
   one field.
4. **Lead with framing, then options.** One sentence frame max.
5. **Never re-ask.** If the answer is in the message history, skip.
6. **Never apologize.** No "sorry to ask, but…". No "if you don't mind".
7. **Never explain why you're asking unless asked.**
8. **No paragraphs of philosophy.** This is a senior designer pattern-
   matching, not a teacher.

---

## 5. Ambition Levels — What Each Unlocks

The ambition level controls how opinionated and risky generation gets.
Modules 07, 08, 09, 10 all read this field.

### Level A — Clean & functional
```
- Conservative palette (1 brand color, 1 accent max)
- Stock spacing scale (Tailwind defaults OK)
- Standard radius (md = 6px), no playful corners
- Animations only where they communicate state
- Sans-serif body + sans-serif headings (no display font required)
- One layout pattern per screen
- Goal: nothing wrong, nothing surprising
```

### Level B — Polished & premium (default)
```
- Considered palette (full 11-step ramp, oklch)
- Custom spacing rhythm tuned to the type scale
- Typographic detail (negative tracking on display, optical alignment)
- Hover/focus/active all designed
- Display font for headings allowed
- One distinctive detail per screen (the "screenshottable moment")
- Goal: clearly professional, looks like a paid agency built it
```

### Level C — Stunning & distinctive
```
- Opinionated, often non-neutral palette
- Bespoke spacing (no Tailwind defaults)
- Display + body + mono fonts, all chosen with intent
- Real animation choreography (deliberate enter/exit, shared-element
  transitions where it makes sense)
- Two distinctive details per screen, never three
- Density and rhythm are themselves a design statement
- Goal: people screenshot this and post it
```

### Level D — Iconic
```
- Full philosophical commitment to one of the 20 design schools
  (references/design-philosophies.md)
- Bespoke micro-interactions on hero / first-touch surfaces
- Custom motion easing curves, not stock
- Typography is the primary visual element
- Layout breaks at least one common SaaS convention with intent
- Goal: redefines the category — designers reference it later
```

Modules 07–10 read `brief.ambition` and gate features by level. Below
B, custom motion curves are NOT generated. Below C, typographic
choreography is NOT generated. Below D, convention-breaking layout is
NOT generated.

---

## 6. Design Brief Summary — Confirmation Block

After all questions are answered (or skipped because no gaps existed),
print this exact block. WAIT for explicit confirmation before
proceeding to module 07.

```
Design Brief: <product_name OR command>
─────────────────────────────────────────
Personality:   <personality_words joined with " · ">
Mode:          <light | dark | both>
Density:       <sparse | balanced | dense>
Audience:      <segment>  (<technical_level if set>)
Domain:        <domain>
References:    <comma-separated names + URLs>
Avoid:         <anti_words>  (or "—" if none)
Stack:         <framework + styling + ui_lib + motion>
Surface:       <web | mobile | both>
Output kind:   <system | screens | flow | landing | animation | review>
Screens:       <screen_list joined with ", ">
Ambition:      <A | B | C | D>  (<one-line description>)
First output:  <"design system" | "<screen name>" | "canvas of all screens">
Mode:          <C | P | B>

Confirm with "go" or describe what to change.
```

### Field rules

- Empty fields print "—" not "null".
- Avoid line: include `aesthetic.anti_words` AND auto-include any
  hardcoded anti-slop categories the brief seems to flirt with
  (e.g. brief says "purple gradients" → auto-add "purple gradients" so
  the user sees we're refusing).
- Stack line: if codebase scan ran, prefix with "(detected) ". If user
  said framework-free, print "(framework-free)".
- First output line: derived from output_kind + scope. For `/design web`
  with multiple screens, "First output" is "Canvas of all screens".
- Mode line is the C/P/B output mode (resolved or pending).

### After printing

Wait for one of:
- `go`, `yes`, `confirm`, `ok`, plain Enter → proceed
- Anything else → treat as edit instruction. Re-print the block with
  edits applied. Repeat until confirmation or stop.

Never proceed past this gate without an explicit affirmative.

---

## 7. Example Conversations

### 7.1 Minimal context

User: `design something cool`

Intake gaps: SCOPE.output_kind, SCOPE.surface, AESTHETIC.personality,
IDENTITY.domain, REFERENCE.

Question 1 (SCOPE.output_kind, blocking):
```
What are we shipping first?
  1. Full design system
  2. A single screen
  3. A flow (3–6 screens)
  4. Landing page
  5. Animation
```

User: `2`

Question 2 (SCOPE.screen_list + surface combined where natural):
```
Which screen, on which surface?
  Examples: "web dashboard", "mobile onboarding", "landing hero"
```

User: `web dashboard`

Question 3 (AESTHETIC.personality + mode):
```
Pick 2–3: precise · warm · technical · editorial · playful ·
austere · serious · dense · airy · confident · understated · expressive

And mode: [L] Light  [D] Dark  [B] Both
```

User: `precise dense technical, dark`

Question 4 (REFERENCE):
```
Anything to look at? Linear · Vercel · Stripe · Resend · Planetscale ·
Notion · Raycast — or paste a URL — or "no reference".
```

User: `Linear, Resend`

→ Print Design Brief Summary, ambition unset → defaults to B, await
confirmation.

### 7.2 Rich context

User attaches: 3 screenshots of current dashboard, package.json showing
Next.js + Tailwind + shadcn, message: `redesign this. it feels generic.
make it feel like Resend's dashboard but for our analytics tool.`

Intake fills: stack (from codebase), surface=web, output_kind=screens,
screen_list=[dashboard], references=[Resend], aesthetic.mode=dark
(screenshots), domain=analytics, anti_words=[generic], identity.product=
analytics tool.

Gaps: AESTHETIC.personality (1 word "generic" is not enough),
SCOPE.screen_list could expand, AMBITION.

Question 1 (AESTHETIC.personality):
```
Pick 2–3: precise · warm · technical · editorial · serious · dense ·
airy · confident · understated · expressive
```

User: `precise, confident, dense`

Question 2 (SCOPE.screen_list expansion):
```
Just the dashboard, or include settings + empty state too?
  1. Dashboard only
  2. + settings
  3. + settings + empty state + onboarding
```

User: `3`

Question 3 (AMBITION):
```
[A] Clean & functional
[B] Polished & premium  (default)
[C] Stunning & distinctive
[D] Iconic
```

User: `C`

→ 3 questions used. Print Design Brief Summary. Await confirmation.

### 7.3 Clone request

User: `clone linear.app`

Intake fills: clone_target.url=linear.app, command=/design web,
scope.output_kind=system+screens, references=[Linear], aesthetic.mode
will be filled by clone-engine extraction.

Gaps after clone-engine runs: SCOPE.surface (probably web from URL),
SCOPE.screen_list (which Linear screens?), STACK (user's stack vs
generic).

Question 1 (SCOPE.screen_list):
```
Which Linear screens? Pick all you want, or "all of them".
  - Issue list / inbox
  - Project view
  - Settings
  - Cycle / roadmap
  - All of them
```

User: `issue list, project view`

Question 2 (STACK, only if no codebase):
```
Stack? (Or "framework-free" for HTML + tokens only.)
  React + Tailwind · Next.js + Tailwind + shadcn · Vue/Nuxt · Vanilla
```

User: codebase already detected → SKIP this question.

Question 2 actual (AMBITION, since clone of an iconic product):
```
Use Linear's structure as-is, or push it further?
  [B] As-is — extract Linear, apply to your brand (default for clones)
  [C] Push it — Linear's discipline, but with one or two distinctive details
  [D] Iconic — clone the structure, then redesign the soul
```

User: `B`

→ Print Design Brief Summary with `clone_target.mode = adapt`. Await
confirmation.

---

## 8. Stop / Skip Conditions

- User says "skip questions" or "just do it" → set ambition to B,
  fill remaining gaps with sensible defaults, print Design Brief
  Summary anyway, still wait for confirmation.
- User says "stop" → halt. Do not generate.
- User answers a question with another question → answer it briefly,
  then re-ask the original.
- User answers ambiguously (e.g. picks two contradictory options) →
  ask one disambiguation, doesn't count against the 4-cap.

---

## 9. Output

Interview emits the updated "What I Know" object with all gaps closed
or marked as "user-skipped". Then:

1. Print the Design Brief Summary block (§6).
2. Wait for confirmation.
3. On confirmation, hand off to:
   - `modules/06-system-selection.md` if command is `/design system`
     and saved_config has no system.
   - Otherwise → `modules/07-design-system-gen.md`.

End of interview.
