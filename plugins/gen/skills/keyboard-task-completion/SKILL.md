---
name: keyboard-task-completion
description: Full keyboard testing — not just "can Tab reach it" but "can primary task be completed via keyboard alone". Checks focus trap, escape path, shortcut coverage.
tier: core
triggers: keyboard-task, keyboard-nav, tab-order, escape-route, keyboard-only
version: 0.1.0
---

# Keyboard Task Completion

Goes beyond interaction-fidelity-gate I3 (Tab reaches every action) to verify task actually completes via keyboard alone.

## Layer 1 — Test protocol

For each primary user journey in PLAN.md:

1. Start at page top
2. Tab through until reach first action
3. Activate via Enter/Space
4. Continue without mouse/touch
5. Reach task completion (form submit, transaction done, etc.)

Playwright automation:

```ts
await page.keyboard.press('Tab');  // move focus
await page.keyboard.press('Enter');  // activate
// ... follow journey
```

## Layer 2 — Failure modes

- **Focus trap**: Modal opens, can't Tab out without closing. Fix: wrap with focus-trap-react or manage tabindex.
- **Hidden focusable**: Element `tabindex="-1"` but should be reachable.
- **Missing skip-link**: Slow to reach main content on repeat visits.
- **Broken Enter-submit**: Form doesn't submit via Enter on focused input.
- **Drag-only**: Can't drag via keyboard (needs tap-to-select alternative).
- **Modal trap without close**: Escape doesn't close.
- **Link masquerading as button**: `<a>` used where `<button>` should be; keyboard activation inconsistent.

## Layer 3 — Shortcut coverage

Power-user shortcuts:
- `?` shows shortcut help
- `g h` go home
- `/` focus search
- `Escape` cancel / close

## Layer 4 — Integration

- UX interaction-fidelity-gate I3 is prerequisite; this is superset
- `/gen:ux-audit --keyboard-tasks` runs task-completion journeys
- Synthetic persona P5 (Screen-reader) tests complementary landmark nav
- Ledger: `keyboard-task-failed`

## Layer 5 — Anti-patterns

- ❌ Focus trap in modal without close affordance
- ❌ Dropdown that closes on blur before user can arrow-down to select
- ❌ Shortcut conflict with browser (Cmd+S = save page, don't rebind)
- ❌ No visible focus — keyboard user lost
- ❌ `tabindex > 0` — breaks natural tab order
