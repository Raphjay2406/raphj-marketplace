---
name: signature-dna-forge
description: Bespoke 3D signature mark generation via Rodin API — uniqueness ledger collision check, up to 3 mutation retries, GLB output + sha256 provenance.
tier: domain
triggers: signature-mark, signature-dna-forge, rodin, uniqueness-ledger, 3d-mark, brand-mark, collision-check
version: 1.0.0
---

# Signature DNA Forge

Every project gets a unique 3D signature mark — a GLB asset derived from brand essence, with collision detection against all previously forged marks in the user-global ledger.

## Layer 1 — When to invoke

Invoked by `/gen:signature-mark` command and the `signature-dna-forge` worker. Prerequisites:
- DESIGN-DNA.md present with `brand_essence` and `project_id`
- `ROD_API_KEY` environment variable set (Rodin API access)
- `~/.claude/genorah/` directory writable (for signatures.db)

Falls back gracefully (exit 0, informational message) when `ROD_API_KEY` is unset — suitable for offline/CI environments.

## Layer 2 — Rodin integration

**Prompt construction:** brand essence + archetype personality → Rodin-formatted prompt:
```
A minimal 3D letterform / abstract mark representing: <brand_essence>.
Style: <archetype_style_descriptor>. Material: <dna_material_token>.
Clean geometry, no text, suitable for use as a logo mark at 256px.
```

**Uniqueness ledger (`~/.claude/genorah/signatures.db` — SQLite):**
```sql
CREATE TABLE signatures (
  project_id TEXT PRIMARY KEY,
  sha256     TEXT NOT NULL,
  embedding  BLOB,           -- 768-dim float32 for cosine similarity
  created_at TEXT
);
```

Collision check: cosine similarity against all stored embeddings. Threshold: similarity > 0.92 = collision.

**Retry protocol:**
- Collision detected → mutate prompt (add 1 tension adjective from archetype tension_zones).
- Up to 3 retries. After 3 failures → escalate to creative-director.
- `collision_retries` field in output tracks retry count for audit trail.

**Output:**
```
public/assets/signature-mark.glb   — the 3D mark asset
```

Provenance registered in `preservation.ledger.ndjson`:
```json
{"kind": "asset.generated", "path": "public/assets/signature-mark.glb", "sha256": "...", "provider": "rodin", "collision_retries": 0}
```

## Layer 3 — Integration

- `/gen:assets` recognizes `signature-mark.glb` and adds it to MANIFEST.json with `type: "brand-mark"`
- `/gen:export` includes mark in brand kit deliverables
- `texture-provenance` skill governs license classification (generated = MIT-equivalent, no third-party IP)
- Ship-check validates GLB loads without error in `<model-viewer>` or Three.js GLTFLoader

## Layer 4 — Anti-patterns

- Generating mark without collision check — risk of near-identical marks across projects, undermining brand uniqueness.
- Skipping ledger write on successful forge — future projects will miss this mark in similarity search.
- Using mark before collision check completes — async check must resolve before committing GLB to public/.
- Accepting mark with `collision_retries: 3` without creative-director review — max-retry exhaustion requires human judgment.
