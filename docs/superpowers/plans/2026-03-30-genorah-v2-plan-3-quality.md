# Plan 3: Quality & Design Intelligence

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the UX Intelligence skill (12 enforceable domains), upgrade the quality gate reference, define baked-in defaults templates, and establish component consistency rules.

**Architecture:** New and enhanced skill files in `skills/` using the 4-layer format. These skills serve as reference knowledge for agents (especially quality-reviewer, planner, and builders).

**Tech Stack:** Markdown with YAML frontmatter, 4-layer skill format

**Spec:** `docs/superpowers/specs/2026-03-30-genorah-v2-design.md` Sections 8-11

**Depends on:** Plan 1 (Foundation)

---

## File Map

### Files to Create
- `skills/ux-intelligence/SKILL.md` -- 12 design domains (~1200 lines)
- `skills/quality-gate-v2/SKILL.md` -- 72-point reference (standalone, complements quality-reviewer agent)
- `skills/baked-in-defaults/SKILL.md` -- motion/responsive/compat templates for planner
- `skills/component-consistency/SKILL.md` -- registry enforcement rules

### Files to Enhance
- `skills/anti-slop-gate/SKILL.md` -- update to reference 72-point system
- `skills/awwwards-scoring/SKILL.md` -- update tiers
- `skills/responsive-design/SKILL.md` -- add 4-breakpoint mandate, container queries priority
- `skills/cinematic-motion/SKILL.md` -- add beat-to-motion-tier mapping
- `skills/performance-animation/SKILL.md` -- add CWV budgets
- `skills/accessibility/SKILL.md` -- add "designed focus" requirement, reduced motion alternative

---

### Task 1: Create ux-intelligence skill

**Files:**
- Create: `skills/ux-intelligence/SKILL.md`

- [ ] **Step 1: Write the 12-domain UX Intelligence skill**

Frontmatter:
```yaml
---
name: "ux-intelligence"
description: "12 enforceable design intelligence domains covering proportion, color science, typography, micro-interactions, depth, conversion psychology, responsive craft, accessibility, content design, motion narrative, visual consistency, and cultural intelligence"
tier: "core"
triggers: "design review, quality check, UI audit, component review"
version: "2.0.0"
---
```

Layer 1 (Decision Guidance): When to apply each domain, decision tree for priority

Layer 2 (Award-Winning Examples): Per-domain constraint tables with Parameter/Min/Max/Unit/Enforcement. Copy-paste enforcement patterns.

12 domains with full content from spec Section 8:
1. Visual Proportion & Mathematical Harmony (modular scale, golden ratio, optical alignment, rhythm, viewport proportions)
2. Color Science (OKLCH, 60-30-10, contrast ladder, temperature consistency, chromatic depth, dark mode independence)
3. Typography as Design System (hierarchy contrast, measure, leading, tracking, orphans, weight pairing, numeric typography)
4. Micro-Interaction Craft (feedback states, choreography, easing, duration, cursors, scroll feedback, loading states)
5. Spatial Depth & Materiality (shadow system, light source, surface hierarchy, blur, border discipline, texture)
6. Conversion Psychology (visual hierarchy, Hick's law, Fitts's law, social proof, scarcity, disclosure, scan patterns)
7. Responsive Craft (container queries, touch targets, thumb zone, content reflow, font floors, tap spacing)
8. Accessibility as Design (focus indicators, reduced motion, color independence, heading hierarchy, ARIA minimalism, screen reader narrative)
9. Content Design Quality (microcopy, error messages, empty states, placeholder prevention, number formatting)
10. Motion Narrative (storytelling, spatial consistency, fire-once, purposeful motion, performance budget)
11. Visual Consistency (icon system, border radius, image treatment, component spacing, hover effects)
12. Cultural & Contextual Intelligence (language layout, cultural colors, localization, legal compliance)

Layer 3 (Integration): Maps domains to quality gate categories, archetype variants, pipeline stages

Layer 4 (Anti-Patterns): 3-5 anti-patterns per domain with before/after

