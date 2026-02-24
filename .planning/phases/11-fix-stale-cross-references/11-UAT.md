---
status: complete
phase: 11-fix-stale-cross-references
source: [11-01-SUMMARY.md, 11-02-SUMMARY.md]
started: 2026-02-25T18:00:00Z
updated: 2026-02-25T18:02:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Zero design-lead references in v2.0 scope
expected: Case-insensitive search for "design-lead" across skills/, agents/pipeline/, agents/specialists/, agents/protocols/, agents/figma-translator.md returns zero matches. Only agents/ root legacy files may still contain it.
result: pass

### 2. Zero start-design and --figma references
expected: Search for "start-design" and "--figma" across all v2.0 files returns zero matches. The figma-integration skill should describe providing a Figma URL during normal /modulo:start-project discovery instead.
result: pass

### 3. Zero plan-sections references
expected: Search for "plan-sections" across all v2.0 skill and agent files returns zero matches. Replaced with "plan-dev" everywhere.
result: pass

### 4. Zero /modulo:verify and /modulo:export references
expected: Search for "/modulo:verify" and "/modulo:export" across all v2.0 files returns zero matches. /modulo:verify replaced with /modulo:audit; /modulo:export replaced with post-build workflow description.
result: pass

### 5. Legacy discussion-protocol.md deleted
expected: agents/discussion-protocol.md (v6.1.0 legacy) no longer exists. The v2.0 replacement at agents/protocols/discussion-protocol.md still exists and is intact.
result: pass

### 6. Emotional arc beat assignment agent is correct
expected: In skills/emotional-arc/SKILL.md, the agent responsible for beat assignment is "section-planner" (not "build-orchestrator" or "design-lead"). This is semantically correct because the section-planner assigns beats to sections.
result: pass

### 7. REFERENCES.md consumer paths all use research/DESIGN-REFERENCES.md
expected: Search for bare "REFERENCES.md" (not preceded by "DESIGN-") across v2.0 agents and skills returns zero matches. All consumers now read from research/DESIGN-REFERENCES.md consistently.
result: pass

### 8. Reference-benchmarking skill output path is correct
expected: In skills/reference-benchmarking/SKILL.md, the output path instruction tells the researcher to write to research/DESIGN-REFERENCES.md (not bare REFERENCES.md).
result: pass

## Summary

total: 8
passed: 8
issues: 0
pending: 0
skipped: 0

## Gaps

[none]
