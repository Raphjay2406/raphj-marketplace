---
description: Migrate a legacy Modulo project (.planning/modulo/) to Genorah v2.0 (.planning/genorah/)
argument-hint: "[--dry-run]"
---

# /gen:migrate

Migrates a legacy `.planning/modulo/` project directory to `.planning/genorah/` with full reference auditing.

## Workflow

1. **Detect legacy directory**
   - Check if `.planning/modulo/` exists
   - If `.planning/genorah/` already exists, check if both exist (partial migration) or only genorah (already migrated)
   - If neither exists, inform user no project found

2. **If `--dry-run` flag provided**
   - List all files that would be moved
   - List all internal references that would need updating
   - Do NOT make any changes
   - Report what `/gen:migrate` would do

3. **Rename directory**
   - Move `.planning/modulo/` to `.planning/genorah/`
   - If `.planning/genorah/` already exists (both present), merge: copy only files that don't exist in genorah from modulo, then remove modulo directory

4. **Audit internal references**
   - Scan all files in `.planning/genorah/` for references to `.planning/modulo/` or `modulo` paths
   - Update references to `.planning/genorah/` and `genorah` equivalents
   - Common patterns to update:
     - `.planning/modulo/CONTEXT.md` → `.planning/genorah/CONTEXT.md`
     - `.planning/modulo/DESIGN-DNA.md` → `.planning/genorah/DESIGN-DNA.md`
     - `.planning/modulo/STATE.md` → `.planning/genorah/STATE.md`
     - `.planning/modulo/MASTER-PLAN.md` → `.planning/genorah/MASTER-PLAN.md`
     - `.planning/modulo/sections/` → `.planning/genorah/sections/`
     - Any `modulo:` command references → `gen:` equivalents

5. **Command reference migration table**

   | Old Command | New Command |
   |-------------|-------------|
   | `/modulo:start-project` | `/gen:start-project` |
   | `/modulo:lets-discuss` | `/gen:discuss` |
   | `/modulo:plan-dev` | `/gen:plan` |
   | `/modulo:execute` | `/gen:build` |
   | `/modulo:iterate` | `/gen:iterate` |
   | `/modulo:bug-fix` | `/gen:bugfix` |
   | `/modulo:audit` | `/gen:audit` |
   | `/modulo:status` | `/gen:status` |

6. **Verify migration**
   - Read migrated `CONTEXT.md` and `STATE.md` to confirm they load correctly
   - Check that DESIGN-DNA.md is intact
   - List all section PLAN.md files found
   - Report migration summary

7. **Report**
   - Files moved: N
   - References updated: N
   - Command references translated: N
   - Status: SUCCESS / PARTIAL (with details)

8. **Commit migration**
   - Stage all changes
   - Commit with message: `chore: migrate .planning/modulo → .planning/genorah (Genorah v2.0)`

## Edge Cases

- **Both directories exist:** Merge mode — genorah takes priority, modulo fills gaps
- **Permission errors:** Report which files couldn't be moved, suggest manual fix
- **Large projects (100+ sections):** Show progress via TodoWrite
- **Git-ignored planning directory:** Warn that migration won't be tracked in git
