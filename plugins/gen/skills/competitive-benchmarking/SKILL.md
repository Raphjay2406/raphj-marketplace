---
name: competitive-benchmarking
tier: domain
description: "Per-archetype curated SOTD reference list + Playwright capture + vision LLM scoring against 234-pt gate. Generates BENCHMARKS.md + auto-injects per-section reference targets. v3.1: 4-source OAuth-free axes (Land-book, SiteInspire, Cosmos.so, Awwwards archive) with SiteInspire taxonomy mirror + rate-limit guardrails + offline industry-rules fallback."
triggers: ["benchmark", "competitive", "reference sites", "SOTD library", "award library", "gap targets", "land-book", "siteinspire", "cosmos", "awwwards archive"]
used_by: ["start-project", "plan", "builder", "quality-reviewer", "discuss"]
version: "3.1.0"
mcp_required: ["playwright"]
---

## v3.1 Addendum: 4-Source OAuth-Free Benchmarking

Beyond the original Awwwards-only SOTD library, v3.1 expands to 4 inspiration sources. All are public (no OAuth), captured via Playwright MCP.

### Source axis matrix (mirrors SiteInspire taxonomy)

Every reference captured is tagged across 4 axes so future queries can filter precisely:

| Axis | Values | Source origin |
|------|--------|---------------|
| **Style** | archetype-adjacent names (Minimal, Brutalist, Glassmorphism, etc.) | Land-book + SiteInspire + Cosmos |
| **Type** | Homepage, Portfolio, Product, Agency, Ecommerce, Editorial, Landing, App | SiteInspire primary |
| **Subject** | Industry (SaaS, DTC, Agency, Fintech, etc.) | All sources |
| **Platform** | Framework or CMS (Next, Astro, Framer, Webflow, Shopify, WordPress) | SiteInspire primary |

Benchmarking queries specify one or more axes → get filtered reference set.

### Per-source capture protocol

**Land-book** — best for landing-page archetype match
- Filter: style × industry × color (hex match)
- Capture 5 references
- Store: `benchmarks-cache/landbook/{hash}.png`

**SiteInspire** — best taxonomy, breadth coverage
- Filter: style × type × subject × platform (4-axis)
- Capture 5 references
- Use taxonomy as the canonical axis reference for this skill

**Cosmos.so** — best for palette/moodboard seeding
- Filter: tag + hex color
- Capture 3-5 curation boards (not individual shots)
- Store: `benchmarks-cache/cosmos/{hash}/`

**Awwwards archive** — existing SOTD capture (already supported pre-v3.1)
- Filter: tag + era + color
- Capture 5 references per query
- Existing schema unchanged

### Rate-limit guardrails (hard rules)

- `max_requests_per_source_per_session: 20`
- `min_delay_between_requests_ms: 2000`
- `respect_robots_txt: true` — skip sources with disallow rules
- `user_agent: "Genorah-Plugin-Research/3.1 (+internal)"` — honest UA
- Store: URL + title + capture-date + small-thumb only. Never republish content.
- Always cite source URL in any generated BENCHMARKS.md entry.

### Deferred sources (v3.2+)

| Source | Why deferred |
|--------|--------------|
| Dribbble | Requires OAuth app registration per-user; punt until we build the flow |
| Mobbin | Hard paywall — revisit when mobile-specialist tier has a paid seat |
| FWA | Too narrow (3D/experimental only); niche coverage |
| Httpster | Low signal/noise |
| Lapa Ninja | Redundant with Land-book |

### Offline fallback

If all 4 sources rate-limit or Playwright unavailable, fall through to `skills/design-brainstorm/seeds/uipro-industry-rules.json` and generate references-lite from industry-matched entries. Note `research_mode: offline` in output.

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
