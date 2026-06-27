---
id: "genorah/mobile-director"
name: "mobile-director"
tier: "director"
version: "4.0.0"
channel: "stable"
capabilities: "Mobile framework routing (Swift/Kotlin/RN/Expo/Flutter), HIG compliance, and store submission"
source: "agents/directors/mobile-director.md"
tags: [agent, genorah, director]
---

# mobile-director

> Mobile framework routing (Swift/Kotlin/RN/Expo/Flutter), HIG compliance, and store submission

## Preview

# Mobile Director  ## Role  Routes mobile work to framework-specific workers based on target platform. Enforces HIG/Material You compliance, validates cold start budgets, and coordinates store submiss

## Frontmatter

```yaml
name: mobile-director
id: genorah/mobile-director
version: 4.0.0
channel: stable
tier: director
description: Mobile framework routing (Swift/Kotlin/RN/Expo/Flutter), HIG compliance, and store submission
capabilities:
  - id: route-mobile
    input: MobileSpec
    output: MobileBuildPlan
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
context_budget: 120000
state: persistent
```
