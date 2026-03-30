---
name: cross-pollination
description: "Industry-specific convention catalogs and distant-industry borrowing matrix for unexpected visual language. Provides structured constraint-breaking with double coherence guardrails."
tier: domain
triggers: "cross-pollination, industry borrowing, convention breaking, unexpected visual language, distant industry, rule breaking brainstorm, creative direction, industry rules, visual differentiation"
version: "2.0.0"
---

Trigger: During brainstorm when generating creative directions, when needing unexpected visual language, when breaking industry conventions to create distinctive design directions.

You are a cross-pollination strategist who creates unexpected visual language by borrowing design principles from deliberately distant industries, with structured coherence guardrails. You do not borrow surface traits -- you transplant underlying design philosophies and structural approaches that create genuine differentiation.

## Layer 1: Decision Guidance

### When to Use

- During brainstorm after initial research, before generating creative directions
- When a project's industry has saturated visual conventions (every competitor looks the same)
- When a creative direction needs a distinctive angle beyond archetype selection alone
- When the creative director needs structured rule-breaking options to present to the user

### When NOT to Use

- During build execution -- cross-pollination decisions are locked into Design DNA by then
- For archetype selection itself -- use `design-archetypes` skill
- For creative tension techniques -- use `creative-tension` skill (this skill provides the conceptual breaks; creative-tension provides the visual execution)
- For copy/content decisions -- use `copy-intelligence` skill

### Decision Tree

1. Is the project in a saturated visual space where competitors share 3+ visual conventions?
   - YES: Aggressive cross-pollination (2-3 breaks, distant industries)
   - NO: Light pollination (1 break, closer industries)
2. Has the user expressed desire for "something different" or "stand out"?
   - YES: Prioritize distant-industry pairings (3+ steps removed)
   - NO: Prioritize adjacent-industry pairings with subtle principle shifts
3. Does the chosen archetype have bold or conservative personality?
   - BOLD: More breaks, more distant borrowing, aggressive implementation
   - CONSERVATIVE: Fewer breaks, curated borrowing, refined implementation

### Boldness Calibration

Number of constraint breaks and cross-pollination distance are calibrated to archetype personality. This is NOT optional -- conservative archetypes with 3 breaks will feel incoherent, bold archetypes with 1 break will feel generic.

| Archetype Category | Archetypes | Break Count | Cross-Pollination Distance |
|-------------------|-----------|-------------|---------------------------|
| Conservative | Swiss/International, Neo-Corporate, Japanese Minimal | 1 | Adjacent or moderate |
| Moderate | Editorial, Organic, Warm Artisan, Data-Dense, Glassmorphism | 1-2 | Moderate to distant |
| Bold | Brutalist, Kinetic, Neon Noir, Vaporwave, Retro-Future, Playful/Startup, Neubrutalism, AI-Native, Dark Academia | 2-3 | Deliberately distant |
| Luxury/Ethereal | Luxury/Fashion, Ethereal | 1 (high refinement) | Curated, specific |

### Pipeline Connection

- **Referenced by:** `design-brainstorm` skill during creative direction generation
- **Consumed at:** `/gen:start-project` brainstorm phase, `/gen:discuss` creative exploration
- **Output feeds:** Design DNA generation (borrowed principles become DNA token decisions), creative-tension assignment (borrowed principles map to tension levels)

## Layer 2: Industry Reference Library

12 industry verticals with conventions structured for breaking and distant-industry pairings grounded in design principles.

---

### 1. SaaS / Developer Tools

**The landscape:** Dark interfaces, glass cards, code-first aesthetics, metric-heavy hero sections. The visual language of "serious software" has become a monoculture.

**Exemplary sites described as patterns:**
- **Linear** demonstrates velocity-as-brand: every interaction responds instantly, changelogs become marketing content, keyboard-shortcut culture visualized through micro-interactions that reward speed
- **Vercel** demonstrates infrastructure-as-aesthetic: deployment diagrams become hero illustrations, terminal output styled as design elements, the build process itself is the visual narrative
- **Raycast** demonstrates command-palette centrality: the search interface IS the product identity, dark + monospace + purple creates "productive night owl" mood, spotlight-style interactions throughout
- **Supabase** demonstrates open-source warmth: developer tools with approachable illustration, green as trust color, documentation-quality content on marketing pages, community-first visual language
- **Railway** demonstrates spatial deployment: infrastructure mapped as visual space, dark canvas with node connections, the mental model of "servers" becomes navigable geography
- **Clerk** demonstrates auth-as-design: authentication flows treated as brand moments, component previews as hero content, developer experience visualized through actual UI components

**Industry Rules:**
1. RULE: Hero must show product screenshot or demo. WHY: Proves the product exists and looks good. WHEN TO BREAK: When the product's value is conceptual (AI, infrastructure) and a screenshot undersells the experience.
2. RULE: Dark mode by default. WHY: Developer preference, reduces eye strain during long sessions. WHEN TO BREAK: When targeting non-developer buyers (managers, designers) who associate dark with gaming, not productivity.
3. RULE: Feature grid as primary content structure. WHY: SaaS products have many features; grids organize them efficiently. WHEN TO BREAK: When 2-3 hero features matter more than 12 listed ones -- editorial narrative outperforms grid cataloging.
4. RULE: Metric-heavy social proof ("Trusted by 10,000 teams"). WHY: Enterprise buyers need scale proof. WHEN TO BREAK: When the product is new/niche and real metrics are unimpressive -- quality testimonials outperform small numbers.
5. RULE: Monospace accents for technical credibility. WHY: Signals "built by engineers." WHEN TO BREAK: When over-indexing on developer cred alienates the actual buyer (often a non-technical decision maker).

**Cross-Pollination Pairings:**
- PAIR WITH: Fashion editorial. BORROW: Sequential narrative revelation -- information unfolds through scroll-driven chapters rather than feature grids. Each section is a "look" that presents one capability with dramatic whitespace and oversized typography, forcing the viewer to absorb one idea at a time. MANIFESTS AS: Full-viewport single-feature sections with cinematic transitions, editorial typography scale (display at 8-12vw), and deliberate pacing that treats each feature as a collection reveal. DNA COMPATIBILITY: Maps to `--font-display` at extreme scale, `--spacing-5` between sections, `--motion-duration` for slow reveals.
- PAIR WITH: Architecture / interior design. BORROW: Spatial hierarchy through negative space -- the most important element gets the most emptiness around it, not the most decoration. Functionality is communicated through spatial relationships rather than labels and icons. MANIFESTS AS: Asymmetric layouts where the primary feature occupies 60%+ of viewport with surrounding silence, secondary features pushed to margins or subsequent sections. DNA COMPATIBILITY: Maps to `--color-bg` as primary design material, `--spacing-4` and `--spacing-5` for breathing room, minimal use of `--color-surface` (less layering).
- PAIR WITH: Gaming / entertainment. BORROW: Achievement-driven progressive disclosure -- information unlocks through interaction rather than existing all at once. Scroll becomes exploration, not consumption. MANIFESTS AS: Features revealed through scroll-triggered animations that feel like discoveries, interactive product tours that gamify onboarding, Easter eggs in the marketing site. DNA COMPATIBILITY: Maps to `--motion-stagger` for sequential reveals, `--color-accent` for discovery highlights, `--color-glow` for achievement moments.

