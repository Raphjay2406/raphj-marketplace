# Phase 12: Registry & Documentation - Research

**Researched:** 2026-02-25
**Domain:** Markdown documentation rebuild -- SKILL-DIRECTORY.md and README.md
**Confidence:** HIGH

## Summary

Phase 12 closes ISSUE-4 and ISSUE-5 from the v1 milestone audit. Both documents are entirely stale: SKILL-DIRECTORY.md was last updated during Phase 1 (showing ~40 skills as PLANNED when they are now complete), and README.md contains v6.1.0 content (wrong commands, wrong agent count, wrong archetype count, wrong workflow). Both documents need full rebuilds, not patches.

This research inventoried the entire codebase to produce authoritative source-of-truth data for both documents. The findings below include the complete skill inventory (85 directories, 46 with v2.0 frontmatter, 39 legacy), the exact command surface (8 commands), the correct agent pipeline structure (7 pipeline + 4 protocols + 3 specialists + 17 legacy at root), and the 19 archetypes. All data comes from direct filesystem inspection -- no guesswork.

**Primary recommendation:** Both documents should be rebuilt from scratch using the codebase as source of truth, not by patching the existing content. The delta between current state and desired state is too large for incremental updates.

## Standard Stack

Not applicable -- this phase is pure documentation work (markdown files only). No libraries, no code, no build systems.

### Tools Used
| Tool | Purpose | Why Standard |
|------|---------|--------------|
| Filesystem inspection | Source of truth for skill inventory | The actual `skills/` directory is authoritative |
| YAML frontmatter parsing | Extract tier, description, version from each SKILL.md | Frontmatter is the machine-readable metadata |
| Plugin manifest (`plugin.json`) | Authoritative version number | Single source of truth for version |

## Architecture Patterns

### SKILL-DIRECTORY.md Structure (Current vs. Needed)

**Current structure (stale):**
- Header with skill architecture overview (3-tier loading, 4-layer format)
- Three main sections: Core Skills, Domain Skills, Utility Skills
- Domain Skills grouped by sub-category (Motion, Design System, Content, Asset Specialists, Interaction Patterns, Industry Verticals)
- Utility Skills grouped by sub-category (Frameworks, Animation Libraries, Cross-Cutting Concerns, Integration)
- Skill Count Summary table
- v6.1.0 Cull List (detailed disposition of all 87 v6.1.0 skills)
- 4-Layer Format Reference section
- Footer with registry version, last-updated, and total count

**Current format per table:**
Core Skills table: `| Skill | Status | Phase | Lines | Description |`
Domain/Utility tables: `| Skill | Status | Phase | Description |`

**What needs to change:**
1. ALL skills marked PLANNED that now exist with v2.0 frontmatter must be updated to COMPLETE
2. Skill names must match actual directory names (the directory lists `three-js-webgl` but the actual directory is `three-d-webgl-effects`)
3. New skills from Phases 4-9 that were not in the original directory must be added
4. The planned names that were renamed during implementation must be corrected
5. The count summary must be updated
6. The "typography" and "color-system" core skills should be removed (never created -- absorbed into other skills per audit)
7. Skills using `category:` in frontmatter instead of `tier:` should be noted for consistency

**Recommended approach:** Preserve the existing document structure (it is well-organized) but rebuild ALL table content from the actual filesystem. Keep the v6.1.0 Cull List section (valuable historical context) and the 4-Layer Format Reference section.

### README.md Structure (Current vs. Needed)

**Current content (v6.1.0, all wrong):**
- Title line: "87 skills, 13 slash commands, 17 agents" -- all wrong
- What's New in v6.1 section -- outdated
- What Made v6.0 Different section -- outdated
- Commands (13) -- wrong, v2.0 has 8
- Workflow diagram -- wrong sequence
- Agents (17) -- wrong, v2.0 has different pipeline structure
- Design DNA System -- partially correct but references some wrong details
- Design Archetypes (16 + Custom) -- wrong, v2.0 has 19
- Anti-Slop Gate -- mostly correct
- Wave System -- mostly correct
- Skills (87) -- wrong, massive list with removed/merged skills
- Planning Artifacts -- partially correct
- Framework Support -- wrong (says Next.js and Astro only, v2.0 adds React/Vite, Tauri, Electron)

