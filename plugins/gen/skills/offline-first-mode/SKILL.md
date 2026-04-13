---
name: offline-first-mode
description: GENORAH_OFFLINE=1 invariants — gate all network calls, stub external services, enable local-only pipeline execution
tier: domain
triggers: [offline, GENORAH_OFFLINE, offline mode, no network, air-gapped, offline first, local only]
version: 4.0.0
---

## Layer 1: Decision Guidance

### When to Use

- When `GENORAH_OFFLINE=1` is set in the environment (CI, air-gapped machines, rate-limit recovery)
- When testing pipeline logic without incurring API costs or external dependencies
- When running `offline-smoke.mjs` to verify the pipeline degrades gracefully
- When a client requires air-gapped operation for security compliance

### When NOT to Use

- Production builds where live CMS content is required — offline mode returns cached/stubbed content only
- When nano-banana image generation is part of the build contract — images are unavailable offline
- Performance benchmarking — stub latencies do not reflect real API timing

### Decision Tree

- If `GENORAH_OFFLINE=1` → all hooks enforce network block; stub AI completions return fixture responses
- If a skill requires network access → emit `OFFLINE_DEGRADED` event with `{ skill, capability }` and continue with stub
- If a capability is hard-required (no stub available) → emit `OFFLINE_BLOCKED` and halt that wave step
- If offline + MCP unavailable → skip MCP tool calls silently; log to METRICS.md

### Pipeline Connection

- **Referenced by:** `offline-mode-gate.mjs` hook, all network-accessing scripts
- **Consumed at:** Every `PreToolUse` hook invocation when `GENORAH_OFFLINE=1`

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Guard a network call with offline check

```typescript
import { isOffline, offlineStub } from "@/scripts/offline-mode.mjs";

export async function fetchCompetitorData(url: string) {
  if (await isOffline()) {
    return offlineStub("competitor-data", {
      scores: { design: 8.2, usability: 7.9 },
      source: "cached-fixture",
    });
  }
  // real fetch
  const res = await fetch(url);
  return res.json();
}
```

#### Pattern: Emit OFFLINE_DEGRADED event

```typescript
import { emitOfflineDegraded } from "@/scripts/offline-mode.mjs";

async function generateHeroImage(dnaAnchor: object) {
  if (process.env.GENORAH_OFFLINE === "1") {
    await emitOfflineDegraded({ skill: "image-prompt-generation", capability: "nano-banana-generate" });
    return { imagePath: "public/images/offline-placeholder.jpg", source: "stub" };
  }
  // real generation
}
```

#### Pattern: Offline-mode-gate hook check

```javascript
// scripts/hooks/offline-mode-gate.mjs
export function check(toolName, toolInput) {
  if (process.env.GENORAH_OFFLINE !== "1") return { block: false };
  const NETWORK_TOOLS = ["WebFetch", "WebSearch", "mcp__nano-banana__generate_image"];
  if (NETWORK_TOOLS.includes(toolName)) {
    return { block: true, reason: `GENORAH_OFFLINE=1: ${toolName} is a network tool` };
  }
  return { block: false };
}
```

### Reference Sites

- **Workbox offline strategies** (developer.chrome.com/docs/workbox) — cache-first / stale-while-revalidate patterns
- **SQLite as offline store** (sqlite.org) — WAL mode for concurrent offline reads

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `--muted` | Offline indicator badge color |
| `--tension` | OFFLINE_BLOCKED hard-stop color |
| `--surface` | Offline mode status panel background |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| AI-Native | Show persistent offline badge in agent trace UI |
| All others | Suppress offline indicator from user-facing UI; log to METRICS.md only |

### Pipeline Stage

- **Input from:** `GENORAH_OFFLINE` env var set by CI or user
- **Output to:** All network-accessing pipeline steps (stubs or blocks them)

### Related Skills

- `streaming-pipeline-events` — OFFLINE_DEGRADED / OFFLINE_BLOCKED emitted as AG-UI events
- `agent-marketplace-client` — degrades gracefully under offline mode (no registry fetch)
- `vercel-sandbox` — sandbox isolation complementary to offline network blocking

## Layer 4: Anti-Patterns

### Anti-Pattern: Checking offline flag inside component render

**What goes wrong:** `process.env.GENORAH_OFFLINE` is not available in browser bundles; the check always returns undefined, disabling offline mode silently.
**Instead:** Gate offline checks server-side only (API routes, scripts, hooks). Pass offline status to components via a server-rendered prop or RSC.

### Anti-Pattern: Stubs that return empty objects

**What goes wrong:** Downstream code crashes on `undefined.scores` when a stub returns `{}` instead of a fixture matching the real shape.
**Instead:** All stubs must match the real return type exactly. Use `offlineStub(key, fixture)` which validates the fixture shape against the registered schema.

### Anti-Pattern: Forgetting to stub the calibration-store read

**What goes wrong:** The quality gate tries to read weights from the calibration store, which may require a network call; offline mode blocks it and the audit halts entirely.
**Instead:** `CalibrationStore` ships with bundled default weights used as fallback when `GENORAH_OFFLINE=1`. Always test with the offline smoke runner after any calibration-store change.
