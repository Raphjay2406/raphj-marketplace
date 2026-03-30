---
name: "ai-ui-components"
description: "AI Elements integration guide. Component reference for Message, MessageResponse, Conversation, Tool, Reasoning, CodeBlock, PromptInput with DNA theming."
tier: "domain"
triggers: "ai elements, message component, chat component, ai rendering, ai text display"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

This skill applies whenever a project renders AI-generated text or builds a conversational interface. Load it alongside `ai-ui-patterns` for any AI product UI.

- **Rendering any AI-generated text** -- `<MessageResponse>` handles markdown, code, lists, and tables from LLM output. Never render raw strings
- **Building a chat interface** -- `<Message>`, `<Conversation>`, and `<PromptInput>` compose the full chat experience with streaming built in
- **Displaying tool call results** -- `<Tool>` renders structured tool invocation and result data with consistent styling
- **Showing model reasoning** -- `<Reasoning>` surfaces chain-of-thought and extended thinking traces in a collapsible UI
- **Rendering AI-generated code** -- `<CodeBlock>` provides syntax highlighting, copy button, and language label out of the box
- **Installing specific components** -- run `npx ai-elements@latest add <component>` for only the components you need

### MANDATORY RULE

> **Never render AI-generated text as raw `{text}` or `<p>{content}</p>`.**
>
> Raw rendering exposes markdown symbols (`**`, `##`, `-`, backtick fences) directly to the user. Always use `<MessageResponse>` for any standalone AI text, or `<Message>` inside a `<Conversation>`.
>
> **Anti-Slop Gate penalty: -5 for raw AI text rendering.**

### When NOT to Use

- **Static content with no AI output** -- No AI text to render means no need for these components. Use standard HTML/TSX elements
- **Server-side only AI pipelines** -- Use `api-patterns` for route handler patterns. AI Elements is a client-side rendering library
- **Non-React frameworks** -- AI Elements is React-only. Use AI SDK hooks directly for Vue or Svelte projects

### Decision Tree

- **Displaying a message in a chat UI?** -> `<Message>` inside `<Conversation>` with `useChat`
- **Displaying AI text outside a chat (report, email, notification, workflow step)?** -> `<MessageResponse>`
- **Need the full chat interface?** -> `<Conversation>` wrapping `<Message>` list + `<PromptInput>`
- **AI used a tool and you want to show it?** -> `<Tool>` component
- **Model returned reasoning traces?** -> `<Reasoning>` component
- **AI returned code?** -> `<CodeBlock>` (also rendered automatically inside `<MessageResponse>`)
- **User needs to type a message with file attachment?** -> `<PromptInput>`

### Pipeline Connection

- **Referenced by:** builder agent during `/gen:build` for any AI-feature section
- **Consumed at:** wave 2+ section implementation whenever AI text rendering appears
- **Depends on:** `ai-ui-patterns` for pattern-level context, `ai-pipeline-features` for pipeline AI integration

---

## Layer 2: Component Reference

### Installation

Install only the components you actually use. Do NOT run `npx ai-elements@latest` without arguments -- this installs 48 components and may introduce type conflicts.

```bash
# Install specific components (recommended)
npx ai-elements@latest add message          # MessageResponse -- required for any AI text
npx ai-elements@latest add conversation     # Full chat UI container
npx ai-elements@latest add code-block       # Syntax-highlighted code
npx ai-elements@latest add tool             # Tool call display
npx ai-elements@latest add reasoning        # Collapsible thinking display
npx ai-elements@latest add prompt-input     # Chat input with attachments
```

Components install into `src/components/ai-elements/` with full source access.

### Component Overview