**What README.md must cover (from CLAUDE.md as reference):**
1. Project description (premium frontend design system, Awwwards 8.0+ baseline)
2. Installation instructions
3. Commands (8): start-project, lets-discuss, plan-dev, execute, iterate, bug-fix, status, audit
4. Core workflow: start-project -> lets-discuss -> plan-dev -> execute -> iterate
5. Pipeline agents (7 pipeline + protocols + specialists)
6. Design DNA system (12 color tokens, type scale, spacing, etc.)
7. Design Archetypes (19 + Custom)
8. Anti-Slop Gate (35-point scoring)
9. Wave System
10. Skill overview (3-tier system with approximate counts)
11. Framework support (Next.js, Astro, React/Vite, Tauri, Electron)
12. Version matching plugin.json (2.0.0-dev)

### Key Decision: SKILL-DIRECTORY.md is a Registry Document

Per Phase 1-06 decision: SKILL-DIRECTORY.md is a registry document, NOT a skill. It has no YAML frontmatter. Agents reference it explicitly for skill discovery.

## Complete Skill Inventory (Source of Truth)

### All 85 Skill Directories

These are every directory under `skills/` containing a SKILL.md file, as of 2026-02-25.

#### V2.0 Skills (46 total -- have `version: "2.0.0"` in frontmatter)

**Core Tier (from frontmatter `tier: core` or `category: core`):**

| Directory Name | Lines | Description (from frontmatter) | Phase |
|---------------|-------|-------------------------------|-------|
| `design-dna` | 477 | Machine-enforceable visual identity system | 1 |
| `design-archetypes` | 1184 | 19 archetype personality systems | 1 |
| `anti-slop-gate` | 397 | 35-point weighted quality scoring | 1 |
| `emotional-arc` | 680 | 10 beat types with hard parameter constraints | 1 |
| `quality-gate-protocol` | 464 | 4-layer progressive quality enforcement | 4 |
| `compositional-diversity` | 350 | 18-pattern layout taxonomy with adjacency rules | 4 |
| `polish-pass` | 695 | End-of-build polish protocol | 4 |
| `reference-benchmarking` | 568 | Per-section quality targets from award-winning sites | 4 |
| `cinematic-motion` | 705 | Unified motion design system (subsumes css-animations, framer-motion, gsap) | 5 |
| `creative-tension` | 998 | 5 tension levels, per-archetype implementations | 5 |
| `wow-moments` | 1417 | 30+ signature interaction patterns | 5 |
| `design-system-scaffold` | 768 | Wave 0 scaffold generator (Tailwind v4 @theme) | 5 |
| `performance-animation` | 537 | Performance-aware animation, CWV compliance | 5 |
| `design-brainstorm` | 615 | Research-first creative direction engine | 6 |
| `creative-direction-format` | 589 | Creative direction concept board format | 6 |
| `copy-intelligence` | 629 | Brand voice generation engine | 6 |
| `cross-pollination` | 485 | Industry-specific convention borrowing matrix | 6 |
| `tailwind-system` | 877 | Tailwind CSS v4 CSS-first configuration | 8 |
| `responsive-design` | 687 | Mobile-first responsive design with 375px floor | 8 |
| `accessibility` | 929 | WCAG 2.1 AA baked into every component | 8 |
| `progress-reporting` | 539 | Multi-level progress reporting protocol | 9 |
| `error-recovery` | 594 | Structured error diagnosis and checkpoint resume | 9 |
| `live-testing` | 526 | Automated browser testing protocol (Playwright MCP) | 9 |

**Domain Tier (from frontmatter `tier: domain`):**

