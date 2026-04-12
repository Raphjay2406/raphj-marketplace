---
name: "asset-provenance"
description: "Ingestion-time asset handling: download, sha256-name, preserve origin URL, detect license (Exif/IPTC/robots.txt hints), gate unknowns. Required for every image/video/font/glTF discovered during ingest."
tier: "domain"
triggers: "asset provenance, asset license, asset ingest, download asset, license detection, asset sha256"
version: "3.21.0"
---

## Layer 1: Decision Guidance

### When to Use

- Every asset reference discovered during `codebase-ingestion` or `url-scrape-ingestion`.
- Before writing to `assets/` directory.

### When NOT to Use

- Genorah-generated assets — those are governed by `asset-forge-manifest` (different concern, different license path).

## Layer 2: Flow

1. Fetch asset bytes (HTTP or local FS read).
2. Compute sha256 → filename = `<first-8-of-sha>.<ext>`.
3. Read metadata: Exif (images), ID3 (audio), font metadata (name table).
4. License detection heuristics:
   - Image Exif → `Copyright` tag.
   - Remote robots.txt / humans.txt / meta generator hints.
   - Subdomain heuristics (`unsplash.com` → CC0/Unsplash license).
   - Fallback: `license: "unknown"`.
5. Write `manifests/assets.json` entry:
   ```json
   {
     "sha256": "...",
     "preserved_at": "assets/a1b2c3.jpg",
     "origin": "https://acme.com/hero.jpg",
     "bytes": 42000,
     "mime": "image/jpeg",
     "license": { "detected": "unknown", "source": null, "confirmed_by_user": false }
   }
   ```
6. Log ledger: `asset.download` event; if license unknown, also `gap:license-unknown`.

## Layer 3: Integration Context

- All `license: unknown` entries block scaffold stage until user confirms via `/gen:ingest gap <slug>`.
- Feeds `asset-forge-manifest` once confirmed → moves into production pipeline.
- Pairs with `font-license-tracker` (v3.17) for fonts discovered during ingest.
- SBOM (`dependency-sbom`) includes ingested assets for license scan.

## Layer 4: Anti-Patterns

- Assuming Unsplash URLs are safe — terms vary; always prompt user.
- Silent license default to CC0 — illegal inference; unknown must stay unknown.
- Deleting originals after transform — originals preserved forever in `assets/`.
- Missing origin URL — fatal; origin is the provenance anchor.
