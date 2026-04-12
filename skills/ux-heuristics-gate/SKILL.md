---
name: ux-heuristics-gate
description: Nielsen's 10 usability heuristics automated as binary machine checks. Scores 20 points in the UX Integrity axis of quality-gate-v3. Each heuristic passes or fails deterministically — no subjective rating. Invoked by quality-reviewer during Audit stage.
tier: core
triggers: ux-heuristics, nielsen, usability, heuristics-gate, quality-gate-v3, ux-integrity
version: 0.1.0-provisional
status: PROVISIONAL — thresholds calibrated in research track R5/R9 before stable.
---

# UX Heuristics Gate (Nielsen 10, automated)

20 points in quality-gate-v3 Axis 2 (UX Integrity). Each heuristic scored **2 points binary** (pass / fail). Total 20/20. No partial credit — if the check is ambiguous the check is wrong, rewrite it.

## Layer 1 — When to use

Runs at pipeline Stage 9 (Audit) for every section. Also callable standalone via `/gen:ux-audit`. Output is written to `.planning/genorah/audit/ux-heuristics/<section-id>.json`.

## Layer 2 — The 10 machine checks

### H1. Visibility of system status (2pt)

Every async operation has a loading indicator. Every action has an immediate response.

- **PASS**: All `fetch()`, `action={...}`, `onSubmit`, form posts, and `<Suspense>` boundaries have a visible loading state (`<Skeleton>`, `<Spinner>`, `aria-busy`, `isPending`).
- **CHECK**: grep for async patterns without accompanying loading UI within same component.

```
fail_regex: /await\s+fetch|useMutation|action=\{/ without /Skeleton|Spinner|aria-busy|isPending|isLoading/ within 40 lines
```

### H2. Match real-world language (2pt)

Reading grade level ≤ 10 (Editorial ≤ 14, Data-Dense ≤ 12). No jargon without glossary.

- **PASS**: All user-facing copy passes Flesch-Kincaid ≤ archetype_max; no words in `skills/content-quality/jargon-blocklist.txt` appear without `<abbr>` or tooltip.
- **CHECK**: Extract text nodes from TSX, compute F-K score per paragraph.

### H3. User control and freedom (2pt)

Undo/back/cancel reachable on every destructive action.

- **PASS**: Every form has `cancel` + `reset`; every modal has `ESC` + close button; every destructive action has confirmation OR undo toast.
- **CHECK**: grep for destructive patterns (delete, remove, drop) without confirmation component or undo pattern.

### H4. Consistency and standards (2pt)

Design-tokens compliance 100% within DNA.

- **PASS**: DNA drift check reports coverage ≥ 95% (stricter than global 92% because this is per-section).
- **CHECK**: `scripts/dna-drift-check.mjs --section <id>`; returns per-section coverage.

### H5. Error prevention (2pt)

Forms validate inline before submit. Destructive actions confirmed.

- **PASS**: Every `<input required>` has visible validation pattern (`onBlur`, `onChange` handler, `pattern=`, or Zod/form library wiring); every destructive action has confirmation modal or undo.
- **CHECK**: grep `required` inputs without associated error state rendering.

### H6. Recognition rather than recall (2pt)

No short-term memory demands. User sees options, doesn't recall.

- **PASS**: Navigation persistent; form field labels always visible (no placeholder-only labels); wizard steps show current position.
- **CHECK**: grep `placeholder=` without accompanying `<label>` element; flag.
- **CHECK**: multi-step wizards must have step indicator.

### H7. Flexibility and efficiency (2pt)

Keyboard shortcuts or skip-links present for power users.

- **PASS**: `<a href="#main">Skip to content</a>` exists; OR keyboard shortcut handler (`onKeyDown`, `useHotkeys`) present; OR tabular data has sortable headers.
- **CHECK**: grep for skip-link pattern OR keyboard shortcut library import.

### H8. Aesthetic and minimalist design (2pt)

Text-to-UI-chrome ratio within band per beat.

- **PASS**: Computed ratio ∈ archetype/beat band. HOOK: 0.3–0.6, BREATHE: 0.5–0.8, PEAK: 0.2–0.5.
- **CHECK**: Playwright DOM evaluation: text content chars / total interactive element count.

### H9. Help users recognize, diagnose, recover from errors (2pt)

Every error state provides specific next action.

- **PASS**: Every error message ends with actionable verb phrase ("Try again", "Contact support", "Check your network"); no bare "Error occurred".
- **CHECK**: grep error state JSX; must contain `<button>`, `<a>`, or next-action copy.

### H10. Help and documentation (2pt)

Help/FAQ/contact reachable in ≤ 2 clicks from any page.

- **PASS**: Global nav or footer contains `Help`, `FAQ`, `Contact`, `Support`, or `Docs` link; linked page exists.
- **CHECK**: grep navigation components; confirm link present; confirm route exists in sitemap.

## Layer 3 — Integration

- **Output artifact**: `.planning/genorah/audit/ux-heuristics/<section-id>.json` with shape:

  ```json
  {
    "section_id": "hero",
    "total": 18,
    "max": 20,
    "checks": [
      { "id": "H1", "name": "visibility-status", "passed": true, "evidence": "Spinner in <AsyncBoundary>" },
      { "id": "H2", "name": "real-world-language", "passed": false, "evidence": "F-K score 16.2 > 14 (Editorial archetype)" },
      ...
    ]
  }
  ```

- **Ledger**: emit `{kind: "subgate-fired", subject: <section-id>, payload: {gate: "ux-heuristics", score: 18, fails: ["H2"]}}`.
- **Cascade**: any 3+ fails trigger `ux-heuristics × 0.5` cap within Axis 2.

## Layer 4 — Anti-patterns

- ❌ Rating a heuristic "partial" — it's binary; tighten the check until yes/no.
- ❌ Skipping H4 (DNA coverage) because "that's a separate gate" — it also counts here; consistency is a Nielsen heuristic.
- ❌ Running heuristics only on hero — run per section; aggregation is at page level but detection is section-level.
- ❌ Accepting placeholder-only labels as "minimalist" — H6 blocks this regardless of aesthetic archetype.
