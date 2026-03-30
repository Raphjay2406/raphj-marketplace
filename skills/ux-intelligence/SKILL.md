---
name: "ux-intelligence"
description: "12 enforceable design intelligence domains covering proportion, color science, typography, micro-interactions, depth, conversion psychology, responsive craft, accessibility, content design, motion narrative, visual consistency, and cultural intelligence"
tier: "core"
triggers: "design review, quality check, UI audit, component review, ux review"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### Purpose

UX Intelligence provides **machine-enforceable design rules** across 12 domains. Each domain contains principle tables and constraint tables that agents can validate programmatically. This skill replaces scattered UX guidance with a single, authoritative source of truth.

The quality-reviewer agent uses these 12 domains to produce the **72-point UX Intelligence scoring** during `/gen:audit`. Each domain contributes 6 points to the total, scored on principle adherence and constraint compliance.

### Priority Order

When domains conflict or resources are limited, enforce in this order:

1. **Accessibility** (D8) -- legal requirement, non-negotiable
2. **Responsive Craft** (D7) -- majority of traffic is mobile
3. **Content Design Quality** (D9) -- users read before they admire
4. **All other domains** -- enforced equally after the top 3

### When to Use

- **Design review** -- score all 12 domains against built sections
- **Component review** -- validate relevant domains per component type
- **Quality check** -- run full 72-point audit after wave completion
- **UI audit** -- targeted domain review for specific concerns
- **Planning stage** -- reference constraint tables when writing section plans

### When NOT to Use

- During initial brainstorming -- use design-brainstorm skill instead
- For archetype selection -- use design-archetypes skill instead
- For motion specifics beyond UX rules -- use cinematic-motion skill instead
- For performance metrics -- use performance-guardian skill instead

### Scoring Protocol

The quality-reviewer scores each domain on a 0-6 scale:

| Score | Meaning | Criteria |
|-------|---------|----------|
| 6 | Exemplary | All HARD constraints pass, all SOFT constraints pass, principles fully realized |
| 5 | Strong | All HARD constraints pass, most SOFT constraints pass, minor principle gaps |
| 4 | Adequate | All HARD constraints pass, some SOFT warnings, 1-2 principle gaps |
| 3 | Below bar | 1 HARD constraint violation OR 3+ SOFT warnings |
| 2 | Poor | 2-3 HARD constraint violations, multiple principle failures |
| 1 | Failing | 4+ HARD constraint violations, domain largely ignored |
| 0 | Absent | Domain not addressed at all |

**Scoring totals:** 72 points maximum (12 domains x 6 points). Thresholds:
- **60+** -- Premium quality, ship with confidence
- **50-59** -- Solid quality, minor polish recommended
- **40-49** -- Acceptable, targeted improvements needed
- **<40** -- Below bar, significant rework required

### Pipeline Connection

- **Referenced by:** quality-reviewer during post-wave audit and end-of-build review
- **Referenced by:** creative-director during creative review passes
- **Referenced by:** builder during self-check (constraint tables only)
- **Consumed at:** `/gen:audit` workflow step 2 (UX Intelligence scoring)

### Domain Quick Reference

For rapid lookup, here is the complete domain index:

| ID | Domain | Core Question |
|----|--------|---------------|
| D1 | Visual Proportion & Mathematical Harmony | Does every spatial relationship trace to a system? |
| D2 | Color Science | Are colors perceptually grounded and systematically applied? |
| D3 | Typography as Design System | Does type hierarchy serve the information architecture? |
| D4 | Micro-Interaction Craft | Does every interactive element communicate its state? |
| D5 | Spatial Depth & Materiality | Does the depth system create meaningful visual hierarchy? |
| D6 | Conversion Psychology | Does design guide users through cognitive principles? |
| D7 | Responsive Craft | Is each viewport an intentional design, not a reflow? |
| D8 | Accessibility as Design | Is inclusive design a first-class design decision? |
| D9 | Content Design Quality | Is every string a deliberate design choice? |
| D10 | Motion Narrative | Does every animation tell a story? |
| D11 | Visual Consistency | Does consistency build subconscious trust? |
| D12 | Cultural & Contextual Intelligence | Does design respect its audience's context? |

---

## Layer 2: The 12 Domains

Each domain defines enforceable principles and measurable constraints. Principles describe the design intent. Constraints provide the numbers agents check against. Implementation guidance shows how to apply each domain in practice.

---

### Domain 1: Visual Proportion & Mathematical Harmony

**Purpose:** Every spatial relationship should trace to a mathematical system, not arbitrary values. When spacing feels "right" it is because it follows consistent mathematical relationships that the eye recognizes subconsciously.

#### Principles

| Principle | Enforcement |
|-----------|-------------|
| Modular type scale with consistent ratio | HARD -- all font sizes must derive from a single scale ratio (e.g., 1.25 Major Third) applied to a base size |
| Golden ratio spacing for key relationships | SOFT -- hero sections, card proportions, and whitespace blocks should approximate 1:1.618 |
| Optical alignment over geometric alignment | SOFT -- visual center (slightly above geometric center) for hero content placement; text baselines over bounding boxes |
| Consistent spatial rhythm from base unit | HARD -- all spacing values must be divisible by the base unit; no arbitrary pixel values |
| Viewport section heights from approved set | HARD -- section min-height must use values from the approved set to create predictable scroll rhythm |
| Maximum font size count per page | HARD -- no more than 6 distinct font sizes per page to maintain hierarchy clarity |
| Proportional negative space scaling | SOFT -- whitespace increases proportionally with element size; large headings need more surrounding space than body text |

#### Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Type scale ratio | 1.125 | 1.5 | ratio | HARD -- reject outside range |
| Base spacing unit | 4 | 8 | px | HARD -- reject outside range |
| Distinct font sizes per page | 3 | 6 | count | HARD -- flag if exceeded |
| Section min-height | 50 | 100 | vh | HARD -- must be one of {50, 66, 75, 80, 100} |
| Golden ratio tolerance | 1.5 | 1.72 | ratio | SOFT -- warn if key proportions deviate |
| Spacing scale levels | 5 | 8 | count | SOFT -- warn if outside range |
| Maximum spacing value | -- | 256 | px | SOFT -- warn if exceeded; likely over-spaced |

#### Implementation Guidance

The type scale ratio determines the entire vertical rhythm of the page. Choose the ratio during DNA generation and apply it consistently:

- **1.125 (Major Second):** Dense interfaces, data-heavy dashboards, compact layouts
- **1.200 (Minor Third):** General purpose, balanced hierarchy
- **1.250 (Major Third):** Most common for marketing and editorial; clear visual steps
- **1.333 (Perfect Fourth):** Strong contrast, bold hierarchy, fewer scale levels needed
- **1.500 (Perfect Fifth):** Dramatic, editorial-first, large display typography

Spacing derives from the base unit. If base = 4px, valid spacings are: 4, 8, 12, 16, 20, 24, 32, 48, 64, 96, 128, 192, 256. Every padding, margin, and gap in the project must resolve to one of these values. If base = 8px, valid spacings are: 8, 16, 24, 32, 48, 64, 96, 128, 192, 256. The base unit choice depends on density needs -- 4px for dense UI, 8px for spacious marketing.

Section heights create scroll rhythm. A page that alternates between 100vh hero, 80vh content, 66vh feature, 100vh testimonial creates a predictable breathing pattern. Arbitrary heights (47vh, 83vh) break the rhythm and make the scroll feel unpredictable.

Optical alignment: when centering a heading in a hero section, place it slightly above the true geometric center (approximately 45% from top instead of 50%). The human eye perceives the visual center as higher than the mathematical center. This is especially important for full-viewport hero sections where off-center placement is immediately noticeable.

Golden ratio applications:
- **Hero layout:** Text block occupies 61.8% width, image/visual occupies 38.2% (or vice versa)
- **Card proportions:** Width-to-height ratio approximates 1:1.618 for a naturally pleasing rectangle
- **Whitespace blocks:** Section padding above content is 61.8% of the total section padding; below is 38.2%
- **Grid columns:** In a 2-column layout, primary content column is 1.618x wider than secondary

---

### Domain 2: Color Science

**Purpose:** Color choices must be perceptually grounded, systematically applied, and accessible by default. Color is the first thing users perceive and the last thing they forget.

#### Principles

