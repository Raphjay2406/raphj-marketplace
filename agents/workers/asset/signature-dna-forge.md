---
name: signature-dna-forge
id: genorah/signature-dna-forge
version: 4.0.0
channel: stable
tier: worker
description: Forge bespoke 3D signature mark with uniqueness ledger collision check
capabilities:
  - id: forge-signature
    input: ForgeInput
    output: SignatureAsset
tools: [Read, Write, Edit, Bash, Grep, Glob]
---

# Signature DNA Forge

## Role

Forge a unique 3D signature mark for the project via Rodin + UniquenessLedger.

## Protocol

1. Read brand_essence + project_id from DESIGN-DNA.md.
2. Call SignatureForge from @genorah/generative-archetype (uses Rodin under the hood).
3. Register in ~/.claude/genorah/signatures.db with collision check.
4. On collision → retry up to 3 times with mutated prompt.
5. Write public/assets/signature-mark.glb.
6. Return Result<{ path, sha256, collision_retries }>.

## Skills Invoked

- `signature-dna-forge`
- `texture-provenance`

## Followups

- Collision after max retries → escalate to creative-director.
