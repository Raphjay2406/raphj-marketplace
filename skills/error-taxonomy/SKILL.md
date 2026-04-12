---
name: error-taxonomy
description: Structured error codes with recovery guidance. Every agent / script / hook failure surfaces via a GenorahError class with code, message, recovery steps, and ledger reference. Enables dashboard grouping + troubleshooting playbook links.
tier: core
triggers: error-taxonomy, error-recovery, genorah-error, troubleshooting
version: 0.1.0
---

# Error Taxonomy

Single source of truth for Genorah error codes. Every user-visible failure uses this vocabulary.

## Layer 1 — When to use

All agents, scripts, hooks, and commands throw errors with structured codes. Dashboard reads codes for grouping; troubleshooting playbook links by code.

## Layer 2 — Code namespace

Format: `GENORAH_<CATEGORY>_<DETAIL>`

### Categories

| Category | Examples |
|---|---|
| CONFIG | missing config, bad values |
| STATE | STATE.md inconsistent, wave state ambiguous |
| VALIDATION | schema failures, required fields missing |
| MCP | MCP unavailable or errored |
| AGENT | agent spawn failure or produced bad output |
| GATE | hard gate or sub-gate failure |
| BUDGET | budget exceeded |
| DEP | missing tool, file, dependency |
| RUNTIME | tool call failures, exhausted retries |

### Registered codes (v3.5.6 seed)

- `GENORAH_CONFIG_DNA_MISSING` — DESIGN-DNA.md not found
- `GENORAH_CONFIG_PROJECT_MISSING` — PROJECT.md not found
- `GENORAH_STATE_WAVE_AMBIGUOUS` — partial wave failure; use /gen:build --resume
- `GENORAH_STATE_SECTION_NOT_BUILT` — operation requires shipped section
- `GENORAH_VALIDATION_SCHEMA` — AJV or frontmatter schema failure
- `GENORAH_VALIDATION_MANIFEST` — asset manifest drift or missing entry
- `GENORAH_MCP_UNAVAILABLE_FLUX` — Flux MCP not connected
- `GENORAH_MCP_UNAVAILABLE_MESHY` — Meshy MCP not connected (MESHY_API_KEY missing)
- `GENORAH_MCP_UNAVAILABLE_RECRAFT` — Recraft MCP not connected
- `GENORAH_MCP_CRASH_PLAYWRIGHT` — Playwright MCP crashed mid-session
- `GENORAH_MCP_NSFW_BLOCK` — image provider safety block triggered
- `GENORAH_AGENT_SPAWN_FAILED` — specialist agent spawn did not produce expected output
- `GENORAH_AGENT_TIMEOUT` — persona probe or other agent exceeded time budget
- `GENORAH_GATE_HARD_FAIL` — one of 5 hard gates failed (identify which in detail)
- `GENORAH_GATE_SUBGATE_FAIL` — sub-gate fail (specify: motion-health, dna-drift, archetype-specificity, ssim, asset-compliance)
- `GENORAH_GATE_UX_FLOOR` — UX axis below archetype floor after 3 iterations
- `GENORAH_BUDGET_TOKENS_EXCEEDED` — session token cap hit
- `GENORAH_BUDGET_API_USD_EXCEEDED` — API $ cap hit
- `GENORAH_DEP_MISSING_TOOL` — required CLI binary not on PATH (detail: which)
- `GENORAH_DEP_MISSING_FILE` — required file not found (detail: path)
- `GENORAH_DEP_NODE_VERSION` — Node version below minimum
- `GENORAH_RUNTIME_DISK_FULL` — disk space < 500MB; writes blocked
- `GENORAH_RUNTIME_JUDGE_KAPPA_LOW` — inter-judge κ < 0.5; tiebreaker required

### Error structure

```json
{
  "code": "GENORAH_GATE_SUBGATE_FAIL",
  "message": "Motion-health sub-gate failed for section 'hero': INP p75 220ms exceeds budget 200ms.",
  "detail": {
    "section": "hero",
    "subgate": "motion-health",
    "metric": "inp_p75",
    "observed": 220,
    "budget": 200
  },
  "recovery": [
    "Reduce concurrent animations (currently 8, PEAK budget 12 but this is HOOK)",
    "Defer non-critical animation to intersection observer",
    "Check skills/motion-health/SKILL.md per-beat budgets",
    "See docs/troubleshooting/GENORAH_GATE_SUBGATE_FAIL.md"
  ],
  "ledger_ref": ".planning/genorah/journal.ndjson:2456"
}
```

## Layer 3 — Integration

- Every error emitted to stderr AND written to ledger as `{kind: "error-raised", payload: <error>}`
- Dashboard error panel groups by `code`, drilldown to recent occurrences
- `/gen:next` command detects recent unresolved errors and suggests recovery
- Troubleshooting playbook at `docs/troubleshooting/<CODE>.md` — one file per code

## Layer 4 — Anti-patterns

- ❌ Free-form error strings — breaks dashboard grouping; every user-facing error has a code
- ❌ Swallowing errors with `try { } catch { }` — log to ledger even if recovered
- ❌ `recovery` field missing — every error must be actionable
- ❌ Generic codes (`GENORAH_ERROR_GENERIC`) — always add detail
- ❌ Omitting `ledger_ref` — investigators can't follow up
