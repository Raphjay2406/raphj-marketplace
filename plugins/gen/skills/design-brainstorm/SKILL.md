---
name: design-brainstorm
description: "Research-first creative direction engine. Studies Awwwards winners, Land-book, SiteInspire, Cosmos.so moodboards, and competitor sites before generating 3 distinct creative directions with concept boards, ASCII mockups, and competitive positioning. v3.1: Layer 2.5 deep-inspiration research + offline industry-rules fallback + decision-entropy-lens heuristic from bencium."
tier: core
triggers: "brainstorm, design brainstorm, creative direction, design exploration, visual direction, competitive landscape, design concepts, brainstorm phase, design direction, inspiration, moodboard, land-book, siteinspire, cosmos, awwwards archive"
version: "3.1.0"
---

## v3.1 Addendum: Layer 2.5 Deep-Inspiration Research (OAuth-free)

When `inspiration_depth: deep` flag is set (via `/gen:start-project` discovery), run 4 parallel research tracks via Playwright MCP. All OAuth-free — no per-user API registration.

### Track 1 — Land-book (landing-page archetype match)
URL: https://land-book.com. Full public. Filter by style × industry × color. Capture 5 references to `.planning/genorah/inspiration/landbook/`.

### Track 2 — SiteInspire (best taxonomy)
URL: https://www.siteinspire.com. 4-axis filter (style × type × subject × platform). Capture 5 references. Mirror their axes into competitive-benchmarking.

### Track 3 — Cosmos.so (visual moodboards for palette)
URL: https://www.cosmos.so. Hex-color filter. Capture 3-5 curation boards, not individual shots.

### Track 4 — Awwwards archive (existing, now deeper)
Multi-filter queries (tag + color + era) for less-obvious past SOTD references. 5 per session.

### Deferred
- Dribbble (OAuth required — defer v3.2)
- Mobbin (paywalled — revisit when paid seat available)
- FWA / Httpster / Lapa Ninja — narrower or redundant

### Legal guardrails (hard)
- Rate-limit: ≤1 request per 2s per source
- Store URL + metadata + thumbnail only. Never republish scraped content.
- Cite source URL in generated DESIGN-DNA.md inspiration block.
- Respect robots.txt.

### Decision-Entropy Heuristic (from bencium/negentropy-lens)

When evaluating 3 creative directions during Phase 3, score each on compounding-vs-decay axis 1–5:

- **Compounding:** Elements build on each other (signature element reinforced by tension zones, motion language visible across 3+ beats, color palette produces derived expressive tokens naturally).
- **Decaying:** Elements feel stapled (signature in hero but nowhere else, motion happens once, palette fights itself, requires remapping per section).

Directions scoring ≤2 should be revised or dropped before presenting to user.

### Offline fallback

If Playwright MCP unavailable OR rate-limited across all 4 sources:

1. Load `skills/design-brainstorm/seeds/uipro-industry-rules.json`.
2. Match project industry.
3. Use `recommended_pattern` + `style_priority` + `key_effects` as inspiration seed.
4. Note `research_mode: offline (uipro-rules)` in output.

---


Trigger: During brainstorm phase, when generating creative directions, when exploring design concepts, when studying competitive landscape, design exploration, visual direction.

You are a creative director who never designs from a blank slate. Every creative decision is grounded in competitive research, cross-industry inspiration, and strategic differentiation. You study the landscape, identify opportunities, and generate directions that are both creatively bold and strategically sound.

## Layer 1: Decision Guidance -- The Brainstorm Protocol

This is a prescriptive 7-phase protocol. Execute phases sequentially. Do NOT skip phases. Do NOT begin direction generation (Phase 5) without completing research (Phases 1-3).

### Phase 1: Brief Extraction

Before any research, extract from the project context (discovery output from `/gen:start-project` Phase 1):

| Field | Source | Purpose |
|-------|--------|---------|
| **Industry vertical** | PROJECT.md | Maps to Curated Industry Library below |
| **Brand personality** | Discovery answers | 4-6 adjectives that guide archetype shortlisting |
| **Target audience** | Discovery answers | Who must be impressed -- determines visual sophistication level |
| **Emotional response target** | Discovery answers | What visitors should FEEL -- drives arc and motion choices |
| **Known constraints** | Discovery answers | Existing brand colors, fonts, technical requirements (framework, hosting) |
| **Competitive landscape** | Discovery answers + research | Direct competitors to differentiate from |

If any field is missing from the discovery output, ASK the user before proceeding. Do NOT guess the industry vertical or target audience.

### Phase 2: Industry Research

1. Look up the project's industry in the **Curated Industry Library** (Layer 2 below)
2. Study 6-8 reference sites from the curated library for the relevant vertical -- run each through the Competitive Teardown (Phase 3)
3. If web search is available: supplement with 2-3 CURRENT award winners from Awwwards/SOTD in the same industry. Search for "[industry] site of the day awwwards 2025 2026"
4. Include 2-3 references from OUTSIDE the industry -- pull from the `cross-pollination` skill's pairing suggestions for this vertical. These outside-industry references are NOT optional; they are where differentiation begins
5. For each reference site, run the Competitive Teardown (Phase 3)
6. Output: structured research findings in `.planning/genorah/research/DESIGN-REFERENCES.md`

**Multi-industry projects** (e.g., "a SaaS product for restaurants"):
- Identify primary and secondary verticals
- Research both verticals (6-8 sites from primary, 3-4 from secondary)
- Cross-pollination comes from OUTSIDE both verticals (not between them -- that is adjacent, not distant)
- Archetype shortlisting considers both audience expectations
- Direction generation emphasizes the primary vertical's audience while borrowing depth from the secondary

### Phase 3: Competitive Teardown

For EACH reference site analyzed, produce a structured teardown. Every reference gets the full 3-dimension analysis -- "Linear is cool" is NOT a teardown.

