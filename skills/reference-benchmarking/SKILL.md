---
name: reference-benchmarking
description: "Defines per-section quality targets from award-winning sites. Provides curated reference library per archetype, PLAN.md reference target format, and quality comparison protocol."
tier: core
triggers: "reference, quality target, benchmark, quality bar, comparison, reference target, quality comparison"
used_by: "planner, quality-reviewer, researcher"
version: "2.0.0"
---

## Layer 1: Decision Guidance

Builders produce higher quality when they have a concrete visual bar, not abstract instructions. "Match Linear's hero quality -- split layout, gradient text, staggered reveal, 3-layer depth" is actionable. "Make it award-winning" is not. Reference benchmarking gives every key section a specific quality target extracted from real award-winning implementations.

### When to Use

- **During section planning** (planner agent): Generate `reference_target` frontmatter and `<reference_quality_target>` blocks in each key section's PLAN.md
- **During research** (researcher agent): Supplement the curated library with per-project industry-specific references found during the research phase
- **During quality review** (quality-reviewer agent): Compare built output against the reference targets using Claude's multimodal capability
- **During iteration** (`/gen:iterate`): Update reference targets if the project pivots to a different archetype or industry

### When NOT to Use

- On supporting sections (TEASE, BUILD, BREATHE, PROOF) -- these rely on DNA + archetype constraints alone. Over-constraining supporting sections kills visual rhythm.
- On Wave 0 scaffold output -- scaffold is structural, not visual
- As a pixel-perfect matching system -- references set a quality BAR, not a design to copy

### Which Sections Get Reference Targets

Key beats only. This is a LOCKED DECISION. Supporting sections intentionally do NOT get reference targets because their quality comes from restraint, organization, and content specificity -- not from visual spectacle.

| Beat Type | Gets Reference Target? | Reason |
|-----------|----------------------|--------|
| HOOK (Hero) | YES | First impression, highest visual impact, sets the entire quality bar |
| PEAK | YES | Screenshot moment, maximum wow, the section users share |
| CLOSE (CTA) | YES | Conversion point, must be compelling enough to act on |
| TENSION (level 3+) | YES | Creative tension at high intensity needs a quality bar to prevent chaos |
| TEASE | No | Low complexity, DNA + archetype sufficient. Quality is in subtlety |
| BUILD | No | Dense/functional sections. Quality is in information organization |
| BREATHE | No | Minimal elements. Quality is in restraint and whitespace |
| PROOF | No | Content-driven. Quality is in specificity and authenticity |
| REVEAL | Conditional | YES if it is the product showcase moment; No if it is supporting |
| PIVOT | No | Transitional. Quality is in the narrative shift, not visual complexity |

### Hybrid Approach (LOCKED DECISION)

Reference targets come from TWO sources, combined:

1. **Curated library** (this skill) -- per-archetype baseline references with pre-extracted quality attributes. Provides the archetype's timeless quality personality. Updated periodically.
2. **Per-project research** (researcher agent) -- industry-specific current winners found during the research phase of `/gen:start-project`. Provides fresh, domain-relevant references.

The planner combines both sources when generating reference targets for PLAN.md files. Curated library provides the archetype baseline; per-project research provides industry specificity.

### Pipeline Connection

- **Referenced by:** planner agent during `/gen:plan` (generates reference targets in PLAN.md)
- **Referenced by:** quality-reviewer agent during post-wave verification (comparison protocol)
- **Referenced by:** researcher agent during `/gen:start-project` (supplements curated library)
- **Consumed at:** plan workflow step 3 (section planning with reference targets)

---

## Layer 2: Award-Winning Examples

### PLAN.md Reference Target Format

Every key section's PLAN.md includes two reference artifacts: frontmatter metadata and a detailed quality target block.

#### Frontmatter Format

```yaml
---
section: 02-hero
beat: HOOK
wave: 2
builder_type: section
reference_target:
  url: "https://linear.app"
  section: "hero"
  quality_bar: "Split layout with product screenshot, gradient text at -0.04em tracking, staggered entrance reveal, 3-layer ambient depth"
  screenshot: ".planning/genorah/references/02-hero-target.png"
layout_pattern: "split-asymmetric"
---
```

The `reference_target` frontmatter gives builders an at-a-glance quality summary. The `screenshot` field is optional -- populated when the researcher captures a screenshot during research, omitted when only the curated library's text attributes are available.

#### Quality Target Block Format

The `<reference_quality_target>` block goes in the PLAN.md body. It specifies 6 quality attributes that the builder must match or exceed. Every attribute must be SPECIFIC -- not "nice typography" but "display font at -0.04em tracking, gradient from white to white/40."

