---
name: image-prompt-generation
description: "DNA-matched AI image prompt generation. Tool-agnostic prompts for Midjourney, DALL-E, Flux. DNA-to-prompt translation matrix, category templates (hero, product, portrait, texture, illustration), negative prompts from DNA forbidden patterns."
tier: domain
triggers: "AI image, image prompt, Midjourney, DALL-E, Flux, AI-generated image, image generation, stock image alternative, hero image, product photo, abstract background, illustration prompt"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use AI-Generated Images

AI image prompts are appropriate when the project needs visual assets that:

- **Hero backgrounds** where stock photography doesn't match DNA personality or archetype mood
- **Abstract textures and patterns** that must use the DNA color palette precisely
- **Conceptual illustrations** for ideas that don't exist as stock imagery (futuristic concepts, surreal compositions, brand-specific metaphors)
- **Placeholder images during prototyping** that match final visual direction, enabling accurate design evaluation before photography is commissioned
- **Atmospheric elements** (gradient meshes, organic backgrounds, moody environmental scenes) that set archetype-appropriate tone
- **Icon and spot illustrations** in a consistent style that matches the DNA aesthetic

### When NOT to Use AI-Generated Images

- **Real team photos** -- Always use actual photography. AI-generated "team photos" are deceptive and create ethical and trust issues. No exceptions
- **Product photography** -- Use actual product photos. AI cannot capture real product details accurately
- **Screenshots and UI mockups** -- Use real screenshots or tools like Figma/browser captures
- **Logos and wordmarks** -- Use actual brand assets. AI-generated logos lack the precision and intent of designed marks
- **Legal or documentary imagery** -- Certifications, awards, partner logos, compliance badges must be authentic
- **Swiss/International or Warm Artisan archetypes** -- These archetypes favor authenticity; see archetype stance table below

For procedural shapes, noise textures, and geometric patterns, prefer the `shape-asset-generation` skill -- procedural generation uses exact DNA tokens while AI images only approximate them.

### Archetype Image Stance

Not all archetypes benefit from AI-generated imagery. Check this table before generating.

| Archetype | Stance | Rationale | Prefer Instead |
|-----------|--------|-----------|----------------|
| Brutalist | Great fit | Raw, surreal, confrontational imagery plays to AI strengths | -- |
| Ethereal | Great fit | Dreamlike, otherworldly, luminous scenes are AI's sweet spot | -- |
| Neon Noir | Great fit | Cyberpunk cityscapes, neon-lit environments, rain-slicked streets | -- |
| AI-Native | Great fit | Meta-appropriate -- AI imagery is literally on-brand | -- |
| Vaporwave | Great fit | Surreal, retro-digital, glitchy aesthetic | -- |
| Glassmorphism | Good fit | Abstract light refractions, bokeh, luminous depth layers | -- |
| Kinetic | Good fit | Dynamic motion-blur imagery, energetic abstract compositions | -- |
| Playful/Startup | Good fit | Colorful abstract illustrations, whimsical scenes | -- |
| Retro-Future | Good fit | Vintage sci-fi, chrome surfaces, analog-digital hybrid scenes | -- |
| Dark Academia | Good fit | Moody library interiors, aged textures, atmospheric settings | Check if real photography better matches scholarly credibility |
| Neo-Corporate | Cautious | Clean and precise -- AI must not introduce visual noise | High-quality stock or commissioned photography |
| Luxury/Fashion | Cautious | Demands editorial-grade quality -- AI must match that bar | Commissioned photography, curated editorial stock |
| Organic | Cautious | Nature imagery is abundant in stock; AI adds little value | Real nature photography, hand-drawn botanical illustrations |
| Editorial | Cautious | Editorial demands genuine photography for journalistic credibility | Commissioned or curated editorial photography |
| Japanese Minimal | Cautious | Prefers negative space over imagery; when used, must feel photographic | Minimal real photography, hand-crafted illustration |
| Neubrutalism | Cautious | Bold geometric aesthetic is better served by procedural shapes | `shape-asset-generation` skill for geometric shapes |
| Data-Dense | Cautious | Information-focused -- decorative images often compete with data | Data visualizations, charts, infographics |
| Swiss/International | Avoid | Favors real photography, precision, authenticity -- AI undermines these values | Curated stock photography, commissioned photography |
| Warm Artisan | Avoid | Hand-crafted, tactile aesthetic clashes with AI-generated feel | Real textures, hand-drawn illustrations, photography |

