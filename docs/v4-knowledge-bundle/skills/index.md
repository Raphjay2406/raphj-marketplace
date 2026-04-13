---
type: index
entity: skills
count: 310
version: "4.0.0"
tags: [index, skills]
---

# Skill Index (310 skills)

### Core (always loaded) (67)

- **a2a-agent-card-generator** `v4.0.0` — Generate Google A2A v0.3 compliant agent cards from agent frontmatter
- **accessibility** `v2.0.0` — WCAG 2.1 AA baked into every component: ARIA patterns, keyboard navigation, focus management, archet
- **adversarial-critic-loop** `v0.1.0-provisional` — 2-cycle maximum adversarial critique loop. Spawns critic, polisher applies CRITICAL + HIGH fixes, re
- **ag-ui-event-emitter** `v4.0.0` — CopilotKit AG-UI v1.0 event emission during pipeline execution
- **agent-episodic-memory** `v0.1.0-provisional` — L2 of Context Fabric — per-agent-kind NDJSON of (task_fingerprint, input_context, output, score, fee
- **agent-protocol-validator** `v4.0.0` — Pre-dispatch AJV validation of Result<T> envelopes on SendMessage
- **animation-orchestration** `v3.1.0` — Meta-skill: unified animation catalog referencing cinematic-motion + performance-animation + motion-
- **anti-vanity-check** `v3.1.0` — Detects ego-driven over-engineering patterns: premature abstraction, design patterns without problem
- **archetype-arbitration** `v1.0.0` — Tension Council — 3-agent vote resolves mandatory-vs-forbidden archetype conflicts in multi-archetyp
- **archetype-component-variants** `v2.3.0` — Per-archetype Tailwind CSS presets for shadcn/ui components. How Button, Card, Input, Table, Badge, 
- **archetype-mixing** `v0.1.0` — Formal protocol for mixing archetypes — primary 60% + secondary 30% + tension 10%. Compatibility mat
- **asset-forge-dna-compliance** `v0.1.0-provisional` — Sub-gate that reads public/assets/MANIFEST.json and verifies DNA coverage, archetype-material compli
- **calibration-store** `v0.1.0-provisional` — L7 of Context Fabric — user-global SQLite at ~/.claude/genorah/calibration.db storing golden-set pan
- **cinematic-motion** `v2.0.0` — Unified motion design system. CSS scroll-driven default, archetype-driven intensity, beat-dependent 
- **closed-loop-iteration** `v3.0.0` — Bounded iteration protocol for visual-refiner agent. Mini-eval scoring (30-pt subset), targeted-diff
- **cognitive-accessibility** `v3.0.0` — Beyond-WCAG cognitive load: reading grade per section, sentence variance, decision density (≤5 CTAs/
- **cognitive-load-gate** `v0.1.0-provisional` — Machine checks for element density, choice overload (Hick's law), reading grade level, heading hiera
- **compaction-survivor** `v0.1.0-provisional` — Protocol formalizing what pre-compact.mjs preserves. Packs top-10 ledger entries + open decisions + 
- **compositional-diversity** `v2.0.0` — Enforces visual variety across page sections through an 18-pattern layout taxonomy with adjacency ru
- **content-moderation** `v0.1.0` — NSFW + safety moderation on AI-generated assets. OpenAI moderation endpoint + ml5.js local model + p
- **context-anchor-v2** `v3.0.0` — Lightweight DNA-token refresh injected by pre-tool-use hook when recent agent outputs lack DNA token
- **context-fabric-ledger** `v0.1.0-provisional` — Append-only NDJSON event log at .planning/genorah/journal.ndjson. Every significant pipeline event w
- **conversion-gate** `v0.1.0-provisional` — Machine checks for primary CTA above-fold at both desktop and mobile, trust signal proximity to CTA,
- **conversion-patterns** `v2.5.0` — Data-backed conversion design patterns: 10 proven hero layouts, 5 pricing table patterns, 5 social p
- **cross-project-kb** `v0.1.0-provisional` — L6 of Context Fabric — Obsidian vault enrichment with lessons extracted at project completion. Per-a
- **decision-graph** `v0.1.0-provisional` — Replaces flat DECISIONS.md with typed JSON graph — decisions with edges (rationale, impacts[], super
- **dna-drift-detection** `v3.0.0` — AST-level detection of off-DNA color/spacing/font literals in TSX, CSS, and Tailwind class strings. 
- **error-taxonomy** `v0.1.0` — Structured error codes with recovery guidance. Every agent / script / hook failure surfaces via a Ge
- **generation-trajectory** `v0.1.0-provisional` — Score-over-iteration tracking. Every variant / refine / critic cycle writes to sections/{id}/traject
- **interaction-fidelity-gate** `v0.1.0-provisional` — Machine checks for touch targets, focus rings, keyboard nav, hover states, form affordances, and abo
- **interactive-refinement** `v3.0.0` — Click-to-annotate refinement loop — companion captures element selector + user intent, queues a stru
- **judge-calibration** `v0.1.0-provisional` — Golden-set anchoring + few-shot prompting + inter-judge agreement κ + drift detection for LLM-as-jud
- **keyboard-task-completion** `v0.1.0` — Full keyboard testing — not just "can Tab reach it" but "can primary task be completed via keyboard 
- **live-testing** `v2.0.0` — Defines the automated browser testing protocol: 4-breakpoint screenshots, Lighthouse performance aud
- **locale-archetype-overrides** `v0.1.0` — Per-locale archetype adjustments. Japanese Minimal renders differently in JP (narrower column, verti
- **mcp-sampling-v2-adapter** `v4.0.0` — Register Genorah agents as MCP primitives via sampling/createMessage
- **micro-copy-strategy** `v2.5.0` — The words that convert: CTA button copy psychology, error message templates that don't demoralize, f
- **model-cascade** `v3.0.0` — Tiered model assignment per beat type and agent role. Haiku for scaffold, Sonnet for hero work, Opus
- **motion-health** `v3.0.0` — Motion-quality sub-gate inside Motion & Interaction category. Measures INP regression, GPU layer cou
- **neuro-aesthetic-gate** `v1.0.0` — 14th quality category — 20-pt neuro-aesthetic scoring via saliency map overlay, ONNX model integrati
- **pareto-generation** `v0.1.0-provisional` — Multi-objective variant selection replacing scalar tournament. Generates N variants with diversity p
- **perf-budgets** `v3.0.0` — Per-beat performance budgets (LCP/INP/CLS/section-JS/hero-image) enforced via Lighthouse CI and sect
- **performance-animation** `v2.0.0` — Performance-aware animation system. CWV compliance alongside heavy animation, CSS-first compositor-t
- **pii-regex-v2026** `v0.1.0` — Updated PII / secret detection patterns for 2026 formats. Stripe/AWS/GitHub/GitLab/Slack/Google/Open
- **pipeline-guidance** `v3.0.0` — Canonical state-detection + next-command library. One source of truth for 'what /gen:* should run ne
- **plugin-telemetry** `v0.1.0` — Opt-in anonymized plugin telemetry — skill usage, command invocations, agent outcomes. Hashed only (
- **polish-pass** `v2.0.0` — Defines the end-of-build polish protocol: universal micro-detail checklist, archetype-specific adden
- **preservation-ledger** `v3.21.0` — Append-only NDJSON audit trail for project ingestion. Every byte touched, every token derived, every
- **prompt-injection-defense** `v0.1.0` — Sanitize user content fed to LLMs (judge, critic, persona probes). Detects injection patterns, quote
- **quality-gate-protocol** `v3.0.0` — 4-layer progressive enforcement (WHEN gates fire) combined with v3.0 6-stage validation pipeline (WH
- **quality-gate-v3** `v0.3.0` — Two-axis 394-pt quality gate — Design Craft 254 (12 inherited + Scene Craft 13th category) + UX Inte
- **real-time-personalization** `v0.1.0` — User-preference-driven DNA adjustments — reduced motion, reduced data, high contrast, battery-aware,
- **reference-diff-protocol** `v3.0.0` — Perceptual pixel-diff between built section and reference URL declared in PLAN.md. Per-beat SSIM thr
- **reference-library-rag** `v0.1.0-provisional` — Curated SOTD reference library indexed by (archetype, beat, layout-pattern) with embeddings + pixel-
- **result-envelope-schema** `v4.0.0` — Typed Result<T> envelope for all worker/director returns in v4 protocol
- **semantic-index** `v0.1.0-provisional` — L5 of Context Fabric — sqlite-vec embedding index over L3 section memories + L4 journal + decision g
- **seo-technical** `v2.0.0` — Technical SEO infrastructure: sitemaps, robots.txt (3-tier AI strategy), canonicals, hreflang, meta 
- **structured-data-v2** `v2.0.0` — Comprehensive JSON-LD structured data for SEO and GEO. @graph pattern, schema decision tree per page
- **synthetic-user-testing** `v0.1.0-provisional` — Six AI-persona Playwright probes (Skeptic CFO, First-timer, Power user, Mobile thumb-scroller, Scree
- **tailwind-system** `v2.0.0` — Tailwind CSS v4 CSS-first configuration, DNA token mapping, container queries, dark mode, and animat
- **translation-memory** `v0.1.0` — Translation memory store at ~/.claude/genorah/translations/tm.db (SQLite). Keyed by segment hash + s
- **typography-rules** `v3.1.0` — Butterick-derived typography rules — smart quotes, en/em dashes, hyphenation-as-HTML, single-space-a
- **ux-heuristics-gate** `v0.1.0-provisional` — Nielsen's 10 usability heuristics automated as binary machine checks. Scores 20 points in the UX Int
- **visual-craft-quantified** `v0.1.0-provisional` — Baseline-grid compliance, vertical rhythm, type-scale ratio, whitespace band, color harmony (off-DNA
- **visual-qa-protocol** `v2.1.0` — Automated visual QA via Playwright MCP. 4-breakpoint screenshot capture, CSS/DOM token verification,
- **wave-resume** `v0.1.0` — Partial wave failure recovery. Tracks per-section state (pending/building/built/reviewing/shipped/fa
- **wow-moments** `v2.0.0` — 30+ signature interaction patterns in 4 categories with tiered code specificity, three-factor auto-s

### Domain (per project type) (191)

- **3d-asset-generation** `v2.3.0` — Full 3D asset generation suite: procedural geometry with Three.js, AI-assisted 3D via nano-banana + 
- **3d-scene-composer** `v3.20.0` — Full R3F scene composition beyond hero marks: camera rigs, lighting setups per archetype, scene grap
- **3dsvg-extrusion** `v3.3.0` — Zero-config 3D SVG extrusion via the `3dsvg` npm component (MIT, by renatoworks). Extrudes any SVG p
- **3dsvg-preset-library** `v3.4.0` — 75 curated 3dsvg presets (25 archetypes × 3 beats: HOOK/PEAK/CLOSE) with decision tree, override mat
- **a11y-test-gen** `v0.1.0` — Axe + Playwright automated a11y suite. Every route tested for serious/critical violations. Color-con
- **active-ux-adjustment** `v0.1.0` — Behavioral-signal-driven live UX adjustments. Scroll-past-CTA promotes CTA to sticky, return-visitor
- **agent-marketplace-client** `v4.0.0` — Discover, install, and sandbox-validate agents from the Genorah marketplace registry
- **agent-trace-ui** `v3.20.0` — UI primitives for visualizing agent plan, tool-call trace, inline approvals, and streaming progress.
- **agentic-ux-patterns** `v3.20.0` — Multi-step agent flows embedded in generated sites. AI SDK v6 agents + Vercel Queues + stopWhen/step
- **ai-chat-depth** `v0.1.0` — AI chat patterns beyond basic messaging — conversational shopping, support agent with human escalati
- **ai-disclosure** `v0.1.0` — AI content disclosure patterns. Watermark + visible badge for AI-generated assets. Required by CA AB
- **anchor-positioning** `v3.2.0` — CSS Anchor Positioning — native tooltip/popover/dropdown positioning without JS. Chrome/Edge 125+; S
- **animation-path-similarity** `v0.1.0` — Compare animation paths/timelines between reference + current. Keyframe curves + easing + duration +
- **api-key-rotation** `v0.1.0` — API key rotation playbook per integration. Cadence, rotation steps, fallback-during-rotation, staged
- **api-routes** `v0.1.0` — API route scaffolding templates per framework + template kind (auth, CRUD, webhook, upload, rate-lim
- **api-test-scaffolds** `v0.1.0` — Integration test suites for API routes. Supertest + Vitest + Zod schema assertions + mocked external
- **archetype-inference** `v3.21.0` — Score ingested site against 33 Design Archetypes via testable-markers. Returns top-3 with per-marker
- **asset-forge-manifest** `v0.1.0-provisional` — Canonical schema and helpers for public/assets/MANIFEST.json — every generated asset (3D, 2D, raster
- **asset-provenance** `v3.21.0` — Ingestion-time asset handling: download, sha256-name, preserve origin URL, detect license (Exif/IPTC
- **astro-patterns** `v2.0.0` — Astro 5/6 patterns: Islands architecture, Content Layer API, ClientRouter View Transitions, Server I
- **auth-ui** `v2.0.0` — Build polished authentication UI flows including login, signup, forgot password, OTP verification, a
- **awwwards-scoring** `v2.0.0` — Awwwards-aligned 4-axis scoring rubric: Design, Usability, Creativity, Content. Detailed criteria pe
- **background-jobs** `v0.1.0` — Background job patterns — Vercel Queues + Cron, Upstash QStash, Inngest for complex workflows, webho
- **battery-aware** `v0.1.0` — Battery Status API-driven graceful degradation. < 20% battery disables autoplaying video, pauses GSA
- **biometric-auth-webauthn** `v0.1.0` — Passkeys (WebAuthn) authentication patterns. Provider-aware (Clerk, Stytch, Supabase Auth, Auth0, cu
- **blog-patterns** `v2.0.0` — Blog and article UI patterns: post index, article typography, reading progress, table of contents, t
- **brand-motion-sigils** `v3.20.0` — Motion-first brand marks using Lottie and Rive. Archetype-bound entrance animations, loop sigils, an
- **brand-voice-extraction** `v3.0.0` — Extract brand voice from competitor + client URLs via Playwright. 5-axis analysis (formality, warmth
- **brandkit-suite** `v3.1.0` — Brand asset generation pipeline: logo variants (light/dark/mono), favicon sets, OG templates, brand 
- **canary-rolling-release** `v0.1.0` — Rolling release + canary deploys via Vercel Rolling Releases (GA 2025-06). Gradual traffic shift wit
- **character-consistency** `v0.1.0-provisional` — Consistent character/mascot generation across variants using IP-Adapter Plus Face, PuLID, InstantID,
- **chart-data-viz** `v3.1.0` — Chart and data visualization patterns: Recharts with shadcn styling, stat cards with sparklines, are
- **client-review-workflow** `v3.2.0` — Shareable client-review microsite with commenting, approval tracking, diff-vs-previous-version. Gene
- **cms-content-pipeline** `v2.8.1` — CMS content integration patterns: Contentful, Sanity, Strapi, Builder.io, Payload, and git-based (MD
- **cms-payload** `v3.0.0` — Payload 3 integration (Next-native): collection generators from DNA + emotional arc, Lexical editor 
- **cms-reconnect** `v3.22.0` — Detect and reconnect the source-of-truth CMS behind a scraped site. Schema discovery for Sanity/Cont
- **cms-sanity** `v3.0.0` — Sanity Studio v3 integration: schema generation from emotional-arc beats, DNA-themed Studio, GROQ qu
- **codebase-ingestion** `v3.21.0` — Ingest existing repository into Genorah pipeline. Detects framework, extracts tokens from config (ta
- **commerce-hydrogen** `v3.20.0` — Shopify Hydrogen + Oxygen — headless commerce on Remix. Storefront API, cart persistence, customer a
- **commerce-medusa** `v3.20.0` — Medusa v2 self-hosted commerce — headless backend (Postgres), admin dashboard, Next.js storefront st
- **competitive-benchmarking** `v3.1.0` — Per-archetype curated SOTD reference list + Playwright capture + vision LLM scoring against 234-pt g
- **component-mapping** `v3.21.0` — Map ingested components and DOM sections to Genorah primitives: beats (HOOK/BUILD/PEAK/etc.) and SDU
- **composite-recipes** `v4.0.0` — YAML recipe format for orchestrating asset-worker pipelines
- **content-extraction** `v3.21.0` — Pull copy, microcopy, alt text, and structured content out of ingested source. DOM-path-addressed so
- **context-menu** `v2.0.0` — Right-click context menus, command palette (Cmd+K), keyboard shortcuts system, and advanced menu int
- **controlnet-conditioning** `v0.1.0-provisional` — Depth / canny / pose / scribble conditioning for layout-locked image generation. Used by image-casca
- **cookie-compliance** `v0.1.0` — GDPR / CCPA / LGPD cookie banner patterns. Consent-mode v2 (Google) + TCF v2.2 integration. Cookiele
- **cost-governance** `v4.0.0` — Per-project asset budget with warn/exceeded states + auto-downgrade chain
- **cross-browser-rendering** `v0.1.0` — Playwright matrix — Chromium + Firefox + WebKit (Safari) + mobile Safari + Android Chrome. Catches b
- **cross-doc-view-transitions** `v3.2.0` — Cross-document View Transitions (MPA) — native smooth page-to-page transitions via @view-transition 
- **cross-framework-parity** `v0.1.0` — Does SvelteKit render match Next.js for the same DNA? Cross-framework visual + interaction parity te
- **csp-generator** `v0.1.0` — Content Security Policy generator per tech stack. Script-src + style-src + img-src + frame-ancestors
- **cursor-ecosystem** `v2.3.0` — Custom cursor state machine with contextual morphing: text cursor on paragraphs, expand on media, ma
- **dashboard-patterns** `v2.0.0` — Dashboard UI patterns: data-dense layouts, metric cards, chart integration, sidebar navigation, comm
- **data-table** `v2.0.0` — Build data tables with TanStack Table and shadcn/ui including sorting, filtering, pagination, and co
- **db-schema-from-content** `v0.1.0` — Derive database schema from PLAN.md content model + CMS schemas. Emits Prisma, Drizzle, Payload, or 
- **dependency-sbom** `v0.1.0` — Software Bill of Materials generation (CycloneDX format). License scanning + vulnerability audit. Re
- **deploy-preview** `v0.1.0` — Automated preview deploys to Vercel / Netlify / Cloudflare Pages. Preview URL on every /gen:build. O
- **dna-reverse-engineer** `v3.21.0` — Extract Design DNA from captured artifacts. Color k-means on pixel-frequency histograms, font-family
- **drag-and-drop** `v2.0.0` — Drag-and-drop patterns with dnd-kit: sortable lists, kanban boards, file tree reordering, multi-cont
- **e2e-test-gen** `v0.1.0` — Generate Playwright E2E test files from PLAN.md user-journey map. One test per primary task; 3-break
- **email-notification-ui** `v2.0.0` — Notification UI patterns: toast notifications (Sonner), alert banners, inline alerts, notification d
- **email-templates** `v0.1.0` — Transactional email library via React Email. Cross-client HTML (Gmail/Outlook/Apple Mail/iOS Mail). 
- **env-var-scheme** `v0.1.0` — Environment variable organization — .env.example + .env.local + vercel.ts bindings + Zod runtime val
- **error-states-ui** `v2.0.0` — Error state UI patterns: 404/500 pages, error boundaries, empty states, offline indicators, retry pa
- **experimentation-layer** `v3.20.0` — A/B/n variant serving with GrowthBook, Statsig, or Vercel Edge Config. Quality-gate-aware winner sel
- **eye-tracking-simulation** `v0.1.0` — Predicted gaze-plot + F-pattern + Z-pattern overlays via saliency ML model. Identifies visual hierar
- **figma-variables-roundtrip** `v3.20.0` — Bidirectional sync between Design DNA tokens and Figma Variables / Tokens Studio. REST API v1 for Va
- **file-upload-media** `v2.0.0` — File upload patterns: drag-drop zones, image crop, multi-file with progress, video player, gallery/l
- **font-license-tracker** `v0.1.0` — Font license inventory. Every web font + custom font in project tracked with source, license, terms,
- **generative-archetype-synthesizer** `v1.0.0` — Usage flow for synthesizing bespoke archetypes — mine reference images, blend seed templates, write 
- **glow-neon-effects** `v2.0.0` — Neon glow effects, light bleeding, luminous borders, gradient glow, spotlight effects, and ambient l
- **gltf-authoring-pipeline** `v3.20.0` — glTF production pipeline: Blender export → gltf-transform optimization (Draco + Meshopt + KTX2) → CD
- **haptic-signature** `v3.20.0` — Mobile haptic brand signature — distinctive vibration patterns for reveal, success, and confirmation
- **hubspot-cms** `v0.1.0` — HubSpot CMS module + template + HUBL export patterns. Convert Genorah React components into HubSpot 
- **hubspot-crm-objects** `v0.1.0` — HubSpot CRM object integration beyond contacts — Deals, Companies, Tickets, Products, Line Items, Qu
- **hubspot-integration** `v2.0.0` — HubSpot CRM, Marketing, and CMS integration patterns for Next.js and Astro. UTK tracking, Forms API 
- **icon-system** `v2.2.0` — Icon system management: library selection, size scales, stroke weight per archetype, DNA color mappi
- **image-asset-pipeline** `v2.0.0` — Image and asset pipeline: OG image generation, favicon sets, SVG optimization, responsive art direct
- **image-cascade** `v0.1.0-provisional` — Graceful-degrade image generation pipeline — Flux 1.1 Pro Ultra → Flux Pro Raw → Ideogram 3 → nano-b
- **ingest-gap-report** `v3.21.0` — Unified gap tracking for ingestion. Collects every ambiguity, low-confidence token, unknown license,
- **inpainting-workflow** `v0.1.0-provisional` — Targeted asset edit loops via mask-based inpainting. Change character expression without re-generati
- **integrations-misc** `v0.1.0` — Grab-bag of integration patterns — Notion, Airtable, Framer import, Webflow/WordPress migration, Ico
- **interaction-replay** `v3.22.0` — Inventory + replay of motion and interaction from ingested sites. Playwright trace → Genorah motion 
- **interactive-content** `v0.1.0` — Interactive content patterns — ROI calculator, quiz with personalized result, product configurator, 
- **intro-preloader** `v2.3.0` — Branded page-load sequences: logo reveals, counter intros, progress bars with personality, content c
- **kinetic-typography** `v2.3.0` — Variable font axis animation, split-text character reveals, text-as-hero-image patterns (clip-path w
- **landing-page** `v3.1.0` — Landing page patterns including hero sections, CTAs, feature grids, testimonials, pricing tables, ma
- **layout-difference-metric** `v0.1.0` — Grid-aware layout difference beyond pixel diff. Bounding-box delta for element positions. Survives f
- **layout-techniques** `v2.3.0` — Advanced layout craft: asymmetric grids, whitespace composition, bento grid implementation, grid-bre
- **living-system-runtime** `v1.0.0` — Runtime-tunable Design DNA via 6 signal types — injects live environmental signals into CSS custom p
- **locale-formatting** `v0.1.0` — Intl API patterns — DateTimeFormat, NumberFormat, PluralRules, RelativeTimeFormat, ListFormat. Curre
- **long-form-content** `v0.1.0` — Blog post / case study / whitepaper generation with brand voice binding + archetype-band reading gra
- **low-bandwidth-mode** `v0.1.0` — 2G-viable mode — swap video→poster, reduce image quality 60%, defer non-critical JS, strip web fonts
- **lpips-similarity** `v0.1.0` — LPIPS (Learned Perceptual Image Patch Similarity) for visual diff beyond SSIM. More human-aligned. p
- **map-location** `v2.0.0` — Map and location UI patterns: Google Maps/Mapbox integration, store locators, location pickers, addr
- **markdown-mdx** `v2.0.0` — React-markdown with custom components, MDX integration, syntax highlighting, table of contents gener
- **mobile-asset-forge** `v0.1.0` — Mobile asset generation — adaptive icons, splash screens, store graphics per iOS/Android/Expo. Deriv
- **mobile-dna-bridge** `v0.1.0` — Cross-platform theme bridge translating Design DNA to iOS (SwiftUI), Android (Material You / Compose
- **mobile-expo** `v2.0.0` — Expo managed workflow patterns. Expo Router file-based routing, EAS Build/Submit, expo-font/expo-ima
- **mobile-flutter** `v2.0.0` — Flutter/Dart cross-platform patterns. ThemeData from DNA, Material 3 + Cupertino adaptive widgets, R
- **mobile-kotlin** `v2.0.0` — Kotlin/Jetpack Compose native Android patterns. Material 3 theming from DNA, Material You dynamic co
- **mobile-platform-idioms** `v0.1.0` — Platform-specific gestures, haptics, transitions. iOS swipe-back + UIImpactFeedback; Android predict
- **mobile-preview-companion** `v0.1.0` — QR-code preview for mobile builds via Expo Go or internal TestFlight links. /gen:preview mobile emit
- **mobile-quality-gate** `v0.1.0` — Mobile-specific quality gate supplementing quality-gate-v3. Measures 60/120fps, cold start <600ms, w
- **mobile-react-native** `v2.0.0` — React Native bare workflow patterns. DNA token translation, React Navigation, Zustand state, New Arc
- **mobile-swift** `v2.0.0` — Swift/SwiftUI native iOS development patterns. DNA token translation, Dynamic Type, SF Symbols, hapt
- **mobile-testing** `v0.1.0` — Simulator + real device testing per platform. Maestro + Detox + XCUITest + Espresso; EAS Build / Sub
- **multi-brand-governance** `v3.20.0` — One parent Design DNA → N sub-brand overlays with inheritance, override rules, and per-sub-brand dri
- **n8n-workflows** `v0.1.0` — Generate n8n workflow JSON from natural-language intent. Common patterns (Stripe→HubSpot→Slack, form
- **navigation-patterns** `v2.0.0` — Desktop navigation patterns: mega menus, multi-level dropdowns, sticky headers with scroll behavior,
- **nextjs-patterns** `v2.0.0` — Next.js 16 patterns for App Router and Pages Router: proxy.ts, async APIs, Cache Components, RSC, fo
- **notification-center** `v2.0.0` — In-app notification feeds, notification preferences, push notification setup, real-time notification
- **nuxt-patterns** `v3.1.0` — Nuxt 3 patterns: file-based routing, auto-imports, useFetch/useAsyncData, server routes (nitro), ISR
- **offline-first-mode** `v4.0.0` — GENORAH_OFFLINE=1 invariants — gate all network calls, stub external services, enable local-only pip
- **og-images** `v1.0.0` — Dynamic OG image generation from Design DNA tokens: branded 1200x630 social previews using next/og I
- **onboarding-tours** `v2.0.0` — Onboarding tour patterns: product tours, feature highlights, tooltip walkthroughs, coachmarks, progr
- **opentelemetry-traces** `v3.20.0` — OpenTelemetry SDK in Next.js/Nuxt/SvelteKit/Astro. Spans for route, DB, AI gateway, tool calls. OTLP
- **page-transitions** `v2.0.0` — Page transition system covering View Transitions API (native), Motion AnimatePresence, shared elemen
- **pbr-materials** `v0.1.0-provisional` — PBR material authoring for 3D assets — archetype-curated material sets with baseColor, roughness, me
- **performance-patterns** `v2.0.0` — Performance optimization: Core Web Vitals, image optimization, font loading, code splitting, virtual
- **persistent-canvas-pattern** `v4.0.0` — Single-Canvas architecture for 3D sections — one GPU context per page, sections receive portals, Fal
- **photoreal-compositing-pipeline** `v4.0.0` — Multi-layer photoreal composite via recipe-driven asset workers
- **pixel-dna-extraction** `v3.22.0` — Pixel-path DNA extraction from breakpoint screenshots. PNG sampling + k-means (k=12) with perceptual
- **preloader-animation** `v3.1.0` — Archetype-specific preloader patterns with duration budgets, performance compliance (LCP-safe via po
- **print-pdf** `v2.0.0` — Print and PDF patterns: print stylesheets, react-pdf generation, invoice/receipt layouts, resume tem
- **print-pdf-parity** `v0.1.0` — Print + PDF rendering parity. Brandkit PDF must match web. Paged Media CSS + @page rules + page-brea
- **privacy-policy-generator** `v0.1.0` — Privacy policy + TOS + accessibility statement generator. Archetype-aligned tone. Jurisdiction-aware
- **propstack-integration** `v2.0.0` — Propstack real estate CRM integration. Property listings, lead capture, expose PDF generation, searc
- **r3f-physics-rapier** `v3.20.0` — Physics in R3F via Rapier (WASM). Rigid bodies, colliders, constraints, soft-bodies. Deterministic, 
- **rating-review** `v2.0.0` — Star ratings, review forms, aggregate rating displays, review cards, and helpful vote patterns with 
- **react-vite-patterns** `v2.0.0` — React/Vite SPA patterns: client-side routing, Vite setup, no-SSR patterns, DNA integration for singl
- **recraft-vector-ai** `v0.1.0-provisional` — Native SVG output via Recraft V3 (or Adobe Firefly vectors). Produces logo variants, icon sets, illu
- **remotion-section-video** `v3.0.0` — Programmatic section-video generation via Remotion. 5 DNA-parameterized templates (kinetic-type, par
- **remotion-video** `v2.0.0` — Programmatic video content generation with Remotion. DNA-aware compositions for hero video, product 
- **rsc-patterns** `v0.1.0` — Server component / streaming / cache-components patterns per framework. Next.js 16 PPR + Cache Compo
- **scene-composition** `v0.1.0-provisional` — Multi-object 3D scene graphs with camera choreography, lighting rigs per archetype, and HDRi library
- **scroll-coherence-validator** `v4.0.0` — Hard gate #6 — enforces single PersistentCanvas for cinematic/immersive 3D intensity; prevents multi
- **search-ui** `v2.0.0` — Search UI patterns: full-text search with Algolia/Meilisearch, faceted filtering, search results pag
- **self-improving-judge** `v4.0.0` — Quarterly recalibration via delta log — judge weights drift toward empirical SOTD correlations
- **seo-keyword-gaps** `v3.2.0` — Competitive keyword-gap analysis — identify queries competitors rank for that the current site doesn
- **server-driven-ui** `v3.20.0` — JSON-schema → component tree renderer. CMS-authored pages beyond MDX: ordered blocks, typed props, D
- **shadcn-components** `v2.0.0` — Deep knowledge of all shadcn/ui components, variants, props, composition patterns, multi-select tags
- **shape-asset-generation** `v2.0.0` — Procedural shape generation, SVG assets, and decorative elements. Purpose-primary taxonomy, per-arch
- **shopify-integration** `v2.0.0` — Shopify headless e-commerce patterns using Storefront API. Product catalog, collections, cart, check
- **signature-dna-forge** `v1.0.0` — Bespoke 3D signature mark generation via Rodin API — uniqueness ledger collision check, up to 3 muta
- **skeleton-loading** `v3.1.0` — Skeleton loading patterns: shimmer placeholders, content-aware skeletons, Suspense boundaries, strea
- **skill-usage-analytics** `v0.1.0` — Skill injection analytics. Which of N skills are actually loaded? Candidates for auto-deprecation. L
- **slo-error-budgets** `v3.20.0` — Service Level Objectives and error budgets. SLO config, burn rate alerts (fast + slow), user-facing 
- **smooth-scroll-setup** `v2.3.0` — Lenis smooth scroll integration for React/Next.js/Astro. The 'expensive feel' foundation that separa
- **social-asset-variants** `v0.1.0` — Per-post + per-page social asset pack. OG (1200×630) + Twitter card + LinkedIn + Instagram feed/stor
- **social-features** `v2.0.0` — Social feature patterns: threaded comments, reactions/emoji picker, share buttons, embed cards, soci
- **sonic-logo** `v3.20.0` — Audio brand signature — 200-800ms sonic mark triggered on hero reveal, CTA success, or brand-moment 
- **speculation-rules** `v3.2.0` — Speculation Rules API — progressive-enhancement prerender/prefetch for instant navigation. Chrome/Ed
- **sqlite-vec-memory-graph** `v4.0.0` — Cross-project memory via @genorah/memory-graph — sqlite-vec embeddings, node/edge schema, semantic r
- **streaming-pipeline-events** `v4.0.0` — AG-UI events emitted during pipeline execution — AGENT_STATE_UPDATE, RUN_STARTED, STEP_FINISHED, RUN
- **stripe-integration** `v2.0.0` — Stripe payment integration patterns for Next.js and Astro. Checkout Sessions, Payment Intents, Subsc
- **structured-data** `v1.0.0` — Typed JSON-LD schemas for all major page types via @graph combination, GEO-optimized content pattern
- **supabase-auth** `v0.1.0` — Supabase Auth patterns — email/password, OAuth, magic link, phone, MFA (TOTP/SMS), Passkeys/WebAuthn
- **supabase-edge-functions** `v0.1.0` — Supabase Edge Functions — Deno runtime, scheduled functions via pg_cron, HTTP functions, webhook han
- **supabase-postgres** `v0.1.0` — Supabase Postgres patterns — schema gen from content model, migrations, seeders, indexes, full-text 
- **supabase-realtime** `v0.1.0` — Supabase Realtime — Postgres Changes (table subscriptions), Presence (who's online), Broadcast (ephe
- **supabase-rls** `v0.1.0` — Row Level Security policy patterns. Per-table + per-operation + role-based. Common patterns library 
- **supabase-storage** `v0.1.0` — Supabase Storage — bucket creation, signed URLs, direct browser upload with RLS policies, image tran
- **supabase-vector** `v0.1.0` — pgvector patterns for RAG + similarity search. Embedding storage, nearest-neighbor queries, ivfflat 
- **svelte-patterns** `v3.1.0` — Svelte 5 + SvelteKit 2 patterns: runes ($state, $derived, $effect), form actions, load functions, ad
- **synthetic-user-streaming** `v4.0.0` — Mid-wave synthetic persona streaming — 6 personas emit AGENT_STATE_UPDATE events as they traverse se
- **telemetry-rum** `v0.1.0` — Real-user monitoring + telemetry integration. Vercel Analytics / Speed Insights / PostHog / Plausibl
- **testing-patterns** `v2.0.0` — Testing patterns: Vitest, React Testing Library, accessibility testing, visual regression, E2E with 
- **texture-provenance** `v4.0.0` — Full provenance tracking for AI-generated assets via MANIFEST.json
- **theatre-choreography** `v4.0.0` — Theatre.js 0.7.x keyframe authoring, JSON export, runtime playback via @theatre/core, and scroll-to-
- **three-d-webgl-effects** `v3.0.0` — 3D and WebGL effects with React Three Fiber. Composable shader building blocks, three-tier responsiv
- **translation-pipeline** `v0.1.0` — Automated translation with staged human-review gate. DeepL for major locales + Claude for brand voic
- **tremor-friendly** `v0.1.0` — Motor-impairment-friendly interaction — larger hit zones, confirmation dialogs, longer timeouts, avo
- **upscaling** `v0.1.0-provisional` — Raster upscaling via Real-ESRGAN (local) or SUPIR (via Replicate). Preserves detail on hero backgrou
- **url-scrape-ingestion** `v3.21.0` — Ingest existing live site via Playwright crawl. Captures HTML + CSS + JS bundles, computed styles pe
- **user-global-asset-cache** `v4.0.0` — sha256-keyed cross-project asset cache at ~/.claude/genorah/asset-cache/
- **ux-patterns** `v2.0.0` — UX intelligence patterns for navigation, forms, feedback, and content discovery. Ensures sites are n
- **variant-tournament** `v3.0.0` — Blind-ranked AI variant competition for high-stakes beats (HOOK/PEAK). N parallel builds, vision-jud
- **vercel-botid** `v3.20.0` — Vercel BotID (GA 2025-06) — bot detection and verification. Protects AI endpoints, forms, and signup
- **vercel-sandbox** `v3.20.0` — Vercel Sandbox (GA 2026-01) — sandboxed code execution for user-provided code. Use for in-product pl
- **video-script-gen** `v0.1.0` — DNA-voiced video scripts for Remotion compositions. Timed scenes, typographic animations via DNA dis
- **visual-regression** `v2.8.1` — Visual regression testing: capture baseline screenshots at 4 breakpoints after successful build, dif
- **visual-regression-gen** `v0.1.0` — Visual regression baseline + diff via Playwright toMatchSnapshot. 4-breakpoint coverage per section.
- **voice-control-a11y** `v0.1.0` — Voice control (Dragon, Voice Access, Voice Control on macOS/iOS) compatibility. Every interactive el
- **voice-ui** `v0.1.0` — Voice UI pattern library — Web Speech API (free) + OpenAI Realtime + Gemini Live + ElevenLabs premiu
- **vue-patterns** `v3.1.0` — Vue 3 Composition API patterns: <script setup>, composables, Pinia state, reactive refs, computed, w
- **webgl2-fallback-generator** `v4.0.0` — For every WebGPU compute effect, emit an equivalent GLSL 3.0 fragment/vertex shader via Three.js Sha
- **webgpu-compute-shaders** `v4.0.0` — WGSL compute pipeline patterns for hair, foliage, fluid, and particle effects — device request, buff
- **webxr-ar** `v0.1.0` — AR product preview + scene scanning + hit testing + occlusion via WebXR + iOS Quick Look (USDZ) + An
- **woocommerce-integration** `v2.0.0` — WooCommerce headless e-commerce patterns via REST API v3. Product sync, cart with CoCart, checkout, 

### Utility (on-demand) (52)

- **ai-pipeline-features** `v1.0.0` — --- name: "ai-pipeline-features" description: "AI features within the Genorah pipeline itself. AI-
- **ai-ui-components** `v1.0.0` — --- name: "ai-ui-components" description: "AI Elements integration guide. Component reference for 
- **ai-ui-patterns** `v1.0.0` — --- name: "ai-ui-patterns" description: "AI product design pattern catalog. 8 patterns for chat, s
- **anti-slop-gate** `v1.0.0` — --- name: anti-slop-gate description: "35-point weighted quality scoring across 7 categories. Post
- **api-patterns** `v1.0.0` — --- name: "api-patterns" description: "Server-side API integration patterns: CRM forms, webhooks, 
- **baked-in-defaults** `v1.0.0` — --- name: "baked-in-defaults" description: "Templates for mandatory motion, responsive, and compat
- **behavioral-prediction** `v3.2.0` — Vision-LLM predicts attention heatmap + click targets on generated screenshots before ship. Surfaces
- **component-consistency** `v1.0.0` — --- name: "component-consistency" description: "Component registry enforcement rules. DESIGN-SYSTE
- **component-marketplace** `v1.0.0` — --- name: component-marketplace description: "When-to-use guidance for Aceternity UI, Magic UI, 21
- **copy-intelligence** `v1.0.0` — --- name: copy-intelligence description: "Brand voice generation engine with content bank, tiered 
- **creative-direction-format** `v1.0.0` — --- name: creative-direction-format description: "Comprehensive format for presenting creative dir
- **creative-tension** `v1.0.0` — --- name: creative-tension description: "Controlled rule-breaking system with 5 tension levels, pe
- **cross-pollination** `v1.0.0` — --- name: cross-pollination description: "Industry-specific convention catalogs and distant-indust
- **dark-light-mode** `v1.0.0` — --- name: "dark-light-mode" description: "Archetype-aware dark/light mode with independently desig
- **design-archetypes** `v1.0.0` — --- name: design-archetypes description: "25 opinionated design personality systems (19 original +
- **design-brainstorm** `v1.0.0` — --- name: design-brainstorm description: "Research-first creative direction engine. Studies Awwwar
- **design-dna** `v1.0.0` — --- name: design-dna description: "Machine-enforceable visual identity system. Defines 12 color to
- **design-system-export** `v1.0.0` — --- name: "design-system-export" description: "Export generated design systems as Storybook 10 sto
- **design-system-scaffold** `v1.0.0` — --- name: design-system-scaffold description: "Wave 0 scaffold generator: Tailwind v4 @theme from 
- **desktop-patterns** `v1.0.0` — --- name: "desktop-patterns" description: "Tauri v2 and Electron desktop-aware design: custom titl
- **ecommerce-ui** `v1.0.0` — --- name: "ecommerce-ui" description: "E-commerce UI patterns: product cards, product grids, cart 
- **emotional-arc** `v1.0.0` — --- name: emotional-arc description: "Page storytelling system with 10 beat types. Each beat has h
- **error-recovery** `v1.0.0` — --- name: "error-recovery" description: "Structured error diagnosis, severity classification, fix 
- **figma-integration** `v1.0.0` — --- name: "figma-integration" description: "Figma design import via MCP tools, DNA token translati
- **form-builder** `v2.0.0` — Form UI patterns: accessible form layouts, validation feedback, multi-step forms, DNA-styled inputs,
- **geo-optimization** `v1.0.0` — --- name: "geo-optimization" description: "Generative Engine Optimization for AI search visibility
- **git-workflow** `v3.2.0` — Git workflow automation — DNA-tagged commit templates per emotional beat, PR body generation from SU
- **gltf-optimization** `v3.0.0` — GLTF asset pipeline: Draco geometry compression, Meshopt, KTX2/BasisU textures, LOD generation, budg
- **i18n-rtl** `v3.0.0` — Internationalization and RTL patterns: CSS logical properties, Tailwind logical utilities, next-intl
- **image-prompt-generation** `v1.0.0` — --- name: image-prompt-generation description: "DNA-matched AI image prompt generation. Tool-agnos
- **lighthouse-ci-setup** `v3.2.0` — Lighthouse CI + Playwright preview-smoke scaffold for Genorah projects. Per-beat assertion matrix fr
- **mobile-performance** `v1.0.0` — --- name: "mobile-performance" description: "Mobile app performance suite. Build-time analysis, pe
- **multi-page-architecture** `v1.0.0` — --- name: "multi-page-architecture" description: "Site-level DNA extensions, page-type templates w
- **obsidian-integration** `v1.0.0` — --- name: "obsidian-integration" description: "Obsidian vault integration for project visualizatio
- **performance-guardian** `v1.0.0` — --- name: performance-guardian description: "Non-animation web performance: Core Web Vitals budget
- **portfolio-patterns** `v1.0.0` — --- name: "portfolio-patterns" description: "Portfolio UI patterns: project showcases, case study 
- **progress-reporting** `v1.0.0` — --- name: "progress-reporting" description: "Multi-level progress reporting protocol: per-task tra
- **quality-gate-v2** `v1.0.0` — --- name: "quality-gate-v2" description: "72-point quality gate reference — 12 categories x 6 crit
- **quality-learning** `v2.8.1` — Self-improving quality loop: accumulate project scores in Obsidian Knowledge Base, query empirical p
- **reference-benchmarking** `v1.0.0` — --- name: reference-benchmarking description: "Defines per-section quality targets from award-winn
- **responsive-design** `v1.0.0` — --- name: "responsive-design" description: "Mobile-first responsive design with 375px floor, hybri
- **search-visibility** `v1.0.0` — --- name: "search-visibility" description: "IndexNow instant indexing, AI-aware robots.txt presets
- **seo-meta** `v1.0.0` — --- name: "seo-meta" description: "Core SEO patterns: meta tags, canonical URLs, sitemaps, robots.
- **shakedown-harness** `v3.19.0` — Seeded-brief full-pipeline smoke test. Runs Discovery → Post-ship Learning on curated fixtures and e
- **spline-integration** `v1.0.0` — --- name: spline-integration description: "Spline 3D scene embedding with DNA color mapping, event
- **ssr-dynamic-content** `v1.0.0` — --- name: "ssr-dynamic-content" description: "SSR/ISR/streaming/Cache Components decision guidance
- **store-submission** `v1.0.0` — --- name: "store-submission" description: "App Store and Play Store pre-submission validation. Ass
- **telemetry-first-run** `v4.0.0` — First-run prompt for opt-in plugin telemetry. Shown once per user at first SessionStart in v3.19+. R
- **ui-ux-pro-max-distilled** `v3.1.0` — Meta-skill documenting Genorah's distillation of UI UX PRO MAX (MIT) assets: palette seeds (160→24 c
- **user-style-adapter** `v3.1.0` — Detects user communication style (high-context vs low-context, terse vs verbose, technical vs busine
- **ux-intelligence** `v1.0.0` — --- name: "ux-intelligence" description: "12 enforceable design intelligence domains covering prop
- **visual-companion-screens** `v1.0.0` — --- name: "visual-companion-screens" description: "HTML fragment templates for visual companion sc