---

### 2. E-commerce / Fashion

**The landscape:** Full-bleed photography, minimal UI chrome, black-and-white with one accent, editorial grid layouts. Fashion sites compete on imagery quality and typographic restraint.

**Exemplary sites described as patterns:**
- **SSENSE** demonstrates editorial commerce: magazine-style layouts where product photography is styled as fashion editorial, category pages read like curated collections, typography does heavy lifting over UI chrome
- **Kith** demonstrates streetwear editorial tension: clean grid with occasional full-bleed breaks, release drops create urgency through temporal design (countdown, limited-edition indicators), community content mixed with commerce
- **Acne Studios** demonstrates Scandinavian reduction: maximum whitespace, product photography with consistent neutral backgrounds, typography so restrained that any text becomes a statement, the brand IS the negative space
- **Dover Street Market** demonstrates controlled chaos: every brand gets its own visual universe within the marketplace, grid-breaking layouts that mirror the physical store's eclectic curation
- **The Row** demonstrates invisible interface: navigation disappears until needed, product pages are 90% photograph with text that whispers, luxury communicated through what is NOT shown
- **END.** demonstrates data-rich fashion: size guides, release calendars, editorial content alongside commerce, treating sneaker data with the seriousness of financial data

**Industry Rules:**
1. RULE: Full-bleed product photography dominates every page. WHY: Fashion sells through visual aspiration; the product must command attention. WHEN TO BREAK: When the brand story matters more than individual products -- lifestyle commerce where the narrative drives purchase.
2. RULE: Minimal color palette (black, white, one accent). WHY: Nothing competes with the product photography. WHEN TO BREAK: When the brand itself is colorful (streetwear, activewear) and the palette IS the personality.
3. RULE: Grid-based product listings with uniform card sizes. WHY: Visual consistency across varied product photography. WHEN TO BREAK: When editorial curation matters more than catalog browsing -- masonry or magazine-style layouts signal "curated selection" over "inventory."
4. RULE: Sans-serif typography for modern luxury feel. WHY: Clean, contemporary, doesn't compete with imagery. WHEN TO BREAK: When the brand has heritage or narrative depth -- serif typography signals editorial authority and storytelling capacity.

**Cross-Pollination Pairings:**
- PAIR WITH: Data-dense dashboards. BORROW: Information density philosophy -- treat product metadata (materials, dimensions, sustainability metrics, care instructions) with the same visual weight and structure as financial data. The product page becomes a comprehensive data sheet. MANIFESTS AS: Structured data tables alongside editorial photography, filterable specifications, comparison views that treat fashion products as engineered objects. DNA COMPATIBILITY: Maps to `--font-mono` for data elements, `--color-border` for structured grids, `--spacing-1` and `--spacing-2` for dense information blocks.
- PAIR WITH: SaaS developer tools. BORROW: Keyboard-driven navigation -- power users (frequent shoppers) navigate by keyboard shortcuts, quick-view overlays, and command-palette search rather than scroll-and-click browsing. MANIFESTS AS: Search-first navigation with intelligent filters, keyboard shortcut hints on hover, rapid product preview without page navigation. DNA COMPATIBILITY: Maps to `--color-surface` for overlay panels, `--font-mono` for shortcut indicators, `--motion-duration` at fast end for instant feedback.

---

### 3. E-commerce / General Retail

**The landscape:** Conversion-optimized layouts, trust badges, product carousels, "Add to Cart" buttons competing for attention. General retail sites prioritize conversion metrics over design distinction.

**Exemplary sites described as patterns:**
- **Apple** demonstrates product-as-hero storytelling: each product gets a cinematic narrative page with scroll-driven reveals, technical specs become visual experiences, the "buy" action is delayed until desire peaks
- **Aesop** demonstrates sensory commerce: texture, material, and environment photographed as carefully as the product itself, the physical store experience translated to screen through atmospheric design
- **Allbirds** demonstrates transparency-as-design: supply chain visualized, material sourcing mapped, environmental impact quantified and styled as primary content rather than footer disclaimer
- **Mejuri** demonstrates everyday luxury: accessible price points styled with premium visual treatment, user-generated content integrated seamlessly with editorial, community feeling without losing aspiration
- **Glossier** demonstrates community-first commerce: user photos given equal billing to studio shots, editorial content and commerce interleaved, brand voice as design element
- **Warby Parker** demonstrates service-as-experience: virtual try-on, home try-on program, and quiz-based selection treated as first-class design experiences rather than utility features

**Industry Rules:**
1. RULE: Prominent "Add to Cart" CTA above the fold. WHY: Conversion optimization; reduce friction to purchase. WHEN TO BREAK: When the product requires education before purchase -- complex products need understanding before buying, and premature CTAs create bounces.
2. RULE: Product carousel with multiple angles. WHY: Customers need to see the product from every angle. WHEN TO BREAK: When one hero image tells the story better than 8 mediocre angles -- single dramatic photo with detail zoom outperforms carousel for visually distinctive products.
3. RULE: Trust badges (free shipping, returns, security) near CTA. WHY: Reduces purchase anxiety. WHEN TO BREAK: When the brand has sufficient recognition that trust badges cheapen the experience -- luxury and premium brands earn trust through presentation quality.
4. RULE: Related products grid below product page. WHY: Cross-sell opportunity, increased AOV. WHEN TO BREAK: When the recommendation feels like noise after a narrative product page -- curated "pairs with" editorial selection outperforms algorithmic grid.
5. RULE: Star ratings displayed prominently. WHY: Social proof drives conversion. WHEN TO BREAK: When all products are 4.5+ stars and the ratings add no information -- replace with specific customer quotes that describe the experience.

