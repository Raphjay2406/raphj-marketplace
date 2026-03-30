# Plan 6: Expansion — Ruflo Hooks + SEO/GEO + Mobile Pipeline

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 3 ruflo-inspired hooks, PII scanning, per-skill resource constraints, Obsidian knowledge graphs, 3 SEO/GEO skills + specialist agent, 5 mobile framework skills + store submission + mobile performance + specialist agent + DNA mobile extension to Genorah v2.0.

**Architecture:** All additions are markdown skill files, agent definitions, or Node.js hook scripts (.mjs). Follows existing Genorah patterns — 4-layer skill format, YAML frontmatter agents, JSON stdin/stdout hooks. No application code or test suite.

**Tech Stack:** Markdown, Node.js ESM (.mjs for hooks), Bash

**Spec:** `docs/superpowers/specs/2026-03-30-genorah-v2-expansion-design.md`

**Depends on:** Plans 1-5 complete on `genorah-v2` branch

---

## File Map

### Hooks (3 new + 2 modified)
- Create: `.claude-plugin/hooks/pre-compact.mjs`
- Create: `.claude-plugin/hooks/session-end.mjs`
- Create: `.claude-plugin/hooks/post-tool-use.mjs`
- Modify: `.claude-plugin/hooks/dna-compliance-check.sh` (add PII scanning)
- Modify: `.claude-plugin/hooks/pre-tool-use.mjs` (add resource constraint enforcement)
- Modify: `.claude-plugin/plugin.json` (add 3 hook events)

### SEO/GEO Skills (3 new) + Agent (1 new)
- Create: `skills/seo-technical/SKILL.md`
- Create: `skills/geo-optimization/SKILL.md`
- Create: `skills/structured-data-v2/SKILL.md` (v2 to avoid conflict with existing structured-data skill)
- Create: `agents/specialists/seo-geo-specialist.md`

### Mobile Skills (7 new) + Agent (1 new)
- Create: `skills/mobile-swift/SKILL.md`
- Create: `skills/mobile-kotlin/SKILL.md`
- Create: `skills/mobile-react-native/SKILL.md`
- Create: `skills/mobile-expo/SKILL.md`
- Create: `skills/mobile-flutter/SKILL.md`
- Create: `skills/store-submission/SKILL.md`
- Create: `skills/mobile-performance/SKILL.md`
- Create: `agents/specialists/mobile-specialist.md`

### Updated Files
- Modify: `commands/start-project.md` (add mobile + SEO/GEO discovery)
- Modify: `commands/audit.md` (add SEO/GEO + store submission + mobile perf audit modes)
- Modify: `agents/pipeline/orchestrator.md` (can spawn seo-geo-specialist + mobile-specialist)
- Modify: `skills/obsidian-integration/SKILL.md` (add knowledge graph section)
- Modify: `skills/_skill-template/SKILL.md` (document constraints block)
- Modify: `skills/SKILL-DIRECTORY.md` (add all new skills)
- Modify: `CLAUDE.md` (update counts + document new capabilities)
- Modify: `README.md` (update counts)
- Modify: `.claude-plugin/marketplace.json` (update counts + keywords)

---

## Group A: Ruflo Hooks + Infrastructure (Tasks 1-6)

### Task 1: Update plugin.json with 3 new hook events

**Files:**
- Modify: `.claude-plugin/plugin.json`

- [ ] **Step 1: Read current plugin.json**

Read the file to see current hook configuration.

- [ ] **Step 2: Add PreCompact, Stop, and PostToolUse hook events**

Add these 3 new entries to the `hooks` object in plugin.json, alongside the existing SessionStart, PreToolUse, and UserPromptSubmit entries:

```json
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
```

- [ ] **Step 3: Validate JSON**
```bash
node -e "const p=JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8'));console.log('Hooks:',Object.keys(p.hooks).join(', '))"
```
Expected: `Hooks: SessionStart, PreToolUse, UserPromptSubmit, PreCompact, Stop, PostToolUse`

- [ ] **Step 4: Commit**
```bash
git add .claude-plugin/plugin.json && git commit -m "feat: add PreCompact, Stop, PostToolUse hook events to plugin.json"
```

---

### Task 2: Create pre-compact.mjs hook

**Files:**
- Create: `.claude-plugin/hooks/pre-compact.mjs`

- [ ] **Step 1: Write the PreCompact hook**

Node.js ESM. Reads JSON from stdin (hook protocol). Fires when context window fills and compaction occurs.

Reads from `.planning/genorah/` in cwd:
- `CONTEXT.md` — first 60 lines (DNA anchor, phase, wave, creative notes)
- `DESIGN-DNA.md` — extract compressed summary: 12 color token names+values, display/body/mono fonts, compat tier, signature element (target ~200 tokens)
- `STATE.md` — current phase, wave, section statuses (first 30 lines)
- `DESIGN-SYSTEM.md` — component registry summary (first 20 lines)
- `DECISIONS.md` — last 5 entries (grep last 5 table rows)