| Principle | Enforcement |
|-----------|-------------|
| Perceptual uniformity via OKLCH color space | HARD -- all color definitions validated in OKLCH; same lightness values must appear equally bright across hues |
| 60-30-10 distribution rule | SOFT -- dominant color (60% of surface area), secondary (30%), accent (10%) verified across full page scans |
| Contrast ladder with defined thresholds | HARD -- each usage tier (subtle, readable, strong, maximum) must meet its minimum contrast ratio |
| Color temperature consistency | SOFT -- warm DNA palettes use warm grays (slight yellow/orange undertone), cool palettes use cool grays (blue undertone) |
| Chromatic depth for backgrounds | SOFT -- flat single-color backgrounds flagged; prefer subtle gradients, grain, or tonal shifts for visual interest |
| Dark mode as independent design | HARD -- dark mode must be designed independently, not inverted light mode; separate color tokens required for each mode |
| Semantic color usage | HARD -- success=green family, error=red family, warning=amber family; deviations require documented archetype override |

#### Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Subtle contrast (decorative borders, dividers) | 3 | -- | :1 ratio | HARD -- reject below |
| Readable contrast (body text) | 4.5 | -- | :1 ratio | HARD -- WCAG AA requirement |
| Strong contrast (headings, CTAs) | 7 | -- | :1 ratio | HARD -- reject below |
| Maximum contrast (hero text on image) | 12 | -- | :1 ratio | SOFT -- recommended for overlays |
| Accent color usage | 5 | 15 | % of surface | SOFT -- warn outside range |
| Color palette total (including tints/shades) | 8 | 16 | colors | SOFT -- warn if exceeded |
| Dark mode token independence | 100 | 100 | % | HARD -- every light token needs a dark counterpart |

#### Implementation Guidance

The contrast ladder defines four tiers of color relationships. Every color pairing in the project must map to one of these tiers:

- **Subtle (3:1):** Decorative borders, dividers, disabled states, placeholder text on colored backgrounds
- **Readable (4.5:1):** Body text, form labels, secondary content -- the WCAG AA minimum for normal text
- **Strong (7:1):** Headings, CTAs, primary navigation, critical information -- WCAG AAA equivalent
- **Maximum (12:1+):** Hero text overlaid on images, text on video backgrounds, emergency/alert content

OKLCH validation: When two colors share the same L (lightness) value in OKLCH space, they must appear equally bright. If `oklch(0.7 0.15 150)` and `oklch(0.7 0.15 250)` do not look equally bright, the color system has a perceptual imbalance.

The 60-30-10 rule is measured by pixel area, not by number of elements. A hero background that occupies 60% of the viewport is the dominant color even if only one element uses it.

Dark mode independence: dark mode is NOT light mode with inverted colors. Common failures include:
- Shadows that work on light backgrounds become invisible on dark backgrounds -- dark mode needs lighter/colored shadows or glow effects
- White text on dark backgrounds should use slightly reduced opacity (90-95%) to avoid harsh contrast
- Surface elevation in dark mode uses progressively lighter backgrounds (not shadows) to indicate hierarchy
- Images may need adjusted brightness/contrast; consider `mix-blend-mode` or overlay adjustments
- Brand colors that work on white may not work on dark backgrounds -- dark mode tokens must be independently tested

Color temperature audit: extract the gray palette and check its undertone. Warm grays lean toward `oklch(L 0.01 80)` (warm yellow-orange hue). Cool grays lean toward `oklch(L 0.01 250)` (cool blue hue). If the DNA accent color is warm (red, orange, gold) but the grays are cool-toned, flag the temperature mismatch.

---

### Domain 3: Typography as Design System

**Purpose:** Typography is the primary carrier of visual hierarchy. Every typographic choice must serve the information architecture. When typography fails, the entire design fails regardless of other qualities.

#### Principles

| Principle | Enforcement |
|-----------|-------------|
| Hierarchy through multi-axis contrast | HARD -- headings must differ from body by 2+ axes: size, weight, color, case, or letter-spacing |
| Optimal measure (line length) | HARD -- body text measure must fall within the readable range for comfortable reading |
| Leading (line-height) per context | HARD -- body, heading, and display text each have distinct line-height ranges tuned for their function |
| Tracking (letter-spacing) per context | SOFT -- uppercase text needs extra tracking for legibility; large display text needs negative tracking for visual density |
| Orphan and widow prevention | SOFT -- last line of paragraphs must contain 2+ words; single-word last lines flagged as typographic errors |
| Font weight pairing contrast | HARD -- heading weight and body weight must differ by at least 200 units for clear visual distinction |
| Numeric typography distinction | SOFT -- tabular figures (monospaced digits) for data, tables, and prices; proportional figures for body text |

#### Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Body text measure | 45 | 75 | characters | HARD -- reject outside range |
| Body line-height | 1.5 | 1.7 | ratio | HARD -- reject outside range |
| Heading line-height | 1.0 | 1.2 | ratio | HARD -- reject outside range |
| Display line-height | 0.85 | 1.0 | ratio | HARD -- reject outside range |
| Uppercase letter-spacing | 0.05 | 0.1 | em | SOFT -- warn outside range |
| Large display letter-spacing | -0.04 | -0.02 | em | SOFT -- warn outside range |
| Heading/body weight contrast | 200 | -- | weight units | HARD -- minimum difference |
| Body font size minimum | 16 | -- | px | HARD -- reject below |
| Paragraph spacing | 0.5 | 1.5 | em | SOFT -- warn outside range |
| Maximum heading levels in use | 3 | 5 | count | SOFT -- fewer than 3 suggests flat hierarchy |

#### Implementation Guidance

The type scale generates all font sizes from a base size and ratio. With base 16px and ratio 1.25:

```
Step -1: 12.8px  (small/caption)
Step  0: 16px    (body)
Step  1: 20px    (h6/large body)
Step  2: 25px    (h5/subtitle)
Step  3: 31.25px (h4/section heading)
Step  4: 39.06px (h3/feature heading)
Step  5: 48.83px (h2/page heading)
Step  6: 61.04px (h1/display)
```

No font size in the project should exist outside this scale. If a designer needs "something between h3 and h4," the answer is to choose one of them, not to create an off-scale size.

Measure (line length) is measured in characters, not pixels. A 600px-wide column with 16px font at normal tracking holds approximately 60 characters -- within range. The same column with 12px font holds ~80 characters -- too wide for comfortable reading.

Weight pairing: if the body is 400 (Regular), headings must be 600+ (Semi-Bold or higher). If the body is 300 (Light), headings must be 500+ (Medium or higher). The 200-unit gap ensures instant visual distinction without relying on size alone.

Multi-axis contrast examples for heading levels:

| Level | Size Axis | Weight Axis | Additional Axes | Total Axes |
|-------|-----------|-------------|-----------------|------------|
| Display (hero) | 61px (scale step 6) | 800 Black | -0.03em tracking, uppercase | 4 axes |
| H1 (page title) | 49px (scale step 5) | 700 Bold | Color: primary | 3 axes |
| H2 (section title) | 39px (scale step 4) | 700 Bold | -- | 2 axes (minimum) |
| H3 (subsection) | 31px (scale step 3) | 600 Semi-Bold | -- | 2 axes (minimum) |
| H4 (group heading) | 25px (scale step 2) | 600 Semi-Bold | Uppercase, +0.05em tracking | 3 axes |
| Body | 16px (scale step 0) | 400 Regular | -- | baseline |

Paragraph typography best practices:
- **First paragraph after heading:** Can omit indent; subsequent paragraphs may use 1em indent OR 1em gap between paragraphs (not both)
- **Pull quotes:** Use display line-height (0.85-1.0) and larger scale step; attribute the source in body style below
- **Captions:** Use scale step -1 (smaller than body); slightly muted color from DNA text token at 70% opacity
- **Code blocks:** Mono font from DNA; body line-height (1.5-1.7); syntax highlighting uses DNA semantic colors
- **Lists:** Consistent indent (2x base spacing unit); bullet/number style matches archetype personality

---

### Domain 4: Micro-Interaction Craft

**Purpose:** Every interactive element must communicate its state clearly and respond with appropriate timing. Micro-interactions are the difference between "functional" and "premium."

#### Principles

