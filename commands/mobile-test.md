---
description: "Run mobile test suites (Maestro default + platform-specific frameworks). Subcommands: run | generate | record."
argument-hint: "[run|generate|record] [--platform ios|android|both] [--device simulator|real]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
recommended-model: sonnet-4-6
---

# /gen:mobile-test

v3.7. See `skills/mobile-testing/SKILL.md`.

## Subcommands

### `generate`

Derive Maestro YAML from PLAN.md user journeys. Creates `.maestro/<journey>.yaml` per primary flow.

### `run`

Execute suites via Maestro on chosen platform + device. Reports results + FPS + cold-start.

### `record`

Launch Maestro Studio recording — user interacts with app, Maestro captures flow. Saves to `.maestro/`.

## Flags

- `--platform ios|android|both` (default: both)
- `--device simulator|real` (default: simulator)

## Integration

Results feed mobile-quality-gate. Ledger: `mobile-test-ran`.
