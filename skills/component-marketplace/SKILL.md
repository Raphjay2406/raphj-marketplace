---
name: component-marketplace
description: "When-to-use guidance for Aceternity UI, Magic UI, 21st.dev, and Framer marketplace. Category-level recommendations per archetype x beat, full restyling protocol for DNA token integration, 30% hard cap on marketplace usage."
tier: domain
triggers: "marketplace, Aceternity, Magic UI, 21st.dev, Framer marketplace, component library, pre-built components, shadcn components, copy-paste components, animated components"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use Marketplace Components

Marketplace components are STARTING POINTS, never final output. Every marketplace component MUST be restyled to match project DNA before shipping. An unstyled marketplace drop-in is indistinguishable from a template -- the anti-slop gate will catch it.

**Best for:**
- Animated interactions that would take significant time to build from scratch (animated grids, parallax cards, text effects, scroll-driven reveals)
- Complex micro-interactions with polished motion choreography (magnetic buttons, hover card effects, staggered grid entrances)
- Interactive UI patterns with non-trivial state management (accordion groups, tab transitions, carousel physics)

**NOT for:**
- Simple layouts, basic cards, standard sections -- build these from DNA to ensure uniqueness
- Core brand moments (signature elements, hero concepts) -- these MUST be custom-built
- Creative tension moments -- tension should be original, not sourced

**Hard cap:** No more than ~30% of a page's visual elements should originate from marketplace components. If you find yourself reaching for a marketplace component for every section, stop -- you are assembling, not designing.

**Decision rule:** If a marketplace component looks impressive but does not fit the archetype, do not use it. Build something archetype-appropriate instead. Impressiveness without coherence is anti-slop territory.

### Marketplace Profiles

| Marketplace | Technology | Strengths | Best For | Installation |
|-------------|-----------|-----------|----------|-------------|
| Aceternity UI | Motion + Tailwind | Premium animated components, dark UI focus, highly animated interactions | High-intensity archetypes (Kinetic, Neon Noir, AI-Native), PEAK/HOOK sections | Copy-paste into project |
| Magic UI | shadcn + Tailwind | 50+ landing page components, startup-focused, clean and polished | Landing pages, startup archetypes (Playful/Startup, Neo-Corporate), BUILD/PROOF sections | Copy-paste, shadcn-based |
| 21st.dev | shadcn + Tailwind + Community | Open registry ("npm for design engineers"), community-contributed, AI-assisted remix | Diverse needs, broad component selection, rapid prototyping | `npx shadcn add` from registry |
| Framer Marketplace | Framer-specific | Templates, motion components, plugins, polished motion design reference | Design REFERENCE and INSPIRATION only | NOT directly portable |

**Critical: Framer Marketplace Limitation**

Framer marketplace components are designed for the Framer platform. They CANNOT be used directly in Next.js, Astro, or any non-Framer project. Use them as design reference only:
- Study their motion patterns, timing, and choreography
- Analyze their layout ideas and spatial relationships
- Extract interaction concepts and user flow patterns
- Then implement custom equivalents using Motion library, GSAP, or CSS animations

Never attempt to "port" a Framer component. Rebuild the concept from scratch using your project's technology stack.

### Which Marketplace for Which Category

| Category | Aceternity UI | Magic UI | 21st.dev | Framer |
|----------|--------------|----------|----------|--------|
| Animated grids/cards | Strong | Strong | Community varies | Reference only |
| Hero sections | Strong | Strong | Growing | Reference only |
| Scroll effects | Moderate | Limited | Community varies | Reference only |
| Interactive elements | Strong | Moderate | Community varies | Reference only |
| Text animations | Moderate | Strong | Community varies | Reference only |
| Testimonials/social proof | Moderate | Strong | Growing | Reference only |
| Navigation/menus | Limited | Moderate | Community varies | Reference only |
| Pricing/comparison | Limited | Strong | Growing | Reference only |
| Form elements | Limited | Moderate | Community varies | Reference only |
| Background effects | Strong | Moderate | Community varies | Reference only |

### Import Path Warning

Many Aceternity UI components use the deprecated `framer-motion` package name. When sourcing ANY Aceternity component, update ALL imports immediately:

```tsx
// BEFORE (deprecated)
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { LazyMotion, m, domAnimation } from 'framer-motion'
import { useMotionValue, useTransform } from 'framer-motion'

// AFTER (current)
import { motion } from 'motion/react'
import { AnimatePresence } from 'motion/react'
import { LazyMotion, m, domAnimation } from 'motion/react'
import { useMotionValue, useTransform } from 'motion/react'
```

Do this BEFORE any other restyling. The `framer-motion` package is deprecated; `motion/react` is the current import path.

### Pipeline Connection

- **Referenced by:** section-builder (specialist: any) during component selection
- **Referenced by:** build-orchestrator during spawn prompt generation (marketplace cap enforcement)
- **Consumed at:** `/gen:execute` Wave 2+ (section building phase)

---

## Layer 2: Award-Winning Examples

### Category Matrix (Archetype x Beat)

This matrix maps (archetype, beat) pairs to appropriate marketplace component CATEGORIES. Entries are category descriptions, not specific component names. Browse the recommended marketplace for current offerings in each category.

**High-Intensity Archetypes**

| Beat | Kinetic | Neon Noir | AI-Native | Brutalist | Neubrutalism |
|------|---------|-----------|-----------|-----------|-------------|
| HOOK | Animated hero grid, particle background, kinetic text | Glowing text reveal, neon-traced grid, dark hero | Data stream visualization, typing terminal, code-rain bg | Raw text reveal, glitch effect, harsh cut | Bold color block hero, thick-border card grid |
| TEASE | Scrolling ticker, animated stat counter | Flickering preview cards, neon line trace | Animated data preview, metric counter | Oversized number reveal, raw ticker | Sticker-style floating elements, rotating badge |
| REVEAL | 3D product viewer, exploded-view animation | Neon-outlined product showcase, dark reveal | Holographic product display, data overlay | Scale violence product grid, raw image dump | Chunky product card with shadow offset |
| BUILD | Animated card grid, staggered accordion | Dark card grid with glow hover, neon tabs | Feature matrix with data viz, animated comparison | Dense info grid, monospace feature list | Thick-border feature cards, bold accordion |
| PEAK | Interactive drag demo, physics simulation | Cinematic neon scroll sequence, glow burst | Interactive data exploration, live demo | Maximum scale violence, raw contrast grid | Giant interactive button, playful drag element |
| BREATHE | Ambient gradient, subtle particle drift | Dim neon pulse, dark breathing space | Subtle data ambient, minimal scan line | Raw whitespace, high contrast pause | Solid color block, minimal breathing space |
| TENSION | Unexpected interaction trigger, speed burst | Neon flicker, sudden glow intensification | Data glitch moment, unexpected metric | Harsh transition, brutal contrast shift | Surprise color clash, oversized element |
| PROOF | Animated counter, testimonial carousel | Neon-styled client logos, dark testimonial | Data-backed metrics, animated proof dashboard | Raw number display, unformatted testimonial | Bold testimonial blocks, chunky logo grid |
| PIVOT | Direction-shift animation, topic transition | Neon color temperature shift, mood change | Data category shift, new metric stream | Abrupt content shift, stark divider | Bold section divider, color block transition |
| CLOSE | Magnetic button CTA, animated form | Glowing CTA with neon trace, pulsing button | Terminal-style CTA, command input | Oversized raw CTA, brutal button | Giant bordered button, sticker CTA |

**Medium-Intensity Archetypes**

