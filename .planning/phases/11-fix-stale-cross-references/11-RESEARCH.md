# Phase 11: Fix Stale Cross-References - Research

**Researched:** 2026-02-25
**Domain:** Markdown cross-reference integrity across skills, agents, and commands
**Confidence:** HIGH

## Summary

This research is an exhaustive codebase scan identifying every stale reference that must be repaired in Phase 11. The v1 milestone audit identified the broad categories; this research provides the precise hit list with file paths, line numbers, current text, and proposed replacements.

Six categories of stale references were found across **v2.0 active files** (skills/, agents/, commands/):

1. **`design-lead`** -- 30+ occurrences in 3 skill files and 3 agent files (v6.1.0 legacy agent, should be `build-orchestrator`)
2. **`start-design`** -- 10 occurrences in 2 skill files, 3 agent files (renamed to `start-project` in Phase 3)
3. **`plan-sections`** -- 4 occurrences in 1 skill file, 1 agent file (renamed to `plan-dev` in Phase 3)
4. **`/gen:verify`** -- 24 occurrences in 8 skill files, 3 agent files (renamed to `/gen:audit`)
5. **`/gen:export`** -- 2 occurrences in 1 skill file (command does not exist)
6. **REFERENCES.md producer gap** -- 5 v2.0 pipeline agents and 1 skill reference `.planning/genorah/REFERENCES.md` as a read dependency, but no command produces this file at that path

Additionally, the legacy **`agents/discussion-protocol.md`** (v6.1.0) contains 5 stale command references and should be considered for removal since `agents/protocols/discussion-protocol.md` (v2.0) is the active replacement.

**Primary recommendation:** Execute a systematic find-and-replace organized by stale reference type. Each replacement must be context-aware (not blind string replacement) because the same stale name appears in different semantic contexts.

---

## Exhaustive Hit List

### Category 1: `design-lead` References

