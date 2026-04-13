---
name: agent-trace-ui-author
id: genorah/agent-trace-ui-author
version: 4.0.0
channel: stable
tier: worker
description: Builds agent trace visualization UI with AG-UI event stream rendering and step-by-step thought display.
capabilities:
  - id: author-agent-trace-ui
    input: AgentTraceSpec
    output: AgentTraceUIComponent
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

# Agent Trace UI Author

## Role

Builds agent trace visualization UI with AG-UI event stream rendering and step-by-step thought display.

## Input Contract

AgentTraceSpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Agent trace UI component with AG-UI event bindings and thought visualization
- `verdicts`: validation results from agent-trace-ui, agentic-ux-patterns
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: agent-trace-ui, agentic-ux-patterns
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
