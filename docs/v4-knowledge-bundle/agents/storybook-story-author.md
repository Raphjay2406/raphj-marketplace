---
id: "genorah/storybook-story-author"
name: "storybook-story-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors Storybook stories for all shared components with controls, docs, and accessibility addon integration"
source: "agents/workers/storybook-story-author.md"
tags: [agent, genorah, worker]
---

# storybook-story-author

> Authors Storybook stories for all shared components with controls, docs, and accessibility addon integration.

## Preview

# Storybook Story Author  ## Role  Authors Storybook stories for all shared components with controls, docs, and accessibility addon integration.  ## Input Contract  ComponentSpec: task envelope receiv

## Frontmatter

```yaml
name: storybook-story-author
id: genorah/storybook-story-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Storybook stories for all shared components with controls, docs, and accessibility addon integration.
capabilities:
  - id: author-storybook-stories
    input: ComponentSpec
    output: StorybookStories
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: testing
```