| Component | Purpose | Primary Use Case |
|-----------|---------|-----------------|
| `<Message>` | Renders a single chat message with all part types | Chat UIs with `useChat` hook |
| `<MessageResponse>` | Renders any AI-generated markdown string | ANY AI text outside of chat context |
| `<Conversation>` | Chat container with auto-scroll and scroll-to-bottom | Full chat interface layout |
| `<Tool>` | Renders tool call invocation, status, and result | When AI invokes tools during a response |
| `<Reasoning>` | Collapsible display of model thinking traces | Transparency UIs, debug views |
| `<CodeBlock>` | Syntax-highlighted code with copy button | AI-generated code output |
| `<PromptInput>` | Chat input with file attachment support | Chat input area |

---

### Pattern: MessageResponse -- Standalone AI Text

Use `<MessageResponse>` any time AI-generated text appears outside a chat thread: workflow results, report summaries, email drafts, onboarding copy, product descriptions.

```tsx
import { MessageResponse } from "@/components/ai-elements/message";

interface AIReportProps {
  content: string; // raw LLM output -- may contain markdown
}

export function AIReport({ content }: AIReportProps) {
  return (
    <section className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-8">
      <h2 className="font-display text-[var(--text)] mb-6 text-2xl">
        Analysis
      </h2>
      {/* CORRECT: MessageResponse handles markdown, code blocks, lists */}
      <MessageResponse className="prose prose-invert text-[var(--text-muted)]">
        {content}
      </MessageResponse>
    </section>
  );
}

// WRONG -- never do this:
// <p>{content}</p>
// <div>{content}</div>
```

---

### Pattern: Full Chat Interface

Complete chat UI wiring `useChat` to `<Conversation>`, `<Message>`, and `<PromptInput>`.

```tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Conversation } from "@/components/ai-elements/conversation";
import { Message } from "@/components/ai-elements/message";
import { PromptInput } from "@/components/ai-elements/prompt-input";

export function ChatInterface() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  return (
    <div className="flex flex-col h-screen bg-[var(--bg)]">
      {/* Scrollable message area with built-in auto-scroll */}
      <Conversation className="flex-1 overflow-y-auto px-4 py-6">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            className="mb-4"
          />
        ))}
      </Conversation>

      {/* Input bar */}
      <div className="border-t border-[var(--border)] p-4">
        <PromptInput
          onSubmit={(text) => sendMessage({ text })}
          isLoading={status === "streaming"}
          placeholder="Ask anything..."
          className="bg-[var(--surface)] border-[var(--border)]"
        />
      </div>
    </div>
  );
}
```

The `<Message>` component handles all part types automatically -- text, tool calls, reasoning, images -- without manual `part.type` switching.

---

### Pattern: Message Parts -- Manual Iteration

When you need fine-grained control over how each part of a message renders, iterate `message.parts` directly.

```tsx
import { MessageResponse } from "@/components/ai-elements/message";
import { Tool } from "@/components/ai-elements/tool";
import { Reasoning } from "@/components/ai-elements/reasoning";
import { isToolUIPart, type UIMessage } from "ai";

interface CustomMessageProps {
  message: UIMessage;
}

export function CustomMessage({ message }: CustomMessageProps) {
  return (
    <div className="space-y-3">
      {message.parts.map((part, i) => {
        if (part.type === "text") {
          return (
            <MessageResponse key={i} className="text-[var(--text)]">
              {part.text}
            </MessageResponse>
          );
        }

        if (part.type === "reasoning") {
          return <Reasoning key={i} content={part.reasoning} />;
        }

        // isToolUIPart catches all tool-{toolName} typed parts (v6 pattern)
        // part.state values: "input-streaming" | "input-available" | "output-available"
        if (isToolUIPart(part)) {
          return (
            <Tool
              key={i}
              toolInvocation={{
                toolName: part.toolName,
                toolCallId: part.toolCallId,
                state: part.state,
                // input only available when state is input-available or output-available
                ...(part.state !== "input-streaming" && { args: part.input }),
                // output only available when state is output-available
                ...(part.state === "output-available" && { result: part.output }),
              }}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
```

---

### Pattern: Server Route (AI SDK v6)

The canonical server-side handler that pairs with `useChat` on the client.

