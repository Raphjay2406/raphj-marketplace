---
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
---

# Telemetry Ingester

## Role

Ingests RUM and synthetic telemetry. Tracks CWV trends, error rates, and user flow drop-offs against SLO budgets.

## Input Contract

TelemetryStream: task envelope received from quality-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Telemetry report with CWV trends, error rates, SLO status, and alert thresholds
- `verdicts`: validation results from slo-error-budgets, opentelemetry-traces
- `followups`: []

## Protocol

1. Receive task envelope from quality-director
2. Execute domain-specific implementation
3. Run validators: slo-error-budgets, opentelemetry-traces
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
