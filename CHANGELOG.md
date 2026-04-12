# Changelog

## v3.25.0 — 2026-04-12

**Test hardening: exact-preset easing baselines, sitemap error observability, localized-field Contentful coverage.**

### Exact-preset easing baselines (+ fixture bug fixed)

- `tests/v325-easing-baselines.test.mjs` — 8/8. One test per preset in the fitter (linear / ease-out / ease-in / ease-in-out / ease-out-expo / ease-out-quart / spring) plus an ambiguous-curve regression.
- **Bug found while writing these**: initial fixture generated frames using bezier *parameter* t as the timestamp, but the fitter compares samples against curve *x(t)* values — so "linear" samples weren't linear-in-real-time. 6/8 tests failed catching presets as wrong neighbors. Fixed by generating fixtures from full `bezierXY(t)` pairs so `timestamp = x·duration` matches the fitter's internal curve. Now every preset fits exactly (RMSE < 0.05, confidence ≥ 0.85). Ambiguous curve between `ease-out` and `ease-out-expo` stays in the ease-out family.

### Sitemap BFS error observability

- `scripts/ingest/crawl-executor.mjs`: `collectSitemapUrls` now accepts `onEvent` callback. Wired from the crawl-executor site to `append(slug, ev)`, so every fetch failure, parse error, depth-exceeded, empty index, or unrecognized XML root surfaces in the preservation ledger instead of silent skip.
- New gap reasons: `sitemap-fetch-failed`, `sitemap-unrecognized-root`, `sitemap-depth-exceeded`, `sitemap-index-empty`.
- New progress events: `sitemap.index` (children count + depth), `sitemap.urlset` (added count + depth).
- `tests/v323-sitemap-bfs.test.mjs` expanded to 8/8 — 4 original + 4 error-path (fetch failure via unreachable port, unrecognized RSS root, empty sitemapindex, urlset progress event).

### Contentful localized-field coverage

- `tests/v324-cms-schema.test.mjs` — Contentful fixture expanded to 3 fields per type including `Link<Entry>` variant, multi-locale FAQ with localized `question` + `answer` but non-localized `tags`, non-localized `media` on hero.
- Now asserts: `Link<Asset>` vs `Link<Entry>` disambiguation, exact count of localized fields per type (`localizedFaqFields.length === 2`), field-level required + localized per-field preservation.

### Totals

- **109/109 tests pass** (+12 from v3.24: 8 easing baselines + 4 sitemap error events).
- Mirror parity, plugin.json + marketplace.json + package.json at 3.25.0.

## v3.24.0 — 2026-04-12

**Integration tests for v3.22–v3.23 executors + command exposure.**

### Integration tests (synthetic + mock)

- `tests/v324-interaction-replay.test.mjs` — 4/4. Fabricates Playwright-trace NDJSON with known opacity curves, runs `interaction-replay.mjs` as subprocess, asserts easing family is recognized (ease-out-expo → ease-out-family, linear → linear), library fingerprint surfaced (GSAP), MOTION-INVENTORY.md contents, ledger events (`capture.motion-event`, `motion.library-detected`, `motion.fit`), non-zero exit on empty trace with paired `gap:trace-empty-or-unsupported-format`.
- `tests/v324-cms-schema.test.mjs` — 5/5. Local `node:http` servers mock Sanity GROQ, Contentful CMA, and Payload REST responses. Script routed via `SANITY_BASE` / `CONTENTFUL_BASE` env overrides (new) and Payload's existing `--base` flag. Asserts block mapping (`heroBanner → hero`, `pricingPlan → pricing`, `faqItem → faq`, `pages → page-shell`, `articles → article`), `mysteryWidget → unknown` emits paired `gap:cms-type-unmapped`, Contentful field metadata preserved (type/linkType/required/localized), Payload system fields filtered (id/createdAt/updatedAt), fail-fast on missing credentials, refusal on unknown `--cms`.

### Bug caught by integration tests

- Initial CMS test hung: `spawnSync` blocks the parent event loop, starving the in-process mock HTTP server of accept cycles. Fixed by introducing `spawnAsync` helper using `child_process.spawn` + Promise. 0.7s total for 5 tests instead of >30s hangs.

