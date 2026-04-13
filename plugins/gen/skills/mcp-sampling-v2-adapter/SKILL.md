---
name: mcp-sampling-v2-adapter
description: Register Genorah agents as MCP primitives via sampling/createMessage
tier: core
triggers:
  - "MCP sampling"
  - "MCP primitive"
version: 4.0.0
---

# MCP Sampling v2 Adapter

## Layer 1 — Decision

Use when exposing a Genorah agent to an external MCP host. Allows Claude Desktop, Cursor, or any MCP-aware host to invoke Genorah agents as tools.

## Layer 2 — Example

```ts
import { registerAgentAsMcpPrimitive, buildSamplingRequest } from "@genorah/protocol";
const registry = {};
registerAgentAsMcpPrimitive(registry, {
  agent_id: "genorah/creative-director",
  capability: "review-plan",
  handler: async (payload) => creativeDirector(payload)
});
```

## Layer 3 — Integration

- Registry key format: `<agent_id>/<capability>`
- Builds JSON-RPC 2.0 `sampling/createMessage` requests
- Pairs with `@modelcontextprotocol/sdk` for MCP host interop
- Part of L4 protocol citizenship

## Layer 4 — Anti-Patterns

- Registering same key twice without intent (silent override)
- Using MCP sampling for internal-only agents (overhead)
