---
type: index
entity: commands
count: 68
version: "4.0.0"
tags: [index, commands]
---

# Command Index (68 /gen:* commands)

## Core Pipeline

```
/gen:start-project → /gen:align → /gen:discuss → /gen:plan → /gen:build → /gen:audit → /gen:ship-check → /gen:export → /gen:postship
```

### Pipeline Stage Commands

- `/gen:align` `[--strict]` — Intent Alignment — validate PROJECT.md goals are SMART, every planned section traces to at least one goal, and no goal is uncovered. Pipeline Stage 1, between start-project and plan. Surfaces misalign
- `/gen:audit` — --- description: Full quality audit -- 234-point scoring, Lighthouse, accessibility, 4-breakpoint visual QA argument-hint: "[--section name] [--quick] [--category name]" allowed-tools: Read, Write,
- `/gen:bugfix` — --- description: Root cause diagnosis and fix with hypothesis-driven debugging and breakpoint verification argument-hint: "[bug description or path to screenshot]" allowed-tools: Read, Write, Edit,
- `/gen:build` — --- description: Wave-based section execution with parallel builders, quality gates, and session resume argument-hint: "[--wave N] [--resume] [--dry-run] [--parallel N]" allowed-tools: Read, Write,
- `/gen:discuss` — --- description: Per-phase creative deep dive -- visual features, content voice, and creative wild cards argument-hint: "[phase name, e.g., 'hero' or 'pricing']" allowed-tools: Read, Write, Edit, G
- `/gen:export` — --- description: Export current project artifacts to Obsidian vault format argument-hint: "[--full | --scores | --decisions]" allowed-tools: Read, Write, Grep, Glob, mcp__plugin_gen_obsidian__*, mc
- `/gen:iterate` — --- description: Brainstorm-first design improvements -- 2-3 proposals with mockups before any changes argument-hint: "[description of desired change or section name]" allowed-tools: Read, Write, E
- `/gen:narrative-audit` `[--block] [--persona skeptic|designer|strategist]` — Cross-section narrative audit — reads all shipped sections in arc order, judges emotional-arc coherence as a whole page. Catches 'each section is great but the story doesn't emote' failure mode.
- `/gen:plan` — --- description: Section planning with master plan generation, emotional arc mapping, and design system initialization argument-hint: "[--phase N] [--skip-research] [--section name] [--dry-run]" al
- `/gen:postship` `[--prompt-structured] [--feedback-file <path>]` — Post-Ship Learning Capture — accept user feedback after delivery, extract 3 lessons into cross-project KB (L6), route issues into next iteration backlog. Closes the pipeline learning loop.
- `/gen:regression` `[--snapshot] [--baseline <commit-sha>]` — Regression Check — delta vs last snapshot across Lighthouse, visual-diff, broken-link, bundle-size, a11y. Catches 'wave N broke wave N-1' before ship.
- `/gen:rehearse` `[section-id] [--no-cleanup]` — Pre-Build Rehearsal — dry-run one canary section from scaffold to full-build. If canary fails hard gates, the PLAN is the bug; cheaper than burning a full wave.
- `/gen:review` `[--section name] [--wave N] [--quick]` — Focused creative review of built sections — archetype personality check, conversion readiness, polish assessment
- `/gen:ship-check` `[--fix] [--skip-slow]` — Unified ship-readiness gate. Single go/no-go scorecard spanning build, typecheck, lint, test, lighthouse, axe, visual-regression, SEO, security, license. Replaces the scattered 6-command ship checklis
- `/gen:start-project` — --- description: Begin a new Genorah project — discovery, research, creative direction, content planning argument-hint: [project-name or URL] allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Age
- `/gen:ux-audit` `[section-id] [--personas lean|standard|max]` — Standalone UX Integrity audit — runs all 6 quality-gate-v3 Axis 2 sub-gates (heuristics, interaction, cognitive load, conversion, visual craft, synthetic users) and reports axis-2 score. Calls can run

