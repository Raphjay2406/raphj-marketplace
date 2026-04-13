# v4 M3 Completion Summary

**Tag:** v4.0.0-alpha.3
**Date:** 2026-04-12
**Scope:** Asset Forge 2.0 — full M3 batch

## 5 New MCP Integrations

| MCP | Provider | Kind |
|-----|----------|------|
| Rodin Gen-2 | Hyper3D | 3D mesh generation |
| Meshy 5 | Meshy | 3D mesh + texture |
| Flux Kontext | Black Forest Labs | Image generation + editing |
| Recraft V3 | Recraft | Vector + raster image |
| Kling 2.1 | Kuaishou | Video generation |

All ship as providers in `packages/asset-forge/src/providers/`.

## 3 Canonical Recipes

| Recipe | Steps | Description |
|--------|-------|-------------|
| `recipes/brand-marks.yml` | 3 | Vector brand marks + favicon + OG template via recraft-vector-author |
| `recipes/hero-scene.yml` | — | Hero 3D scene via Rodin + Meshy pipeline |
| `recipes/photoreal-character-product.yml` | — | Character + product photorealism via Flux Kontext |

## Asset Cache + Cost Ledger + Provenance

- **`AssetCache`** — SQLite-backed (Keyv + @keyv/sqlite), sha256 cache key, `init()` / `get()` / `set()` / `has()` / `close()` API
- **`CostLedger`** — budget tracking with warn threshold, downgrade chain, `status()` OK/warn/exceeded
- **`ProvenanceWriter`** — append-only `MANIFEST.json` (schema_version 4.0.0), sha256 deduplication, `parent_sha256` for derivative assets

## Scene Craft — 13th Quality Category

- `scripts/validators/scene-craft.mjs` — 20-pt rubric (cinematic/immersive only)
- 5 criteria: camera coherence (5), morph smoothness (4), lighting consistency (4), material realism (4, partial credit), perf budget (3)
- Design Craft axis: **234 → 254 pts** (cinematic/immersive). Non-cinematic projects retain 234-pt denominator.
- `skills/quality-gate-v3/SKILL.md` updated: tier thresholds table for both 254-pt and 234-pt denominators

## Integration Test

- `packages/asset-forge/tests/integration-recipe.test.ts` — full brand-marks.yml E2E with DummyProvider, AssetCache, CostLedger, ProvenanceWriter

## Test Counts

- `packages/protocol`: **33 tests passing**
- `packages/canvas-runtime`: **74 tests passing**
- `packages/asset-forge`: **37 tests passing** (14 test files)
- `scripts/validators/*.test.mjs`: **11 tests passing** (archetype-registry + perf-budget + scroll-coherence + scene-craft)

## Commits (M3)

| SHA | Description |
|-----|-------------|
| fd27bfd | feat(v4-m3): Scene Craft 13th quality category (Design Craft -> 254) |
| 8fb0051 | test(v4-m3): recipe E2E with cache + ledger + provenance |
| 5f5e20f | test(v4-m3): fix SQLite teardown in recipe E2E — add AssetCache.close() |
| (version bump) | chore(v4-m3): v4.0.0-alpha.3 |
| (docs) | docs(v4-m3): M3 completion summary |
