---
name: cross-browser-rendering
description: Playwright matrix — Chromium + Firefox + WebKit (Safari) + mobile Safari + Android Chrome. Catches browser-specific bugs (Safari backdrop-filter, Firefox grid edge cases, etc.).
tier: domain
triggers: cross-browser, browser-matrix, safari-webkit, firefox-test
version: 0.1.0
---

# Cross-Browser Rendering

Playwright supports 3 engines + mobile emulation. v3.18 makes this standard.

## Layer 1 — Matrix

```ts
// playwright.config.ts
export default {
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 15'] } },
  ],
};
```

## Layer 2 — Engine-specific traps

| Feature | Safari/WebKit | Firefox | Chromium |
|---|---|---|---|
| backdrop-filter | blur works only on direct elements | Full support | Full support |
| CSS subgrid | Full | Full | Full (was last) |
| Dialog element | 15.4+ | 98+ | All |
| Container queries | 16+ | 110+ | All |
| View Transitions | 18.2+ (cross-doc) | Still flagged | 111+ |
| :has() | 15.4+ | 121+ | All |
| color-mix() | 16.2+ | 113+ | 111+ |
| Speculation Rules | No | No | Chrome 110+ |

Feature-detect + progressive enhancement.

## Layer 3 — Parallel execution

```bash
npx playwright test --project=chromium --project=firefox --project=webkit
```

CI runs all in parallel workers; full matrix in ~3-5 min.

## Layer 4 — Expected engine differences

Font rendering differs across engines (Core Text vs Cairo vs Skia). Visual regression with higher threshold (5%) vs same-engine (2%).

## Layer 5 — Integration

- `/gen:tests cross-browser` extends visual-regression with full matrix
- Ship-check Tier 2 includes cross-browser check
- Ledger: `cross-browser-regression`

## Layer 6 — Anti-patterns

- ❌ Chromium-only testing — 20% of users on other engines
- ❌ No feature detection — fails hard in Safari
- ❌ Same threshold as same-engine — false failures
- ❌ WebKit only = macOS Safari — WebView (iOS) differs slightly
