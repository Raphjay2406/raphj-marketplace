---
id: "genorah/chat-ui-author"
name: "chat-ui-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Builds AI chat UI components with Vercel AI SDK v4, streaming responses, and DNA-themed message bubbles"
source: "agents/workers/chat-ui-author.md"
tags: [agent, genorah, worker]
---

# chat-ui-author

> Builds AI chat UI components with Vercel AI SDK v4, streaming responses, and DNA-themed message bubbles.

## Preview

# Chat UI Author  ## Role  Builds AI chat UI components with Vercel AI SDK v4, streaming responses, and DNA-themed message bubbles.  ## Input Contract  ChatUISpec: task envelope received from wave-dir

## Frontmatter

```yaml
name: chat-ui-author
id: genorah/chat-ui-author
version: 4.0.0
channel: stable
tier: worker
description: Builds AI chat UI components with Vercel AI SDK v4, streaming responses, and DNA-themed message bubbles.
capabilities:
  - id: author-chat-ui
    input: ChatUISpec
    output: ChatUIComponent
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
