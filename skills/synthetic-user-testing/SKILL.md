---
name: synthetic-user-testing
description: Six AI-persona Playwright probes (Skeptic CFO, First-timer, Power user, Mobile thumb-scroller, Screen-reader user, B1 non-native) execute primary tasks on the built section and score completion + friction. Scores 20 in quality-gate-v3 Axis 2. Part of v3.5.1 generation depth.
tier: core
triggers: synthetic-user-testing, ux-probe, personas, task-probe, playwright, quality-gate-v3
version: 0.1.0-provisional
status: PROVISIONAL — persona prompts + scoring weights validated in research track R2/R10.
---

# Synthetic User Testing

20 points. 6 personas × up to 3.33pt each. Each persona executes a structured task via Playwright + LLM-persona driver; persona writes a JSON report.

## Layer 1 — When to use

Axis 2 of quality-gate-v3. Cost-gated by budget mode:
- `lean`: 3 personas (First-timer, Power user, Mobile)
- `standard`: 4 personas (+ Skeptic CFO)
- `max`: 6 personas (all)

Also callable standalone via `/gen:synthetic-test`.

## Layer 2 — The 6 personas

Each persona gets a structured spawn prompt with persona description + primary task + required JSON output schema.

### P1. Skeptic CFO (3.33pt)

- **Profile**: 50-year-old finance decision-maker. Needs proof before commitment. Risk-averse. Values outcome clarity.
- **Task**: "Find evidence this solves a real business problem, and identify the next-step CTA. 60-second time budget."
- **Measured**:
  - Time-to-trust-signal (ms)
  - Number of trust-signal encounters
  - Time-to-primary-CTA (ms)
  - Self-reported confidence 1–5 ("Would you commit?")

### P2. First-timer (3.33pt)

- **Profile**: No domain context. Arrived from generic search or link share.
- **Task**: "In 30 seconds, explain what this product does and who it's for."
- **Measured**:
  - Comprehension score (LLM-judged 1–5 vs stated product intent in PROJECT.md)
  - Confused-navigation signals (back-clicks, rapid scroll reversals, pointer idle)

### P3. Power user (3.33pt)

- **Profile**: Developer/pro familiar with category. Frustrated by friction. Wants shortest path.
- **Task**: "Find pricing, compare plans, start signup. Fastest path."
- **Measured**:
  - Clicks to complete
  - Back-navigations
  - Time to first-value action
  - Self-reported frustration 1–5

### P4. Mobile thumb-scroller (3.33pt)

- **Profile**: Uses on 375×812 device; one-handed; patience budget 20 seconds.
- **Task**: "Scroll to bottom, then locate and tap primary CTA."
- **Measured**:
  - Max scroll depth reached (proxy for engagement)
  - Time-to-bottom
  - CTA discoverability (% of persona runs that found CTA without sticky nav assistance)

### P5. Screen-reader user (3.33pt)

- **Profile**: Navigates landmark-by-landmark; headings; link list.
- **Task**: "Using landmarks only, reach main heading, primary CTA, and footer contact."
- **Measured**:
  - Landmark coverage (% of expected landmarks present + reachable)
  - Heading order violations (h1→h3 skips)
  - Tab-trap count
  - Aria-label completeness on CTAs

### P6. B1 English non-native (3.33pt)

- **Profile**: Reading English at CEFR B1 level. Phrasal verbs, jargon, idioms cause drop-off.
- **Task**: "Read hero section. Rate clarity 1–5. Flag every phrase you don't understand."
- **Measured**:
  - Jargon count (flagged terms)
  - Clarity score
  - Agreement with archetype reading-grade band

## Layer 3 — Integration

### Spawn prompt schema

```
Persona: {persona.profile}
Context: {project_intent}, {archetype}, {beat}
Section under test: {section_id}
Dev server: http://localhost:{port}

Task: {persona.task}

Output (JSON, strict schema):
{
  "task_completed": boolean,
  "evidence": {
    "steps": [{ "action": "...", "element": "...", "time_ms": 0 }],
    "screenshots": ["path/to/screenshot.png"]
  },
  "metrics": {
    "<persona-specific keys>": <number>
  },
  "self_report": {
    "score": 1-5,
    "notes": "free-text max 200 words"
  }
}

You MUST NOT hallucinate UI elements. Every click is a real Playwright action.
```

### Playwright driver

`ux-probe` agent spawns one browser context per persona, runs task protocol, collects metrics, writes `.planning/genorah/audit/synthetic/{section-id}/{persona}.json`.

### Aggregate scoring

```
persona_score = (task_completed * 1.0) * (self_report.score / 5) * metric_factor
section_score = sum(persona_scores) * (20 / persona_count)
```

`metric_factor` per persona is defined in `docs/v3.5-research-program.md` R10 (calibrated per-persona).

### Ledger

```json
{
  "kind": "synthetic-test-completed",
  "subject": "hero",
  "payload": {
    "personas_run": ["P1","P2","P3","P4"],
    "total_score": 15.2,
    "failures": [{ "persona": "P1", "reason": "task_not_completed", "evidence": "primary CTA below fold on mobile" }]
  }
}
```

## Layer 4 — Anti-patterns

- ❌ Persona writing "looks good to me" without executing — every persona must produce `evidence.steps[]` with real timestamps.
- ❌ Running only P2/P3 and claiming full score — report must list `personas_run` and normalize accordingly.
- ❌ Treating P5 findings as "accessibility" not "UX" — a11y IS UX; P5 contributes to this sub-gate score.
- ❌ Cheating P6 by writing the section in simple English then swapping copy pre-audit — lock copy in DECISIONS.md at content stage.
