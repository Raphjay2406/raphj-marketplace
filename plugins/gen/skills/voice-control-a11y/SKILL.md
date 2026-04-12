---
name: voice-control-a11y
description: Voice control (Dragon, Voice Access, Voice Control on macOS/iOS) compatibility. Every interactive element has accessible name matching visible label.
tier: domain
triggers: voice-control, dragon, voice-access, accessible-name
version: 0.1.0
---

# Voice Control Compatibility

Voice control users say "click submit" or "click buy now" — the UI must have matching accessible names.

## Layer 1 — Rules

1. Every interactive element has an accessible name
2. Accessible name matches visible text (or contains it)
3. No duplicate accessible names on the same screen (Dragon needs disambiguation)
4. Icon-only buttons have `aria-label` matching semantic intent
5. Form labels use `<label>` or `aria-labelledby`

## Layer 2 — Validation

```ts
// In playwright test
const interactives = await page.$$('button, a, input, select, textarea, [role=button]');
for (const el of interactives) {
  const visible = await el.evaluate(e => e.textContent?.trim() || '');
  const accessible = await el.evaluate(e => {
    return e.getAttribute('aria-label')
        || e.getAttribute('aria-labelledby')
        || e.textContent?.trim()
        || '';
  });
  if (visible && !accessible.includes(visible)) {
    flag(`Mismatch: visible "${visible}" vs accessible "${accessible}"`);
  }
}
```

## Layer 3 — Common fails

| Pattern | Problem | Fix |
|---|---|---|
| `<button><svg /></button>` | No name | `<button aria-label="Close">` |
| `<button>✕</button>` | "✕" is the name; voice user says "close" | `<button aria-label="Close">✕</button>` |
| Multiple "Submit" buttons | Ambiguous | "Submit order", "Submit review", etc. |
| `<input placeholder="Email">` without `<label>` | Voice targets placeholder awkwardly | Add `<label>` |

## Layer 4 — Integration

- UX sub-gate heuristic H6 (recognition vs recall) partially overlaps
- `/gen:ux-audit --voice-control` adds this check
- Ledger: `voice-control-violation`

## Layer 5 — Anti-patterns

- ❌ Unique aria-labels differing from visible text — voice user confused
- ❌ Heavy Unicode-icon-only buttons — not voice-accessible
- ❌ Relying on `title` attribute — voice control doesn't use it
