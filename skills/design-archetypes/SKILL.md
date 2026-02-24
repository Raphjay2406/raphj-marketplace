---
name: design-archetypes
description: "19 opinionated design personality systems with machine-enforceable constraints. Each archetype locks colors, fonts, techniques, and forbidden patterns."
tier: core
triggers: "archetype, design personality, design direction, creative direction, aesthetic, visual identity, style selection"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are a creative director who uses personality archetypes to guarantee distinctive visual identity. Each archetype is a CONSTRAINT SYSTEM -- it defines what you MUST use and what you CANNOT use. Archetypes are not mood boards. They are machine-enforceable rules with locked palettes, required fonts, mandatory techniques, forbidden patterns, a signature element, and three tension zones.

### How Archetypes Work

1. During brainstorm (via `/modulo:start-project`), present 2-3 relevant archetypes based on project type/industry
2. User selects one or requests custom
3. Archetype constraints populate the Design DNA document
4. ALL section builders must follow archetype rules throughout the build
5. Tension override allows ONE intentional rule break per page (see Tension Override Mechanism below)

### Archetype Selection Guide

| Industry / Project Type | Primary Recommendation | Secondary Options |
|-------------------------|----------------------|-------------------|
| SaaS / Developer Tools | Neo-Corporate | Data-Dense, AI-Native |
| E-commerce (Fashion/Luxury) | Luxury/Fashion | Swiss/International |
| E-commerce (General/DTC) | Playful/Startup | Organic, Neubrutalism |
| Blog / Publication | Editorial | Dark Academia, Japanese Minimal |
| Creative Portfolio | Kinetic | Brutalist, Neubrutalism |
| Agency / Studio | Brutalist | Swiss/International, Kinetic |
| Food / Beverage / Restaurant | Warm Artisan | Organic |
| Health / Wellness | Ethereal | Japanese Minimal, Organic |
| Gaming / Music / Nightlife | Neon Noir | Vaporwave, Retro-Future |
| Fintech / Analytics Dashboard | Data-Dense | Neo-Corporate, Glassmorphism |
| Architecture / Design Studio | Swiss/International | Japanese Minimal |
| Education / Academic | Dark Academia | Editorial, Neo-Corporate |

### When to Recommend Custom

Recommend the Custom Archetype Builder when:
- User describes a feeling that does not map to any of the 19 archetypes
- User wants to hybridize 2+ archetypes (e.g., "Brutalist energy with Ethereal colors")
- User provides reference sites that span multiple aesthetic directions
- Project has an established brand system that conflicts with all built-in archetypes

### Tension Override Mechanism

Builders may intentionally break ONE mandatory rule per page IF all four conditions are met:

1. **Intentional tension** -- The break creates deliberate creative tension, not laziness or oversight
2. **Documented rationale** -- The builder writes the rationale in their SUMMARY.md (e.g., "Material Collision: added one glass element to create tension against the raw brutalist surface")
3. **Specific rule named** -- The exact rule being broken is identified (not "general override" or "creative freedom")
4. **Aligned with tension technique** -- The override aligns with one of the archetype's 3 defined tension zones

**Quality reviewer checks:**
- Is the override intentional? (rationale makes sense)
- Does it IMPROVE the design? (tension creates interest, not confusion)
- Is only ONE rule broken? (multiple overrides = not overrides, just ignoring the archetype)

If the override is lazy (no rationale, does not improve the design, or breaks multiple rules), treat it as a violation and apply the -5 penalty.

### Custom Archetype Builder

Two modes for creating project-specific archetypes:

**Mode 1: Structured Wizard**

For users who know what they want. Gather:
1. 4 personality adjectives (e.g., "bold, warm, rebellious, approachable")
2. Color preferences or existing brand colors
3. Font preferences or style direction (serif, sans, mono, mixed)
4. 2-3 reference sites they admire
5. 1-2 things they absolutely do NOT want (forbidden direction)

Generate a complete archetype constraint block matching the standard format: locked palette (all 12 tokens), required fonts (specific Google Fonts), mandatory techniques (4+), forbidden patterns (4+), signature element (named pattern), and 3 tension zones.

**Mode 2: Reference Derivation**

For users who say "I want it to feel like [site URL]." Process:
1. Analyze the reference site's visual language (colors, typography, spacing, motion, signature elements)
2. Identify the closest built-in archetype as a starting point
3. Document where the reference diverges from that archetype
4. Generate a custom archetype that captures the reference's personality

Custom archetype output format matches the standard archetype block structure (same sections, same table format). Custom archetypes are stored in the project's DESIGN-DNA.md, not in this skill file.

## Layer 2: Award-Winning Examples

<!-- LAYER 2: ARCHETYPE DEFINITIONS START -->

### 1. Brutalist

> Raw, exposed, unapologetically bold. Form follows function with no decorative veneer.

**Personality:** Honest, confrontational, anti-establishment, raw
**Best for:** Art studios, experimental brands, tech manifestos, creative agencies

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#f5f5f0` | Warm off-white |
| surface | `#e8e4df` | Slightly darker warm |
| text | `#0a0a0a` | Near-black |
| border | `#0a0a0a` | Thick, visible, solid 2-3px |
| primary | `#ff0000` | Pure red -- no subtlety |
| secondary | `#0000ff` | Pure blue |
| accent | `#0a0a0a` | Black as accent |
| muted | `#6b6b60` | Warm gray |
| glow | `none` | No glow effects |
| tension | `#ff0000` | Red for tension moments |
| highlight | `#ffff00` | Raw yellow highlight |
| signature | `#ff0000` | Primary red |

#### Required Fonts
- Display: **Space Grotesk** or **IBM Plex Mono** (monospace headings)
- Body: **IBM Plex Sans** or **Space Mono** (clean or monospace)
- Mono: **IBM Plex Mono** (labels, metadata)

#### Mandatory Techniques
- Thick solid borders (2-3px `#0a0a0a`, no opacity)
- Monospace text in headings or labels
- Exposed grid structure visible on the page
- At least one element with `rotate(-2deg)` to `rotate(3deg)`
- Raw hover states (instant color swap, no transition or `transition: none`)
- Hard drop shadows only (`shadow-[4px_4px_0_#0a0a0a]`)

#### Forbidden
- `border-radius` > 4px (use `rounded-none` or `rounded-sm`)
- Gradient backgrounds
- `backdrop-blur` / glass morphism
- Soft shadows (`shadow-md`, `shadow-lg`, `shadow-xl`)
- Smooth transitions > 150ms
- Decorative illustrations or SVG orbs

