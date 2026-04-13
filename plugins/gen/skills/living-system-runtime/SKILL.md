---
name: living-system-runtime
description: Runtime-tunable Design DNA via 6 signal types — injects live environmental signals into CSS custom properties and component state without rebuilds.
tier: domain
triggers: living-system, runtime-dna, signal-types, env-signals, dynamic-tokens, runtime-tunable
version: 1.0.0
---

# Living System Runtime

Design DNA that breathes: the `@genorah/living-system-runtime` package exposes 6 signal channels that mutate CSS tokens and component state in real time — no rebuild, no flash.

## Layer 1 — When to invoke

Use when the project requires environment-reactive design: time-of-day mood shifts, user-preference adaptation, ambient data (weather, performance metrics), or live brand governance triggers. Enabled via `living_system: true` in DESIGN-DNA.md.

## Layer 2 — Signal types

| Signal | Source | DNA tokens affected |
|--------|--------|-------------------|
| `circadian` | `Date` hour | `--color-bg`, `--color-glow`, `--motion-scale` |
| `preference` | `prefers-color-scheme`, `prefers-reduced-motion` | All motion + color tokens |
| `ambient` | Battery API, Connection API, `prefers-contrast` | Performance budget, contrast |
| `behavioral` | Scroll depth, time-on-page, cursor velocity | Micro-interaction intensity |
| `brand-override` | CMS / server-sent event | Any token (governed by drift policy) |
| `telemetry` | RUM p75 LCP / CLS | Animation frame budget |

**RootLayout integration (Next.js):**
```tsx
// app/layout.tsx
import { LivingSystemProvider } from "@genorah/living-system-runtime";
import dna from "./.planning/genorah/tokens.json";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LivingSystemProvider dna={dna} signals={["circadian", "preference", "ambient"]}>
          {children}
        </LivingSystemProvider>
      </body>
    </html>
  );
}
```

The provider injects a `<style>` tag updating CSS custom properties on each signal tick. React components opt in via `useLivingDNA()` hook:
```tsx
const { tokens, signalState } = useLivingDNA();
// tokens.color.bg — reactive, updates without re-render via CSS vars
// signalState.circadian.hour — for conditional logic
```

## Layer 3 — Integration

- DESIGN-DNA.md: add `living_system: { enabled: true, signals: [...] }`
- Token drift policy from `multi-brand-governance` skill applies to `brand-override` channel
- Telemetry signal requires `@genorah/telemetry-rum` to be active
- Ship-check validates that signal subscriptions are cleaned up on unmount (no memory leak)
- `/gen:audit` checks that no signal mutation breaks the 4-breakpoint layout

## Layer 4 — Anti-patterns

- Mutating layout-affecting tokens via `behavioral` signal — only cosmetic tokens (glow, opacity, scale) allowed; geometry-affecting mutations cause CLS.
- Using `brand-override` without drift-policy guard — unguarded overrides bypass Design DNA governance; always configure max-delta per token.
- Subscribing to all 6 signals on every component — use the provider's global subscription; components read from context, not individual signals.
- Blocking SSR with client-only signal setup — use `initialTokens` prop from server for hydration; client signals activate after `useLayoutEffect`.
