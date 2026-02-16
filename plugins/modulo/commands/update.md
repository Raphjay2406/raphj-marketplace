---
description: Show changelog, what's new, and migration notes for the current version
argument-hint: Optional version number to show specific changelog
---

You are the Modulo Update command. You display version information, changelogs, and migration guidance for the Modulo plugin.

## Current Version

**Modulo v6.1.0** — Context Rot Prevention

## What to Show

Present the following to the user:

---

### v6.1.0 — Context Rot Prevention (Current)

**Problem solved:** AI agents lose design fidelity during long build sessions. By wave 4+, fonts drift, colors shift, and sections feel like different designers made them.

**6-layer defense system:**

| Layer | What | How |
|-------|------|-----|
| L0 | Pre-commit DNA compliance hook | Shell script greps staged files for anti-slop patterns (shadow-md, font-sans, bg-blue-500, "Submit", etc.) before every commit |
| L1 | CONTEXT.md single source of truth | One file with DNA anchor, build state, arc position, next instructions — rewritten after every wave |
| L2 | Pre-extracted spawn prompts | Design-lead constructs Complete Build Context for each builder — builders read only 1 file (PLAN.md) |
| L3 | Canary checks | 5 self-test questions from memory after each wave. 3+ wrong = automatic session boundary |
| L4 | 2-wave session boundaries | Proactive suggestion to start fresh session every 2 waves. Turn 31+ = mandatory |
| L5 | Baked-in agent rules | Beat parameters, performance rules, anti-slop checks embedded directly in section-builder.md |

**New files:**
- `.claude-plugin/hooks/dna-compliance-check.sh` — pre-commit hook
- `.planning/modulo/CONTEXT.md` — created by `/modulo:start-design`, updated by `/modulo:plan-sections`, rewritten by design-lead after every wave

**Changed files:**
- `agents/section-builder.md` — embedded beat params table, performance rules, anti-slop quick check; new PLAN.md-only read protocol
- `agents/design-lead.md` — CONTEXT.md management, canary check protocol, context budget (turn zones), pre-extracted spawn prompts with Complete Build Context template
- `commands/execute.md` — session boot protocol, 2-wave boundary check, CONTEXT.md-based session management
- `commands/start-design.md` — generates initial CONTEXT.md after DNA creation
- `commands/plan-sections.md` — updates CONTEXT.md with section table and wave map
- `commands/verify.md` — CONTEXT.md as primary orientation source
- `commands/iterate.md` — CONTEXT.md as primary context source

**Migration from v6.0:**
- **Automatic:** Existing projects without CONTEXT.md will use legacy fallback (reads `.continue-here.md` or `.session-transfer.md`, then generates CONTEXT.md)
- **No breaking changes.** All existing workflows continue to work.
- **To opt in:** Run `/modulo:execute resume` in a new session — it will auto-generate CONTEXT.md from existing state files.

---

### v6.0.0 — Full Quality Pipeline

- Visual reference capture with browser screenshots
- Hyper-specific PLAN.md blueprints (ASCII diagrams, exact Tailwind classes, inline wow moment code)
- Content planning phase (CONTENT.md) before section building
- Discussion-first protocol (mandatory user approval before code changes)
- Section coherence system (page context snapshots, background progression)
- Live visual feedback (screenshots, scroll-through GIFs)
- Wow factor enforcement (3-5 per page, boldness verification)
- Anti-context-rot v1 (task-level DNA checkpoints, plan mutation protocol)

---

### v5.0.0 — Creative Engine

- Creative tension system (5 levels, per-archetype tensions)
- Emotional arc (10 beat types, arc templates, transition techniques)
- Cinematic motion choreography
- Wow moments library (30+ patterns)
- Awwwards 4-axis scoring
- Light-mode patterns
- Design system scaffold (Wave 0 code generation)
- UX patterns, micro-copy, conversion patterns, performance guardian

---

### v4.1.0 — Design DNA & Archetypes

- Design DNA identity system
- 16 opinionated archetypes + custom builder
- Anti-slop gate (35-point / 7-category)
- Visual audit system

---

## After Showing Changelog

Tell the user:
```
Modulo v6.1.0 is the current version.

Key commands:
- /modulo:start-design — Begin a new project
- /modulo:execute resume — Resume with context rot prevention
- /modulo:verify — Quality verification with anti-slop gate

Full docs: README.md
```
