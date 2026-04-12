---
name: vue-patterns
tier: domain
description: "Vue 3 Composition API patterns: <script setup>, composables, Pinia state, reactive refs, computed, watchEffect, Teleport, Suspense. Tailwind v4 integration. DNA token pipeline. Works with Vite + Vitest."
triggers: ["vue", "vue 3", "composition api", "script setup", "pinia", "composable", "vue tailwind", "vite vue"]
used_by: ["builder", "planner", "start-project"]
version: "3.1.0"
metadata:
  pathPatterns:
    - "**/*.vue"
---

## Layer 1: Decision Guidance

### When to Use Vue 3

- Team comes from Vue 2 background or strong HTML/CSS-first preferences.
- Prefer template syntax with explicit reactivity over React's everything-is-JS.
- Nuxt 3 as full-stack framework (separate skill: `nuxt-patterns`).
- Ecosystem comfort: Element Plus, Vuetify, PrimeVue component libraries.

### When NOT to Use

- Team is React or Svelte committed.
- Need the largest ecosystem (React wins on library count).
- Massive SaaS requiring SvelteKit-level perf (Svelte compiles smaller).

## Layer 2: Technical Spec

### Composition API with `<script setup>`

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2);

watch(count, (newVal, oldVal) => {
  console.log(`count: ${oldVal} → ${newVal}`);
});

onMounted(() => {
  console.log('mounted');
});

function increment() {
  count.value++;
}
</script>

<template>
  <button @click="increment">{{ count }} (×2 = {{ doubled }})</button>
</template>
```

### Composables (reusable logic)

```ts
// composables/useCounter.ts
import { ref } from 'vue';

export function useCounter(initial = 0) {
  const count = ref(initial);
  const increment = () => count.value++;
  const decrement = () => count.value--;
  const reset = () => (count.value = initial);
  return { count, increment, decrement, reset };
}
```

```vue
<script setup>
import { useCounter } from './composables/useCounter';
const { count, increment } = useCounter(10);
</script>
```

### Pinia state management

```ts
// stores/user.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const name = ref('');
  const isLoggedIn = computed(() => name.value !== '');
  function login(n: string) { name.value = n; }
  function logout() { name.value = ''; }
  return { name, isLoggedIn, login, logout };
});
```

### Teleport + Suspense

```vue
<template>
  <!-- Modal rendered outside DOM tree -->
  <Teleport to="body">
    <div v-if="modalOpen" class="modal">...</div>
  </Teleport>

  <!-- Async component with fallback -->
  <Suspense>
    <template #default>
      <AsyncDashboard />
    </template>
    <template #fallback>
      <div>Loading dashboard...</div>
    </template>
  </Suspense>
</template>
```

### DNA Token Pipeline (Tailwind v4)

```css
/* src/assets/main.css */
@import 'tailwindcss';

@theme {
  --color-primary: #6366f1;
  --color-bg: #0a0a0b;
  --color-text: #e8e8ea;
  --font-display: 'Inter', sans-serif;
  --radius-lg: 16px;
}
```

```vue
<template>
  <button class="bg-primary text-text rounded-lg hover:bg-primary/90">
    Click
  </button>
</template>
```

### Vite config + path aliases

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
});
```

## Layer 3: Integration Context

- **Framework detection** — `/gen:start-project` offers Vue 3 + Vite alongside SvelteKit. Detect via `package.json` "vue" dependency.
- **Nuxt preferred for full-stack** — see `nuxt-patterns` for SSR/ISR/hybrid Vue apps.
- **shadcn-vue** — community port; prefer over vanilla components.
- **Pinia over Vuex** — Vuex is legacy. Pinia is official Vue 3 state management.
- **Script setup mandatory** — Genorah builders never emit Options API or `defineComponent` boilerplate. Script setup is the target.

## Layer 4: Anti-Patterns

- ❌ **Options API in new code** — Composition API + `<script setup>` is the modern target. Options API only when migrating.
- ❌ **Reactive gotchas** — `ref.value` vs `reactive().prop`. Prefer `ref` for primitives, `reactive` for objects; don't destructure `reactive()` (loses reactivity) — use `toRefs()`.
- ❌ **Watching refs without `watch()`** — templates auto-unwrap; script code needs explicit `.value` or `watch()` subscription.
- ❌ **Props mutation** — props are read-only. Emit events or use v-model pattern.
- ❌ **Forgetting `defineProps` / `defineEmits`** — script setup requires these for TS typing.
- ❌ **Vuex 4 in new projects** — use Pinia. Vuex is unmaintained for Vue 3 going forward.
