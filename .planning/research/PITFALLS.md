# Domain Pitfalls: AI-Powered Premium Frontend Design Plugin

**Domain:** AI design system / Claude Code plugin for premium frontend generation
**Researched:** 2026-02-23
**Confidence:** HIGH (based on direct codebase analysis of Modulo v6.1.0 + domain expertise)
**Source:** Internal codebase analysis, architectural review, failure mode tracing

---

## Critical Pitfalls

Mistakes that cause rewrites, project failures, or fundamental quality collapse.

---

### PITFALL C1: Context Rot — The Forgetting Disease

**What goes wrong:** AI agents progressively lose awareness of design decisions over extended sessions. By wave 3-4, the agent forgets the project's font, accent color, or archetype constraints. Output drifts from distinctive to generic. The first section is award-worthy; the last looks like a template.

**Why it happens:** LLM context windows are finite. As conversation grows, early instructions (Design DNA, archetype constraints, forbidden patterns) get pushed toward the context boundary. The model begins to "approximate" rather than "follow" — substituting trained-in defaults (Inter, blue-500, rounded-lg) for project-specific tokens. This is not a bug in the model; it is a fundamental property of attention-based architectures operating near context limits.

**Root cause chain:**
1. Design DNA defined early in conversation (turn 1-5)
2. Each wave adds 10-30K tokens of code, feedback, and state
3. By turn 20-30, DNA is thousands of tokens back in context
4. Model attention to DNA details degrades proportionally
5. Builder outputs regress toward training distribution (generic patterns)

**Consequences:**
- Sections built in later waves use wrong colors, wrong fonts
- Spacing becomes uniform (`gap-4` everywhere instead of DNA scale)
- Animations default to `fade-in-up` regardless of beat assignment
- Archetype forbidden patterns appear (e.g., gradients in Brutalist, rounded corners > 4px)
- Signature element disappears from later sections
- Quality reviewer catches issues, but fixes consume another wave of context budget

**Warning signs:**
- Canary check failures (design-lead answers 1+ DNA questions wrong from memory)
- Builder outputs that "look fine" individually but don't match earlier sections
- Tailwind defaults appearing in code (`shadow-md`, `rounded-lg`, `text-gray-500`)
- Generic copy creeping in ("Learn More", "Get Started" without archetype tone)
- Animation easing curves reverting to `duration-300` instead of DNA easing

**Prevention (v6.1.0 attempted, rebuild must strengthen):**
1. **Session boundaries every 2 waves** — Hard limit on context accumulation. Modulo v6.1.0 implemented this but made it a soft suggestion. Rebuild should make wave 3 in the same session require explicit override.
2. **CONTEXT.md as single source of truth** — Rewritten after every wave with full DNA identity inline. v6.1.0 implemented this correctly.
3. **Pre-extracted spawn prompts** — Builders receive complete DNA context in their spawn prompt, never reading distant conversation history. v6.1.0 implemented this but the spawn prompt template was not always followed by the orchestrator under pressure.
4. **Canary checks with teeth** — 5-question memory test after each wave. v6.1.0 implemented this but needs stronger consequences: 2+ wrong = mandatory session boundary, not just a warning.
5. **Baked-in rules in agent files** — Anti-slop checks, performance rules, and beat parameters embedded directly in section-builder.md so they're never far from context. v6.1.0 did this well.
6. **Turn-based context zones** — Green (1-20), Yellow (21-30), Red (31+). v6.1.0 implemented mandatory save at 31+ but the yellow zone had insufficient guardrails.

**What the rebuild must add:**
- Structural separation: Each builder is a separate Task invocation with its own context window, receiving only the 1-2KB of DNA it needs. Never share a conversation thread across waves.
- Verification-before-merge: Before a builder's output is accepted, a lightweight DNA compliance grep runs automatically (not just at /verify time).
- Context budget tracking: Explicitly count turns and context tokens, surfacing warnings proactively.

**Severity:** CRITICAL
**Phase mapping:** Must be addressed in foundational architecture (Phase 1). Every subsequent phase inherits this fix or fails.

---

### PITFALL C2: The Generic Output Trap — "Template-Looking" Despite Style Guides

**What goes wrong:** Despite having a comprehensive Design DNA document with unique fonts, colors, spacing, and archetype constraints, the AI produces output that looks like every other AI-generated site. The DNA is technically followed (correct hex codes appear in the code), but the design lacks personality, surprise, and craft.

**Why it happens:** LLMs are trained on millions of examples of "good" web design. Their statistical prior is the average of all those examples — which is, by definition, generic. When given freedom within constraints, they choose the most statistically probable arrangement. This produces layouts that are technically correct but predictable:
- Cards in a 3-column grid with equal spacing
- Centered hero with two buttons
- Symmetric everything
- Same visual density across all sections
- "Safe" animation choices (fade up, scale in)

The DNA constrains tokens (colors, fonts) but doesn't constrain composition. A $90K site and a $5K template can use the same color palette — the difference is in layout courage, spatial rhythm, creative tension, and micro-details.

