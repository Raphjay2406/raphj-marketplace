---
name: "ingest-gap-report"
description: "Unified gap tracking for ingestion. Collects every ambiguity, low-confidence token, unknown license, and user-decision prompt into GAP-REPORT.md. Blocks scaffold stage until cleared."
tier: "domain"
triggers: "ingest gap, gap report, ingestion gaps, user decisions, ambiguity report"
version: "3.21.0"
---

## Layer 1: Decision Guidance

### When to Use

- Every ingestion stage emits `gap` events; this skill aggregates them.
- `/gen:ingest gap <slug>` prints unresolved gaps.
- `/gen:ingest verify <slug>` blocks on unresolved gaps before scaffold.

## Layer 2: Gap taxonomy

| kind | Reason | Blocks scaffold? |
|------|--------|------------------|
| `license-unknown` | Asset license not detectable | Yes |
| `archetype-ambiguous` | Top-2 archetypes within 0.1 confidence | No — mixing OK |
| `dna-low-confidence` | Token confidence < 0.5 | Yes if primary/bg/text |
| `section-ambiguous` | Section matches 2+ beats | Yes |
| `robots-disallow` | Route skipped per robots.txt | No |
| `pii-detected` | PII in content | Yes — must scrub or confirm scope |
| `font-unloadable` | Font family referenced but file missing | No — falls back |
| `dynamic-content` | Section renders client-side; capture may be incomplete | No — noted |
| `auth-gated` | Route required auth during scrape | No — noted |

Each gap in `GAP-REPORT.md`:

```md
## gap:license-unknown#a1b2
**Asset**: assets/hero.jpg (sha256 a1b2c3...)
**Origin**: https://acme.com/hero.jpg
**Blocking**: scaffold stage
**User decision**: confirm license (CC-BY / CC0 / proprietary / other)

Resolve with: /gen:ingest resolve <slug> license-unknown#a1b2 <decision>
```

## Layer 3: Integration Context

- Reads: `preservation.ledger.ndjson` for `kind: "gap"` entries.
- Writes: `GAP-REPORT.md` + `user.decision` ledger entries on resolution.
- Pairs with `/gen:feedback` — gaps surface there when user returns to session.
- Resolution updates ledger; never edits original gap entry.

## Layer 4: Anti-Patterns

- Auto-resolving blocking gaps — must require explicit user decision.
- Hiding non-blocking gaps — always surface for transparency.
- Losing gap context on resolution — resolution references original gap ID.
- Batching all gaps into one approval — each gap resolved individually.
