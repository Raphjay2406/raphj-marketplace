---
name: archetype-component-variants
description: "Per-archetype Tailwind CSS presets for shadcn/ui components. How Button, Card, Input, Table, Badge, and Nav adapt their border-radius, shadows, focus rings, hover states, and typography per archetype. The bridge between archetype personality and component-level styling."
tier: core
triggers: "archetype component, component variant, button style, card style, archetype styling, component customization, shadcn archetype"
version: "2.3.0"
---

## Layer 1: Decision Guidance

You are a component stylist who ensures every UI element expresses its archetype's personality. A Brutalist button must FEEL brutal -- sharp, heavy, unapologetic. An Ethereal button must FEEL weightless -- translucent, soft, barely there. If your buttons look the same across archetypes, you have failed the design. This skill provides copy-paste Tailwind class presets for the 6 most common component types across 8 representative archetypes.

### When to Use

- **Every build, every project** -- Wave 0 scaffold applies these presets to all shared components
- **Component creation** -- Any time a new shadcn/ui component is added to the project
- **Archetype selection** -- After archetype is locked in DESIGN-DNA.md, pull matching presets
- **Quality review** -- Reviewer checks components against archetype presets for compliance
- **Polishing pass** -- Polisher verifies hover states, focus rings, and transitions match archetype

### When NOT to Use

- For color token VALUES -- use `design-dna` (this skill drives SHAPE and BEHAVIOR, not color)
- For layout decisions -- use `compositional-diversity` or `emotional-arc`
- For motion choreography -- use `cinematic-motion` (this skill covers component-level transitions only)

### Decision Tree

- If archetype is one of the 8 covered here, apply presets directly
- If archetype is not covered, interpolate from the closest match (see mapping table below)
- If custom archetype, derive presets from the 4 personality adjectives + mandatory techniques
- If mixing archetypes (tension override), apply base archetype presets and override ONE component type

### Archetype Coverage Mapping

| Archetype | Covered Here | If Not, Derive From |
|-----------|-------------|---------------------|
| Brutalist | YES | -- |
| Ethereal | YES | -- |
| Kinetic | YES | -- |
| Neo-Corporate | YES | -- |
| Luxury/Fashion | YES | -- |
| Japanese Minimal | YES | -- |
| Neon Noir | YES | -- |
| Playful/Startup | YES | -- |
| Editorial | -- | Swiss/International + Luxury/Fashion |
| Organic | -- | Ethereal + Warm Artisan radius |
| Retro-Future | -- | Kinetic + Neon Noir palette |
| Data-Dense | -- | Neo-Corporate + tighter padding |
| Glassmorphism | -- | Ethereal + stronger backdrop-blur |
| Warm Artisan | -- | Organic shapes + Playful warmth |
| Swiss/International | -- | Neo-Corporate + stricter grid |
| Vaporwave | -- | Neon Noir + Playful radius |
| Neubrutalism | -- | Brutalist + Playful colors |
| Dark Academia | -- | Luxury/Fashion + Editorial serif |
| AI-Native | -- | Neon Noir + Ethereal glass |

### Pipeline Connection

- **Referenced by:** Builder agent during Wave 0-1 scaffold generation
- **Referenced by:** Polisher agent during end-of-build polish pass
- **Referenced by:** Quality Reviewer during 72-point quality gate (Component Consistency check)
- **Consumed at:** `/gen:build` Wave 0 (design system scaffold) and Wave 1 (shared UI components)

## Layer 2: Award-Winning Examples

### 1. Button Variants

#### Brutalist Button
```tsx
<Button className="rounded-none border-2 border-foreground font-mono text-sm uppercase tracking-[0.2em]
  px-8 py-3 bg-primary text-primary-foreground
  shadow-[4px_4px_0_hsl(var(--foreground))] 
  hover:shadow-none hover:translate-x-1 hover:translate-y-1
  active:translate-x-1 active:translate-y-1 active:shadow-none
  transition-none
  focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background" />
```

