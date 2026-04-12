---
name: "telemetry-first-run"
description: "First-run prompt for opt-in plugin telemetry. Shown once per user at first SessionStart in v3.19+. Records decision in ~/.claude/genorah/telemetry-consent.json."
tier: "utility"
triggers: "first run, telemetry prompt, opt-in telemetry, initial consent"
version: "3.19.0"
---

## Layer 1: Decision Guidance

### When to Use

- On first SessionStart after v3.19 install.
- Only if `~/.claude/genorah/telemetry-consent.json` is absent.
- Never re-prompts once decision recorded.

### When NOT to Use

- If user has opted out in an earlier version — migrate their consent record forward, do not re-prompt.
- In CI / headless / non-interactive sessions — default to opt-out.

## Layer 2: Prompt Copy

```
Genorah v3.19 ships opt-in usage telemetry.

What's collected: skill name, command name, success/failure, duration (ms), anonymous install ID.
What's NOT collected: file content, DNA tokens, project names, prompts, outputs, keys, PII.

Purpose: auto-deprecate unused skills, prioritize maintenance, detect regressions across users.

[y] Enable telemetry     [n] Stay opted-out     [?] Read full policy
```

Full policy lives at `docs/telemetry-policy.md`.

## Layer 3: Integration Context

- Managed by `hooks/session-start.mjs` on first run detection.
- Decision stored in `~/.claude/genorah/telemetry-consent.json` with shape `{ consent: boolean, version: "3.19.0", decidedAt: ISO8601 }`.
- `scripts/plugin-telemetry.mjs` checks this file before any emit.

## Layer 4: Anti-Patterns

- Defaulting to opt-in → violates prior consent scheme; must stay opt-in-only.
- Nagging on every session → prompt once, respect decision forever.
- Bundling content/PII in events → governed by `pii-regex-v2026` scan before emit.
