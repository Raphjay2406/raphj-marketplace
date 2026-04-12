---
name: wave-resume
description: Partial wave failure recovery. Tracks per-section state (pending/building/built/reviewing/shipped/failed) in STATE.md; /gen:build --resume detects and retries only failed/pending sections. No redundant rebuilds.
tier: core
triggers: wave-resume, partial-wave, section-state, recovery, build-resume
version: 0.1.0
---

# Wave Resume

When wave N has 2/4 sections shipped and 2 failed, `/gen:build --resume` must retry only the 2 failures without wasting tokens on the 2 successes.

## Layer 1 — When to use

- Mid-wave crash (agent timeout, MCP outage, user Ctrl-C)
- Post-review polish of specific failed sections
- Continuing an abandoned session days later

## Layer 2 — State machine

Per section:

```
pending ──► building ──► built ──► reviewing ──► reviewed ──► shipped
                │                      │                      │
                └──► failed ◄──────────┴──────────────────────┘
```

Transitions logged to ledger with timestamps.

## Layer 3 — STATE.md schema (extension)

```json
{
  "current_stage": 7,
  "wave": {
    "id": 2,
    "sections": [
      { "id": "hero", "state": "shipped", "ts_shipped": "2026-04-12T10:15:00Z" },
      { "id": "features", "state": "shipped", "ts_shipped": "2026-04-12T10:23:00Z" },
      { "id": "pricing", "state": "failed", "ts_failed": "2026-04-12T10:28:00Z",
        "failure_code": "GENORAH_GATE_HARD_FAIL",
        "failure_detail": "archetype-specificity: mandatory marker 'grid-cols-12' missing" },
      { "id": "testimonials", "state": "failed", "ts_failed": "2026-04-12T10:30:00Z",
        "failure_code": "GENORAH_AGENT_TIMEOUT" }
    ],
    "completion_ratio": 0.5
  }
}
```

## Layer 4 — Resume protocol

```
/gen:build --resume
1. Read STATE.md → identify pending + failed sections
2. For each failed: display failure_code + suggested remediation from error-taxonomy
3. Prompt user: retry | skip | edit-plan-then-retry
4. Retry path: rebuild only those sections, preserve other section files untouched
5. Skip path: mark section as skipped (still counted against coverage)
```

## Layer 5 — Integration

- Builder spawn checks STATE.md before starting; skips already-shipped sections
- quality-reviewer re-audits only retried sections; preserves prior audit artifacts for shipped
- Ledger receives `{kind: "wave-resumed", payload: {retried: [...], skipped: [...]}}`
- Dashboard shows wave completion_ratio live

## Layer 6 — Anti-patterns

- ❌ Fresh rebuild after partial success — burns tokens, invalidates user's review on already-shipped
- ❌ Continuing without addressing failure_code — same failure will repeat
- ❌ Manually editing STATE.md — use `/gen:state` commands instead
