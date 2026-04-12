---
name: "interaction-replay"
description: "Inventory + replay of motion and interaction from ingested sites. Playwright trace → Genorah motion spec mapping (enter/scroll/hover/click states). Preserves timing, easing, stagger."
tier: "domain"
triggers: "interaction replay, motion replay, ingest motion, trace to motion, preserve animations"
version: "3.22.0"
---

## Layer 1: Decision Guidance

### When to Use

- Stage 5b of ingestion — after component-mapping, before scaffold.
- Target site has non-trivial motion (scroll-triggered reveals, hover morphs, entrance choreography).

### When NOT to Use

- Static page with no JS motion — skip; rely on `reduced-motion` baseline.
- Heavy WebGL/three.js scenes — inventory only (note presence), don't attempt replay; feed `3d-scene-composer` instead.

## Layer 2: Flow

1. During `crawl-executor`, capture Playwright trace via `page.context().tracing.start({ screenshots: true, snapshots: true })`.
2. Post-process trace:
   - Extract `requestAnimationFrame` cadence, `IntersectionObserver` callbacks, scroll listeners.
   - Detect library (GSAP / Framer Motion / Motion One / CSS @keyframes) via bundle signatures.
   - Per element: sample transform/opacity over time; fit to easing family (linear / cubic-bezier / spring).
3. Emit `MOTION-INVENTORY.md`:
   ```yaml
   - selector: section.hero h1
     trigger: scroll-enter
     property: transform+opacity
     duration_ms: 800
     easing: cubic-bezier(0.16, 1, 0.3, 1)
     stagger: null
     confidence: 0.82
   ```
4. Propose Genorah motion spec per beat (HOOK enter → framer `whileInView`, etc.).

## Layer 3: Integration Context

- Uses `capture.playwright-trace` ledger entry (points to zip in `captured/`).
- Feeds `animation-specialist` agent when `/gen:build` runs on ingested slug.
- Respects `prefers-reduced-motion` — proposed motion always has static fallback.

## Layer 4: Anti-Patterns

- Blindly re-implementing every animation — noisy motion often came from a since-abandoned library; propose, don't auto-apply.
- Ignoring easing — users perceive easing before duration; fitting easing is the high-value step.
- Dropping stagger — sibling stagger is often the signature motion personality; preserve.
