---
name: nuxt-patterns
tier: domain
description: "Nuxt 3 patterns: file-based routing, auto-imports, useFetch/useAsyncData, server routes (nitro), ISR + SSR + hybrid rendering, modules (@nuxtjs/tailwindcss, @pinia/nuxt, @nuxt/content), Vercel/Cloudflare deployment."
triggers: ["nuxt", "nuxt 3", "nitro", "useFetch", "useAsyncData", "server routes", "nuxt content", "nuxt islands", "hybrid rendering"]
used_by: ["builder", "planner", "start-project"]
version: "3.1.0"
metadata:
  pathPatterns:
    - "**/*.vue"
    - "**/nuxt.config.ts"
---

## Layer 1: Decision Guidance

### When to Use Nuxt 3

- Need full-stack Vue with SSR/SSG/ISR/hybrid rendering.
- Content-heavy site + `@nuxt/content` (markdown-driven).
- API routes co-located with frontend (Nitro server).
- Team is Vue-committed and wants Next.js-class DX for Vue.

### When NOT to Use

- React-committed team (use Next.js).
- Simple SPA (Vue + Vite sufficient — see `vue-patterns`).
- Svelte is an option (SvelteKit compares well).

## Layer 2: Technical Spec

### Project structure

```
├── app.vue                 # Root component
├── nuxt.config.ts          # Config
├── pages/                  # File-based routing
│   ├── index.vue           # /
│   ├── about.vue           # /about
│   └── [slug].vue          # Dynamic
├── components/             # Auto-imported
├── composables/            # Auto-imported
├── layouts/                # Named layouts
├── server/                 # API routes + middleware
│   └── api/hello.ts        # GET /api/hello
└── public/                 # Static assets
```

### Auto-imports (no manual imports needed)

```vue
<script setup>
// ref, computed, watch, onMounted auto-imported from Vue
const count = ref(0);

// useFetch, useAsyncData, useState auto-imported from Nuxt
const { data: posts } = await useFetch('/api/posts');

// Anything in composables/ auto-imported
const { toggleTheme } = useTheme();
</script>
```

### Data fetching — `useFetch` vs `useAsyncData`

```ts
// useFetch — convenience wrapper, SSR-safe
const { data, pending, error } = await useFetch('/api/posts', {
  key: 'posts',              // explicit cache key
  lazy: true,                // don't block navigation
  server: true,              // fetch on server
});

// useAsyncData — more control, any promise
const { data } = await useAsyncData('posts', () => $fetch('/api/posts'));
```

### Server routes (Nitro)

```ts
// server/api/posts/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const post = await db.posts.findUnique({ where: { id } });
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Not found' });
  return post;
});
```

Nitro auto-routes files in `server/api/`. File naming: `[param].get.ts`, `.post.ts`, `.put.ts`, `.delete.ts`.

### Rendering strategy — per-route overrides

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },                        // SSG
    '/blog/**': { isr: 60 },                         // ISR, revalidate 60s
    '/admin/**': { ssr: false, appMiddleware: ['auth'] }, // Client-only
    '/api/**': { cors: true },                       // API CORS
  }
});
```

### Nuxt Content (markdown-driven)

```
content/
├── 1.hello-world.md
└── 2.second-post.md
```

```vue
<script setup>
const { data: posts } = await useAsyncData('posts', () =>
  queryContent('/').sort({ createdAt: -1 }).find()
);
</script>

<template>
  <ContentDoc :path="$route.path" />
</template>
```

### DNA Token Pipeline

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
});
```

```css
/* assets/css/main.css */
@import 'tailwindcss';
@theme {
  --color-primary: #6366f1;
  --color-bg: #0a0a0b;
  --font-display: 'Inter', sans-serif;
}
```

### Deployment

| Target | Module / Preset |
|--------|-----------------|
| Vercel | auto-detected (default `.output/` preset) |
| Cloudflare | `preset: 'cloudflare-pages'` in nuxt.config |
| Netlify | `preset: 'netlify'` |
| Node | `preset: 'node-server'` |

Vercel preset enables Fluid Compute + ISR for free. No config needed.

## Layer 3: Integration Context

- **Framework detection** — `/gen:start-project` offers Nuxt 3 for Vue-preferred full-stack builds.
- **Pinia** — @pinia/nuxt module; auto-imports stores from `stores/`.
- **shadcn-vue** — integrates cleanly with Nuxt via manual component installation.
- **Content-heavy projects** — prefer Nuxt Content for blog/docs over external CMS.
- **Pages with CMS** — pair Nuxt Content (internal) or Sanity/Payload (see `cms-sanity`, `cms-payload` skills).
- **Islands/Server Components (v3.12+)** — `<NuxtIsland>` for server-only fragments, reduces client JS.

## Layer 4: Anti-Patterns

- ❌ **Using Pages API router with server/api overlap** — don't define both; Nitro server routes handle API, pages handle HTML.
- ❌ **`ref` without `$fetch`** — client-side calls without SSR benefit. Prefer `useFetch`/`useAsyncData` for initial data.
- ❌ **Manual imports of `ref`, `computed`, `useFetch`** — auto-imported. Remove the imports; lint rule will flag.
- ❌ **SSR-ing everything** — use `routeRules` for prerender/ISR where possible. Dynamic SSR only for auth-gated or truly personalized pages.
- ❌ **Forgetting `asyncDataDefaults.deep: false`** — Nuxt 3.8+ default is deep reactivity. Large datasets hurt perf; disable deep in config for list pages.
- ❌ **Missing `key` on `useFetch` in dynamic routes** — without a stable key, cache misses multiply.
