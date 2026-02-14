---
name: state-management
description: "State management patterns: Zustand stores, React Context for theme/auth, URL state, when to use what. Works with Next.js and Astro React islands."
---

Use this skill when the user mentions state management, Zustand, global state, React Context, URL state, store, persist state, or shared state between components. Triggers on: state, zustand, store, context, global state, URL state, persist, shared state.

You are an expert at choosing and implementing the right state management approach.

## When to Use What

| Need | Solution | Why |
|------|----------|-----|
| Server data (list, detail) | TanStack Query | Cache, refetch, optimistic updates |
| URL-driven state (filters, tabs) | `nuqs` / `useSearchParams` | Shareable, back-button works |
| Theme, locale, auth | React Context | Provider pattern, rarely changes |
| Complex client state | Zustand | Simple, no boilerplate, works outside React |
| Form state | react-hook-form | Purpose-built for forms |
| Single component state | `useState` / `useReducer` | Keep it local |

## Zustand — Primary Client Store

### Basic Store
```tsx
import { create } from 'zustand'

interface AppStore {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))

// Usage — no Provider needed
function Sidebar() {
  const open = useAppStore((s) => s.sidebarOpen)
  if (!open) return null
  return <aside>...</aside>
}

function Header() {
  const toggle = useAppStore((s) => s.toggleSidebar)
  return <Button onClick={toggle}><Menu /></Button>
}
```

### Store with Slices (Large Apps)
```tsx
import { create } from 'zustand'

interface UISlice {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

interface NotificationSlice {
  notifications: Notification[]
  addNotification: (n: Notification) => void
  dismissNotification: (id: string) => void
  unreadCount: () => number
}

export const useStore = create<UISlice & NotificationSlice>((set, get) => ({
  // UI slice
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // Notification slice
  notifications: [],
  addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
  dismissNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}))
```

### Persist to localStorage
```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePreferences = create(
  persist<PreferencesState>(
    (set) => ({
      theme: 'system' as 'light' | 'dark' | 'system',
      compactMode: false,
      setTheme: (theme) => set({ theme }),
      toggleCompact: () => set((s) => ({ compactMode: !s.compactMode })),
    }),
    { name: 'user-preferences' } // localStorage key
  )
)
```

### Devtools
```tsx
import { devtools } from 'zustand/middleware'

export const useStore = create(
  devtools<StoreState>(
    (set) => ({ /* ... */ }),
    { name: 'AppStore' }
  )
)
```

## React Context — Theme, Auth, Locale

```tsx
// Theme context (works in Next.js and Astro React islands)
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (t: Theme) => void
}>({ theme: 'system', setTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const root = document.documentElement
    const resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme
    root.classList.toggle('dark', resolved === 'dark')
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

## URL State — Shareable, Back-Button Friendly

```tsx
// Using nuqs (recommended for Next.js)
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs'

function ProductFilters() {
  const [search, setSearch] = useQueryState('q', parseAsString.withDefault(''))
  const [category, setCategory] = useQueryState('cat', parseAsString)
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  return (
    <div className="flex gap-4">
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
      <Select value={category ?? ''} onValueChange={setCategory}>
        <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="electronics">Electronics</SelectItem>
          <SelectItem value="clothing">Clothing</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

## Astro: State in React Islands

```astro
---
// Astro page — static shell
import { ProductFilters } from '../components/ProductFilters'
import { CartButton } from '../components/CartButton'
---

<html>
  <body>
    <header>
      <!-- React island: cart state shared via Zustand -->
      <CartButton client:load />
    </header>
    <main>
      <!-- React island: filter state via URL params -->
      <ProductFilters client:load />
    </main>
  </body>
</html>
```

Zustand stores work across Astro React islands because the store is a module-level singleton — all `client:load` components share the same store instance.

## Best Practices

1. **Don't reach for global state first.** `useState` covers 80% of cases.
2. **URL state for anything shareable.** Filters, tabs, pagination, search — put it in the URL.
3. **Zustand for client-only state.** Sidebar open/close, notification queue, shopping cart.
4. **Context for infrequent changes.** Theme, auth, locale — things that change rarely but affect many components.
5. **Never put server data in Zustand.** Use TanStack Query for that — it handles cache, refetch, and invalidation.
6. **Select specific fields.** `useStore((s) => s.count)` not `useStore()` — prevents unnecessary re-renders.
7. **Colocate state.** Keep state as close to where it's used as possible.