```markdown
### [Site Name] -- [URL]
**Industry:** [vertical] | **Relevance:** [direct competitor / adjacent / outside-industry inspiration]

**Visual Patterns:**
- Color approach: [palette character, dark/light, accent strategy]
- Typography: [font choices, hierarchy approach, display font character]
- Layout: [grid structure, breaking points, asymmetry vs. symmetry]
- Depth: [shadows, layers, glass effects, texture]
- Motion: [intensity level (1-5), signature motion, scroll behavior]
- Signature element: [what makes this site visually memorable]

**Content Strategy:**
- Headline style: [declarative / question / provocative / minimal]
- CTA philosophy: [aggressive / subtle / absent / progressive]
- Social proof: [placement, specificity, format]
- Narrative approach: [story-driven / feature-list / demo-first / manifesto]
- Voice personality: [formal / casual / technical / warm]

**UX Flow Analysis:**
- First impression: [what captures attention in first 2 seconds]
- Scroll depth: [estimated sections, pace, content density]
- Conversion path: [steps to primary action]
- Mobile strategy: [simplified / adapted / different experience]

**Key Takeaways for Our Project:**
1. [What to learn from this site]
2. [What to avoid / differentiate from]
3. [Opportunity this site does not exploit]
```

After completing all teardowns, write a **Research Synthesis** (5-8 bullet points):
- What visual patterns dominate this industry?
- Where is every competitor converging? (This is where WE diverge.)
- What content strategy patterns work? Which are stale?
- What outside-industry principles could transform this space?
- What is the single biggest differentiation opportunity?

### Phase 4: Archetype Shortlisting

Based on research findings, shortlist 3 archetypes for direction generation:

1. Read the `design-archetypes` skill's Archetype Selection Guide for the project's industry
2. Cross-reference with what competitors are NOT doing -- if every competitor uses Neo-Corporate, that archetype is a differentiation dead-end
3. Shortlist 3 archetypes:
   - **One aligned:** matches the industry's audience expectations and the brand personality
   - **One moderate:** a credible alternative that shifts the visual register without alienating the audience
   - **One unexpected:** a bold choice from outside the obvious recommendations, justified by research findings. The unexpected choice is often the most award-winning direction
4. For each shortlisted archetype, read the `cross-pollination` skill's pairing suggestions to identify which constraint breaks and borrowed principles to explore
5. Document the shortlist with 1-sentence rationale per archetype

### Phase 5: Direction Generation

For each of the 3 shortlisted archetypes, generate a full creative direction:

1. Build a complete concept board following the `creative-direction-format` skill's template (all 11 sections REQUIRED)
2. Include cross-pollination elements from the `cross-pollination` skill -- 1-2 constraint breaks per direction, calibrated to archetype boldness
3. Create ASCII mockups following the `creative-direction-format` skill's standardized format (12-symbol vocabulary, mandatory annotations)
4. Include an emotional arc suggestion referencing the `emotional-arc` skill's beat types
5. Include a tension plan preview referencing the `creative-tension` skill's 5 tension types
6. Include sample headlines using the `micro-copy` skill's beat-specific patterns, adapted to the direction's voice
7. Run the distinctness validation matrix from the `creative-direction-format` skill -- all 3 directions MUST pass (3+ of 6 dimensions differ)
8. If validation fails: regenerate the most similar direction with forced shifts on 2+ dimensions

### Phase 6: User Selection and Mixing

1. Present 3 directions using the `creative-direction-format` skill's presentation structure
2. Present alongside a competitive benchmark comparison table showing how each direction positions against competitors found in research
3. User selects one direction OR cherry-picks elements across directions
4. If a single direction is chosen: proceed directly to Phase 7
5. If mixing: follow the `creative-direction-format` skill's 7-step free mixing protocol (capture preferences, identify base, map cherry-picks, coherence check, resolve conflicts, user confirms, lock into DNA)
6. Lock the final direction into Design DNA format (reference `design-dna` skill for the template structure)

### Phase 7: Brand Voice Generation

After direction is selected and locked, generate the brand voice document. This phase is MANDATORY -- brainstorm is incomplete without it.

1. Read the `copy-intelligence` skill's Brand Voice Document Template
2. Populate the template using:
   - The selected archetype's voice personality from the `copy-intelligence` skill's Archetype Voice Profiles table
   - The brand personality adjectives from the brief
   - The content strategy patterns observed during competitive teardown
   - The direction's tone (from the concept board's typography and headline samples)
3. Generate the complete BRAND-VOICE.md document (all sections required per the template)
4. Save to `.planning/genorah/BRAND-VOICE.md`
5. This runs as the FINAL step of brainstorm, before section planning begins
6. Confirm generation in BRAINSTORM.md: `Brand Voice: Generated -- see BRAND-VOICE.md`

---

## Layer 2: Curated Industry Reference Library

12 industry verticals with exemplary sites described as patterns. Pattern descriptions survive site redesigns -- they describe WHAT the site demonstrates, not what it currently looks like.

When researching a project, look up the relevant vertical(s), study the listed reference sites, and supplement with live web search for current award winners.

---

### 1. SaaS / Developer Tools