| Directory Name | Lines | Description (from frontmatter) | Phase |
|---------------|-------|-------------------------------|-------|
| `page-transitions` | 690 | Page transition system (View Transitions API, Motion, shared element) | 5 |
| `copy-intelligence` | 629 | Brand voice generation engine | 6 |
| `cross-pollination` | 485 | Industry-specific convention borrowing | 6 |
| `shape-asset-generation` | 1304 | Procedural shape generation, SVG assets | 7 |
| `three-d-webgl-effects` | 1138 | 3D and WebGL with React Three Fiber | 7 |
| `remotion-video` | 765 | Programmatic video content with Remotion | 7 |
| `spline-integration` | 422 | Spline 3D scene embedding | 7 |
| `component-marketplace` | 362 | When-to-use guidance for Aceternity/Magic UI/21st.dev | 7 |
| `image-prompt-generation` | 453 | DNA-matched AI image prompt generation | 7 |
| `dark-light-mode` | 743 | Archetype-aware dark/light mode | 8 |
| `multi-page-architecture` | 637 | Site-level DNA extensions, page-type templates | 8 |
| `nextjs-patterns` | 619 | Next.js 16 patterns (App Router + Pages Router) | 8 |
| `react-vite-patterns` | 617 | React/Vite SPA patterns | 8 |
| `astro-patterns` | 570 | Astro 5/6 patterns | 8 |
| `desktop-patterns` | 771 | Tauri v2 and Electron desktop design | 8 |
| `ecommerce-ui` | 396 | E-commerce UI patterns | 8 |
| `dashboard-patterns` | 424 | Dashboard UI patterns | 8 |
| `portfolio-patterns` | 448 | Portfolio UI patterns | 8 |
| `blog-patterns` | 381 | Blog and article UI patterns | 8 |
| `figma-integration` | 785 | Figma design import via MCP tools | 9 |
| `design-system-export` | 881 | Storybook 10 stories + W3C DTCG design tokens | 9 |

**Utility Tier (from frontmatter `tier: utility`):**

| Directory Name | Lines | Description (from frontmatter) | Phase |
|---------------|-------|-------------------------------|-------|
| `form-builder` | 437 | Form UI patterns (react-hook-form, zod) | 8 |
| `seo-meta` | 398 | SEO and metadata patterns | 8 |
| `i18n-rtl` | 305 | Internationalization and RTL patterns | 8 |

**Template:**

| Directory Name | Lines | Notes |
|---------------|-------|-------|
| `_skill-template` | 144 | Canonical 4-layer format reference -- not a real skill |

**NOTE:** `copy-intelligence` and `cross-pollination` have `tier: domain` in their frontmatter but are listed above. The planner should decide the authoritative tier for each. Also note 4 v2.0 skills use `category:` instead of `tier:` in frontmatter: `compositional-diversity`, `live-testing`, `quality-gate-protocol`, `polish-pass`.

#### Legacy V6.1.0 Skills (39 total -- NO `version: "2.0.0"` in frontmatter)

These skills exist in the `skills/` directory but have NOT been rewritten to v2.0 4-layer format. They have old-style frontmatter (no `tier:`, no `version:`, many lack `triggers:`).

