---
name: anti-vanity-check
tier: core
description: "Detects ego-driven over-engineering patterns: premature abstraction, design patterns without problems, config-for-configs-sake, clever-code-over-clear-code. Complements anti-slop-gate (catches AI-generic slop) by catching ego-architecture. Wires into /gen:audit as optional axis. Distilled from bencium-marketplace/vanity-engineering-review (MIT)."
triggers: ["vanity engineering", "over-engineering", "premature abstraction", "ego architecture", "code review vanity", "clever code", "pattern abuse"]
used_by: ["quality-reviewer", "audit", "code-reviewer-agents"]
version: "3.1.0"
---

## Layer 1: Decision Guidance

### Why Anti-Vanity

Genorah's `anti-slop-gate` catches AI-generated generic slop (lorem ipsum, placeholder components, boring CTA text). But slop isn't the only failure mode. The opposite failure is **vanity engineering** — code that looks sophisticated but serves no real purpose. AI agents are particularly prone to this when given ambiguous "make it production-grade" prompts.

This skill names and detects those patterns so audit can flag them.

**Source attribution:** Distilled from `bencium-marketplace/vanity-engineering-review` (MIT).

### When to Use

- `/gen:audit` optional axis for refactor-heavy projects.
- Code review pass after polisher before ship.
- When a section has high line count but low user-value delta.

### When NOT to Use

- Genuine system requirements (complex domains legitimately need complex code).
- Architectural decisions made deliberately with documented trade-off (DECISIONS.md entry exists).
- Simple prototypes where over-engineering isn't the concern.

## Layer 2: Detection Catalog

### Pattern 1: Premature Abstraction

**Signal:** Interface / generic / class introduced for "just in case we need it". Only one implementation exists.

```tsx
// VANITY
interface IUserProvider { getUser(id: string): Promise<User>; }
class UserProvider implements IUserProvider { async getUser(id) { /* ... */ } }

// CLEAR
async function getUser(id: string): Promise<User> { /* ... */ }
```

Rule: **If there is ONE implementation, it doesn't need an interface.** Add the interface when the second implementation arrives.

### Pattern 2: Design Patterns Without Problems

**Signal:** Gang-of-Four patterns imported without a matching problem. Factory for a single type. Strategy with one strategy. Observer without real observation need.

```tsx
// VANITY — factory creates one kind of thing
class WidgetFactory {
  createWidget(type: 'button'): Widget {
    return new ButtonWidget();
  }
}

// CLEAR
const button = new ButtonWidget();
```

### Pattern 3: Configuration for Configuration's Sake

**Signal:** Config objects / env vars / feature flags for values that will never change. "Configurable" padding.

```tsx
// VANITY
const CONFIG = {
  ui: {
    spacing: { sm: 4, md: 8, lg: 16 },
    transitions: { fast: 150, normal: 300 },
    // ... but only spacing.md is actually used
  }
};

// CLEAR
const SPACING = 8; // Used once, defined once.
```

Rule: **YAGNI applies to configs too.** Don't pre-build a "configurable" system for a value used in one place.

### Pattern 4: Clever Code Over Clear Code

**Signal:** Dense one-liners, regex golfing, pointfree style where readable procedural code would do. Optimizations without measurement.

```tsx
// VANITY — "clever" reduce-chain
const result = items.reduce((acc, item) =>
  ({ ...acc, [item.id]: { ...item, computed: item.values.reduce((s, v) => s + v * 2, 0) } }), {}
);

// CLEAR
const result = {};
for (const item of items) {
  const computed = item.values.reduce((sum, v) => sum + v * 2, 0);
  result[item.id] = { ...item, computed };
}
```

### Pattern 5: Framework Sprawl

**Signal:** Three state-management libraries. Two router packages. Custom wrapper around shadcn components that adds no value.

```tsx
// VANITY
import { useAtom } from 'jotai';
import { useStore } from 'zustand';
import { useSelector } from 'react-redux';
// All in same project

// CLEAR
// Pick one state library. Document why. Stick with it.
```

### Pattern 6: Type-System Theater

**Signal:** Complex generic types that obscure intent. `extends keyof T & string` gymnastics for a type that's just `string`.

```tsx
// VANITY
type Paths<T, K = keyof T> = K extends string
  ? T[K] extends object ? `${K}.${Paths<T[K]>}` : K
  : never;

// CLEAR (when you don't actually need deep path typing)
type Paths = string;
```

Rule: **Types should aid understanding, not perform it.**

### Pattern 7: Comment Theater

**Signal:** Comments explaining what the code does (already obvious from the code itself) while missing the why.

```tsx
// VANITY
// Loop through each user and get their name
for (const user of users) {
  // Push the user's name to names
  names.push(user.name);
}

// CLEAR (no comment or a why-comment only)
// Names extracted for batch DB query that requires sorted list
const names = users.map(u => u.name).sort();
```

## Layer 3: Integration Context

### Audit mode

`/gen:audit --vanity` runs this skill's detection against generated section code. Output: list of pattern hits with file:line and the "clear" alternative.

Severity: ADVISORY (WARNING tier). Doesn't block shipping unless `--strict` flag is set.

### Builder agent discipline

Builder agents receive a `skills/anti-vanity-check/cheatsheet.md` as part of their spawn context (via pre-tool-use skill injection). The cheatsheet is the 7-pattern catalog compressed to ~500 words.

### Relationship to anti-slop-gate

| Skill | Catches | Tier |
|-------|---------|------|
| `anti-slop-gate` | AI-generic output (lorem, boring copy, placeholder components) | HARD gate |
| `anti-vanity-check` | Over-engineering, premature abstraction, clever-code | SOFT gate (advisory) |

Both ship. Both contribute to the Creative Courage + UX Intelligence categories in the 234-point gate.

## Layer 4: Anti-Patterns (meta-anti-patterns)

- ❌ **Using this skill to tear down legitimate complex code** — a real domain with real complexity requires real code. Document why in DECISIONS.md and the audit respects that.
- ❌ **Flagging every abstraction as vanity** — some abstractions are genuine. The rule is "no ONE-implementation interfaces", not "no interfaces".
- ❌ **Going scorched-earth on config** — configs for environment-dependent values (API URLs, feature flags for real experiments, per-deployment toggles) are legitimate. Config for "what if spacing.md changes someday" is vanity.
- ❌ **Hard-blocking on SOFT severity** — this skill is advisory by default. Only `--strict` mode blocks. Respect that.
- ❌ **Removing Butterick/bencium attribution** — MIT requires preserving copyright notice in substantial portions. Keep the attribution paragraph.
