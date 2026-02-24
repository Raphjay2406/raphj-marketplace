# Architecture Patterns: SEO/GEO, Sitemap, IndexNow, and API Integration for Modulo 2.0

**Domain:** Plugin architecture extension -- integrating search visibility, AI search optimization, and API-backed research into the Modulo pipeline
**Researched:** 2026-02-25
**Confidence:** HIGH for skill architecture and pipeline integration (based on deep analysis of 45 existing skills, 14 agents, 8 commands). MEDIUM for GEO-specific patterns (rapidly evolving field, 2025-2026 best practices still solidifying).

---

## Executive Summary

The existing `seo-meta` skill (398 lines, Utility tier) already covers the core SEO code patterns: Next.js `generateMetadata`, Astro head management, JSON-LD structured data, Open Graph, sitemaps, and robots.txt. However, it is a single utility skill treating SEO as an afterthought -- "load on demand when a specific need arises." For Modulo 2.0 v1.5, the architecture needs to change: SEO/GEO should be **woven into the pipeline** rather than bolted on at the end.

This document answers six architectural questions and provides a concrete integration plan.

---

## Question 1: Skill Architecture -- One Large Skill or Multiple Focused Skills?

### Recommendation: Split into 3 Focused Skills

The current `seo-meta` skill conflates four distinct concerns: metadata generation, structured data authoring, sitemap/robots.txt configuration, and GEO optimization. These have different trigger points in the pipeline, different framework dependencies, and different evolution rates. Split them.

**Proposed skill decomposition:**

| New Skill | Tier | Lines (est.) | Scope | Pipeline Touch Points |
|-----------|------|-------------|-------|----------------------|
| `seo-meta` (rewrite) | **Core** | 400-500 | Page metadata, Open Graph, Twitter cards, canonical URLs, robots directives, meta description voice matching | Wave 0 (layout metadata), Wave 2+ (per-page metadata), quality review |
| `structured-data` | **Domain** | 350-450 | JSON-LD schemas (Article, FAQ, Product, BreadcrumbList, Organization, WebSite, HowTo), schema selection per page type, GEO-optimized schemas | Section planning (schema assignment), section build (schema output), quality review (schema validation) |
| `search-visibility` | **Domain** | 400-500 | Sitemap generation, IndexNow integration, robots.txt, GEO content patterns, AI search optimization, quotable snippet formatting | Wave 0 (sitemap/robots scaffold), post-build (IndexNow), content planning (GEO formatting) |

### Tier Justification

**`seo-meta` promoted to Core:** Every public-facing Modulo project needs metadata. Currently Utility tier ("loaded on-demand"), but metadata generation should happen automatically for every page the section-planner creates. The `multi-page-architecture` skill (Core tier) already references page registries with URL patterns -- metadata is the technical counterpart. Promotion to Core means the section-planner and quality-reviewer always have metadata awareness.

**`structured-data` as Domain:** Not every project needs JSON-LD. Dashboard projects, internal tools, and desktop apps (Tauri/Electron) have no search engine concern. Domain tier means it loads when the project type indicates public-facing web content -- the same trigger logic that activates `blog-patterns`, `ecommerce-ui`, or `portfolio-patterns`.

**`search-visibility` as Domain:** Same reasoning. Sitemap generation, IndexNow, and GEO optimization are relevant only for public web projects. Additionally, the GEO content formatting patterns directly affect how the `content-specialist` and `copy-intelligence` skill produce copy, so this skill needs to be available during content planning for relevant projects.

### Why Not One Large Skill?

A merged 1200+ line skill would exceed the 300-600 line target. More critically, the concerns have different pipeline integration points:

- Metadata is per-page, generated during section builds (Wave 2+)
- Structured data is per-page-type, assigned during section planning
- Sitemap is site-wide, generated as a build artifact in Wave 0 and finalized post-build
- GEO patterns affect content creation, which happens during `/modulo:start-project`
- IndexNow fires post-deploy, outside the build pipeline entirely

Combining them forces agents to load GEO content guidelines when they only need sitemap patterns, or load IndexNow integration code when they only need metadata templates.

### Why Not Keep It as One Utility Skill?