Combine into ~800 token `additionalContext` string with clear section headers:
```
## Genorah Context (PreCompact Injection)
### DNA Anchor
[compressed DNA]
### Build State
[phase, wave, statuses]
### Component Registry
[registered variants summary]
### Recent Decisions
[last 5]
```

If no `.planning/genorah/` directory exists, output `{}`.
Handle all errors gracefully.

- [ ] **Step 2: Test**
```bash
echo '{}' | node .claude-plugin/hooks/pre-compact.mjs
```
Expected: JSON output (empty `{}` or with context if project exists)

- [ ] **Step 3: Commit**
```bash
git add .claude-plugin/hooks/pre-compact.mjs && git commit -m "feat: add pre-compact hook for context preservation during compaction"
```

---

### Task 3: Create session-end.mjs hook

**Files:**
- Create: `.claude-plugin/hooks/session-end.mjs`

- [ ] **Step 1: Write the SessionEnd/Stop hook**

Node.js ESM. Fires on session end.

If `.planning/genorah/` exists:
1. Read `STATE.md` for current phase/wave
2. Read `CONTEXT.md` for recent state
3. Read `DECISIONS.md` for decisions made
4. Generate `SESSION-LOG.md` in `.planning/genorah/`:

```markdown
# Session Log — [ISO date]

## Accomplished
- [inferred from STATE.md changes, or "Session state captured"]

## Current State
- Phase: [from STATE.md]
- Wave: [from STATE.md]

## Decisions Made
[last 3-5 from DECISIONS.md]

## Next Actions
[inferred from STATE.md — what's pending]
```

5. Output `{}` (no additionalContext needed for Stop hook)

If no project directory: output `{}` silently.

- [ ] **Step 2: Test**
```bash
echo '{}' | node .claude-plugin/hooks/session-end.mjs
```
Expected: `{}` (no project directory)

- [ ] **Step 3: Commit**
```bash
git add .claude-plugin/hooks/session-end.mjs && git commit -m "feat: add session-end hook for session summary and state persistence"
```

---

### Task 4: Create post-tool-use.mjs hook

**Files:**
- Create: `.claude-plugin/hooks/post-tool-use.mjs`

- [ ] **Step 1: Write the PostToolUse hook**

Node.js ESM. Fires after Write/Edit/Bash completes.

Reads JSON from stdin: `{tool_name, tool_input, tool_output, session_id}`

If `.planning/genorah/` exists:
1. Extract file path from tool_input (for Write/Edit) or command (for Bash)
2. Append to `.planning/genorah/METRICS.md`:

```markdown
| [ISO timestamp] | [tool_name] | [file path or command summary] | [success/fail] |
```

Create METRICS.md with header if it doesn't exist:
```markdown
# Build Metrics

| Timestamp | Tool | Target | Status |
|-----------|------|--------|--------|
```

3. Track section progress: if file path matches `sections/*/`, increment section file count
4. Output `{}` (no additionalContext needed)

Keep it lightweight — this fires on every tool use, so minimize I/O.

- [ ] **Step 2: Test**
```bash
echo '{"tool_name":"Write","tool_input":{"file_path":"src/app/page.tsx"}}' | node .claude-plugin/hooks/post-tool-use.mjs
```
Expected: `{}`

- [ ] **Step 3: Commit**
```bash
git add .claude-plugin/hooks/post-tool-use.mjs && git commit -m "feat: add post-tool-use hook for build metrics tracking"
```

---

### Task 5: Add PII scanning to dna-compliance-check.sh

**Files:**
- Modify: `.claude-plugin/hooks/dna-compliance-check.sh`

- [ ] **Step 1: Read current file, find the violation reporting section**

- [ ] **Step 2: Add PII scanning patterns before the reporting section**

New check blocks using the existing `check_pattern` function:

```bash
# --- NEW: PII / Secret Detection (BLOCK severity) ---
check_pattern 'sk_live_[a-zA-Z0-9]' "Stripe LIVE secret key detected in source code"
check_pattern 'sk_test_[a-zA-Z0-9]' "Stripe TEST secret key detected — use env var STRIPE_SECRET_KEY"
check_pattern 'pk_live_[a-zA-Z0-9]' "Stripe live publishable key hardcoded — use NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY env var"
check_pattern 'AKIA[0-9A-Z]\{16\}' "AWS access key detected in source code"
check_pattern 'ghp_[a-zA-Z0-9]\{36\}' "GitHub personal access token detected"
check_pattern 'gho_[a-zA-Z0-9]\{36\}' "GitHub OAuth token detected"
check_pattern 'xox[bpars]-[a-zA-Z0-9]' "Slack token detected in source code"
check_pattern 'glpat-[a-zA-Z0-9_-]' "GitLab personal access token detected"
check_pattern 'password\s*[:=]\s*["\x27][^"\x27]\{4,\}' "Hardcoded password detected"
```

Also add an exclusion at the top of the staged files filter to skip test fixtures:
```bash
STAGED_FILES=$(echo "$STAGED_FILES" | grep -v '__fixtures__\|__mocks__\|\.test\.\|\.spec\.\|\.example' || true)
```