**Rule:** If archetype stance is "Avoid," do not generate AI images. If "Cautious," generate only when no real-photography alternative exists, and apply extra quality scrutiny.

### Tool-Agnostic Approach

This skill describes desired image output in natural language, not tool-specific syntax. Users adapt prompts to their preferred tool (Midjourney, DALL-E, Flux, Stable Diffusion, Ideogram, etc.).

**Why tool-agnostic:**
- AI image tool landscape changes rapidly -- tool-specific syntax (`--v 6`, `--ar 16:9`, `--s 750`) becomes outdated within months
- Describing desired output is more transferable across tools
- Natural language prompts develop the builder's visual vocabulary, which improves results on any tool

A Tool-Specific Appendix (clearly marked VOLATILE) maps generic prompts to tool parameters for convenience.

### Prompt Structure Template

Every AI image prompt should follow this 6-part structure:

```
[Subject/Content]: What is in the image -- the central object, scene, or concept
[Style]:           Visual treatment -- photographic, illustration, abstract, 3D render, painted
[Mood/Atmosphere]: Emotional quality -- serene, energetic, mysterious, warm, confrontational
[Color Direction]: DNA palette guidance -- dominant colors, accent colors, forbidden colors
[Composition]:     Layout -- aspect ratio, framing, depth, subject position, density
[Negative]:        What to avoid -- derived from DNA forbidden patterns + universal negatives
```

**Example prompt using the template:**
```
Subject: Abstract flowing landscape for a SaaS platform hero section
Style: Soft-focus, dreamy, luminous -- digital painting aesthetic
Mood: Serene, transcendent, otherworldly calm
Color: Dominated by deep indigo (#1e1b4b) and soft lavender (#c4b5fd),
       with pale gold (#fbbf24) highlights. Avoid neon green, hot pink, orange
Composition: Ultra-wide (21:9), layered depth with foreground blur,
             subject centered with generous negative space
Negative: No text, no logos, no watermarks, no people, no sharp edges,
          no geometric patterns, no high contrast, no busy details
```

### Pipeline Connection

- **Referenced by:** section-builder agents when a section plan specifies AI-generated imagery
- **Consumed at:** `/gen:execute` during build phase, when builder needs to generate or describe image assets
- **Input:** Design DNA document (color palette, archetype, signature element, forbidden patterns, motion language)
- **Output:** Tool-agnostic prompt text that produces DNA-consistent imagery

## Layer 2: Award-Winning Examples

### DNA-to-Prompt Translation Matrix

The core mapping system that transforms Design DNA attributes into prompt language.

| DNA Attribute | Prompt Translation | Example |
|---------------|-------------------|---------|
| **Color palette (12 tokens)** | "color palette dominated by [primary], accents of [accent], background tones of [surface]. Avoid [forbidden colors]" | "color palette dominated by deep indigo, accents of warm gold, background tones of soft gray. Avoid neon green, hot pink" |
| **Archetype personality** | Style and mood modifier (see Per-Archetype Style Modifiers below) | Brutalist: "raw, unpolished, confrontational" / Ethereal: "dreamlike, soft, otherworldly" |
| **Display font character** | Texture and feel descriptor derived from font personality | Geometric sans: "clean, precise, technical" / Serif: "classic, refined, literary" / Mono: "systematic, coded, digital" |
| **Signature element** | Visual motif woven into composition | "featuring recurring hexagonal motif" or "subtle diagonal slash pattern throughout" |
| **Motion language** | Implied energy and temporal quality | Fast/kinetic: "dynamic, motion blur, energetic sweep" / Slow/ethereal: "calm, meditative, frozen stillness" |
| **Forbidden patterns** | Negative prompt items (see DNA-Derived Negatives below) | Archetype forbids gradients: "no gradients, no color transitions, no rainbow effects" |
| **Texture preference** | Surface and material descriptor | Matte: "matte surfaces, flat textures, no reflections" / Glossy: "reflective, polished, glass-like surfaces" |
| **Whitespace level** | Composition density | HIGH: "isolated subject, generous negative space, minimal elements" / LOW: "dense, detailed, filled composition" |
| **Expressive tokens (glow, tension, highlight, signature)** | Lighting and emphasis attributes | Glow: "soft luminous glow" / Tension: "stark contrast edge" / Highlight: "bright focal accent" |

