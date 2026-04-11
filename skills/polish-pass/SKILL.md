---
name: polish-pass
category: core
description: "Defines the end-of-build polish protocol: universal micro-detail checklist, archetype-specific addenda with FORBIDDEN items, and creative license boundaries for the polisher agent."
triggers: ["polish", "micro-details", "hover states", "textures", "finishing touches", "micro-interactions", "polish pass", "deep polish"]
used_by: ["polisher", "quality-reviewer", "builder"]
version: "2.0.0"
---

## Layer 1: Decision Guidance

### Why a Dedicated Polish Pass

The difference between a 6.0 and 8.0+ Awwwards site is micro-details -- noise textures, gradient borders, custom selection colors, hover micro-interactions, cursor effects, text balance, animation pairing, stagger choreography. These details require **page-level cohesion** that per-section building cannot achieve.

Polish applied during individual section builds (by builders) covers basic requirements. But stagger timing across sections, shadow consistency across the full page, hover state variety, texture density rhythm, and signature element prominence all need a dedicated pass where the polisher sees the **complete page**.

### When It Runs

**Timing: Single pass at end of build, after ALL waves complete.**

The polisher receives:
1. **Full built page** -- all code files from all sections, all waves
2. **DESIGN-DNA.md** -- for token reference (color, font, spacing, motion values)
3. **This skill's checklist** -- universal + archetype-specific polish items

The polisher does NOT read: PLAN.md files, MASTER-PLAN.md, BRAINSTORM.md, STATE.md, CONTEXT.md, or any other planning artifacts. It works from the code and DNA directly.

### Creative License

**FULL creative freedom.** The polisher can:
- Restyle hover states beyond what builders implemented
- Add unexpected micro-interactions that enhance the experience
- Push visual refinement further than the checklist specifies
- Introduce subtle details not in any checklist item

**Only constrained by:**
1. DNA tokens -- all colors, fonts, spacing, motion values must use DNA tokens
2. Archetype FORBIDDEN patterns -- items in the archetype's FORBIDDEN list are absolute prohibitions
3. No layout changes -- polish enhances existing layouts, never restructures them
4. No content changes -- copy, images, and information hierarchy are locked

The checklist below is a **MINIMUM, not a maximum**. The polisher should EXCEED it with tasteful, cohesive finishing touches.

### Two-Tier Polish System

| Tier | Who | When | What |
|------|-----|------|------|
| **Light Polish** | Section-builders | During each section build | Basic hover/focus states, `prefers-reduced-motion`, responsive basics, smooth scrolling |
| **Deep Polish** | Polisher agent | End-of-build (after all waves) | Page-level cohesion, texture density, stagger choreography, animation pairing, signature element prominence, archetype-specific enhancements |

Builders handle light polish as part of their standard output. The polisher handles deep polish as a dedicated finishing pass. There is intentional overlap -- the polisher may refine or enhance what builders started.

### Output Format

The polisher produces updated code files plus a SUMMARY.md containing the Polish Report:

```markdown
## Polish Report

### Items Added
| Category | Item | Section(s) | Implementation |
|----------|------|-----------|----------------|
| Hover | Button hover: scale + shadow shift | All | scale-[1.02] + shadow increase on hover |
| Texture | Noise grain on dark sections | 01, 03, 06 | SVG filter noise at 3% opacity |
| Typography | Gradient text on hero headline | 01 | bg-gradient-to-r from-text to-text/40 bg-clip-text |
| Animation | Stagger timing normalized | All | 80ms between grouped elements, consistent across page |

### Items Skipped (with reason)
| Item | Reason |
|------|--------|
| Custom cursor | Japanese Minimal archetype -- FORBIDDEN |
| Glass blur on nav | Brutalist archetype -- FORBIDDEN |

### Creative Additions (beyond checklist)
| Addition | Section | Rationale |
|----------|---------|-----------|
| Spotlight card hover | 03-features | Archetype signature element enhancement |
| Scroll-linked gradient shift | Full page | Creates color journey across the emotional arc |
```

---

## Layer 2: Award-Winning Examples

### Universal Polish Checklist

Every item is tagged by priority. The quality-reviewer uses these tags for enforcement:
- **MUST HAVE** -- Missing = WARNING in quality review
- **SHOULD HAVE** -- Missing noted but not penalized
- **NICE TO HAVE** -- Bonus polish, not tracked

