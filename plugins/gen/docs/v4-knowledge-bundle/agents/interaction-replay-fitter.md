---
id: "genorah/interaction-replay-fitter"
name: "interaction-replay-fitter"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Fits Playwright traces to 7 cubic-Bezier easing presets and generates MOTION-INVENTORY.md with exact preset matches"
source: "agents/workers/interaction-replay-fitter.md"
tags: [agent, genorah, worker]
---

# interaction-replay-fitter

> Fits Playwright traces to 7 cubic-Bezier easing presets and generates MOTION-INVENTORY.md with exact preset matches.

## Preview

# Interaction Replay Fitter  ## Role  Fits Playwright traces to 7 cubic-Bezier easing presets and generates MOTION-INVENTORY.md with exact preset matches.  ## Input Contract  PlaywrightTrace: task env

## Frontmatter

```yaml
name: interaction-replay-fitter
id: genorah/interaction-replay-fitter
version: 4.0.0
channel: stable
tier: worker
description: Fits Playwright traces to 7 cubic-Bezier easing presets and generates MOTION-INVENTORY.md with exact preset matches.
capabilities:
  - id: fit-interaction-replay
    input: PlaywrightTrace
    output: MotionInventory
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: research-director
domain: ingestion
```
