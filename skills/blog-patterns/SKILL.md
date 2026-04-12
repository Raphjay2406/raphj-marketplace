---
name: "blog-patterns"
description: "Blog and article UI patterns: post index, article typography, reading progress, table of contents, tag filtering, RSS feeds -- with DNA-driven styling, responsive reading experience, and accessible content."
tier: "domain"
triggers: "blog, article, post, reading, editorial, magazine, content, RSS, table of contents, TOC, reading time, tag filter"
version: "2.0.0"
metadata:
  pathPatterns:
    - "**/*.md"
    - "**/*.mdx"
    - "**/blog/**/*"
---

## Layer 1: Decision Guidance

### When to Use

- Project includes a blog, editorial section, or article-based content
- Knowledge base, documentation hub, or news section with long-form reading
- Any site needing post listings, tag/category filtering, and article layouts
- Magazine-style layouts with featured posts and content grids

### When NOT to Use

- E-commerce product pages -- use `ecommerce-ui` instead
- Dashboard analytics -- use `dashboard-patterns` instead
- Portfolio project showcases -- use `portfolio-patterns` instead (case studies overlap but are structurally different)

### Decision Tree

- Blog index layout? Featured hero post + grid below, or uniform grid
- Article typography? Use `prose` base with DNA token overrides for consistent reading experience
- Table of contents? Sticky sidebar on desktop (`lg:`), collapsed accordion on mobile
- Reading progress? Fixed progress bar at top, gated behind `motion-safe:` for reduced-motion
- Tag filtering? URL-param-based for shareable filtered views (`/blog?tag=design`)
- Framework? Next.js uses `generateMetadata` + RSC; Astro uses Content Collections + frontmatter

### Pipeline Connection

- **Referenced by:** builder during blog/editorial section builds
- **Consumed at:** `/gen:execute` wave 2+ for content-heavy sections
- **Related commands:** `/gen:plan` for article page planning; uses `multi-page-architecture` for blog index + article page pairing

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Blog Post Card

```tsx
interface Post {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  coverImage: string;
  tags: string[];
  readingTime: string;
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="@container group">
      <a href={`/blog/${post.slug}`} className="block space-y-3">
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <img
            src={post.coverImage}
            alt=""
            className="aspect-[2/1] w-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span aria-hidden="true">&middot;</span>
            <span>{post.readingTime}</span>
          </div>
          <h2 className="text-base font-semibold text-text group-hover:text-primary motion-safe:transition-colors @sm:text-lg">
            {post.title}
          </h2>
          <p className="text-sm text-muted line-clamp-2">{post.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </a>
    </article>
  );
}
```

#### Pattern: Article Layout with Sticky TOC

```tsx
interface ArticleLayoutProps {
  title: string;
  description: string;
  publishedAt: string;
  author: { name: string; avatar: string };
  tags: string[];
  readingTime: string;
  children: React.ReactNode;
  headings: { id: string; text: string; level: number }[];
}

export function ArticleLayout({
  title,
  description,
  publishedAt,
  author,
  tags,
  readingTime,
  children,
  headings,
}: ArticleLayoutProps) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <header className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <a
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-muted hover:text-text motion-safe:transition-colors"
            >
              {tag}
            </a>
          ))}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text lg:text-5xl">
          {title}
        </h1>
        <p className="text-lg text-muted">{description}</p>

        <div className="flex items-center gap-3 border-b border-border pb-6">
          <img
            src={author.avatar}
            alt={author.name}
            className="size-10 rounded-full bg-surface object-cover"
          />
          <div>
            <p className="text-sm font-medium text-text">{author.name}</p>
            <p className="text-sm text-muted">
              <time dateTime={publishedAt}>
                {new Date(publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              {" "}&middot; {readingTime}
            </p>
          </div>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_220px]">
        {/* Article body -- prose with DNA overrides */}
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-text prose-p:text-text/85 prose-a:text-primary prose-strong:text-text prose-code:rounded prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none">
          {children}
        </div>

        {/* Sticky table of contents */}
        <aside className="hidden lg:block" aria-label="Table of contents">
          <nav className="sticky top-24">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              On this page
            </h2>
            <ul className="space-y-2 border-s border-border ps-3">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className={`block text-sm text-muted hover:text-text motion-safe:transition-colors ${
                      heading.level === 3 ? "ps-3" : ""
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </article>
  );
}
```

#### Pattern: Reading Progress Bar

```tsx
"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-0.5 motion-safe:transition-[width] motion-safe:duration-150"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
    </div>
  );
}
```

#### Pattern: Tag Filter with URL State

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
      <button
        className={`rounded-full px-3 py-1 text-sm font-medium motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          activeTag === null
            ? "bg-primary text-bg"
            : "bg-surface text-muted hover:text-text"
        }`}
        onClick={() => setTag(null)}
        aria-pressed={activeTag === null}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          className={`rounded-full px-3 py-1 text-sm font-medium motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            activeTag === tag
              ? "bg-primary text-bg"
              : "bg-surface text-muted hover:text-text"
          }`}
          onClick={() => setTag(tag)}
          aria-pressed={activeTag === tag}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
```

