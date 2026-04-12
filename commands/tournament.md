---
description: "Generate N creative variants for HOOK/PEAK sections, blind-rank via vision LLM against archetype rubric, commit the winner."
argument-hint: "[section] [--variants=3] [--beats=hook,peak] [--judge=opus]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_resize
recommended-model: claude-opus-4-6
---

# /gen:tournament

Generate N distinct creative variants for high-stakes beats (HOOK/PEAK/REVEAL), build all in parallel, capture screenshots, blind-rank with vision LLM, commit the winner. See `skills/variant-tournament/SKILL.md` for the protocol.

## Workflow

### 1. Eligibility check

- Section's beat type must be in `{HOOK, PEAK, REVEAL, CLOSE}` OR PLAN.md declares `variant_tournament: true`.
- Hard gates on original build must all pass (don't tournament a broken foundation).
- Cost ceiling: soft warn at $8/section, hard abort at $15.

If ineligible: exit with explanation, suggest `--force` if user insists.

### 2. Brainstorm distinct directions

Spawn `design-brainstorm` skill with:
- `mode=tournament`
- `n=N` (default 3, max 5)
- `distinct_axes=[layout, motion, color-emphasis]` — force variants to differ on at least 2 axes

Output: N creative direction briefs, each with a 1-sentence differentiator.

### 3. Scaffold variant folders

```
sections/{name}/
├── (original stays here during tournament)
└── variants/
    ├── v1/  (direction A)
    ├── v2/  (direction B)
    └── v3/  (direction C)
```

### 4. Parallel builds

Spawn N Builder agents (Task-based), each with a different brief. Wave concurrency cap applies (max 4 parallel).

Each builder writes to its own `variants/vN/` folder. Respect existing DNA, component registry, DESIGN-SYSTEM.md.

### 5. Capture screenshots

For each variant:
- `browser_navigate` to localhost URL with variant query flag (`?variant=vN`)
- Screenshot at 1440 and 375, save to `variants/vN/shots/{1440,375}.png`

### 6. Blind ranking

Pass all N×2 screenshots to vision LLM (Opus 4.6 by default) with rubric prompt:

```
You are an Awwwards SOTD jury member. Below are {N} screenshots of the same
{BEAT} beat for archetype {ARCHETYPE}. Filenames are coded V_A, V_B, V_C
(do not infer order). For each, score 0-10 on Design, Usability, Creativity,
Content. Apply archetype weights: {WEIGHTS_JSON}. Return strict JSON:
{"rankings":[{"id":"V_A","scores":{...},"weighted":N,"rationale":"..."}],
 "winner":"V_X","confidence":0..1}
Disqualify any variant violating archetype FORBIDDEN: {FORBIDDEN_LIST}.
```

Variant IDs are coded (A/B/C) not (v1/v2/v3) to prevent order bias.

### 7. Commit winner

- Git-mv `variants/{winner}/*` into `sections/{name}/` (overwriting previous).
- Archive losers under `sections/{name}/variants/` (preserved for comparison).
- Write `sections/{name}/tournament-result.json` with full ranking data.

### 8. Metrics

Append to `.planning/genorah/METRICS.md`:
- Tournament section, variant count, winner, judge confidence, total cost.

### 9. Re-validate

Run `quality-reviewer` on winner to confirm it clears tier targets. Tournament selects best-of-N, not absolute quality guarantee.

## Output

```
Tournament: sections/{name} ({BEAT} beat)
Variants: 3 built, 3 scored
Winner: V_B (weighted 8.4/10, confidence 0.82)
  - Design: 9, Usability: 7, Creativity: 9, Content: 8
  - Rationale: "bold kinetic type, strong hierarchy, archetype-true"
Losers archived: variants/v1, variants/v3
Cost: $3.47
Next: quality-reviewer
```

## Notes

- Tournament is opt-in, not automatic. High cost, high variance, reserved for money shots.
- Judge temperature locked at 0.0-0.3 for ranking stability.
- Re-running tournament on same section with same directions will produce similar but not identical results — LLM judgment has variance. Log confidence; <0.7 = run again with different directions.
