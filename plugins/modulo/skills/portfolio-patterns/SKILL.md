# Portfolio Patterns

Project showcases, case study layouts, work galleries, skills visualization, and personal/agency portfolio patterns.

## Project Showcase Grid

```tsx
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

interface Project {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  tags: string[];
  year: string;
  featured?: boolean;
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <Link
          key={project.slug}
          href={`/work/${project.slug}`}
          className="group relative overflow-hidden rounded-xl border bg-card"
        >
          <div className="aspect-[16/10] overflow-hidden">
            <Image
              src={project.coverImage}
              alt={project.title}
              width={800}
              height={500}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{project.year}</span>
              <span className="text-muted-foreground">&middot;</span>
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

## Case Study Layout

```tsx
// app/work/[slug]/page.tsx
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

export default function CaseStudyPage({ study }: { study: CaseStudy }) {
  return (
    <article className="mx-auto max-w-4xl py-12">
      {/* Hero */}
      <header className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {study.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          {study.title}
        </h1>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Client", value: study.client },
            { label: "Year", value: study.year },
            { label: "Role", value: study.role },
            { label: "Duration", value: study.duration },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="mt-8 overflow-hidden rounded-xl">
        <Image
          src={study.heroImage}
          alt={study.title}
          width={1200}
          height={675}
          className="w-full object-cover"
          priority
        />
      </div>

      <Separator className="my-12" />

      {/* Challenge */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">The Challenge</h2>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {study.challenge}
        </p>
      </section>

      <Separator className="my-12" />

      {/* Solution */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">The Solution</h2>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {study.solution}
        </p>
      </section>

      <Separator className="my-12" />

      {/* Results */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Results</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {study.results.map((result) => (
            <div key={result.metric} className="rounded-lg border p-6 text-center">
              <p className="text-3xl font-bold text-primary">{result.value}</p>
              <p className="mt-1 font-medium">{result.metric}</p>
              <p className="mt-1 text-sm text-muted-foreground">{result.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      {study.gallery.length > 0 && (
        <>
          <Separator className="my-12" />
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Gallery</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {study.gallery.map((image, i) => (
                <div key={i} className="overflow-hidden rounded-lg border">
                  <Image
                    src={image}
                    alt={`${study.title} screenshot ${i + 1}`}
                    width={600}
                    height={400}
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Testimonial */}
      {study.testimonial && (
        <>
          <Separator className="my-12" />
          <blockquote className="rounded-xl bg-muted/50 p-8">
            <p className="text-lg italic leading-relaxed">
              &ldquo;{study.testimonial.quote}&rdquo;
            </p>
            <footer className="mt-4">
              <p className="font-medium">{study.testimonial.author}</p>
              <p className="text-sm text-muted-foreground">{study.testimonial.role}</p>
            </footer>
          </blockquote>
        </>
      )}
    </article>
  );
}
```

## Skills / Tech Stack Visualization

```tsx
interface SkillCategory {
  name: string;
  skills: { name: string; level: number }[]; // level: 0-100
}

export function SkillsSection({ categories }: { categories: SkillCategory[] }) {
  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.name} className="space-y-4">
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {category.skills.map((skill) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Experience Timeline

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
    <div className="space-y-0">
      {items.map((item, i) => (
        <div key={i} className="relative flex gap-6 pb-8 last:pb-0">
          {/* Line */}
          {i < items.length - 1 && (
            <div className="absolute left-5 top-12 bottom-0 w-px bg-border" />
          )}

          {/* Dot / Logo */}
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background">
            {item.logo ? (
              <img src={item.logo} alt={item.company} className="h-6 w-6 rounded" />
            ) : (
              <div className={`h-3 w-3 rounded-full ${item.current ? "bg-green-500" : "bg-muted-foreground"}`} />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-medium">{item.role}</h3>
            <p className="text-sm text-muted-foreground">{item.company}</p>
            <p className="text-xs text-muted-foreground">{item.period}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Key Rules

- Project grid: 2 columns on desktop, hover scale on images, ArrowUpRight icon for affordance
- Case study structure: Hero → Challenge → Solution → Results (metrics) → Gallery → Testimonial
- Results metrics: big number + label + description, 3-column grid
- Skills visualization: progress bars with percentage, grouped by category
- Experience timeline: vertical with dot/logo markers and connecting lines
- Always use `priority` on hero images for LCP optimization
- Use `line-clamp-2` for truncating descriptions in grid views
- Gallery images: 2-column grid with rounded borders
