---
name: ag-ui-event-emitter
description: CopilotKit AG-UI v1.0 event emission during pipeline execution
tier: core
triggers:
  - "AG-UI"
  - "pipeline events"
version: 4.0.0
---

# AG-UI Event Emitter

## Layer 1 — Decision

Emit AG-UI events at every state transition. 16 standard event types cover the full pipeline lifecycle.

## Layer 2 — Example

```ts
import { getAgUi } from "@genorah/protocol";
const em = getAgUi();
em.emit({ type: "WAVE_STARTED", wave: 2, sections: ["hero", "tease"] });
em.emit({ type: "ARTIFACT_CREATED", path: "sections/hero/page.tsx", sha256: "abc" });
```

## Layer 3 — Integration

- 16 event types: TEXT_MESSAGE_CONTENT, TOOL_CALL_*, STATE_DELTA, UI_RENDER, AGENT_STATE_UPDATE, ARTIFACT_CREATED, ERROR, WAVE_*, SECTION_*, VERDICT_ISSUED, RESULT_ENVELOPE, COST_BUDGET_UPDATE, DAEMON_LIFECYCLE
- Daemon exposes SSE stream at `/ag-ui/stream`
- Visual Companion subscribes for live rendering
- External dashboards can subscribe

## Layer 4 — Anti-Patterns

- Catch-all event with generic payload (hides bugs)
- Skipping SECTION_STARTED / SECTION_COMPLETED pairs
- Emitting ERROR without StructuredError shape
