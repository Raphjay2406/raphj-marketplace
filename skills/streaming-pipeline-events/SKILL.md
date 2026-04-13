---
name: streaming-pipeline-events
description: AG-UI events emitted during pipeline execution — AGENT_STATE_UPDATE, RUN_STARTED, STEP_FINISHED, RUN_FINISHED
tier: domain
triggers: [ag-ui, pipeline events, AGENT_STATE_UPDATE, streaming events, agent state, run started, step finished]
version: 4.0.0
---

## Layer 1: Decision Guidance

### When to Use

- Any worker that emits real-time progress to the wave-director or synthetic-persona probe
- When scaffolding streaming API routes that need mid-stream status events
- When chat-ui-author, rag-pipeline-author, or agent-trace-ui-author need to wire AG-UI events
- When synthetic-user-streaming needs structured per-step findings before wave merge

### When NOT to Use

- Static batch pipelines where caller polls for completion — use `ai-pipeline-features` instead
- Simple single-turn responses with no tool calls — overhead not justified
- Post-ship regression runs — use `synthetic-user-testing` (batch) instead

### Decision Tree

- If worker needs per-step progress events → emit `AGENT_STATE_UPDATE` with `{ step, status, artifact }`
- If pipeline has multi-agent fan-out → emit `RUN_STARTED` on entry, `RUN_FINISHED` on exit
- If a step fails → emit `STEP_FINISHED` with `{ ok: false, error }` so director can branch
- If streaming to browser → pipe through `toUIMessageStreamResponse()` and use `useChat` data parts

### Pipeline Connection

- **Referenced by:** wave-director, chat-ui-author, rag-pipeline-author, agent-trace-ui-author, synthetic-persona runner
- **Consumed at:** `/gen:build` wave-director orchestration, `/gen:synthetic-test` streaming mode

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Emit AGENT_STATE_UPDATE from API route

```typescript
// app/api/agent/route.ts
import { createDataStream, streamText } from "ai";
import { createVercelAIGateway } from "@ai-sdk/vercel";

const gateway = createVercelAIGateway();

export async function POST(req: Request) {
  const { messages } = await req.json();
  const dataStream = createDataStream({
    execute: async (writer) => {
      writer.writeData({
        type: "AGENT_STATE_UPDATE",
        step: 0,
        status: "running",
        artifact: null,
      });
      const result = streamText({
        model: gateway("anthropic/claude-sonnet-4.6"),
        messages,
        onStepFinish({ text, toolCalls }) {
          writer.writeData({
            type: "STEP_FINISHED",
            ok: true,
            text: text.slice(0, 200),
            toolCallCount: toolCalls?.length ?? 0,
          });
        },
      });
      result.mergeIntoDataStream(writer);
    },
  });
  return dataStream.toResponse();
}
```

#### Pattern: Consume AG-UI events in useChat

```typescript
"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function PipelineProgress() {
  const { messages, data, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/agent" }),
  });

  const stateUpdates = (data ?? []).filter(
    (d): d is { type: "AGENT_STATE_UPDATE"; step: number; status: string } =>
      typeof d === "object" && d !== null && (d as { type?: string }).type === "AGENT_STATE_UPDATE"
  );

  return (
    <div style={{ background: "var(--surface)", color: "var(--text)" }}>
      {stateUpdates.map((u, i) => (
        <div key={i} style={{ color: "var(--muted)" }}>
          Step {u.step}: {u.status}
        </div>
      ))}
      {status === "streaming" && (
        <div style={{ color: "var(--accent)" }}>Streaming…</div>
      )}
    </div>
  );
}
```

### Reference Sites

- **Vercel AI SDK Playground** (sdk.vercel.ai) — AG-UI event model, data stream annotations
- **Linear** (linear.app) — Real-time agent state updates in issue creation flow

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `--accent` | Loading / streaming indicator color |
| `--muted` | Step status label color |
| `--surface` | Pipeline progress panel background |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| AI-Native | Expose all AGENT_STATE_UPDATE steps in visible trace UI |
| Minimal | Collapse events into a single spinner until RUN_FINISHED |

### Pipeline Stage

- **Input from:** Wave-director task envelope with `streamMode: "ag-ui"`
- **Output to:** Browser via `useChat` data parts; wave-director state machine

### Related Skills

- `agentic-ux-patterns` — higher-level UX patterns built on top of these events
- `synthetic-user-streaming` — uses AGENT_STATE_UPDATE for mid-wave persona findings
- `ai-ui-patterns` — UI components that visualize these events

## Layer 4: Anti-Patterns

### Anti-Pattern: Emit events after response is closed

**What goes wrong:** Calling `writer.writeData()` after `result.mergeIntoDataStream()` resolves causes a write-after-close error; events are silently dropped.
**Instead:** Write all pre-run events before calling `mergeIntoDataStream`, and use `onStepFinish` callbacks for mid-stream events.

### Anti-Pattern: Conflating data parts with text parts

**What goes wrong:** Iterating `message.parts` looking for AG-UI JSON blobs returns text parts only — structured event data does not live in `parts`.
**Instead:** Read AGENT_STATE_UPDATE from `useChat`'s `data` array. Use `message.parts` only for rendering text/tool parts within individual messages.

### Anti-Pattern: Blocking the stream on event emission

**What goes wrong:** Using `await writer.writeData(heavyPayload)` inside a hot loop stalls the stream.
**Instead:** Keep event payloads small (status string + step index + artifact path); defer full artifact delivery to a separate fetch.