**Exemplary sites:**
- **Linear** -- velocity-as-brand: every interaction responds instantly, changelogs become marketing content, keyboard-shortcut culture visualized through micro-interactions. Dark mode with restrained accent colors, monospace micro-detail in labels, product-as-hero with live interactive elements above the fold
- **Vercel** -- infrastructure-as-aesthetic: deployment diagrams become hero illustrations, terminal output styled as design elements, the build process itself drives the visual narrative. Gradient-heavy dark palette with depth through layered surfaces
- **Raycast** -- command-palette centrality: the search interface IS the product identity, dark + monospace + purple creates productive-night-owl mood, spotlight-style interactions applied consistently across every page
- **Supabase** -- open-source warmth in developer tools: approachable illustration alongside technical content, green as trust color, documentation-quality writing on marketing pages, community-first visual language that softens the typical dev-tool coldness
- **Clerk** -- auth-as-design: authentication flows treated as brand moments, component previews used as hero content, developer experience visualized through actual rendered UI components rather than screenshots
- **Railway** -- spatial deployment: infrastructure mapped as navigable geography, dark canvas with animated node connections, mental model of servers becomes visual space the user explores
- **Stripe** -- documentation-as-product: API reference pages that feel like premium editorial, gradient meshes as signature element, code snippets treated as first-class visual content with syntax highlighting as brand expression
- **Resend** -- email-infrastructure-made-beautiful: React component aesthetic applied to an unsexy category, clean dark interfaces that make email delivery feel modern, developer-first but designer-approved

**Visual landscape:** Dark mode dominance with glass cards, dot/grid backgrounds, and monospace accents. Product screenshots and live demos as hero content. Metric-heavy social proof. Most sites converge on the "serious software" aesthetic -- dark, precise, restrained.

**Content patterns:** Feature-first headlines, "trusted by X teams" social proof badges, developer-tone CTAs ("Start building" not "Get started"), documentation-quality body copy with code examples inline.

**Differentiation opportunities:**
- Light mode as a statement -- nearly every developer tool defaults to dark; a confident light-mode SaaS site stands out immediately
- Editorial typography in a space dominated by Inter and system fonts -- using a distinctive display typeface signals design confidence
- Narrative-driven pages instead of feature grids -- telling the story of how the product changes workflow instead of listing 12 features
- Illustration or photography in a space allergic to non-product imagery

---

### 2. E-commerce / Fashion

**Exemplary sites:**
- **Kith** -- streetwear-editorial hybrid: product pages that feel like magazine spreads, full-bleed imagery with minimal UI chrome, editorial lookbook content mixed with commerce, typography as large as the photography
- **Jacquemus** -- playful luxury: oversized product photography with surreal art direction, warm saturated palette that breaks luxury-brand neutrality, unexpected layout compositions that make browsing feel like gallery-walking
- **SSENSE** -- editorial commerce: magazine-quality content integrated with shopping, stark black-and-white UI that lets product photography dominate, mix of fashion criticism and product listing
- **Arc'teryx** -- performance-meets-design: outdoor tech brand with Swiss precision in layout, product detail photography that rivals architecture shoots, dark palette signaling technical seriousness
- **Balenciaga** -- brutalist fashion: confrontational typography at extreme scale, anti-design aesthetic used as luxury signal, deliberately uncomfortable layouts that create exclusivity through visual difficulty
- **The Row** -- minimalist luxury: extreme negative space, microscopic typography, barely-there UI that forces attention onto fabric and form, whisper-quiet design as the ultimate luxury statement
- **Aesop** -- sensory retail: warm editorial tone, ingredient-focused storytelling, location pages that feel like architectural essays, brand voice as distinctive as the visual design
- **END.** -- curated discovery: editorial features driving product exploration, dark interface with vibrant product photography, community culture integrated into commerce through editorial content

**Visual landscape:** Image-forward with minimal UI. Either stark black-and-white minimalism (luxury tier) or vibrant color saturation (streetwear/DTC). Typography ranges from whisper-quiet to confrontationally large. Product photography IS the design.

**Content patterns:** Minimal copy -- products speak through images. Editorials and lookbooks replace traditional marketing. CTAs are subtle ("Add to bag" not "Buy now!"). Brand storytelling through about/journal sections. Voice is either coolly detached (luxury) or enthusiastically authentic (streetwear/DTC).

**Differentiation opportunities:**
- Interactive product exploration (3D viewers, fabric zoom, AR try-on) -- most fashion sites rely on static photography
- Sound and motion in product pages -- the tactile quality of fashion is lost in silent, static web pages
- Community-generated content elevated to editorial quality -- real customers styled as editorially as professional shoots

---

### 3. E-commerce / General Retail

**Exemplary sites:**
- **Apple** -- product theatre: each product page is a cinematic experience with scroll-driven reveals, 3D product rotation, and progressive disclosure of specifications. Dark-to-light transitions mark section shifts. Photography is engineering documentation elevated to art
- **Dyson** -- technology storytelling: engineering cutaways and airflow visualizations make invisible product features visible, motion graphics explain complex technology, product pages that feel like science documentaries
- **Teenage Engineering** -- playful technical: bright orange brand color applied relentlessly, product-as-art-object photography, technical specifications presented with toy-like enthusiasm, interface design that mirrors their hardware aesthetic
- **IKEA** -- democratic design: room-context photography showing products in lived-in spaces, planning tools integrated into browsing, accessibility-first with clear hierarchy and generous spacing
- **Allbirds** -- sustainability narrative: material storytelling (wool fiber closeups, sugarcane harvesting), environmental metrics visualized alongside product features, warm earth palette reinforcing natural positioning
- **Nothing** -- dot-matrix futurism: monospaced type, dot-grid patterns, transparent hardware aesthetic translated to web, retro-future visual language that makes consumer electronics feel countercultural
- **Hay** -- Scandinavian commerce: warm neutral palette, generous whitespace, lifestyle photography where products exist in aspirational spaces, grid layouts with intentional asymmetry

**Visual landscape:** Product photography dominates. Two poles: cinematic product-theater (Apple, Dyson) vs. lifestyle-context (IKEA, Hay). Scroll-driven animations for product reveals. Specifications as visual content, not data tables.

**Content patterns:** Product benefit headlines over feature lists. Technical specs elevated through visual presentation. Customer reviews prominently placed. CTAs range from aggressive ("Add to cart") to experiential ("Explore"). Sustainability/origin stories as differentiators.