#### Ethereal Button
```tsx
<Button className="rounded-full border border-white/20 backdrop-blur-sm bg-white/5
  px-8 py-3 font-light tracking-wide text-sm
  shadow-lg shadow-primary/5
  hover:bg-white/10 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02]
  active:scale-[0.98]
  transition-all duration-500 ease-out
  focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:ring-offset-0" />
```

#### Kinetic Button
```tsx
<Button className="rounded-lg border-0 bg-primary text-primary-foreground
  px-7 py-3 font-semibold text-sm tracking-tight
  shadow-md shadow-primary/20
  hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 hover:scale-[1.03]
  active:translate-y-0 active:scale-[0.97] active:shadow-sm
  transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
  focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
```

#### Neo-Corporate Button
```tsx
<Button className="rounded-md border border-border bg-primary text-primary-foreground
  px-6 py-2.5 font-medium text-sm tracking-normal
  shadow-sm
  hover:bg-primary/90 hover:shadow-md
  active:bg-primary/80 active:shadow-none
  transition-colors duration-150 ease-in-out
  focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2" />
```

#### Luxury/Fashion Button
```tsx
<Button className="rounded-none border border-foreground/30 bg-transparent text-foreground
  px-10 py-3.5 font-light text-xs uppercase tracking-[0.3em]
  shadow-none
  hover:bg-foreground hover:text-background hover:border-foreground
  active:opacity-80
  transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
  focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background" />
```

#### Japanese Minimal Button
```tsx
<Button className="rounded-sm border border-border/50 bg-transparent text-foreground
  px-6 py-2.5 font-normal text-sm tracking-wide
  shadow-none
  hover:border-foreground/80 hover:bg-foreground/[0.03]
  active:bg-foreground/[0.06]
  transition-colors duration-300 ease-out
  focus-visible:ring-1 focus-visible:ring-foreground/30 focus-visible:ring-offset-4" />
```

#### Neon Noir Button
```tsx
<Button className="rounded-md border border-primary/50 bg-primary/10 text-primary
  px-7 py-3 font-medium text-sm tracking-wide
  shadow-[0_0_15px_hsl(var(--primary)/0.15)] 
  hover:shadow-[0_0_25px_hsl(var(--primary)/0.3)] hover:border-primary hover:bg-primary/20
  active:shadow-[0_0_10px_hsl(var(--primary)/0.2)] active:bg-primary/15
  transition-all duration-300 ease-out
  focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" />
```

#### Playful/Startup Button
```tsx
<Button className="rounded-2xl border-0 bg-primary text-primary-foreground
  px-7 py-3 font-bold text-sm tracking-normal
  shadow-lg shadow-primary/25
  hover:shadow-xl hover:shadow-primary/30 hover:scale-105 hover:-rotate-1
  active:scale-95 active:rotate-0
  transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
  focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
```

### 2. Card Variants

#### Brutalist Card
```tsx
<Card className="rounded-none border-2 border-foreground bg-background
  p-0 overflow-hidden
  shadow-[6px_6px_0_hsl(var(--foreground))]
  hover:shadow-[8px_8px_0_hsl(var(--foreground))] hover:-translate-x-0.5 hover:-translate-y-0.5
  transition-none">
  <CardHeader className="border-b-2 border-foreground p-6 font-mono uppercase tracking-widest" />
  <CardContent className="p-6" />
</Card>
```

#### Ethereal Card
```tsx
<Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl
  p-0 overflow-hidden
  shadow-xl shadow-black/5
  hover:shadow-2xl hover:bg-white/8 hover:border-white/20 hover:scale-[1.01]
  transition-all duration-500 ease-out">
  <CardHeader className="p-6 pb-2" />
  <CardContent className="p-6 pt-2" />
</Card>
```

#### Kinetic Card
```tsx
<Card className="rounded-xl border border-border bg-card
  p-0 overflow-hidden
  shadow-lg shadow-black/5
  hover:shadow-2xl hover:-translate-y-2 hover:rotate-[0.5deg]
  active:translate-y-0 active:rotate-0
  transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
  <CardHeader className="p-6 pb-3" />
  <CardContent className="p-6 pt-3" />
</Card>
```

