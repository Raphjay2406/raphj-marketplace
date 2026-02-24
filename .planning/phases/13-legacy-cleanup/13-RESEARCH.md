# Phase 13: Legacy Cleanup - Research

**Researched:** 2026-02-25
**Domain:** Repository cleanup, file removal, bookkeeping
**Confidence:** HIGH

## Summary

Phase 13 is a pure cleanup phase -- no new skills, agents, or features are created. The work involves:

1. **Removing legacy v6.1.0 agents** from `agents/` root that are shadowed by v2.0 pipeline agents in `agents/pipeline/` and `agents/specialists/`
2. **Removing the v6.1.0 discussion-protocol.md** from `agents/` root (the Phase 2 version at `agents/protocols/discussion-protocol.md` is the canonical one)
3. **Removing superseded v6.1.0 skills** that have been replaced by v2.0 rewrites under new names
4. **Fixing ROADMAP.md and REQUIREMENTS.md bookkeeping** -- unchecked checkboxes for completed phases, SKIL-01/02/03 checkboxes
5. **Adding Machine-Readable Constraints** to react-vite-patterns/SKILL.md
6. **Resolving phantom typography/color-system** entries in SKILL-DIRECTORY.md
7. **Wiring Phase 6 brainstorm skills** into the agents/commands that should explicitly reference them

**Primary recommendation:** This is mechanical deletion and text editing. Every change is well-defined with clear before/after states. The two plans should split as: 13-01 for agent cleanup (agents/ directory) and 13-02 for skills/bookkeeping cleanup (skills/ directory + planning files).

## Standard Stack

Not applicable -- this phase involves only file deletion and markdown editing. No libraries, no code, no builds.

## Architecture Patterns

### Pattern 1: Verify Before Delete

**What:** Before deleting any file, confirm it is NOT referenced by any v2.0 artifact.
**When to use:** Every file targeted for deletion.
**Verification approach:**
```bash
# For each file to delete, grep for its name across the repo
grep -r "design-lead" agents/pipeline/ commands/ skills/
# If hits found in v2.0 files: those are Phase 11's problem (stale references)
# But if hits show the v6.1.0 file is NEEDED by v2.0 code: do NOT delete
```

**Key insight:** Phase 11 (Fix Stale Cross-References) runs BEFORE Phase 13. By Phase 13, all stale references to v6.1.0 agents should already be fixed. Phase 13 only removes the files themselves.

### Pattern 2: ROADMAP/REQUIREMENTS Checkmarks

**What:** Update checkmark status and traceability to reflect actual completion state.
**Approach:** Set `[x]` on items already verified as complete by Phase UAT/verification. Do not change status of items that are genuinely incomplete.

### Anti-Patterns to Avoid

- **Deleting files that Phase 11 hasn't de-referenced yet:** Phase 13 depends on Phase 12 which depends on Phase 11. By the time Phase 13 runs, all cross-references should already point to v2.0 names. But verify anyway.
- **Removing v6.1.0 skills that have NO v2.0 replacement:** Some v6.1.0 skills (like auth-ui, data-table) are in the "surviving as reference" category and were never slated for rewrite OR removal. Only remove those that are explicitly superseded.

## Don't Hand-Roll

Not applicable for a cleanup phase.

## Common Pitfalls

### Pitfall 1: Confusing Root vs Pipeline Agents
**What goes wrong:** The v6.1.0 `agents/section-builder.md` and v2.0 `agents/pipeline/section-builder.md` have the SAME filename. Accidentally referencing the wrong one. Similarly for `agents/quality-reviewer.md` (v6.1.0) vs `agents/pipeline/quality-reviewer.md` (v2.0).
**Why it happens:** Both exist simultaneously in the repo.
**How to avoid:** Only delete from `agents/` root. Never touch `agents/pipeline/` or `agents/specialists/`.
**Warning signs:** If `agents/pipeline/` or `agents/protocols/` files show up in deletion lists, something is wrong.

### Pitfall 2: Not Identifying All v6.1.0 Skills
**What goes wrong:** Deleting some superseded skills but missing others, leaving an inconsistent state.
**How to avoid:** Use the version field as the definitive signal. Skills with `version: "2.0.0"` are v2.0. Skills without a version field (or `no-version`) are v6.1.0 originals.

### Pitfall 3: REQUIREMENTS.md Inconsistency
**What goes wrong:** The checkboxes (`[ ]` vs `[x]`) at lines 10-13 (FOUND-01 to FOUND-04) and 74-76 (SKIL-01 to SKIL-03) still show `[ ]` even though the Traceability table says "Complete". Fixing only one spot but not the other.
**How to avoid:** Update BOTH the checkbox list AND verify the traceability table is consistent.

