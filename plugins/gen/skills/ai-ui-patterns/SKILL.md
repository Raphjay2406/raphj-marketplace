---
name: "ai-ui-patterns"
description: "AI product design pattern catalog. 8 patterns for chat, search, smart forms, content generation, model comparison, RAG, dashboards, and prompt playgrounds with DNA-styled TSX."
tier: "domain"
triggers: "ai interface, chat ui, ai search, ai dashboard, prompt playground, ai features"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

This skill applies to any Genorah project that includes AI-powered user interfaces. Load it when the project includes any of these:

- **Chat or conversational interfaces** -- Any UI where users interact with an LLM through message-based exchange, including customer support bots, coding assistants, and general-purpose chat
- **AI-powered search** -- Natural language query interfaces that return structured results with source citations, semantic search, or hybrid keyword+vector search
- **Smart form completion** -- Forms where AI assists users by suggesting field values, auto-completing entries, or validating input with confidence scoring
- **Content generation workflows** -- Prompt-to-draft-to-publish pipelines where users generate, edit, compare versions, and finalize AI-produced content
- **Model comparison tools** -- Side-by-side output comparison across models or parameter sets, common in AI product dashboards and internal tools
- **RAG-based interfaces** -- Retrieval-augmented generation UIs showing retrieval progress, source documents, and cited answers
- **AI analytics dashboards** -- Token usage tracking, cost monitoring, model performance benchmarking, and usage analytics
- **Prompt engineering tools** -- Multi-model editors with parameter controls, output panels, and saved prompt libraries

### When NOT to Use

- **Static marketing sites with no AI features** -- Use standard Genorah skills (typography, color-system, layout). This skill adds unnecessary complexity when there is no AI interaction
- **Server-only AI pipelines with no UI** -- Use `api-patterns` skill for server-side integration. This skill covers frontend patterns only
- **Simple contact forms** -- Use `api-patterns` for CRM integration. Smart forms pattern applies only when AI assists field completion
- **Data visualization without AI** -- Use `chart-data-viz` skill. This skill covers AI-specific dashboard patterns, not general charting

### Decision Tree

- **Users type messages and receive streamed responses?** -> Pattern 1: Chat Interface
- **Users search with natural language and get structured results?** -> Pattern 2: AI Search
- **Forms need AI-assisted completion or validation?** -> Pattern 3: Smart Forms
- **Users generate content through prompt -> draft -> edit flow?** -> Pattern 4: Content Generation UI
- **Need to compare outputs across models or parameters?** -> Pattern 5: Model Comparison
- **Search needs retrieval step with source citations?** -> Pattern 6: RAG Search Interface
- **Tracking AI usage, costs, or performance metrics?** -> Pattern 7: AI Dashboard
- **Building a prompt engineering or testing tool?** -> Pattern 8: Prompt Playground

### Pipeline Connection

- **Referenced by:** builder agent during `/gen:build` for AI-feature sections
- **Consumed at:** `/gen:build` wave 2+ when implementing AI interaction sections
- **Depends on:** `ai-ui-components` skill for component-level reference, `ai-pipeline-features` for pipeline-stage AI integration

---

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: Chat Interface

Full streaming chat with message history, tool call display, and DNA-themed styling.

**Component structure:**
- `ChatContainer` -- outer layout with DNA bg/surface tokens
- `MessageList` -- scrollable message area with auto-scroll
- `Message` / `MessageResponse` -- individual message rendering (from ai-ui-components)
- `ToolCallDisplay` -- expandable tool invocation results
- `PromptInput` -- input area with file attachment and submit

**Data flow:**
```
User input -> useChat() -> AI SDK stream -> MessageList update
                        -> tool calls -> ToolCallDisplay
                        -> onFinish -> persist to DB (optional)
```

**AI SDK hooks:** `useChat` with `DefaultChatTransport`