#### Neo-Corporate Card
```tsx
<Card className="rounded-lg border border-border bg-card
  p-0 overflow-hidden
  shadow-sm
  hover:shadow-md hover:border-border/80
  transition-shadow duration-200 ease-in-out">
  <CardHeader className="p-5 pb-3" />
  <CardContent className="p-5 pt-3" />
</Card>
```

#### Luxury/Fashion Card
```tsx
<Card className="rounded-none border border-border/20 bg-card
  p-0 overflow-hidden
  shadow-none
  hover:border-foreground/40
  transition-all duration-700 ease-out
  group">
  <CardHeader className="p-8 pb-4 font-light tracking-wide" />
  <CardContent className="p-8 pt-4" />
</Card>
```

#### Japanese Minimal Card
```tsx
<Card className="rounded-sm border-0 border-b border-border/30 bg-transparent
  p-0 overflow-hidden
  shadow-none
  hover:border-foreground/50 hover:bg-foreground/[0.02]
  transition-colors duration-400 ease-out">
  <CardHeader className="p-6 pb-3" />
  <CardContent className="p-6 pt-3" />
</Card>
```

#### Neon Noir Card
```tsx
<Card className="rounded-lg border border-primary/20 bg-background/80 backdrop-blur-sm
  p-0 overflow-hidden
  shadow-[0_0_20px_hsl(var(--primary)/0.05)]
  hover:shadow-[0_0_40px_hsl(var(--primary)/0.12)] hover:border-primary/40
  transition-all duration-400 ease-out">
  <CardHeader className="p-6 pb-3 border-b border-primary/10" />
  <CardContent className="p-6 pt-3" />
</Card>
```

#### Playful/Startup Card
```tsx
<Card className="rounded-3xl border-2 border-border bg-card
  p-0 overflow-hidden
  shadow-xl shadow-black/5
  hover:shadow-2xl hover:-translate-y-1 hover:rotate-[-0.5deg]
  active:translate-y-0 active:rotate-0
  transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
  <CardHeader className="p-6 pb-3" />
  <CardContent className="p-6 pt-3" />
</Card>
```

### 3. Input/Form Field Variants

#### Brutalist Input
```tsx
<Input className="rounded-none border-2 border-foreground bg-background
  px-4 py-2.5 font-mono text-sm
  placeholder:text-muted-foreground/50 placeholder:uppercase placeholder:tracking-widest placeholder:text-xs
  focus:ring-0 focus:border-foreground focus:shadow-[3px_3px_0_hsl(var(--foreground))]
  transition-none" />
```

#### Ethereal Input
```tsx
<Input className="rounded-full border border-white/15 bg-white/5 backdrop-blur-sm
  px-5 py-2.5 font-light text-sm tracking-wide
  placeholder:text-muted-foreground/40
  focus:ring-0 focus:border-accent/40 focus:bg-white/8 focus:shadow-lg focus:shadow-primary/5
  transition-all duration-400 ease-out" />
```

#### Kinetic Input
```tsx
<Input className="rounded-lg border border-border bg-card
  px-4 py-2.5 text-sm
  placeholder:text-muted-foreground/50
  focus:ring-2 focus:ring-primary/20 focus:border-primary focus:-translate-y-px focus:shadow-md
  transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
```

#### Neo-Corporate Input
```tsx
<Input className="rounded-md border border-border bg-background
  px-3.5 py-2 text-sm
  placeholder:text-muted-foreground/60
  focus:ring-2 focus:ring-primary/20 focus:border-primary
  transition-colors duration-150 ease-in-out" />
```

#### Luxury/Fashion Input
```tsx
<Input className="rounded-none border-0 border-b border-border/40 bg-transparent
  px-0 py-3 font-light text-sm tracking-wide
  placeholder:text-muted-foreground/30 placeholder:tracking-[0.2em] placeholder:text-xs
  focus:ring-0 focus:border-foreground focus:border-b-2
  transition-all duration-500 ease-out" />
```