---

#### Category 1: Hover & Interactive States (MUST HAVE)

Every interactive element must have a **distinct, multi-property** hover state. A color change alone is not polish -- it is the bare minimum.

| Item | Priority | Specification |
|------|----------|---------------|
| Every clickable element has a hover state | MUST HAVE | Not just color -- include scale, shadow, glow, or border reveal |
| Hover transitions use correct easing | MUST HAVE | 200-300ms, `ease-out` or custom `cubic-bezier`, NEVER `linear` |
| Active/pressed state feedback | MUST HAVE | < 100ms response, visible depression or scale-down |
| Focus states for keyboard navigation | MUST HAVE | Consistent focus ring matching accent palette, visible on all backgrounds |
| Disabled states | MUST HAVE | `opacity-50` + `cursor-not-allowed` + `pointer-events-none` |
| Button hover sophistication | MUST HAVE | Min 2 properties change (e.g., `scale-[1.02]` + shadow increase, or `bg` + `translateY(-2px)`) |
| Card hover effect | MUST HAVE | Lift (`translateY(-4px)` + shadow increase) or spotlight glow or border reveal |
| Link hover animation | SHOULD HAVE | Underline scaleX from 0, color shift, or arrow/icon motion |
| Icon hover micro-motion | SHOULD HAVE | Subtle rotation (5-15deg), scale (1.05-1.1), or color transition |

---

#### Category 2: Micro-Textures (ARCHETYPE-DEPENDENT)

Textures add depth and tactile quality. They are archetype-dependent -- some archetypes demand them, others forbid them.

| Item | Priority | Specification |
|------|----------|---------------|
| Noise/grain on dark surfaces | SHOULD HAVE | SVG filter noise at 2-5% opacity on `bg` or `surface` backgrounds |
| Gradient borders on key cards | SHOULD HAVE | 1px gradient from `white/10` to `white/03` (dark themes) or `border/50` to `border/10` (light themes) |
| Background patterns | NICE TO HAVE | Grid lines, dot patterns, or grain overlays per archetype spec |

**Check archetype addenda below before applying.** Many archetypes FORBID specific textures.

---

#### Category 3: Selection & Cursor (SHOULD HAVE)

Small details that signal intentional craft.

| Item | Priority | Specification |
|------|----------|---------------|
| Custom `::selection` color | SHOULD HAVE | `background: accent/20`, `color: text` -- matches project palette |
| Custom cursor on special elements | NICE TO HAVE | Archetype-dependent. Kinetic, Neon Noir, Glassmorphism: yes. Japanese Minimal, Swiss: no |

---

#### Category 4: Micro-Interactions (MUST HAVE)

Motion details that bring the page to life.

| Item | Priority | Specification |
|------|----------|---------------|
| Scroll-triggered entrance animations | MUST HAVE | Every section has entrance animation, **varied** per section (not all fade-up) |
| Stagger timing on groups | MUST HAVE | 60-150ms between items in card grids, feature lists, nav items |
| Parallax or depth on at least one element | SHOULD HAVE | Foreground/background different scroll speeds, or layered parallax |
| Loading state animations | NICE TO HAVE | Skeleton shimmer, pulse, or fade for dynamic content |

---

#### Category 5: Typography Polish (MUST HAVE)

Typography craft is the single biggest polish signal on award-winning sites.

| Item | Priority | Specification |
|------|----------|---------------|
| Gradient text on a headline | SHOULD HAVE | Where archetype permits. `bg-gradient-to-r bg-clip-text text-transparent` |
| `text-wrap: balance` on headings | MUST HAVE | Prevents widows/orphans on all important headings |
| Truncation with ellipsis | MUST HAVE | Where content may overflow (card titles, nav items, meta text) |
| Smooth font loading | MUST HAVE | `font-display: swap` + `<link rel="preload">` for display fonts, no visible FOUT |
| Letter-spacing on display type | MUST HAVE | Negative tracking on large sizes: `-0.02em` to `-0.04em` on `text-4xl`+ |
| Proper line-height rhythm | SHOULD HAVE | Body text 1.6-1.7, headings 1.1-1.2, labels 1.3-1.4 |