### Runtime change

- `scripts/ingest/cms-schema.mjs` — Sanity and Contentful base URLs now overridable via `SANITY_BASE` / `CONTENTFUL_BASE` env for testing / private Sanity mirrors / Contentful EU region. No behavior change when unset.

### Command surface

- `/gen:ingest` argument-hint expanded: `<codebase|url|route|diff|gap|verify|resolve|motion|cms>`.
- New subcommand: `motion <slug> <extracted-trace-dir>` documented with trace-extract prerequisite.
- New subcommand: `cms <slug> --cms=<sanity|contentful|payload>` with per-platform flag examples.

### Totals

- **97/97 tests pass** (+9 from v3.23: 4 interaction-replay + 5 CMS schema).
- Mirror parity, plugin.json + marketplace.json + package.json at 3.24.0.

## v3.23.0 — 2026-04-12

**Four deferred items cleared — all functional, all tested.**

### ΔE2000 perceptual color distance

- Full Sharma/Wu/Dalal (2005) CIEDE2000 implementation in `scripts/ingest/pixel-kmeans.mjs`.
- sRGB → linear → XYZ (D65) → CIELAB → ΔE2000 pipeline, ~60 lines pure Node.
- Replaces rMean-weighted approximation as default distance metric for k-means.
- Escape hatch: `GENORAH_KMEANS_FAST=1` env falls back to rMean for speed.
- Tests: 8/8 (`tests/v323-delta-e2000.test.mjs`) — identity, symmetry, JND threshold (<2.3), black/white ~100, perceptually distinct greens >10, Lab white/black endpoints.

### Recursive sitemap BFS

- `crawl-executor.mjs` now handles `<sitemapindex>` with nested `<sitemap><loc>` entries, not just flat `<urlset>`.
- Depth-capped (default 3), URL-capped (default 500), cycle-safe via Set.
- Captures `<lastmod>` alongside `<loc>`; emits `sitemap.bfs` + per-entry `sitemap.entry` ledger events.
- Tests: 4/4 (`tests/v323-sitemap-bfs.test.mjs`) — flat urlset, nested sitemap index (3 URLs from 2 leaves), maxUrls cap, empty handling.

### Interaction replay executor

- `scripts/ingest/interaction-replay.mjs` parses Playwright-trace NDJSON (pre-extracted directory).
- Library fingerprinting from network requests: GSAP, Framer Motion, Motion One, Lottie, Rive, React Spring.
- Per-selector animation extraction: pairs consecutive DOM snapshots, derives (duration, property, samples).
- Easing-family fitting against 7 presets (linear, ease-in, ease-out, ease-in-out, ease-out-expo, ease-out-quart, spring) via cubic Bezier curve + RMSE.
- Confidence = rmse-banded (rmse<0.1 → 0.85, <0.2 → 0.6, else 0.4); low-confidence fits auto-emit paired `gap:motion-low-confidence`.
- Emits `MOTION-INVENTORY.md` with per-selector YAML; `motion.fit` + `motion.library-detected` ledger events.

### CMS schema executors

- `scripts/ingest/cms-schema.mjs` dispatches by `--cms=<sanity|contentful|payload>`.
- **Sanity**: GROQ type enumeration via `array::unique(*[]._type)`, field shape from sample doc.
- **Contentful**: CMA `/environments/<env>/content_types` — full field metadata (type, linkType, required, localized).
- **Payload**: `/api/access` collection discovery, OpenAPI fallback via `/api/api-docs.json`, per-collection sample probe.
- Block-mapping heuristic proposes `hero / feature-grid / pricing / testimonial / faq / cta / article / page-shell` per type name regex; unmapped types emit `gap:cms-type-unmapped`.
- Emits `CMS-SCHEMA.md` + `manifests/cms-schema.json`.
- Ledger events: `cms.schema-export`, `cms.type-map`.

### Totals

- **287 skills**, **59 commands**, **24 agents**.
- **88/88 tests pass** (+12 from v3.22: 8 ΔE2000 + 4 sitemap BFS).
- Mirror parity, plugin.json + marketplace.json + package.json all at 3.23.0.