| Principle | Enforcement |
|-----------|-------------|
| All 4 interaction states defined | HARD -- every interactive element must have hover, focus, active, and disabled states designed and implemented |
| Transition stagger choreography | SOFT -- lists and grids entering view should stagger children by 30-80ms for organic feel |
| Intentional easing curves | HARD -- `linear` and `ease` are forbidden for UI transitions; use intentional cubic-bezier or named curves |
| Duration proportional to element size | HARD -- small elements (buttons, toggles) use shorter durations; large elements (modals, panels) use longer durations |
| Cursor semantics | HARD -- `pointer` for clickable, `default` for static, `grab`/`grabbing` for draggable, `not-allowed` for disabled |
| Scroll-linked visual feedback | SOFT -- scroll position should drive at least one visual change (progress bar, parallax, nav state, reveal) |
| Loading states match content layout | HARD -- skeleton screens must match the actual content layout dimensions; shimmer follows reading direction (LTR/RTL) |

#### Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Small element transition duration | 150 | 200 | ms | HARD -- reject outside range |
| Medium element transition duration | 200 | 300 | ms | HARD -- reject outside range |
| Large element transition duration | 300 | 500 | ms | HARD -- reject outside range |
| Stagger delay between children | 30 | 80 | ms | SOFT -- warn outside range |
| Interaction states per interactive element | 4 | 4 | count | HARD -- hover + focus + active + disabled required |
| Hover scale transform | 1.01 | 1.05 | ratio | SOFT -- warn if scale exceeds natural feel range |
| Hover translate offset | 0 | 4 | px | SOFT -- subtle lift only; large offsets feel broken |
| Skeleton shimmer speed | 1 | 2 | seconds | SOFT -- too fast feels anxious, too slow feels frozen |

#### Implementation Guidance

The 4-state requirement means every `<button>`, `<a>`, and interactive element must define:

1. **Hover:** Visual change on mouse enter (color shift, subtle scale, shadow increase, underline)
2. **Focus:** Visible focus ring for keyboard navigation (DNA accent color, 2-4px ring, 2px offset)
3. **Active:** Momentary feedback on click/tap (slight scale-down, color darken, shadow reduce)
4. **Disabled:** Clear visual distinction (reduced opacity 40-60%, `not-allowed` cursor, no hover response)

Easing curve guidance:
- **Entering elements:** `ease-out` (cubic-bezier(0, 0, 0.2, 1)) -- fast start, gentle landing
- **Exiting elements:** `ease-in` (cubic-bezier(0.4, 0, 1, 1)) -- gentle start, fast exit
- **State changes:** `ease-in-out` (cubic-bezier(0.4, 0, 0.2, 1)) -- smooth both directions
- **Spring/bounce:** Custom cubic-bezier for playful archetypes only (Playful/Startup, Retro-Future)

Never use `transition: all`. Always specify the exact properties being transitioned (e.g., `transition: transform 200ms ease-out, box-shadow 200ms ease-out`).

Common cursor semantics violations:
- **Cards with onClick but `cursor: default`:** If the entire card is clickable, it must show `pointer`
- **Disabled buttons with `cursor: pointer`:** Disabled elements must show `not-allowed` to communicate non-interactivity
- **Draggable items with `cursor: pointer`:** Draggable elements use `grab` at rest and `grabbing` while dragging
- **Text selection areas with `cursor: pointer`:** Selectable text areas should use `text`, not `pointer`
- **Resize handles with `cursor: pointer`:** Resize handles must use directional resize cursors (`ew-resize`, `ns-resize`, `nwse-resize`)

Loading state design requirements:
- Skeleton screens must replicate the exact layout of the loaded content (same heights, widths, and positions)
- Shimmer animation moves in the reading direction: left-to-right for LTR, right-to-left for RTL
- Skeleton elements use the DNA surface color (not gray -- it should match the design system)
- Loading spinners are acceptable only for actions < 2 seconds; longer waits need skeleton or progress bar
- Optimistic UI: show the expected result immediately and reconcile with server response; never show loading for < 300ms operations

---

### Domain 5: Spatial Depth & Materiality

**Purpose:** Depth cues create visual hierarchy through simulated physicality. Every shadow, blur, and elevation must serve a coherent spatial system where higher means more important.

#### Principles

| Principle | Enforcement |
|-----------|-------------|
| Shadow depth system with defined levels | HARD -- define 3-5 shadow levels in DNA; each level maps to a specific elevation context |
| Consistent light source direction | HARD -- all shadows and highlights must originate from the same direction across the entire site (typically top-left) |
| Surface hierarchy ladder | HARD -- Background < Surface < Elevated < Overlay; higher surfaces use deeper shadows, lighter backgrounds |
| Blur as depth cue | SOFT -- `backdrop-filter: blur()` reserved for elevated and overlay surfaces only; no blur on base-level elements |
| Border discipline | HARD -- borders must be <= 1px for structural use; heavier borders only as intentional design accent per archetype |
| Texture and grain for depth | SOFT -- flat untextured backgrounds flagged except for Minimalist and Swiss/International archetypes |
| Z-index system from defined scale | HARD -- use a defined z-index scale (e.g., 10/20/30/40/50) not arbitrary values; z-index: 9999 is a violation |

#### Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Shadow depth levels | 3 | 5 | count | HARD -- must define this many levels in DNA |
| Structural border width | 0.5 | 1 | px | HARD -- reject above for non-accent borders |
| Accent border width | 2 | 4 | px | SOFT -- warn outside range for intentional borders |
| Backdrop blur radius | 8 | 24 | px | SOFT -- warn outside range |
| Z-index scale increment | 10 | -- | units | HARD -- must use consistent increments |
| Max z-index value | -- | 100 | units | HARD -- reject above; no z-index arms race |
| Surface background lightness delta | 2 | 5 | % L in OKLCH | SOFT -- surfaces should be slightly lighter/darker than background |

#### Implementation Guidance

The shadow depth system maps elevation to UI context:

| Level | Name | Context | Example Shadow |
|-------|------|---------|----------------|
| 1 | Subtle | Cards at rest, input fields | `0 1px 2px oklch(0 0 0 / 0.05)` |
| 2 | Low | Cards on hover, dropdowns closed | `0 2px 4px oklch(0 0 0 / 0.08)` |
| 3 | Medium | Dropdown menus, popovers | `0 4px 12px oklch(0 0 0 / 0.12)` |
| 4 | High | Modals, dialogs | `0 8px 24px oklch(0 0 0 / 0.16)` |
| 5 | Highest | Toasts, critical overlays | `0 16px 48px oklch(0 0 0 / 0.24)` |

Light source must be consistent. If shadows cast down-right, ALL shadows across ALL components cast down-right. A card shadow going down-right while a button shadow goes straight down breaks spatial coherence.

The surface hierarchy creates layering:
- **Background:** Page background, the base layer (z-index: 0)
- **Surface:** Cards, sections, content containers (z-index: 10)
- **Elevated:** Navigation, floating buttons, raised toolbars (z-index: 20-30)
- **Overlay:** Modals, drawers, dialogs, toasts (z-index: 40-50)

Depth in dark mode works differently:
- Light mode uses shadows (darker areas below elements) to show elevation
- Dark mode uses surface lightness (lighter backgrounds for higher elements) because shadows are invisible on dark backgrounds
- Each elevation level in dark mode increases the surface lightness by 2-5% in OKLCH L channel
- Glow effects (DNA glow token) can supplement or replace shadows in dark mode for certain archetypes (Neon Noir, Ethereal)

Material-aware depth per archetype:
- **Glassmorphism:** Depth through `backdrop-filter: blur()` and semi-transparent backgrounds; shadows are secondary
- **Neubrutalism:** Depth through thick offset borders (2-4px solid, offset by shadow position) rather than soft shadows
- **Brutalist:** Intentional flatness; depth is communicated through overlap and z-index, not shadows
- **Luxury/Fashion:** Very subtle, large-spread shadows with low opacity; depth is felt more than seen

---

### Domain 6: Conversion Psychology

**Purpose:** Design must guide users toward intended actions through cognitive principles, not manipulation. Ethical persuasion respects the user's autonomy while reducing friction.

#### Principles