| Beat | Editorial | Neo-Corporate | Retro-Future | Glassmorphism | Vaporwave |
|------|-----------|---------------|-------------|---------------|-----------|
| HOOK | Typographic hero, magazine layout grid | Clean hero with subtle motion, polished slider | Retro-styled hero, vintage grid animation | Frosted glass hero card, layered blur panels | Gradient mesh hero, pastel floating shapes |
| TEASE | Pull quote animation, editorial aside | Subtle stat counter, professional preview | Retro ticker, vintage counter | Glass card preview, blur fade-in | Pastel preview cards, floating preview |
| REVEAL | Full-bleed image with caption overlay | Polished product showcase, clean tabs | Vintage product display, retro frame | Glass-panel product viewer, layered reveal | Gradient product showcase, pastel frame |
| BUILD | Column-based feature layout, pull quotes | Feature comparison table, clean accordion | Retro-styled feature cards, vintage tabs | Frosted feature cards, glass accordion | Pastel feature grid, gradient cards |
| PEAK | Full-spread dramatic moment, art direction | Polished interactive demo, professional showcase | Retro-futuristic interactive moment | Layered glass interaction, depth showcase | Peak gradient burst, vaporwave showcase |
| BREATHE | Generous whitespace, minimal text | Clean whitespace, subtle background | Retro spacing, vintage border pause | Glass panel with blur breathing | Soft gradient breathing, pastel pause |
| TENSION | Unexpected editorial juxtaposition | Subtle professional surprise | Retro-modern clash, era collision | Blur intensity shift, glass crack | Color temperature shift, gradient spike |
| PROOF | Elegant blockquote, editorial testimony | Professional logo wall, subtle fade | Vintage-styled testimonial, retro badge | Glass testimonial cards, frosted logos | Pastel testimonial blocks, gradient badges |
| PIVOT | Section mood shift, typography change | Clean section transition, professional shift | Era/decade shift, retro transition | Glass panel swap, blur transition | Gradient palette shift, mood change |
| CLOSE | Refined CTA with editorial voice | Professional CTA, polished button | Retro-styled CTA, vintage button | Frosted CTA button, glass form | Gradient CTA, pastel button |

**Low-Intensity Archetypes**

| Beat | Luxury/Fashion | Ethereal | Japanese Minimal | Warm Artisan | Dark Academia |
|------|---------------|----------|-----------------|-------------|---------------|
| HOOK | Slow reveal gallery, elegant slider, cinematic | Soft particle field, floating elements, aurora | Single object focus, zen entrance, minimal | Handcraft hero, warm texture, organic shapes | Scholarly hero, aged texture, serif title |
| TEASE | Subtle preview animation, refined counter | Gentle floating preview, soft fade | Minimal preview, clean counter | Warm preview, craft texture hint | Book-style preview, aged paper hint |
| REVEAL | Cinematic product reveal, luxury framing | Morphing shape reveal, ethereal transition | Clean product display, zen framing | Handmade-feel product, natural materials | Curated collection reveal, scholarly frame |
| BUILD | Elegant feature list, refined spacing | Gentle card layout, soft shadows, floating | Clean list with micro-animation, space | Warm card grid, natural texture, craft | Stacked text blocks, serif feature list |
| PEAK | Cinematic scroll sequence, luxury moment | Shape morphing, aurora burst, dreamlike | Subtle parallax, precision moment | Artisan craft showcase, warm highlight | Deep scholarly moment, dramatic reveal |
| BREATHE | Generous negative space, breathing | Soft gradient, floating stillness | Pure whitespace, zen emptiness | Warm breathing space, natural pause | Quiet scholarly pause, aged elegance |
| TENSION | Unexpected luxury detail, contrast | Ethereal disruption, color shift | Wabi-sabi imperfection moment | Raw material contrast, craft surprise | Gothic undertone, scholarly surprise |
| PROOF | Refined logo wall, subtle testimonial | Floating testimonials, gentle carousel | Minimal counter, clean quotation | Handwritten-style testimonial, warm | Scholarly citation, book-style proof |
| PIVOT | Mood temperature shift, pacing change | Color dreamscape shift, ethereal transition | Clean section shift, minimal divider | Material change, warm tone shift | Chapter transition, scholarly pivot |
| CLOSE | Elegant CTA, luxury button, refined | Soft CTA, gentle fade-in | Minimal CTA, zen simplicity | Warm CTA, handcraft button | Scholarly CTA, aged button |

**Remaining Archetypes (Compact)**

| Beat | Swiss/International | Data-Dense | Playful/Startup | Organic |
|------|-------------------|------------|-----------------|---------|
| HOOK | Grid-based hero, Helvetica precision | Dashboard-style hero, metric wall | Playful animated hero, bouncy entrance | Flowing organic hero, nature-inspired |
| BUILD | Strict grid layout, modular cards | Dense data tables, compact info grid | Fun feature cards, playful icons | Organic flowing cards, soft edges |
| PEAK | Precision grid moment, Swiss perfection | Data visualization peak, chart showcase | Playful interactive moment, fun demo | Organic growth moment, nature animation |
| PROOF | Grid-aligned logo wall, clean counter | Data-backed proof, chart testimonial | Fun social proof, playful counter | Organic testimonial, natural flow |
| CLOSE | Grid-aligned CTA, precise button | Data-driven CTA, metric summary | Fun CTA, bouncy button | Organic CTA, flowing form |

