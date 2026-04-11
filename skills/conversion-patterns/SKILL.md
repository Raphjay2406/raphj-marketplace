---
name: conversion-patterns
description: "Data-backed conversion design patterns: 10 proven hero layouts, 5 pricing table patterns, 5 social proof patterns, 5 CTA rules, 5 trust signal patterns, 5 feature section patterns, above-the-fold rules, mobile-specific conversion patterns. Each pattern includes layout spec, conversion psychology, and archetype adaptation."
tier: core
triggers: "conversion, landing page, hero section, pricing table, testimonial, social proof, CTA, trust signals, above the fold, feature section, converting, signup, lead generation"
version: "2.5.0"
---

## Layer 1: Decision Guidance

### When to Use

- **Every landing page** -- The primary revenue surface. Every layout decision either earns or loses the conversion. This skill provides the psychological reasoning behind element placement, sizing, and sequencing.
- **Marketing pages** -- Product launches, campaign pages, event registrations. Patterns here map directly to HOOK, BUILD, PROOF, and CLOSE emotional arc beats.
- **SaaS homepages** -- Hero + features + social proof + pricing + CTA is the canonical SaaS flow. This skill specifies exact column ratios, spacing, and element ordering backed by conversion data.
- **Product pages** -- E-commerce product detail pages, app store listings. Trust signals and social proof placement directly impacts add-to-cart rates.
- **Lead generation pages** -- Gated content, newsletter signups, demo requests. CTA rules and above-the-fold principles are critical here.
- **Pricing pages** -- Standalone pricing requires center-stage bias, anchoring, and progressive disclosure patterns from this skill.

### When NOT to Use

- **Internal dashboards** -- Use `dashboard-patterns` instead. Conversion psychology does not apply to authenticated utility interfaces.
- **Documentation sites** -- Use `blog-patterns` instead. Information architecture matters more than conversion funnels.
- **Portfolio/case study pages** -- Use `portfolio-patterns` instead. Storytelling arc matters more than CTA optimization.
- **Pure content pages** -- Blog posts, articles. Use `blog-patterns` for reading experience optimization.

### Decision Tree

- If the page has a single primary goal (signup, purchase, demo request) --> Apply full conversion funnel: Hero + Features + Social Proof + CTA + Trust Signals
- If the page is a pricing page --> Apply pricing table patterns + trust signals + FAQ section
- If the page targets mobile-first audience (>60% mobile traffic) --> Prioritize mobile conversion patterns alongside desktop patterns
- If the page is B2B with complex buying decisions --> Emphasize social proof patterns (logos, case studies, metrics) and feature comparison tables
- If the page is B2C with impulse decisions --> Emphasize urgency, visual proof (video testimonials), and single-click CTAs
- If the archetype is data-dense or dashboard-focused --> Combine with `dashboard-patterns` for hybrid conversion/utility layouts

### Pipeline Connection

- **Referenced by:** `creative-director` during archetype selection -- conversion patterns inform hero layout choice
- **Referenced by:** `builder` during HOOK, BUILD, PROOF, CLOSE beats -- provides exact layout specs for each section type
- **Referenced by:** `planner` during PLAN.md generation -- section specs reference conversion patterns by name
- **Referenced by:** `reviewer` during quality gate -- validates CTA placement, social proof ordering, trust signal presence
- **Consumed at:** `/gen:plan` workflow step 3 (section spec generation)
- **Consumed at:** `/gen:build` workflow steps 2-4 (section implementation)
- **Consumed at:** `/gen:audit` quality gate category "UX Intelligence"

---

## Layer 2: Proven Patterns

### 10 Proven Hero Patterns

Every hero section is the single highest-leverage conversion element on the page. Users form a first impression in 50ms and decide to stay or leave within 3-5 seconds. The hero must answer three questions immediately: What is this? Is it for me? What do I do next?

---

#### Pattern 1: Split-Screen Hero

**Layout:** Two-column grid. Text column 55% width (left), product/image column 45% width (right). Text column contains: badge/eyebrow (14px, uppercase tracking-wide), headline (48-64px, max 10 words), subheadline (18-20px, max 25 words, muted color), primary CTA button, secondary text link beneath. Image column contains: product screenshot, 3D render, or illustration with subtle parallax or float animation. Vertical centering on both columns. 80-120px horizontal gap. Section height: 90-100vh on desktop, stacked on mobile.

**Why it converts:** Leverages the Z-pattern scanning model. Western readers scan top-left to top-right, then diagonally to bottom-left. Placing the headline and CTA in the left column aligns with natural eye movement. The product image on the right provides visual proof without competing with the action. Nielsen Norman Group research shows left-aligned text is processed 20-30% faster than centered text in information-dense layouts.

**Archetype adaptations:**
- **Neo-Corporate** -- Clean geometric split, subtle gradient divider, product screenshot with device frame
- **Luxury/Fashion** -- Oversized image bleeds past column boundary, text column narrowed to 45%, generous whitespace
- **Brutalist** -- Hard vertical divide (4-8px solid border), raw typography, no image effects
- **AI-Native** -- Left column has terminal-style typing animation for headline, right column shows live product interface

---

#### Pattern 2: Centered Headline + Single CTA

**Layout:** Single column, center-aligned. Stack order: optional eyebrow badge, headline (48-72px, max 10 words, display font), subheadline (18-22px, max 20 words, body font, muted), single CTA button (large, 16-18px text, 48-56px height), micro-copy beneath CTA ("No credit card required" or "Free for teams up to 5"). Total content width: max-w-3xl (768px). Section height: 70-90vh. Optional: subtle background gradient or pattern. No hero image.

**Why it converts:** Minimal cognitive load. Hick's Law states that decision time increases logarithmically with the number of choices. A single CTA with no competing elements reduces time-to-action. The centered layout creates a natural focal funnel where the eye moves from headline to subheadline to button in a straight vertical line. Unbounce data across 64,000 landing pages shows single-CTA pages convert 13.5% vs 10.5% for multi-CTA pages.

**Archetype adaptations:**
- **Swiss/International** -- Precise grid alignment, Helvetica-style sans-serif, mathematical spacing ratios
- **Japanese Minimal** -- Extreme whitespace (section padding 160px+), delicate serif headline, muted CTA
- **Editorial** -- Oversized serif headline (72-96px), dramatic line-height (0.9), no subheadline
- **Ethereal** -- Soft gradient background, light blur effects, gentle entrance animation

---

#### Pattern 3: Full-Screen Background + Overlay

**Layout:** 100vh section with full-bleed background image or video. Dark overlay at 40-60% opacity (use bg-black/40 to bg-black/60). Content centered vertically and horizontally. Headline (48-72px, white text, display font, text-shadow for legibility), subheadline (18-22px, white/90 opacity), CTA button (high contrast against overlay -- typically white bg with dark text, or primary color). Optional: scroll indicator at bottom (animated chevron). If video: autoplay, muted, loop, playsinline. Video duration: 10-30 seconds. Poster image for loading state.

**Why it converts:** Full-screen imagery triggers emotional resonance before rational processing. The amygdala processes visual stimuli 60,000x faster than text. Dark overlays create depth (figure-ground separation) while ensuring text legibility. The immersive viewport eliminates peripheral distractions, forcing attention onto the message. Wistia data shows hero videos increase conversion by 80% compared to static images, but only when under 30 seconds.

**Archetype adaptations:**
- **Ethereal** -- 30-40% overlay (lighter), soft gradient from bottom, dreamy blur on edges
- **Neon Noir** -- 60-70% dark overlay, neon glow on headline, subtle scanline texture
- **Kinetic** -- Video background with motion, parallax scroll effect on overlay content
- **Luxury/Fashion** -- Full-bleed editorial photography, minimal text, 50% overlay with gradient

---

#### Pattern 4: Interactive Product Demo Hero

