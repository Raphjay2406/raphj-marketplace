# Virtual Scroll & Infinite Loading

Virtualized lists, infinite scroll, and cursor-based pagination for rendering massive datasets without performance degradation.

## TanStack Virtual — Virtualized List

```tsx
"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface VirtualListProps<T> {
  items: T[];
  estimateSize: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  estimateSize,
  renderItem,
  overscan = 5,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            className="absolute left-0 top-0 w-full"
            style={{
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Virtualized Grid

```tsx
"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface VirtualGridProps<T> {
  items: T[];
  columns: number;
  rowHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function VirtualGrid<T>({
  items,
  columns,
  rowHeight,
  renderItem,
}: VirtualGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowCount = Math.ceil(items.length / columns);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 3,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          return (
            <div
              key={virtualRow.key}
              className="absolute left-0 top-0 grid w-full gap-4"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
              }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => {
                const itemIndex = startIndex + colIndex;
                if (itemIndex >= items.length) return <div key={colIndex} />;
                return (
                  <div key={colIndex}>
                    {renderItem(items[itemIndex], itemIndex)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## Infinite Scroll with TanStack Query

```tsx
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Loader2 } from "lucide-react";

interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

async function fetchPage<T>(cursor?: string): Promise<Page<T>> {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  params.set("limit", "50");
  const res = await fetch(`/api/items?${params}`);
  return res.json();
}

export function InfiniteList<T extends { id: string }>({
  renderItem,
  estimateSize = 64,
}: {
  renderItem: (item: T) => React.ReactNode;
  estimateSize?: number;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["items"],
      queryFn: ({ pageParam }) => fetchPage<T>(pageParam),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allItems.length + 1 : allItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;
    if (
      lastItem.index >= allItems.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [virtualItems, allItems.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualItems.map((virtualItem) => {
          const isLoaderRow = virtualItem.index > allItems.length - 1;
          const item = allItems[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              className="absolute left-0 top-0 w-full"
              style={{
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {isLoaderRow ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                renderItem(item)
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## Cursor-Based Pagination API Route

```ts
// app/api/items/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);

  // Example with Prisma
  const items = await prisma.item.findMany({
    take: limit + 1, // fetch one extra to determine if there's a next page
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1, // skip the cursor itself
    }),
    orderBy: { createdAt: "desc" },
  });

  const hasMore = items.length > limit;
  const results = hasMore ? items.slice(0, -1) : items;
  const nextCursor = hasMore ? results[results.length - 1].id : null;

  return NextResponse.json({
    items: results,
    nextCursor,
  });
}
```

## Intersection Observer Infinite Scroll (No Library)

```tsx
"use client";

import { useEffect, useRef, useCallback } from "react";

export function useIntersectionObserver(
  callback: () => void,
  options?: IntersectionObserverInit
) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callback();
    }, options);

    observer.observe(target);
    return () => observer.disconnect();
  }, [callback, options]);

  return targetRef;
}

// Usage: place sentinel at end of list
function ItemList() {
  const sentinelRef = useIntersectionObserver(() => {
    // load more items
  }, { rootMargin: "200px" });

  return (
    <div>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
      <div ref={sentinelRef} aria-hidden="true" />
    </div>
  );
}
```

## Dynamic Row Height Virtual List

```tsx
"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

export function DynamicHeightList<T>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            ref={virtualizer.measureElement}
            data-index={virtualItem.index}
            className="absolute left-0 top-0 w-full"
            style={{
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Astro — Paginated List with Load More

```astro
---
// src/pages/items/[...page].astro
import type { GetStaticPaths } from "astro";
import ItemCard from "../../components/ItemCard.astro";
import { getCollection } from "astro:content";

export const getStaticPaths = (async ({ paginate }) => {
  const items = await getCollection("items");
  return paginate(items, { pageSize: 20 });
}) satisfies GetStaticPaths;

const { page } = Astro.props;
---

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {page.data.map((item) => <ItemCard item={item} />)}
</div>

<nav class="mt-8 flex items-center justify-between" aria-label="Pagination">
  {page.url.prev && (
    <a href={page.url.prev} class="rounded-md bg-primary px-4 py-2 text-primary-foreground">
      Previous
    </a>
  )}
  <span class="text-sm text-muted-foreground">
    Page {page.currentPage} of {page.lastPage}
  </span>
  {page.url.next && (
    <a href={page.url.next} class="rounded-md bg-primary px-4 py-2 text-primary-foreground">
      Next
    </a>
  )}
</nav>
```

## Key Rules

- Always virtualize lists with 100+ items — never render all DOM nodes
- Use `overscan` of 3-5 for smooth scrolling
- Cursor-based pagination over offset-based for real-time data
- Combine virtual scroll + infinite query for massive datasets
- Use Intersection Observer for lightweight infinite scroll without TanStack Virtual
- For dynamic heights, use `measureElement` ref callback
- Astro: use built-in `paginate()` for static pages, React islands for dynamic lists