#### Japanese Minimal Input
```tsx
<Input className="rounded-sm border border-border/30 bg-transparent
  px-3 py-2.5 text-sm tracking-wide
  placeholder:text-muted-foreground/30
  focus:ring-0 focus:border-foreground/50 focus:bg-foreground/[0.02]
  transition-colors duration-300 ease-out" />
```

#### Neon Noir Input
```tsx
<Input className="rounded-md border border-primary/20 bg-background/60 backdrop-blur-sm
  px-4 py-2.5 text-sm
  placeholder:text-muted-foreground/40
  focus:ring-0 focus:border-primary/60 focus:shadow-[0_0_15px_hsl(var(--primary)/0.1)] focus:bg-background/80
  transition-all duration-300 ease-out" />
```

#### Playful/Startup Input
```tsx
<Input className="rounded-xl border-2 border-border bg-card
  px-4 py-2.5 text-sm
  placeholder:text-muted-foreground/50
  focus:ring-2 focus:ring-primary/30 focus:border-primary focus:scale-[1.01]
  transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
```

### 4. Badge/Tag Variants

#### Brutalist Badge
```tsx
<Badge className="rounded-none border-2 border-foreground bg-foreground text-background
  px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]
  shadow-[2px_2px_0_hsl(var(--foreground)/0.4)]" />
```

#### Ethereal Badge
```tsx
<Badge className="rounded-full border border-white/15 bg-white/10 backdrop-blur-sm text-foreground
  px-4 py-1 font-light text-xs tracking-wide" />
```

#### Kinetic Badge
```tsx
<Badge className="rounded-lg border-0 bg-primary/15 text-primary
  px-3 py-1 font-semibold text-xs
  hover:bg-primary/25 hover:scale-105
  transition-all duration-200" />
```

#### Neo-Corporate Badge
```tsx
<Badge className="rounded-md border border-border bg-muted text-muted-foreground
  px-2.5 py-0.5 font-medium text-xs" />
```

#### Luxury/Fashion Badge
```tsx
<Badge className="rounded-none border border-foreground/30 bg-transparent text-foreground
  px-4 py-1 font-light text-[10px] uppercase tracking-[0.25em]" />
```

#### Japanese Minimal Badge
```tsx
<Badge className="rounded-sm border-0 bg-foreground/[0.06] text-foreground/80
  px-3 py-1 font-normal text-xs tracking-wide" />
```

#### Neon Noir Badge
```tsx
<Badge className="rounded-md border border-primary/30 bg-primary/10 text-primary
  px-3 py-1 font-medium text-xs
  shadow-[0_0_8px_hsl(var(--primary)/0.15)]" />
```

#### Playful/Startup Badge
```tsx
<Badge className="rounded-full border-2 border-primary/20 bg-primary/10 text-primary
  px-4 py-1 font-bold text-xs" />
```

### 5. Navigation Variants

#### Brutalist Nav Link
```tsx
<a className="font-mono text-xs uppercase tracking-[0.2em] text-foreground
  border-b-2 border-transparent
  hover:border-foreground
  transition-none
  data-[active]:border-foreground data-[active]:bg-foreground data-[active]:text-background data-[active]:px-2" />
```

#### Ethereal Nav Link
```tsx
<a className="font-light text-sm tracking-wide text-foreground/70
  hover:text-foreground
  transition-colors duration-500 ease-out
  data-[active]:text-foreground
  relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
  after:h-px after:w-0 after:bg-accent/50 hover:after:w-full after:transition-all after:duration-500" />
```

#### Kinetic Nav Link
```tsx
<a className="font-medium text-sm text-foreground/70
  hover:text-primary hover:-translate-y-0.5
  transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
  data-[active]:text-primary
  relative after:absolute after:bottom-[-4px] after:left-0
  after:h-0.5 after:w-0 after:bg-primary after:rounded-full hover:after:w-full after:transition-all after:duration-300" />
```

