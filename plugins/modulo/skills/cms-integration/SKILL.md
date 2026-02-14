---
name: cms-integration
description: "Headless CMS integration patterns: Sanity, Contentful, Strapi, MDX rendering, content preview, draft mode, webhook revalidation, image handling, rich text rendering. Works with Next.js and Astro."
---

Use this skill when the user mentions CMS, Sanity, Contentful, Strapi, headless CMS, MDX, content management, draft mode, content preview, or webhook. Triggers on: CMS, Sanity, Contentful, Strapi, headless, MDX, draft, preview, content management.

You are an expert at integrating headless CMS platforms with frontend frameworks.

## Sanity.io Integration (Next.js)

```ts
// lib/sanity.ts
import { createClient, groq } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})

const builder = imageUrlBuilder(client)
export const urlFor = (source: any) => builder.image(source)

// Queries
export async function getPosts() {
  return client.fetch(groq`*[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, excerpt, publishedAt,
    mainImage { asset->{ _id, url, metadata { lqip, dimensions } } },
    author->{ name, image { asset->{ url } } },
    categories[]->{ title, slug }
  }`)
}

export async function getPost(slug: string) {
  return client.fetch(groq`*[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, body, publishedAt,
    mainImage { asset->{ _id, url, metadata { lqip, dimensions } } },
    author->{ name, bio, image { asset->{ url } } },
    categories[]->{ title, slug }
  }`, { slug })
}
```

```tsx
// app/blog/[slug]/page.tsx
import { getPost, getPosts, urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((p: any) => ({ slug: p.slug.current }))
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <article className="max-w-3xl mx-auto">
      {post.mainImage && (
        <Image
          src={urlFor(post.mainImage).width(1200).height(630).url()}
          alt={post.title}
          width={1200} height={630}
          placeholder="blur"
          blurDataURL={post.mainImage.asset.metadata.lqip}
          className="rounded-lg"
        />
      )}
      <h1 className="text-4xl font-bold mt-6">{post.title}</h1>
      <div className="prose dark:prose-invert mt-8">
        <PortableText value={post.body} components={portableTextComponents} />
      </div>
    </article>
  )
}
```

## Next.js Draft Mode

```ts
// app/api/draft/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  ;(await draftMode()).enable()
  redirect(slug ?? '/')
}

// app/api/draft/disable/route.ts
export async function GET() {
  ;(await draftMode()).disable()
  redirect('/')
}
```

## Webhook Revalidation (Next.js)

```ts
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const secret = request.headers.get('x-webhook-secret')
  if (secret !== process.env.REVALIDATION_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await request.json()

  // Revalidate based on content type
  if (body._type === 'post') {
    revalidatePath(`/blog/${body.slug.current}`)
    revalidatePath('/blog')
  }

  if (body._type === 'page') {
    revalidatePath(`/${body.slug.current}`)
  }

  // Or use tags
  revalidateTag('posts')

  return Response.json({ revalidated: true })
}
```

## Contentful Integration

```ts
// lib/contentful.ts
import { createClient } from 'contentful'

export const contentful = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export async function getPosts() {
  const entries = await contentful.getEntries({
    content_type: 'blogPost',
    order: ['-sys.createdAt'],
    include: 2,
  })
  return entries.items
}
```

## Astro Content Collections (local MDX)

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: image(),
    author: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
})

export const collections = { blog }
```

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BaseLayout title={post.data.title}>
  <article class="prose dark:prose-invert max-w-3xl mx-auto">
    <h1>{post.data.title}</h1>
    <Content />
  </article>
</BaseLayout>
```

## Astro + Sanity Integration

```ts
// src/lib/sanity.ts (same client as Next.js)
import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
})
```

```astro
---
// src/pages/blog/[slug].astro
import { sanity } from '../../lib/sanity';

export async function getStaticPaths() {
  const posts = await sanity.fetch('*[_type == "post"]{ "slug": slug.current }')
  return posts.map((p: any) => ({ params: { slug: p.slug } }))
}

const { slug } = Astro.params;
const post = await sanity.fetch('*[_type == "post" && slug.current == $slug][0]', { slug })
---

<BaseLayout title={post.title}>
  <article>
    <h1>{post.title}</h1>
    <!-- Render portable text with custom Astro component -->
  </article>
</BaseLayout>
```

## Best Practices

1. Sanity: use GROQ for queries, `@portabletext/react` for rich text
2. Use LQIP (Low Quality Image Placeholder) from CMS image metadata
3. Draft mode: secure with secret token, show preview banner
4. Webhook revalidation: validate secret header, revalidate specific paths
5. Contentful: use `include: 2` to resolve nested references
6. Astro content collections: use Zod schema for type-safe frontmatter
7. Image optimization: pipe CMS images through Next.js Image or Astro Image
8. Always filter drafts in production: `!data.draft` / `!defined(draft) || draft == false`
9. Cache strategy: ISR with `revalidate: 3600` + on-demand revalidation via webhook
10. For Astro with external CMS: fetch in frontmatter, render statically at build