### Ingestion Commands

- `/gen:ingest` `<codebase|url|route|diff|gap|verify|resolve|motion|cms> <path-or-url-or-slug> [flags]` — v3.21–v3.24 — Ingest existing projects into Genorah without losing detail. Codebase or live URL; plus motion-trace replay and CMS schema introspection. Source preserved verbatim; every transformation

### Deployment / CI

- `/gen:ci-setup` `[github | gitlab | none]` — Scaffold CI/CD infrastructure — Lighthouse CI + GitHub Actions + Playwright preview-smoke + Vercel preview hook. Per-beat thresholds sourced from perf-budgets skill.
- `/gen:deploy` `[preview|production|rollback <sha>] [--smoke] [--regression] [--lighthouse]` — Deploy project to configured platform (Vercel default, Netlify, Cloudflare Pages). Subcommands: preview | production | rollback. Production requires ship-check PASS.

### CMS

- `/gen:cms-init` `sanity | payload` — Scaffold a headless CMS (Sanity or Payload) with DNA-themed Studio/Admin, auto-generated collections/schemas from emotional arc, and live content preview wiring.

### Integrations

- `/gen:api` `<template> [--path <route-path>] [--docs]` — Scaffold API route from template. Templates: auth-* | crud-* | webhook-* | upload-signed-url | rate-limited | ai-stream. Emits route + Zod schema + test + OpenAPI entry + env var additions.
- `/gen:db-init` `init [--orm prisma|drizzle|payload|supabase] | migrate | seed | studio` — Initialize database + schema from PLAN.md content model. Subcommands: init | migrate | seed | studio. Chooses ORM (Prisma/Drizzle/Payload/Supabase SQL).
- `/gen:integrate` `<service> [--pattern <pattern>]` — Scaffold third-party integration. Adds env vars, auth pattern, webhook endpoint, client helper. Supports HubSpot, Stripe, Shopify, Supabase, Notion, Airtable, Slack, Discord, Salesforce, Pipedrive, Go
- `/gen:supabase` `init | auth <pattern> | rls <table> | storage <bucket> | realtime <table> | function new <name> | vector <table>` — Supabase full-stack scaffolding. Subcommands: init | auth | rls | storage | realtime | function | vector.
- `/gen:workflow` `n8n \"<description>\" | list | export <flow-name>` — Generate n8n workflow from natural-language description. Subcommands: n8n <description> | list | export.

### Other