### Per-Archetype Style Modifiers

Complete modifier set for all 19 archetypes. Use these as direct prompt inserts.

| Archetype | Style Modifier | Mood Modifier | Color Modifier | Texture Modifier |
|-----------|---------------|---------------|----------------|-----------------|
| Brutalist | raw, unprocessed, high contrast, stark | confrontational, aggressive, unapologetic | monochrome with single harsh accent | concrete, grain, rough surfaces, unfinished |
| Ethereal | soft focus, dreamy, luminous, translucent | serene, transcendent, floating, weightless | pastel, iridescent, translucent layers | smooth, silky, flowing, cloud-like |
| Kinetic | dynamic, motion blur, angular, fast | energetic, exciting, fast-paced, electric | vibrant, saturated, high contrast | sleek, polished, speed lines, wind-swept |
| Editorial | editorial, journalistic, documentary, composed | authoritative, refined, considered, intentional | muted with selective bold accent | paper, linen, printed, tactile print |
| Neo-Corporate | clean, precise, professional, polished | confident, trustworthy, modern, approachable | blue-neutral palette, subtle gradients | smooth, matte, crisp edges |
| Organic | natural, flowing, living, botanical | warm, nurturing, grounded, peaceful | earth tones, greens, warm neutrals | leaf, bark, water, natural grain |
| Retro-Future | vintage sci-fi, chrome, analog-digital | nostalgic yet forward-looking, optimistic | warm metallics, teal, amber | chrome, brushed metal, CRT scan lines |
| Luxury/Fashion | editorial, cinematic, refined, opulent | exclusive, sophisticated, aspirational | deep rich tones, gold, champagne, cream | leather, marble, velvet, silk |
| Playful/Startup | colorful, fun, illustrated, approachable | joyful, energetic, friendly, inviting | bright primary colors, playful combinations | smooth, rounded, soft-edged |
| Data-Dense | systematic, information-rich, structured | analytical, precise, clinical, objective | low-saturation, functional, minimal | flat, clean, grid-aligned |
| Japanese Minimal | minimal, zen, intentional, restrained | contemplative, peaceful, balanced, quiet | muted, monochrome, natural, desaturated | paper, stone, wood grain, washi |
| Glassmorphism | frosted glass, layered, translucent, blurred | airy, modern, sleek, ethereal | soft gradients, frosted white, colored glass | frosted, transparent, soft bokeh |
| Neon Noir | cyberpunk, neon-lit, rain-slicked, nocturnal | mysterious, urban, dystopian, electric | dark base with neon glow accents | glass, chrome, wet surfaces, city grit |
| Warm Artisan | handcrafted, organic, tactile, imperfect | welcoming, homey, authentic, personal | earth tones, warm neutrals, clay, amber | clay, linen, wood, hand-pressed |
| Swiss/International | precise, grid-aligned, photographic, structured | orderly, rational, clear, functional | limited palette, strong contrast, no decorative color | flat, matte, printed, photographic |
| Vaporwave | surreal, glitchy, retro-digital, 90s internet | dreamy, ironic, nostalgic, hazy | pink, purple, teal, sunset gradient | pixel, marble bust, VHS noise, chrome |
| Neubrutalism | bold, chunky, high-contrast, outlined | playful-aggressive, unapologetic, loud | bright primary with black outlines | flat, paper-cut, thick borders |
| Dark Academia | moody, scholarly, vintage, atmospheric | intellectual, melancholic, romantic, mysterious | deep browns, forest green, burgundy, aged gold | aged paper, leather, oak, candlelight |
| AI-Native | machine-generated, data-driven, algorithmic | intelligent, systematic, evolving, digital | blue-purple, data-glow, monospace green | digital noise, pixel grid, neural network |

### Category-Specific Prompt Templates

#### Hero Backgrounds

Full template with DNA placeholders:

```
Subject: [Abstract/landscape/architectural/atmospheric] background for [industry] website hero
Style: [archetype_style_modifier]
Mood: [archetype_mood_modifier], conveying [brand primary emotion]
Color: Dominated by [DNA --color-primary], with [DNA --color-accent] highlights
       and [DNA --color-surface] midtones. Avoid [DNA forbidden colors]
Composition: Wide aspect ratio (16:9 or 21:9), [subject position],
             depth of field creating layered depth, suitable for text overlay
Negative: [DNA forbidden patterns], text, logos, watermarks, people,
          [universal quality negatives]
```

