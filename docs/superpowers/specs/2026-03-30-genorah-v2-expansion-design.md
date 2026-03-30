# Genorah v2.0 Expansion — Ruflo Absorption + SEO/GEO + Mobile Pipeline

> **Date:** 2026-03-30
> **Author:** raphj + Claude
> **Status:** Draft — awaiting user approval
> **Scope:** Three additions to Genorah v2.0: ruflo pattern absorption, deep SEO/GEO skills, and full mobile app pipeline suite
> **Depends on:** Genorah v2.0 base (Plans 1-5 complete on genorah-v2 branch)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Ruflo Pattern Absorption](#2-ruflo-pattern-absorption)
3. [SEO/GEO Deep Skills](#3-seogeo-deep-skills)
4. [Mobile App Pipeline Suite](#4-mobile-app-pipeline-suite)
5. [New Files Summary](#5-new-files-summary)
6. [Updated Files Summary](#6-updated-files-summary)

---

## 1. Overview

### Three Additions (all ship in v2.0.0)

| Addition | What It Delivers |
|----------|-----------------|
| **Ruflo Pattern Absorption** | 3 new hooks (PreCompact, SessionEnd, PostToolUse), PII scanning, per-skill resource constraints, Obsidian knowledge graphs |
| **SEO/GEO Deep Skills** | 3 skills (seo-technical, geo-optimization, structured-data) + 1 specialist agent (seo-geo-specialist) |
| **Mobile App Pipeline** | 5 framework skills (Swift, Kotlin, RN, Expo, Flutter), store submission validation, mobile performance suite, mobile specialist agent, DNA mobile extension |

### Impact on Existing v2.0

| Component | Change |
|-----------|--------|
| `plugin.json` | Add 3 new hook events (PreCompact, Stop, PostToolUse) |
| `DESIGN-DNA.md` format | Add mobile extension section |
| `dna-compliance-check.sh` | Add PII scanning patterns |
| Skill frontmatter format | Add optional `constraints` block |
| `pre-tool-use.mjs` | Add resource constraint enforcement |
| `/gen:start-project` | Add mobile framework detection + SEO/GEO discovery questions |
| `/gen:audit` | Add SEO/GEO audit mode + mobile store submission check + mobile performance check |
| Quality gate | Add SEO/GEO penalties to integration quality category |
| Orchestrator | Can spawn seo-geo-specialist and mobile-specialist agents |
| SKILL-DIRECTORY.md | Add all new skills |

---

## 2. Ruflo Pattern Absorption

### 2.1: PreCompact Hook

**File:** `.claude-plugin/hooks/pre-compact.mjs`
**Fires on:** context window compaction events

**What it does:** When Claude's context fills and compaction occurs, injects ~800 tokens of critical project state to survive the compression.

**Reads from .planning/genorah/:**
- `CONTEXT.md` — first 60 lines (DNA anchor, phase, wave, creative notes)
- `DESIGN-DNA.md` — compressed summary (12 color tokens, fonts, compat tier)
- `STATE.md` — current phase/wave/section statuses
- `DESIGN-SYSTEM.md` — component registry summary
- `DECISIONS.md` — last 5 decisions

**Output:** JSON with `additionalContext` (~800 tokens compressed state)

**Why:** Directly prevents context rot during long build sessions. This is the single most impactful ruflo pattern.

### 2.2: Stop/SessionEnd Hook

**File:** `.claude-plugin/hooks/session-end.mjs`
**Fires on:** session end/stop events

**What it does:** Generates session summary and persists state for cross-session continuity.

**Generates:** `.planning/genorah/SESSION-LOG.md`
- What was accomplished this session
- Current state (phase, wave, built/pending)
- Key decisions made
- Open issues / blockers
- Suggested next actions

**Also appends to:** `.planning/genorah/DECISIONS.md` — any decisions from this session

**Integration:** `session-start.mjs` reads SESSION-LOG.md on resume to restore context.

### 2.3: PostToolUse Hook

**File:** `.claude-plugin/hooks/post-tool-use.mjs`
**Fires on:** after Write/Edit/Bash completes

**What it does:** Lightweight metrics tracking.

**Tracks:**
- Files modified (path, timestamp)
- Sections touched
- Build progress (% complete from MASTER-PLAN)

**Writes to:** `.planning/genorah/METRICS.md`
- Session metrics (files changed, sections built)
- Quality feed (pass/fail from DNA compliance)

**Feeds into:** Visual companion build-progress dashboard.

### 2.4: PII Scanning

**File:** Enhanced `.claude-plugin/hooks/dna-compliance-check.sh`

**New grep patterns:**
- Email patterns in source code (not in content/copy): `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`
- API key patterns: `sk_live_`, `sk_test_`, `pk_live_`, `AKIA`, `ghp_`, `gho_`, `glpat-`, `xox[bpars]-`
- Hardcoded passwords: `password\s*[:=]\s*["'][^"']+["']`
- Private tokens: `.env` values leaked into source
- AWS access keys, Stripe keys, GitHub tokens, Slack tokens

**Severity:** BLOCK — commit rejected if PII/secrets detected in staged files.
**Exclusions:** .env files themselves, test fixtures with fake data, documentation examples.

### 2.5: Per-Skill Resource Constraints

**Enhanced skill frontmatter format:**

```yaml
---
name: "skill-name"
constraints:
  allowed_tools: [Read, Write, Edit, Grep, Glob]
  restricted_tools: [Bash]
  max_file_ops: 50
  allowed_paths:
    - "src/components/"
    - "src/app/"
  restricted_paths:
    - ".env*"
    - "node_modules/"
    - ".git/"
  timeout: 300
---
```

**Enforcement:** `pre-tool-use.mjs` reads constraints from the active skill context and blocks operations that violate them. If a builder tries to write to `.env`, the hook blocks it.

**Optional:** Not all skills need constraints. Only add when scope restriction is valuable (builders, polisher, specialists).

### 2.6: Obsidian Knowledge Graphs

**Enhanced Knowledge Base vault structure:**

```
Knowledge/
+-- project-history/
|   +-- project-a.md         <- frontmatter: archetype, industry, score, client, date
|   +-- project-b.md
|   +-- PATTERNS.md           <- auto-generated cross-project patterns
+-- graph/
|   +-- archetype-industry.md <- which archetypes work for which industries
|   +-- font-performance.md   <- which font pairings got highest scores
|   +-- tension-impact.md     <- which creative tensions improved scores most
|   +-- integration-patterns.md <- common integration combos per industry
|   +-- color-mood-map.md     <- palette mood vs client satisfaction correlation
```

**How it works:**
1. After project completes, `/gen:export` reads final quality scores, archetype, industry, decisions
2. Creates/updates project-history note with Dataview frontmatter
3. Regenerates PATTERNS.md by cross-referencing all project notes
4. Updates graph relationship notes

**Dataview queries in PATTERNS.md:**
```
TABLE archetype, industry, score FROM "project-history"
SORT score DESC
```

**After 5-10 projects:** Genorah can recommend archetypes and design patterns based on empirical performance data from past projects.

### 2.7: Plugin.json Hook Updates

Add to `.claude-plugin/plugin.json`:

```json
{
  "PreCompact": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/pre-compact.mjs\""
        }
      ]
    }
  ],
  "Stop": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/session-end.mjs\""
        }
      ]
    }
  ],
  "PostToolUse": [
    {
      "matcher": "Write|Edit|Bash",
      "hooks": [
        {
          "type": "command",
          "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/post-tool-use.mjs\""
        }
      ]
    }
  ]
}
```

---

## 3. SEO/GEO Deep Skills

### 3.1: `skills/seo-technical/SKILL.md` (~600 lines)

**Scope:** All technical SEO infrastructure builders must implement.

**Layer 1: Decision Guidance**
- SEO checklist decision tree (which checks apply to which page type)
- Framework-specific patterns (Next.js sitemap.ts/robots.ts vs Astro @astrojs/sitemap)

**Layer 2: Technical Patterns**

| Area | Content |
|------|---------|
| Sitemap Generation | Next.js `sitemap.ts`, Astro `@astrojs/sitemap`, image/video/news sitemaps, sitemap index for 50K+ URLs |
| robots.txt | 3-tier strategy: search bots (allow), AI search bots (allow for GEO), AI training bots (block). Full bot table |
| Canonical URLs | Self-referencing, cross-domain, pagination, canonical+hreflang agreement |
| Hreflang | Bidirectional, ISO codes, x-default, XML sitemap approach |
| Meta Tags | Title (50-60 chars), description (140-160 chars), meta robots directives, Next.js Metadata API |
| Open Graph | Required tags, 1200x630 image, dynamic OG with next/og |
| Twitter Cards | summary_large_image, fallback to OG |
| Core Web Vitals | LCP<=2.5s, INP<=200ms, CLS<=0.1, mobile-first indexing |
| Image SEO | Alt text, filenames, AVIF>WebP>JPEG, lazy/eager loading |
| Internal Linking | 3-click depth, pillar-cluster, 2-5 links per 1000 words |
| URL Structure | Lowercase, hyphenated, descriptive, flat hierarchy |

**Submission Workflows:**
- Google Search Console: DNS verification, sitemap submission, URL Inspection API (2000/day)
- Bing Webmaster Tools: import from GSC, IndexNow integration
- IndexNow: API key file at root, POST batch URLs (up to 10K), CI/CD hook pattern
- Yandex, Naver: IndexNow shared submissions
- Baidu: Direct URL push API (requires Chinese entity)

**Pipeline Integration:**
Planner auto-generates SEO block in each section PLAN.md:
```yaml
seo:
  page_title: "..."
  meta_description: "..."
  canonical: self
  og_image: dynamic
  heading_hierarchy: [h1, h2, h2, h3, h2]
  structured_data: [WebPage, BreadcrumbList, FAQPage]
  images: alt_text_required
```

**Layer 3:** Maps to quality gate integration quality category. Framework-specific patterns.
**Layer 4:** Anti-patterns (missing sitemap, blocking CSS/JS in robots.txt, skipped heading levels, no canonical)

### 3.2: `skills/geo-optimization/SKILL.md` (~500 lines)

**Scope:** AI search optimization patterns.

**Layer 1:** GEO decision tree (which AI engines to target, when GEO matters)

**Layer 2: GEO Patterns**

| Area | Content |
|------|---------|
| llms.txt | Specification format (H1, blockquote, H2 sections, link lists). Example per site type. Placed at root |
| llms-full.txt | Full content in single markdown. Auto-generation from sitemap |
| AI Crawler Management | 3-tier robots.txt. Bot table: OpenAI (GPTBot/OAI-SearchBot/ChatGPT-User), Anthropic (ClaudeBot/Claude-SearchBot/Claude-User), Perplexity, Google-Extended, Meta-ExternalAgent, Applebot |
| BLUF Content | Answer in first 40-60 words of every H2. Highest-impact GEO tactic |
| Question-as-Heading | H2s matching common queries. AI engines match queries to headings |
| Fact Density | Statistics every 150-200 words. Named citations = 30-40% higher AI visibility |
| Quotable Statements | Self-contained, factually precise, stand alone as citations |
| E-E-A-T | Experience, Expertise, Authoritativeness, Trustworthiness signals |
| Entity Disambiguation | Organization+Person schema with sameAs to Wikipedia/Wikidata/LinkedIn |
| Platform-Specific | ChatGPT (encyclopedic), Perplexity (recency), Google AI Overviews (top-ranking+E-E-A-T), Gemini (E-E-A-T) |
| Speakable Schema | Voice assistant content marking |
| GEO Monitoring | Tools: Profound, Otterly AI, SE Ranking, Ahrefs Brand Radar |

**Pipeline Integration:**
- Discovery auto-ask: "AI search visibility needed?" and "Target markets?"
- Content specialist uses BLUF + question-as-heading + fact density
- Builder generates llms.txt during build

**Layer 3:** Maps to content quality category in quality gate. Platform-specific adaptations.
**Layer 4:** Anti-patterns (ignoring AI crawlers, no llms.txt, shallow content without facts)

### 3.3: `skills/structured-data/SKILL.md` (~500 lines)

**Scope:** JSON-LD schema implementation for SEO and GEO.

**Layer 2: Schema Patterns**

| Area | Content |
|------|---------|
| @graph Pattern | Combining schemas per page with @id entity linking |
| Schema Decision Tree | Homepage (Organization+WebSite), Blog (Article+BreadcrumbList+FAQPage), Product (Product+Offer+AggregateRating), Service (Service+Organization), Contact (LocalBusiness), Event (Event) |
| FAQPage | Highest AI citation rate (3.2x in AI Overviews). Template |
| Article/BlogPosting | headline, author, datePublished, dateModified, image, publisher |
| Product | name, description, offers, aggregateRating, brand, sku |
| LocalBusiness | address, geo, openingHours, telephone |
| BreadcrumbList | Required on every non-homepage |
| Event | startDate, endDate, location, offers |
| VideoObject | For video content pages |
| Speakable | Voice assistant marking |
| Validation | Rich Results Test, Schema.org validator |

**Anti-patterns with penalties:**

| Anti-Pattern | Penalty |
|-------------|---------|
| Page without structured data | -3 |
| Missing BreadcrumbList on non-homepage | -2 |
| FAQ content without FAQPage schema | -3 |
| Product page without Product schema | -3 |
| Article without author/datePublished | -2 |
| Hardcoded JSON-LD (not data-driven) | -2 |
| Schema validation errors | -3 |
| Missing Organization on homepage | -2 |

### 3.4: SEO/GEO Specialist Agent

**File:** `agents/specialists/seo-geo-specialist.md`

```yaml
name: seo-geo-specialist
description: "Validates and optimizes search engine and AI search visibility. Build mode: per-section validation. Audit mode: full SEO/GEO audit with submission readiness."
tools: Read, Write, Edit, Bash, Grep, Glob
model: inherit
maxTurns: 40
```

**Build Mode** (per-section, spawned by orchestrator):
- Heading hierarchy validation (one H1, no skips)
- Meta tags present and within limits
- Structured data correct type, no validation errors
- Images have alt text
- Canonical URL present
- Internal linking density
- Reports in SUMMARY.md

**Audit Mode** (spawned during /gen:audit):
- Sitemap validation (all pages present, format correct)
- robots.txt validation (3-tier AI strategy)
- llms.txt generation/validation
- Structured data audit across all pages
- Core Web Vitals (Lighthouse)
- IndexNow key verification
- GSC/Bing submission readiness
- GEO content audit (BLUF, fact density, question headings)
- Produces `audit/SEO-GEO-REPORT.md`

---

## 4. Mobile App Pipeline Suite

### 4.1: DNA Mobile Extension

Added to `DESIGN-DNA.md` (single file, new section):

```yaml
mobile:
  primary_framework: react-native
  secondary_frameworks: []

  ios:
    system_font: SF Pro
    min_touch_target: 44pt
    safe_area: true
    navigation: tab-bar
    haptics: true
    dynamic_type: true

  android:
    system_font: Roboto
    min_touch_target: 48dp
    edge_to_edge: true
    navigation: bottom-nav
    material_you: true
    predictive_back: true

  cross_platform:
    font_strategy: custom
    icon_set: sf-symbols+material
    color_adaptation: material-you

  spacing_scale: [4, 8, 12, 16, 20, 24, 32, 48]
  radius_scale: [4, 8, 12, 16, 24]
  elevation_scale: [0, 1, 2, 4, 8, 16]

  motion:
    spring_config: { damping: 15, stiffness: 150 }
    gesture_threshold: 20
    transition_duration: 250
```

Web DNA tokens (colors, fonts, spacing) translate to mobile. Platform-specific tokens added, not overridden.

### 4.2: Framework Skills (5)

All use 4-layer format:

**`skills/mobile-swift/SKILL.md`** (~500 lines)
SwiftUI patterns, DNA token translation (Color assets, fonts, spacing constants), Dynamic Type, SF Symbols, haptics, MVVM+Combine/async-await, Xcode config, App Store specifics.

**`skills/mobile-kotlin/SKILL.md`** (~500 lines)
Jetpack Compose patterns, Material 3 theming from DNA, Material You dynamic colors, predictive back, MVI/MVVM+Flow+Hilt, Gradle config, Play Store specifics.

**`skills/mobile-react-native/SKILL.md`** (~500 lines)
Functional components, StyleSheet/NativeWind, React Navigation, Zustand+TanStack Query, New Architecture (Fabric+TurboModules), Metro/Hermes, FlatList/FlashList performance.

**`skills/mobile-expo/SKILL.md`** (~450 lines)
Managed vs bare, Expo Router (file-based), expo-font/expo-splash-screen, EAS Build profiles, EAS Submit (auto App Store + Play Store), app.config.ts.

**`skills/mobile-flutter/SKILL.md`** (~500 lines)
StatelessWidget/StatefulWidget, ThemeData from DNA, Material 3 + Cupertino adaptive, Riverpod+go_router, pubspec.yaml, platform channels.

### 4.3: Store Submission Validation

**File:** `skills/store-submission/SKILL.md` (~700 lines)

**Pre-submission gate producing pass/fail report:**

**App Store (iOS):**
- Assets: icon 1024x1024 no alpha, @1x/@2x/@3x variants, splash, screenshots (6.7"/6.5"/5.5"/12.9" iPad)
- Info.plist: privacy descriptions for all used APIs, required background modes, ATS
- App Review: no placeholder content, no broken links, no private APIs, minimum functionality, test credentials
- Privacy: ATT if IDFA, nutrition labels match data collection, privacy policy URL valid
- Metadata: name (30), subtitle (30), keywords (100), description (4000), category, age rating
- Localization: strings localized, screenshots per locale, metadata per locale
- Technical: deployment target, capabilities, entitlements

**Play Store (Android):**
- Assets: icon 512x512, feature graphic 1024x500, screenshots (min 2, max 8), promo video
- Data Safety: types collected/shared, encryption, deletion mechanism, privacy policy URL
- Store Listing: title (30), short description (80), full description (4000), category, content rating (IARC)
- APK/AAB: target SDK (API 34+), 64-bit, AAB format, R8 enabled, app signing
- Permissions: only declared if used, runtime requests, QUERY_ALL_PACKAGES justification
- Content Policy: no deceptive behavior, no impersonation, no placeholder, ads compliance
- Technical: predictive back, edge-to-edge, photo picker, foreground service types

**Cross-Platform Checks:**
- Platform-specific assets for both iOS and Android
- Privacy descriptions match between Info.plist and data safety
- Deep linking configured for both universal links and app links
- Push notification certs for both platforms
- No debug code in production
- Size budgets (iOS < 200MB OTA, Android < 150MB AAB)

**Output:** `audit/STORE-SUBMISSION-REPORT.md` with pass/fail, fix instructions, "Ready/Not Ready" verdict.

### 4.4: Mobile Performance Suite

**File:** `skills/mobile-performance/SKILL.md` (~600 lines)

**Build-Time Analysis:**
- Bundle size (iOS < 200MB, Android < 150MB, RN JS bundle < 5MB)
- Asset optimization (compressed, unused removed)
- Dead code detection (tree-shaking, unused imports)
- Dependency audit (duplicates, heavy unused deps)

**Code Pattern Enforcement (per framework):**

| Framework | Key Anti-Patterns Detected |
|-----------|---------------------------|
| Swift | Large views (>50 lines), sync main thread work, missing lazy loading |
| Kotlin | Recomposition traps, blocking main thread, missing LazyColumn |
| React Native | Inline styles, ScrollView for lists, unnecessary re-renders, bridge bottlenecks |
| Expo | Same as RN + bare modules in managed, oversized OTA |
| Flutter | Missing const, setState on large widgets, missing ListView.builder |

**Runtime Profiling Guidance:**
- iOS: Instruments config templates, budgets (launch < 400ms, 60fps, < 100MB idle)
- Android: Profiler config, budgets (cold start < 500ms, 90fps, < 100MB RAM)
- RN: Flipper setup, budgets (JS thread 60fps, < 16ms frame)
- Flutter: DevTools setup, budgets (60fps, < 16ms build)

**Automated Checks in /gen:audit:**
- Bundle size measurement (framework CLI)
- Asset size audit (filesystem scan)
- Anti-pattern grep (static analysis per framework)
- Dependency audit (npm/pod/gradle)

### 4.5: Mobile Specialist Agent

**File:** `agents/specialists/mobile-specialist.md`

```yaml
name: mobile-specialist
description: "Generates mobile app screens with DNA-styled components, platform conventions, and store-ready assets. Handles Swift, Kotlin, React Native, Expo, and Flutter."
tools: Read, Write, Edit, Bash, Grep, Glob
model: inherit
maxTurns: 50
```

**Responsibilities:**
- DNA token translation to platform design system (Color assets, ThemeData, StyleSheet)
- Screen component generation following platform conventions
- Navigation patterns per platform
- Store submission checklist validation during build
- Performance anti-pattern checks
- Works alongside web builders (parallel)

**Spawned when:** Project framework includes any mobile target.

### 4.6: Discovery Integration

During `/gen:start-project`, new auto-detection:

| Detection | Auto-Ask |
|-----------|----------|
| Mentions "app" or "mobile" | "Which platforms? iOS, Android, or both?" |
| iOS selected | "Swift/SwiftUI native or cross-platform?" |
| Android selected | "Kotlin/Compose native or cross-platform?" |
| Cross-platform selected | "React Native (bare), Expo (managed), or Flutter?" |
| Multiple frameworks | "Primary framework?" |
| Always for mobile | "Target store submission? (App Store / Play Store / Both)" |

---

## 5. New Files Summary

### Hooks (3)
- `.claude-plugin/hooks/pre-compact.mjs`
- `.claude-plugin/hooks/session-end.mjs`
- `.claude-plugin/hooks/post-tool-use.mjs`

### Skills (12)
- `skills/seo-technical/SKILL.md`
- `skills/geo-optimization/SKILL.md`
- `skills/structured-data/SKILL.md`
- `skills/mobile-swift/SKILL.md`
- `skills/mobile-kotlin/SKILL.md`
- `skills/mobile-react-native/SKILL.md`
- `skills/mobile-expo/SKILL.md`
- `skills/mobile-flutter/SKILL.md`
- `skills/store-submission/SKILL.md`
- `skills/mobile-performance/SKILL.md`
- Enhanced `skills/obsidian-integration/SKILL.md` (add knowledge graph section to existing skill)

### Agents (2)
- `agents/specialists/seo-geo-specialist.md`
- `agents/specialists/mobile-specialist.md`

---

## 6. Updated Files Summary

| File | Change |
|------|--------|
| `.claude-plugin/plugin.json` | Add PreCompact, Stop, PostToolUse hook events |
| `.claude-plugin/hooks/dna-compliance-check.sh` | Add PII scanning patterns |
| `.claude-plugin/hooks/pre-tool-use.mjs` | Add resource constraint enforcement |
| `commands/start-project.md` | Add mobile detection + SEO/GEO discovery questions |
| `commands/audit.md` | Add SEO/GEO audit + store submission check + mobile performance |
| `agents/pipeline/orchestrator.md` | Can spawn seo-geo-specialist and mobile-specialist |
| `skills/SKILL-DIRECTORY.md` | Add all 12 new skills + 2 new agents |
| `skills/_skill-template/SKILL.md` | Document optional constraints block in frontmatter |
| `CLAUDE.md` | Update counts, document new capabilities |
| `README.md` | Update counts |
| `.claude-plugin/marketplace.json` | Update counts, add keywords |
| Knowledge Base vault structure | Add graph/ directory with relationship notes |
