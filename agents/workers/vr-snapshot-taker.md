---
name: vr-snapshot-taker
id: genorah/vr-snapshot-taker
version: 4.0.0
channel: stable
tier: worker
description: Captures 4-breakpoint visual regression snapshots via Playwright. Diffs against baseline and flags regressions.
capabilities:
  - id: take-vr-snapshots
    input: DeployURL
    output: SnapshotSet
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

# Visual Regression Snapshot Taker

## Role

Captures 4-breakpoint visual regression snapshots via Playwright. Diffs against baseline and flags regressions.

## Input Contract

DeployURL: task envelope received from quality-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Snapshot set with baseline diffs, regression flags, and diff percentage per breakpoint
- `verdicts`: validation results from visual-regression, visual-qa-protocol
- `followups`: []

## Protocol

1. Receive task envelope from quality-director
2. Execute domain-specific implementation
3. Run validators: visual-regression, visual-qa-protocol
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
