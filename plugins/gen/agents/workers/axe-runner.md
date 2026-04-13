---
name: axe-runner
id: genorah/axe-runner
version: 4.0.0
channel: stable
tier: worker
description: Runs axe-core accessibility audit against deployed preview. Reports WCAG 2.1 AA violations with fix guidance.
capabilities:
  - id: run-axe
    input: DeployURL
    output: AxeReport
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

# Axe Runner

## Role

Runs axe-core accessibility audit against deployed preview. Reports WCAG 2.1 AA violations with fix guidance.

## Input Contract

DeployURL: task envelope received from quality-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Axe report with violation list, severity levels, and remediation code snippets
- `verdicts`: validation results from accessibility, a11y-test-gen
- `followups`: []

## Protocol

1. Receive task envelope from quality-director
2. Execute domain-specific implementation
3. Run validators: accessibility, a11y-test-gen
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