| Principle | Enforcement |
|-----------|-------------|
| Visual hierarchy equals attention hierarchy | HARD -- CTA must have the highest contrast ratio and visual weight on any given viewport |
| Hick's Law compliance | HARD -- maximum 3 choices per decision point; more than 3 options requires progressive disclosure or categorization |
| Fitts's Law for target sizing | HARD -- CTAs must meet minimum touch/click target sizes; larger targets for primary actions |
| Social proof proximity to CTA | SOFT -- testimonials, ratings, or trust signals must appear within 1 scroll-length of the primary CTA |
| Genuine scarcity only | HARD -- fake countdown timers or artificial stock counts incur an automatic penalty; use real data or omit entirely |
| Progressive disclosure for complexity | SOFT -- forms or option sets with 5+ visible fields should use multi-step, accordion, or conditional patterns |
| Scan pattern alignment | SOFT -- key content and CTAs placed on F-pattern (content pages) or Z-pattern (landing pages) hot zones |

#### Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| CTA touch target (mobile) | 44 | -- | px | HARD -- reject below |
| CTA click target (desktop) | 48 | -- | px | HARD -- reject below |
| Choices per decision point | 1 | 3 | count | HARD -- flag if exceeded without progressive disclosure |
| Visible form fields before fold | 1 | 5 | count | SOFT -- warn if exceeded |
| Social proof distance from CTA | 0 | 1 | scroll-lengths | SOFT -- warn if exceeded |
| CTA contrast vs. surrounding elements | 3 | -- | :1 ratio | HARD -- CTA must be visually dominant |
| Primary CTA per viewport | 1 | 2 | count | SOFT -- more than 2 primary CTAs creates decision paralysis |
| Fake scarcity elements | 0 | 0 | count | HARD -- automatic penalty per instance |

#### Implementation Guidance

Hick's Law in practice: a pricing page with 3 tiers (Starter, Pro, Enterprise) is optimal. A pricing page with 6 tiers overwhelms users and reduces conversion. If more options exist, use a "Compare Plans" expandable section.

Fitts's Law: the most important action should have the largest clickable area. A "Get Started" button should be wider than a "Learn More" link. Padding inside buttons counts toward the target size -- a 14px text button with 16px vertical padding and 32px horizontal padding creates a comfortable 46px x 78px target.

F-pattern for content pages: users scan the top horizontal bar first, then a second shorter horizontal line, then vertically down the left side. Place logo/nav at top, key heading in the first horizontal scan, CTAs along the left-side vertical scan.

Z-pattern for landing pages: users scan top-left to top-right, then diagonally to bottom-left, then bottom-left to bottom-right. Place logo top-left, CTA top-right, supporting content bottom-left, secondary CTA bottom-right.

Progressive disclosure implementation:
- **Multi-step forms:** Break 8+ field forms into 2-3 steps with a progress indicator showing completion percentage
- **Accordion patterns:** Group related options under expandable headers; show the most common option expanded by default
- **Conditional fields:** Only reveal fields when previous answers make them relevant (e.g., "Other" text input only appears when "Other" is selected)
- **Tooltip details:** Keep the primary UI clean; provide details on hover/tap for users who want more information

Social proof placement strategy:
- **Above the fold:** Logo bar of recognizable clients/partners (builds immediate credibility)
- **After feature sections:** Testimonial that validates the feature just described (proof follows claim)
- **Near pricing:** Customer count, satisfaction percentage, or case study link (reduces purchase anxiety)
- **Before final CTA:** Strongest testimonial or aggregate rating (final reassurance before conversion)

---

### Domain 7: Responsive Craft

**Purpose:** Responsive design means redesigned for each context, not reflowed from desktop. Each viewport is an intentional design that prioritizes content for that device's usage context.

#### Principles

| Principle | Enforcement |
|-----------|-------------|
| Container queries over media queries | SOFT -- prefer container-based responsive logic for components; media queries for page-level layout only |
| Touch target sizing per device | HARD -- mobile and desktop have different minimum target sizes reflecting input method |
| Thumb zone awareness | SOFT -- primary actions positioned in the bottom 40% of mobile viewport for single-hand reach |
| Content reflow as redesign | HARD -- mobile layout must be intentionally redesigned, not simply stacked from desktop columns |
| Font size floor | HARD -- body text never drops below the minimum readable size on any viewport |
| Tap target spacing | HARD -- adjacent interactive elements must have sufficient gap to prevent mis-taps |
| Breakpoint intentionality | SOFT -- breakpoints chosen by content needs, not arbitrary device widths; 3-4 breakpoints maximum |

#### Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Mobile touch target | 44 | -- | px | HARD -- reject below |
| Desktop click target | 32 | -- | px | HARD -- reject below |
| Tap target gap | 8 | -- | px | HARD -- reject below |
| Body font size floor | 16 | -- | px | HARD -- reject below on any viewport |
| Thumb zone primary actions | 60 | 100 | % from bottom | SOFT -- primary actions in bottom 40% |
| Max breakpoints | 1 | 4 | count | SOFT -- warn if exceeded |
| Container query preference | -- | -- | -- | SOFT -- flag media queries inside reusable components |
| Mobile content reduction | 10 | 40 | % | SOFT -- mobile should show less, not everything shrunk |

#### Implementation Guidance

Content reflow means making intentional decisions for mobile:

- **Desktop 3-column grid becomes:** Priority-ordered single column on mobile, not three narrow columns
- **Desktop sidebar navigation becomes:** Bottom tab bar or hamburger menu, not a tiny squeezed sidebar
- **Desktop data table becomes:** Card-based view or horizontal scroll with pinned first column, not a tiny illegible table
- **Desktop hero with side-by-side text+image becomes:** Stacked with image reduced or cropped, headline shortened

Thumb zone map for mobile (portrait):
- **Easy reach (bottom 33%):** Primary CTAs, main navigation, most-used actions
- **Medium reach (middle 33%):** Content, secondary actions, scrollable areas
- **Hard reach (top 33%):** Status bar, back button, settings -- actions that are used less frequently

Breakpoint strategy: define breakpoints where the content breaks, not where popular devices happen to be. Test by slowly resizing and noting where layouts become awkward -- those are your breakpoints.

Recommended breakpoint ranges (content-driven, not device-driven):
- **sm (~640px):** Most phone viewports; single-column layouts
- **md (~768px):** Large phones landscape, small tablets; 2-column layouts become viable
- **lg (~1024px):** Tablets landscape, small laptops; sidebar navigation appears
- **xl (~1280px):** Standard desktop; full layout with all design features

Content reduction strategy for mobile:
- **Remove:** Decorative images that do not convey information, secondary navigation items, verbose descriptions
- **Collapse:** FAQ sections into accordions, feature grids into swipeable carousels, data tables into card views
- **Reorder:** CTA before feature details (mobile users decide faster), contact info above lengthy about sections
- **Simplify:** Complex hover interactions become tap interactions, multi-column text becomes single column

---

### Domain 8: Accessibility as Design

**Purpose:** Accessibility is a design decision, not an afterthought. Inclusive design creates better experiences for everyone -- captions help in noisy environments, high contrast helps in bright sunlight, keyboard navigation helps power users.

#### Principles

| Principle | Enforcement |
|-----------|-------------|
| Focus indicators designed to match DNA | HARD -- custom focus rings using DNA accent color; browser default focus indicators flagged for replacement |
| Reduced motion as alternative design | HARD -- `prefers-reduced-motion` must provide designed alternatives, not just `animation: none` or `display: none` |
| Color never as sole indicator | HARD -- every color-coded status must also use icon + text; color-only indicators flagged as inaccessible |
| Semantic heading hierarchy | HARD -- heading levels must not skip (h1 -> h3 without h2 is a violation); one h1 per page |
| Native HTML over ARIA | HARD -- `<div role="button">` flagged; use `<button>` instead; ARIA is a last resort for custom widgets only |
| Screen reader narrative coherence | HARD -- content must make sense without CSS; DOM order must match visual reading order; out-of-order DOM flagged |
| Keyboard navigation completeness | HARD -- every interactive element must be reachable and operable via keyboard alone; focus trapping in modals |

#### Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Focus ring width | 2 | 4 | px | HARD -- visible focus required |
| Focus ring offset | 2 | -- | px | HARD -- must not overlap element content |
| Color contrast (AA body text) | 4.5 | -- | :1 ratio | HARD -- WCAG AA requirement |
| Color contrast (AA large text) | 3 | -- | :1 ratio | HARD -- WCAG AA requirement |
| Color contrast (AAA target) | 7 | -- | :1 ratio | SOFT -- recommended for premium quality |
| Heading skip tolerance | 0 | 0 | levels | HARD -- no skipping allowed |
| Interactive elements without focus style | 0 | 0 | count | HARD -- every interactive must have visible focus |
| Color-only indicators | 0 | 0 | count | HARD -- must pair with icon/text |
| h1 elements per page | 1 | 1 | count | HARD -- exactly one h1 per page |

#### Implementation Guidance

Focus indicators should feel intentional, not like an accessibility afterthought:

```css
/* DNA-integrated focus ring */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

Reduced motion alternatives: instead of removing all animation, provide meaningful alternatives:
- **Fade-in replaces slide-in:** Content still appears progressively but without movement
- **Opacity change replaces parallax:** Depth is communicated through transparency instead of position
- **Instant state change replaces animated transition:** The feedback is immediate rather than animated

Screen reader narrative test: read the DOM in source order without any CSS. If the content tells a coherent story (heading, introduction, features, testimonials, CTA), the DOM order is correct. If it reads as (sidebar, footer, main content, header), the DOM needs restructuring.

Common native HTML substitutions (ARIA is last resort):

| Instead of (Flagged) | Use (Correct) |
|----------------------|---------------|
| `<div role="button" onclick>` | `<button type="button">` |
| `<div role="link">` | `<a href>` |
| `<div role="checkbox">` | `<input type="checkbox">` |
| `<span role="heading" aria-level="2">` | `<h2>` |
| `<div role="navigation">` | `<nav>` |
| `<div role="main">` | `<main>` |
| `<div role="banner">` | `<header>` |
| `<div role="contentinfo">` | `<footer>` |
| `<div role="list"><div role="listitem">` | `<ul><li>` |

Keyboard navigation requirements:
- **Tab order:** Follows visual reading order (left-to-right, top-to-bottom for LTR layouts)
- **Focus trapping:** Modals and dialogs trap focus within themselves; Tab cycles through modal content, not background page
- **Escape key:** Closes modals, popovers, dropdowns; returns focus to the trigger element
- **Arrow keys:** Navigate within composite widgets (tabs, radio groups, menus, sliders)
- **Enter/Space:** Activate buttons and links; Space toggles checkboxes; Enter submits forms

---

### Domain 9: Content Design Quality

**Purpose:** Every string in the interface is a design decision. Placeholder text, generic labels, and unhelpful errors destroy perceived quality faster than any visual flaw.

#### Principles

| Principle | Enforcement |
|-----------|-------------|
| Microcopy specificity | HARD -- generic CTAs ("Submit", "Click Here", "Learn More") flagged; must describe the specific action |
| Helpful error messages | HARD -- vague errors ("Invalid input", "Error occurred") flagged; must explain what went wrong and how to fix it |
| Designed empty states | SOFT -- empty states must include illustration or icon + explanation + suggested action; blank screens flagged |
| No placeholder content | HARD -- Lorem ipsum incurs automatic penalty; "Coming soon" without a date incurs penalty |
| Formatted numbers and data | SOFT -- currency must use locale formatting; dates must use locale patterns; raw numbers > 999 need separators |
| Consistent voice and tone | SOFT -- all microcopy should match the brand voice defined in PROJECT.md; mixed formal/informal tones flagged |
| Action-oriented headings | SOFT -- section headings should communicate value, not structure ("Transform Your Workflow" not "Features Section") |

#### Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| CTA word count | 2 | 5 | words | SOFT -- single-word CTAs flagged, overly long CTAs flagged |
| Error message components | 2 | -- | parts | HARD -- must include what happened + how to fix it |
| Lorem ipsum instances | 0 | 0 | count | HARD -- automatic penalty per instance |
| "Coming soon" without date | 0 | 0 | count | HARD -- automatic penalty per instance |
| Empty state components | 3 | -- | parts | SOFT -- icon/illustration + text + action |
| Generic CTA instances | 0 | 0 | count | HARD -- "Submit", "Click Here", "Read More", "Learn More" flagged |
| Placeholder-only inputs | 0 | 0 | count | HARD -- inputs must have visible labels, not just placeholders |

#### Implementation Guidance

Microcopy transformation examples:

| Generic (Flagged) | Specific (Correct) | Context |
|--------------------|-------------------|---------|
| "Submit" | "Send Message" | Contact form |
| "Submit" | "Create Account" | Registration form |
| "Submit" | "Place Order" | Checkout form |
| "Click Here" | "Download Report" | Resource page |
| "Learn More" | "View Case Study" | Portfolio card |
| "Read More" | "Continue Reading" | Blog excerpt |
| "Error" | "Email must include @" | Form validation |
| "Invalid input" | "Phone number needs 10 digits" | Form validation |
| "Something went wrong" | "Payment failed -- check your card details and try again" | Checkout error |

Empty state design must include three components:
1. **Visual:** Illustration or icon that communicates the empty state contextually
2. **Explanation:** Short text explaining why this is empty and what normally appears here
3. **Action:** A button or link to take the logical next step ("Add your first project", "Import contacts")

Number formatting requirements by context:

| Context | Format | Example |
|---------|--------|---------|
| Currency (USD) | `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` | $1,234.56 |
| Currency (EUR/DE) | `Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })` | 1.234,56 EUR |
| Large numbers | Thousands separator per locale | 1,234,567 (EN) / 1.234.567 (DE) |
| Percentages | One decimal max | 42.5% not 42.50000% |
| Dates | `Intl.DateTimeFormat` with locale | Jan 15, 2026 (EN) / 15. Jan. 2026 (DE) |
| Phone numbers | International format with country code | +1 (555) 123-4567 |
| File sizes | Human-readable with appropriate unit | 1.2 MB not 1258291 bytes |

Content voice consistency checklist:
- **Formal voice:** "Please submit your inquiry" / "We appreciate your patience" / "Contact our team"
- **Casual voice:** "Send us a message" / "Thanks for waiting" / "Get in touch"
- **Mixing formal and casual in the same interface is a violation** -- the voice must be consistent from nav labels to error messages to footer copy
- The voice is defined during `/gen:start` in PROJECT.md and must be referenced throughout building

---

### Domain 10: Motion Narrative

**Purpose:** Motion must tell a story. Every animation should communicate origin, relationship, or hierarchy -- never move for movement's sake. Motion is a design language, not decoration.

#### Principles

| Principle | Enforcement |
|-----------|-------------|
| Motion from logical origin | HARD -- elements must enter from a direction that makes semantic sense (sidebar slides from side, modal scales from trigger button) |
| Spatial consistency | HARD -- modal opens from button position, closes back toward button; drawers slide from the edge they are anchored to |
| Scroll animations fire once | HARD -- elements animate into view once on first scroll; re-triggering on every scroll pass incurs a penalty |
| Purpose-driven animation only | HARD -- every animation must serve one of: guide attention, show relationships, provide feedback, establish hierarchy |
| Performance budget for concurrent animations | HARD -- maximum simultaneous animated elements in a single viewport to prevent jank and distraction |
| Exit animations mirror entry | SOFT -- closing/leaving animations should reverse or mirror the entry animation path for spatial coherence |
| Reduced motion alternatives | HARD -- all motion must have a `prefers-reduced-motion` alternative that preserves meaning without movement |

#### Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Max concurrent viewport animations | 1 | 3 | count | HARD -- reject if exceeded; causes visual noise |
| Scroll animation re-triggers | 0 | 0 | count | HARD -- fire-once only; no repeat animations |
| Purposeless animations | 0 | 0 | count | HARD -- penalty per decorative-only instance |
| Entry animation duration | 200 | 600 | ms | SOFT -- warn outside range |
| Exit animation duration | 150 | 400 | ms | SOFT -- warn outside range; exits should feel faster |
| Stagger sequence total duration | -- | 800 | ms | SOFT -- full stagger from first to last child should not exceed |
| Animation purpose categories | 1 | -- | per animation | HARD -- must map to: guide, relate, feedback, or hierarchy |

#### Implementation Guidance

The four valid animation purposes:

1. **Guide attention:** Draw the user's eye to something important (a new notification badge pulsing, a CTA appearing after scroll)
2. **Show relationships:** Reveal how elements are connected (an accordion expanding shows the content belongs to the header)
3. **Provide feedback:** Confirm an action was received (button press animates, form submission transitions to success state)
4. **Establish hierarchy:** Show importance or order (hero content animates in first, supporting content staggers after)

Spatial consistency means animations respect the physical metaphor of the interface. If a dropdown menu opens downward from a nav item, it should close upward back toward the nav item. If a slide-over panel enters from the right edge, it exits to the right edge. Breaking spatial consistency makes the interface feel unreliable.

Fire-once scroll animations: use Intersection Observer with `{ once: true }`. Elements that re-animate every time they scroll in and out of view create a "Christmas tree" effect that distracts from content. The only exception is parallax effects, which are continuous by nature.

Motion audit checklist for quality-reviewer:
1. List every animated element on the page
2. For each, identify the purpose category (guide / relate / feedback / hierarchy)
3. If no purpose can be identified, flag as purposeless (HARD violation)
4. Count concurrent animations per viewport at peak scroll -- flag if > 3
5. Scroll up and down past animated sections -- flag any that re-trigger
6. Check all animations have `prefers-reduced-motion` alternatives
7. Verify exit animations mirror entry animations for spatial elements (modals, drawers, popovers)

---

### Domain 11: Visual Consistency

**Purpose:** Consistency builds trust. Every inconsistency -- no matter how small -- subconsciously erodes the user's confidence in the product. Consistency is the easiest domain to audit and the most common to fail.

#### Principles

| Principle | Enforcement |
|-----------|-------------|
| Icon system coherence | HARD -- one icon library per project; mixing icon sets (e.g., Lucide + Heroicons + FontAwesome) flagged |
| Border radius consistency | HARD -- maximum 3 border-radius values defined in DNA; random or inline radius values flagged |
| Image treatment uniformity | SOFT -- images in the same context (team photos, product cards, blog thumbnails) must use the same aspect ratio and treatment |
| Component spacing patterns | HARD -- same component type must use identical internal padding and external margin everywhere it appears |
| Hover effect consistency | HARD -- all cards must hover identically; all buttons of the same variant must hover identically; mixed behaviors flagged |
| Color token usage | HARD -- raw hex/rgb/hsl values in component code flagged; all colors must reference DNA tokens or semantic variables |
| Typography token usage | HARD -- inline font-size or font-weight values flagged; must use the type scale system defined in DNA |

#### Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Icon libraries per project | 1 | 1 | count | HARD -- reject if multiple icon sets detected |
| Border radius DNA values | 2 | 3 | count | HARD -- max distinct radius values; typically sm, md, lg |
| Raw color values (non-token) | 0 | 0 | count | HARD -- all color references must use DNA tokens |
| Raw font-size values (non-scale) | 0 | 0 | count | HARD -- all sizes must reference the type scale |
| Hover behavior variants per component type | 1 | 1 | count | HARD -- one hover style per component type |
| Spacing inconsistencies (same component) | 0 | 0 | count | HARD -- identical components must have identical spacing |
| Image aspect ratio variants per context | 1 | 1 | count | SOFT -- same context should use same ratio |

#### Implementation Guidance

Consistency audit checklist -- the quality-reviewer checks each of these during `/gen:audit`:

1. **Icon audit:** Grep all icon imports. If `lucide-react` and `@heroicons/react` both appear, flag immediately.
2. **Radius audit:** Extract all `border-radius` and `rounded-*` values. Map to DNA tokens. Flag any value not in the DNA set.
3. **Color audit:** Search for hex codes (`#`), `rgb(`, `hsl(`, `oklch(` in component files. All should reference CSS variables or Tailwind theme tokens.
4. **Typography audit:** Search for explicit `text-[Npx]`, `font-[N]`, or inline style font properties. All should use scale classes.
5. **Spacing audit:** Compare padding/margin of identical components across sections. Any deviation is a violation.
6. **Hover audit:** Trigger hover on all instances of each component type. Compare behaviors. Any difference is a violation.