#### Neo-Corporate Nav Link
```tsx
<a className="font-medium text-sm text-muted-foreground
  hover:text-foreground
  transition-colors duration-150
  data-[active]:text-foreground
  relative after:absolute after:bottom-[-2px] after:left-0
  after:h-0.5 after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-200" />
```

#### Luxury/Fashion Nav Link
```tsx
<a className="font-light text-xs uppercase tracking-[0.3em] text-foreground/60
  hover:text-foreground
  transition-all duration-700 ease-out
  data-[active]:text-foreground data-[active]:tracking-[0.35em]" />
```

#### Japanese Minimal Nav Link
```tsx
<a className="font-normal text-sm tracking-wide text-foreground/50
  hover:text-foreground/90
  transition-colors duration-300
  data-[active]:text-foreground
  data-[active]:border-b data-[active]:border-foreground/30 data-[active]:pb-1" />
```

#### Neon Noir Nav Link
```tsx
<a className="font-medium text-sm text-foreground/60
  hover:text-primary hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.4)]
  transition-all duration-300
  data-[active]:text-primary data-[active]:drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]" />
```

#### Playful/Startup Nav Link
```tsx
<a className="font-bold text-sm text-foreground/70
  hover:text-primary hover:scale-105
  transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
  data-[active]:text-primary data-[active]:bg-primary/10 data-[active]:px-3 data-[active]:py-1 data-[active]:rounded-full" />
```

### 6. Table/Data Variants

#### Brutalist Table
```tsx
<Table className="border-2 border-foreground">
  <TableHeader className="bg-foreground text-background">
    <TableHead className="font-mono text-xs uppercase tracking-[0.2em] border-r-2 border-background/20 py-3" />
  </TableHeader>
  <TableBody>
    <TableRow className="border-b-2 border-foreground hover:bg-foreground/5 transition-none">
      <TableCell className="border-r-2 border-foreground/20 py-3 font-mono text-sm" />
    </TableRow>
  </TableBody>
</Table>
```

#### Ethereal Table
```tsx
<Table className="border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
  <TableHeader className="bg-white/5">
    <TableHead className="font-light text-xs tracking-wide text-foreground/50 py-3 border-b border-white/10" />
  </TableHeader>
  <TableBody>
    <TableRow className="border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-400">
      <TableCell className="py-3 text-sm font-light" />
    </TableRow>
  </TableBody>
</Table>
```

#### Kinetic Table
```tsx
<Table className="border border-border rounded-lg overflow-hidden">
  <TableHeader className="bg-muted/50">
    <TableHead className="font-semibold text-xs tracking-tight py-3 border-b border-border" />
  </TableHeader>
  <TableBody>
    <TableRow className="border-b border-border/50 hover:bg-primary/5 hover:translate-x-0.5 transition-all duration-200">
      <TableCell className="py-3 text-sm" />
    </TableRow>
  </TableBody>
</Table>
```

#### Neo-Corporate Table
```tsx
<Table className="border border-border rounded-md overflow-hidden">
  <TableHeader className="bg-muted">
    <TableHead className="font-medium text-xs text-muted-foreground py-2.5 border-b border-border" />
  </TableHeader>
  <TableBody>
    <TableRow className="border-b border-border/50 even:bg-muted/30 hover:bg-muted/50 transition-colors duration-150">
      <TableCell className="py-2.5 text-sm" />
    </TableRow>
  </TableBody>
</Table>
```

#### Luxury/Fashion Table
```tsx
<Table className="border-0">
  <TableHeader>
    <TableHead className="font-light text-[10px] uppercase tracking-[0.3em] text-foreground/40 py-4 border-b border-border/20" />
  </TableHeader>
  <TableBody>
    <TableRow className="border-b border-border/10 hover:bg-foreground/[0.02] transition-colors duration-500">
      <TableCell className="py-4 text-sm font-light tracking-wide" />
    </TableRow>
  </TableBody>
</Table>
```

