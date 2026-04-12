---
description: "Cross-section narrative audit — reads all shipped sections in arc order, judges emotional-arc coherence as a whole page. Catches 'each section is great but the story doesn't emote' failure mode."
argument-hint: "[--block] [--persona skeptic|designer|strategist]"
allowed-tools: Read, Write, Edit, Glob, Grep, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_take_screenshot
recommended-model: opus-4-6
---

# /gen:narrative-audit

v3.5.3 pipeline-depth Stage 10. Per-section audits catch craft; this catches story.

## Workflow

### 1. Read arc state

- `MASTER-PLAN.md` → arc sequence (beat order: HOOK → TEASE → REVEAL → … → CLOSE)
- `sections/*/SUMMARY.md` → shipped section summaries
- `DESIGN-DNA.md` → archetype + tone

### 2. Playwright whole-page read

With dev server running:
1. Navigate to root at 1280×900.
2. Take full-page screenshot + capture scroll-through frames at each beat entry.
3. Extract all user-facing text in document order.

### 3. Narrative judge

Spawn judge agent (Opus 4.6 vision) with structured prompt:

```
Context:
  Archetype: {archetype}
  Audience: {audience from PROJECT.md}
  Intent: {primary goal}
  Arc sequence: {beat list}

Task: Judge emotional-arc coherence as a whole.

Score 1-10 on:
  - Tension curve: does HOOK build into PEAK without premature release?
  - Proof placement: does evidence land after need is established?
  - Pacing: are BREATHE beats where attention needs rest?
  - Close: does CLOSE give the reader somewhere to go?
  - Voice consistency: does tone hold across sections?
  - Promise delivery: does the page deliver what HOOK promised?

Output JSON:
{
  "scores": { "tension_curve": 8, ... },
  "overall": 7.4,
  "weaknesses": [
    { "severity": "HIGH", "beat": "PEAK", "issue": "...", "fix": "..." }
  ],
  "ship_verdict": "warn|block"
}
```

### 4. Persona override

`--persona skeptic` — judge adopts skeptical viewer persona.
`--persona designer` — senior-designer aesthetic lens.
`--persona strategist` — product-strategy lens.

Default: all three, average scores.

### 5. Write report

`.planning/genorah/narrative-audit.md`:

```
NARRATIVE AUDIT — Arc Coherence Report
========================================
Score: 7.4/10

Tension curve:     8/10
Proof placement:   6/10 — testimonials arrive BEFORE problem is established
Pacing:            8/10
Close:             7/10
Voice:             9/10
Promise:           7/10

HIGH-severity issues (2):
  - [PEAK] Social proof fires before audience feels the problem.
    Fix: move TESTIMONIALS section after FEATURES-BUILD; insert PROBLEM-TEASE beat before.
  - [CLOSE] CTA copy is generic "Get started" — doesn't land the narrative.

Ship verdict: WARN (not blocking in v3.5.3 default; --block flag promotes to block)
```

### 6. Ledger

```json
{
  "kind": "narrative-audit-ran",
  "subject": "project",
  "payload": { "overall": 7.4, "weaknesses_high": 2, "verdict": "warn", "personas": ["default"] }
}
```

### 7. Flags

- `--block` — treat narrative audit as ship-blocking; BLOCK verdict stops `/gen:ship-check`.
- `--persona <p>` — single-persona mode.

## Pipeline guidance

Runs between per-section audit (`/gen:audit`) and regression check (`/gen:regression`). Render `skills/pipeline-guidance/SKILL.md` NEXT block.

## Anti-patterns

- ❌ Running only per-section `/gen:audit` and claiming page quality — sections are local; narrative is global.
- ❌ Treating narrative findings as subjective-only — they map to concrete section-level fixes.
- ❌ Forcing `--block` default — v3.5.3 keeps this WARN while research track R5 calibrates thresholds; graduate to default-block in later releases.