**Root cause chain:**
1. LLM training data distribution peaks at "safe, clean, symmetric" layouts
2. Without explicit anti-patterns, model defaults to the statistical mode
3. Design DNA constrains palette/type but not compositional decisions
4. No reference quality bar for the model to match against
5. "Write a hero section" has a very narrow range of probable outputs in LLM space

**Consequences:**
- All projects start to look similar regardless of archetype
- Users say "this looks like v0/Lovable/Bolt output" — the exact opposite of the product promise
- Creative tension moments are implemented timidly (small text instead of 20vw headline)
- Wow moments are technically present but underwhelming
- Layout diversity exists on paper but sections "feel" the same

**Warning signs:**
- "Would I screenshot this?" question answered "no" honestly
- Anti-slop gate scores clustering at 25-27 (passing but not SOTD-ready)
- All cards in a section are visually identical
- No element on the page breaks the grid
- Animations are smooth but predictable (everything fades up)

**Prevention:**
1. **Explicit anti-slop gate with teeth** — v6.1.0's 35-point gate is good. Rebuild must make the "Creative Courage" category (5 points) impossible to fake. Require specific evidence: "Which element is the screenshot moment? What makes it impossible-looking?"
2. **Reference-based building** — Every section PLAN.md should reference a specific real-world site/section as its quality bar. The builder builds toward that reference, not toward "a hero section." v6.1.0 added REFERENCES.md but it was optional. Rebuild must make it mandatory.
3. **Layout pattern enforcement via diversity tracker** — v6.1.0 tracks patterns but doesn't enforce minimum variety aggressively enough. Rebuild should require 5+ distinct layout patterns per page with no repeats in adjacent sections.
4. **Boldness amplification** — When a creative tension is assigned, the PLAN.md must include specific TSX code for the tension moment, not a vague description. v6.1.0 evolved toward this (wow-moments skill has full code). Rebuild must make this universal.
5. **Competitive benchmarking during planning** — Before planning sections, analyze 3-5 real award-winning sites in the same category. Extract what makes them distinctive. Plan sections to match or exceed that bar.

**Severity:** CRITICAL
**Phase mapping:** Architecture phase (design-lead spawn prompt design) + Section planning phase (PLAN.md format with reference patterns)

---

### PITFALL C3: Iteration Breaks Adjacent Components

**What goes wrong:** When fixing a gap in section 05, the fix inadvertently breaks section 04 or section 06. Shared CSS variables get changed, z-index conflicts emerge, spacing between sections shifts, or shared components are modified in ways that affect all consumers.

**Why it happens:** Each section builder operates in isolation — it knows about its own section but has limited awareness of how adjacent sections depend on the same shared resources. When a gap-fix modifies a shared utility, color token, or component, all sections consuming that resource are affected. The agent performing the fix doesn't re-verify adjacent sections.

**Root cause chain:**
1. Gap-fix targets a specific section
2. Fix modifies a shared file (globals.css, a shared component, a utility)
3. Other sections consume the same shared file
4. No automated regression check runs after the fix
5. Adjacent sections break silently

**Consequences:**
- Fix-one-break-one cycle that never converges
- Shared component modifications cascade unpredictably
- CSS specificity conflicts when fixes add more specific selectors
- Token modifications (adjusting a color) affect all sections using that token
- Iteration phase takes 2-3x longer than expected

**Warning signs:**
- Gap-fix plans that modify files outside the section's own directory
- Shared component changes without re-verification of all consumers
- CSS variables being redefined in section-scoped styles
- z-index values being added reactively (z-10, z-20, z-50)

**Prevention:**
1. **Immutable shared layer** — Once Wave 0/1 completes, shared components and global tokens are frozen. Any change requires explicit approval and full-page re-verification.
2. **Section isolation** — Each section's styles are scoped. No section can modify global CSS. If a section needs a variant, it creates a local override, not a global change.
3. **Blast radius analysis** — Before executing a gap-fix that touches shared files, grep for all consumers and list them. Present to user before executing.
4. **Adjacent section re-verification** — After any fix, automatically re-check the sections immediately above and below the fixed section for visual continuity.
5. **CSS containment** — Use `contain: layout style paint` on section wrappers to isolate repaints and stacking contexts.

**Severity:** CRITICAL
**Phase mapping:** Architecture phase (section isolation strategy) + Iteration phase (blast radius protocol)

---

### PITFALL C4: Animation Reliability Failures

**What goes wrong:** Animations that look correct in isolation fail when combined: scroll-triggered animations don't fire, GSAP ScrollTrigger conflicts with Framer Motion, Three.js scenes crash on mobile, animations cause layout shift (CLS), or animations work in dev but break in production due to SSR.

**Why it happens:** Frontend animation is the highest-complexity domain in web development. Three separate animation ecosystems (CSS, Framer Motion, GSAP) have different lifecycle models, cleanup requirements, and SSR compatibility. AI-generated animation code frequently has subtle bugs that only manifest under specific conditions.

**Common failure modes:**

