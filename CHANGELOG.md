# Changelog

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
