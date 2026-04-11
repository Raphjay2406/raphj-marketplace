---
name: quality-learning
description: "Self-improving quality loop: accumulate project scores in Obsidian Knowledge Base, query empirical patterns during research phase, recommend proven techniques based on archetype/industry history. Turns the plugin from rule-based to empirically-improving."
tier: utility
triggers: "quality learning, empirical, past projects, patterns, history, what worked, score history, archetype performance"
version: "2.8.1"
---

# Quality Learning

## Layer 1 — Decision Guidance

### When to Use

- **During `/gen:start-project` research phase** — query past project scores to surface empirical recommendations for the chosen archetype and industry vertical. This gives the Creative Director data-backed technique suggestions instead of relying solely on skill rules.
- **During creative direction (`/gen:discuss`)** — when debating technique choices, pull historical performance data: "Glassmorphism projects that used layered blur scored 2.8/3 on Depth & Polish vs 1.4/3 without."
- **During `/gen:audit`** — compare current project scores against historical baselines for the same archetype. Flag categories where the project underperforms the archetype average.
- **After project completion or final audit** — export the project's quality data to the Knowledge Base so future projects benefit.

### Why It Matters

Rule-based systems plateau. A plugin that remembers which techniques actually scored well — across real projects, real archetypes, real industries — improves with every project. After 10+ projects, empirical recommendations become statistically meaningful. After 50+, the plugin can predict which techniques will score highest for a given archetype/industry combination before a single line of code is written.

---

## Layer 2 — Quality Accumulation Protocol

After each project audit (via `/gen:audit`) or project completion, export the following to the Obsidian Knowledge Base at `Knowledge/project-history/{project-slug}.md`:

```markdown
# Project: [name] — [YYYY-MM-DD]

## Scores
- Final score: NNN/234 ([tier name])
- Awwwards estimate: [D.d / U.u / C.c / Co.co] — avg [X.X]
- Per-category breakdown:
  | Category | Score | Max | Notes |
  |----------|-------|-----|-------|
  | Colors | X | 18 | |
  | Typography | X | 18 | |
  | Layout | X | 18 | |
  | Depth & Polish | X | 18 | |
  | Motion | X | 18 | |
  | Creative Courage | X | 18 | |
  | UX Intelligence | X | 18 | |
  | Performance | X | 24 | |
  | Accessibility | X | 24 | |
  | Integration | X | 18 | |
  | AI-UI Fidelity | X | 18 | |
  | Responsiveness | X | 24 | |
- Penalties applied: [list with point values]
- Hard gate passes/fails: [list]

## Techniques That Scored Highest
- [Category]: [technique] — scored 3/3 — [why it worked]
- [Category]: [technique] — scored 3/3 — [why it worked]
- [Category]: [technique] — scored 3/3 — [why it worked]

## Techniques That Scored Lowest
- [Category]: [technique] — scored 0-1/3 — [what went wrong]
- [Category]: [technique] — scored 0-1/3 — [what went wrong]

## Stack & Archetype
- Archetype: [name]
- Framework: [nextjs | astro | react-vite | tauri | expo | flutter | etc.]
- Industry: [vertical]
- Quality target: [MVP | Premium | Award-Ready]
- Tension overrides used: [list or none]

## Font Pairing
- Display: [font name]
- Body: [font name]
- Mono: [font name or none]
- Typography score: X/18

## Lessons for Future Projects
- REPLICATE: [2-3 patterns that worked well]
- AVOID: [2-3 patterns that didn't work]
- INSIGHT: [1 non-obvious observation]
```

### Export Rules

- Run export automatically at the end of every `/gen:audit` that produces a final score.
- If the Knowledge Base path does not exist, create it.
- Use the project slug (lowercase, hyphenated) as the filename.
- If a file already exists for this project, append the date to create a version history: `{slug}-{YYYY-MM-DD}.md`.
- Never overwrite a previous export — history is the point.

---

## Layer 2 — Query Protocol (During Research Phase)

When `/gen:start-project` runs the Researcher agent, execute the following query sequence:

### Step 1 — Gather History

1. Read `Knowledge/project-history/` for all past project files.
2. Parse each file to extract: archetype, industry, framework, final score, per-category scores, techniques, penalties, font pairings, and lessons.

### Step 2 — Filter by Relevance

1. Primary filter: matching archetype (exact match).
2. Secondary filter: matching industry vertical.
3. Tertiary filter: matching framework.
4. If fewer than 3 matches on primary filter, widen to related archetypes (e.g., Brutalist relates to Neubrutalism; Ethereal relates to Glassmorphism).

