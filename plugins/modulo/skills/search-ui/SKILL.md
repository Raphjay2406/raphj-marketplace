---
name: search-ui
description: "Search UI patterns: full-text search with Algolia/Meilisearch, faceted filtering, search results page, autocomplete dropdown, recent searches, search highlighting, Cmd+K dialog. Works with Next.js and Astro."
---

Use this skill when the user mentions search page, search results, faceted search, filters, autocomplete, search bar, Algolia, Meilisearch, Cmd+K, or search highlighting. Triggers on: search, filter, facet, autocomplete, Algolia, Meilisearch, search results, search page.

You are an expert at building search experiences with shadcn/ui.

## Search Results Page

```tsx
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

function SearchPage() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [results, setResults] = useState<SearchResult[]>([])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          className="pl-10 pr-10 h-12 text-lg"
          placeholder="Search articles, products, docs..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setQuery('')}>
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Active filters */}
      {Object.entries(filters).flatMap(([k, v]) => v).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(filters).flatMap(([facet, values]) =>
            values.map(v => (
              <Badge key={`${facet}-${v}`} variant="secondary" className="gap-1">
                {v}
                <button onClick={() => toggleFilter(facet, v)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
          <Button variant="ghost" size="sm" onClick={() => setFilters({})}>Clear all</Button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop facets sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FacetSidebar filters={filters} onToggle={toggleFilter} />
        </aside>

        {/* Mobile filter sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="lg:hidden mb-4">
              <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
            <FacetSidebar filters={filters} onToggle={toggleFilter} />
          </SheetContent>
        </Sheet>

        {/* Results */}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-4">{results.length} results for "{query}"</p>
          <div className="space-y-4">
            {results.map(result => (
              <SearchResultCard key={result.id} result={result} query={query} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Facet Sidebar

```tsx
function FacetSidebar({ facets, filters, onToggle }: FacetSidebarProps) {
  return (
    <div className="space-y-6">
      {facets.map(facet => (
        <div key={facet.name}>
          <h3 className="text-sm font-semibold mb-3">{facet.label}</h3>
          <div className="space-y-2">
            {facet.options.map(option => (
              <label key={option.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={filters[facet.name]?.includes(option.value)}
                  onCheckedChange={() => onToggle(facet.name, option.value)}
                />
                <span className="flex-1">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.count}</span>
              </label>
            ))}
          </div>
          <Separator className="mt-4" />
        </div>
      ))}
    </div>
  )
}
```

## Search Result Card with Highlighting

```tsx
function SearchResultCard({ result, query }: { result: SearchResult; query: string }) {
  const highlight = (text: string) => {
    if (!query) return text
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-900 rounded-sm px-0.5">{part}</mark> : part
    )
  }

  return (
    <a href={result.url} className="block rounded-lg border p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-medium truncate">{highlight(result.title)}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{highlight(result.excerpt)}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">{result.category}</Badge>
            <span className="text-xs text-muted-foreground">{result.date}</span>
          </div>
        </div>
        {result.image && (
          <img src={result.image} alt="" className="h-16 w-16 rounded-md object-cover shrink-0" />
        )}
      </div>
    </a>
  )
}
```

## Recent Searches

```tsx
function RecentSearches({ onSelect }: { onSelect: (q: string) => void }) {
  const [recent, setRecent] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem('recent-searches') || '[]')
  })

  const remove = (q: string) => {
    const updated = recent.filter(r => r !== q)
    setRecent(updated)
    localStorage.setItem('recent-searches', JSON.stringify(updated))
  }

  if (recent.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between px-2 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">Recent searches</span>
        <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => { setRecent([]); localStorage.removeItem('recent-searches') }}>
          Clear
        </button>
      </div>
      {recent.map(q => (
        <button key={q} className="flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm" onClick={() => onSelect(q)}>
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="flex-1 text-left">{q}</span>
          <button onClick={e => { e.stopPropagation(); remove(q) }}>
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </button>
      ))}
    </div>
  )
}
```

## Astro Search Page

```astro
---
// src/pages/search.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Search" description="Search our content.">
  <div id="search-app">
    <!-- React search component mounted as island -->
    <SearchPage client:load />
  </div>
</BaseLayout>
```

## Best Practices

1. Debounce search input (300ms) to reduce API calls
2. Show result count and active query
3. Highlight matching terms in results with `<mark>`
4. Faceted filters: checkboxes with counts, mobile in Sheet
5. Persist recent searches in localStorage (max 5-10)
6. Use URL search params for shareable search state (`?q=term&category=blog`)
7. Show skeleton loading during search, not a spinner
8. Empty state: suggest popular searches or categories
9. For Astro: mount search as React island with `client:load`
10. Keyboard: focus search on `/` or `Cmd+K`, navigate results with arrow keys
