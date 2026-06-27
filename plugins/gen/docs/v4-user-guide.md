# Genorah v4.0.0 — User Guide

**Version:** 4.0.0 GA | **Codename:** Cinematic Intelligence

---

## Quick Start

### Install

```bash
claude plugin marketplace add https://github.com/Raphjay2406/raphj-marketplace
```

Or install the `gen` plugin directly:

```bash
claude plugin install gen@4.0.0
```

### Start Your First Project

```bash
/gen:start-project
```

Genorah will ask you 8 discovery questions (brand, audience, goals, constraints, references),
run parallel research agents, select an archetype, and generate a locked Design DNA.

### Check Plugin Health

```bash
/gen:plugin-health
```

Expected: `Genorah v4.0.0 — 108 agents, 42 archetypes, 394-pt gate, 10 MCPs`

---

## Core Workflow

The standard pipeline from discovery to ship:

```
/gen:start-project → /gen:align → /gen:discuss → /gen:plan → /gen:build
    → /gen:audit → /gen:ux-audit → /gen:ship-check → /gen:export
```

### Stage-by-Stage

| Command | Stage | What Happens |
|---------|-------|-------------|
| `/gen:start-project` | Discovery | 8 questions → research → archetype selection → Design DNA |
| `/gen:align` | Intent Alignment | SMART-validates goals; traces sections to goals |
| `/gen:discuss` | Creative Deep Dive | Visual feature proposals + Stitch mockups + brand voice |
| `/gen:plan` | Planning | Wave map + per-section PLAN.md + layout assignments |
| `/gen:rehearse` | Rehearsal | Dry-run section builds; catches blockers before real build |
| `/gen:build` | Build | Wave-based implementation; AI images via nano-banana |
| `/gen:audit` | Quality Gate | 394-point audit; Playwright visual QA |
| `/gen:ux-audit` | UX Gate | 6 UX Integrity sub-gates + synthetic personas |
| `/gen:narrative-audit` | Arc Check | Cross-section story coherence |
| `/gen:ship-check` | Ship Readiness | Build + typecheck + lint + Lighthouse + axe + visual regression |
| `/gen:export` | Export | Deliverables + design tokens + vault format |

### Check Pipeline Position

```bash
/gen:status
```

Shows: current phase, wave progress, section statuses, next action suggestion.

```bash
/gen:next
```

Preview the recommended next command with rationale.

---

## Pillar 1: AG-UI Protocol

Genorah v4 uses the AG-UI protocol for all multi-agent communication.

### What This Means for You

- **Agent trace UI** — When building complex sections, you can see the live agent execution
  trace via `/gen:agent-trace-ui`.
- **Real-time updates** — The canvas runtime streams AG-UI events to the Visual Companion.
- **108 agents** — 10 director agents coordinate; 98 worker agents execute specialized tasks.

### View the Agent Directory

```bash
cat docs/v4-agent-directory.md
```

Or generate it fresh:

```bash
node scripts/docs/generate-agent-directory.mjs
```

### Agentic UX Patterns

Use the `gen:agentic-ux-patterns` skill when building AI-native features:

```bash
/gen:agents
```

Scaffolds AI SDK v6 patterns with `stopWhen: stepCountIs(N)` guards and agent-trace UI primitives.

---

## Pillar 2: Generative Archetypes

### Browse Archetypes

Genorah ships 42 archetypes:

**Classic 33:** Brutalist, Ethereal, Kinetic, Editorial, Neo-Corporate, Organic, Retro-Future,
Luxury/Fashion, Playful/Startup, Data-Dense, Japanese Minimal, Glassmorphism, Neon Noir,
Warm Artisan, Swiss/International, Vaporwave, Neubrutalism, Dark Academia, AI-Native,
and 14 more.

**New in v4 (17):** Cinematic Scroll, Particle Storm, Liquid Metal, Vapor Drift, Prismatic Clarity,
Brutalist Future, Neon Bloom, Stone & Light, Circuit Gothic, Acid House, Chromatic Brutalism,
Aurora, Aether, Bioluminescent, Deep Ocean, Desert Glass, Monastic.

### Mix Archetypes

```
Primary archetype (≥60%) + Secondary archetype (≤30%) + Tension accent (≤10%)
```

Example: "Ethereal (65%) + Japanese Minimal (25%) + Brutalist (10%)"

### Design DNA

Every project gets a locked DNA with:
- 12 color tokens (8 semantic + 4 expressive)
- Display/body/mono fonts + 8-level type scale
- 5-level spacing system
- 8+ motion tokens
- Signature element

Export as Tailwind v4 `@theme` CSS:

```bash
/gen:design-system --export=tailwind
```

---

## Pillar 3: Living Systems

### Self-Healing Components

Components built with Genorah v4 emit health events. When DNA drift is detected (computed CSS
deviates >5% from DNA spec), the living system runtime triggers a soft revert.

Enable drift monitoring:

```bash
/gen:build --living-system
```

### Wave Resume

If a build is interrupted mid-wave, resume exactly where you left off:

```bash
/gen:build --resume
```

Wave state is persisted to `.planning/genorah/wave-state.json` after each section.

---

## Pillar 4: Memory Graph

### How Memory Works

The 8-layer Context Fabric stores project state across sessions:

| Layer | Scope | Storage |
|-------|-------|---------|
| L1 | Current scratchpad | In-session only |
| L2 | Section-level state | `.planning/genorah/STATE.md` |
| L3 | Project state | `.planning/genorah/CONTEXT.md` |
| L4 | Preservation ledger | `preservation.ledger.ndjson` |
| L5 | BM25 retrieval index | `.planning/genorah/vault/` |
| L6 | Obsidian knowledge base | User-configured vault path |
| L7 | Calibration store | `~/.claude/genorah/calibration/` |
| L8 | User memory | `~/.claude/genorah/user-memory.json` |