**Differentiation opportunities:**
- Configurator experiences that let users build their product visually before purchase -- most retail sites show predefined SKUs
- Comparison tools that are genuinely useful (not feature-check matrices) -- helping users choose rather than just displaying options
- Post-purchase experience design (unboxing, setup, first-use) previewed on the product page itself

---

### 4. Creative Agency / Design Studio

**Exemplary sites:**
- **Locomotive** -- technical showmanship: every page demonstrates a different web capability (smooth scroll, WebGL transitions, complex page transitions), the portfolio IS the proof of skill, dark palette with electric accents
- **Dogstudio** -- immersive 3D: WebGL environments that users navigate, case studies presented as interactive experiences rather than image galleries, the agency website itself is the most impressive case study
- **Aristide Benoist** -- typographic mastery: display type at extreme scales, elegant page transitions that maintain reading flow, French typographic tradition meeting web technology, restraint as a demonstration of skill
- **Huncwot** -- editorial case studies: long-form project narratives with cinematic scroll, each case study has its own visual identity derived from the client brand, careful balance of self-expression and client representation
- **Resn** -- playful experimentalism: interactive toys and games as portfolio pieces, each project page breaks different web conventions, the navigation itself is an experience, irreverent tone that demonstrates creative range
- **Basic/Dept** -- scale-meets-craft: enterprise agency with boutique-quality case studies, data visualizations of impact metrics alongside design work, confident grid layouts that organize complex project histories
- **Lusion** -- WebGL art gallery: each project is a mini-experience with custom shaders, the transition between projects is as designed as the projects themselves, dark environments where work glows

**Visual landscape:** Maximalist technical showcasing. Custom cursors, page transitions, WebGL effects, and scroll-driven animations are expected -- not nice-to-have. Dark palettes dominate. Typography is dramatic. The agency website IS the portfolio.

**Content patterns:** Minimal marketing copy -- work speaks through interactive case studies. "Selected work" not "Our portfolio." Client logos as social proof. Team/culture pages as brand personality expression. Manifesto-style about pages over corporate descriptions.

**Differentiation opportunities:**
- Showing the process, not just the output -- behind-the-scenes of how design decisions were made
- Results-driven case studies that include measurable impact (conversion rates, awards won, user metrics) alongside beautiful visuals
- Collaborative/interactive elements that let visitors engage with the agency's creative process

---

### 5. Portfolio / Personal

**Exemplary sites:**
- **Bruno Simon** -- 3D portfolio: entire portfolio navigable as a 3D driving game, technical mastery as personal brand, playful interaction design demonstrating creative engineering
- **Brittany Chiang** -- developer elegance: clean, structured portfolio with beautiful attention to micro-detail, dark palette with green accent, the code quality visible in the design quality, terminal/code aesthetic that feels personal not generic
- **Bartosz Jarocki** -- minimalist resume: extreme simplicity, no framework bloat, the restraint itself communicates confidence, inspired the open-source "cv" template used by thousands
- **Robb Owen** -- generative art portfolio: custom generative backgrounds that change on each visit, portfolio as living artwork, technical creativity demonstrated through the portfolio medium itself
- **Lynn Fisher** -- experimental web art: annual site redesigns that each explore a different web technique, CSS art, responsive design as creative medium, personality expressed through technical play
- **Paco Coursey** -- design-engineering hybrid: minimal interface with exquisite interaction details, dark mode with precise typography, each detail reveals craft on closer inspection, quality over quantity

**Visual landscape:** Highly personal -- the portfolio IS the designer/developer. Ranges from extreme minimalism (Jarocki) to maximum experimentation (Bruno Simon). Custom interactions and unique navigation patterns expected. The visual language must feel like it could only belong to this person.

**Content patterns:** First-person voice. Selected work (quality over quantity, 4-8 projects). Brief about section that reveals personality. Contact as invitation, not form. Blog/writing as thought leadership signal. Role descriptions specific ("design engineer" not "creative professional").

**Differentiation opportunities:**
- Interactive case study formats that let visitors engage with the work, not just view screenshots
- Personality expression beyond the portfolio section -- navigation, loading states, 404 pages, Easter eggs
- Process documentation that shows thinking, not just results

---

### 6. Blog / Publication / Media

**Exemplary sites:**
- **The Pudding** -- visual essay journalism: each article is a bespoke interactive experience with custom data visualizations, scroll-driven narratives, and unique visual treatments. No two articles share the same template
- **Stripe Press** -- publisher-quality web: book-worthy typography, generous margins, illustration programs commissioned per title, the web reading experience rivals physical print quality
- **Readymag Stories** -- design journalism: each story has its own visual identity and interactive elements, the publication platform itself is the product showcase, editorial design that pushes web conventions
- **Monocle** -- editorial authority: confident serif typography, magazine-grid layouts adapted for web, premium photography, the visual design communicates credibility before a word is read
- **The Verge** -- bold tech media: saturated color coding per section, dramatic display typography, aggressive visual hierarchy that manages massive content volume without feeling cluttered
- **Aeon** -- intellectual minimalism: extreme typographic focus, zero visual noise, generous line-height and margins, the design says "the ideas are enough"
- **Bloomberg Businessweek** -- data-rich editorial: infographics as art, bold color palettes per story, custom illustrations that are editorial commentary themselves

**Visual landscape:** Typography-dominated. Serif fonts signal authority. Generous whitespace and reading-optimized line lengths. Article pages are the primary design surface, not the homepage. Custom illustration programs differentiate from stock photography.

**Content patterns:** Long-form as premium signal. Headlines that provoke or intrigue. Bylines prominently displayed (author as brand). Section/category visual coding. Newsletter capture as primary conversion (not product sale). Quotes and pullquotes as visual rhythm elements.

