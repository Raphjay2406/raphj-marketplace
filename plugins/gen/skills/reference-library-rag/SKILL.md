---
name: reference-library-rag
description: Curated SOTD reference library indexed by (archetype, beat, layout-pattern) with embeddings + pixel-diff refs. Retrieves top-5 matches pre-variant-generation to condition builder prompts. Target size 500 entries by v3.5.3; ~50 seeded in v3.5.1.
tier: core
triggers: reference-library, rag, sotd, retrieval, archetype-reference, variant-conditioning
version: 0.1.0-provisional
---

# Reference Library RAG

Lifts variant baseline by conditioning generation on hand-curated SOTD references. Not copy-paste — the references are *targets to exceed*, not templates.

## Layer 1 — When to use

- `pareto-generation` consumes top-5 retrieved refs pre-spawn
- `reference-diff-protocol` scores candidate SSIM vs retrieved targets
- `judge-calibration` few-shot anchors can draw from this library

## Layer 2 — Data model

Library root: `skills/reference-library-rag/entries/`

Each entry `<slug>.md` with frontmatter:

```yaml
---
slug: linear-hero-kinetic-001
archetype: kinetic
beat: HOOK
layout_pattern: split-asymmetric
reference_url: https://linear.app
captured_at: 2026-03-15
preview: entries/linear-hero-kinetic-001.webp
quality_panel:
  design: 218
  ux: 112
  awwwards_avg: 8.6
tags: [saas, animation-heavy, split-nav, dark-mode]
notes: "..."
---
```

Plus `entries/<slug>.webp` for SSIM comparison.

## Layer 3 — Retrieval

### Index build

`scripts/reference-library-index.mjs` (v3.5.1):
1. Walk entries, extract text features (archetype + beat + tags + notes).
2. Compute embeddings via local model (Xenova/jina-embeddings-v2) or skip to BM25 if no embedding model.
3. Store vectors in `.planning/genorah/index/reference-library.db` (sqlite-vec).
4. Maintain pixel-diff refs separately as `<slug>.webp`.

### Query

```
retrieve({
  archetype: "kinetic",
  beat: "HOOK",
  layout_pattern?: "...",
  top_k: 5
}) → [entries sorted by score]
```

Filter: archetype exact match REQUIRED; beat exact match REQUIRED; layout_pattern soft-match.

Score: embedding cosine (if available) OR BM25 over tags+notes, tiebreak on `quality_panel.design`.

### Spawn-prompt injection

Pareto / builder spawn prompt receives:

```
TOP-5 REFERENCES FOR {archetype}/{beat}:

1. {slug} — quality {design}/{ux}  (preview: {preview_path})
   Notes: {notes}
2. ...

Match or exceed these. NEVER copy structure or copy verbatim. Use them as quality ceilings, not templates.
```

## Layer 4 — Integration

### Feedback loop (landing v3.5.2)

After `quality-reviewer` accepts a variant that scores ≥ 95th percentile on (archetype, beat), it proposes that variant as library candidate — writes to `entries/pending/<slug>.md`. Weekly user-local batch promotes approved pendings.

### Golden-set crossover

Subset of library used for `judge-calibration` few-shot anchors; entries tagged `golden: true` in frontmatter.

### Seeding roadmap

- **v3.5.1**: 50 entries (2/archetype × 25 archetypes). Scaffold + 10 exemplars committed.
- **v3.5.2**: 150 entries.
- **v3.5.3**: 500 entries, feedback-loop live.

## Layer 5 — Anti-patterns

- ❌ Entries without quality panel scores — no signal for ranking.
- ❌ Stale references (> 12 months) without re-scoring — visual craft drifts; re-panel or retire.
- ❌ Using library as template — always frame as "exceed", never "match structure."
- ❌ Single-source bias (all from Linear / Apple / Stripe) — enforce source diversity, max 3 per brand.
- ❌ No preview image — SSIM comparison impossible; entry invalid.