- [ ] **Step 2: Verify all 12 domains present**
```bash
grep -c "### Domain" skills/ux-intelligence/SKILL.md
```
Expected: 12

- [ ] **Step 3: Commit**
```bash
git add skills/ux-intelligence/SKILL.md
git commit -m "feat: add ux-intelligence skill with 12 enforceable design domains"
```

---

### Task 2: Create quality-gate-v2 skill

**Files:**
- Create: `skills/quality-gate-v2/SKILL.md`

- [ ] **Step 1: Write the 72-point quality gate reference**

Standalone skill that documents the full scoring system for reference by any agent:
- 12 categories x 6 criteria (full criteria list per category)
- Scoring scale (0-3 per criterion)
- Category weights
- Named tiers (Reject through SOTM-Ready)
- Complete penalty table
- Hard gates (motion, responsive, compat, registry)
- 3-tier enforcement model (build-time, post-build, visual verification)
- Scoring example walkthrough

This complements the quality-reviewer agent (which executes the gate) by being a referenceable skill.

- [ ] **Step 2: Commit**
```bash
git add skills/quality-gate-v2/SKILL.md
git commit -m "feat: add quality-gate-v2 skill (72-point reference)"
```

---

### Task 3: Create baked-in-defaults skill

**Files:**
- Create: `skills/baked-in-defaults/SKILL.md`

- [ ] **Step 1: Write templates for planner**

This skill provides the planner agent with templates for the mandatory PLAN.md blocks:

**Motion block template:**
- Per-beat motion tier mapping (Hook=Heavy through Close=Medium)
- Per-archetype motion personality (Brutalist=instant, Ethereal=floating, etc.)
- Template YAML structure for motion block
- Cross-reference: beat x archetype -> specific entrance/interaction combinations

**Responsive block template:**
- Per-section-type default layouts (hero, features, testimonials, pricing, etc.)
- 4-breakpoint template YAML structure
- Content priority rules per breakpoint
- Hidden elements per breakpoint guidelines

**Compatibility block template:**
- Per-tier feature availability matrix
- Required fallback patterns per tier
- Template YAML structure

**prefers-reduced-motion template:**
- Alternative design patterns (not just disable)
- Per-archetype reduced motion style

- [ ] **Step 2: Commit**
```bash
git add skills/baked-in-defaults/SKILL.md
git commit -m "feat: add baked-in-defaults skill (motion/responsive/compat templates)"
```

---

### Task 4: Create component-consistency skill

**Files:**
- Create: `skills/component-consistency/SKILL.md`

- [ ] **Step 1: Write component registry enforcement rules**

Contents:
- DESIGN-SYSTEM.md format specification
- Registered component types (card, button, heading, badge, input, avatar, nav-item)
- Per-type variant structure (which properties are registered)
- Golden rule: same type = same variant dimensions everywhere
- CSS enforcement patterns (equal-height cards, flex: 1, line-clamp, aspect-ratio)
- Cross-section audit process
- CONSISTENCY-FIX.md format
- Component proposal process (new variants in SUMMARY.md)

- [ ] **Step 2: Commit**
```bash
git add skills/component-consistency/SKILL.md
git commit -m "feat: add component-consistency skill (registry enforcement)"
```

---

### Task 5: Update anti-slop-gate skill

**Files:**
- Modify: `skills/anti-slop-gate/SKILL.md`

- [ ] **Step 1: Add v2.0 reference**

Add a section at the top noting:
- v2.0 uses the 72-point quality gate (see quality-gate-v2 skill)
- The original 35-point anti-slop gate is preserved as a quick-check subset
- Full scoring now includes 12 categories (was 7)
- New penalty items for component consistency, animation absence, responsive absence
- Named tiers updated (Reject/Baseline/Strong/SOTD-Ready/Honoree/SOTM-Ready)

- [ ] **Step 2: Commit**
```bash
git add skills/anti-slop-gate/SKILL.md
git commit -m "feat: update anti-slop-gate to reference 72-point v2 system"
```

---

### Task 6: Update awwwards-scoring skill