**Worked example -- Ethereal SaaS hero:**
```
Subject: Abstract flowing cloudscape for a meditation app hero section
Style: Soft focus, dreamy, luminous, translucent layers
Mood: Serene, transcendent, weightless -- conveying inner peace
Color: Dominated by deep indigo and soft lavender, with pale
       gold highlights and translucent white midtones. Avoid neon, orange, red
Composition: Ultra-wide (21:9), layered clouds with foreground bokeh,
             generous negative space in center for headline overlay
Negative: No sharp edges, no geometric patterns, no text, no logos,
          no watermarks, no people, no artifacts, no high contrast
```

**Worked example -- Brutalist agency hero:**
```
Subject: Stark industrial concrete interior with dramatic shadows
Style: Raw, unprocessed, high contrast, photographic
Mood: Confrontational, aggressive, unapologetic
Color: Monochrome grays with single harsh red accent light beam.
       Avoid pastels, warm tones, cheerful colors
Composition: Wide (16:9), off-center geometric composition,
             deep shadows creating negative space for text
Negative: No soft focus, no organic curves, no decoration, no text,
          no logos, no watermarks, no blur, no warm lighting
```

**Worked example -- Neon Noir tech platform hero:**
```
Subject: Rain-slicked cyberpunk cityscape at night with neon reflections
Style: Cyberpunk, neon-lit, nocturnal, cinematic depth
Mood: Mysterious, urban, electric, dystopian
Color: Deep navy/black base with electric cyan and magenta neon glows,
       puddle reflections. Avoid warm tones, daylight, natural colors
Composition: Wide (16:9), street-level perspective, rain creating
             vertical lines, neon signs creating depth layers
Negative: No daylight, no nature, no people, no text, no logos,
          no watermarks, no cheerful elements, no flat lighting
```

#### Product Shots

```
Subject: [Product type] on [surface/setting appropriate to archetype] for [industry]
Style: [archetype_style_modifier], product photography aesthetic
Mood: [archetype_mood_modifier], focus on [product's key quality]
Color: Product in [DNA --color-primary], environment in
       [DNA --color-bg] and [DNA --color-surface]
Composition: [Center/rule-of-thirds], [viewing angle: hero/eye-level/overhead],
             studio lighting with [archetype-appropriate lighting style]
Negative: [DNA forbidden patterns], competing products, busy backgrounds,
          text, logos, watermarks, [quality negatives]
```

**Note:** For actual physical products, always use real photography. This template is for conceptual product visualization, mockup contexts, or when physical photography is unavailable.

#### Team Portraits (Stylized Only)

```
Subject: Stylized [illustration/3D render/painted] portrait for [role/context]
Style: [archetype_style_modifier], [illustration type] aesthetic
Mood: Professional yet [archetype_mood_modifier]
Color: [DNA palette] applied to clothing accents, background, and highlights
Composition: Shoulders up, [direct/profile/three-quarter] view,
             [archetype-appropriate background treatment]
Negative: Photorealistic, uncanny valley, [DNA forbidden patterns],
          text, watermarks, [quality negatives]
```

**CRITICAL: For actual team members, ALWAYS use real photography. AI-generated "team photos" are deceptive and erode user trust. This template is ONLY for stylized avatars, illustrated character representations, or placeholder concepts. The final site must use real photos of real people.**

#### Abstract Textures

```
Subject: Abstract [organic/geometric/noise] texture for website [background/section divider/card surface]
Style: [archetype_texture_modifier], seamless or edge-to-edge
Mood: [archetype_mood_modifier], subtle enough for text overlay readability
Color: Muted [DNA --color-primary] tones with [DNA --color-surface] base,
       low contrast to preserve text legibility
Composition: Edge-to-edge coverage, no focal point, tileable if for repeating use,
             [density appropriate to DNA whitespace level]
Negative: [DNA forbidden patterns], recognizable objects, faces, text,
          high contrast elements, logos, watermarks, [quality negatives]
```

**Note:** Before generating AI textures, consider whether procedural generation (`simplex-noise`, SVG `feTurbulence`, CSS gradient patterns) would be more DNA-consistent. Procedural shapes use exact DNA color tokens; AI images only approximate them.

#### Illustrations

