# Security Policy

## Supported versions

Only the latest minor of v4 receives security updates.

| Version | Supported |
|---|---|
| 4.0.x | ✅ |
| 3.25.x | ⚠️ Critical fixes only |
| < 3.25 | ❌ |

## Reporting a vulnerability

Email security reports to `security@genorah.dev` (placeholder — replace with your preferred channel before public publish).

Please DO NOT file public GitHub issues for security vulnerabilities. We aim to respond within 48 hours.

## Scope

Genorah ships 9 npm packages, a Fastify daemon (localhost-only by default), and an optional Deno-backed agent marketplace sandbox. Security-relevant surfaces:

- **Protocol daemon** (`@genorah/protocol`) — binds to `127.0.0.1`. External access requires explicit opt-in.
- **Agent marketplace sandbox** (`@genorah/marketplace`) — Deno subprocess with `--allow-none` default. Any third-party agent runs with zero permissions unless explicitly granted.
- **MCP adapters** (`@genorah/asset-forge`) — make outbound HTTPS calls to third-party AI providers. API keys are user-supplied via environment variables; never logged or echoed.
- **Content moderation** — AI-generated assets go through `content-moderation` skill when OpenAI moderation is configured.

## Known limitations

- `fastify-sse-v2` is a community-maintained package; we don't audit its dependency tree.
- `sqlite-vec` native binding ships prebuilt binaries; binary integrity is the upstream maintainer's responsibility.
