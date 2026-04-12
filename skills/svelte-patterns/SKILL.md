---
name: svelte-patterns
tier: domain
description: "Svelte 5 + SvelteKit 2 patterns: runes ($state, $derived, $effect), form actions, load functions, adapters (auto, node, vercel), TailwindCSS v4 integration, DNA token pipeline, progressive enhancement."
triggers: ["svelte", "sveltekit", "svelte 5", "runes", "$state", "$derived", "form action", "load function", "svelte tailwind"]
used_by: ["builder", "planner", "start-project"]
version: "3.1.0"
---

## Layer 1: Decision Guidance

### When to Use Svelte/SvelteKit

- Project prioritizes runtime performance + small bundle (Svelte compiles away most framework code).
- Team comes from vanilla JS/HTML background — Svelte's HTML-first syntax is natural.
- Need progressive enhancement out of the box (forms work without JS).
- Content-heavy sites where the framework should get out of the way.

### When NOT to Use

- Massive ecosystem dependency needed (React has more libraries; Svelte sufficient but smaller).
- Team is React-committed (don't fragment).
- Complex component libraries required (shadcn-svelte exists but less polished than shadcn/ui for React).

## Layer 2: Technical Spec

### Svelte 5 Runes

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  $effect(() => {
    console.log(`count changed: ${count}`);
  });
</script>

<button on:click={() => count++}>{count} (×2 = {doubled})</button>
```

Runes replace stores for component-local state. `$state` = reactive; `$derived` = computed; `$effect` = side effect.

### SvelteKit 2 routing

```
src/routes/
├── +layout.svelte         # Root layout
├── +page.svelte           # / route
├── +page.server.ts        # Server-only load + form actions
├── about/+page.svelte     # /about
└── [slug]/+page.svelte    # /[slug] dynamic
```

### Load function

```ts
// +page.server.ts
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params, fetch }) => {
  const post = await fetch(`/api/posts/${params.slug}`).then(r => r.json());
  return { post };
};
```

### Form actions (progressive enhancement)

```ts
// +page.server.ts
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    // ... validate, save
    return { success: true };
  }
};
```

```svelte
<!-- +page.svelte -->
<form method="POST" use:enhance>
  <input name="email" type="email" required>
  <button>Subscribe</button>
</form>
```

Works without JS (graceful degradation), enhanced when JS loads.

### DNA Token Pipeline (Tailwind v4 + Svelte)

```css
/* src/app.css */
@import 'tailwindcss';

@theme {
  --color-primary: #6366f1;
  --color-bg: #0a0a0b;
  --color-text: #e8e8ea;
  --font-display: 'Inter', sans-serif;
  --radius-lg: 16px;
}
```

```svelte
<!-- Component using DNA classes -->
<button class="bg-primary text-text rounded-lg hover:bg-primary/90">
  Click
</button>
```

### Adapters

| Target | Adapter | Config |
|--------|---------|--------|
| Vercel | `@sveltejs/adapter-vercel` | ISR, streaming, Edge Functions |
| Node | `@sveltejs/adapter-node` | Self-hosted |
| Cloudflare | `@sveltejs/adapter-cloudflare` | Workers runtime |
| Auto | `@sveltejs/adapter-auto` | Detects platform automatically |

For Vercel projects, Genorah builders default to `@sveltejs/adapter-vercel` with ISR enabled per-route via `export const config = { isr: { expiration: 60 } }`.

### Progressive Enhancement Pattern

```svelte
<script>
  import { enhance } from '$app/forms';
  let loading = $state(false);
</script>

<form method="POST" action="?/subscribe" use:enhance={() => {
  loading = true;
  return async ({ result, update }) => {
    loading = false;
    await update();
  };
}}>
  <input name="email" required>
  <button disabled={loading}>{loading ? 'Loading...' : 'Subscribe'}</button>
</form>
```

## Layer 3: Integration Context

- **Framework detection** — `/gen:start-project` offers SvelteKit alongside Next.js + Astro + React/Vite. Detects via `package.json` "svelte" dependency.
- **Per-section builders** emit `+page.svelte` + `+page.server.ts` files. Server logic stays server-side (security-by-default).
- **DNA pipeline** — Tailwind v4 `@theme` block in `src/app.css` receives DNA tokens from `design-system-scaffold`.
- **shadcn-svelte** — community port of shadcn/ui available; Genorah prefers it over vanilla components for consistency.
- **Deployment** — defaults to Vercel adapter for parity with other Genorah Next.js/Astro projects; alternative adapters documented above.

## Layer 4: Anti-Patterns

- ❌ **Using Svelte 4 stores in new code** — runes replaced them. `writable` only for cross-component shared state where runes don't fit.
- ❌ **Over-using `$effect`** — most effects can be `$derived`. Reach for `$effect` only for genuine side effects (subscriptions, DOM mutations outside Svelte's control).
- ❌ **Fetching in `+page.svelte` onMount** — use `+page.server.ts` load function instead. Keeps it server-side, hydrates cleanly, respects progressive enhancement.
- ❌ **Form actions without `use:enhance`** — loses the progressive enhancement benefit.
- ❌ **Using JSX-style event binding** — Svelte uses `on:click` (colon), not `onClick`.
- ❌ **Mixing Svelte 5 runes with Svelte 4 reactive syntax** — `$:` reactive statements still work but confuse the mental model. Pick runes.