#### Pattern: Related Posts

```tsx
interface RelatedPostsProps {
  posts: { slug: string; title: string; description: string }[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-label="Related posts" className="border-t border-border pt-8 mt-16">
      <h2 className="mb-6 text-2xl font-semibold text-text">Related Posts</h2>
      <div className="grid gap-6 @sm:grid-cols-2 @md:grid-cols-3">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group space-y-2 rounded-lg p-3 -m-3 hover:bg-surface motion-safe:transition-colors"
          >
            <h3 className="font-medium text-text group-hover:text-primary motion-safe:transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-muted line-clamp-2">{post.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
```

### Reference Sites

- **Stripe Blog** (stripe.com/blog) -- Clean reading experience, excellent typography hierarchy, responsive article layout with sidebar, strong use of whitespace
- **Vercel Blog** (vercel.com/blog) -- Award-caliber post cards with subtle hover, reading progress indicator, dark mode reading comfort, tag-based filtering
- **iA Writer** (ia.net/topics) -- Exemplary editorial typography, distraction-free reading, perfect line length and spacing

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Blog Patterns |
|-----------|-------------------|
| `bg-bg` | Article page background, reading surface |
| `bg-surface` | Post cards, tag pills, code block backgrounds |
| `text-text` | Article body, headings, author name |
| `text-muted` | Dates, reading time, tag labels, TOC links |
| `border-border` | Card outlines, header divider, TOC border |
| `bg-primary` / `text-primary` | Active tag filter, reading progress bar, article links |
| `--font-body` | Article body text -- reading optimized |
| `--font-display` | Article title, section headings |
| `--type-scale` | Article typography uses the 8-level DNA type scale |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Editorial | Magazine-style layout: featured hero post, 3-col grid, pull quotes, drop caps |
| Japanese Minimal | Maximum whitespace, single-column reading, quiet hover states, restrained palette |
| Brutalist | Raw text presentation, monospace metadata, no rounded corners, stark dividers |
| Swiss/International | Clean grid index, strict typographic hierarchy, no decorative elements |
| Dark Academia | Warm surfaces, serif article typography, understated card borders |
| Luxury/Fashion | Curated post presentation, large featured images, editorial photo treatments |
| Neo-Corporate | Polished post cards, professional layout, subtle shadows, clean metadata |

### Related Skills

- `tailwind-system` -- Prose plugin overrides, DNA token mapping, dark mode prose styles
- `responsive-design` -- Article typography scaling (hybrid: clamp body, stepped headings)
- `accessibility` -- Skip-to-content link, heading hierarchy, reading progress ARIA
- `seo-meta` -- Article JSON-LD schema, Open Graph article type, RSS feed generation
- `multi-page-architecture` -- Blog index + article page template pairing, shared components
- `dark-light-mode` -- Prose color inversion, reading-comfortable dark palette

## Layer 4: Anti-Patterns

### Anti-Pattern: Fixed-Width Article Text

**What goes wrong:** Article text set to a fixed width (e.g., `width: 720px`) instead of responsive `max-w` with proper padding. On mobile, content overflows or has horizontal scroll. On ultra-wide screens, text floats in a narrow column with no context.
**Instead:** Use `max-w-prose` or `max-w-3xl` with `px-4` for mobile padding. The container constrains on wide screens while flowing naturally on narrow ones. Let prose line length be 65-75 characters for optimal readability.

### Anti-Pattern: Missing Skip-to-Content

**What goes wrong:** Blog articles with long navigation bars force keyboard and screen-reader users to tab through every nav link before reaching the article content.
**Instead:** Add a visually-hidden skip link as the first focusable element: `<a href="#content" class="sr-only focus:not-sr-only ...">Skip to content</a>`. The article container gets `id="content"`.

### Anti-Pattern: No Dark Mode Reading Comfort

**What goes wrong:** Dark mode simply inverts the light palette, producing harsh white text on pure black. Reading long-form content becomes fatiguing. Code blocks blend into the background.
**Instead:** Dark mode uses off-black backgrounds (`bg-bg` maps to a dark gray, not pure black), slightly reduced text brightness (`text-text` is warm gray, not pure white), and distinct code block surfaces (`bg-surface` provides contrast against `bg-bg`).

### Anti-Pattern: Inaccessible Table of Contents

**What goes wrong:** TOC is a decorative list with no semantic markup, no `aria-label`, and no heading hierarchy indication. Screen readers cannot identify it as navigation or understand the nesting.
**Instead:** Wrap in `<nav aria-label="Table of contents">`, use a `<ul>` with nested `<li>` elements, and indent H3s visually under their parent H2s. Use `<a href="#section-id">` for each entry with proper focus styles.
