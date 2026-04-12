# Migration v3.4 → v3.5

## Breaking changes

None. v3.5 is backward-compatible. Existing v3.4 projects continue to work.

## New concepts to adopt

### Quality gate v3 (354pt two-axis)

v3.4 gate: 234pt single axis.
v3.5 gate: 354pt = 234 (Design, unchanged) + 120 (UX, new). Sections now scored on BOTH axes.

**Migration:** v3.4 projects can continue using v2 gate until they're ready to upgrade. To adopt v3:
1. Update `.claude-plugin/config.json` → `"quality_gate": "v3"`
2. Re-audit existing sections; expect UX axis to score 60-85 initially (legacy sections not designed for UX gate)
3. Budget additional iteration cycles to bring UX into spec

### Context Fabric (L1-L8)

v3.4 stored state in DECISIONS.md, STATE.md, METRICS.md (scattered).
v3.5 adds:
- L4 ledger (`journal.ndjson`) — every significant event
- L5 semantic-index (BM25 over ledger)
- L7 calibration-store (user-global `~/.claude/genorah/calibration/`)

**Migration:** happens automatically. Old artifacts stay. New ledger begins fresh. Run `/gen:calibrate-judge` to seed L7.

### Asset Forge + MANIFEST.json

v3.4 assets: ad-hoc in `public/`.
v3.5: every asset in `public/assets/MANIFEST.json` with license + cache_key + DNA coverage.

**Migration:** run `/gen:assets audit` on existing project. Reports manifest_drift for unregistered files. Build MANIFEST.json incrementally.

### Testable markers (hard-gate #5)

v3.4: archetype specificity was subjective.
v3.5: grep-based mandatory/forbidden/signature regexes per archetype.

**Migration:** `/gen:audit` now enforces. Known archetype sections should pass; generic-premium sections will fail. Fix by applying archetype patterns or documenting tension_override.

### Pipeline depth (14 stages)

v3.4: ~7 stages.
v3.5: 14 stages add Intent Alignment (1), Plan Review (5), Rehearsal (6), Mid-Wave Reconciliation (8), Narrative Audit (10), Regression Check (11), Ship-Check (12), Post-Ship Learning (14).

**Migration:** new stages are opt-in. Run `/gen:align` before `/gen:plan` when ready. `/gen:ship-check` replaces manual ship checklist.

## Deprecated (still works, migration encouraged)

- DECISIONS.md as source — v3.5 uses `decisions.json` as canonical; markdown is render surface
- Quality-gate-v2 — still valid through v3.5.x; v3.6 may deprecate further
- Scalar variant tournament — Pareto variant selection on HOOK/PEAK/CLOSE; scalar still valid for other beats

## New scripts + commands

- `scripts/pareto-select.mjs`, `scripts/decision-graph.mjs`, `scripts/agent-memory.mjs`, `scripts/calibration-store.mjs`, `scripts/semantic-index.mjs`, `scripts/reference-library-index.mjs`, `scripts/ship-check.mjs`, `scripts/regression-diff.mjs`, `scripts/cost-tracker.mjs`, `scripts/dashboard-v2-data.mjs`, `scripts/asset-forge/*.mjs`
- Commands: `/gen:assets`, `/gen:align`, `/gen:rehearse`, `/gen:ship-check`, `/gen:ux-audit`, `/gen:narrative-audit`, `/gen:regression`, `/gen:postship`, `/gen:recalibrate`, `/gen:research`, `/gen:variant`, `/gen:synthetic-test`, `/gen:critic`, `/gen:trajectory`

## Hook upgrades (automatic)

- `pre-compact.mjs` — writes Compaction-Survivor summary
- `session-start.mjs` — drift alert banner + resume re-emission
- `session-end.mjs` — post-ship capture nudge
- `post-tool-use.mjs` — curated ledger emissions

No action required; hooks are plugin-internal.

## Environment variables

v3.5 introduces:
- `DNA_STRICT=1` — upgrade DNA drift from WARN to BLOCK
- `MESHY_API_KEY` — enable Meshy MCP (optional)
- `FLUX_API_KEY` — Flux MCP (optional, v3.5.6+)
- `RECRAFT_API_KEY` — Recraft MCP (optional, v3.5.6+)
- `REPLICATE_API_TOKEN` — SUPIR upscaling fallback (optional)

## Verification

After migration:
1. `npm run validate` — all 64+ tests should pass
2. `node scripts/ship-check.mjs` — no BLOCK on existing project
3. `/gen:status` — pipeline stage still readable
4. Check `.planning/genorah/journal.ndjson` has new entries post-session
