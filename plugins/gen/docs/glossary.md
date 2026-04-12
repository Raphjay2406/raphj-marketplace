# Genorah Glossary

Alphabetical. Cross-linked to skill/command files where applicable.

## A

**Archetype** — One of 25 opinionated personality systems (Brutalist, Ethereal, Kinetic, Editorial, Neo-Corporate, Organic, Retro-Future, Luxury, Playful, Data-Dense, Japanese Minimal, Glassmorphism, Neon Noir, Warm Artisan, Swiss/International, Vaporwave, Neubrutalism, Dark Academia, AI-Native, Claymorphism, Neumorphism, Y2K, Cyberpunk-HUD, Spatial-VisionOS, Pixel-Art). Each locks in colors, fonts, mandatory techniques, forbidden patterns, and signature moves. See [`skills/design-archetypes/`](../skills/design-archetypes/SKILL.md).

**Axis 1 / Axis 2** — Quality-gate-v3 is two-axis: Axis 1 = Design Craft (234 pts, inherited from v2), Axis 2 = UX Integrity (120 pts, new in v3.5). A section must clear *both* to reach a given tier.

**Asset Forge** — v3.5.0 asset generation subsystem. 2D SVG, 3D GLB, raster, character, pattern pipelines governed by MANIFEST.json and the asset-forge-dna-compliance sub-gate.

## B

**Beat** — One of 10 emotional-arc roles a section plays (HOOK, TEASE, REVEAL, BUILD, PEAK, BREATHE, TENSION, PROOF, PIVOT, CLOSE). Drives hard constraints on element count, whitespace ratio, reading grade, etc.

**Budget mode** — `lean` | `standard` | `max`. Caps token cost, persona count, Pareto-N, critic cycles. Set in `.claude/genorah.local.md`.

## C

**Cascade cap** — When a sub-gate fires, the parent category in quality-gate-v3 is multiplied by a factor (typically × 0.5 or × 0.7). The raw score is preserved; the "effective" score reflects caps. SUMMARY.md shows both.

**Compaction-Survivor protocol** — v3.5.4 pre-compact hook writes a Tier A-E summary to `compaction-summary.md` that session-start re-emits on resume.

**Context Fabric** — v3.5 retention architecture across 8 layers (L1 scratchpad → L8 user auto-memory). Ledger-driven, sqlite-optional, user-global calibration.

## D

**Design DNA** — Per-project visual identity (12 color tokens + fonts + scale + spacing + signature + motion tokens). Locked early; enforced via DNA drift check.

**DNA drift** — Measures tokenized vs hardcoded color ratio. Hard block when coverage < 92% with `DNA_STRICT=1`; warning otherwise.

**Decision graph** — Typed JSON at `.planning/genorah/decisions.json` replacing flat DECISIONS.md. Nodes have typed edges (impacts, supersedes, evidence).

## E

**Emotional arc** — 10-beat sequence that gives a page narrative shape. Each section plays one beat; archetype-specific arc templates exist.

**Error taxonomy** — Structured GENORAH_* error codes with recovery instructions. See `skills/error-taxonomy/SKILL.md`.

## F

**Few-shot anchor** — Judge-calibration technique. Every judge invocation includes 3 scored reference sections (bad/mid/excellent) from same archetype+beat to anchor the scale.

## G

**Golden set** — 50-entry panel-scored reference corpus in `skills/judge-calibration/golden/`. Seeds judge few-shot anchors AND R1 drift measurement.

## H

**Hard gate** — Binary pass/fail check that blocks all scoring when failed. Five hard gates: motion exists, 4-breakpoint responsive, compat tier, component registry, archetype specificity.

## I

**Inter-judge κ (kappa)** — Cohen's kappa between two independent judge invocations. ≥ 0.7 ship, 0.5–0.7 warn, < 0.5 spawn tiebreaker.

## K

**k1, b** — BM25 hyperparameters used in semantic-index. Default k1=1.5, b=0.75.

## L

**Ledger** — L4 Context Fabric append-only NDJSON at `.planning/genorah/journal.ndjson`. Every significant pipeline event writes one line.

## M

**Manifest** — `public/assets/MANIFEST.json`. Canonical source of truth for every generated asset.

## P

**Pareto front** — Multi-objective variant selection. Variant A dominates B if A ≥ B on all 4 objectives (Design/UX/Archetype-Fit/Reference-SSIM) AND > B on at least one. Front = non-dominated variants.

**Pipeline stage** — 14 numbered stages from Discovery (0) to Post-Ship Learning (14).

**Provisional** — v3.5 numeric thresholds marked PROVISIONAL pending R1-R10 empirical calibration.

## Q

**Quality gate v3** — Current gate (v3.5.0+). 354pt two-axis (Design 234 + UX 120). Supersedes v2's 234pt single axis.

## R

**Reference library RAG** — Curated SOTD examples at `skills/reference-library-rag/entries/`. Retrieved pre-variant-generation to condition builder prompts.

**Research tracks (R1-R10)** — Empirical validation program for v3.5 numeric choices. See `docs/v3.5-research-program.md`.

## S

**Sub-gate** — Component of quality-gate-v3 (motion-health, DNA drift, archetype-specificity, SSIM, hero-mark, asset-compliance, 6 UX sub-gates). Each can fire a cascade cap on its parent category.

**SSIM** — Structural Similarity Index. Used for visual comparison vs reference-library entries.

**Synthetic usability** — AI-persona-driven task probes (6 personas: Skeptic CFO, First-timer, Power user, Mobile, Screen-reader, B1 non-native) via Playwright. 20 pts of Axis 2.

## T

**Tension override** — Documented deviation from archetype rules. Requires explicit DECISIONS.md entry. Escape hatch from hard-gate archetype-specificity.

**Testable markers** — Per-archetype regex patterns (mandatory/forbidden/signature) that make hard-gate #5 (archetype specificity) machine-checkable rather than subjective.

**Tier (quality)** — Named score bands: Reject (<140), Baseline (140-169), Strong (170-199), SOTD (200-219), Honoree (220-234), SOTM (235+). Both axes required.

**Trajectory** — `sections/<id>/trajectory.json`. Per-iteration score + cost + termination reason. Dashboard sparkline source.

## U

**UX floor** — Archetype-specific minimum UX score for ship. Brutalist 65; Editorial 80; Default 75. Seeded in `archetype-weights.json`.

## V

**Variant tournament / Pareto variant selection** — Generate N variants with diversity penalty; score each on 4 objectives; compute Pareto front; resolve ties via archetype-weighted scalar. Replaces scalar tournament on HOOK/PEAK/CLOSE.

## W

**Wave** — Parallel-build group in pipeline. Wave 0 scaffold, Wave 1 shared UI, Wave 2+ independent sections.

**Wave resume** — `/gen:build --resume` retries failed sections without re-running shipped ones.