- [ ] **Step 3: Commit**
```bash
git add .claude-plugin/hooks/dna-compliance-check.sh && git commit -m "feat: add PII/secret scanning to DNA compliance hook"
```

---

### Task 6: Add resource constraints to pre-tool-use.mjs + update skill template + enhance obsidian-integration

**Files:**
- Modify: `.claude-plugin/hooks/pre-tool-use.mjs`
- Modify: `skills/_skill-template/SKILL.md`
- Modify: `skills/obsidian-integration/SKILL.md`

- [ ] **Step 1: Read pre-tool-use.mjs, add constraint enforcement**

After the skill injection logic, add a new section that:
1. Reads constraints from matched skill frontmatter (if present)
2. For Write/Edit: checks `file_path` against `allowed_paths` and `restricted_paths`
3. For Bash: checks if `Bash` is in `restricted_tools`
4. If violation: set `decision: "block"` and `reason` in the response JSON

The constraint block in frontmatter looks like:
```yaml
constraints:
  allowed_tools: [Read, Write, Edit, Grep, Glob]
  restricted_tools: [Bash]
  allowed_paths:
    - "src/components/"
    - "src/app/"
  restricted_paths:
    - ".env*"
    - "node_modules/"
    - ".git/"
```

Parse from the frontmatter YAML. If no constraints block, no enforcement.

- [ ] **Step 2: Update skill template with constraints documentation**

Read `skills/_skill-template/SKILL.md` and add an "Optional: Resource Constraints" section documenting the constraints frontmatter block with all available fields.

- [ ] **Step 3: Add knowledge graph section to obsidian-integration skill**

Read `skills/obsidian-integration/SKILL.md` and add a "## Cross-Project Knowledge Graphs" section covering:
- `project-history/` directory with per-project notes (frontmatter: archetype, industry, score, client, date)
- `PATTERNS.md` auto-generated from cross-referencing all projects
- `graph/` directory with relationship notes (archetype-industry, font-performance, tension-impact, integration-patterns, color-mood-map)
- Dataview queries for pattern discovery
- How `/gen:export` populates these after project completion

- [ ] **Step 4: Commit**
```bash
git add .claude-plugin/hooks/pre-tool-use.mjs skills/_skill-template/SKILL.md skills/obsidian-integration/SKILL.md && git commit -m "feat: add resource constraints, update skill template, enhance obsidian knowledge graphs"
```

---

## Group B: SEO/GEO Skills + Agent (Tasks 7-10)

### Task 7: Create seo-technical skill

**Files:**
- Create: `skills/seo-technical/SKILL.md`

- [ ] **Step 1: Write the full 4-layer SEO technical skill**

```yaml
---
name: "seo-technical"
description: "Technical SEO infrastructure: sitemaps, robots.txt (3-tier AI strategy), canonicals, hreflang, meta tags, Open Graph, Core Web Vitals, image SEO, internal linking, and search console submission workflows."
tier: "core"
triggers: "seo, sitemap, robots.txt, meta tags, canonical, hreflang, open graph, search console, indexnow"
version: "2.0.0"
---
```

~600 lines covering (from spec Section 3.1):
- Sitemap generation (Next.js sitemap.ts, Astro @astrojs/sitemap, image/video/news sitemaps, 50K/50MB limits)
- robots.txt with 3-tier AI crawler strategy (search bots allow, AI search bots allow, AI training bots block). Full bot table for OpenAI/Anthropic/Perplexity/Google/Meta/Apple
- Canonical URLs (self-referencing, cross-domain, pagination, hreflang agreement)
- Hreflang (bidirectional, ISO codes, x-default, XML sitemap approach)
- Meta tags (title 50-60 chars, description 140-160, meta robots directives, Next.js Metadata API)
- Open Graph (required tags, 1200x630 image, dynamic OG with next/og)
- Twitter Cards (summary_large_image, OG fallback)
- Core Web Vitals (LCP<=2.5s, INP<=200ms, CLS<=0.1, 10-15% ranking weight)
- Image SEO (alt text, AVIF>WebP>JPEG, lazy/eager, srcset+sizes)
- Internal linking (3-click depth, pillar-cluster, 2-5 per 1000 words)
- URL structure (lowercase, hyphenated, flat)
- Submission workflows: GSC (DNS verify, sitemap submit, URL Inspection API 2000/day), Bing (import from GSC, IndexNow), IndexNow (API key file, POST batch 10K URLs, CI/CD hook), Yandex, Naver, Baidu
- Pipeline integration: planner generates SEO block in PLAN.md

Layer 3: quality gate mapping, framework patterns
Layer 4: anti-patterns (missing sitemap, blocked CSS/JS, skipped headings, no canonical)

- [ ] **Step 2: Verify**
```bash
head -7 skills/seo-technical/SKILL.md && echo "---" && wc -l skills/seo-technical/SKILL.md
```
Expected: YAML frontmatter + 500+ lines

- [ ] **Step 3: Commit**
```bash
mkdir -p skills/seo-technical && git add skills/seo-technical/ && git commit -m "feat: add seo-technical skill (sitemaps, robots.txt, meta, submissions)"
```

---

### Task 8: Create geo-optimization skill

