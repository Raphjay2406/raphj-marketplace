---
name: "dashboard-patterns"
description: "Dashboard UI patterns: data-dense layouts, metric cards, chart integration, sidebar navigation, command palettes, settings pages -- with container queries, DNA tokens, and accessible data presentation."
tier: "domain"
triggers: "dashboard, admin, analytics, stat card, sidebar, chart layout, settings, onboarding, activity feed, breadcrumb, role, panel, metrics"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- Project is a dashboard, admin panel, or analytics interface
- Any application with a persistent sidebar and data-driven content area
- SaaS products with settings pages, onboarding wizards, or activity feeds
- Internal tools with role-based navigation and metric displays

### When NOT to Use

- Marketing landing pages -- use `multi-page-architecture` + `emotional-arc` instead
- Product catalog / e-commerce -- use `ecommerce-ui` instead
- Content-heavy blogs or articles -- use `blog-patterns` instead

### Decision Tree

- Sidebar navigation? Use responsive sidebar: persistent on desktop, overlay on mobile
- Metric cards? Use `@container` queries -- cards must resize to their grid cell, not the viewport
- Data tables? Use semantic `<table>` with proper `<thead>`, `<th scope>`, and `aria-sort` for sortable columns
- Settings page? Tab-based layout with danger zone isolated at bottom
- Command palette? `Ctrl+K` / `Cmd+K` dialog with search, navigation, and actions grouped
- Multi-step onboarding? Wizard with step indicator, per-step validation, back/next navigation

### Pipeline Connection

- **Referenced by:** section-builder during dashboard/admin section builds
- **Consumed at:** `/gen:execute` wave 2+ for dashboard layouts
- **Related commands:** `/gen:plan-dev` for dashboard section planning

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Container Query Metric Card

```tsx
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
}

export function MetricCard({ title, value, change, trend, icon: Icon }: MetricCardProps) {
  return (
    <article
      className="@container rounded-lg border border-border bg-surface p-4 @sm:p-6"
      aria-label={`${title}: ${value}, ${change} ${trend}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted @sm:text-sm">{title}</h3>
        <Icon className="size-4 text-muted" aria-hidden="true" />
      </div>
      <div className="mt-2">
        <p className="text-xl font-bold text-text tabular-nums @sm:text-2xl">{value}</p>
        <p
          className={`mt-1 flex items-center text-xs ${
            trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRightIcon className="size-3 me-0.5" aria-hidden="true" />
          ) : (
            <ArrowDownRightIcon className="size-3 me-0.5" aria-hidden="true" />
          )}
          <span>{change} from last period</span>
        </p>
      </div>
    </article>
  );
}
```

#### Pattern: Responsive Dashboard Shell

```tsx
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh bg-bg">
      {/* Backdrop for mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-bg/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 start-0 z-50 w-64 border-e border-border bg-surface motion-safe:transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        }`}
        aria-label="Main navigation"
      >
        <nav className="flex h-full flex-col gap-2 p-4">
          <div className="flex items-center gap-2 px-2 py-4">
            <span className="text-lg font-bold text-text">Dashboard</span>
          </div>
          <SidebarNav />
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b border-border bg-surface px-4 lg:px-6">
          <button
            className="grid size-9 place-items-center rounded-md hover:bg-bg lg:hidden focus-visible:outline-2 focus-visible:outline-primary"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <MenuIcon className="size-5 text-text" />
          </button>
          <div className="ms-auto flex items-center gap-3">
            <CommandPaletteTrigger />
            <ThemeToggle />
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

#### Pattern: Accessible Data Table

```tsx
interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  sortKey: keyof T | null;
  sortDir: "asc" | "desc";
  onSort: (key: keyof T) => void;
  caption: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  sortKey,
  sortDir,
  onSort,
  caption,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border bg-surface">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className="px-4 py-3 text-start text-xs font-medium text-muted uppercase tracking-wider"
                aria-sort={
                  sortKey === col.key
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                {col.sortable ? (
                  <button
                    className="inline-flex items-center gap-1 hover:text-text focus-visible:outline-2 focus-visible:outline-primary rounded"
                    onClick={() => onSort(col.key)}
                  >
                    {col.label}
                    <SortIcon
                      active={sortKey === col.key}
                      direction={sortKey === col.key ? sortDir : undefined}
                      className="size-3.5"
                    />
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-surface/50 motion-safe:transition-colors">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-text">
                  {String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### Pattern: Command Palette

```tsx
"use client";

import { useEffect, useState, useRef } from "react";