```tsx
"use client";

import { useChat, DefaultChatTransport } from "@ai-sdk/react";
import { stepCountIs } from "ai";
import { Conversation, Message, MessageResponse, PromptInput, Tool } from "ai-elements";

const transport = new DefaultChatTransport({ api: "/api/chat" });

export function ChatInterface() {
  const { messages, input, setInput, sendMessage, status, error } = useChat({
    transport,
    stopWhen: stepCountIs(5), // allow multi-step tool use
  });

  const isActive = status === "streaming" || status === "submitted";

  return (
    <section className="flex h-[calc(100vh-var(--nav-height))] flex-col bg-bg">
      {/* Message area */}
      <Conversation className="flex-1 overflow-y-auto px-6 py-8">
        {messages.map((message) => (
          <div key={message.id} className="mx-auto max-w-3xl">
            {message.role === "user" ? (
              <Message
                role="user"
                className="bg-surface text-text rounded-xl px-4 py-3"
              >
                {message.content}
              </Message>
            ) : (
              <>
                <MessageResponse
                  content={message.content}
                  className="prose text-text"
                />
                {/* Tool call results -- filter by tool-<toolName> part type (AI SDK v6) */}
                {message.parts
                  ?.filter((p) => p.type.startsWith("tool-"))
                  .map((part, i) => (
                    <Tool
                      key={i}
                      name={part.toolName}
                      state={part.state}
                      result={part.state === "result" ? part.result : undefined}
                      className="mt-2 rounded-lg border border-border bg-surface p-3"
                    />
                  ))}
              </>
            )}
          </div>
        ))}
      </Conversation>

      {/* Error display */}
      {error && (
        <div className="mx-auto max-w-3xl px-6 py-2 text-sm text-accent">
          {error.message}
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-border bg-surface px-6 py-4">
        <PromptInput
          value={input}
          onChange={setInput}
          onSubmit={() => sendMessage({ text: input })}
          isLoading={isActive}
          placeholder="Type a message..."
          className="mx-auto max-w-3xl"
        />
      </div>
    </section>
  );
}
```

**DNA integration points:**
- `bg-bg` / `bg-surface` for container and input area backgrounds
- `text-text` for message content, `text-muted` for timestamps
- `border-border` for input area separator and tool call containers
- `bg-primary` / `text-primary` for user message accent or send button
- Motion tokens for message entrance animations (fade-in-up, stagger)

**Key UX considerations:**
- Auto-scroll to latest message but allow scroll-up to read history
- Show typing/streaming indicator with skeleton or pulsing dots
- Persist conversation across page reloads via server-side storage
- Allow message regeneration and conversation branching
- Mobile: full-height layout with virtual keyboard accommodation

---

#### Pattern 2: AI Search

Natural language query that returns structured, cited results.

**Component structure:**
- `SearchBar` -- NL input with suggested queries
- `SearchResults` -- structured result cards with relevance scoring
- `SourceCitation` -- inline citation links with preview popover
- `SearchFilters` -- optional faceted filtering on results

**Data flow:**
```
NL query -> useCompletion() or useObject() -> structured results
         -> source retrieval -> citation mapping
         -> facet extraction -> filter UI update
```

**AI SDK hooks:** `useObject` for structured output, `useCompletion` for freeform

```tsx
"use client";

import { useObject } from "@ai-sdk/react";
import { z } from "zod";

const searchResultSchema = z.object({
  results: z.array(z.object({
    title: z.string(),
    summary: z.string(),
    relevance: z.number().min(0).max(1),
    sources: z.array(z.object({
      title: z.string(),
      url: z.string(),
      snippet: z.string(),
    })),
  })),
  suggestedFollowups: z.array(z.string()),
});

export function AISearch() {
  const { object, submit, isLoading, error } = useObject({
    api: "/api/search",
    schema: searchResultSchema,
  });

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Ask anything..."
          className="w-full rounded-2xl border border-border bg-surface px-6 py-4 text-lg text-text
                     placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          onKeyDown={(e) => {
            if (e.key === "Enter") submit(e.currentTarget.value);
          }}
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Results */}
      {object?.results?.map((result, i) => (
        <article
          key={i}
          className="mt-6 rounded-xl border border-border bg-surface p-6"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <h3 className="text-lg font-semibold text-text">{result.title}</h3>
          <p className="mt-2 text-muted">{result.summary}</p>

          {/* Source citations */}
          <div className="mt-3 flex flex-wrap gap-2">
            {result.sources?.map((source, j) => (
              <a
                key={j}
                href={source.url}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1
                           text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <span className="opacity-60">[{j + 1}]</span> {source.title}
              </a>
            ))}
          </div>
        </article>
      ))}

      {/* Follow-up suggestions */}
      {object?.suggestedFollowups && (
        <div className="mt-8 flex flex-wrap gap-2">
          {object.suggestedFollowups.map((q, i) => (
            <button
              key={i}
              onClick={() => submit(q)}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted
                         hover:border-primary hover:text-primary transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
```

**DNA integration points:**
- `bg-surface` for result cards, `bg-primary/10` for citation chips
- `text-primary` for interactive elements and citation links
- `border-border` for card boundaries, `border-primary` for focus states
- Spacing tokens for result card gaps and internal padding