#### Japanese Minimal Table
```tsx
<Table className="border-0">
  <TableHeader>
    <TableHead className="font-normal text-xs tracking-wide text-foreground/40 py-3 border-b border-border/20" />
  </TableHeader>
  <TableBody>
    <TableRow className="border-b border-border/10 hover:bg-foreground/[0.02] transition-colors duration-300">
      <TableCell className="py-3 text-sm" />
    </TableRow>
  </TableBody>
</Table>
```

#### Neon Noir Table
```tsx
<Table className="border border-primary/15 rounded-lg overflow-hidden">
  <TableHeader className="bg-primary/5">
    <TableHead className="font-medium text-xs text-primary/70 py-3 border-b border-primary/15" />
  </TableHeader>
  <TableBody>
    <TableRow className="border-b border-primary/10 hover:bg-primary/[0.07] hover:shadow-[inset_0_0_20px_hsl(var(--primary)/0.05)] transition-all duration-300">
      <TableCell className="py-3 text-sm" />
    </TableRow>
  </TableBody>
</Table>
```

#### Playful/Startup Table
```tsx
<Table className="border-2 border-border rounded-2xl overflow-hidden">
  <TableHeader className="bg-primary/5">
    <TableHead className="font-bold text-xs py-3 border-b-2 border-border" />
  </TableHeader>
  <TableBody>
    <TableRow className="border-b border-border/50 even:bg-muted/20 hover:bg-primary/5 hover:scale-[1.002] transition-all duration-200">
      <TableCell className="py-3 text-sm font-medium" />
    </TableRow>
  </TableBody>
</Table>
```

### Reference Sites

- **Linear** (linear.app) -- Neo-Corporate archetype executed at the component level: uniform rounded-lg radius, subtle shadows, crisp focus rings, no ornament
- **Vercel** (vercel.com) -- Japanese Minimal + Neo-Corporate hybrid: borderless cards, transparent inputs, restrained hover states
- **Stripe** (stripe.com) -- Luxury/Fashion button precision: generous letter-spacing, subtle border transitions, elevated focus states
- **Framer** (framer.com) -- Kinetic energy in every component: spring-physics hover, rotation microinteractions, elevation changes
- **Gumroad** (gumroad.com) -- Playful/Startup: bold rounded corners, high-contrast shadows, bouncy transitions

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `--primary` | Button fill, badge accent, focus ring, active nav indicator |
| `--foreground` | Brutalist/Luxury border color, text color, nav link active state |
| `--border` | Neo-Corporate/Japanese Minimal component borders |
| `--muted` | Neo-Corporate badge fill, table alternating rows |
| `--accent` | Ethereal focus ring, nav hover indicator |
| `--surface` | Card backgrounds via `bg-card` |
| `--glow` | Neon Noir shadow colors (substitute for `--primary` in glows) |
| `--motion-duration-base` | Transition duration base; archetype multiplies (Brutalist=0, Ethereal=2x, Kinetic=0.8x) |

### How to Install Presets

**Option A: Globals (recommended for full archetype adoption)**

Add archetype-specific CSS custom properties or Tailwind `@layer components` blocks in `globals.css`:

```css
@layer components {
  /* Brutalist overrides */
  .btn-archetype { @apply rounded-none border-2 border-foreground font-mono uppercase tracking-[0.2em] shadow-[4px_4px_0_hsl(var(--foreground))] transition-none; }
  .card-archetype { @apply rounded-none border-2 border-foreground shadow-[6px_6px_0_hsl(var(--foreground))]; }
  .input-archetype { @apply rounded-none border-2 border-foreground font-mono; }
  .badge-archetype { @apply rounded-none border-2 border-foreground font-mono uppercase tracking-[0.2em] text-[10px]; }
}
```

**Option B: Component-level (for selective application)**

Apply classes directly on each component instance. Best when mixing component styles or when only some components need archetype treatment.

### Pipeline Stage

