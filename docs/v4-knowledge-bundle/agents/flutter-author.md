---
id: "genorah/flutter-author"
name: "flutter-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Builds Flutter widgets with ThemeData DNA mapping, go_router navigation, Riverpod state, and platform adaptive widgets"
source: "agents/workers/flutter-author.md"
tags: [agent, genorah, worker]
---

# flutter-author

> Builds Flutter widgets with ThemeData DNA mapping, go_router navigation, Riverpod state, and platform adaptive widgets.

## Preview

# Flutter Author  ## Role  Builds Flutter widgets with ThemeData DNA mapping, go_router navigation, Riverpod state, and platform adaptive widgets.  ## Input Contract  MobileSpec: task envelope receive

## Frontmatter

```yaml
name: flutter-author
id: genorah/flutter-author
version: 4.0.0
channel: stable
tier: worker
description: Builds Flutter widgets with ThemeData DNA mapping, go_router navigation, Riverpod state, and platform adaptive widgets.
capabilities:
  - id: author-flutter
    input: MobileSpec
    output: FlutterArtifact
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
