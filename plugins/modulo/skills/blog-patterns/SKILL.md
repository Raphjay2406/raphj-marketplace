# Blog Patterns

Blog layouts, post listings, category/tag filtering, RSS feeds, reading progress indicators, related posts, and SEO for blog content.

## Blog Post Listing Page

```tsx
// app/blog/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getReadingTime } from "@/lib/reading-time";

interface Post {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  coverImage: string;
  tags: string[];
  content: string;
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block space-y-3">
        <div className="overflow-hidden rounded-lg border">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={800}
            height={400}
            className="aspect-[2/1] object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span aria-hidden="true">&middot;</span>
            <span>{getReadingTime(post.content)}</span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-muted-foreground line-clamp-2">
            {post.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Insights, tutorials, and updates from the team.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
```

## Blog Post Layout with Author & TOC

```tsx
// app/blog/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { TableOfContents } from "@/components/table-of-contents";
import { RelatedPosts } from "@/components/related-posts";
import { ReadingProgress } from "@/components/reading-progress";
import { JsonLd } from "@/components/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      images: [post.coverImage],
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <ReadingProgress />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        image: post.coverImage,
        datePublished: post.publishedAt,
        author: { "@type": "Person", name: post.author.name },
      }} />
      <article className="mx-auto max-w-4xl py-12">
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground">{post.description}</p>

          <div className="flex items-center gap-3 border-b pb-6">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })} &middot; {getReadingTime(post.content)}
              </p>
            </div>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_220px]">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>
          <aside className="hidden lg:block">
            <TableOfContents />
          </aside>
        </div>

        <footer className="mt-16 border-t pt-8">
          <RelatedPosts currentSlug={slug} tags={post.tags} />
        </footer>
      </article>
    </>
  );
}
```

## JSON-LD Component (Safe Wrapper)

```tsx
// components/json-ld.tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe — no HTML tags or script injection possible
      // because JSON encoding escapes all special characters
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Note: JSON-LD via `JSON.stringify` is safe because JSON encoding escapes `<`, `>`, and `&` characters, preventing script injection. This is the recommended Next.js pattern.

## Reading Progress Indicator

```tsx
"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 h-1 w-full bg-transparent">
      <div
        className="h-full bg-primary transition-[width] duration-150"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />
    </div>
  );
}
```

## Related Posts

```tsx
interface RelatedPostsProps {
  currentSlug: string;
  tags: string[];
}

export async function RelatedPosts({ currentSlug, tags }: RelatedPostsProps) {
  const allPosts = await getPosts();
  const related = allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({
      ...p,
      score: p.tags.filter((t: string) => tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">Related Posts</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {related.map((post) => (
          <a key={post.slug} href={`/blog/${post.slug}`} className="group space-y-2">
            <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
```

## Tag Filter with URL State

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export function TagFilter({ tags }: { tags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  function setTag(tag: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) params.set("tag", tag);
    else params.delete("tag");
    router.push(`/blog?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={activeTag === null ? "default" : "outline"}
        className="cursor-pointer"
        onClick={() => setTag(null)}
      >
        All
      </Badge>
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant={activeTag === tag ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setTag(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
```

## RSS Feed

```ts
// app/feed.xml/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await getPosts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>My Blog</title>
    <link>${siteUrl}</link>
    <description>Blog posts and updates</description>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
```

## Astro Blog

```astro
---
// src/pages/blog/index.astro
import { getCollection } from "astro:content";
import PostCard from "../../components/PostCard.astro";

const posts = (await getCollection("blog", ({ data }) => !data.draft))
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
---

<div class="mx-auto max-w-4xl space-y-8 py-12">
  <h1 class="text-3xl font-bold tracking-tight">Blog</h1>
  <div class="grid gap-8 md:grid-cols-2">
    {posts.map((post) => <PostCard post={post} />)}
  </div>
</div>
```

## Key Rules

- Use `generateMetadata` with OpenGraph `article` type for blog SEO
- Add JSON-LD `BlogPosting` schema for rich search results
- Calculate reading time from word count (200 WPM average)
- Related posts: score by shared tag count, show top 3
- RSS feed: escape XML entities, include `atom:link` for self-reference
- Tag filtering via URL searchParams for shareable filtered views
- Reading progress: use scroll position / total document height
- Astro: use Content Collections with `getStaticPaths` for SSG blog