- **Input from:** `design-archetypes` (selected archetype), `design-dna` (color tokens, motion tokens)
- **Output to:** Builder agent (component class presets), Polisher (compliance checklist), Quality Reviewer (scoring)

### Related Skills

- `design-archetypes` -- Provides the archetype identity this skill translates into component-level styling
- `design-dna` -- Provides color tokens; this skill provides shape/behavior tokens
- `shadcn-components` -- Component API reference; this skill provides archetype-aware class overrides
- `cinematic-motion` -- Handles page-level motion; this skill handles component-level transition timing
- `design-system-scaffold` -- Wave 0 scaffold consumes these presets to generate the initial design system
- `component-consistency` -- Ensures all instances of a component type use the same archetype preset

## Layer 4: Anti-Patterns

### Anti-Pattern: Generic Component Soup

**What goes wrong:** All components use shadcn/ui defaults (rounded-md, shadow-sm, ring-2 ring-ring) regardless of archetype. A Brutalist project looks like every other shadcn site. Archetype personality is communicated only through color, not through shape, weight, motion, or interaction.
**Instead:** Apply full archetype preset from this skill during Wave 0. Shape and behavior carry more personality than color alone. A Brutalist button with rounded corners is not Brutalist, even with the right colors.

### Anti-Pattern: Archetype Mixing Without Tension Override

**What goes wrong:** Builder applies Ethereal cards but Brutalist buttons because they "liked both." Result is visual incoherence -- the components fight each other instead of reinforcing the same personality.
**Instead:** Pick ONE archetype for all components. If you must mix, use the Tension Override Mechanism: document which component breaks the archetype, name the specific rule, and explain the creative rationale. Only ONE component type may deviate.

### Anti-Pattern: Color-Only Theming

**What goes wrong:** Builder changes DNA color tokens but leaves all components at default border-radius, shadow, and transition values. The site has the right palette but zero personality in its interactions. Fails Awwwards Creativity axis (drops below 7).
**Instead:** Archetype personality is expressed through FIVE channels: border-radius, shadow system, transition timing, hover behavior, and typography treatment. Color is only one of these. This skill provides the other four.

### Anti-Pattern: Overriding Archetype Transitions with Defaults

**What goes wrong:** Builder uses `transition-all duration-200` on a Luxury/Fashion project. The archetype demands `duration-500` or `duration-700` -- luxury is SLOW. Generic transition durations erase the archetype's temporal personality.
**Instead:** Follow the transition timing from this skill's presets. Brutalist = `transition-none`. Ethereal = `duration-500`. Kinetic = `duration-200` with spring easing. Luxury = `duration-500` to `duration-700`. Japanese Minimal = `duration-300`. Neon Noir = `duration-300`. Playful = `duration-200` to `duration-300` with bounce easing.

### Anti-Pattern: Ignoring Focus States

**What goes wrong:** Builder removes or genericizes `focus-visible` styles because they "look ugly." Accessibility fails AND the archetype's focus ring personality is lost -- Brutalist needs thick offset rings, Ethereal needs barely-visible glows, Neon Noir needs colored glow rings.
**Instead:** Every archetype has a designed focus state in this skill. Focus rings are part of the personality, not an afterthought. Use the exact `focus-visible` classes from the preset.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| archetype-component-types-styled | 6 | 6 | count | HARD -- all 6 component types must have archetype presets |
| border-radius-variance-across-archetypes | 3 | -- | distinct values | HARD -- at least 3 different radius values across archetypes |
| transition-duration-brutalist | 0 | 0 | ms | HARD -- Brutalist must use transition-none |
| transition-duration-luxury | 400 | 700 | ms | SOFT -- Luxury transitions should be slow |
| transition-duration-kinetic | 150 | 300 | ms | SOFT -- Kinetic transitions should be fast |
| focus-visible-presence | 1 | -- | per component | HARD -- every interactive component must have focus-visible |
| archetype-preset-deviation | 0 | 1 | component types | HARD -- max 1 component type may deviate via tension override |