### Pitfall 4: Phantom Skills Require SKILL-DIRECTORY.md Update (Phase 12 Scope)
**What goes wrong:** Phase 12 rebuilds SKILL-DIRECTORY.md. Phase 13's job is to resolve the phantom entries. But if Phase 12 already rewrote the directory, removing phantom entries may already be done.
**How to avoid:** Check the state of SKILL-DIRECTORY.md AFTER Phase 12 completes. If phantoms are already gone, mark as done. If not, remove the entries.

## Detailed Inventory

### Legacy v6.1.0 Agents to Remove (15 files)

Files in `agents/` root that are v6.1.0 artifacts with no role in v2.0:

| File | v2.0 Replacement | Confidence |
|------|-------------------|------------|
| `agents/design-lead.md` | `agents/pipeline/build-orchestrator.md` | HIGH -- explicitly replaced in Phase 2 |
| `agents/design-researcher.md` | `agents/pipeline/researcher.md` | HIGH -- replaced in Phase 2 |
| `agents/quality-reviewer.md` | `agents/pipeline/quality-reviewer.md` | HIGH -- replaced in Phase 2 |
| `agents/section-builder.md` | `agents/pipeline/section-builder.md` | HIGH -- replaced in Phase 2 |
| `agents/discussion-protocol.md` | `agents/protocols/discussion-protocol.md` | HIGH -- replaced in Phase 2 |
| `agents/accessibility-auditor.md` | `skills/accessibility/SKILL.md` + QR agent | HIGH -- specialist auditor, v6.1.0 only |
| `agents/component-documenter.md` | `skills/design-system-export/SKILL.md` | HIGH -- specialist auditor, v6.1.0 only |
| `agents/design-system-auditor.md` | QR agent + CD agent cover this | HIGH -- specialist auditor, v6.1.0 only |
| `agents/interaction-reviewer.md` | QR agent covers this | HIGH -- specialist auditor, v6.1.0 only |
| `agents/migration-assistant.md` | Not needed in v2.0 | HIGH -- specialist auditor, v6.1.0 only |
| `agents/performance-auditor.md` | `skills/performance-animation/SKILL.md` + QR | HIGH -- specialist auditor, v6.1.0 only |
| `agents/responsive-tester.md` | `skills/responsive-design/SKILL.md` + live-testing | HIGH -- specialist auditor, v6.1.0 only |
| `agents/security-auditor.md` | Not needed (frontend-only scope) | HIGH -- specialist auditor, v6.1.0 only |
| `agents/seo-optimizer.md` | `skills/seo-meta/SKILL.md` | HIGH -- specialist auditor, v6.1.0 only |
| `agents/typescript-auditor.md` | Not needed in v2.0 | HIGH -- specialist auditor, v6.1.0 only |
| `agents/visual-auditor-live.md` | `skills/live-testing/SKILL.md` | HIGH -- specialist auditor, v6.1.0 only |

**Note:** `agents/figma-translator.md` is a v2.0 agent created in Phase 9. Do NOT remove it.

**v6.1.0 agents that reference the root discussion-protocol.md:**
- `agents/design-lead.md` (line ~12: references `agents/discussion-protocol.md`)
- `agents/section-builder.md` (line ~14: references `agents/discussion-protocol.md`)

Both of these are being deleted anyway, so no reference cleanup needed.

### Superseded v6.1.0 Skills to Remove

Skills with NO `version:` field that have a v2.0 replacement under a different (or same) name:

| v6.1.0 Skill | v2.0 Replacement | Merger/Rename | Confidence |
|---------------|-------------------|---------------|------------|
| `accessibility-patterns/` | `accessibility/` | Rewrite | HIGH |
| `conversion-patterns/` | `copy-intelligence/` | Merged | HIGH |
| `creative-sections/` | `wow-moments/` | Absorbed | HIGH |
| `light-mode-patterns/` | `dark-light-mode/` | Merged | HIGH |
| `micro-copy/` | `copy-intelligence/` | Merged | HIGH |
| `mobile-navigation/` | `responsive-design/` | Merged | HIGH |
| `mobile-patterns/` | `responsive-design/` | Merged | HIGH |
| `modal-dialog-patterns/` | No direct v2.0 skill | Was planned for `interaction-patterns` merger | MEDIUM |
| `nextjs-app-router/` | `nextjs-patterns/` | Replaced | HIGH |
| `premium-dark-ui/` | `dark-light-mode/` | Merged | HIGH |
| `premium-typography/` | `design-dna/` + `design-system-scaffold/` | Absorbed | HIGH |
| `responsive-layout/` | `responsive-design/` | Merged | HIGH |

**v6.1.0 skills that should NOT be removed** (no v2.0 replacement exists and they remain as reference material or standalone domain skills):

