---
name: agent-protocol-validator
description: Pre-dispatch AJV validation of Result<T> envelopes on SendMessage
tier: core
triggers:
  - "protocol validator"
  - "envelope validation"
version: 4.0.0
---

# Agent Protocol Validator

## Layer 1 — Decision

Active automatically via PreToolUse hook. No manual invocation needed. Blocks dispatch of malformed envelopes.

## Layer 2 — Example

Hook script `.claude-plugin/hooks/agent-message-validator.mjs`:
- Intercepts SendMessage tool calls
- If message body parses as JSON with `schema_version: "4.0.0"`, validates against compiled AJV schema
- Exit 0 = pass, exit 2 = block

## Layer 3 — Integration

- Reads schema from `packages/protocol/src/schemas/result-envelope.schema.json`
- Gracefully passes through if schema not yet built (bootstrap scenario)
- Runs on every PreToolUse event

## Layer 4 — Anti-Patterns

- Manually invoking the validator (it's a runtime hook, not a library)
- Disabling the hook during dev (breaks protocol invariants silently)
