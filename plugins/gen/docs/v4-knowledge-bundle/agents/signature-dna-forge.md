---
id: "genorah/signature-dna-forge"
name: "signature-dna-forge"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Forge bespoke 3D signature mark with uniqueness ledger collision check"
source: "agents/workers/asset/signature-dna-forge.md"
tags: [agent, genorah, worker]
---

# signature-dna-forge

> Forge bespoke 3D signature mark with uniqueness ledger collision check

## Preview

# Signature DNA Forge  ## Role  Forge a unique 3D signature mark for the project via Rodin + UniquenessLedger.  ## Protocol  1. Read brand_essence + project_id from DESIGN-DNA.md. 2. Call SignatureFor

## Frontmatter

```yaml
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
```
