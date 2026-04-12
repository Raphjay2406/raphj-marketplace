---
name: active-ux-adjustment
description: Behavioral-signal-driven live UX adjustments. Scroll-past-CTA promotes CTA to sticky, return-visitor skips intro, form-stuck expands help, bounce-risk reshuffles hero. All client-side; no tracking pipeline.
tier: domain
triggers: active-ux, behavioral-prediction, sticky-cta, return-visitor, bounce-risk, adaptive-ux
version: 0.1.0
---

# Active UX Adjustment

Integrates with `behavioral-prediction` skill. Every signal drives a specific UX response.

## Layer 1 — When to use

Landing pages + conversion-focused sections. Excess on content pages → feels manipulative.

## Layer 2 — Signal → response matrix

| Signal | Response | Latency |
|---|---|---|
| Scrolled past primary CTA 2x | Promote CTA to sticky bottom-right | 500ms after 2nd scroll past |
| Return visitor (cookie / localStorage) | Skip intro section, direct to product | On mount |
| Form abandonment (blur without submit) | Expand help text, highlight required fields | 800ms after blur |
| Bounce risk (back button hovered) | Exit-intent: "Before you go..." | Immediate |
| Mouse idle > 15s on pricing | Proactive tooltip with most popular tier | After 15s idle |
| Scroll halted on testimonials > 10s | Auto-expand case study detail | After 10s |

## Layer 3 — Implementation (client-only)

```ts
// Scroll past CTA 2x → sticky
let pastCtaCount = 0;
let ctaPassed = false;

window.addEventListener('scroll', () => {
  const cta = document.getElementById('primary-cta');
  if (!cta) return;
  const rect = cta.getBoundingClientRect();
  const isAbove = rect.bottom < 0;

  if (isAbove && !ctaPassed) {
    pastCtaCount++;
    ctaPassed = true;
    if (pastCtaCount >= 2) {
      document.getElementById('sticky-cta')?.classList.add('visible');
    }
  } else if (!isAbove) {
    ctaPassed = false;
  }
}, { passive: true });
```

```ts
// Return visitor detection
const isReturn = localStorage.getItem('visited_before');
if (isReturn) {
  document.getElementById('intro')?.remove();
  document.getElementById('product')?.scrollIntoView();
}
localStorage.setItem('visited_before', '1');
```

## Layer 4 — Guardrails

**Every adjustment surfaces reasoning:**

Tooltip / banner on adjusted element:
```
Showing sticky CTA because you scrolled past the main one [×]
```

User can dismiss; preference stored in localStorage.

**Respects prefers-reduced-motion:** adjustments snap rather than animate.

**Opt-out:** Settings page offers "Disable adaptive UX" toggle.

## Layer 5 — Archetype compatibility

| Archetype | Max adjustments per page |
|---|---|
| Neo-Corporate | 3 (conversion-optimized) |
| Editorial | 1 (content-first; respect attention) |
| Luxury | 0 (nothing scream-y) |
| Playful | 3 (adjustments match archetype energy) |
| Brutalist | 0 (anti-adjustment aesthetic) |

Enforced by conversion-gate skill.

## Layer 6 — Integration

- Extends behavioral-prediction skill signals
- Conversion-gate checks adjustments don't cross dark-pattern line
- Ledger: `ux-adjustment-fired` with type + subject
- Dashboard adjustments tab shows rate + user dismissal stats

## Layer 7 — Anti-patterns

- ❌ Exit-intent modal asking for email on EVERY visit — users dismiss forever, regression in conversion
- ❌ Proactive tooltip before 5s — feels invasive
- ❌ Hiding elements based on scroll — "where did that go" confusion
- ❌ Dark-pattern adjustments (fake scarcity, fake urgency) — trust erosion
- ❌ Without user-visible reasoning — users feel manipulated