interface CommandItem {
  id: string;
  label: string;
  group: string;
  icon?: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export function CommandPalette({
  items,
  open,
  onClose,
}: {
  items: CommandItem[];
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );
  const groups = [...new Set(filtered.map((i) => i.group))];

  useEffect(() => {
    if (open) {
      setQuery("");
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        open ? onClose() : undefined;
      }
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-bg/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg rounded-xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-center border-b border-border px-3">
          <SearchIcon className="size-4 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent px-3 py-3 text-sm text-text placeholder:text-muted outline-none"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search commands"
          />
          <kbd className="rounded bg-bg px-1.5 py-0.5 text-[10px] text-muted">Esc</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2" role="listbox">
          {groups.map((group) => (
            <div key={group} role="group" aria-label={group}>
              <p className="px-2 py-1.5 text-xs font-medium text-muted">{group}</p>
              {filtered
                .filter((i) => i.group === group)
                .map((item) => (
                  <button
                    key={item.id}
                    role="option"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-text hover:bg-bg focus-visible:bg-bg focus-visible:outline-none"
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                  >
                    {item.icon && <item.icon className="size-4 text-muted" />}
                    {item.label}
                  </button>
                ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-muted">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

#### Pattern: Breadcrumb Navigation

```tsx
interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRightIcon className="size-3.5 text-muted rtl:rotate-180" aria-hidden="true" />
            )}
            {i < items.length - 1 ? (
              <a href={item.href} className="text-muted hover:text-text motion-safe:transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="font-medium text-text" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### Reference Sites

- **Linear** (linear.app) -- Best-in-class dashboard UX: keyboard-first navigation, command palette, responsive sidebar, clean metric presentation
- **Vercel Dashboard** (vercel.com/dashboard) -- Excellent container-aware metric cards, data-dense but clear hierarchy, strong dark mode
- **Stripe Dashboard** (dashboard.stripe.com) -- Award-caliber data tables, progressive disclosure, accessible chart tooltips, clean breadcrumb navigation

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Dashboards |
|-----------|-------------------|
| `bg-bg` | Main content area background |
| `bg-surface` | Sidebar, cards, header, elevated panels |
| `text-text` | Primary content, metric values, table cells |
| `text-muted` | Labels, secondary text, breadcrumb links |
| `border-border` | Card outlines, table dividers, sidebar border |
| `bg-primary` | Active nav item, primary action buttons |
| `bg-accent` | Notification badges, status indicators |
| `--font-mono` | Metric values, code snippets, tabular data |
| `--motion-duration` | Sidebar slide, card hover, row highlight transitions |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Data-Dense | Compact spacing, smaller type, more information per card, dense table rows |
| Neo-Corporate | Clean panels with subtle shadows, polished card borders, professional metric hierarchy |
| AI-Native | Conversational sidebar, monospace metrics, blue-purple accent palette, data viz decorations |
| Swiss/International | Grid-strict layouts, no decorative shadows, clean lines, uppercase labels |
| Brutalist | Raw borders, no border-radius, stark contrast, bold type hierarchy |
| Dark Academia | Warm surface tones, serif headings in cards, understated metric presentation |
| Glassmorphism | Frosted glass sidebar and cards, blur backgrounds, subtle transparency layers |

### Related Skills

- `tailwind-system` -- DNA token classes, `@container` configuration, dark mode
- `accessibility` -- Focus indicators, ARIA patterns, keyboard navigation for data tables and command palette
- `responsive-design` -- Sidebar collapse breakpoint, container query metric cards
- `form-builder` -- Settings form patterns, inline editing, filter controls
- `dark-light-mode` -- Dashboard theme toggle, sidebar theme-aware styling

## Layer 4: Anti-Patterns

### Anti-Pattern: Viewport-Based Card Layouts

**What goes wrong:** Metric cards use `md:grid-cols-4` media queries. When the dashboard has a sidebar, the main area is narrower than the viewport, so cards crowd together at "desktop" breakpoints or show too many columns in the available space.
**Instead:** Wrap the card grid in `@container` and use `@md:grid-cols-2 @lg:grid-cols-4`. Cards respond to their actual container width, working correctly whether the sidebar is open, closed, or absent.

### Anti-Pattern: Fixed Sidebar on Mobile

**What goes wrong:** Sidebar is always visible and pushes content off-screen on small viewports. Users cannot access the main content area without scrolling horizontally.
**Instead:** Sidebar is hidden by default on mobile (`-translate-x-full lg:translate-x-0`), triggered by a hamburger button, and overlays the content with a backdrop. Use `lg:static` to make it persistent on desktop.

### Anti-Pattern: Inaccessible Data Tables

**What goes wrong:** Tables built with `<div>` elements instead of semantic `<table>`, `<thead>`, `<th>`. Missing `scope="col"`, no `aria-sort` on sortable columns, no `<caption>` describing the table. Screen readers cannot navigate cells or understand column relationships.
**Instead:** Use semantic HTML table elements. Add `scope="col"` to `<th>`, `aria-sort="ascending"` or `"descending"` on active sort column, `<caption>` (visually hidden if needed) describing the data. Wrap in `overflow-x-auto` for horizontal scroll on narrow containers.

### Anti-Pattern: Command Palette Without Keyboard Support

**What goes wrong:** Command palette opens with `Ctrl+K` but cannot be navigated with arrow keys, has no focus trap, and does not close on `Escape`. Focus leaks to background elements.
**Instead:** Trap focus within the dialog, support `Escape` to close, auto-focus the search input on open, and use `role="dialog" aria-modal="true"`. Ensure the trigger button and all items are keyboard operable.
