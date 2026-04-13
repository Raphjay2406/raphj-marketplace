# v4.0.0 Publish Readiness — 2026-04-12

## Status: READY

All 7 P0 blockers + 18 P1 items resolved. 240+ tests passing. Self-audit 24/24. Offline smoke 24/24.

## Remediation summary (18 commits)

### P0 fixes (7)
- `packages/asset-forge` dep pin 4.0.0-alpha.1 → 4.0.0
- Uncommitted dist artifacts committed
- Circular-followup hop cap in executeRecipe
- 25 legacy archetypes scaffolded → machine-verifiable count (42 total)
- AgUiEmitter wired into daemon SSE stream (heartbeat-only → real events)
- Root + mirror plugin.json descriptions refreshed (v3.25 prose → v4 GA)
- plugins/gen mirror populated with dist/ for all 9 packages

### P1 fixes (18)
- /tmp/ hardcoded paths → os.tmpdir() in 6 asset-forge providers (Windows)
- Theatre/GSAP/Lenis declared as peerDependencies
- marketplace.json keywords trimmed 301 → 45
- CLAUDE.md v3.x body sections refreshed
- Archetype count corrected 50 → 42 everywhere
- MCP count corrected 7 → 10 everywhere
- fastify-sse-v2 rename documented
- README Step 5 output clarified
- 7 new coverage tests: dispatch rethrow, daemon 400, partial(), MemoryGraph project_id, useCameraBookmark, SDUI unknown kind, installAgent network fail
- memory-graph dist built → perf latency test unskipped
- MCP sampling v2 scope clarified in changelog

## Deferred to v4.0.1 / v4.1 (15 P2s)

- daemon-lifecycle silent spawn-fail observability
- offline-mode blocklist additions (stitch, playwright)
- CapabilityProbe/detectWebGpu consolidation
- sandbox `any` → `unknown`
- visitCount silent localStorage fail comment
- SECURITY.md
- packages/marketplace dist pre-build
- perf-budget.ts vs perf-budget.mjs naming
- weights.json totals
- Theatre/GSAP/Lenis move from deps to peerDeps (currently both)
- Minor coverage gaps on optional paths

## Test breakdown (final)

### Workspace packages (Vitest)
| Package | Pass | Skip |
|---------|------|------|
| asset-forge | 39 | 0 |
| canvas-runtime | 75 | 0 |
| generative-archetype | 9 | 0 |
| living-system-runtime | 15 | 0 |
| marketplace | 4 | 2 |
| memory-graph | 3 | 0 |
| protocol | 37 | 0 |
| sdui | 4 | 0 |
| webgpu-effects | 4 | 0 |
| **Subtotal** | **190** | **2** |

### node:test suites
| Suite | Pass | Skip |
|-------|------|------|
| scripts/validators | 14 | 0 |
| scripts/judge-calibration | 4 | 0 |
| scripts/synthetic-persona | 8 | 0 |
| tests/chaos | 10 | 2 |
| tests/migration | 2 | 0 |
| tests/perf | 9 | 0 |
| **Subtotal** | **47** | **2** |

### Root npm test
| Suite | Pass | Skip |
|-------|------|------|
| root (integration) | 109 | 0 |

### Total: 346 pass, 4 skip, 0 fail

### Self-audit: 24/24 passed
### Offline smoke: 24/24 passed

Notes:
- 2 chaos skips: Deno-gated marketplace sandbox tests (Deno not in CI)
- 2 marketplace skips: network-gated installAgent tests (expected in offline environments)

## Version audit
`node scripts/release/audit-versions.mjs 4.0.0` → `ok: all 12 files at 4.0.0`

## Tag

`v4.0.0` moved from `6e01b1a` → `c41f1db` (current HEAD).

```
v4.0.0
v4.0.0-alpha.1
v4.0.0-alpha.2
v4.0.0-alpha.3
v4.0.0-alpha.4
v4.0.0-alpha.5
```

## Ready for

- `git push origin master --tags` to remote
- Claude Code plugin marketplace publish
- Community announcement
