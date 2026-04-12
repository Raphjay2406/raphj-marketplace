---
name: cross-framework-parity
description: Does SvelteKit render match Next.js for the same DNA? Cross-framework visual + interaction parity tests. Catches framework-specific drift.
tier: domain
triggers: cross-framework, framework-parity, svelte-vs-next, astro-vs-next
version: 0.1.0
---

# Cross-Framework Parity

When same design ships to multiple frameworks (migrating or multi-framework shop), measure drift.

## Layer 1 — Flow

```
1. Deploy same section to N frameworks
2. Playwright captures 4-breakpoint screenshots each
3. Capture bounding boxes + computed styles
4. Compare pairwise:
   - Visual: LPIPS per breakpoint
   - Layout: bounding-box deltas
   - Styles: computed CSS diff (colors, fonts, spacing)
   - Interaction: animation path similarity
```

## Layer 2 — Expected vs unexpected drift

**Expected:**
- Framework-specific class name differences (irrelevant to users)
- Hydration timing nuances
- SSR vs CSR first-paint markers

**Unexpected:**
- Different font rendering (font-smoothing CSS missing)
- Different spacing (border-box vs content-box)
- Missing hover state on framework with different click/touch handling

## Layer 3 — Reference framework

Pick one framework as canonical (usually Next.js). Compare all others against it:

```
Next.js (reference) vs SvelteKit: LPIPS 0.03  ✓
Next.js vs Astro:                LPIPS 0.02  ✓
Next.js vs Nuxt:                 LPIPS 0.08  ⚠️ investigate
```

## Layer 4 — Integration

- `/gen:tests cross-framework` when project ships multiple frameworks
- Ledger: `cross-framework-drift`
- Dashboard: framework-parity tab

## Layer 5 — Anti-patterns

- ❌ Running without same DNA applied — false positive
- ❌ Ignoring hydration-time differences — real users see them
- ❌ Comparing development builds — HMR changes behavior; use production builds only
