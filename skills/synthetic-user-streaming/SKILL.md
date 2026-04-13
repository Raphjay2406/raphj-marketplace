---
name: "synthetic-user-streaming"
description: "Mid-wave synthetic persona streaming — 6 personas emit AGENT_STATE_UPDATE events as they traverse sections, findings surfaced before wave merge"
tier: "domain"
triggers: "synthetic user, persona probe, streaming persona, mid-wave qa, user simulation, persona findings"
version: "4.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- Mid-wave quality check before wave merge — run personas while builders are still active
- When `/gen:synthetic-test` is invoked and `streaming: true` is set in the task envelope
- When quality-director wants confusion-map data before polisher runs

### When NOT to Use

- Post-ship regression — use `synthetic-user-testing` (batch mode) instead
- Unit component testing — use `testing-patterns` instead

### Decision Tree

- If wave has 2+ sections and polisher is queued → run streaming probe in parallel with builders
- If `GENORAH_OFFLINE=1` → run local simulation only, skip Playwright-backed steps
- If single section → full probe still runs; 6 personas still emit events

### Pipeline Connection

- **Referenced by:** `synthetic-persona-prober` worker during wave execution
- **Consumed at:** `/gen:audit` step 3, `/gen:ux-audit` step 2

## Layer 2: Award-Winning Examples

### Pattern: Emit AGENT_STATE_UPDATE per step

```typescript
// scripts/synthetic-persona/run-persona.mjs
export function emitStateUpdate(event) {
  // Writes to process.stdout as NDJSON for AG-UI consumers
  process.stdout.write(JSON.stringify({ type: "AGENT_STATE_UPDATE", ...event }) + "\n");
}

export async function runPersona(personaId, sections, dnaAnchor) {
  for (const section of sections) {
    emitStateUpdate({ persona_id: personaId, section, status: "visiting", ts: new Date().toISOString() });
    const finding = await probeSection(personaId, section, dnaAnchor);
    emitStateUpdate({ persona_id: personaId, section, status: finding.status, detail: finding.detail, ts: new Date().toISOString() });
  }
}
```

### Pattern: Collect findings into PersonaProbeReport

```typescript
const PERSONAS = ["first-timer", "skeptic", "mobile-thumb", "screen-reader", "returning-pro", "c-suite"];

export async function runAllPersonas(sections, dnaAnchor) {
  const results = await Promise.all(
    PERSONAS.map(id => runPersona(id, sections, dnaAnchor))
  );
  const completionRate = results.filter(r => r.converted).length / PERSONAS.length;
  return { completionRate, confusionMap: buildConfusionMap(results), croFlags: collectCroFlags(results) };
}
```

### Reference Sites

- **Linear** (linear.app) — Streaming state updates in onboarding, each step confirmed before next unlocks
- **Vercel Dashboard** (vercel.com/dashboard) — Real-time deployment state matches mid-wave streaming pattern
- **Notion AI** (notion.so) — Partial rendering with live state updates mirrors AGENT_STATE_UPDATE emission

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `primary` | CTA button color checked against WCAG contrast in mobile-thumb persona |
| `bg` / `surface` | Confusion detection: low contrast between bg and surface triggers screen-reader flag |

### Archetype Variants

| Archetype | Adaptation |
|-----------|-----------|
| Brutalist | skeptic persona checks for pricing above fold (brutalist hides it — force flag) |
| Luxury/Fashion | first-timer allowed 12s instead of 8s for value-prop clarity |
| Data-Dense | returning-pro persona expects scannable data table; absence triggers confusion |

### Pipeline Stage

- **Input from:** wave-director dispatches `PersonaSpec` with `wave_id` + `section_slugs[]`
- **Output to:** polisher worker consumes `PersonaProbeReport`; quality-director stores in `audit/`

### Related Skills

- `synthetic-user-testing` — full batch mode (post-wave); streaming is the mid-wave variant
- `ux-heuristics-gate` — confusion rules referenced by persona probing logic
- `streaming-pipeline-events` — AGENT_STATE_UPDATE schema and emission protocol

## Layer 4: Anti-Patterns

### Anti-Pattern: Running personas sequentially

**What goes wrong:** 6 personas × N sections = slow; polisher waits; wave merge delayed by minutes.
**Instead:** `Promise.all(PERSONAS.map(...))` — all 6 run in parallel, findings merge after all complete.

### Anti-Pattern: Emitting findings only at the end

**What goes wrong:** AG-UI consumers see nothing until probe finishes; no real-time feedback to builder.
**Instead:** Emit `AGENT_STATE_UPDATE` at every section transition, not just on final report.

### Anti-Pattern: Treating all personas equally for all archetypes

**What goes wrong:** Luxury archetype legitimately hides pricing — skeptic flags it as a bug.
**Instead:** Pass `archetype` in `PersonaSpec`; persona rules have archetype-aware thresholds.

### Anti-Pattern: Blocking wave merge on persona probe

**What goes wrong:** Probe runs synchronously before polisher — kills parallelism benefit.
**Instead:** Polisher subscribes to `findings_ready` event; probe and initial polish run concurrently.