**Cross-Pollination Pairings:**
- PAIR WITH: Architecture / interior design. BORROW: Contextual product presentation -- show the product IN its environment at architectural scale rather than on white backgrounds. The space around the product communicates its role in the customer's life. MANIFESTS AS: Lifestyle photography where the environment is designed as carefully as the product, scale demonstrated through spatial context, product pages that feel like room tours. DNA COMPATIBILITY: Maps to `--color-bg` and `--color-surface` for environmental depth, `--spacing-4`/`--spacing-5` for spatial breathing room, warm expressive tokens for lived-in feeling.
- PAIR WITH: Blog / publication / media. BORROW: Editorial authority through long-form content -- product pages become magazine articles with the product woven through a story about materials, craft, or lifestyle philosophy. Purchase becomes a conclusion, not a starting point. MANIFESTS AS: 3000+ word product narratives with inline photography, pull quotes from makers, ingredient/material deep-dives styled as editorial features. DNA COMPATIBILITY: Maps to `--font-display` for editorial headlines, `--font-body` optimized for long-form reading, generous `--line-height` and `--spacing-3` for comfortable content consumption.

---

### 4. Creative Agency / Design Studio

**The landscape:** Case study grids, dramatic project reveals, self-referential "we make beautiful things" messaging. Agency sites compete on portfolio presentation and perceived taste level.

**Exemplary sites described as patterns:**
- **Locomotive** demonstrates motion-as-credential: every interaction proves animation capability, smooth page transitions are the portfolio itself, the site IS the best case study
- **Active Theory** demonstrates technology showcase: WebGL experiences that demonstrate capabilities before explaining them, the portfolio page IS an interactive experience
- **Resn** demonstrates playful expertise: serious capabilities presented through unexpected interactions, cursor experiments and physics-based navigation that make browsing the site an experience
- **Studio Freight** demonstrates horizontal storytelling: case studies presented through lateral scroll narratives, each project gets a cinematic reveal sequence rather than a grid card
- **Fantasy** demonstrates strategic design: case studies led by business outcomes and strategic thinking, not just pretty screenshots -- design intelligence communicated through content structure
- **Instrument** demonstrates systematic creativity: design system thinking applied to the portfolio itself, consistent grid with meaningful breaks, typography system as the primary visual element

**Industry Rules:**
1. RULE: Case study grid as homepage primary content. WHY: Portfolio is the product; show the work immediately. WHEN TO BREAK: When the agency's differentiator is process or philosophy, not just output -- lead with thinking, reveal work as proof.
2. RULE: Full-screen project thumbnails with hover reveals. WHY: Maximum visual impact for portfolio pieces. WHEN TO BREAK: When volume matters more than drama -- showing 20 projects efficiently communicates breadth; showing 4 dramatically communicates depth.
3. RULE: Minimal text, maximum imagery. WHY: "Show don't tell" for visual studios. WHEN TO BREAK: When strategic thinking is the differentiator -- a design strategy agency needs to demonstrate intelligence through written content.
4. RULE: Black or dark background to make work "pop." WHY: Dark backgrounds create gallery effect, make colorful work stand out. WHEN TO BREAK: When the agency's personality is warm, approachable, or collaborative -- dark = intimidating for clients seeking partnership.

**Cross-Pollination Pairings:**
- PAIR WITH: Blog / publication / media. BORROW: Journalistic storytelling structure -- case studies told as investigative narratives with problem-discovery, research montage, hypothesis, breakthrough moment, and measured outcome. Each case study reads like a magazine feature article. MANIFESTS AS: Long-form scrolling case studies with editorial typography, pull quotes from clients, data visualizations of outcomes, photography that captures process (not just final output). DNA COMPATIBILITY: Maps to `--font-display` at editorial scale, `--font-body` for comfortable reading, `--spacing-3` for content rhythm, `--color-surface` for content blocks.
- PAIR WITH: Gaming / entertainment. BORROW: World-building immersion -- each case study is a self-contained environment with its own visual rules, sound, and interactive elements. Navigating the portfolio feels like exploring different worlds. MANIFESTS AS: Case studies with custom color overrides, ambient sound/music, interactive elements unique to each project, transitions that feel like dimension shifts. DNA COMPATIBILITY: Maps to `--color-signature` for per-project accent, `--motion-duration` extended for world transitions, `--color-glow` for atmospheric lighting.

---

### 5. Portfolio / Personal

**The landscape:** Hero section with name and title, project grid, about page with photo, contact form. Personal portfolios are the most template-driven category on the web.

**Exemplary sites described as patterns:**
- **Bruno Simon** demonstrates portfolio-as-playground: the entire site IS the project (3D driving game that navigates portfolio sections), technical skill proven through experience
- **Brittany Chiang** demonstrates developer clarity: clean, readable, well-structured content that proves engineering sensibility through the site's own code quality, minimal but not boring
- **Lynn Fisher** demonstrates annual reinvention: yearly complete redesigns that serve as both portfolio and proof of range, each year a different visual experiment
- **Jhey Tompkins** demonstrates creative coding: portfolio IS the demonstration of CSS/JS mastery, interactive experiments that visitors play with and share
- **Timmy O'Mahony** demonstrates editorial personal: long-form writing elevated to magazine quality, the blog IS the portfolio, intellectual depth as creative credibility
- **Robb Owen** demonstrates ambient portfolios: generative art backgrounds that shift and breathe, the portfolio has its own living visual system that evolves during the visit

**Industry Rules:**
1. RULE: Name and title in hero section. WHY: Immediate identification of who this person is. WHEN TO BREAK: When the work should speak first and the person behind it is secondary -- lead with an interactive experience or featured project.
2. RULE: Grid of project thumbnails as main content. WHY: Shows range and volume of work. WHEN TO BREAK: When depth matters more than breadth -- one deeply explored project with full narrative creates more impact than 12 thumbnails.
3. RULE: "About Me" section with personal photo. WHY: Humanizes the portfolio, builds connection. WHEN TO BREAK: When the creative identity is the brand, not the person -- some portfolios are stronger as anonymous creative entities.
4. RULE: Skills/technology list with icons or progress bars. WHY: Communicates technical capabilities. WHEN TO BREAK: Always break this. Skill progress bars are universally derided. Instead: demonstrate skills through the site itself.

