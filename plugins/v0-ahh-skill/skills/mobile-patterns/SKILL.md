---
name: mobile-patterns
description: "Mobile-focused UI patterns including bottom sheets, touch targets, swipe interactions, pull-to-refresh, safe areas, and native-feeling mobile web design."
---

Use this skill when the user mentions mobile, mobile design, mobile UI, phone, touch, iOS, Android, mobile-first, mobile app, or responsive mobile.

You are an expert at creating mobile interfaces that feel native and polished on phones.

## Mobile Layout Shell

```tsx
<div className="flex flex-col h-dvh bg-background">
  {/* Status bar safe area */}
  <div className="pt-[env(safe-area-inset-top)]" />

  {/* Header */}
  <header className="flex items-center justify-between px-4 h-14 border-b bg-background/95 backdrop-blur-xl">
    <button className="p-2 -ml-2"><ChevronLeft className="h-5 w-5" /></button>
    <h1 className="font-semibold text-base">Page Title</h1>
    <button className="p-2 -mr-2"><MoreHorizontal className="h-5 w-5" /></button>
  </header>

  {/* Scrollable content */}
  <main className="flex-1 overflow-y-auto overscroll-contain">
    <div className="px-4 py-6">{children}</div>
  </main>

  {/* Bottom nav with safe area */}
  <nav className="border-t bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
    <div className="flex items-center justify-around h-14">
      {navItems.map((item) => (
        <button key={item.label} className="flex flex-col items-center gap-0.5 p-2 min-w-[64px]">
          <item.icon className={cn("h-5 w-5", item.active ? "text-primary" : "text-muted-foreground")} />
          <span className={cn("text-[10px]", item.active ? "text-primary font-medium" : "text-muted-foreground")}>{item.label}</span>
        </button>
      ))}
    </div>
  </nav>
</div>
```

## Touch Targets

```tsx
// Minimum 44x44px touch target (Apple HIG / WCAG)
className="min-h-[44px] min-w-[44px]"

// Icon button with proper hit area
<button className="flex items-center justify-center h-11 w-11 rounded-full hover:bg-muted active:bg-muted/80 transition-colors">
  <Heart className="h-5 w-5" />
</button>

// List item tap target (full width)
<button className="w-full flex items-center gap-3 p-4 active:bg-muted/50 transition-colors text-left">
  <Avatar className="h-10 w-10" />
  <div className="flex-1 min-w-0">
    <p className="font-medium truncate">User Name</p>
    <p className="text-sm text-muted-foreground truncate">Last message preview</p>
  </div>
  <span className="text-xs text-muted-foreground">2m</span>
</button>
```

## Bottom Sheet

```tsx
'use client'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'

<Drawer>
  <DrawerTrigger asChild>
    <Button>Open Options</Button>
  </DrawerTrigger>
  <DrawerContent>
    {/* Drag handle */}
    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 my-4" />

    <DrawerHeader>
      <DrawerTitle>Share</DrawerTitle>
    </DrawerHeader>

    <div className="px-4 pb-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      {/* Action list */}
      <div className="space-y-1">
        {actions.map((action) => (
          <button key={action.label} className="w-full flex items-center gap-3 rounded-xl p-3 active:bg-muted/80 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <action.icon className="h-5 w-5" />
            </div>
            <span className="font-medium text-sm">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  </DrawerContent>
</Drawer>
```

## Swipeable Cards

```tsx
'use client'
import { motion, useMotionValue, useTransform } from 'framer-motion'

function SwipeableCard({ children, onSwipeLeft, onSwipeRight }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5])

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onSwipeRight?.()
        if (info.offset.x < -100) onSwipeLeft?.()
      }}
      className="rounded-2xl border bg-card p-6 cursor-grab active:cursor-grabbing"
    >
      {children}
    </motion.div>
  )
}
```

## Pull-to-Refresh Pattern

