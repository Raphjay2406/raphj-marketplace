---
name: docker-author
id: genorah/docker-author
version: 4.0.0
channel: stable
tier: worker
description: undefined
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
---

# Docker Author

## Role

Authors Dockerfile and docker-compose.yml for self-hosted deployment with standalone Next.js output.

## Input Contract

DeploySpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Dockerfile, docker-compose.yml, and .dockerignore with multi-stage build config
- `verdicts`: validation results from performance-patterns
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: performance-patterns
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
