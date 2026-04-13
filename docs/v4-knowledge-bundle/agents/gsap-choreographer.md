---
id: "genorah/gsap-choreographer"
name: "gsap-choreographer"
tier: "worker"
version: "4.0.0"
channel: "stable"
capabilities: "Authors GSAP ScrollTrigger and timeline sequences bound to DNA motion tokens. Enforces reduced-motion variants and perfo"
source: "agents/workers/gsap-choreographer.md"
tags: [agent, genorah, worker]
---

# gsap-choreographer

> Authors GSAP ScrollTrigger and timeline sequences bound to DNA motion tokens. Enforces reduced-motion variants and performance budgets.

## Preview

# GSAP Choreographer  ## Role  Authors GSAP ScrollTrigger and timeline sequences bound to DNA motion tokens. Enforces reduced-motion variants and performance budgets.  ## Input Contract  MotionSpec: t

## Frontmatter

```yaml
name: gsap-choreographer
id: genorah/gsap-choreographer
version: 4.0.0
channel: stable
tier: worker
description: Authors GSAP ScrollTrigger and timeline sequences bound to DNA motion tokens. Enforces reduced-motion variants and performance budgets.
capabilities:
  - id: choreograph-gsap
    input: MotionSpec
    output: GSAPTimeline
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: in-process
director: wave-director
domain: motion
```
