---
description: "Score 3-5 reference SOTD sites against the 234-pt quality gate; generate gap targets per section."
argument-hint: "[url1 url2 ...] | --from-archetype | --refresh"
allowed-tools: Read, Write, Bash, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_resize
recommended-model: claude-opus-4-6
---

# /gen:benchmark

Competitive benchmarking: Playwright screenshots 3-5 award-winning reference sites, vision LLM scores each on the 234-pt gate, gap targets auto-inject into PLAN.md.

See `skills/competitive-benchmarking/SKILL.md` for the protocol.

## Workflow

### 1. Resolve URLs

- If URLs passed as args: use those.
- If `--from-archetype` (or no args): load curated SOTD list for project's locked archetype from the skill's embedded map.
- Cap N at 5.

### 2. Cache check

Cache key: `sha256(url + viewport + ISO-week)`. If cached <30d at `.planning/genorah/benchmarks-cache/{key}.json`, skip capture.

### 3. Capture

For each URL:
- Playwright navigate (fail-soft on auth walls, 404s — skip + WARN).
- Screenshot at 1440×auto-height and 375×auto-height.
- Store PNG + metadata to `benchmarks-cache/`.

### 4. Score via vision LLM

Per URL: pass screenshots + archetype + 234-pt rubric to Opus. Score all 12 categories + 4 Awwwards axes (Design/Usability/Creativity/Content on 10-point scale).

Calibration: first 3 scored runs of the week should be against known-SOTD baselines (embedded in skill) to detect score drift.

### 5. Synthesize BENCHMARKS.md

```markdown
## Competitor Scores (avg over N)
| Site | Color | Type | Layout | Depth | Motion | Creative | UX | A11y | Content | Responsive | Perf | Integration | Total |
| siteA | 22/24 | 20/24 | ... | ... | 198 |
| siteB | ... | 215 |

## Gap Targets (auto-inject to PLAN.md per section)
- Hero (HOOK): Beat siteA in Color (+15 pts) — they use 5 hues, plan for 3+2 accent
- Features (PROOF): Match siteB's Layout Clarity — they break grid once, plan one tension zone
- Pricing (PEAK): Exceed siteA in Depth — they use 2 shadow layers, plan 3

## Reference library
- siteA.com [screenshot] — Brutalist archetype, signature = oversized numerals
- siteB.com [screenshot] — Ethereal archetype, signature = spotlight gradient
```

### 6. Inject per-section reference targets

For each section in MASTER-PLAN.md, add `reference_targets:` block to its PLAN.md pulling the relevant competitor insight. This feeds the reference-diff-protocol at build time.

## Notes

- Auth walls / 404s → fallback to Wayback Machine snapshot URL (if available), otherwise skip with WARN.
- Cost: 5 sites × 2 breakpoints × 1 vision call ≈ $0.40-1.00. Cache aggressively.
- Curated archetype list is version-pinned with plugin; refresh quarterly.
- Run during `/gen:start-project` after archetype lock, or any time manually.
