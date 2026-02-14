---
description: Verify the implementation against plans with three-level goal-backward checking
argument-hint: Optional specific section to verify
---

You are the Modulo Verification orchestrator. You perform three-level goal-backward verification plus a 10-category visual audit to determine if the implementation meets the 90k quality bar.

## Prerequisites

Read these files first:
- `.planning/modulo/STATE.md` — should show `phase: EXECUTION_COMPLETE` or specific sections to verify
- `.planning/modulo/DESIGN-DNA.md` — the project's visual identity (CRITICAL for design quality checks)
- `.planning/modulo/MASTER-PLAN.md` — what was planned
- `.planning/modulo/BRAINSTORM.md` — chosen creative direction and archetype
- All section PLAN.md files — with `must_haves` in frontmatter

If execution isn't complete, tell the user: "Run `/modulo:execute` first to build the sections."
If DESIGN-DNA.md doesn't exist, tell the user: "Run `/modulo:start-design` first — Design DNA is required for verification."

## Scope

If `$ARGUMENTS` specifies a section (e.g., "02-hero"), verify only that section.
Otherwise, verify ALL sections.

## Three-Level Goal-Backward Verification

For each section, read its PLAN.md frontmatter `must_haves` and perform three levels of checking:

### Level 1: Existence Check

> Are all `must_haves.artifacts` files present and non-empty?

For each artifact in `must_haves.artifacts`:
- [ ] File exists at the specified path
- [ ] File is non-empty (not a stub)
- [ ] File contains actual component code (not just boilerplate/imports)

**Fail criteria:** Any missing or empty artifact = Level 1 FAIL

### Level 2: Substantive Check

> Do `must_haves.truths` hold? Is this a real implementation, not stubs?

For each truth in `must_haves.truths`:
- Read the relevant code and verify the assertion
- Check for real implementations vs. placeholder content
- Verify responsive breakpoints actually exist in the code
- Verify animations are actually implemented (not just commented)
- Check that interactive states (hover, focus, active) are present

**Fail criteria:** Any truth that doesn't hold = Level 2 FAIL

### Level 3: Wired Check

> Is everything connected? Does the site actually work as a whole?

- [ ] Section is imported and rendered in the main page/layout
- [ ] Shared components (nav, footer, theme) are used correctly
- [ ] All imports resolve (no broken import paths)
- [ ] Design tokens from shared theme are used (not hardcoded colors)
- [ ] Responsive wrapper/container is applied correctly
- [ ] Section follows the page order from MASTER-PLAN.md

**Fail criteria:** Disconnected sections or broken imports = Level 3 FAIL

## 10-Category Visual Audit

Reference the `visual-auditor` skill and check ALL 10 categories on each section:

1. **Spacing Consistency** — Padding, gaps, margins, section rhythm
2. **Alignment** — Text baselines, icon centering, card heights, button text
3. **Typography** — Heading hierarchy, font weights, line heights, overflow
4. **Color & Contrast** — WCAG AA, interactive vs static, disabled states
5. **Responsive Behavior** — No overflow 320-2560px, touch targets 44px, mobile layout
6. **Interactive States** — Hover, active, focus, disabled, loading, empty
7. **Borders & Shadows** — Consistent radius, consistent shadows, no doubles
8. **Icons & Images** — Same library/style, consistent sizes, alt text, aspect-ratio
9. **Animation & Transitions** — Smooth, consistent duration, enter/exit paired, reduced motion
10. **Accessibility** — Keyboard access, focus trap, ARIA labels, semantic headings

## MANDATORY: Anti-Slop Gate (Automatic)

This gate runs AUTOMATICALLY on every verification. It cannot be skipped.

Reference the `anti-slop-design` skill's Concrete Anti-Slop Checklist. Score ALL 25 items across the 5 categories:

### Colors (/5)
- [ ] Primary color is NOT default blue, indigo, or violet (unless archetype requires it)
- [ ] At least one unexpected color accent exists
- [ ] Gradients are subtle and purposeful, not decorative filler
- [ ] Background has depth (not flat white/black — subtle tints/noise per DNA)
- [ ] Dark mode is hand-tuned (not just `dark:` inverse)

### Typography (/5)
- [ ] Display font matches Design DNA (NOT Inter/Roboto/system)
- [ ] At least 3 different font weights visible
- [ ] Letter-spacing is tuned per DNA type scale
- [ ] Line heights match DNA type scale (tight on headings, relaxed on body)
- [ ] At least one typographic surprise per DNA specification

### Layout (/5)
- [ ] Something breaks the grid (overlap, asymmetric, full-bleed)
- [ ] Spacing varies per DNA spacing scale (not uniform gap-4)
- [ ] Visual hierarchy has at least 3 distinct levels
- [ ] Negative space is used intentionally per DNA
- [ ] At least one element has unexpected positioning or sizing

### Depth & Polish (/5)
- [ ] Shadows match DNA shadow system (layered, not just shadow-md)
- [ ] Borders match DNA border system (subtle opacity)
- [ ] At least one glass/frost/blur element if DNA specifies it
- [ ] Border-radius matches DNA radius system (not default rounded-lg everywhere)
- [ ] Micro-details present per DNA texture specification