**Files:**
- Create: `skills/geo-optimization/SKILL.md`

- [ ] **Step 1: Write the full 4-layer GEO skill**

```yaml
---
name: "geo-optimization"
description: "Generative Engine Optimization for AI search visibility. llms.txt, AI crawler management, BLUF content patterns, citation optimization, E-E-A-T signals, and platform-specific strategies."
tier: "core"
triggers: "geo, ai search, llms.txt, ai visibility, citation, perplexity, chatgpt search, ai overviews"
version: "2.0.0"
---
```

~500 lines covering (from spec Section 3.2):
- llms.txt specification (H1 required, blockquote, H2 sections, link lists, llms-full.txt companion)
- AI crawler management (3-tier robots.txt, bot table with training vs search vs user-action bots)
- BLUF content pattern (answer in first 40-60 words, highest-impact GEO tactic)
- Question-as-heading (H2s matching queries)
- Fact density (statistics every 150-200 words, 30-40% higher visibility)
- Quotable statements (self-contained, precise, stand alone as citations)
- E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness)
- Entity disambiguation (Organization+Person schema with sameAs)
- Platform-specific optimization (ChatGPT=encyclopedic, Perplexity=recency, Google AI Overviews=E-E-A-T, Gemini=E-E-A-T)
- Speakable schema (voice assistants)
- GEO monitoring tools (Profound, Otterly, SE Ranking, Ahrefs Brand Radar)
- Pipeline: discovery auto-ask, content specialist patterns, builder generates llms.txt

- [ ] **Step 2: Commit**
```bash
mkdir -p skills/geo-optimization && git add skills/geo-optimization/ && git commit -m "feat: add geo-optimization skill (llms.txt, AI crawlers, citation patterns)"
```

---

### Task 9: Create structured-data-v2 skill

**Files:**
- Create: `skills/structured-data-v2/SKILL.md`

- [ ] **Step 1: Write the full 4-layer structured data skill**

NOTE: The existing `skills/structured-data/SKILL.md` covers basic schema patterns. This v2 skill replaces/supersedes it with comprehensive JSON-LD patterns for both SEO and GEO. Read the existing skill first to understand what's there, then create the v2 with expanded content.

```yaml
---
name: "structured-data-v2"
description: "Comprehensive JSON-LD structured data for SEO and GEO. @graph pattern, schema decision tree per page type, FAQPage for AI citation, and validation workflows."
tier: "core"
triggers: "json-ld, schema.org, structured data, rich results, faq schema, breadcrumb, product schema"
version: "2.0.0"
---
```

~500 lines covering (from spec Section 3.3):
- @graph pattern (combining schemas per page with @id entity linking, full example)
- Schema decision tree per page type: Homepage (Organization+WebSite), Blog (Article+BreadcrumbList+FAQPage), Product (Product+Offer+AggregateRating), Service, Contact (LocalBusiness), Event
- FAQPage (highest AI citation rate 3.2x, template)
- Article/BlogPosting (headline, author, datePublished, dateModified, publisher)
- Product (name, description, offers, aggregateRating, brand, sku)
- LocalBusiness (address, geo, openingHours)
- BreadcrumbList (required on every non-homepage)
- Event (startDate, endDate, location, offers)
- VideoObject (video content pages)
- Speakable (voice assistant marking)
- Validation (Rich Results Test, Schema.org validator)

Anti-patterns with penalties (8 items from spec):
- No structured data (-3), missing breadcrumb (-2), FAQ without schema (-3), product without schema (-3), article without author (-2), hardcoded JSON-LD (-2), validation errors (-3), missing Organization on homepage (-2)

- [ ] **Step 2: Commit**
```bash
mkdir -p skills/structured-data-v2 && git add skills/structured-data-v2/ && git commit -m "feat: add structured-data-v2 skill (@graph, FAQPage, schema decision tree)"
```

---

### Task 10: Create seo-geo-specialist agent

**Files:**
- Create: `agents/specialists/seo-geo-specialist.md`

- [ ] **Step 1: Write the specialist agent**

```yaml
name: seo-geo-specialist
description: "Validates and optimizes search engine and AI search visibility. Build mode: per-section SEO validation. Audit mode: full SEO/GEO audit with submission readiness check."
tools: Read, Write, Edit, Bash, Grep, Glob
model: inherit
maxTurns: 40
```

Body sections:
- **Role:** Search optimization specialist with two operational modes
- **Build Mode** (spawned per-section): heading hierarchy validation (one H1, no skips), meta tags present + within limits, structured data correct type + no errors, images have alt text, canonical URL present, internal linking density. Reports in SUMMARY.md.
- **Audit Mode** (spawned during /gen:audit): sitemap validation, robots.txt 3-tier validation, llms.txt generation/validation, structured data audit all pages, Core Web Vitals (Lighthouse), IndexNow key verification, GSC/Bing submission readiness, GEO content audit (BLUF, fact density, question headings). Produces `audit/SEO-GEO-REPORT.md`.
- **Input Contract:** Reads DESIGN-DNA.md (for site URL, domain), section code (build mode), all pages (audit mode), seo-technical + geo-optimization + structured-data-v2 skills.
- **Output Contract:** SUMMARY.md annotations (build mode), audit/SEO-GEO-REPORT.md (audit mode)

