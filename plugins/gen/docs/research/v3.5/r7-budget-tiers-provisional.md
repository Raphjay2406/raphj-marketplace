# R7 — Budget Tier Provisional Baselines

**Status:** PROVISIONAL — validated by measurement against 5 real projects in v3.5.6.

Per-stage token estimates based on v3.5.0–4 instrumentation design (not yet measured empirically).

## Lean mode

| Stage | Tokens (est.) | Notes |
|---|---|---|
| start-project | 8K | PROJECT.md + DNA + 3 research Qs |
| discuss | 10K | brainstorm, single pass |
| plan | 12K | MASTER-PLAN + 6 section PLANs |
| build (per section) | 15K | 6 sections = 90K |
| audit | 30K | Axis 1 + Axis 2 lean (3 personas) |
| iterate (avg 1 cycle) | 20K | |
| ship-check | 3K | |
| **total per project** | **~170K** | single-day landing |

## Standard mode

| Stage | Tokens (est.) |
|---|---|
| start-project | 12K |
| discuss | 15K |
| plan | 18K |
| build | 18K × 8 = 144K |
| audit | 60K (Axis 1 + Axis 2 standard w/ 4 personas) |
| iterate (avg 2 cycles) | 40K |
| critic-loop (2 cycles × critical sections) | 30K |
| variant tournament (Pareto N=3 on 3 beats) | 45K |
| ship-check | 5K |
| **total per project** | **~370K** |

## Max mode

| Stage | Tokens (est.) |
|---|---|
| start-project | 18K |
| discuss | 22K |
| plan | 25K |
| build | 22K × 10 = 220K |
| audit | 120K (Axis 1 + Axis 2 max w/ 6 personas) |
| iterate (avg 3 cycles) | 70K |
| critic-loop (2 cycles × all peak sections) | 60K |
| variant tournament (Pareto N=5 on 5 beats) | 120K |
| narrative-audit | 15K |
| ship-check | 8K |
| **total per project** | **~680K** |

## API spend (AI provider calls, not LLM tokens)

| Mode | Flux/nano-banana | Meshy | Total est. |
|---|---|---|---|
| lean | $2-4 | — | $2-6 |
| standard | $6-12 | $2-4 | $8-18 |
| max | $12-20 | $5-10 | $20-35 |

## Validation

v3.5.6 will update these with actual measurements from 5 real projects per tier. Current numbers are engineering estimates; expect ±30% spread until empirically calibrated.
