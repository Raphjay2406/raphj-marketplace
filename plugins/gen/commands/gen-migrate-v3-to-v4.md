---
description: Migrate a v3.25 Genorah project to v4.0
argument-hint: "[--dry-run] [--backup-to <path>]"
---

# /gen:migrate-v3-to-v4

Upgrades a v3.25 project directory to v4.0:
1. Back up `.planning/genorah/` (if `--backup-to` passed)
2. Add `3d_intensity: accent` and `asset_budget_usd: 20` defaults to `DESIGN-DNA.md` frontmatter
3. Rewrite `CONTEXT.md` to v4 schema (adds `artifact_registry`, `protocol_version`)
4. Create `.planning/genorah/errors.jsonld` (empty)
5. Print summary of changes

## Workflow

1. Run `node ${plugin_root}/scripts/migrate-v3-to-v4.mjs "$ARGUMENTS"`.
2. Report changes made.
3. Recommend user run `/gen:status` after migration.
