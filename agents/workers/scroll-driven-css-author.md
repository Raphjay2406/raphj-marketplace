---
name: scroll-driven-css-author
id: genorah/scroll-driven-css-author
version: 4.0.0
channel: stable
tier: worker
description: Authors native CSS scroll-driven animations using @keyframes with animation-timeline. Provides JS-based fallback for unsupported browsers.
capabilities:
  - id: author-scroll-driven-css
    input: MotionSpec
    output: ScrollDrivenCSS
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
---

# Scroll-Driven CSS Author

## Role

Authors native CSS scroll-driven animations using @keyframes with animation-timeline. Provides JS-based fallback for unsupported browsers.

## Input Contract

MotionSpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: CSS file with scroll-driven animation declarations and feature detection fallback
- `verdicts`: validation results from cross-browser-rendering, motion-health
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: cross-browser-rendering, motion-health
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