**Differentiation opportunities:**
- Interactive data visualizations embedded in articles, not separated into a "data" section
- Audio/podcast integration treated as first-class content alongside text
- Personalized reading experiences that adapt typography, density, or content recommendations

---

### 7. Health / Wellness

**Exemplary sites:**
- **Headspace** -- playful mindfulness: custom illustration system with consistent characters, warm palette with soft gradients, animation that mirrors breathing/meditation rhythms, the UI itself feels calming
- **Calm** -- nature-as-interface: full-bleed nature photography and ambient video, sound integrated into the browsing experience, dark evening palette, the website IS a calming experience before you sign up
- **Oura** -- health-tech premium: dark interface with biometric data visualizations, ring product as hero object, health metrics presented with editorial quality, premium positioning through restraint
- **Noom** -- behavioral science made approachable: bright, warm palette, conversational UI patterns, progress visualizations, the design bridges clinical credibility with personal approachability
- **Eight Sleep** -- performance optimization: dark-mode health tech, data visualizations of sleep metrics, temperature as visual metaphor (cool blue gradients), clinical precision meets consumer polish
- **Ritual** -- transparent wellness: ingredient-focused product photography, supply chain visualization, clean white palette with single accent color, science-backed messaging with warm delivery

**Visual landscape:** Split between two aesthetics: calming/soft (Headspace, Calm) and clinical/premium (Oura, Eight Sleep). Soft gradients, rounded shapes, and generous spacing in the calming tier. Dark backgrounds with data visualizations in the clinical tier. Nature imagery and breathing-rhythm animations are common.

**Content patterns:** Benefit-first headlines ("Sleep better" not "Smart mattress"). Testimonials focused on life transformation. Scientific backing presented accessibly (not journal-paper citations). Progressive disclosure of health claims (gentle hook, deeper evidence below). Trust signals through certifications, studies, expert endorsements.

**Differentiation opportunities:**
- Interactive self-assessment tools that personalize the experience before any product push
- Community/social proof beyond testimonials -- showing real user journeys with data
- Sound design in the browsing experience -- ambient audio that reinforces the wellness positioning

---

### 8. Food / Beverage / Restaurant

**Exemplary sites:**
- **Noma** -- culinary theatre: each dish presented as art with nature-context photography, seasonal navigation (menu changes with the calendar), editorial storytelling about ingredients and philosophy, the website is an extension of the dining experience
- **Aesop** (crossover reference) -- sensory retail applied to beverage/beauty: ingredient storytelling, location pages as architectural essays, warm editorial voice, every product page reads like a recipe
- **Ghia** -- aperitif-brand-as-lifestyle: warm vintage palette, editorial photography mixing product and lifestyle, the non-alcoholic positioning expressed through inclusive, celebratory visual language
- **Recess** -- modern beverage branding: pastel gradient palette, 3D product renders floating in abstract environments, playful motion (bouncing, floating), Gen-Z-friendly sans-serif typography
- **Dishoom** -- restaurant-as-storytelling: the Bombay cafe narrative drives every visual decision, vintage photography, handwritten typography, the menu IS the story, cultural heritage expressed through design details
- **Blue Bottle Coffee** -- craft simplicity: white space as premium signal, product photography that rivals still life painting, minimal copy letting the coffee sourcing story unfold through images
- **Erewhon** -- grocery-as-luxury: clean white interface with category-coded accent colors, product photography as lifestyle aspiration, health messaging with premium positioning

**Visual landscape:** Photography-dominant -- food must look extraordinary. Warm palettes (amber, cream, terracotta) for artisan/traditional. Pastel or vibrant for modern/DTC brands. Hand-drawn elements and custom illustrations for personality. Editorial food photography is non-negotiable.

**Content patterns:** Sensory language ("rich", "bright", "slow-roasted"). Origin stories are the primary brand narrative. Menu/product as the hero content. Location pages with personality. Reservation/ordering as the primary conversion. Voice ranges from poetic (Noma) to playful (Recess).

**Differentiation opportunities:**
- Interactive menu experiences that reveal ingredients, pairings, or preparation on hover/click
- Seasonal content that changes the entire site aesthetic with the menu rotation
- Sound and ambient elements that evoke the dining/tasting experience

---

### 9. Fintech / Dashboard

**Exemplary sites:**
- **Mercury** -- banking-for-startups: clean, confident interface, dark and light modes equally polished, the dashboard aesthetic extends to marketing pages, metric displays that feel premium not clinical
- **Ramp** -- corporate card clarity: data-dense interfaces that never feel cluttered, clear visual hierarchy through color coding, the product complexity communicated through progressive disclosure
- **Wise** -- currency-as-visual: real-time rate displays as hero content, the transfer flow visualized step-by-step, trust built through transparency (showing fees upfront), global-feeling design with local currency touches
- **Brex** -- enterprise fintech: dark mode with data visualizations, confidence through restraint, the "serious money" aesthetic achieved through typography and spacing rather than decoration
- **Robinhood** -- democratized investing: clean white interface with green as the brand/profit color, data charts as the primary visual content, progressive complexity (simple surface, powerful depth)
- **Nubank** -- challenger bank personality: bold purple brand color, friendly illustration system alongside financial data, the design communicates "banking should be enjoyable"
- **Plaid** -- infrastructure fintech: connection visualizations (nodes/lines), developer-friendly aesthetic, the invisible product (financial APIs) made visible through diagrams

**Visual landscape:** Two camps: trust-through-restraint (Mercury, Brex) and personality-forward (Nubank, Robinhood). Data visualization is central. Green = profit/positive, red = loss/negative is universal. Dashboard screenshots as hero content. Dark mode increasingly standard for the "professional trader" feel.

**Content patterns:** Security and trust messaging prominent. Metric-first headlines ("Save $50K/year" not "Better banking"). Fee transparency as marketing differentiator. Customer logos/counts as social proof. Compliance badges (SOC2, PCI) displayed without apology. Voice is confident and clear, never playful about money.

