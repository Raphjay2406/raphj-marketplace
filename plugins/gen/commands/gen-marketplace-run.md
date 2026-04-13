---
description: Execute a marketplace agent in the local sandbox and return its Result envelope
argument-hint: "<id@version> <capability> <json-payload>"
---

# /gen:marketplace-run

1. Ensure agent is installed at `~/.claude/genorah/marketplace/`.
2. Extract source entry from manifest.
3. Run in Deno sandbox via `runInSandbox`.
4. Validate output against `ResultEnvelopeSchema`.
5. Print envelope or error.

Run: `node ${plugin_root}/scripts/gen-marketplace-run.mjs "$ARGUMENTS"`.
