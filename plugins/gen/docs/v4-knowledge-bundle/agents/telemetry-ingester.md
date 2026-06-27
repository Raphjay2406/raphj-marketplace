---
id: "genorah/telemetry-ingester"
name: "telemetry-ingester"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Ingests RUM and synthetic telemetry. Tracks CWV trends, error rates, and user flow drop-offs against SLO budgets"
source: "agents/workers/telemetry-ingester.md"
tags: [agent, genorah, worker]
---

# telemetry-ingester

> Ingests RUM and synthetic telemetry. Tracks CWV trends, error rates, and user flow drop-offs against SLO budgets.

## Preview

# Telemetry Ingester  ## Role  Ingests RUM and synthetic telemetry. Tracks CWV trends, error rates, and user flow drop-offs against SLO budgets.  ## Input Contract  TelemetryStream: task envelope rece

## Frontmatter

```yaml
name: telemetry-ingester
id: genorah/telemetry-ingester
version: 4.0.0
channel: stable
tier: worker
description: Ingests RUM and synthetic telemetry. Tracks CWV trends, error rates, and user flow drop-offs against SLO budgets.
capabilities:
  - id: ingest-telemetry
    input: TelemetryStream
    output: TelemetryReport
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: quality-director
domain: observability
```
