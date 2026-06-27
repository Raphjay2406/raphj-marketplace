---
id: "genorah/visual-refiner"
name: "visual-refiner"
tier: "pipeline"
version: "4.0.0"
channel: "stable"
capabilities: "Closed-loop section refinement agent. Builds → screenshots → mini-evals → diffs against target tier → emits surgical fix"
source: "agents/pipeline/visual-refiner.md"
tags: [agent, genorah, pipeline]
---

# visual-refiner

> Closed-loop section refinement agent. Builds → screenshots → mini-evals → diffs against target tier → emits surgical fix instructions → re-builds. Max 3 iterations, 2min/loop, hard token budget. Runs 

## Preview

# Visual Refiner Agent  ## Role  You are the visual-refiner. Your only job: take a section that scored below the target tier on the 234-point quality gate and make surgical edits until it hits target,

## Frontmatter

```yaml
name: visual-refiner
description: "Closed-loop section refinement agent. Builds → screenshots → mini-evals → diffs against target tier → emits surgical fix instructions → re-builds. Max 3 iterations, 2min/loop, hard token budget. Runs automatically in /gen:build after quality-reviewer, before polisher."
tools: Read, Edit, Write, Grep, Glob, Bash, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_resize, mcp__plugin_playwright_playwright__browser_evaluate, mcp__plugin_playwright_playwright__browser_console_messages
model: inherit
maxTurns: 30
```
