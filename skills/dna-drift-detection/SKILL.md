---
name: dna-drift-detection
category: core
description: "AST-level detection of off-DNA color/spacing/font literals in TSX, CSS, and Tailwind class strings. Coverage %, hard-gate at 92%, suggests nearest DNA token via Lab ΔE and L2 distance."
triggers: ["DNA drift", "token coverage", "off-token", "hex literal", "arbitrary value", "design system enforcement"]
used_by: ["builder", "quality-reviewer", "consistency-auditor", "polisher"]
version: "3.0.0"
hard_gate: true
threshold: { coverage_min: 92 }
---

## Layer 1: Decision Guidance

### Why Drift Detection

DNA tokens are the single source of visual truth. Every hardcoded hex, arbitrary Tailwind value, or inline style is a crack in that foundation. Accumulated across 20 sections, these cracks make the site feel like a stitched-together template — exactly the "generic premium" failure mode Genorah is built to prevent.

This skill converts "DNA discipline" from vibes into a percentage: **coverage = on_token_refs / (on_token_refs + off_token_refs) × 100**. Below 92%, the section blocks SOTD-Ready tier.

### When to Use

- **Post-Write/Edit hook** — scan any `.tsx|.jsx|.css|.scss|.astro|.svelte` change; report drift delta as advisory.
- **Pre-commit via dna-compliance-check.sh** — hard gate at 92% coverage aggregate.
- **Stage 4 of validation pipeline** — cross-section consistency audit.
- **Consistency-auditor agent input** — drift data informs auto-fix proposals.

### When NOT to Use

- Third-party component internals (`node_modules/`) — out of scope.
- Generated files (Next.js `.next/`, Astro `.astro/dist/`) — out of scope.
- Explicit escape hatches annotated with `// dna-allow: reason` — skip that line.

### Decision Tree

```
File changed?
├─ match extension? no  → skip
├─ match extension? yes →
│   parse AST (TSX) or tokenize (CSS/Tailwind)
│   → collect every color/spacing/font/radius reference
│   → classify: ON_TOKEN (DNA var/class) or OFF_TOKEN (literal)
│   → compute coverage %
│   → if <92%: HARD GATE fail (block commit/build)
│   → if <96%: WARNING (report but allow)
│   → else: pass
│   → always: emit suggestions for nearest token
```

## Layer 2: Technical Spec

### Parsers

- **TSX/JSX:** `@typescript-eslint/parser` with JSX support. Walk AST for:
  - `JSXAttribute[name.name='style']` → scan `ObjectExpression` properties for color/spacing values
  - `JSXAttribute[name.name='className']` → tokenize string; flag `bg-[...]`, `text-[...]`, `p-[...]`, `gap-[...]`, `rounded-[...]` arbitrary values
  - `Literal` strings matching color regex anywhere in JSX
- **CSS/SCSS:** `postcss` + `postcss-value-parser`. Walk declarations; flag color/spacing/font values not referencing `var(--*)`.
- **Tailwind class strings:** custom tokenizer (split whitespace, regex `/\[([^\]]+)\]/` for arbitrary-value brackets).
- **Last-resort text regex** (for all file types): `/#[0-9a-f]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)|oklch\([^)]+\)/gi`.

### Drift catalog

| Pattern | Severity | Example | Auto-fix hint |
|---------|----------|---------|---------------|
| Hex literal not in DNA palette | CRITICAL | `bg-[#4a90e2]` | → `bg-primary` (ΔE=1.2) |
| rgb/hsl/oklch literal | CRITICAL | `color: rgb(74,144,226)` | nearest token via ΔE2000 |
| Inline `style={{color:...}}` | CRITICAL | — | move to className token |
| Arbitrary spacing `p-[23px]` | WARNING | — | nearest of 5-step scale |
| Off-scale `text-[19px]` | WARNING | — | nearest of 8-level type scale |
| Arbitrary radius `rounded-[7px]` | WARNING | — | DNA radius scale |
| `font-family:` literal not in DNA | CRITICAL | — | `font-display`/`font-body`/`font-mono` |
| Arbitrary shadow `shadow-[...]` | WARNING | — | DNA shadow scale |

### Nearest-token algorithm

- **Colors:** convert both literal and each DNA token to OKLab, compute ΔE2000, pick minimum. Tie-breaker: semantic role match from comment context.
- **Spacings:** L2 distance on px values, snap to nearest 5-step value.
- **Type sizes:** L2 distance on px values, snap to nearest of 8 scale steps.

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| coverage_threshold | 0 | 100 | % | HARD at 92 |
| warning_threshold | 0 | 100 | % | SOFT at 96 |
| max_scan_time_per_file | — | 500 | ms | SOFT (abort, warn) |
| deltaE_suggest_max | 0 | 10 | ΔE2000 | SOFT (>10 = no suggestion) |
| allowed_escape_hatch | `// dna-allow: <reason>` | — | comment | HARD per-line |

### Output

```
.planning/genorah/audit/
├── drift-report.md           # aggregated per-wave report
└── drift-{filename}.json     # per-file scan result
```

Per-file JSON:
```json
{
  "file": "sections/hero/Hero.tsx",
  "coverage": 87.4,
  "on_token_refs": 52,
  "off_token_refs": 8,
  "findings": [
    {"line": 42, "col": 14, "pattern": "hex", "match": "#4b91e3",
     "suggestion": {"token": "primary", "deltaE": 0.3}}
  ]
}
```

## Layer 3: Integration Context

### Hook wiring

- **`post-tool-use.mjs`** — on Write/Edit to matching extension, spawn detector as background child process; append drift delta to `audit/drift-report.md`.
- **`dna-compliance-check.sh`** — pre-commit invocation; fail with list of findings if aggregate coverage <92%.

### Agent consumption

- **Builder** — reads its section's drift after each Write; if coverage drops below 92%, retries with suggestions.
- **Consistency-auditor** — aggregates drift across wave siblings, generates `GAP-FIX.md` patches.
- **Polisher** — applies auto-fix suggestions when confidence (ΔE<3) is high.
- **Quality-reviewer** — coverage <92% blocks Stage 4.

### Relationship to other skills

- Feeds `component-consistency` skill (registry enforcement).
- Consumed by `quality-gate-v2` as Color System + Typography signal.
- Reference tokens come from `DESIGN-DNA.md` (authoritative source).

## Layer 4: Anti-Patterns

- ❌ **Treating ΔE<1 as noise** — in OKLab, ΔE<1 is *imperceptible*. If a literal matches a token within ΔE 0.3, rename it to the token, don't keep the literal.
- ❌ **Whitelisting `shadcn/ui` defaults** — shadcn uses CSS vars that *should* map to DNA. If they don't, fix the `@theme` block, don't exempt the components.
- ❌ **Allowing arbitrary values "just for this one hero"** — that's how 8 sections end up with `#4a90e2` drift across `#4b91e3`, `#4c90e4`, `#4b92e2`. All feel "about right", none match.
- ❌ **Ignoring escape hatches** — if a component genuinely needs an off-token value (third-party iframe color-matching), require `// dna-allow: <reason>` and track those in audit report.
- ❌ **Running drift as text regex only** — misses `style={{color:...}}` and template literals. AST parsing catches 3x more drift.
- ❌ **Blocking at 100% coverage** — realistic projects have ~95-98% coverage; 92% is a reachable gate, 100% drives teams to over-tokenize trivial values.
