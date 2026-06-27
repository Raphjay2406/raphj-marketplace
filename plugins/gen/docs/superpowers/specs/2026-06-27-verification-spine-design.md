# Verification Spine — Design Spec

**Date:** 2026-06-27
**Status:** Approved (brainstorming complete, pending implementation plan)
**Target release:** Genorah v4.1.0 "Enforcement"

## Problem

Three user-reported failures of the Genorah pipeline, which share one root cause:

1. **UI quality gate drops significantly over time.** Scoring is ~60% subjective LLM judgment and ~40% measurable, with hidden multiplier cascades (a 212 can silently become 178 via an unseen ×0.5 sub-gate), drifting judge calibration, and no reproducibility — re-running `/gen:audit` on unchanged code can yield a different score.
2. **Audits miss real visual and functional bugs.** The audit reviews *code statically*; it does not reliably *run the site*. Playwright is "optional with graceful fallback," so when the dev server or MCP is unavailable the audit silently falls back to reading code and still passes sections. There is no hard gate that the site compiles, has zero console errors, or that interactions work. A section can score 234/234 without rendering a single pixel.
3. **Generated UI is too "normal"; asset generation is weak.** The `gpt-image` MCP is wired, but image generation is optional. The planner often omits an `<images>` block, so the builder ships a flat section. Nothing forces HOOK/PEAK beats to contain real generated imagery or a genuine wow moment; "wow" is a scoring bonus, never a pass/fail gate.

**Root cause:** the pipeline *describes* quality aspirationally but does not *enforce* it. It confuses **descriptive scoring** ("how good does this code look?") with **functional verification** ("does this actually build, run, and wow?").

## Decisions (locked during brainstorming)

- **Scope:** one unified enforcement layer that fixes all three at the root (not three separate patches).
- **Runtime assumption:** a dev server (`npm run dev`) and a browser MCP (Playwright and/or chrome-devtools) are reliably available during build/audit. Enforcement may navigate, screenshot, click, and read the console for real.
- **Strictness:** hard-block, **harness-enforced** — failures block progress via Claude Code hooks/scripts executed by the harness, not the model, so they cannot be rationalized away.
- **Approach:** **A (deterministic harness) + a thin slice of B (verifier subagent wrapper).** The script does the measuring; a lightweight agent interprets the verdict and writes fixes; hooks enforce freshness.

## Architecture: the Verification Spine

A new subsystem at the section/wave boundary of the existing pipeline. Three parts.

### 1. `scripts/verify/verify-section.mjs` — deterministic engine (single source of truth)

Given a section name + dev-server URL, it:

- Ensures the app **builds** (framework-aware: `next build`, etc.) and the dev server is **up** (boots one if absent; owns its lifecycle; tears down on exit).
- Drives the **browser MCP / Playwright** to load the section at 4 breakpoints (375 / 768 / 1280 / 1440) → captures screenshots, **collects console errors and warnings**, and exercises **declared interactions** (clicks, hovers, form submit).
- Runs **axe** (a11y) and **Lighthouse** (perf / CWV).
- Checks the **required-asset manifest** (see Asset-gen enforcement).
- Writes `.planning/genorah/sections/<name>/VERDICT.json`: a versioned, machine-readable verdict with a hard `floor.pass` boolean, the measured numbers, the **input-hash** of the section files it verified, and the **rubric version**.

The Floor verdict is a **pure function of the code**: identical input bytes always produce an identical Floor verdict.

### 2. `hooks/verify-gate.mjs` — the blocking hook (makes "hard-block" real)

Registered on **`PostToolUse`** (matching the Edit/Write/Bash calls that signal section completion — e.g. writing `SUMMARY.md` or a `STATE.md` completion marker) and on **`Stop`** (end-of-turn backstop). It:

