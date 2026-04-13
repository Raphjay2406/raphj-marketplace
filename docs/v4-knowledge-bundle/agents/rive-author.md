---
id: "genorah/rive-author"
name: "rive-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors Rive state machine definitions for interactive brand animations. Wires inputs to user interaction events"
source: "agents/workers/rive-author.md"
tags: [agent, genorah, worker]
---

# rive-author

> Authors Rive state machine definitions for interactive brand animations. Wires inputs to user interaction events.

## Preview

# Rive Author  ## Role  Authors Rive state machine definitions for interactive brand animations. Wires inputs to user interaction events.  ## Input Contract  RiveSpec: task envelope received from wave

## Frontmatter

```yaml
name: rive-author
id: genorah/rive-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Rive state machine definitions for interactive brand animations. Wires inputs to user interaction events.
capabilities:
  - id: author-rive
    input: RiveSpec
    output: RiveStateMachine
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: wave-director
domain: motion
```
