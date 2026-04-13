---
name: "telemetry-first-run"
description: "First-run prompt for opt-in plugin telemetry. Shown once per user at first SessionStart in v3.19+. Records decision in ~/.claude/genorah/telemetry-consent.json. Updated in v4.0.0 to cover AG-UI event counts, skill injection counts, validator verdicts, and marketplace install counts."
tier: "utility"
triggers: "first run, telemetry prompt, opt-in telemetry, initial consent"
version: "4.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- On first SessionStart after v3.19+ / v4.0.0 install.
- Only if `~/.claude/genorah/telemetry.json` is absent (v4 path) OR
  `~/.claude/genorah/telemetry-consent.json` is absent (v3 legacy path).
- Never re-prompts once decision recorded.
- Session-start hook emits a single AG-UI `UI_RENDER` event pointing to the consent prompt
  screen when the telemetry file is missing — the actual prompt UI is rendered by the hook,
  not by this skill directly.

### When NOT to Use

- If user has opted out in an earlier version — migrate their consent record forward, do not re-prompt.
- In CI / headless / non-interactive sessions — default to opt-out.
- If `GENORAH_OFFLINE=1` is set — skip the network-dependent emit path.

## Layer 2: Prompt Copy

```
Genorah v4.0.0 ships opt-in usage telemetry.

What's collected (aggregate counts only, never content):
  • Skill injection counts per command run
  • AG-UI event counts (TEXT_MESSAGE, TOOL_CALL, STATE_DELTA, etc.) per session
  • Validator verdicts (pass/fail counts per gate) — no content, no scores
  • Marketplace plugin install counts (plugin name + version only)
  • Command name, success/failure flag, duration (ms)
  • Anonymous install ID (UUID, generated locally, not linked to identity)

What's NOT collected:
  • File content, DNA tokens, project names, prompts, outputs, API keys, PII
  • Agent card payloads or A2A message bodies
  • Any user-identifying information

Purpose: auto-deprecate unused skills, prioritize maintenance, detect regressions across users,
         improve AG-UI protocol coverage across real-world agent runs.

[y] Enable telemetry     [n] Stay opted-out     [?] Read full policy
```

Full policy lives at `docs/telemetry-policy.md`.

## Layer 3: Integration Context

### v4 Data Points

| Data Point | Shape | Purpose |
|------------|-------|---------|
| `skill_injections` | `{ skill_id, count, command }` | Identify unused skills for deprecation |
| `agui_event_counts` | `{ event_type, count }` | AG-UI protocol coverage monitoring |
| `validator_verdicts` | `{ gate_id, pass_count, fail_count }` | Quality gate regression detection |
| `marketplace_installs` | `{ plugin_name, version }` | Plugin adoption tracking |

### Storage

- Decision stored in `~/.claude/genorah/telemetry.json` with shape:
  ```json
  {
    "consent": true,
    "version": "4.0.0",
    "decidedAt": "ISO8601",
    "dataPoints": ["skill_injections", "agui_event_counts", "validator_verdicts", "marketplace_installs"]
  }
  ```
- Legacy `telemetry-consent.json` (v3) is migrated forward on first v4 session-start.
- Managed by `hooks/session-start.mjs` on first run detection.
- `scripts/plugin-telemetry.mjs` checks this file before any emit.

### session-start.mjs Integration

The session-start hook checks for `~/.claude/genorah/telemetry.json` on every SessionStart.
If the file is absent, it emits one AG-UI `UI_RENDER` event with `{ component: "telemetry-consent-prompt", version: "4.0.0" }`.
This is a forward-looking trigger — the rendering UI is separate from this skill.

## Layer 4: Anti-Patterns

- Defaulting to opt-in → violates prior consent scheme; must stay opt-in-only.
- Nagging on every session → prompt once, respect decision forever.
- Bundling content/PII in events → governed by `pii-regex-v2026` scan before emit.
- Emitting validator *scores* (not just pass/fail counts) → scores may contain project fingerprints.
- Emitting `agui_event_counts` with message body excerpts → counts only, never body content.
