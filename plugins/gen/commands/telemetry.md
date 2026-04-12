---
description: "Plugin telemetry opt-in/opt-out + data management. Subcommands: opt-in | opt-out | show | export | delete-mine."
argument-hint: "opt-in | opt-out | show | export <path> | delete-mine"
allowed-tools: Read, Write, Edit, Bash
recommended-model: haiku-4-5
---

# /gen:telemetry

v3.13. Opt-in anonymized telemetry. See `skills/plugin-telemetry/SKILL.md`.

## Subcommands

- `opt-in` — enable telemetry (prompted disclosure)
- `opt-out` — disable + delete pending queue
- `show` — list what's queued for next upload
- `export <path>` — export pending + historical to file
- `delete-mine` — server-side delete via install_id

Preference stored at `~/.claude/genorah/telemetry-config.json`.
