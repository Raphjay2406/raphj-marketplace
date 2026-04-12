---
name: lighthouse-runner
id: genorah/lighthouse-runner
version: 4.0.0
channel: stable
tier: worker
description: undefined
capabilities:
  - id: run-lighthouse
    input: DeployURL
    output: LighthouseReport
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

# Lighthouse Runner

## Role

Runs Lighthouse CI against preview deployments. Enforces perf budget thresholds and flags CWV regressions.

## Input Contract

DeployURL: task envelope received from quality-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Lighthouse report with per-metric scores, CWV values, and budget delta
- `verdicts`: validation results from lighthouse-ci-setup, perf-budgets
- `followups`: []

## Protocol

1. Receive task envelope from quality-director
2. Execute domain-specific implementation
3. Run validators: lighthouse-ci-setup, perf-budgets
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
