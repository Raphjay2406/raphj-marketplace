---
name: calibration-store
description: L7 of Context Fabric — user-global SQLite at ~/.claude/genorah/calibration.db storing golden-set panel scores, judgment history, κ history, drift alerts, recalibration events. Persists across projects; enables drift detection and quarterly recalibration ritual.
tier: core
triggers: calibration-store, context-fabric-l7, sqlite, golden-set, judge-history, drift, recalibration
version: 0.1.0-provisional
---

# Calibration Store (L7)

Judge reliability is a property of the *machine over time*, not a single session. L7 makes that timeline queryable.

## Layer 1 — When to use

- Every judge call writes a row.
- session-start reads drift-alert view; surfaces if drift > 10%.
- `/gen:calibrate-judge` reads golden set + writes new scoring results.
- `/gen:recalibrate` (quarterly ritual) reads history, proposes threshold updates.

## Layer 2 — Schema

SQLite `~/.claude/genorah/calibration.db`:

```sql
-- Golden set panel scores (seed data)
CREATE TABLE goldens (
  id TEXT PRIMARY KEY,        -- slug matching skills/judge-calibration/golden/<slug>.md
  archetype TEXT NOT NULL,
  beat TEXT NOT NULL,
  design_consensus INTEGER NOT NULL,
  ux_consensus INTEGER NOT NULL,
  panel_json TEXT NOT NULL,   -- array of per-reviewer scores
  captured_at TEXT NOT NULL
);

-- Every judge invocation
CREATE TABLE judgments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  project_id TEXT,
  section_id TEXT,
  subject TEXT NOT NULL,       -- variant id or section id
  judge_model TEXT NOT NULL,
  prompt_hash TEXT NOT NULL,
  design_score INTEGER,
  ux_score INTEGER,
  confidence INTEGER,          -- 1-5
  shot_count INTEGER,          -- few-shot N used
  anchor_slugs TEXT,           -- JSON array of anchor golden slugs
  mode TEXT                    -- 'production' | 'calibration' | 'recalibration'
);

-- Inter-judge κ per high-stakes beat
CREATE TABLE kappa_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  project_id TEXT,
  section_id TEXT NOT NULL,
  judges_count INTEGER NOT NULL,
  kappa REAL NOT NULL,
  verdict TEXT NOT NULL        -- 'ship' | 'tiebreak' | 'warn'
);

-- Drift alerts
CREATE TABLE drift_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  window_days INTEGER NOT NULL,
  delta_rmse REAL NOT NULL,
  resolved_at TEXT,
  resolution TEXT              -- 'recalibrated' | 'model-pinned' | 'dismissed'
);

-- Recalibration events
CREATE TABLE recalibrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  triggered_by TEXT NOT NULL,  -- 'quarterly' | 'drift-alert' | 'manual'
  prior_thresholds_json TEXT,
  new_thresholds_json TEXT,
  approved_by TEXT
);

-- Views
CREATE VIEW latest_drift AS
  SELECT * FROM drift_alerts
  WHERE resolved_at IS NULL
  ORDER BY ts DESC;

CREATE VIEW kappa_trend AS
  SELECT DATE(ts) as day, AVG(kappa) as avg_kappa, COUNT(*) as n
  FROM kappa_history
  GROUP BY DATE(ts)
  ORDER BY day DESC;
```

## Layer 3 — Write path

Every judge call (via `skills/judge-calibration`) appends a `judgments` row. Every 2-judge or 3-judge cycle appends a `kappa_history` row.

Background task (runs on session-end or nightly):
1. Computes rolling 30-day RMSE of judge vs golden set.
2. If Δ > 10% vs baseline, insert `drift_alerts` row.
3. session-start reads `latest_drift`; surfaces as banner.

## Layer 4 — Read path

### session-start

```
SELECT COUNT(*) FROM latest_drift;  -- show banner if > 0
SELECT AVG(kappa) FROM kappa_history WHERE ts > datetime('now', '-7 day');  -- show in status
```

### /gen:calibrate-judge

```
1. Re-run pinned judge on all goldens (mode='calibration').
2. Compute ΔRMSE vs stored consensus.
3. Insert rows to judgments; print diff.
```

### /gen:recalibrate

```
1. Run R1/R5 protocols.
2. Propose new thresholds (few-shot N, κ floor, UX archetype floors).
3. Prompt user approval.
4. On approval: insert recalibrations row; update .claude-plugin/config.json.
```

## Layer 5 — Cross-project

L7 is user-global, shared across projects. Enables:
- "Judge drift from my last project still affects current project"
- "UX floor for Editorial calibrated from Projects A+B+C (not just current)"
- Accumulated calibration quality improves over time

Privacy: only scores + metadata stored; no project content.

## Layer 6 — Anti-patterns

- ❌ Storing full prompts in judgments — just the hash; prompts can be recovered from ledger if needed.
- ❌ Running production judgments without writing to store — drift detection blind.
- ❌ Skipping session-start drift check — stale calibration silently affects every new project.
- ❌ Recalibrating without approval step — shipping default changes need human sign-off.
- ❌ Clearing the store to "start fresh" — destroys accumulated learning; use `recalibrations` table to supersede instead.