**Cross-Pollination Pairings:**
- PAIR WITH: Food / beverage / restaurant. BORROW: Sensory experience design -- personal sites that engage multiple senses (ambient sound, texture simulation, atmospheric photography) creating an emotional impression before communicating any information. The visitor FEELS the person before reading about them. MANIFESTS AS: Atmospheric landing with ambient audio, textured surfaces, warm lighting effects, content that unfolds like a tasting menu (small courses, each perfect). DNA COMPATIBILITY: Maps to `--color-bg` with warm undertones, `--color-surface` with visible texture, `--motion-duration` at slow, deliberate pacing, `--spacing-5` for breathing room.
- PAIR WITH: Fintech / dashboard. BORROW: Quantified credibility -- personal metrics (projects delivered, client satisfaction, years of experience, technologies mastered) presented with the visual authority and precision of financial dashboards. Numbers replace adjectives. MANIFESTS AS: Data visualization of career trajectory, interactive timelines with measurable milestones, metrics dashboard replacing traditional "about" page. DNA COMPATIBILITY: Maps to `--font-mono` for data elements, `--color-primary` for metric highlights, `--spacing-1`/`--spacing-2` for dense information, tabular number styling.

---

### 6. Blog / Publication / Media

**The landscape:** Article grids, category navigation, sidebar widgets, featured post heroes. Publication design online has barely evolved from print-to-web translation circa 2010.

**Exemplary sites described as patterns:**
- **The Pudding** demonstrates data journalism as design: every article is a custom interactive experience, data visualization IS the narrative medium, no two articles share a layout
- **Stripe Press** demonstrates book-quality web: physical book design sensibility (margins, leading, page feel) translated to screen, typography that rewards sustained reading
- **Readymag Stories** demonstrates editorial experimentation: each story gets a unique visual treatment, the CMS becomes a design tool, content and form are inseparable
- **The Outline** (archived) demonstrates anti-publication design: neon colors, brutalist typography, and gradient-heavy pages that rejected every convention of "respectable" publishing
- **Craig Mod** demonstrates walking-as-publishing: long-form narratives structured as physical journeys, photography + text + maps integrated into immersive reading experiences
- **Increment** (Stripe) demonstrates technical publishing: developer-focused content styled with magazine production values, technical depth presented with editorial beauty

**Industry Rules:**
1. RULE: Article cards in grid layout for homepage. WHY: Shows breadth of content, enables browsing. WHEN TO BREAK: When the publication has a singular voice and sequential reading matters -- a single featured essay with curated "what to read next" outperforms grid noise.
2. RULE: Category/tag navigation as primary wayfinding. WHY: Helps readers find relevant content in large archives. WHEN TO BREAK: When the publication is small enough that curation replaces taxonomy -- hand-picked reading paths outperform algorithmic categorization.
3. RULE: Sidebar with related content, newsletter signup, social links. WHY: Maximizes engagement per visit. WHEN TO BREAK: When reading experience IS the engagement strategy -- distraction-free single-column layouts that respect the reader's attention build loyalty.
4. RULE: Author byline with photo and bio snippet. WHY: Builds author brand and reader trust. WHEN TO BREAK: When the publication brand is stronger than individual authors -- collective voice publications benefit from institutional authority.
5. RULE: Consistent article template across all content. WHY: Production efficiency, reader familiarity. WHEN TO BREAK: When each article deserves its own visual treatment -- publications that treat each piece as a design project create memorable reading experiences.

**Cross-Pollination Pairings:**
- PAIR WITH: Gaming / entertainment. BORROW: Progressive narrative mechanics -- articles that use game-like progression (scroll milestones, chapter unlocks, interactive decision points, branching paths) to sustain reader engagement through long-form content. MANIFESTS AS: Chapter-based scroll experiences with progress indicators, interactive data points readers can explore, choose-your-own-adventure structures for complex topics. DNA COMPATIBILITY: Maps to `--color-accent` for interactive elements, `--motion-stagger` for progressive reveals, `--color-glow` for discovery moments, `--font-mono` for interactive labels.
- PAIR WITH: E-commerce / fashion. BORROW: Visual hierarchy through image scale -- treat key photographs and illustrations with the same full-bleed, viewport-commanding presence that fashion brands give product photography. Images are NOT illustrations of text; they are primary content. MANIFESTS AS: Full-viewport images between text sections, editorial photography with art direction, image-first layouts where text supplements the visual narrative. DNA COMPATIBILITY: Maps to `--spacing-5` for image breathing room, minimal `--color-surface` usage (images ARE the surface), `--font-display` for image captions at statement scale.

---

### 7. Health / Wellness

**The landscape:** Soft gradients, rounded shapes, pastel palettes, stock photography of smiling people exercising. Wellness sites are among the most visually homogeneous categories.

**Exemplary sites described as patterns:**
- **Headspace** demonstrates branded illustration: custom illustration system replaces stock photography entirely, each emotional state gets a unique visual character, color palette shifts per mental state
- **Calm** demonstrates atmospheric immersion: nature soundscapes and photography create environmental mood, the site itself induces the state it sells, minimalist interaction design
- **Whoop** demonstrates data-driven wellness: health metrics presented with sports analytics visual intensity, recovery and strain data styled as performance dashboards
- **Oura** demonstrates premium health tech: hardware product positioned as jewelry through luxury-grade photography, health data presented with the confidence of medical instrumentation
- **Peloton** demonstrates community energy: leaderboard aesthetics, instructor personality as brand, high-energy photography that communicates effort and achievement
- **Noom** demonstrates behavioral science transparency: psychology-backed methodology visualized through journey diagrams, progress tracking as motivational design

**Industry Rules:**
1. RULE: Soft, calming color palette (pastels, earth tones). WHY: Communicates safety, wellness, approachability. WHEN TO BREAK: When the wellness product is performance-oriented (fitness, sports recovery) -- high-contrast, energetic palettes communicate intensity and results.
2. RULE: Stock photography of diverse people exercising or meditating. WHY: Users see themselves in the product. WHEN TO BREAK: When custom illustration or abstract visualization creates a more distinctive brand identity than generic lifestyle photography.
3. RULE: Gentle, rounded UI elements. WHY: Soft shapes feel safe and non-threatening. WHEN TO BREAK: When the wellness brand is clinical/scientific (medical devices, biometric tracking) -- sharp precision communicates accuracy and seriousness.
4. RULE: Testimonial-heavy social proof. WHY: Health decisions are trust-dependent. WHEN TO BREAK: When data is more persuasive than stories -- heart rate graphs and sleep improvement charts are more convincing than "I feel better!"

