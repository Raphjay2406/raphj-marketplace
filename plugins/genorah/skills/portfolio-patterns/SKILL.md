---
name: "portfolio-patterns"
description: "Portfolio UI patterns: project showcases, case study layouts, creative grids, gallery with keyboard navigation, experience timelines -- with DNA-driven styling, motion-safe hover effects, and accessible galleries."
tier: "domain"
triggers: "portfolio, showcase, case study, gallery, work, projects, creative, agency, personal site, resume, experience, timeline"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- Personal portfolio, agency showcase, or freelancer site
- Case study presentations with challenge/solution/results structure
- Creative galleries (photography, illustration, design work)
- Resume/CV-style sites with experience timelines and skill visualization

### When NOT to Use

- E-commerce product catalog -- use `ecommerce-ui` instead
- Blog or editorial content -- use `blog-patterns` instead
- Dashboard or admin interface -- use `dashboard-patterns` instead

### Decision Tree

- Project showcase grid? Use container query cards with hover reveal for project details
- Case study page? Follow the narrative arc: Hero > Challenge > Solution > Results > Gallery > Testimonial
- Photo gallery? Masonry or uniform grid with keyboard-navigable lightbox
- Experience timeline? Vertical timeline with dot/logo markers and connecting lines
- Archetype personality? Luxury = curated minimal, Kinetic = animated showcase, Brutalist = raw grid

### Pipeline Connection

- **Referenced by:** builder during portfolio/agency section builds
- **Consumed at:** `/gen:execute` wave 2+ for showcase and case study sections
- **Related commands:** `/gen:plan` for portfolio page planning; uses `emotional-arc` for case study narrative beats

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern: Container Query Project Card

```tsx
interface Project {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  tags: string[];
  year: string;
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={`/work/${project.slug}`}
      className="@container group relative block overflow-hidden rounded-xl border border-border bg-surface"
    >
      <div className="aspect-[16/10] overflow-hidden bg-bg">
        <img
          src={project.coverImage}
          alt={`${project.title} project screenshot`}
          className="size-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4 @sm:p-5 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-text group-hover:text-primary motion-safe:transition-colors @sm:text-lg">
            {project.title}
          </h3>
          <ArrowUpRightIcon
            className="size-4 text-muted motion-safe:transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </div>
        <p className="text-sm text-muted line-clamp-2">{project.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{project.year}</span>
          <span className="text-muted" aria-hidden="true">&middot;</span>
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-bg px-2 py-0.5 text-[10px] font-medium text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}
```

#### Pattern: Case Study Layout

```tsx
interface CaseStudy {
  title: string;
  client: string;
  year: string;
  role: string;
  duration: string;
  tags: string[];
  heroImage: string;
  challenge: string;
  solution: string;
  results: { metric: string; value: string; description: string }[];
  gallery: string[];
  testimonial?: { quote: string; author: string; role: string };
}

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <header className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {study.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text lg:text-5xl">
          {study.title}
        </h1>

        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Client", value: study.client },
            { label: "Year", value: study.year },
            { label: "Role", value: study.role },
            { label: "Duration", value: study.duration },
          ].map((item) => (
            <div key={item.label}>
              <dt className="text-sm text-muted">{item.label}</dt>
              <dd className="font-medium text-text">{item.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="mt-8 overflow-hidden rounded-xl border border-border">
        <img
          src={study.heroImage}
          alt={`${study.title} hero`}
          className="w-full object-cover"
          loading="eager"
        />
      </div>

      <hr className="my-12 border-border" />

      {/* Challenge */}
      <section aria-labelledby="challenge-heading" className="space-y-4">
        <h2 id="challenge-heading" className="text-2xl font-semibold text-text">
          The Challenge
        </h2>
        <p className="text-lg leading-relaxed text-muted">{study.challenge}</p>
      </section>

      <hr className="my-12 border-border" />

      {/* Solution */}
      <section aria-labelledby="solution-heading" className="space-y-4">
        <h2 id="solution-heading" className="text-2xl font-semibold text-text">
          The Solution
        </h2>
        <p className="text-lg leading-relaxed text-muted">{study.solution}</p>
      </section>

      <hr className="my-12 border-border" />

      {/* Results */}
      <section aria-labelledby="results-heading" className="space-y-6">
        <h2 id="results-heading" className="text-2xl font-semibold text-text">
          Results
        </h2>
        <div className="grid gap-4 @sm:grid-cols-3">
          {study.results.map((result) => (
            <div
              key={result.metric}
              className="rounded-lg border border-border bg-surface p-6 text-center"
            >
              <p className="text-3xl font-bold text-primary tabular-nums">{result.value}</p>
              <p className="mt-1 font-medium text-text">{result.metric}</p>
              <p className="mt-1 text-sm text-muted">{result.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      {study.gallery.length > 0 && (
        <>
          <hr className="my-12 border-border" />
          <GallerySection images={study.gallery} projectTitle={study.title} />
        </>
      )}

      {/* Testimonial */}
      {study.testimonial && (
        <>
          <hr className="my-12 border-border" />
          <blockquote className="rounded-xl bg-surface p-8">
            <p className="text-lg italic leading-relaxed text-text">
              &ldquo;{study.testimonial.quote}&rdquo;
            </p>
            <footer className="mt-4">
              <p className="font-medium text-text">{study.testimonial.author}</p>
              <p className="text-sm text-muted">{study.testimonial.role}</p>
            </footer>
          </blockquote>
        </>
      )}
    </article>
  );
}
```

