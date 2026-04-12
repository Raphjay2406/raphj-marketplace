---
name: "agentic-ux-patterns"
description: "Multi-step agent flows embedded in generated sites. AI SDK v6 agents + Vercel Queues + stopWhen/step budgets. UI patterns for agent plan, tool-call trace, inline approvals, and progress."
tier: "domain"
triggers: "agent flow, multi-step agent, tool calling ui, agent trace, agentic ui, plan-act-observe"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Site needs agent-powered flows (research assistant, booking agent, support triage).
- Flow exceeds single completion — needs planning, tool calling, multi-step reasoning.
- User benefit > $0.02 per session cost.

### When NOT to Use

- Single-shot Q&A — use `ai-chat-depth` skill.
- Pure deterministic workflows — use `background-jobs` skill.

### Decision Tree

- 1-3 steps, no tools → plain `streamText`.
- 3-10 steps, tools → `generateText` with `stopWhen: stepCountIs(10)` + tool set.
- >10 steps or long-running → persist via Vercel Queues + resume UI.

## Layer 2: Example (AI SDK v6)

```ts
import { streamText, stepCountIs, tool } from 'ai';
import { z } from 'zod';

// Model routed via Vercel AI Gateway (OIDC; no raw provider keys).
// Requires `vercel env pull` so AI_GATEWAY_* is populated; gateway handles auth/failover/cost.
export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.6',
    messages,
    tools: {
      searchDocs: tool({
        description: 'Search product docs',
        inputSchema: z.object({ query: z.string() }),
        execute: async ({ query }) => await retrieveDocs(query),
      }),
      schedule: tool({
        description: 'Schedule a meeting',
        inputSchema: z.object({ when: z.string(), who: z.string() }),
        execute: async ({ when, who }) => await book(when, who),
      }),
    },
    stopWhen: stepCountIs(8),
  });
  return result.toUIMessageStreamResponse();
}
```

UI pattern — see `agent-trace-ui` skill.

## Layer 3: Integration Context

- Gateway: Vercel AI Gateway (OIDC). No raw provider keys.
- Durable: long flows → Vercel Queues; UI polls `/api/agent-status/:id`.
- Cost: track via L7 calibration store → alert when session cost > budget tier.

## Layer 4: Anti-Patterns

- Unbounded steps — always `stopWhen: stepCountIs(N)`.
- Tool results leak PII — wrap in `pii-regex-v2026` scanner before surfacing.
- Silent errors — use `error.mjs` taxonomy; surface with retry in trace UI.