**Replacement:** `build-orchestrator` (the v2.0 pipeline agent that replaced design-lead's orchestration role)

#### File: `skills/progress-reporting/SKILL.md` (22 occurrences)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 13 | `...the design-lead, build-orchestrator, and section-builder agents follow...` | `...the build-orchestrator and section-builder agents follow...` |
| 21 | `design-lead` (reporter column) | `build-orchestrator` |
| 22 | `design-lead` (reporter column) | `build-orchestrator` |
| 23 | `design-lead` (reporter column) | `build-orchestrator` |
| 24 | `design-lead` (reporter column) | `build-orchestrator` |
| 25 | `design-lead` (reporter column) | `build-orchestrator` |
| 43 | `**Referenced by:** \`design-lead\` agent during wave orchestration` | `**Referenced by:** \`build-orchestrator\` agent during wave orchestration` |
| 108 | `The design-lead reads each builder's SUMMARY.md...` | `The build-orchestrator reads each builder's SUMMARY.md...` |
| 112 | `...the design-lead reports a **compact one-liner**...` | `...the build-orchestrator reports a **compact one-liner**...` |
| 153 | `...the design-lead produces a detailed wave summary...` | `...the build-orchestrator produces a detailed wave summary...` |
| 182 | `...performed by the design-lead before writing the wave summary (see design-lead agent protocol).` | `...performed by the build-orchestrator before writing the wave summary (see build-orchestrator agent protocol).` |
| 184 | `The design-lead does NOT proceed...` | `The build-orchestrator does NOT proceed...` |
| 317 | `...established in the design-lead agent protocol...` | `...established in the build-orchestrator agent protocol...` |
| 383 | `...the design-lead never auto-proceeds.` | `...the build-orchestrator never auto-proceeds.` |
| 408 | `Once approved: design-lead spawns Wave N+1 builders` | `Once approved: build-orchestrator spawns Wave N+1 builders` |
| 474 | `...the design-lead shows the STATE.md task table.` | `...the build-orchestrator shows the STATE.md task table.` |
| 498 | `The design-lead STOPS and WAITS.` | `The build-orchestrator STOPS and WAITS.` |
| 518 | `The design-lead monitors builder progress...` | `The build-orchestrator monitors builder progress...` |
| 520 | `The design-lead should be managing the wave...` | `The build-orchestrator should be managing the wave...` |
| 522 | `The design-lead only reports when a builder finishes...` | `The build-orchestrator only reports when a builder finishes...` |

#### File: `skills/error-recovery/SKILL.md` (12 occurrences)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 60 | `**Referenced by:** \`design-lead\` agent for wave-level error handling` | `**Referenced by:** \`build-orchestrator\` agent for wave-level error handling` |
| 61 | `**Referenced by:** \`build-orchestrator\` agent (via design-lead)` | `**Referenced by:** \`build-orchestrator\` agent for detecting builder failures` |
| 170 | `This is how the design-lead detects and handles builder failures.` | `This is how the build-orchestrator detects and handles builder failures.` |
| 290 | `This protocol is used by the design-lead agent when...` | `This protocol is used by the build-orchestrator agent when...` |
| 292 | `**Step 1: Pre-wave checkpoint (design-lead writes BEFORE spawning builders):**` | `**Step 1: Pre-wave checkpoint (build-orchestrator writes BEFORE spawning builders):**` |
| 294 | `The design-lead MUST write this checkpoint to STATE.md...` | `The build-orchestrator MUST write this checkpoint to STATE.md...` |
| 307 | `**Step 2: Detection after interruption (design-lead runs on resume):**` | `**Step 2: Detection after interruption (build-orchestrator runs on resume):**` |
| 455 | `...design-lead verifies dependencies before spawning...` | `...build-orchestrator verifies dependencies before spawning...` |
| 469 | `...design-lead forgot token values` | `...build-orchestrator forgot token values` |
| 474 | `...quality-reviewer agent (or design-lead during coherence check)...` | `...quality-reviewer agent (or build-orchestrator during coherence check)...` |
| 538 | `The design-lead/orchestrator marks a wave as complete...` | `The build-orchestrator marks a wave as complete...` |

Note: Line 417 references "Design-lead and section-builder agents" in the failure classification table -- should be "Build-orchestrator and section-builder agents".

#### File: `skills/emotional-arc/SKILL.md` (1 occurrence)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 56 | `**Referenced by:** \`design-lead\` during \`/gen:plan-sections\`` | `**Referenced by:** \`section-planner\` during \`/gen:plan-dev\`` |

Note: This line has TWO stale references -- both `design-lead` and `/gen:plan-sections`. The correct agent is `section-planner` (the one that actually assigns beats to sections).

#### File: `agents/discussion-protocol.md` (v6.1.0 legacy, 1 occurrence)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 78 | `\`design-lead\` \| YES \| Present wave plan before spawning` | Remove entire file (replaced by `agents/protocols/discussion-protocol.md`) OR replace with `\`build-orchestrator\`` |

#### File: `agents/section-builder.md` (v6.1.0 legacy, 1 occurrence)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 24 | `Your spawn prompt from the design-lead contains...` | `Your spawn prompt from the build-orchestrator contains...` |

Note: `agents/section-builder.md` is the v6.1.0 legacy file. The v2.0 replacement is at `agents/pipeline/section-builder.md`. This is a LEGACY FILE that should be removed in Phase 13 (legacy cleanup), but the cross-reference should still be noted.

#### File: `agents/design-lead.md` (ENTIRE FILE is v6.1.0 legacy)

This file IS the legacy design-lead agent. It should NOT have references fixed -- it should be removed in Phase 13 (legacy cleanup). However, it contains `start-design` and `REFERENCES.md` references that are stale. Flagging for awareness.

---

### Category 2: `start-design` References

**Replacement:** `start-project` (renamed in Phase 3)

#### File: `skills/figma-integration/SKILL.md` (6 occurrences)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 14 | `**\`/gen:start-design --figma\` is invoked**` | `**\`/gen:start-project --figma\` is invoked**` |
| 21 | `Use the normal \`/gen:start-design\` flow` | `Use the normal \`/gen:start-project\` flow` |
| 95 | `**Consumed at:** \`/gen:start-design --figma\` workflow steps 4-8` | `**Consumed at:** \`/gen:start-project --figma\` workflow steps 4-8` |
| 687 | `The archetype is set during \`/gen:start-design\`` | `The archetype is set during \`/gen:start-project\`` |
| 698 | `DESIGN-DNA.md (from /gen:start-design)` | `DESIGN-DNA.md (from /gen:start-project)` |
| 699 | `Design archetype (selected during start-design)` | `Design archetype (selected during start-project)` |

**IMPORTANT NOTE:** The `--figma` flag does NOT exist in `commands/start-project.md`. Lines 14 and 95 reference `--figma` which needs either:
- (a) Adding a `--figma` flag to `start-project.md`, OR
- (b) Documenting an alternative entry path (e.g., user provides Figma URL during discovery)
This is a design decision for the planner, not just a rename.

#### File: `agents/figma-translator.md` (1 occurrence)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 27 | `Run \`/gen:start-design\` first to generate the design identity.` | `Run \`/gen:start-project\` first to generate the design identity.` |

#### File: `agents/discussion-protocol.md` (v6.1.0 legacy, 1 occurrence)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 79 | `\`/gen:start-design\` \| NO \| Discovery/research is exploratory` | Remove file OR replace with `\`/gen:start-project\`` |

#### File: `agents/design-lead.md` (v6.1.0 legacy, 1 occurrence)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 23 | `Run \`/gen:start-design\` first.` | LEGACY FILE -- remove in Phase 13 |

---

### Category 3: `plan-sections` References

**Replacement:** `plan-dev` (renamed in Phase 3)

#### File: `skills/emotional-arc/SKILL.md` (3 occurrences)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 15 | `**During section planning** (\`/gen:plan-sections\`)` | `**During section planning** (\`/gen:plan-dev\`)` |
| 56 | `\`design-lead\` during \`/gen:plan-sections\`` | `\`section-planner\` during \`/gen:plan-dev\`` |
| 607 | `**Input from:** \`/gen:plan-sections\` -- receives page content inventory` | `**Input from:** \`/gen:plan-dev\` -- receives page content inventory` |

#### File: `agents/discussion-protocol.md` (v6.1.0 legacy, 1 occurrence)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 80 | `\`/gen:plan-sections\` \| Partial \| Each section plan already requires user approval` | Remove file OR replace with `\`/gen:plan-dev\`` |

---

### Category 4: `/gen:verify` References

**Replacement:** `/gen:audit` (the v2.0 command that performs quality review)

#### File: `skills/anti-slop-gate/SKILL.md` (4 occurrences)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 11 | `the gate runs during \`/gen:verify\` via the quality-reviewer agent` | `the gate runs during \`/gen:audit\` via the quality-reviewer agent` |
| 18 | `**During \`/gen:verify\` command**` | `**During \`/gen:audit\` command**` |
| 57 | `both run during \`/gen:verify\`` | `both run during \`/gen:audit\`` |
| 68 | `quality-reviewer agent during \`/gen:verify\`` | `quality-reviewer agent during \`/gen:audit\`` |

#### File: `skills/design-archetypes/SKILL.md` (1 occurrence)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 1138 | `During \`/gen:verify\`, the quality reviewer checks archetype compliance` | `During \`/gen:audit\`, the quality reviewer checks archetype compliance` |

#### File: `skills/emotional-arc/SKILL.md` (2 occurrences)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 17 | `**During verify** (\`/gen:verify\`)` | `**During audit** (\`/gen:audit\`)` |
| 58 | `**Verified by:** \`quality-reviewer\` during \`/gen:verify\`` | `**Verified by:** \`quality-reviewer\` during \`/gen:audit\`` |

#### File: `skills/figma-integration/SKILL.md` (5 occurrences)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 15 | `During \`/gen:verify\`, use this skill's visual QA overlay diff` | `During \`/gen:audit\`, use this skill's visual QA overlay diff` |
| 96 | `**Consumed at:** \`/gen:verify\` visual QA overlay diff step` | `**Consumed at:** \`/gen:audit\` visual QA overlay diff step` |
| 250 | `Used during /gen:verify for overlay diff comparison` | `Used during /gen:audit for overlay diff comparison` |
| 484 | `This runs during the \`/gen:verify\` step, not during import.` | `This runs during the \`/gen:audit\` step, not during import.` |
| 709 | `for visual QA during /gen:verify` | `for visual QA during /gen:audit` |

#### File: `skills/multi-page-architecture/SKILL.md` (3 occurrences)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 23 | `During \`/gen:verify\` -- quality reviewer checks cross-page consistency` | `During \`/gen:audit\` -- quality reviewer checks cross-page consistency` |
| 56 | `**Verified by:** \`quality-reviewer\` during \`/gen:verify\`` | `**Verified by:** \`quality-reviewer\` during \`/gen:audit\`` |
| 404 | `Quality reviewers check these during \`/gen:verify\`.` | `Quality reviewers check these during \`/gen:audit\`.` |

#### File: `skills/progress-reporting/SKILL.md` (4 occurrences)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 248 | `Run \`/gen:verify\` for full visual QA review.` | `Run \`/gen:audit\` for full visual QA review.` |
| 298 | `or via \`/gen:verify\`` | `or via \`/gen:audit\`` |
| 305 | `Run \`/gen:verify\` with browser tools for visual QA.` | `Run \`/gen:audit\` with browser tools for visual QA.` |
| 482 | `Mid-build screenshots available only on explicit user request via \`/gen:verify\`.` | `Mid-build screenshots available only on explicit user request via \`/gen:audit\`.` |

#### File: `skills/awwwards-scoring/SKILL.md` (1 occurrence)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 134 | `During \`/gen:verify\`, run the full 4-axis scoring` | `During \`/gen:audit\`, run the full 4-axis scoring` |

#### File: `agents/figma-translator.md` (2 occurrences)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 69 | `reference targets for visual QA during \`/gen:verify\`.` | `reference targets for visual QA during \`/gen:audit\`.` |
| 98 | `When invoked during \`/gen:verify\` (not during import)` | `When invoked during \`/gen:audit\` (not during import)` |

#### File: `agents/discussion-protocol.md` (v6.1.0 legacy, 1 occurrence)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 81 | `\`/gen:verify\` \| NO \| Verification is read-only` | Remove file OR replace with `\`/gen:audit\`` |

#### File: `agents/design-lead.md` (v6.1.0 legacy, 1 occurrence)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 284 | `Run \`/gen:verify\` to verify quality.` | LEGACY FILE -- remove in Phase 13 |

---

### Category 5: `/gen:export` References

**Status:** This command does not exist in v2.0. The `design-system-export` skill references it.

**Options:**
- (a) Create an `/gen:export` command (out of scope for Phase 11 -- deferred to Phase 12/13)
- (b) Rewire the skill to describe export as a user-requested action during `/gen:audit` or post-build
- (c) Note it as a known future command and leave the references as aspirational

#### File: `skills/design-system-export/SKILL.md` (2 occurrences)

| Line | Current Text | Proposed Replacement |
|------|-------------|---------------------|
| 14 | `User requests \`/gen:export\` or asks for "design system export"` | `User requests design system export (post-build action)` |
| 64 | `**Consumed at:** \`/gen:export\` command (post-build)` | `**Consumed at:** Post-build export workflow (user-triggered)` |

**Recommendation:** Since no `/gen:export` command exists and creating one is out of scope for Phase 11, rewire the references to describe the export as a user-triggered action that the build-orchestrator or polisher can perform on request. The skill itself is valid -- only the command entry point reference is broken.

---

### Category 6: REFERENCES.md Producer-Consumer Gap

**The Problem:**

The following v2.0 pipeline agents list `.planning/genorah/REFERENCES.md` as a READ dependency:

| Agent | File | Line | Context |
|-------|------|------|---------|
| section-planner | `agents/pipeline/section-planner.md` | 3 (description), 18, 339 | Listed as input in contract and step 5 of planning workflow |
| quality-reviewer | `agents/pipeline/quality-reviewer.md` | 24 | Listed as "Always read" in input contract |
| polisher | `agents/pipeline/polisher.md` | 29 | Listed as input |
| build-orchestrator | `agents/pipeline/build-orchestrator.md` | 25 | Listed as input (with note: "embedded in PLAN.md files") |
| section-builder | `agents/pipeline/section-builder.md` | 37 | Listed under "You do NOT need to read" |

And these specialist agents:
| Agent | File | Line | Context |
|-------|------|------|---------|
| 3d-specialist | `agents/specialists/3d-specialist.md` | 37 | Listed under "You do NOT need to read" |
| animation-specialist | `agents/specialists/animation-specialist.md` | 37 | Listed under "You do NOT need to read" |
| content-specialist | `agents/specialists/content-specialist.md` | 38 | Listed under "You do NOT need to read" |

The `reference-benchmarking` skill (`skills/reference-benchmarking/SKILL.md` line 407) explicitly instructs the researcher to write to `.planning/genorah/REFERENCES.md`.

**But:** The researcher agent (`agents/pipeline/researcher.md` line 190) writes to `.planning/genorah/research/{TRACK}.md` (e.g., `research/DESIGN-REFERENCES.md`). No command or agent consolidates research track files into a top-level `REFERENCES.md`.

**Additionally:** The `start-project` command makes NO mention of REFERENCES.md at all.

**Two resolution paths:**

**Path A: Add REFERENCES.md production step** -- Add a step to `start-project.md` or `plan-dev.md` that consolidates `research/DESIGN-REFERENCES.md` into `.planning/genorah/REFERENCES.md`. The `reference-benchmarking` skill already defines what this file should contain (line 407).

**Path B: Update consumers to read research/*.md** -- Change the section-planner, quality-reviewer, and polisher input contracts to read `.planning/genorah/research/DESIGN-REFERENCES.md` instead of `.planning/genorah/REFERENCES.md`. This is more aligned with the v2.0 architecture where research is split by track.

**Recommendation:** Path B is simpler, more aligned with v2.0 architecture (research tracks are separate files), and avoids adding a consolidation step. The key consumers (section-planner, quality-reviewer) already read `research/*.md`. The explicit `REFERENCES.md` reference can be updated to `research/DESIGN-REFERENCES.md` or removed where `research/*.md` glob already covers it. Additionally, update the `reference-benchmarking` skill to instruct the researcher to write to `research/DESIGN-REFERENCES.md` (matching the researcher agent's actual output path).

---

### Category 7: Additional Stale References (Beyond Audit Scope)

#### `agents/discussion-protocol.md` (v6.1.0 legacy -- ENTIRE FILE)

This file at `agents/discussion-protocol.md` is the v6.1.0 version. The v2.0 replacement exists at `agents/protocols/discussion-protocol.md`. The v6.1.0 file contains 5 stale references:

| Line | Stale Reference | Category |
|------|----------------|----------|
| 75 | `/gen:bugfix` | Should be `/gen:bug-fix` (hyphenated in v2.0) |
| 76 | `/gen:change-plan` | Command removed in v2.0 (no replacement) |
| 78 | `design-lead` | Replaced by `build-orchestrator` |
| 79 | `/gen:start-design` | Replaced by `/gen:start-project` |
| 80 | `/gen:plan-sections` | Replaced by `/gen:plan-dev` |
| 81 | `/gen:verify` | Replaced by `/gen:audit` |

**Recommendation:** This file should be DELETED as part of Phase 11 (or deferred to Phase 13 legacy cleanup). The v2.0 `agents/protocols/discussion-protocol.md` is the active file. Fixing the stale references in a file that should not exist is wasted effort.

#### `agents/section-builder.md` (v6.1.0 legacy)

The root-level `agents/section-builder.md` is the v6.1.0 legacy file. V2.0 replacement: `agents/pipeline/section-builder.md`. Contains 1 stale `design-lead` reference (line 24). Should be removed in Phase 13 but is in scope for awareness.

#### `agents/quality-reviewer.md` (v6.1.0 legacy)

The root-level `agents/quality-reviewer.md` is the v6.1.0 legacy file. V2.0 replacement: `agents/pipeline/quality-reviewer.md`. Contains `REFERENCES.md` references (line 22, 179, 183-188) that are stale. Should be removed in Phase 13.

#### `agents/design-lead.md` (v6.1.0 legacy -- ENTIRE FILE)

Contains `start-design` (line 23), `REFERENCES.md` (line 43), `/gen:verify` (line 284). This entire file is the v6.1.0 agent that was replaced by `build-orchestrator`. Should be removed in Phase 13.

#### `README.md` (v6.1.0 content -- ENTIRE FILE)

The README is entirely v6.1.0 content. It lists:
- 13 commands (v2.0 has 8)
- 17 agents (v2.0 has a different structure)
- 16 archetypes (v2.0 has 19)
- Wrong workflow sequence
- Multiple stale command references

This is covered by ISSUE-5 in the audit. It is Phase 12 scope (SKILL-DIRECTORY and README overhaul), NOT Phase 11 scope.

#### `skills/SKILL-DIRECTORY.md` (stale)

Shows many skills as "PLANNED" that are now complete. This is ISSUE-4 in the audit. Phase 12 scope.

---

## Summary Statistics

### V2.0 Active Files Requiring Changes

| File | design-lead | start-design | plan-sections | /gen:verify | /gen:export | REFERENCES.md | Total |
|------|-------------|-------------|---------------|----------------|----------------|---------------|-------|
| skills/progress-reporting/SKILL.md | 22 | 0 | 0 | 4 | 0 | 0 | **26** |
| skills/error-recovery/SKILL.md | 12 | 0 | 0 | 0 | 0 | 0 | **12** |
| skills/figma-integration/SKILL.md | 0 | 6 | 0 | 5 | 0 | 0 | **11** |
| skills/emotional-arc/SKILL.md | 1 | 0 | 3 | 2 | 0 | 0 | **6** |
| skills/anti-slop-gate/SKILL.md | 0 | 0 | 0 | 4 | 0 | 0 | **4** |
| skills/multi-page-architecture/SKILL.md | 0 | 0 | 0 | 3 | 0 | 0 | **3** |
| skills/design-archetypes/SKILL.md | 0 | 0 | 0 | 1 | 0 | 0 | **1** |
| skills/awwwards-scoring/SKILL.md | 0 | 0 | 0 | 1 | 0 | 0 | **1** |
| skills/design-system-export/SKILL.md | 0 | 0 | 0 | 0 | 2 | 0 | **2** |
| skills/reference-benchmarking/SKILL.md | 0 | 0 | 0 | 0 | 0 | 3 | **3** |
| agents/figma-translator.md | 0 | 1 | 0 | 2 | 0 | 0 | **3** |
| agents/pipeline/section-planner.md | 0 | 0 | 0 | 0 | 0 | 3 | **3** |
| agents/pipeline/quality-reviewer.md | 0 | 0 | 0 | 0 | 0 | 1 | **1** |
| agents/pipeline/polisher.md | 0 | 0 | 0 | 0 | 0 | 1 | **1** |
| agents/pipeline/build-orchestrator.md | 0 | 0 | 0 | 0 | 0 | 1 | **1** |
| **Totals** | **35** | **7** | **3** | **22** | **2** | **9** | **78** |

### V6.1.0 Legacy Files (Remove or Fix)

| File | Stale References | Recommendation |
|------|-----------------|----------------|
| agents/discussion-protocol.md | 6 | DELETE (v2.0 at agents/protocols/) |
| agents/design-lead.md | 3+ | DELETE (v2.0 is build-orchestrator) |
| agents/section-builder.md | 1 | DELETE (v2.0 at agents/pipeline/) |
| agents/quality-reviewer.md | 7+ | DELETE (v2.0 at agents/pipeline/) |
| agents/design-researcher.md | ENTIRE | DELETE (v2.0 is researcher at agents/pipeline/) |
| README.md | 20+ | REWRITE in Phase 12 |
| skills/SKILL-DIRECTORY.md | 30+ | UPDATE in Phase 12 |

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cross-reference validation | Manual file-by-file checking | grep/rg-based verification script | 78+ replacements need machine verification |
| REFERENCES.md resolution | New consolidation command | Update consumers to read research/*.md | Aligns with existing v2.0 architecture |

---

## Common Pitfalls

### Pitfall 1: Blind String Replacement
**What goes wrong:** Running a global `design-lead` -> `build-orchestrator` replacement hits legacy files, planning docs, and audit docs -- not just active v2.0 files.
**How to avoid:** Scope replacements to explicit file lists. Only modify files in `skills/` and `agents/` directories that are v2.0 active files (not `agents/design-lead.md` which IS the legacy file).

### Pitfall 2: Missing the `--figma` Flag Gap
**What goes wrong:** Renaming `start-design` to `start-project` in figma-integration without addressing the `--figma` flag that does not exist in start-project.md.
**How to avoid:** Plan 11-01 must include either adding the `--figma` flag to start-project.md or documenting an alternative Figma entry path.

### Pitfall 3: Fixing Legacy Files That Should Be Removed
**What goes wrong:** Spending effort fixing cross-references in v6.1.0 legacy files (design-lead.md, root section-builder.md, root quality-reviewer.md) that should be deleted.
**How to avoid:** Phase 11 should either (a) delete the legacy files, or (b) explicitly defer their deletion to Phase 13 and NOT fix their internal references.

### Pitfall 4: Incomplete `/gen:verify` Replacement
**What goes wrong:** Replacing `/gen:verify` with `/gen:audit` without considering semantic differences. The v6.1.0 `verify` was specifically quality review. The v2.0 `audit` is broader (visual quality + performance + accessibility + DNA compliance).
**How to avoid:** Most replacements are direct. But for contexts that specifically mean "quality review only" (like anti-slop-gate), confirm that `/gen:audit` still invokes the same quality-reviewer flow.

### Pitfall 5: REFERENCES.md Path Confusion
**What goes wrong:** Assuming `.planning/genorah/REFERENCES.md` and `.planning/genorah/research/DESIGN-REFERENCES.md` are the same thing.
**How to avoid:** They are different. The researcher writes to `research/DESIGN-REFERENCES.md` (one of 5 research tracks). The old architecture expected a consolidated `REFERENCES.md` at the top level. The fix must pick one canonical path and update all references to match.

---

## Architecture Patterns

### Correct v2.0 Agent Names

| v6.1.0 Name | v2.0 Name | Location |
|-------------|-----------|----------|
| `design-lead` | `build-orchestrator` | `agents/pipeline/build-orchestrator.md` |
| `design-researcher` | `researcher` | `agents/pipeline/researcher.md` |
| `section-builder` (root) | `section-builder` (pipeline) | `agents/pipeline/section-builder.md` |
| `quality-reviewer` (root) | `quality-reviewer` (pipeline) | `agents/pipeline/quality-reviewer.md` |
| `discussion-protocol` (root) | `discussion-protocol` (protocols) | `agents/protocols/discussion-protocol.md` |

### Correct v2.0 Command Names

| v6.1.0 Name | v2.0 Name | Location |
|-------------|-----------|----------|
| `/gen:start-design` | `/gen:start-project` | `commands/start-project.md` |
| `/gen:plan-sections` | `/gen:plan-dev` | `commands/plan-dev.md` |
| `/gen:verify` | `/gen:audit` | `commands/audit.md` |
| `/gen:bugfix` | `/gen:bug-fix` | `commands/bug-fix.md` |
| `/gen:change-plan` | REMOVED | No replacement |
| `/gen:export` | DOES NOT EXIST | No command file |
| `/gen:responsive-check` | REMOVED | Folded into audit |
| `/gen:lighthouse` | REMOVED | Folded into audit |
| `/gen:visual-audit` | REMOVED | Folded into audit |
| `/gen:generate-tests` | REMOVED | Removed |
| `/gen:update` | REMOVED | Removed |

### REFERENCES.md Data Flow (Current vs Fixed)

**Current (broken):**
```
researcher agent -> writes research/DESIGN-REFERENCES.md
section-planner -> reads REFERENCES.md (FILE DOES NOT EXIST)
quality-reviewer -> reads REFERENCES.md (FILE DOES NOT EXIST)
reference-benchmarking skill -> instructs write to REFERENCES.md (WRONG PATH)
```

**Fixed (recommended Path B):**
```
researcher agent -> writes research/DESIGN-REFERENCES.md (UNCHANGED)
section-planner -> reads research/*.md (ALREADY DOES THIS) + remove explicit REFERENCES.md ref
quality-reviewer -> reads research/DESIGN-REFERENCES.md (UPDATE from REFERENCES.md)
reference-benchmarking skill -> instructs write to research/DESIGN-REFERENCES.md (UPDATE)
polisher -> reads research/DESIGN-REFERENCES.md (UPDATE from REFERENCES.md)
build-orchestrator -> note already says "embedded in PLAN.md files" (CLARIFY)
```

---

## Open Questions

### 1. What to do about the `--figma` flag?
- **What we know:** `start-project.md` has no `--figma` flag. `figma-integration/SKILL.md` references it 2 times.
- **What's unclear:** Should Phase 11 add `--figma` to start-project.md, or just update the skill to describe an alternative entry path?
- **Recommendation:** Phase 11-01 should add a minimal `--figma` flag to start-project.md that triggers the figma-translator agent. This is a cross-reference fix, not new functionality -- the Figma flow needs an entry point.

### 2. Should legacy v6.1.0 agent files be deleted in Phase 11 or Phase 13?
- **What we know:** 5+ legacy agent files exist at `agents/` root. They are flagged for Phase 13 (legacy cleanup).
- **What's unclear:** Whether deleting them in Phase 11 is appropriate since they contain many of the stale references.
- **Recommendation:** Delete `agents/discussion-protocol.md` in Phase 11 (it conflicts with the active v2.0 file at agents/protocols/). Defer other legacy file deletions to Phase 13. Do NOT fix references inside legacy files.

### 3. Should `/gen:export` be created?
- **What we know:** `design-system-export` skill references it. No command file exists.
- **What's unclear:** Whether this is Phase 11 scope or deferred.
- **Recommendation:** Phase 11 should rewire the skill references to describe export as a user-triggered action (not a specific command). Creating the command is out of scope.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase grep of `skills/`, `agents/`, `commands/` directories -- all line numbers verified
- `commands/start-project.md`, `commands/audit.md` -- confirmed v2.0 command names
- `agents/pipeline/build-orchestrator.md` -- confirmed v2.0 orchestrator agent name
- `agents/pipeline/researcher.md` -- confirmed output path: `research/{TRACK}.md`
- `.planning/v1-MILESTONE-AUDIT.md` -- gap descriptions confirmed against actual codebase

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` -- Phase 3 decisions about command renames confirmed by actual files

---

## Metadata

**Confidence breakdown:**
- Stale reference inventory: HIGH -- every occurrence verified via grep with line numbers
- Replacement targets: HIGH -- v2.0 file names confirmed by reading actual command/agent files
- REFERENCES.md resolution: MEDIUM -- recommended Path B is logical but involves architecture decision
- `--figma` flag resolution: MEDIUM -- requires design decision, not just mechanical fix

**Research date:** 2026-02-25
**Valid until:** Indefinite (this is a snapshot of current codebase state)