```markdown
<reference_quality_target>
**Reference:** [Site Name] - [Section Type]
**Source:** [URL or .planning/genorah/references/XX-section-target.png]
**Beat:** [Beat type this section is assigned]

**Quality Attributes to Match or Exceed:**
1. Layout: [specific composition -- ratios, alignment, overlap, spatial relationship between elements]
2. Typography: [specific font effects -- tracking, gradient, weight contrast, size relationships]
3. Color: [specific approach -- layer count, shadow colors, gradient complexity, token usage]
4. Motion: [specific animation -- entrance choreography, scroll integration, timing, stagger]
5. Depth: [specific technique -- shadow layers, glass effects, overlaps, perspective, elevation]
6. Micro-detail: [specific finishing touches -- textures, borders, cursor effects, selection color, noise]

**Quality Bar Question:** Would this section win a direct visual comparison against the reference?
</reference_quality_target>
```

### Example 1: Neo-Corporate Hero (HOOK Beat)

```markdown
<reference_quality_target>
**Reference:** Linear - Hero Section
**Source:** https://linear.app
**Beat:** HOOK

**Quality Attributes to Match or Exceed:**
1. Layout: Asymmetric split (55/45) with product screenshot on right bleeding past container edge. Headline block left-aligned with badge above, description below, dual CTAs at bottom. Generous vertical padding (min 90vh).
2. Typography: Display font at -0.04em tracking on headline, gradient from white to white/40 on secondary text. Badge uses mono font at 0.1em tracking with uppercase. Weight contrast: 700 headline, 400 body, 500 CTA.
3. Color: Dark bg-primary base. Product screenshot framed with subtle bg-secondary card. Accent-1 used on primary CTA and badge dot. Glow token at 8% opacity behind product for ambient light. No more than 3 distinct hues visible.
4. Motion: Staggered entrance sequence -- badge (0ms) then headline (100ms) then description (200ms) then CTAs (300ms). Elements enter from bottom with 20px translateY. Product screenshot fades in with 0.8s delay and subtle scale from 0.97. Total choreography under 1.2s.
5. Depth: Product screenshot has colored shadow (accent-1 at 15% opacity, 40px blur). Card surface uses 2-layer shadow (tight dark shadow + diffuse colored shadow). Badge has inner border at white/10. Subtle glass blur on nav above.
6. Micro-detail: Noise texture at 3% opacity on dark bg-primary surface. Gradient border (white/8 to white/2) on product card. Custom cursor on CTA hover (pointer with subtle scale). Grid dot pattern at 2% opacity visible in background.

**Quality Bar Question:** Would this hero win a direct visual comparison against Linear's hero?
</reference_quality_target>
```

### Example 2: Kinetic Peak Section (PEAK Beat)

```markdown
<reference_quality_target>
**Reference:** Basement Studio - Interactive Showcase
**Source:** https://basement.studio
**Beat:** PEAK

**Quality Attributes to Match or Exceed:**
1. Layout: Full-bleed interactive viewport (100vh minimum). Content overlays the interactive element with knockout text or floating labels. No visible container -- the experience IS the layout. Scroll-locked or scroll-driven with continuous progress.
2. Typography: Oversized display text (clamp(4rem, 10vw, 12rem)) as the focal point. Variable font weight animation on scroll (300 to 900). Text may be part of the 3D scene or masked by interactive content. Extreme tracking contrast: -0.06em on display, 0.15em on floating labels.
3. Color: Full expressive palette deployed -- glow token for light emission, tension token for energy accents, signature token for brand mark. Background transitions through 2-3 color states during scroll interaction. High contrast ratios (white on dark or vice versa) for maximum drama.
4. Motion: Continuous scroll-driven animation with timeline scrubbing (not just entrance triggers). Parallax at 3+ layers of depth. Element transforms tied to scroll position: rotation, scale, translateZ. Frame rate must sustain 60fps. Total interaction duration spans 200-400vh of scroll distance.
5. Depth: True 3D perspective or convincing parallax creating real spatial depth. Z-axis separation between foreground content and background elements. Shadow direction shifts with scroll to simulate light source movement. Elements overlap across depth layers.
6. Micro-detail: Particle effects or floating elements responding to scroll velocity. Scroll progress indicator (thin bar or dot navigation). Smooth momentum on scroll release. Sound design cue on key interaction moments (optional, archetype-dependent).

**Quality Bar Question:** Would this section make users stop scrolling to interact, then screenshot to share?
</reference_quality_target>
```

### Example 3: Ethereal CTA/Close Section (CLOSE Beat)

