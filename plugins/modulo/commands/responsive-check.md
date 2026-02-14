---
name: responsive-check
description: Verify all breakpoints systematically — check layout at 375, 768, 1024, and 1440px with detailed issue reports
user_facing: true
---

You are performing a **systematic responsive verification** of the project.

## Workflow

### Phase 1: Discover Pages
1. Read `package.json` to identify framework
2. Scan route files to build a list of all pages/routes
3. Read `.planning/modulo/MASTER-PLAN.md` or `STATE.md` for section list

### Phase 2: Spawn Responsive Tester
Spawn the `responsive-tester` agent with the page list.

The agent will check each page at these breakpoints:
| Breakpoint | Width | Label |
|-----------|-------|-------|
| Mobile | 375px | iPhone SE |
| Tablet | 768px | iPad Mini |
| Laptop | 1024px | Small Laptop |
| Desktop | 1440px | Full Desktop |

### Phase 3: Check Criteria
For each page at each breakpoint, verify:

**Layout**
- [ ] No horizontal overflow (no horizontal scrollbar)
- [ ] Content fills available width appropriately
- [ ] Grid collapses correctly (4-col → 2-col → 1-col)
- [ ] Sidebar collapses or becomes drawer on mobile

**Typography**
- [ ] Text is readable (min 16px body on mobile)
- [ ] Headings scale down appropriately
- [ ] No text truncation that hides meaning
- [ ] Line length stays within 45-75 characters

**Touch Targets**
- [ ] All clickable elements ≥ 44x44px on mobile
- [ ] Adequate spacing between touch targets (min 8px gap)
- [ ] No hover-only interactions without tap alternatives

**Navigation**
- [ ] Mobile nav is accessible (hamburger menu or bottom tabs)
- [ ] All navigation items are reachable on all sizes
- [ ] Sticky header doesn't consume >15% of mobile viewport

**Images & Media**
- [ ] Images scale to fit container
- [ ] No images overflow their containers
- [ ] Aspect ratios maintained
- [ ] Art direction applied where needed (different crops per breakpoint)

**Spacing**
- [ ] Padding scales appropriately (less on mobile)
- [ ] Section gaps consistent within each breakpoint
- [ ] No cramped or overly spacious areas

### Phase 4: Report
Create `RESPONSIVE-REPORT.md` in `.planning/modulo/audit/` with:

```markdown
# Responsive Verification Report

## Summary
- Pages checked: X
- Breakpoints tested: 375, 768, 1024, 1440px
- Issues found: X critical, X warnings
- Verdict: PASS / NEEDS_FIXES

## Issues by Page
### /page-name
| Breakpoint | Category | Issue | Severity |
|-----------|----------|-------|----------|
| 375px | Layout | Horizontal overflow on features grid | Critical |
| 768px | Touch | CTA button too small (32x32px) | Warning |

## Fix Recommendations
1. [Critical] Features grid: change to `grid-cols-1` below `md`
2. [Warning] CTA button: add `min-h-[44px] min-w-[44px]`
```

### Phase 5: Present to User
Show the summary with issue count and verdict. If issues found, ask if user wants to auto-fix.
