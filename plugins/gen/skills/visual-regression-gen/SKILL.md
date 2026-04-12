---
name: visual-regression-gen
description: Visual regression baseline + diff via Playwright toMatchSnapshot. 4-breakpoint coverage per section. Expected-diff workflow with reviewer sign-off.
tier: domain
triggers: visual-regression, snapshot-testing, pixel-diff, playwright-snapshot
version: 0.1.0
---

# Visual Regression Testing

## Layer 1 — Baseline capture

```ts
test('hero visual baseline', async ({ page }) => {
  for (const [label, width] of [['mobile', 375], ['tablet', 768], ['desktop', 1280], ['wide', 1440]]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('#hero')).toHaveScreenshot(`hero-${label}.png`, {
      maxDiffPixelRatio: 0.02,  // 2% tolerance for subtle font rendering
    });
  }
});
```

First run: creates `tests/visual/__snapshots__/hero-mobile.png` etc.
Subsequent runs: diff against baseline.

## Layer 2 — Expected-diff workflow

When intentional visual change:

```bash
# Update baselines
npx playwright test --update-snapshots
```

Reviewer validates diff in `test-results/` visual-diff HTML report. Approved diffs committed.

`tests/visual/EXPECTED.md`:

```markdown
| Date | Section | Reason | Reviewer |
|---|---|---|---|
| 2026-04-12 | hero | Typography scale adjusted per archetype update | @reviewer |
```

## Layer 3 — Dynamic content masking

Mask elements that change between runs:

```ts
await expect(page).toHaveScreenshot({
  mask: [page.locator('[data-dynamic]')],
  maxDiffPixelRatio: 0.02,
});
```

## Layer 4 — CI integration

Visual tests run on preview deploys; results attached to PR comments via `playwright-report`.

PRs with new snapshots require explicit approval in review.

## Layer 5 — Integration

- `/gen:tests visual` generates baseline suite
- `/gen:regression` command uses these baselines
- Ledger: `visual-baseline-captured` / `visual-diff-detected`

## Layer 6 — Anti-patterns

- ❌ Visual tests on heavily-animated sections without stabilization — all fail
- ❌ No masking of dynamic elements (timestamps, random IDs) — noise
- ❌ 0% tolerance — font rendering, subpixel vary cross-OS
- ❌ Updating baselines without review — regression hidden as "update"
