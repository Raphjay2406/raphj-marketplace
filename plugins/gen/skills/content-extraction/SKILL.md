---
name: "content-extraction"
description: "Pull copy, microcopy, alt text, and structured content out of ingested source. DOM-path-addressed so every string traces back to origin. PII-scrubbed before persisting."
tier: "domain"
triggers: "content extraction, extract copy, ingest content, scrape copy, alt text extraction"
version: "3.21.0"
---

## Layer 1: Decision Guidance

### When to Use

- Stage 5 of ingestion (map), after DNA + archetype.
- Both codebase (JSX text nodes, MDX, CMS fetches) and URL (rendered DOM text) paths.

### When NOT to Use

- Binary/media content — see `asset-provenance`.
- Code comments — intentionally excluded from content extraction.

## Layer 2: Flow

1. Traverse source/DOM; collect text nodes with DOM-path (e.g., `article.hero > h1.title`).
2. Run each string through `pii-regex-v2026` scanner.
   - Matches → `GAP-REPORT.md` with redaction candidate; do not persist to CONTENT.md.
   - Clean → persist.
3. Group by section heuristic:
   - Elements under `<section>` / `<article>` form a section group.
   - First `<h1>-<h2>` in group → `headline`.
   - First paragraph → `subheadline` / `body`.
   - `<button>` / `<a class*="cta">` → `cta`.
4. Write to `CONTENT.md` with section keys; emit `content.extract` ledger entry per string with selector + destination.

## Layer 3: Integration Context

- Feeds `/gen:build` and `/gen:iterate` downstream.
- Links to `component-mapping` (same section grouping informs both).
- Respects `brand-voice-extraction` — ingested copy is raw input for voice fingerprint.

## Layer 4: Anti-Patterns

- Concatenating all text into one blob — loses structure; preserve per-selector.
- Skipping PII scan "because it's my site" — always scan; user toggles only via explicit flag.
- Translating inline — preserve source language verbatim; translation is a separate stage.
- Dropping whitespace/formatting — Markdown-escape inline code / newlines to preserve.