- [ ] **Step 2: Commit**
```bash
git add agents/specialists/seo-geo-specialist.md && git commit -m "feat: add seo-geo-specialist agent (build + audit modes)"
```

---

## Group C: Mobile Pipeline (Tasks 11-19)

### Task 11: Create mobile-swift skill

**Files:**
- Create: `skills/mobile-swift/SKILL.md`

- [ ] **Step 1: Write the full 4-layer Swift/SwiftUI skill**

```yaml
---
name: "mobile-swift"
description: "Swift/SwiftUI native iOS development patterns. DNA token translation, Dynamic Type, SF Symbols, haptics, MVVM architecture, Xcode configuration, and App Store requirements."
tier: "domain"
triggers: "swift, swiftui, ios native, xcode, app store, apple"
version: "2.0.0"
---
```

~500 lines:
- L1: When to use Swift vs cross-platform decision tree
- L2: SwiftUI component patterns (Views, ViewModifiers, @State/@Binding/@ObservedObject/@Observable, NavigationStack), DNA token translation (Color assets from DNA hex, custom fonts via Info.plist, spacing constants, shadow definitions), platform features (Dynamic Type with @ScaledMetric, SF Symbols, UIImpactFeedbackGenerator haptics, WidgetKit, Live Activities), architecture (MVVM with Combine/async-await, dependency injection, SPM modular targets), Xcode config (project structure, schemes, build configurations, Info.plist privacy keys), App Store specifics (deployment target, capabilities, entitlements, privacy descriptions)
- L3: DNA mapping table (web token -> SwiftUI equivalent), archetype adaptations for iOS
- L4: Anti-patterns (massive View bodies, sync main thread work, missing lazy loading, ignoring Dynamic Type)

- [ ] **Step 2: Commit**
```bash
mkdir -p skills/mobile-swift && git add skills/mobile-swift/ && git commit -m "feat: add mobile-swift skill (SwiftUI, DNA translation, App Store)"
```

---

### Task 12: Create mobile-kotlin skill

**Files:**
- Create: `skills/mobile-kotlin/SKILL.md`

- [ ] **Step 1: Write the full 4-layer Kotlin/Compose skill**

```yaml
---
name: "mobile-kotlin"
description: "Kotlin/Jetpack Compose native Android patterns. Material 3 theming from DNA, Material You dynamic colors, predictive back, MVI architecture, Gradle configuration, Play Store requirements."
tier: "domain"
triggers: "kotlin, jetpack compose, android native, gradle, play store, material design"
version: "2.0.0"
---
```

~500 lines:
- L1: When to use Kotlin native vs cross-platform
- L2: Compose patterns (Composables, State hoisting, remember/derivedStateOf, Material 3 theming), DNA translation (Color.kt, Type.kt, Shape.kt from DNA tokens), platform features (Material You dynamic colors, predictive back gesture, edge-to-edge, adaptive icons), architecture (MVI/MVVM with Kotlin Flow, Hilt DI, Navigation Compose), Gradle config (Kotlin DSL, version catalogs, build variants, R8/ProGuard), Play Store specifics (target SDK API 34+, permissions, data safety, content rating)
- L3: DNA mapping table (web token -> Compose equivalent), archetype adaptations for Android
- L4: Anti-patterns (recomposition traps, blocking main thread, missing LazyColumn, unstable parameters)

- [ ] **Step 2: Commit**
```bash
mkdir -p skills/mobile-kotlin && git add skills/mobile-kotlin/ && git commit -m "feat: add mobile-kotlin skill (Compose, Material 3, Play Store)"
```

---

### Task 13: Create mobile-react-native skill

**Files:**
- Create: `skills/mobile-react-native/SKILL.md`

- [ ] **Step 1: Write the full 4-layer React Native skill**

```yaml
---
name: "mobile-react-native"
description: "React Native bare workflow patterns. DNA token translation, React Navigation, Zustand state, New Architecture (Fabric+TurboModules), Hermes engine, and cross-platform performance."
tier: "domain"
triggers: "react native, rn, bare react native, metro bundler, hermes"
version: "2.0.0"
---
```

~500 lines:
- L1: Bare RN vs Expo decision tree, when to use each
- L2: Component patterns (functional, StyleSheet.create, Platform.select, .ios.tsx/.android.tsx), DNA translation (theme provider, design token constants, NativeWind/Tailwind RN option), navigation (React Navigation stack/tab/drawer, deep linking), state (Zustand + TanStack Query), native modules (New Architecture Fabric+TurboModules, bridging), build config (Metro, Podfile, build.gradle, Hermes), performance (FlatList/FlashList, Reanimated animations, bridge avoidance)
- L3: DNA mapping, platform adaptations (iOS vs Android styling differences)
- L4: Anti-patterns (inline styles, ScrollView for lists, unnecessary re-renders, bridge bottlenecks, console.log in production)