| Failure | Root Cause | Frequency |
|---------|-----------|-----------|
| ScrollTrigger doesn't fire | Missing `gsap.registerPlugin(ScrollTrigger)` or wrong `start`/`end` values | Very common |
| Animations replay on route change | Missing `viewport={{ once: true }}` or ScrollTrigger not cleaned up | Common |
| Hydration mismatch | Animation library used in server component (missing `'use client'`) | Very common |
| Layout shift (CLS) | Animating `height`, `width`, `margin` instead of `transform`/`opacity` | Common |
| GSAP + Framer Motion conflict | Both trying to animate the same element | Occasional |
| Mobile jank | Too many `backdrop-blur` elements, too many concurrent animations | Common |
| Three.js crash on mobile | WebGL context limits, shader complexity, memory exhaustion | Common |
| Animation doesn't clean up | Missing `ctx.revert()` in GSAP, missing cleanup in `useEffect` | Very common |
| `useRef` is null | Animation runs before DOM is ready (ref not yet attached) | Common |
| Production build breaks | GSAP imported statically instead of dynamically, tree-shaking removes needed modules | Occasional |

**Consequences:**
- CLS violations fail Core Web Vitals
- Memory leaks from uncleaned animations cause page crashes on longer sessions
- Mobile users get broken/janky experience
- SSR errors in production that weren't visible in dev mode
- Animation conflicts cause visual glitches that are hard to reproduce

**Warning signs:**
- Any animation using `width`, `height`, `top`, `left`, `margin`, `padding`, or `box-shadow` as animated properties
- Missing `'use client'` directive on animation components
- GSAP imported at top level instead of dynamically
- No `return () => ctx.revert()` in GSAP useEffect hooks
- More than 3 `backdrop-blur` elements visible simultaneously
- No `prefers-reduced-motion` handling

**Prevention:**
1. **Embed animation rules directly in builder agent** — v6.1.0 does this well with embedded performance rules. Rebuild must maintain this.
2. **Animation library isolation** — One library per section. Never mix GSAP and Framer Motion in the same component. Choose one per section in the PLAN.md.
3. **Mandatory cleanup patterns** — Every GSAP section uses `gsap.context()` + `ctx.revert()`. Every Framer Motion component uses proper cleanup. These patterns should be in code templates, not just documentation.
4. **Dynamic import enforcement** — GSAP, Three.js, and Lottie must always be dynamically imported. A lint rule or pre-commit hook should catch static imports.
5. **Animation budget per page** — v6.1.0's performance-guardian skill defines max counts (5 GSAP ScrollTrigger, 15 Framer Motion whileInView, 3 backdrop-blur). Rebuild must enforce these at planning time, not just at verification.
6. **Mobile-first animation testing** — Animations must be verified at 375px with CPU throttling. Not just "doesn't break" — must be smooth.

**Severity:** CRITICAL
**Phase mapping:** Architecture phase (animation infrastructure) + Every build phase (enforcement via PLAN.md and builder rules)

---

### PITFALL C5: Agent Coordination Failures — Consistency Collapse

**What goes wrong:** When 4 section-builder agents run in parallel, they make conflicting design decisions. Two sections use the same layout pattern. Adjacent sections have identical backgrounds. One builder interprets "bold typography" differently than another. The page, section by section, is fine — but as a whole, it feels disjointed.

**Why it happens:** Each parallel builder is a separate Task invocation with its own context. They cannot communicate with each other during execution. Any coordination must happen before they start (in the spawn prompt) or after they finish (in verification). If the orchestrator's spawn prompt is incomplete, builders make independent decisions that may conflict.

**Root cause chain:**
1. Design-lead spawns 4 builders simultaneously
2. Each builder reads only its own PLAN.md + spawn prompt context
3. No builder knows what layout pattern another builder chose
4. No builder knows what background color an adjacent section is using
5. Independent decisions converge to either identical (statistical mode) or clashing (random) results

**Consequences:**
- Adjacent sections share the same layout pattern (both use 3-column card grid)
- Adjacent sections share the same background color (no visual progression)
- Typography scale used inconsistently across sections (one builder uses H2 where another uses H3 for similar content)
- Transition techniques between sections don't match (one section fades out, next hard-cuts in)
- Emotional arc feels flat because beat parameters aren't varied enough

**Warning signs:**
- Layout diversity tracker shows repeated patterns in adjacent sections
- Background color progression not documented before wave execution
- Spawn prompts missing "Adjacent Sections" context block
- No explicit "patterns already used" list in spawn prompt
- Builders reporting "no instructions for transition technique"

**Prevention:**
1. **Complete Build Context is non-negotiable** — v6.1.0's spawn prompt template (lines 76-127 of design-lead.md) is comprehensive. Rebuild must make this the only valid invocation pattern. Any builder spawned without Complete Build Context should refuse to proceed.
2. **Pre-planned background progression** — Before spawning Wave 2+, the design-lead must plan and document the full-page background color sequence. No builder chooses its own background independently.
3. **Pre-assigned layout patterns** — The MASTER-PLAN should assign specific layout patterns to each section, not just beat types. Builders implement the assigned pattern, not their choice.
4. **Sequential builder awareness** — For each wave, list which patterns have already been used. The spawn prompt for each builder must include this list and an explicit instruction to choose differently.
5. **Post-wave coherence check** — v6.1.0 has this (design-lead Phase 3). Rebuild must make it blocking: no next wave until coherence is verified.