| Directory Name | Lines | Notes |
|---------------|-------|-------|
| `accessibility-patterns` | 288 | Superseded by `accessibility` (v2.0) |
| `auth-ui` | 180 | Legacy, no v2.0 rewrite |
| `awwwards-scoring` | 168 | Disposition deferred (keep separate or fold into anti-slop-gate) |
| `chart-data-viz` | 179 | Absorbed into `dashboard-patterns` per cull list |
| `context-menu` | 410 | Legacy, no v2.0 rewrite |
| `conversion-patterns` | 241 | Merged into `copy-intelligence` per cull list |
| `creative-sections` | 568 | Legacy, no v2.0 rewrite |
| `data-table` | 190 | Legacy, no v2.0 rewrite |
| `drag-and-drop` | 282 | Legacy, no v2.0 rewrite |
| `email-notification-ui` | 275 | Legacy, no v2.0 rewrite |
| `error-states-ui` | 273 | Legacy, no v2.0 rewrite |
| `file-upload-media` | 291 | Legacy, no v2.0 rewrite |
| `glow-neon-effects` | 307 | Legacy, no v2.0 rewrite |
| `image-asset-pipeline` | 251 | Legacy, no v2.0 rewrite |
| `landing-page` | 405 | Legacy -- has old frontmatter, no tier/version |
| `light-mode-patterns` | 385 | Superseded by `dark-light-mode` per cull list |
| `map-location` | 210 | Legacy, no v2.0 rewrite |
| `markdown-mdx` | 396 | Legacy, no v2.0 rewrite |
| `micro-copy` | 234 | Merged into `copy-intelligence` per cull list |
| `mobile-navigation` | 243 | Merged into `responsive-design` per cull list |
| `mobile-patterns` | 269 | Merged into `responsive-design` per cull list |
| `modal-dialog-patterns` | 218 | Legacy, no v2.0 rewrite |
| `navigation-patterns` | 273 | Legacy, no v2.0 rewrite |
| `nextjs-app-router` | 245 | Superseded by `nextjs-patterns` (v2.0) |
| `notification-center` | 379 | Legacy, no v2.0 rewrite |
| `onboarding-tours` | 222 | Legacy, no v2.0 rewrite |
| `performance-guardian` | 140 | Partially superseded by `performance-animation` (v2.0); covers non-animation perf |
| `performance-patterns` | 331 | Legacy, no v2.0 rewrite |
| `premium-dark-ui` | 186 | Superseded by `dark-light-mode` per cull list |
| `premium-typography` | 256 | Legacy, no v2.0 rewrite |
| `print-pdf` | 230 | Legacy, no v2.0 rewrite |
| `rating-review` | 281 | Legacy, no v2.0 rewrite |
| `responsive-layout` | 164 | Merged into `responsive-design` per cull list |
| `search-ui` | 222 | Legacy, no v2.0 rewrite |
| `shadcn-components` | 484 | Legacy frontmatter but actively used |
| `skeleton-loading` | 244 | Legacy, no v2.0 rewrite |
| `social-features` | 205 | Legacy, no v2.0 rewrite |
| `testing-patterns` | 325 | Legacy frontmatter |
| `ux-patterns` | 304 | Legacy, no v2.0 rewrite |

### Name Mismatches Between Directory and SKILL-DIRECTORY.md

| SKILL-DIRECTORY.md Name | Actual Directory Name | Notes |
|-------------------------|----------------------|-------|
| `three-js-webgl` | `three-d-webgl-effects` | Renamed during Phase 7 |
| `shape-generation` | `shape-asset-generation` | Renamed during Phase 7 |
| `image-prompts` | `image-prompt-generation` | Renamed during Phase 7 |
| `remotion` | `remotion-video` | Renamed during Phase 7 |
| `creative-direction` | `creative-direction-format` | Named differently in Phase 6 |
| `typography` | DOES NOT EXIST | Never created, absorbed into other skills |
| `color-system` | DOES NOT EXIST | Never created, absorbed into other skills |
| `color-modes` | `dark-light-mode` | Named differently in Phase 8 |
| `tailwind-patterns` | `tailwind-system` | Renamed during Phase 8 |
| `framer-motion` | DOES NOT EXIST as separate | Absorbed into `cinematic-motion` |
| `gsap-animations` | DOES NOT EXIST as separate | Absorbed into `cinematic-motion` |
| `css-animations` | DOES NOT EXIST as separate | Absorbed into `cinematic-motion` |
| `interaction-patterns` (planned merger) | NOT CREATED | drag-and-drop, context-menu, modal-dialog-patterns remain separate as legacy |
| `responsive-design` (planned merger) | `responsive-design` EXISTS | But source skills (responsive-layout, mobile-patterns, mobile-navigation) still exist as legacy |
| `copy-intelligence` (planned merger) | `copy-intelligence` EXISTS | But source skills (micro-copy, conversion-patterns) still exist as legacy |
| `navigation-patterns` (planned rewrite) | `navigation-patterns` EXISTS | Still legacy format |

### Skills Listed in SKILL-DIRECTORY.md But NOT in Filesystem

| Planned Skill | Status |
|--------------|--------|
| `typography` (Core) | Never created |
| `color-system` (Core) | Never created |
| `framer-motion` (Utility) | Absorbed into `cinematic-motion` |
| `gsap-animations` (Utility) | Absorbed into `cinematic-motion` |
| `css-animations` (Utility) | Absorbed into `cinematic-motion` |