### Motion (/5)
- [ ] Elements enter with staggered timing per DNA motion language
- [ ] Hover states are distinct and intentional
- [ ] At least one scroll-triggered animation
- [ ] Easing matches DNA easing library (not all linear or ease)
- [ ] Motion has direction/story per DNA enter direction rules

### Scoring & Enforcement

**Score: [X] / 25**

| Score | Verdict | Action |
|-------|---------|--------|
| 20-25 | **Premium** | PASSED |
| 18-19 | **Good** | PASSED (with minor notes) |
| 15-17 | **Template-tier** | **AUTOMATIC FAIL** — must iterate |
| Below 15 | **Slop** | **AUTOMATIC FAIL** — major rework needed |

**Score < 18 = AUTOMATIC FAIL.** GAP-FIX.md plans are generated for every failed checklist item. The user does NOT need to approve this — it's a quality gate.

## Design DNA Compliance Check

Compare the built output against `.planning/modulo/DESIGN-DNA.md`:

- [ ] Color tokens used correctly (no stray hex values outside DNA palette)
- [ ] Fonts match DNA specification exactly
- [ ] Spacing follows DNA scale
- [ ] Signature element is present AND prominent
- [ ] Motion language matches DNA (easing, timing, direction)
- [ ] Archetype forbidden patterns are NOT present
- [ ] Section layout diversity rule is followed (no adjacent duplicates)

**Missing signature element = automatic -3 points from anti-slop score.**
**Archetype forbidden pattern present = automatic -5 points.**

## Quality Standards Check

Reference the `quality-standards` skill:

**Premium Indicators (must have for 90k):**
- Custom color palette from Design DNA (not Tailwind defaults)
- Distinctive typography pairing from Design DNA
- Micro-interactions on interactive elements
- Scroll-triggered animations with choreography per DNA motion language
- Pixel-perfect spacing matching DNA spacing scale
- Depth through DNA-defined shadow/glass/layer system
- At least one "wow" moment per section
- Signature element prominently featured

**Disqualifiers (automatic fail regardless of score):**
- ANY archetype forbidden pattern present
- Inter/Roboto as display font (unless archetype requires it)
- Cookie-cutter card grids with no variation
- No hover states on interactive elements
- Missing responsive behavior
- Accessibility violations
- Missing Design DNA signature element

## Produce Verification Report

For each section, write a report:

```markdown
## Section: XX-name

### Level 1: Existence — PASS / FAIL
- [x] src/components/sections/hero.tsx exists and non-empty
- [ ] [any missing artifacts]

### Level 2: Substantive — PASS / FAIL
- [x] "Section renders with all specified elements" — confirmed
- [ ] "Responsive at 375/768/1024/1440px" — missing tablet breakpoint
- [truth failures listed]

### Level 3: Wired — PASS / FAIL
- [x] Imported in main page
- [x] Uses shared theme tokens
- [ ] [any wiring issues]

### Visual Audit Issues
[CRITICAL] Spacing: Hero section has no mobile padding — content touches screen edge
  LOCATION: components/sections/hero.tsx:24
  FIX: Add px-4 sm:px-6 to the container

[MAJOR] Interactive: No hover state on CTA button
  LOCATION: components/sections/hero.tsx:45
  FIX: Add hover:shadow-lg hover:scale-[1.02] transition-all

### Section Verdict: passed / gaps_found / human_needed
```

## Overall Verdict

Combine all section verdicts:

- **`passed`** — All sections pass all 3 levels + no critical/major visual audit issues
- **`gaps_found`** — Some sections have failures. Create GAP-FIX.md plans.
- **`human_needed`** — Issues that require human judgment (design decisions, content decisions)

## Gap Closure: Create GAP-FIX.md

For each section with `gaps_found`, create `.planning/modulo/sections/XX-{name}/GAP-FIX.md`:

```yaml
---
section: XX-name
type: gap-fix
source: verification
severity: [critical / major / minor]
files_modified: [specific files to fix]
autonomous: true
must_haves:
  truths: ["Gap X is closed", "No regression"]
  artifacts: [files to modify]
---
```

```markdown
<tasks>
- [auto] Fix: [specific issue from verification report]
- [auto] Fix: [another issue]
- [auto] Verify no regression in adjacent sections
</tasks>
```

## Final Output

Present the full verification report to the user.

If `gaps_found`:
```
Verification found [N] gaps across [M] sections.
GAP-FIX.md plans have been created.

To fix: Run `/modulo:iterate` to execute the gap fix plans.
To re-verify after fixes: Run `/modulo:verify` again.
```

If `passed`:
```
All sections passed three-level verification + visual audit.
Quality tier: $[X]k based on quality-standards assessment.

The implementation meets the 90k quality bar.
```

If `human_needed`:
```
[N] issues require your input:
1. [description of decision needed]
2. [description of decision needed]

Please review and provide direction, then run `/modulo:verify` again.
```

## Rules

1. **Goal-backward, not task-forward.** Check if goals were achieved, not if tasks were completed.
2. **Be ruthless.** Every pixel matters at the 90k bar.
3. **Be specific in GAP-FIX plans.** Include exact file:line and exact fix instructions.
4. **Check anti-slop.** Generic/template-looking design is a quality failure.
5. **Reference the PLAN.md.** Compare against what was planned, not personal preferences.
6. **Always produce GAP-FIX.md for gaps.** Don't just report — create actionable fix plans.
7. **Update STATE.md** with verification results and verdict.