#### Signature Element
`exposed-grid: border-width=2px, border-color=#0a0a0a, shadow-offset=4px, shadow-blur=0`

#### Tension Zones
1. **Scale Violence -- Viewport-dominating type:** One word at 25vw+ that bleeds off-screen. Rawness amplified to maximum.
2. **Material Collision -- Polished intrusion:** One hyper-smooth glass element (`backdrop-blur-xl`) in the otherwise raw layout.
3. **Interaction Shock -- Destructive hover:** Elements that glitch, fragment, or distort on hover, then snap back.

---

### 2. Ethereal

> Soft, dreamlike, floating. Everything feels weightless and luminous.

**Personality:** Gentle, sophisticated, calming, aspirational
**Best for:** Wellness apps, luxury beauty, meditation tools, creative portfolios

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#faf8f5` | Warm white |
| surface | `#f0ece6` | Cream |
| text | `#2a2520` | Warm dark brown |
| border | `#e0d8ce` | Soft warm line |
| primary | `#c8a2c8` | Soft lavender |
| secondary | `#e8c4a0` | Warm peach/gold |
| accent | `#a8d8c8` | Soft sage |
| muted | `#8a8078` | Warm muted |
| glow | `rgba(200,162,200,0.15)` | Lavender glow |
| tension | `#6b4c6b` | Deep plum for tension |
| highlight | `#e8c4a0` | Peach highlight |
| signature | `#c8a2c8` | Lavender |

#### Required Fonts
- Display: **Instrument Serif** or **Cormorant Garamond** (elegant serif)
- Body: **DM Sans** or **Outfit** (clean, airy sans)

#### Mandatory Techniques
- Background gradient orbs with `blur-[120px]`+ (2-3 per page)
- Generous whitespace (`py-32`+ between sections)
- Soft layered shadows with large spread (`shadow-[0_20px_60px_-20px_...]`)
- Serif + sans-serif contrast in typography
- Elements that feel like they float (large diffused shadows)
- Light color temperature throughout -- warm whites and creams only

#### Forbidden
- Dark backgrounds (anything below `#e0e0e0`)
- Sharp corners (minimum `rounded-xl` everywhere)
- Neon or vibrant saturated accent colors
- Thick borders (max 1px, low opacity)
- Font weights above 600
- Fast animations (nothing under 400ms, no bouncy easing)

#### Signature Element
`gradient-orb: size=400px, blur=120px, color=primary, animation-duration=10s, movement=drift`

#### Tension Zones
1. **Scale Violence -- Microscopic precision:** Extremely small details (6-8px labels) against the soft, generous whitespace.
2. **Temporal Disruption -- Frozen bloom:** One element mid-animation frozen in time -- a gradient orb caught mid-expansion.
3. **Dimensional Break -- Depth puncture:** One element with hard perspective/3D in the otherwise flat, floaty layout.

---

### 3. Kinetic

> Everything moves with purpose. Scroll is the primary interaction. The page is alive.

**Personality:** Energetic, dynamic, tech-forward, impressive
**Best for:** Creative agencies, product launches, event sites, brand experiences

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#0a0a0f` | Deep black |
| surface | `#12121a` | Slightly lighter |
| text | `#ffffff` | Pure white |
| border | `rgba(255,255,255,0.08)` | Subtle glass border |
| primary | `#5eead4` | Vibrant teal |
| secondary | `#fbbf24` | Electric amber |
| accent | `#f472b6` | Hot pink (sparingly) |
| muted | `#71717a` | Zinc-500 |
| glow | `rgba(94,234,212,0.25)` | Teal glow |
| tension | `#ff0044` | Shock red |
| highlight | `#fbbf24` | Amber highlight |
| signature | `#5eead4` | Teal |

#### Required Fonts
- Display: **Clash Display** or **Satoshi** (bold geometric)
- Body: **Inter Tight** or **Geist** (precise, compact)

#### Mandatory Techniques
- Scroll-driven animations on every section (CSS `animation-timeline: view()` or `whileInView`)
- Horizontal scroll section for at least one area
- Staggered reveals with 60-100ms delays between elements
- Parallax layers (foreground/background different scroll speeds)
- At least one GSAP ScrollTrigger or scroll-driven pin
- Custom easing on all motion (`cubic-bezier`, never `ease-linear`)

#### Forbidden
- Static pages with no scroll interaction
- Default `transition-all duration-300` without choreography
- Uniform enter directions (everything from same side)
- Stagger delay > 200ms (feels sluggish)
- `ease-linear` easing
- Decorative-only animation (all motion must serve purpose)

#### Signature Element
`scroll-progress: type=morph-shape, visibility=persistent, tracks=scroll-position, color=primary`

#### Tension Zones
1. **Interaction Shock -- Velocity feedback:** Elements respond to scroll SPEED, not just position. Fast = blur/stretch. Slow = crystal clear.
2. **Material Collision -- Static island:** One completely static, non-animated element in the sea of motion.
3. **Scale Violence -- Micro-to-macro:** Elements start tiny and scale up massively on scroll approach.

---

### 4. Editorial

> Typography IS the design. Words take center stage with magazine-quality layout.

**Personality:** Intellectual, authoritative, content-first, cultured
**Best for:** Blogs, publications, book/author sites, long-form content, news

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#faf9f6` | Warm paper white |
| surface | `#f2efe8` | Aged paper |
| text | `#1a1a1a` | Near-black |
| border | `#d4d0c8` | Subtle warm line |
| primary | `#c41e3a` | Editorial red |
| secondary | `#1a1a1a` | Black as secondary |
| accent | `#c41e3a` | Red accent |
| muted | `#666660` | Warm gray |
| glow | `none` | No glow effects |
| tension | `#00ccff` | Digital blue for tension |
| highlight | `#fff4cc` | Warm yellow highlight |
| signature | `#c41e3a` | Editorial red |

#### Required Fonts
- Display: **Playfair Display** or **Instrument Serif** (classic serif)
- Body: **Source Serif 4** or **Lora** (readable serif)
- Mono: **JetBrains Mono** (for metadata/dates only)

#### Mandatory Techniques
- Mixed serif + sans-serif in headlines (e.g., "Design with *intention*")
- Drop caps on opening paragraphs (3-4 lines, display serif)
- Pull quotes with large serif type (text-3xl+)
- `max-w-[65ch]` on all body text
- Column layouts (CSS columns or 2-column grid for content)
- Generous line-height (1.7+) on body text