The current Utility tier placement means SEO is treated as optional. But metadata is not optional for any public website -- missing og:image alone causes measurable social sharing degradation. Keeping it Utility means the section-planner never considers SEO during planning, the quality-reviewer never checks metadata, and the content-specialist never formats copy for AI search engines. SEO becomes something you remember to add at the end, which is exactly the anti-pattern the Modulo pipeline was designed to prevent.

---

## Question 2: Pipeline Integration -- When Should SEO Be Generated?

### Recommendation: Three Pipeline Touch Points

SEO is not a single phase -- it has distinct activities at three pipeline stages.

```
/modulo:start-project                    /modulo:plan-dev              /modulo:execute
         |                                      |                            |
   Phase 4: Content Planning              Section Planning            Wave 0 -> Wave N -> Post-Build
         |                                      |                            |
   GEO content formatting              Schema assignments            Metadata generation
   AI-quotable snippets                 Page-type metadata             Sitemap scaffold
   Brand voice + SEO voice              Sitemap URL registry           robots.txt
   merge guidance                       SEO audit criteria             IndexNow endpoint
                                                                       Per-page structured data
                                                                       Quality review: SEO gate
```

### Touch Point 1: Content Planning (start-project Phase 4)

**What happens:** The `content-specialist` agent generates CONTENT.md. GEO optimization requires content to be formatted for AI extraction -- short quotable paragraphs, FAQ structures, statistics density, clear section headings. This cannot be retrofitted; it must be planned from the start.

**Integration mechanism:** The `search-visibility` skill provides GEO content formatting guidelines that the `content-specialist` references during copy generation. This parallels how `copy-intelligence` already provides brand voice guidelines.

**Concrete change:** Add to content-specialist's skill reference list:
```markdown
**Skill reference:** Load `skills/search-visibility/SKILL.md` for GEO content formatting
when the project is public-facing web.
```

**New section in CONTENT.md:**
```markdown
## SEO/GEO Metadata

### Site-Level
- Site title template: "[Page] | [Brand Name]"
- Default meta description: "[brand elevator pitch, 150-160 chars]"
- Brand schema: Organization with name, url, logo, sameAs

### Per-Page
| Page | Title | Meta Description | Primary Schema | FAQ Eligible |
|------|-------|------------------|----------------|-------------|
| Landing | [title] | [description] | WebSite + Organization | Yes |
| About | [title] | [description] | AboutPage | No |
| Pricing | [title] | [description] | Product (per tier) | Yes |
| Blog Index | [title] | [description] | Blog | No |
| Article | [post.title] | [post.excerpt] | Article | Per post |
```

### Touch Point 2: Section Planning (plan-dev)

**What happens:** The `section-planner` creates MASTER-PLAN.md and per-section PLAN.md files. At this stage, structured data schemas should be assigned per page type, and the sitemap URL registry should be established.

**Integration mechanism:** The `structured-data` skill provides a schema assignment matrix that maps page types (from `multi-page-architecture`) to JSON-LD schemas. The section-planner includes schema requirements in each PLAN.md's `must_haves.truths` section.

**Concrete PLAN.md addition:**
```yaml
must_haves:
  truths:
    - "Page exports JSON-LD with @type Article including headline, datePublished, author"
    - "generateMetadata returns title, description, openGraph with image"
    - "Canonical URL uses dynamic route, not hardcoded string"
  artifacts:
    - path: "src/app/blog/[slug]/page.tsx"
      provides: "Blog post page with generateMetadata and Article JSON-LD"
```

**Concrete MASTER-PLAN.md addition:**
```markdown
## SEO Registry

| Page | URL Pattern | Sitemap Priority | Schema Types | IndexNow |
|------|-------------|-----------------|--------------|----------|
| Landing | / | 1.0 | WebSite, Organization | on-deploy |
| About | /about | 0.8 | AboutPage | on-deploy |
| Blog | /blog | 0.9 | Blog | on-deploy |
| Article | /blog/[slug] | 0.7 | Article | on-publish |
| Pricing | /pricing | 0.9 | Product[] | on-deploy |
```

### Touch Point 3: Build Execution (execute)

