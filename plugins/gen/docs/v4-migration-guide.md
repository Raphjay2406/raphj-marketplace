# Genorah v4.0.0 — v3→v4 Migration Guide

## Overview

v4.0.0 is a **backwards-compatible GA release** — no runtime breaking changes for existing projects.
The upgrade is purely additive at the config level. Your existing `.planning/genorah/` state, DNA files,
and PLAN.md are fully forward-compatible.

---

## Breaking Changes

**None for runtime behavior.** The following are config-level additions (all opt-in):

| Area | Change | Impact |
|------|--------|--------|
| Agent cards | `agent-cards.json` now uses A2A v0.3 schema (`tier: director/worker`) | Only affects custom tooling that reads `generated/` directly |
| Quality gate | Extended from 354pt to 394pt (new axes: Cinematic Motion + AG-UI Protocol) | May lower existing project scores by 0–15pt — re-audit recommended |
| Archetype count | 33 → 42 archetypes | No breakage; new archetypes are additive |
| Skill count | 287 → 320+ skills | Auto-discovered; no action needed |
| Package workspace | 9 new `packages/*` (protocol, canvas-runtime, etc.) | Only relevant if you import internal packages directly |

---

## Step-by-Step Upgrade

### 1. Backup Your Project (Recommended)

```bash
/gen:migrate-v3-to-v4 --backup-to ./backup
```

This command:
1. Copies `.planning/genorah/` → `./backup/genorah-v3/`
2. Copies `.claude-plugin/` → `./backup/plugin-v3/`
3. Validates the backup is complete before proceeding

### 2. Update the Plugin

```bash
claude plugin update gen
```

Or if using a local installation:

```bash
git pull origin master
```

### 3. Verify Version

```bash
/gen:plugin-health
```

Expected output: `Genorah v4.0.0 — 108 agents, 42 archetypes, 394-pt gate`

### 4. Re-run Self-Audit

```bash
/gen:self-audit
```

The self-audit will flag any state files that reference v3 agent IDs or missing v4 fields.
Auto-fix suggestions are printed inline.

### 5. Optional: Re-ingest Agent Cards

If you use the A2A protocol layer:

```bash
node scripts/gen-agent-cards.mjs
```

This regenerates `.claude-plugin/generated/agent-cards.json` with the v4.0.0 schema.

---

## New Environment Variables (All Optional)

All v4 env vars are **opt-in**. The plugin degrades gracefully when absent.

| Variable | Purpose | Default |
|----------|---------|---------|
| `ROD_API_KEY` | Remote Orchestration Daemon API key — enables cloud relay for multi-agent pipelines | Disabled |
| `FAL_KEY` | fal.ai API key — enables Flux Pro image generation in Asset Forge | Falls back to nano-banana / text-prompt |
| `RECRAFT_API_KEY` | Recraft API key — vector/raster AI asset generation | Disabled |
| `MESHY_API_KEY` | Meshy 3D generation API key | Disabled |
| `GENORAH_MARKETPLACE_TOKEN` | Marketplace publish token — required for `claude plugin publish` | Read-only install works without it |
| `THEATRE_LICENSE` | Theatre.js commercial license key | Falls back to GSAP / CSS animations |
| `GENORAH_OFFLINE` | Set to `1` to force offline mode (skip all network calls) | Auto-detected |
| `WEBGPU_FORCE_FALLBACK` | Set to `1` to disable WebGPU effects (canvas fallback) | Auto-detected |

---

## What's New in v4.0.0 (By Pillar)

See the full changelog at [`docs/v4-changelog.md`](./v4-changelog.md).

| Pillar | Summary |
|--------|---------|
| **Cinematic Intelligence** | AG-UI protocol + canvas-runtime + Theatre.js choreography + WebGPU effects |
| **Generative Archetypes** | 42 archetypes (was 33) + fractal mixing protocol + DNA mutation engine |
| **Living Systems** | Self-healing components + drift monitor + canary validator |
| **Memory Graph** | Cross-session episodic memory + BM25 retrieval + context fabric upgrade |
| **Marketplace** | Plugin distribution + versioned install + dependency resolution |
| **Shakedown** | 394-pt quality gate + chaos regression + perf budgets |

---

## Known Issues

1. **Visual regression baseline deferred** — The automated visual regression baseline capture
   (`/gen:regression --capture-baseline`) is deferred to v4.1. Until then, visual regression
   runs in "warn" mode only (no hard block).

2. **Deno required for marketplace sandbox** — The isolated plugin sandbox (`/gen:marketplace sandbox`)
   requires Deno 2.x. If Deno is not installed, sandbox tests are skipped with a warning.
   Core functionality is unaffected.

3. **Theatre.js version** — Ships with Theatre.js 0.7.x (not 0.8.x which is not yet stable).
   The API surface used is stable across 0.7.x.

4. **WebGPU effects** — Requires Chrome 121+ / Edge 121+ / Firefox 122+ with WebGPU enabled.
   Automatic canvas fallback activates on unsupported browsers.

---

## Rollback Instructions

If you need to roll back to v3.25.0:

```bash
# Restore from backup
cp -r ./backup/genorah-v3/ .planning/genorah/
cp -r ./backup/plugin-v3/ .claude-plugin/

# Reinstall v3 plugin
claude plugin install gen@3.25.0
```

Or using git (if the plugin is a submodule):

```bash
git checkout v3.25.0
```

No data migration is needed — v3 and v4 share the same `.planning/genorah/` format.
The v4 additions (agent cards, marketplace manifest) are ignored by v3.

---

## Support

- Full changelog: [`docs/v4-changelog.md`](./v4-changelog.md)
- User guide: [`docs/v4-user-guide.md`](./v4-user-guide.md)
- Agent directory: [`docs/v4-agent-directory.md`](./v4-agent-directory.md)
- FAQ: [`docs/faq.md`](./faq.md)