```
Subject: [Concept/metaphor] illustration for [section purpose / emotional beat]
Style: [archetype_style_modifier], [illustration type: flat/isometric/3D/hand-drawn/digital painting]
Mood: [archetype_mood_modifier], supporting [beat type] emotional beat
Color: [DNA palette] as primary illustration colors, [DNA --color-accent] for emphasis elements,
       [DNA --color-muted] for supporting details
Composition: [Centered/scattered/directional flow], clear focal point,
             [sized for context: full-width hero vs. inline spot illustration]
Negative: [DNA forbidden patterns], photorealistic, stock-image feel,
          clip art, generic, text, watermarks, [quality negatives]
```

**Beat-aware illustration guidance:**
- **HOOK** illustrations: Bold, attention-grabbing, large-scale, high visual impact
- **BUILD** illustrations: Supportive, explanatory, clear focal hierarchy
- **PEAK** illustrations: Maximum creative expression, complex, detailed
- **BREATHE** illustrations: Minimal, restrained, generous whitespace, small scale
- **PROOF** illustrations: Authentic, credible, documentary feel (prefer real imagery)

### DNA-Derived Negative Prompts

Systematically generate "what to avoid" from DNA constraints. Every prompt must include negatives derived from the project's DNA.

#### Automatic Negative Generation Rules

| DNA Constraint | Generated Negative Prompt |
|---------------|--------------------------|
| Archetype forbids gradients | "no gradients, no color transitions, no rainbow effects, no ombre" |
| Archetype forbids organic curves | "no organic shapes, no flowing curves, no rounded elements, no blobs" |
| Archetype forbids neon/glow | "no neon colors, no glow effects, no luminous elements, no light bloom" |
| Archetype forbids decoration | "no ornamental details, no embellishments, no filigree, no flourishes" |
| Archetype forbids rounded corners | "no soft edges, no rounded corners, no bubble shapes, no pill shapes" |
| Archetype forbids drop shadows | "no drop shadows, no floating elements, no shadow gradients" |
| DNA has HIGH whitespace | "no cluttered composition, no dense details, no busy backgrounds" |
| DNA has LOW whitespace | "no empty space, no minimal composition, no isolated subjects" |
| DNA has COLD palette | "no warm tones, no earth tones, no orange, no brown, no terracotta" |
| DNA has WARM palette | "no cool blues, no icy tones, no clinical white, no steel gray" |
| DNA has MATTE texture | "no glossy surfaces, no reflections, no chrome, no glass" |
| DNA has GLOSSY texture | "no matte surfaces, no flat textures, no rough surfaces" |
| DNA signature element is geometric | "no organic shapes dominating composition" |
| DNA signature element is organic | "no rigid geometric patterns dominating composition" |

#### Universal Negatives (Always Include)

These apply to every prompt regardless of DNA:

```
No watermarks, no text, no logos, no borders, no frames, no signatures
```

#### Quality Negatives (Always Include)

These prevent common AI generation artifacts:

```
No artifacts, no blurry, no low resolution, no distorted proportions,
no extra fingers, no deformed, no cropped, no out of frame
```

### Prompt Consistency Guidance

For multi-image projects (multiple hero sections, product series, illustration sets):

**Cross-Image Consistency Rules:**
1. Use the SAME style, mood, and color modifiers across all prompts in a project
2. Maintain consistent lighting direction and quality across image sets
3. Use consistent aspect ratios within each category (all hero images same ratio, all product shots same ratio)
4. DNA signature element should appear as a subtle recurring motif across images when appropriate
5. Maintain consistent level of abstraction -- don't mix photorealistic and illustrated styles within one category

**Consistency Checklist Per Image Set:**
- [ ] Same archetype style modifier used across all prompts
- [ ] Same mood modifier used across all prompts
- [ ] Same color direction (identical DNA token references)
- [ ] Same negative prompt set (identical forbidden patterns)
- [ ] Consistent composition density (matching DNA whitespace level)
- [ ] Consistent aspect ratio within category

**When Consistency Breaks:**
- Intentional contrast between sections (HOOK vs BREATHE beats) may warrant different energy levels -- but style, color, and quality should remain consistent
- Different categories (hero vs texture vs illustration) naturally have different composition styles -- consistency applies WITHIN categories

### Tool-Specific Appendix (VOLATILE)

**WARNING: This section maps generic prompts to tool-specific syntax. AI image tool parameters change frequently. Verify against current tool documentation before using. Last verified: 2026-02.**