### Full Restyling Protocol

Every marketplace component MUST go through all four steps before shipping. No exceptions.

#### Step 1: Token Mapping (CSS Variable Swaps)

Replace ALL hardcoded colors with DNA tokens. No hex values, no Tailwind default palette colors.

```tsx
// BEFORE (marketplace default)
className="bg-black text-white border-gray-800"
// AFTER (DNA-styled)
className="bg-surface text-on-surface border-muted"

// BEFORE (inline styles with hex)
style={{ color: '#8b5cf6', background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
// AFTER (DNA tokens)
style={{
  color: 'hsl(var(--color-primary))',
  background: `linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-accent)))`
}}

// BEFORE (Tailwind default colors)
className="from-blue-500 to-purple-600 text-gray-100"
// AFTER (DNA Tailwind tokens)
className="from-primary to-accent text-on-surface"
```

**Check every occurrence:** Search the sourced component for `#`, `rgb(`, `hsl(` (with hardcoded values), and any Tailwind color class that is NOT a DNA token (e.g., `bg-blue-500`, `text-gray-300`).

#### Step 2: Structural Modifications

Adjust layout to match archetype personality and DNA spacing:

```tsx
// BEFORE (marketplace default - fixed sizing)
className="grid grid-cols-3 gap-4 p-8 rounded-lg"
// AFTER (DNA-responsive)
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-section)] p-[var(--spacing-element)] rounded-[var(--radius)]"
```

Archetype-specific structural adjustments:
- **Ethereal/Japanese Minimal:** Increase whitespace (2x default gap), reduce element count, add breathing room
- **Brutalist/Neubrutalism:** Remove border-radius, increase border weight, maximize contrast
- **Data-Dense:** Tighten spacing (0.75x default gap), increase information density, compact layout
- **Luxury/Fashion:** Increase whitespace (1.5x), add generous padding, slow down reveal timing
- **Kinetic/AI-Native:** Increase animation density, add more interactive trigger points
- **Swiss/International:** Enforce strict grid alignment, remove decorative elements, Helvetica-style precision

#### Step 3: Animation Restyling

Match DNA motion language. Replace generic animation values with archetype motion profile:

```tsx
// BEFORE (generic marketplace animation)
transition={{ duration: 0.5, ease: 'easeOut' }}
// AFTER (DNA motion tokens)
transition={{
  duration: parseFloat(getComputedStyle(document.documentElement)
    .getPropertyValue('--motion-duration-medium')),
  ease: [0.25, 0.46, 0.45, 0.94], // archetype-specific easing
}}

// BEFORE (generic stagger)
transition={{ delay: index * 0.1 }}
// AFTER (DNA stagger)
transition={{
  delay: index * parseFloat(getComputedStyle(document.documentElement)
    .getPropertyValue('--motion-stagger')),
}}
```

Key animation restyling targets:
- **Duration:** Replace hardcoded seconds with `--motion-duration-*` tokens
- **Easing:** Replace `easeOut`/`easeInOut` with archetype-specific cubic bezier curves
- **Stagger:** Replace hardcoded delays with `--motion-stagger` token
- **Spring config:** Adjust damping/stiffness to match archetype energy (Kinetic = bouncy, Luxury = heavy/smooth)
- **Scroll speed:** Adjust scroll-trigger start/end to match archetype pacing

#### Step 4: Archetype-Specific Customization

Final pass for archetype personality. This goes beyond tokens into the character of the component:

| Archetype | Customization Focus |
|-----------|-------------------|
| Brutalist | Remove all border-radius, strip smooth transitions, add raw edges, maximize contrast, consider monospace text |
| Luxury/Fashion | Slow everything 1.5-2x, add subtle hover reveals, increase whitespace, refine every detail |
| Japanese Minimal | Remove excess elements, increase negative space dramatically, simplify to essence, reduce to 2-3 colors |
| Ethereal | Add soft shadows, reduce opacity slightly, introduce gentle floating motion, soften all edges |
| AI-Native | Add monospace text elements, subtle scan lines or glitch, data visualization accents, blue-purple bias |
| Kinetic | Increase animation speed and intensity, add physics-based springs, introduce playful overshoots |
| Neon Noir | Add glow effects (box-shadow with color), dark backgrounds, neon color accents on interaction |
| Warm Artisan | Add texture overlays, warm color temperature shift, organic border irregularity, handcraft feel |
| Dark Academia | Add aged/paper textures, serif typography emphasis, muted warm tones, scholarly framing |
| Neubrutalism | Bold thick borders (2-4px), solid bright fills, visible shadow offsets, playful but structured |

### 21st.dev Installation Pattern

```bash
# Install from 21st.dev open registry
npx shadcn add "https://21st.dev/r/{component-slug}"

# This auto-resolves dependencies and adds to your configured components directory
# Components are shadcn-based and fully customizable after installation
```

After installation, apply the full 4-step restyling protocol. The component is now local code that you own and can modify freely.

For Aceternity UI and Magic UI, copy the component code directly from their documentation into your project. These are copy-paste components, not npm packages.

### Marketplace Usage Audit Checklist

Before committing ANY marketplace-sourced component, verify every item:

- [ ] All hardcoded colors replaced with DNA tokens (search for `#`, `rgb(`, default Tailwind colors)
- [ ] All `framer-motion` imports updated to `motion/react`
- [ ] Animation timing matches archetype motion profile (durations, easings, staggers)
- [ ] Layout and spacing adjusted for archetype personality (gap, padding, border-radius)
- [ ] Component is within the ~30% marketplace cap for this page
- [ ] Component genuinely adds value over a custom-built alternative
- [ ] Reduced-motion fallback implemented or verified (`prefers-reduced-motion` media query)
- [ ] Component does not conflict with the archetype's forbidden patterns
- [ ] Component serves the correct emotional arc beat (not just "looks cool")
- [ ] Responsive behavior verified across breakpoints (not just desktop)

If ANY item fails, fix it before proceeding. An unrestyled marketplace component is worse than no component -- it signals "template" to users and reviewers alike.

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `--color-primary` | Primary action colors in restyled components (buttons, links, accents) |
| `--color-secondary` | Secondary elements, supporting actions |
| `--color-accent` | Highlight moments, gradient endpoints, hover states |
| `--color-bg` / `--color-surface` | Background replacement for marketplace defaults (usually black/white) |
| `--color-text` / `--color-on-surface` | Text color replacement for hardcoded white/gray |
| `--color-border` / `--color-muted` | Border and divider color replacement |
| `--color-glow` | Glow effects in Neon Noir, AI-Native restyling |
| `--color-signature` | Signature element accent in custom components |
| `--motion-duration-*` | Animation duration replacement for hardcoded seconds |
| `--motion-easing-*` | Easing curve replacement for generic ease functions |
| `--motion-stagger` | Stagger delay replacement for hardcoded index-based delays |
| `--spacing-*` | Gap and padding replacement for hardcoded rem/px values |

### Related Skills

- **design-dna** -- Provides the token palette that every marketplace component must adopt. No component ships without DNA token integration.
- **design-archetypes** -- Determines which component categories are appropriate per archetype. Forbidden patterns from the archetype MUST be checked against marketplace component default styling.
- **cinematic-motion** -- Marketplace component animations are restyled to match the archetype's motion profile. Duration, easing, stagger, and spring config all come from the motion skill.
- **anti-slop-gate** -- The 35-point scoring catches unstyled marketplace components as "template feel" (T3: Visual template / stock feel). Proper restyling prevents score penalties.
- **creative-tension** -- Marketplace components are generally NOT tension moments. Tension requires deliberate rule-breaking and should be custom-built for maximum impact. If a marketplace component is used at a TENSION beat, it must be heavily modified beyond standard restyling.
- **emotional-arc** -- The category matrix maps to emotional arc beat types. Beat appropriateness determines whether a marketplace component category fits a specific section position.
- **performance-animation** -- Marketplace components may include heavy animation. Verify against the animation JS budget (<80KB gzipped initial) and will-change limits (max 10 active).

