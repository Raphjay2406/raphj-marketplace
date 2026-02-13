---
name: mobile-navigation
description: "Mobile navigation patterns including tab bars, stack navigation, drawer menus, gesture navigation, and native-feeling mobile nav."
---

Use this skill when the user mentions mobile navigation, tab bar, bottom navigation, hamburger menu, mobile menu, drawer menu, stack navigation, or mobile nav.

You are an expert at creating mobile navigation that feels native and intuitive.

## Bottom Tab Bar

```tsx
'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Search, PlusCircle, Bell, User } from 'lucide-react'

const tabs = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Search, label: 'Explore' },
  { href: '/create', icon: PlusCircle, label: 'Create' },
  { href: '/notifications', icon: Bell, label: 'Activity' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 p-2 min-w-[64px] active:scale-90 transition-transform"
            >
              <tab.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-[10px] transition-colors", isActive ? "text-primary font-semibold" : "text-muted-foreground")}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-[1px] h-[2px] w-8 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

## Floating Action Tab Bar

```tsx
<nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
  <div className="flex items-center gap-2 rounded-full border bg-card/95 backdrop-blur-xl px-3 py-2 shadow-xl">
    {tabs.map((tab) => {
      const isActive = pathname === tab.href
      return (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-all active:scale-95",
            isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <tab.icon className="h-4 w-4" />
          {isActive && <span className="font-medium">{tab.label}</span>}
        </Link>
      )
    })}
  </div>
</nav>
```

## Mobile Header with Back Button

```tsx
// Standard header
<header className="sticky top-0 z-40 flex items-center h-14 px-4 border-b bg-background/95 backdrop-blur-xl">
  <button onClick={() => router.back()} className="p-2 -ml-2 active:scale-90 transition-transform">
    <ChevronLeft className="h-5 w-5" />
  </button>
  <h1 className="flex-1 text-center font-semibold text-base pr-9">{title}</h1>
</header>

// Large title header (iOS-style)
<header className="px-4 pt-[env(safe-area-inset-top)]">
  <div className="flex items-center h-14">
    <button className="p-2 -ml-2"><ChevronLeft className="h-5 w-5" /></button>
  </div>
  <h1 className="text-3xl font-bold tracking-tight pb-2">{title}</h1>
</header>

// Collapsing large title (shrinks on scroll)
// Use scroll position to interpolate between large and small header
```

## Slide-Out Drawer Menu

```tsx
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

<Sheet>
  <SheetTrigger asChild>
    <button className="p-2 active:scale-90 transition-transform">
      <Menu className="h-5 w-5" />
    </button>
  </SheetTrigger>
  <SheetContent side="left" className="w-[300px] p-0">
    {/* Profile section */}
    <div className="p-6 border-b">
      <Avatar className="h-14 w-14 mb-3">
        <AvatarImage src="/avatar.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <p className="font-semibold">John Doe</p>
      <p className="text-sm text-muted-foreground">john@example.com</p>
    </div>

    {/* Navigation */}
    <nav className="p-2">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm active:bg-muted/80 transition-colors"
        >
          <item.icon className="h-5 w-5 text-muted-foreground" />
          {item.label}
          {item.badge && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground font-medium px-1.5">
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>

    {/* Bottom section */}
    <div className="absolute bottom-0 left-0 right-0 p-4 border-t pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <button className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm text-destructive">
        <LogOut className="h-5 w-5" /> Sign out
      </button>
    </div>
  </SheetContent>
</Sheet>
```

## Segmented Control (iOS-style)

```tsx
'use client'
import { useState } from 'react'

function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="relative flex rounded-lg bg-muted p-1">
      {options.map((option, i) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative z-10 flex-1 rounded-md py-2 text-sm font-medium transition-colors",
            value === option.value ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
      {/* Sliding indicator */}
      <div
        className="absolute top-1 bottom-1 rounded-md bg-background shadow-sm transition-all duration-200"
        style={{
          left: `calc(${options.findIndex(o => o.value === value) * (100 / options.length)}% + 4px)`,
          width: `calc(${100 / options.length}% - 8px)`,
        }}
      />
    </div>
  )
}
```

## Action Sheet (iOS-style)

```tsx
<Drawer>
  <DrawerContent>
    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 my-4" />
    <div className="px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      {/* Actions */}
      <div className="rounded-2xl overflow-hidden border">
        {actions.map((action, i) => (
          <button
            key={action.label}
            className={cn(
              "w-full flex items-center gap-3 p-4 active:bg-muted/80 transition-colors",
              i > 0 && "border-t",
              action.destructive && "text-destructive"
            )}
          >
            <action.icon className="h-5 w-5" />
            <span className="font-medium text-sm">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Cancel button */}
      <button className="w-full mt-2 rounded-2xl border p-4 font-semibold text-sm active:bg-muted/80 transition-colors">
        Cancel
      </button>
    </div>
  </DrawerContent>
</Drawer>
```

## Swipe-Back Gesture Indicator

```tsx
// Visual hint for swipeable content
<div className="relative">
  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-muted-foreground/20" />
  {children}
</div>
```

## Best Practices

1. **Bottom tab bar max 5 items** - more becomes unusable
2. **Active tab indicator** - highlight with color AND weight change
3. **Back button** always top-left on sub-pages
4. **Large titles** on primary/root screens, standard on sub-screens
5. **Safe area padding** on all edge-touching navigation elements
6. **Active states** (scale-90, bg change) on every tappable element
7. **Drawer width** max 300px, slide from left for nav, right for details
8. **Floating tab bars** are trendy but need enough bottom margin
9. **Action sheets** via Drawer for destructive actions (delete, report)
10. **Badge counts** on nav items for notifications