| Generic Prompt Element | Midjourney | DALL-E | Flux / Stable Diffusion |
|----------------------|------------|--------|------------------------|
| Aspect ratio | `--ar 16:9` | Set in generation UI or API params | Width/height parameters |
| High quality / detail | `--q 2` or `--quality 2` | "highly detailed" in prompt text | Higher step count, CFG scale |
| Style consistency across images | `--sref [image URL]` | Reference image in API or system prompt | LoRA, IP-Adapter, style reference image |
| Exclude elements | `--no [items]` | Include exclusions in prompt text | Negative prompt field (separate input) |
| Photographic realism | `--style raw` | "photograph" or "photorealistic" in prompt | Realistic checkpoint model |
| Illustration style | Describe style in prompt | Describe style in prompt | Illustration checkpoint model |
| Seed for reproducibility | `--seed [number]` | Not user-controllable | `--seed [number]` |
| Upscale / enhance | `--upscale` variants | Vary / edit features | img2img at higher resolution |

**This appendix is intentionally brief.** Each tool's documentation is the authoritative source for current syntax. This table provides orientation only.

## Layer 3: Integration Context

### DNA Connection

The entire prompt system is driven by Design DNA. Every DNA attribute has a direct prompt translation.

| DNA Token | Prompt Usage |
|-----------|-------------|
| `--color-primary` | Dominant image color, main subject color |
| `--color-secondary` | Supporting color, secondary elements |
| `--color-accent` | Highlight spots, emphasis elements, glow color |
| `--color-bg` | Background tone, environment base |
| `--color-surface` | Midtone surfaces, secondary planes |
| `--color-text` | Not directly used (text is excluded from images) |
| `--color-border` | Edge treatment reference (subtle structural elements) |
| `--color-muted` | Low-emphasis supporting elements |
| `--color-glow` | Luminous effects, light bloom color |
| `--color-tension` | Contrast elements, dramatic accents |
| `--color-highlight` | Bright focal points, sparkle |
| `--color-signature` | Signature element color, brand mark |
| Archetype personality | Primary style and mood driver for all prompts |
| Signature element | Recurring visual motif across image set |
| Forbidden patterns | Automatic negative prompt generation |
| Motion language | Implied energy (still vs dynamic vs kinetic) |
| Display font character | Texture/feel descriptor (geometric, organic, etc.) |

### Archetype Variants

Archetype personality is the PRIMARY creative driver for image prompts. The per-archetype style modifier table in Layer 2 IS the creative direction system. Key archetype-specific behaviors:

| Archetype Group | Image Strategy |
|-----------------|---------------|
| Great fit (Brutalist, Ethereal, Neon Noir, AI-Native, Vaporwave) | Lean into AI generation. Use full modifier set. Multiple images per project encouraged |
| Good fit (Glassmorphism, Kinetic, Playful, Retro-Future, Dark Academia) | AI generation appropriate with standard quality checks. Mix with other visual sources |
| Cautious (Neo-Corp, Luxury, Organic, Editorial, Japanese Min, Neubrutalism, Data-Dense) | AI only when no alternative exists. Extra quality scrutiny. Prefer real photography or procedural generation |
| Avoid (Swiss/International, Warm Artisan) | Do not generate AI images. Use real photography, curated stock, or hand-crafted assets exclusively |

### Pipeline Stage

- **Input from:** Design DNA document (mandatory), section PLAN.md (image requirements per section), emotional arc (beat type determines image energy)
- **Output to:** Builder code (image `src` attributes, background images), quality reviewer (image-DNA consistency check)

### Related Skills

- **design-dna** -- Source of all prompt attributes. DNA must exist before any prompt generation
- **design-archetypes** -- Archetype personality drives style/mood modifiers. Archetype forbidden patterns drive negatives
- **emotional-arc** -- Beat type influences image energy level (HOOK = bold, BREATHE = subtle, PEAK = maximum)
- **shape-asset-generation** -- For textures and patterns, procedural generation may be preferable to AI (exact DNA tokens vs approximation). Cross-reference before choosing approach
- **anti-slop-gate** -- AI-generated images that don't match DNA palette will be flagged as visual inconsistency during quality review
- **creative-tension** -- Tension zones may warrant intentionally discordant imagery, but DNA palette constraints still apply
- **remotion** -- AI-generated images can serve as Remotion video composition backgrounds. Generate at appropriate resolution for video (1920x1080 minimum)

## Layer 4: Anti-Patterns

