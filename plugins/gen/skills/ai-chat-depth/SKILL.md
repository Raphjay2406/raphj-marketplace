---
name: ai-chat-depth
description: AI chat patterns beyond basic messaging — conversational shopping, support agent with human escalation, onboarding tour chat, product configurator, documentation search (RAG). Vercel AI SDK v6 + AI Elements + streaming + tool use.
tier: domain
triggers: ai-chat, chatbot, vercel-ai-sdk, ai-elements, rag, conversational-shopping, support-agent
version: 0.1.0
---

# AI Chat Depth

Extends existing `ai-ui` skill with full conversational patterns.

## Layer 1 — When to use

- Support / Help center with human fallback
- Conversational shopping (item selection via dialogue)
- Product configurator (multi-step choice → final config)
- Documentation search as chat (RAG over docs)
- Onboarding tour via chat

## Layer 2 — Vercel AI SDK v6 pattern

```tsx
// AI SDK v6 — useChat API with transport
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import { Conversation, Message, MessageResponse, ToolCall, ToolResult } from '@vercel/ai-elements';

export function Chat() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const [input, setInput] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input });
    setInput('');
  }

  return (
    <Conversation>
      {messages.map(m => (
        <Message key={m.id} role={m.role}>
          {m.role === 'assistant' && <MessageResponse content={m.content} />}
          {m.toolInvocations?.map(t => (
            <ToolCall key={t.toolCallId} name={t.toolName} args={t.args}>
              {t.result && <ToolResult result={t.result} />}
            </ToolCall>
          ))}
        </Message>
      ))}
      <form onSubmit={onSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
      </form>
    </Conversation>
  );
}
```

AI Elements is mandatory for rendering — MessageResponse handles all output formatting consistently.

v6 API notes:
- `useChat` no longer accepts `api` directly — wrap in `transport: new DefaultChatTransport({ api })` from `ai`.
- Input state is user-managed (`useState`); submit via `sendMessage({ text })`. The legacy input/change/submit helpers were removed.
- Server response uses `toUIMessageStreamResponse()` (chat UIs) or `toTextStreamResponse()` (plain text).
- `maxSteps` was removed — use `stopWhen: stepCountIs(N)` from `ai`.

## Layer 3 — Backend: streaming + tool use (via Vercel AI Gateway)

Route model calls through the **Vercel AI Gateway** for OIDC auth, provider routing, failover, and cost tracking. Use gateway model strings (`provider/model`, with dots for versions); do NOT pass raw provider API keys at request time.

```ts
// app/api/chat/route.ts
import { streamText, tool, stepCountIs } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    // AI Gateway model string. Auth via `vercel env pull` OIDC (no raw API keys).
    model: 'anthropic/claude-sonnet-4.6',
    system: 'You are a helpful shopping assistant for {brand}. Use the tools to search inventory.',
    messages,
    tools: {
      searchProducts: tool({
        description: 'Search product inventory',
        inputSchema: z.object({ query: z.string() }),
        execute: async ({ query }) => {
          return await db.product.findMany({ where: { title: { contains: query } } });
        },
      }),
      addToCart: tool({
        description: 'Add product to cart',
        inputSchema: z.object({ productId: z.string(), qty: z.number().default(1) }),
        execute: async ({ productId, qty }) => {
          return await cart.add(productId, qty);
        },
      }),
    },
    stopWhen: stepCountIs(5),  // v6: replaces maxSteps
  });

  // v6: for chat UIs consuming useChat → toUIMessageStreamResponse()
  return result.toUIMessageStreamResponse();
  // Plain text clients use: result.toTextStreamResponse()
}
```

## Layer 4 — Patterns

### Conversational shopping

Assistant uses `searchProducts` + `addToCart` tools. User describes desired product in natural language; AI filters + suggests + cart-adds.

### Support with escalation

```tsx
<Conversation>
  {messages.map(m => <Message {...m} />)}
  {confidence < 0.6 && (
    <EscalationButton onClick={() => openLiveChat(conversationId)}>
      Talk to a human
    </EscalationButton>
  )}
</Conversation>
```

Escalation preserves conversation history; human agent sees full context.

### Onboarding tour

System prompt: "Walk the user through key features. Ask questions to personalize. End with a goal-specific CTA."

Limited tool set: `highlightElement(selector)`, `navigateTo(path)`.

### Documentation search (RAG)

```ts
// Embeddings search
const docs = await embeddings.search(query, { topK: 5 });
// Stuff into system prompt
const systemWithContext = `Answer using these docs only:\n${docs.join('\n---\n')}`;
```

Cite sources inline via `ToolResult` pattern.

### Product configurator

Multi-step tool calls build up a product spec:
```
1. configureSize({ S | M | L })
2. configureColor({ red | blue | green })
3. configureBadges({ ... })
4. finalize() → show summary + addToCart
```

## Layer 5 — Brand voice

Chat personality anchored by DNA + archetype:
- Playful archetype: casual, emoji, contractions
- Luxury: formal, concise, never exclamation points
- Data-Dense: precise, tabular responses, citations

Brand-voice-extraction skill feeds system prompt.

## Layer 6 — Integration

- **Auth**: Vercel AI Gateway via OIDC — `vercel env pull` locally; on Vercel deploys OIDC is automatic. No raw provider secrets in app code.
- **Model strings**: use Gateway format (`anthropic/claude-sonnet-4.6`, `openai/gpt-5`, `google/gemini-2.5-pro`, etc.) with dots for version numbers, not hyphens.
- **Fallback + routing**: configure provider fallback chains in Gateway dashboard; failover is automatic without app-code changes.
- `/gen:ai-chat scaffold <pattern>` generates matching backend + frontend
- Cost tracking: every `/api/chat` invocation records to cost-tracker; Gateway dashboard provides cross-provider cost visibility
- UX sub-gate: ai-chat page passes conversion-gate (CV5 CTA specificity tested on assistant suggestions)

## Layer 7 — Anti-patterns

- ❌ Sync (non-streaming) responses — user waits with no feedback
- ❌ Raw LLM output without MessageResponse — rendering inconsistency
- ❌ No tool result visibility — user can't see what AI actually did
- ❌ Unbounded `stopWhen` (or legacy `maxSteps`) — cost runaway
- ❌ Raw provider API keys in app code — bypasses Gateway auth + failover + cost tracking
- ❌ `toDataStreamResponse()` (v5 API) — removed in v6; use `toUIMessageStreamResponse()` for chat or `toTextStreamResponse()` for plain text
- ❌ Hyphenated model version (`claude-sonnet-4-6`) — Gateway expects dots (`claude-sonnet-4.6`)
- ❌ Missing escalation path — users stuck with unhelpful AI
