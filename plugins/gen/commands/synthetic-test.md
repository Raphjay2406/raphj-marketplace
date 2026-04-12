---
description: "Standalone synthetic-user testing — spawn 6 (or budget-limited) AI personas via Playwright, run structured task probes, aggregate into Synthetic Usability score (20pt of quality-gate-v3 Axis 2). Subset of /gen:ux-audit scope."
argument-hint: "[section-id] [--personas lean|standard|max] [--persona P1|P2|...]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_resize, mcp__plugin_playwright_playwright__browser_click, mcp__plugin_playwright_playwright__browser_hover, mcp__plugin_playwright_playwright__browser_press_key, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_evaluate, mcp__plugin_playwright_playwright__browser_snapshot, mcp__plugin_playwright_playwright__browser_wait_for
recommended-model: sonnet-4-6
---

# /gen:synthetic-test

v3.5.1. Spawns `ux-probe` agent per persona to drive Playwright task probes.

## Workflow

### 1. Scope

- `<section-id>` → single section; default all sections
- `--persona P1` → single-persona run
- `--personas lean|standard|max` → budget mode

### 2. Spawn personas in parallel

Per budget:

| Mode | Personas |
|---|---|
| lean | P2 (First-timer), P3 (Power user), P4 (Mobile) |
| standard | + P1 (Skeptic CFO) |
| max | + P5 (Screen-reader), P6 (B1 non-native) |

Each persona → one `ux-probe` agent spawn with structured input (see `agents/specialists/ux-probe.md` §Input contract).

### 3. Collect reports

Each persona writes `.planning/genorah/audit/synthetic/{section_id}/{persona}.json`. Wait for all spawned probes to complete.

### 4. Aggregate

Per section:

```
persona_score(p) = task_completed(p) * (self_report.score / 5) * metric_factor(p)
section_score = sum(persona_scores) * (20 / personas_run)
```

`metric_factor` per persona from `docs/research/v3.5/r10-synthetic-snr.md` when calibrated; defaults 1.0 in v3.5.1.

### 5. Report

```
SYNTHETIC USER TEST — hero
==========================================
Personas: P1, P2, P3, P4 (standard mode)
Total score: 15.3 / 20

P1 Skeptic CFO:     4.0  (task: found trust + CTA in 3.2s; confidence 4/5)
P2 First-timer:     3.8  (comprehension 4/5; 1 back-navigation on features)
P3 Power user:      3.2  (4 clicks to pricing; frustrated at filter UX)
P4 Mobile:          4.3  (scrolled to bottom; CTA clearly visible)

Fails:
  - P3: pricing path is 4 clicks; expected ≤ 2 for power users
  - P2: "Architect your flow" confusing to non-domain users — rewrite?
```

### 6. Ledger

```json
{
  "kind": "synthetic-test-completed",
  "subject": "hero",
  "payload": { "score": 15.3, "personas": ["P1","P2","P3","P4"], "failures": 2 }
}
```

## Integration

- Subset of `/gen:ux-audit` scope — use standalone for quick persona-only run.
- Feeds Axis 2 `synthetic-user-testing` sub-gate score.
- Running multiple times without code changes uses cached reports (keyed by section content hash).

## Anti-patterns

- ❌ Interpreting single persona's failure as full gate fail — aggregate requires all chosen personas.
- ❌ Running `max` mode on every iterate cycle — budget drain; save max for pre-ship audit.
- ❌ Persona reports with no `evidence.steps[]` — reject; rerun with strict mode.