**What happens:** Metadata, sitemaps, robots.txt, and structured data are generated as code artifacts during wave-based building.

**Wave 0 (scaffold):** Generate site-level SEO infrastructure:
- `app/sitemap.ts` (or `src/pages/sitemap.xml.ts` for Astro)
- `app/robots.ts` (or `public/robots.txt` for Astro)
- IndexNow API route (`app/api/indexnow/route.ts`)
- IndexNow verification key file (`public/{key}.txt`)
- JSON-LD utility component (`src/components/shared/JsonLd.tsx`)
- SEO head component (Astro only: `src/components/SEOHead.astro`)

**Wave 1 (shared UI):** Generate layout-level metadata:
- Root layout `metadata` export with site-wide defaults
- `metadataBase` configuration
- Default og:image
- Site-level JSON-LD (Organization, WebSite)

**Wave 2+ (per-page):** Each page builder generates:
- Page-specific `generateMetadata` or `metadata` export
- Page-specific JSON-LD based on schema assignment from PLAN.md
- Canonical URL using dynamic route

**Post-build:** After all waves complete and before Layer 3 live testing:
- Verify sitemap generates correct XML
- Verify robots.txt disallows correct paths
- Verify all pages have metadata (no missing og:image, no missing description)
- Validate JSON-LD against schema.org (structural check, not API call)

### Why Not Post-Build Only?

Retrofitting SEO after all sections are built means:
1. Content was not written with GEO in mind (quotable snippets, FAQ structure)
2. No `must_haves.truths` assertions for metadata, so builders skip it
3. Quality reviewer has no criteria to check against
4. Sitemap URL patterns may not match actual routes

By integrating at three touch points, SEO is planned, built, and verified -- the same progressive enforcement model that makes the anti-slop gate effective.

---

## Question 3: Sitemap Generation -- Build-Time Step, Skill Pattern, or Agent Protocol?

### Recommendation: Skill Pattern with Build-Time Code Generation

Sitemaps should be a **skill pattern** (code templates in the `search-visibility` skill) that gets **generated as code** during Wave 0, not a separate agent protocol or external build step.

### Rationale

