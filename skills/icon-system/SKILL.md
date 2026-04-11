---
name: icon-system
description: "Icon system management: library selection, size scales, stroke weight per archetype, DNA color mapping, accessibility, animation patterns, and consistency enforcement. Icons are 20-30% of UI pixels."
tier: domain
triggers: "icon, icons, icon system, icon library, Lucide, Heroicons, icon size, icon animation, icon accessibility"
version: "2.2.0"
---

## Layer 1: Decision Guidance

### When to Use

- Setting up a new project's icon system during `/gen:start-project` or `/gen:plan` Wave 0
- Choosing an icon library for a project
- Defining icon sizes, colors, and stroke weights in DESIGN-DNA.md
- Animating icons for interaction feedback or state transitions
- Auditing icon consistency across sections (size mismatches, mixed libraries, color drift)

### When NOT to Use

- For decorative SVG shapes and patterns (use `shape-asset-generation`)
- For logo/wordmark design (icons are functional UI elements, not brand marks)
- For illustration systems (use `image-prompt-generation` or custom illustrations)

### Decision Tree

```
Is the project using a component library (shadcn/ui)?
  YES → Use Lucide (shadcn default, tree-shakeable, consistent stroke)
  NO → Continue below

Is the archetype geometric/minimal (Swiss, Brutalist, Data-Dense, Neo-Corporate)?
  YES → Use Lucide or Heroicons (clean geometric strokes)
  NO → Continue below

Is the archetype organic/warm (Organic, Warm Artisan, Dark Academia)?
  YES → Use Phosphor Icons (warm, rounded variants) or custom SVG
  NO → Continue below

Is the archetype playful (Playful/Startup, Vaporwave)?
  YES → Use Heroicons Solid or custom illustrated icons
  NO → Default to Lucide (broadest compatibility)
```

### Pipeline Connection

- **Referenced by:** builder agents when creating UI components with icons
- **Consumed at:** Wave 0 scaffold (icon library installation), Wave 1+ section builds
- **Input from:** DESIGN-DNA.md (archetype, color tokens, signature element)
- **Output to:** Component code (icon imports), DESIGN-SYSTEM.md (icon registry)

---

## Layer 2: Implementation Reference

### Icon Library Recommendations Per Archetype

| Archetype | Primary Library | Style | Rationale |
|-----------|----------------|-------|-----------|
| Brutalist | Lucide | Outline, 1.5px stroke | Geometric precision matches raw aesthetic |
| Ethereal | Phosphor | Thin, 1px stroke | Delicate strokes match weightless feel |
| Kinetic | Heroicons Outline | Medium, 1.5px stroke | Clean lines that don't compete with motion |
| Editorial | Lucide | Outline, 1.5px stroke | Precise, readable, journalistic feel |
| Neo-Corporate | Lucide | Outline, 1.5px stroke | Professional, clean, universally readable |
| Organic | Phosphor | Duotone variant | Warm, layered depth matches organic feel |
| Retro-Future | Custom SVG | Outlined, geometric | Retro-tech aesthetic needs custom treatment |
| Luxury/Fashion | Lucide Thin | Thin, 1px stroke | Elegant restraint, editorial precision |
| Playful/Startup | Heroicons Solid | Filled, colorful | Fun, approachable, high-energy |
| Data-Dense | Lucide | Outline, 1.5px stroke | Functional clarity in dense layouts |
| Japanese Minimal | Lucide Thin | Thin, 1px stroke | Zen restraint, deliberate simplicity |
| Glassmorphism | Phosphor | Thin + blur backdrop | Icons over glass need thin strokes for readability |
| Neon Noir | Custom SVG | Outlined + glow effect | Neon glow on strokes matches aesthetic |
| Warm Artisan | Phosphor or Custom | Duotone or hand-drawn | Warmth over precision |
| Swiss/International | Lucide | Outline, 1.5px stroke | Grid-precise, systematic |
| Vaporwave | Custom SVG | Retro pixel or outline | Nostalgic aesthetic needs custom treatment |
| Neubrutalism | Heroicons Solid | Filled, bold | Chunky, bold, high-contrast |
| Dark Academia | Phosphor | Duotone, warm tones | Scholarly warmth, layered depth |
| AI-Native | Lucide | Outline, animated | Clean lines that can pulse/glow algorithmically |

### Size Scale System

Every project MUST define an icon size scale in DESIGN-DNA.md:

```
## Icon System
icon_library: lucide-react
icon_sizes:
  xs: 14px    # Inline text, badges, labels
  sm: 16px    # Form inputs, small buttons, breadcrumbs
  md: 20px    # Default size — navigation, list items, card actions
  lg: 24px    # Section headings, primary actions, hero elements
  xl: 32px    # Feature icons, empty states, onboarding
  2xl: 48px   # Hero icons, large feature callouts
icon_stroke: 1.5    # Default stroke width (Lucide default)
icon_color: var(--color-text)  # Default — inherits text color via currentColor
```

**Size enforcement:** Components MUST use named sizes from this scale. No arbitrary pixel values (18px, 22px, 28px). Use `className="size-[var(--icon-md)]"` or a typed utility.

### Color Token Mapping

Icons inherit color from their parent text context by default (`currentColor`). For emphasis:

| Context | Icon Color Token | Example |
|---------|-----------------|---------|
| Default (body text) | `--color-text` (via currentColor) | Navigation items, list icons |
| Primary action | `--color-primary` | CTA button icons, active states |
| Secondary/muted | `--color-muted` | Help icons, metadata |
| Accent/highlight | `--color-accent` | Notification badges, new indicators |
| Success/error/warning | Semantic tokens | Form validation, status indicators |
| On dark background | `--color-bg` or white | Icons on colored buttons |

### Accessibility Requirements

```tsx
// Decorative icons (paired with text label): hide from screen readers
<Search className="size-5" aria-hidden="true" />
<span>Search</span>

// Standalone icons (no text label): require accessible name
<button aria-label="Close dialog">
  <X className="size-5" />
</button>

// Icon buttons: always have aria-label
<IconButton icon={<Settings className="size-5" />} aria-label="Open settings" />

// Status icons: convey meaning beyond color
<span className="flex items-center gap-1.5">
  <CheckCircle className="size-4 text-green-600" aria-hidden="true" />
  <span>Approved</span>  {/* Text conveys the status, not just the icon */}
</span>
```

### Icon Animation Patterns

**Interaction feedback (hover/click):**
```tsx
// Subtle scale on hover (all archetypes)
<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
  <Heart className="size-5" />
</motion.div>

// Rotation on click (Kinetic, Playful)
<motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: 'spring' }}>
  <ChevronDown className="size-5" />
</motion.div>
```

**Loading states:**
```tsx
// Spinner (all archetypes)
<Loader2 className="size-5 animate-spin" />

// Pulse (Ethereal, Glassmorphism)
<motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }}>
  <Circle className="size-5" />
</motion.div>
```

**State transitions:**
```tsx
// Icon swap with crossfade
<AnimatePresence mode="wait">
  <motion.div key={isLiked ? 'liked' : 'not-liked'}
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.5, opacity: 0 }}
  >
    {isLiked ? <HeartFilled className="size-5 text-red-500" /> : <Heart className="size-5" />}
  </motion.div>
</AnimatePresence>
```

### Installation Patterns

```tsx
// Lucide (recommended default)
// npm install lucide-react
import { Search, Heart, Settings, ChevronDown, X } from 'lucide-react';

// Heroicons
// npm install @heroicons/react
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';

// Phosphor
// npm install @phosphor-icons/react
import { MagnifyingGlass, Heart } from '@phosphor-icons/react';
```

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Icon Usage |
|-----------|-----------|
| `--color-text` | Default icon color via currentColor |
| `--color-primary` | Active/selected state icons, CTA icon color |
| `--color-muted` | Secondary/helper icons |
| `--color-accent` | Notification badges, new indicators |
| `--font-mono` | Icon labels in data-dense layouts |
| Archetype personality | Determines library choice, stroke weight, animation style |
| Signature element | May influence custom icon shapes (e.g., hexagonal icons for hex signature) |

### Component Registry

Icons should be registered in DESIGN-SYSTEM.md:

```markdown
## Icon Registry
| Name | Library | Size | Stroke | Usage |
|------|---------|------|--------|-------|
| Navigation icons | lucide-react | md (20px) | 1.5 | Nav links |
| Action buttons | lucide-react | sm (16px) | 1.5 | Button icons |
| Feature icons | lucide-react | xl (32px) | 1.5 | Feature grid |
| Status indicators | lucide-react | xs (14px) | 2.0 | Badges, tags |
```

### Related Skills

- **shadcn-components** -- shadcn uses Lucide by default; this skill defines the broader system
- **accessibility** -- Icon accessibility patterns (aria-label, aria-hidden, role="img")
- **design-dna** -- DNA should include icon_library, icon_sizes, icon_stroke in its template
- **component-consistency** -- Icon size/color consistency across sections

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Mixed Icon Libraries

**What goes wrong:** Hero uses Heroicons, features section uses Lucide, footer uses Font Awesome. Different stroke weights, different visual grids, different sizing conventions. The page looks like it was assembled from different templates.
**Instead:** Choose ONE primary library per project. Register it in DESIGN-DNA.md. All builders use the same library.

### Anti-Pattern: Arbitrary Icon Sizes

**What goes wrong:** Icons are 18px here, 22px there, 28px elsewhere. No visual system. Some icons feel cramped, others oversized.
**Instead:** Use the named size scale (xs/sm/md/lg/xl/2xl). Never use arbitrary pixel values.

### Anti-Pattern: Icons Without Accessible Names

**What goes wrong:** Icon-only buttons have no aria-label. Screen readers announce "button" with no context. Keyboard users can focus the button but don't know what it does.
**Instead:** Every standalone icon (not paired with visible text) MUST have an aria-label or sr-only text.

### Anti-Pattern: Color-Only Status Icons

**What goes wrong:** A green checkmark means "success" and a red X means "error," but the meaning is conveyed ONLY by color. Color-blind users can't distinguish them.
**Instead:** Always pair status icons with text labels. Use shape differences (check vs X) in addition to color.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Icon libraries per project | 1 | 1 | count | HARD -- one primary library only |
| Named size scale levels | 4 | 6 | levels | HARD -- must define at least xs/sm/md/lg |
| Standalone icons with aria-label | 100 | 100 | percent | HARD -- every icon-only element needs accessible name |
| Icon stroke consistency | 100 | 100 | percent | SOFT -- same stroke weight across all icons in a section |