### Step 3 — Generate Empirical Recommendations

```markdown
## Empirical Recommendations (from [N] past projects)

### Archetype Performance
- [Archetype] projects average [score]/234 ([tier])
- Highest-scoring category: [name] (avg [score]/max)
- Lowest-scoring category: [name] (avg [score]/max)
- Most common penalty: [penalty] (hit in [N]% of projects)

### Proven Techniques (sorted by average score)
- [Technique 1]: used in [N] projects, average score [X.X]/3
- [Technique 2]: used in [N] projects, average score [X.X]/3
- [Technique 3]: used in [N] projects, average score [X.X]/3

### Techniques to Avoid
- [Technique]: used in [N] projects, average score [X.X]/3 — common issue: [description]

### Common Penalties
- [Penalty 1]: hit in [N]% of projects — prevention: [specific action]
- [Penalty 2]: hit in [N]% of projects — prevention: [specific action]

### Font Pairing Performance
- [Display + Body]: avg typography score [X]/18, used in [N] projects
- [Display + Body]: avg typography score [X]/18, used in [N] projects

### Industry-Specific Insights
- [Industry] projects score highest in [category], lowest in [category]
- Recommended focus areas: [list]
```

### Step 4 — Inject Into Pipeline

1. Write the Empirical Recommendations section into `.planning/genorah/PROJECT.md` under a dedicated heading.
2. Pass technique recommendations to the Creative Director agent as weighted suggestions (not mandates).
3. During `/gen:audit`, include a "vs. Historical Average" comparison column in the score output.

---

## Layer 3 — Integration Context

### DNA Connection

- Quality Learning does not directly modify DNA tokens. It influences token selection indirectly by surfacing which color systems, font pairings, and motion profiles scored highest historically.
- Font pairing performance data feeds into the Creative Director's font selection during `/gen:start-project`.

### Pipeline Stages

| Stage | Role |
|-------|------|
| `/gen:start-project` | Query history, inject empirical recommendations |
| `/gen:discuss` | Surface technique performance data during debates |
| `/gen:audit` | Compare against historical baselines, export new data |
| `/gen:export` | Include quality history summary in deliverables |

### Related Skills

- **quality-gate-v2** — provides the scoring system that this skill accumulates
- **design-archetypes** — archetype labels used for filtering and grouping
- **obsidian-integration** — the Knowledge Base where project history is stored
- **typography** — font pairing performance data feeds back into font selection
- **color-system** — color technique performance influences palette recommendations

---

## Layer 4 — Anti-Patterns

### Small Sample Bias

**Mistake:** Drawing strong conclusions from 1-2 projects. "Brutalist projects score 180/234" based on a single project is noise, not signal.

**Fix:** Display sample size prominently. Mark recommendations with confidence levels: Low (1-3 projects), Medium (4-9), High (10+). Never present Low confidence recommendations as definitive.

### Over-Fitting to One Industry

**Mistake:** If 8 of 10 past projects are SaaS dashboards, the system biases all recommendations toward SaaS patterns even for an e-commerce site.

**Fix:** Always filter by industry first. When cross-industry data is used (due to small sample), explicitly label it: "Based on cross-industry data — may not apply to [current industry]."

### Ignoring Creative Risk for Safe Scores

**Mistake:** The system learns that conservative techniques score reliably (2/3) while bold techniques are volatile (0/3 or 3/3). Over time, it stops recommending creative risks, and every project converges to the same safe playbook.

**Fix:** Track Creative Courage scores separately. If a technique scored 3/3 on Creative Courage even once, flag it as a "high-ceiling" option. The system should recommend a mix: proven safe techniques for baseline score, plus 1-2 high-ceiling techniques for SOTD potential.

### Stale Data

**Mistake:** Recommendations based on projects from 2+ years ago when design trends, framework capabilities, and scoring criteria have evolved.

**Fix:** Weight recent projects higher. Apply a decay factor: projects from the last 6 months get full weight, 6-12 months get 0.75x, 12-24 months get 0.5x, older than 24 months get 0.25x. Display the date range of contributing projects.

### Confusing Correlation with Causation

**Mistake:** "Projects with Framer Motion scored higher on Motion" — this may simply mean that projects using Framer Motion were more ambitious overall, not that Framer Motion itself caused higher scores.

**Fix:** Only recommend specific techniques, not tools. Focus on what was built (parallax scroll, staggered reveals, magnetic cursors), not what library was used. Let the Builder agent choose the implementation tool.
