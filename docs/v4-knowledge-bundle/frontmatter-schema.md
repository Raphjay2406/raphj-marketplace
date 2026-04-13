---
type: schema
title: "Genorah Vault Frontmatter Schema"
version: "4.0.0"
tags: [schema, frontmatter, genorah]
---

# Frontmatter Schema

Standard frontmatter fields used across all Genorah vault assets.
Compatible with Dataview plugin for queries.

## Agent Files (`agents/*.md`)

```yaml
---
id: "genorah/<slug>"          # Unique agent ID
name: "<Human Name>"          # Display name
tier: "director|worker|pipeline|specialist|protocol"
version: "4.0.0"
channel: "stable|beta|alpha"
capabilities: "<one-line description>"
source: "agents/<path>.md"    # Path in repo
tags: [agent, genorah, <tier>]
---
```

## Archetype Files (`archetypes/*.md`)

```yaml
---
id: "archetype/<slug>"
name: "<Human Name>"
slug: "<slug>"
tier: "webgpu-native|standard"
version: "4.0.0|3.x"
group: "v4-webgpu|v3-classic"
mandatory_techniques: "<comma-separated>"
forbidden_patterns: "<comma-separated>"
tags: [archetype, genorah, <tier>]
---
```

## Index Files (`*/index.md`)

```yaml
---
type: index
entity: "agents|archetypes|commands|skills"
count: <N>
version: "4.0.0"
tags: [index, <entity>]
---
```

## MOC File (`MOC.md`)

```yaml
---
type: moc
title: "<Title>"
version: "4.0.0"
generated: "YYYY-MM-DD"
tags: [moc, genorah, v4]
---
```

## Dataview Example Queries

```dataview
TABLE tier, capabilities FROM "agents" WHERE type != "index" SORT tier ASC
```

```dataview
TABLE group, tier FROM "archetypes" WHERE type != "index" SORT group ASC
```
