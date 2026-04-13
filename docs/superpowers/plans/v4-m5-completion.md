# v4 M5 Completion — Beyond Limits

**Tag:** v4.0.0-alpha.5  
**Branch:** master  
**Date:** 2026-04-12

## New Packages (4)

- `@genorah/memory-graph` — sqlite-vec cross-project memory graph with cosine recall
- `@genorah/marketplace` — agent registry client with sha256 integrity + Deno sandbox
- `@genorah/sdui` — server-driven UI schema + Zod discriminated-union renderer
- `@genorah/webgpu-effects` — noise, dither, color-grade WebGPU UI shaders

## New Scripts

- `scripts/judge-calibration/` — delta log append, recalibrate, Bayesian weight update
- `scripts/synthetic-persona/` — streaming persona runner emitting AG-UI findings mid-wave
- `scripts/gen-memory-query.mjs` — semantic recall from memory-graph
- `scripts/gen-marketplace-run.mjs` — discover + install + sandbox agents from CLI
- `scripts/tests/offline-smoke.mjs` — GENORAH_OFFLINE=1 self-audit smoke runner (13/13 ✓)

## New Hook (1)

- `.claude-plugin/hooks/offline-mode-gate.mjs` — blocks network tools when GENORAH_OFFLINE=1

## New Skill Docs (6)

- `skills/streaming-pipeline-events/` — AG-UI event model for pipeline workers
- `skills/sqlite-vec-memory-graph/` — cross-project memory via @genorah/memory-graph
- `skills/self-improving-judge/` — quarterly recalibration via delta log
- `skills/agent-marketplace-client/` — discover/install/sandbox flow
- `skills/offline-first-mode/` — GENORAH_OFFLINE=1 invariants and stub pattern
- `skills/synthetic-user-streaming/` — mid-wave streaming persona findings (verified 4-layer)

## Worker Bodies Completed (3)

- `agents/workers/chat-ui-author.md` — full AI SDK v6 useChat + DNA token bindings
- `agents/workers/rag-pipeline-author.md` — Supabase pgvector + embed + streamText
- `agents/workers/agent-trace-ui-author.md` — ToolLoopAgent + AG-UI per-step trace UI

## Tag

`git tag v4.0.0-alpha.5 -m "v4 M5 shipping: beyond limits"`

## Counts at Tag

- Agent cards: 108 (10 directors + 98 workers)
- Skills: 313+
- Commands: 59+
- Self-audit: 13/13 passing
