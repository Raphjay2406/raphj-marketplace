---
name: agent-marketplace-client
description: Discover, install, and sandbox-validate agents from the Genorah marketplace registry
tier: domain
triggers: [marketplace, agent discovery, install agent, sandbox agent, agent registry, discover agents, agent marketplace]
version: 4.0.0
---

## Layer 1: Decision Guidance

### When to Use

- When `/gen:agents-discover` lists available community or first-party agents
- When `/gen:agents-install` fetches and validates an agent package with sha256 integrity check
- When an installed agent needs Deno sandbox validation before wave-director trust elevation
- When auditing installed agents for version drift or security advisories

### When NOT to Use

- Core pipeline agents (Researcher, Builder, etc.) — these are bundled, not marketplace-sourced
- Local worker stubs under `agents/workers/` — use direct file editing instead
- Emergency hotswap during a live wave — finish the wave, then install

### Decision Tree

- If discovering agents → call `marketplace.fetchRegistry()` with optional `{ domain, tier }` filter
- If installing → call `marketplace.install(slug, version)`, verify sha256, sandbox-run smoke test
- If sandbox fails → abort install, write failure event to `preservation.ledger.ndjson`
- If version conflict → prompt user with diff of capability changes before overwriting

### Pipeline Connection

- **Referenced by:** `/gen:agents-discover`, `/gen:agents-install`, `/gen:agents-publish`
- **Consumed at:** Wave-director capability resolution; session-start agent inventory

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Discover agents by domain

```typescript
import { MarketplaceClient } from "@genorah/marketplace";

const client = new MarketplaceClient({
  registryUrl: process.env.GENORAH_MARKETPLACE_URL ?? "https://marketplace.genorah.dev",
});

const agents = await client.fetchRegistry({ domain: "ai-feature", tier: "worker" });
for (const agent of agents) {
  console.log(`${agent.slug}@${agent.version} — ${agent.description}`);
}
```

#### Pattern: Install with integrity verification

```typescript
import { MarketplaceClient } from "@genorah/marketplace";

const client = new MarketplaceClient();
const result = await client.install("genorah/rag-pipeline-author", "4.0.0");

if (!result.ok) {
  console.error("Install failed:", result.error);
  process.exit(1);
}

console.log(`Installed to agents/workers/${result.slug}.md`);
console.log(`sha256: ${result.sha256} ✓`);
```

#### Pattern: Sandbox smoke-test before trust elevation

```typescript
import { AgentSandbox } from "@genorah/marketplace/sandbox";

const sandbox = new AgentSandbox({ runtime: "deno" });
const smokeResult = await sandbox.run({
  agentPath: `agents/workers/${slug}.md`,
  fixture: { dnaAnchor: "test-fixture", framework: "next" },
  timeout: 30_000,
});

if (!smokeResult.passed) {
  throw new Error(`Sandbox smoke failed: ${smokeResult.failReason}`);
}
```

### Reference Sites

- **npm registry API** (registry.npmjs.org) — manifest + tarball pattern this mirrors
- **VS Code Extensions Marketplace** (marketplace.visualstudio.com) — sandbox isolation model

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `--primary` | Install success state color in marketplace UI |
| `--tension` | Failed integrity check / sandbox failure indicator |
| `--surface` | Agent card background in discovery UI |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| AI-Native | Render agent cards with capability badges and live sandbox preview |
| Minimal | CLI-only output; no marketplace UI rendered |

### Pipeline Stage

- **Input from:** User-invoked `/gen:agents-*` commands or wave-director capability gap detection
- **Output to:** `agents/workers/` directory; agent inventory manifest

### Related Skills

- `vercel-sandbox` — runtime isolation model used by AgentSandbox
- `offline-first-mode` — marketplace client gracefully degrades under `GENORAH_OFFLINE=1`
- `streaming-pipeline-events` — install progress emitted as AG-UI events

## Layer 4: Anti-Patterns

### Anti-Pattern: Installing without sandbox validation

**What goes wrong:** A malicious or broken agent gets trust-elevated and runs arbitrary Bash commands inside wave execution.
**Instead:** Always run `AgentSandbox.run()` before elevating trust. The sandbox enforces tool restrictions defined in the agent's YAML frontmatter.

### Anti-Pattern: Skipping sha256 verification for speed

**What goes wrong:** A registry MITM or CDN cache poisoning attack substitutes a different agent binary; the installed agent diverges from what was reviewed.
**Instead:** Always verify `result.sha256` against the registry manifest. `MarketplaceClient.install()` does this by default — never pass `{ skipIntegrity: true }` in production.

### Anti-Pattern: Installing during an active wave

**What goes wrong:** Wave-director has already resolved its agent capability map; a mid-wave install is invisible until the next session, but the new agent file may conflict with an in-progress worktree.
**Instead:** Gate installs behind `wave-director.isIdle()`. If a wave is running, queue the install and apply at wave merge.
