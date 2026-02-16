---
name: light-mode-patterns
description: "Light-mode design patterns at the same depth as dark-mode creative-sections. Editorial heroes, magazine layouts, product showcases, e-commerce, agency portfolios — all optimized for light backgrounds."
---

Use this skill when building light-themed sites, when the archetype requires light backgrounds (Ethereal, Editorial, Organic, Luxury, Playful, Japanese Minimal, Swiss, Warm Artisan), or when creating light-mode variants. Triggers on: light mode, light theme, light background, white background, editorial, magazine, product showcase, e-commerce, agency, portfolio, light.

You are a design engineer who excels at light-mode design. Dark mode gets all the attention, but the best sites in the world (Apple, Stripe, Notion) prove that light mode can be just as premium. The key: DEPTH on white requires different techniques than depth on dark.

## Light-Mode Depth Techniques

Dark mode uses glow, glass, and neon for depth. Light mode uses:

1. **Layered shadows** — Multiple shadow layers (not just `shadow-md`)
2. **Subtle background tints** — Not flat white, but `#faf9f6`, `#f7f4ee`, warm tints
3. **Border subtlety** — `border-gray-200/60` not `border-gray-300`
4. **Elevation through background** — Cards slightly lighter/darker than page bg
5. **Color blocking** — Sections with different warm background tints

```tsx
{/* Light-mode layered shadow (premium feel) */}
className="shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.04),0_8px_16px_rgba(0,0,0,0.04),0_24px_48px_rgba(0,0,0,0.05)]"

{/* Light-mode colored shadow */}
className="shadow-[0_20px_40px_-12px_rgba(194,62,58,0.15)]" // Warm accent shadow

{/* Elevation hierarchy */}
<body className="bg-[#faf9f6]">           {/* Page background */}
  <section className="bg-[#f5f2ed]">      {/* Section — slightly darker */}
    <div className="bg-white rounded-2xl"> {/* Card — pure white = elevated */}
```

---

## Light Hero Patterns

### Editorial Dramatic Hero
```tsx
<section className="relative min-h-screen bg-[#faf9f6] overflow-hidden">
  {/* Large typography dominating the viewport */}
  <div className="container mx-auto px-6 pt-40 pb-20">
    <div className="max-w-4xl">
      <p className="text-sm font-medium tracking-[0.15em] uppercase text-[var(--color-text-secondary)] mb-6">
        Issue 47 — February 2026
      </p>
      <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-serif font-normal leading-[0.85] tracking-[-0.03em] text-[var(--color-text-primary)]">
        The Future of
        <em className="block text-[var(--color-accent-1)]">Design</em>
      </h1>
      <p className="mt-8 text-lg text-[var(--color-text-secondary)] max-w-lg leading-relaxed">
        How the next generation of tools is reshaping creative practice.
      </p>
    </div>
  </div>

  {/* Decorative line */}
  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
</section>
```

### Magazine-Style Split Hero
```tsx
<section className="min-h-screen grid lg:grid-cols-2 bg-[#faf9f6]">
  {/* Text side */}
  <div className="flex items-center px-8 md:px-16 lg:px-20 py-20">
    <div>
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-accent-1)]">
        New Collection
      </span>
      <h1 className="mt-4 text-5xl md:text-6xl font-serif font-normal leading-[0.9] tracking-[-0.02em]">
        Crafted with
        <span className="italic"> intention</span>
      </h1>
      <p className="mt-6 text-base text-[var(--color-text-secondary)] leading-relaxed max-w-md">
        Description text with adequate line height and constrained width.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <button className="bg-[var(--color-text-primary)] text-white rounded-full px-8 py-3.5 text-sm font-medium hover:bg-[var(--color-text-primary)]/90 transition-colors">
          Explore Collection
        </button>
        <a href="#" className="text-sm text-[var(--color-text-secondary)] underline underline-offset-4 hover:text-[var(--color-text-primary)] transition-colors">
          View Lookbook
        </a>
      </div>
    </div>
  </div>

  {/* Image side */}
  <div className="relative min-h-[500px] lg:min-h-0">
    <img src="/hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
  </div>
</section>
```

