---
name: design-archetypes
description: "16 opinionated design personality archetypes plus custom archetype builder. Each archetype locks in specific colors, fonts, techniques, and constraints to guarantee unique, non-generic output."
---

Use this skill during the brainstorm phase when selecting a design direction, or when generating a Design DNA document. Triggers on: archetype, design personality, design direction, creative direction, project style, aesthetic, visual identity, design DNA.

You are a creative director who uses personality archetypes to guarantee every project has a distinctive visual identity. Each archetype is STRICT — it defines what you MUST use and what you CANNOT use.

## How Archetypes Work

1. During brainstorm, present 2-3 relevant archetypes based on the project type
2. User selects one (or requests custom)
3. The archetype's constraints populate the Design DNA document
4. ALL section builders must follow the archetype rules

**An archetype is not a suggestion — it is a constraint system.** The locked palettes, required techniques, and forbidden patterns are non-negotiable.

---

## 1. Brutalist

> Raw, exposed, unapologetically bold. Form follows function with no decorative veneer.

**Personality:** Honest, confrontational, anti-establishment, raw
**Best for:** Art studios, experimental brands, tech manifestos, creative agencies

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#f5f5f0` (warm off-white) | Light mode brutalist |
| bg-secondary | `#e8e4df` | Slightly darker |
| text-primary | `#0a0a0a` | Near-black |
| accent-1 | `#ff0000` | Pure red — no subtlety |
| accent-2 | `#0000ff` | Pure blue |
| border | `#0a0a0a` (solid 2-3px) | Thick, visible borders |

### Required Fonts
- Display: **Space Grotesk** or **IBM Plex Mono** (monospace headings)
- Body: **IBM Plex Sans** or **Space Mono**

### Mandatory Techniques
- Thick solid borders (2-3px, no opacity)
- Monospace text in headings or labels
- Exposed grid structure visible on the page
- At least one element with `rotate(-2deg)` to `rotate(3deg)`
- Raw, unpolished hover states (instant color swap, no transition)
- Black and white with one or two pure-color accents

### Forbidden
- Rounded corners > 4px (use `rounded-none` or `rounded-sm`)
- Gradient backgrounds
- Glass morphism / backdrop-blur
- Soft shadows (use hard `shadow-[4px_4px_0_#0a0a0a]` instead)
- Smooth transitions > 150ms
- Decorative illustrations

### Signature Element
Exposed CSS grid with visible grid lines or an element with a hard drop-shadow that looks like a physical sticker.

### Aggressive Tension Zones
1. **Scale Violence — Viewport-dominating type:** One word at 25vw+ that bleeds off-screen. Rawness amplified to maximum.
2. **Material Collision — Polished intrusion:** One hyper-smooth glass element in the otherwise raw layout. The contrast screams.
3. **Interaction Shock — Destructive hover:** Elements that "break" on hover — glitch, fragment, distort — then snap back.

