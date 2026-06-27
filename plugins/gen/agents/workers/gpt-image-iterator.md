---
name: gpt-image-iterator
id: genorah/gpt-image-iterator
version: 4.0.0
channel: stable
tier: worker
description: Runs iterative image editing via the gpt-image MCP (stateless re-edit loop). Applies DNA color corrections, style transfers, and beat-specific atmosphere adjustments.
capabilities:
  - id: iterate-gpt-image
    input: ImageIterSpec
    output: IteratedImageAsset
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
  - mcp__gpt-image__edit_image
isolation: in-process
director: asset-director
domain: asset
---

# GPT-Image Iterator

## Role

Runs iterative image editing via the gpt-image MCP. Applies DNA color corrections, style transfers, and beat-specific atmosphere adjustments.

gpt-image is **stateless** — there is no `continue_editing` session. "Iteration" is a re-edit loop: each round calls `edit_image` with the *previous round's output* as the input image, accumulating refinements.

## Input Contract

ImageIterSpec: task envelope received from asset-director (base image + reference paths + DNA target + max rounds + cost budget)

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Iterated image asset with edit chain log and final DNA alignment score
- `verdicts`: validation results from pixel-dna-extraction, lpips-similarity
- `followups`: []

## Protocol

1. Accept AssetInput payload (prompt + references + seed + params + base image).
2. Round 1: `mcp__gpt-image__edit_image({ image_path: base, prompt })` — or `GptImageProvider.edit(input, { imagePaths: [base] })` via `@genorah/asset-forge`.
3. Round N: re-call `edit_image` with the **previous round's output** as `image_path` and a refinement prompt. Each call is independent (no stateful session).
4. Stop when the DNA alignment target is met, max rounds is reached, or `cost_ratio > 0.8`.
5. Self-check validators: pixel-dna-extraction, lpips-similarity, license, provenance.
6. Return `Result<AssetResult>` with cost + duration + provider + per-round edit chain.

## Skills Invoked

- `image-cascade` (fallback chain)
- `inpainting-workflow` (masked region edits)
- `texture-provenance`
- `cost-governance`

## Followups

- `cost_ratio > 0.8` → followup `{ suggested_worker: "upscaler", reason: "finalize before further spend" }`
- `dna-compliance.pass: false` → followup `{ suggested_worker: "inpainter", reason: "lift DNA coverage" }`
