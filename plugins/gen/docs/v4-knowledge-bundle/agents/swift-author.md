---
id: "genorah/swift-author"
name: "swift-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Builds SwiftUI views with DNA token mapping to SwiftUI design tokens, SF Symbols, NavigationStack, and HIG compliance"
source: "agents/workers/swift-author.md"
tags: [agent, genorah, worker]
---

# swift-author

> Builds SwiftUI views with DNA token mapping to SwiftUI design tokens, SF Symbols, NavigationStack, and HIG compliance.

## Preview

# Swift/SwiftUI Author  ## Role  Builds SwiftUI views with DNA token mapping to SwiftUI design tokens, SF Symbols, NavigationStack, and HIG compliance.  ## Input Contract  MobileSpec: task envelope re

## Frontmatter

```yaml
name: swift-author
id: genorah/swift-author
version: 4.0.0
channel: stable
tier: worker
description: Builds SwiftUI views with DNA token mapping to SwiftUI design tokens, SF Symbols, NavigationStack, and HIG compliance.
capabilities:
  - id: author-swift
    input: MobileSpec
    output: SwiftArtifact
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: mobile-director
domain: mobile
```