## v3.22.0 — 2026-04-12

**Ingestion depth + E2E proven.**

v3.22 hardens and extends v3.21 preservation-first ingestion. Full E2E run against the plugin repo itself surfaced real bugs (fixed), validated invariants, and produced coherent top-3 archetype inference (ai-native / ethereal / y2k).

### E2E-discovered fixes (from v3.21 shakedown)

- `codebase-scan.mjs`: Windows path dir-extraction bug — now uses `path.dirname`. Race on volatile cache files — now logs `error` event and continues. Added `.claude/` to `SKIP_DIRS`.
- `archetype-score.mjs`: cwd-relative `testable-markers.json` path broke when ingest ran outside plugin — now looks script-relative first, then cwd, then `GENORAH_MARKERS_PATH` env. Marker shape updated for `{archetypes: {<name>: {mandatory, forbidden, signature}}}` with bucket weighting (mandatory=1, signature=1.5, forbidden=-2).

### New capabilities

**Crawl executor** (`scripts/ingest/crawl-executor.mjs`)
- Consumes `CRAWL-PLAN.json` from `crawl.mjs`, drives Playwright.
- Fetches robots.txt / sitemap.xml / llms.txt, then BFS over sitemap URLs.
- Per route: HTML + 4-breakpoint screenshots + computed-styles (200-selector sample).
- Records `capture.route`, `capture.screenshot`, `capture.computed-styles` ledger events.
- Falls back to `gap:playwright-unavailable` when lib absent, keeps plan emission path via MCP delegation.

**Pixel-path DNA extraction** (`scripts/ingest/pixel-kmeans.mjs` + `skills/pixel-dna-extraction/`)
- K-means (k=12) on 1%-sampled PNG pixels across all captured breakpoints.
- Perceptual distance (rMean-weighted RGB, ΔE2000-approximation).
- Role-based slot assignment: bg by frequency, text by opposite luminance, primary/secondary/accent by saturation rank.
- Confidence = `min(0.95, 0.5 + coverage × 5)`; low-coverage slots auto-emit paired `gap:dna-low-confidence` (preservation invariant).
- Optional `pngjs` peer; absence emits actionable remedy in ledger.

**Interaction replay** (`skills/interaction-replay/`)
- Playwright trace → `MOTION-INVENTORY.md` with per-selector trigger + duration + easing + stagger.
- Easing-family fitting (linear / cubic-bezier / spring) from sampled transform/opacity over time.
- Bundle fingerprint detects source library (GSAP / Framer Motion / Motion One / CSS @keyframes).
- Feeds `animation-specialist` when `/gen:build` runs on ingested slug.

**CMS reconnect** (`scripts/ingest/cms-detect.mjs` + `skills/cms-reconnect/`)
- Fingerprint detection for Sanity, Contentful, Payload, WordPress, Strapi, Builder.io, Storyblok, Shopify.
- Records `cms.detected` with evidence; emits `gap:cms-credentials-missing` unless `--cms-token` + `--cms-project` provided.
- Future: schema export → SDUI block type proposals in `CMS-SCHEMA.md`.

### New tests

- `tests/v321-ingest-ledger.test.mjs` expanded: 7/7 (was 5/5). Added `content.extract` destination invariants (BLOCK on invalid, PASS on valid).

### E2E results (plugin self-ingest)

```
Captured 1251 files (0 skipped) → .planning/genorah/ingested/self
DNA extracted (css-var path): 0 tokens, 12 gaps (expected — plugin is docs, no design tokens)
Archetype inference → ai-native(1.00), ethereal(0.67), y2k(0.52)
CMS detected: payload(2), strapi(2) — from integration skill mentions
Verify: 1267 events, 1251 captures, 12 gaps paired, 0 findings, verdict PASS
```

### Skills (+3)

`pixel-dna-extraction` (domain), `interaction-replay` (domain), `cms-reconnect` (domain). Count: 287.

## v3.21.0 — 2026-04-12

**Preservation-first project ingestion.**

Bring existing projects into the Genorah pipeline without losing any detail. Codebase or live URL. Every byte captured, every transformation logged in an append-only preservation ledger, every derived artifact (DNA, archetype, components, content) traceable back to origin.