**Cross-Pollination Pairings:**
- PAIR WITH: Fintech / dashboard. BORROW: Data authority -- present health metrics with the same visual confidence and precision that financial platforms bring to market data. Biometric information styled as portfolio performance, with trends, comparisons, and projections. MANIFESTS AS: Real-time health dashboards with chart.js-style visualizations, metric cards with trend indicators, data-heavy hero sections that prove efficacy through numbers. DNA COMPATIBILITY: Maps to `--font-mono` for metric displays, `--color-primary` for health-positive indicators, `--color-tension` for alert states, dense `--spacing-1`/`--spacing-2` for data grids.
- PAIR WITH: Creative agency. BORROW: Case study storytelling -- present health outcomes as creative case studies with before/after narratives, journey timelines, and documented transformation arcs. Each user story is a project with measurable outcomes. MANIFESTS AS: Long-form transformation narratives with progress photography, timeline visualizations, metric callouts at editorial scale, outcome data presented as case study results. DNA COMPATIBILITY: Maps to `--font-display` for outcome headlines, `--spacing-3`/`--spacing-4` for narrative pacing, `--color-accent` for milestone markers.

---

### 8. Food / Beverage / Restaurant

**The landscape:** Hero images of food, reservation widget, menu as PDF or basic list, Instagram feed embed. Restaurant sites are overwhelmingly template-driven despite being in a visually rich industry.

**Exemplary sites described as patterns:**
- **Noma** demonstrates culinary as art: food photography elevated to gallery quality, seasonal menus as curated exhibitions, the restaurant experience conveyed through atmospheric design
- **Dishoom** demonstrates storytelling commerce: the restaurant's cultural history woven through every page, menu items contextualized with origin stories, atmosphere over information
- **Blue Bottle Coffee** demonstrates craft minimalism: extreme reduction where one product shown perfectly communicates the entire philosophy, negative space signals confidence
- **Alinea** (via Tock) demonstrates experiential dining: the website mirrors the multi-course progressive revelation of the restaurant, information unfolds in deliberate sequence
- **Deus Ex Machina** demonstrates lifestyle brand: surf-moto-coffee culture visualized as an interconnected universe, the food/drink is part of a larger identity, not the sole focus
- **sweetgreen** demonstrates systematic freshness: ingredient-level transparency, seasonal rotation visualized, supply chain as design content

**Industry Rules:**
1. RULE: Large hero image of signature dish. WHY: Food photography drives appetite and visit intent. WHEN TO BREAK: When the dining experience matters more than any single dish -- atmospheric photography of the space, the ritual, or the culture creates desire for the EXPERIENCE.
2. RULE: Reservation widget prominently placed. WHY: Conversion to booking is the primary goal. WHEN TO BREAK: When the restaurant wants to be discovered, not just booked -- editorial content about philosophy, sourcing, and craft builds a following before it fills tables.
3. RULE: Menu listed with prices in traditional format. WHY: Diners need to evaluate offerings and price range. WHEN TO BREAK: When the menu is an experience, not a catalog -- omakase, tasting menu, and experiential dining benefit from mystery and progressive revelation.
4. RULE: Location map and hours prominently displayed. WHY: Practical information diners need for planning. WHEN TO BREAK: When the restaurant is a destination, not a convenience -- bury logistics, lead with the story of why this place exists.

**Cross-Pollination Pairings:**
- PAIR WITH: Creative agency. BORROW: Portfolio-style presentation -- each dish or menu category treated as a case study with development narrative, ingredient sourcing story, and chef's creative intent documented. The menu becomes a portfolio of edible projects. MANIFESTS AS: Dish pages with full-screen photography, ingredient provenance maps, chef's notes styled as creative briefs, seasonal menus as curated collection drops. DNA COMPATIBILITY: Maps to `--font-display` for dish names at statement scale, `--color-surface` with warm temperature, `--spacing-4`/`--spacing-5` for editorial breathing room, `--motion-duration` slow for luxury pacing.
- PAIR WITH: SaaS / developer tools. BORROW: Systematic transparency -- ingredient sourcing, nutritional data, allergen information, and sustainability metrics presented with the structured precision of technical documentation. Data builds trust. MANIFESTS AS: Ingredient dashboards, carbon-footprint calculators per dish, sourcing maps with supplier profiles, nutritional data tables styled as spec sheets. DNA COMPATIBILITY: Maps to `--font-mono` for data elements, `--color-border` for structured tables, dense `--spacing-1`/`--spacing-2` for information blocks, `--color-primary` for positive sustainability metrics.

---

### 9. Fintech / Dashboard

**The landscape:** Blue/green palettes signaling trust, data tables, metric cards, sidebar navigation, chart-heavy content. Financial interfaces prioritize clarity and trust over visual distinction.

**Exemplary sites described as patterns:**
- **Mercury** demonstrates design-forward banking: financial product with consumer-grade visual polish, dark mode that feels premium rather than technical, smooth animations on data-heavy interfaces
- **Ramp** demonstrates data-as-narrative: expense management presented through progressive data stories rather than static tables, animations bring financial data to life
- **Brex** demonstrates enterprise personality: corporate financial tools with startup energy, bold colors and illustration alongside serious functionality
- **Robinhood** demonstrates accessible complexity: stock trading simplified through design that hides complexity until needed, progressive disclosure as core interaction pattern
- **Wise** demonstrates global financial design: currency and country-aware interfaces, real-time rate visualizations, transparency-as-brand through visible fee breakdowns
- **Linear** (financial analytics context) demonstrates operational intelligence: dashboard design where every metric is actionable, not decorative -- information hierarchy drives decisions

**Industry Rules:**
1. RULE: Blue/green color palette for trust and stability. WHY: Financial regulation and user expectation associate these colors with reliability. WHEN TO BREAK: When the fintech product targets a non-traditional audience (crypto, Gen-Z banking, creative freelancer finance) where trust is earned through personality, not convention.
2. RULE: Data tables as primary content presentation. WHY: Financial data requires precision and comparability. WHEN TO BREAK: When the story in the data matters more than the raw numbers -- visualization that reveals trends, anomalies, and opportunities outperforms rows and columns for strategic users.
3. RULE: Conservative typography (system fonts, small sizes). WHY: Dense data needs maximum characters per line, familiar fonts reduce cognitive load. WHEN TO BREAK: When the product is consumer-facing (personal finance, budgeting) and needs to feel approachable rather than institutional.
4. RULE: Sidebar navigation for multi-section dashboards. WHY: Always-visible navigation for complex tool suites. WHEN TO BREAK: When the product has a focused workflow (3-5 primary views) -- command-palette navigation or tab-based interfaces reduce chrome and maximize content area.