- [ ] **Step 2: Commit**
```bash
mkdir -p skills/mobile-react-native && git add skills/mobile-react-native/ && git commit -m "feat: add mobile-react-native skill (bare workflow, New Architecture)"
```

---

### Task 14: Create mobile-expo skill

**Files:**
- Create: `skills/mobile-expo/SKILL.md`

- [ ] **Step 1: Write the full 4-layer Expo skill**

```yaml
---
name: "mobile-expo"
description: "Expo managed workflow patterns. Expo Router file-based routing, EAS Build/Submit, expo-font/expo-image, config plugins, OTA updates, and managed-to-bare migration."
tier: "domain"
triggers: "expo, expo router, eas build, eas submit, managed workflow"
version: "2.0.0"
---
```

~450 lines:
- L1: Managed vs bare decision tree, when to eject, config plugins
- L2: Expo SDK (expo-router file-based routing, expo-camera, expo-notifications, expo-image), DNA translation (same as RN + expo-font, expo-splash-screen), Expo Router (layouts, groups, modals, tabs — like Next.js App Router), EAS Build (development/preview/production profiles, OTA updates), EAS Submit (auto-submit App Store + Play Store), config (app.json/app.config.ts, plugins array, env vars)
- L3: DNA mapping, Expo-specific adaptations
- L4: Anti-patterns (bare modules in managed, oversized OTA, missing app.config.ts validation)

- [ ] **Step 2: Commit**
```bash
mkdir -p skills/mobile-expo && git add skills/mobile-expo/ && git commit -m "feat: add mobile-expo skill (Expo Router, EAS Build/Submit)"
```

---

### Task 15: Create mobile-flutter skill

**Files:**
- Create: `skills/mobile-flutter/SKILL.md`

- [ ] **Step 1: Write the full 4-layer Flutter skill**

```yaml
---
name: "mobile-flutter"
description: "Flutter/Dart cross-platform patterns. ThemeData from DNA, Material 3 + Cupertino adaptive widgets, Riverpod state, go_router navigation, platform channels."
tier: "domain"
triggers: "flutter, dart, flutter widget, material cupertino, riverpod"
version: "2.0.0"
---
```

~500 lines:
- L1: When to use Flutter vs native vs RN/Expo
- L2: Widget patterns (Stateless/Stateful, Material 3, Cupertino adaptive), DNA translation (ThemeData, ColorScheme.fromSeed, TextTheme, custom tokens), platform features (platform-aware widgets, PlatformDispatcher), architecture (Riverpod, go_router, repository pattern), build config (pubspec.yaml, build flavors, dart defines), platform channels (MethodChannel, Pigeon type-safe bridges)
- L3: DNA mapping, dual-platform adaptations
- L4: Anti-patterns (missing const, setState on large widgets, missing ListView.builder, no cached_network_image)

- [ ] **Step 2: Commit**
```bash
mkdir -p skills/mobile-flutter && git add skills/mobile-flutter/ && git commit -m "feat: add mobile-flutter skill (ThemeData, Riverpod, platform channels)"
```

---

### Task 16: Create store-submission skill

**Files:**
- Create: `skills/store-submission/SKILL.md`

- [ ] **Step 1: Write the full store submission validation skill**

```yaml
---
name: "store-submission"
description: "App Store and Play Store pre-submission validation. Asset checks, guidelines compliance, content policy, privacy requirements, and comprehensive readiness gate."
tier: "domain"
triggers: "app store, play store, store submission, app review, store listing, app assets"
version: "2.0.0"
---
```

~700 lines covering (from spec Section 4.3):

**App Store (iOS) checks:**
- Assets: icon 1024x1024 no alpha, @1x/@2x/@3x, splash screen, screenshots (6.7"/6.5"/5.5"/12.9" iPad), app preview video
- Info.plist: all privacy descriptions (NSCameraUsageDescription etc.), background modes, ATS
- App Review: no placeholder content, no broken links, no private APIs, minimum functionality, test credentials
- Privacy: ATT if IDFA, nutrition labels match collection, privacy policy URL
- Metadata: name (30), subtitle (30), keywords (100), description (4000), category, age rating
- Localization: strings, screenshots per locale, metadata per locale
- Technical: deployment target, capabilities, entitlements

**Play Store (Android) checks:**
- Assets: icon 512x512, feature graphic 1024x500, screenshots min 2 max 8, promo video
- Data Safety: types collected/shared, encryption, deletion mechanism, privacy policy
- Store Listing: title (30), short (80), full (4000), category, IARC rating
- APK/AAB: target SDK API 34+, 64-bit, AAB format, R8, app signing
- Permissions: only if used, runtime requests, QUERY_ALL_PACKAGES justification
- Content Policy: no deception, no impersonation, no placeholder, ads compliance
- Technical: predictive back, edge-to-edge, photo picker, foreground service types

**Cross-Platform checks:**
- Assets for both platforms, privacy matching, deep linking both, push certs both, no debug code, size budgets (iOS <200MB, Android <150MB)

**Output format:** `audit/STORE-SUBMISSION-REPORT.md` with pass/fail, fix instructions, "Ready/Not Ready" verdict