```markdown
<reference_quality_target>
**Reference:** Stripe - Final CTA Section
**Source:** https://stripe.com
**Beat:** CLOSE

**Quality Attributes to Match or Exceed:**
1. Layout: Centered composition with extreme vertical breathing room (py-40 to py-64). Single headline, single supporting line, one or two CTAs. Total element count under 6. Content occupies less than 30% of the viewport -- whitespace IS the design. Max-width constraint (max-w-2xl) creating intimate reading width.
2. Typography: Display headline at largest scale (text-6xl to text-8xl). Serif accent on a single word or the entire headline for emotional warmth. Line height ultra-tight (1.0-1.05) on display. Body text at generous size (text-lg) with comfortable leading (1.7). Gradient text optional but if present, uses soft warm-to-cool transition.
3. Color: Shift to a warmer palette register -- bg moves from primary to a softer surface tone. Accent color at full saturation for CTA button. Surrounding elements desaturated to push CTA forward. Background may introduce a subtle gradient (not flat). Overall feeling: calm, confident, inviting.
4. Motion: Gentle entrance: single fade-up with slow timing (800-1000ms, ease-out). NO stagger -- unified appearance. CTA button has a breathing animation (subtle scale pulse at 4s interval) to draw eye. Scroll-triggered but with generous trigger offset (appears early, animates slowly as user approaches).
5. Depth: Minimal but precise -- CTA button has elevated shadow (3-layer: tight, medium spread, diffuse glow in accent color). Background has a soft radial gradient creating a spotlight effect centered on the CTA. No glass, no blur -- depth through shadow and light only.
6. Micro-detail: Custom selection color visible on the headline text. CTA hover: shadow expands + subtle upward shift (translateY -2px) + background brightens. Focus ring on CTA matches accent color. Subtle SVG ornament or divider element above the section to signal transition.

**Quality Bar Question:** Would this CTA section feel so inviting that users click without hesitation?
</reference_quality_target>
```

### Curated Reference Library

The curated library provides per-archetype baseline references. The top 5 most common archetypes get full reference sets with specific section-level quality attributes. Other archetypes get quality personality definitions and archetype-level attributes that the researcher agent supplements with specific sites per project.

#### Structure Per Archetype

```markdown
## Archetype: [Name]

### Quality Personality
[3-5 sentences defining what "excellent" means for this archetype. What makes a site
in this archetype go from good to award-winning? What specific craft details matter most?]

### Reference Sites
| Site | Archetype Fit | Key Sections | Quality Signals |
|------|--------------|-------------|-----------------|
| [name] | [why it exemplifies this archetype] | Hero, Features, CTA | [top 3 quality signals] |
| [name] | [archetype fit] | [sections] | [signals] |
| [name] | [archetype fit] | [sections] | [signals] |

### Per-Section Quality Attributes
#### Hero (HOOK)
- Layout: [what great heroes look like for this archetype]
- Typography: [specific type treatments that define the archetype's hero]
- Motion: [entrance choreography style]
- Signature: [what makes it distinctly this archetype's hero, not generic]

#### Peak (PEAK)
- Layout: [what peak moments look like]
- Interactive: [what level of interactivity defines excellence]
- Wow Factor: [what makes users screenshot this section]

#### CTA (CLOSE)
- Layout: [how close sections feel for this archetype]
- Emotional Register: [what emotional quality the close should have]
- Conversion Design: [how the archetype's personality serves conversion]
```

---

#### Archetype: Neo-Corporate

**Quality Personality:**
Excellence in Neo-Corporate means precision engineering made visible. Every pixel aligns to an invisible grid, then one element deliberately breaks it. Color is restrained (near-monochrome with a single accent) but depth is lavish (layered shadows, subtle gradients, glass surfaces). Typography does heavy lifting -- the font choice IS the brand. Motion is confident and crisp: quick entrances (300-500ms), no bouncing, no playfulness. The hallmark of a great Neo-Corporate site is that it feels effortless and inevitable, as if no other design was possible.

**Reference Sites:**

| Site | Archetype Fit | Key Sections | Quality Signals |
|------|--------------|-------------|-----------------|
| Linear (linear.app) | Definitive Neo-Corporate: dark, precise, product-first | Hero, Features Grid, CTA | Gradient text, layered product shadows, mono badge typography |
| Vercel (vercel.com) | Extreme negative space, dramatic typography | Hero, Deploy Animation, Pricing | 12rem headlines, scroll-driven deploy sequence, grid-breaking hero |
| Raycast (raycast.com) | Dark UI + vibrant accents, keyboard-first | Hero, Command Palette, Extensions | Glass morphism, colored shadows, keyboard interaction showcase |
| Resend (resend.com) | Minimal dark with code-forward product shots | Hero, API Demo, Developer CTA | Code block styling, terminal aesthetics, developer-authentic voice |

**Per-Section Quality Attributes:**

**Hero (HOOK):**
- Layout: Asymmetric split or dramatic centered. Product screenshot prominent. Container max-width with bleed on media element.
- Typography: Display font with negative tracking (-0.03 to -0.05em). Gradient text on headline or subhead. Weight contrast between headline (700-800) and body (400).
- Motion: Staggered entrance with 80-120ms intervals. Elements enter from bottom (translateY 16-24px). Total sequence under 1s. No bounce, no overshoot.
- Signature: The product IS the hero. Screenshot with perspective, colored shadow, ambient glow behind it.

**Peak (PEAK):**
- Layout: Full-width or full-bleed interactive showcase. Feature deep-dive with tabbed or scroll-driven reveal.
- Interactive: Live-feeling product demo or animated workflow. Scroll-driven state changes showing product capabilities.
- Wow Factor: The transition between states -- morphing UI, animated data flow, real-time visual feedback.

**CTA (CLOSE):**
- Layout: Centered, spacious, confident. Single headline, minimal supporting text, one prominent CTA.
- Emotional Register: Authoritative calm. "You know this is right."
- Conversion Design: CTA button has elevated shadow and distinct color. Surrounding whitespace pushes focus. No competing elements.

