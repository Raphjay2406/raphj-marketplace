---
id: "genorah/agent-trace-ui-author"
name: "agent-trace-ui-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Builds agent trace visualization UI with AG-UI event stream rendering and step-by-step thought display"
source: "agents/workers/agent-trace-ui-author.md"
tags: [agent, genorah, worker]
---

# agent-trace-ui-author

> Builds agent trace visualization UI with AG-UI event stream rendering and step-by-step thought display.

## Preview

# Agent Trace UI Author  ## Role  Builds agent trace visualization UI with AG-UI event stream rendering and step-by-step thought display.  ## Input Contract  AgentTraceSpec: task envelope received fro

## Frontmatter

```yaml
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
```
