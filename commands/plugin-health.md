---
description: "Plugin health dashboard — skill usage stats, command invocations, agent outcomes, deprecation candidates. Local-first; aggregated cross-user if telemetry opted-in."
argument-hint: "[--days 30] [--format text|json]"
allowed-tools: Read, Write, Edit, Bash, Glob
recommended-model: haiku-4-5
---

# /gen:plugin-health

v3.13. See `skills/plugin-telemetry/SKILL.md` + `skills/skill-usage-analytics/SKILL.md`.

Shows:
- Skills by injection frequency
- Commands by invocation count + median duration
- Agent outcomes (success / error / cancelled rates)
- Archetype popularity
- Deprecation candidates (0 injections in window)
- Version adoption (if telemetry opted-in)

`--format json` for machine consumption.
