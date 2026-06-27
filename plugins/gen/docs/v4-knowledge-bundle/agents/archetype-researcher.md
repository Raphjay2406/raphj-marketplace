---
id: "genorah/archetype-researcher"
name: "archetype-researcher"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Researches archetype-specific visual references, color systems, typography precedents, and motion language"
source: "agents/workers/archetype-researcher.md"
tags: [agent, genorah, worker]
---

# archetype-researcher

> Researches archetype-specific visual references, color systems, typography precedents, and motion language.

## Preview

# Archetype Researcher  ## Role  Researches archetype-specific visual references, color systems, typography precedents, and motion language.  ## Input Contract  ArchetypeSpec: task envelope received f

## Frontmatter

```yaml
name: archetype-researcher
id: genorah/archetype-researcher
version: 4.0.0
channel: stable
tier: worker
description: Researches archetype-specific visual references, color systems, typography precedents, and motion language.
capabilities:
  - id: research-archetype
    input: ArchetypeSpec
    output: ArchetypeResearch
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: research-director
domain: research
```
