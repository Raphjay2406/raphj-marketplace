---
name: context-anchor-v2
tier: core
description: "Lightweight DNA-token refresh injected by pre-tool-use hook when recent agent outputs lack DNA token references. Prevents mid-build drift without full context reinjection."
triggers: ["DNA drift", "context anchor", "pre-tool-use inject", "DNA refresh"]
used_by: ["pre-tool-use hook", "post-tool-use hook"]
version: "3.0.0"
---

## Layer 1: Decision Guidance

### Why Context Anchor v2

v2.x solved context rot via full pre-compact snapshotting. But mid-session, if a builder writes 10 files in a row without referencing DNA tokens, it's already drifting — compaction happens too late.

v2 anchors inject a ~600-byte DNA refresh (12 tokens + signature) every N tool calls when drift is detected, preserving cache warmth and keeping DNA salient without the cost of full reinjection.

### When to Inject

- Writing/editing a design file (`.tsx|.jsx|.css|.scss|.astro|.svelte`).
- Recent METRICS.md tail shows N consecutive writes with `dna_tokens_used: 0`.
- N defaults to 10. Configurable per project.

### When NOT to Inject

- Hook file writes (hook code, not design code).
- Markdown-only edits (no tokens in play).
- Non-section files (config, package.json, tsconfig).

### Decision Tree

```
PreToolUse on Write/Edit?
└─ ext matches design-file set?
    ├─ no  → skip
    └─ yes → read METRICS.md tail (last N writes)
        → count writes with dna_tokens_used > 0
        → if count < 1 over last 10: DRIFT DETECTED
        → inject 600-byte anchor
        → mark current call as "anchored" to reset counter
```

## Layer 2: Technical Spec

### Side-channel via METRICS.md

Claude Code hooks can't read transcript. Solution: post-tool-use scans written file on Write/Edit completion, counts DNA token references (`var(--color-*)`, DNA-named Tailwind classes, `@theme` refs), appends `dna_tokens_used: N` column to METRICS.md.

Pre-tool-use reads last 10 rows from METRICS.md, checks column, injects anchor if all zero.

### Anchor payload (~600 bytes)

```
<!-- genorah:dna-anchor-refresh -->
DNA: {project_name} / {archetype_name}
Colors: bg={bg}, surface={surface}, text={text}, primary={primary},
        accent={accent}, signature={signature}
Fonts: display={display}, body={body}, mono={mono}
Signature element: {signature_element_one_line}
Arc position: Wave {wave}, Beat {beat}
Use DNA tokens via var(--color-*) or bg-primary/text-accent classes.
<!-- /genorah:dna-anchor-refresh -->
```

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| drift_threshold_writes | 5 | 20 | count | default 10 |
| anchor_max_bytes | — | 800 | bytes | HARD |
| design_file_extensions | — | — | enum | .tsx/.jsx/.css/.scss/.astro/.svelte/.vue |
| reinject_cooldown | 5 | 20 | calls | default 10 (don't spam) |

### METRICS.md extension

Add column:
```
| Timestamp | Tool | Target | Status | DnaTokens |
|-----------|------|--------|--------|-----------|
| 2026-04-12... | Write | Hero.tsx | OK | 7 |
| 2026-04-12... | Edit | Hero.tsx | OK | 7 |
```

Post-tool-use regex count of `var\(--(color|space|font|radius|shadow)-\w+\)` plus DNA-prefixed Tailwind utilities (`\b(bg|text|border|shadow)-(primary|secondary|accent|surface|bg|text|muted|signature|glow|tension|highlight)\b`).

## Layer 3: Integration Context

- **`pre-tool-use.mjs`** — reads METRICS.md tail, conditional anchor injection via `additionalContext`.
- **`post-tool-use.mjs`** — extends existing append to count tokens.
- **`design-dna` skill** — source of truth for anchor content (read from DESIGN-DNA.md at runtime).

## Layer 4: Anti-Patterns

- ❌ **Full DNA reinjection on every call** — burns cache, defeats the purpose. 600 bytes is the budget.
- ❌ **Injecting on non-design files** — noise for tsconfig edits.
- ❌ **Reading transcript** — hooks can't. Use METRICS.md side-channel.
- ❌ **Never injecting** — sections drift 20 writes deep. 10-call threshold is the sweet spot.
- ❌ **Hardcoding anchor content** — must read live DESIGN-DNA.md so it reflects current project.
- ❌ **Skipping the cooldown** — re-injecting immediately after injecting wastes cache churn.