---

#### Archetype: Kinetic

**Quality Personality:**
Excellence in Kinetic means the page is alive. Nothing is static -- every element responds to scroll, cursor, or time. The quality bar is measured in frame rate and choreography precision. A great Kinetic site has motion that feels INTENTIONAL, not decorative: each animation communicates something (speed, energy, transformation). Scroll interaction should create a "flow state" where the user loses track of time. Poor Kinetic sites have motion for motion's sake; excellent ones make you feel the motion IS the content.

**Reference Sites:**

| Site | Archetype Fit | Key Sections | Quality Signals |
|------|--------------|-------------|-----------------|
| Basement Studio (basement.studio) | Motion-first agency, 3D + scroll mastery | Full-page 3D, Case Studies, About | WebGL scroll integration, variable font animation, custom cursor |
| Lusion (lusion.co) | Experimental WebGL, particle systems | Immersive Hero, Project Gallery | Real-time 3D, shader effects, sound integration |
| Locomotive (locomotive.ca) | Smooth scroll pioneers, transition experts | Hero, Project Grid, Contact | Custom smooth scroll, page transitions, magnetic elements |
| Aristide Benoist (aristidebenoist.com) | Personal portfolio with scroll-driven reveals | Project Showcase, Bio, Contact | Horizontal scroll, image parallax, text splitting animation |

**Per-Section Quality Attributes:**

**Hero (HOOK):**
- Layout: Full-viewport immersive. Content integrated with or overlaid on the motion element. No separation between "hero" and "animation."
- Typography: Variable font animation or text splitting on scroll. Display text IS interactive -- moves, morphs, or reveals on user input.
- Motion: Immediate interaction response. Something moves within 100ms of page load. Custom cursor appears immediately. Scroll hint animated.
- Signature: The hero IS the motion. Not a static layout with animation added -- the animation is the primary content.

**Peak (PEAK):**
- Layout: Scroll-locked or scroll-driven interactive sequence spanning 200-400vh.
- Interactive: Continuous scroll-driven animation with smooth scrubbing. 3+ parallax layers. Frame rate never drops below 45fps.
- Wow Factor: A moment where the user realizes their scrolling is controlling something complex and beautiful.

**CTA (CLOSE):**
- Layout: Return to simplicity after kinetic intensity. Centered, calm, but with one subtle motion element (floating element, breathing CTA, gentle parallax).
- Emotional Register: Satisfied calm after an energizing experience. "That was incredible -- now act."
- Conversion Design: CTA has magnetic hover effect. Surrounding space has one ambient motion (particles, gradient shift, floating shape) to maintain the kinetic identity without competing.

---

#### Archetype: Ethereal

**Quality Personality:**
Excellence in Ethereal means beauty through restraint and atmosphere. Whitespace is not empty -- it is the primary design material. Colors are soft, desaturated, and layered (never flat). Typography uses serif accents for warmth and emotional resonance. Motion is slow, gentle, and continuous (breathing animations, floating elements, slow gradient shifts). A great Ethereal site feels like stepping into a calm, beautiful space. The quality bar is in the FEELING it evokes: tranquility, elegance, aspiration. Poor Ethereal sites are just "light and empty"; excellent ones are "light and luminous."

**Reference Sites:**

| Site | Archetype Fit | Key Sections | Quality Signals |
|------|--------------|-------------|-----------------|
| Aesop (aesop.com) | Premium restraint, tactile photography, serif elegance | Product Hero, Ingredients, Store Finder | Serif/sans pairing, earth tones, editorial photography |
| Kering (kering.com) | Luxury group, extreme whitespace, typographic confidence | Hero, Brand Portfolio, Values | Dramatic serif headlines, minimal nav, generous padding |
| Cuyana (cuyana.com) | Sustainable luxury, warm minimalism, editorial feel | Hero, Product Grid, Story Section | Soft earth palette, serif accents, editorial layout |

**Per-Section Quality Attributes:**

**Hero (HOOK):**
- Layout: Centered or asymmetric with extreme whitespace (py-48+). Few elements (headline, subline, single CTA or scroll indicator). Image if present is editorial/atmospheric, not product-focused.
- Typography: Large serif display font (or serif accent on key word). Ultra-tight line height (1.0) on display. Body in refined sans-serif at generous size. Tracking natural to slightly loose.
- Motion: Slow fade-in (800-1200ms). Single unified entrance, no stagger (stagger feels too mechanical for Ethereal). Optional: floating gradient orb with 8-12s animation cycle in background.
- Signature: Atmospheric quality -- the hero feels like a space you could inhabit, not a layout to read. Light, air, and typography create the mood.

**Peak (PEAK):**
- Layout: Full-viewport atmospheric moment. Minimal content floating in spacious environment. May use parallax for gentle depth.
- Interactive: Subtle, ambient interaction. Cursor influence on floating elements. Slow scroll-driven opacity/position shifts. Nothing jarring.
- Wow Factor: The moment you realize the page is breathing -- subtle animations you did not notice at first but that create an unconscious sense of life.

