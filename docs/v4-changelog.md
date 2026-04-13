# Genorah v4.0.0 Changelog

**Release date:** 2026-04-13
**Tag:** `v4.0.0`
**Codename:** Cinematic Intelligence

---

## Pillar 1 — AG-UI Protocol + Canvas Runtime

- **AG-UI v0.3 event protocol** — 14-event schema (`TEXT_MESSAGE_START`, `TEXT_MESSAGE_CONTENT`,
  `TEXT_MESSAGE_END`, `TOOL_CALL_START`, `TOOL_CALL_ARGS`, `TOOL_CALL_END`, `TOOL_CALL_RESULT`,
  `STATE_SNAPSHOT`, `STATE_DELTA`, `MESSAGES_SNAPSHOT`, `RAW`, `ERROR`, `STEP_STARTED`,
  `STEP_FINISHED`) with Zod validation; `@genorah/protocol` package.
- **Canvas runtime** (`@genorah/canvas-runtime`) — AG-UI event bus, SSE transport, multi-adapter
  support (stdout / WebSocket / HTTP streaming), reconnect + heartbeat.
- **108 A2A agent cards** — Full directory in `.claude-plugin/generated/agent-cards.json`;
  10 director agents + 98 worker agents; capability taxonomy with 6 capability types.
- **Tiered agent routing** — Director agents handle delegation; worker agents execute tasks;
  `SendMessage` hook validates schema before dispatch.
- **Agent message validator** hook — Pre-tool-use validation of A2A message shapes; rejects
  malformed payloads before they reach worker agents.

## Pillar 2 — Generative Archetypes v2

- **42 archetypes** (was 33) — 17 new archetypes including Cinematic Scroll, Particle Storm,
  Liquid Metal, Vapor Drift, Prismatic Clarity, Brutalist Future, Neon Bloom, Stone & Light,
  Circuit Gothic, Acid House, Chromatic Brutalism, Aurora, Aether, Bioluminescent, Deep Ocean,
  Desert Glass, and Monastic.
- **Fractal mixing protocol** — Up to 3 archetypes with weighted blend; mixer validates that
  primaries sum to ≥60% and secondaries do not conflict on forbidden-pattern axes.
- **DNA mutation engine** (`@genorah/generative-archetype`) — Parameterized DNA generation with
  seed-based reproducibility; 7 mutation axes (hue rotation, scale variance, motion amplitude,
  texture grain, contrast push, typographic weight, spacing multiplier).
- **Archetype-to-agent routing** — Each archetype declares preferred director/worker agent IDs
  for build, audit, and refinement phases.

## Pillar 3 — Living System Runtime

- **Self-healing components** (`@genorah/living-system-runtime`) — Components emit health events;
  drift threshold triggers auto-revert to last known-good snapshot.
- **Drift monitor** — Watches DNA token application in rendered output; emits `STATE_DELTA`
  AG-UI events when computed CSS deviates >5% from DNA spec.
- **Canary validator** — Parallel validation agent; runs quality-gate spot-checks during builds
  without blocking the main wave.
- **Wave-resume hardening** — `scripts/wave-resume.mjs` persists wave state to
  `.planning/genorah/wave-state.json`; resume-after-interrupt is fully idempotent.
- **MCP sampling v2 adapter** — schema + in-process registry scaffolded; full Claude/MCP host integration deferred to v4.1.

## Pillar 4 — Memory Graph

- **Episodic memory** (`@genorah/memory-graph`) — Cross-session project memory with BM25 retrieval;
  stores design decisions, audit findings, and resolved gaps.
- **Context fabric upgrade** — L8 layer adds user-global style preferences; L7 calibration store
  upgraded with v4 agent IDs.
- **Agent episodic memory skill** — `skills/agent-episodic-memory/` documents the 8-layer fabric
  and BM25 indexing protocol for agents.
- **Cross-session continuity** — SESSION-LOG.md now includes memory-graph delta summary for
  compaction-safe recovery.

## Pillar 5 — Marketplace

- **Plugin marketplace** (`@genorah/marketplace`) — Versioned plugin registry with dependency
  resolution, semver range matching, and install lock-file.
- **`/gen:marketplace`** command — `list`, `install <plugin>@<version>`, `publish`, `sandbox`
  subcommands; sandbox requires Deno 2.x.
- **Marketplace manifest** (`.claude-plugin/marketplace.json`) — Declares all available plugins
  with capability tags and compatibility matrix.
- **Component marketplace** skill — `skills/component-marketplace/` covers plugin authoring,
  versioning, and publish workflow.

## Pillar 6 — Shakedown + Quality Gate v4

- **394-pt quality gate** (was 354pt) — Two new axes: Cinematic Motion (20pt) and AG-UI Protocol
  Compliance (20pt). Existing axes rescaled proportionally.
- **Chaos regression suite** (`tests/chaos/`) — 5 chaos tests: circular followup cap, budget
  exhaustion, state corruption, tool timeout, concurrent wave collision.
- **Performance tests** (`tests/perf/`) — LCP budget enforcement, JS bundle size cap (300KB
  first-load), memory-graph latency (<50ms p95).
- **v3→v4 migration E2E** (`tests/migration/v3-to-v4.test.mjs`) — Full idempotency verification
  across all 6 migration steps; fixture from real v3.25 project.
- **`scripts/gen-self-audit.mjs`** — Validates plugin consistency (version parity, agent card
  count, archetype count, skill count, quality gate total) with BLOCK/WARN/INFO tiers.
- **Offline smoke** (`scripts/tests/offline-smoke.mjs`) — Validates core pipeline with
  `GENORAH_OFFLINE=1`; confirms graceful degradation of all 7 MCP integrations.

## Hardening + Infrastructure (M6)

- **v3→v4 migration guide** (`docs/v4-migration-guide.md`) — Breaking changes, env vars,
  step-by-step upgrade, rollback.
- **Agent directory** (`docs/v4-agent-directory.md`) — Generated from agent-cards.json; 108
  entries with capability tables.
- **Release version audit** (`scripts/release/audit-versions.mjs`) — Validates version parity
  across all `package.json` and manifest files.
- **Release notes generator** (`scripts/release/notes.mjs`) — Prints changelog summary + git
  log since v3.25.0.
- **Telemetry first-run refresh** — v4 data points added: skill injections, AG-UI event counts,
  validator verdicts; session-start hook emits UI_RENDER trigger on first run.
- **Full regression pass** — 109/109 tests passing across all packages and test suites.
- **v4.0.0 tag** — `git tag v4.0.0 -m "Genorah v4.0.0 — Cinematic Intelligence (GA)"`

## Previous Milestones Included in v4.0.0

Genorah v4 builds on the full v3 foundation (v3.21–v3.25):

- v3.25: Exact-preset easing baselines + sitemap error observability + localized Contentful fields
- v3.24: Integration tests + `/gen:ingest motion` + `/gen:ingest cms` subcommands
- v3.23: ΔE2000 perceptual distance + recursive sitemap BFS + motion inventory + CMS schema
- v3.22: Ingestion depth + E2E proven against plugin self-ingest
- v3.21: Preservation-first ingestion suite — append-only ledger, DNA reverse-engineer, archetype
  inference, Playwright crawl, pixel-kmeans

---

## Upgrade Path

See [`docs/v4-migration-guide.md`](./v4-migration-guide.md).