**Key UX considerations:**
- Show partial results as they stream in (progressive rendering)
- Citation numbers must be consistent and clickable
- Provide follow-up query suggestions to maintain engagement
- Empty state with example queries to guide first interaction
- Keyboard navigation through results

---

#### Pattern 3: Smart Forms

AI-assisted form fields with suggestion dropdowns and confidence indicators.

**Component structure:**
- `SmartFormField` -- input with AI suggestion popover
- `SuggestionDropdown` -- ranked suggestions with confidence bars
- `ConfidenceIndicator` -- visual confidence level (high/medium/low)
- `FormValidation` -- AI-powered validation with explanatory messages

**Data flow:**
```
User types -> debounced useCompletion() -> suggestions array
           -> user selects or continues typing
           -> on blur -> AI validation -> confidence score
```

**AI SDK hooks:** `useCompletion` for field suggestions

```tsx
"use client";

import { useCompletion } from "@ai-sdk/react";
import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export function SmartFormField({
  label,
  fieldContext,
}: {
  label: string;
  fieldContext: string;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { completion, complete, isLoading } = useCompletion({
    api: "/api/suggest",
  });

  const debouncedComplete = useDebouncedCallback(
    (value: string) => {
      if (value.length > 2) {
        complete(`Field: ${fieldContext}\nPartial input: ${value}`);
        setShowSuggestions(true);
      }
    },
    300
  );

  const suggestions = completion
    ? completion.split("\n").filter(Boolean).slice(0, 5)
    : [];

  return (
    <div className="relative">
      <label className="mb-1 block text-sm font-medium text-text">{label}</label>
      <input
        type="text"
        onChange={(e) => debouncedComplete(e.target.value)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-text
                   focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />

      {/* AI suggestion dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-surface shadow-lg">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-text
                         hover:bg-primary/5 transition-colors first:rounded-t-lg last:rounded-b-lg"
              onMouseDown={(e) => {
                e.preventDefault();
                // Apply suggestion to input
              }}
            >
              <span className="flex-1">{suggestion}</span>
              {/* Confidence indicator */}
              <span className={`h-2 w-2 rounded-full ${
                i === 0 ? "bg-green-500" : i < 3 ? "bg-yellow-500" : "bg-muted"
              }`} />
            </button>
          ))}
          {isLoading && (
            <div className="px-4 py-2 text-xs text-muted">Thinking...</div>
          )}
        </div>
      )}
    </div>
  );
}
```

**DNA integration points:**
- `bg-bg` for input background, `bg-surface` for dropdown
- `border-primary` and `ring-primary/20` for focus states
- `text-muted` for placeholder and loading text
- Signature element can style the confidence indicator

**Key UX considerations:**
- Debounce AI calls to avoid excessive requests (300ms minimum)
- Allow keyboard navigation through suggestions (arrow keys + enter)
- Show loading state in dropdown, not as full-page blocker
- Never auto-submit -- user must explicitly confirm AI suggestions
- Confidence scoring must be honest -- do not inflate scores

---

#### Pattern 4: Content Generation UI

Prompt-to-draft-to-edit-to-publish workflow with version tracking.

**Component structure:**
- `PromptComposer` -- rich prompt input with template selection
- `GenerationProgress` -- streaming progress with word count
- `DraftEditor` -- editable generated content with inline AI suggestions
- `VersionComparison` -- side-by-side diff between draft versions
- `PublishControls` -- finalize, schedule, or export actions

**Data flow:**
```
Prompt + template -> useChat() with system prompt -> streaming draft
                  -> user edits -> save version
                  -> regenerate/refine -> new version
                  -> diff comparison -> select final
                  -> publish action
```

**AI SDK hooks:** `useChat` for iterative refinement, `useCompletion` for inline suggestions