**Severity:** CRITICAL
**Phase mapping:** Architecture phase (spawn prompt design) + Section planning phase (MASTER-PLAN format) + Execution phase (coherence checkpoints)

---

## Major Pitfalls

Mistakes that cause significant delays, rework, or technical debt.

---

### PITFALL M1: Content Generation Produces Generic Copy

**What goes wrong:** Headlines, button labels, and body copy default to generic marketing-speak. "Unlock Your Potential," "Streamline Your Workflow," "Get Started Today." The copy is grammatically correct but has no brand personality, no specificity, and no emotional resonance.

**Why it happens:** LLMs are trained on enormous amounts of web copy. The most common patterns in that training data are marketing cliches. Without explicit constraints, the model gravitates toward high-frequency phrases. The micro-copy skill in v6.1.0 bans specific words ("Submit," "Learn More") but doesn't provide enough positive guidance for what TO write.

**Root cause chain:**
1. Section builder needs button text or headline
2. No approved copy exists (CONTENT.md not generated or not read)
3. Builder generates statistically probable marketing text
4. Generic phrasing is technically correct and passes basic checks
5. No one catches it until final review (or not at all)

**Consequences:**
- All projects sound the same regardless of brand/archetype
- Copy doesn't match archetype tone (Brutalist section has flowery language)
- Button labels are vague ("Learn More" instead of outcome-driven text)
- Headlines are interchangeable between competitors
- Content review becomes a major iteration phase

**Warning signs:**
- Buttons labeled "Submit," "Learn More," "Click Here," "Get Started" without archetype-specific language
- Headlines that could apply to any product in the category
- Social proof using placeholder names ("John D., CEO")
- Friction reducers missing below primary CTAs
- Body copy that doesn't reference the specific product/service

**Prevention:**
1. **CONTENT.md as mandatory pre-execution artifact** — v6.1.0 added this. Rebuild must make it blocking: no section building without approved copy in CONTENT.md.
2. **Archetype-specific tone guide in DNA** — v6.1.0's micro-copy skill has tone-by-archetype table. Rebuild must embed this in the builder's spawn prompt, not rely on skill file reads.
3. **Copy accuracy verification** — v6.1.0's quality-reviewer checks copy matches CONTENT.md. Rebuild must make this a per-task check, not just final verification.
4. **Specific, verifiable social proof** — Require specific names, titles, companies in testimonials. No "Sarah K." or "Tech Company." If real data isn't available, use obviously-placeholder text that's flagged for replacement.
5. **CTA hierarchy per viewport** — One primary per viewport. Copy must be outcome-driven. Builder self-check #6 covers this, but rebuild should make it a hard gate.

**Severity:** MAJOR
**Phase mapping:** Content planning phase (CONTENT.md generation) + Section building phase (copy accuracy checks)

---

### PITFALL M2: Skill Bloat — Knowledge Base Becomes Noise

**What goes wrong:** With 87 skills, the knowledge base becomes so large that skill references are unreliable. Agents don't know which skill to reference. Multiple skills contain overlapping or contradictory guidance. Important rules are buried in rarely-read skill files.

**Why it happens:** Skills grow organically as new capabilities are added. Each skill is a self-contained document, but the total volume creates problems:
- Agent context budgets can't accommodate all relevant skills
- Overlapping skills (anti-slop-design vs quality-standards vs awwwards-scoring) create confusion about which is authoritative
- Skill discovery depends on agent knowledge of skill names
- Deep skills (800+ lines) are only partially read, missing critical details

**Root cause chain:**
1. New skill added for each capability area
2. No deduplication or hierarchy review
3. Total skill volume exceeds practical read budget
4. Agents can't read all relevant skills per task
5. Critical rules in unread skills are not followed

**Consequences:**
- Contradictory guidance between overlapping skills
- Critical rules not followed because they're in the "wrong" skill
- Agent reads wrong skill or partial skill, gets incomplete guidance
- Maintaining 87 skill files becomes a versioning nightmare
- New team members can't understand the full system

**Warning signs:**
- Multiple skills covering the same topic with different advice
- Agents asked to "reference X skill" but reading the wrong one
- Critical rules duplicated across 3+ skills with slight variations
- Skills longer than 200 lines (likely trying to cover too much)
- No clear hierarchy of which skill overrides another

**Prevention:**
1. **Embed critical rules directly in agent files** — v6.1.0 already does this for section-builder.md (performance rules, anti-slop checks, beat parameters embedded directly). Rebuild must extend this to eliminate the need for builders to read any skill files during execution.
2. **Skill hierarchy** — Define a clear precedence: agent-embedded rules > Design DNA > archetype > general skill. If rules conflict, higher-precedence source wins.
3. **Skill consolidation** — Merge overlapping skills. anti-slop-design, quality-standards, and awwwards-scoring have significant overlap. Create one authoritative quality skill, or ensure each has a distinct scope.
4. **Size limits** — No skill file over 300 lines. If it's longer, split into focused sub-skills.
5. **Index file** — Maintain a SKILL-INDEX.md that maps trigger patterns to specific skills, so agents don't guess.

