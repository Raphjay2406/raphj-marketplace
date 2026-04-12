---
name: "dna-reverse-engineer"
description: "Extract Design DNA from captured artifacts. Color k-means on pixel-frequency histograms, font-family usage stats, spacing grid inference, signature element detection. Per-token confidence with evidence."
tier: "domain"
triggers: "reverse engineer dna, extract dna, infer design tokens, dna extraction, color extraction from site"
version: "3.21.0"
---

## Layer 1: Decision Guidance

### When to Use

- Stage 3 of ingestion pipeline after capture + inventory.
- Both codebase (CSS AST) and URL (pixel + computed-style) paths.

### When NOT to Use

- Greenfield project — use `/gen:start-project` DNA authoring.
- DNA already present in `design-tokens.json` or `@theme {}` block — just import verbatim.

## Layer 2: Algorithm

### Color palette (12 semantic slots)

1. **Codebase**: parse `@theme {}` block, `tailwind.config`, `design-tokens.json`. Confidence = 1.0 when explicit.
2. **URL**: pixel-frequency histogram across all breakpoint screenshots → k-means (k=12) with ΔE2000 distance → assign to bg/surface/text/border/primary/secondary/accent/muted/glow/tension/highlight/signature by position + frequency + contrast role.
3. Confidence = inverse cluster variance × coverage %.

### Typography

- **Codebase**: CSS `font-family` + `@font-face` rules.
- **URL**: iterate every rendered element; `getComputedStyle().fontFamily` → frequency by role (display / body / mono). Classify by font-size distribution.

### Spacing

- Bounding-box gap analysis between siblings → cluster gaps → infer scale steps (expect 4/8/12/16/24/32/48/64 family).
- Confidence = % of gaps that snap to nearest inferred step within 2px.

### Signature element

- Screenshot region clustering detects repeating motifs (gradient, shape, pattern).
- Flag candidate; user confirms via GAP-REPORT.

## Layer 3: Integration Context

- Consumes outputs of `codebase-ingestion` (CSS AST) or `url-scrape-ingestion` (screenshots + computed styles).
- Emits `DNA-EXTRACTED.md` + `dna.extract` ledger entries (one per token).
- Feeds `archetype-inference`.
- Any token with confidence < 0.5 emits paired `gap` entry (preservation invariant).

## Layer 4: Anti-Patterns

- Using RGB Euclidean distance — perceptually wrong; use ΔE2000.
- Averaging screenshot pixels into a single palette — loses breakpoint-specific tokens; process per-breakpoint then merge.
- Silent fallback when font file missing — record `gap:font-unloadable` with family name.
- Assigning semantic slots without evidence — every assignment logs role + rationale.
