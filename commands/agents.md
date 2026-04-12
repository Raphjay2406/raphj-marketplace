---
description: "v3.20 — Scaffold an agentic UX flow: tool schemas, route handler with stopWhen guard, and trace UI components wired to DNA tokens."
argument-hint: "<flow-name> [--tools=search,book,send] [--max-steps=8]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
recommended-model: opus-4-6
---

# /gen:agents

Generates a multi-step agent flow aligned with `agentic-ux-patterns` + `agent-trace-ui` skills.

## Workflow

1. Read DNA tokens from `DESIGN-DNA.md`.
2. Generate `/app/api/agents/<flow-name>/route.ts` with AI SDK v6 via Vercel AI Gateway (`'anthropic/claude-sonnet-4.6'`), `stopWhen: stepCountIs(<max-steps>)`, and tool set from `--tools`.
3. Generate `/components/agents/<flow-name>/` folder with `Plan.tsx`, `ToolCallCard.tsx`, `ApprovalGate.tsx`, `TraceTimeline.tsx` — all DNA-themed.
4. Generate Zod schemas per tool in `/lib/agents/<flow-name>/tools.ts`.
5. Append `agent_runs` Prisma/Drizzle table to `db-schema-from-content` output.
6. Update `SUMMARY.md` with flow manifest + cost estimate (per step).

## Validation

- Run `npm run lint && npm run typecheck`.
- Smoke-test via `/gen:synthetic-test agent-<flow-name>`.