| v6.1.0 Skill | Reason to Keep |
|---------------|----------------|
| `auth-ui/` | Standalone domain skill, not superseded |
| `awwwards-scoring/` | Deferred decision (keep separate or fold into anti-slop-gate) -- per Phase 1 cull list |
| `chart-data-viz/` | Was to be absorbed into dashboard-patterns but kept separate |
| `context-menu/` | Was to be merged into interaction-patterns but that skill was never created |
| `data-table/` | Standalone UI pattern, not superseded |
| `drag-and-drop/` | Was to be merged into interaction-patterns but that skill was never created |
| `email-notification-ui/` | Standalone pattern |
| `error-states-ui/` | Standalone pattern |
| `file-upload-media/` | Standalone pattern |
| `glow-neon-effects/` | Standalone pattern |
| `image-asset-pipeline/` | Standalone pattern |
| `landing-page/` | Standalone domain skill |
| `map-location/` | Standalone pattern |
| `markdown-mdx/` | Standalone pattern |
| `navigation-patterns/` | Was listed for rewrite but not yet done |
| `notification-center/` | Standalone pattern |
| `onboarding-tours/` | Standalone pattern |
| `performance-guardian/` | Standalone pattern |
| `performance-patterns/` | Standalone pattern |
| `print-pdf/` | Standalone pattern |
| `rating-review/` | Standalone pattern |
| `search-ui/` | Standalone pattern |
| `shadcn-components/` | Was listed for rewrite but not yet done |
| `skeleton-loading/` | Standalone pattern |
| `social-features/` | Standalone pattern |
| `testing-patterns/` | Was listed for rewrite but not yet done |
| `ux-patterns/` | Standalone pattern |

**The "5 superseded" from audit:** The Phase 8 verification noted "5 superseded v6.1.0 skills" and "6 old skills still exist." The exact 5 is a subset of the 12 listed above. The clearly superseded ones (merged/replaced with v2.0 equivalents) total approximately 12 directories. The conservative count of 5 likely refers to the most obvious mergers: `accessibility-patterns`, `light-mode-patterns`, `premium-dark-ui`, `nextjs-app-router`, and `responsive-layout` (or similar). Regardless, all 12 identified above should be removed since they each have a clear v2.0 replacement.

### Phantom typography/color-system Entries

**Current state:** Neither `skills/typography/` nor `skills/color-system/` directories exist on disk (confirmed -- `ls` returns exit code 2). However, `SKILL-DIRECTORY.md` lists them as "PLANNED" Core skills at lines 46-47.

**Resolution:** These skills were never created. Their content was absorbed into:
- Typography patterns -> `design-dna/SKILL.md` (type scale), `design-system-scaffold/SKILL.md` (typed utilities), `tailwind-system/SKILL.md` (@theme font tokens)
- Color system patterns -> `design-dna/SKILL.md` (12 color tokens), `design-archetypes/SKILL.md` (per-archetype palettes), `tailwind-system/SKILL.md` (@theme color tokens)

**Action:** Remove these entries from SKILL-DIRECTORY.md (or confirm Phase 12 already did this when rebuilding the directory).

### ROADMAP.md Bookkeeping Issues

| Issue | Current | Should Be | Line |
|-------|---------|-----------|------|
| Phase 4 checkbox | `[ ]` | `[x]` | 18 |
| Phase 7 checkbox | `[ ]` | `[x]` | 21 |

Phase 4 and Phase 7 are listed as `[ ]` in the phase summary list (lines 18, 21) despite all their plans being checked `[x]` and the progress table showing them as "Complete" (lines 283-284). This is a simple bookkeeping error.

### REQUIREMENTS.md Bookkeeping Issues

| Issue | Current | Should Be | Lines |
|-------|---------|-----------|-------|
| FOUND-01 checkbox | `[ ]` | `[x]` | 10 |
| FOUND-02 checkbox | `[ ]` | `[x]` | 11 |
| FOUND-03 checkbox | `[ ]` | `[x]` | 12 |
| FOUND-04 checkbox | `[ ]` | `[x]` | 13 |
| SKIL-01 checkbox | `[ ]` | `[x]` | 74 |
| SKIL-02 checkbox | `[ ]` | `[x]` | 75 |
| SKIL-03 checkbox | `[ ]` | `[x]` | 76 |

The traceability table at lines 119-162 correctly shows all of these as "Complete". The checkbox list at the top is stale.

**Note:** The audit mentioned "CONT-02-07 still marked Pending" but this has ALREADY been fixed -- current REQUIREMENTS.md shows CONT-02 through CONT-07 as `[x]` (lines 35-40) and the traceability table shows "Complete" for all of them. This tech debt item is resolved.

### react-vite-patterns Missing Constraints

**Current state:** `skills/react-vite-patterns/SKILL.md` (617 lines) has no Machine-Readable Constraints section. The Phase 8 verification notes this -- 8 of 9 framework skills have constraint tables; react-vite-patterns does not.

