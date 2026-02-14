# Visual Audit (Live Browser)

Record and evaluate the actual rendered output using browser automation. Captures GIFs of scroll behavior, hover states, animations, and page load to verify design quality beyond static code analysis.

## Prerequisites

- Dev server running (e.g., `npm run dev` on localhost:3000)
- Chrome browser open with Claude extension active
- `.planning/modulo/DESIGN-DNA.md` exists (for comparison)

## Process

### Phase 1: Setup
1. Read `.planning/modulo/DESIGN-DNA.md` for expected design language
2. Read `.planning/modulo/STATE.md` for which sections are built
3. Use `mcp__claude-in-chrome__tabs_context_mcp` to check browser state
4. Navigate to the dev server URL

### Phase 2: Full Page Scroll Recording
1. Use `mcp__claude-in-chrome__gif_creator` to start recording
2. Scroll slowly through the entire page (top to bottom)
3. Capture at least 3 seconds of pause at each section
4. Save as `.planning/modulo/audit/full-scroll.gif`

### Phase 3: Animation Audit
For each section with animations:
1. Scroll to just before the section enters viewport
2. Start GIF recording
3. Scroll the section into view to trigger enter animations
4. Record stagger timing, direction, easing quality
5. Save as `.planning/modulo/audit/section-{name}-enter.gif`

### Phase 4: Interaction Audit
For each interactive element (buttons, cards, nav):
1. Start GIF recording
2. Hover over the element, hold 1-2 seconds
3. Move to next interactive element
4. Record hover states, transitions, glow effects
5. Save as `.planning/modulo/audit/interactions.gif`

### Phase 5: Page Load Audit
1. Use `mcp__claude-in-chrome__navigate` to reload the page
2. Record GIF from the moment the page starts loading
3. Capture hero animation sequence, staggered reveals
4. Save as `.planning/modulo/audit/page-load.gif`

### Phase 6: Evaluate

Score each category against Design DNA:

**Animation Quality (score /10)**
- [ ] Elements enter with staggered timing (not all at once)
- [ ] Scroll-triggered animations fire at appropriate viewport entry
- [ ] Stagger delay feels intentional (60-120ms between elements)
- [ ] Easing curves match Design DNA specification
- [ ] Enter direction is consistent with motion language
- [ ] No janky or stuttering animations
- [ ] Hover transitions are smooth and responsive
- [ ] Page load sequence has clear choreography
- [ ] Reduced-motion fallback works (no animation = still readable)
- [ ] At least one "wow" animation moment exists

**Visual Coherence (score /10)**
- [ ] Color palette matches Design DNA exactly (no stray hex values)
- [ ] Typography is consistent (same fonts, weights, tracking throughout)
- [ ] Spacing rhythm feels intentional (varied, not uniform)
- [ ] Border-radius is consistent per Design DNA system
- [ ] Shadow approach is consistent across elements
- [ ] Texture/effects (grain, glow, glass) applied consistently
- [ ] Signature element is present and prominent
- [ ] No two adjacent sections use the same layout pattern
- [ ] Overall page has clear visual hierarchy
- [ ] Page doesn't look like a template — it has personality

**Responsiveness Spot-Check (score /5)**
- [ ] Resize browser to 375px — nothing breaks
- [ ] Resize to 768px — layout adapts correctly
- [ ] Text is readable at all widths
- [ ] Touch targets are appropriately sized on narrow viewports
- [ ] No horizontal scrollbar on any viewport width

### Phase 7: Write Report

Create `.planning/modulo/audit/VISUAL-AUDIT.md`:

```markdown
# Visual Audit Report

**Date:** [timestamp]
**URL:** [dev server URL]
**Design DNA Archetype:** [archetype name]

## Recordings
- Full scroll: `audit/full-scroll.gif`
- Page load: `audit/page-load.gif`
- Interactions: `audit/interactions.gif`
- Section animations: `audit/section-{name}-enter.gif`

## Scores
| Category | Score | Pass (7+) |
|----------|-------|-----------|
| Animation Quality | /10 | |
| Visual Coherence | /10 | |
| Responsiveness | /5 | |
| **Total** | **/25** | **18+ = Pass** |

## Issues Found
### Critical (must fix)
1. ...

### Major (should fix)
1. ...

### Minor (nice to fix)
1. ...

## Design DNA Compliance
- Palette match: [exact / minor deviations / significant drift]
- Typography match: [exact / minor deviations / significant drift]
- Signature element: [present and prominent / present but subtle / missing]
- Motion language: [matches DNA / partially matches / doesn't match]

## Verdict: [PASSED / NEEDS ITERATION / MAJOR REWORK]
```

### Phase 8: Fix Critical Issues
If verdict is NEEDS ITERATION, create targeted fix plans and run `/modulo:iterate`.

## Rules

- ALWAYS record GIFs — visual evidence is the point of this audit
- Compare EVERYTHING against Design DNA, not just "does it look good"
- Score < 18/25 = automatic NEEDS ITERATION verdict
- Missing signature element = automatic -3 points
- Generic-looking output (could be any template) = automatic -5 points
- Be specific in issue descriptions — include section name, element, what's wrong
