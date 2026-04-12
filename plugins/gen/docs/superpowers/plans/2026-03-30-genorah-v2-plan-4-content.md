# Plan 4: Content Expansion

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create all new domain skills (5 integrations, 3 AI UI, 4 data catalogs, performance enhancement, visual companion screen templates).

**Architecture:** Each skill uses the 4-layer format with pipeline awareness. Data catalogs use LLM-optimized format in `skills/data/`. Integration skills include anti-patterns with penalties and discovery-phase auto-detection.

**Tech Stack:** Markdown with YAML frontmatter

**Spec:** `docs/superpowers/specs/2026-03-30-genorah-v2-design.md` Sections 12-14, 16

**Depends on:** Plan 1 (Foundation)

---

## File Map

### Integration Skills (5)
- `skills/hubspot-integration/SKILL.md`
- `skills/stripe-integration/SKILL.md`
- `skills/shopify-integration/SKILL.md`
- `skills/woocommerce-integration/SKILL.md`
- `skills/propstack-integration/SKILL.md`

### AI UI Skills (3)
- `skills/ai-ui-patterns/SKILL.md`
- `skills/ai-pipeline-features/SKILL.md`
- `skills/ai-ui-components/SKILL.md`

### Data Catalogs (4)
- `skills/data/palettes.md`
- `skills/data/font-pairings.md`
- `skills/data/chart-types.md`
- `skills/data/industry-rules.md`

### Performance Enhancement
- `skills/performance-guardian/SKILL.md` (modify)

### Visual Companion Screens
- `skills/visual-companion-screens/SKILL.md`

---

### Task 1: Create HubSpot integration skill

**Files:**
- Create: `skills/hubspot-integration/SKILL.md`

- [ ] **Step 1: Write full 4-layer HubSpot skill**

Frontmatter:
```yaml
---
name: "hubspot-integration"
description: "HubSpot CRM, Marketing, and CMS integration patterns for Next.js and Astro. UTK tracking, Forms API v3, CRM dashboard, blog headless, chat widget, marketing events, GDPR consent."
tier: "domain"
triggers: "hubspot, crm, marketing automation, lead capture, tracking"
version: "2.0.0"
---
```

Layer 1 (Decision Guidance):
- Integration depth decision tree (forms-only, forms+tracking, headless blog, CRM dashboard, full suite, multi-tenant)
- Authentication patterns (Private App Token vs OAuth 2.0)
- Data freshness strategy table (real-time SSR, cached ISR, webhook-driven, batch sync)

Layer 2 (Award-Winning Examples):
- Pattern 1: Tracking & UTK (consent-gated script, SPA page view, UTK server-side read)
- Pattern 2: Forms API v3 (server-side proxy Route Handler, react-hook-form + zod, hutk + pageUri + pageName in context, GDPR legalConsentOptions)
- Pattern 3: Headless Blog (CMS Blog API + ISR, HTML sanitization, generateStaticParams)
- Pattern 4: CRM Dashboard (SSR deals pipeline, contact search, Analytics Reporting API, webhook revalidation)
- Pattern 5: Chat Widget (loadImmediately: false, inlineEmbedSelector, AI chatbot middleware)
- Pattern 6: HubDB (structured content, ISR)
- Pattern 7: Marketing Events (registration API, attendance tracking, workflow triggers)
- Pattern 8: Custom Events (POST /events/v3/send, server-side)
- Form name enforcement: must use HUBSPOT_FORM_ID GUID, human-readable names, no CSS classes as form names

Layer 3 (Integration):
- Pipeline awareness: auto-detection during /gen:start-project
- Auto-ask questions when HubSpot detected
- Builder integration: UTK component, form Route Handler template, consent pattern
- Quality reviewer: integration quality checks (UTK, consent, token exposure)