**Why not an agent protocol:** Sitemap generation is deterministic. Given a list of pages and their URL patterns (from MASTER-PLAN.md's SEO Registry), the sitemap code writes itself. No creative judgment is needed. Agent protocols are for decisions that require context -- sitemap generation is mechanical.

**Why not a build-time step (external):** Modulo already generates everything as source code via section-builders. Adding an external build step (e.g., a shell script that generates sitemap.xml) breaks the pattern. The sitemap should be framework-native code that runs at request time (Next.js `app/sitemap.ts`) or build time (Astro `src/pages/sitemap.xml.ts`), generated by the Wave 0 scaffold builder.

**Why a skill pattern:** The `search-visibility` skill provides framework-specific sitemap templates. The section-builder for Wave 0 (scaffold) reads the SEO Registry from MASTER-PLAN.md and generates the appropriate sitemap code using the skill's patterns. This matches how `design-system-scaffold` provides Tailwind theme templates that the Wave 0 builder generates.

### Framework-Specific Patterns

**Next.js (App Router):**
```
app/sitemap.ts          -- MetadataRoute.Sitemap function
app/robots.ts           -- MetadataRoute.Robots function
```
Generated from SEO Registry. Static pages are listed directly; dynamic routes (blog posts) use data fetching.

**Astro:**
```
src/pages/sitemap.xml.ts -- XML sitemap endpoint
public/robots.txt        -- Static robots.txt (or src/pages/robots.txt.ts for dynamic)
```
Alternatively, Astro's `@astrojs/sitemap` integration can auto-generate from routes.

**React/Vite (SPA):**
```
public/sitemap.xml       -- Static XML file (generated at build time via script)
public/robots.txt        -- Static file
```
SPAs have limited sitemap needs (typically few routes). A static file in `public/` is sufficient.

### Large Site Handling

For sites with 50k+ URLs (unlikely for Modulo-generated sites, but possible for blog-heavy projects):
- Next.js: Use `generateSitemaps()` to split into multiple sitemaps with a sitemap index
- Astro: Use `@astrojs/sitemap` with `customPages` option
- The `search-visibility` skill should document the 50,000 URL threshold and provide the multi-sitemap pattern

---

## Question 4: IndexNow -- Deploy Workflow Integration

### Recommendation: Framework-Specific API Endpoint + Post-Deploy Hook Guidance

IndexNow is a protocol for notifying search engines (Bing, Yandex, Naver, Seznam, Yep) about content changes instantly, rather than waiting for crawlers. Google does NOT support IndexNow (it uses its own URL Inspection API and sitemaps). IndexNow is valuable because it reduces indexing latency from days to hours for supporting engines.

### Architecture

IndexNow integration has two parts:
1. **Verification file** -- A static text file at `public/{apikey}.txt` proving site ownership
2. **Notification mechanism** -- An API call to `https://api.indexnow.org/IndexNow` with changed URLs

### Framework-Specific Implementation

**Next.js:**
```
public/{indexnow-key}.txt    -- Verification file (static)
app/api/indexnow/route.ts    -- API route that submits URLs to IndexNow
```
The API route is called post-deploy (via CI/CD webhook, Vercel deploy hook, or manual trigger). It reads the sitemap and submits all URLs, or accepts a specific URL list for content updates.

**Astro:**
```
public/{indexnow-key}.txt    -- Verification file (static)
```
Use the `astro-indexnow` integration package which hooks into `astro:build:done` and automatically submits all built page URLs. This is the cleanest integration -- zero manual steps.

**React/Vite:**
```
public/{indexnow-key}.txt    -- Verification file (static)
```
IndexNow submission happens via a CI/CD pipeline step (not in-app), since SPAs do not have server-side API routes by default. A simple curl command in the deploy script submits the sitemap URL.

### Pipeline Integration Point

IndexNow is a **post-deploy** concern, not a build concern. Modulo generates source code, not deployment pipelines. The integration should be:

1. **Wave 0 scaffold:** Generate the verification file and API route (framework-specific)
2. **`search-visibility` skill:** Document the post-deploy integration patterns per hosting platform (Vercel, Netlify, Cloudflare Pages, custom)
3. **Quality review (Layer 3):** Verify the IndexNow endpoint exists and responds correctly
4. **NOT an agent protocol:** IndexNow submission is infrastructure, not design. The skill documents the patterns; the user's CI/CD pipeline executes them.

### Key Constraint

IndexNow API keys should NOT be hardcoded in source code. The skill should document using environment variables:
```typescript
const INDEXNOW_KEY = process.env.INDEXNOW_API_KEY;
```
The verification file filename matches the key, so it must be generated with a placeholder that the user replaces.

---

## Question 5: API Integration -- Context7 MCP and Research Pipeline

### Recommendation: Extend Researcher Agent with MCP Tool Access

Context7 MCP provides up-to-date, version-specific documentation for libraries and frameworks. It has two core tools:
- `resolve-library-id`: Resolves a library name to a Context7 ID
- `query-docs`: Fetches current documentation for a resolved library

### Where Context7 Fits in the Pipeline

**Primary integration point: Researcher agent (Track 3: COMPONENT-PATTERNS)**

The researcher agent already uses WebSearch and WebFetch for external research. Context7 MCP should be added as a first-priority tool for library-specific research, before falling back to WebSearch.

**Concrete change to researcher agent:**
```markdown
tools: Read, Write, Grep, Glob, WebSearch, WebFetch,
       mcp__context7__resolve-library-id, mcp__context7__query-docs
```

**Research protocol update:**
```markdown
### Library Research Protocol

When researching a specific library or framework:
1. FIRST: Use Context7 to resolve the library ID and query current docs
2. SECOND: If Context7 does not have the library, use WebFetch on official docs
3. THIRD: Use WebSearch for community patterns and real-world usage
4. Trust Context7 > Official docs > WebSearch for API/feature questions
```

**Secondary integration point: Section builder (on-demand)**

Section builders occasionally need to look up framework-specific API details (e.g., "what is the exact type signature for `generateMetadata` in Next.js 16?"). Adding Context7 to the builder's tool list allows just-in-time documentation lookup without bloating the spawn prompt.

However, this should be a cautious addition. Builders are designed to be fast and context-efficient. Adding MCP tool calls adds latency. The recommendation is:

- **Do NOT add Context7 to section-builder by default**
- **DO add Context7 to specialist agents** (3d-specialist, animation-specialist) that work with complex library APIs where training data is most likely stale
- **DO add Context7 to the quality-reviewer** for verifying that framework patterns used in built code are current and correct

### API Pattern Skills

There is no need for a separate "API integration" skill. Context7 is a tool, not a knowledge domain. The tool is added to agent definitions; the agents already know how to research. What IS needed is updating the researcher agent's protocol to prefer Context7 for library questions, and documenting the tool availability in the agent's tool list.

### MCP Availability Consideration

Context7 MCP requires MCP server configuration in the user's Claude Code setup. It is not guaranteed to be available. The researcher agent's protocol should gracefully fall back:

```markdown
If Context7 MCP tools are not available:
- Fall back to WebFetch on official documentation URLs
- Flag in research output: "Context7 unavailable, using WebFetch fallback"
- Research confidence may be MEDIUM instead of HIGH for library-specific claims
```

---

## Question 6: Quality Gates -- Should SEO/GEO Have Its Own Quality Gate?

### Recommendation: Integrate into Existing Gates, Not a Separate Gate

Adding a separate SEO quality gate would break the elegant 4-layer enforcement model. Instead, SEO/GEO checks should be added to the existing layers at the appropriate severity levels.

### Layer 1: Build-Time (Section Builder Self-Check)

Add to the builder's self-check protocol:

```markdown
**SEO self-check (public-facing projects only):**
- [ ] Page has `metadata` export or `generateMetadata` function
- [ ] `title` and `description` are present (not empty strings)
- [ ] `openGraph.images` array has at least one image with width/height
- [ ] Canonical URL is dynamic (uses route param, not hardcoded string)
- [ ] JSON-LD schema matches PLAN.md schema assignment
```

**Severity:** Missing metadata = MAJOR (queued for batch fix). Wrong schema type = MINOR (logged for polish).

### Layer 2: Post-Wave (Quality Reviewer)

Add an SEO category to the verification report, but NOT to the anti-slop 35-point gate. SEO is a technical correctness concern, not a design quality concern. The anti-slop gate measures visual design quality; mixing in SEO would dilute its purpose.

Instead, add a **supplementary SEO checklist** that runs alongside the 3-level verification:

```markdown
### SEO Verification (supplementary, public-facing projects only)

| Check | Pass/Fail | Severity |
|-------|-----------|----------|
| All pages have unique title + description | | WARNING if missing |
| No duplicate meta descriptions across pages | | WARNING if duplicate |
| All pages have og:image with dimensions | | WARNING if missing |
| JSON-LD validates against schema.org structure | | WARNING if invalid |
| Canonical URLs are dynamic, not hardcoded | | WARNING if hardcoded |
| sitemap.ts generates valid XML | | WARNING if broken |
| robots.txt does not block important paths | | CRITICAL if blocking indexed pages |
| Heading hierarchy is sequential (h1 > h2 > h3) | | WARNING if skipped |
| FAQ schema content matches visible FAQ content | | WARNING if mismatch |
```

**Why supplementary, not primary:** The 35-point anti-slop gate is the design quality signal. Adding SEO points would mean a site with perfect visual design but missing og:image scores lower than a generic site with complete metadata. These are orthogonal concerns. The SEO checklist produces its own pass/fail that appears in the quality report alongside the anti-slop score.

### Layer 3: End-of-Build (Live Testing)

Add SEO-specific checks to the live testing protocol:

```markdown
### SEO Live Testing

1. Fetch /sitemap.xml -- verify it returns valid XML with expected URL count
2. Fetch /robots.txt -- verify it exists and allows important paths
3. Check each page's <head> for: title, description, og:image, canonical
4. Validate JSON-LD using structured data linting (parse, check @context, @type)
5. Check that no page has duplicate <title> or <meta name="description">
```

**Severity:** Broken sitemap = WARNING. robots.txt blocking indexed pages = CRITICAL. Missing metadata on any page = WARNING.

### Layer 4: User Checkpoint

SEO findings appear in the checkpoint presentation alongside design quality:

```markdown
### SEO Status
- Pages with complete metadata: [X/Y]
- Structured data schemas: [list]
- Sitemap: [valid/invalid]
- Missing: [specific gaps]
```

### GEO-Specific Quality Signal

GEO optimization is harder to gate-check because AI search visibility is not deterministic. However, content-level checks can verify GEO readiness:

```markdown
### GEO Readiness (informational, not gated)
- FAQ schema present on [N] pages (AI engines extract FAQ prominently)
- Content sections use clear heading hierarchy (AI engines parse by heading)
- Statistics/data points present every ~200 words in long-form content
- No orphan pages (every page linked from at least one other page)
```

This is reported as INFO, not WARNING or CRITICAL. GEO is an optimization, not a requirement.

---

## Component Interaction Diagram

```
                         /modulo:start-project
                                |
                    content-specialist reads
                    search-visibility skill
                    for GEO content patterns
                                |
                          CONTENT.md
                    (with SEO/GEO metadata section)
                                |
                         /modulo:plan-dev
                                |
                    section-planner reads
                    structured-data skill
                    for schema assignment
                                |
                    MASTER-PLAN.md (with SEO Registry)
                    PLAN.md files (with metadata must_haves)
                                |
                         /modulo:execute
                                |
            +-------------------+-------------------+
            |                   |                   |
        Wave 0              Wave 1             Wave 2+
    sitemap.ts          layout metadata      per-page metadata
    robots.ts           site JSON-LD         page JSON-LD
    IndexNow route      default og:image     page og:image
    JsonLd component    metadataBase         canonical URLs
            |                   |                   |
            +-------------------+-------------------+
                                |
                    Post-Wave Quality Review
                    (SEO supplementary checklist)
                                |
                    Post-Build Live Testing
                    (sitemap validation, head checks)
                                |
                    User Checkpoint
                    (SEO status in quality report)
```

---

## Skill Dependency Map

```
search-visibility (Domain)
    |-- references: multi-page-architecture (page registry, URL patterns)
    |-- references: blog-patterns (article metadata, RSS)
    |-- references: ecommerce-ui (product schema)
    |-- consumed by: content-specialist (GEO formatting)
    |-- consumed by: section-planner (sitemap registry)
    |-- consumed by: quality-reviewer (SEO checklist)

structured-data (Domain)
    |-- references: multi-page-architecture (page types)
    |-- references: blog-patterns (article schema)
    |-- references: ecommerce-ui (product schema)
    |-- consumed by: section-planner (schema assignment)
    |-- consumed by: section-builder (JSON-LD generation)
    |-- consumed by: quality-reviewer (schema validation)

seo-meta (Core, rewritten)
    |-- references: design-dna (brand name, description for meta)
    |-- references: multi-page-architecture (page templates)
    |-- consumed by: section-builder (metadata generation)
    |-- consumed by: quality-reviewer (metadata verification)
    |-- consumed by: build-orchestrator (Wave 0 scaffold)
```

---

## Suggested Build Order for v1.5

Dependencies determine the order. Skills must exist before agents can reference them; agent updates must happen before commands exercise them.

### Phase A: Skill Creation (no agent changes needed)

1. **Rewrite `seo-meta`** -- Promote to Core tier. Add DNA connection for brand name/description in metadata. Add machine-readable constraints (every page MUST have title, description, og:image). Remove sitemap/robots patterns (moved to search-visibility). Add Next.js 16 `generateMetadata` patterns. Add Astro 5/6 head patterns. Add React/Vite `react-helmet-async` patterns.

2. **Create `structured-data`** -- New Domain skill. JSON-LD patterns per page type (Article, FAQ, Product, BreadcrumbList, Organization, WebSite, HowTo, AboutPage). Schema selection matrix mapping multi-page-architecture page types to schema types. Framework-specific injection patterns. Anti-patterns (microdata, duplicate schemas, schema-visible content mismatch).

3. **Create `search-visibility`** -- New Domain skill. Sitemap generation patterns (framework-specific). robots.txt patterns. IndexNow integration (endpoint, verification, post-deploy hooks). GEO content formatting guidelines (quotable snippets, FAQ structuring, statistics density, heading hierarchy for AI extraction). AI search engine compatibility (GPTBot, Google-Extended, Claude-SearchTool user agents in robots.txt).

### Phase B: Agent Updates (skills must exist first)

4. **Update section-planner** -- Add schema assignment logic using `structured-data` skill. Add SEO Registry section to MASTER-PLAN.md template. Add metadata `must_haves.truths` to PLAN.md generation.

5. **Update content-specialist** -- Add `search-visibility` skill reference for GEO content formatting. Add SEO/GEO metadata section to CONTENT.md template.

6. **Update build-orchestrator** -- Add Wave 0 SEO scaffold items (sitemap.ts, robots.ts, IndexNow route, JsonLd component) to the Wave 0 build context. These are framework-specific -- the orchestrator includes the right scaffold template based on the project's framework.

7. **Update quality-reviewer** -- Add supplementary SEO checklist to post-wave verification. Add SEO live testing checks to Layer 3 protocol. Add SEO status to user checkpoint presentation.

8. **Update researcher agent** -- Add Context7 MCP tools to tool list. Update research protocol to prefer Context7 for library-specific questions. Add graceful fallback when MCP is unavailable.

### Phase C: Integration Verification

9. **Update SKILL-DIRECTORY.md** -- Register new skills, update seo-meta tier from Utility to Core.

10. **End-to-end verification** -- Trace through the full pipeline (start-project -> plan-dev -> execute) for a multi-page Next.js project to verify SEO artifacts are generated at each touch point.

### Dependency Graph

```
Phase A (parallel):
  [1] seo-meta rewrite ----------------------+
  [2] structured-data creation ---------------+-- Phase B (sequential):
  [3] search-visibility creation -------------+     [4] section-planner update
                                                    [5] content-specialist update
                                                    [6] build-orchestrator update
                                                    [7] quality-reviewer update
                                                    [8] researcher update
                                                               |
                                                        Phase C:
                                                    [9] directory update
                                                    [10] e2e verification
```

Phase A items can be built in parallel (3 independent skills). Phase B items have mild ordering preferences (section-planner before build-orchestrator, since the orchestrator reads PLAN.md files that the planner generates) but can largely be parallelized. Phase C depends on all of Phase B.

---

## Framework Decision Matrix

The SEO implementation varies significantly by target framework. The skills should provide framework-specific patterns for all Modulo-supported targets.

| Capability | Next.js (App Router) | Astro | React/Vite | Tauri/Electron |
|-----------|---------------------|-------|------------|----------------|
| Metadata | `generateMetadata` / `metadata` export | `<SEOHead>` component in layout | `react-helmet-async` | N/A (not web-indexed) |
| Sitemap | `app/sitemap.ts` (native) | `@astrojs/sitemap` or custom endpoint | Static `public/sitemap.xml` | N/A |
| robots.txt | `app/robots.ts` (native) | `public/robots.txt` or endpoint | Static `public/robots.txt` | N/A |
| JSON-LD | `<script>` in component or metadata.other | `set:html` in layout | Component with JSON.stringify | N/A |
| IndexNow | `app/api/indexnow/route.ts` | `astro-indexnow` integration | CI/CD script | N/A |
| Dynamic metadata | `generateMetadata` async function | Frontmatter props to layout | Route-level `<Helmet>` | N/A |

**Key insight:** Tauri and Electron targets should be excluded from SEO skills entirely. The skill's "When NOT to Use" section should explicitly state this. The `search-visibility` skill's Decision Tree should check the project's target framework and skip SEO for desktop targets.

---

## Anti-Patterns Specific to This Integration

### Anti-Pattern 1: SEO as Afterthought

**What goes wrong:** SEO is added in a polish pass after all sections are built. Content was not written for AI extraction. Metadata is generic boilerplate. JSON-LD schemas are guessed rather than planned.
**Instead:** SEO planning happens in content planning (GEO formatting) and section planning (schema assignment). By build time, every PLAN.md includes specific metadata requirements.

### Anti-Pattern 2: Separate SEO Quality Gate

**What goes wrong:** Adding a 5th quality layer ("SEO gate") that runs independently. This bloats the review pipeline, adds latency between waves, and creates a new agent coordination burden for the orchestrator.
**Instead:** SEO checks are folded into existing layers (builder self-check, QR supplementary checklist, live testing). The infrastructure exists; add criteria, not layers.

### Anti-Pattern 3: Hardcoded IndexNow Keys in Source

**What goes wrong:** The IndexNow API key is committed to the repository. Anyone who clones the repo can impersonate the site for IndexNow submissions.
**Instead:** Use environment variables. The scaffold generates the verification file with a placeholder key and documents the env var setup.

### Anti-Pattern 4: GEO Overfitting

**What goes wrong:** Content is rewritten to be "AI-friendly" at the expense of human readability. Every paragraph starts with a definition. Every section has a FAQ. The page reads like a search engine optimization textbook.
**Instead:** GEO formatting should enhance, not replace, the brand voice. The content-specialist applies GEO patterns within the established archetype voice. A Brutalist site does not need FAQ schemas on every page -- its directness IS quotable.

### Anti-Pattern 5: Schema-Content Mismatch

**What goes wrong:** JSON-LD Article schema claims `datePublished: "2024-01-15"` but the visible page shows no date. Or FAQ schema includes questions not visible on the page. Google penalizes this as misleading structured data.
**Instead:** The quality-reviewer verifies that all JSON-LD content matches visible page content. This is a HARD check: schema data must be extractable from the rendered DOM.

---

## Machine-Readable Constraints (for new skills)

### seo-meta (Core)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| title_length | 30 | 60 | chars | SOFT -- warn outside range |
| description_length | 120 | 160 | chars | SOFT -- warn outside range |
| og_image_width | 1200 | 1200 | px | HARD -- exactly 1200px for optimal display |
| og_image_height | 630 | 630 | px | HARD -- exactly 630px for optimal display |
| canonical_url | dynamic | - | - | HARD -- must use route params, not hardcoded |
| metadata_per_page | 1 | - | export | HARD -- every page must have metadata |

### structured-data (Domain)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| schema_content_match | required | - | - | HARD -- schema data must match visible content |
| json_ld_format | required | - | - | HARD -- use JSON-LD, not microdata or RDFa |
| schema_per_page_type | 1 | 3 | schemas | SOFT -- 1-3 schemas per page type |

### search-visibility (Domain)

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| sitemap_url_limit | - | 50000 | URLs | HARD -- split into index if exceeded |
| sitemap_file_size | - | 50 | MB | HARD -- split if exceeded |
| robots_txt_present | required | - | - | HARD -- must exist for public sites |
| indexnow_key_env_var | required | - | - | HARD -- never hardcode in source |

---

## Sources

- Existing `seo-meta` skill: `D:/Modulo/Plugins/v0-ahh-skill/skills/seo-meta/SKILL.md` (398 lines, current v2.0 implementation) [HIGH confidence]
- Existing `multi-page-architecture` skill: page type templates, URL patterns, wave structure [HIGH confidence]
- Existing pipeline agents: build-orchestrator, section-planner, quality-reviewer, researcher [HIGH confidence]
- Existing quality-gate-protocol: 4-layer enforcement model [HIGH confidence]
- [GEO best practices for 2026](https://www.firebrand.marketing/2025/12/geo-best-practices-2026/) [MEDIUM confidence -- rapidly evolving field]
- [Mastering generative engine optimization in 2026](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142) [MEDIUM confidence]
- [IndexNow for Next.js](https://www.freecodecamp.org/news/how-to-index-nextjs-pages-with-indexnow/) [MEDIUM confidence]
- [Astro IndexNow integration](https://github.com/Devdatta7/astro-indexnow) [MEDIUM confidence]
- [Next.js generateSitemaps](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps) [HIGH confidence -- official docs]
- [Context7 MCP server](https://github.com/upstash/context7) [HIGH confidence -- official repo]
- [How to configure SEO in Next.js 16](https://jsdevspace.substack.com/p/how-to-configure-seo-in-nextjs-16) [MEDIUM confidence]