**Files:**
- Modify: `skills/awwwards-scoring/SKILL.md`

- [ ] **Step 1: Update tiers and integration notes**

- Update tier names to match v2 (SOTM-Ready added)
- Add note that Awwwards 4-axis scoring is now embedded within the 72-point gate
- Add companion dashboard screen format for Awwwards projection

- [ ] **Step 2: Commit**
```bash
git add skills/awwwards-scoring/SKILL.md
git commit -m "feat: update awwwards-scoring for v2 tier integration"
```

---

### Task 7: Update responsive-design skill

**Files:**
- Modify: `skills/responsive-design/SKILL.md`

- [ ] **Step 1: Add v2 mandates**

- 4-breakpoint mandate (375, 768, 1024, 1440) + 2 edge cases (375x667, 2560x1440)
- Container queries priority over media queries
- Content reflow (not just resize) requirement
- Thumb zone optimization for mobile
- Font size floor (16px minimum body)
- Tap spacing (8px gap)
- Link to baked-in-defaults skill for responsive block templates

- [ ] **Step 2: Commit**
```bash
git add skills/responsive-design/SKILL.md
git commit -m "feat: update responsive-design with 4-breakpoint mandate and container queries"
```

---

### Task 8: Update cinematic-motion skill

**Files:**
- Modify: `skills/cinematic-motion/SKILL.md`

- [ ] **Step 1: Add beat-to-motion mapping**

Add the motion intensity tier table:
- Hook=Heavy, Tease=Medium, Reveal=Heavy, Build=Medium, Peak=Maximum, Breathe=Minimal, Tension=Heavy, Proof=Light, Pivot=Medium, Close=Medium
- Per-tier description of what animation types are expected
- Cross-reference with archetype motion personality
- Link to baked-in-defaults skill for motion block templates

- [ ] **Step 2: Commit**
```bash
git add skills/cinematic-motion/SKILL.md
git commit -m "feat: update cinematic-motion with beat-to-motion tier mapping"
```

---

### Task 9: Update performance and accessibility skills

**Files:**
- Modify: `skills/performance-animation/SKILL.md`
- Modify: `skills/accessibility/SKILL.md`

- [ ] **Step 1: Add CWV budgets to performance-animation**

LCP < 2.5s, FID/INP < 200ms, CLS < 0.1. Max 3 concurrent animations in viewport. Bundle < 200KB per route.

- [ ] **Step 2: Add designed focus and reduced motion to accessibility**

Browser default focus rings = flagged. prefers-reduced-motion must provide alternative design, not just disable. Color never sole indicator. ARIA as last resort.

- [ ] **Step 3: Commit**
```bash
git add skills/performance-animation/SKILL.md skills/accessibility/SKILL.md
git commit -m "feat: update performance and accessibility skills for v2 standards"
```

---

### Task 10: Validation pass

- [ ] **Step 1: Verify all new skills have correct frontmatter**
```bash
for f in skills/ux-intelligence/SKILL.md skills/quality-gate-v2/SKILL.md skills/baked-in-defaults/SKILL.md skills/component-consistency/SKILL.md; do
  echo "=== $f ==="
  head -7 "$f"
done
```
Expected: Each has `---` delimited frontmatter with name, description, tier, version

- [ ] **Step 2: Verify cross-references**
```bash
grep -l "quality-gate-v2\|ux-intelligence\|baked-in-defaults\|component-consistency" skills/*/SKILL.md agents/pipeline/*.md
```
Expected: Multiple files reference the new skills

- [ ] **Step 3: Commit**
```bash
git add -A
git commit -m "chore: plan 3 complete -- quality and design intelligence validated"
```

---

## Plan 3 Summary

10 tasks delivering:
- UX Intelligence skill (12 domains, ~1200 lines)
- Quality Gate v2 skill (72-point reference)
- Baked-In Defaults skill (motion/responsive/compat templates)
- Component Consistency skill (registry enforcement)
- 5 existing skills updated for v2 standards

**Next:** Plan 5 (Release) after all parallel plans complete
