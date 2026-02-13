---
name: responsive-layout
description: "Layout systems, grid patterns, breakpoint strategies, mobile-first design, and container queries for responsive UIs."
---

Use this skill when the user mentions layout, grid, responsive, mobile-first, breakpoints, sidebar layout, holy grail layout, or container queries.

You are an expert at building responsive layouts that work across all screen sizes.

## Core Layout Patterns

### Sidebar + Main Content
```tsx
<div className="flex min-h-screen">
  <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r bg-muted/40">
    <nav className="flex-1 p-4 space-y-2">{/* Nav items */}</nav>
  </aside>
  <main className="flex-1 overflow-auto">
    <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
  </main>
</div>
```

### Sticky Header + Scrollable Content
```tsx
<div className="flex flex-col h-dvh">
  <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 items-center">{/* Header */}</div>
  </header>
  <main className="flex-1 overflow-auto">{children}</main>
  <footer className="border-t py-4">{/* Footer */}</footer>
</div>
```

### Holy Grail Layout
```tsx
<div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
  <header className="border-b px-6 py-3">{/* Header */}</header>
  <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_240px]">
    <aside className="hidden md:block border-r p-4">{/* Left sidebar */}</aside>
    <main className="p-6">{children}</main>
    <aside className="hidden lg:block border-l p-4">{/* Right sidebar */}</aside>
  </div>
  <footer className="border-t px-6 py-3">{/* Footer */}</footer>
</div>
```

## Grid Patterns

### Auto-fit Responsive Grid (no breakpoints needed)
```tsx
<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
  {items.map(item => <Card key={item.id}>{/* ... */}</Card>)}
</div>
```

### Dashboard Grid
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card className="md:col-span-2 lg:col-span-1">{/* Stat */}</Card>
  <Card>{/* Stat */}</Card>
  <Card>{/* Stat */}</Card>
  <Card>{/* Stat */}</Card>
</div>
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
  <Card className="lg:col-span-4">{/* Chart */}</Card>
  <Card className="lg:col-span-3">{/* Recent activity */}</Card>
</div>
```

### Masonry-like with CSS Columns
```tsx
<div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
  {items.map(item => (
    <div key={item.id} className="break-inside-avoid">{/* Card */}</div>
  ))}
</div>
```

### Bento Grid
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
  <div className="col-span-2 row-span-2 rounded-xl bg-muted p-6">{/* Large */}</div>
  <div className="rounded-xl bg-muted p-6">{/* Small */}</div>
  <div className="rounded-xl bg-muted p-6">{/* Small */}</div>
  <div className="col-span-2 rounded-xl bg-muted p-6">{/* Wide */}</div>
</div>
```

## Stack Pattern
```tsx
// Vertical stack with consistent spacing
<div className="flex flex-col gap-4">{children}</div>

// Horizontal stack, wrapping
<div className="flex flex-wrap gap-2">{tags.map(t => <Badge key={t}>{t}</Badge>)}</div>

// Stack that switches direction
<div className="flex flex-col sm:flex-row gap-4">{children}</div>
```

## Container Queries
```tsx
// Parent: mark as container
<div className="@container">
  <div className="flex flex-col @md:flex-row @lg:grid @lg:grid-cols-3 gap-4">
    {/* Responds to parent width, not viewport */}
  </div>
</div>
```

## Centering Patterns
```tsx
// Flex center
<div className="flex items-center justify-center min-h-screen">{children}</div>

// Grid center
<div className="grid place-items-center min-h-screen">{children}</div>

// Content width center
<div className="mx-auto max-w-2xl px-4">{children}</div>
```

## Mobile Navigation Patterns

### Bottom Nav (Mobile)
```tsx
<nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
  <div className="flex items-center justify-around h-16">
    {navItems.map(item => (
      <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
        <item.icon className="h-5 w-5" />
        {item.label}
      </Link>
    ))}
  </div>
</nav>
<main className="pb-16 md:pb-0">{/* Add bottom padding on mobile */}</main>
```

### Hamburger Menu
```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-72">
    <nav className="flex flex-col gap-2 mt-6">{/* Nav items */}</nav>
  </SheetContent>
</Sheet>
```

## Best Practices

1. Always design mobile-first, then add larger breakpoint overrides
2. Use `auto-fit` / `auto-fill` with `minmax()` for intrinsic responsive grids
3. Use `dvh` (dynamic viewport height) instead of `vh` on mobile
4. Add `overflow-auto` on scrollable containers
5. Use `container mx-auto px-4` for consistent max-width and padding
6. Use `@container` queries for component-level responsiveness
7. Test at common breakpoints: 375px, 768px, 1024px, 1440px
8. Use `hidden md:block` / `block md:hidden` for responsive visibility