---

#### Category 6: Depth & Shadow (ARCHETYPE-DEPENDENT)

Shadow quality separates template sites from award-winners.

| Item | Priority | Specification |
|------|----------|---------------|
| Multi-layer shadows | SHOULD HAVE | 2-3 shadow layers with different offsets, spreads, and colors (not just `shadow-lg`) |
| Colored shadows | SHOULD HAVE | Shadow color matches element or accent token (e.g., `shadow-[0_8px_32px_-8px_theme(colors.accent/25)]`) |
| Glass/blur on overlays | NICE TO HAVE | `backdrop-blur-xl` on navigation, modals, tooltips where archetype permits |

**Brutalist, Editorial, Japanese Minimal, Swiss: skip colored/soft shadows entirely.** These archetypes have specific shadow rules.

---

#### Category 7: Animation Polish (MUST HAVE)

Animation quality and accessibility are non-negotiable.

| Item | Priority | Specification |
|------|----------|---------------|
| Respect `prefers-reduced-motion` | MUST HAVE | CRITICAL accessibility requirement. All animations wrapped in `motion-safe:` or `@media (prefers-reduced-motion: no-preference)` |
| Enter/exit animation pairing | MUST HAVE | Components that animate in must animate out. No sudden appearance/disappearance |
| Scroll trigger ranges | MUST HAVE | Entrance starts when element is 100-150px below viewport, not at 0px or 300px |
| No animation before fonts load | SHOULD HAVE | Delay entrance animations until display fonts are rendered. Use `document.fonts.ready` |
| Consistent easing across page | MUST HAVE | Same easing curve family for all entrance animations. DNA motion tokens define the curve |

---

#### Category 8: Responsive Polish (MUST HAVE)

Responsive quality is a baseline requirement, not a bonus.

| Item | Priority | Specification |
|------|----------|---------------|
| No horizontal overflow | MUST HAVE | Test 375px to 1440px. Zero horizontal scroll on any viewport |
| Touch targets 44x44px minimum | MUST HAVE | All buttons, links, interactive elements on mobile |
| Responsive font sizes | MUST HAVE | `clamp()` for body, breakpoint steps for display. DNA type scale defines the system |
| Proportional spacing | MUST HAVE | Mobile padding smaller than desktop. Not identical values across breakpoints |
| Hover graceful degradation | MUST HAVE | No hover-dependent information on touch devices. Use `@media (hover: hover)` |

---

### Micro-Interaction Choreography

Award-winning sites choreograph SEQUENCES of micro-interactions, not individual effects. Each interaction is a multi-step performance with coordinated timing.

**Button Click Sequence (4 steps, 400ms total):**
1. `0ms` -- Scale to 0.97 (pressed feedback)
2. `100ms` -- Ripple/glow emanates from click point
3. `200ms` -- Scale returns to 1.0 with spring overshoot
4. `300-400ms` -- Any state change (icon swap, text change) fades in

**Form Field Focus Sequence (3 steps, 350ms total):**
1. `0ms` -- Border color transitions to `--color-primary`
2. `50ms` -- Label floats up or changes color
3. `150ms` -- Focus ring expands from center outward

**Card Hover Sequence (3 steps, 500ms total):**
1. `0ms` -- Shadow depth increases (lift effect)
2. `100ms` -- Image scales to 1.03 within overflow-hidden
3. `200ms` -- CTA text or arrow appears with slide-in

**Notification Appear Sequence (4 steps, 600ms total):**
1. `0ms` -- Slide in from edge with spring physics
2. `200ms` -- Content fades in within container
3. `400ms` -- Progress bar begins auto-dismiss countdown
4. `duration end` -- Reverse: progress bar completes, content fades, container slides out

**Timing coordination rules:**
- Child animations start AFTER parent container animation settles
- Related elements stagger by DNA `--motion-stagger` value (typically 80-120ms)
- Exit animations are 20-30% faster than entrance (feels responsive, not sluggish)
- All sequences use the archetype's easing profile from DNA motion tokens

---

### Archetype-Specific Polish Addenda

Each archetype adds specific polish items and FORBIDDEN items on top of the universal checklist. The polisher checks the project's archetype in DESIGN-DNA.md and applies the corresponding addenda.

---

#### 1. Brutalist

