# Markdown & MDX Rendering

React-markdown with custom components, MDX integration, syntax highlighting, table of contents generation, and live code blocks.

## react-markdown with Custom Components

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

const components = {
  h1: ({ children, id }: any) => (
    <h1 id={id} className="mt-8 scroll-m-20 text-4xl font-bold tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children, id }: any) => (
    <h2 id={id} className="mt-8 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children, id }: any) => (
    <h3 id={id} className="mt-6 scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className="leading-7 [&:not(:first-child)]:mt-4">{children}</p>
  ),
  a: ({ href, children }: any) => (
    <a href={href} className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
      {children}
    </a>
  ),
  ul: ({ children }: any) => (
    <ul className="my-4 ml-6 list-disc [&>li]:mt-2">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="my-4 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="mt-4 border-l-4 border-primary/20 pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  table: ({ children }: any) => (
    <div className="my-6 w-full overflow-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="border border-border px-4 py-2">{children}</td>
  ),
  hr: () => <hr className="my-8 border-border" />,
  img: ({ src, alt }: any) => (
    <img src={src} alt={alt ?? ""} className="my-4 rounded-lg border" loading="lazy" />
  ),
  code: ({ inline, className, children }: any) => {
    if (inline) {
      return (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
          {children}
        </code>
      );
    }
    const lang = className?.replace("language-", "");
    return <CodeBlock language={lang}>{String(children).replace(/\n$/, "")}</CodeBlock>;
  },
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

## Syntax Highlighting with Shiki

Shiki generates HTML server-side from trusted source code — safe to render directly since no user input reaches the HTML generation.

```tsx
import { codeToHtml } from "shiki";
import DOMPurify from "isomorphic-dompurify";

interface CodeBlockProps {
  children: string;
  language?: string;
}

export async function CodeBlock({ children, language = "text" }: CodeBlockProps) {
  const html = await codeToHtml(children, {
    lang: language,
    theme: "github-dark",
  });

  // Sanitize as defense-in-depth even though Shiki output is trusted
  const sanitized = DOMPurify.sanitize(html);

  return (
    <div className="group relative my-4">
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 bg-muted/50 px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {language}
        </span>
        <CopyButton text={children} />
      </div>
      <div className="overflow-auto rounded-b-lg border text-sm [&>pre]:p-4">
        <SafeHtml html={sanitized} />
      </div>
    </div>
  );
}

// SafeHtml wrapper: only use with DOMPurify-sanitized content
function SafeHtml({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

## Copy Button

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
}
```

## Table of Contents Generator

```tsx
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const elements = document.querySelectorAll("h2[id], h3[id]");
    const items: TOCItem[] = Array.from(elements).map((el) => ({
      id: el.id,
      text: el.textContent ?? "",
      level: parseInt(el.tagName[1]),
    }));
    setHeadings(items);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-20 space-y-1">
      <p className="mb-2 text-sm font-semibold">On this page</p>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={cn(
            "block text-sm transition-colors hover:text-foreground",
            heading.level === 3 && "pl-4",
            activeId === heading.id
              ? "font-medium text-foreground"
              : "text-muted-foreground"
          )}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
```

## MDX with next-mdx-remote (RSC)

```tsx
// app/blog/[slug]/page.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";

const mdxComponents = {
  Callout,
  code: CodeBlock,
};

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
      <h1>{post.title}</h1>
      <MDXRemote
        source={post.content}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </article>
  );
}
```

## Callout Component (for MDX)

```tsx
import { cn } from "@/lib/utils";
import { AlertCircle, Info, AlertTriangle, CheckCircle } from "lucide-react";

const icons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
};

const styles = {
  info: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  warning: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  error: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
  success: "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
};

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: keyof typeof icons;
  title?: string;
  children: React.ReactNode;
}) {
  const Icon = icons[type];

  return (
    <div className={cn("my-4 rounded-lg border p-4", styles[type])}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          {title && <p className="mb-1 font-semibold">{title}</p>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
```

## Astro — Content Collections with Markdown

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

```astro
---
// src/pages/blog/[slug].astro
import { getCollection, render } from "astro:content";
import BlogLayout from "../../layouts/BlogLayout.astro";
import TableOfContents from "../../components/TableOfContents.astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await render(post);
---

<BlogLayout title={post.data.title}>
  <div class="grid grid-cols-[1fr_250px] gap-8">
    <article class="prose dark:prose-invert max-w-none">
      <Content />
    </article>
    <aside>
      <TableOfContents headings={headings} />
    </aside>
  </div>
</BlogLayout>
```

## Reading Time Estimate

```ts
export function getReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
```

## Key Rules

- Use `react-markdown` with `remark-gfm` for GitHub-flavored markdown (tables, strikethrough, task lists)
- Use `rehype-slug` to auto-generate heading IDs for TOC and deep links
- Use Shiki for syntax highlighting (supports RSC, 100+ languages, zero client JS)
- Always sanitize HTML with DOMPurify before rendering with innerHTML
- Use `next-mdx-remote/rsc` for server-rendered MDX — zero client bundle
- Always provide a Copy button on code blocks
- TOC with Intersection Observer tracks active heading as user scrolls
- Astro: use Content Collections for type-safe markdown with Zod schemas
- Astro: `render()` returns both `Content` component and `headings` array for TOC
