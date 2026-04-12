---
name: animation-orchestration
tier: core
description: "Meta-skill: unified animation catalog referencing cinematic-motion + performance-animation + motion-health. Micro-interactions library, archetype easing curves (custom cubic-bezier per archetype), stagger patterns (wave/radial/sequence/reverse), orchestration tools (Motion layoutId, View Transitions). Does NOT duplicate motion-token definitions. SCOPED injection: only activates on prompts matching /animation|motion|orchestrat|choreograph/i."
triggers: ["animation system", "micro-interactions", "easing", "stagger", "choreography", "animation library", "orchestration", "timing function", "motion orchestration"]
used_by: ["builder", "planner", "discuss"]
version: "3.1.0"
word_count_max: 2500
injection_regex: "/animation|motion|orchestrat|choreograph|stagger|easing/i"
---

## Layer 1: Decision Guidance

### Why a Meta-Skill

v3.x already has `cinematic-motion` (creative guidance), `performance-animation` (perf checks), `motion-health` (sub-gate), `page-transitions` (route-level), `performance-guardian` (general perf). Each is narrow. But designers often ask "what easing for a Kinetic archetype button?" or "how do I stagger a 20-item grid?" — those answers span all five skills.

This meta-skill is the **shortest route from question to answer**, referencing (not duplicating) the underlying skills.

### Hard constraints (enforced via self-audit)

- **Word count ≤ 2500** (this file). Self-audit greps `wc -w` and fails if exceeded.
- **Does NOT redefine motion tokens** (those live in `design-dna`). Self-audit greps for `--motion-duration-*` definitions and fails if present.
- **Scoped injection only** — pre-tool-use hook reads `injection_regex` frontmatter, injects only when user prompt matches. Prevents god-skill over-injection.

### When to Use

- User asks about easing / timing / stagger / choreography.
- Planning motion-heavy section (HOOK, PEAK, REVEAL).
- Coordinating animations across siblings / shared layout transitions.

### When NOT to Use

- Single static animation implementation → `cinematic-motion` directly.
- Perf debugging → `performance-animation`.
- Motion safety audit → `motion-health`.
- Page transitions → `page-transitions`.

## Layer 2: Micro-Interactions Library

### Universal button

Hover: scale 1.02 + slight shadow layer. Active: scale 0.98. Focus: ring. Transitions 150ms ease-out.

### Universal link

Hover: underline slide-in-from-left over 200ms. Focus: outline ring, no underline stacking.

### Universal card

Hover: translateY(-2px) + shadow step up one layer. 200ms ease-out. Maintain content stability (no font-size shift).

### Universal input

Focus: border-color to primary + inner ring. 150ms. Error state: border to tension + shake (3× 8px).

### Drag feedback

Scale 1.02 + shadow up one layer + z-index bump during drag. Spring back on release (stiffness 300, damping 30).

Full patterns in `cinematic-motion` Layer 2.

## Layer 2: Archetype Easing Curves

Distinct cubic-beziers per archetype. Consume via DNA motion tokens (`--motion-ease-archetype`):

| Archetype | cubic-bezier | Feel |
|-----------|--------------|------|
| Brutalist | `cubic-bezier(0.5, 0, 0.5, 1)` | Sharp snap |
| Ethereal | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Slow float |
| Kinetic | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Elastic overshoot |
| Neon Noir | `cubic-bezier(0.75, 0, 0.75, 0.98)` | Digital flick |
| Editorial | `cubic-bezier(0.165, 0.84, 0.44, 1)` | Polished quintic |
| Neo-Corporate | `cubic-bezier(0.4, 0, 0.2, 1)` | Material snap |
| Japanese Minimal | `cubic-bezier(0.33, 1, 0.68, 1)` | Quiet ease-out |
| Claymorphism (v3.1) | `cubic-bezier(0.5, 1.5, 0.5, 1)` | Soft spring |
| Spatial/VisionOS (v3.1) | `cubic-bezier(0.4, 0, 0.2, 1)` | Material + slight damping |
| Cyberpunk-HUD (v3.1) | `cubic-bezier(0.9, 0, 0.1, 1)` | Step-like, almost digital |

Apply as Motion `ease` prop or CSS `transition-timing-function`. Use archetype easing only on PRIMARY animated property; secondary props use ease-out.

## Layer 3: Stagger Patterns

### Wave (sequential)

`delay = i * 0.05s`. Max total duration 2s → cap count at 40 items. For larger lists, paginate or use wave-batching.

### Radial (center-out)

Compute distance from center; delay = distance * 0.08s. Good for grids where center is the hero.

### Reverse wave (last-first)

`delay = (total - 1 - i) * 0.05s`. Dramatic close sequence.

### Sequence (groups)

Group by semantic boundary (row, category), then stagger within. `delay = (groupIdx * groupSize + itemInGroup) * 0.08s`.

### Constraint: total duration cap

`max total duration = 3s`. Self-audit flag if stagger math produces >3s.

## Layer 4: Orchestration Tools

### Motion layoutId (shared-element morph)

```tsx
<motion.img layoutId="logo" className="hero-logo" />
<motion.img layoutId="logo" className="header-logo" /> // Morphs when one unmounts and other mounts
```

Use for hero-to-nav logo transition. Avoid for deeply-nested elements (layout thrash).

### View Transitions API (browser-native)

```tsx
if ('startViewTransition' in document) {
  document.startViewTransition(() => router.push(href));
} else {
  router.push(href);
}
```

Works best with page-level content changes. Use for route transitions. Fallback: Motion AnimatePresence.

## Layer 4: Anti-Patterns

- ❌ **Infinite stagger** — 50 items × 0.1s = 5s. Cap count or collapse stagger on large lists.
- ❌ **Archetype easing on every property** — primary prop only. Secondary = ease-out.
- ❌ **layoutId on nested elements** — layout thrash. Top-level containers only.
- ❌ **Motion without prefers-reduced-motion gate** — every keyframed animation must have RM fallback. Enforced by `motion-health`.
- ❌ **Redefining motion tokens here** — DNA owns that. This skill references, not defines.
- ❌ **Injecting this skill on every prompt** — scoped regex in frontmatter ensures only animation-related prompts pull it in.