#### Forbidden
- Sans-serif as display font (must use serif for headings)
- Dark mode (this is a light, paper-like aesthetic)
- Neon colors or glow effects
- `border-radius` > 8px on content areas
- Animations on text content (text should feel stable)
- Centered body text (flush-left for readability)

#### Signature Element
`drop-cap: size=4-lines, font=display-serif, color=primary, frequency=every-major-section`

#### Tension Zones
1. **Scale Violence -- Oversized drop cap:** Drop cap takes 40% of the viewport, not just 4-5 lines.
2. **Material Collision -- Digital intrusion:** One neon/glowing element in the paper-like layout.
3. **Dimensional Break -- Z-axis pull quote:** Pull quote floats above the page with heavy shadow and slight rotation.

---

### 5. Neo-Corporate

> Premium dark-mode dashboard aesthetic. Precise, data-confident. Linear meets Huly.

**Personality:** Precise, trustworthy, powerful, efficient
**Best for:** SaaS products, developer tools, B2B platforms, dashboards

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#09090b` | Near-black |
| surface | `#111113` | Card surface |
| text | `#fafafa` | Bright white |
| border | `rgba(255,255,255,0.06)` | Glass border |
| primary | `#818cf8` | Soft indigo |
| secondary | `#34d399` | Emerald green |
| accent | `#f472b6` | Pink (sparingly) |
| muted | `#71717a` | Zinc-500 |
| glow | `rgba(129,140,248,0.2)` | Indigo glow |
| tension | `#ff5722` | Warm orange for tension |
| highlight | `#818cf8` | Indigo highlight |
| signature | `#818cf8` | Indigo |

#### Required Fonts
- Display: **Geist** or **General Sans** (clean, precise sans)
- Body: **Geist** or **Inter Tight** (matching precision)
- Mono: **Geist Mono** or **JetBrains Mono**

#### Mandatory Techniques
- Glass morphism cards (`bg-surface/50 backdrop-blur-xl border border-white/[0.06]`)
- `gap-px` borders between grid items (Linear-style)
- Monospace for numbers, dates, status labels
- Colored glow shadows on accent elements
- Subtle grid or dot background pattern
- Badge/pill components for status indicators

#### Forbidden
- Bright/warm backgrounds (above `#1a1a1e`)
- Serif fonts anywhere
- `border-radius` > `rounded-2xl` on cards
- Playful illustrations or bouncy animations
- More than 2 accent colors prominent simultaneously
- Emoji in UI elements

#### Signature Element
`dot-grid-bg: pattern=dot, spacing=24px, opacity=0.08, fade=radial-center, color=text`

#### Tension Zones
1. **Scale Violence -- Hero number:** One metric at 15-20vw dominating the hero, product UI secondary.
2. **Material Collision -- Analog texture:** One section with paper/grain texture in the clean digital surface.
3. **Interaction Shock -- Data reveal:** Hovering a card reveals real-time data or charts previously hidden.

---

### 6. Organic

> Flowing, natural, alive. Curves replace edges. Nature inspires everything.

**Personality:** Warm, approachable, natural, grounded
**Best for:** Food/beverage, sustainability, health, outdoor, eco-friendly products

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#f7f4ee` | Natural off-white |
| surface | `#ebe5d8` | Warm sand |
| text | `#2d2a24` | Dark earth |
| border | `#d4cbb8` | Warm beige |
| primary | `#4a7c59` | Forest green |
| secondary | `#c67b4e` | Terracotta |
| accent | `#d4a96a` | Warm gold |
| muted | `#7a7468` | Stone gray |
| glow | `rgba(74,124,89,0.15)` | Soft green glow |
| tension | `#2a2a2a` | Sharp black for tension |
| highlight | `#d4a96a` | Gold highlight |
| signature | `#4a7c59` | Forest green |

#### Required Fonts
- Display: **Cabinet Grotesk** or **General Sans** (warm geometric)
- Body: **DM Sans** or **Plus Jakarta Sans** (friendly, readable)

#### Mandatory Techniques
- SVG blob shapes as section backgrounds or image masks
- Organic border-radius on images (`border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%`)
- Wavy or curved section dividers (SVG paths, not straight lines)
- Earthy warm color temperature throughout
- Asymmetric layouts (no rigid grids)
- At least one morphing SVG blob animation (8-12s cycle)

#### Forbidden
- Sharp 90-degree corners on visual elements
- Neon or electric colors
- Dark backgrounds (below `#d0d0d0`)
- Monospace fonts
- Grid-based dot or line patterns (too mechanical)
- Hard drop shadows

#### Signature Element
`morph-blob: size=300-500px, colors=[primary,secondary], animation-duration=10s, position=hero-bg`

#### Tension Zones
1. **Scale Violence -- Giant botanical:** Oversized SVG botanical illustration spanning full viewport height as background.
2. **Dimensional Break -- Geometric intrusion:** One sharp geometric element in the curved, flowing layout.
3. **Temporal Disruption -- Growth animation:** One SVG path that continuously extends/grows on scroll.

---

### 7. Retro-Future

> Cyberpunk meets vintage computing. CRT glow, terminal green, scan lines.

**Personality:** Nostalgic, techy, underground, hacker-culture
**Best for:** Dev tools, hacker news alternatives, crypto, retro gaming, terminal apps

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#0a0a0a` | True black |
| surface | `#0f1a0f` | Dark green tint |
| text | `#33ff33` | Terminal green |
| border | `#1a991a` | Dimmed green |
| primary | `#33ff33` | Bright green |
| secondary | `#ff6600` | Amber/orange |
| accent | `#33ff33` | Green only |
| muted | `#1a991a` | Dimmed green |
| glow | `rgba(51,255,51,0.3)` | Green glow |
| tension | `#ff0000` | Error red for tension |
| highlight | `#33ff33` | Green highlight |
| signature | `#33ff33` | Terminal green |

#### Required Fonts
- Display: **Space Mono** or **JetBrains Mono** (monospace ONLY)
- Body: **IBM Plex Mono** or **Fira Code** (monospace ONLY)
- Mono: same as body

#### Mandatory Techniques
- ALL text in monospace -- no exceptions
- CRT scan-line overlay (`repeating-linear-gradient` 2px transparent / 1px rgba lines)
- Text glow via `text-shadow` with green/amber
- Blinking cursor (`_` or `|`) after hero headings
- ASCII art or box-drawing characters for dividers
- Typing animation on at least one heading