**Layout:** 30% top area for headline + subheadline (centered, compact). 60% main area for embedded interactive demo (iframe, embedded app, or interactive component). 10% bottom area for CTA + supporting copy. Demo area has subtle border or shadow to frame it. Optional: floating tooltips or hotspots within the demo highlighting key features. Section height: 100vh minimum to accommodate the demo.

**Why it converts:** "Show, don't tell" is the highest-converting hero approach for product-led growth companies. Interactive demos let users experience value before commitment, leveraging the endowment effect -- once someone has invested time interacting, they feel ownership. Navattic data shows interactive demo pages convert at 13.5% median vs 3.8% for standard hero pages. Users who interact with a demo are 3.5x more likely to sign up.

**Archetype adaptations:**
- **AI-Native** -- Sandbox-style demo with live input/output, terminal aesthetic
- **Kinetic** -- Demo entrance with dramatic reveal animation, particles on interaction
- **Data-Dense** -- Dashboard demo with live-updating numbers, filter interactions
- **Playful/Startup** -- Gamified demo with progress indicators, celebration micro-animations

---

#### Pattern 5: Typography-First Hero

**Layout:** No hero image. Headline dominates the viewport: 64-120px display font, bold or black weight, tight line-height (0.85-0.95). Headline spans full container width. Subheadline: 20-24px, body font, max-w-2xl, muted. CTA: positioned with generous top margin (48-64px). Optional: oversized decorative letterform or word as background element (200-400px, 5-10% opacity). Section height: 80-100vh. Mobile: headline scales to 40-64px.

**Why it converts:** Pattern interruption via the Von Restorff isolation effect -- the element that is most different from its surroundings is best remembered. In a web landscape of image-heavy heroes, a pure typographic hero stands out. Large typography also communicates confidence and authority. Eye-tracking studies show oversized headlines capture 100% of first-fixation attention. This pattern works best when the headline itself is the product message (no image needed to explain the offering).

**Archetype adaptations:**
- **Editorial** -- Serif display font (64-96px), dramatic leading, column-based layout beneath
- **Brutalist** -- System font or mono, 96-120px, uppercase, letter-spacing: -0.05em, raw
- **Neubrutalism** -- Bold sans-serif, thick black border on CTA, offset shadow on headline
- **Swiss/International** -- Helvetica-derivative, precise grid, mathematical scale ratios

---

#### Pattern 6: Before/After Transformation Hero

**Layout:** Two-state visual comparison. Option A: horizontal split with drag handle (50/50, user-controllable). Option B: vertical stack with labeled "Before" and "After" states. Left/top state shows the pain point (cluttered, slow, manual). Right/bottom state shows the solution (clean, fast, automated). Headline above: outcome-focused (e.g., "From 3 hours to 3 minutes"). CTA below the comparison. Total section height: 80-100vh.

**Why it converts:** Combines loss aversion (seeing the "before" pain state triggers desire to avoid it) with aspirational desire (the "after" state shows what is possible). Kahneman's research shows losses are felt 2x more strongly than equivalent gains. The interactive drag handle increases engagement time (users spend 40-60% longer on interactive elements). The direct visual comparison eliminates the need for abstract feature descriptions.

**Archetype adaptations:**
- **Data-Dense** -- Metrics-driven comparison: numbers, charts, before/after dashboards
- **Neo-Corporate** -- Clean split, professional screenshots, subtle transition animation
- **Playful/Startup** -- Animated transition between states, confetti on "after" reveal
- **Warm Artisan** -- Hand-drawn annotation style on the comparison, warm color tones

---

#### Pattern 7: Social Proof-Led Hero

**Layout:** Stack order (top to bottom): headline (40-56px), metrics strip (3-4 key numbers in a horizontal row, 32-40px bold numbers with 14px labels), client logo bar (6-10 grayscale logos, horizontally scrolling or static), CTA button, subheadline/supporting copy. Critical: all proof elements appear ABOVE the CTA. The CTA is positioned after the user has already seen evidence. Section height: 80-90vh.

**Why it converts:** Social proof is the single most influential conversion factor after messaging clarity. Placing proof elements (metrics, logos, ratings) before the CTA means the user encounters evidence before being asked to act. This follows the persuasion sequence: Attention -> Interest -> Desire -> Action (AIDA). BrightLocal research shows 92% of consumers trust peer recommendations, and 270% are more likely to purchase a product with 5+ reviews. Positioning proof above the CTA provides a 15-30% conversion uplift vs proof below the fold.

**Archetype adaptations:**
- **Neo-Corporate** -- Enterprise logos prominently displayed, formal metrics (ARR, users, uptime)
- **Playful/Startup** -- Animated counter with emoji, casual metric labels ("Loved by 50K+ teams")
- **Data-Dense** -- Detailed metrics with sparkline charts, real-time counters
- **Luxury/Fashion** -- Minimalist logo display (3-4 prestige brands only), elegant typography

---

#### Pattern 8: Video Testimonial Hero

**Layout:** Two-column grid. Left column (45%): headline (40-56px), subheadline, CTA button, 1-2 line text testimonial quote as supporting copy. Right column (55%): video player (16:9 or 4:3 aspect ratio), custom play button overlay, thumbnail showing the customer's face. Video duration: 30-60 seconds. Below the hero: small row of 3 additional testimonial thumbnails (clickable to swap). Mobile: video stacks above text.

**Why it converts:** Video testimonials combine the credibility of social proof with the emotional engagement of video. Wyzowl research shows 66% of consumers are more likely to purchase after watching a customer video testimonial. The face on the thumbnail triggers the fusiform face area of the brain, creating immediate emotional connection. Showing a real person (not an actor) builds trust through perceived authenticity. The 30-60 second sweet spot delivers enough story for emotional impact without losing attention.

**Archetype adaptations:**
- **Warm Artisan** -- Natural, unpolished video style, warm color grading, handwritten quote styling
- **Neo-Corporate** -- Professional production, company branding on thumbnail, formal quote layout
- **Playful/Startup** -- Casual selfie-style testimonials, animated thumbnail border, emoji reactions
- **Editorial** -- Cinematic framing, pull-quote typography, magazine-style layout

---

#### Pattern 9: Asymmetric/Editorial Hero

**Layout:** Deliberately unbalanced composition. Headline positioned off-center (left-aligned at 8-15% from left edge). Oversized decorative element (image, shape, or typography) overlapping grid boundaries. Text and image elements overlap by 10-20%. Z-index layering creates depth: background element -> mid-ground image -> foreground text. Headline: 56-96px with tight leading. CTA positioned unconventionally (not centered, not immediately below headline -- offset to create visual tension). Section height: 100vh.

**Why it converts:** Pattern interruption through asymmetry. The human visual system is wired to detect anomalies -- asymmetric layouts break the expected symmetry of web design, triggering heightened attention. This leverages the Von Restorff effect at the layout level. Eye-tracking studies from CXL Institute show that unusual layouts increase time-on-page by 20-35% compared to standard templates. The controlled tension between elements creates visual energy that pulls the user through the composition.

**Archetype adaptations:**
- **Editorial** -- Magazine-style overlapping columns, mixed serif/sans-serif, pull-quote positioning
- **Luxury/Fashion** -- Dramatic scale contrast, editorial photography, generous negative space
- **Brutalist** -- Extreme overlap, rotated text elements, exposed grid lines
- **Glassmorphism** -- Frosted glass cards overlapping at angles, backdrop-blur layering

---

#### Pattern 10: Stacked Narrative Hero

**Layout:** Scroll-driven storytelling across 150-200vh. Sequence: Opening statement (viewport 1, 48-72px headline, fade-in), Problem articulation (viewport 1.5, pain point with supporting visual), Solution reveal (viewport 2, product image with parallax), Proof strip (viewport 2.5, metrics + logos), CTA (viewport 3, sticky or revealed). Uses scroll-driven animations: CSS scroll-timeline or Intersection Observer for progressive reveals. Each "chapter" is a scroll-snap section.