### New

- `/gen:ingest` command with 7 subcommands: `codebase`, `url` (consent-gated), `route`, `diff`, `gap`, `verify`, `resolve`.
- 9 skills: `codebase-ingestion`, `url-scrape-ingestion`, `dna-reverse-engineer`, `archetype-inference`, `content-extraction`, `component-mapping`, `asset-provenance`, `preservation-ledger` (core tier), `ingest-gap-report`.
- 6 scripts under `scripts/ingest/`: `preservation-ledger.mjs` (functional), `codebase-scan.mjs` (functional), `crawl.mjs` (plan emitter for Playwright MCP), `dna-extract.mjs` (CSS-variable path functional; pixel extraction stubbed), `archetype-score.mjs` (functional against `testable-markers.json`), `asset-download.mjs` (functional fetch + sha256 + license heuristic).
- Architecture doc: `docs/v3.21-ingestion-architecture.md`.
- Tests: `tests/v321-ingest-ledger.test.mjs` — 5/5 passing (roundtrip, verify invariants, license-gap pairing, dna-low-confidence-gap pairing, kind required).

### Preservation contract

1. Source captured verbatim under `source/` (codebase) or `captured/` (URL). Never mutated.
2. `preservation.ledger.ndjson` — append-only NDJSON. Every capture, extract, match, map, gap, and user decision.
3. No silent drops. Unmappable items → `GAP-REPORT.md` with user-decision prompts.
4. Archetype inference returns top-3 with confidence — never auto-locks.
5. `license-unknown` assets block scaffold stage until user confirms.
6. PII scan runs on extracted content; matches go to gap report, not CONTENT.md.
7. `/gen:ingest verify` asserts preservation invariants: every source file has capture event, every asset has license or paired gap, every low-confidence DNA token has paired gap, every content extract has valid destination.

### Artifact layout

```
.planning/genorah/ingested/<slug>/
├── INGESTION.md / DNA-EXTRACTED.md / ARCHETYPE-MATCH.md
├── CONTENT.md / DESIGN-SYSTEM.md / GAP-REPORT.md
├── preservation.ledger.ndjson
├── source/ or captured/ + screenshots/ + computed-styles/ + assets/
└── manifests/{routes,components,assets,fonts}.json
```

### Legal gates

- `/gen:ingest url` refuses without `--consent` flag.
- robots.txt honored; disallowed routes logged as `gap:robots-disallow`.
- Asset license defaults to `unknown`; no silent inference (Unsplash/Pexels etc. emit hint + require user confirm).

## v3.20.0 — 2026-04-12

**Frontier axes unlocked.**

v3.19 shipped calibration + production hardening; v3.20 introduces 9 frontier capability axes. 275 skills, 58 commands.

### v3.19 — Calibration & Production Hardening

- **Shakedown harness** — `scripts/shakedown.mjs` + `/gen:shakedown` command runs seeded brief through all 15 pipeline stages; emits spec-vs-reality gap report. Gates stable promotion.
- **Telemetry first-run consent** — v3.19+ shows opt-in prompt once per user on first SessionStart; decision persisted in `~/.claude/genorah/telemetry-consent.json`. Opt-out remains default in CI/headless.
- **`/gen:recalibrate --headless` + `--cron`** — fail-closed on ΔRMSE > 0.1 or κ < floor; auto-invokes shakedown; Prometheus gauges on stdout for scheduled jobs.
- **PROVISIONAL → measured** — R1/R5/R7 thresholds pending first quarterly calibration pass against 5 seeded goldens + synthetic personas.

### v3.20 — 9-Axis Frontier

