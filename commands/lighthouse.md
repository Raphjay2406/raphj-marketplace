# Lighthouse Performance Audit

Run a comprehensive performance audit using Lighthouse metrics and manual code analysis.

## Process

### Phase 1: Gather Context
1. Read `package.json` for framework and dependencies
2. Read `next.config.js` or `astro.config.mjs` for build configuration
3. Identify all pages/routes in the application
4. Check if a dev server is running

### Phase 2: Static Analysis
Spawn the `performance-auditor` agent to analyze:
- Image optimization (next/image usage, sizes, formats)
- Font loading strategy (display swap, preload, subsetting)
- JavaScript bundle size (dynamic imports, tree shaking)
- CSS optimization (unused styles, critical CSS)
- Third-party script impact
- Core Web Vitals readiness (LCP, CLS, INP patterns)

### Phase 3: Build Analysis
If possible, run the build and analyze:
```bash
npx next build  # or astro build
```
Examine:
- Route segment sizes from build output
- Shared chunk sizes
- Static vs dynamic routes
- ISR/SSG configuration

### Phase 4: Runtime Analysis
If Lighthouse CLI is available:
```bash
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json
```
Extract scores for:
- Performance (target: 90+)
- Accessibility (target: 90+)
- Best Practices (target: 90+)
- SEO (target: 90+)

### Phase 5: Synthesize Report

Write `LIGHTHOUSE-REPORT.md` in `.planning/modulo/audit/`:

```markdown
# Lighthouse Performance Report

## Scores
| Category | Score | Target | Status |
|----------|-------|--------|--------|
| Performance | X | 90 | Pass/Fail |
| Accessibility | X | 90 | Pass/Fail |
| Best Practices | X | 90 | Pass/Fail |
| SEO | X | 90 | Pass/Fail |

## Core Web Vitals
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| LCP | Xs | < 2.5s | Pass/Fail |
| CLS | X | < 0.1 | Pass/Fail |
| INP | Xms | < 200ms | Pass/Fail |

## Top Opportunities
1. ...

## Diagnostics
1. ...

## Action Items
- [ ] ...
```

### Phase 6: Fix Critical Issues
Use `/modulo:iterate` to fix the top 3 performance issues identified.

## Rules

- Run build analysis to get accurate bundle sizes
- Focus on Core Web Vitals (LCP, CLS, INP)
- Check both mobile and desktop performance
- Provide specific, actionable optimization recommendations
- Compare against industry benchmarks
- Note which optimizations have the highest impact
