---
name: cognitive-load-gate
description: Machine checks for element density, choice overload (Hick's law), reading grade level, heading hierarchy, CTA count, and whitespace ratio per archetype/beat band. Scores 20 points in quality-gate-v3 Axis 2.
tier: core
triggers: cognitive-load, hicks-law, millers-law, reading-grade, heading-hierarchy, whitespace-ratio, quality-gate-v3
version: 0.1.0-provisional
---

# Cognitive Load Gate

20 points, 6 checks. Measures *how hard* the section is to process, not how it looks.

## Layer 1 — When to use

Axis 2 of quality-gate-v3. Runs on every section. Reads archetype + beat from PLAN.md to apply band constraints.

## Layer 2 — Checks

### C1. Element count per viewport ≤ beat max (4pt)

- **PASS**: Count of interactive + visually-weighted elements at default viewport (1280×720) ≤ beat budget.

| Beat | Max elements |
|---|---|
| HOOK | 12 |
| TEASE | 10 |
| REVEAL | 14 |
| BUILD | 16 |
| PEAK | 18 |
| BREATHE | 6 |
| TENSION | 14 |
| PROOF | 20 |
| PIVOT | 12 |
| CLOSE | 10 |

- **CHECK**: Playwright DOM count of `button, a, [role=button], input, select, textarea, svg[role], h1-h6, img[alt]:not([alt=""])`.

### C2. Reading grade level ∈ archetype band (4pt)

| Archetype | F-K range |
|---|---|
| Playful | 6–9 |
| Neubrutalism | 6–10 |
| Data-Dense | 10–12 |
| Editorial | 10–14 |
| Luxury | 10–13 |
| Neo-Corporate | 8–12 |
| Default | 8–12 |

- **PASS**: F-K score of all user-facing copy ∈ band.
- **CHECK**: Extract text nodes from TSX + markdown; compute F-K.

### C3. Choice count per decision point ≤ 7 (Hick's law) (4pt)

- **PASS**: No UI region (nav, filter bar, pricing table, form fieldset, select dropdown) exposes more than 7 simultaneous choices without progressive disclosure (show-more, accordion, category grouping).
- **CHECK**: Count `<li>`, `<option>`, `<button>` siblings per container; flag > 7.

### C4. Heading hierarchy strictly nested (3pt)

- **PASS**: No h1→h3 skip; exactly one h1 per page; h2/h3 nesting coherent with document outline.
- **CHECK**: Static AST scan of headings; compute outline; validate no level jumps > 1.

### C5. CTA count per viewport ≤ 2 (3pt)

- **PASS**: At default viewport, count of visually-primary CTAs (`variant=primary`, `size=lg`, `data-primary-cta`, or computed largest button) ≤ 2.
- **CHECK**: grep primary-variant buttons; Playwright-measured size threshold.

### C6. Whitespace ratio ∈ beat band (2pt)

- **PASS**: Computed whitespace (non-content pixel area / total viewport area) ∈ beat band.

| Beat | Whitespace ratio |
|---|---|
| HOOK | 0.35–0.6 |
| BREATHE | 0.55–0.85 |
| PEAK | 0.2–0.45 |
| Default | 0.3–0.5 |

- **CHECK**: Playwright screenshot → pixel analysis → ratio.

## Layer 3 — Integration

- **Output**: `.planning/genorah/audit/cognitive-load/<section-id>.json`
- **Ledger**: subgate-fired event with per-check fails.
- **Sub-gate cap**: 3+ fails → cognitive-load × 0.5 within Axis 2.

## Layer 4 — Anti-patterns

- ❌ Inflating element count via decorative SVGs and counting all of them — only count interactive + h1-h6 + alt-text images.
- ❌ Hiding 20 nav items behind a hamburger and claiming "7 visible" — C3 counts total choices at decision point, including revealed-on-click.
- ❌ Reading grade computed on code-block / jargon-heavy technical doc — exclude `<pre>`, `<code>`, `<kbd>` from F-K pass.
