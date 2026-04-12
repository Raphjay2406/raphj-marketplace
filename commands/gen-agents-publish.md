---
description: Publish a Genorah agent to the marketplace (M5 stub)
argument-hint: "<agent-id>"
---

# /gen:agents-publish

In M1, prints the agent card to stdout and notes the registry is not yet active (F4 ships in M5).

## Workflow

1. Read the agent frontmatter from `agents/directors/<id>.md` or `agents/workers/**/<id>.md`.
2. Pretty-print the generated card from `.claude-plugin/generated/agent-cards.json`.
3. Print: "Marketplace registry lands in v4-M5. Card ready for publishing when registry is live."
