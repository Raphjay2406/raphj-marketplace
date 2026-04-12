---
name: playwright-test-author
id: genorah/playwright-test-author
version: 4.0.0
channel: stable
tier: worker
description: Authors Playwright E2E tests for critical user journeys, visual regression baselines, and accessibility checks.
capabilities:
  - id: author-playwright-tests
    input: TestSpec
    output: PlaywrightTests
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: testing
---

# Playwright Test Author

## Role

Authors Playwright E2E tests for critical user journeys, visual regression baselines, and accessibility checks.

## Input Contract

TestSpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Playwright test files with page objects, visual snapshots, and accessibility assertions
- `verdicts`: validation results from e2e-test-gen, visual-regression-gen
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: e2e-test-gen, visual-regression-gen
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