Layer 4 (Anti-Patterns):
- Token exposed client-side (-15)
- Missing hutk in form context (-5)
- No consent before tracking (-5)
- CSS classes as form names (-5)
- Using Contacts API for user forms (-3)
- Synchronous script load (-3)
- Submitting empty fields (silent failure)
- Ignoring 10K search cap
- Not sanitizing blog HTML (XSS)

- [ ] **Step 2: Verify all 8 patterns documented**
```bash
grep -c "### Pattern" skills/hubspot-integration/SKILL.md
```
Expected: 8

- [ ] **Step 3: Commit**
```bash
git add skills/hubspot-integration/SKILL.md
git commit -m "feat: add hubspot-integration skill (full depth, 8 patterns)"
```

---

### Task 2: Create Stripe integration skill

**Files:**
- Create: `skills/stripe-integration/SKILL.md`

- [ ] **Step 1: Write full 4-layer Stripe skill**

Patterns: Checkout Sessions, Payment Intents (custom form with Elements), Subscriptions (pricing table, Billing portal), Stripe Link (one-click), Webhooks (signature verification), Connect (marketplace).

Anti-patterns: secret key client-side (-15), missing webhook verification (-10), no idempotency keys (-5), hardcoded prices (-3).

Pipeline awareness: auto-detect payments during discovery, enforce webhook Route Handler + STRIPE_WEBHOOK_SECRET.

- [ ] **Step 2: Commit**
```bash
git add skills/stripe-integration/SKILL.md
git commit -m "feat: add stripe-integration skill (full depth)"
```

---

### Task 3: Create Shopify integration skill

**Files:**
- Create: `skills/shopify-integration/SKILL.md`

- [ ] **Step 1: Write full 4-layer Shopify skill**

Patterns: Storefront API (GraphQL, typed queries, ISR), Product pages (SSG, variants, gallery), Cart (React context + Storefront Cart API, drawer UI), Checkout (redirect), Metafields (custom content), Webhooks (product/order updates).

Anti-patterns: Admin API token client-side (-15), no pagination (-5), missing variant handling (-3), no Product schema (-3), cart state lost on refresh (-3).

- [ ] **Step 2: Commit**
```bash
git add skills/shopify-integration/SKILL.md
git commit -m "feat: add shopify-integration skill (full depth)"
```

---

### Task 4: Create WooCommerce integration skill

**Files:**
- Create: `skills/woocommerce-integration/SKILL.md`

- [ ] **Step 1: Write full 4-layer WooCommerce skill**

Patterns: REST API v3 proxy, Products (ISR + webhook revalidation), Cart (CoCart), Checkout (redirect or custom), Variations (complex model), Webhooks.

Anti-patterns: consumer key client-side (-15), variation complexity mishandled (-5), missing currency/tax formatting (-3).

- [ ] **Step 2: Commit**
```bash
git add skills/woocommerce-integration/SKILL.md
git commit -m "feat: add woocommerce-integration skill (full depth)"
```

---

### Task 5: Create Propstack integration skill

**Files:**
- Create: `skills/propstack-integration/SKILL.md`

- [ ] **Step 1: Write full 4-layer Propstack skill**

Patterns: Property listings (ISR + webhook, grid + map), Detail pages (gallery, floor plans, energy cert, location), Lead capture (form -> Propstack API), Search/filter (faceted, URL-synced), Expose PDF (server-side, DNA-styled), Map integration (Mapbox/Google Maps, clustered markers).

Anti-patterns: credentials client-side (-15), no pagination (-5), missing image optimization (-3), no RealEstateListing schema (-3), filters not URL-synced (-3).

- [ ] **Step 2: Commit**
```bash
git add skills/propstack-integration/SKILL.md
git commit -m "feat: add propstack-integration skill (full depth)"
```

---

### Task 6: Create AI UI patterns skill

**Files:**
- Create: `skills/ai-ui-patterns/SKILL.md`

- [ ] **Step 1: Write AI product design pattern catalog**