### Skills in Filesystem But NOT in SKILL-DIRECTORY.md

| Skill | Phase | Tier | Notes |
|-------|-------|------|-------|
| `quality-gate-protocol` | 4 | core | Phase 4 skill, created after directory was written |
| `compositional-diversity` | 4 | core | Phase 4 skill |
| `polish-pass` | 4 | core | Phase 4 skill |
| `reference-benchmarking` | 4 | core | Phase 4 skill |
| `performance-animation` | 5 | core | Phase 5 skill |
| `design-brainstorm` | 6 | core | Phase 6 skill (directory lists it as absorbed into creative-direction) |
| `creative-direction-format` | 6 | core | Directory lists as `creative-direction` |
| `cross-pollination` | 6 | domain | Phase 6 skill |
| `tailwind-system` | 8 | core | Directory lists as `tailwind-patterns` |
| `accessibility` | 8 | core | Directory lists as `accessibility-patterns` |
| `responsive-design` | 8 | core | Was listed as PLANNED merger |
| `dark-light-mode` | 8 | domain | Directory lists as `color-modes` |
| `multi-page-architecture` | 8 | domain | Phase 8 skill, not in directory |
| `nextjs-patterns` | 8 | domain | Directory lists as `nextjs-app-router` |
| `react-vite-patterns` | 8 | domain | Not in directory |
| `desktop-patterns` | 8 | domain | Not in directory |
| `live-testing` | 9 | core | Phase 9 skill, not in directory |
| `progress-reporting` | 9 | core | Phase 9 skill, not in directory |
| `error-recovery` | 9 | core | Phase 9 skill, not in directory |
| `design-system-export` | 9 | domain | Was listed as PLANNED |
| `figma-integration` | 9 | domain | Was listed as PLANNED |

## Complete Agent Inventory

### V2.0 Pipeline Agents (in `agents/pipeline/`)

| Agent | Role |
|-------|------|
| `researcher.md` | Parallel research agent |
| `creative-director.md` | Active review against DNA and creative vision |
| `section-planner.md` | PLAN.md generation with wave assignments |
| `build-orchestrator.md` | Wave-based execution, session management |
| `section-builder.md` | Stateless section builder (reads only PLAN.md) |
| `quality-reviewer.md` | Three-level verification + anti-slop gate |
| `polisher.md` | End-of-build micro-detail polish |

### V2.0 Protocols (in `agents/protocols/`)

| Protocol | Purpose |
|----------|---------|
| `discussion-protocol.md` | Discussion-before-action rules |
| `context-rot-prevention.md` | CONTEXT.md lifecycle, canary checks, session boundaries |
| `canary-check.md` | 5 self-test questions after each wave |
| `agent-memory-system.md` | 3-layer memory: context file, design system, feedback loop |

### V2.0 Domain Specialists (in `agents/specialists/`)

| Specialist | Domain |
|-----------|--------|
| `3d-specialist.md` | 3D/WebGL scenes |
| `animation-specialist.md` | Complex animation sequences |
| `content-specialist.md` | Content strategy and copy |

### Legacy V6.1.0 Agents (in `agents/` root -- 17 files)

These remain from v6.1.0 and are slated for removal in Phase 13:
`accessibility-auditor.md`, `component-documenter.md`, `design-lead.md`, `design-researcher.md`, `design-system-auditor.md`, `discussion-protocol.md`, `figma-translator.md`, `interaction-reviewer.md`, `migration-assistant.md`, `performance-auditor.md`, `quality-reviewer.md`, `responsive-tester.md`, `section-builder.md`, `security-auditor.md`, `seo-optimizer.md`, `typescript-auditor.md`, `visual-auditor-live.md`

**Note:** Some root-level agents share names with pipeline agents (`quality-reviewer.md`, `section-builder.md`) -- the v2.0 versions in `agents/pipeline/` are authoritative.

## Complete Command Inventory

### V2.0 Commands (8 total, in `commands/`)