```tsx
"use client";

import { useChat, DefaultChatTransport } from "@ai-sdk/react";
import { MessageResponse } from "ai-elements";
import { useState } from "react";

const transport = new DefaultChatTransport({ api: "/api/generate" });

export function ContentGenerator() {
  const [versions, setVersions] = useState<string[]>([]);
  const [activeVersion, setActiveVersion] = useState(0);

  const { messages, input, setInput, sendMessage, status } = useChat({
    transport,
    onFinish(message) {
      setVersions((prev) => [...prev, message.content]);
      setActiveVersion(versions.length);
    },
  });

  const isActive = status === "streaming" || status === "submitted";
  const latestAssistant = messages.filter((m) => m.role === "assistant").at(-1);

  return (
    <section className="grid h-[calc(100vh-var(--nav-height))] grid-cols-[1fr_1fr] gap-0">
      {/* Left: Prompt + controls */}
      <div className="flex flex-col border-r border-border bg-bg">
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-xl font-bold text-text">Generate Content</h2>

          {/* Version tabs */}
          {versions.length > 1 && (
            <div className="mt-4 flex gap-1">
              {versions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveVersion(i)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    activeVersion === i
                      ? "bg-primary text-white"
                      : "bg-surface text-muted hover:text-text"
                  }`}
                >
                  v{i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Prompt input */}
        <div className="border-t border-border p-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to generate..."
            rows={4}
            className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-text
                       placeholder:text-muted focus:border-primary focus:outline-none"
          />
          <button
            onClick={() => sendMessage({ text: input })}
            disabled={isActive || !input.trim()}
            className="mt-3 w-full rounded-xl bg-primary px-6 py-3 font-medium text-white
                       disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {isActive ? "Generating..." : versions.length ? "Regenerate" : "Generate"}
          </button>
        </div>
      </div>

      {/* Right: Output preview */}
      <div className="overflow-y-auto bg-surface p-8">
        {latestAssistant ? (
          <MessageResponse
            content={versions[activeVersion] ?? latestAssistant.content}
            className="prose prose-lg text-text max-w-none"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            Your generated content will appear here
          </div>
        )}
      </div>
    </section>
  );
}
```

**DNA integration points:**
- Split-panel layout uses `bg-bg` and `bg-surface` for visual separation
- `bg-primary` for generate button, version tab active state
- Typography scale for generated content preview (prose styling)
- Motion tokens for content streaming entrance animation

**Key UX considerations:**
- Preserve all versions for comparison -- never overwrite
- Show word count and estimated reading time during generation
- Allow partial regeneration (highlight text + "regenerate this section")
- Export options: markdown, HTML, plain text

---

#### Pattern 5: Model Comparison

Side-by-side outputs with parameter controls and diff highlighting.

**Component structure:**
- `ModelSelector` -- dropdown or tab per model slot
- `ParameterControls` -- temperature, max tokens, top-p sliders
- `OutputPanel` -- per-model streaming output
- `DiffView` -- character-level or semantic diff between outputs

**Data flow:**
```
Shared prompt -> parallel useChat() per model -> independent streams
              -> diff engine on completion -> highlighted differences
              -> user rates/selects preferred output
```

**AI SDK hooks:** Multiple `useChat` instances with different API endpoints or model parameters

```tsx
"use client";

import { useChat, DefaultChatTransport } from "@ai-sdk/react";
import { MessageResponse } from "ai-elements";

const models = [
  { id: "gpt-4o", label: "GPT-4o", api: "/api/chat/gpt4o" },
  { id: "claude-sonnet", label: "Claude Sonnet", api: "/api/chat/claude" },
];