### Anti-Pattern: Tool-Specific Syntax in Main Prompts

**What goes wrong:** Prompts include Midjourney-specific syntax like `--v 6 --ar 16:9 --s 750` or DALL-E system prompt structures. When the tool updates (Midjourney v7, DALL-E 5), all prompts break. Builders also can't use the prompt with alternative tools.
**Instead:** Write prompts in natural language describing the desired output. Use the Tool-Specific Appendix (marked VOLATILE) only at the moment of generation. The main prompt template should work with any tool.

### Anti-Pattern: AI Team Photos

**What goes wrong:** AI is used to generate realistic-looking team member photos. This is deceptive -- users expect team photos to show real people. Uncanny valley effects damage credibility. Some jurisdictions have legal concerns around synthetic personas presented as real.
**Instead:** Always use real photography for actual team members. AI-generated portraits are appropriate ONLY for: stylized/illustrated avatars, fictional character representations, placeholder concepts that will be replaced with real photos.

### Anti-Pattern: Ignoring Archetype Image Stance

**What goes wrong:** A builder generates AI images for a Swiss/International or Warm Artisan design. Swiss archetype values authenticity and photographic precision -- AI-generated images undermine these values. Warm Artisan values handcraft -- AI-generated images feel manufactured.
**Instead:** Always check the Archetype Image Stance table before generating. "Avoid" means no AI images. "Cautious" means only when no alternative exists, with extra quality review.

### Anti-Pattern: No Negative Prompts

**What goes wrong:** Prompts omit forbidden patterns from negative prompts. AI generates elements that violate DNA constraints -- gradients in a no-gradient archetype, organic curves in a geometric archetype, neon in a muted palette. The resulting images create visual dissonance with the UI.
**Instead:** Always derive negative prompts from DNA forbidden patterns using the automatic generation rules table. Include universal negatives (no text, logos, watermarks) and quality negatives (no artifacts, blur) on every prompt.

### Anti-Pattern: Generic Prompts Without DNA

**What goes wrong:** Prompts like "a beautiful abstract background" or "modern tech illustration" without DNA modifiers produce generic imagery that could belong to any project. The images don't match the project's visual identity and the site looks like a template.
**Instead:** Every prompt must include at minimum: archetype style modifier, DNA color direction (specific token references), and mood modifier. The DNA-to-Prompt Translation Matrix ensures systematic coverage of all DNA attributes.

### Anti-Pattern: AI Images for Everything

**What goes wrong:** Every visual element on the page is AI-generated. This creates a homogeneous, artificial feeling -- "AI slop." The site lacks the variety and authenticity that comes from mixing media types. Award-winning sites blend photography, illustration, procedural graphics, and typography.
**Instead:** Use AI-generated images strategically for specific needs. Mix with: procedural shapes (via `shape-asset-generation`), real photography, hand-crafted illustrations, CSS/SVG patterns, and typography as visual element. AI images should complement, not replace, diverse visual sources.

### Anti-Pattern: Color Mismatch Acceptance

**What goes wrong:** AI-generated images have colors that approximate but don't match DNA tokens. A hero background uses a slightly different blue than the UI's `--color-primary`. The disconnect is subtle but creates a "not quite right" feeling that reviewers and users notice.
**Instead:** Specify DNA colors precisely in prompts using hex values or descriptive color names derived from DNA tokens. After generation, evaluate color match. If colors drift, apply CSS filters (`filter: hue-rotate()`, `mix-blend-mode`, overlay with DNA-colored gradient) to bring images into palette alignment. For backgrounds, consider CSS gradient overlay at low opacity to tint toward DNA colors.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| prompt-sections | 4 | 6 | count | HARD -- every prompt must include subject, style, mood, color at minimum |
| negative-prompt-items | 3 | - | count | HARD -- at minimum: DNA forbidden patterns + universal + quality negatives |
| archetype-stance-check | 1 | 1 | boolean | HARD -- must verify archetype image stance before generating |
| color-token-references | 2 | - | count | HARD -- at minimum primary and accent DNA colors referenced |
| consistency-modifiers-match | 100 | 100 | percent | SOFT -- all images in a set should use identical style/mood modifiers |
| ai-image-ratio | 0 | 30 | percent | SOFT -- AI images should not exceed ~30% of total visual elements |
| real-team-photos | 100 | 100 | percent | HARD -- actual team members must use real photography |
