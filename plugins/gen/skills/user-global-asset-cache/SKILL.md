---
name: user-global-asset-cache
description: sha256-keyed cross-project asset cache at ~/.claude/genorah/asset-cache/
tier: domain
triggers:
  - "asset cache"
  - "cache hit"
version: 4.0.0
---

# User-Global Asset Cache

## Layer 1 — Decision

Always check cache before any provider call. Saves significant cost across projects.

## Layer 2 — Example

```ts
import { AssetCache, computeCacheKey, defaultCacheDir } from "@genorah/asset-forge";
const cache = new AssetCache({ rootDir: defaultCacheDir() });
await cache.init();
const key = computeCacheKey({ provider: "rodin", model: "gen-2", prompt: "bust", seed: 42, reference_hashes: [] });
const hit = await cache.get(key);
if (hit) return hit;
// otherwise generate + cache.set(key, ...)
```

## Layer 3 — Integration

- Cache root: `~/.claude/genorah/asset-cache/` (Linux/macOS) or `%USERPROFILE%/.claude/...` (Windows)
- Storage: keyv + @keyv/sqlite for metadata; blob files at `<rootDir>/blobs/<sha[0:2]>/<sha>`
- Hit/miss tracked in MANIFEST.json `cache_hit` field

## Layer 4 — Anti-Patterns

- Per-project cache (loses cross-project reuse)
- Skipping cache on cinematic projects (most expensive bills)
- Not propagating cache hits to MANIFEST