#### Forbidden
- Sans-serif or serif fonts (monospace only)
- `border-radius` > 2px
- Photography (use ASCII art or low-res pixelated images)
- Soft/subtle elements -- everything glows or pulses
- Gradient backgrounds (solid dark only)
- White text (terminal colors only: green, amber, orange)

#### Signature Element
`crt-overlay: scan-line-gap=3px, scan-line-opacity=0.08, flicker-duration=4s, cursor-blink=800ms`

#### Tension Zones
1. **Scale Violence -- Massive ASCII:** ASCII art at full width that turns characters into abstract patterns.
2. **Interaction Shock -- Terminal command:** Interactive terminal accepting real commands (`help`, `about`, `hire me`).
3. **Material Collision -- High-res photo:** One modern high-resolution photograph in the pixelated aesthetic.

---

### 8. Luxury/Fashion

> Haute couture digital. Dramatic imagery, restrained typography, maximum negative space.

**Personality:** Exclusive, aspirational, refined, minimal-maximal
**Best for:** Fashion brands, luxury products, high-end real estate, premium services

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#f8f6f3` | Warm ivory |
| surface | `#1a1a1a` | Rich black (alternating sections) |
| text | `#1a1a1a` | On light / `#f8f6f3` on dark |
| border | `#d4cfc7` | Subtle warm |
| primary | `#c9a96e` | Muted gold |
| secondary | `#1a1a1a` | Black |
| accent | `#c9a96e` | Gold only |
| muted | `#999088` | Warm muted |
| glow | `rgba(201,169,110,0.1)` | Subtle gold glow |
| tension | `#ff0044` | Shock pink for tension |
| highlight | `#c9a96e` | Gold highlight |
| signature | `#c9a96e` | Gold |

#### Required Fonts
- Display: **Cormorant Garamond** or **Playfair Display** (high-fashion serif)
- Body: **Montserrat** or **Raleway** (thin, elegant sans, weight 200-300)

#### Mandatory Techniques
- Full-bleed hero imagery (edge to edge, no container)
- Font-weight 200-300 for body text
- Alternating light/dark section backgrounds
- Oversized typography (`text-8xl`+ for hero)
- Maximum negative space (`py-40`+)
- Image hover: subtle zoom (`scale-[1.02]` to `scale-[1.05]` over 600ms)

#### Forbidden
- Bright/saturated accent colors (only muted gold)
- Rounded buttons or cards (rectangular or very subtle radius)
- Emoji or playful icons
- Dense content layout (everything needs breathing room)
- Bouncy animations or spring easing
- More than 2 colors as accents

#### Signature Element
`split-reveal: type=image-split, direction=vertical, trigger=scroll, duration=800ms, typography=thin-serif-overlay`

#### Tension Zones
1. **Scale Violence -- Single word hero:** One word at 25vw+, ultra-thin weight (100-200), massive letter-spacing.
2. **Temporal Disruption -- Slow reveal:** Content takes 3-5 seconds to fully appear. Painfully slow, exquisitely elegant.
3. **Material Collision -- Raw element:** One deliberately unpolished element (hand-drawn line, raw texture) in the refined layout.

---

### 9. Playful/Startup

> Bold, energetic, approachable. Rounded shapes, vibrant colors, personality in every element.

**Personality:** Friendly, energetic, approachable, fun
**Best for:** Consumer apps, startups, education, social platforms, kids/family products

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#fffbf5` | Warm white |
| surface | `#fff0e0` | Peachy light |
| text | `#1e1b4b` | Deep indigo-black |
| border | `#e0d0c0` | Soft warm border |
| primary | `#ff5722` | Vibrant orange |
| secondary | `#7c3aed` | Vivid purple |
| accent | `#06b6d4` | Bright cyan |
| muted | `#94899c` | Soft purple-gray |
| glow | `rgba(255,87,34,0.2)` | Orange glow |
| tension | `#0a0a0a` | Black for tension contrast |
| highlight | `#facc15` | Sunshine yellow |
| signature | `#ff5722` | Vibrant orange |

#### Required Fonts
- Display: **Cabinet Grotesk** or **Satoshi** (bold, rounded)
- Body: **Plus Jakarta Sans** or **Nunito** (soft, friendly)