> Raw, exposed, unapologetically bold.

**MUST HAVE:**
- Hard drop-shadows on key elements (`shadow-[4px_4px_0_#0a0a0a]` -- zero blur, zero spread)
- Instant hover transitions (< 100ms, `transition: none` or `duration-75`)
- At least one rotated element (-2deg to 3deg rotation on a card, image, or heading)
- Exposed structural elements visible (borders as design, visible grid lines, raw dividers)
- Monospace text in at least one non-code context (navigation, labels, or subheadings)

**SHOULD HAVE:**
- Asymmetric positioning (elements intentionally off-grid or overlapping)
- High-contrast color blocks (pure red or blue on near-black or off-white)
- Thick border treatment on hover (border becomes bolder, not disappears)

**FORBIDDEN:**
- Gradient borders or gradient backgrounds
- `backdrop-blur` / glass morphism effects
- Noise/grain textures
- `border-radius` > 4px (`rounded-none` or `rounded-sm` only)
- Soft/diffused shadows (`shadow-md`, `shadow-lg`, `shadow-xl`)
- Smooth transitions > 150ms

---

#### 2. Ethereal

> Soft, dreamlike, floating. Everything feels weightless.

**MUST HAVE:**
- Floating gradient orbs in background (2-3 per page, `blur-[120px]+`, 8-12s drift cycle)
- Generous padding on all containers (`py-32`+ between sections)
- Soft layered shadows with large spread (`shadow-[0_20px_60px_-20px_...]`)
- Serif accent text in at least one pull quote, label, or decorative position
- Slow, graceful transitions on all interactions (400ms+ minimum, no bouncy easing)

**SHOULD HAVE:**
- Color temperature consistently warm throughout (warm whites, creams, lavenders)
- Diffused border treatment (1px max, low opacity, no hard lines)
- Font weight kept light (300-400 for body, 500-600 max for headings)

**FORBIDDEN:**
- Dark backgrounds (anything below `#e0e0e0`)
- Sharp corners (minimum `rounded-xl` everywhere)
- Neon or vibrant saturated accent colors
- Heavy font weights (700+)
- Hard shadows (any shadow with < 10px blur)
- Fast animations (anything under 400ms)

---

#### 3. Kinetic

> Everything moves with purpose. The page is alive.

**MUST HAVE:**
- Scroll-triggered animation on EVERY section (no static sections)
- Parallax depth effect on at least one layer per page
- At least one horizontal scroll element
- Aggressive stagger timing (60-100ms between elements, tighter than universal 60-150ms)
- Custom easing on all motion (`cubic-bezier`, never default `ease` or `linear`)

**SHOULD HAVE:**
- Scroll velocity feedback (elements respond to scroll speed, not just position)
- Continuous scroll progress indicator (progress bar, morphing shape, or color shift)
- Entrance directions varied across sections (not all from bottom)

**FORBIDDEN:**
- Static sections with no scroll integration
- Slow transitions > 500ms (Kinetic is fast and responsive)
- Subtle/barely-visible animations (motion should be noticeable and purposeful)
- Default `transition-all duration-300` without choreography
- `ease-linear` easing anywhere
- Uniform entrance direction (all elements from same side)

---

#### 4. Editorial

> Typography IS the design. Words take center stage.

**MUST HAVE:**
- Precise whitespace rhythm (consistent spacing scale, mathematical progression between sections)
- High-contrast headline treatment (display serif at maximum weight contrast vs. body)
- Pull quotes with serif type at `text-3xl`+ in at least one section
- Rule lines (1px horizontal dividers) between major content sections
- `max-w-[65ch]` on all body text paragraphs

**SHOULD HAVE:**
- Drop caps on opening paragraphs (3-4 lines, display serif)
- Mixed serif + sans-serif in same headline for emphasis
- Column layout in at least one content section (CSS columns or 2-col grid)

**FORBIDDEN:**
- `backdrop-blur` / glass morphism effects
- Neon glow or glow effects of any kind
- 3D transforms on content elements
- Noise/grain textures
- Playful or bouncy animations
- Centered body text (flush-left for readability, except rare decorative exceptions)

---

#### 5. Neo-Corporate

> Premium dark-mode dashboard aesthetic. Linear meets Huly.

