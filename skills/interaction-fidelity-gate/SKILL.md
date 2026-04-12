---
name: interaction-fidelity-gate
description: Machine checks for touch targets, focus rings, keyboard nav, hover states, form affordances, and above-the-fold CTA presence. Scores 20 points in quality-gate-v3 Axis 2. All checks run via Playwright + DOM evaluation.
tier: core
triggers: interaction-fidelity, touch-targets, focus-ring, keyboard-nav, form-affordance, above-the-fold, quality-gate-v3
version: 0.1.0-provisional
---

# Interaction Fidelity Gate

20 points. 8 binary checks × 2.5pt each. Truncated to 2pt/check in report; 4 bonus points available when all 8 pass cleanly.

## Layer 1 — When to use

Part of Axis 2 (UX Integrity) in quality-gate-v3. Requires Playwright MCP for full measurement. Falls back to static analysis when Playwright unavailable (reports partial score with `mode: "static"`).

## Layer 2 — Machine checks

### I1. Touch targets ≥ 44×44 px on mobile (2pt)

- **PASS**: At 375×812, every `<button>`, `<a>`, `[role=button]`, `<input type!="hidden">` has computed `getBoundingClientRect()` width AND height ≥ 44px (or has explicit `min-h-11 min-w-11` / `py-3 px-4` compensating padding).
- **CHECK**: Playwright `browser_evaluate` iterates interactive elements, measures.

```js
Array.from(document.querySelectorAll('button,a,[role=button],input:not([type=hidden])')).filter(el => {
  const r = el.getBoundingClientRect();
  return r.width < 44 || r.height < 44;
});
```

### I2. Focus ring contrast ≥ 3:1 (2pt)

- **PASS**: Every interactive element has `:focus-visible` state with ring/outline contrast ≥ 3:1 against background.
- **CHECK**: Tab through page with Playwright; screenshot each focused element; extract ring color from computed style; compute ΔL against surrounding bg.

### I3. Keyboard reaches every action (2pt)

- **PASS**: `Tab` navigation from `<body>` reaches every `<button>`, `<a>`, `<input>`, `<select>`, `<textarea>` without trap.
- **CHECK**: Playwright sequentially presses Tab, records `document.activeElement.tagName` + `.textContent`. Compare to full interactive inventory. All reached → pass.

### I4. Hover ≠ default (2pt)

- **PASS**: Every interactive element shows visual delta on hover (color change, opacity shift, transform, shadow, underline). No dead hovers.
- **CHECK**: Playwright hovers each interactive; diffs screenshot ΔE > 2 or DOM computed style change.

### I5. Form autocomplete + inputmode (2pt)

- **PASS**: Every `<input>` has appropriate `autocomplete=` attribute (`email`, `name`, `tel`, `postal-code`, etc.) AND `inputmode=` where applicable (numeric, tel, email, decimal).
- **CHECK**: grep all `<input>` elements, check required attrs per type heuristic.

### I6. Escape closes modals (2pt)

- **PASS**: Every `role=dialog`, `role=alertdialog`, and modal component listens for ESC and closes.
- **CHECK**: Playwright opens each modal; presses ESC; confirms modal unmounts or `aria-hidden=true`.

### I7. Primary CTA above fold at 1280×720 (2pt)

- **PASS**: The section's primary CTA (identified by `data-primary-cta`, first `variant="primary"` button, or largest CTA by visual weight) has `top + height < 720` at 1280-wide viewport.
- **CHECK**: Playwright resize to 1280×720, navigate, eval `getBoundingClientRect()` on primary CTA.

### I8. Primary CTA above fold at 375×812 (2pt)

- Same as I7 but at mobile viewport. Mobile fold is smaller; CTA must still be visible without scroll on the hero section.
- **CHECK**: same protocol, different breakpoint.

## Layer 3 — Integration

- **Output**: `.planning/genorah/audit/interaction-fidelity/<section-id>.json`
- **Fallback**: When Playwright unavailable, run I1/I2/I4/I5 via static analysis (className regex + a11y snapshot); I3/I6/I7/I8 marked `mode: "skipped-no-playwright"` and don't count toward score (max becomes 10).
- **Ledger**: `{kind: "subgate-fired", subject: <section-id>, payload: {gate: "interaction-fidelity", score, fails: [], mode}}`.

## Layer 4 — Anti-patterns

- ❌ Relying on `hover:` pseudo-class without testing — some `hover:bg-primary/90` are visually indistinguishable (ΔE < 2).
- ❌ Using `placeholder=` as primary label — fails I5 AND H6 (recognition vs recall).
- ❌ Focus-within-only rings — fails I2 for keyboard users; must be focus-visible.
- ❌ Primary CTA in sticky header counting as "above fold" — specifically the section's CTA must be in the section's visible area.