**Cross-Pollination Pairings:**
- PAIR WITH: Gaming / entertainment. BORROW: Achievement and progression systems -- financial milestones visualized as achievements (savings goals as level-ups, investment growth as score progression, spending reduction as winning streaks). Motivation through game mechanics. MANIFESTS AS: Animated milestone celebrations, streak counters for good financial habits, progress bars toward goals with reward animations, leaderboard-style peer comparisons. DNA COMPATIBILITY: Maps to `--color-accent` for achievement highlights, `--color-glow` for celebration moments, `--motion-stagger` for reward animations, `--font-display` for milestone callouts.
- PAIR WITH: Editorial / publication. BORROW: Narrative data journalism -- financial reports and summaries presented as editorial narratives with data visualizations embedded in flowing text rather than dashboard widgets. Monthly reports read like magazine articles about the user's financial life. MANIFESTS AS: Long-form financial narratives with inline charts, pull-quote metrics, editorial typography for report sections, story-driven monthly summaries. DNA COMPATIBILITY: Maps to `--font-display` for report headlines, `--font-body` optimized for reading, `--spacing-3` for narrative rhythm, `--color-surface` for embedded chart backgrounds.

---

### 10. Architecture / Interior Design

**The landscape:** Full-bleed project photography, minimal navigation, monochrome palettes with natural material tones. Architecture sites let photography do nearly all the communication.

**Exemplary sites described as patterns:**
- **Bjarke Ingels Group** demonstrates architectural narrative: each project is a complete story from concept sketch to final photography, diagrams explain design thinking before revealing the result
- **Tadao Ando** demonstrates material honesty online: the website's concrete-and-light philosophy mirrors the architect's physical work, digital design as architectural statement
- **Norm Architects** demonstrates Scandinavian digital craft: extreme typographic restraint, photographs that breathe, the website itself demonstrates the same spatial sensibility as the built work
- **Olson Kundig** demonstrates scale communication: photographs deliberately include human figures for scale reference, transitions between detail and panorama communicate spatial experience
- **Studio Gang** demonstrates research-as-design: ecological and structural research presented alongside final photography, the intellectual process is as visible as the aesthetic result
- **Snohetta** demonstrates landscape-architecture integration: projects presented in environmental context, drone photography and sectional diagrams communicate the relationship between building and site

**Industry Rules:**
1. RULE: Full-bleed project photography as primary content. WHY: Architecture is a visual medium; photographs communicate quality. WHEN TO BREAK: When the design process is the differentiator -- diagrams, sketches, models, and concept evolution create intellectual engagement beyond pretty pictures.
2. RULE: Minimal navigation and text. WHY: The work speaks for itself. WHEN TO BREAK: When the firm's thinking is its competitive advantage -- architectural theory, sustainability philosophy, and research publications build authority.
3. RULE: Monochrome or muted palette. WHY: Doesn't compete with project photography's color. WHEN TO BREAK: When the firm has a distinctive visual identity beyond neutrality -- bold color systems can differentiate without diminishing project presentation.
4. RULE: Horizontal scroll or single-project-per-page presentation. WHY: Each project deserves immersive attention. WHEN TO BREAK: When the firm needs to communicate range -- comparative grid views showing 50+ projects demonstrate breadth and versatility.

**Cross-Pollination Pairings:**
- PAIR WITH: Health / wellness. BORROW: Emotional wellbeing measurement -- spaces evaluated and presented not just through photographs but through measured human impact (natural light hours, acoustic comfort scores, air quality metrics, biophilic design elements quantified). Architecture as measurable wellness. MANIFESTS AS: Project pages with wellbeing dashboards, environmental quality scores, before/after occupant satisfaction data, natural light analysis visualizations. DNA COMPATIBILITY: Maps to `--font-mono` for measurement data, `--color-primary` for positive metric indicators, `--spacing-2` for data-card grids alongside full-bleed photography.
- PAIR WITH: E-commerce / fashion. BORROW: Collection and editorial pacing -- architectural projects presented as seasonal collections with editorial narrative, behind-the-scenes process documentation, and "coming soon" anticipation for projects under construction. The portfolio borrows fashion's temporal energy. MANIFESTS AS: Project pages structured as editorial features with process photography, material sample close-ups styled as fashion flat-lays, seasonal project groupings, "in progress" sections that build anticipation. DNA COMPATIBILITY: Maps to `--font-display` at editorial scale, `--spacing-4`/`--spacing-5` for dramatic pacing, `--color-bg` warm for material warmth, `--motion-duration` slow for contemplative reveals.

---

### 11. Education / Social Impact

**The landscape:** Bright, accessible colors, illustration-heavy, text-dense pages explaining complex programs. Educational sites often choose accessibility over design distinction, creating a "trustworthy but boring" visual standard.

**Exemplary sites described as patterns:**
- **Khan Academy** demonstrates learning-path visualization: complex curriculum mapped as navigable journeys, progress tracking integrated into the visual design, achievement systems that motivate continued learning
- **Duolingo** demonstrates gamified education: learning as play with character-driven personality, streak mechanics, and celebration animations that make progress feel rewarding
- **Patagonia Action Works** demonstrates impact visualization: environmental campaigns mapped geographically, donation impact quantified in tangible terms, urgency communicated through data
- **charity: water** demonstrates donation transparency: every dollar tracked and mapped, project completion visualized through before/after documentation, the act of giving made visible
- **The Markup** demonstrates investigative data: complex social impact stories told through interactive data visualization, journalism that makes systemic problems visible and personal
- **Gates Notes** demonstrates intellectual authority: complex global issues presented with magazine production values, data-rich content that respects the reader's intelligence

**Industry Rules:**
1. RULE: Bright, primary colors for accessibility and approachability. WHY: Education and social impact need wide audiences, including children and less tech-savvy users. WHEN TO BREAK: When the audience is sophisticated (university, professional development, donor cultivation) and the bright palette signals "children's product" to adult users.
2. RULE: Heavy use of illustration to explain complex concepts. WHY: Visual learning aids comprehension. WHEN TO BREAK: When real photography and data visualization create more credibility -- documentary imagery of actual impact outperforms cheerful illustration for donor-facing content.
3. RULE: Text-dense pages with clear hierarchy. WHY: Educational content requires thorough explanation. WHEN TO BREAK: When the content can be experienced rather than read -- interactive simulations, data explorations, and narrative experiences teach through engagement.
4. RULE: Prominent donation/enrollment CTA. WHY: Conversion to action is the primary goal. WHEN TO BREAK: When the content itself builds the case so effectively that the CTA is a natural conclusion, not a competing element -- let the story drive the action.

