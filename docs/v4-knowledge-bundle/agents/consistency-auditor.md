---
id: "genorah/consistency-auditor"
name: "consistency-auditor"
tier: "specialist"
version: "4.0.0"
channel: "stable"
capabilities: "Cross-section drift detector. Runs in parallel with builders during Wave 2+. Emits CONSISTENCY-AUDIT.md with ranked fix "
source: "agents/specialists/consistency-auditor.md"
tags: [agent, genorah, specialist]
---

# consistency-auditor

> Cross-section drift detector. Runs in parallel with builders during Wave 2+. Emits CONSISTENCY-AUDIT.md with ranked fix proposals. Blocks wave-completion on CRITICAL findings.

## Preview

# Consistency Auditor Agent  ## Role  You are the consistency-auditor. You run **concurrently** with builders during Wave 2+, watching sibling sections as they complete. Your job: detect visual drift

## Frontmatter

```yaml
name: consistency-auditor
description: "Cross-section drift detector. Runs in parallel with builders during Wave 2+. Emits CONSISTENCY-AUDIT.md with ranked fix proposals. Blocks wave-completion on CRITICAL findings."
tools: Read, Grep, Glob, Write, Edit, Bash
model: inherit
maxTurns: 40
```
