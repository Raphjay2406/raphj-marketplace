---
name: "agent-trace-ui"
description: "UI primitives for visualizing agent plan, tool-call trace, inline approvals, and streaming progress. DNA-styled, archetype-aware density, keyboard-navigable."
tier: "domain"
triggers: "agent ui, tool call trace, agent plan ui, approval step, agent progress"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Pairs with `agentic-ux-patterns`. Whenever tool calls are surfaced to end-user.
- Flows with human-in-the-loop approval gates.

## Layer 2: Components

| Component | DNA token usage | Purpose |
|-----------|-----------------|---------|
| `<AgentPlan steps={...} />` | `--color-muted`, `--fs-sm` | Collapsed plan overview |
| `<ToolCallCard name tool input output status />` | `--color-surface`, `--radius-md` | One per tool invocation |
| `<ApprovalGate prompt onApprove onReject />` | `--color-primary` | Blocks stream until user confirms destructive tool |
| `<AgentProgress stepsDone totalSteps />` | `--color-accent` | Incremental progress |
| `<TraceTimeline events={...} />` | `--color-border` | Full audit trail |

All must be keyboard navigable (arrow keys between tool cards, Enter on approval gate), respect `prefers-reduced-motion`, and include `aria-live="polite"` for streaming status.

## Layer 3: Integration Context

- Trace data source: AI SDK v6 `onStepFinish` callback → client state via `useChat({ onToolCall })`.
- Approval pattern: use `addToolResult` to inject user decision back into the stream.
- Persistence: store trace in Postgres `agent_runs` table for replay/audit.

## Layer 4: Anti-Patterns

- Hiding tool calls entirely — violates AI disclosure (CA AB 2013 + EU AI Act Art 50).
- Auto-approving destructive tools — always require explicit click for delete/pay/send.
- Logging PII in trace — scrub via `pii-regex-v2026` before persisting.