### Product Showcase Hero
```tsx
<section className="relative py-24 md:py-32 bg-gradient-to-b from-[#f5f2ed] to-[#faf9f6] overflow-hidden">
  <div className="container mx-auto px-6 text-center">
    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-1)]/10 border border-[var(--color-accent-1)]/20 px-4 py-1.5 text-sm font-medium text-[var(--color-accent-1)] mb-6">
      Just launched
    </span>
    <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] leading-[0.9] text-[var(--color-text-primary)]">
      Build beautiful<br />products, faster
    </h1>
    <p className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto">
      The platform that turns your ideas into production-ready interfaces.
    </p>
    <div className="mt-8 flex items-center justify-center gap-4">
      <button className="rounded-xl bg-[var(--color-text-primary)] text-white px-8 py-3.5 text-sm font-semibold shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-shadow">
        Get Started Free
      </button>
      <button className="rounded-xl border border-[var(--color-border)] px-6 py-3.5 text-sm font-medium hover:bg-[var(--color-text-primary)]/5 transition-colors">
        Live Demo
      </button>
    </div>
  </div>

  {/* Product screenshot with shadow */}
  <div className="container mx-auto px-6 mt-16">
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-2 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_8px_30px_rgba(0,0,0,0.07),0_30px_60px_rgba(0,0,0,0.05)]">
      <div className="rounded-xl bg-[#f8f8f8] aspect-video" />
    </div>
  </div>
</section>
```

---

## Light Feature Sections

