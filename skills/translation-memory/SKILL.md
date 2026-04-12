---
name: translation-memory
description: Translation memory store at ~/.claude/genorah/translations/tm.db (SQLite). Keyed by segment hash + source/target locale. Reuse across projects for brand consistency.
tier: core
triggers: translation-memory, tm, i18n, l10n, translation-reuse
version: 0.1.0
---

# Translation Memory (L6-adjacent)

User-global store. Same phrase across 5 projects → translate once, reuse everywhere.

## Layer 1 — Schema

```sql
CREATE TABLE translations (
  id INTEGER PRIMARY KEY,
  segment_hash TEXT NOT NULL,
  source_locale TEXT NOT NULL,
  target_locale TEXT NOT NULL,
  source_text TEXT NOT NULL,
  target_text TEXT NOT NULL,
  translator TEXT NOT NULL,  -- 'deepl' | 'claude' | 'human:<name>'
  quality_score INTEGER,      -- 1-5 post-review
  archetype TEXT,              -- voice-bound context
  domain TEXT,                 -- 'ui' | 'marketing' | 'legal' | 'docs'
  reviewed_by TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_hash_locale ON translations (segment_hash, target_locale);
CREATE INDEX idx_source_target ON translations (source_locale, target_locale);
```

## Layer 2 — Fuzzy match

Not only exact hash match; also 70-95% similarity for human-reviewer suggestions:

```ts
const matches = await tm.fuzzyMatch(source, { minSimilarity: 0.7, targetLocale });
// returns ranked list with % similarity; 100% = reuse, <100% = suggest-with-edit
```

## Layer 3 — Integration

- Every translation call checks TM first → cache hit saves API cost
- Post-review score updates quality_score
- Cross-archetype reuse requires matching archetype OR domain='ui' (UI strings archetype-neutral)

## Layer 4 — Anti-patterns

- ❌ Auto-reuse without archetype match on marketing copy — tone drift
- ❌ Never reviewing scores — low-quality entries compound
- ❌ TM per-project instead of user-global — defeats purpose