### References
[Balenciaga](https://balenciaga.com), [Bloomberg Businessweek](https://businessweek.com), brutalistwebsites.com

---

## 2. Ethereal

> Soft, dreamlike, floating. Everything feels weightless and luminous.

**Personality:** Gentle, sophisticated, calming, aspirational
**Best for:** Wellness apps, luxury beauty, meditation tools, creative portfolios

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#faf8f5` | Warm white |
| bg-secondary | `#f0ece6` | Cream |
| text-primary | `#2a2520` | Warm dark brown |
| text-secondary | `#8a8078` | Muted warm |
| accent-1 | `#c8a2c8` | Soft lavender |
| accent-2 | `#e8c4a0` | Warm peach/gold |
| glow | `rgba(200,162,200,0.15)` | Lavender glow |

### Required Fonts
- Display: **Instrument Serif** or **Cormorant Garamond** (elegant serif)
- Body: **DM Sans** or **Outfit** (clean, airy)

### Mandatory Techniques
- Background gradient orbs with `blur-[120px]+`
- Generous whitespace (py-32+ between sections)
- Light theme only (no dark mode variant)
- Soft layered shadows with large spread
- Elements that feel like they float (`shadow-[0_20px_60px_-20px_...]`)
- Serif + sans-serif contrast in typography

### Forbidden
- Dark backgrounds (anything below #e0e0e0)
- Sharp corners (minimum rounded-xl everywhere)
- Neon/vibrant accent colors
- Thick borders
- Heavy font weights above 600
- Aggressive animations (fast, bouncy, scale > 1.05)

### Signature Element
A large, slow-moving gradient orb (8-12s animation) that drifts behind the hero content, creating a living, breathing atmosphere.

### Aggressive Tension Zones
1. **Scale Violence — Microscopic precision:** Extremely small, precise details (6-8px labels) against the soft, generous whitespace. Tension through restraint.
2. **Temporal Disruption — Frozen bloom:** One element mid-animation frozen in time — a gradient orb caught mid-expansion, a petal caught mid-fall.
3. **Dimensional Break — Depth puncture:** One element with hard perspective/3D in the otherwise flat, floaty layout.

### References
[Glossier](https://glossier.com), [Aesop](https://aesop.com), [Calm](https://calm.com)

---

## 3. Kinetic

> Everything moves with purpose. Scroll is the primary interaction. The page is alive.

**Personality:** Energetic, dynamic, tech-forward, impressive
**Best for:** Creative agencies, product launches, event sites, brand experiences

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#0a0a0f` | Deep black |
| bg-secondary | `#12121a` | Slightly lighter |
| text-primary | `#ffffff` | Pure white |
| accent-1 | `#5eead4` | Vibrant teal |
| accent-2 | `#fbbf24` | Electric amber |
| accent-3 | `#f472b6` | Hot pink (sparingly) |

### Required Fonts
- Display: **Clash Display** or **Satoshi** (bold geometric)
- Body: **Inter Tight** or **Geist** (precise)

### Mandatory Techniques
- Scroll-driven animations on every section (CSS `animation-timeline: view()` or Framer Motion `whileInView`)
- Horizontal scroll section for at least one area
- Staggered reveals with 60-100ms delays between elements
- Parallax layers (foreground/background move at different speeds)
- At least one GSAP ScrollTrigger or scroll-driven pin

### Forbidden
- Static pages with no scroll interaction
- Default `transition-all duration-300` without choreography
- Uniform enter directions (everything from same side)
- More than 200ms stagger delay (feels sluggish)
- `ease-linear` easing (use custom cubic-bezier)

### Signature Element
A scroll-progress indicator that's visible throughout the page — either a custom progress bar, or background elements that transform as the user scrolls (e.g., a shape that morphs from circle to square).

### Aggressive Tension Zones
1. **Interaction Shock — Velocity feedback:** Elements that respond to scroll SPEED, not just position. Fast scroll = blur/stretch. Slow = crystal clear.
2. **Material Collision — Static island:** One completely static, non-animated element in the sea of motion. A calm eye in the storm.
3. **Scale Violence — Micro-to-macro transition:** Elements that start tiny and scale up massively as you scroll to them.

### References
[Locomotive](https://locomotive.ca), [Resn](https://resn.co.nz), [Active Theory](https://activetheory.net)

---

## 4. Editorial

> Typography IS the design. Words take center stage with magazine-quality layout.

**Personality:** Intellectual, authoritative, content-first, cultured
**Best for:** Blogs, publications, book/author sites, long-form content, news

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#faf9f6` | Warm paper white |
| bg-secondary | `#f2efe8` | Aged paper |
| text-primary | `#1a1a1a` | Near-black |
| text-secondary | `#666660` | Warm gray |
| accent-1 | `#c41e3a` | Editorial red |
| border | `#d4d0c8` | Subtle warm line |

### Required Fonts
- Display: **Playfair Display** or **Instrument Serif** (classic serif)
- Body: **Source Serif 4** or **Lora** (readable serif)
- UI: **Inter** or **DM Sans** (for navigation/metadata only)

### Mandatory Techniques
- Mixed serif + sans-serif in headlines (e.g., "Design with *intention*")
- Drop caps on opening paragraphs
- Pull quotes with large serif type
- `max-w-[65ch]` on all body text
- Column layouts (CSS columns or 2-column grid for content)
- Generous line-height (1.7+) on body text

### Forbidden
- Sans-serif headlines (must use serif for display)
- Dark mode (this is a light, paper-like aesthetic)
- Neon colors or glow effects
- Rounded corners > 8px on content areas
- Animations on text content (text should feel stable, authoritative)

### Signature Element
An oversized drop cap (4-5 lines tall) on the first paragraph of each major section, set in the display serif font with a contrasting color.

### Aggressive Tension Zones
1. **Scale Violence — Oversized drop cap on steroids:** A drop cap that takes up the ENTIRE left column (not 4-5 lines — 40% of the viewport).
2. **Material Collision — Digital intrusion:** One neon/glowing element in the otherwise paper-like layout. Like a screen glowing in a library.
3. **Dimensional Break — Z-axis pull quote:** One pull quote that appears to float above the page with heavy shadow and slight rotation.

### References
[Medium](https://medium.com), [The New York Times](https://nytimes.com), [Monocle](https://monocle.com)

---

## 5. Neo-Corporate

> The dark-mode dashboard aesthetic. Premium, precise, data-confident. Linear meets Huly.

**Personality:** Precise, trustworthy, powerful, efficient
**Best for:** SaaS products, developer tools, B2B platforms, dashboards

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#09090b` | Near-black |
| bg-secondary | `#111113` | Card surface |
| bg-tertiary | `#1a1a1e` | Elevated surface |
| text-primary | `#fafafa` | Bright white |
| text-secondary | `#71717a` | Zinc-500 |
| accent-1 | `#818cf8` | Soft indigo |
| accent-2 | `#34d399` | Emerald green (success) |
| border | `rgba(255,255,255,0.06)` | Glass border |
| glow | `rgba(129,140,248,0.2)` | Indigo glow |

### Required Fonts
- Display: **Geist** or **General Sans** (clean, precise)
- Body: **Geist** or **Inter Tight** (matching precision)
- Mono: **Geist Mono** or **JetBrains Mono**

### Mandatory Techniques
- Glass morphism cards (`bg-secondary/50 backdrop-blur-xl border border-white/[0.06]`)
- `gap-px` borders between grid items (like Linear)
- Monospace for numbers, dates, status labels
- Colored glow shadows on accent elements
- Subtle grid or dot background pattern
- Badge/pill components for status indicators

### Forbidden
- Bright/warm backgrounds
- Serif fonts
- Rounded corners > rounded-2xl on cards
- Playful illustrations or bouncy animations
- More than 2 accent colors prominent at once

### Signature Element
A persistent subtle grid or dot-pattern background with radial fade-to-transparent at edges, making the content appear to float on a digital canvas.

### Aggressive Tension Zones
1. **Scale Violence — Hero number:** A massive metric (revenue, users, speed) at 15-20vw dominating the hero, with the product UI secondary.
2. **Material Collision — Analog texture:** One section with subtle paper/grain texture breaking the otherwise clean digital surface.
3. **Interaction Shock — Data reveal:** Hovering over a card reveals real-time data, charts, or metrics that weren't visible before.

### References
[Linear](https://linear.app), [Huly](https://huly.io), [Raycast](https://raycast.com), [Vercel](https://vercel.com)

---

## 6. Organic

> Flowing, natural, alive. Curves replace sharp edges. Nature inspires the palette.

**Personality:** Warm, approachable, natural, grounded
**Best for:** Food/beverage brands, sustainability, health, outdoor, eco-friendly products

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#f7f4ee` | Natural off-white |
| bg-secondary | `#ebe5d8` | Warm sand |
| text-primary | `#2d2a24` | Dark earth |
| text-secondary | `#7a7468` | Stone gray |
| accent-1 | `#4a7c59` | Forest green |
| accent-2 | `#c67b4e` | Terracotta |
| accent-3 | `#d4a96a` | Warm gold |

### Required Fonts
- Display: **Cabinet Grotesk** or **General Sans** (warm geometric)
- Body: **DM Sans** or **Plus Jakarta Sans** (friendly)

### Mandatory Techniques
- SVG blob shapes as section backgrounds
- `border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%` on images
- Wavy or curved section dividers (SVG paths, not straight lines)
- Earthy color palette with warm undertones throughout
- Organic, asymmetric layouts (no rigid grids)

### Forbidden
- Sharp 90-degree corners
- Neon or electric colors
- Dark backgrounds (below #d0d0d0)
- Monospace fonts
- Grid-based dot patterns (too mechanical)
- Hard drop shadows

### Signature Element
Animated morphing SVG blob that slowly shifts shape (8-12s cycle) behind the hero section, using earthy accent colors.

### Aggressive Tension Zones
1. **Scale Violence — Giant botanical:** One oversized SVG botanical illustration that spans the full viewport height as a background.
2. **Dimensional Break — Geometric intrusion:** One sharp, geometric element in the otherwise curved, flowing layout. Like a crystal in soil.
3. **Temporal Disruption — Growth animation:** One element that appears to "grow" continuously — an SVG path that keeps extending.

### References
[Oatly](https://oatly.com), [Allbirds](https://allbirds.com), [Patagonia](https://patagonia.com)

---

## 7. Retro-Future

> Cyberpunk meets vintage computing. CRT glow, terminal green, scan lines.

**Personality:** Nostalgic, techy, underground, hacker-culture
**Best for:** Dev tools, hacker news alternatives, crypto, retro gaming, terminal apps

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#0a0a0a` | True black |
| bg-secondary | `#0f1a0f` | Dark green tint |
| text-primary | `#33ff33` | Terminal green |
| text-secondary | `#1a991a` | Dimmed green |
| accent-1 | `#33ff33` | Bright green |
| accent-2 | `#ff6600` | Amber/orange |
| glow | `rgba(51,255,51,0.3)` | Green glow |

### Required Fonts
- Display: **Space Mono** or **JetBrains Mono** (monospace ONLY)
- Body: **IBM Plex Mono** or **Fira Code**

### Mandatory Techniques
- ALL text in monospace
- CRT scan-line overlay (`repeating-linear-gradient` with 2px transparent/1px rgba lines)
- Text glow using `text-shadow` with green/amber
- Terminal-style blinking cursor (`_` or `|` blinking after headings)
- ASCII art or box-drawing characters for dividers
- Typing animation on hero text

### Forbidden
- Sans-serif or serif fonts (monospace only)
- Rounded corners > 2px
- Images (use ASCII representations or low-res pixelated images)
- Soft/subtle anything — everything should glow or pulse
- Gradient backgrounds (solid dark only)
- White text (only green/amber/orange terminal colors)

### Signature Element
A CRT scan-line overlay across the entire page with a subtle flicker animation, combined with a persistent blinking cursor after the hero headline.

### Aggressive Tension Zones
1. **Scale Violence — Massive ASCII:** ASCII art that spans the full width at a scale that turns characters into abstract patterns.
2. **Interaction Shock — Terminal command:** An interactive terminal that accepts real commands (easter egg) like `help`, `about`, `hire me`.
3. **Material Collision — High-res photo:** One high-resolution, modern photograph amidst the low-res, pixelated aesthetic.

### References
[Cool Retro Term](https://github.com/Swordfish90/cool-retro-term), Fallout Pip-Boy UI, old-school terminal UIs

---

## 8. Luxury / Fashion

> High-fashion editorial meets digital. Dramatic imagery, restrained typography, maximum negative space.

**Personality:** Exclusive, aspirational, refined, minimal-maximal
**Best for:** Fashion brands, luxury products, high-end real estate, premium services

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#f8f6f3` | Warm ivory |
| bg-secondary | `#1a1a1a` | Rich black (for alternating sections) |
| text-primary | `#1a1a1a` | On light bg |
| text-primary-dark | `#f8f6f3` | On dark bg |
| text-secondary | `#999088` | Warm muted |
| accent-1 | `#c9a96e` | Muted gold |
| border | `#d4cfc7` | Subtle warm |

### Required Fonts
- Display: **Cormorant Garamond** or **Playfair Display** (high-fashion serif)
- Body: **Montserrat** or **Raleway** (thin, elegant sans)

### Mandatory Techniques
- Full-bleed hero imagery (edge to edge, no container)
- Font-weight 200-300 for body text (thin, delicate)
- Alternating light/dark section backgrounds
- Oversized typography (text-8xl+ for hero)
- Maximum negative space (py-40+)
- Image hover: subtle zoom (scale 1.02-1.05 over 600ms)

### Forbidden
- Bright/saturated accent colors
- Rounded buttons or cards (use rectangular or subtle radius)
- Emoji or playful icons
- Dense content layout (everything needs breathing room)
- Bouncy or playful animations
- More than 2 colors as accents

### Signature Element
Full-bleed images that split or reveal on scroll, with text overlaid in thin serif type. The transition between light and dark sections creates a rhythm like turning magazine pages.

### Aggressive Tension Zones
1. **Scale Violence — Single word hero:** One word (the brand or concept) at 25vw+, ultra-thin weight (100-200), massive tracking.
2. **Temporal Disruption — Slow reveal:** Content that takes 3-5 seconds to fully appear — painfully slow, exquisitely elegant.
3. **Material Collision — Raw element:** One deliberately unpolished element (hand-drawn line, raw texture) in the refined layout.

### References
[Chanel](https://chanel.com), [Bottega Veneta](https://bottegaveneta.com), [Celine](https://celine.com)

---

## 9. Playful / Startup

> Bold, energetic, approachable. Rounded shapes, vibrant colors, personality in every element.

**Personality:** Friendly, energetic, approachable, fun
**Best for:** Consumer apps, startups, education, social platforms, kids/family products

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#fffbf5` | Warm white |
| bg-secondary | `#fff0e0` | Peachy light |
| text-primary | `#1e1b4b` | Deep indigo-black |
| accent-1 | `#ff5722` | Vibrant orange |
| accent-2 | `#7c3aed` | Vivid purple |
| accent-3 | `#06b6d4` | Bright cyan |
| accent-4 | `#facc15` | Sunshine yellow |

### Required Fonts
- Display: **Cabinet Grotesk** or **Satoshi** (bold, rounded)
- Body: **Plus Jakarta Sans** or **Nunito** (soft, friendly)

### Mandatory Techniques
- Rounded everything (rounded-2xl minimum, rounded-full for buttons)
- Illustrated icons or hand-drawn style elements
- Multiple accent colors used together (3-4 colors)
- Bouncy hover animations (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- Tilted or rotated elements for dynamism (`rotate-[-3deg]`)
- Emoji or custom illustrations as visual accents

### Forbidden
- Dark backgrounds (keep it light and cheerful)
- Monospace fonts
- Serious/corporate tone in any element
- Thin font weights below 400
- Muted or desaturated colors
- Rigid grid layouts (use playful, offset arrangements)

### Signature Element
Interactive elements that "bounce" or "wiggle" on hover with a springy easing curve, combined with tilted cards at slight angles (`rotate-[-2deg]` to `rotate-[3deg]`).

### Aggressive Tension Zones
1. **Interaction Shock — Physics play:** Elements that respond to click/drag with real physics — bounce, collide, spin. A moment of pure play.
2. **Scale Violence — Giant emoji/illustration:** One oversized illustration (50%+ viewport) as the hero instead of text.
3. **Dimensional Break — Flat in 3D world:** One deliberately flat, sticker-like element in an otherwise dimensional layout.

### References
[Notion](https://notion.so), [Figma](https://figma.com), [Duolingo](https://duolingo.com)

---

## 10. Data-Dense / Dashboard

> Maximum information density. Every pixel serves a purpose. Bloomberg Terminal for the web.

**Personality:** Efficient, information-rich, professional, power-user
**Best for:** Analytics dashboards, trading platforms, monitoring tools, admin panels

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#0b0e11` | Deep dark |
| bg-secondary | `#131720` | Panel surface |
| bg-tertiary | `#1a1f2e` | Elevated panel |
| text-primary | `#e2e8f0` | Slate-200 |
| text-secondary | `#64748b` | Slate-500 |
| accent-1 | `#3b82f6` | Info blue |
| accent-2 | `#22c55e` | Positive green |
| accent-3 | `#ef4444` | Negative red |
| accent-4 | `#f59e0b` | Warning amber |
| border | `rgba(255,255,255,0.08)` | Panel dividers |

### Required Fonts
- ALL: **JetBrains Mono** or **IBM Plex Mono** (monospace throughout)
- Alternative body: **Inter Tight** at 13-14px (dense, not 16px)

### Mandatory Techniques
- Compact spacing (py-2, px-3 — not generous whitespace)
- Tabular numbers everywhere (`font-variant-numeric: tabular-nums`)
- Dense grid layouts (multi-column, multi-row)
- Status indicators with colored dots (green/red/amber)
- Real-time feel: subtle pulse on live data, timestamps
- Resizable panels or split-pane layouts

### Forbidden
- Large whitespace (py-16+)
- Decorative elements (blobs, illustrations, orbs)
- Font sizes above text-2xl anywhere
- Rounded corners > rounded-lg
- Playful animations
- Hero sections (start with data immediately)

### Signature Element
A persistent status bar at the top or bottom showing real-time metrics (uptime, response time, active users) with live-updating numbers and subtle color-coded indicators.

### Aggressive Tension Zones
1. **Scale Violence — Mega metric:** One number displayed at 200px+ font size — the single most important KPI, impossible to miss.
2. **Interaction Shock — Drill-down explosion:** Clicking a data point expands it into a full panel with detailed breakdown.
3. **Material Collision — Warm accent:** One warmly-colored, soft element (illustration, photo) in the otherwise cold data interface.

### References
[Bloomberg Terminal](https://bloomberg.com), [Grafana](https://grafana.com), [Datadog](https://datadoghq.com)

---

## 11. Japanese Minimal

> Ma (negative space) as a design principle. Restraint is the ultimate sophistication.

**Personality:** Serene, refined, contemplative, precise
**Best for:** Tea/ceramics brands, architecture, zen products, premium Japanese brands

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#f5f2ed` | Warm rice paper |
| bg-secondary | `#ebe7e0` | Slightly darker |
| text-primary | `#2c2c2c` | Sumi ink |
| text-secondary | `#8c8680` | Faded ink |
| accent-1 | `#c23b22` | Vermillion red (torii gate) |
| border | `#d4cfc6` | Subtle, like pencil |

### Required Fonts
- Display: **Noto Serif JP** or **Cormorant** (refined serif)
- Body: **Noto Sans JP** or **Outfit** (clean, light)

### Mandatory Techniques
- Extreme whitespace (py-40+ between sections, sometimes py-64)
- Very few elements per viewport (1-2 max)
- Asymmetric balance (not centered, not grid — intentional off-center)
- Single accent color used extremely sparingly (once or twice per page)
- Thin 1px lines as dividers
- Small, understated typography (no text-7xl+ heroes)

### Forbidden
- Multiple accent colors
- Dense layouts or grids with 3+ columns
- Bold/heavy font weights (max 500)
- Glow effects, shadows, or glass morphism
- Animations faster than 600ms
- Busy backgrounds (patterns, grids, dots)

### Signature Element
A single thin horizontal line that spans the full viewport width, used as a section divider, with content positioned in deliberate asymmetric relationship to it.

### Aggressive Tension Zones
1. **Scale Violence — Enormous negative space:** A section with 80%+ whitespace — content occupies only a tiny corner. Space IS the design.
2. **Material Collision — Red burst:** One bold vermillion stroke or shape that breaks the restraint — like a calligraphy brushstroke.
3. **Temporal Disruption — Stillness:** One element that is AGGRESSIVELY static while subtle motion exists elsewhere. Not frozen — intentionally still.

### References
[Muji](https://muji.com), [Aman Hotels](https://aman.com), Japanese ceramics websites

---

## 12. Glassmorphism

> Layered translucent surfaces with depth. The UI feels like glass panels floating in space.

**Personality:** Modern, sleek, depth-aware, premium
**Best for:** OS/app interfaces, fintech, modern SaaS, design tools

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#0f0f1a` | Deep dark blue |
| bg-secondary | `rgba(255,255,255,0.05)` | Glass surface |
| bg-tertiary | `rgba(255,255,255,0.08)` | Active glass |
| text-primary | `#f0f0f5` | Bright |
| text-secondary | `#8888aa` | Muted blue-gray |
| accent-1 | `#6366f1` | Indigo (allowed here) |
| accent-2 | `#ec4899` | Pink |
| border | `rgba(255,255,255,0.1)` | Glass edge |
| glow | `rgba(99,102,241,0.15)` | Ambient glow |

### Required Fonts
- Display: **Satoshi** or **General Sans**
- Body: **DM Sans** or **Geist**

### Mandatory Techniques
- `backdrop-blur-xl` on ALL card/panel surfaces
- `bg-white/5` to `bg-white/10` surface colors (never solid backgrounds on cards)
- Layered surfaces (3+ depth levels visible simultaneously)
- Gradient border using wrapper div technique
- Background gradient orbs (2-3) behind the glass panels
- Shadows that suggest floating (`shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]`)

### Forbidden
- Solid opaque card backgrounds (must be translucent)
- Flat design without depth
- Light/white backgrounds
- Heavy borders (only subtle glass edges)
- More than 3 background orbs (gets muddy)

### Signature Element
Overlapping glass panels at different depths with visible gradient orbs behind them, creating an illusion of real depth — like looking through stacked panes of glass.

### Aggressive Tension Zones
1. **Dimensional Break — Solid intrusion:** One completely opaque, solid-colored element amidst the translucent glass panels.
2. **Scale Violence — Giant glass pane:** One glass panel that spans the ENTIRE viewport — content floats within it.
3. **Interaction Shock — Refraction shift:** Hovering over glass panels shifts the refraction/blur of elements behind them.

### References
Apple macOS/iOS UI, [Figma](https://figma.com) dark mode, Windows 11 Mica/Acrylic

---

## 13. Neon Noir

> Cyberpunk city at night. Electric neon on deep black. High contrast, high energy.

**Personality:** Bold, electric, nocturnal, rebellious
**Best for:** Gaming, nightlife, music, crypto, cyberpunk aesthetics

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#05050a` | Abyss black |
| bg-secondary | `#0a0a15` | Slightly lighter |
| text-primary | `#f0f0f5` | Bright white |
| accent-1 | `#00ff88` | Neon green |
| accent-2 | `#ff00ff` | Neon magenta |
| accent-3 | `#00ccff` | Neon cyan |
| glow-1 | `rgba(0,255,136,0.4)` | Green glow |
| glow-2 | `rgba(255,0,255,0.3)` | Magenta glow |

### Required Fonts
- Display: **Orbitron** or **Rajdhani** (futuristic/techy)
- Body: **Space Grotesk** or **Exo 2**

### Mandatory Techniques
- Triple-layer neon glow on text and buttons (near + mid + far shadow)
- Animated gradient borders (conic-gradient spinning)
- Dark background with NO gray — only black and neon
- CRT/scanline texture overlay at low opacity
- At least one animated neon sign element
- Color contrast ratio of at least 10:1 (neon on black)

### Forbidden
- Muted or pastel colors
- Light backgrounds
- Serif fonts
- Subtle/gentle animations (everything should pop)
- Rounded-full on containers (angular feels more cyberpunk)
- White as an accent color (only neon colors)

### Signature Element
A neon "sign" element — text with triple-layer glow that appears to flicker subtly (random opacity 0.9-1.0 at irregular intervals), mimicking a real neon tube sign.

### Aggressive Tension Zones
1. **Scale Violence — Neon word wall:** One word in neon at viewport scale, with the triple glow creating a light source that illuminates surrounding elements.
2. **Interaction Shock — Blackout hover:** Hovering over an element causes everything ELSE to go dark, creating a spotlight effect.
3. **Temporal Disruption — Dying neon:** One neon element with irregular, realistic flickering — like a neon sign about to burn out.

### References
Cyberpunk 2077 UI, [VOID](https://voidinterface.com), synthwave aesthetics

---

## 14. Warm Artisan

> Handcrafted feel. Texture-rich, tactile, like holding a well-made physical object.

**Personality:** Authentic, tactile, human, craft-focused
**Best for:** Coffee shops, bakeries, handmade goods, artisan products, craft beer

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#f4efe4` | Parchment |
| bg-secondary | `#e8dfd0` | Warm kraft paper |
| bg-dark | `#2c2418` | Dark wood |
| text-primary | `#2c2418` | Dark brown |
| text-secondary | `#7a6e5e` | Medium brown |
| accent-1 | `#b85c38` | Burnt sienna |
| accent-2 | `#5c7a3b` | Olive green |

### Required Fonts
- Display: **Fraunces** or **Lora** (warm, slightly quirky serif)
- Body: **Source Sans 3** or **Nunito** (friendly, readable)

### Mandatory Techniques
- Paper/grain noise texture overlay (opacity 0.03-0.05)
- Warm color temperature throughout (no cool blues/grays)
- Hand-drawn style dividers or decorative elements
- Rounded but not perfectly circular shapes (organic border-radius)
- Full-bleed photography with warm color grading
- Stamp/badge-style labels and tags

### Forbidden
- Cool-toned colors (blue, cyan, purple)
- Glass morphism or glossy effects
- Monospace fonts
- Neon or glow effects
- Sharp/precise geometric patterns
- Pure white or pure black backgrounds

### Signature Element
A paper/parchment noise texture across the entire page that makes the screen feel like a physical surface, combined with stamp-style badges on featured elements.

### Aggressive Tension Zones
1. **Material Collision — Digital precision:** One sharp, pixel-perfect geometric element in the otherwise handcrafted layout.
2. **Scale Violence — Giant stamp:** An oversized stamp/badge element (40%+ of viewport) as a section background.
3. **Interaction Shock — Texture reveal:** Hovering over elements reveals the underlying paper/grain texture more prominently.

### References
Craft brewery websites, Etsy artisan shops, vintage cookbook layouts

---

## 15. Swiss / International

> Grid is god. Helvetica-adjacent precision. Mathematical beauty.

**Personality:** Rational, structured, timeless, precise
**Best for:** Architecture firms, design studios, museums, corporate identities

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#ffffff` | Pure white |
| bg-secondary | `#f5f5f5` | Light gray |
| text-primary | `#111111` | Near-black |
| text-secondary | `#666666` | Medium gray |
| accent-1 | `#ff0000` | Swiss red (sparingly) |
| border | `#cccccc` | Precise gray |

### Required Fonts
- Display: **Helvetica Neue** or **Switzer** (neo-grotesque)
- Body: **Helvetica Neue** or **Switzer** (same family, different weights)

### Mandatory Techniques
- Strict grid system (12-column, visible in layout structure)
- One accent color only (red) used extremely sparingly
- Strong typographic hierarchy through size and weight alone (no color)
- Asymmetric Swiss-style layouts (text left, image right — intentional offsets)
- Horizontal and vertical rules as structural elements
- Flush-left alignment (no centered text except rare exceptions)

### Forbidden
- More than 1 accent color
- Centered layouts (flush-left is fundamental)
- Rounded corners (everything is rectangular)
- Decorative elements not serving information hierarchy
- Custom illustrations (use photography or typography only)
- Animations beyond subtle fades

### Signature Element
A strict visible grid overlay (at very low opacity) that aligns all elements mathematically, demonstrating the underlying structure.

### Aggressive Tension Zones
1. **Scale Violence — Grid demonstration:** Content arranged so dramatically that the underlying grid structure itself becomes visual art.
2. **Material Collision — Organic photo:** One lush, organic photograph in the otherwise mathematical precision.
3. **Dimensional Break — Type depth:** One headline with subtle 3D/shadow that lifts it off the flat grid.

### References
[ECAL](https://ecal.ch), Swiss poster design, [Muller-Brockmann](https://en.wikipedia.org/wiki/Josef_M%C3%BCller-Brockmann) grids

---

## 16. Vaporwave

> Retro digital nostalgia. Pastel gradients, marble busts, 90s web aesthetic reimagined.

**Personality:** Nostalgic, dreamy, ironic, aesthetic
**Best for:** Music/art projects, merch stores, portfolio showcases, aesthetic brands

### Locked Palette
| Token | Value | Note |
|-------|-------|------|
| bg-primary | `#1a0a2e` | Deep purple |
| bg-secondary | `#2d1b4e` | Medium purple |
| text-primary | `#e0d0ff` | Light lavender |
| accent-1 | `#ff71ce` | Hot pink |
| accent-2 | `#01cdfe` | Cyan |
| accent-3 | `#05ffa1` | Mint green |
| accent-4 | `#b967ff` | Bright purple |

### Required Fonts
- Display: **Orbitron** or **Audiowide** (retro futuristic)
- Body: **VT323** or **Press Start 2P** (pixel/retro) for accents, **DM Sans** for readable body

### Mandatory Techniques
- Horizontal gradient backgrounds (pink → cyan → purple)
- Grid perspective floor (CSS perspective grid fading to horizon)
- Glitch effects on text or images (CSS transform with color offset)
- Pastel neon glow on text and borders
- Window/frame UI elements (like old OS windows)
- Sunset gradient as background or header element

### Forbidden
- Corporate/professional aesthetic
- Muted/earthy colors
- Serif fonts for body text
- Minimalist layouts (more is more in vaporwave)
- Subtle anything — go bold or go home

### Signature Element
A retro grid floor (perspective-vanishing-point lines in neon) stretching to a sunset horizon gradient, visible as the page background.

### Aggressive Tension Zones
1. **Scale Violence — Massive glitch:** A full-viewport glitch effect that distorts everything for 2-3 seconds on page load.
2. **Interaction Shock — Window manipulation:** OS-style windows that the user can actually drag, resize, and minimize.
3. **Temporal Disruption — Loading nostalgia:** A fake loading bar (like 90s web) that plays before content reveals.

### References
Vaporwave aesthetic, old Geocities, [Windows 95 UI](https://poolsuite.net)

---

## Custom Archetype Builder

When the user wants a completely custom archetype or none of the above fit:

### Template

```markdown
## Custom Archetype: [Name]

> [One-sentence personality statement]

**Personality:** [4 adjectives]
**Inspired by:** [2-3 reference sites or aesthetics]

### Palette (minimum 8 tokens)
| Token | Value | Note |
|-------|-------|------|
| bg-primary | # | |
| bg-secondary | # | |
| text-primary | # | |
| text-secondary | # | |
| accent-1 | # | |
| accent-2 | # | |
| border | | |
| glow | | |

### Fonts
- Display: [Font name] — [why]
- Body: [Font name] — [why]

### 5 Mandatory Techniques
1. [Must use this]
2. [Must use this]
3. [Must use this]
4. [Must use this]
5. [Must use this]

### 5 Forbidden Patterns
1. [Cannot use this]
2. [Cannot use this]
3. [Cannot use this]
4. [Cannot use this]
5. [Cannot use this]

### Signature Element
[Describe the one unique visual element]

### Mood Board Keywords
[5-8 keywords that capture the feeling]
```

### Custom Archetype Process

1. Ask the user for 2-3 reference sites they admire
2. Ask for 4 personality adjectives
3. Ask for 1 thing they absolutely DON'T want (forbidden style)
4. Generate the custom archetype using the template above
5. Get user approval before generating Design DNA from it

## Archetype Selection Guide

| Project Type | Primary Recommendation | Secondary |
|-------------|----------------------|-----------|
| SaaS / Dev Tool | Neo-Corporate | Kinetic |
| E-commerce (fashion) | Luxury/Fashion | Swiss |
| E-commerce (general) | Playful/Startup | Organic |
| Blog / Publication | Editorial | Japanese Minimal |
| Creative Portfolio | Kinetic | Brutalist |
| Agency / Studio | Brutalist | Swiss |
| Food / Beverage | Warm Artisan | Organic |
| Health / Wellness | Ethereal | Japanese Minimal |
| Gaming / Music | Neon Noir | Vaporwave |
| Fintech / Dashboard | Data-Dense | Neo-Corporate |
| Architecture / Design | Swiss | Japanese Minimal |
| Sustainability / Eco | Organic | Warm Artisan |
| Startup / Consumer | Playful/Startup | Glassmorphism |
| Premium Services | Luxury/Fashion | Ethereal |
