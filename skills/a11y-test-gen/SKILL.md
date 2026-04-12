---
name: a11y-test-gen
description: Axe + Playwright automated a11y suite. Every route tested for serious/critical violations. Color-contrast + ARIA + heading hierarchy + landmark + form-label coverage.
tier: domain
triggers: a11y-tests, axe-playwright, accessibility-testing, wcag-tests
version: 0.1.0
---

# A11y Test Generation

## Layer 1 — Axe + Playwright

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('a11y coverage', () => {
  for (const path of ['/', '/pricing', '/about', '/contact']) {
    test(`${path} has no serious/critical violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
        .analyze();

      const serious = results.violations.filter(v => ['serious', 'critical'].includes(v.impact));
      expect(serious).toEqual([]);
    });
  }
});
```

## Layer 2 — Coverage

Per route:
- Color contrast (WCAG 2.2 AA: 4.5:1 normal / 3:1 large)
- ARIA roles + properties
- Heading hierarchy (no skip)
- Landmark presence (main, nav, footer)
- Form label associations
- Keyboard reachability (overlap with keyboard-task-completion)
- Image alt text
- Link text (not "click here")

## Layer 3 — Rule tuning

Some rules require judgment:

```ts
new AxeBuilder({ page })
  .disableRules(['color-contrast'])  // if handling custom
  .withRules(['section508', 'best-practice']);
```

Document disabled rules + rationale in `tests/a11y/README.md`.

## Layer 4 — Ignore specific violations

For third-party iframes out of our control:

```ts
.exclude('iframe[src*="stripe"]')
.exclude('.intercom-container')
```

## Layer 5 — Integration

- `/gen:tests a11y` generates suite
- CI runs per PR; violation = block merge
- Chains with UX sub-gates (ux-heuristics + interaction-fidelity)
- Ledger: `a11y-test-failed`

## Layer 6 — Anti-patterns

- ❌ Disabling a11y rule to make test pass — fix the violation
- ❌ No minor/moderate tracking — still a11y debt
- ❌ Excluding "tricky" sections — biggest offenders ship
- ❌ Running only on landing page — deep routes untested