**What to add:** A constraint table consistent with the other framework skills. Suggested parameters:

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Initial bundle (JS) | -- | 200 | KB (gzipped) | SOFT |
| Route chunk size | -- | 80 | KB (gzipped) | SOFT |
| Font preloads | 1 | 3 | files | SOFT |
| Critical CSS inlined | -- | 14 | KB | SOFT |
| Largest Contentful Paint | -- | 2.5 | seconds | HARD |
| Cumulative Layout Shift | -- | 0.1 | score | HARD |
| Code-split routes | all | all | routes | HARD |
| FOUC prevention script | required | -- | -- | HARD |

These should be verified against the constraint tables in `nextjs-patterns`, `astro-patterns`, and `desktop-patterns` for consistency.

### Phase 6 Brainstorm Skill Wiring

**Current state:** The 4 Phase 6 skills (`design-brainstorm`, `cross-pollination`, `creative-direction-format`, `copy-intelligence`) are NOT explicitly referenced by ANY agent in `agents/pipeline/`, `agents/specialists/`, or `agents/protocols/`, nor by any command in `commands/`. Grep across all these directories returns zero matches.

**These skills rely entirely on auto-discovery** (tier-based loading from SKILL-DIRECTORY.md triggers). This means agents do not know to load them unless the trigger words match.

**Which agents SHOULD reference them:**
- `agents/pipeline/researcher.md` -- should reference `design-brainstorm` and `cross-pollination` for research methodology
- `agents/pipeline/creative-director.md` -- should reference `creative-direction-format` for direction structuring and `cross-pollination` for creative push
- `agents/pipeline/section-planner.md` -- should reference `copy-intelligence` for content planning
- `commands/start-project.md` -- should reference `design-brainstorm` for the brainstorming phase
- `commands/lets-discuss.md` -- should reference `cross-pollination` and `creative-direction-format` for discussion guidance

**Action:** Add `skills:` frontmatter entries or explicit "Load skill X" instructions to the relevant agents/commands.

## State of the Art

Not applicable -- this is repository cleanup, not technology research.

## Open Questions

1. **Which v6.1.0 skills without v2.0 replacements should be removed vs kept?**
   - What we know: 12 skills are clearly superseded. ~26 more v6.1.0 skills have no v2.0 replacement.
   - What's unclear: The audit says "5 superseded v6.1.0 skills" but the actual count of clearly superseded skills is closer to 12. Should we remove all 12 or only the "safe 5"?
   - Recommendation: Remove all 12 that have clear v2.0 replacements. Leave the others. The cull list in SKILL-DIRECTORY.md already documents which were kept vs removed.

2. **Will Phase 12 have already fixed SKILL-DIRECTORY.md phantoms?**
   - What we know: Phase 12 rebuilds SKILL-DIRECTORY.md from scratch.
   - What's unclear: If Phase 12 rebuilds correctly, the phantom entries will already be gone.
   - Recommendation: Check after Phase 12. If already resolved, skip. If not, remove entries.

3. **How should brainstorm skills be wired -- frontmatter `skills:` or inline instructions?**
   - What we know: Some agents use `skills:` in frontmatter (e.g., quality-reviewer has `skills: [anti-slop-gate, design-archetypes]`). Others reference skills in prose.
   - Recommendation: Use the `skills:` frontmatter pattern where it exists (quality-reviewer, creative-director). For commands that don't have frontmatter skills, add inline "Load skill: X" instructions.

## Sources

### Primary (HIGH confidence)
- Direct file system inspection of all `agents/`, `skills/`, and `commands/` directories
- `agents/discussion-protocol.md` (v6.1.0, 82 lines) vs `agents/protocols/discussion-protocol.md` (v2.0, 187 lines)
- `.planning/v1-MILESTONE-AUDIT.md` -- tech debt inventory
- `.planning/REQUIREMENTS.md` -- current checkbox/traceability state
- `.planning/ROADMAP.md` -- current phase checkbox state
- `skills/SKILL-DIRECTORY.md` -- phantom entries at lines 46-47
- Version field check across all 89 skill directories

### Secondary (MEDIUM confidence)
- Phase 8 verification document (`08-VERIFICATION.md`) -- references "5 superseded" and "6 old skills"
- Phase 8 plan summaries -- confirm which skills were rewritten vs left untouched

## Metadata

**Confidence breakdown:**
- Legacy agent inventory: HIGH -- direct file system inspection
- Superseded skills: HIGH -- version field comparison + cull list cross-reference
- Bookkeeping issues: HIGH -- direct file inspection of current state
- Brainstorm skill wiring: HIGH -- grep confirms zero references
- Phantom skills: HIGH -- confirmed directories do not exist
- react-vite-patterns constraints: HIGH -- confirmed missing via grep

**Research date:** 2026-02-25
**Valid until:** Until Phase 13 executes (findings are point-in-time snapshot)