Border radius DNA typically defines 3 values:
- **sm (4px):** Buttons, badges, input fields, small elements
- **md (8px):** Cards, dropdowns, dialogs, medium containers
- **lg (16px):** Large panels, hero sections, full-bleed containers

A fourth value of `full` (9999px) is permitted for pills and avatars but does not count against the 3-value limit.

Consistency enforcement during builds -- builders should run these self-checks before marking a section complete:

1. **Token compliance:** Search the section code for any raw color, font-size, or spacing value not referencing a DNA token
2. **Component parity:** If this section uses a card component that exists in another section, compare padding, border-radius, shadow, and hover behavior
3. **Icon source:** Verify all icons import from the same library as every other section
4. **Image treatment:** If this section contains images in a grid/list context, verify aspect ratio matches similar grids elsewhere
5. **Spacing verification:** Measure internal padding of repeated components (cards, list items, buttons) and confirm they match across all instances

---

### Domain 12: Cultural & Contextual Intelligence

**Purpose:** Design must respect the linguistic, cultural, and legal context of its audience. Default assumptions (left-to-right, English formatting, Western color semantics) create exclusion and legal liability.

#### Principles

| Principle | Enforcement |
|-----------|-------------|
| Language-aware layout | HARD -- RTL layout for Arabic/Hebrew; CJK-optimized line heights (1.7-2.0); flexible containers for German (30% longer words) |
| Cultural color awareness | SOFT -- flag color choices that carry conflicting cultural semantics in multi-culture target markets |
| Date/time/currency localization | HARD -- hardcoded date formats (MM/DD/YYYY) flagged; must use `Intl.DateTimeFormat`, `Intl.NumberFormat`, or equivalent |
| Legal and compliance patterns | HARD -- GDPR cookie consent for EU audiences; German Impressum requirement; VAT display per country regulations |
| Text expansion accommodation | SOFT -- UI containers must handle 30-50% text expansion for translations without breaking layout |
| Cultural imagery sensitivity | SOFT -- stock photography and illustrations reviewed for cultural representation and appropriateness |
| Locale-aware sorting and filtering | SOFT -- alphabetical sorting must use `Intl.Collator` or locale-aware comparison; ASCII sorting flagged |

#### Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| CJK line-height | 1.7 | 2.0 | ratio | HARD -- reject below for CJK content |
| German text container flex | 130 | -- | % of English width | SOFT -- test with 30% text expansion minimum |
| Hardcoded date format instances | 0 | 0 | count | HARD -- use Intl APIs or date library formatting |
| Hardcoded currency format instances | 0 | 0 | count | HARD -- use Intl APIs |
| Missing GDPR consent (EU target) | 0 | 0 | count | HARD -- legal requirement |
| Missing Impressum (German target) | 0 | 0 | count | HARD -- legal requirement; Impressum page with full business details |
| RTL layout support (Arabic/Hebrew target) | 100 | 100 | % | HARD -- all layout must flip for RTL when audience requires it |

#### Implementation Guidance

Language-specific typography adjustments:

| Language Family | Line Height | Letter Spacing | Container Width | Notes |
|-----------------|-------------|----------------|-----------------|-------|
| Latin (EN, FR, ES) | 1.5-1.7 | Normal | 100% baseline | Standard design assumptions |
| Germanic (DE, NL) | 1.5-1.7 | Normal | 130% of EN | German compound words are significantly longer |
| CJK (ZH, JA, KO) | 1.7-2.0 | Normal | 100% | Characters need more vertical breathing room |
| Arabic/Hebrew | 1.5-1.8 | Normal | 100% | RTL layout; different numeral systems possible |
| Cyrillic (RU, UA) | 1.5-1.7 | Normal | 110% of EN | Slightly longer than English on average |

Cultural color semantics to flag in multi-market projects:
- **White:** Purity/cleanliness (Western) vs. mourning/death (some East Asian cultures)
- **Red:** Danger/stop (Western) vs. prosperity/luck (Chinese culture)
- **Green:** Nature/go (Western) vs. sacred (Islamic culture) vs. infidelity (Chinese culture)
- **Yellow:** Caution (Western) vs. royalty (some Asian cultures) vs. mourning (some Latin American cultures)

Legal requirements by market:

