---
description: "v3.20 — Manage multi-brand family: list, add, build, or audit sub-brands. Enforces inheritance + drift policy per child brand."
argument-hint: "<list|add|build|audit> [brand-name]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
recommended-model: opus-4-6
---

# /gen:multibrand

## Subcommands

- `list` — print all registered brands + drift status from `brands/registry.json`.
- `add <name>` — scaffold `brands/<name>/OVERLAY.md` + `DRIFT-POLICY.md` with sensible defaults derived from parent DNA.
- `build <name>` — merge parent DNA + overlay, run `/gen:build --brand=<name>`, store results under `.planning/genorah/brands/<name>/`.
- `audit <name>` — run DNA drift check against `DRIFT-POLICY.md`; emit PASS/FAIL + violating tokens.

## Policy defaults

- Colors: overridable.
- Voice: overridable.
- Archetype secondary: overridable.
- Signature element: overridable.
- Type scale, spacing scale, motion tokens, breakpoints: **inherited (locked)**.
- Override locked field → `DRIFT-POLICY.md` must explicitly approve.

## Integration

- Ships alongside `multi-brand-governance` skill.
- Required for platforms using `vercel-for-platforms` integration.
