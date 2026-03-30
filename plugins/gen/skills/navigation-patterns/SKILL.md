---
name: navigation-patterns
description: "Desktop navigation patterns: mega menus, multi-level dropdowns, sticky headers with scroll behavior, search with autocomplete, contextual navigation, sidebar nav, command palette. Works with Next.js and Astro."
---

Use this skill when the user mentions mega menu, navigation, header, navbar, sticky header, scroll header, breadcrumb nav, search autocomplete, contextual nav. Triggers on: mega menu, navigation, navbar, header, sticky, scroll header, nav bar, multi-level nav.

You are an expert at building polished navigation systems with shadcn/ui.

## Sticky Header with Scroll Behavior

```tsx
'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function StickyHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastY, setLastY] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 10)
      setHidden(y > lastY && y > 100) // hide on scroll down after 100px
      setLastY(y)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastY])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'bg-background/80 backdrop-blur-lg border-b shadow-sm' : 'bg-transparent',
        hidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      {children}
    </header>
  )
}
```

## Mega Menu

```tsx
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'

const megaMenuItems = [
  {
    title: 'Products',
    items: [
      { title: 'Analytics', description: 'Measure what matters', href: '/analytics', icon: BarChart3 },
      { title: 'Automation', description: 'Streamline your workflow', href: '/automation', icon: Zap },
      { title: 'Integrations', description: 'Connect your tools', href: '/integrations', icon: Plug },
      { title: 'Security', description: 'Enterprise-grade protection', href: '/security', icon: Shield },
    ],
    featured: { title: 'New: AI Assistant', description: 'Automate tasks with AI', href: '/ai', image: '/ai-feature.jpg' },
  },
]

export function MegaMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {megaMenuItems.map((menu) => (
          <NavigationMenuItem key={menu.title}>
            <NavigationMenuTrigger>{menu.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[600px] gap-3 p-4 md:w-[800px] md:grid-cols-[1fr_250px]">
                <div className="grid grid-cols-2 gap-2">
                  {menu.items.map((item) => (
                    <NavigationMenuLink key={item.title} asChild>
                      <a
                        href={item.href}
                        className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors"
                      >
                        <item.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">{item.title}</div>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </a>
                    </NavigationMenuLink>
                  ))}
                </div>
                {menu.featured && (
                  <div className="rounded-lg bg-gradient-to-b from-muted/50 to-muted p-4">
                    <div className="text-sm font-medium">{menu.featured.title}</div>
                    <p className="text-xs text-muted-foreground mt-1">{menu.featured.description}</p>
                  </div>
                )}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/pricing">
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
```

## Search with Autocomplete

```tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover'
import { Search, ArrowRight } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

export function SearchAutocomplete() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<{ title: string; href: string; category: string }[]>([])
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (!debouncedQuery) { setResults([]); return }
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(r => r.json())
      .then(data => { setResults(data.results); setOpen(true) })
  }, [debouncedQuery])

  const grouped = results.reduce<Record<string, typeof results>>((acc, item) => {
    ;(acc[item.category] ??= []).push(item)
    return acc
  }, {})

  return (
    <Popover open={open && results.length > 0} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="flex h-9 w-full rounded-md border bg-transparent px-9 py-1 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
            placeholder="Search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {Object.entries(grouped).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                {items.map(item => (
                  <CommandItem key={item.href} onSelect={() => window.location.href = item.href}>
                    <span>{item.title}</span>
                    <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

## Multi-Level Sidebar Nav

```tsx
'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface NavItem {
  title: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

function NavGroup({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const [open, setOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  if (!hasChildren) {
    return (
      <a
        href={item.href}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors',
          depth > 0 && 'ml-4 border-l pl-4'
        )}
      >
        {item.icon && <item.icon className="h-4 w-4" />}
        {item.title}
      </a>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className={cn(
        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors',
        depth > 0 && 'ml-4 border-l pl-4'
      )}>
        {item.icon && <item.icon className="h-4 w-4" />}
        <span className="flex-1 text-left">{item.title}</span>
        <ChevronRight className={cn('h-4 w-4 transition-transform', open && 'rotate-90')} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {item.children!.map(child => (
          <NavGroup key={child.title} item={child} depth={depth + 1} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
```

## Astro Navigation with Active States

```astro
---
// src/components/Nav.astro
interface Props {
  items: { label: string; href: string }[]
}
const { items } = Astro.props;
const currentPath = Astro.url.pathname;
---

<nav class="flex items-center gap-1">
  {items.map(item => (
    <a
      href={item.href}
      class:list={[
        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
        currentPath === item.href || currentPath.startsWith(item.href + '/')
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      ]}
    >
      {item.label}
    </a>
  ))}
</nav>
```

## Best Practices

1. Hide header on scroll down, show on scroll up (hide-on-scroll pattern)
2. Use `backdrop-blur-lg` + `bg-background/80` for glassmorphism header on scroll
3. Mega menus: max 2-level depth, use icons, include featured section
4. Search autocomplete: debounce 300ms, group by category, show max 8 results
5. Multi-level sidebar: use Collapsible, indent with border-left
6. Active states: match both exact path and child paths
7. Mobile: convert mega menu to accordion in Sheet/Drawer
8. Keyboard: Escape closes menus, arrow keys navigate items
9. For Astro: use `Astro.url.pathname` for active state detection
10. Sticky headers should not exceed 64px height to preserve content space
