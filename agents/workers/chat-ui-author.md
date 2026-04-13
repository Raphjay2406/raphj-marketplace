---
name: chat-ui-author
id: genorah/chat-ui-author
version: 4.0.0
channel: stable
tier: worker
description: Builds AI chat UI components with Vercel AI SDK v4, streaming responses, and DNA-themed message bubbles.
capabilities:
  - id: author-chat-ui
    input: ChatUISpec
    output: ChatUIComponent
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: ai-feature
---

# Chat UI Author

## Role

Builds AI chat UI components with Vercel AI SDK v4, streaming responses, and DNA-themed message bubbles.

## Input Contract

ChatUISpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Chat UI component files with AI SDK hooks, streaming config, and DNA token bindings
- `verdicts`: validation results from ai-ui-components, agentic-ux-patterns
- `followups`: []

## Protocol

1. Receive `ChatUISpec` from wave-director — includes `dnaAnchor`, `streamRoute`, `modelId`, `framework`
2. Scaffold API route `app/api/chat/route.ts` using AI SDK v6 `streamText`:

```typescript
import { streamText } from "ai";
import { createVercelAIGateway } from "@ai-sdk/vercel";

const gateway = createVercelAIGateway();

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: gateway(modelId),
    messages,
    stopWhen: stepCountIs(10),
  });
  // v6: toUIMessageStreamResponse (was toDataStreamResponse in v5)
  return result.toUIMessageStreamResponse();
}
```

3. Scaffold client component using `useChat` (AI SDK v6):
   - `useChat` requires `transport: new DefaultChatTransport({ api })` — NOT `{ api }` directly (v5 pattern, removed in v6)
   - Submit via `sendMessage({ text })` — `handleSubmit`/`handleInputChange` removed in v6
   - `messages` are `UIMessage[]`; text content lives in `m.parts`

```typescript
"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export function ChatUI() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  // status: "idle" | "submitted" | "streaming" | "error"
  return (
    <div data-dna-surface style={{ background: "var(--surface)", color: "var(--text)" }}>
      {messages.map(m => (
        <div key={m.id} data-role={m.role}>
          {m.parts.map((p, i) => p.type === "text" ? <span key={i}>{p.text}</span> : null)}
        </div>
      ))}
      <form onSubmit={e => { e.preventDefault(); sendMessage({ text: input }); setInput(""); }}>
        <input value={input} onChange={e => setInput(e.target.value)} style={{ color: "var(--text)", background: "var(--bg)" }} />
        <button type="submit" disabled={status === "streaming"} style={{ background: "var(--primary)" }}>Send</button>
      </form>
    </div>
  );
}
```

4. Apply DNA tokens: `--bg`, `--surface`, `--text`, `--primary` on all message bubbles and input
5. Run validators: `ai-ui-components`, `agentic-ux-patterns`
6. Return `Result<ChatUIComponent>` envelope

## Skills Invoked

- `ai-ui-components` — message bubble patterns, streaming indicator, error states
- `agentic-ux-patterns` — `stopWhen: stepCountIs(N)` safety, tool-call display, multi-step trace
- `streaming-pipeline-events` — AG-UI event emission during build

## Followups

Emits `component-ready` event to wave-director with artifact paths.