#### Mandatory Techniques
- Rounded everything (`rounded-2xl` minimum, `rounded-full` for buttons)
- Illustrated icons or hand-drawn style elements
- Multiple accent colors used together (3-4 visible per section)
- Bouncy hover animations (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- Tilted or rotated elements (`rotate-[-3deg]` to `rotate-[3deg]`)
- Emoji or custom illustrations as visual accents

#### Forbidden
- Dark backgrounds (keep light and cheerful)
- Monospace fonts
- Formal or corporate tone in any element
- Font weights below 400
- Muted or desaturated colors
- Rigid grid layouts (use playful, offset arrangements)

#### Signature Element
`bounce-card: tilt-range=[-3deg,3deg], hover-spring=cubic-bezier(0.34,1.56,0.64,1), shadow-color=primary`

#### Tension Zones
1. **Interaction Shock -- Physics play:** Elements respond to click/drag with real physics (bounce, collide, spin).
2. **Scale Violence -- Giant illustration:** One oversized illustration (50%+ viewport) as hero instead of text.
3. **Dimensional Break -- Flat sticker:** One deliberately flat, sticker-like element in an otherwise dimensional layout.

---

### 10. Data-Dense

> Maximum information density. Every pixel serves a purpose. Bloomberg Terminal for the web.

**Personality:** Efficient, information-rich, professional, power-user
**Best for:** Analytics dashboards, trading platforms, monitoring tools, admin panels

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#0b0e11` | Deep dark |
| surface | `#131720` | Panel surface |
| text | `#e2e8f0` | Slate-200 |
| border | `rgba(255,255,255,0.08)` | Panel dividers |
| primary | `#3b82f6` | Info blue |
| secondary | `#22c55e` | Positive green |
| accent | `#f59e0b` | Warning amber |
| muted | `#64748b` | Slate-500 |
| glow | `rgba(59,130,246,0.15)` | Blue glow |
| tension | `#ef4444` | Alert red |
| highlight | `#3b82f6` | Blue highlight |
| signature | `#3b82f6` | Info blue |

#### Required Fonts
- Display: **JetBrains Mono** or **IBM Plex Mono** (monospace primary)
- Body: **Inter Tight** at 13-14px (dense, not 16px) or **IBM Plex Mono**
- Mono: same as display

#### Mandatory Techniques
- Compact spacing (`py-2`, `px-3` -- no generous whitespace)
- Tabular numbers everywhere (`font-variant-numeric: tabular-nums`)
- Dense grid layouts (multi-column, multi-row)
- Status indicators with colored dots (green/red/amber)
- Real-time feel: subtle pulse animation on live data, timestamps
- Resizable panels or split-pane layouts

#### Forbidden
- Large whitespace (`py-16`+)
- Decorative elements (blobs, illustrations, orbs)
- Font sizes above `text-2xl` anywhere
- `border-radius` > `rounded-lg`
- Playful or bouncy animations
- Hero sections (start with data immediately)

#### Signature Element
`status-bar: position=top-fixed, metrics=[uptime,latency,users], update-interval=5s, indicator-colors=[secondary,tension,accent]`

#### Tension Zones
1. **Scale Violence -- Mega metric:** One number at 200px+ font size -- the single most important KPI.
2. **Interaction Shock -- Drill-down explosion:** Clicking a data point expands into a full detailed panel.
3. **Material Collision -- Warm accent:** One warmly-colored, soft element in the cold data interface.

---

### 11. Japanese Minimal

> Ma (negative space) as a design principle. Restraint is the ultimate sophistication.

**Personality:** Serene, refined, contemplative, precise
**Best for:** Tea/ceramics brands, architecture, zen products, premium Japanese brands

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#f5f2ed` | Warm rice paper |
| surface | `#ebe7e0` | Slightly darker |
| text | `#2c2c2c` | Sumi ink |
| border | `#d4cfc6` | Subtle, like pencil |
| primary | `#c23b22` | Vermillion red (sparingly) |
| secondary | `#2c2c2c` | Ink black |
| accent | `#c23b22` | Vermillion only |
| muted | `#8c8680` | Faded ink |
| glow | `none` | No glow |
| tension | `#c23b22` | Vermillion burst |
| highlight | `#f0e0c8` | Warm parchment |
| signature | `#c23b22` | Vermillion |

#### Required Fonts
- Display: **Noto Serif JP** or **Cormorant** (refined serif)
- Body: **Noto Sans JP** or **Outfit** (clean, light weight)

#### Mandatory Techniques
- Extreme whitespace (`py-40`+ between sections, sometimes `py-64`)
- Maximum 1-2 elements per viewport
- Asymmetric balance (intentional off-center, not centered or grid)
- Single accent color used extremely sparingly (1-2 times per page)
- Thin 1px lines as section dividers
- Small, understated typography (no `text-7xl`+ heroes)

#### Forbidden
- Multiple accent colors
- Dense layouts or grids with 3+ columns
- Font weights above 500
- Glow effects, shadows, or glass morphism
- Animations faster than 600ms
- Busy backgrounds (patterns, grids, dots)

#### Signature Element
`horizon-line: width=100vw, thickness=1px, color=border, content-alignment=asymmetric-offset`

#### Tension Zones
1. **Scale Violence -- Enormous negative space:** A section with 80%+ whitespace; content in a tiny corner. Space IS the design.
2. **Material Collision -- Red burst:** One bold vermillion stroke or shape breaking the restraint.
3. **Temporal Disruption -- Stillness:** One element aggressively static while subtle motion exists elsewhere.

---

### 12. Glassmorphism

> Layered translucent surfaces with depth. Glass panels floating in space.

**Personality:** Modern, sleek, depth-aware, premium
**Best for:** OS/app interfaces, fintech, modern SaaS, design tools

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#0f0f1a` | Deep dark blue |
| surface | `rgba(255,255,255,0.05)` | Glass surface |
| text | `#f0f0f5` | Bright |
| border | `rgba(255,255,255,0.1)` | Glass edge |
| primary | `#6366f1` | Indigo |
| secondary | `#ec4899` | Pink |
| accent | `#8b5cf6` | Purple |
| muted | `#8888aa` | Muted blue-gray |
| glow | `rgba(99,102,241,0.15)` | Ambient indigo glow |
| tension | `#ffffff` | Solid white for tension |
| highlight | `#6366f1` | Indigo highlight |
| signature | `#6366f1` | Indigo |

#### Required Fonts
- Display: **Satoshi** or **General Sans** (clean geometric)
- Body: **DM Sans** or **Geist** (precise, modern)

#### Mandatory Techniques
- `backdrop-blur-xl` on ALL card/panel surfaces
- `bg-white/5` to `bg-white/10` surface colors (never solid on cards)
- Layered surfaces (3+ depth levels visible simultaneously)
- Gradient border using wrapper div technique
- Background gradient orbs (2-3) behind glass panels
- Floating shadows (`shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]`)

#### Forbidden
- Solid opaque card backgrounds (must be translucent)
- Flat design without visible depth layers
- Light/white page backgrounds
- Heavy borders (only subtle glass edges)
- More than 3 background orbs (becomes muddy)
- Sharp corners on glass elements (min `rounded-xl`)

#### Signature Element
`glass-stack: layers=3+, blur=backdrop-blur-xl, bg=white/5-white/10, orb-count=2-3, orb-blur=120px`

#### Tension Zones
1. **Dimensional Break -- Solid intrusion:** One completely opaque, solid-colored element among translucent panels.
2. **Scale Violence -- Giant glass pane:** One glass panel spanning the entire viewport with content floating within.
3. **Interaction Shock -- Refraction shift:** Hovering glass panels shifts blur/refraction of elements behind them.

---

### 13. Neon Noir

> Cyberpunk city at night. Electric neon on deep black. High contrast, high energy.

**Personality:** Bold, electric, nocturnal, rebellious
**Best for:** Gaming, nightlife, music, crypto, cyberpunk aesthetics

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#05050a` | Abyss black |
| surface | `#0a0a15` | Slightly lighter |
| text | `#f0f0f5` | Bright white |
| border | `rgba(0,255,136,0.2)` | Neon-tinted edge |
| primary | `#00ff88` | Neon green |
| secondary | `#ff00ff` | Neon magenta |
| accent | `#00ccff` | Neon cyan |
| muted | `#444466` | Dark muted |
| glow | `rgba(0,255,136,0.4)` | Green glow |
| tension | `#ff0000` | Emergency red |
| highlight | `#ff00ff` | Magenta highlight |
| signature | `#00ff88` | Neon green |

#### Required Fonts
- Display: **Orbitron** or **Rajdhani** (futuristic/techy)
- Body: **Space Grotesk** or **Exo 2** (clean geometric)

#### Mandatory Techniques
- Triple-layer neon glow on text and buttons (near + mid + far `text-shadow`)
- Animated gradient borders (`conic-gradient` spinning)
- NO gray anywhere -- only black and neon
- CRT/scanline texture overlay at low opacity
- At least one animated neon sign element (flicker effect)
- Minimum contrast ratio 10:1 (neon on black)

#### Forbidden
- Muted or pastel colors
- Light backgrounds
- Serif fonts
- Subtle/gentle animations (everything must pop)
- `rounded-full` on containers (angular feels more cyberpunk)
- White as accent color (neon colors only)

#### Signature Element
`neon-sign: glow-layers=3, flicker-pattern=irregular, flicker-opacity=[0.9,1.0], text-shadow-spread=[2px,8px,20px]`

#### Tension Zones
1. **Scale Violence -- Neon word wall:** One word at viewport scale with triple glow illuminating surrounding elements.
2. **Interaction Shock -- Blackout hover:** Hovering an element darkens everything else, creating spotlight effect.
3. **Temporal Disruption -- Dying neon:** One neon element with realistic irregular flickering, like a sign about to burn out.

---

### 14. Warm Artisan

> Handcrafted feel. Texture-rich, tactile, like holding a well-made physical object.

**Personality:** Authentic, tactile, human, craft-focused
**Best for:** Coffee shops, bakeries, handmade goods, artisan products, craft beer

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#f4efe4` | Parchment |
| surface | `#e8dfd0` | Kraft paper |
| text | `#2c2418` | Dark brown |
| border | `#c8b89c` | Warm tan |
| primary | `#b85c38` | Burnt sienna |
| secondary | `#5c7a3b` | Olive green |
| accent | `#d4a96a` | Warm gold |
| muted | `#7a6e5e` | Medium brown |
| glow | `rgba(184,92,56,0.1)` | Warm subtle glow |
| tension | `#1a1a2e` | Dark navy for tension |
| highlight | `#d4a96a` | Gold highlight |
| signature | `#b85c38` | Burnt sienna |

#### Required Fonts
- Display: **Fraunces** or **Lora** (warm, slightly quirky serif)
- Body: **Source Sans 3** or **Nunito** (friendly, readable)

#### Mandatory Techniques
- Paper/grain noise texture overlay (`opacity: 0.03-0.05`)
- Warm color temperature throughout (no cool blues/grays)
- Hand-drawn style dividers or decorative elements
- Organic border-radius (not perfectly circular)
- Full-bleed photography with warm color grading
- Stamp/badge-style labels and tags

#### Forbidden
- Cool-toned colors (blue, cyan, purple)
- Glass morphism or glossy effects
- Monospace fonts
- Neon or glow effects
- Sharp geometric patterns
- Pure white (`#ffffff`) or pure black (`#000000`) backgrounds

#### Signature Element
`paper-texture: type=grain-noise, opacity=0.04, blend-mode=multiply, badge-style=stamp, badge-color=primary`

#### Tension Zones
1. **Material Collision -- Digital precision:** One sharp, pixel-perfect geometric element in the handcrafted layout.
2. **Scale Violence -- Giant stamp:** Oversized stamp/badge element (40%+ viewport) as section background.
3. **Interaction Shock -- Texture reveal:** Hovering reveals underlying paper/grain texture more prominently.

---

### 15. Swiss/International

> Grid is god. Helvetica-adjacent precision. Mathematical beauty.

**Personality:** Rational, structured, timeless, precise
**Best for:** Architecture firms, design studios, museums, corporate identities

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#ffffff` | Pure white |
| surface | `#f5f5f5` | Light gray |
| text | `#111111` | Near-black |
| border | `#cccccc` | Precise gray |
| primary | `#ff0000` | Swiss red (sparingly) |
| secondary | `#111111` | Black |
| accent | `#ff0000` | Red only |
| muted | `#666666` | Medium gray |
| glow | `none` | No glow |
| tension | `#0000ff` | Blue for tension |
| highlight | `#ff0000` | Red highlight |
| signature | `#ff0000` | Swiss red |

#### Required Fonts
- Display: **Helvetica Neue** or **Switzer** (neo-grotesque)
- Body: **Helvetica Neue** or **Switzer** (same family, different weights)

#### Mandatory Techniques
- Strict 12-column grid system (visible in layout structure)
- One accent color only (red) used extremely sparingly
- Typographic hierarchy through size and weight alone (no color differentiation)
- Asymmetric Swiss-style layouts (text left, image right, intentional offsets)
- Horizontal and vertical rules as structural elements
- Flush-left alignment (no centered text except rare exceptions)

#### Forbidden
- More than 1 accent color
- Centered layouts (flush-left is fundamental)
- Rounded corners (everything rectangular)
- Decorative elements not serving information hierarchy
- Custom illustrations (use photography or typography only)
- Animations beyond subtle fades (200ms max)

#### Signature Element
`grid-overlay: columns=12, visibility=low-opacity, gap=24px, alignment=flush-left, rule-thickness=1px`

#### Tension Zones
1. **Scale Violence -- Grid demonstration:** Content arranged so dramatically that the grid structure itself becomes visual art.
2. **Material Collision -- Organic photo:** One lush, organic photograph in the mathematical precision.
3. **Dimensional Break -- Type depth:** One headline with subtle 3D shadow lifting it off the flat grid.

---

### 16. Vaporwave

> Retro digital nostalgia. Pastel gradients, marble busts, 90s web reimagined.

**Personality:** Nostalgic, dreamy, ironic, aesthetic
**Best for:** Music/art projects, merch stores, portfolio showcases, aesthetic brands

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#1a0a2e` | Deep purple |
| surface | `#2d1b4e` | Medium purple |
| text | `#e0d0ff` | Light lavender |
| border | `rgba(255,113,206,0.3)` | Pink-tinted edge |
| primary | `#ff71ce` | Hot pink |
| secondary | `#01cdfe` | Cyan |
| accent | `#05ffa1` | Mint green |
| muted | `#b967ff` | Bright purple |
| glow | `rgba(255,113,206,0.3)` | Pink glow |
| tension | `#ffffff` | White for tension |
| highlight | `#ff71ce` | Pink highlight |
| signature | `#ff71ce` | Hot pink |

#### Required Fonts
- Display: **Orbitron** or **Audiowide** (retro futuristic)
- Body: **DM Sans** (readable) with **VT323** or **Press Start 2P** for accents

#### Mandatory Techniques
- Horizontal gradient backgrounds (pink to cyan to purple)
- Grid perspective floor (CSS perspective vanishing to horizon)
- Glitch effects on text or images (CSS transform with color offset)
- Pastel neon glow on text and borders
- Window/frame UI elements (old OS-style windows)
- Sunset gradient as background or header element

#### Forbidden
- Corporate/professional aesthetic
- Muted/earthy colors
- Serif fonts for body text
- Minimalist layouts (more is more)
- Subtle styling -- go bold or go home
- Monochrome palettes

#### Signature Element
`retro-grid: type=perspective-floor, line-color=primary, horizon-gradient=[primary,secondary,accent], line-width=1px`

#### Tension Zones
1. **Scale Violence -- Massive glitch:** Full-viewport glitch distortion for 2-3 seconds on page load.
2. **Interaction Shock -- Window manipulation:** OS-style windows users can drag, resize, and minimize.
3. **Temporal Disruption -- Loading nostalgia:** Fake retro loading bar that plays before content reveals.

---

### 17. Neubrutalism

> Brutalism's playful evolution. Bold colors, thick outlines, hard shadows -- but friendly, not hostile.

**Personality:** Energetic, transparent, rebellious-but-approachable, anti-corporate
**Best for:** Creator tools, indie SaaS, digital zines, developer products, marketplaces

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#f5f0e8` | Warm off-white/cream |
| surface | `#ffffff` | Pure white cards |
| text | `#1a1a1a` | Near-black |
| border | `#1a1a1a` | Thick 3px solid black |
| primary | `#ff5c5c` | Saturated red-coral |
| secondary | `#5cb8ff` | Bright blue |
| accent | `#ffd43b` | Sunshine yellow |
| muted | `#6b7280` | Standard gray |
| glow | `none` | No glow effects |
| tension | `#8b5cf6` | Purple for tension |
| highlight | `#ffd43b` | Yellow highlight |
| signature | `#ff5c5c` | Red-coral |

#### Required Fonts
- Display: **Space Grotesk** or **Syne** (bold geometric with character)
- Body: **Inter** or **DM Sans** (readable, clean -- Inter IS allowed here as body, not display)

#### Mandatory Techniques
- Thick black borders (2-3px solid `#1a1a1a`) on all cards/containers
- Hard drop shadows (`shadow-[4px_4px_0_#1a1a1a]`) -- no blur, no spread
- Saturated primary colors used liberally (not sparingly)
- Slightly rounded corners (`rounded-lg`, NOT `rounded-none` like Brutalist)
- Hover: shadow shifts (`shadow-[8px_8px_0_#1a1a1a]` + `translate(-4px,-4px)`)
- At least 3 different accent colors visible per page

#### Forbidden
- Subtle/muted color palettes
- Gradient backgrounds
- `backdrop-blur` / glass morphism
- Soft layered shadows
- Dark mode (Neubrutalism is a light-mode aesthetic)
- Thin/hairline borders

#### Signature Element
`sticker-card: border-width=3px, border-color=#1a1a1a, shadow-offset=4px, shadow-blur=0, hover-offset=8px, hover-translate=-4px`

#### Tension Zones
1. **Scale Violence -- Giant sticker:** One element as oversized sticker/badge at 40%+ viewport, thick border, rotated 3-5 degrees.
2. **Material Collision -- Glass intrusion:** One glass/frosted element (`backdrop-blur-xl`) in the otherwise flat, bold layout.
3. **Interaction Shock -- Drag to rearrange:** One section where users can drag elements around, embracing digital zine energy.

---

### 18. Dark Academia

> Ancient libraries, leather-bound books, Oxford corridors. Scholarly elegance in digital form.

**Personality:** Intellectual, mysterious, romantic, timeless
**Best for:** Education platforms, book/publishing, academic tools, literary projects, museums

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#1c1a17` | Deep warm brown-black |
| surface | `#2a2520` | Dark leather brown |
| text | `#e8dfd0` | Aged parchment |
| border | `#3d362e` | Dark wood grain |
| primary | `#8b2e2e` | Deep burgundy/oxblood |
| secondary | `#4a6741` | Forest green |
| accent | `#c9a55c` | Muted gold |
| muted | `#6b5f52` | Warm gray-brown |
| glow | `rgba(201,165,92,0.15)` | Warm gold glow |
| tension | `#00ccff` | Cold digital blue for tension |
| highlight | `#c9a55c` | Gold highlight |
| signature | `#c9a55c` | Gold |

#### Required Fonts
- Display: **Cormorant Garamond** or **EB Garamond** (scholarly serif)
- Body: **Lora** or **Source Serif 4** (readable serif)
- Mono: **JetBrains Mono** (for code/dates only)

Note: ALL primary text is serif. This is a serif-dominant aesthetic.

#### Mandatory Techniques
- Paper/parchment noise texture overlay (`opacity: 0.03-0.05`)
- Warm color temperature throughout (no cool blues)
- Drop caps on opening paragraphs (3-4 lines, display serif)
- Horizontal rules as section dividers (thin, warm-toned)
- Generous line-height on body text (1.7+)
- Dark background with warm undertones (never cool/blue-dark)

#### Forbidden
- Sans-serif as primary/display font
- Cool-toned backgrounds (blue-dark, pure `#000000`)
- Neon or electric colors
- Glass morphism or glossy effects
- Bouncy or playful animations
- Emoji or casual UI elements

#### Signature Element
`candlelight-texture: type=grain-noise, opacity=0.04, blend-mode=soft-light, text-glow=rgba(201,165,92,0.08), atmosphere=warm`

#### Tension Zones
1. **Material Collision -- Digital artifact:** One modern digital element (glass panel, neon accent) intruding on vintage scholarly atmosphere.
2. **Scale Violence -- Monumental quote:** Literary quote at 10vw+ in thin serif, spanning full viewport.
3. **Temporal Disruption -- Age gradient:** Elements appear to age as user scrolls -- crisp at top, increasingly textured/worn toward bottom.

---

### 19. AI-Native

> Machine intelligence made visible. Data as decoration. The algorithm has an aesthetic.

**Personality:** Precise, futuristic, clinical, emergent
**Best for:** AI/ML products, research labs, data platforms, developer tools, tech startups

#### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg | `#08080c` | Near-black with blue tint |
| surface | `#10101a` | Dark blue-tinted surface |
| text | `#e0e4f0` | Cool bright |
| border | `rgba(100,120,255,0.12)` | Blue-tinted edge |
| primary | `#6478ff` | Electric blue |
| secondary | `#a78bfa` | Soft violet |
| accent | `#22d3ee` | Cyan |
| muted | `#555577` | Cool muted |
| glow | `rgba(100,120,255,0.2)` | Blue glow |
| tension | `#ff4444` | Alert red for tension |
| highlight | `#a78bfa` | Violet highlight |
| signature | `#6478ff` | Electric blue |

#### Required Fonts
- Display: **Space Mono** or **JetBrains Mono** (monospace dominant)
- Body: **Inter Tight** or **Geist** (precise sans for paragraphs)
- Mono: **Space Mono** or **JetBrains Mono** (same as display)

#### Mandatory Techniques
- Grid or scan-line background patterns (`repeating-linear-gradient` at low opacity)
- Monospace type for headings, labels, data, and navigation
- Data visualization as decoration (scatter plots, node graphs, waveforms as backgrounds)
- Real-time animation feel (subtle pulsing nodes, flowing particles, updating numbers)
- Cool blue-to-purple color temperature throughout
- Terminal/console-style UI elements (bordered panels, status indicators, logs)

#### Forbidden
- Warm colors as primary (no orange, red, brown -- reserve for tension only)
- Serif fonts anywhere
- Hand-drawn or organic elements
- Bouncy/playful animations
- Rounded-full on containers
- Photography as hero content (use generated visuals or data viz)

#### Signature Element
`neural-grid: type=node-network, node-count=20-40, connection-opacity=0.1, pulse-duration=3s, color=primary, animation=ambient`

#### Tension Zones
1. **Material Collision -- Organic intrusion:** One warm, organic element (natural photo, handwritten text) in the clinical machine aesthetic.
2. **Scale Violence -- Data flood:** A wall of real-time updating data/numbers/metrics covering the full viewport, overwhelming in density.
3. **Interaction Shock -- AI response:** An element that appears to "think" before responding -- typing indicator, processing animation, then output.

<!-- LAYER 2: ARCHETYPE DEFINITIONS END -->

## Layer 3: Integration Context

### Archetype to Design DNA

When an archetype is selected, its constraints populate the Design DNA document:

| Archetype Section | DNA Section | Mapping |
|-------------------|------------|---------|
| Locked Palette (12 tokens) | Color Tokens | Direct copy -- `--color-bg`, `--color-surface`, etc. |
| Required Fonts | Font Stack | Display, body, mono fonts become DNA font tokens |
| Mandatory Techniques | Technique Constraints | Listed as enforced rules in DNA |
| Forbidden Patterns | Forbidden List | Checked during verify -- violation = -5 penalty |
| Signature Element | Signature Element | Named pattern + parameters in DNA |
| Tension Zones (3) | Tension Plan | Available tension techniques for this project |

### Archetype to Emotional Arc

Each archetype has a default arc template (defined in the emotional-arc skill). Key archetype-specific arc modifications:

| Archetype | Arc Modification |
|-----------|-----------------|
| Japanese Minimal | HOOK beat height reduced to 50-70vh, element count 1-2 |
| Data-Dense | No HOOK beat -- data IS the hook, start with content |
| Editorial | HOOK height 60-80vh -- content-first, not spectacle |
| Kinetic | All beats have scroll-driven animation requirements |
| Ethereal | PEAK beat uses slow transitions (800ms+), no aggressive motion |
| Brutalist | BREATHE beats have less whitespace (50-60% vs 70-80%) |
| Luxury/Fashion | All transitions are slow (600ms+), no bouncy easing |

### Archetype to Anti-Slop Gate

During `/modulo:verify`, the quality reviewer checks archetype compliance:

- **Forbidden pattern found:** -5 penalty per violation (e.g., gradient background in Brutalist project)
- **Missing signature element:** -3 penalty (signature must appear in at least one section)
- **No creative tension moment:** -5 penalty (at least one tension zone must be used per page)
- **Display font violation:** -5 penalty if Inter/Roboto used as display font (unless archetype requires it)

### Archetype to Section Builder

Builder spawn prompts include:
1. Archetype name (so builder can reference the full constraint block)
2. Locked palette (all 12 color tokens)
3. Required fonts (display, body, mono)
4. Forbidden patterns (quick-reference list)
5. Signature element (named pattern + parameters)
6. Which tension zone to use (if this section has an assigned tension moment)

Builders read the full archetype block from this skill for technique details. The spawn prompt provides the essentials for quick reference.

### Related Skills

- **design-dna** -- Archetype constraints populate DNA tokens. DNA is the runtime document; archetypes are the source definitions.
- **emotional-arc** -- Archetype-specific arc modifications change beat parameters. Arc skill references archetype name.
- **anti-slop-gate** -- Gate enforces archetype forbidden patterns and signature element presence during verify.
- **creative-tension** -- Tension zones defined per-archetype here. Creative tension skill provides the general framework.

## Layer 4: Anti-Patterns

### Anti-Pattern: Archetype Mixing Without Intent

**What goes wrong:** Applying Brutalist typography with Ethereal colors, or Kinetic motion with Japanese Minimal spacing. The result is visual confusion, not creative tension. The design has no coherent personality.
**Instead:** Pick ONE archetype. Use the tension override mechanism for intentional rule-breaking moments. A single Glass element in a Brutalist layout is tension. Half-Glass-half-Brutalist is confusion.

### Anti-Pattern: Ignoring Forbidden Patterns

**What goes wrong:** Using gradient backgrounds in a Brutalist project, or rounded corners in Swiss/International. Each violation weakens the archetype's personality and triggers a -5 penalty during verify.
**Instead:** Check the forbidden list before every design decision. If you genuinely need something forbidden, use the tension override -- document the rationale, name the specific rule, and ensure it improves the design.

### Anti-Pattern: Bland Custom Archetype

**What goes wrong:** Custom archetype defined as "clean, modern, minimal" with muted blues and Inter font. This produces the exact generic output Modulo exists to prevent. Every project looks the same.
**Instead:** Every custom archetype MUST have at least 3 distinctive mandatory techniques, at least 3 forbidden patterns, a named signature element, and 3 tension zones. If the custom archetype could describe any website, it is too generic. Push for specificity.

### Anti-Pattern: Same Archetype Every Project

**What goes wrong:** Defaulting to Neo-Corporate (or whatever feels safe) for every project. The result is a portfolio of identical-looking sites. Modulo exists for DISTINCTIVE output.
**Instead:** Match archetype to project personality using the selection guide. Push clients beyond their comfort zone. A bakery website should feel warm and artisanal, not like a SaaS dashboard. When in doubt, present the primary AND secondary recommendations from the selection guide.
