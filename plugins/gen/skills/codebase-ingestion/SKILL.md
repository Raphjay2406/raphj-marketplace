---
name: "codebase-ingestion"
description: "Ingest existing repository into Genorah pipeline. Detects framework, extracts tokens from config (tailwind.config/theme.ts/CSS vars), inventories components + content + assets. Source preserved verbatim under source/."
tier: "domain"
triggers: "ingest codebase, import repo, existing project, legacy codebase, migrate project, onboard repo"
version: "3.21.0"
---

## Layer 1: Decision Guidance

### When to Use

- User has local path to existing repo not built with Genorah.
- Goal: bring it into the pipeline without losing detail.
- Repo may be any supported framework (Next/Astro/SvelteKit/Nuxt/React/Vite) or unknown.

### When NOT to Use

- Only a live URL — use `url-scrape-ingestion`.
- New greenfield project — use `/gen:start-project`.
- Already-Genorah project — use `/gen:migrate` for version upgrades.

### Decision Tree

- `package.json` detected → framework inferred from deps.
- `tailwind.config.{js,ts}` detected → token source.
- `theme.ts` / `design-tokens.json` / `@theme {}` CSS → high-confidence tokens.
- None of above → fall back to AST scan of `.css` files + `url-scrape-ingestion` of dev server output.

### Pipeline Connection

Entry via `/gen:ingest codebase <path>`. Emits artifacts under `.planning/genorah/ingested/<slug>/` (see architecture doc).

## Layer 2: Example

```bash
node scripts/ingest/codebase-scan.mjs /path/to/legacy-repo --slug=acme-site
# → .planning/genorah/ingested/acme-site/
#   ├── source/                     # repo mirror at ingest time
#   ├── INGESTION.md                # summary + framework detection
#   ├── DNA-EXTRACTED.md            # tokens w/ confidence
#   ├── manifests/components.json   # file → proposed block mapping
#   └── preservation.ledger.ndjson
```

## Layer 3: Integration Context

- Runs `preservation-ledger` for every file read.
- Invokes `dna-reverse-engineer` skill for extraction stage.
- Invokes `archetype-inference` skill for match stage.
- Invokes `component-mapping` skill for map stage.
- Outputs feed into `/gen:align` so user can confirm archetype + fill gaps.

## Layer 4: Anti-Patterns

- Mutating the user's repo during ingest — read-only; mirror to `source/`.
- Collapsing multiple matching framework configs silently — report all, let user pick.
- Dropping non-standard directories — mirror everything under `source/`, even if unreadable.
- Assuming `src/components/` convention — scan all source dirs discovered from entry point.