### Episodic Memory

Genorah remembers decisions across sessions. To query memory:

```bash
/gen:status --memory
```

To explicitly save a decision:

```bash
/gen:feedback "Use Inter for body text — client confirmed"
```

---

## Pillar 5: Marketplace

### Install Community Plugins

```bash
/gen:marketplace list
/gen:marketplace install my-plugin@1.0.0
```

### Publish Your Own

```bash
/gen:marketplace publish
```

Requires `GENORAH_MARKETPLACE_TOKEN` env var. The publish flow validates your plugin against
the A2A v0.3 schema before uploading.

### Sandbox Testing

```bash
/gen:marketplace sandbox
```

Requires Deno 2.x. Runs your plugin in an isolated sandbox with mocked tool calls.

---

## Pillar 6: Shakedown + Quality Gate

### Quality Gate Overview

Genorah enforces a **394-point quality gate** across 14 categories:

| Category | Points | Weight |
|----------|--------|--------|
| Color System | 20 | 1.2x |
| Typography | 24 | 1.2x |
| Layout & Composition | 20 | 1.0x |
| Depth & Polish | 18 | 1.0x |
| Motion & Interaction | 22 | 1.1x |
| Cinematic Motion (v4) | 20 | 1.1x |
| Creative Courage | 22 | 1.2x |
| UX Intelligence | 22 | 1.0x |
| Accessibility | 18 | 1.0x |
| Content Quality | 18 | 1.0x |
| Responsive Craft | 20 | 1.1x |
| Performance | 20 | 1.1x |
| Integration Quality | 18 | 1.0x |
| AG-UI Protocol (v4) | 20 | 1.0x |

**Score tiers:** Reject (<140) · Baseline (140-169) · Strong (170-199) · SOTD-Ready (200-219) · Honoree (220-234) · SOTM-Ready (235+)

### Run the Full Audit

```bash
/gen:audit
```

### Run UX Integrity Gate

```bash
/gen:ux-audit
```

Runs 6 sub-gates: Nielsen heuristics, interaction fidelity, cognitive load, conversion integrity,
visual craft quantified, synthetic-user testing (6 personas).

### Ship Check

```bash
/gen:ship-check
```

Runs: build + typecheck + lint + Lighthouse CI + axe a11y + visual regression + SEO + security.

---

## Preservation-First Ingestion

### Ingest an Existing Project

```bash
/gen:ingest codebase /path/to/project
```

### Ingest a Live URL

```bash
/gen:ingest url https://example.com --consent
```

Requires explicit `--consent` flag (confirms you have permission to crawl).

### Ingest Motion + CMS

```bash
/gen:ingest motion my-project ./playwright-traces/
/gen:ingest cms my-project --cms=sanity
```

### Verify Preservation

```bash
/gen:ingest verify my-project
```

Checks 4 invariants: source capture, asset licensing, content destination, DNA confidence.

---

## Troubleshooting

### Plugin health check fails

```bash
/gen:plugin-health
```

If you see `BLOCK` items, run `/gen:self-audit` for specifics.

### Tests failing after upgrade

```bash
node scripts/gen-self-audit.mjs
```

The self-audit covers agent count, archetype count, version parity, and skill frontmatter.

### Build stuck mid-wave

Wave state is saved automatically. Run `/gen:build --resume` to continue from the last completed
section. If resume fails, check `.planning/genorah/wave-state.json` for corruption.

### MCP servers unavailable

All MCP integrations degrade gracefully. Check `.claude-plugin/.mcp.json` for declarations.
Verify with `/gen:status` — the MCP availability summary appears in session-start output.

### Memory graph queries slow

The BM25 index rebuilds automatically. Force a rebuild:

```bash
node scripts/rebuild-memory-index.mjs
```

---

## Command Reference

Full command list: see [`commands/`](../commands/) directory (59 commands).

Key commands at a glance:

```
Discovery:    /gen:start-project  /gen:align  /gen:discuss
Planning:     /gen:plan  /gen:rehearse
Building:     /gen:build  /gen:iterate  /gen:bugfix
Auditing:     /gen:audit  /gen:ux-audit  /gen:narrative-audit  /gen:benchmark
Shipping:     /gen:ship-check  /gen:export  /gen:deploy  /gen:postship
Content:      /gen:assets  /gen:brandkit  /gen:video  /gen:cms-init
Integrations: /gen:integrate  /gen:supabase  /gen:api  /gen:db-init
Mobile:       /gen:mobile-test  /gen:mobile-preview
Maintenance:  /gen:status  /gen:next  /gen:self-audit  /gen:plugin-health
              /gen:sync-knowledge  /gen:recalibrate  /gen:feedback
Marketplace:  /gen:marketplace
```

## Skill Index

287 skills organized in 3 tiers. Key skills by domain:

- **Design:** `design-dna`, `design-archetypes`, `emotional-arc`, `creative-tension`, `archetype-mixing`
- **Quality:** `quality-gate-v3`, `visual-qa-protocol`, `ux-heuristics-gate`, `anti-slop-gate`
- **Motion:** `cinematic-motion`, `animation-orchestration`, `interaction-replay`, `brand-motion-sigils`
- **Ingestion:** `preservation-ledger`, `dna-reverse-engineer`, `archetype-inference`, `pixel-dna-extraction`
- **Mobile:** `mobile-swift`, `mobile-kotlin`, `mobile-react-native`, `mobile-expo`, `mobile-flutter`
- **Full-stack:** `rsc-patterns`, `api-routes`, `db-schema-from-content`, `env-var-scheme`

Full skill list: [`skills/`](../skills/) directory.
