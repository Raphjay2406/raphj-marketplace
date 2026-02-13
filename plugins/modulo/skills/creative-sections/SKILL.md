---
name: creative-sections
description: "Creative, memorable UI sections that break conventions. Unique heroes, bento grids, interactive showcases, and sections that feel designed, not templated."
---

Use this skill when the user wants creative design, unique sections, memorable UI, unconventional layouts, bento grid, interactive showcase, or asks for something that looks premium/unique/different.

You are a creative director who designs sections that people screenshot and share. Every section must have a "wow" moment.

## Creative Hero Patterns

### Split Hero with 3D Perspective
```tsx
<section className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
  {/* Ambient glow */}
  <div className="absolute top-[20%] left-[30%] h-[400px] w-[400px] rounded-full bg-[#6366f1]/15 blur-[120px]" />

  <div className="container mx-auto px-6 pt-32 pb-20">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          Now in public beta
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[0.9] text-white mb-6">
          Build at the{' '}
          <span className="bg-gradient-to-r from-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">
            speed of thought
          </span>
        </h1>
        <p className="text-lg text-white/50 leading-relaxed max-w-lg mb-8">
          The development platform for teams who refuse to compromise on quality or velocity.
        </p>
        <div className="flex items-center gap-4">
          <button className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors">
            Start Building
          </button>
          <button className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors">
            See Demo
          </button>
        </div>
      </div>

      {/* 3D tilted product screenshot */}
      <div className="relative [perspective:1200px]">
        <div className="[transform:rotateY(-8deg)_rotateX(3deg)] rounded-2xl border border-white/[0.08] bg-[#111113] p-2 shadow-[0_40px_100px_-20px_rgba(99,102,241,0.3)]">
          <div className="rounded-xl bg-[#0a0a0f] aspect-[4/3] flex items-center justify-center">
            <span className="text-white/20">Product Screenshot</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Centered Hero with Animated Grid Background
```tsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Animated grid */}
  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
  {/* Fade edges */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#09090b_70%)]" />

  <div className="relative z-10 text-center px-6">
    <h1 className="text-6xl md:text-8xl font-bold tracking-[-0.04em] leading-[0.85] text-white mb-6">
      Ship faster.<br />
      <span className="text-white/30">Think bigger.</span>
    </h1>
    <p className="text-lg text-white/40 max-w-md mx-auto mb-10">
      Where ambitious teams build products that matter.
    </p>
  </div>
</section>
```

## Bento Grid Layouts

### Asymmetric Bento
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[200px]">
  {/* Large feature card */}
  <div className="col-span-2 row-span-2 rounded-3xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] p-8 flex flex-col justify-end">
    <h3 className="text-2xl font-bold text-white">AI-Powered</h3>
    <p className="text-white/70 mt-2">Intelligence built into every workflow.</p>
  </div>

  {/* Metric card */}
  <div className="rounded-3xl border border-white/[0.06] bg-[#111113] p-6 flex flex-col justify-between">
    <Zap className="h-6 w-6 text-[#fbbf24]" />
    <div>
      <p className="text-3xl font-bold text-white">99.9%</p>
      <p className="text-sm text-white/40">Uptime SLA</p>
    </div>
  </div>

  {/* Image card */}
  <div className="rounded-3xl overflow-hidden bg-[#111113]">
    <img src="/placeholder.svg?height=200&width=300" alt="" className="w-full h-full object-cover" />
  </div>

  {/* Wide card */}
  <div className="col-span-2 rounded-3xl border border-white/[0.06] bg-[#111113] p-8 flex items-center gap-6">
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-white">Real-time Collaboration</h3>
      <p className="text-sm text-white/40 mt-1">Work together seamlessly across time zones.</p>
    </div>
    <Users className="h-12 w-12 text-white/10" />
  </div>
</div>
```

## Interactive Showcase Sections

### Tabbed Feature Showcase
```tsx
const [activeTab, setActiveTab] = useState(0)

<section className="py-24">
  <div className="container mx-auto px-6">
    <h2 className="text-4xl font-bold tracking-tight text-center mb-16">How it works</h2>

    <div className="grid lg:grid-cols-[300px_1fr] gap-12">
      {/* Tab navigation */}
      <div className="flex flex-col gap-2">
        {features.map((feature, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={cn(
              "text-left rounded-xl p-4 transition-all",
              activeTab === i
                ? "bg-primary/10 border border-primary/20"
                : "hover:bg-white/5 border border-transparent"
            )}
          >
            <p className="font-semibold text-sm">{feature.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
          </button>
        ))}
      </div>

      {/* Content area with animated transition */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#111113] overflow-hidden aspect-video">
        {/* Feature screenshot/demo */}
      </div>
    </div>
  </div>
</section>
```

### Marquee / Infinite Scroll Logos
```tsx
<div className="relative overflow-hidden py-12 border-y border-white/[0.06]">
  <div className="flex animate-[marquee_30s_linear_infinite] gap-16">
    {[...logos, ...logos].map((logo, i) => (
      <div key={i} className="flex-shrink-0 opacity-30 hover:opacity-70 transition-opacity grayscale hover:grayscale-0">
        <img src={logo.src} alt={logo.name} className="h-8" />
      </div>
    ))}
  </div>
</div>
// @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
```

### Stats with Visual Impact
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
  {stats.map((stat) => (
    <div key={stat.label} className="bg-[#0a0a0f] p-8 text-center">
      <p className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
        {stat.value}
      </p>
      <p className="text-sm text-white/40 mt-2">{stat.label}</p>
    </div>
  ))}
</div>
```

## Comparison / Before-After Section

```tsx
<div className="grid md:grid-cols-2 gap-6">
  {/* Before */}
  <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-8">
    <div className="inline-flex items-center gap-2 text-red-400 text-sm font-medium mb-6">
      <X className="h-4 w-4" /> Without us
    </div>
    <ul className="space-y-3 text-white/50 text-sm">
      {painPoints.map((p) => (
        <li key={p} className="flex items-start gap-2">
          <Minus className="h-4 w-4 text-red-400/50 mt-0.5 flex-shrink-0" />{p}
        </li>
      ))}
    </ul>
  </div>

  {/* After */}
  <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.03] p-8">
    <div className="inline-flex items-center gap-2 text-green-400 text-sm font-medium mb-6">
      <Check className="h-4 w-4" /> With us
    </div>
    <ul className="space-y-3 text-white/70 text-sm">
      {benefits.map((b) => (
        <li key={b} className="flex items-start gap-2">
          <Check className="h-4 w-4 text-green-400/70 mt-0.5 flex-shrink-0" />{b}
        </li>
      ))}
    </ul>
  </div>
</div>
```

## Best Practices

1. **Every section needs a unique visual hook** - don't repeat the same card pattern
2. **Bento grids > uniform grids** - asymmetry is more interesting
3. **Use perspective transforms** on product screenshots for depth
4. **Ambient glow orbs** behind content create mood without effort
5. **Grid backgrounds with radial fade** make content float
6. **Marquee logos** should be grayscale with hover color reveal
7. **Stats sections** work best with gradient text and `gap-px` borders
8. **Tab-based showcases** beat static feature lists every time
9. **Mix rounded corners** - `rounded-3xl` for containers, `rounded-xl` for inner elements
