---
description: "Self-heal audit — validates plugin consistency (versions, counts, frontmatter, contracts, orphan skills, mirror drift, stale refs) and writes a structured report."
argument-hint: "[--fix] [--verbose] [--scope core|all]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# /gen:self-audit

Static-analysis validator for the Genorah plugin itself. Runs **against the plugin repo** (not a target project). Catches the same drift classes that accumulated across v2.x → v3.0 (version mismatches, stale quality-gate numbers, orphan skills without frontmatter, `plugins/gen/` mirror divergence, broken references in CLAUDE.md).

**Output:** `.planning/genorah/audit/self-audit-{YYYYMMDD-HHMMSS}.md` with findings tiered BLOCK / WARN / INFO.

## Workflow

### 1. Parse arguments

- `--fix` — auto-apply safe fixes (version bumps in docs, add missing frontmatter stubs, fix stale counts). Risky fixes (file renames, agent reorganization) are reported only.
- `--verbose` — include all checks in report, even passing ones.
- `--scope core` (default) — run 16 core checks listed below.
- `--scope all` — also scan `plugins/gen/` for mirror drift and every skill for 4-layer compliance.

### 2. Gather ground truth

Read in parallel:
- `.claude-plugin/plugin.json` — canonical version + description
- `.claude-plugin/marketplace.json` — marketplace metadata + keywords
- `README.md` — plugin table row
- `CLAUDE.md` — project overview + architecture + commands table
- `Glob commands/*.md` — actual command count
- `Glob agents/**/*.md` — actual agent count
- `Glob skills/*/SKILL.md` — actual skill count (excluding `_skill-template`)
- `.claude-plugin/hooks/` — hook file list
- `.claude-plugin/.mcp.json` — MCP server declarations

### 3. Run validation checks

**16 core checks, grouped by severity:**

**BLOCK (CRITICAL)**
1. **Version consistency** — `plugin.json.version` must equal `marketplace.json.plugins[gen].version`, version string in `README.md` row, version line in `CLAUDE.md`. Any mismatch fails.
2. **Command count claim** — count of `commands/*.md` must equal the "(N commands)" claim in `CLAUDE.md` and the commands table row count.
3. **Skill frontmatter presence** — every `skills/*/SKILL.md` (excluding `_skill-template`) must start with `---\n` YAML block containing `name`, `description`, `tier`, `version`.
4. **Hook file integrity** — every hook referenced in `plugin.json.hooks[*].command` must exist on disk and parse as valid JS/Bash (`node --check` / `bash -n`).
5. **plugins/gen mirror exists** — if `plugins/gen/` is present, `plugins/gen/commands/`, `plugins/gen/skills/`, `plugins/gen/agents/` counts must match root counts.

**WARN (HIGH)**
6. **Quality gate text freshness** — no references to "72-point" or "248-point" in `plugin.json`, `marketplace.json`, `README.md`, `CLAUDE.md` (234-point is current).
7. **Removed feature references** — no `stop.mjs` references (renamed to `session-end.mjs`), no `.planning/modulo/` in current-path context (only in migration docs), no `/modulo:*` command references in non-migration docs.
8. **Motion library consistency** — `dna-compliance-check.sh` regex must match both `motion/react` and `framer-motion` (alternation).
9. **Command → file validity** — every command row in `CLAUDE.md` commands table must exist as `commands/{name}.md`.
10. **Agent role contracts** — every `agents/*.md` must declare role/model/tools in frontmatter or a clearly-labeled section.
11. **Skill count claim** — `marketplace.json` description skill count (`~N skills`) must be within ±3 of actual `skills/` count.
12. **Dedup location** — `pre-tool-use.mjs` must NOT import `tmpdir` from `os` (dedup moved to `.claude/genorah-dedup/` for persistence).

**INFO (LOW)**
13. **Orphan skills** — skills with 0 references across `agents/**/*.md`, `commands/**/*.md`, other `skills/**/SKILL.md`. Surface for review; may be intentional (utility tier).
14. **Orphan agents** — agents with 0 references from any command.
15. **4-layer skill compliance** — each SKILL.md has sections matching "Layer 1", "Layer 2", "Layer 3", "Layer 4" or equivalent headings. Skills without all 4 are flagged.
16. **Hook error log freshness** — `.claude/hook-errors.log` (if present in a target project) older than 30d or >1000 lines → suggest rotation.

### 4. Emit report

Write to `.planning/genorah/audit/self-audit-{ts}.md`:

```markdown
# Genorah Self-Audit Report

**Timestamp:** {ISO-8601}
**Scope:** {core|all}
**Status:** {✅ PASS | ⚠️ PASS with warnings | ❌ FAIL}

## Summary
- Commands: {actual}/{claimed}
- Agents: {actual}/{claimed}
- Skills: {actual}/{claimed}
- Version: {plugin.json} | Marketplace: {marketplace.json} | README: {parsed} | CLAUDE.md: {parsed}
- Hooks: {N present}/{N declared}
- Mirror drift: {none | N files differ}

## Findings

### BLOCK ({count})
{for each: check name, location (file:line), current → expected, suggested fix}

### WARN ({count})
{same format}

### INFO ({count})
{same format}

## Recommended Fixes (Priority Order)
{numbered list of concrete edits, each citing file:line}

## Passing Checks ({count}/16)
{only shown in --verbose mode}
```

### 5. Apply --fix if requested

Safe auto-fixes:
- Update version string in `README.md` and `CLAUDE.md` to match `plugin.json.version`
- Update "~N skills" count in `marketplace.json` description to current ±0
- Update "72-point" → "234-point" in all doc strings
- Add minimal frontmatter to orphan skills (derive `name` from directory, tier="domain" default)

Risky fixes reported only (require human judgment):
- Renaming files, moving agents between categories
- Mirror sync from root → plugins/gen (that's `/gen:export`'s job)
- Deleting orphan skills

### 6. Report to user

Summarize at chat level:
```
Self-audit complete: {status}
Report: .planning/genorah/audit/self-audit-{ts}.md
- BLOCK: {N}  WARN: {N}  INFO: {N}
{if --fix}: Applied {N} auto-fixes. {N} issues need manual review.
```

## When to Run

- **Before every version bump** — catches the drift this audit was built to prevent.
- **After large multi-session burst work** — like the 18K-line v2.0→v2.9 session.
- **On CI** (future) — gate plugin PRs on BLOCK count == 0.
- **Monthly baseline** — detects slow-drift rot.

## Notes

- Static analysis only. Does not spawn agents. Fast (<5s on current repo).
- Accumulated findings feed the v3.0 quality-gate closed loop: self-audit protects the plugin; closed-loop refiner protects the end product.
- Orphan-skill reports are advisory — utility-tier skills may legitimately have 0 direct refs (loaded on-demand via triggers).
