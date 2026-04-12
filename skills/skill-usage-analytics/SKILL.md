---
name: skill-usage-analytics
description: Skill injection analytics. Which of N skills are actually loaded? Candidates for auto-deprecation. Local-first; opt-in aggregation via plugin-telemetry.
tier: domain
triggers: skill-usage, skill-analytics, deprecation-candidates
version: 0.1.0
---

# Skill Usage Analytics

Local dashboard tab showing which skills get injected + how often. Input for deprecation decisions.

## Layer 1 — Local tracking

`hooks/pre-tool-use.mjs` already tracks injections. Extended writes to `~/.claude/genorah/usage/skills.ndjson`:

```json
{"ts":"2026-04-12T10:00:00Z","skill":"design-dna","trigger":"path-pattern","target":"sections/hero/Hero.tsx"}
```

## Layer 2 — Query

`scripts/skill-usage.mjs`:

```bash
node scripts/skill-usage.mjs report --days 30
```

Output:
```
SKILL USAGE (last 30 days, across all projects)
================================================
Injected      Skill
3421          design-dna
2834          design-archetypes
2201          quality-gate-v2
 891          cinematic-motion
...
   0          dashboard-patterns  ← deprecation candidate
   0          3d-asset-generation
```

## Layer 3 — Auto-deprecation proposal

Skills with 0 injections over 90 days → propose deprecation. Dashboard shows:

```
DEPRECATION CANDIDATES
  - dashboard-patterns (0 injections, 90 days)
    Mark deprecated? [y/N]
```

Deprecated skills marked `deprecated_at: 2026-04-12` in frontmatter; hidden from suggestions but still usable if explicitly invoked. Removed in next major.

## Layer 4 — Cross-user patterns (via telemetry opt-in)

When plugin-telemetry enabled:
- Compare local vs global usage
- Flag skills you under-use (others find valuable)
- Flag skills you over-use (others don't need)

## Layer 5 — Integration

- Dashboard skill-usage tab
- `/gen:plugin-health` standalone report
- Ledger: `deprecation-proposed`

## Layer 6 — Anti-patterns

- ❌ Auto-delete unused skills — user might invoke rarely but critically
- ❌ Counting skill file presence as "used" — count actual injections
- ❌ Short window (7 days) — seasonal skills penalized; use 90+
