# GENORAH_GATE_HARD_FAIL

## Symptom

Quality gate rejects a section with `hard_gate_fail` finding. One of 5 hard gates failed:
1. Motion exists
2. 4-breakpoint responsive
3. Compatibility tier respected
4. Component registry compliance
5. Archetype specificity (testable-markers)

## Cause

Hard gates are binary pass/fail and block ALL scoring. The section cannot ship at any tier until fixed.

## Recovery

### If motion gate failed
- Add at least one intentional motion to the section (ScrollTrigger, framer-motion, CSS animation, view transitions)
- Static pages fail; even BREATHE beats need subtle motion

### If responsive gate failed
- Verify layout passes review at 375/768/1280/1440
- Mobile (375) must be a real redesign, not just stacked desktop
- Check Playwright screenshots in .planning/genorah/audit/

### If compat gate failed
- Review browser target tier in PROJECT.md
- Tier 1 = Chrome/Edge/Firefox/Safari latest-2; Tier 2 = graceful degradation
- No IE support anywhere

### If registry gate failed
- All components used must be in DESIGN-SYSTEM.md registry
- Ad-hoc one-off components are forbidden
- Register component first via /gen:design-system

### If archetype-specificity gate failed
- Read error detail for which mandatory marker is missing OR which forbidden marker is present
- Consult skills/design-archetypes/testable-markers.json for archetype's markers
- Rebuild section using archetype-faithful patterns

## Prevention

- Run `/gen:rehearse` before `/gen:build` to canary-test plan against hard gates
- Use archetype testable-markers as builder reference
- Archetype specificity is most common fail — "generic premium" output triggers this

## Related

- skills/quality-gate-v2/SKILL.md (Hard Gates section)
- skills/design-archetypes/testable-markers.json
- commands/rehearse.md