**Severity:** MAJOR
**Phase mapping:** Architecture phase (skill consolidation) + All phases (skill maintenance discipline)

---

### PITFALL M3: Framework Compatibility — Multi-Target Generation Failures

**What goes wrong:** Code generated for Next.js doesn't work in Astro. Components using React hooks are placed in non-client contexts. Server components use browser APIs. The system promises multi-framework support but the generated code is framework-specific in subtle ways that break portability.

**Why it happens:** Next.js App Router, Astro, and other frameworks have fundamentally different rendering models:
- Next.js App Router defaults to server components; client interactivity requires `'use client'`
- Astro defaults to zero-JS; interactivity requires explicit `client:` directives
- Vite/Tauri/Electron have no server component concept at all
- Each framework has different image optimization, font loading, and routing patterns

**Common failure modes:**

| Framework | Common Break | Root Cause |
|-----------|-------------|-----------|
| Next.js App Router | Missing `'use client'` on interactive components | Builder forgets directive |
| Next.js App Router | Using `window`/`document` in server component | No SSR guard |
| Astro | React component not hydrated | Missing `client:visible` directive |
| Astro | Using Next.js-specific APIs (`next/image`, `next/font`) | Framework-specific code leakage |
| Vite | Server-side API routes not available | No API layer in pure SPA |
| All | Dynamic imports with wrong syntax | ESM vs CJS confusion |

**Consequences:**
- Build failures after code is generated
- Hydration mismatches in production
- Components render on server but not interactive on client
- Image optimization not working (falls back to unoptimized)
- Font loading fails (no Next.js font optimization in Astro)

**Warning signs:**
- Components using `useState`, `useEffect`, `useRef` without `'use client'`
- `import Image from 'next/image'` in Astro project
- `window.` or `document.` access without `typeof window !== 'undefined'` guard
- Missing `client:visible` or `client:load` on Astro interactive components
- Framework-specific import paths hardcoded

**Prevention:**
1. **Framework detection at project start** — Detect framework from `package.json` or config files. Lock framework context into DNA and all spawn prompts.
2. **Framework-specific code templates** — Different code patterns for Next.js vs Astro vs Vite. Skill files should provide patterns for each target framework.
3. **Client boundary enforcement** — In Next.js App Router, any component using hooks must have `'use client'`. This should be checked automatically after each builder task.
4. **SSR safety wrapper** — Provide a standard `useSSRSafe` hook or `isBrowser` guard in the shared scaffold. All browser API access goes through this.
5. **Framework-specific skill sections** — v6.1.0 has separate `nextjs-app-router` and `astro-patterns` skills. Rebuild should ensure builder spawn prompts include the correct framework-specific rules.

**Severity:** MAJOR
**Phase mapping:** Architecture phase (framework detection + scaffold) + Every build phase (framework-specific code templates)

---

### PITFALL M4: Performance vs. Aesthetics — Core Web Vitals Failure

**What goes wrong:** A beautifully animated site scores 40 on Lighthouse Performance. LCP is 5 seconds because the hero has 6 gradient orbs with backdrop-blur. CLS is 0.3 because animations shift layout. The site wins no awards because it's too slow to even load for the judges.

**Why it happens:** Premium design techniques (glass morphism, particle systems, complex scroll animations, 3D elements) are inherently expensive. Without performance budgets enforced at planning time, builders stack expensive techniques without considering cumulative cost.

**Common performance killers:**

| Technique | Performance Cost | Mitigation |
|-----------|-----------------|------------|
| `backdrop-blur` (3+ concurrent) | High GPU cost, mobile jank | Max 3 visible simultaneously |
| Gradient mesh with many orbs | High paint cost | CSS only, limit to 3 orbs |
| GSAP ScrollTrigger (10+ instances) | JS execution, scroll jank | Max 5 instances per page |
| Three.js scenes | 500KB+ JS, WebGL memory | Dynamic import, ssr: false, fallback image |
| Large font files | Render blocking, LCP delay | Preload, subset, font-display: swap |
| Unoptimized images | LCP, bandwidth | next/image with sizes prop, AVIF/WebP |
| CSS `will-change` everywhere | GPU memory exhaustion | Max 5 elements, remove after animation |
| Continuous CSS animations | Battery drain, mobile heat | Pause when not in viewport |

**Consequences:**
- Lighthouse Performance < 80 (immediate fail for any premium project)
- Mobile users experience lag, jank, or crashes
- Google penalizes slow sites in search rankings
- Award sites (Awwwards, CSS Design Awards) test performance as part of judging
- Users abandon slow sites before seeing the design

**Warning signs:**
- More than 3 `backdrop-blur` elements on a page
- GSAP or Three.js imported at top level (not dynamically)
- No `sizes` prop on `next/image` components
- Missing `prefers-reduced-motion` handling
- Build output showing JS chunks > 200KB
- No font preloading strategy

