---
name: plugin-telemetry
description: Opt-in anonymized plugin telemetry — skill usage, command invocations, agent outcomes. Hashed only (no PII, no content). User can export and delete. Hosted at telemetry.genorah.dev.
tier: core
triggers: plugin-telemetry, anonymous-telemetry, skill-usage-analytics, plugin-health
version: 0.1.0
---

# Plugin Telemetry

Opt-in, anonymized. Enables auto-deprecation of unused skills + pattern discovery across users.

## Layer 1 — What's sent

| Field | Example | Purpose |
|---|---|---|
| `install_id` (random UUID) | `7c3b…` | De-dup; not user identity |
| `plugin_version` | `3.13.0-rc.1` | Version adoption |
| `event_kind` | `skill-injected` | Event type |
| `skill_name` | `design-dna` | Which skill |
| `command_name` | `gen:build` | Which command |
| `agent_kind` | `builder` | Which agent |
| `archetype` | `editorial` | Which archetype |
| `duration_ms` | `84000` | Perf |
| `outcome` | `success` \| `error` \| `cancelled` | |
| `error_code` | `GENORAH_GATE_HARD_FAIL` | Taxonomy |

## Layer 2 — What's NOT sent

- No PII (names, emails, IPs)
- No project content (source code, PLAN.md, SUMMARY.md)
- No project identifiers (repo name, paths)
- No API keys or credentials
- No user messages or responses

## Layer 3 — Opt-in flow

At install: no telemetry by default. On `/gen:telemetry opt-in`:

```
Genorah telemetry helps:
  - Identify unused skills for deprecation
  - Surface common failure patterns
  - Prioritize improvements

What's sent:
  - Skill/command/agent names
  - Archetype + beat choices
  - Error codes + duration
  - Plugin version

What's NOT sent:
  - Project content, paths, identifiers
  - PII (no names, emails, IPs)
  - API keys

Enable telemetry? [y/N]
```

## Layer 4 — Local-first

Before upload, telemetry written to `~/.claude/genorah/telemetry/pending.ndjson`. Batched upload every 24h (not per event). User can:

- `/gen:telemetry show` — display what's queued
- `/gen:telemetry export` — dump to file
- `/gen:telemetry delete-mine` — delete server-side via install_id
- `/gen:telemetry opt-out` — stop collecting

## Layer 5 — Server

Cloudflare Worker at `telemetry.genorah.dev/ingest`:

```ts
export default {
  async fetch(req: Request, env: Env) {
    if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
    const batch = await req.json();
    await env.TELEMETRY_DB.prepare(
      `INSERT INTO events (install_id, event_kind, skill_name, payload, ts) VALUES (?1, ?2, ?3, ?4, ?5)`
    ).bind(/* ... */).run();
    return Response.json({ received: batch.length });
  },
};
```

D1 (SQLite) backing; aggregated views daily.

## Layer 6 — Public aggregates

Monthly snapshot at `telemetry.genorah.dev/stats` — anonymized totals visible to community:

- Top-20 skills by injection rate
- Top-20 commands
- Archetype popularity
- Error code frequency
- Version adoption curve

Helps all users see what's active.

## Layer 7 — Anti-patterns

- ❌ Collecting PII ever — even "hash of email" is still PII legally
- ❌ Opt-out default — violates user trust
- ❌ Per-event upload — cost + network noise
- ❌ Server stores individual events without retention policy — 90 days max
- ❌ Not honoring delete-mine — GDPR compliance
