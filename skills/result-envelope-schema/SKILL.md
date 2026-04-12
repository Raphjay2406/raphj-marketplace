---
name: result-envelope-schema
description: Typed Result<T> envelope for all worker/director returns in v4 protocol
tier: core
triggers:
  - "Result envelope"
  - "worker return"
version: 4.0.0
---

# Result<T> Envelope Schema

## Layer 1 — Decision

Every worker and director returns this shape. Internal calls (subagent dispatch) and external calls (A2A HTTP POST) both use it.

## Layer 2 — Example

```ts
import { ok, partial, failed } from "@genorah/protocol";
return ok({ path: "sections/hero/page.tsx" });
return partial(artifact, [{ validator: "dna-compliance", pass: false, score: 0.72 }]);
return failed([{ validator: "motion-presence", pass: false }]);
```

## Layer 3 — Integration

- Schema emitted to `packages/protocol/src/schemas/result-envelope.schema.json`
- AJV-validated at runtime by `agent-message-validator.mjs` hook
- Consumed by `dispatch()` wrapper (stamps correlation_id + emitted_by)
- Embedded in AG-UI RESULT_ENVELOPE events

## Layer 4 — Anti-Patterns

- Returning raw artifacts without envelope (breaks protocol)
- Populating followups with self-references (causes circular dispatch)
- Skipping verdicts array (empty array is correct, not null)
