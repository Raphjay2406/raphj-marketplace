---
description: "v3.21 — Ingest existing projects into Genorah without losing detail. Codebase or live URL. Source preserved verbatim; every transformation logged in an append-only preservation ledger."
argument-hint: "<codebase|url|route|diff|gap|verify|resolve> <path-or-url-or-slug> [flags]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
recommended-model: opus-4-6
---

# /gen:ingest

Import existing projects (built outside the Genorah pipeline) without losing any detail. Source preserved in `source/` (or `captured/`), every byte traced in `preservation.ledger.ndjson`.

## Subcommands

### `codebase <path> [--slug=<slug>]`

Mirror + inventory + DNA + archetype + mapping from a local repo.

```bash
/gen:ingest codebase ./legacy-acme-site --slug=acme
# → .planning/genorah/ingested/acme/
```

Runs stages 1-5 automatically, then writes `GAP-REPORT.md` with user-decision prompts.

### `url <url> --consent [--slug=<slug>] [--max-routes=50]`

Crawl live site via Playwright. **Requires `--consent`** flag confirming authority to scrape per ToS and applicable law.

```bash
/gen:ingest url https://acme.com --consent --slug=acme-prod
```

Honors robots.txt. Captures HTML + CSS + JS + screenshots (375/768/1280/1440) + computed styles + assets per route.

### `route <url> --into <slug>`

Append a single route to an existing ingestion (incremental).

### `diff <slug-a> <slug-b>`

Compare two ingestions. Useful for before/after redesign, or codebase-vs-URL cross-check.

### `gap <slug>`

Print unresolved gaps from `GAP-REPORT.md` with resolution commands.

### `verify <slug>`

Run preservation invariants check. Blocks scaffold stage on failure.

```bash
node scripts/ingest/preservation-ledger.mjs verify <slug>
```

Invariants:
- Every `source/**` file has `capture.file` event.
- Every asset has confirmed license OR paired `gap:license-unknown`.
- Every `content.extract` has valid destination.
- Every low-confidence `dna.extract` has paired `gap`.

### `resolve <slug> <gap-id> <decision>`

User decision on a blocking gap. Appends `user.decision` ledger entry (never mutates original gap).

## Pipeline

```
capture → inventory → extract DNA → match archetype → map → gap report → verify → scaffold
```

Emits standard `.planning/genorah/` artifacts so `/gen:align`, `/gen:plan`, `/gen:build` operate normally afterward.

## Skills involved

`codebase-ingestion`, `url-scrape-ingestion`, `dna-reverse-engineer`, `archetype-inference`, `content-extraction`, `component-mapping`, `asset-provenance`, `preservation-ledger`, `ingest-gap-report`.

## Architecture

See `docs/v3.21-ingestion-architecture.md`.
