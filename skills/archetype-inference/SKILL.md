---
name: "archetype-inference"
description: "Score ingested site against 33 Design Archetypes via testable-markers. Returns top-3 with per-marker evidence and confidence. Never auto-locks — user confirms via /gen:align."
tier: "domain"
triggers: "archetype inference, classify archetype, archetype match, detect archetype, archetype scoring"
version: "3.21.0"
---

## Layer 1: Decision Guidance

### When to Use

- Stage 4 of ingestion, after DNA extract.
- Before `component-mapping` so mapping heuristics can use archetype context.

### When NOT to Use

- Greenfield — archetype is chosen, not inferred.
- User has already confirmed archetype in `/gen:align`.

## Layer 2: Algorithm

For each of 33 archetypes:

1. Load `skills/design-archetypes/testable-markers.json` → regex + CSS-selector + DOM-pattern markers per archetype.
2. Count matches against captured source (codebase or HTML/CSS).
3. Apply per-archetype weight from `seeds/archetype-weights.json`.
4. Score = Σ(matches × weight) / Σ(weights).
5. Return top-3 with per-marker evidence:
   ```json
   {
     "archetype": "brutalist",
     "confidence": 0.78,
     "evidence": [
       { "marker": "raw-html-font", "hits": 3 },
       { "marker": "mono-display", "hits": 2 },
       { "marker": "bold-borders", "hits": 5 }
     ]
   }
   ```

6. **Never auto-lock**. Write to `ARCHETYPE-MATCH.md`. User confirms via `/gen:align`.

## Layer 3: Integration Context

- Consumes: captured source + DNA-EXTRACTED.md.
- Emits: `ARCHETYPE-MATCH.md` + `archetype.match` ledger entries.
- Feeds: `component-mapping` (archetype context influences block selection).
- Archetype mixing (v3.14 protocol): if top-3 confidences are close (<0.1 apart), treat as primary + secondary + tension candidates.

## Layer 4: Anti-Patterns

- Auto-locking highest score — past v3.18 judge work showed 15% misclassification at first pass; always require user confirm.
- Omitting runner-ups — mixing protocol needs secondary candidates.
- Scoring only on colors — markers span typography, layout, motion, copy tone.
- Ignoring negative markers (forbidden patterns) — presence of forbidden pattern reduces confidence in an archetype.
