# Genorah FAQ

## Getting started

### How do I start a new project?
Run `/gen:start-project` in the target directory. It walks through discovery questions, proposes archetypes, generates DESIGN-DNA.md, and sets up `.planning/genorah/` scaffolding.

### What's the difference between archetypes?
25 opinionated personality systems. See [archetype glossary](glossary.md#a) or `skills/design-archetypes/SKILL.md`. Each locks in colors, fonts, forbidden patterns, and signature moves. Run `/gen:discuss` after start-project to explore which fits your project.

### Do I need all the MCPs?
No. Every MCP is optional with a procedural fallback. Meshy, Flux, Recraft, Playwright enrich specific flows but aren't required. Check session-start banner for what's currently available.

## Quality gate

### Why is my section scoring so low?
Check `sections/<id>/SUMMARY.md` cascade block. If any sub-gate fired, the raw score is multiplied down. Common fails:
- Archetype specificity (missing/forbidden markers) → see `skills/design-archetypes/testable-markers.json`
- Motion-health (INP/concurrent animations) → check `skills/motion-health/SKILL.md`
- DNA drift (too many hardcoded colors) → run `DNA_STRICT=1 /gen:build`

### What's "tier" mean?
Named score bands. Both axes (Design 234 + UX 120) must clear the tier's floor. "SOTD-Ready" = 200-219 Design AND 100-109 UX.

### Can I override archetype rules?
Yes — document a tension_override in DECISIONS.md with rationale. This is the escape hatch for hard-gate archetype-specificity.

## Context + sessions

### What does the plugin remember across sessions?
8 layers (Context Fabric). L4 ledger captures every significant event. L6 Obsidian vault preserves cross-project lessons. L7 calibration persists judge history user-global. L8 Claude auto-memory across sessions.

### Why did the model "forget" after a compaction?
v3.5.4 Compaction-Survivor protocol writes `compaction-summary.md` to preserve Tier A (identity) + B (open state) + C (recent signal events). Session-start re-emits it. If compaction happened before v3.5.4, retrofit not possible.

## Cost

### How much does a project cost?
See `docs/research/v3.5/r7-budget-tiers-provisional.md`. Lean ~170K tokens, Standard ~370K, Max ~680K. API spend $2-35 depending on provider usage.

### How do I cap spend?
Set in `.claude/genorah.local.md`:
```yaml
budget:
  max_tokens_per_session: 500000
  max_usd_per_session: 20
```
Then `node scripts/cost-tracker.mjs budget-check` returns non-zero when exceeded.

### What's a cache hit?
Asset generation (Flux/Meshy/Recraft) hashes prompt+seed+model to a cache key. Identical requests return cached file, no API spend.

## Data + research

### What's the golden set?
50 hand-curated reference sections with panel-scored Design + UX. Used for judge few-shot anchoring + R1/R5 research. Located at `skills/judge-calibration/golden/`.

### What's PROVISIONAL mean on a threshold?
v3.5.0-3 shipped provisional thresholds. R1-R10 empirical research calibrates them against real data. `/gen:recalibrate` quarterly ritual updates them.

## Errors

### I got a GENORAH_* error, what do I do?
See `docs/troubleshooting/<CODE>.md`. Every error code has a dedicated playbook with symptom/cause/recovery/prevention.

## Integrations

### Does Genorah integrate with my CMS?
Yes: Sanity, Payload, Contentful, Strapi, Builder.io are supported. Plus HubSpot CMS (v3.15 deeper integration).

### Can I use it with Supabase?
Soon — v3.15 ships full Supabase BaaS integration (Auth/Postgres/RLS/Storage/Realtime/Edge Functions/Vector).

### Can I generate n8n workflows from plain English?
Coming in v3.15. v3.5.x has no n8n integration yet.

## Workflow

### `/gen:next` — what does it do?
Reads pipeline state, suggests the next most relevant command. Primary + alternatives + rationale.

### What order should I run commands?
```
/gen:start-project → /gen:align → /gen:discuss → /gen:plan
  → /gen:rehearse → /gen:build → /gen:audit → /gen:ux-audit
  → /gen:narrative-audit → /gen:regression → /gen:ship-check
  → /gen:export → /gen:postship
```
Each stage has a purpose. Run `/gen:next` anytime to confirm you're on track.

## Plugin + updates

### How do I update Genorah?
`claude plugin update gen@raphj-marketplace`. New versions stream into `~/.claude/plugins/cache/raphj-marketplace/gen/<version>/`.

### How do I know what changed?
See commit history or `docs/` folder for RFC + analysis documents.

### Can I contribute archetypes?
Internal plugin today. v3.13 introduces opt-in telemetry + auto-deprecation; community contribution follows.