| Command | Description (from frontmatter) | Type |
|---------|-------------------------------|------|
| `/modulo:start-project` | Start a new Modulo project -- discovery, research, creative direction, content planning | Workflow |
| `/modulo:lets-discuss` | Creative deep dive -- explore visual features, content direction, and design ideas | Workflow |
| `/modulo:plan-dev` | Create detailed build plans for each section with wave assignments | Workflow |
| `/modulo:execute` | Build sections wave by wave with parallel builders | Workflow |
| `/modulo:iterate` | Improve designs with brainstorm-first approach | Workflow |
| `/modulo:bug-fix` | Diagnose and fix visual bugs with root cause analysis | Workflow |
| `/modulo:status` | Show full Modulo project status | Utility |
| `/modulo:audit` | Comprehensive site audit | Utility |

### V2.0 Workflow Sequence

```
start-project -> lets-discuss -> plan-dev -> execute -> iterate (if needed)
                                                     -> audit (optional)
                                                     -> bug-fix (as needed)
```

## Plugin Manifest

**File:** `.claude-plugin/plugin.json`
**Version:** `2.0.0-dev`
**Name:** `modulo`

The README version must match this exactly: `2.0.0-dev`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Skill inventory | Manual list of skills | Script/grep to extract all SKILL.md frontmatter | 85 skills, manual counting is error-prone |
| Line counts | Manual wc -l | Computed from filesystem | Changes with every edit |
| Tier classification | Guessing from content | Read `tier:` or `category:` from YAML frontmatter | Authoritative source |
| Archetype list | Counting from memory | Grep headings in design-archetypes/SKILL.md | Currently 19, definitional |

**Key insight:** The directory and README must be generated/validated from filesystem truth. Any manual process will drift again. Consider including a verification step that checks directory entries against actual `skills/` contents.

## Common Pitfalls

### Pitfall 1: Counting Skills Incorrectly
**What goes wrong:** Including `_skill-template` in skill count, or counting legacy and v2.0 skills that cover the same domain as separate entries
**Why it happens:** The `skills/` directory contains 85 directories but some are the template, some are superseded legacy, and some are active v2.0
**How to avoid:** Define clear categories: (1) v2.0 complete skills, (2) legacy skills still active (not superseded), (3) legacy skills superseded by v2.0 equivalents, (4) template. Count only categories 1+2 as "active skills"
**Warning signs:** Total count seems implausibly high (>60) or low (<30)

### Pitfall 2: Name Mismatches Between Directory and Filesystem
**What goes wrong:** SKILL-DIRECTORY.md uses a planned name that differs from the actual directory name
**Why it happens:** Skills were renamed during implementation (e.g., `three-js-webgl` became `three-d-webgl-effects`)
**How to avoid:** Every entry in SKILL-DIRECTORY.md must use backtick-wrapped names that exactly match the directory under `skills/`
**Warning signs:** Clicking a skill name in the directory leads to a non-existent path

### Pitfall 3: Inconsistent Tier Classification
**What goes wrong:** SKILL-DIRECTORY.md says one tier, frontmatter says another
**Why it happens:** 4 v2.0 skills use `category:` instead of `tier:`, some skills were reclassified during implementation
**How to avoid:** Use frontmatter as authoritative source. When frontmatter says `category: core`, treat as `tier: core`
**Warning signs:** A skill appears in the wrong tier section of the directory

