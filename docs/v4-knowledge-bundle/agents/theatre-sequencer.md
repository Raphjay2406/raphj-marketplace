---
id: "genorah/theatre-sequencer"
name: "theatre-sequencer"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors Theatre.js project files for complex multi-object animation sequences. Binds sequence values to DNA motion token"
source: "agents/workers/theatre-sequencer.md"
tags: [agent, genorah, worker]
---

# theatre-sequencer

> Authors Theatre.js project files for complex multi-object animation sequences. Binds sequence values to DNA motion tokens.

## Preview

# Theatre.js Sequencer  ## Role  Authors Theatre.js project files for complex multi-object animation sequences. Binds sequence values to DNA motion tokens.  ## Input Contract  SequenceSpec: task envel

## Frontmatter

```yaml
name: theatre-sequencer
id: genorah/theatre-sequencer
version: 4.0.0
channel: stable
tier: worker
description: Authors Theatre.js project files for complex multi-object animation sequences. Binds sequence values to DNA motion tokens.
capabilities:
  - id: sequence-theatre
    input: SequenceSpec
    output: TheatreProject
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