1. **Agentic UX** — `agentic-ux-patterns` + `agent-trace-ui` skills + `/gen:agents` command. Multi-step AI SDK v6 flows via Vercel AI Gateway (`'anthropic/claude-sonnet-4.6'`), `stopWhen: stepCountIs(N)`, tool calling with Zod, agent-trace UI (Plan / ToolCallCard / ApprovalGate / Progress / TraceTimeline).
2. **Server-driven UI** — `server-driven-ui` skill. JSON-schema → discriminated-union block tree for CMS-authored pages beyond MDX; per-block hydration boundary; DNA enforcement on every block.
3. **Brandkit v2** — 4 skills: `brand-motion-sigils` (Rive + Lottie), `sonic-logo` (consent-gated audio mark), `haptic-signature` (Web Vibration + iOS `.sensoryFeedback` + Android Compose + RN Haptics), `figma-variables-roundtrip` (DTCG-compliant bidirectional sync, Tokens Studio or Figma Variables REST).
4. **Multi-brand governance** — `multi-brand-governance` skill + `/gen:multibrand` command. Parent DNA + N sub-brand overlays with inheritance + `DRIFT-POLICY.md` per child + drift check per build.
5. **Experimentation layer** — `experimentation-layer` skill + `/gen:experiment` command. GrowthBook/Statsig/Edge-Config A/B/n with quality-gate-aware winner selection (variants below Design 200 / UX 100 auto-disqualified regardless of CVR).
6. **3D scene depth** — `3d-scene-composer` + `r3f-physics-rapier` + `gltf-authoring-pipeline` skills. Narrative R3F scenes with archetype-keyed lighting rigs, Rapier WASM physics (≤ 200 bodies desktop), glTF pipeline with Draco + Meshopt + KTX2 + budget enforcement + license capture.
7. **Commerce depth v2** — `commerce-hydrogen` + `commerce-medusa` skills. Shopify Hydrogen/Oxygen with B2B Catalog; Medusa v2 self-hosted with multi-region/currency/tax; complements existing Stripe + Shopify + WooCommerce.
8. **Observability / SRE** — `opentelemetry-traces` + `slo-error-budgets` skills. OTLP export to Grafana Cloud / Honeycomb / Vercel Observability; SLOs with fast + slow burn-rate alerts; error-budget-gated deploys; public status pages.
9. **Edge-native patterns** — `vercel-sandbox` + `vercel-botid` skills. Sandbox (GA 2026-01) for AI-generated and untrusted code execution; BotID (GA 2025-06) for AI endpoint + form protection without CAPTCHA.

### Upgrade notes

- Telemetry consent prompt auto-fires on first v3.19+ session — no action required for existing opted-out users.
- Sub-brand overlays must declare `DRIFT-POLICY.md` or `/gen:build --brand=<name>` will block.
- Experiment winners must pass `/gen:audit` — failing variants no longer eligible regardless of statistical significance.
- Agentic UX flows must route through Vercel AI Gateway (OIDC); raw `@ai-sdk/anthropic` imports flagged by `posttooluse-validate`.

## v3.18.0 — 2026-04-12 (stable)

**Measurably Enforced Quality with Closed-Loop Refinement.**

Stable promotion from v3.18.0-rc.1 after clean validation: 69/69 tests pass, 0 self-audit BLOCK/WARN, 0 frontmatter violations across 252 skills, mirror parity verified.

Final inventory: 54 commands, 252 skills, 24 specialist agents, 8 MCP integrations (+ 3 scaffolds), 33 Design Archetypes + formal mixing protocol, 14-stage pipeline, 8-layer Context Fabric, 10-track research program, 354-pt two-axis quality gate (Design 234 + UX 120) with 6 UX Integrity sub-gates.

## Journey: v3.4.1 → v3.18.0 (22 releases)

### v3.4.x — 3dsvg foundation
- **v3.4.1** (release) — 3dsvg Hero Mark Automation, 75 archetype-curated presets, `<GenorahSVG3D>` wrapper, SVG sanitization, Hero Mark Compliance sub-gate
- **v3.4.2-rc.1** — Enforcement Closure Tier 1 (archetype testable-markers pilot, DNA drift hard-block, motion-health measurement, SSIM cap, cascade transparency)