8 patterns with DNA-styled TSX examples:
1. Chat interface (Message list, prompt input, streaming, tool calls)
2. AI search (NL query, structured results, citations)
3. Smart forms (AI-assisted completion, suggestions)
4. Content generation UI (prompt -> draft -> edit -> publish)
5. Model comparison (side-by-side, params, diff)
6. RAG search interface (query, retrieval indicators, sourced answer)
7. AI dashboard (usage, costs, model performance)
8. Prompt playground (multi-model, parameter sliders)

Each pattern includes component structure, data flow, AI SDK hooks used, and DNA token integration points.

- [ ] **Step 2: Commit**
```bash
git add skills/ai-ui-patterns/SKILL.md
git commit -m "feat: add ai-ui-patterns skill (8 product design patterns)"
```

---

### Task 7: Create AI pipeline features skill

**Files:**
- Create: `skills/ai-pipeline-features/SKILL.md`

- [ ] **Step 1: Write AI features within Genorah pipeline**

6 features:
1. AI image prompts (DNA-matched, hero/section imagery, during start-project Phase 3)
2. AI copy generation (brand-voice-aware drafts, archetype voice profile, content planning)
3. AI design suggestions (DNA + archetype-based recommendations, during discuss)
4. AI quality prediction (pre-build score estimation, during build)
5. AI accessibility audit (axe-core + AI interpretation, during audit)
6. AI competitive analysis (competitor site analysis, during research)

- [ ] **Step 2: Commit**
```bash
git add skills/ai-pipeline-features/SKILL.md
git commit -m "feat: add ai-pipeline-features skill (6 pipeline enhancements)"
```

---

### Task 8: Create AI Elements integration skill

**Files:**
- Create: `skills/ai-ui-components/SKILL.md`

- [ ] **Step 1: Write AI Elements component guide**

Component reference with when-to-use rules:
- Message (chat with useChat, REQUIRED for chat rendering)
- MessageResponse (ANY AI text, MANDATORY -- never raw {text})
- Conversation (chat container)
- Tool (tool call display)
- Reasoning (model thinking display)
- CodeBlock (syntax highlighted AI code)
- PromptInput (chat input with attachments)

Installation: `npx ai-elements@latest`
Integration with AI SDK: useChat + DefaultChatTransport
DNA styling: how to theme AI Elements with DNA tokens

- [ ] **Step 2: Commit**
```bash
git add skills/ai-ui-components/SKILL.md
git commit -m "feat: add ai-ui-components skill (AI Elements guide)"
```

---

### Task 9: Create data catalogs

**Files:**
- Create: `skills/data/palettes.md`
- Create: `skills/data/font-pairings.md`
- Create: `skills/data/chart-types.md`
- Create: `skills/data/industry-rules.md`

- [ ] **Step 1: Create palettes.md**

97+ palettes in LLM-optimized format. Each palette includes:
- Name, Primary/Secondary/CTA/Background/Text colors (hex + oklch)
- Compatible archetypes
- Target industries
- Mood keywords
- WCAG compliance level
- Light/dark mode variants

Organized by product type (SaaS, E-commerce, Fintech, Healthcare, Creative, etc.)

Source: UI UX PRO MAX colors.csv (97 rows) + Genorah archetype-specific additions.

- [ ] **Step 2: Create font-pairings.md**

57+ font pairings. Each includes:
- Heading font (family, weight, category)
- Body font (family, weight, category)
- Mono font recommendation
- Mood/style keywords
- Best-for use cases
- Google Fonts import URL
- Tailwind config snippet
- Multilingual support flags

Source: UI UX PRO MAX typography.csv (57 rows) + Genorah archetype-matched additions.

- [ ] **Step 3: Create chart-types.md**

25+ chart types. Each includes:
- Data type it serves
- Primary and secondary chart recommendations
- Performance rating
- Accessibility rating
- Recommended libraries
- DNA integration points (colors from DNA tokens)
- Color-blind safe alternatives

