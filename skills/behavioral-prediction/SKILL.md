---
name: behavioral-prediction
tier: utility
description: "Vision-LLM predicts attention heatmap + click targets on generated screenshots before ship. Surfaces overlooked CTAs, distracting elements, visual hierarchy failures. Generates attention overlay PNGs + score feeding UX Intelligence category."
triggers: ["heatmap prediction", "attention prediction", "behavioral simulation", "synthetic user", "visual hierarchy audit", "click prediction"]
used_by: ["quality-reviewer", "audit", "polisher"]
version: "3.2.0"
mcp_optional: ["playwright"]
---

## Layer 1: Decision Guidance

### Why

Analytics tells you what users did AFTER ship. This skill predicts what users WILL notice BEFORE ship — using vision LLM as synthetic user. Cheap (one vision call per section). Surfaces "the CTA is invisible because it competes with the illustration" before the user reports low conversion.

### When to Use

- `/gen:audit` optional axis (default-on for HOOK, PEAK, CLOSE beats — high-conversion beats).
- Post-polisher before ship.
- On-demand during `/gen:iterate` to validate a specific change.

### When NOT to Use

- BREATHE / PROOF beats (low-stakes, not worth the call).
- Sections without clear action (pure content pages, docs).
- As replacement for real analytics (it's a PREDICTION, not measurement).

## Layer 2: Protocol

### 1. Capture

Playwright screenshot at 1440 + 375 (desktop + mobile). Both breakpoints because mobile hierarchies differ.

### 2. Prediction call

Vision LLM prompt template:

```
Screenshot of {section_name} ({beat} beat, {archetype} archetype).

Simulate a first-time visitor's visual scan pattern (first 3 seconds).

Return JSON:
{
  "predicted_attention_sequence": [
    {"region": "description", "bbox": [x,y,w,h], "rank": 1, "reason": "..."},
    ...max 5 regions
  ],
  "predicted_click_targets": [
    {"element": "description", "bbox": [x,y,w,h], "probability": 0-1, "reason": "..."}
  ],
  "overlooked_elements": [
    {"element": "description", "bbox": [x,y,w,h], "why_overlooked": "...", "severity": "critical|major|minor"}
  ],
  "hierarchy_score": 0-10,
  "conversion_friction_score": 0-10,
  "rationale": "one paragraph summary"
}
```

Temperature 0.1-0.3 for consistency.

### 3. Attention-heatmap overlay

Generate visualization by blending the screenshot with a heatmap derived from `predicted_attention_sequence` (gaussian blur per region weighted by rank). Output PNG to `.planning/genorah/audit/heatmap-{section}.png`.

Not scientifically rigorous — it's a communication artifact for reviews, not a Tobii replacement.

### 4. Report

Write `.planning/genorah/audit/behavioral-{section}.json` with raw prediction + derived scores. Append summary to audit report.

### 5. Flag findings

- `overlooked_elements` with severity=critical → BLOCK tier cap
- `hierarchy_score < 6` → WARN (revise visual hierarchy)
- `conversion_friction_score > 6` → WARN (reduce friction)
- Predicted-click probability on primary CTA < 0.4 → BLOCK (CTA not prominent)

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| max_vision_calls_per_section | 1 | 2 | count | HARD (cost) |
| vision_temperature | 0.0 | 0.3 | float | HARD (stability) |
| eligible_beats | — | — | enum{HOOK,PEAK,CLOSE,REVEAL} | default scope |
| cta_click_probability_min | 0.4 | 1.0 | prob | HARD (primary CTA) |
| hierarchy_score_min | 6 | 10 | int | WARN below |

## Layer 3: Integration Context

- **quality-reviewer Stage 6** — invokes this skill for eligible beats, feeds findings into UX Intelligence category (1.1x weight).
- **Audit report** — embeds heatmap PNG + overlooked-elements table.
- **Polisher** — receives remediation list: "move primary CTA into predicted scan region 1".
- **Visual-refiner** — low conversion-friction score can trigger targeted iteration.

## Layer 4: Anti-Patterns

- ❌ **Treating prediction as measurement** — LLM simulates a user, it doesn't observe real users. Replace once real analytics exists.
- ❌ **Running on every section** — BREATHE / PROOF doesn't justify the cost. Default-on for HOOK/PEAK/CLOSE only.
- ❌ **Ignoring overlooked_elements with severity=major** — those are the same LLM's confession that its simulated user missed something. Treat like real user feedback.
- ❌ **High temperature** — predictions become inconsistent across runs, can't diff across refinements.
- ❌ **Heatmap as gospel** — it's a communication artifact, not a scientific heatmap. Label outputs clearly.