**Differentiation opportunities:**
- Interactive calculators that show personal savings/benefit before signup -- most fintech sites promise savings without proving it
- Real-time data elements on marketing pages (live rates, current yield) that make the page feel alive
- Human stories alongside financial data -- the people behind the numbers

---

### 10. Architecture / Interior Design

**Exemplary sites:**
- **Bjarke Ingels Group (BIG)** -- architecture-as-storytelling: project pages that unfold like documentaries, model renders mixed with construction photography, infographics explaining spatial concepts, the website mirrors the practice's storytelling approach to architecture
- **Studio Gang** -- structure-as-design: the structural innovation of each project drives its visual presentation, material textures used as backgrounds, section layouts that echo architectural plans
- **Norm Architects** -- Nordic precision: extreme minimalism with material warmth, photography where architecture meets light, white space as spatial metaphor, the website embodies the design philosophy it represents
- **Foster + Partners** -- scale communication: aerial photography and section drawings at scale, timeline navigation through decades of work, the technical complexity of projects communicated through progressive disclosure
- **Snohetta** -- landscape integration: projects presented in their environmental context, photography that captures the relationship between building and landscape, editorial writing about design philosophy
- **Olson Kundig** -- craft detail: macro photography of material joints and hardware, the tactile quality of architecture translated to screen through extreme close-ups, warm palette reflecting Pacific Northwest materials

**Visual landscape:** Photography-dominated with extreme attention to lighting and composition. White backgrounds with generous spacing. Grid layouts that echo architectural plans. Material textures (concrete, wood, stone) as subtle background elements. Typography is restrained -- the architecture is the statement.

**Content patterns:** Project-first navigation ("Selected projects" not "Our work"). Location and year as metadata. Brief conceptual descriptions, not marketing copy. Photography sequences that tell the spatial story (approach, entry, interior, detail). Awards and publications as credibility signals.

**Differentiation opportunities:**
- Interactive 3D model viewers that let users explore projects spatially, not just view photographs
- Material palettes presented as interactive elements (touch/click to explore textures)
- Timeline or map-based project navigation that connects work to place and time

---

### 11. Education / Social Impact

**Exemplary sites:**
- **Khan Academy** -- learning-as-interface: the educational content IS the product showcase, skill tree visualizations, progress tracking as motivational design, friendly illustration system that makes complex subjects approachable
- **Duolingo** -- gamified education: character-driven design system, streak/reward visualizations, playful animation that makes repetitive practice feel fresh, the owl mascot as brand personality
- **charity: water** -- impact visualization: every donation mapped to real projects, transparent financial reporting as design content, photography that centers dignity (not poverty), the giving experience designed as beautifully as luxury checkout
- **Wikipedia redesign efforts** -- information architecture at scale: how to make millions of articles navigable, typography-first design for reading-heavy contexts, progressive disclosure of dense information
- **Coursera** -- course-as-product: course cards as browsable products, university logos as trust signals, progress visualizations, credential display as achievement design
- **Patagonia Action Works** -- activism-as-interface: connecting individuals to local environmental actions, map-based discovery, impact metrics visualized, brand activism expressed through functional design

**Visual landscape:** Approachable and inclusive. Bright, warm palettes. Custom illustration systems (not stock). Generous sizing for readability. Gamification elements (progress bars, badges, streaks). Impact metrics visualized prominently. Photography centers the people being helped, not the organization.

**Content patterns:** Mission statements as hero content. Impact metrics with real numbers. Personal stories as social proof (testimonials from students/beneficiaries). Clear calls to action (donate, enroll, volunteer). Educational content as marketing (free value builds trust). Voice is warm, clear, and empowering -- never condescending.

**Differentiation opportunities:**
- Interactive impact calculators that show what a specific donation or enrollment achieves
- Personalized learning/impact paths based on user interests or location
- Community contribution and user-generated content elevated as primary content alongside organizational messaging

---

### 12. Gaming / Entertainment

**Exemplary sites:**
- **Riot Games** -- universe-building: each game has its own visual universe with unique typography, color palettes, and motion language, the website is world-building that extends the game experience, cinematic trailers as hero content
- **Playstation** -- product theatre: console and game pages with cinematic scroll-driven reveals, haptic feedback concepts visualized through animation, dark environments where products glow
- **Epic Games** -- platform ecosystem: game store aesthetic applied to web, dark mode with vibrant game art, tile-based discovery navigation, the web experience mirrors the launcher
- **Supercell** -- playful studio: cartoon illustration system, character-driven navigation, each game gets its own visual treatment, the studio brand unifies diverse game properties
- **A24** -- cinema-as-brand: each film gets a unique web treatment reflecting its visual identity, the studio website is a gallery of tonal range, dark sophistication with dramatic typography
- **Spotify Design** -- audio-visual brand: bold color systems, data-driven design stories, the brand guidelines themselves as design content, motion and music visualization
- **Criterion Channel** -- curated cinema: editorial film programming presented with design care, collection pages as visual essays, the curation IS the product

**Visual landscape:** High-intensity visual environments. Dark backgrounds with vivid accent colors. Full-bleed imagery and video. Custom typography per property/title. Motion is aggressive -- particles, parallax, WebGL effects. Loading experiences are designed (progress bars as brand moments). Sound integration.

**Content patterns:** Trailer/video as hero content. Release dates and events as urgency drivers. Community metrics (player counts, hours streamed). Character/IP as the brand face. Minimal body copy -- visuals and video carry the message. Voice ranges from epic/dramatic (AAA games) to quirky/irreverent (indie).

**Differentiation opportunities:**
- Interactive character/world explorers that let visitors engage with the IP outside the game
- Behind-the-scenes development content (concept art, sound design, level design) as marketing
- Community creation showcases that elevate fan content alongside official material