### v3.5.x — Quality Spine, Asset Forge, Context Fabric, Generation Depth
- **v3.5.0-rc.1** — Quality-gate-v3 two-axis + Asset Forge foundation + 6 UX sub-gates + `/gen:assets` + `/gen:align` + `/gen:ship-check` + `/gen:ux-audit` + `/gen:narrative-audit`
- **v3.5.1-rc.1** — Generation depth (ux-probe, Pareto, RAG, image cascade, PBR, scene composition)
- **v3.5.2-rc.1** — Adversarial critics + character consistency + trajectory tracking
- **v3.5.3-rc.1** — Context Fabric complete + full 14-stage pipeline + research infrastructure
- **v3.5.4-rc.1** — Execution Closure (11 runtime scripts + 4 hook upgrades + Meshy MCP)
- **v3.5.5-rc.1** — Data Foundation (25/25 archetype matrices + 5 goldens + 4 RAG entries)
- **v3.5.6-rc.1** — Reliability + Observability (error taxonomy + wave-resume + cost tracker + dashboard v2 data)
- **v3.5.7-rc.1** — Phase 1 closure (E2E canary + tutorial + glossary + FAQ + migration guide)

### v3.6–v3.9 — New axes
- **v3.6.0-rc.1** — Backend + Ops (RSC + API routes + DB schema + env scheme + deploy preview + canary + telemetry + background jobs)
- **v3.7.0-rc.1** — Mobile depth (asset forge + quality-gate variant + DNA bridge + testing + platform idioms + preview)
- **v3.8.0-rc.1** — AI-native + personalization (voice UI + WebXR + adaptive DNA + AI chat v6 + Passkeys + active UX)
- **v3.9.0-rc.1** — Content depth (long-form + React Email + video scripts + interactive + 9-format social pack)

### v3.15 — Integration ecosystem
- **v3.15.0-rc.1** — HubSpot deep (CMS + CRM objects) + n8n workflow generator + Supabase full stack (7 skills) + Notion/Airtable/Framer/Iconify/Slack/Discord/Salesforce/Pipedrive/Google/Zapier

### v3.10–v3.14 — Depth & polish
- **v3.10.0-rc.1** — i18n depth (translation memory + locale archetype overrides + translation pipeline + Intl formatting)
- **v3.11.0-rc.1** — Advanced a11y (eye-tracking + low-bandwidth + voice-control + tremor + battery + keyboard-task)
- **v3.12.0-rc.1** — Legal + ethics (privacy/TOS/a11y statement/AI disclosure/cookie banner)
- **v3.13.0-rc.1** — Plugin self-improvement (opt-in telemetry + skill usage + auto-deprecation)
- **v3.14.0-rc.1** — 8 new archetypes (museum/academic/gaming/medical/civic/financial/portfolio/hand-drawn) + mixing protocol

### v3.16–v3.18 — Testing + security + visual refinement
- **v3.16.0-rc.1** — Generated-project testing (E2E + visual regression + a11y + API integration)
- **v3.17.0-rc.1** — Security hardening (prompt injection + PII 2026 + SBOM + moderation + CSP + rotation + font licenses)
- **v3.18.0-rc.1** — Advanced visual refinement (LPIPS + layout-diff + animation-path + cross-framework/browser/print parity)

### v3.18.0 — stable
- Drift fixes across CLAUDE.md + plugin.json + marketplace.json descriptions
- Validation cleanup: 69/69 tests, 0 BLOCK/WARN, frontmatter lint clean, mirror parity
- Promoted rc.1 → stable
- Git tag `v3.18.0` pushed

## PROVISIONAL status

Numeric thresholds marked PROVISIONAL in v3.5+ skills (few-shot N, κ floor, UX archetype floors, Pareto N, critic cycle cap, RAG sizing, budget tier tokens, archetype weights):

- Pending R1–R10 empirical calibration via research-runner agent
- `/gen:recalibrate` quarterly ritual updates shipping defaults on user approval
- Defaults safe to use; expect refinement post-shakedown

## Recommended next steps

1. Run one or two real projects through full v3.18.0 pipeline to surface spec-vs-reality gaps
2. Begin R1 (judge calibration) + R5 (UX floor) execution against 5 seeded goldens
3. If opening to external users, enable opt-in plugin telemetry + monitor auto-deprecation candidates
4. Quarterly `/gen:recalibrate` cadence for threshold validation

## Contributors

Raphjay2406 (owner) + Claude Opus 4.6 (1M context) as co-author across all v3.4.2+ releases.
