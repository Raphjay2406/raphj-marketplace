---
name: interactive-refinement
category: core
description: "Click-to-annotate refinement loop — companion captures element selector + user intent, queues a structured patch request for /gen:iterate to consume."
triggers: ["iterate from queue", "refinement queue", "companion refinement", "click-to-fix", "interactive refinement"]
used_by: ["visual-companion", "iterate", "builder"]
version: "3.0.0"
---

## Layer 1: Decision Guidance

### Why Interactive Refinement

The iteration loop between "see it on localhost" and "change the code" today requires the user to describe the section, location, and change in text. That loss-of-context is where iterate cycles burn time.

Interactive refinement closes the loop: user clicks the element, types the intent, companion queues a structured patch with stable selector + bbox + screenshot. `/gen:iterate --from-queue` consumes the queue, pre-filled with all context.

### When to Use

- User has a build running on localhost with `/gen:companion` open.
- User spots a specific element to adjust and wants surgical change, not full redesign.
- Micro-adjustments (move, resize, restyle, re-copy) — not architectural changes.

### When NOT to Use

- Architectural changes ("rethink the hero") — route to `/gen:iterate` brainstorm flow directly.
- Content changes across many sections — batch via `/gen:iterate`.
- Accessibility or a11y violations — route to quality-reviewer for audit-first.

### Decision Tree

```
User sees issue on companion iframe?
├─ architectural? → /gen:iterate (normal)
└─ surgical     → click element
                → companion captures selector + bbox + screenshot
                → user types intent
                → queue JSON written
                → user runs /gen:iterate --from-queue
                → Claude Code consumes queue, pre-fills proposal
                → normal brainstorm-first flow with context baked in
```

## Layer 2: Technical Spec

### Stable selectors

Every JSX component written by builders must include `data-genorah-id="{section}.{slot}"` on its root element. Example:

```tsx
<section data-genorah-id="hero.root">
  <h1 data-genorah-id="hero.headline">...</h1>
  <button data-genorah-id="hero.cta-primary">...</button>
</section>
```

Enforced by `component-consistency` skill. `data-genorah-id` survives rebuilds and Tailwind class churn; `nth-child` or class-based selectors do not.

### Capture flow

Companion injects a capture script into the iframe:
1. On click, `e.target.closest('[data-genorah-id]')` → freeze target, show annotation popover.
2. Popover shows: the element outline, target ID, current screenshot, text input for intent.
3. On submit: POST to companion server `/api/refinement-queue` with the payload.

### Queue JSON schema

```json
{
  "id": "2026-04-12T10:30:00Z-hero.cta-primary",
  "section": "hero",
  "selector": "[data-genorah-id='hero.cta-primary']",
  "bbox": {"x": 420, "y": 260, "w": 180, "h": 48},
  "viewport": {"w": 1280, "h": 800},
  "intent": "move right 20px, add 0 4px 12px rgba(0,0,0,0.2) shadow",
  "screenshot": ".planning/genorah/refinement-queue/hero-cta-primary-2026-04-12.png",
  "stitch_mockup_ref": null,
  "status": "pending"
}
```

Written to `.planning/genorah/refinement-queue/{ts}-{section}-{slot}.json`.

### Queue consumption

`/gen:iterate --from-queue` workflow:
1. Enumerate `refinement-queue/*.json` with `status: pending`.
2. Group by section.
3. For each group: read all intents + selectors → form a single iterate brief per section.
4. Invoke normal `/gen:iterate` brainstorm flow with the brief pre-filled as the user request.
5. After user approves proposal, builder executes with direct selector context — surgical edits, not full rewrite.
6. On completion, move queue entries to `refinement-queue/archive/` with outcome.

### REFINEMENT-LOG.md

Every interactive refinement appends to `.planning/genorah/REFINEMENT-LOG.md`:

```markdown
## 2026-04-12T10:30 — hero.cta-primary
Intent: move right 20px, add shadow
Files changed: Hero.tsx (line 47)
Outcome: applied, quality-reviewer re-ran, score unchanged (198)
```

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| intent_length_chars | 5 | 500 | chars | HARD |
| queue_size_max | — | 50 | items | SOFT warn >20 |
| selector_required | `data-genorah-id` | — | attr | HARD |
| stale_queue_age_days | — | 7 | days | auto-archive |

## Layer 3: Integration Context

- **Visual-companion agent** — renders iframe, injects capture script, serves annotation popover.
- **`/gen:iterate --from-queue`** — consumes queue, pre-fills brainstorm.
- **Component-consistency skill** — enforces `data-genorah-id` discipline on builders.
- **Baked-in-defaults skill** — lists `data-genorah-id` as a v3.0 default.

## Layer 4: Anti-Patterns

- ❌ **Letting selectors rely on nth-child or class names** — rebuilds will break them. `data-genorah-id` only.
- ❌ **Accepting vague intents** (`"make it pop"`) — require a concrete action verb + adjective. Iterate agent rejects and asks clarifying question.
- ❌ **Auto-applying patches without user review** — even surgical. Always go through brainstorm-first iterate flow.
- ❌ **Queuing architectural changes** — those belong in normal iterate; forcing them through queue inflates brief, reduces quality.
- ❌ **Letting queue entries grow stale** — 7-day auto-archive; older intents are probably outdated.
- ❌ **Skipping the stable-selector enforcement** — if builders don't add `data-genorah-id`, companion can't annotate reliably. Make it non-negotiable in component-consistency.
