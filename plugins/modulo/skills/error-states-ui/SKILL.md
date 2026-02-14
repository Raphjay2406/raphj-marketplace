---
name: error-states-ui
description: "Error state UI patterns: 404/500 pages, error boundaries, empty states, offline indicators, retry patterns, skeleton fallbacks, toast error feedback. Works with Next.js and Astro."
---

Use this skill when the user mentions error pages, 404, 500, error boundaries, empty states, offline mode, retry, fallback UI, or error handling UI. Triggers on: error page, 404, 500, empty state, offline, retry, error boundary, fallback, not found.

You are an expert at building polished error and fallback UIs with shadcn/ui.

## Next.js Error Boundary (app/error.tsx)

```tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-6">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Go Home
        </Button>
        <Button onClick={() => reset()}>Try Again</Button>
      </div>
      {error.digest && (
        <p className="text-xs text-muted-foreground mt-4">Error ID: {error.digest}</p>
      )}
    </div>
  )
}
```

## Next.js Not Found (app/not-found.tsx)

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="rounded-full bg-muted p-4 mb-6">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-7xl font-bold tracking-tighter mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-2">Page not found</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild>
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}
```

## Astro 404 Page

```astro
---
// src/pages/404.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Page Not Found" description="The page you're looking for doesn't exist.">
  <div class="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
    <div class="rounded-full bg-muted p-4 mb-6">
      <svg class="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h1 class="text-7xl font-bold tracking-tighter mb-2">404</h1>
    <h2 class="text-xl font-semibold mb-2">Page not found</h2>
    <p class="text-muted-foreground max-w-md mb-6">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <a href="/" class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
      Go Home
    </a>
  </div>
</BaseLayout>
```

## Empty State Component

```tsx
import { type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}

// Usage
<EmptyState
  icon={Inbox}
  title="No messages yet"
  description="When you receive messages, they'll appear here."
  action={{ label: 'Compose', onClick: () => setOpen(true) }}
/>
```

## Offline Indicator

```tsx
'use client'

import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => setIsOffline(false)
    setIsOffline(!navigator.onLine)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm text-destructive-foreground shadow-lg">
      <WifiOff className="h-4 w-4" />
      You're offline
    </div>
  )
}
```

## Retry with Exponential Backoff

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

function useRetry<T>(fn: () => Promise<T>, maxRetries = 3) {
  const [state, setState] = useState<{
    data: T | null; error: string | null; loading: boolean; attempt: number
  }>({ data: null, error: null, loading: false, attempt: 0 })

  const execute = async () => {
    setState(s => ({ ...s, loading: true, error: null }))
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const data = await fn()
        setState({ data, error: null, loading: false, attempt })
        return data
      } catch (err) {
        if (attempt === maxRetries) {
          setState({ data: null, error: (err as Error).message, loading: false, attempt })
        } else {
          await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
          setState(s => ({ ...s, attempt: attempt + 1 }))
        }
      }
    }
  }

  return { ...state, execute }
}

// Usage
function DataLoader() {
  const { data, error, loading, attempt, execute } = useRetry(
    () => fetch('/api/data').then(r => { if (!r.ok) throw new Error('Failed'); return r.json() })
  )

  return (
    <div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error} (attempted {attempt + 1} times)</span>
            <Button variant="outline" size="sm" onClick={execute} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {data && <div>{/* render data */}</div>}
    </div>
  )
}
```

## Inline Error with Retry

```tsx
function InlineError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-destructive">Failed to load</p>
          <p className="text-xs text-muted-foreground mt-1">{message}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
```

## Best Practices

1. Every route should have an `error.tsx` boundary in Next.js App Router
2. Always provide a "Go Home" escape hatch on error pages
3. Use empty states with actions — never show a blank page
4. Show offline indicators at the bottom center (non-intrusive)
5. Retry with exponential backoff (1s, 2s, 4s) and max attempts
6. Include error digest/ID for support debugging
7. 404 pages should suggest navigation alternatives
8. Match error page design to the site's overall aesthetic
9. For Astro: create `src/pages/404.astro` (Astro serves this automatically)
10. Use `loading.tsx` in Next.js for Suspense fallbacks between error states