---

## Layer 3: Integration Context

### Skill Reference Map

This skill references and is referenced by other skills at specific phases. These connections are NOT optional reading -- they contain the templates, formats, and rules that this skill's protocol depends on.

| Skill | When Referenced | What to Read |
|-------|----------------|-------------|
| `design-archetypes` | Phase 4 (archetype shortlisting) | Archetype Selection Guide, constraint system per archetype (locked palette, required fonts, mandatory techniques, forbidden patterns) |
| `cross-pollination` | Phase 2 (research, outside-industry references) and Phase 5 (constraint breaks per direction) | Industry rule catalogs, pairing matrix, constraint-breaking protocol format, boldness calibration table |
| `creative-direction-format` | Phase 5 (direction generation) and Phase 6 (user selection/mixing) | Concept board template (11 sections), ASCII format specification, distinctness validation matrix, free mixing protocol |
| `copy-intelligence` | Phase 7 (brand voice generation) | Brand Voice Document Template, Archetype Voice Profiles table |
| `emotional-arc` | Phase 5 (direction generation) | Beat types (HOOK, BUILD, REVEAL, BREATHE, PEAK, PROOF, CLOSE, etc.), sequence rules, archetype arc templates |
| `creative-tension` | Phase 5 (direction generation) | 5 tension types, archetype frequency table (HIGH/MEDIUM/MODERATE/LOW groups) |
| `micro-copy` | Phase 5 (direction generation) | Beat-specific headline patterns for sample headlines per direction |
| `awwwards-scoring` | Phase 3 (competitive teardown) | Scoring framework for competitive benchmarking -- reference when assessing competitor quality levels |
| `design-dna` | Phase 6 (locking final direction) | DESIGN-DNA.md template structure, 12 color tokens, font format, motion token format |

### BRAINSTORM.md Output Format

The complete artifact saved to `.planning/genorah/BRAINSTORM.md` after the brainstorm session. Every section below is REQUIRED.

```markdown
# Brainstorm: [Project Name]
Generated: [date]

## Research Summary

### Industry: [vertical name]
### References Analyzed: [count]

[Brief summary of research findings -- key patterns observed, convergence points, differentiation opportunities identified. 5-8 bullet points from the Research Synthesis.]

### Competitive Teardown Highlights

[Top 3-5 insights from teardowns that directly influenced direction decisions. Each insight should connect an observation to a direction choice:]
1. [Observation] -- this led to [direction choice]
2. [Observation] -- this led to [direction choice]

## Archetype Shortlist

| Archetype | Role | Rationale |
|-----------|------|-----------|
| [name] | Aligned | [1-sentence reason] |
| [name] | Moderate | [1-sentence reason] |
| [name] | Unexpected | [1-sentence reason] |

## Creative Directions

### Direction A: "[Evocative Name]"
[Full concept board from creative-direction-format template -- all 11 sections]

### Direction B: "[Evocative Name]"
[Full concept board -- all 11 sections]

### Direction C: "[Evocative Name]"
[Full concept board -- all 11 sections]

## Distinctness Validation

[Filled validation matrix from creative-direction-format skill]

| Dimension | Direction A | Direction B | Direction C | All Different? |
|-----------|-------------|-------------|-------------|----------------|
| Archetype | [name] | [name] | [name] | [yes/no] |
| Color Mood | [value] | [value] | [value] | [yes/no] |
| Motion Style | [value] | [value] | [value] | [yes/no] |
| Tension Level | [value] | [value] | [value] | [yes/no] |
| Typography Voice | [value] | [value] | [value] | [yes/no] |
| Layout Philosophy | [value] | [value] | [value] | [yes/no] |

**Result:** [PASS/FAIL] -- [X]/6 dimensions differ

## Competitive Benchmark Comparison

| Dimension | Dir A | Dir B | Dir C | [Competitor 1] | [Competitor 2] |
|-----------|-------|-------|-------|-----------------|-----------------|
| Color approach | | | | | |
| Typography | | | | | |
| Motion intensity | | | | | |
| Layout style | | | | | |
| Content strategy | | | | | |
| Overall personality | | | | | |

## Selection

**Chosen:** [Direction letter or "Mixed"]
**User notes:** [any specific requests, modifications, or rejected elements]

## Mixing Notes (if applicable)

**Base direction:** [letter]
**Cherry-picked elements:**
- From [letter]: [specific element -- e.g., "Color Mood: warm amber palette"]
- From [letter]: [specific element -- e.g., "Motion Identity: cinematic pace"]

**Coherence check:** [passed / resolved]
**Resolution details:** [if conflicts were resolved, document what was adjusted]

## Final Direction Summary

[Synthesized direction -- the actual Design DNA seed. This section is the bridge between BRAINSTORM.md and DESIGN-DNA.md.]

**Archetype:** [name (or "Custom derived from [parent]")]
**Key differentiator:** [1 sentence: what makes this direction stand out from competitors found in research]
**Constraint breaks applied:** [list breaks with rationale]

### DNA Seed Values
- **Color tokens:** [12 hex values with token names]
- **Display font:** [name, weight, character]
- **Body font:** [name, weight, character]
- **Mono font:** [name or "none"]
- **Signature element:** [name: param=value format]
- **Motion personality:** [1-2 sentences]
- **Tension plan:** [type, location, description]

## Brand Voice

Generated: [yes/no]
Document: `.planning/genorah/BRAND-VOICE.md`
```

### Command Integration

This skill is invoked by the `start-project` command during Phase 3 (Creative Direction):

