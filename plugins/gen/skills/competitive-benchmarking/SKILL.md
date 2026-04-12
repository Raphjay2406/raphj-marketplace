---
name: competitive-benchmarking
tier: domain
description: "Per-archetype curated SOTD reference list + Playwright capture + vision LLM scoring against 234-pt gate. Generates BENCHMARKS.md + auto-injects per-section reference targets."
triggers: ["benchmark", "competitive", "reference sites", "SOTD library", "award library", "gap targets"]
used_by: ["start-project", "plan", "builder", "quality-reviewer"]
version: "3.0.0"
mcp_required: ["playwright"]
---

## Layer 1: Decision Guidance

### Why Benchmark

Design DNA + archetype + emotional arc answer "what should this project look like?" But they don't answer "how good must it be to win?" Benchmarking scores reference SOTD winners on the same 234-pt rubric, generating a concrete quality floor and gap targets per section.

It converts the abstract "SOTD-ready" target into: "beat siteA by +15 in Color, match siteB in Layout, exceed siteA in Depth."

### When to Use

- End of `/gen:start-project`, immediately after archetype lock.
- Before `/gen:plan` to seed section reference targets.
- Any time the project wants to re-benchmark against a new reference set.

### When NOT to Use

- Without a locked archetype (curated list is archetype-indexed).
- When Playwright MCP is unavailable (fall back: skip, use the skill's Layer 2 textual descriptions of each archetype's exemplars).

### Decision Tree

```
archetype locked?  no → block
                   yes → urls arg present?
                     ├─ yes → use those (validate domains, cap 5)
                     └─ no  → load curated list from skill
                         → cache check (<30d, same ISO-week)
                           ├─ hit → load cached
                           └─ miss → Playwright capture each → store
                               → vision-LLM score each (with archetype context)
                               → calibrate vs embedded known scores
                               → synthesize BENCHMARKS.md
                               → inject per-section reference_targets
```

## Layer 2: Curated Reference Library

Embedded JSON keyed by archetype. Quarterly refresh. Example structure:

```json
{
  "Brutalist": [
    {"url": "https://bureau-cool.com", "notes": "Oversized typography, raw grid"},
    {"url": "https://active-theory.net", "notes": "Aggressive motion, WebGL"}
  ],
  "Ethereal": [
    {"url": "https://linear.app", "notes": "Spotlight gradients, subtle motion"},
    {"url": "https://stripe.com", "notes": "Refined depth, parallax shimmer"}
  ],
  "Kinetic": [...], "Editorial": [...], "Neo-Corporate": [...],
  "Organic": [...], "Retro-Future": [...], "Luxury": [...],
  "Playful": [...], "Data-Dense": [...], "Japanese-Minimal": [...],
  "Glassmorphism": [...], "Neon-Noir": [...], "Warm-Artisan": [...],
  "Swiss-International": [...], "Vaporwave": [...], "Neubrutalism": [...],
  "Dark-Academia": [...], "AI-Native": [...]
}
```

Each entry includes 3-5 curated SOTD winners. Refresh cadence: quarterly, during version bump.

## Layer 2: Technical Spec

### Judge prompt template

```
You are an Awwwards SOTD jury member scoring this site on Genorah's 234-point
weighted quality gate. Archetype context: {ARCHETYPE}.

For each of 12 categories, score 0-24 (or scale appropriately):
- Color System (weight 1.2x) — harmony, token discipline, emotional fit
- Typography (1.2x) — scale rhythm, pairing, kinetic opportunities
- Layout & Composition (1.0x) — whitespace, alignment, tension moments
- Depth & Polish (1.1x) — shadow layering, micro-interactions, attention detail
- Motion & Interaction (1.1x) — choreography, scroll, hover delight
- Creative Courage (1.2x) — signature element, tension zones, originality
- UX Intelligence (1.0x) — clarity, hierarchy, conversion
- Accessibility (1.0x) — contrast, focus, semantic HTML
- Content Quality (1.0x) — copy craft, message clarity
- Responsive Craft (1.0x) — mobile/tablet/desktop/wide redesigns
- Performance (1.0x) — LCP/INP/CLS inference
- Integration Quality (1.0x) — cohesion across sections

Also rate Awwwards 4-axis on 10-pt scale: Design, Usability, Creativity, Content.

Return strict JSON with per-category scores, weighted total, 4-axis, and
one-sentence rationale per category.
```

### Cache schema

```
.planning/genorah/benchmarks-cache/
├── {sha256(url+viewport+iso-week)}.json   # scored result
└── {sha256(url+viewport+iso-week)}/
    ├── 1440.png
    └── 375.png
```

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| url_count | 3 | 5 | int | HARD |
| cache_ttl | 7 | 30 | days | SOFT |
| viewport_capture | 2 | 4 | breakpoints | defaults 1440+375 |
| judge_temperature | 0.0 | 0.3 | float | HARD |
| calibration_baselines | 2 | 5 | count | HARD per-week |

### Output

`.planning/genorah/BENCHMARKS.md` (authoritative), plus per-section `PLAN.md` injections:

```yaml
# in sections/hero/PLAN.md
reference_targets:
  primary: https://linear.app  # used by reference-diff-protocol
  gap_targets:
    - "Beat in Color (+15 pts) — use 5 hues, plan 3+2"
    - "Match in Depth — use 3 shadow layers"
  awwwards_target: {design: 9, usability: 8, creativity: 9, content: 8}
```

## Layer 3: Integration Context

- **`/gen:benchmark`** — workflow entry point.
- **`/gen:start-project`** — auto-invokes benchmark after archetype lock.
- **`/gen:plan`** — reads BENCHMARKS.md, propagates reference_targets into per-section PLAN.md.
- **Reference-diff-protocol** — consumes `primary` URL at build time to compute SSIM.
- **Quality-reviewer** — compares final scores against BENCHMARKS.md targets.

## Layer 4: Anti-Patterns

- ❌ **Skipping calibration** — LLM scoring drifts week-to-week. Always score ≥2 known baselines per fresh week to detect drift.
- ❌ **Hardcoding "industry average" as baseline** — SOTD is not "average". Baselines must be curated winners.
- ❌ **Running without archetype context** — a Brutalist site scored against Ethereal expectations returns garbage.
- ❌ **Treating cached scores as permanent truth** — sites redesign. Cache at 30-day TTL max; refresh on suspicion.
- ❌ **Ignoring auth walls** — many SaaS references have logged-in-only surfaces. Use public landing page or Wayback snapshot, log the limitation.
- ❌ **Copying reference style directly** — benchmarks set targets, not templates. Archetype + DNA drive the design; benchmarks drive the *quality ambition*.
