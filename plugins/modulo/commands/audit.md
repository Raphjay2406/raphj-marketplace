---
name: audit
description: Run a comprehensive site audit — performance, SEO, accessibility, and visual quality — producing a scored report with prioritized fix plans
user_facing: true
---

You are performing a **comprehensive site audit** using the Modulo framework's specialized agents.

## Workflow

### Phase 1: Gather Context
1. Read `package.json` to identify framework (Next.js or Astro) and dependencies
2. Identify the main pages/routes to audit
3. Read existing `.planning/modulo/STATE.md` if it exists

### Phase 2: Parallel Audit (spawn 4 agents)
Spawn these agents in parallel using the Task tool:

1. **`performance-auditor`** — Analyze Core Web Vitals, bundle size, image optimization, font loading, code splitting
2. **`seo-optimizer`** — Check meta tags, structured data, sitemaps, robots.txt, Open Graph, canonical URLs
3. **`accessibility-auditor`** — Verify WCAG compliance, keyboard navigation, ARIA attributes, color contrast, focus management
4. **`quality-reviewer`** — Run visual audit (spacing, alignment, color consistency, responsive, typography)

Each agent writes its findings to `.planning/modulo/audit/`:
- `PERFORMANCE-REPORT.md`
- `SEO-REPORT.md`
- `ACCESSIBILITY-REPORT.md`
- `VISUAL-REPORT.md`

### Phase 3: Synthesize
1. Read all 4 reports
2. Create unified `AUDIT-REPORT.md` with:
   - **Score per category** (0-100): Performance, SEO, Accessibility, Visual Quality
   - **Overall score** (weighted average: Perf 25%, SEO 25%, A11y 25%, Visual 25%)
   - **Critical issues** (must fix — blocking, broken, or failing)
   - **Warnings** (should fix — suboptimal but functional)
   - **Suggestions** (nice to have — polish improvements)
3. Create `FIX-PLAN.md` with prioritized fix tasks:
   - Priority 1: Critical issues (score < 50 in any category)
   - Priority 2: Warnings across all categories
   - Priority 3: Polish suggestions
4. Present the report summary to the user

### Phase 4: Execute Fixes (if user approves)
- Run `/modulo:iterate` with the FIX-PLAN.md
- Re-audit changed areas to verify fixes

## Output Structure
```
.planning/modulo/audit/
├── AUDIT-REPORT.md         # Unified scored report
├── FIX-PLAN.md             # Prioritized fix tasks
├── PERFORMANCE-REPORT.md   # Performance agent output
├── SEO-REPORT.md           # SEO agent output
├── ACCESSIBILITY-REPORT.md # Accessibility agent output
└── VISUAL-REPORT.md        # Visual quality agent output
```

## Score Rating
- 90-100: Excellent (production-ready)
- 70-89: Good (minor improvements needed)
- 50-69: Fair (significant improvements needed)
- 0-49: Poor (critical issues must be addressed)
