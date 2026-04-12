---
description: "Research program runner. Subcommands: run <track> | status | query | snapshot. Orchestrates R1-R10 experiments, aggregates results, queries metrics warehouse across projects."
argument-hint: "run <track> | status | query '<sql-like>' | snapshot"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
recommended-model: opus-4-6
---

# /gen:research

v3.5.3. Runs and queries the empirical research program.

## Subcommands

### `run <track>`

`track ∈ {r1..r10}`. Spawns `research-runner` agent with track protocol.

Example: `/gen:research run r3`
- Runs Pareto-N sweep per `docs/v3.5-research-program.md` R3
- Generates N ∈ {1,3,5,7,10} on 20 HOOK/PEAK sections from variant-archive
- Measures score vs token cost
- Writes `docs/research/v3.5/r3-pareto-sweep.md`

### `status`

Shows:
- Which tracks have produced artifacts
- Sample sizes per track
- Last-run timestamp per track
- Pending experiments (user started but didn't complete)

### `query '<sql>'`

DuckDB query over metrics warehouse (`~/.claude/genorah/warehouse.duckdb`).

Example:

```
/gen:research query 'SELECT archetype, AVG(final_ux) FROM sections GROUP BY archetype ORDER BY 2 DESC'
```

Returns aggregated results. Useful for:
- "Which archetypes hit UX floor most consistently?"
- "What's my median token cost per budget mode?"
- "How often does critic-cycle-2 improve score?"

### `snapshot`

Aggregates current session metrics + variant-archive + per-section trajectories into the warehouse. Runs automatically on session-end; manual invocation useful mid-session.

## Warehouse schema

```sql
-- From journal across all projects
sections (
  project_id, section_id, archetype, beat, budget_mode,
  initial_design, initial_ux, final_design, final_ux,
  iterations_count, tokens_total, elapsed_s,
  shipped, user_modified_after
)

variants (
  project_id, section_id, variant_ix, archetype, beat,
  design, ux, archetype_fit, reference_ssim,
  pareto_front_member, selected_winner, tokens_used
)

critiques (
  project_id, section_id, persona, cycle,
  critical_count, high_count, medium_count, low_count,
  before_score, after_score, reverted
)

judgments (
  project_id, section_id, subject, judge_model,
  design_score, ux_score, kappa, confidence, shot_count
)

drift_alerts (
  project_id, ts, window_days, delta_rmse,
  resolved_at, resolution
)
```

## Research-runner agent

See `agents/specialists/research-runner.md`. Orchestrates specific track protocols, writes results.

## Integration

- Feeds `/gen:recalibrate` with R1/R5 data.
- Dashboard Research tab renders:
  - Sample size per track
  - Effect sizes per finding
  - Recommendations pending shipping

## Anti-patterns

- ❌ Running tracks with sample < protocol minimum — underpowered results; either gather more data or skip.
- ❌ Publishing results without protocol trace — reproducibility lost.
- ❌ Warehouse queries treating cross-project data as aggregate without weighting — single huge project skews means.
- ❌ Running `snapshot` during active build — race with in-flight writes; let session-end handle.