```tsx
function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  return (
    <div className="relative overflow-hidden">
      {/* Refresh indicator */}
      <div className={cn(
        "absolute top-0 left-0 right-0 flex justify-center py-4 transition-transform",
        refreshing ? "translate-y-0" : "-translate-y-full"
      )}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>

      <div className={cn("transition-transform", refreshing && "translate-y-12")}>
        {children}
      </div>
    </div>
  )
}
```

## Mobile Form Patterns

```tsx
// Stacked form with large inputs
<form className="space-y-4 px-4">
  <div className="space-y-2">
    <Label className="text-sm font-medium">Email</Label>
    <Input
      type="email"
      className="h-12 text-base rounded-xl"  // Larger for finger taps
      autoComplete="email"
      inputMode="email"
    />
  </div>
  <div className="space-y-2">
    <Label className="text-sm font-medium">Phone</Label>
    <Input
      type="tel"
      className="h-12 text-base rounded-xl"
      inputMode="tel"       // Opens number pad
      autoComplete="tel"
    />
  </div>
  <Button className="w-full h-12 rounded-xl text-base font-semibold">
    Continue
  </Button>
</form>

// Numeric input (opens number pad)
<Input inputMode="numeric" pattern="[0-9]*" />

// Search with cancel
<div className="flex items-center gap-2 px-4">
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input className="h-10 pl-9 rounded-xl bg-muted border-0" placeholder="Search..." />
  </div>
  <button className="text-sm text-primary font-medium">Cancel</button>
</div>
```

## Mobile Cards

```tsx
// Full-width card with image
<div className="mx-4 rounded-2xl overflow-hidden border bg-card">
  <div className="aspect-[16/9] bg-muted">
    <img src="/placeholder.svg?height=200&width=400" alt="" className="w-full h-full object-cover" />
  </div>
  <div className="p-4 space-y-2">
    <h3 className="font-semibold">Card Title</h3>
    <p className="text-sm text-muted-foreground line-clamp-2">Description that truncates after two lines of text.</p>
  </div>
</div>

// Horizontal scroll card row
<div className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide">
  {items.map((item) => (
    <div key={item.id} className="flex-shrink-0 w-[280px] snap-start rounded-xl border bg-card p-4">
      {/* Card content */}
    </div>
  ))}
</div>
```

## Haptic-Like Feedback (Visual)

```tsx
// Active state that feels like a press
className="active:scale-[0.97] transition-transform duration-100"

// With background feedback
className="active:bg-muted/80 active:scale-[0.98] transition-all duration-100"

// Button press with spring
<motion.button whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
  Tap me
</motion.button>
```

## Safe Areas & Notches

```tsx
// Tailwind safe area utilities
className="pt-[env(safe-area-inset-top)]"
className="pb-[env(safe-area-inset-bottom)]"
className="pl-[env(safe-area-inset-left)]"
className="pr-[env(safe-area-inset-right)]"

// Bottom fixed element with safe area
className="fixed bottom-0 left-0 right-0 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
```

## Mobile Performance

```tsx
// Use passive scroll listeners
className="overscroll-contain"          // Prevent scroll chaining
className="touch-manipulation"           // Faster taps (removes 300ms delay)
className="-webkit-overflow-scrolling-touch" // Momentum scrolling

// Prevent zoom on input focus (iOS)
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
```

## Best Practices

1. **44px minimum touch targets** - fingers are not cursors
2. **Use `h-dvh`** not `h-screen` - accounts for mobile browser chrome
3. **Safe area insets** on all fixed/absolute edge elements
4. **`inputMode`** on inputs - `numeric`, `tel`, `email`, `url`, `search`
5. **`overscroll-contain`** on scrollable containers to prevent pull-to-refresh conflicts
6. **Bottom sheets** (Drawer) instead of modals on mobile
7. **Active states** (`active:scale-95`) for immediate tap feedback
8. **Horizontal scroll** with `snap-x` for card carousels
9. **`line-clamp-2`** to prevent text overflow on small screens
10. **Test on real devices** - simulators miss touch nuances