**CTA (CLOSE):**
- Layout: Extreme minimalism. Single centered block with maximum breathing room. Possibly just a headline and a text link (not even a button).
- Emotional Register: Intimate whisper. "This could be yours."
- Conversion Design: The restraint IS the persuasion. One perfectly crafted sentence. One beautifully styled CTA. Nothing else competing for attention.

---

#### Archetype: Editorial

**Quality Personality:**
Excellence in Editorial means typographic mastery and information hierarchy. The page reads like a beautifully designed magazine spread. Type sizes create dramatic scale contrast (tiny labels vs. massive headlines). Layout uses asymmetric columns, pull quotes, and intentional white space borrowed from print design. Images are editorial-quality and precisely cropped. Motion is minimal and purposeful -- smooth page transitions, subtle entrance animations that do not distract from reading. A great Editorial site makes you want to READ it, not just scroll through it.

**Reference Sites:**

| Site | Archetype Fit | Key Sections | Quality Signals |
|------|--------------|-------------|-----------------|
| Monocle (monocle.com) | Print-digital hybrid, typographic confidence | Article Layout, Navigation, Archive | Multi-column layout, serif/sans pairing, editorial photography |
| It's Nice That (itsnicethat.com) | Creative editorial, bold typography, grid mastery | Hero, Article Grid, Feature Story | Variable grid, bold color blocks, typographic scale contrast |
| Bloomberg (bloomberg.com/businessweek) | Data + editorial, information density, typographic drama | Cover Story, Data Viz, Article | Extreme type scale, data integration, editorial illustration |

**Per-Section Quality Attributes:**

**Hero (HOOK):**
- Layout: Asymmetric or multi-column like a magazine cover. Large headline dominates with small metadata (date, category, author) providing typographic counterpoint. Image cropped and positioned editorially (not centered product shot).
- Typography: Maximum scale contrast -- headline at 8xl-9xl, body at lg. Mixed serif + sans. Pull-quote styling ready. Decorative initial cap optional.
- Motion: Minimal -- clean entrance, possibly a subtle parallax on the editorial image. The typography is the motion.
- Signature: It looks like a SPREAD, not a web page. Print-inspired layout that could exist in a magazine.

**Peak (PEAK):**
- Layout: Feature story format with mixed-width columns, inline images, pull quotes, and data callouts.
- Interactive: Smooth scroll with typographic reveals. Data visualizations that animate on scroll. Inline interactive elements.
- Wow Factor: A layout so well-composed that you forget you are scrolling a web page -- it feels like turning pages.

**CTA (CLOSE):**
- Layout: Simple, confident, editorial sign-off. Like the last page of a magazine with subscription info.
- Emotional Register: Professional invitation. "Join the conversation."
- Conversion Design: Typography-forward CTA. The headline copy does the selling. Button is simple and understated.

---

#### Archetype: Luxury/Fashion

**Quality Personality:**
Excellence in Luxury means every surface communicates exclusivity. Photography is the star -- editorial, aspirational, perfectly lit. Color palettes are limited and sophisticated (black/white/gold, or deep muted tones). Typography is refined: thin weights, generous tracking on uppercase, serif display fonts. Motion is smooth and unhurried (600-900ms transitions, elegant easing). White space is generous -- the page never feels crowded because scarcity communicates luxury. A great Luxury site makes you feel like you are being welcomed into an exclusive space.

**Reference Sites:**

| Site | Archetype Fit | Key Sections | Quality Signals |
|------|--------------|-------------|-----------------|
| Bottega Veneta (bottegaveneta.com) | Extreme minimalism, photography dominance, restrained palette | Full-bleed Hero, Product Grid, Campaign | Photography-first, minimal UI, elegant transitions |
| Cartier (cartier.com) | Premium craft, subtle animation, gold accents | Hero, Product Showcase, Heritage | Smooth page transitions, refined hover states, editorial photography |
| Jacquemus (jacquemus.com) | Fashion-forward, bold imagery, playful luxury | Lookbook, Campaign, Shop | Full-bleed images, creative layout, brand personality |

**Per-Section Quality Attributes:**

**Hero (HOOK):**
- Layout: Full-bleed editorial photography or video. Text overlay minimal -- brand name, season, single CTA. Image occupies 80%+ of viewport.
- Typography: Thin weight serif or elegant sans (200-300 weight). Uppercase with wide tracking (0.1-0.2em). Small, precise, confident.
- Motion: Slow crossfade or cinematic reveal (800-1200ms). Image may have subtle Ken Burns (slow zoom/pan). No flashy entrance -- elegance through timing.
- Signature: The photography quality IS the hero. Image selection and cropping communicate more than any layout could.

**Peak (PEAK):**
- Layout: Product showcase with editorial framing. Large product image with minimal UI. Detail views on hover or scroll.
- Interactive: Smooth image transitions. Product rotation or zoom. Elegant cursor feedback.
- Wow Factor: Image transition quality -- the smoothness between product views or campaign images feels cinematic.

