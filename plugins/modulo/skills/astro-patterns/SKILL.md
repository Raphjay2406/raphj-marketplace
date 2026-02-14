---
name: astro-patterns
description: "Astro-specific patterns: View Transitions, Islands architecture strategy, Content Collections, hybrid rendering, Astro DB, server endpoints, middleware, Astro Actions, on-demand rendering. Framework-specific deep knowledge."
---

Use this skill when the user is building with Astro and mentions View Transitions, Islands, content collections, Astro DB, server endpoints, middleware, hybrid rendering, or Astro-specific patterns. Triggers on: Astro, View Transitions, islands, content collections, Astro DB, hybrid, Astro middleware, Astro Actions.

You are an expert at Astro framework patterns and architecture.

## Islands Architecture Strategy

```
When to use each client directive:
- client:load     → Interactive immediately (nav menus, auth, cart)
- client:visible  → Interactive when scrolled into view (charts, maps, comments)
- client:idle     → Interactive when browser is idle (analytics, non-critical UI)
- client:media    → Interactive at breakpoint (mobile nav: client:media="(max-width: 768px)")
- client:only     → Client-only, never SSR (components that use window/document)
- No directive    → Static HTML, zero JS shipped
```

```astro
---
// src/pages/index.astro — Islands strategy example
import Header from '../components/Header.astro';        // Static - no JS
import Hero from '../components/Hero.astro';             // Static
import SearchBar from '../components/SearchBar';          // React
import FeaturesGrid from '../components/FeaturesGrid.astro'; // Static
import PricingTable from '../components/PricingTable';    // React
import TestimonialsCarousel from '../components/Testimonials'; // React
import NewsletterForm from '../components/Newsletter';    // React
import Footer from '../components/Footer.astro';          // Static
---

<Header />
<Hero />
<SearchBar client:load />                          <!-- Needs to be interactive immediately -->
<FeaturesGrid />                                    <!-- Pure static, zero JS -->
<PricingTable client:visible />                    <!-- Load when scrolled to -->
<TestimonialsCarousel client:visible />             <!-- Load when scrolled to -->
<NewsletterForm client:idle />                     <!-- Load when browser is idle -->
<Footer />
```

## View Transitions

```astro
---
// src/layouts/BaseLayout.astro
import { ViewTransitions } from 'astro:transitions';
---

<html lang="en">
<head>
  <ViewTransitions />
</head>
<body>
  <!-- Persistent elements across pages -->
  <nav transition:persist>
    <Header />
  </nav>

  <!-- Page content transitions -->
  <main transition:animate="slide">
    <slot />
  </main>
</body>
</html>
```

```astro
---
// Custom transition animations
---
<div transition:animate="fade">Fades in/out</div>
<div transition:animate="slide">Slides left/right</div>
<div transition:animate="initial">No animation</div>
<div transition:animate="none">Instant swap</div>

<!-- Named transitions for matching elements across pages -->
<img transition:name="hero-image" src={post.image} />
<!-- On the target page, same transition:name creates a morph animation -->
<img transition:name="hero-image" src={post.image} />

<!-- Persist interactive state (React/Svelte islands keep their state) -->
<AudioPlayer client:load transition:persist />
```

## Content Collections (Advanced)

```ts
// src/content/config.ts
import { defineCollection, z, reference } from 'astro:content'

const authors = defineCollection({
  type: 'data', // JSON/YAML data collection
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string(),
    social: z.object({
      twitter: z.string().optional(),
      github: z.string().optional(),
    }),
  }),
})

const blog = defineCollection({
  type: 'content', // Markdown/MDX collection
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: image(),
    author: reference('authors'), // Reference another collection
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    series: z.string().optional(),
    order: z.number().optional(),
  }),
})

export const collections = { blog, authors }
```

```astro
---
// Querying with references
import { getCollection, getEntry } from 'astro:content';

const posts = await getCollection('blog', ({ data }) => {
  return !data.draft && data.pubDate <= new Date();
});

// Sort by date
const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

// Get related posts by tag
const related = posts.filter(p =>
  p.slug !== currentSlug && p.data.tags.some(t => currentTags.includes(t))
).slice(0, 3);

// Resolve author reference
const author = await getEntry(post.data.author);
---
```

## Hybrid Rendering (SSR + SSG)

```ts
// astro.config.mjs
export default defineConfig({
  output: 'hybrid', // Default static, opt-in to SSR per page
})
```

```astro
---
// src/pages/dashboard.astro — SSR page
export const prerender = false; // This page renders on server per request

import { getSession } from '../lib/auth';
const session = await getSession(Astro.cookies);
if (!session) return Astro.redirect('/login');
---

<h1>Welcome, {session.user.name}</h1>
```

```astro
---
// src/pages/blog/[slug].astro — Static page (default in hybrid)
export const prerender = true; // Explicitly static (or just omit, it's the default)
---
```

## Server Endpoints (API Routes)

```ts
// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, cookies }) => {
  const data = await request.json()
  const { email } = data

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 })
  }

  // Save to database
  await db.subscribers.create({ data: { email } })

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}

// GET endpoint
export const GET: APIRoute = async ({ url }) => {
  const search = url.searchParams.get('q')
  const results = await db.posts.findMany({ where: { title: { contains: search } } })
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  })
}
```

## Astro Middleware

```ts
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url

  // Auth check for protected routes
  if (pathname.startsWith('/dashboard')) {
    const session = context.cookies.get('session')?.value
    if (!session) return context.redirect('/login')

    // Pass user data to pages via locals
    const user = await validateSession(session)
    context.locals.user = user
  }

  // Add security headers
  const response = await next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')

  return response
})
```

## Astro Actions (Server Functions)

```ts
// src/actions/index.ts
import { defineAction, z } from 'astro:actions'

export const server = {
  newsletter: {
    subscribe: defineAction({
      accept: 'form',
      input: z.object({
        email: z.string().email(),
      }),
      handler: async ({ email }) => {
        await db.subscribers.create({ data: { email } })
        return { success: true }
      },
    }),
  },
  comments: {
    create: defineAction({
      input: z.object({
        postId: z.string(),
        content: z.string().min(1).max(500),
      }),
      handler: async ({ postId, content }, context) => {
        const user = context.locals.user
        return await db.comments.create({ data: { postId, content, authorId: user.id } })
      },
    }),
  },
}
```

```astro
---
// Using actions in Astro pages
import { actions } from 'astro:actions';
---

<form method="POST" action={actions.newsletter.subscribe}>
  <input type="email" name="email" required />
  <button type="submit">Subscribe</button>
</form>
```

## Best Practices

1. Default to static (no directive) — only add `client:*` when interactivity is needed
2. Use `client:visible` for below-fold interactive components (saves initial JS)
3. `client:idle` for non-critical interactivity (analytics widgets, newsletter forms)
4. View Transitions: use `transition:persist` for audio players, nav state, form data
5. Named transitions (`transition:name`) create smooth morph animations between pages
6. Content Collections: use `reference()` for type-safe cross-collection relationships
7. Hybrid mode: default SSG + opt-in SSR with `prerender = false` per page
8. Server endpoints: use for API routes, webhooks, form submissions
9. Middleware: auth checks, security headers, request logging
10. Actions: type-safe server functions with Zod validation, progressive enhancement with forms
