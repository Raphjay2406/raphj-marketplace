---
name: data-fetching
description: "Data fetching patterns for Next.js and Astro. TanStack Query, Server Actions, RSC async data, Astro content collections, loading states, optimistic updates, infinite scroll, and cache strategies."
---

Use this skill when the user mentions data fetching, API calls, server actions, TanStack Query, React Query, loading states, optimistic updates, infinite scroll, SWR, cache invalidation, or content collections. Triggers on: fetch, query, mutation, server action, loading state, skeleton, infinite scroll, pagination, cache, data loading.

You are an expert at data fetching patterns for both Next.js and Astro applications.

## Next.js: Server Component Data Fetching

```tsx
// app/posts/page.tsx — async RSC (no client JS, no loading spinner)
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 }, // ISR: revalidate every 60s
  })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json() as Promise<Post[]>
}

export default async function PostsPage() {
  const posts = await getPosts()
  return <PostList posts={posts} />
}
```

### Server Actions (Next.js 14+)
```tsx
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const body = formData.get('body') as string

  await db.post.create({ data: { title, body } })
  revalidatePath('/posts')
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } })
  revalidatePath('/posts')
}
```

```tsx
// Client component using server action
'use client'
import { useActionState } from 'react'
import { createPost } from '@/app/actions'

export function CreatePostForm() {
  const [state, action, isPending] = useActionState(createPost, null)

  return (
    <form action={action}>
      <Input name="title" placeholder="Post title" disabled={isPending} />
      <Textarea name="body" placeholder="Write your post..." disabled={isPending} />
      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isPending ? 'Creating...' : 'Create Post'}
      </Button>
    </form>
  )
}
```

## Astro: Data Fetching

```astro
---
// src/pages/posts.astro — fetched at build time (SSG) or request time (SSR)
const response = await fetch('https://api.example.com/posts')
const posts: Post[] = await response.json()
---

<ul>
  {posts.map((post) => (
    <li><a href={`/posts/${post.slug}`}>{post.title}</a></li>
  ))}
</ul>
```

### Astro Content Collections
```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
})

export const collections = { blog }
```

```astro
---
// src/pages/blog/[slug].astro
import { getCollection, getEntry } from 'astro:content'

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft)
  return posts.map((post) => ({ params: { slug: post.slug }, props: { post } }))
}

const { post } = Astro.props
const { Content } = await post.render()
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

## TanStack Query (Client-Side, Both Frameworks)

### Setup
```tsx
// providers.tsx (Next.js) or as React island (Astro)
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

### Queries
```tsx
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'

// Standard query with loading/error states
function PostList() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then((r) => r.json()),
  })

  if (isLoading) return <PostListSkeleton />
  if (error) return <ErrorState message={error.message} />
  return <ul>{posts.map((p) => <PostItem key={p.id} post={p} />)}</ul>
}

// Suspense query (use with React Suspense boundary)
function PostListSuspense() {
  const { data: posts } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then((r) => r.json()),
  })
  return <ul>{posts.map((p) => <PostItem key={p.id} post={p} />)}</ul>
}
```

### Mutations with Optimistic Updates
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => fetch(`/api/posts/${id}`, { method: 'DELETE' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] })
      const previous = queryClient.getQueryData(['posts'])
      queryClient.setQueryData(['posts'], (old: Post[]) =>
        old.filter((p) => p.id !== id)
      )
      return { previous }
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['posts'], context?.previous)
      toast.error('Failed to delete post')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
```

### Infinite Scroll
```tsx
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

function InfinitePostList() {
  const { ref, inView } = useInView()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) =>
      fetch(`/api/posts?cursor=${pageParam}`).then((r) => r.json()),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage()
  }, [inView, hasNextPage, fetchNextPage])

  return (
    <>
      {data?.pages.map((page) =>
        page.posts.map((post: Post) => <PostCard key={post.id} post={post} />)
      )}
      <div ref={ref}>{isFetchingNextPage && <Loader2 className="animate-spin mx-auto" />}</div>
    </>
  )
}
```

## Loading States (Premium Patterns)

```tsx
// Skeleton that matches content shape — NOT a generic spinner
function PostListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Empty state with personality
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No posts yet</h3>
      <p className="text-sm text-muted-foreground mb-4">Create your first post to get started.</p>
      <Button><Plus className="mr-2 h-4 w-4" />Create Post</Button>
    </div>
  )
}
```

## Best Practices

1. **Server-first**: Fetch in RSC (Next.js) or frontmatter (Astro) when possible — zero client JS
2. **TanStack Query for client interactivity**: When you need optimistic updates, infinite scroll, or real-time refetching
3. **Skeleton > spinner**: Match the skeleton shape to the actual content layout
4. **Optimistic updates**: Show the change immediately, rollback on error
5. **Error boundaries**: Wrap data-dependent sections in error boundaries with retry
6. **Stale-while-revalidate**: Set `staleTime` to avoid unnecessary refetches
7. **Query key conventions**: `['entity', id]` for single, `['entity', 'list', filters]` for lists