- [ ] **Step 2: Commit**
```bash
mkdir -p skills/store-submission && git add skills/store-submission/ && git commit -m "feat: add store-submission skill (iOS + Android + cross-platform validation)"
```

---

### Task 17: Create mobile-performance skill

**Files:**
- Create: `skills/mobile-performance/SKILL.md`

- [ ] **Step 1: Write the full mobile performance skill**

```yaml
---
name: "mobile-performance"
description: "Mobile app performance suite. Build-time analysis, per-framework anti-pattern detection, runtime profiling guidance, and automated audit checks."
tier: "domain"
triggers: "mobile performance, app performance, app size, frame rate, launch time, mobile optimization"
version: "2.0.0"
---
```

~600 lines covering (from spec Section 4.4):

**Build-time analysis:**
- Bundle size budgets: iOS <200MB, Android AAB <150MB, RN JS bundle <5MB
- Asset optimization (compressed, unused removed)
- Dead code detection, dependency audit

**Code pattern enforcement (per framework):**
- Swift: large views >50 lines, sync main thread, missing lazy loading
- Kotlin: recomposition traps, blocking main, missing LazyColumn
- React Native: inline styles, ScrollView for lists, re-renders, bridge bottlenecks
- Expo: same as RN + bare modules in managed, oversized OTA
- Flutter: missing const, setState large widgets, missing ListView.builder

**Runtime profiling guidance:**
- iOS: Instruments config (launch <400ms, 60fps, <100MB idle)
- Android: Profiler config (cold start <500ms, 90fps, <100MB RAM)
- RN: Flipper setup (JS thread 60fps, <16ms frame)
- Flutter: DevTools setup (60fps, <16ms build)

**Automated audit checks:**
- Bundle size measurement (framework CLI)
- Asset size audit (filesystem scan)
- Anti-pattern grep (static analysis per framework)
- Dependency audit (npm/pod/gradle)

- [ ] **Step 2: Commit**
```bash
mkdir -p skills/mobile-performance && git add skills/mobile-performance/ && git commit -m "feat: add mobile-performance skill (build analysis, anti-patterns, profiling)"
```

---

### Task 18: Create mobile-specialist agent

**Files:**
- Create: `agents/specialists/mobile-specialist.md`

- [ ] **Step 1: Write the specialist agent**

```yaml
name: mobile-specialist
description: "Generates mobile app screens with DNA-styled components, platform conventions, and store-ready assets. Handles Swift, Kotlin, React Native, Expo, and Flutter."
tools: Read, Write, Edit, Bash, Grep, Glob
model: inherit
maxTurns: 50
```

Body sections:
- **Role:** Mobile app builder spawned when project includes mobile target
- **Framework Detection:** Reads DNA mobile extension to determine primary framework
- **DNA Translation:** Converts web DNA tokens to platform design system (Color assets for Swift, ThemeData for Flutter, StyleSheet for RN, etc.)
- **Screen Generation:** Generates screens following platform conventions (HIG for iOS, Material for Android)
- **Navigation:** Implements navigation pattern from DNA (tab-bar, drawer, stack)
- **Store Validation:** Validates assets and metadata against store-submission skill during build
- **Performance:** Runs anti-pattern checks per framework
- **Spawn Prompt Contract:** Same as builder — receives DNA, PLAN.md, component registry, but also DNA mobile extension
- **Input:** DESIGN-DNA.md (with mobile extension), section PLAN.md, mobile framework skills
- **Output:** Screen code files, SUMMARY.md with store readiness notes

- [ ] **Step 2: Commit**
```bash
git add agents/specialists/mobile-specialist.md && git commit -m "feat: add mobile-specialist agent (5 frameworks, store validation)"
```

---

### Task 19: Update existing files for mobile + SEO/GEO integration

**Files:**
- Modify: `commands/start-project.md`
- Modify: `commands/audit.md`
- Modify: `agents/pipeline/orchestrator.md`

- [ ] **Step 1: Update start-project with mobile + SEO/GEO discovery**

Read `commands/start-project.md`. Add to the discovery phase:

**Mobile detection:**
- Mentions "app" or "mobile" -> ask "Which platforms? iOS, Android, or both?"
- iOS -> "Swift/SwiftUI native or cross-platform?"
- Android -> "Kotlin/Compose native or cross-platform?"
- Cross-platform -> "React Native (bare), Expo (managed), or Flutter?"
- Multiple -> "Primary framework?"
- Always for mobile -> "Target store submission? (App Store / Play Store / Both)"

**SEO/GEO detection:**
- Always ask -> "Will this site need AI search visibility (GEO)? (Y/N)"
- If yes -> "Target AI platforms? (ChatGPT, Perplexity, Google AI Overviews, all)"

- [ ] **Step 2: Update audit with SEO/GEO + store + mobile performance modes**

Read `commands/audit.md`. Add:
- SEO/GEO audit mode: spawns seo-geo-specialist in audit mode
- Store submission audit: spawns mobile-specialist with store-submission skill
- Mobile performance audit: bundle size, anti-pattern scan, dependency audit
- Visual companion screens: seo-geo-report.html, store-submission-report.html

