---
name: "component-mapping"
description: "Map ingested components and DOM sections to Genorah primitives: beats (HOOK/BUILD/PEAK/etc.) and SDUI blocks. Preserves original as source-of-truth; map is a proposal reviewed by user."
tier: "domain"
triggers: "component mapping, map to beats, map to blocks, ingest components, beat inference, section mapping"
version: "3.21.0"
---

## Layer 1: Decision Guidance

### When to Use

- Stage 5 of ingestion after DNA + archetype + content-extraction.
- For each inventoried component or `<section>` in captured source.

### When NOT to Use

- Runtime rendering — this is ingest-time inference only, not a build pattern.

## Layer 2: Heuristics

| Pattern | Beat | Evidence |
|---------|------|----------|
| First section, full-viewport height, large type | HOOK | Position + size |
| 3+ card grid with icon + title + body | BUILD | Repeating children |
| Large number + label | PEAK | Typographic scale + stat role |
| Quote + attribution | PROOF | Quotation marks + `cite` element |
| Tabs / comparison | PIVOT | `role="tabpanel"` or selector state |
| Final CTA, centered, minimal | CLOSE | Terminal position + low density |
| Low-density, whitespace-heavy between dense sections | BREATHE | Density analysis |

Output per section:

```json
{
  "source": "src/sections/Hero.tsx",
  "proposed_beat": "HOOK",
  "confidence": 0.82,
  "proposed_block": "hero",
  "evidence": ["first-in-order", "100vh-height", "h1-present"],
  "alternatives": [{ "beat": "PEAK", "confidence": 0.12 }]
}
```

Written to `DESIGN-SYSTEM.md` + `manifests/components.json`. Never auto-locks — user reviews.

## Layer 3: Integration Context

- Consumes: archetype context (`archetype-inference`) + DNA + content groups.
- Feeds: `/gen:plan` — mapped beats become the MASTER-PLAN wave seed.
- Preservation: original component files stay in `source/`; mapping is proposal only.
- Pairs with `server-driven-ui` skill — mapped blocks form the initial SDUI block registry.

## Layer 4: Anti-Patterns

- Auto-rewriting to Genorah block components — user controls the rewrite via `/gen:build`.
- Collapsing two sections into one beat — every source section gets exactly one beat proposal (or `gap:ambiguous-section`).
- Ignoring motion — motion inventory (IntersectionObserver, scroll handlers, GSAP/Framer calls) maps to beat motion blocks.
- Dropping ARIA roles — preserved in mapping so accessibility survives.
