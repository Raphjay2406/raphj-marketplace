---
description: "On-demand adversarial critique. Spawns adversarial-critic agent on a section with chosen persona lens (senior-designer | conversion-specialist | accessibility-engineer | product-strategist). Produces CRITIQUE-{persona}.md."
argument-hint: "<section-id> [--persona senior-designer|conversion-specialist|accessibility-engineer|product-strategist] [--apply]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_evaluate
recommended-model: opus-4-6
---

# /gen:critic

v3.5.2. Surgical adversarial review — one section, one persona, one ranked weakness list.

## Workflow

### 1. Preflight

- Require `<section-id>`.
- Default `--persona senior-designer` if not specified.
- Read section files + SUMMARY.md + quality scores.

### 2. Spawn critic

`agents/specialists/adversarial-critic.md` with input:

```json
{
  "section_id": "<id>",
  "persona": "<persona>",
  "dev_server_url": "http://localhost:<port>",
  "context": {
    "archetype": "...",
    "beat": "...",
    "project_intent": "...",
    "prior_scores": { "design": ..., "ux": ... }
  }
}
```

### 3. Receive report

Critic writes `sections/<id>/CRITIQUE-<persona>.md`. Surface top-level verdict + weakness counts.

### 4. Optional apply (--apply)

With `--apply` flag: spawn polisher to apply CRITICAL + HIGH weaknesses only. Commit as separate cycle. Do NOT loop — `/gen:critic --apply` is one cycle; use `/gen:audit` or build to run full loop.

### 5. Ledger

```
node scripts/ledger-write.mjs critic critique-issued <id>/<persona> '{...}' '[...]'
```

## Output

```
ADVERSARIAL CRITIQUE — hero (senior-designer)
==============================================
Overall: Design craft 182 undersells Editorial archetype.

Weaknesses:
  CRITICAL: 0
  HIGH:     2
  MEDIUM:   3
  LOW:      1

Top 3:
  1. [HIGH] Cliché "abstract waves" hero bg (Hero.tsx:48)
     → Replace with typographic composition (serif display + prose width)
  2. [HIGH] Generic CTA copy (Hero.tsx:96)
     → "Start your first draft" or similar verb+outcome
  3. [MEDIUM] Baseline grid compliance 84% < 90%
     → Adjust type-scale step at L2

Report: sections/hero/CRITIQUE-senior-designer.md
```

## Pipeline guidance

Standalone use cases:
- Pre-audit spot-check on specific sections
- Persona-specific review ("is my conversion path tight?")
- Iterate cycle before committing controversial changes

Typically followed by `/gen:iterate <section>` to apply fixes manually, or `--apply` for auto-polish.

## Anti-patterns

- ❌ Running all 4 personas back-to-back with `--apply` — that's `/gen:audit`'s job; standalone critic is one at a time.
- ❌ Ignoring CRITICAL findings — they're blockers; address before next stage.
- ❌ Persona mismatch (calling senior-designer on a conversion failure) — route persona to weakness type.