**CTA (CLOSE):**
- Layout: Minimal, refined. Possibly just a brand mark and a single text link. Maximum restraint.
- Emotional Register: Exclusive invitation. "Discover the collection."
- Conversion Design: The CTA barely looks like a CTA -- it is an invitation styled as editorial text. The luxury is in making the action feel like a privilege.

---

#### Other Archetypes (Quality Personality Only)

For archetypes not in the top 5, the planner uses the quality personality definition below combined with per-project research from the researcher agent.

| Archetype | Quality Personality Summary | Key Quality Signals |
|-----------|---------------------------|-------------------|
| Brutalist | Raw power through exposed structure. Quality = intentional roughness, not laziness. Hard shadows, visible grid, mono type, no rounded corners, no gradients. | Structural honesty, rotated elements, hard drop shadows, mono typography |
| Retro-Future | Nostalgic future vision. Quality = authentic retro aesthetics + modern craft. CRT effects, scan lines, retro color palettes, analog textures digitally rendered. | Authentic period detail, CRT/grain textures, retro-future typography, neon on dark |
| Playful/Startup | Joyful energy through bouncy motion + saturated color. Quality = coordinated playfulness, not chaos. Illustrations, rounded shapes, bouncy easing, bright palette. | Illustrated elements, bouncy motion, saturated palette, friendly typography |
| Data-Dense | Information density with clarity. Quality = dense but readable, never cluttered. Small type, tight grids, data viz, monospace, high information-to-pixel ratio. | Data visualization, information hierarchy, monospace UI, dense grids |
| Japanese Minimal | Essence through removal. Quality = extreme restraint where every element earns its place. Massive whitespace, single focal points, subtle seasonal color. | Extreme whitespace, nature-inspired color, zen composition, subtle motion |
| Glassmorphism | Material quality through transparency. Quality = realistic glass physics (blur, refraction, border light). Multiple glass layers at different opacities creating depth. | Backdrop blur layers, gradient borders, frosted surfaces, light refraction |
| Neon Noir | Cyberpunk atmosphere. Quality = cinematic lighting on dark surfaces. Neon glow with realistic falloff, dark texture layers, dramatic color contrast. | Neon glow with falloff, dark textured surfaces, cinematic lighting, animated gradients |
| Warm Artisan | Handmade craft digitized. Quality = tactile textures (paper, wood, fabric) rendered with care. Hand-drawn elements, warm earth tones, organic shapes. | Paper/craft textures, hand-drawn elements, warm earth palette, organic shapes |
| Swiss/International | Grid perfection. Quality = mathematical precision in spacing, alignment, and proportion. Strict grid, Helvetica or equivalent, systematic color, no decoration. | Grid precision, systematic spacing, Helvetica-class typography, no decoration |
| Vaporwave | Aesthetic nostalgia. Quality = curated retro-digital aesthetic, not random 80s/90s clipart. Gradient meshes, Windows 95 UI, marble/bust imagery, pastel-neon. | Gradient meshes, retro-digital UI, pastel-neon palette, Roman bust imagery |
| Neubrutalism | Flat + bold + playful. Quality = intentional flatness with strong personality. Solid fills, thick borders, exaggerated shadows (4px_4px_0), bright clashing colors. | Thick borders, hard drop shadows, flat bright colors, exaggerated UI elements |
| Dark Academia | Scholarly elegance. Quality = rich, warm dark palettes with serif typography and library aesthetics. Deep burgundy/forest/navy, aged paper textures, classical references. | Serif typography, warm dark palette, classical ornaments, library textures |
| AI-Native | Machine intelligence made visible. Quality = data viz as decoration, monospace as identity, blue-purple palette, living data streams. | Monospace typography, data visualization, blue-purple palette, live data aesthetics |
| Organic | Nature-inspired flow. Quality = no straight lines, organic shapes, biomorphic layout, earthy palette, growing/flowing motion. | Biomorphic shapes, organic layout, earth palette, growth-inspired motion |

### Researcher Agent: Supplementing the Curated Library

During `/gen:start-project`, the researcher agent runs a REFERENCES track that supplements the curated library with per-project industry-specific references.

**Researcher instructions for reference supplementation:**

1. **Search for current winners** -- find 3-5 Awwwards SOTD/Honoree winners in the target industry from the last 12 months
2. **Extract quality attributes** -- for each reference, extract the same 6 attributes (Layout, Typography, Color, Motion, Depth, Micro-detail) for key sections
3. **Map to archetype** -- note which archetype each reference most closely matches and where it deviates
4. **Capture screenshots** -- save section screenshots to `.planning/genorah/references/` with descriptive filenames
5. **Output format** -- write findings to `.planning/genorah/research/DESIGN-REFERENCES.md` using the same attribute structure as the curated library
6. **Freshness matters** -- prioritize references from the last 6 months. Flag any reference older than 18 months as potentially stale

**What the researcher does NOT do:**
- Does not replace the curated library -- supplements it
- Does not assign reference targets to sections -- the planner does that
- Does not judge which sections need targets -- beat scoping rules (this skill) determine that