**MUST HAVE:**
- Glass morphism cards (`bg-surface/50 backdrop-blur-xl border border-white/[0.06]`)
- Bento grid with varied cell sizes using `gap-px` borders (Linear-style)
- Monospace text for numbers, dates, and status labels
- Colored glow shadows on primary accent elements
- Subtle grid or dot background pattern at low opacity

**SHOULD HAVE:**
- Product screenshots with 3D perspective tilt on hover
- Gradient text on hero headline (from `text` to `text/40`)
- Badge/pill components for status indicators with colored backgrounds

**FORBIDDEN:**
- Bright/warm backgrounds (above `#1a1a1e`)
- Serif fonts anywhere
- `border-radius` > `rounded-2xl` on cards
- Playful illustrations or bouncy animations
- More than 2 accent colors prominent simultaneously
- System fonts (no fallback to Arial/Helvetica)

---

#### 6. Luxury/Fashion

> Haute couture digital. Dramatic imagery, restrained typography, maximum negative space.

**MUST HAVE:**
- Letter-spacing on uppercase labels (`tracking-[0.15em]` to `tracking-[0.25em]`)
- Maximum negative space (`py-40`+ between sections, no content density)
- Art-directed imagery with full-bleed treatment (edge-to-edge, no container constraints)
- Minimal color palette (gold + black + ivory, maximum 2 accent colors)
- Image hover zoom (subtle `scale-[1.02]` to `scale-[1.05]` over 600ms)

**SHOULD HAVE:**
- Alternating light/dark section backgrounds for dramatic rhythm
- Font-weight 200-300 on body text (ultra-thin, elegant)
- Oversized hero typography (`text-8xl`+ on desktop)

**FORBIDDEN:**
- Bright/saturated accent colors (only muted gold tones)
- Rounded buttons or rounded card corners (rectangular or barely rounded)
- Emoji or playful icons anywhere
- Dense content layouts (everything needs breathing room)
- Bouncy animations or spring easing
- More than 2 colors used as accents

---

#### 7. Neon Noir

> Cyberpunk city at night. Electric neon on deep black.

**MUST HAVE:**
- Triple-layer neon glow on interactive elements (near 2px + mid 8px + far 20px `text-shadow` or `box-shadow`)
- Dark-only palette (no element with background above `#1a1a2a`)
- Animated gradient border on at least one key element (`conic-gradient` spinning)
- CRT/scanline texture overlay at 3-8% opacity
- Minimum 10:1 contrast ratio on neon-on-black text

**SHOULD HAVE:**
- At least one neon sign element with flicker effect (irregular opacity animation)
- Color-shifting gradients on backgrounds (pink to cyan to purple)
- Glow trail on cursor for interactive sections

**FORBIDDEN:**
- Light backgrounds (anything above `#1a1a2a`)
- Pastel or muted colors (everything is saturated neon)
- Serif fonts
- Soft/organic shapes (`rounded-full` on containers)
- Subtle animations (everything should pop visually)
- White as an accent color (neon colors only for accents)

---

#### 8. Glassmorphism

> Layered translucent surfaces with depth. Glass panels floating in space.

**MUST HAVE:**
- `backdrop-blur-xl` (or `backdrop-blur-[12px]` to `backdrop-blur-[20px]`) on ALL card surfaces
- Translucent backgrounds (`bg-white/5` to `bg-white/10`, never solid opaque)
- 3+ visible depth layers simultaneously (background orbs behind glass behind content)
- Gradient border technique (wrapper div or pseudo-element with gradient)
- 2-3 background gradient orbs behind glass panels (`blur-[120px]+`)

**SHOULD HAVE:**
- Subtle noise texture ON the glass surface (adds realism to glass effect)
- Floating shadows with large spread (`shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]`)
- Color-shifting background that moves subtly on scroll or mouse

**FORBIDDEN:**
- Solid opaque card backgrounds (all cards must be translucent)
- Flat design without visible depth layers
- Light/white page backgrounds (needs dark bg for glass to read)
- Heavy borders (only subtle glass edges, 1px max with gradient)
- More than 3 background orbs (becomes muddy and unreadable)
- Sharp corners on glass elements (minimum `rounded-xl`)

---

#### 9. Japanese Minimal (compact)