**Why it converts:** Earned attention produces higher-quality conversions. Users who scroll through a narrative have self-selected as interested, meaning they convert at higher rates and churn less. The narrative structure mirrors the emotional arc (HOOK -> BUILD -> PROOF -> CLOSE). Scroll depth correlates with conversion quality: Chartbeat data shows users who reach 75% scroll depth are 4x more likely to convert than those who bounce at the hero. The progressive reveal creates curiosity gaps (Loewenstein's information gap theory) that pull the user forward.

**Archetype adaptations:**
- **Kinetic** -- Heavy scroll-driven animations, parallax layers, 3D transforms on scroll
- **Ethereal** -- Gentle fade transitions, soft color shifts between chapters, ambient motion
- **Dark Academia** -- Chapter-style headings, book metaphor, sepia tones, aged texture reveals
- **Vaporwave** -- Color gradient shifts per section, glitch transitions, retro imagery

---

### 5 Pricing Table Patterns

Pricing is the highest-anxiety point in the conversion funnel. Every design decision must reduce friction and guide the user toward the optimal plan.

---

#### Pattern 1: Three-Tier Center-Stage

**Layout:** Three cards in a horizontal row. Middle card elevated (translateY: -16 to -24px), scaled slightly larger (scale: 1.02-1.05), with a "Most Popular" or "Recommended" badge. Filled/solid CTA button on center card, outline/ghost CTA on flanking cards. Center card has a distinct border color (--color-primary). Card content: plan name (20-24px, bold), price (40-56px, bold), billing period (14px, muted), 1-line description, feature list (checkmarks), CTA button. Equal card heights via grid stretch.

**Why it converts:** The center-stage effect (demonstrated by Rodway et al., 2012) shows that items placed in the center of a horizontal array receive 65% more visual attention and are chosen more frequently, independent of their content. The elevation and scaling reinforce the visual hierarchy. Filled vs outline CTA buttons create a clear primary/secondary distinction, nudging users toward the highlighted plan. This pattern is used by 73% of top SaaS companies (ProfitWell data).

**Archetype adaptations:**
- **Neo-Corporate** -- Clean cards, subtle shadow, professional badge styling
- **Glassmorphism** -- Frosted glass cards, backdrop-blur, glass badge
- **Neubrutalism** -- Thick borders, offset shadows, bold badge with rotation
- **Luxury/Fashion** -- Thin borders, elegant typography, gold/metallic badge accent

---

#### Pattern 2: Annual/Monthly Toggle

**Layout:** Centered toggle switch above pricing cards. Default state: Annual (pre-selected). Annual price shown with monthly equivalent in smaller text ("$29/mo billed annually"). Monthly price shows with crossed-out text showing the annual savings ("$39/mo -- Save 26% annually"). Toggle uses smooth transition (300ms ease) between states. Optional: "Save X%" badge near the annual toggle option. Prices animate between states (counter animation or fade-crossfade).

**Why it converts:** Anchoring bias (Tversky & Kahneman, 1974). By defaulting to annual pricing, the lower monthly-equivalent price becomes the anchor. When users toggle to monthly, the higher price feels like a loss relative to the anchor. Crossed-out pricing leverages the contrast principle -- the perceived value gap between annual and monthly drives annual plan adoption. ProfitWell data shows annual plans increase customer LTV by 15-30% and reduce churn by 20-40%.

**Archetype adaptations:**
- **Playful/Startup** -- Animated toggle with emoji or illustrations for each state
- **Swiss/International** -- Minimal toggle, precise typography, mathematical savings display
- **AI-Native** -- Toggle styled as a command switch, monospace savings calculation
- **Warm Artisan** -- Soft toggle with organic shape, handwritten savings callout

---

#### Pattern 3: Feature Comparison Matrix

**Layout:** Full-width table below the pricing tier cards. Sticky tier headers (plan names + prices) that persist during scroll. Features grouped by category (collapsible category headers). Columns: Feature name (left, 40% width), then one column per tier. Cell content: checkmark (included), dash (not included), or specific value ("100GB", "Unlimited"). Alternating row backgrounds for scannability. Mobile: horizontal scroll with sticky feature-name column, or accordion per tier.

**Why it converts:** For complex purchasing decisions with 10+ differentiating features, a comparison matrix reduces cognitive load by enabling systematic evaluation. Miller's Law (7 plus/minus 2 chunks) means users cannot hold all plan differences in working memory -- the table externalizes this comparison. Feature grouping with collapsible sections allows progressive disclosure: users expand only the categories they care about. Gartner research shows B2B buyers spend 27% of their purchase journey comparing alternatives -- a matrix captures this activity on your page rather than in a spreadsheet.

**Archetype adaptations:**
- **Data-Dense** -- Compact rows, detailed values, filterable categories
- **Neo-Corporate** -- Clean table, professional headers, subtle zebra striping
- **Brutalist** -- Raw table borders, monospace values, no decoration
- **Minimal** -- Thin dividers only, generous row padding, icon-based values

---

#### Pattern 4: Usage-Based Calculator

**Layout:** Interactive pricing calculator. Input: slider(s) for primary usage metric (users, API calls, storage, etc.). Output: real-time price display (large, 40-56px) that updates as slider moves. Below the calculator: feature list for the computed tier. Slider uses stepped increments with labeled breakpoints. Optional: "You'd save X vs [competitor]" comparison line. CTA adapts to the calculated tier. Include a "Contact us" option for values beyond the slider max.

**Why it converts:** Eliminates "hidden fee" anxiety, which 81% of users cite as their primary reason for abandoning a purchase (Recurly data). The interactive slider gives users a sense of control and agency (self-determination theory). Watching the price update in real-time creates transparency and builds trust. The endowment effect applies: users who interact with the calculator feel ownership of "their" configuration. Usage-based calculators reduce pricing-page bounce rate by 20-35% compared to static tier cards (Zuora benchmark data).

**Archetype adaptations:**
- **AI-Native** -- Command-line style input, terminal output showing cost breakdown
- **Playful/Startup** -- Animated slider with playful haptic feedback, celebration at good price points
- **Data-Dense** -- Multiple sliders, detailed cost breakdown table, chart showing price vs usage curve
- **Neo-Corporate** -- Clean slider, professional layout, enterprise-appropriate value labels

---

#### Pattern 5: Enterprise Tier Card

**Layout:** Distinct card (often full-width or a separate section below standard tiers). No price displayed -- replaced with "Contact Sales" or "Get a Custom Quote." Content: headline emphasizing scale ("For organizations that need..."), 4-6 enterprise-specific features (SSO, SLA, dedicated support, custom integrations), row of enterprise client logos (3-5), compliance/security badges (SOC 2, HIPAA, GDPR, ISO 27001), CTA: "Talk to Sales" button + "Or book a demo" secondary link.

**Why it converts:** Authority bias and security signaling. Enterprise buyers need to justify purchases to multiple stakeholders. Compliance badges signal that procurement and security review hurdles are pre-cleared. Client logos provide social proof from peers ("If [major company] trusts this, it's safe for us"). The absence of a price creates exclusivity (scarcity principle) and routes high-value leads to sales teams who can extract maximum value through negotiation. Removing the price also prevents sticker shock that might cause premature abandonment.

**Archetype adaptations:**
- **Neo-Corporate** -- Premium card styling, enterprise logos, formal compliance badge layout
- **Luxury/Fashion** -- Exclusive language, concierge-style CTA copy, minimal feature list
- **Data-Dense** -- Detailed compliance matrix, SLA specifications, infrastructure details
- **Swiss/International** -- Clean layout, precise badge alignment, structured feature presentation

---

### 5 Social Proof Patterns

Social proof is the single most powerful conversion lever after message clarity. It answers the user's unconscious question: "Do people like me use this, and do they succeed?"

---

#### Pattern 1: Three-Card Testimonial Row

**Layout:** Three cards in a horizontal grid (equal width). Each card: customer photo (48-64px circle, top-left or centered), customer name (16px, bold), customer role + company (14px, muted), 1-2 sentence quote (16px, body font, italicized or in quotation marks). Optional: star rating above the quote. Card styling: subtle border or shadow, rounded corners. Placement: immediately below pricing section.

**Why it converts:** Positioned below pricing to address the specific doubt "Should I spend this money?" Three testimonials provide variety without overwhelming (rule of three in persuasion). Photos with faces trigger the fusiform face area, creating empathetic connection. Name + role + company provides verifiability -- Nielsen research shows attributed testimonials are 35% more credible than anonymous ones. BrightLocal data: testimonials below pricing increase conversion by 34% vs testimonials above the fold.

**Archetype adaptations:**
- **Warm Artisan** -- Rounded photo frames, handwritten-style quotation marks, warm card backgrounds
- **Neo-Corporate** -- Professional headshots, company logos alongside names, clean card design
- **Brutalist** -- Raw photo treatment, block quotes, visible borders
- **Editorial** -- Pull-quote typography, large quotation marks as decorative elements

---

#### Pattern 2: Marquee Logo Bar

**Layout:** Full-width strip containing 8-15 client logos. Logos displayed in grayscale (filter: grayscale(100%) opacity(0.6)), transitioning to color on section hover. Auto-scrolling marquee (CSS animation, 30-60 second loop, pauses on hover). Logo height: 24-40px, consistent across all logos. Spacing: 48-80px between logos. Placement: directly below the hero section. Label above: "Trusted by" or "Powering teams at" (14px, muted, uppercase tracking-wide).

**Why it converts:** Authority bias (Cialdini, 1984). Recognizable logos transfer trust from known brands to your product. Grayscale treatment prevents logos from competing with your brand colors while still being recognizable. The continuous scroll creates a sense of abundance -- "many companies trust this." BrightLocal data: 92% of consumers trust peer recommendations. Logo bars placed below the hero provide immediate credibility at the moment the user is deciding whether to read further.

**Archetype adaptations:**
- **Neo-Corporate** -- Static grid (no scroll), precise alignment, corporate-tier logos
- **Playful/Startup** -- Color logos, subtle bounce animation on scroll-in, friendly label
- **Luxury/Fashion** -- 3-5 prestige logos only, generous spacing, elegant placement
- **Swiss/International** -- Mathematically spaced, monochrome, no animation

---

#### Pattern 3: Metrics Counter Strip

**Layout:** Horizontal row of 3-4 key metrics. Each metric: large number (32-48px, bold, display font), label below (14-16px, muted). Numbers use count-up animation triggered on scroll-into-view (duration: 1.5-2.5 seconds, easing: ease-out). Use exact numbers, not rounded (e.g., "12,847 teams" not "10,000+ teams"). Separator between metrics: thin vertical line or generous spacing. Placement: within or immediately below the hero, or as a standalone strip.

**Why it converts:** The precision heuristic (research by Schindler & Yalch, 2006) demonstrates that exact numbers are perceived as more credible and trustworthy than rounded numbers. "12,847 teams" feels researched and real; "10,000+" feels like marketing. The count-up animation draws attention and creates a sense of growth and momentum. The strip format allows rapid scanning -- users absorb 3-4 data points in under 2 seconds. Metrics provide concrete evidence that anchors the product's credibility in quantifiable reality.

**Archetype adaptations:**
- **Data-Dense** -- 5-6 metrics, smaller font, sparkline charts beside each number
- **Kinetic** -- Dramatic count-up with overshoot easing, number color shifts during animation
- **Neo-Corporate** -- Clean layout, professional labels (ARR, NPS, Uptime), subtle animation
- **Playful/Startup** -- Emoji prefixes, casual labels ("Happy teams", "Cups of coffee"), bouncy animation

---

#### Pattern 4: Video Testimonial Grid

**Layout:** Grid of video thumbnails. Featured video: 2x size (spans 2 columns or 2 rows in the grid). Remaining videos: standard size (equal cards). Grid layout: 2x3 or 3x2. Each thumbnail: video poster with customer face visible, play button overlay (centered, 48-64px), customer name + company below. Click opens modal or inline player. Auto-play first 3 seconds on hover (muted) as preview. Total section: contained within max-w-6xl.

**Why it converts:** Video testimonials are the highest-trust social proof format. Wyzowl research: 66% of consumers are more likely to purchase after watching a customer testimonial video. The grid format provides choice and volume -- multiple perspectives address different buyer concerns. The featured (larger) video uses size-weight bias to direct attention to your strongest testimonial. Hover preview reduces commitment anxiety ("I can see what this is about before clicking"). Face visibility on thumbnails ensures the fusiform face response triggers even before playback.

**Archetype adaptations:**
- **Warm Artisan** -- Rounded corners, warm overlay on thumbnails, organic grid spacing
- **Neo-Corporate** -- Clean grid, professional thumbnails, corporate video production style
- **Kinetic** -- Animated grid entrance, parallax on scroll, dynamic thumbnail scaling
- **Editorial** -- Cinematic thumbnails, film-strip aesthetic, dramatic hover state

---

#### Pattern 5: Masonry Social Wall

**Layout:** Masonry grid (3-4 columns, variable row heights) containing mixed social proof formats: tweet embeds (styled, not iframed), short text quotes, video thumbnails, G2/Capterra review cards, badge/award images, screenshot snippets. Total items: 20-100+. Container height: capped with "Show more" expansion or infinite scroll. Column gap: 16-24px. Mobile: 1-2 columns.

**Why it converts:** Volume as proof. When users see 50-100+ positive signals, the cumulative effect overwhelms skepticism through sheer quantity. This leverages the bandwagon effect (Cialdini) -- "this many people can't be wrong." Mixed formats prevent monotony and provide different evidence types for different buyer types (some trust tweets, others trust formal reviews, others trust badges). Clay Collins (Leadpages) case study showed a 100+ testimonial wall increased conversions by 37% compared to curated 3-testimonial display.

**Archetype adaptations:**
- **Playful/Startup** -- Colorful cards, emoji-rich tweets, animated entrance stagger
- **Neo-Corporate** -- Uniform card styling, professional formatting, curated selection
- **Brutalist** -- Raw embeds, minimal styling, exposed metadata
- **Data-Dense** -- Filterable by category, sortable, search-enabled wall

---

### 5 CTA Design Rules

The CTA is the conversion mechanism. Everything else on the page exists to make the user ready to click this button.

---

#### Rule 1: First-Person Benefit-Driven Copy

**Specification:** CTA text uses first-person possessive language describing the outcome, not the action. Examples: "Start my free trial" (not "Start your free trial"), "Get my report" (not "Download"), "Claim my discount" (not "Submit"). Button text: 2-5 words. Never generic ("Submit", "Click Here", "Learn More").

**Why it converts:** The endowment effect (Kahneman, Knetsch, & Thaler, 1990). First-person language ("my") creates psychological ownership before the action is taken. The user mentally pre-possesses the outcome. Unbounce A/B testing across 90,000+ visitors showed "Start my free trial" outperformed "Start your free trial" by 90%. ContentVerve replicated with 24.95% uplift. Benefit-driven copy (outcome vs action) outperforms action-driven copy by 10-30% consistently across industries.

---

#### Rule 2: Maximum Visual Contrast

**Specification:** The CTA button must be the single most visually prominent interactive element on the viewport. Background: --color-primary (or highest-contrast DNA token). Text: white or --color-bg for maximum contrast. Minimum contrast ratio: 4.5:1 (WCAG AA). No other element on the page should share the CTA's exact color + size combination. Surrounding area: 24px+ clear space on all sides. No competing buttons (secondary actions use outline/ghost variants).

**Why it converts:** Von Restorff isolation effect -- the item that is most different from its surroundings receives the most attention and is best remembered. When the CTA is the only element using a particular color at a particular size, it becomes impossible to miss. Eye-tracking data from CXL Institute shows isolated, high-contrast CTAs receive 80% first-fixation rate vs 45% for CTAs that blend with the page palette. The 4.5:1 contrast ratio is not just an accessibility requirement -- it is a conversion requirement.

---

#### Rule 3: Multi-Position Placement

**Specification:** Place CTAs at minimum 4 positions on the page: (1) in the hero section, (2) after the features/benefits section, (3) after social proof/testimonials, (4) at the bottom of the page (final section). For long pages (5+ sections), add a CTA after every 2-3 sections. Optional: sticky CTA bar that appears after scrolling past the hero. Each CTA instance can vary copy slightly but must lead to the same action.

**Why it converts:** Different users reach conviction at different points in the page. Some are ready to act after the hero (high intent, returning visitors). Others need features, proof, or pricing before deciding. A single CTA placement misses 60-70% of potential converters who reach conviction at non-CTA scroll positions. Chartbeat scroll-depth data shows conversion events are distributed across the full page, not concentrated at the hero. HubSpot testing showed pages with 3+ CTA placements converted 20% higher than single-CTA pages.

---

#### Rule 4: Whitespace Isolation

**Specification:** Minimum 24px padding on all sides of the CTA button. No other interactive elements within 48px of the CTA. No dense text blocks within 32px above or below. The CTA should "breathe" within a clear zone. On mobile: minimum 16px side padding, 24px vertical padding. The whitespace zone should be visually obvious -- the CTA sits in its own clear space, not crammed between other elements.

**Why it converts:** Whitespace around interactive elements increases comprehension by 20% (Wichita State University research). Isolated elements are processed faster by the visual system because there is no competition for attention within the foveal vision area (approximately 2 degrees of visual angle). Fitts's Law also applies: while modern CTA buttons are large enough to click easily, the perceived target area expands with surrounding whitespace, reducing hesitation. Google's Material Design guidelines codify this as "touch target spacing" at 48dp minimum for the same reason.

---

#### Rule 5: Test Priority -- Copy > Placement > Color

**Specification:** When optimizing CTAs, invest effort in this priority order: (1) Copy changes yield 20-90% conversion lift. Test first-person vs second-person, benefit vs action, specific vs generic. (2) Placement changes yield 10-30% lift. Test above-fold vs below-fold, after-proof vs after-features, sticky vs static. (3) Color changes yield 2-10% lift. Test primary vs accent color, filled vs gradient. Never start optimization with color -- it is the lowest-leverage change.

**Why it converts:** The "button color myth" has led countless teams to waste optimization cycles on color A/B tests that yield statistically insignificant results. WiderFunnel meta-analysis across 300+ A/B tests shows copy changes produce the largest effect sizes because copy changes alter the value proposition perceived by the user. Placement changes alter when conviction meets opportunity. Color changes only alter visual salience, which is already addressed by Rule 2 (maximum contrast). Prioritizing high-leverage tests first follows the Pareto principle -- 80% of conversion gains come from copy and placement.

---

### 5 Trust Signal Patterns

Trust signals reduce the perceived risk of taking action. They answer: "Is this safe? Is this legitimate? Will I regret this?"

---

#### Pattern 1: Client Logo Strip

**Layout:** Horizontal row of 5-8 client logos. Grayscale treatment (filter: grayscale(100%) opacity(0.5-0.7)). Consistent height (24-36px). Centered within container. Label: "Trusted by leading teams" or "Join [count]+ companies" (14px, muted, above logos). Placement: below hero section or below headline. Mobile: 2 rows of 4, or horizontal scroll.

**Why it converts:** Authority bias transfer. Users unconsciously apply the trust they hold for known brands to your product. Grayscale prevents brand-color interference while maintaining recognizability. BrightLocal data: seeing recognizable logos increases trust by 40%. Placement below the hero captures users at the decision point of whether to continue reading.

---

#### Pattern 2: Security Badge Cluster

**Layout:** Horizontal row of 3-5 security/compliance badges. Badges: SOC 2 Type II, GDPR Compliant, ISO 27001, SSL Secured, PCI DSS (select relevant ones). Badge size: 48-64px height, consistent. Grayscale or muted color treatment to avoid visual clutter. Placement: near checkout/payment section, near signup form, or in footer. Optional: "Your data is protected" label (14px, muted).

**Why it converts:** Baymard Institute research shows security badges near form fields increase form completion by 12.6%. The badges function as trust anchors -- they transfer authority from recognized certification bodies (SOC 2 auditors, ISO standards bodies) to your product. Placement near the point of data entry is critical: users' security concerns peak at the moment they are about to enter personal or payment information. The cluster format (3-5 badges) provides cumulative reassurance without individual badge recognition being necessary.

---

#### Pattern 3: Review Platform Aggregate

**Layout:** Badge-style display combining: platform logo (G2, Capterra, Trustpilot, Product Hunt), star rating (visual stars + numeric: "4.8/5"), review count ("Based on 2,847 reviews"), optional: category badge ("Leader, Spring 2025"). Display as a card or inline element. Size: compact enough to place near CTAs or in the hero. Link to the actual review page for verifiability.

**Why it converts:** Third-party validation eliminates the "of course they say they're good" skepticism. Spiegel Research Center data: products with 5+ reviews are 270% more likely to be purchased than products with zero reviews. The platform logo (G2, Trustpilot) transfers trust from the review platform. Exact review counts leverage the precision heuristic. Linking to the actual review page demonstrates confidence and provides an escape hatch that paradoxically increases trust (users rarely click but feel better knowing they could).

---

#### Pattern 4: Real-Time Activity Counter

**Layout:** Small, persistent element showing live or recent activity. Format: "[Count] [entity] [action] [timeframe]" -- e.g., "12,847 teams signed up this month", "847 active right now", "23 teams joined today." Placement: near hero CTA, in sticky header, or as a subtle banner. Update animation: number increments occasionally (every 5-30 seconds) with a brief pulse. Style: muted text (14px), subtle but noticeable.

**Why it converts:** Bandwagon effect (Cialdini's social proof principle). Real-time activity signals that others are actively choosing this product right now, creating urgency and FOMO (fear of missing out). The precision heuristic makes exact, updating numbers feel authentic rather than marketing. Booking.com's "3 people are looking at this room" is the canonical implementation: they report a 12-15% conversion uplift from real-time activity indicators. The psychological mechanism is informational social influence -- in uncertain situations, people look to others' actions as evidence of the correct choice.

---

#### Pattern 5: Guarantee / Risk-Reversal Strip

**Layout:** Horizontal strip with 3 guarantee elements, each with an icon (shield, clock, credit card) and short text. Common combinations: "30-day money-back guarantee", "No credit card required", "Cancel anytime." Or: "Free for teams up to 5", "14-day free trial", "No setup fees." Icon size: 20-24px. Text: 14-16px. Strip placement: directly below primary CTA (within 16-24px). Alternative placement: above the CTA as a micro-copy row.

**Why it converts:** Risk reversal eliminates the top 3 barriers to conversion: financial risk (money-back guarantee), commitment risk (cancel anytime), and entry-friction risk (no credit card). Baymard Institute research shows 18% of cart abandonments are due to concerns about return policies, and 25% cite hidden costs. By explicitly addressing these concerns at the point of action, risk-reversal strips reduce cognitive friction. The placement directly near the CTA ensures the reassurance is available at the exact moment of decision. VWO case studies show risk-reversal messaging near CTAs increases conversion by 18-25%.

---

### 5 Feature Section Patterns

Feature sections answer "What does this do?" and "Why should I care?" The layout determines whether users engage or scan past.

---

#### Pattern 1: Bento Grid

**Layout:** Asymmetric grid with varied card sizes. Hero card: 2x2 (largest, top-left or center). Supporting cards: mix of 1x1, 1x2, and 2x1. Total: 5-8 cards. Each card: icon or illustration (top), feature title (18-20px, bold), description (14-16px, muted, 1-2 lines). Hero card includes a mini demo, screenshot, or animation. Gap: 16-24px. Container: max-w-7xl. Mobile: single column stack with hero card first.

**Why it converts:** The varied sizes create visual hierarchy within the feature set, guiding attention to the most important feature first (the hero card). Apple's bento grid layouts achieve 47% more dwell time and 38% higher CTR compared to uniform grids (measured by Contentsquare). The asymmetry prevents "grid blindness" -- the phenomenon where uniform grids are treated as decoration and scanned past. Each size variation creates a micro-pattern-interrupt that reengages attention.

**Archetype adaptations:**
- **AI-Native** -- Dark cards, code snippets in hero card, terminal aesthetics
- **Glassmorphism** -- Frosted glass cards with backdrop-blur, gradient borders
- **Neubrutalism** -- Thick borders, offset shadows, bold accent colors per card
- **Swiss/International** -- Precise grid ratios, mathematical spacing, clean typography

---

#### Pattern 2: Zigzag Image-Text

**Layout:** Alternating rows of image-left/text-right and text-left/image-right. Each row: two-column grid (50/50 or 55/45). Image side: product screenshot, illustration, or contextual photo. Text side: feature icon (optional), feature title (24-32px), description (16-18px, 2-4 sentences), optional bullet points or micro-features. Row spacing: 80-120px vertical gap. Alternation: strict left-right-left-right. Total rows: 3-5 features.

**Why it converts:** The alternating layout prevents scanning fatigue and "layout blindness" -- when every section looks the same, users' eyes glaze over and skip content. The zigzag forces the eye to move across the page with each section, maintaining active engagement. This pattern leverages the serial position effect: by distributing features across alternating layouts, each feature gets distinct visual treatment, improving recall. Basecamp, Notion, and Stripe all use this pattern for their primary feature communication because it balances information density with scannability.

**Archetype adaptations:**
- **Editorial** -- Generous whitespace between rows, editorial photography, magazine layout
- **Kinetic** -- Scroll-triggered animations on each row, parallax on images
- **Neo-Corporate** -- Clean screenshots, professional imagery, subtle shadows
- **Warm Artisan** -- Illustrated images, organic shapes, warm photography

---

#### Pattern 3: Icon Grid (3x3 or 3x2)

**Layout:** 6-9 equal-sized cards in a 3-column grid. Each card: icon (32-48px, centered or top-left), feature title (16-18px, bold), description (14-16px, muted, 1-2 lines). Card styling: minimal (no borders) or subtle (light border/shadow). Icon style: consistent (all outline, all filled, or all duotone). Grid gap: 32-48px. Container: max-w-5xl centered. Section title + description above the grid.

**Why it converts:** Equal-weight presentation signals that all features are valuable, which is the right message when features are genuinely comparable in importance. Icons improve scanning speed by 30-40% compared to text-only lists (NN/g research), because icons are processed by the visual system in parallel while text requires serial processing. The 3-column grid is optimal for scanning: 2 columns feels sparse, 4+ columns creates cognitive overload on desktop. The grid format also implies completeness -- "here is the full set" -- which increases perceived product maturity.

**Archetype adaptations:**
- **Swiss/International** -- Mathematical grid precision, minimal icons, structured text
- **Playful/Startup** -- Illustrated icons, colorful, playful hover states with micro-animations
- **Japanese Minimal** -- Extra whitespace, delicate icons, restrained typography
- **Data-Dense** -- Compact cards, more features (4x3 grid), detailed descriptions

---

#### Pattern 4: Comparison Table (Us vs Them)

**Layout:** Full-width table with 3+ columns: Feature name (left), Your product (center, highlighted), Competitor 1, Competitor 2. Your column: highlighted background, bold header, green checkmarks. Competitor columns: muted styling, red X marks or dashes. Features: 8-15 rows grouped by category. Sticky header row. Mobile: horizontal scroll with sticky feature column. Optional: "Why [Product]?" headline above.

**Why it converts:** Directly addresses the comparison stage of the buyer journey. Instead of forcing users to build their own comparison (which they will do anyway, but on a competitor's terms), you control the narrative. This is a framing effect: by choosing which features to compare, you define the evaluation criteria in your favor. ConversionXL research shows comparison tables reduce time-to-decision by 40% for considered purchases. The green/red visual coding leverages pre-attentive processing -- users can absorb the comparison pattern without reading individual features.

**Archetype adaptations:**
- **Data-Dense** -- Detailed values in cells, category groupings, sortable columns
- **Neo-Corporate** -- Clean professional table, subtle highlighting, formal tone
- **Playful/Startup** -- Emoji checkmarks/crosses, playful competitor names, casual tone
- **Brutalist** -- Raw HTML table aesthetic, bold borders, monospace text

---

#### Pattern 5: Accordion / Expandable Features

**Layout:** Vertical stack of 5-8 expandable rows. Collapsed state: feature title (18-20px) + icon or thumbnail + expand indicator (chevron or plus). Expanded state: feature description (16px, 2-4 sentences) + optional image/screenshot + optional link. Only one item expanded at a time (accordion behavior). Animation: 200-300ms ease-out height transition. First item optionally pre-expanded. Container: max-w-3xl centered.

**Why it converts:** Progressive disclosure reduces initial cognitive load. Users see the full feature set at a glance (titles only) without being overwhelmed by details. This gives them a sense of control -- they choose what to explore. Self-determination theory (Deci & Ryan) shows that perceived autonomy increases engagement and satisfaction. The accordion interaction also creates micro-commitments: each click to expand is a small engagement action that increases investment in the page. Jakob Nielsen's research on progressive disclosure shows it improves user satisfaction by 20-30% on content-heavy pages.

**Archetype adaptations:**
- **Japanese Minimal** -- Delicate expand animation, generous padding, subtle indicators
- **Editorial** -- Rich expanded content with images, magazine-style reveal
- **Kinetic** -- Dramatic expand animation, content slides in with spring physics
- **Neo-Corporate** -- Clean accordion, professional styling, smooth transitions

---

### Above-the-Fold Rules

The area visible without scrolling is the most valuable real estate on the page. These rules are non-negotiable for conversion-optimized pages.

---

#### Rule 1: Answer Three Questions in Three Seconds

**What is this?** The headline must communicate the product category or value proposition in under 10 words. **Is it for me?** The subheadline must identify the target audience or use case. **What do I do next?** A single, visible CTA must be present. If a user cannot answer all three questions within 3 seconds of page load, the above-the-fold content has failed. Test by showing the page to someone unfamiliar with the product for 3 seconds, then asking these three questions.

**Why this matters:** Google research on mobile page speed shows users form quality judgments within 50ms and stay/leave decisions within 3-5 seconds. The 3-question framework ensures the critical information is communicated within this window. Pages that fail the 3-second test experience 40-60% higher bounce rates (Google/SOASTA data).

---

#### Rule 2: Single Primary CTA (No Competing Actions)

**Specification:** Above the fold, there must be exactly ONE primary action. Secondary actions (navigation, secondary links) should be visually subdued. The primary CTA must be the most visually prominent element after the headline. No "Request Demo" AND "Start Free Trial" at equal visual weight. Choose one primary, make the other a text link or outline button.

**Why this matters:** Hick's Law -- decision time increases logarithmically with options. Two equal-weight CTAs create decision paralysis. Unbounce data: pages with a single above-fold CTA convert at 13.5% vs 10.5% for pages with multiple equal-weight CTAs. The 3% absolute difference compounds: on 10,000 monthly visitors, that is 300 additional conversions per month.

---

#### Rule 3: Outcome-Driven Headline (Result, Not Feature)

**Specification:** The headline must describe what the user achieves, not what the product does. "Send invoices 10x faster" (outcome) not "AI-powered invoice software" (feature). Headline reading level: 5th-7th grade (Flesch-Kincaid). Max 10 words. Display font, 48-72px on desktop, 32-48px on mobile. No jargon, no acronyms, no insider language.

**Why this matters:** Outcome-driven headlines outperform feature-driven headlines by 2-5x. Marketing Experiments data: outcome-focused headlines achieve 12.9% conversion vs 2.1% for feature-focused headlines. The 5th-7th grade reading level is not about "dumbing down" -- it is about processing speed. Simple language is processed faster, and faster processing creates a fluency effect (Alter & Oppenheimer, 2009) where the product itself is perceived as easier to use.

---

#### Rule 4: LCP Under 2 Seconds

**Specification:** The Largest Contentful Paint (hero image, headline, or video poster) must render within 2 seconds on a 4G connection. Hero images: WebP/AVIF format, appropriately sized (not a 4000px image scaled down in CSS), with explicit width/height attributes. Fonts: preloaded, with font-display: swap. No layout shift in the hero (CLS < 0.1). Critical CSS inlined. Above-fold content must not depend on JavaScript for initial render.

**Why this matters:** Google/SOASTA data: every additional second of load time costs 7-10% of conversions. A page that loads in 4 seconds instead of 2 seconds loses 14-20% of potential conversions. LCP is the primary Core Web Vital affecting perceived load speed. Users who experience a slow-loading hero interpret it as a signal of product quality: "If their website is slow, their product probably is too" (Stanford Web Credibility Research).

---

#### Rule 5: One Proof Element Near CTA

**Specification:** At least one social proof element must be visible in the same viewport as the primary CTA. Options: metrics strip above the CTA, client logos below the hero, star rating beside the CTA, "Join X+ companies" micro-copy beneath the CTA button. The proof element should be subtle (not competing with the CTA for attention) but visible.

**Why this matters:** Proof near the CTA addresses last-moment doubt. The user sees the CTA, hesitates ("Should I?"), and immediately sees evidence that others have already said yes. This micro-reassurance at the decision point produces a 15-30% conversion uplift (VWO meta-analysis). The proximity is key: proof on the same page but below the fold does not provide this effect because it is not visible at the moment of decision.

---

### Mobile Conversion Patterns

Mobile traffic exceeds 60% for most consumer products. Mobile conversion rates are typically 50-70% lower than desktop. These patterns close the gap.

---

#### Pattern 1: Sticky Bottom CTA Bar

**Layout:** Fixed-position bar at the bottom of the viewport. Height: 48-56px. Full width with 16px horizontal padding. Contains: CTA button (fills available width, 44-48px height, primary color) and optional secondary text (e.g., "Free trial" or price). Appears after user scrolls past the hero CTA (typically at 40% scroll depth). Entrance animation: slide up from bottom (200ms ease-out). Z-index above all content. Background: solid (--color-bg or --color-surface) with subtle top border or shadow. Must not obscure content: include bottom padding on the page body equal to bar height.

**Why it converts:** Mobile users scroll extensively but rarely scroll back up to find the CTA. The sticky bar ensures the action is always available. UX research from Baymard Institute shows persistent mobile CTAs increase conversion by 15-25%. The 40% scroll-depth trigger ensures the bar appears only after initial content engagement (not immediately, which feels aggressive). The full-width button maximizes Fitts's Law target area on small screens.

---

#### Pattern 2: Single-Column Snap Sections

**Layout:** Full-width, single-column layout with scroll-snap-type: y mandatory on the container. Each section: 100vh or auto height with scroll-snap-align: start. Content within sections: centered, max-width 90vw (or container with 5% side padding). All touch targets: minimum 48x48px (WCAG 2.5.5). Text size: minimum 16px body (prevents iOS zoom). Generous vertical spacing between elements (24-32px gaps). No horizontal scrolling except for intentional carousels.

**Why it converts:** Single-column eliminates the scanning confusion that multi-column layouts create on small screens. Scroll-snap creates a "page-by-page" reading experience that feels native and intentional. The 48x48px touch target minimum is not just accessibility -- it reduces tap errors that frustrate users and cause accidental navigation away from the page. The 16px minimum body text prevents the iOS auto-zoom behavior that disrupts layout and disorients users.

---

#### Pattern 3: Bottom Sheet Progressive Disclosure

**Layout:** Detail content (feature descriptions, pricing details, FAQ answers) loads in a bottom sheet that slides up from the bottom of the viewport. Sheet heights: 40% viewport (peek), 70% viewport (half), 95% viewport (full). User can drag to resize. Sheet includes a drag handle indicator at top (40px wide, 4px height, centered, rounded). Backdrop: 40% dark overlay on the underlying page. Content within sheet: scrollable independently. Dismiss: drag down or tap backdrop.

**Why it converts:** Bottom sheets keep users in context. Unlike page navigation (which causes a full context switch) or new tabs (which fragment attention), bottom sheets preserve the user's place on the page while revealing additional information. This reduces the "fear of losing my place" that causes mobile users to avoid clicking links. Google's Material Design research shows bottom sheets have 25-35% higher engagement rates than page transitions for supplementary content. The progressive height levels (peek -> half -> full) give users control over how much detail they want.

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in Conversion Patterns |
|-----------|------------------------------|
| `--color-primary` | CTA button background. Must be the most prominent interactive color on the page. CTA isolation requires no other element at this color + size. |
| `--color-bg` | Page and section backgrounds. Hero overlays calculate from this value. Sticky CTA bar uses this or --color-surface. |
| `--color-surface` | Card backgrounds for testimonials, pricing tiers, feature cards. Provides depth separation from --color-bg. |
| `--color-text` | Headline and body text. Above-fold headline must achieve 7:1 contrast against --color-bg (WCAG AAA for large text). |
| `--color-border` | Card borders, table dividers, pricing card outlines. Ghost/outline CTA buttons use this for border. |
| `--color-muted` | Subheadlines, feature descriptions, labels, micro-copy near CTAs. Risk-reversal strip text. |
| `--color-accent` | "Most Popular" badges on pricing, notification dots on activity counters, highlight on selected toggle state. |
| `--color-secondary` | Secondary CTA buttons, alternate section backgrounds, testimonial card accents. |
| `--color-glow` | Neon Noir / AI-Native hero glow effects, CTA hover glow states. |
| `--color-signature` | Signature element in hero section, unique branded element per archetype. |
| `--font-display` | Hero headlines (48-120px depending on pattern). Pricing tier prices. Metrics counter numbers. |
| `--font-body` | All body copy, feature descriptions, testimonial quotes, CTA button text. |
| `--motion-duration` | Count-up animation duration, card entrance stagger, scroll-triggered reveals. Scale to archetype motion intensity. |
| `--motion-easing` | Easing curve for all conversion pattern animations. Kinetic = spring, Ethereal = ease-in-out, Swiss = linear. |

### Archetype Adaptation Summary

| Archetype | Hero Pattern | Social Proof Style | CTA Tone | Trust Signal Weight |
|-----------|-------------|-------------------|----------|-------------------|
| Neo-Corporate | Split-Screen or Social Proof-Led | Logo bar + metrics strip | Professional, authoritative | Heavy (badges, logos, compliance) |
| Luxury/Fashion | Full-Screen BG or Asymmetric | Curated testimonials (3 max) | Exclusive, understated | Light (prestige logos only) |
| Brutalist | Typography-First | Raw social wall | Direct, blunt | Minimal (confidence = no proof needed) |
| Ethereal | Centered or Full-Screen BG | Gentle testimonials | Soft, inviting | Moderate (subtle placement) |
| Kinetic | Stacked Narrative or Interactive Demo | Animated metrics | Energetic, action-oriented | Moderate (animated badges) |
| AI-Native | Interactive Demo | Metrics + real-time counter | Technical, specific | Heavy (compliance + real-time) |
| Editorial | Asymmetric or Typography-First | Pull-quote testimonials | Editorial, curated | Moderate (review platform) |
| Playful/Startup | Split-Screen or Centered | Emoji-rich social wall | Casual, friendly | Moderate (platform badges) |
| Data-Dense | Social Proof-Led | Detailed metrics + comparison | Data-driven, precise | Heavy (all formats) |
| Swiss/International | Centered or Typography-First | Minimal logo bar | Clean, precise | Light (mathematical) |
| Japanese Minimal | Centered Headline | Sparse, curated | Restrained, elegant | Minimal |
| Neubrutalism | Typography-First | Bold social wall | Bold, direct | Moderate (playful badges) |
| Warm Artisan | Video Testimonial | Authentic video grid | Warm, personal | Moderate (genuine reviews) |
| Dark Academia | Stacked Narrative | Literary testimonials | Scholarly, thoughtful | Moderate (awards, press) |
| Neon Noir | Full-Screen BG | Glowing metrics | Atmospheric, urgent | Moderate (neon badges) |

### Pipeline Stage

- **Input from:** Creative Director (archetype selection determines hero pattern recommendation), Planner (section specs reference pattern names from this skill), Design DNA (color tokens for CTA, trust signals, card backgrounds)
- **Output to:** Builder (exact layout specifications for each section), Reviewer (validates CTA placement count, social proof ordering, trust signal presence), Auditor (UX Intelligence scoring category)

### Related Skills

- `landing-page` -- Provides code templates that should implement conversion patterns from this skill. This skill provides the WHY; landing-page provides the HOW.
- `emotional-arc` -- Beat mapping aligns with conversion pattern placement: HOOK = hero, BUILD = features, PROOF = social proof, CLOSE = final CTA.
- `design-dna` -- DNA tokens are directly referenced for CTA color, card surfaces, typography scales.
- `ux-intelligence` -- Shares conversion psychology principles. UX Intelligence enforces usability; this skill enforces conversion optimization.
- `quality-gate-v2` -- UX Intelligence category scores are informed by conversion pattern compliance.
- `responsive-design` -- Mobile conversion patterns in this skill complement responsive breakpoint rules.
- `performance-patterns` -- LCP and CWV rules overlap. Above-the-fold Rule 4 is enforced by both skills.
- `cinematic-motion` -- Animation tokens used for count-up animations, card entrances, scroll-triggered reveals.

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Multiple Competing CTAs Above the Fold

**What goes wrong:** Two or more equally-weighted CTAs ("Start Free Trial" and "Book a Demo" both as filled primary buttons) create decision paralysis. Hick's Law increases decision time logarithmically with options. A/B tests consistently show 20-30% lower conversion when two primary CTAs compete. Users freeze, read both, try to determine which is "right," and often choose neither.
**Instead:** Choose one primary CTA (filled, primary color, prominent). Demote the other to a text link, outline button, or secondary placement (e.g., in the navigation). If both actions are truly important, test which converts higher and make that the primary.

### Anti-Pattern: Generic CTA Copy

**What goes wrong:** "Submit", "Click Here", "Learn More", "Get Started" tell the user nothing about the outcome. Generic copy converts 20-50% lower than specific, benefit-driven copy. "Submit" is particularly damaging because it implies the user is subordinating themselves to the system. "Click Here" is redundant (users know how buttons work) and wastes the CTA's opportunity to communicate value.
**Instead:** Use first-person, benefit-driven copy: "Start my free trial", "Get my custom report", "See pricing", "Watch the 2-min demo." The CTA text should complete the sentence "I want to..." from the user's perspective.

### Anti-Pattern: Anonymous Testimonials

**What goes wrong:** Testimonials without photos, full names, or company attribution ("A satisfied customer" or "John D.") are perceived as fabricated. Nielsen research shows unattributed testimonials have near-zero credibility impact and can actually reduce trust (users assume the company is hiding something). Stock photos are worse than no photo -- users can often detect stock imagery, which signals inauthenticity.
**Instead:** Every testimonial must include: real photo (not stock), full name, job title, company name, and optionally a company logo. Video testimonials are the highest-trust format. If you cannot get attributed testimonials, use third-party review platform embeds (G2, Trustpilot) which carry platform-level trust.

### Anti-Pattern: Trust Badge Overload

**What goes wrong:** Displaying 8-15 security badges, compliance certifications, and award logos in a dense cluster signals anxiety rather than confidence. Too many trust signals suggest the company is trying too hard to prove legitimacy, which triggers suspicion (the "methinks thou dost protest too much" effect). Baymard Institute research shows diminishing returns after 4-5 badges, with negative returns beyond 7-8.
**Instead:** Curate 3-5 badges maximum. Select the ones most relevant to your audience: SOC 2 for enterprise B2B, SSL/PCI for e-commerce, GDPR for European markets. Display them in a clean, spaced row with consistent sizing. Quality over quantity.

### Anti-Pattern: Feature-Driven Headlines

**What goes wrong:** Headlines like "AI-Powered Analytics Platform" or "Next-Generation CRM with Machine Learning" describe what the product is but not what it does for the user. Feature-driven headlines require the user to translate features into personal benefits, adding cognitive load. Marketing Experiments data: feature headlines convert at 2.1% while outcome headlines convert at 12.9% -- a 6x difference.
**Instead:** Always lead with the outcome: "See what's working in your marketing -- in 30 seconds" instead of "AI-Powered Marketing Analytics." The product description (feature-driven) can appear in the subheadline or below the fold. The headline's job is to communicate value, not taxonomy.

### Anti-Pattern: Social Proof Buried Below the Fold

**What goes wrong:** Testimonials and logos placed only in the lower half of the page are seen by less than 50% of visitors (Chartbeat scroll-depth data). Users who bounce at the hero never encounter the proof that might have retained them. Placing all social proof in a single section at the bottom treats it as an afterthought rather than a conversion driver.
**Instead:** Distribute social proof throughout the page: logo bar below hero, metrics near hero CTA, testimonials below pricing, case study link in features section. Ensure at least one proof element is visible in the same viewport as the primary CTA (Above-the-Fold Rule 5).

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| hero_headline_words | 3 | 10 | words | HARD -- reject if outside range |
| hero_headline_size_desktop | 48 | 120 | px | SOFT -- warn if outside range |
| hero_headline_size_mobile | 32 | 64 | px | SOFT -- warn if outside range |
| hero_subheadline_words | 8 | 25 | words | SOFT -- warn if outside range |
| cta_contrast_ratio | 4.5 | - | ratio | HARD -- reject if below minimum |
| cta_whitespace_padding | 24 | - | px | SOFT -- warn if below minimum |
| cta_button_text_words | 2 | 5 | words | SOFT -- warn if outside range |
| cta_placements_per_page | 3 | 8 | count | HARD -- reject if below minimum |
| pricing_tiers_visible | 2 | 4 | count | SOFT -- warn if outside range |
| testimonial_photo_size | 48 | 64 | px | SOFT -- warn if outside range |
| testimonial_attribution | 1 | - | boolean | HARD -- reject if no name+role+company |
| trust_badges_count | 3 | 5 | count | SOFT -- warn if outside range |
| logo_bar_count | 5 | 15 | count | SOFT -- warn if outside range |
| metrics_counter_count | 3 | 4 | count | SOFT -- warn if outside range |
| above_fold_cta_count | 1 | 1 | count | HARD -- reject if not exactly 1 primary |
| above_fold_lcp | - | 2000 | ms | HARD -- reject if above maximum |
| mobile_touch_target | 48 | - | px | HARD -- reject if below minimum |
| mobile_body_text_size | 16 | - | px | HARD -- reject if below minimum |
| sticky_cta_bar_height | 48 | 56 | px | SOFT -- warn if outside range |
| hero_section_height_min | 70 | - | vh | SOFT -- warn if below minimum |
| feature_section_items | 3 | 9 | count | SOFT -- warn if outside range |
| social_proof_near_cta | 1 | - | boolean | HARD -- reject if no proof element near CTA |