- [ ] **Step 3: Update orchestrator to spawn new specialists**

Read `agents/pipeline/orchestrator.md`. Add `seo-geo-specialist` and `mobile-specialist` to the Task() tools list in frontmatter. Add spawn conditions:
- seo-geo-specialist: spawned per-section in build mode (if SEO/GEO enabled), in audit mode during /gen:audit
- mobile-specialist: spawned when project has mobile framework target

- [ ] **Step 4: Commit**
```bash
git add commands/start-project.md commands/audit.md agents/pipeline/orchestrator.md && git commit -m "feat: integrate mobile + SEO/GEO into discovery, audit, and orchestrator"
```

---

## Group D: Final Updates (Tasks 20-22)

### Task 20: Update SKILL-DIRECTORY + skill template

**Files:**
- Modify: `skills/SKILL-DIRECTORY.md`

- [ ] **Step 1: Add all 12 new skills to directory**

New Core skills:
- seo-technical
- geo-optimization
- structured-data-v2

New Domain skills:
- mobile-swift
- mobile-kotlin
- mobile-react-native
- mobile-expo
- mobile-flutter
- store-submission
- mobile-performance

New Agents:
- seo-geo-specialist
- mobile-specialist

Update total count.

- [ ] **Step 2: Commit**
```bash
git add skills/SKILL-DIRECTORY.md && git commit -m "docs: update SKILL-DIRECTORY with 12 new skills + 2 agents"
```

---

### Task 21: Update CLAUDE.md + README + marketplace.json

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Update CLAUDE.md**

- Update skill count (~108)
- Add 7 hook events (was 4: add PreCompact, Stop, PostToolUse)
- Update agent count (17: 7 pipeline + 6 specialists + 4 protocols)
- Add "Mobile App Pipeline" section (5 frameworks, store validation, performance)
- Add "SEO/GEO Intelligence" section (3 skills, specialist agent)
- Add "Ruflo-Inspired Infrastructure" section (context preservation, metrics, PII scanning)

- [ ] **Step 2: Update README**

Update plugin table: skills ~108, commands 11, agents 17.

- [ ] **Step 3: Update marketplace.json**

Update counts. Add keywords: seo, geo, llms-txt, mobile, swift, kotlin, flutter, react-native, expo, app-store, play-store, pii-scanning.

- [ ] **Step 4: Commit**
```bash
git add CLAUDE.md README.md .claude-plugin/marketplace.json && git commit -m "docs: update CLAUDE.md, README, marketplace for Plan 6 expansion"
```

---

### Task 22: Validation pass

- [ ] **Step 1: Verify all new hooks execute**
```bash
echo '{}' | node .claude-plugin/hooks/pre-compact.mjs && echo "pre-compact: OK"
echo '{}' | node .claude-plugin/hooks/session-end.mjs && echo "session-end: OK"
echo '{"tool_name":"Write","tool_input":{"file_path":"test.tsx"}}' | node .claude-plugin/hooks/post-tool-use.mjs && echo "post-tool-use: OK"
```
Expected: All 3 OK

- [ ] **Step 2: Verify plugin.json has all 6 hook events**
```bash
node -e "const p=JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8'));console.log('Hooks:',Object.keys(p.hooks).length)"
```
Expected: `Hooks: 6`

- [ ] **Step 3: Verify all new skills exist**
```bash
for dir in seo-technical geo-optimization structured-data-v2 mobile-swift mobile-kotlin mobile-react-native mobile-expo mobile-flutter store-submission mobile-performance; do
  test -f "skills/$dir/SKILL.md" && echo "$dir: OK" || echo "$dir: MISSING"
done
```
Expected: All 10 OK

- [ ] **Step 4: Verify new agents exist**
```bash
for f in agents/specialists/seo-geo-specialist.md agents/specialists/mobile-specialist.md; do
  test -f "$f" && echo "$f: OK" || echo "$f: MISSING"
done
```
Expected: Both OK

- [ ] **Step 5: Verify agent count**
```bash
find agents/ -name "*.md" -not -path "*/protocols/*" | wc -l
```
Expected: 14 (7 pipeline + 6 specialists + 1 figma-translator)

- [ ] **Step 6: Final commit**
```bash
git add -A && git commit -m "chore: plan 6 complete -- expansion validated"
```

---

## Plan 6 Summary

22 tasks delivering:
- 3 new hooks (pre-compact, session-end, post-tool-use)
- PII scanning in pre-commit hook
- Per-skill resource constraints in pre-tool-use hook
- Obsidian knowledge graphs enhancement
- 3 SEO/GEO skills (seo-technical, geo-optimization, structured-data-v2)
- 1 SEO/GEO specialist agent
- 5 mobile framework skills (Swift, Kotlin, RN, Expo, Flutter)
- Store submission validation skill
- Mobile performance suite skill
- 1 mobile specialist agent
- Updated discovery, audit, and orchestrator for mobile + SEO/GEO
- Updated SKILL-DIRECTORY, CLAUDE.md, README, marketplace.json

**After Plan 6:** Genorah v2.0.0 ships with full web + mobile + SEO/GEO capabilities.
