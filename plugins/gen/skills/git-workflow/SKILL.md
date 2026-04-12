---
name: git-workflow
tier: utility
description: "Git workflow automation — DNA-tagged commit templates per emotional beat, PR body generation from SUMMARY.md + quality scores, worktree management for parallel wave builds, conventional commit enforcement with archetype context."
triggers: ["git workflow", "commit template", "pr generation", "worktree", "conventional commit", "section commit", "beat commit"]
used_by: ["builder", "polisher", "orchestrator"]
version: "3.2.0"
metadata:
  bashPatterns:
    - "git commit"
    - "git worktree"
    - "git log"
---

## Layer 1: Decision Guidance

### Why

Generated sections typically land as a single "wip" commit or unlabeled squash. That discards the per-beat signal (HOOK vs PROOF) + score trajectory that's useful for future tooling (changelog gen, regression bisect, design-history Obsidian sync). This skill standardizes commit granularity, message format, and PR bodies so the git log becomes a legitimate project-history source.

### When to Use

- After each section builder completes (auto-commit per beat, opt-in via PROJECT.md flag).
- At wave boundary for polisher pass (single commit aggregating polisher diffs).
- PR creation time for wave merges.

### When NOT to Use

- Hotfix / revert / manual dev commits (user drives those).
- Non-build changes (config, README, tooling).

## Layer 2: Commit Message Template

Per-section auto-commit (after builder + visual-refiner):

```
feat({section-slug}): {beat} — {one-line what}

Archetype: {archetype} | DNA: {project_name}
Beat: {beat} ({whitespace_pct}% whitespace, {element_count} elements)
Score: {score}/234 ({tier})
Refinement iterations: {N}/3
Reference diff SSIM: {ssim} (threshold {threshold} — {PASS|WARN})
Motion health: {sub_gate_score}/20

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
```

Polisher pass commit (one per wave):

```
polish(wave-{N}): {count} sections — consistency + drift fixes

Sections: {list}
Cross-section fixes: {count} (CONSISTENCY-AUDIT.md)
DNA drift resolved: {before_coverage}% → {after_coverage}%
```

PR body template:

```markdown
## Wave {N} — {archetype}

{count} sections built + polished.

### Quality
| Section | Beat | Score | Tier | Refinements |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

Median score: {median}/234 ({median_tier}).

### Artifacts
- Screenshots: `.planning/genorah/audit/*.png`
- Audit report: `.planning/genorah/audit/AUDIT-REPORT.md`
- Decision log: `.planning/genorah/DECISIONS.md` (last {N} entries)

### Next
/gen:audit on merge to main; /gen:iterate if any section < target tier.
```

### Worktree management (parallel waves)

For large waves (>4 sections), spawn parallel builders in isolated worktrees to prevent merge conflicts on shared files:

```bash
# orchestrator-driven pre-wave
git worktree add ../wt-wave-{N}-hero   HEAD
git worktree add ../wt-wave-{N}-pricing HEAD
# ... one per section

# builders work in their own worktree, commit per template
# on wave complete, orchestrator merges each back:
git merge --no-ff ../wt-wave-{N}-hero
git worktree remove ../wt-wave-{N}-hero
```

Used automatically when `parallel_worktrees: true` is set in PROJECT.md (default: false for single-writer safety). Requires git 2.5+.

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| per-section commit | on | — | bool | default-on for builds |
| max_parallel_worktrees | 1 | 4 | count | SOFT (disk pressure) |
| commit_body_max_lines | — | 20 | lines | HARD (keep readable) |
| signed_commits | - | - | bool | honor user's git config |

## Layer 3: Integration Context

- **Builder** — invokes this skill at render-complete to compose commit body from SUMMARY.md.
- **Polisher** — single wave-boundary commit aggregating its diffs.
- **Orchestrator** — owns worktree lifecycle when parallel mode enabled.
- **PR creation** — `/gen:export --pr` uses the PR body template (new flag in v3.2).
- **Conventional Commits** — templates use `feat|polish|fix|docs|chore` prefixes for downstream tooling (changelog-gen, release bots).

## Layer 4: Anti-Patterns

- ❌ **Squashing all sections into "feat: wave N"** — loses per-beat signal the template is designed to capture.
- ❌ **Skipping Co-Authored-By** — mandatory for auditability of AI-assisted commits.
- ❌ **Worktrees without cleanup** — orphan worktrees accumulate `.git/worktrees/` state; always `remove` after merge.
- ❌ **Force-push on shared branches** — worktree merges are non-ff and preserve history. Don't rewrite.
- ❌ **Long PR bodies with every GAP-FIX entry** — keep the PR body to table-scoped quality data; link to .planning/genorah/audit/ for detail.
