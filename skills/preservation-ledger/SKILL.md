---
name: "preservation-ledger"
description: "Append-only NDJSON audit trail for project ingestion. Every byte touched, every token derived, every mapping decision logged with origin → destination → transformation. Gates `/gen:ingest verify` invariants."
tier: "core"
triggers: "preservation ledger, ingest ledger, audit trail, provenance log, ingest provenance"
version: "3.21.0"
---

## Layer 1: Decision Guidance

### When to Use

- Every stage of `/gen:ingest` emits ledger entries.
- `/gen:ingest verify` reads ledger to validate preservation invariants.
- Debugging "where did this token come from?" — ledger traces back to origin.

### When NOT to Use

- Non-ingest pipeline state — use `context-fabric-ledger` (L4, different schema, project-runtime not ingest-time).

## Layer 2: Schema

One NDJSON line per event. Append-only; never edit or delete.

```ndjson
{"ts":"2026-04-12T10:00:00.123Z","kind":"capture.file","path":"source/src/App.tsx","bytes":2400,"sha256":"..."}
{"ts":"...","kind":"capture.route","route":"/pricing","status":200,"breakpoints":[375,768,1280,1440]}
{"ts":"...","kind":"inventory.component","file":"src/components/Hero.tsx","loc":145}
{"ts":"...","kind":"dna.extract","token":"color.primary","value":"#1a1a1a","confidence":0.94,"method":"kmeans-frequency","evidence":"hist-top-1"}
{"ts":"...","kind":"archetype.match","archetype":"brutalist","confidence":0.78,"rank":1}
{"ts":"...","kind":"map.component","source":"src/components/Hero.tsx","block":"HOOK","confidence":0.82}
{"ts":"...","kind":"content.extract","selector":"h1.hero-title","text":"Ship faster","destination":"CONTENT.md:hero.title"}
{"ts":"...","kind":"asset.download","url":"https://acme.com/og.jpg","sha256":"...","bytes":42000,"preserved_at":"assets/a1b2.jpg","license":"unknown"}
{"ts":"...","kind":"gap","reason":"license-unknown","asset":"assets/a1b2.jpg","needs_user":true}
{"ts":"...","kind":"user.decision","gap_id":"...","decision":"confirm-cc-by","actor":"raphj2406"}
```

## Layer 3: Integration Context

- API surface: `scripts/ingest/preservation-ledger.mjs` exports `append(slug, event)`, `readAll(slug)`, `verify(slug)`.
- Verify invariants:
  - Every `source/**` file has `capture.file`.
  - Every asset has `capture` + (`license.confirmed` OR `gap.license-unknown`).
  - Every `content.extract` has valid destination.
  - Every `dna.extract` with confidence < 0.5 has paired `gap`.
- Pairs with L4 `context-fabric-ledger` — different concern, different file, both append-only.

## Layer 4: Anti-Patterns

- Editing historical entries — forbidden; corrections are NEW entries with `kind: "correction"` pointing to original.
- Summarizing/compacting the ledger — defeats preservation; keep verbatim.
- Skipping entries on error — errors themselves must log (`kind:"error"`).
- Shared ledger across slugs — one ledger per ingested project.