**Prevention:**
1. **Performance budgets in PLAN.md** — Each section's plan must declare its expected performance cost (low/medium/high). High-cost sections are limited to 2 per page.
2. **Animation budget enforcement at planning** — v6.1.0's performance-guardian defines maximums. Rebuild must check these during section planning, not just during verification.
3. **Dynamic import as default** — Code templates should use dynamic imports by default for heavy libraries. Static imports should require justification.
4. **Mobile-first performance testing** — Include a performance checkpoint after Wave 2 that tests at 375px with CPU throttling.
5. **Graduated enhancement** — Start with CSS-only animations. Add Framer Motion for scroll-triggered reveals. Use GSAP only for complex choreography. Use Three.js only for the single PEAK section.

**Severity:** MAJOR
**Phase mapping:** Architecture phase (performance budget system) + Section planning (cost declaration) + Verification phase (Lighthouse audit)

---

### PITFALL M5: User Expectation Mismatch — "This Isn't What I Had in Mind"

**What goes wrong:** The user describes wanting "a modern, clean landing page" and receives output that doesn't match their mental image. The design is technically good but stylistically wrong. The user wanted "clean" like Linear.app but got "clean" like a medical website.

**Why it happens:** Design vocabulary is ambiguous. "Modern," "clean," "bold," "professional," and "minimal" mean different things to different people. Without concrete visual references, the AI and the user are operating with different internal models of what the adjectives mean.

**Root cause chain:**
1. User provides verbal description ("I want something bold and modern")
2. AI maps these words to its training distribution
3. User has a specific reference in mind but doesn't share it
4. AI generates toward statistical average of "bold and modern"
5. Gap between user's mental model and AI output causes frustration

**Consequences:**
- Complete direction changes after first build (expensive)
- Multiple iteration cycles spent aligning on taste, not improving execution
- User loses confidence in the tool's ability to understand them
- Good technical work is discarded because it's stylistically wrong
- Project timeline doubles

**Warning signs:**
- User description uses only adjectives, no concrete references
- No competitive benchmarking or reference analysis
- Brainstorm phase produces archetype selection without user seeing examples
- User feedback is "it doesn't feel right" without specific critique
- Multiple direction changes in the first 3 sessions

**Prevention:**
1. **Reference-first discovery** — v6.1.0's REFERENCES.md is a start. Rebuild must make reference collection mandatory during start-design: "Show me 3 sites you like and 3 you don't like."
2. **Visual archetype preview** — When presenting archetypes, show real examples of each style. Don't just describe "Brutalist" — show 3 Brutalist sites.
3. **Mood board generation** — Before committing to DNA, generate a visual mood board (color swatches, font samples, layout thumbnets) for user approval.
4. **Incremental commitment** — Don't generate full DNA upfront. Start with color palette + typography preview. Get approval. Then layout patterns. Get approval. Then full DNA.
5. **Taste calibration questions** — "Do you prefer the density of Linear.app or the spaciousness of Apple.com?" "Do you prefer the motion of Stripe or the stillness of Notion?" Map answers to archetype parameters.

**Severity:** MAJOR
**Phase mapping:** Discovery/brainstorm phase (reference-first workflow) + DNA generation phase (incremental approval)

---

## Moderate Pitfalls

Mistakes that cause delays or degrade quality without causing rewrites.

---

### PITFALL D1: Emotional Arc Goes Flat

**What goes wrong:** Despite having beat assignments (HOOK, BUILD, BREATHE, CLOSE), all sections feel the same intensity. The BREATHE section has too much content. The HOOK section is too calm. The arc exists on paper but not in the output.

