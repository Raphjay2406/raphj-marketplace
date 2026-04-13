---
id: "genorah/brand-voice-enforcer"
name: "brand-voice-enforcer"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Reviews all copy against extracted brand voice guidelines. Rewrites passages that deviate from tone, vocabulary, or pers"
source: "agents/workers/brand-voice-enforcer.md"
tags: [agent, genorah, worker]
---

# brand-voice-enforcer

> Reviews all copy against extracted brand voice guidelines. Rewrites passages that deviate from tone, vocabulary, or personality.

## Preview

# Brand Voice Enforcer  ## Role  Reviews all copy against extracted brand voice guidelines. Rewrites passages that deviate from tone, vocabulary, or personality.  ## Input Contract  ContentDraft: task

## Frontmatter

```yaml
name: brand-voice-enforcer
id: genorah/brand-voice-enforcer
version: 4.0.0
channel: stable
tier: worker
description: Reviews all copy against extracted brand voice guidelines. Rewrites passages that deviate from tone, vocabulary, or personality.
capabilities:
  - id: enforce-brand-voice
    input: ContentDraft
    output: VoiceValidatedContent
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: creative-director
domain: content
```