### Magazine Grid
```tsx
<section className="py-20 bg-[#faf9f6]">
  <div className="container mx-auto px-6">
    <div className="grid md:grid-cols-12 gap-6">
      {/* Large feature — spans 7 columns */}
      <div className="md:col-span-7 rounded-2xl bg-gradient-to-br from-[var(--color-accent-1)]/5 to-[var(--color-accent-1)]/10 p-10 flex flex-col justify-end min-h-[400px]">
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--color-accent-1)] mb-3">Core Feature</span>
        <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">Feature headline</h3>
        <p className="mt-2 text-[var(--color-text-secondary)]">Description text.</p>
      </div>

      {/* Stacked features — 5 columns */}
      <div className="md:col-span-5 grid gap-6">
        <div className="rounded-2xl bg-white border border-[var(--color-border)] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h3 className="text-lg font-semibold">Feature 2</h3>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Description.</p>
        </div>
        <div className="rounded-2xl bg-white border border-[var(--color-border)] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h3 className="text-lg font-semibold">Feature 3</h3>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Description.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Asymmetric Image/Text
```tsx
<section className="py-24 bg-white">
  <div className="container mx-auto px-6">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      {/* Image with artistic treatment */}
      <div className="relative">
        <div className="rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]">
          <img src="/feature.jpg" alt="" className="w-full aspect-[4/3] object-cover" />
        </div>
        {/* Decorative offset element */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--color-accent-1)]/10 rounded-2xl -z-10" />
      </div>

      {/* Text content */}
      <div className="lg:pl-8">
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--color-accent-1)]">
          Why us
        </span>
        <h2 className="mt-4 text-4xl font-bold tracking-tight leading-[1.1]">
          We obsess over the details so you don't have to
        </h2>
        <p className="mt-4 text-[var(--color-text-secondary)] leading-relaxed">
          Body text with good line-height.
        </p>
        <ul className="mt-8 space-y-4">
          {points.map(p => (
            <li key={p} className="flex items-start gap-3 text-sm">
              <Check className="h-5 w-5 text-[var(--color-accent-1)] flex-shrink-0 mt-0.5" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</section>
```

### Card Collection with Hover
```tsx
<div className="grid md:grid-cols-3 gap-6">
  {features.map(feature => (
    <div
      key={feature.title}
      className="group rounded-2xl bg-white border border-[var(--color-border)] p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[var(--color-border-hover)] hover:-translate-y-1"
    >
      <div className="h-12 w-12 rounded-xl bg-[var(--color-accent-1)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--color-accent-1)]/15 transition-colors">
        <feature.icon className="h-6 w-6 text-[var(--color-accent-1)]" />
      </div>
      <h3 className="text-lg font-semibold">{feature.title}</h3>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">{feature.description}</p>
    </div>
  ))}
</div>
```

---

## Light Testimonial Patterns

### Pull Quote Style
```tsx
<section className="py-24 bg-[#f5f2ed]">
  <div className="container mx-auto px-6 max-w-3xl text-center">
    <div className="text-6xl text-[var(--color-accent-1)]/30 font-serif leading-none mb-4">"</div>
    <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed text-[var(--color-text-primary)]">
      This tool fundamentally changed how our team approaches design.
    </blockquote>
    <div className="mt-8 flex items-center justify-center gap-4">
      <img src="/avatar.jpg" alt="Sarah Chen" className="h-12 w-12 rounded-full" />
      <div className="text-left">
        <p className="font-semibold text-sm">Sarah Chen</p>
        <p className="text-sm text-[var(--color-text-secondary)]">Head of Design, Acme Corp</p>
      </div>
    </div>
  </div>
</section>
```

### Multi-Testimonial Grid
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {testimonials.map(t => (
    <div key={t.name} className="rounded-2xl bg-white border border-[var(--color-border)] p-8">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">"{t.quote}"</p>
      <div className="mt-6 flex items-center gap-3">
        <img src={t.avatar} alt={t.name} className="h-9 w-9 rounded-full" />
        <div>
          <p className="text-sm font-medium">{t.name}</p>
          <p className="text-xs text-[var(--color-text-tertiary)]">{t.role}</p>
        </div>
      </div>
    </div>
  ))}
</div>
```

---

## E-Commerce Patterns (Light)

### Product Grid with Hover
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
  {products.map(product => (
    <div key={product.id} className="group cursor-pointer">
      <div className="relative rounded-xl overflow-hidden bg-[#f5f2ed] aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-[var(--color-accent-1)] text-white text-xs font-semibold px-3 py-1">
            {product.badge}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full rounded-lg bg-white/90 backdrop-blur-sm py-2.5 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white transition-colors">
            Quick View
          </button>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium">{product.name}</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">${product.price}</p>
      </div>
    </div>
  ))}
</div>
```

### Category Visual Navigation
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {categories.map(cat => (
    <a key={cat.name} href={cat.href} className="group relative rounded-2xl overflow-hidden aspect-square">
      <img src={cat.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
        <p className="text-sm text-white/70">{cat.count} products</p>
      </div>
    </a>
  ))}
</div>
```

---

## Agency/Portfolio Patterns (Light)

### Case Study List
```tsx
<div className="divide-y divide-[var(--color-border)]">
  {projects.map((project, i) => (
    <a key={project.slug} href={`/work/${project.slug}`} className="group flex items-center justify-between py-8 md:py-12">
      <div className="flex items-center gap-6 md:gap-12">
        <span className="text-sm font-mono text-[var(--color-text-tertiary)]">
          {String(i + 1).padStart(2, '0')}
        </span>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold group-hover:text-[var(--color-accent-1)] transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{project.category} · {project.year}</p>
        </div>
      </div>
      <ArrowRight className="h-5 w-5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent-1)] group-hover:translate-x-2 transition-all" />
    </a>
  ))}
</div>
```

### Project Hover Reveal
```tsx
<div className="space-y-1">
  {projects.map(project => (
    <a
      key={project.slug}
      href={`/work/${project.slug}`}
      className="group relative flex items-center justify-between py-6 px-6 rounded-xl hover:bg-[var(--color-accent-1)]/5 transition-colors"
      onMouseEnter={(e) => {
        // Show preview image
        const preview = e.currentTarget.querySelector('[data-preview]') as HTMLElement
        if (preview) preview.style.opacity = '1'
      }}
      onMouseLeave={(e) => {
        const preview = e.currentTarget.querySelector('[data-preview]') as HTMLElement
        if (preview) preview.style.opacity = '0'
      }}
    >
      <h3 className="text-xl font-bold">{project.title}</h3>
      <span className="text-sm text-[var(--color-text-secondary)]">{project.category}</span>

      {/* Preview image that appears on hover */}
      <div
        data-preview
        className="absolute right-24 top-1/2 -translate-y-1/2 w-48 h-32 rounded-lg overflow-hidden shadow-xl opacity-0 transition-opacity duration-300 pointer-events-none z-10"
      >
        <img src={project.thumbnail} alt="" className="w-full h-full object-cover" />
      </div>
    </a>
  ))}
</div>
```

---

## Light-Mode Best Practices

1. **Background is NEVER pure white** — use warm off-whites (#faf9f6, #f7f4ee, #fffbf5)
2. **Shadows replace glows** — light mode uses shadow depth, not neon/glow effects
3. **Borders are lighter** — rgba(0,0,0,0.06) not gray-300
4. **Cards are white on tinted backgrounds** — elevation through background contrast
5. **Accent colors can be bolder** — dark-on-light has more contrast room for vibrant accents
6. **Images need warm color grading** — cool-toned photos on warm backgrounds clash
7. **Text is warm-black** (#1a1a1a, #2a2520) not pure #000000
8. **Buttons can be dark** — dark fill buttons (bg-[text-primary] text-white) work great in light mode
9. **Hover states use subtle background shifts** — hover:bg-gray-50 instead of glow effects
10. **Grain/noise at 2-3%** — lighter than dark mode (which uses 3-5%)
