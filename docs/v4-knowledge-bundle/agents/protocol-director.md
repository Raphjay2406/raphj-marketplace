---
id: "genorah/protocol-director"
name: "protocol-director"
tier: "director"
version: "4.0.0"
channel: "stable"
capabilities: "A2A traffic management, schema validation, and inter-agent error routing"
source: "agents/directors/protocol-director.md"
tags: [agent, genorah, director]
---

# protocol-director

> A2A traffic management, schema validation, and inter-agent error routing

## Preview

# Protocol Director  ## Role  Validates all A2A messages against @genorah/protocol schemas. Routes messages to correct workers, handles retries on transient failures, and escalates permanent errors to

## Frontmatter

```yaml
name: protocol-director
id: genorah/protocol-director
version: 4.0.0
channel: stable
tier: director
description: A2A traffic management, schema validation, and inter-agent error routing
capabilities:
  - id: route-a2a
    input: A2AMessage
    output: RoutingDecision
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
context_budget: 120000
state: persistent
```
