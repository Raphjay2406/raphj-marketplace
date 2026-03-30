---
name: map-location
description: "Map and location UI patterns: Google Maps/Mapbox integration, store locators, location pickers, address autocomplete, geolocation, interactive markers. Works with Next.js and Astro."
---

Use this skill when the user mentions map, Google Maps, Mapbox, location picker, store locator, address autocomplete, geolocation, or markers. Triggers on: map, Google Maps, Mapbox, location, store locator, address, geolocation, marker.

You are an expert at building map and location UIs.

## Mapbox GL Integration (Next.js)

```bash
npm install mapbox-gl @types/mapbox-gl
```

```tsx
'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

interface MapProps {
  center?: [number, number]
  zoom?: number
  markers?: { lng: number; lat: number; label: string }[]
  className?: string
}

export function Map({ center = [-73.98, 40.75], zoom = 12, markers = [], className }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center,
      zoom,
    })
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    mapRef.current = map

    markers.forEach(m => {
      new mapboxgl.Marker()
        .setLngLat([m.lng, m.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<p class="text-sm font-medium">${m.label}</p>`))
        .addTo(map)
    })

    return () => map.remove()
  }, [center, zoom, markers])

  return <div ref={containerRef} className={cn('h-[400px] w-full rounded-lg', className)} />
}
```

## Store Locator

```tsx
'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'

function StoreLocator({ stores }: { stores: Store[] }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Store | null>(null)

  const filtered = useMemo(() => {
    if (!search) return stores
    const q = search.toLowerCase()
    return stores.filter(s =>
      s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
    )
  }, [stores, search])

  return (
    <div className="grid lg:grid-cols-[350px_1fr] gap-4 h-[600px]">
      {/* Sidebar */}
      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by city, zip, or name..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <p className="text-xs text-muted-foreground">{filtered.length} locations found</p>
        <div className="flex-1 overflow-y-auto space-y-2">
          {filtered.map(store => (
            <Card
              key={store.id}
              className={cn('cursor-pointer transition-colors', selected?.id === store.id && 'border-primary')}
              onClick={() => setSelected(store)}
            >
              <CardContent className="p-3">
                <h3 className="font-medium text-sm">{store.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{store.address}, {store.city}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{store.phone}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{store.hours}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Map */}
      <Map
        center={selected ? [selected.lng, selected.lat] : undefined}
        zoom={selected ? 15 : 12}
        markers={filtered.map(s => ({ lng: s.lng, lat: s.lat, label: s.name }))}
      />
    </div>
  )
}
```

## Address Autocomplete

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover'

export function AddressAutocomplete({ onSelect }: { onSelect: (address: AddressResult) => void }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<AddressResult[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (query.length < 3) { setSuggestions([]); return }
    const timer = setTimeout(async () => {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=address&limit=5`
      )
      const data = await res.json()
      setSuggestions(data.features.map((f: any) => ({
        label: f.place_name,
        lat: f.center[1],
        lng: f.center[0],
      })))
      setOpen(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          placeholder="Start typing an address..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </PopoverAnchor>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {suggestions.map((s, i) => (
                <CommandItem key={i} onSelect={() => { onSelect(s); setQuery(s.label); setOpen(false) }}>
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  {s.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

## Astro Map Component

```astro
---
// Static map image for Astro (no JS needed)
const { lat, lng, zoom = 14, width = 800, height = 400 } = Astro.props;
const token = import.meta.env.PUBLIC_MAPBOX_TOKEN;
const src = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l+3b82f6(${lng},${lat})/${lng},${lat},${zoom}/${width}x${height}@2x?access_token=${token}`;
---

<img src={src} alt="Location map" width={width} height={height} class="rounded-lg w-full" loading="lazy" />

<!-- Or use interactive React island -->
<Map client:visible center={[lng, lat]} markers={markers} />
```

## Best Practices

1. Use Mapbox GL JS for interactive maps (free tier: 50k loads/month)
2. Store locator: sidebar list + map, highlight selected, filter by search
3. Address autocomplete: debounce 300ms, min 3 chars, Mapbox Geocoding API
4. For Astro: use Mapbox Static Images API for zero-JS static maps
5. Add `NavigationControl` for zoom/rotation controls
6. Popups: use `mapboxgl.Popup` for click-to-reveal info
7. Dark mode: switch to `mapbox://styles/mapbox/dark-v11`
8. Mobile: stack sidebar above map, reduce map height
9. Geolocation: use `navigator.geolocation` with user permission
10. Always lazy-load map components (below fold) to avoid LCP impact