**MUST HAVE:**
- Extreme whitespace (`py-40`+ between sections, sometimes `py-64`)
- Maximum 1-2 focal elements per viewport
- Single accent color used 1-2 times per page maximum

**FORBIDDEN:**
- Custom cursor effects
- Glow effects, colored shadows, or glass morphism
- Noise/grain textures or busy backgrounds

---

#### 10. Swiss/International (compact)

**MUST HAVE:**
- Strict grid alignment visible in layout structure
- Single accent color (red) used extremely sparingly
- Flush-left alignment on all text (no centered text)

**FORBIDDEN:**
- Rounded corners on any element
- Decorative elements not serving information hierarchy
- Custom cursor effects

---

#### 11. Playful/Startup (compact)

**MUST HAVE:**
- Bouncy hover animations (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- Multiple accent colors visible per section (3-4 saturated colors)
- Tilted/rotated elements (-3deg to 3deg on cards or images)

**FORBIDDEN:**
- Monospace fonts
- Dark backgrounds
- Muted or desaturated color treatments

---

#### 12. Retro-Future (compact)

**MUST HAVE:**
- CRT scan-line overlay (`repeating-linear-gradient` 2px transparent / 1px rgba lines)
- Text glow via `text-shadow` (green or amber)
- ALL text in monospace -- no exceptions

**FORBIDDEN:**
- Sans-serif or serif fonts (monospace only)
- `border-radius` > 2px
- Photography (use ASCII art or pixelated images)

---

#### 13. Warm Artisan (compact)

**MUST HAVE:**
- Paper/grain noise texture overlay at 3-5% opacity
- Warm color temperature throughout (no cool blues or grays)
- Stamp/badge-style labels on at least one element

**FORBIDDEN:**
- Cool-toned colors (blue, cyan, purple)
- Glass morphism or glossy effects
- Pure white or pure black backgrounds

---

#### 14. Organic (compact)

**MUST HAVE:**
- SVG blob shapes as section backgrounds or image masks
- Organic border-radius on at least one image (`border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%`)
- Wavy or curved section dividers (SVG paths, not straight lines)

**FORBIDDEN:**
- Sharp 90-degree corners on visual elements
- Neon or electric colors
- Monospace fonts

---

#### 15. Data-Dense (compact)

**MUST HAVE:**
- Compact spacing (`py-2`, `px-3` -- no generous whitespace)
- Tabular numbers everywhere (`font-variant-numeric: tabular-nums`)
- Status indicators with colored dots (green, red, amber)

**FORBIDDEN:**
- Large whitespace (`py-16`+ between content blocks)
- Decorative elements (blobs, illustrations, gradient orbs)
- Font sizes above `text-2xl` anywhere

---

#### 16. Vaporwave (compact)

**MUST HAVE:**
- Horizontal gradient backgrounds (pink to cyan to purple)
- Grid perspective floor (CSS perspective vanishing to horizon)
- Glitch effects on text or images (CSS transform with color offset)

**FORBIDDEN:**
- Corporate/professional aesthetic
- Muted/earthy colors
- Monochrome palettes

---

#### 17. Neubrutalism (compact)

**MUST HAVE:**
- Thick black borders (2-3px solid `#1a1a1a`) on all cards
- Hard drop shadows with zero blur (`shadow-[4px_4px_0_#1a1a1a]`)
- Hover: shadow shifts to `shadow-[8px_8px_0_#1a1a1a]` + `translate(-4px,-4px)`

**FORBIDDEN:**
- `backdrop-blur` / glass morphism
- Soft layered shadows
- Dark mode (light-mode only aesthetic)

---

#### 18. AI-Native (compact)

**MUST HAVE:**
- Grid or scan-line background patterns at low opacity
- Monospace type for headings and labels
- Data visualization elements as decoration (node graphs, waveforms, scatter plots)

**FORBIDDEN:**
- Warm colors as primary (reserve orange/red for tension only)
- Serif fonts anywhere
- Hand-drawn or organic visual elements

---

#### 19. Dark Academia (compact)

**MUST HAVE:**
- Paper/parchment noise texture overlay at 3-5% opacity with `blend-mode: soft-light`
- Drop caps on opening paragraphs (3-4 lines, display serif)
- Warm color temperature throughout (no cool-toned backgrounds)

**FORBIDDEN:**
- Sans-serif as primary/display font
- Cool-toned backgrounds (blue-dark, pure `#000000`)
- Glass morphism or glossy effects

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Polish Pass |
|-----------|---------------------|
| Color tokens (all 12) | All polish additions use DNA color tokens. No hex values -- always reference `--color-primary`, `--color-accent`, etc. |
| `--font-display` | Display font for gradient text, drop caps, oversized headings |
| `--font-body` | Body font for text-wrap, line-height, letter-spacing adjustments |
| `--type-scale-*` | Type scale for responsive `clamp()` polish |
| `--spacing-*` | Spacing scale for responsive padding adjustments |
| `--motion-duration-*` | Duration tokens for hover transitions, entrance animations |
| `--motion-easing-*` | Easing tokens for animation curves, hover transitions |
| Signature element | Named pattern from DNA -- polisher verifies prominence and correct implementation |

### Pipeline Integration

**Polisher agent** loads this skill at startup via the `skills` frontmatter field. It is the polisher's primary knowledge reference for the end-of-build polish pass.

**Section-builders** reference the light polish subset during build:
- Category 1: Basic hover/focus states (MUST HAVE items only)
- Category 7: `prefers-reduced-motion` wrapping (MUST HAVE)
- Category 8: Responsive basics (MUST HAVE items only)

Builders do NOT apply deep polish (textures, stagger choreography, page-level cohesion). That is the polisher's domain.

**Quality-reviewer** uses this skill for enforcement:
- **MUST HAVE universal items missing** = WARNING finding
- **Archetype MUST HAVE items missing** = WARNING finding
- **Archetype FORBIDDEN items present** = CRITICAL finding (archetype violation, triggers -5 penalty)
- **Creative additions noted** = INFO (logged, not enforced)

### Polisher Input Contract

At end-of-build, the polisher receives exactly:
1. All code files (complete built page from all waves)
2. DESIGN-DNA.md (token reference)
3. This skill (universal checklist + archetype addenda)

The polisher does NOT read: PLAN.md files, MASTER-PLAN.md, BRAINSTORM.md, STATE.md, CONTEXT.md, PAGE-CONSISTENCY.md, or any other planning artifacts.

### Quality Review Enforcement

The quality-reviewer checks polish at two points:

**Post-wave (Layer 2):** Light polish verification
- Hover states present on interactive elements
- `prefers-reduced-motion` respected
- No horizontal overflow at tested viewports
- Basic responsive scaling working

**End-of-build (Layer 3):** Full polish verification
- All 8 universal categories checked against MUST HAVE items
- Archetype-specific MUST HAVE items present
- Archetype FORBIDDEN items absent
- Signature element prominently implemented
- Page-level cohesion (consistent shadow system, stagger rhythm, texture density)

### Related Skills

- **design-dna** -- DNA provides the token values the polisher uses for every polish addition. Polish never invents colors/fonts/spacing -- always references DNA.
- **design-archetypes** -- Archetypes define the FORBIDDEN patterns and personality constraints. This skill's addenda are derived from archetype definitions.
- **anti-slop-gate** -- The gate checks for generic implementations. Polish pass directly addresses anti-slop by adding the micro-details that distinguish award-winning from generic.
- **emotional-arc** -- Arc defines beat assignments per section. Polish intensity varies by beat: PEAK sections get maximum polish attention, BREATHE sections get minimal.

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Checklist as Checkbox Exercise

**What goes wrong:** The polisher mechanically adds every checklist item to every section regardless of archetype fit or visual coherence. Noise textures appear on Ethereal pages. Gradient borders appear on Brutalist cards. Every section gets identical hover states. The result looks automated, not curated.
**Instead:** The checklist defines CATEGORIES of polish to consider. The polisher uses creative judgment to determine WHICH items and HOW they are implemented per section. Always check the archetype addenda's FORBIDDEN list before applying any item. Variety matters -- different sections should have different hover treatments, different entrance animations, different shadow treatments.

### Anti-Pattern: Polisher Limited to Checklist Only

**What goes wrong:** The polisher treats the checklist as the complete scope and adds nothing beyond it. The result passes review but lacks the "wow" micro-details that push a site from 7.5 to 8.5 on Awwwards. No unexpected delights, no personality-specific refinements.
**Instead:** The checklist is a MINIMUM. The polisher's creative license means they should EXCEED it. Examples: a cursor-following spotlight on feature cards, a scroll-linked color temperature shift across the page, a magnetic button effect on the primary CTA. These are not in any checklist -- they come from the polisher's creative judgment.

### Anti-Pattern: Polish During Build

**What goes wrong:** Builders attempt deep polish during section build. They add noise textures, tune stagger timing, implement page-level shadow systems. But they only see one section -- so the stagger timing clashes with adjacent sections, texture density is inconsistent across the page, and shadow systems don't match.
**Instead:** Builders handle light polish only (basic hover states, responsive, reduced-motion). Deep polish requires page-level context. The polisher sees the full page and creates cohesive polish across all sections.

### Anti-Pattern: Same Polish on Every Archetype

**What goes wrong:** Brutalist pages get gradient borders. Ethereal pages get neon glow. Japanese Minimal pages get noise textures and custom cursors. The universal checklist items are applied without checking archetype constraints, resulting in cross-archetype contamination that violates the design personality.
**Instead:** ALWAYS check the archetype addenda before applying any universal item. If a universal item conflicts with an archetype FORBIDDEN entry, the FORBIDDEN entry wins. The polisher's first action should be: read DESIGN-DNA.md, identify the archetype, read the corresponding addenda, note FORBIDDEN items, then work through the universal checklist filtering by archetype appropriateness.

### Anti-Pattern: Over-Polishing

**What goes wrong:** The polisher adds so many micro-interactions, textures, glow effects, and hover states that the page feels busy, slow, and overwhelming. Every element has 3 different hover effects. Every surface has noise. Every scroll triggers 4 animations. Performance degrades. The user cannot focus.
**Instead:** Polish enhances, it does not overwhelm. Maximum 1-2 micro-interactions per element. Textures at 2-5% opacity (invisible until you look for them). Stagger timing creates flow, not delay. If a polish addition makes the page feel slower or busier, remove it. The polish should be invisible to casual users and delightful to design-aware users.

### Anti-Pattern: Ignoring prefers-reduced-motion

**What goes wrong:** The polisher adds entrance animations, hover transforms, scroll-triggered effects, and parallax without wrapping them in `motion-safe:` utilities or `@media (prefers-reduced-motion: no-preference)`. Users with motion sensitivity experience discomfort. This is not a polish concern -- it is a critical accessibility violation.
**Instead:** EVERY animation the polisher adds must respect `prefers-reduced-motion`. In Tailwind: use `motion-safe:animate-*` and `motion-reduce:animate-none`. In CSS: wrap in `@media (prefers-reduced-motion: no-preference)`. This is a MUST HAVE in Category 7 and is non-negotiable.

### Anti-Pattern: Polish That Breaks Layout

**What goes wrong:** Adding hover transforms that cause reflow (elements push siblings when they scale). Glass blur on too many elements causing GPU thrashing and dropped frames. Parallax on images causing layout shifts. The polish degrades performance and breaks visual stability.
**Instead:** Hover transforms should use `transform` and `opacity` only (GPU-composited, no reflow). Limit `backdrop-blur` to 2-3 elements maximum per viewport. Test polish additions do not cause CLS (Cumulative Layout Shift). If a polish addition drops FPS below 30 on a mid-range device, remove it.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Hover transition duration | 150 | 400 | ms | SOFT -- warn if outside range |
| Active state response time | 0 | 100 | ms | HARD -- must be immediate |
| Noise texture opacity | 0.02 | 0.05 | ratio | SOFT -- warn if outside range |
| Gradient border width | 1 | 1 | px | SOFT -- thicker breaks subtlety |
| Stagger delay between items | 60 | 150 | ms | SOFT -- outside range feels wrong |
| Touch target size | 44 | -- | px | HARD -- accessibility requirement |
| Focus ring visibility | 2 | -- | px | HARD -- must be visible |
| Display font letter-spacing | -0.04 | -0.01 | em | SOFT -- tracking guidance |
| Maximum backdrop-blur elements per viewport | -- | 3 | count | SOFT -- performance concern |
| Scroll trigger offset below viewport | 80 | 200 | px | SOFT -- too early or too late |