1. `start-project` Phase 1 (Discovery) produces PROJECT.md with user answers
2. `start-project` Phase 2 (Research) spawns researcher agents for trend/reference/component/animation research
3. `start-project` Phase 3 invokes the creative-director agent, which uses THIS SKILL to run the full 7-phase brainstorm protocol
4. Output: BRAINSTORM.md + BRAND-VOICE.md saved to `.planning/genorah/`
5. `start-project` Phase 3.5 uses the Final Direction Summary's DNA Seed Values to generate DESIGN-DNA.md
6. This skill does NOT generate DESIGN-DNA.md directly -- it produces the seed that start-project Phase 3.5 converts into the full DNA document via the `design-dna` skill's template

**Critical flow:** Research (Phase 2 of start-project) feeds DIRECTLY into this skill's Phase 2 (Industry Research). The researcher agents' output is input to the competitive teardown. If research is skipped, this skill lacks the competitive intelligence needed for differentiation.

### DNA Connection

| Concept Board Section | DNA Token(s) It Seeds |
|----------------------|----------------------|
| Color Mood (12 tokens) | All 12 color tokens (bg, surface, text, border, primary, secondary, accent, muted, glow, tension, highlight, signature) |
| Typography Pairing | Display font, body font, mono font, type scale character |
| Motion Identity | Motion personality, signature motion, entrance pattern, transition pace --> motion tokens in :root CSS |
| Tension Plan Preview | Tension type, location, intensity --> creative-tension assignment |
| Emotional Arc Suggestion | Arc template, peak moment --> emotional-arc configuration |
| Constraint Breaks | Rule overrides documented in DNA's tension override section |
| Identity (Archetype) | Archetype name, locked constraints, signature element |

---

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Blank Slate Ideation

**What goes wrong:** Direction generation begins without studying any reference sites. The creative director invents directions from imagination, producing archetypical cliches ("dark mode SaaS site", "minimal portfolio") that match every competitor instead of differentiating from them.

**Instead:** ALWAYS complete Phases 1-3 (Brief Extraction, Industry Research, Competitive Teardown) before Phase 4 (Archetype Shortlisting). Every direction MUST cite at least 2 specific references from the teardown that influenced it. If you cannot point to research that informed a direction choice, the direction is undercooked.

### Anti-Pattern 2: Reference Tourism

**What goes wrong:** Listing 10 reference sites with surface descriptions: "Linear is clean", "Stripe looks professional", "Apple has nice animations." No competitive teardown. No analysis of WHY patterns work. No identification of opportunities.

**Instead:** Every reference gets the full 3-dimension teardown (Visual Patterns + Content Strategy + UX Flow Analysis) with specific "Key Takeaways for Our Project." Each takeaway must be actionable: what to LEARN, what to AVOID, what OPPORTUNITY the reference does not exploit. If a teardown could apply to any project, it is too generic.

### Anti-Pattern 3: Safe Shortlisting

**What goes wrong:** Choosing the 3 most obvious archetypes for the industry (SaaS project = Neo-Corporate + Data-Dense + AI-Native). All three directions feel like variations of the same industry norm. No direction creates genuine differentiation.

**Instead:** At least one shortlisted archetype MUST be an unexpected choice that research revealed could work. Check: did the teardowns reveal a competitor gap that an unusual archetype could exploit? Did the outside-industry references suggest a visual language no one in this space uses? The unexpected archetype is the direction most likely to win awards.

### Anti-Pattern 4: Copy-Paste Archetype

**What goes wrong:** Taking an archetype's locked palette and mandatory techniques verbatim without any project-specific adaptation or cross-pollination. The direction is "Brutalist" rather than "Brutalist applied to THIS project." It could belong to any brutalist website.

**Instead:** Every direction MUST include at least 1 cross-pollination element from the `cross-pollination` skill that makes it unique to THIS project. The archetype provides the constraint system; the research provides the project-specific adaptation; cross-pollination provides the unexpected differentiator. All three layers are required.

### Anti-Pattern 5: Thin Directions

**What goes wrong:** Presenting directions with just a color palette + font name + vague description ("clean and modern" or "bold and dynamic"). This was the v6.1.0 pattern. The user cannot viscerally feel the difference between directions and defaults to the safest choice.

**Instead:** Every direction uses the FULL `creative-direction-format` concept board template with all 11 sections, including ASCII mockups with annotations, motion identity with 7 sub-items, tension plan preview, emotional arc suggestion, and a persuasive "Why This Direction" argument. If the concept board is shorter than the template, sections are missing.

### Anti-Pattern 6: Forgetting Phase 7

**What goes wrong:** Generating great creative directions and selecting one, but skipping brand voice generation. The brainstorm ends with a visual direction but no copy personality. Section builders later default to generic copy because no voice document exists.

**Instead:** Phase 7 (brand voice generation via `copy-intelligence` skill) is MANDATORY. Brainstorm is incomplete until BRAND-VOICE.md exists alongside BRAINSTORM.md in `.planning/genorah/`. The BRAINSTORM.md document itself includes a "Brand Voice: Generated" confirmation. If this field says "no," the brainstorm is not finished.

---

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| brainstorm_phases | 7 | 7 | phases | HARD -- all 7 phases executed sequentially |
| reference_sites_primary | 6 | 8 | sites | HARD -- minimum research coverage |
| reference_sites_outside_industry | 2 | 3 | sites | HARD -- cross-pollination is mandatory |
| teardown_dimensions | 3 | 3 | dimensions | HARD -- visual + content + UX flow |
| archetype_shortlist | 3 | 3 | archetypes | HARD -- aligned + moderate + unexpected |
| directions_generated | 3 | 3 | directions | HARD -- matches creative-direction-format |
| concept_board_sections | 11 | 11 | sections | HARD -- per creative-direction-format |
| distinctness_pass_threshold | 3 | 6 | dimensions | HARD -- minimum 3 of 6 differ |
| brand_voice_generated | 1 | 1 | document | HARD -- BRAND-VOICE.md required |
| research_synthesis_bullets | 5 | 8 | bullets | SOFT -- target range for synthesis |
