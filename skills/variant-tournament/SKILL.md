---
name: variant-tournament
category: domain
description: "Blind-ranked AI variant competition for high-stakes beats (HOOK/PEAK). N parallel builds, vision-judged, winner-commits."
triggers: ["tournament", "variant", "A/B build", "hero variants", "peak variants", "blind ranking"]
used_by: ["orchestrator", "builder"]
version: "3.0.0"
allowed_paths: [".planning/genorah/sections/", ".planning/genorah/audit/"]
---

## Layer 1: Decision Guidance

### Why Tournament

Award-caliber HOOK and PEAK sections are won in creative-direction space, not execution space. A single attempt — even an excellent one — is a single sample of a high-variance distribution. N=3 parallel attempts with blind ranking converts the creative bet from "hope the first idea works" to "select best-of-N".

Cost is real: 3 builds + 1 judge ≈ $2-4/section. Reserve for sections that carry the project — hero, pricing headline, peak showcase.

### When to Use

- Beat is HOOK, PEAK, REVEAL, or CLOSE.
- Section is above-the-fold or below a major scroll beat.
- Project tier target is SOTD-Ready (200+) or higher.
- PLAN.md flags `variant_tournament: true`, or user runs `/gen:tournament {name}`.

### When NOT to Use

- BREATHE/PROOF/PIVOT beats — convention matters more than creative deviation.
- Data-dense sections (tables, pricing grids) — structure dominates, variants add noise.
- Projects on tight budget — 3x build cost matters.
- Hard gates failing on original — fix foundation first.

### Decision Tree

```
Section eligible (beat ∈ {HOOK,PEAK,REVEAL,CLOSE} OR tournament=true)?
└─ no  → skip
└─ yes → Cost budget OK (<$15)?
    ├─ no  → warn, ask user
    └─ yes → brainstorm N distinct directions
        → parallel build N variants
        → capture N×2 screenshots (1440 + 375)
        → vision-LLM blind ranking
        → winner commits, losers archive
```

## Layer 2: Technical Spec

### Distinct-axis enforcement

Variants must differ on ≥2 axes from this set:
- **Layout** — grid orientation, element count, whitespace ratio
- **Motion** — entrance choreography, hover behavior, scroll-driven vs event-driven
- **Color emphasis** — primary vs accent dominance, hue temperature
- **Typography** — scale contrast, weight variance, kinetic treatment
- **Imagery** — photographic vs illustrative vs 3D vs abstract

If a variant only differs by one axis, it's a "polish" not a "direction" — reject during brainstorm.

### Judge prompt template

```
You are an Awwwards SOTD jury member. Below are {N} screenshots of the same
{BEAT} beat for archetype {ARCHETYPE}.

Archetype mandate: {ARCHETYPE_DESCRIPTION}
Archetype forbidden: {FORBIDDEN_LIST}
Weights (higher = more important for this archetype): {WEIGHTS_JSON}

Variants are coded V_A, V_B, V_C (order is randomized; do not infer from code).

For each variant, score 0-10 on:
- Design (visual craft, polish, composition)
- Usability (clarity, hierarchy, readability)
- Creativity (originality, memorable moments)
- Content (message clarity, copy quality)

Apply archetype weights to compute final weighted score.

Disqualify any variant violating a FORBIDDEN item.

Return strict JSON:
{"rankings":[
  {"id":"V_A","scores":{"design":9,"usability":7,"creativity":9,"content":8},
   "weighted":8.4,"rationale":"..."}
], "winner":"V_B","confidence":0..1, "disqualified":[]}
```

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| variant_count | 2 | 5 | int | HARD |
| eligible_beats | — | — | enum{HOOK,PEAK,REVEAL,CLOSE} | HARD (override: `force=true`) |
| parallel_workers | 1 | 4 | int | HARD (wave cap) |
| screenshot_breakpoints | 2 | 4 | enum{375,768,1280,1440} | defaults 1440+375 |
| judge_temperature | 0.0 | 0.3 | float | HARD (ranking stability) |
| judge_confidence_min | 0.6 | 1.0 | float | SOFT (< 0.7 = re-run suggested) |
| max_cost_usd_per_section | 0.5 | 15 | usd | HARD abort >15, SOFT warn >8 |
| judge_model | — | — | enum{opus, sonnet} | SOFT default opus |

### Output artifacts

```
sections/{name}/
├── [winner files, committed to main section]
├── variants/
│   ├── v1/ (loser, archived)
│   ├── v2/ (loser, archived)
│   └── v3/ → (if winner, files moved up one level)
├── tournament-result.json  # full ranking, rationales, confidence
└── tournament-shots/
    ├── v1-1440.png
    ├── v1-375.png
    └── ...
```

## Layer 3: Integration Context

- **`/gen:tournament` command** owns workflow; this skill defines protocol.
- **Orchestrator** detects `variant_tournament: true` in PLAN.md, auto-invokes post-initial-build.
- **Builder** spawned N times, each with distinct brief.
- **Quality-reviewer** re-runs on winner to confirm tier target.
- **Creative-director** authors the N direction briefs; must enforce axis-diversity.

Cost tracking feeds `METRICS.md`:
```yaml
tournament:
  section: hero
  beat: HOOK
  variants: 3
  judge: opus
  winner: V_B
  confidence: 0.82
  cost_usd: 3.47
  durations_s: [145, 132, 158, 18]  # 3 builds + 1 judge
```

## Layer 4: Anti-Patterns

- ❌ **Running on every section** — cost explodes, signal dilutes. Reserve for money-shot beats.
- ❌ **N > 5** — marginal return collapses; judge attention splits.
- ❌ **Letting variants only differ by accent color** — that's A/B testing of polish, not creative-direction competition.
- ❌ **Revealing variant order to judge** — introduces recency/primacy bias. Code variants, randomize.
- ❌ **Running judge at temperature > 0.5** — ranking becomes inconsistent across re-runs.
- ❌ **Hard-committing winner without post-validation** — run quality-reviewer on winner; best-of-N ≠ guaranteed pass.
- ❌ **Archiving losers into git-tracked folder without .gitignore** — bloats repo. Archive under `variants/` which *is* tracked for comparison, but keep `tournament-shots/` gitignored.
