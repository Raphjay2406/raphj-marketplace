---
name: onboarding-tours
description: "Onboarding tour patterns: product tours, feature highlights, tooltip walkthroughs, coachmarks, progressive disclosure, step-by-step guides, hotspot indicators. Works with Next.js and Astro."
---

Use this skill when the user mentions product tour, onboarding tour, feature highlight, tooltip walkthrough, coachmark, guided tour, or step-by-step guide. Triggers on: tour, onboarding tour, product tour, coachmark, walkthrough, highlight, guided, tooltip guide.

You are an expert at building onboarding and tour UIs with shadcn/ui.

## Tooltip Tour Component

```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X } from 'lucide-react'

interface TourStep {
  target: string // CSS selector
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tour({ steps, onComplete }: { steps: TourStep[]; onComplete: () => void }) {
  const [current, setCurrent] = useState(0)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const step = steps[current]

  const updatePosition = useCallback(() => {
    const el = document.querySelector(step.target)
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })

    const pos = step.position ?? 'bottom'
    let top = 0, left = 0
    if (pos === 'bottom') { top = rect.bottom + 12; left = rect.left + rect.width / 2 }
    else if (pos === 'top') { top = rect.top - 12; left = rect.left + rect.width / 2 }
    else if (pos === 'right') { top = rect.top + rect.height / 2; left = rect.right + 12 }
    else { top = rect.top + rect.height / 2; left = rect.left - 12 }

    setCoords({ top, left })
  }, [step])

  useEffect(() => {
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [updatePosition])

  // Highlight target element
  useEffect(() => {
    const el = document.querySelector(step.target) as HTMLElement
    if (el) {
      el.style.position = 'relative'
      el.style.zIndex = '60'
      el.style.boxShadow = '0 0 0 4px hsl(var(--primary) / 0.3)'
      el.style.borderRadius = '8px'
      return () => {
        el.style.position = ''
        el.style.zIndex = ''
        el.style.boxShadow = ''
        el.style.borderRadius = ''
      }
    }
  }, [step])

  const next = () => {
    if (current < steps.length - 1) setCurrent(c => c + 1)
    else onComplete()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" />

      {/* Tooltip */}
      <Card
        className="fixed z-[60] w-80 shadow-xl"
        style={{
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          transform: step.position === 'top' ? 'translate(-50%, -100%)' :
            step.position === 'left' ? 'translate(-100%, -50%)' :
            step.position === 'right' ? 'translate(0, -50%)' : 'translate(-50%, 0)',
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground">Step {current + 1} of {steps.length}</p>
              <h3 className="font-semibold mt-1">{step.title}</h3>
            </div>
            <button onClick={onComplete}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <p className="text-sm text-muted-foreground">{step.description}</p>
          <div className="flex items-center justify-between mt-4">
            <Button variant="ghost" size="sm" onClick={onComplete}>Skip tour</Button>
            <div className="flex gap-2">
              {current > 0 && (
                <Button variant="outline" size="sm" onClick={() => setCurrent(c => c - 1)}>Back</Button>
              )}
              <Button size="sm" onClick={next}>
                {current < steps.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// Usage
const tourSteps: TourStep[] = [
  { target: '[data-tour="sidebar"]', title: 'Navigation', description: 'Access all sections from the sidebar.', position: 'right' },
  { target: '[data-tour="search"]', title: 'Quick Search', description: 'Press Cmd+K to search anything.', position: 'bottom' },
  { target: '[data-tour="create"]', title: 'Create New', description: 'Click here to create a new project.', position: 'bottom' },
]
```

## Hotspot Indicator

```tsx
function Hotspot({ children, label }: { children: React.ReactNode; label: string }) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return <>{children}</>

  return (
    <div className="relative">
      {children}
      <div className="absolute -top-1 -right-1 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64" side="bottom">
            <p className="text-sm">{label}</p>
            <Button size="sm" variant="ghost" className="mt-2" onClick={() => setDismissed(true)}>
              Got it
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

// Usage
<Hotspot label="New feature! Click here to view analytics.">
  <Button>Analytics</Button>
</Hotspot>
```

## Progressive Disclosure Checklist

```tsx
function OnboardingChecklist({ tasks, onDismiss }: {
  tasks: { id: string; title: string; description: string; completed: boolean; action: () => void }[]
  onDismiss: () => void
}) {
  const completed = tasks.filter(t => t.completed).length
  const progress = (completed / tasks.length) * 100

  return (
    <Card className="w-80">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Getting Started</h3>
          <button onClick={onDismiss}><X className="h-4 w-4 text-muted-foreground" /></button>
        </div>
        <Progress value={progress} className="h-1.5 mb-1" />
        <p className="text-xs text-muted-foreground mb-4">{completed}/{tasks.length} completed</p>
        <div className="space-y-3">
          {tasks.map(task => (
            <button
              key={task.id}
              onClick={task.action}
              className={cn(
                'flex items-start gap-3 w-full text-left rounded-md p-2 -mx-2 transition-colors',
                task.completed ? 'opacity-60' : 'hover:bg-accent'
              )}
            >
              <div className={cn(
                'mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0',
                task.completed ? 'border-primary bg-primary' : 'border-muted-foreground'
              )}>
                {task.completed && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div>
                <p className={cn('text-sm font-medium', task.completed && 'line-through')}>{task.title}</p>
                <p className="text-xs text-muted-foreground">{task.description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

## Best Practices

1. Tours: max 5-7 steps, always allow skip, persist completion in localStorage
2. Highlight target with box-shadow ring and elevated z-index
3. Backdrop: semi-transparent overlay with target element cut out
4. Hotspots: pulsing dot for new features, dismiss with "Got it"
5. Onboarding checklist: show progress bar, celebrate completion
6. Position tooltip to avoid viewport overflow (flip if necessary)
7. Scroll target into view before showing tooltip
8. Mark `data-tour="name"` attributes on target elements
9. For Astro: mount tour as React island with `client:load`
10. Trigger tour on first login (check localStorage/API flag), not on every visit
