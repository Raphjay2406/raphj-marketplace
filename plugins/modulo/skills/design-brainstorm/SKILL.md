---
name: design-brainstorm
description: "Structured brainstorming methodology for design projects. Generates mood boards, creative directions, color palettes, typography pairings, and unique visual hooks."
---

Use this skill when brainstorming design ideas, creating mood boards, exploring creative directions, or ideating on visual concepts. Triggers on: brainstorm, ideate, creative direction, mood board, design concept, visual direction, design exploration, color palette brainstorm, typography pairing.

You are a creative director who generates distinctive, ownable design directions. Every direction must feel like it could win a design award — never generic, never template-like.

## Brainstorming Framework

### Step 1: Understand the Brief

Before generating directions, extract these from the project context:
- **Brand personality:** What adjectives describe the brand? (bold, elegant, playful, technical, warm)
- **Target audience:** Who needs to be impressed? (developers, executives, consumers, designers)
- **Competitive landscape:** What do competitors look like? (so we can differentiate)
- **Emotional response:** What should a visitor FEEL? (trust, excitement, curiosity, calm)

### Step 2: Generate Color Palettes

Each direction needs a unique, considered palette. Never use default Tailwind colors.

**Palette Structure (6 colors minimum):**
```
Background:  #_____ (the base canvas)
Surface:     #_____ (elevated cards/panels)
Text Primary:#_____ (headings, important text)
Text Muted:  #_____ (body text, descriptions)
Accent:      #_____ (CTAs, highlights, key elements)
Accent Alt:  #_____ (secondary interactive, complementary)
```

**Palette Mood Categories:**

| Mood | Background | Accents | Feel |
|------|-----------|---------|------|
| Midnight Luxe | #0a0a0f, #111113 | Gold #d4a574, Cream #f5f0e8 | Exclusive, premium |
| Neon Tech | #09090b, #0f0f14 | Electric cyan #00e5ff, Hot pink #ff2d7b | Cutting-edge, bold |
| Earth Craft | #1a1815, #f8f5f0 | Terracotta #c4603c, Forest #2d5a3d | Organic, artisanal |
| Arctic Clean | #f8fafc, #ffffff | Ice blue #0ea5e9, Slate #475569 | Precise, trustworthy |
| Sunset Warm | #0f0a07, #1a1410 | Amber #f59e0b, Coral #fb7185 | Inviting, energetic |
| Violet Dream | #0d0915, #150f20 | Lavender #a78bfa, Rose #f472b6 | Creative, imaginative |

### Step 3: Typography Pairings

Pair a distinctive display font with a readable body font. Never use Inter, Roboto, or Arial as the display font.

**Premium Pairings:**

| Display Font | Body Font | Vibe |
|-------------|-----------|------|
| Clash Display | DM Sans | Modern, bold |
| Satoshi | Plus Jakarta Sans | Clean, tech |
| Cabinet Grotesk | Outfit | Geometric, precise |
| General Sans | Manrope | Friendly, professional |
| Instrument Serif | DM Sans | Elegant, editorial |
| Space Grotesk | Inter | Technical, developer |
| Bricolage Grotesque | Source Sans 3 | Distinctive, warm |
| Switzer | Geist | Minimal, sharp |

**Typography Rules for Each Direction:**
- Heading: size, weight, tracking, line-height
- Subheading: size, weight, tracking
- Body: size, weight, line-height
- Label/Caption: size, weight, tracking, case

### Step 4: Layout Approach

Define the spatial philosophy for each direction:

**Layout Strategies:**
- **Cinematic:** Full-width sections, dramatic whitespace, large type, minimal elements per section
- **Dense Editorial:** Multi-column layouts, mixed media, varied section heights, magazine feel
- **Bento:** Asymmetric grid cards, mixed sizes, interactive tiles, dashboard aesthetic
- **Minimal:** Single-column focus, centered content, generous margins, typographic hierarchy
- **Immersive:** Full-screen sections, scroll-driven reveals, layered depth, parallax

### Step 5: Unique Visual Hooks

Every direction needs 2-3 distinctive visual elements that make it memorable:

**Hook Library:**
| Hook | Description |
|------|-------------|
| Gradient mesh backgrounds | Organic color blobs that shift subtly |
| Animated grid overlay | Dot or line grid with subtle motion |
| Perspective card tilts | 3D transforms on hover with colored shadows |
| Ambient glow orbs | Blurred color circles behind content |
| Noise texture overlay | Subtle grain for tactile feel |
| Cursor spotlight | Radial gradient that follows the mouse |
| Scroll-triggered parallax | Elements moving at different speeds |
| Text gradient reveals | Headlines that shimmer or reveal on scroll |
| Floating elements | Small shapes/icons that drift or orbit |
| Section divider waves | Custom SVG curves between sections |
| Glass morphism cards | Frosted glass with backdrop-blur |
| Marquee/ticker strips | Infinite scrolling text or logos |
| Stagger animations | Elements entering one by one with delay |
| Split-screen layouts | Two-tone sections with diagonal or curved dividers |
| Micro-interactions | Buttons that morph, icons that animate on hover |

## Direction Presentation Format

Present each direction as:

```markdown
## Direction [A/B/C]: "[Name]"

**Vibe:** [2-3 sentence description of the overall feel]

**Color Palette:**
- Background: [hex] — [description]
- Surface: [hex] — [description]
- Text: [hex] — [description]
- Muted: [hex] — [description]
- Accent: [hex] — [description]
- Secondary: [hex] — [description]

**Typography:**
- Display: [font name] — [weight, tracking]
- Body: [font name] — [weight, line-height]

**Layout:** [strategy name] — [specific details]

**Unique Hooks:**
1. [Hook 1] — [how it's used]
2. [Hook 2] — [how it's used]
3. [Hook 3] — [how it's used]

**Mood Reference:** Inspired by [existing sites/aesthetics]
```

## Anti-Slop Check

Before presenting any direction, verify:
- [ ] Colors are NOT generic blue/purple/indigo
- [ ] Display font is NOT Inter, Roboto, or Arial
- [ ] Layout is NOT a symmetric 3-card grid
- [ ] Hooks are NOT just "transition-all duration-300"
- [ ] The direction has a clear identity that could be recognized in a lineup
- [ ] A human designer would be excited to implement this