| Market | Requirements |
|--------|-------------|
| EU (GDPR) | Cookie consent banner, privacy policy, data processing agreement, right to deletion |
| Germany | Impressum (legal notice page), Datenschutz (privacy page), Widerrufsbelehrung (cancellation policy for e-commerce) |
| UK | Cookie consent (PECR), age verification for restricted content |
| California (CCPA) | "Do Not Sell My Info" link, privacy policy |
| Global e-commerce | VAT display per country, currency localization, shipping/returns per jurisdiction |

RTL layout implementation checklist:
- Set `dir="rtl"` on `<html>` element for Arabic/Hebrew content
- Use CSS logical properties: `margin-inline-start` instead of `margin-left`, `padding-inline-end` instead of `padding-right`
- Flexbox and Grid automatically reverse in RTL when using logical properties
- Mirror horizontal icons (arrows, progress bars) but NOT universal icons (search, home, phone)
- Text alignment shifts: body text becomes right-aligned, numbers may remain LTR within RTL text
- Bidirectional text (mixing LTR and RTL) requires `unicode-bidi` and `dir` attributes on inline elements

Localization testing strategy:
- **German:** Test all UI with 30% longer strings; button text, navigation items, and form labels are most vulnerable to overflow
- **Japanese:** Test with CJK characters; verify line-height is 1.7+ and no characters are clipped by line-height
- **Arabic:** Test full RTL layout; verify logical property usage and icon mirroring
- **French:** Test with accented characters (e, a, u) in headings; verify font rendering and diacritical marks

---

## Layer 3: Integration Context

### Quality Gate Mapping

Each domain maps to one scoring slot in the 72-point UX Intelligence audit. The quality-reviewer scores each domain on a 6-point scale (see Layer 1 scoring protocol).

| Domain | ID | Scoring Slot | Points | Weight Context |
|--------|----|-------------|--------|----------------|
| Visual Proportion & Mathematical Harmony | D1 | Slot 1 | 6 | Foundation -- all other domains build on spatial harmony |
| Color Science | D2 | Slot 2 | 6 | Emotional impact -- first thing users perceive |
| Typography as Design System | D3 | Slot 3 | 6 | Information hierarchy -- primary content vehicle |
| Micro-Interaction Craft | D4 | Slot 4 | 6 | Perceived quality -- feel of the interface |
| Spatial Depth & Materiality | D5 | Slot 5 | 6 | Visual sophistication -- separates premium from generic |
| Conversion Psychology | D6 | Slot 6 | 6 | Business value -- design serves objectives |
| Responsive Craft | D7 | Slot 7 | 6 | Reach -- majority of users on mobile |
| Accessibility as Design | D8 | Slot 8 | 6 | Inclusion -- legal and ethical baseline |
| Content Design Quality | D9 | Slot 9 | 6 | Trust -- words are the interface |
| Motion Narrative | D10 | Slot 10 | 6 | Storytelling -- motion carries meaning |
| Visual Consistency | D11 | Slot 11 | 6 | Polish -- consistency builds subconscious trust |
| Cultural & Contextual Intelligence | D12 | Slot 12 | 6 | Respect -- design for the real audience |

### Archetype Domain Emphasis

Different archetypes weight certain domains more heavily. The quality-reviewer uses this table to apply archetype-specific scrutiny -- primary domains are scored with stricter thresholds.

| Archetype | Primary Domains | Notes |
|-----------|----------------|-------|
| Brutalist | D1, D3, D5 | Proportion is critical when ornamentation is absent; depth is redefined (flat is intentional, not lazy); typography carries all hierarchy |
| Ethereal | D2, D10, D5 | Color gradients and motion carry the entire experience; depth through blur and transparency is the archetype |
| Kinetic | D4, D10, D7 | Micro-interactions and motion narrative are the product; responsive must preserve motion intent across devices |
| Editorial | D3, D1, D9 | Typography IS the design; proportion governs the grid; content quality is paramount because words are the feature |
| Neo-Corporate | D6, D11, D8 | Conversion drives business value; consistency builds corporate trust; accessibility is mandatory for enterprise |
| Organic | D2, D5, D12 | Natural color palettes; textured materiality; cultural sensitivity in nature imagery and sustainability claims |
| Retro-Future | D4, D2, D10 | Interaction novelty; chromatic boldness; animation tells a retro-tech story with CRT effects and glitch |
| Luxury/Fashion | D1, D5, D3 | Proportion and whitespace define luxury; material depth through subtle shadows; typography restraint is elegance |
| Playful/Startup | D4, D6, D9 | Delightful micro-interactions; conversion-focused design; friendly and informal content voice |
| Data-Dense | D3, D1, D7 | Typography hierarchy in dense layouts; mathematical grid is essential; mobile must completely redesign, never shrink |
| Japanese Minimal | D1, D5, D12 | Extreme proportion discipline; material restraint as a form of depth; cultural intelligence is critical |
| Glassmorphism | D5, D2, D4 | Depth IS the archetype (glass, blur, transparency); color through layered transparency; interaction with glass surfaces |
| Neon Noir | D2, D5, D10 | High-contrast color science (glow on dark); glow effects as depth cues; motion as atmospheric storytelling |
| Warm Artisan | D2, D9, D12 | Warm color temperature throughout; authentic handcrafted content voice; cultural craft tradition sensitivity |
| Swiss/International | D1, D3, D11 | Grid proportion is everything; typography is the design system; absolute consistency with zero tolerance |
| Vaporwave | D2, D10, D12 | Color excess is intentional (not a D2 violation); motion is aesthetic purpose; cultural reference awareness required |
| Neubrutalism | D1, D3, D5 | Bold proportion with oversized elements; typography as visual statement; heavy borders redefine D5 depth rules |
| Dark Academia | D2, D3, D9 | Muted warm palettes; literary serif typography; scholarly and contemplative content voice |
| AI-Native | D4, D10, D6 | Interface intelligence through smart interactions; motion as AI feedback; conversion through trust and transparency |

### Pipeline Stages

| Stage | Domains Checked | Who Checks | Context |
|-------|----------------|-----------|---------|
| **Planning** (`/gen:plan`) | D1, D3, D7, D12 | Creative director | Proportion system, type scale, responsive strategy, and locale requirements must be defined before building |
| **Building** (`/gen:execute`) | D4, D5, D8, D11 | Section builder (self-check) | Interactions, depth, accessibility, and consistency checked as builder completes each section |
| **Reviewing** (`/gen:audit`) | All 12 | Quality reviewer | Full 72-point audit; every domain scored, reported, and remediation tasks generated for failures |
| **Polishing** (`/gen:iterate`) | D9, D10, D11, D12 | Polisher agent | Content polish, motion refinement, consistency pass, and localization check as final quality pass |

### DNA Connection

| DNA Token Category | Relevant Domains | How Used |
|--------------------|-----------------|----------|
| Color tokens (bg, surface, text, border, primary, secondary, accent, muted) | D2, D8, D11 | D2 validates color science; D8 checks contrast ratios; D11 ensures token usage over raw values |
| Expressive tokens (glow, tension, highlight, signature) | D2, D5 | D2 validates chromatic depth; D5 maps glow/highlight to depth system |
| Type scale (8-level) | D1, D3 | D1 validates scale ratio and size count; D3 validates hierarchy, measure, and leading |
| Spacing scale (5-level) | D1, D7 | D1 validates base unit and rhythm; D7 validates tap spacing and touch targets |
| Motion tokens (8+) | D4, D10 | D4 validates durations and easing; D10 validates narrative purpose and concurrent limits |
| Border radius tokens | D11 | D11 validates consistency and token usage; max 3 distinct values |
| Shadow tokens | D5 | D5 validates depth levels, light source, and surface hierarchy |
| Signature element | D5, D11 | D5 checks materiality expression; D11 checks consistent application |

### Related Skills

- **anti-slop-gate** -- the 35-point gate and this 72-point audit are complementary systems; anti-slop runs first as a coarse filter, UX Intelligence adds fine-grained domain depth
- **design-dna** -- provides the token system that most domains enforce against; DNA must be generated before UX Intelligence can score
- **design-archetypes** -- determines which domains receive extra scrutiny per the archetype emphasis table above
- **emotional-arc** -- arc beats influence D1 (section proportions per beat type), D10 (motion pacing per beat intensity), and D6 (conversion placement on Peak/Close beats)
- **cinematic-motion** -- extends D4 and D10 with advanced choreography, camera movements, and cinematic techniques beyond UX fundamentals
- **accessibility** -- extends D8 with comprehensive WCAG 2.2 compliance, screen reader testing protocols, and assistive technology patterns
- **responsive-design** -- extends D7 with detailed implementation patterns, fluid typography, and container query recipes
- **creative-tension** -- tension overrides may intentionally break rules in D1, D3, D5, or D11 with documented rationale; one rule break per tension zone

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Shadow Soup

