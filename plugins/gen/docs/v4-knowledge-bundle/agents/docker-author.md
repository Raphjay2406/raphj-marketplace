---
id: "genorah/docker-author"
name: "docker-author"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors Dockerfile and docker-compose.yml for self-hosted deployment with standalone Next.js output"
source: "agents/workers/docker-author.md"
tags: [agent, genorah, worker]
---

# docker-author

> Authors Dockerfile and docker-compose.yml for self-hosted deployment with standalone Next.js output.

## Preview

# Docker Author  ## Role  Authors Dockerfile and docker-compose.yml for self-hosted deployment with standalone Next.js output.  ## Input Contract  DeploySpec: task envelope received from wave-director

## Frontmatter

```yaml
name: docker-author
id: genorah/docker-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Dockerfile and docker-compose.yml for self-hosted deployment with standalone Next.js output.
capabilities:
  - id: author-docker
    input: DeploySpec
    output: DockerConfig
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: deployment
```