#### Pattern: Accessible Gallery with Keyboard Navigation

```tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface GallerySectionProps {
  images: string[];
  projectTitle: string;
}

export function GallerySection({ images, projectTitle }: GallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (lightboxIndex === null) return;
    closeRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, images.length]);

  return (
    <section aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="text-2xl font-semibold text-text mb-6">
        Gallery
      </h2>
      <div className="grid gap-4 grid-cols-1 @sm:grid-cols-2" role="list">
        {images.map((image, i) => (
          <button
            key={i}
            role="listitem"
            className="overflow-hidden rounded-lg border border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => setLightboxIndex(i)}
            aria-label={`View ${projectTitle} image ${i + 1} of ${images.length}`}
          >
            <img
              src={image}
              alt={`${projectTitle} screenshot ${i + 1}`}
              className="w-full aspect-[3/2] object-cover motion-safe:transition-transform motion-safe:duration-300 hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${lightboxIndex + 1} of ${images.length}`}
        >
          <button
            ref={closeRef}
            className="absolute top-4 end-4 grid size-10 place-items-center rounded-full bg-surface text-text hover:bg-surface/80 focus-visible:outline-2 focus-visible:outline-primary"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close lightbox"
          >
            <XIcon className="size-5" />
          </button>

          <button
            className="absolute start-4 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-surface text-text hover:bg-surface/80 focus-visible:outline-2 focus-visible:outline-primary"
            onClick={() => setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)}
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="size-5 rtl:rotate-180" />
          </button>

          <img
            src={images[lightboxIndex]}
            alt={`${projectTitle} screenshot ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
          />

          <button
            className="absolute end-4 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-surface text-text hover:bg-surface/80 focus-visible:outline-2 focus-visible:outline-primary"
            onClick={() => setLightboxIndex((lightboxIndex + 1) % images.length)}
            aria-label="Next image"
          >
            <ChevronRightIcon className="size-5 rtl:rotate-180" />
          </button>

          <p className="absolute bottom-4 text-sm text-muted" aria-live="polite">
            {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </section>
  );
}
```

#### Pattern: Experience Timeline

```tsx
interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  logo?: string;
  current?: boolean;
}

export function ExperienceTimeline({ items }: { items: Experience[] }) {
  return (
    <section aria-label="Work experience">
      <div className="space-y-0">
        {items.map((item, i) => (
          <div key={`${item.company}-${item.period}`} className="relative flex gap-6 pb-8 last:pb-0">
            {/* Connecting line */}
            {i < items.length - 1 && (
              <div className="absolute start-5 top-12 bottom-0 w-px bg-border" aria-hidden="true" />
            )}

            {/* Marker */}
            <div className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-border bg-bg">
              {item.logo ? (
                <img src={item.logo} alt="" className="size-6 rounded" aria-hidden="true" />
              ) : (
                <div
                  className={`size-3 rounded-full ${item.current ? "bg-primary" : "bg-muted"}`}
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="space-y-1 pt-1">
              <h3 className="font-medium text-text">{item.role}</h3>
              <p className="text-sm text-muted">{item.company}</p>
              <p className="text-xs text-muted">
                {item.period}
                {item.current && (
                  <span className="ms-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    Current
                  </span>
                )}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Reference Sites

- **Awwwards** (awwwards.com/websites) -- The benchmark for portfolio presentation: project cards with hover effects, clean grid, strong visual hierarchy
- **Pentagram** (pentagram.com) -- Agency case study excellence: large hero imagery, narrative challenge/solution/results structure, generous whitespace
- **Brittany Chiang** (brittanychiang.com) -- Personal portfolio with accessible keyboard navigation, clean project cards, excellent dark mode treatment

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Portfolio Patterns |
|-----------|-------------------|
| `bg-bg` | Page background, lightbox backdrop |
| `bg-surface` | Project cards, testimonial blocks, timeline markers |
| `text-text` | Project titles, case study headings, experience roles |
| `text-muted` | Descriptions, metadata, timeline details |
| `border-border` | Card outlines, gallery borders, timeline dividers |
| `bg-primary` / `text-primary` | Result metrics, active timeline marker, hover text color |
| `--motion-duration` | Card hover scale, lightbox transitions, timeline entrance |
| `--motion-easing` | Card hover animations, gallery transitions |
| `--signature-element` | Featured project hero treatment, gallery presentation style |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Luxury/Fashion | Curated minimal: 1-2 cols, oversized imagery, restrained typography, generous whitespace |
| Kinetic | Animated showcase: motion-rich card entrances, parallax hero images, scroll-triggered reveals |
| Brutalist | Raw grid: no rounded corners, stark borders, monospace labels, unpolished aesthetic |
| Swiss/International | Clean grid system, strict alignment, no decorative hover effects, typographic hierarchy |
| Ethereal | Soft edges, gentle hover fades, muted palette, atmospheric gallery transitions |
| Editorial | Magazine-style layouts with mixed grid sizes, feature stories alongside project cards |
| Neo-Corporate | Polished cards with subtle shadows, professional case study structure, refined transitions |
| Japanese Minimal | Maximum whitespace, quiet interactions, single-column case studies, restrained palette |

### Related Skills

- `cinematic-motion` -- Project card entrance animations, scroll-triggered reveals, lightbox transitions
- `accessibility` -- Gallery keyboard navigation (arrow keys), lightbox focus trap, timeline semantics
- `responsive-design` -- Grid reflow between breakpoints, container query project cards
- `emotional-arc` -- Case study narrative beats (Hook > Build > Peak > Close mapping)
- `seo-meta` -- Portfolio page structured data, project Open Graph images
- `creative-tension` -- Hero treatments, gallery presentation as wow moments

## Layer 4: Anti-Patterns

### Anti-Pattern: Autoplay Everything

**What goes wrong:** Project cards auto-play video previews on hover or load. This drains battery on mobile, slows page load, overwhelms users with simultaneous motion, and violates reduced-motion preferences.
**Instead:** Use static thumbnails by default. Video preview only on explicit hover (desktop) gated behind `motion-safe:`. On mobile, use static images exclusively. Respect `prefers-reduced-motion: reduce` by disabling all autoplay.

### Anti-Pattern: Inaccessible Lightbox

**What goes wrong:** Gallery lightbox opens but has no focus trap, no keyboard navigation (arrow keys for prev/next, Escape to close), and no ARIA labels. Background content remains interactive. Screen readers cannot identify the lightbox or navigate within it.
**Instead:** Use `role="dialog" aria-modal="true"`, trap focus within the lightbox, support `Escape` to close and `ArrowLeft` / `ArrowRight` to navigate. Auto-focus the close button on open. Announce current position: "Image 3 of 8" via `aria-live="polite"`.

### Anti-Pattern: No Keyboard Navigation in Gallery

**What goes wrong:** Gallery images are only clickable with a mouse. Keyboard users cannot tab to images, cannot open them, and cannot navigate between them.
**Instead:** Each gallery thumbnail is a `<button>` with descriptive `aria-label` ("View project screenshot 3 of 8"). Lightbox supports arrow key navigation. Focus is trapped within the lightbox and returned to the trigger button on close.

### Anti-Pattern: Results Without Context

**What goes wrong:** Case study results show big numbers ("247% increase") without any context, baseline, or explanation. The metrics are meaningless without understanding what was measured, from what starting point, and over what timeframe.
**Instead:** Each result metric includes three parts: the value ("247%"), the metric name ("conversion rate increase"), and a brief description ("from 1.2% to 4.2% over 6 months"). Present in a clear grid with DNA-styled cards.