```ts
// app/api/chat/route.ts
import { streamText, convertToModelMessages } from "ai";
import { type UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // convertToModelMessages is async in v6
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: "anthropic/claude-sonnet-4.6", // routes through AI Gateway
    messages: modelMessages,
    system: "You are a helpful assistant.",
  });

  // toUIMessageStreamResponse: streams UIMessageStreamPart events
  // AI Elements Message component expects this format
  return result.toUIMessageStreamResponse();
}
```

Key v6 method names (not v5 equivalents):

| v6 (current) | v5 (deprecated -- do not use) |
|---|---|
| `convertToModelMessages()` (async) | `convertToCoreMessages()` |
| `toUIMessageStreamResponse()` | `toDataStreamResponse()` |
| `message.parts` | `message.content` (as array) |
| `new DefaultChatTransport({ api })` | `{ api }` string directly in `useChat` |

---

### DNA Theming

AI Elements uses shadcn/ui under the hood. Map shadcn CSS variables to DNA tokens in your global CSS, after the `@theme {}` block.

```css
/* Map AI Elements shadcn variables to DNA tokens */
:root {
  --background: var(--bg);
  --foreground: var(--text);
  --card: var(--surface);
  --card-foreground: var(--text);
  --border: var(--border);
  --input: var(--surface);
  --primary: var(--primary);
  --primary-foreground: var(--bg);
  --muted: var(--muted);
  --muted-foreground: var(--text-muted);
  --accent: var(--accent);
  --ring: var(--primary);
  --font-sans: var(--font-body);
  --font-mono: var(--font-mono);
}
```

Dark mode follows the DNA dark palette automatically when DNA tokens are properly defined.

---

### Reference Sites

- **Vercel AI Playground** (sdk.vercel.ai/playground) -- Exemplary streaming UX: messages appear token-by-token with cursor, tool calls expand inline, reasoning traces toggle without layout shift
- **Perplexity AI** (perplexity.ai) -- Best-in-class RAG rendering: sources cited inline, code blocks with language labels, structured answer sections
- **Linear Docs AI** (linear.app) -- Seamless AI text integration: AI responses blend with product typography, no visual seam between static and generated content
- **Cursor Chat** (cursor.com) -- Tool call transparency done right: each tool invocation shows args and result in collapsible panels without overwhelming the conversation

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `--bg` | `<Conversation>` outer background, `<Reasoning>` panel fill |
| `--surface` | Message bubbles, `<Tool>` card backgrounds, `<PromptInput>` field |
| `--text` | Primary message text, rendered markdown headings |
| `--text-muted` | Timestamps, tool metadata, secondary labels |
| `--border` | Message separator lines, `<Tool>` card borders, input borders |
| `--primary` | Send button, streaming cursor, active state indicators |
| `--accent` | Reasoning trace highlight, source citation badges |
| `--muted` | Disabled state backgrounds, placeholder text areas |
| `--font-body` | All prose content inside `<MessageResponse>` |
| `--font-mono` | `<CodeBlock>` font, tool argument display |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Brutalist | Bold message borders, high-contrast `--primary` send button, monospace UI font throughout |
| Ethereal | No message bubbles -- floating text on transparent surface, soft `--glow` on streaming cursor |
| Dark Academia | Serif display font for AI responses, parchment-toned `--surface`, ink-like streaming animation |
| AI-Native | Full transparency: always show `<Reasoning>` traces, expose token counts, surface `<Tool>` for every call |
| Neo-Corporate | Dense information layout, `<Tool>` panels with structured data tables, minimal color accent |
| Glassmorphism | Frosted `--surface` on message bubbles, `backdrop-blur` on `<PromptInput>`, `--glow` on send state |

### Pipeline Stage

- **Input from:** `ai-ui-patterns` pattern selection, DNA tokens from `DESIGN-DNA.md`
- **Output to:** builder agent -- concrete component usage for each AI section in the wave plan

### Related Skills