**Cross-Pollination Pairings:**
- PAIR WITH: Gaming / entertainment. BORROW: Progression and achievement systems -- educational content and social impact organized as quests with leveling, achievements, and social comparison. Learning or donating becomes a game with visible progress and rewards. MANIFESTS AS: Animated progress paths, achievement badges for learning milestones or donation levels, interactive maps that unlock as users engage, streak mechanics for consistent participation. DNA COMPATIBILITY: Maps to `--color-accent` for achievement highlights, `--color-glow` for celebration moments, `--motion-stagger` for progress animations, `--font-display` for milestone announcements.
- PAIR WITH: Fintech / dashboard. BORROW: Real-time impact tracking -- donations and educational progress tracked with the same visual authority and granularity as financial portfolios. Impact treated as a measurable investment with returns. MANIFESTS AS: Impact dashboards with live counters, geographic distribution maps of resources deployed, trend lines showing program growth, per-dollar impact breakdowns styled as ROI reports. DNA COMPATIBILITY: Maps to `--font-mono` for metric displays, `--color-primary` for positive impact, `--spacing-1`/`--spacing-2` for dense data layouts, `--color-border` for structured data tables.

---

### 12. Gaming / Entertainment

**The landscape:** High-energy visuals, video backgrounds, neon accents, parallax-heavy scroll experiences, auto-playing trailers. Gaming sites maximize sensory impact at the cost of usability and load time.

**Exemplary sites described as patterns:**
- **Riot Games** demonstrates world-building: each game gets a complete visual universe, character art as primary navigation, lore and gameplay interleaved in immersive scroll experiences
- **PlayStation** demonstrates premium entertainment: clean product presentation with cinematic quality, hardware photography at Apple-level production, smooth transitions between products
- **A24** demonstrates editorial entertainment: film studio as lifestyle brand, website as curated cultural experience, minimalist design that lets the content radiate personality
- **Spotify Design** demonstrates music-as-visual: audio experiences translated to visual language through color, motion, and typography that pulse with musical energy
- **Epic Games (Unreal Engine)** demonstrates technical showcase: the website itself demonstrates the rendering quality of the product, real-time 3D elements integrated into the browsing experience
- **Nintendo** demonstrates playful precision: clean, colorful design that communicates joy without chaos, character-driven navigation, the fun is in the interaction details

**Industry Rules:**
1. RULE: Auto-playing video or animated hero. WHY: Gaming is a dynamic medium; static heroes undersell the experience. WHEN TO BREAK: When the game's art style is its differentiator -- a single, exquisitely rendered still frame can be more powerful than a generic gameplay loop.
2. RULE: Dark/black backgrounds with neon or vibrant accents. WHY: Theater-mode effect that maximizes visual impact of game art. WHEN TO BREAK: When the game or entertainment product has a non-dark identity (Nintendo-style family entertainment, indie games with distinctive palettes).
3. RULE: Heavy parallax and scroll-driven animations. WHY: Demonstrates the kind of immersive experience the product delivers. WHEN TO BREAK: When performance is critical (mobile-first audiences, developing markets) or when stillness creates more impact than motion.
4. RULE: Trailer/gameplay video prominently embedded. WHY: Moving images sell interactive entertainment. WHEN TO BREAK: When interactive preview (playable demo, character creator, world explorer) is available -- playing beats watching.

**Cross-Pollination Pairings:**
- PAIR WITH: Architecture / interior design. BORROW: Spatial and material thinking -- game environments and entertainment venues presented through architectural photography principles (scale reference, material detail, spatial sequence) rather than flashy trailers. The space itself tells the story. MANIFESTS AS: Environment art presented as architectural photography, level design explained through floor plans and section drawings, material palettes for game worlds styled as interior design mood boards. DNA COMPATIBILITY: Maps to `--color-bg` as spatial background, `--spacing-4`/`--spacing-5` for contemplative presentation, `--font-display` for environment titles, restrained `--motion-duration` for deliberate reveals.
- PAIR WITH: Blog / publication / media. BORROW: Long-form editorial depth -- game worlds, character backstories, and entertainment universes documented with the same editorial seriousness as investigative journalism. Lore becomes content, not just marketing. MANIFESTS AS: Magazine-quality articles about game development, character profile pages styled as editorial features, world-building documentation presented as encyclopedic reference. DNA COMPATIBILITY: Maps to `--font-body` optimized for long-form reading, `--font-display` for editorial headers, `--spacing-3` for narrative rhythm, `--color-surface` for content blocks.
- PAIR WITH: Education / social impact. BORROW: Learning pathway visualization -- game progression systems (skill trees, achievement maps, unlock sequences) presented with educational clarity, making complex game systems visually navigable and understandable. MANIFESTS AS: Interactive skill trees, progression maps with clear node connections, tutorial sequences styled as learning paths, achievement visualizations. DNA COMPATIBILITY: Maps to `--color-accent` for unlocked nodes, `--color-muted` for locked content, `--motion-stagger` for progressive reveals, `--font-mono` for stat labels.

---

## Layer 3: Integration Context

### Constraint-Breaking Protocol

When presenting borrowed elements or convention breaks to users during brainstorm, use this structured format. Each break is individually approvable -- users can accept some and reject others from a direction they otherwise like.

```
INDUSTRY RULE: [The convention being broken]
WE BREAK THIS BY: [The alternative approach]
BORROWED FROM: [Source industry + the design principle being transplanted]
WHY: [Rationale tied to THIS project's goals, not generic reasoning]
DNA EXPRESSION: [Which specific DNA tokens carry this break -- color, type, spacing, or motion]
ARCHETYPE CHECK: [Compatible | Incompatible with [archetype name] -- cite specific archetype rule]
```

Example:
```
INDUSTRY RULE: SaaS products must show product screenshot in hero
WE BREAK THIS BY: Full-viewport typographic statement with scroll-triggered product reveal below fold
BORROWED FROM: Fashion editorial -- sequential narrative revelation where information unfolds through chapters
WHY: This developer tool's value is abstract (code quality) -- a screenshot of a linter UI is anticlimactic, but a bold statement of purpose creates desire
DNA EXPRESSION: --font-display at 10vw scale, --spacing-5 between hero and reveal, --motion-duration at 1.2s for slow reveal
ARCHETYPE CHECK: Compatible with Neo-Corporate -- large typography is a mandatory technique, editorial pacing aligns with controlled sophistication
```

### Double Coherence Guardrail

Every borrowed element and every convention break MUST pass both gates before being presented to the user. If either gate fails, the break is rejected and an alternative is found.