**What goes wrong:** Using `shadow-md` or arbitrary shadow values on every elevated element. No consistent depth hierarchy. Shadows point in different directions across sections because each component was built independently. Light source is incoherent -- card shadows go down-right while button shadows go straight down.

**Instead:** Define 3-5 shadow levels in your DNA (subtle/low/medium/high/highest) with a single, consistent light source direction (typically top-left, casting shadows down-right). Map each level to a semantic context: subtle for cards at rest, low for hover states, medium for dropdowns, high for modals, highest for critical overlays. Every shadow in the project traces back to this system. No inline shadow values.

### Anti-Pattern: Animation Carnival

**What goes wrong:** Every element bounces, fades, slides, or scales on scroll. Scroll-triggered animations re-fire on every pass through the viewport. Multiple elements animate simultaneously in the same viewport, creating visual noise that overwhelms the content. Motion exists because "it looks cool" with no narrative purpose -- the animation does not guide, relate, feedback, or hierarchize.

**Instead:** Every animation must answer one question: does this guide attention, show a relationship, provide feedback, or establish hierarchy? If it does none of these, remove it. Limit to 3 concurrent animations per viewport. Scroll animations fire once using `IntersectionObserver({ once: true })`. Entry/exit animations mirror each other for spatial consistency. Use `prefers-reduced-motion` to provide non-motion alternatives that preserve meaning.

### Anti-Pattern: Responsive Squeeze

**What goes wrong:** Desktop layout is simply narrowed for mobile. Three-column grids become three unreadably narrow columns, then eventually stack. Touch targets remain desktop-sized (32px) on mobile. Primary CTAs sit at the top of the page, unreachable by thumb in one-handed use. Data tables shrink to illegible font sizes. Images maintain desktop aspect ratios and dominate the mobile viewport.

**Instead:** Design mobile as an independent layout with its own content priorities. Users on mobile have different intent (quick actions, scanning, on-the-go decisions) than desktop users (deep reading, complex tasks, multi-tab workflows). Reprioritize content for mobile context. Place primary actions in the thumb zone (bottom 40%). Size touch targets to 44px minimum with 8px gaps. Use container queries for component-level responsiveness. Consider what content to defer, collapse, or remove entirely on mobile.

### Anti-Pattern: Browser Default Focus

**What goes wrong:** Interactive elements use the browser's default blue outline for focus indicators. The outline clashes with the carefully designed DNA color system, looking like a bug rather than a feature. Worse, some elements have `outline: none` with no replacement, making keyboard navigation completely invisible and failing WCAG compliance.

**Instead:** Design custom focus indicators that match the DNA accent color. Use a 2-4px solid ring with 2px+ offset so it does not overlap element content. Apply via `:focus-visible` (not `:focus`) to avoid showing focus rings on mouse clicks. Ensure every single interactive element has a visible focus state. Test the full tab order from first to last interactive element to confirm keyboard navigability is logical and complete. Focus rings are a design element, not a compliance checkbox.

### Anti-Pattern: Weight-Only Hierarchy

**What goes wrong:** Headings differ from body text only by font-weight (e.g., Semi-Bold 600 vs Regular 400). At a glance, the hierarchy is ambiguous -- is that bold text a heading or just emphasis? Bold text within body paragraphs creates false heading signals. The eye cannot scan the page structure because the contrast between levels is insufficient.

**Instead:** Use 2+ contrast axes for every heading level. Combine size + weight as an absolute minimum. Add color (muted vs. full), letter-spacing (tighter for large, wider for small caps), or case (uppercase for labels, title case for headings) for additional differentiation. Display headings (hero titles, section openers) should differ on 3+ axes from body text. The hierarchy must be instantly scannable at arm's length -- if you squint at the page, the heading structure should still be visible.

---

## Machine-Readable Constraints (Summary)

This table aggregates the most critical HARD constraints across all 12 domains for quick agent reference during automated checking. Agents should parse this table for programmatic validation.

| Parameter | Min | Max | Unit | Domain | Enforcement |
|-----------|-----|-----|------|--------|-------------|
| Type scale ratio | 1.125 | 1.5 | ratio | D1 | HARD |
| Base spacing unit | 4 | 8 | px | D1 | HARD |
| Distinct font sizes per page | 3 | 6 | count | D1 | HARD |
| Section min-height set | -- | -- | vh | D1 | HARD -- {50, 66, 75, 80, 100} only |
| Subtle contrast | 3 | -- | :1 ratio | D2 | HARD |
| Body text contrast | 4.5 | -- | :1 ratio | D2 | HARD |
| Heading text contrast | 7 | -- | :1 ratio | D2 | HARD |
| Dark mode token independence | 100 | 100 | % | D2 | HARD |
| Body text measure | 45 | 75 | chars | D3 | HARD |
| Body line-height | 1.5 | 1.7 | ratio | D3 | HARD |
| Heading line-height | 1.0 | 1.2 | ratio | D3 | HARD |
| Display line-height | 0.85 | 1.0 | ratio | D3 | HARD |
| Body font size minimum | 16 | -- | px | D3 | HARD |
| Heading/body weight contrast | 200 | -- | units | D3 | HARD |
| Small transition duration | 150 | 200 | ms | D4 | HARD |
| Medium transition duration | 200 | 300 | ms | D4 | HARD |
| Large transition duration | 300 | 500 | ms | D4 | HARD |
| Interaction states per element | 4 | 4 | count | D4 | HARD |
| Shadow depth levels | 3 | 5 | count | D5 | HARD |
| Structural border width | 0.5 | 1 | px | D5 | HARD |
| Max z-index value | -- | 100 | units | D5 | HARD |
| CTA touch target (mobile) | 44 | -- | px | D6 | HARD |
| CTA click target (desktop) | 48 | -- | px | D6 | HARD |
| Choices per decision point | 1 | 3 | count | D6 | HARD |
| Fake scarcity elements | 0 | 0 | count | D6 | HARD |
| Mobile touch target | 44 | -- | px | D7 | HARD |
| Desktop click target | 32 | -- | px | D7 | HARD |
| Tap target gap | 8 | -- | px | D7 | HARD |
| Body font size floor | 16 | -- | px | D7 | HARD |
| Focus ring width | 2 | 4 | px | D8 | HARD |
| Focus ring offset | 2 | -- | px | D8 | HARD |
| Color contrast AA body | 4.5 | -- | :1 ratio | D8 | HARD |
| Heading level skip | 0 | 0 | levels | D8 | HARD |
| h1 per page | 1 | 1 | count | D8 | HARD |
| Color-only indicators | 0 | 0 | count | D8 | HARD |
| Lorem ipsum instances | 0 | 0 | count | D9 | HARD |
| Generic CTA instances | 0 | 0 | count | D9 | HARD |
| Placeholder-only inputs | 0 | 0 | count | D9 | HARD |
| Error message components | 2 | -- | parts | D9 | HARD |
| Max concurrent viewport animations | 1 | 3 | count | D10 | HARD |
| Scroll animation re-triggers | 0 | 0 | count | D10 | HARD |
| Purposeless animations | 0 | 0 | count | D10 | HARD |
| Icon libraries per project | 1 | 1 | count | D11 | HARD |
| Border radius DNA values | 2 | 3 | count | D11 | HARD |
| Raw color values (non-token) | 0 | 0 | count | D11 | HARD |
| Raw font-size values (non-scale) | 0 | 0 | count | D11 | HARD |
| Hover variants per component type | 1 | 1 | count | D11 | HARD |
| CJK line-height | 1.7 | 2.0 | ratio | D12 | HARD |
| Hardcoded date formats | 0 | 0 | count | D12 | HARD |
| Hardcoded currency formats | 0 | 0 | count | D12 | HARD |
| Missing GDPR consent (EU) | 0 | 0 | count | D12 | HARD |
| Missing Impressum (DE) | 0 | 0 | count | D12 | HARD |
| RTL layout support (AR/HE target) | 100 | 100 | % | D12 | HARD |