### Pitfall 4: README Listing Legacy Content
**What goes wrong:** README mentions features, commands, or agents that no longer exist
**Why it happens:** Copy-pasting from v6.1.0 README sections that seem still-relevant
**How to avoid:** Write README from scratch using ONLY v2.0 source files (commands/*.md, agents/pipeline/*.md, plugin.json)
**Warning signs:** README mentions 13 commands, 17 agents, or 16 archetypes

### Pitfall 5: Forgetting the v6.1.0 Cull List Section
**What goes wrong:** SKILL-DIRECTORY.md loses the valuable cull list that documents every v6.1.0 skill disposition
**Why it happens:** Treating this as a "rebuild from scratch" and discarding historical context
**How to avoid:** Preserve the cull list section. It serves as documentation for why skills were removed/merged
**Warning signs:** No record of why `admin-panel` or `webhook-api-patterns` no longer exist

### Pitfall 6: Version Mismatch
**What goes wrong:** README says "v2.0.0" but plugin.json says "2.0.0-dev"
**Why it happens:** Not checking the authoritative source
**How to avoid:** Read plugin.json version and use it verbatim in README
**Warning signs:** Any version string in README that does not exactly match plugin.json

## Code Examples

Not applicable -- this phase produces markdown documents, not code. However, here are the key format patterns:

### SKILL-DIRECTORY.md Table Format (Core Skills)
```markdown
| Skill | Status | Tier | Phase | Lines | Description |
|-------|--------|------|-------|-------|-------------|
| `design-dna` | COMPLETE | Core | 1 | 477 | Machine-enforceable visual identity system |
```

### SKILL-DIRECTORY.md Table Format (Domain/Utility Skills)
```markdown
| Skill | Status | Tier | Phase | Lines | Description |
|-------|--------|------|-------|-------|-------------|
| `page-transitions` | COMPLETE | Domain | 5 | 690 | Page transition system |
```

### README.md Command Table Format
```markdown
| Command | Description |
|---------|-------------|
| `/modulo:start-project` | Start a new Modulo project -- discovery, research, creative direction |
```

### README.md Agent Pipeline Format
```markdown
### Pipeline Agents

| Agent | Role | Description |
|-------|------|-------------|
| `researcher` | Researcher | Parallel research agent for trends, references, components |
```

## State of the Art

| Old State | Current State | When Changed | Impact |
|-----------|--------------|--------------|--------|
| SKILL-DIRECTORY shows 4 complete, ~37 planned | 46 skills have v2.0 frontmatter | Phases 4-9 | Every "PLANNED" entry for implemented skills is wrong |
| README lists 13 commands | 8 commands exist | Phase 3 | Commands section entirely wrong |
| README lists 17 agents | 7 pipeline + 4 protocols + 3 specialists | Phase 2 | Agents section entirely wrong |
| README lists 16 archetypes | 19 archetypes defined | Phase 1 | 3 missing: Neubrutalism, Dark Academia, AI-Native |
| README says Next.js + Astro only | v2.0 adds React/Vite, Tauri, Electron | Phase 8 | Framework support section wrong |
| SKILL-DIRECTORY uses some planned names | Many skills renamed during implementation | Phases 5-9 | ~10 name mismatches |

## Data for SKILL-DIRECTORY.md Rebuild

### Recommended Tier Assignments (from frontmatter)

**Core (23 skills):**
design-dna, design-archetypes, anti-slop-gate, emotional-arc, quality-gate-protocol, compositional-diversity, polish-pass, reference-benchmarking, cinematic-motion, creative-tension, wow-moments, design-system-scaffold, performance-animation, design-brainstorm, creative-direction-format, copy-intelligence, cross-pollination, tailwind-system, responsive-design, accessibility, progress-reporting, error-recovery, live-testing

**Domain (21 skills):**
page-transitions, shape-asset-generation, three-d-webgl-effects, remotion-video, spline-integration, component-marketplace, image-prompt-generation, dark-light-mode, multi-page-architecture, nextjs-patterns, react-vite-patterns, astro-patterns, desktop-patterns, ecommerce-ui, dashboard-patterns, portfolio-patterns, blog-patterns, figma-integration, design-system-export, copy-intelligence*, cross-pollination*

(*Note: copy-intelligence and cross-pollination have `tier: domain` in frontmatter but are listed in some contexts as core. The planner should use the frontmatter value as authoritative.)

**Utility (3 skills):**
form-builder, seo-meta, i18n-rtl

**Legacy (39 skills):**
All skills listed in the "Legacy V6.1.0 Skills" section above.

### Recommended Groupings for Domain Skills

Based on the existing directory structure and skill relationships:

1. **Motion & Animation:** page-transitions
2. **Asset Specialists:** shape-asset-generation, three-d-webgl-effects, remotion-video, spline-integration, component-marketplace, image-prompt-generation
3. **Framework Support:** nextjs-patterns, react-vite-patterns, astro-patterns, desktop-patterns
4. **Design Systems:** dark-light-mode, multi-page-architecture
5. **Industry Verticals:** ecommerce-ui, dashboard-patterns, portfolio-patterns, blog-patterns
6. **Integration:** figma-integration, design-system-export
7. **Content & Strategy:** copy-intelligence, cross-pollination

## Open Questions

1. **How to handle legacy skills in the directory?**
   - What we know: 39 legacy v6.1.0 skills still exist in `skills/` directory. Some are superseded by v2.0 equivalents, some were supposed to be merged/removed but still exist, some are unrewritten standalone skills.
   - What's unclear: Should SKILL-DIRECTORY.md list them all (with LEGACY status), only list the unsuperseded ones, or omit them entirely?
   - Recommendation: List superseded ones in the cull list section. List unsuperseded legacy skills (those without a v2.0 replacement) in their tier sections with status LEGACY. This gives a complete picture. Phase 13 (Legacy Cleanup) will handle removal.

2. **Should copy-intelligence and cross-pollination be core or domain?**
   - What we know: Their frontmatter says `tier: domain` but they are loaded during brainstorm (which runs on every project)
   - What's unclear: Whether the brainstorm usage makes them effectively core
   - Recommendation: Use frontmatter as authoritative. They are domain skills that get loaded when brainstorm runs. The tier system handles this -- domain skills load per project type/phase, which includes brainstorm.

3. **Should the README include a full skill list or just a summary?**
   - What we know: v6.1.0 README listed all 87 skills in categorized tables. SKILL-DIRECTORY.md is the authoritative registry.
   - What's unclear: Whether README should duplicate the full list or just reference SKILL-DIRECTORY.md
   - Recommendation: README should include a compact summary (skill count per tier, key examples) and reference SKILL-DIRECTORY.md for the full inventory. This prevents two documents from drifting.

4. **What is the total "active skill" count for the title line?**
   - What we know: 46 v2.0 skills (including _skill-template). 39 legacy skills. ~5 legacy skills are superseded by v2.0 equivalents.
   - Recommendation: Count v2.0 skills (45, excluding template) + unsuperseded legacy skills (~34) = approximately 79 skills in the filesystem, 45 in v2.0 format. For the README title, use something like "45+ skills (v2.0 format)" since the legacy count will change as Phase 13 cleanup runs.

## Sources

### Primary (HIGH confidence)
- Direct filesystem inspection of `skills/*/SKILL.md` -- all 85 directories enumerated
- Direct filesystem inspection of `agents/`, `agents/pipeline/`, `agents/protocols/`, `agents/specialists/`
- Direct filesystem inspection of `commands/*.md` -- all 8 commands
- `.claude-plugin/plugin.json` -- version 2.0.0-dev
- YAML frontmatter extraction from 46 v2.0 skills (tier, description, version)
- `skills/design-archetypes/SKILL.md` -- 19 archetype headings confirmed
- `SKILL-DIRECTORY.md` -- current stale content read in full
- `README.md` -- current v6.1.0 content read in full
- `v1-MILESTONE-AUDIT.md` -- ISSUE-4 and ISSUE-5 descriptions

### Secondary (MEDIUM confidence)
- Phase assignments inferred from ROADMAP.md plan descriptions and skill creation dates

### Tertiary (LOW confidence)
- None -- all findings are from direct codebase inspection

## Metadata

**Confidence breakdown:**
- Skill inventory: HIGH -- every skill directory was enumerated from filesystem
- Name mismatches: HIGH -- compared directory entries against actual directory names
- Command inventory: HIGH -- all 8 command files read
- Agent inventory: HIGH -- all agent directories and files listed
- Tier assignments: HIGH -- read from YAML frontmatter
- Phase assignments: MEDIUM -- inferred from roadmap and skill creation context

**Research date:** 2026-02-25
**Valid until:** Indefinite (this is an inventory of the current codebase state; validity only changes if skills are added/removed)
