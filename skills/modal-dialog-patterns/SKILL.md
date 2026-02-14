---
name: modal-dialog-patterns
description: "Modal and dialog patterns: multi-step modals, slide-over panels, confirmation dialogs, nested dialogs, drawer panels, full-screen modals, responsive sheet/dialog. Works with Next.js and Astro."
---

Use this skill when the user mentions modal, dialog, slide-over, drawer, panel, confirmation dialog, multi-step modal, full-screen modal, or sheet. Triggers on: modal, dialog, slide-over, drawer, panel, confirmation, sheet, overlay.

You are an expert at building polished modal and dialog experiences with shadcn/ui.

## Multi-Step Modal

```tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface Step { title: string; description: string; content: React.ReactNode }

export function MultiStepModal({ steps, open, onOpenChange, onComplete }: {
  steps: Step[]; open: boolean; onOpenChange: (open: boolean) => void; onComplete: (data: unknown) => void
}) {
  const [current, setCurrent] = useState(0)
  const step = steps[current]
  const progress = ((current + 1) / steps.length) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Step {current + 1} of {steps.length}</span>
          </div>
          <Progress value={progress} className="h-1 mb-4" />
          <DialogTitle>{step.title}</DialogTitle>
          <DialogDescription>{step.description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">{step.content}</div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>
            Back
          </Button>
          {current < steps.length - 1 ? (
            <Button onClick={() => setCurrent(c => c + 1)}>Continue</Button>
          ) : (
            <Button onClick={() => onComplete(null)}>Complete</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

## Slide-Over Panel

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'

export function SlideOver({ open, onOpenChange, title, description, children, footer }: {
  open: boolean; onOpenChange: (open: boolean) => void; title: string;
  description?: string; children: React.ReactNode; footer?: React.ReactNode
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="py-6">{children}</div>
        {footer && <SheetFooter className="border-t pt-4">{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  )
}

// Usage: slide-over detail panel
<SlideOver
  open={detailOpen}
  onOpenChange={setDetailOpen}
  title="Order Details"
  description="Order #12345"
  footer={<Button className="w-full">Mark as Shipped</Button>}
>
  <OrderDetails order={selectedOrder} />
</SlideOver>
```

## Confirmation Dialog (Destructive)

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, loading, variant = 'destructive' }: {
  open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string;
  onConfirm: () => void; loading?: boolean; variant?: 'destructive' | 'default'
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Responsive Dialog (Dialog on desktop, Sheet on mobile)

```tsx
'use client'

import { useMediaQuery } from '@/hooks/use-media-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'

export function ResponsiveDialog({ open, onOpenChange, title, description, children }: {
  open: boolean; onOpenChange: (open: boolean) => void;
  title: string; description?: string; children: React.ReactNode
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="px-4 pb-4">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}

// useMediaQuery hook
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])
  return matches
}
```

## Full-Screen Modal

```tsx
import { Dialog, DialogContent } from '@/components/ui/dialog'

export function FullScreenModal({ open, onOpenChange, children }: {
  open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-screen h-screen m-0 rounded-none p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b px-6 py-3">
            <span className="text-lg font-semibold">Preview</span>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-6">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

## Best Practices

1. Use `Dialog` for focused actions, `Sheet` for detail panels/forms
2. Multi-step: show progress bar + step count, always allow going back
3. Confirmation dialogs: use `AlertDialog` (requires explicit action to close)
4. Destructive confirms: red action button, clear description of consequences
5. Responsive: `Dialog` on desktop, `Drawer` on mobile (bottom sheet)
6. Full-screen modals: only for preview/immersive experiences
7. Loading state: disable both Cancel and Confirm, show spinner on action button
8. Always provide keyboard escape (Escape key closes)
9. Max modal width: `sm:max-w-lg` for forms, `sm:max-w-2xl` for content
10. For Astro: mount dialog components as React islands with `client:load`