export function ModelComparison() {
  const chatInstances = models.map((model) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useChat({ transport: new DefaultChatTransport({ api: model.api }) })
  );

  const handleCompare = (prompt: string) => {
    chatInstances.forEach((chat) => {
      chat.sendMessage({ text: prompt });
    });
  };

  return (
    <section className="flex h-screen flex-col bg-bg">
      {/* Shared prompt bar */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <input
          type="text"
          placeholder="Enter prompt to compare across models..."
          className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCompare(e.currentTarget.value);
          }}
        />
      </div>

      {/* Side-by-side outputs */}
      <div className="grid flex-1 grid-cols-2 divide-x divide-border overflow-hidden">
        {models.map((model, i) => {
          const chat = chatInstances[i];
          const latest = chat.messages.filter((m) => m.role === "assistant").at(-1);
          return (
            <div key={model.id} className="flex flex-col overflow-y-auto">
              <div className="sticky top-0 border-b border-border bg-surface/80 px-4 py-2 backdrop-blur-sm">
                <span className="text-sm font-semibold text-text">{model.label}</span>
                {(chat.status === "streaming" || chat.status === "submitted") && (
                  <span className="ml-2 text-xs text-primary animate-pulse">streaming...</span>
                )}
              </div>
              <div className="flex-1 p-6">
                {latest ? (
                  <MessageResponse content={latest.content} className="prose text-text" />
                ) : (
                  <p className="text-muted">Awaiting prompt...</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

**DNA integration points:**
- `divide-border` for panel separator
- `bg-surface/80` with `backdrop-blur-sm` for sticky model headers
- `text-primary` for streaming indicator
- Consistent typography across both panels using DNA type scale

**Key UX considerations:**
- Both panels must stream independently and simultaneously
- Show token count and latency per model after completion
- Provide diff toggle to highlight differences between outputs
- Allow copying individual outputs or the comparison summary

---

#### Pattern 6: RAG Search Interface

Query with retrieval progress, sourced answers, and citation links.

**Component structure:**
- `QueryInput` -- search input with context scope selector
- `RetrievalProgress` -- animated progress showing document retrieval steps
- `SourcedAnswer` -- AI answer with inline numbered citations
- `SourcePanel` -- expandable panel showing retrieved source documents
- `ConfidenceBar` -- retrieval confidence visualization

**Data flow:**
```
Query -> useChat() with RAG tools -> tool call: retrieve_documents
      -> tool result: sources[] -> continue generation with context
      -> streamed answer with [1][2] citation markers
      -> citation hover -> source preview
```

**AI SDK hooks:** `useChat` with tool-based retrieval (multi-step)

```tsx
"use client";

import { useChat, DefaultChatTransport } from "@ai-sdk/react";
import { stepCountIs } from "ai";
import { MessageResponse, Tool } from "ai-elements";

const transport = new DefaultChatTransport({ api: "/api/rag" });

export function RAGSearch() {
  const { messages, input, setInput, sendMessage, status } = useChat({
    transport,
    stopWhen: stepCountIs(3), // retrieve -> synthesize -> cite
  });

  const isActive = status === "streaming" || status === "submitted";
  const lastAssistant = messages.filter((m) => m.role === "assistant").at(-1);
  const retrievalSteps = lastAssistant?.parts?.filter(
    (p) => p.type.startsWith("tool-")
  );

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      {/* Query input */}
      <div className="relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage({ text: input })}
          placeholder="Search your knowledge base..."
          className="w-full rounded-2xl border border-border bg-surface px-6 py-4 text-lg text-text
                     placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Retrieval progress */}
      {isActive && retrievalSteps && (
        <div className="mt-6 space-y-2">
          {retrievalSteps.map((step, i) => (
            <Tool
              key={i}
              name={step.toolName}
              state={step.state}
              className="rounded-lg border border-border bg-surface/50 p-3 text-sm"
            />
          ))}
        </div>
      )}

      {/* Sourced answer */}
      {lastAssistant && (
        <div className="mt-8">
          <MessageResponse
            content={lastAssistant.content}
            className="prose prose-lg text-text"
          />

          {/* Source documents panel */}
          {retrievalSteps?.some((s) => s.state === "result") && (
            <details className="mt-6 rounded-xl border border-border">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted hover:text-text transition-colors">
                View sources ({retrievalSteps.length} documents retrieved)
              </summary>
              <div className="divide-y divide-border px-4">
                {retrievalSteps
                  .filter((s) => s.state === "result")
                  .map((s, i) => (
                    <div key={i} className="py-3">
                      <p className="text-sm font-medium text-text">
                        [{i + 1}] {s.result?.title ?? "Source"}
                      </p>
                      <p className="mt-1 text-xs text-muted line-clamp-2">
                        {s.result?.snippet}
                      </p>
                    </div>
                  ))}
              </div>
            </details>
          )}
        </div>
      )}
    </section>
  );
}
```

**DNA integration points:**
- `bg-surface/50` for retrieval step cards (subtle layering)
- `border-border` and `divide-border` for source panel structure
- `text-muted` for secondary information, `text-text` for primary
- `text-primary` for citation number highlights

**Key UX considerations:**
- Show retrieval progress as it happens (not just a spinner)
- Citations must be numbered consistently and link to source panel
- Source panel should be collapsible to avoid overwhelming the answer
- Show confidence indicator when retrieval quality is uncertain
- Allow follow-up queries that retain previous context

---

#### Pattern 7: AI Dashboard

Token usage metrics, cost tracking, and model performance monitoring.

**Component structure:**
- `UsageOverview` -- summary cards for tokens, cost, requests
- `CostChart` -- time-series cost visualization with model breakdown
- `ModelPerformanceTable` -- latency, throughput, error rates per model
- `TokenDistribution` -- input vs output token pie/bar chart
- `AlertThresholds` -- cost and usage alert configuration

**Data flow:**
```
Server API -> periodic fetch / SSE -> aggregate metrics
           -> chart data transformation -> visualization
           -> threshold check -> alert display
```

**AI SDK hooks:** Standard `fetch` or SWR for dashboard data (not streaming AI hooks)

```tsx
"use client";

import { useState, useEffect } from "react";

interface UsageMetrics {
  totalTokens: number;
  totalCost: number;
  requestCount: number;
  modelBreakdown: { model: string; tokens: number; cost: number; avgLatency: number }[];
  dailyCosts: { date: string; cost: number }[];
}

export function AIDashboard() {
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);

  useEffect(() => {
    fetch("/api/ai/metrics").then((r) => r.json()).then(setMetrics);
  }, []);

  if (!metrics) return <DashboardSkeleton />;

  return (
    <section className="space-y-6 p-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard label="Total Tokens" value={metrics.totalTokens.toLocaleString()} />
        <MetricCard label="Total Cost" value={`$${metrics.totalCost.toFixed(2)}`} />
        <MetricCard label="Requests" value={metrics.requestCount.toLocaleString()} />
      </div>

      {/* Model performance table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium">Tokens</th>
              <th className="px-4 py-3 font-medium">Cost</th>
              <th className="px-4 py-3 font-medium">Avg Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {metrics.modelBreakdown.map((model) => (
              <tr key={model.model} className="text-text">
                <td className="px-4 py-3 font-medium">{model.model}</td>
                <td className="px-4 py-3">{model.tokens.toLocaleString()}</td>
                <td className="px-4 py-3">${model.cost.toFixed(4)}</td>
                <td className="px-4 py-3">{model.avgLatency}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-text">{value}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <section className="space-y-6 p-6">
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-surface" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-surface" />
    </section>
  );
}
```

**DNA integration points:**
- `bg-surface` for cards, `bg-bg` for table header (layered depth)
- `border-border` and `divide-border` for structural separation
- `text-text` for primary values, `text-muted` for labels
- `text-primary` for highlighted metrics or positive trends
- `text-accent` for alerts or negative trends

**Key UX considerations:**
- Show skeleton loading states, never blank screens
- Auto-refresh metrics on configurable interval
- Cost alerts must be prominent and actionable
- Table should be sortable by any column
- Mobile: stack summary cards vertically, horizontal-scroll table

---

#### Pattern 8: Prompt Playground

Multi-model tabbed editor with parameter sliders and output comparison.

**Component structure:**
- `PlaygroundTabs` -- model tabs with add/remove
- `PromptEditor` -- syntax-highlighted prompt textarea with variables
- `ParameterPanel` -- temperature, max_tokens, top_p sliders
- `SystemPromptEditor` -- collapsible system prompt area
- `OutputPanel` -- streaming output per model with metadata
- `SavedPrompts` -- prompt library sidebar

**Data flow:**
```
System prompt + user prompt + parameters -> per-tab useChat()
             -> streaming output per tab
             -> metadata capture (tokens, latency)
             -> save to prompt library (optional)
```

**AI SDK hooks:** `useChat` per tab instance

```tsx
"use client";

import { useChat, DefaultChatTransport } from "@ai-sdk/react";
import { MessageResponse, CodeBlock } from "ai-elements";
import { useState } from "react";

interface PlaygroundTab {
  id: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export function PromptPlayground() {
  const [tabs, setTabs] = useState<PlaygroundTab[]>([
    { id: "1", model: "gpt-4o", temperature: 0.7, maxTokens: 2048 },
  ]);
  const [activeTab, setActiveTab] = useState("1");
  const [systemPrompt, setSystemPrompt] = useState("");

  const tab = tabs.find((t) => t.id === activeTab)!;

  const { messages, input, setInput, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/playground",
      body: { model: tab.model, temperature: tab.temperature, maxTokens: tab.maxTokens, systemPrompt },
    }),
  });

  const isActive = status === "streaming" || status === "submitted";

  const lastAssistant = messages.filter((m) => m.role === "assistant").at(-1);

  return (
    <section className="grid h-screen grid-cols-[280px_1fr_1fr] bg-bg">
      {/* Left: Parameters */}
      <div className="flex flex-col gap-6 border-r border-border bg-surface p-4 overflow-y-auto">
        <div>
          <label className="text-xs font-medium text-muted">Model</label>
          <select
            value={tab.model}
            onChange={(e) =>
              setTabs((prev) =>
                prev.map((t) => (t.id === activeTab ? { ...t, model: e.target.value } : t))
              )
            }
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text"
          >
            <option value="gpt-4o">GPT-4o</option>
            <option value="claude-sonnet-4.1">Claude Sonnet</option>
            <option value="claude-opus-4">Claude Opus</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted">
            Temperature: {tab.temperature}
          </label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={tab.temperature}
            onChange={(e) =>
              setTabs((prev) =>
                prev.map((t) =>
                  t.id === activeTab ? { ...t, temperature: Number(e.target.value) } : t
                )
              )
            }
            className="mt-1 w-full accent-primary"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted">System Prompt</label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={6}
            className="mt-1 w-full resize-none rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text"
            placeholder="You are a helpful assistant..."
          />
        </div>
      </div>

      {/* Center: Prompt input */}
      <div className="flex flex-col border-r border-border">
        <div className="border-b border-border bg-surface/50 px-4 py-2">
          <span className="text-sm font-semibold text-text">Prompt</span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 resize-none bg-bg p-4 text-sm text-text font-mono
                     placeholder:text-muted focus:outline-none"
          placeholder="Enter your prompt..."
        />
        <div className="border-t border-border bg-surface px-4 py-3">
          <button
            onClick={() => sendMessage({ text: input })}
            disabled={isActive}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white
                       disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {isActive ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Right: Output */}
      <div className="flex flex-col overflow-y-auto">
        <div className="border-b border-border bg-surface/50 px-4 py-2">
          <span className="text-sm font-semibold text-text">Output</span>
          {isActive && (
            <span className="ml-2 text-xs text-primary animate-pulse">streaming...</span>
          )}
        </div>
        <div className="flex-1 p-4">
          {lastAssistant ? (
            <MessageResponse content={lastAssistant.content} className="prose text-text text-sm" />
          ) : (
            <p className="text-sm text-muted">Run a prompt to see output</p>
          )}
        </div>
      </div>
    </section>
  );
}
```

**DNA integration points:**
- Three-panel layout with `bg-bg`, `bg-surface`, `bg-surface/50` for depth layering
- `accent-primary` for range slider styling
- `border-border` for all panel dividers
- `font-mono` for prompt editor (uses DNA mono font)
- `bg-primary` for run button

**Key UX considerations:**
- Support multiple tabs for comparing same prompt across models
- Parameter changes should not lose existing output
- Save/load prompt templates with version history
- Show token count estimate before running
- Keyboard shortcut (Cmd/Ctrl+Enter) to run prompt

---

### Reference Sites

- **Vercel AI Chatbot** (chat.vercel.ai) -- Reference implementation of streaming chat with tool calls using AI SDK, excellent loading states and message rendering
- **Perplexity** (perplexity.ai) -- Best-in-class RAG search with progressive source retrieval, citation formatting, and follow-up suggestions
- **OpenAI Playground** (platform.openai.com/playground) -- Industry standard for prompt playground UX: parameter controls, model selection, output panels
- **Anthropic Console** (console.anthropic.com) -- Clean AI dashboard with usage metrics, cost tracking, and model comparison
- **ChatGPT** (chatgpt.com) -- Benchmark for chat UX: message rendering, code blocks, tool use display, conversation management

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in AI UI Patterns |
|-----------|------------------------|
| `bg` | Primary app background for all patterns |
| `surface` | Card backgrounds, input areas, panel backgrounds |
| `text` | Primary content text, message text, metric values |
| `muted` | Secondary labels, timestamps, placeholders, loading text |
| `border` | Panel dividers, card boundaries, input borders |
| `primary` | Interactive elements, active states, send buttons, streaming indicators |
| `accent` | Error states, alerts, confidence indicators |
| `glow` | Streaming cursor effect, AI thinking indicator |
| `signature` | Unique per-project element in chat or search branding |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| **Brutalist** | Monospace fonts in all AI text, raw unstyled tool output, high-contrast borders |
| **Ethereal** | Soft gradients on message bubbles, blur effects on loading states, whisper-light transitions |
| **Kinetic** | Aggressive streaming animations, bouncing indicators, slide-in messages |
| **Editorial** | Serif fonts in AI responses, newspaper-style citation formatting, elegant card layouts |
| **Neo-Corporate** | Clean sans-serif, minimal decoration, data-table-focused dashboard styling |
| **Neon Noir** | Dark backgrounds, glowing primary accents on inputs, neon streaming cursors |
| **AI-Native** | Meta-appropriate -- lean into technical aesthetic, show token counts, expose model metadata |
| **Japanese Minimal** | Maximum whitespace in chat, minimal UI chrome, single-accent-color interactions |
| **Glassmorphism** | Frosted glass panels, backdrop-blur on all surfaces, transparent layering |

### Pipeline Stage

- **Input from:** Design DNA (color tokens, fonts, spacing), archetype selection (variant behavior), section PLAN.md (which AI pattern to implement)
- **Output to:** Built section components, integration with api-patterns for server-side AI routes

### Related Skills

- **ai-ui-components** -- Component-level reference for Message, MessageResponse, Tool, etc. This skill provides the patterns; ai-ui-components provides the component API details
- **ai-pipeline-features** -- Pipeline-internal AI features. This skill covers user-facing AI UIs; ai-pipeline-features covers AI used within Genorah itself
- **api-patterns** -- Server-side route handlers for AI endpoints. AI UI patterns call these routes
- **chart-data-viz** -- For AI Dashboard pattern, use chart-data-viz for complex visualizations
- **cinematic-motion** -- Animation references for streaming effects, message entrances, loading transitions

### Project Type Mapping

| Project Type | Recommended Patterns |
|-------------|---------------------|
| SaaS with AI features | Chat Interface, Smart Forms, AI Dashboard |
| AI-native product | All 8 patterns as needed |
| Knowledge base / docs | RAG Search, AI Search |
| Content platform | Content Generation UI, Smart Forms |
| Developer tools | Prompt Playground, Model Comparison, AI Dashboard |
| Customer support | Chat Interface, RAG Search |
| E-commerce with AI | AI Search, Smart Forms |

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Raw AI Text Rendering

**What goes wrong:** Rendering AI-generated text directly as `{message.content}` or `<p>{text}</p>` bypasses markdown parsing, code highlighting, citation formatting, and streaming state handling. The result looks broken with raw markdown syntax visible to users.
**Instead:** Always use `<MessageResponse content={text} />` from ai-elements for ANY AI-generated text. This handles markdown rendering, code blocks, streaming states, and proper formatting automatically.

### Anti-Pattern: Blocking UI During Generation

**What goes wrong:** Showing a full-screen spinner or disabling the entire UI while waiting for AI response. Users cannot scroll history, navigate, or cancel. Long generations (30s+) feel broken.
**Instead:** Use streaming responses with `useChat` so text appears progressively. Keep the UI interactive during generation. Show a subtle inline loading indicator (pulsing dots or streaming cursor) near the generation point only. Allow cancel via AbortController.

### Anti-Pattern: Missing Loading and Empty States

**What goes wrong:** No visual feedback between user action and AI response. Empty screens with no guidance on first visit. Users do not know if the system is working or what to do.
**Instead:** Every AI pattern must have three states: (1) Empty state with example prompts or guidance text, (2) Loading state with progressive feedback (retrieval steps, word count, streaming text), (3) Error state with actionable message and retry option. Use skeleton components during data fetching.

### Anti-Pattern: No Error Recovery

**What goes wrong:** AI API calls fail (rate limits, network errors, model overload) and the UI shows a generic error or breaks silently. Users lose their input and must start over.
**Instead:** Preserve user input on error. Show specific, actionable error messages ("Rate limited -- retrying in 3s" not "Something went wrong"). Implement automatic retry with exponential backoff for transient errors. Allow manual retry for persistent errors. Log errors for debugging.

### Anti-Pattern: Ignoring Streaming Affordances

**What goes wrong:** Using `useCompletion` or `useObject` when `useChat` with tool use is needed, or vice versa. Choosing the wrong AI SDK hook leads to missing features (no tool calls, no multi-step, no conversation history).
**Instead:** Match the AI SDK hook to the interaction pattern: `useChat` for conversational/multi-turn, `useCompletion` for single-shot text generation, `useObject` for structured data output. See Pattern decision tree in Layer 1.

### Anti-Pattern: Unstyled Tool Call Output

**What goes wrong:** Tool invocation results displayed as raw JSON or ignored entirely. Users see `{"result": {"data": [...]}}` dumped into the chat.
**Instead:** Use the `<Tool>` component from ai-elements to render tool call results with proper formatting. Show tool name, execution state (loading/complete/error), and formatted result. Collapse verbose output behind an expandable section.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Message streaming chunk delay | 0 | 100 | ms | SOFT -- warn if artificial delay added |
| Chat auto-scroll threshold | 80 | 100 | % scroll position | SOFT -- auto-scroll when near bottom |
| Suggestion debounce delay | 200 | 500 | ms | HARD -- reject if under 200ms (API spam) |
| Search result display limit | 3 | 20 | items | SOFT -- warn if over 20 (UI overflow) |
| Dashboard refresh interval | 10 | 300 | seconds | SOFT -- warn if under 10s (excessive polling) |
| Prompt playground max tabs | 1 | 6 | tabs | HARD -- reject if over 6 (memory/UX) |