### Pipeline Stage

- **Input from:** Section PLAN.md specifying component requirements, archetype, beat type, and Design DNA tokens
- **Output to:** Restyled components integrated into section code, audit checklist verified before SUMMARY.md

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Unstyled Marketplace Drop-In

**What goes wrong:** Using an Aceternity component with its default dark styling in a Warm Artisan or Ethereal project. The component looks impressive in isolation but clashes violently with the archetype's personality. Creates "template assembled from parts" feel. The anti-slop gate will catch this as T3 (Visual template / stock feel, -2 points) and potentially C1 (No creative tension, -5 points).
**Instead:** Apply the full 4-step restyling protocol. Every color, animation timing, spacing value, and structural element must match the project's DNA tokens and archetype personality.

### Anti-Pattern: Marketplace-Heavy Pages

**What goes wrong:** Five of seven sections sourced from marketplaces. The page feels "assembled" rather than "designed." Even with restyling, the compositional rhythm, spacing logic, and interaction patterns inherit marketplace conventions rather than expressing a unique design identity. Exceeds the 30% hard cap.
**Instead:** Limit to 1-2 marketplace components per page for complex interactions that genuinely save time. Build the remaining sections from DNA to ensure unique compositional identity.

### Anti-Pattern: Specific Component Lock-In

**What goes wrong:** Documentation or plans reference specific component names and versions: "Use Aceternity Bento Grid v2.3" or "Install Magic UI Animated Beam." Component names change, versions break, components get removed. The recommendation becomes stale immediately.
**Instead:** Recommend component CATEGORIES (animated grid, card carousel, text reveal, hero slider) and point to the marketplace for browsing. Category-level guidance survives marketplace evolution.

### Anti-Pattern: Deprecated Framer Motion Imports

**What goes wrong:** Keeping `import { motion } from 'framer-motion'` in sourced components. The `framer-motion` package name is deprecated. While it may still resolve, it creates inconsistency with the rest of the codebase using `motion/react` and risks future breakage.
**Instead:** Update ALL imports to `motion/react` immediately upon sourcing, before any other restyling. This is the first step in the restyling protocol.

### Anti-Pattern: Framer Marketplace Direct Use

**What goes wrong:** Attempting to extract and use Framer marketplace components directly in Next.js or Astro projects. Framer components use Framer's proprietary component model, runtime, and animation system. They are not portable React components.
**Instead:** Use Framer marketplace as design reference only. Study the motion design, layout concepts, and interaction patterns. Then implement custom equivalents using Motion library (`motion/react`), GSAP, or CSS animations in your project's actual technology stack.

### Anti-Pattern: Skipping the Audit

**What goes wrong:** Not running the marketplace usage audit checklist before committing. Unstyled or partially-styled components leak through -- a hardcoded `bg-black` survives in a light-theme project, a `duration: 0.5` remains when the archetype specifies languid 1.2s motion, a `framer-motion` import persists.
**Instead:** Every marketplace-sourced component goes through the 10-point audit checklist. No exceptions. The checklist is fast (2 minutes) and catches the most common restyling oversights.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| marketplace-visual-cap | 0 | 30 | % of page visual elements | HARD -- reject pages exceeding 30% marketplace-sourced elements |
| restyling-steps-completed | 4 | 4 | steps (token/structural/animation/archetype) | HARD -- all 4 steps required for every marketplace component |
| audit-checklist-pass | 10 | 10 | items passed | HARD -- all 10 audit items must pass before commit |
| framer-motion-imports | 0 | 0 | count | HARD -- zero deprecated framer-motion imports allowed |
| hardcoded-colors | 0 | 0 | count (hex, rgb, default Tailwind) | HARD -- zero hardcoded colors in marketplace components |
| framer-marketplace-direct-use | 0 | 0 | components | HARD -- zero Framer marketplace components used directly |
| marketplace-per-page | 0 | 3 | components | SOFT -- warn if more than 3 marketplace components per page |
| custom-vs-marketplace-ratio | 70 | 100 | % custom-built | SOFT -- warn if custom-built ratio falls below 70% |