---

## Layer 3: Integration Context

### How Reference Targets Flow Through the Pipeline

```
researcher agent           planner agent         builder agent              quality-reviewer agent
(start-project)            (plan)                    (execute)                  (post-wave review)
      |                          |                            |                            |
  Find current               Read curated                 Read PLAN.md               Read PLAN.md
  industry winners           library (this skill)         reference_target           reference_target
      |                          |                            |                            |
  Extract 6                  + researcher's               See quality bar            Read built code
  quality attributes         research/                    before building           (or screenshot)
                             DESIGN-REFERENCES.md
      |                          |                            |                            |
  Save to                    Generate                     Build to match             Compare each of
  research/                  reference_target             or exceed                  6 attributes
  DESIGN-REFERENCES.md
                             in PLAN.md                                                   |
                                                                                    Write verdict
                                                                                    per attribute
```

### DNA Connection

Reference targets reinforce DNA compliance, not replace it. The 6 quality attributes map to DNA sections:

| Quality Attribute | DNA Section(s) | Relationship |
|-------------------|----------------|-------------|
| Layout | Spacing scale, signature element | Layout uses DNA spacing. Signature element visible in layout composition. |
| Typography | Font stack, type scale | Typography attributes reference DNA-approved fonts and scale values. |
| Color | 12 color tokens | Color attributes reference DNA semantic and expressive tokens exclusively. |
| Motion | Motion tokens (8+) | Motion attributes reference DNA easing, duration, and delay tokens. |
| Depth | (Implicit via archetype) | Depth techniques appropriate to archetype's visual personality. |
| Micro-detail | Signature element | Micro-detail includes DNA signature element and archetype-specific polish. |

### Archetype Connection

The curated library is organized BY archetype because quality looks different for each personality. A "great hero" in Neo-Corporate (dark, precise, product-screenshot) is entirely different from a "great hero" in Ethereal (soft, spacious, atmospheric).

The planner selects reference targets from the matching archetype's library. Cross-archetype references are only used when the project explicitly blends archetypes (documented in DESIGN-DNA.md).

### Quality-Reviewer Comparison Protocol

When the quality-reviewer evaluates a built section against its reference target, it follows this protocol:

**Step 1: Read the reference target**
Read the section's `<reference_quality_target>` block from its PLAN.md. Internalize all 6 quality attributes.

**Step 2: Read the built output**
Read the section's code files. If a screenshot is available (from live testing), examine that too. Claude's multimodal capability reads both code structure and visual output.

**Step 3: Compare each attribute**
For each of the 6 quality attributes, assess whether the built section matches or exceeds the reference:

| Attribute | Verdict | Criteria |
|-----------|---------|----------|
| Layout | EXCEEDS / MATCHES / BELOW | Composition, spatial relationships, element positioning |
| Typography | EXCEEDS / MATCHES / BELOW | Font treatment, tracking, hierarchy, typographic surprise |
| Color | EXCEEDS / MATCHES / BELOW | Token usage, palette depth, expressive color |
| Motion | EXCEEDS / MATCHES / BELOW | Choreography quality, timing, scroll integration |
| Depth | EXCEEDS / MATCHES / BELOW | Shadow quality, layering, material effects |
| Micro-detail | EXCEEDS / MATCHES / BELOW | Finishing touches, noise, borders, selection color |

**Step 4: Produce comparison verdict**
- If 0-1 attributes are BELOW: **MATCHES** overall -- quality bar met
- If 2-3 attributes are BELOW: **BELOW** overall -- flag as gap in GAP-FIX.md
- If 4+ attributes are BELOW: **SIGNIFICANTLY BELOW** -- flag as major gap

**Step 5: Write GAP-FIX entry (if needed)**
For any attribute rated BELOW, include in the section's GAP-FIX.md:
- Which attribute fell short
- What the reference target specified
- What the built section produced
- Specific fix instruction

**Step 6: Contextualize the verdict**
Reference comparison is a WARNING signal, not a CRITICAL failure. Reference targets are aspirational -- they show what "excellent" looks like. A section can still pass the anti-slop gate while being BELOW on reference comparison. However, consistent BELOW verdicts across multiple sections indicate the overall quality bar is not being met.

### Comparison is Judgment, Not Pixel-Matching

The quality-reviewer is making a holistic quality judgment, not a pixel-by-pixel comparison. The question is: "If you showed both sections side by side to a design-literate person, would they judge the built section as comparable quality?"

This judgment is inherently subjective. The quality-reviewer should:
- Be generous with "MATCHES" when the spirit is right even if details differ
- Be honest with "BELOW" when the craft quality is visibly lower
- Use "EXCEEDS" sparingly -- only when the built section is genuinely better than the reference

### Related Skills