- Loads the target section, recomputes the **input-hash** from current files, compares against `VERDICT.json`.
- Returns a **blocking decision** with a reason when the verdict is **missing**, **stale** (hash mismatch), or `floor.pass !== true`.
- Is **scoped narrowly**: fires only for Genorah projects (presence of `.planning/genorah/`) and only on completion-signal tool calls — zero friction for unrelated work.
- **Degrades loudly, never silently:** if the dev server genuinely cannot boot, that is recorded as a Floor *failure*, not a pass.

Freshness via input-hash defeats the "ran verify once early, then kept editing" dodge: any edit invalidates the verdict and re-arms the gate.

### 3. `verifier` agent — thin interpretation wrapper (the B-slice)

Does **not** measure. It reads `VERDICT.json`, interprets failures into a prioritized `GAP-FIX.md`, routes remediation to `polisher` / `visual-refiner`, and re-arms the loop (preserving today's 2–3 cycle cap). Interpretation is the LLM's job; verification is the script's job.

### Attach points

- `/gen:build` — after each wave, before marking sections done.
- `/gen:audit` — full-page spine run.
- `/gen:ship-check` — already build-gated; the spine becomes its visual/functional teeth.

Existing `quality-reviewer` and `visual-refiner` agents are **refactored to consume `VERDICT.json`** instead of independently deciding whether to run Playwright. Their external interfaces are preserved.

**Core inversion:** today "did we verify?" is a model decision; after this it is a file-existence-and-freshness fact the harness checks.

## Floor / Ceiling scoring split (fixes complaint #1)

The blended single score is split cleanly.

### The Floor — deterministic, hard-block, 100% reproducible

A fixed checklist of measurable facts, each PASS/FAIL, computed **only** by `verify-section.mjs`:

- Builds with zero errors.
- Zero console errors at runtime.
- No horizontal overflow at any of the 4 breakpoints.
- axe = 0 critical/serious violations.
- Lighthouse perf ≥ budget (from `perf-budgets`).
- Required assets present and visible (see next section).
- Declared interactions actually fire.
- Motion present.

Any Floor failure ⇒ `floor.pass = false` ⇒ section blocked. No drift, no cascade, no nondeterminism.

### The Ceiling — subjective, advisory, never silently caps the Floor

The taste score (wow, archetype specificity, compositional boldness) stays an LLM judgment but is **decoupled**. It can **never** multiply or lower a Floor pass. It does three honest things instead:

1. Reported as its own 0–100 "Ceiling score" with the judge's visible reasoning.
2. Drives the **tournament** (pick the boldest of N variants).
3. If below target, **emits a concrete GAP-FIX** — never a silent point deduction.

### Reproducibility contract

`VERDICT.json` records the **input-hash** and **rubric version**. Re-running on unchanged code returns the identical Floor verdict (asserted by a test). The Ceiling score is explicitly labelled *advisory / non-deterministic* so it is never mistaken for a stable measurement.

### Migration of the existing gate

The 234/394-point rubric is not discarded: its **measurable** criteria move into the Floor (enforced); its **subjective** criteria move into the Ceiling (advisory). The hidden multiplier-cascade addenda in `quality-gate-v2` are **removed** — the single intentional breaking change to scoring semantics, and the fix the user asked for.

## Asset-gen enforcement (fixes complaint #3)

The *absence* of a promised wow asset becomes a **Floor failure**.

### 1. Beat → required-asset contract

A rubric (`skills/wow-moments` + a new `asset-requirements` table) maps emotional beats to mandatory visual payload:

- **HOOK / PEAK** → MUST contain a real wow payload: a generated hero/atmospheric image **or** a qualifying signature moment (3D / canvas / shader / kinetic). At least one; a plain gradient + heading does **not** count.
- **TENSION / CLOSE** → MUST contain a texture/atmosphere asset or a signature interaction.
- **BREATHE** → exempt (intentional calm).

### 2. The planner must declare it

`/gen:plan` must emit an `assets:` block in each scored section's `PLAN.md` naming the intended payload and its source (gpt-image generate / edit, 3D, shader, etc.). A planner lint (extends `scripts/validators/`) **blocks** a PLAN that leaves a HOOK/PEAK beat with no declared wow payload.

### 3. The builder must deliver it — harness checks reality, not the promise

`verify-section.mjs` checks the **rendered DOM / manifest**: does the PEAK section actually render the generated image / mount the canvas / run the signature interaction? It verifies the asset exists on disk, is referenced and visible in the build, and is not a TODO placeholder. A declared-but-missing asset ⇒ Floor fail ⇒ blocked.

### 4. Boldness pressure on the Ceiling side

`design-brainstorm` / `wow-moments` gain a **"too-safe" detector**: low-boldness directions are flagged and the tournament is biased toward the higher-Ceiling variant. The Floor guarantees a wow payload exists; the Ceiling pushes it to be a great one.

### 5. gpt-image wiring audit

Sweep every builder/specialist agent for dead `mcp__nano-banana__*` tool names (the agent registry still shows `builder` carrying them) and repoint to `mcp__gpt-image__*`, so mandatory generation cannot silently fail on a missing tool.

## Rollout, migration, testing

- **Versioning:** ships as **v4.1.0 "Enforcement"**; add `docs/v4.1-changelog.md`; bump `.claude-plugin/plugin.json`.
- **Mirror discipline:** every new script/hook/skill/agent edit must be synced into `plugins/gen/` via `sync-mirror`; `check-mirror` stays in `prepush`. (Known footgun: mirror tooling has historically skipped directories — verify the spine files actually land in the mirror.)
- **Backward-compat:** the spine is **additive**. Existing commands keep working; `quality-reviewer` / `visual-refiner` are refactored to read `VERDICT.json` but keep their interfaces. Removing the `quality-gate-v2` cascade addenda is the only breaking scoring change.
- **Testing (this plugin's own suite):** new `tests/verify-spine.test.mjs` asserts:
  - (a) Floor verdict is reproducible on identical input;
  - (b) the gate blocks on missing / stale / failing verdict;
  - (c) planner-lint blocks a HOOK/PEAK PLAN with no declared asset;
  - (d) no surviving `mcp__nano-banana__*` references.
  Wired into `npm run validate`.
- **Dogfood proof:** before "done," run the full spine against one real generated project; show a `VERDICT.json` that **fails** for a planted bug (console error + missing PEAK asset) and **passes** after the fix — evidence, not assertion.

## Scope guard

This first pass does **not** rebuild the 287 skills or re-architect the agent tiers. It adds the enforcement spine and refactors only the handful of quality/asset touchpoints that consume it.

## Components and boundaries

| Unit | Responsibility | Depends on | Consumed by |
|------|----------------|-----------|-------------|
| `scripts/verify/verify-section.mjs` | Measure; produce `VERDICT.json` | dev server, browser MCP, axe, Lighthouse, asset manifest, `perf-budgets` | hook, verifier agent, ship-check |
| `hooks/verify-gate.mjs` | Block on missing/stale/failing verdict | `VERDICT.json`, input-hash | harness (PostToolUse, Stop) |
| `verifier` agent | Interpret verdict → `GAP-FIX.md`; route remediation | `VERDICT.json` | polisher, visual-refiner |
| `asset-requirements` rubric | Beat → mandatory payload mapping | emotional-arc beats | planner-lint, verify-section |
| planner-lint (in `scripts/validators/`) | Block PLAN with undeclared HOOK/PEAK asset | `asset-requirements`, `PLAN.md` | `/gen:plan` |

## Open questions for the implementation plan

- Exact framework-detection matrix for the build/dev-server step (Next/Astro/SvelteKit/Nuxt/Vite).
- Which browser MCP to prefer when both Playwright and chrome-devtools are present.
- Precise `PostToolUse` matcher(s) that reliably correspond to "section marked complete."
