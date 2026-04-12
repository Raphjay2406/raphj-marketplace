---
name: brand-voice-enforcer
id: genorah/brand-voice-enforcer
version: 4.0.0
channel: stable
tier: worker
description: undefined
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
---

# Brand Voice Enforcer

## Role

Reviews all copy against extracted brand voice guidelines. Rewrites passages that deviate from tone, vocabulary, or personality.

## Input Contract

ContentDraft: task envelope received from creative-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Revised content with voice deviation report and correction rationale
- `verdicts`: validation results from brand-voice-extraction, anti-slop-gate
- `followups`: []

## Protocol

1. Receive task envelope from creative-director
2. Execute domain-specific implementation
3. Run validators: brand-voice-extraction, anti-slop-gate
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