**Prevention:**
- Beat parameters must be HARD CONSTRAINTS in PLAN.md (v6.1.0's approach is correct)
- Whitespace ratio is the most commonly violated parameter: BREATHE must be 70-80%, not 45%
- Builder self-check question #1 ("Does this match its assigned beat parameters?") must include specific measurements, not just vibes
- Quality reviewer must compare actual section height, element count, and whitespace ratio against beat specifications

**Warning signs:** All sections approximately the same height. BREATHE sections with 6+ elements. HOOK sections without dramatic entrance animation.

**Severity:** MODERATE
**Phase mapping:** Section planning (beat parameter specification) + Execution (builder self-check enforcement)

---

### PITFALL D2: "Fade-In-Up" Monoculture

**What goes wrong:** Every element on every section animates with the same pattern: fade in from below. The 10-direction motion vocabulary (RISE, DROP, EXPAND, CASCADE, UNFOLD, etc.) exists in the skill file but builders default to `y: 20, opacity: 0` for everything.

**Prevention:**
- Choreography defaults per beat type are already in DESIGN-DNA.md format (v6.1.0). Rebuild must include specific animation direction assignments in each section's PLAN.md.
- PLAN.md must specify: "Headline: RISE. Cards: CASCADE with 60ms stagger. Image: ENTER-STAGE from right."
- Anti-slop gate criterion "Directional motion story" must require 3+ distinct animation directions per page.

**Warning signs:** Grep for `y: 20` or `y: 30` or `y: 40` — if this appears in more than 50% of animations, motion vocabulary is not being used.

**Severity:** MODERATE
**Phase mapping:** Section planning (animation direction in PLAN.md) + Verification (motion diversity check)

---

### PITFALL D3: Responsive as Afterthought

**What goes wrong:** Desktop looks premium, mobile looks like stacked desktop components with too-small text. Tablet is ignored entirely. Touch targets are too small. Horizontal overflow at certain viewport widths.

**Prevention:**
- PLAN.md visual specifications must include responsive adaptations at 3 breakpoints (375px, 768px, 1440px)
- Builder embedded rules require responsive classes on all components
- Quality reviewer checks at multiple viewports (v6.1.0 does this at 1440px, 768px, 375px)
- Touch target minimum 44x44px must be enforced programmatically, not just documented

**Warning signs:** No `md:` or `lg:` classes in component code. Text smaller than 14px on mobile. Buttons narrower than 44px.

**Severity:** MODERATE
**Phase mapping:** Section planning (responsive specifications in PLAN.md) + Verification (multi-viewport check)

---

### PITFALL D4: z-index Chaos

**What goes wrong:** After 8 sections are built by different builders, z-index values are scattered: 10, 20, 50, 100, 9999. Fixed navigation conflicts with modal overlays. Sticky elements overlap each other. Scroll-triggered elements appear behind earlier sections.

**Prevention:**
- Define a z-index scale in Design DNA (v6.1.0 doesn't do this explicitly)
- Recommended scale: `base: 0, raised: 10, sticky: 20, nav: 30, overlay: 40, modal: 50, toast: 60`
- Use CSS `isolation: isolate` on section wrappers to create stacking contexts
- Builders should never use arbitrary z-index values; only DNA-defined levels

**Warning signs:** Any z-index value above 50 in section code. Multiple sections using different z-index values for similar purposes.

**Severity:** MODERATE
**Phase mapping:** Architecture phase (z-index scale in DNA) + Execution (enforcement via embedded rules)

---

### PITFALL D5: Dead Code Accumulation

**What goes wrong:** Over multiple iterations, unused imports, unused components, and orphaned utility functions accumulate. Bundle size grows. Components are created that duplicate existing shared components from Wave 0/1.

**Prevention:**
- v6.1.0's builder Step 5.6 (Dead Code Prevention) is good. Rebuild must make this enforceable with automated checks.
- Pre-commit hook that checks for unused imports
- Builder must check shared component inventory before creating new utilities
- Gap-fixes must not leave dead code from the previous implementation

**Warning signs:** Multiple `import` statements that aren't used. Functions defined but never called. Components in the project that aren't rendered anywhere.

**Severity:** MODERATE
**Phase mapping:** Execution phase (builder self-check) + Verification phase (dead code scan)

---

## Minor Pitfalls

Mistakes that cause annoyance but are quickly fixable.

---

### PITFALL N1: Inconsistent Import Paths

**What goes wrong:** Some sections import shared components with relative paths (`../../components/ui/button`), others use alias paths (`@/components/ui/button`). Both work in dev but alias paths may break in certain build configs.

**Prevention:** Standardize on alias paths (`@/`) in scaffold. Document in Wave 0 output.

**Severity:** MINOR

---

### PITFALL N2: Missing Accessibility Labels

**What goes wrong:** Icon-only buttons, decorative images, and interactive elements lack proper ARIA labels. Screen readers can't navigate the page meaningfully.

**Prevention:** Builder embedded rules include accessibility requirements. Quality reviewer checks ARIA labels. Rebuild should make this a per-task check, not just final verification.

**Severity:** MINOR (fixable but important for compliance)

---

### PITFALL N3: Font Loading Flash (FOUT/FOIT)

**What goes wrong:** Custom display fonts load visibly late, causing a flash of unstyled text (FOUT) or invisible text (FOIT). The hero headline blinks from system font to display font 1-2 seconds after page load.

**Prevention:** `font-display: swap` is mandatory. Display fonts must be preloaded. Next.js `next/font` handles this well. Astro needs manual `<link rel="preload">`.

**Severity:** MINOR

---

### PITFALL N4: Color Contrast Failures

**What goes wrong:** Accent colors on dark backgrounds fail WCAG AA contrast ratio (4.5:1 for body text, 3:1 for large text). Especially common with low-opacity text treatments (`text-[var(--color-text-tertiary)]` on dark backgrounds).

**Prevention:** DNA generation must verify all text/background combinations meet WCAG AA. Quality reviewer includes contrast checking.

**Severity:** MINOR (but accessibility compliance is legally required in many jurisdictions)

---

### PITFALL N5: Hardcoded Strings Instead of Content Tokens

**What goes wrong:** Builder generates the section with inline strings ("Welcome to the future of design") instead of referencing CONTENT.md. When copy changes, developers must find and replace strings across component files instead of updating a single content source.

**Prevention:** PLAN.md must specify exact copy from CONTENT.md. Builder self-check verifies copy accuracy. Content should be in a structured format that components reference, not inline strings.

**Severity:** MINOR

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Discovery / Brainstorm | M5: User expectation mismatch | Reference-first discovery, visual archetype preview |
| DNA Generation | C2: Generic output trap | Archetype constraints with explicit forbidden patterns |
| Content Planning | M1: Generic copy | CONTENT.md mandatory before execution, archetype tone guide |
| Scaffold (Wave 0) | D4: z-index chaos, N1: Import paths | Define scales and conventions in scaffold |
| Shared Components (Wave 1) | C3: Iteration breaks adjacent | Immutable shared layer after Wave 1 |
| Parallel Section Building (Wave 2+) | C1: Context rot, C5: Coordination failures | Session boundaries, Complete Build Context |
| Animation Implementation | C4: Animation reliability, D2: Fade-in-up monoculture | Library isolation, choreography in PLAN.md |
| Verification | M4: Performance vs aesthetics | Performance budget checking before build, not just after |
| Iteration / Gap Fixes | C3: Iteration breaks adjacent | Blast radius analysis, adjacent section re-verification |
| Multi-page Projects | C5: Cross-page consistency | PAGE-CONSISTENCY.md, shared component freeze |

---

## V6.1.0 Lessons Learned (What Worked, What Didn't)

### What Worked

| Mechanism | Status | Assessment |
|-----------|--------|------------|
| Pre-extracted spawn prompts | Implemented | GOOD — reduces builder context needs dramatically |
| Embedded rules in builder agent | Implemented | GOOD — critical rules are never far from context |
| Canary checks | Implemented | PARTIAL — detection works, consequences too soft |
| CONTEXT.md single source of truth | Implemented | GOOD — session recovery works when written correctly |
| 35-point anti-slop gate | Implemented | PARTIAL — catches obvious slop, misses compositional blandness |
| Beat parameter constraints | Implemented | PARTIAL — defined but not always enforced by builders |
| Layout diversity tracker | Implemented | PARTIAL — tracked but not blocked on violations |

### What Didn't Work

| Mechanism | Problem | Rebuild Fix |
|-----------|---------|-------------|
| Skill file references during build | Builders can't/don't read all relevant skills | Embed everything needed in spawn prompt |
| Soft session boundaries | Users override 2-wave suggestion, quality degrades | Make wave 3 in same session require explicit justification |
| Creative tension as description | "Add a creative tension moment" without code | Provide exact TSX in PLAN.md |
| Copy generation on the fly | Builders make up copy instead of using CONTENT.md | CONTENT.md mandatory + per-task copy verification |
| Post-hoc performance checking | Expensive techniques stacked, caught only at verify | Performance budget at planning time |
| Shared component modifications during iteration | Cascade failures | Freeze shared layer after Wave 1 |

---

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| Context rot mechanisms | HIGH | Direct analysis of v6.1.0 architecture and LLM behavior patterns |
| Animation failure modes | HIGH | Based on documented GSAP/Framer Motion patterns in codebase + known React lifecycle issues |
| Generic output causes | HIGH | Well-understood LLM statistical behavior + v6.1.0 anti-slop evidence |
| Agent coordination | HIGH | Direct analysis of design-lead.md spawn patterns |
| Content generation | HIGH | micro-copy skill + known LLM copy tendencies |
| Framework compatibility | MEDIUM | Next.js patterns well-documented in codebase; Astro coverage is thinner |
| Performance budgets | HIGH | performance-guardian skill provides specific budgets |
| User expectation mismatch | MEDIUM | Based on product design principles; no direct user feedback data available |

---

## Sources

All findings based on direct analysis of:

- `agents/design-lead.md` — Orchestrator architecture, spawn prompt design, canary checks, session management
- `agents/section-builder.md` — Builder protocol, embedded rules, self-check system
- `agents/quality-reviewer.md` — Verification protocol, anti-slop gate, quality standards
- `skills/anti-slop-design/SKILL.md` — 35-point quality gate, slop patterns
- `skills/cinematic-motion/SKILL.md` — 10-direction motion vocabulary, choreography sequences
- `skills/gsap-animations/SKILL.md` — GSAP patterns, cleanup requirements
- `skills/framer-motion/SKILL.md` — Framer Motion patterns, SSR considerations
- `skills/creative-tension/SKILL.md` — Tension levels, per-archetype techniques
- `skills/emotional-arc/SKILL.md` — Beat types, sequence rules, transition techniques
- `skills/micro-copy/SKILL.md` — Copy rules, banned text, archetype tone
- `skills/performance-guardian/SKILL.md` — Performance budgets, animation budgets
- `skills/design-dna/SKILL.md` — DNA format, validation rules
- `skills/quality-standards/SKILL.md` — Quality tiers, verification protocol
- `skills/wow-moments/SKILL.md` — Interaction patterns, performance impact
- `skills/design-archetypes/SKILL.md` — Archetype constraints and forbidden patterns
- `CLAUDE.md` — System overview, context rot prevention architecture