- `/gen:agents` `<flow-name> [--tools=search,book,send] [--max-steps=8]` — v3.20 — Scaffold an agentic UX flow: tool schemas, route handler with stopWhen guard, and trace UI components wired to DNA tokens.
- `/gen:assets` `init | generate | 3d <kind> | 2d <kind> | image <beat> | character | regenerate <id> | audit | library | export` — Generate, audit, and manage project assets — 3D models, 2D SVG/raster, icons, patterns, characters. DNA-governed via MANIFEST.json. Subcommands: init | generate | 3d | 2d | image | character | regener
- `/gen:benchmark` `[url1 url2 ...] | --from-archetype | --refresh` — Score 3-5 reference SOTD sites against the 234-pt quality gate; generate gap targets per section.
- `/gen:brandkit` `export | preview | sync` — Generate brand kit deliverables (logo variants, favicons, OG templates, color exports, font specimens, guidelines PDF, /brand public route, brand.zip). Reuses DNA tokens; opt-in post-audit.
- `/gen:companion` — --- description: Start or stop the Genorah visual companion server argument-hint: "start | stop | status" allowed-tools: Read, Bash ---  You are the Genorah Companion controller. You manage the
- `/gen:critic` `<section-id> [--persona senior-designer|conversion-specialist|accessibility-engineer|product-strategist] [--apply]` — On-demand adversarial critique. Spawns adversarial-critic agent on a section with chosen persona lens (senior-designer | conversion-specialist | accessibility-engineer | product-strategist). Produces
- `/gen:dashboard` `start | stop | status | open` — Launch or stop the Genorah live project dashboard at localhost:4455 — real-time wave progress, quality scores, screenshot grid, decision log.
- `/gen:design-system` `[--create | --inherit parent-path | --sync | --diff project-path]` — Manage shared design system across multiple projects — create parent DNA, inherit tokens, track cross-project consistency
- `/gen:experiment` `<setup|evaluate> <experiment-key> [--provider=growthbook|statsig|edge-config]` — v3.20 — Set up or evaluate an A/B/n experiment. Quality-gate-aware: variants below UX floor are auto-disqualified from winning.
- `/gen:feedback` `[feedback text or path to screenshot/PDF]` — Process client or stakeholder feedback into actionable iteration items — screenshots, annotations, text notes, or verbal feedback
- `/gen:gen-agents-discover` `<query>` — Search the Genorah marketplace for third-party agents
- `/gen:gen-agents-install` `<agent-id@version>` — Install a third-party agent from the Genorah marketplace (fetches manifest, verifies sha256 integrity, runs in Deno sandbox)
- `/gen:gen-agents-publish` `<agent-id>` — Publish a Genorah agent to the marketplace
- `/gen:gen-archetype-synth` `<mine.json> <slug> <seeds-csv> <weights-csv>` — Synthesize a bespoke archetype from brand reference images / URLs
- `/gen:gen-marketplace-run` `<id@version> <capability> <json-payload>` — Execute a marketplace agent in the local sandbox and return its Result envelope
- `/gen:gen-memory-query` `<natural-language-or-json-filter>` — Query the cross-project memory graph by natural language or archetype
- `/gen:gen-migrate-v3-to-v4` `[--dry-run] [--backup-to <path>]` — Migrate a v3.25 Genorah project to v4.0
- `/gen:gen-self-audit` `"` — Run Genorah self-audit (plugin consistency + M1–M5 feature checks)
- `/gen:gen-signature-mark` `"` — Forge a unique 3D signature mark for the project
- `/gen:hero-mark` `design | live | export | preview [--preset=<id>] [--override='color_override:#hex'] [--force]` — Interactive 3D hero mark workflow — design via 3dsvg.design, emit live <GenorahSVG3D>, export 30-variant asset matrix, or preview gallery. Consumes the 75-preset library + archetype routing.
- `/gen:legal` `privacy-policy | tos | accessibility | ai-disclosure | cookie-banner` — Generate legal templates — privacy policy, TOS, accessibility statement, AI disclosure. Disclaimer: always review with counsel.
- `/gen:migrate` — --- description: Migrate a legacy Modulo project (.planning/modulo/) to Genorah v2.0 (.planning/genorah/) argument-hint: "[--dry-run]" ---  # /gen:migrate  Migrates a legacy `.planning/modulo/`
- `/gen:mobile-preview` `[--platform ios|android|both]` — Live mobile preview on device via Expo Go QR or simulator/emulator. Alias: /gen:preview mobile.
- `/gen:mobile-test` `[run|generate|record] [--platform ios|android|both] [--device simulator|real]` — Run mobile test suites (Maestro default + platform-specific frameworks). Subcommands: run | generate | record.
- `/gen:multibrand` `<list|add|build|audit> [brand-name]` — v3.20 — Manage multi-brand family: list, add, build, or audit sub-brands. Enforces inheritance + drift policy per child brand.
- `/gen:next` `[--verbose]` — Preview the next recommended /gen:* command for the current pipeline state — primary + alternatives + rationale + prereq.
- `/gen:plugin-health` `[--days 30] [--format text|json]` — Plugin health dashboard — skill usage stats, command invocations, agent outcomes, deprecation candidates. Local-first; aggregated cross-user if telemetry opted-in.
- `/gen:recalibrate` `[--reindex] [--dry-run] [--headless] [--cron]` — Quarterly recalibration ritual — re-run R1 (judge calibration) + R5 (UX floor) against updated golden set + new variant archive. Publishes diff vs current shipping thresholds; prompts approval to upda
- `/gen:research` `run <track> | status | query '<sql-like>' | snapshot` — Research program runner. Subcommands: run <track> | status | query | snapshot. Orchestrates R1-R10 experiments, aggregates results, queries metrics warehouse across projects.
- `/gen:review-share` `[--auth=public|passcode|email] [--deploy=vercel|static]` — Generate a shareable client-review URL with pinnable comments + approval tracking. See skills/client-review-workflow.
- `/gen:security` `sbom | audit | rotate <service> | csp init | font-audit | moderation-queue` — Security commands — sbom, audit, rotate, csp, font-audit, moderation-queue.
- `/gen:self-audit` `[--fix] [--verbose] [--scope core|all]` — Self-heal audit — validates plugin consistency (versions, counts, frontmatter, contracts, orphan skills, mirror drift, stale refs) and writes a structured report.
- `/gen:shakedown` `[editorial-saas|brutalist-agency|ethereal-portfolio] [--headless]` — v3.19 — Run seeded brief through the full 14-stage pipeline end-to-end. Emits spec-vs-reality gap report to .planning/genorah/shakedown/<timestamp>/. Blocks releases if gaps found.
- `/gen:status` — --- description: Project status dashboard with phase, wave, section statuses, and contextual information argument-hint: "[--verbose] [--section name]" allowed-tools: Read, Grep, Glob, TodoWrite --
- `/gen:sync-knowledge` — --- description: Sync Genorah skills with Obsidian knowledge vault argument-hint: "[direction: plugin-to-obsidian | obsidian-to-plugin | both]" allowed-tools: Read, Write, Grep, Glob, Bash, mcp__pl
- `/gen:synthetic-test` `[section-id] [--personas lean|standard|max] [--persona P1|P2|...]` — Standalone synthetic-user testing — spawn 6 (or budget-limited) AI personas via Playwright, run structured task probes, aggregate into Synthetic Usability score (20pt of quality-gate-v3 Axis 2). Subse
- `/gen:telemetry` `opt-in | opt-out | show | export <path> | delete-mine` — Plugin telemetry opt-in/opt-out + data management. Subcommands: opt-in | opt-out | show | export | delete-mine.
- `/gen:tests` `[e2e|visual|a11y|api|all]` — Generate test suites for the current project. Subcommands: e2e | visual | a11y | api | all.
- `/gen:tournament` `[section] [--variants=3] [--beats=hook,peak] [--judge=opus]` — Generate N creative variants for HOOK/PEAK sections, blind-rank via vision LLM against archetype rubric, commit the winner.
- `/gen:trajectory` `<section-id> [--format text|json|markdown]` — Render score-over-iteration trajectory for a section. Shows every variant, refine cycle, critic cycle with scores, deltas, and termination reasons. Reads sections/{id}/trajectory.json.
- `/gen:tutorial` `[--sandbox <path>] [--skip-build]` — Interactive tutorial for first-time users. Walks through the Genorah pipeline in a sandbox project with explanation between each step. ~30 minutes.
- `/gen:variant` `<section-id> [--n 3] [--budget lean|standard|max]` — Pareto variant generation — produces N diverse variants of a section, scores each on 4 objectives (Design/UX/Archetype/Reference), computes Pareto front, commits winner via archetype-weighted tiebreak
- `/gen:video` `[section-name] [--template=kinetic-type|particle-field|shape-morph|color-field|camera-fly] [--duration=4]` — Generate a programmatic Remotion video background for a section using DNA-parameterized templates (kinetic-type, particle-field, shape-morph, color-field, camera-fly).

