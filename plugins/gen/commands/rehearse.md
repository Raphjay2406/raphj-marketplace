---
description: "Pre-Build Rehearsal — dry-run one canary section from scaffold to full-build. If canary fails hard gates, the PLAN is the bug; cheaper than burning a full wave."
argument-hint: "[section-id] [--no-cleanup]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
recommended-model: sonnet-4-6
---

# /gen:rehearse

v3.5.3 pipeline-depth Stage 6. The cheapest failure detection in the pipeline.

## Workflow

### 1. Select canary

- Default: first HOOK-beat section from MASTER-PLAN.md (highest expressive stakes)
- `<section-id>`: specific section override
- Must not already be built

### 2. Full-path build canary

1. Spawn builder normally (as in `/gen:build`).
2. Builder produces real files in a quarantined branch: `sections/{id}-rehearsal/`.
3. Run quality-gate-v3 both axes.
4. Run archetype testable-markers grep.
5. Run DNA drift check.
6. Run 4-breakpoint visual QA.

### 3. Diagnose

If canary hits ≥ Baseline tier and clears hard gates → **Plan is sound**. Proceed with main build.

If canary fails:
- Archetype specificity fail (missing mandatory markers) → PLAN specifies wrong archetype OR plan techniques don't deliver archetype
- DNA drift fail → DESIGN-DNA.md internally inconsistent with PLAN content targets
- Motion-health fail → PLAN demands motion unsupported on target perf budget
- UX floor fail → PLAN content hierarchy or CTA structure fundamentally broken

Write remediation suggestions to `.planning/genorah/rehearsal-report.md`.

### 4. Cleanup

Default: delete canary branch (files in `sections/{id}-rehearsal/`).
`--no-cleanup`: keep for review.

Canary artifacts never pollute the real section directories.

### 5. Ledger

```json
{
  "kind": "rehearsal-completed",
  "subject": "<id>",
  "payload": {
    "tier": "Strong",
    "design": 182,
    "ux": 94,
    "hard_gates_passed": true,
    "verdict": "plan-sound" | "plan-bug",
    "remediations": []
  }
}
```

## Output

```
REHEARSAL — hero (canary)
=========================
Build:           ✅ 84s, 12.4K tokens
Quality:         Strong tier (design 182 / ux 94)
Hard gates:      ✅ motion, ✅ responsive, ✅ compat, ✅ registry, ✅ specificity
DNA drift:       ✅ 96.2% coverage

VERDICT: Plan sound. Proceed with /gen:build.
Cleanup: sections/hero-rehearsal/ removed.
```

## Pipeline guidance

After PASS: `/gen:build` with confidence.
After FAIL: `/gen:plan` with remediation notes (NOT just rebuild the canary).

## Anti-patterns

- ❌ Rehearsing every section — that's `/gen:build`; rehearse ONE.
- ❌ Proceeding to full build after a FAIL verdict — you're building on a broken plan.
- ❌ Treating Baseline as "good enough" canary — HOOK canary should hit Strong minimum; weaker archetype delivery means plan-level issue.
