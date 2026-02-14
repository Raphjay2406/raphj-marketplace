---
name: pwa-patterns
description: "PWA patterns: service workers, install prompts, offline caching strategies, push notifications, app manifest, update prompts, background sync, add-to-homescreen. Works with Next.js and Astro."
---

Use this skill when the user mentions PWA, service worker, offline, install prompt, push notification, app manifest, add to home screen, cache strategy, or background sync. Triggers on: PWA, service worker, offline, install, push notification, manifest, homescreen, cache.

You are an expert at building Progressive Web Apps.

## Web App Manifest

```json
// public/manifest.json
{
  "name": "App Name",
  "short_name": "App",
  "description": "A premium web application.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "screenshots": [
    { "src": "/screenshot-wide.png", "sizes": "1280x720", "type": "image/png", "form_factor": "wide" },
    { "src": "/screenshot-narrow.png", "sizes": "750x1334", "type": "image/png", "form_factor": "narrow" }
  ]
}
```

## Next.js PWA Setup (next-pwa)

```bash
npm install @ducanh2912/next-pwa
```

```js
// next.config.js
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
})

module.exports = withPWA({
  // your next config
})
```

## Custom Service Worker

```js
// public/sw.js
const CACHE_NAME = 'app-cache-v1'
const OFFLINE_URL = '/offline'

const PRECACHE_URLS = ['/', '/offline', '/icon-192.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    )
    return
  }

  // Stale-while-revalidate for assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then((response) => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        return response
      })
      return cached || fetched
    })
  )
})
```

## Install Prompt Component

```tsx
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, X } from 'lucide-react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!deferredPrompt || dismissed) return null

  const install = async () => {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDeferredPrompt(null)
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Install App</p>
            <p className="text-xs text-muted-foreground mt-1">Add to your home screen for quick access.</p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={install}>Install</Button>
              <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>Not now</Button>
            </div>
          </div>
          <button onClick={() => setDismissed(true)}>
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Update Available Prompt

```tsx
'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function ServiceWorkerUpdater() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              toast('Update available', {
                description: 'A new version is available.',
                action: {
                  label: 'Refresh',
                  onClick: () => window.location.reload(),
                },
                duration: Infinity,
              })
            }
          })
        })
      })
    }
  }, [])

  return null
}
```

## Astro PWA Setup

```js
// astro.config.mjs
import AstroPWA from '@vite-pwa/astro'

export default defineConfig({
  integrations: [
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'App Name',
        short_name: 'App',
        theme_color: '#3b82f6',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        navigateFallback: '/offline',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
      },
    }),
  ],
})
```

## Best Practices

1. Manifest: include `maskable` icon (safe zone for different OS shapes)
2. Screenshots: include both `wide` and `narrow` form factors for richer install UI
3. Service worker: stale-while-revalidate for assets, network-first for API calls
4. Install prompt: show after user engagement (not immediately), allow dismissal
5. Update prompt: use Sonner toast with "Refresh" action, don't auto-reload
6. Offline page: custom `/offline` page with branding, not browser default
7. Cache versioning: bump `CACHE_NAME` on deploy, clean old caches on activate
8. For Next.js: use `@ducanh2912/next-pwa` for automatic Workbox integration
9. For Astro: use `@vite-pwa/astro` with `registerType: 'autoUpdate'`
10. Test: Chrome DevTools > Application > Service Workers + Manifest panels