- **anti-slop-gate** -- Reference comparison is separate from anti-slop scoring. A section can score 30/35 on anti-slop but be BELOW on reference comparison (or vice versa). Both assessments contribute to the quality picture.
- **design-archetypes** -- The curated library is organized by archetype. Archetype selection determines which reference entries are relevant.
- **emotional-arc** -- Beat type determines which sections get reference targets (key beats only). Beat parameters (whitespace %, viewport height) are separate from reference quality attributes.
- **compositional-diversity** (Phase 4) -- Layout diversity is enforced structurally via MASTER-PLAN.md. Reference targets may reinforce layout expectations but do not replace diversity enforcement.

### Pipeline Stage

- **Input from:** Researcher agent (per-project research/DESIGN-REFERENCES.md), planner (combines curated + research references)
- **Output to:** PLAN.md files (reference_target frontmatter + quality target blocks), quality-reviewer (comparison verdicts)

---

## Layer 4: Anti-Patterns

### Anti-Pattern: URL-Only References

**What goes wrong:** Reference target is just a URL: `reference: "https://linear.app"`. The builder visits the site, gets a vague impression, builds something "inspired by Linear" that misses every specific quality detail -- the gradient text, the layered shadows, the staggered entrance timing.

**Instead:** Every reference target must include the 6 extracted quality attributes with specific, measurable details. The URL is provenance; the attributes are the actionable content. A builder should be able to build to the quality bar WITHOUT visiting the URL.

### Anti-Pattern: References on Every Section

**What goes wrong:** A 10-section page where every section has a reference target. Builders spend excessive context reading and comparing. Supporting sections (Build, Breathe, Proof) become over-designed -- a BREATHE section with a reference target stops being restful because the builder tries to match a visually complex reference.

**Instead:** Key beats only (HOOK, PEAK, CLOSE, high-tension). Supporting sections rely on DNA + archetype constraints. Their quality comes from restraint and organization, which cannot be captured in a visual reference target. A BREATHE section's quality is measured by how little is in it, not by comparison to another site.

### Anti-Pattern: Stale References

**What goes wrong:** The curated library uses sites that were award-winning 2+ years ago. Design trends evolve rapidly -- a 2024 reference in 2026 may look dated. Builders target an outdated quality bar and produce work that feels behind.

**Instead:** The curated library provides TIMELESS quality attributes (composition, typography treatment, depth technique) rather than time-sensitive specifics (exact color palettes, current visual trends). Per-project research by the researcher agent provides fresh, current references. Reference entries include a date field so staleness is visible and flagged.

### Anti-Pattern: Cross-Archetype References

**What goes wrong:** An Ethereal project gets a Brutalist reference target because the Brutalist site had a "great hero." The builder tries to reconcile soft, atmospheric Ethereal design with raw, structural Brutalist layout. The result is confused and neither archetype.

**Instead:** Reference targets MUST come from the project's assigned archetype (or closely related archetypes). Cross-archetype references are only valid when the project's DESIGN-DNA.md explicitly documents archetype blending. The planner validates archetype alignment when generating reference targets.

### Anti-Pattern: Copying Instead of Competing

**What goes wrong:** Builder treats the reference target as a design to replicate. They produce a section that looks like a cheap clone of the reference site -- same layout, same colors, same animation, but with the project's content swapped in.

**Instead:** The reference sets a QUALITY BAR, not a design to copy. The 6 attributes describe the LEVEL of craft (e.g., "layered shadows" not "this exact shadow"), not the specific visual design. The quality bar question -- "Would this section win a direct visual comparison?" -- means the built section should be AS GOOD AS OR BETTER THAN the reference, not identical to it. It should be unmistakably the project's own design.

### Anti-Pattern: Ignoring Reference Comparison Results

**What goes wrong:** Quality-reviewer produces reference comparison verdicts (MATCHES/BELOW) but they are never acted on. BELOW verdicts accumulate without consequence. The quality bar erodes over waves as builders learn that reference targets are ornamental.

**Instead:** Reference comparison verdicts feed into the GAP-FIX.md pipeline. While reference comparison is a WARNING (not CRITICAL), consistent BELOW verdicts across 2+ sections in a wave should escalate to a discussion: is the quality bar achievable, or do reference targets need adjustment? The quality-reviewer mentions reference comparison trends in the lessons learned summary.

---

## Machine-Readable Constraints

| Parameter | Value | Unit | Enforcement |
|-----------|-------|------|-------------|
| quality_attributes_count | 6 | attributes per target | HARD -- all 6 must be present |
| quality_attributes | Layout, Typography, Color, Motion, Depth, Micro-detail | list | HARD -- these exact 6 categories |
| max_sections_with_targets | 4 | sections per page | SOFT -- typically 3-4 key beats get targets |
| min_sections_with_targets | 2 | sections per page | SOFT -- at minimum HOOK and PEAK |
| below_threshold_for_gap | 2 | attributes rated BELOW | HARD -- 2+ BELOW triggers GAP-FIX entry |
| curated_archetypes_full | 5 | archetypes | SOFT -- top 5 get full reference sets |
| reference_staleness | 24 | months | SOFT -- flag references older than 24 months |
| comparison_verdict_levels | 3 | levels | HARD -- EXCEEDS, MATCHES, BELOW only |