Source: UI UX PRO MAX charts.csv (25 rows).

- [ ] **Step 4: Create industry-rules.md**

100+ industry-specific reasoning rules. Each includes:
- Industry/product category
- Recommended landing page pattern
- Style priority (ordered)
- Color mood
- Typography mood
- Key effects
- Anti-patterns to avoid (specific to industry)
- Severity (HIGH/MEDIUM)

Source: UI UX PRO MAX ui-reasoning.csv (100 rows) + Genorah archetype compatibility mapping.

- [ ] **Step 5: Commit all catalogs**
```bash
git add skills/data/
git commit -m "feat: add data catalogs (97 palettes, 57 fonts, 25 charts, 100 industry rules)"
```

---

### Task 10: Enhance performance-guardian skill

**Files:**
- Modify: `skills/performance-guardian/SKILL.md`

- [ ] **Step 1: Add lazy loading, caching, and bundle optimization sections**

Lazy loading:
- loading="lazy" for below-fold images
- React.lazy() + Suspense for heavy components
- Intersection Observer for below-fold sections
- next/dynamic with ssr: false
- Dynamic imports for GSAP, Three.js, chart libs

Caching decision tree:
- SSG for static, ISR for periodic, SSR for per-request, Runtime Cache for shared, CDN for assets, 'use cache' for components

Bundle optimization:
- Dynamic imports mandatory for chart/3D/animation libs
- @next/bundle-analyzer during audit
- 200KB per route budget
- Font subsetting, AVIF/WebP priority

CWV budgets:
- LCP < 2.5s, FID/INP < 200ms, CLS < 0.1
- Per-metric penalty in quality gate (-3 each if exceeded)

- [ ] **Step 2: Commit**
```bash
git add skills/performance-guardian/SKILL.md
git commit -m "feat: enhance performance-guardian with lazy loading, caching, CWV budgets"
```

---

### Task 11: Create visual companion screen templates skill

**Files:**
- Create: `skills/visual-companion-screens/SKILL.md`

- [ ] **Step 1: Write screen template reference**

HTML fragment templates for each pipeline stage:
- Archetype picker (19 cards with swatches)
- Palette explorer (side-by-side comparison)
- Font pairing preview (live typography samples)
- Creative directions (concept board layout)
- Emotional arc map (beat timeline visualization)
- Build progress dashboard (wave/section status grid)
- Score radar chart (12-category visualization)
- Breakpoint preview (4-viewport grid)
- Before/after diff (split comparison)
- Consistency matrix (component audit table)

Each template shows the HTML structure agents should use when pushing to the companion.

- [ ] **Step 2: Commit**
```bash
git add skills/visual-companion-screens/SKILL.md
git commit -m "feat: add visual companion screen templates skill"
```

---

### Task 12: Validation pass

- [ ] **Step 1: Verify all new skills have frontmatter**
```bash
for dir in hubspot-integration stripe-integration shopify-integration woocommerce-integration propstack-integration ai-ui-patterns ai-pipeline-features ai-ui-components visual-companion-screens; do
  echo "=== $dir ==="
  head -3 "skills/$dir/SKILL.md"
done
```
Expected: Each starts with `---`

- [ ] **Step 2: Verify data catalogs exist**
```bash
ls -la skills/data/
```
Expected: palettes.md, font-pairings.md, chart-types.md, industry-rules.md

- [ ] **Step 3: Commit**
```bash
git add -A
git commit -m "chore: plan 4 complete -- content expansion validated"
```

---

## Plan 4 Summary

12 tasks delivering:
- 5 integration skills (HubSpot, Stripe, Shopify, WooCommerce, Propstack)
- 3 AI UI skills (patterns, pipeline features, components)
- 4 data catalogs (97 palettes, 57 fonts, 25 charts, 100 industry rules)
- Enhanced performance-guardian skill
- Visual companion screen templates skill

**Next:** Plan 5 (Release) after all parallel plans complete