- `ai-ui-patterns` -- Pattern-level context; always loaded alongside this skill for AI product projects
- `ai-pipeline-features` -- Pipeline-internal AI features (image prompts, copy gen); distinct from user-facing components
- `api-patterns` -- Server route implementation details for the `/api/chat` handler
- `shadcn-components` -- Base component system AI Elements builds on; consult for customization beyond theming
- `dark-light-mode` -- DNA dark mode setup; required for correct AI Elements token inheritance

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Raw AI Text Rendering

**What goes wrong:** Rendering LLM output as `{text}` or `<p>{content}</p>` exposes raw markdown syntax to users -- asterisks for bold, hashes for headings, backtick fences for code. The interface looks broken and unprofessional. Anti-Slop Gate penalty: **-5 points**.

**Instead:** Always wrap AI text in `<MessageResponse>{text}</MessageResponse>`. It handles all markdown, nested code blocks, tables, and lists. For chat messages, use `<Message message={msg} />` which calls `<MessageResponse>` internally.

### Anti-Pattern: Manual Markdown Parsing

**What goes wrong:** Implementing a custom markdown renderer with `react-markdown` config, remark plugins, and rehype transforms to handle AI output. This duplicates what AI Elements already provides, introduces inconsistencies, and adds maintenance burden.

**Instead:** Use `<MessageResponse>` directly. If customization is needed (extra remark plugins, custom renderers), extend via its `components` prop rather than replacing it with a parallel implementation.

### Anti-Pattern: Missing Streaming State Indicators

**What goes wrong:** The UI shows a frozen blank space while the model generates. Users interpret this as an error and abandon. The perceived latency feels 3-5x worse than it actually is.

**Instead:** `<Message>` handles the streaming cursor automatically when a message is in-progress. For `<MessageResponse>` with manual fetch, pass `isLoading` or show a `<Shimmer>` placeholder while the request is active.

### Anti-Pattern: Not Using useChat for Chat Interfaces

**What goes wrong:** Implementing chat with manual `fetch` calls, manual streaming with `ReadableStream`, and hand-rolled message state management. This loses automatic retry, optimistic UI, abort on new message, and part-level streaming support.

**Instead:** Use `useChat` with `new DefaultChatTransport({ api: '/api/chat' })`. It handles all streaming internals, exposes `message.parts` for granular rendering, and integrates directly with `<Conversation>` and `<Message>`.

### Anti-Pattern: Using AI SDK v5 Patterns

**What goes wrong:** Using v5 method names (`convertToCoreMessages`, `toDataStreamResponse`, passing `{ api }` directly to `useChat`) with a v6 server causes silent failures or type errors. Generic tool part types from v5 and `reasoning` are not surfaced to the client correctly -- use `isToolUIPart(part)` as the v6 catch-all for tool parts.

**Instead:** Use the v6 API throughout: `await convertToModelMessages()` on the server (async), `toUIMessageStreamResponse()` for the response, `new DefaultChatTransport({ api })` on the client, and `message.parts` for iteration. See the server route pattern in Layer 2 for the complete v6 setup.

### Anti-Pattern: Installing All AI Elements Components

**What goes wrong:** Running `npx ai-elements@latest` without specifying components installs 48 components including ones with `@base-ui/react` dependencies that conflict with certain shadcn versions, causing type errors that are hard to trace.

**Instead:** Install only the components you use: `npx ai-elements@latest add message conversation tool`. If a type error appears in an installed component, reinstall it with `--overwrite` rather than suppressing types with a nocheck comment. Suppressing types hides real bugs and breaks IDE support.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Raw AI text renders | 0 | 0 | occurrences | HARD -- reject, -5 Anti-Slop penalty |
| MessageResponse usage for standalone AI text | 1 | -- | per AI text block | HARD -- required |
| AI SDK version | 6 | -- | major version | HARD -- v5 patterns rejected |
| Type suppression comments in AI Elements files | 0 | 0 | occurrences | HARD -- forbidden, reinstall component with --overwrite instead |
