---
name: e2e-test-gen
description: Generate Playwright E2E test files from PLAN.md user-journey map. One test per primary task; 3-breakpoint coverage; archetype-aware selectors.
tier: domain
triggers: e2e-tests, playwright-tests, test-generation, user-journey-tests
version: 0.1.0
---

# E2E Test Generation

Reads `PLAN.md` primary journeys → emits Playwright test files.

## Layer 1 — Input

```yaml
# PLAN.md journey block
primary_journeys:
  - name: signup
    steps:
      - visit /
      - find primary CTA "Start trial"
      - fill email: test@example.com
      - submit form
      - expect redirect to /onboarding
      - expect heading "Welcome"

  - name: purchase
    steps:
      - visit /products/starter-kit
      - click "Add to cart"
      - expect cart count 1
      - click checkout
      - fill address + payment (Stripe test card)
      - submit
      - expect order-confirmation page
```

## Layer 2 — Output

`tests/e2e/signup.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test.describe('Signup journey', () => {
  test('new user signup at desktop', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /start trial/i }).click();
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page).toHaveURL(/onboarding/);
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  });

  test('new user signup at mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    // Same flow, mobile-specific assertions if needed
  });

  test('new user signup at tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    // ...
  });
});
```

## Layer 3 — Selector strategy

Prefer role-based (`getByRole`, `getByLabel`) over CSS. Aligns with voice-control-a11y skill and breaks less on style changes.

Fallback: `data-testid` when role ambiguous.

## Layer 4 — Archetype-aware

Some archetypes have signature interactions:

- Kinetic: test scroll-driven state changes
- Gaming UI: test HUD state indicators
- Financial: test live data updates

Generator reads archetype + adds extra assertions.

## Layer 5 — Flaky test handling

```ts
test.describe.configure({ retries: 2, mode: 'serial' });
test.use({ video: 'retain-on-failure', screenshot: 'only-on-failure', trace: 'retain-on-failure' });
```

Quarantine flaky tests to `tests/e2e/quarantine/` after 3 consecutive failures in CI; flag for review.

## Layer 6 — Integration

- `/gen:tests e2e` generates all journey files from PLAN.md
- CI wiring via `.github/workflows/e2e.yml` (cross-browser matrix)
- Ledger: `e2e-test-generated`

## Layer 7 — Anti-patterns

- ❌ Selecting by class name — breaks on style refactor
- ❌ No retries — flaky tests become "mute the tests" culture
- ❌ Running only headed tests locally — CI diverges
- ❌ No artifacts on failure — can't debug