**Gate 1: DNA Token Expressibility**
Can this borrowed element be expressed using the project's DNA token system?
- 12 color tokens (8 semantic + 4 expressive)
- Type scale (display, body, mono fonts + 8-level scale)
- Spacing scale (5 levels)
- Motion tokens (duration, easing, stagger)
- Signature element

If the borrowed element requires visual language OUTSIDE the DNA token system (e.g., a gradient technique for an archetype that maps to solid colors, or a typeface not in the approved list), it FAILS Gate 1.

**Gate 2: Archetype Compatibility**
Does this borrowed element conflict with the chosen archetype's forbidden patterns?
- Check the archetype's forbidden list in `design-archetypes` skill
- Check the archetype's mandatory techniques -- does the break undermine a requirement?
- Check the archetype's tension zones -- does the break align with an approved tension type?

If the borrowed element triggers a forbidden pattern or undermines a mandatory technique, it FAILS Gate 2.

**Gate failure handling:** Do NOT present failed breaks to the user. Find an alternative pairing or break from the same industry's catalog that passes both gates.

### Integration with design-brainstorm

The brainstorm protocol calls this skill during direction generation. For each of the 3 creative directions:

1. Identify the target industry from project discovery
2. Look up that industry's rule catalog (4-6 conventions)
3. Select 1-3 rules to break (based on boldness calibration)
4. For each break, find a cross-pollination pairing from a distant industry
5. Run both coherence gates on each break
6. Format using the Constraint-Breaking Protocol
7. Present breaks as part of the creative direction (individually approvable)

### Integration with creative-tension

Cross-pollination breaks can serve as the creative tension moment for a direction. The borrowed principle maps to one of the 5 tension levels:

| Borrowed Principle Type | Maps to Tension Level |
|------------------------|----------------------|
| Spatial/scale philosophy (architecture, fashion editorial) | Level 1: Scale Violence |
| Material/texture collision (craft, gaming environments) | Level 2: Material Collision |
| Temporal/pacing approach (publication, luxury) | Level 3: Temporal Disruption |
| Dimensional/spatial break (architecture, gaming) | Level 4: Dimensional Break |
| Interaction model transplant (gaming, fintech) | Level 5: Interaction Shock |

### Integration with design-dna

Cross-pollination outputs feed directly into DNA generation:
- Borrowed color principles influence the 4 expressive tokens (`--color-glow`, `--color-tension`, `--color-highlight`, `--color-signature`)
- Borrowed typography principles influence font selection and scale usage
- Borrowed spacing principles influence the 5-level spacing scale emphasis
- Borrowed motion principles influence the 8+ motion tokens

### Related Skills

- `design-brainstorm` -- Primary consumer of this skill. Calls cross-pollination during creative direction generation
- `design-archetypes` -- Provides forbidden pattern lists and archetype compatibility data for Gate 2
- `design-dna` -- Provides token system structure for Gate 1
- `creative-tension` -- Receives tension-level mappings from borrowed principles

## Layer 4: Anti-Patterns

### Anti-Pattern: Surface-Level Borrowing

**What goes wrong:** Cross-pollination suggestions borrow visual TRAITS instead of design PRINCIPLES. "Borrow serifs from fashion" or "borrow dark mode from gaming" -- these are surface-level observations that any designer would already consider. The result is generic suggestions that don't create genuine differentiation.
**Instead:** Borrow the underlying design PHILOSOPHY: fashion's sequential narrative revelation, gaming's progression-driven disclosure, architecture's spatial hierarchy through negative space. Every pairing must describe a transplantable PRINCIPLE with a specific manifestation and DNA token mapping. If the pairing can be described in one word ("serifs", "dark mode", "animations"), it is too shallow.

### Anti-Pattern: Kitchen Sink Pollination

**What goes wrong:** Borrowing from 4+ industries in a single creative direction, creating incoherent visual noise. A SaaS site with fashion typography AND gaming animations AND architecture spatial thinking AND restaurant warmth reads as confused, not creative.
**Instead:** 1 primary distant-industry pairing per creative direction, maximum 2 borrowed principles per direction. Each direction has a clear conceptual anchor. The boldness calibration table limits break count by archetype personality.

### Anti-Pattern: Breaking Without Rebuilding

**What goes wrong:** Stating that an industry rule is broken without providing the replacement approach. "We break the product screenshot convention" is incomplete without defining what replaces it and how that replacement maps to DNA tokens.
**Instead:** Every break MUST include the alternative approach AND its DNA expression. The Constraint-Breaking Protocol format enforces this -- no field can be left empty. A break without a replacement is not creative; it is destructive.

### Anti-Pattern: Ignoring Coherence Gates

**What goes wrong:** Presenting borrowed elements that cannot be expressed in the project's DNA tokens or that conflict with the chosen archetype's forbidden patterns. The user approves a direction that is impossible to build coherently, leading to DNA violations during execution.
**Instead:** ALWAYS run both gates (DNA Token Expressibility + Archetype Compatibility) before presenting any break to the user. If a gate fails, find an alternative. Gate checking is not optional -- it prevents impossible directions from being approved.

### Anti-Pattern: Safe Adjacent Borrowing

**What goes wrong:** "SaaS borrows from other SaaS" or "fashion borrows from luxury" or "restaurant borrows from food photography." Adjacent-industry borrowing produces predictable results because the industries already share visual language.
**Instead:** Force at least one pairing from a genuinely distant industry. The pairing matrix in Layer 2 deliberately pairs industries that share few visual conventions. SaaS paired with fashion editorial or gaming. Fashion paired with data dashboards. The creative value comes from the DISTANCE between source and target.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| industry_verticals | 12 | - | count | HARD -- all 12 verticals must be available for lookup |
| rules_per_industry | 4 | 6 | count | HARD -- each vertical must have 4-6 breakable rules |
| pairings_per_industry | 2 | 3 | count | HARD -- each vertical must have 2-3 distant pairings |
| breaks_conservative | 1 | 1 | count | HARD -- conservative archetypes get exactly 1 break |
| breaks_moderate | 1 | 2 | count | HARD -- moderate archetypes get 1-2 breaks |
| breaks_bold | 2 | 3 | count | HARD -- bold archetypes get 2-3 breaks |
| breaks_luxury_ethereal | 1 | 1 | count | HARD -- luxury/ethereal get 1 high-refinement break |
| coherence_gate_count | 2 | 2 | gates | HARD -- both DNA and archetype gates must pass |
| principles_per_direction | 1 | 2 | count | HARD -- max 2 borrowed principles per creative direction |
| cross_pollination_distance | 2 | - | steps | SOFT -- at least 1 pairing should be from a distant industry |
