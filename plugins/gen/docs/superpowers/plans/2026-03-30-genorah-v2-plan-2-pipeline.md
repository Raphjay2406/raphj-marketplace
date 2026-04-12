# Plan 2: Pipeline Core (Agents + Commands)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite all pipeline agents and commands to use Claude Code's latest features (Agent Teams, worktree isolation, SendMessage, TodoWrite, PlanMode, visual companion). Fix broken dev flow by removing hardcoded suggestions and standardizing artifact names.

**Architecture:** Each agent/command is a markdown file with structured sections. Commands define user-facing workflows. Agents define subagent behavior including tools, spawn prompt contracts, and input/output specs.

**Tech Stack:** Markdown with YAML frontmatter

**Spec:** `docs/superpowers/specs/2026-03-30-genorah-v2-design.md` Sections 5-6

**Depends on:** Plan 1 (Foundation) must be complete

---

## File Map

### Agent Files to Rewrite (7 pipeline)
- `agents/pipeline/orchestrator.md` -- Agent Teams, TodoWrite, SendMessage, companion
- `agents/pipeline/builder.md` -- worktree isolation, spawn prompt with motion/responsive/compat/registry
- `agents/pipeline/creative-director.md` -- companion screens, breakpoint comparison
- `agents/pipeline/quality-reviewer.md` -- 72-point gate, consistency audit, integration validation
- `agents/pipeline/planner.md` -- mandatory motion/responsive/compat blocks in PLAN.md
- `agents/pipeline/researcher.md` -- background agents, 6 tracks
- `agents/pipeline/polisher.md` -- GAP-FIX + CONSISTENCY-FIX remediation

### Agent Files to Create (1 new)
- `agents/specialists/ai-ui-specialist.md` -- AI interface patterns

### Agent Files to Update (3 specialists)
- `agents/specialists/3d-specialist.md` -- add motion/responsive/compat awareness
- `agents/specialists/animation-specialist.md` -- add responsive/compat awareness
- `agents/specialists/content-specialist.md` -- add integration awareness

### Protocol Files to Update (3)
- `agents/protocols/agent-memory.md` -- add decision log, artifact registry
- `agents/protocols/canary-check.md` -- add decision memory verification
- `agents/protocols/context-rot-prevention.md` -- add hook-based layers

### Command Files to Rewrite (8 pipeline)
- `commands/start-project.md` -- TodoWrite, background researchers, companion, integration detection, compat tier
- `commands/discuss.md` -- companion feature mockups, PlanMode
- `commands/plan.md` -- EnterPlanMode, mandatory motion/responsive/compat blocks, registry init
- `commands/build.md` -- Agent Teams, worktree isolation, TodoWrite, companion dashboard
- `commands/iterate.md` -- companion before/after, brainstorm-first
- `commands/bugfix.md` -- companion diagnostic, breakpoint reproduction
- `commands/audit.md` -- 72-point scoring, Lighthouse, axe-core, companion dashboard
- `commands/status.md` -- companion progress, smart routing via hook

### Command Files to Create (3 utility)
- `commands/sync-knowledge.md` -- Obsidian bidirectional sync
- `commands/companion.md` -- visual companion start/stop
- `commands/export.md` -- Obsidian vault export

---

### Task 1: Rewrite orchestrator agent

**Files:**
- Rewrite: `agents/pipeline/orchestrator.md`

- [ ] **Step 1: Write new orchestrator definition**

Key sections to include:
- **Role:** Master coordinator for wave-based execution
- **Claude Features:** Agent Teams (spawns named builders), SendMessage coordination, TodoWrite progress, EnterPlanMode wave approval, visual companion management
- **Spawn Protocol:** How to spawn builders with `isolation: "worktree"` and `name: "builder-{section}"`, researchers with `run_in_background: true`
- **Component Registry:** Builds DESIGN-SYSTEM.md during Wave 0-1 from first built components
- **Artifact Registry:** Maintains `artifact_registry` section in CONTEXT.md with current file names
- **Companion Screens:** Pushes build-progress.html, anti-slop-scores.html, awwwards-projection.html after each wave
- **NO hardcoded suggestions:** Never suggests next command. Updates STATE.md; hook handles routing.
- **Input:** MASTER-PLAN.md, DESIGN-DNA.md, CONTEXT.md
- **Output:** Updated STATE.md, CONTEXT.md, DESIGN-SYSTEM.md, wave completion reports

- [ ] **Step 2: Verify file exists and has required sections**
```bash
grep -c "Agent Teams\|SendMessage\|TodoWrite\|worktree\|DESIGN-SYSTEM\|artifact_registry" agents/pipeline/orchestrator.md
```
Expected: 6+ matches

- [ ] **Step 3: Commit**
```bash
git add agents/pipeline/orchestrator.md
git commit -m "feat: rewrite orchestrator for Agent Teams, TodoWrite, companion"
```

---

### Task 2: Rewrite builder agent

**Files:**
- Rewrite: `agents/pipeline/builder.md`

- [ ] **Step 1: Write new builder definition**

Key sections:
- **Role:** Builds individual sections from PLAN.md
- **Claude Features:** `isolation: "worktree"` for parallel builds, SendMessage completion to orchestrator, TodoWrite per-task
- **Spawn Prompt Contract:** Orchestrator MUST include in spawn prompt:
  1. Full Design DNA (colors, fonts, spacing, motion tokens, compatibility tier)
  2. Emotional arc beat assignment + motion intensity tier
  3. Section PLAN.md WITH motion block (entrance, stagger, interactions)
  4. Section PLAN.md WITH responsive block (4 breakpoints)
  5. Compatibility tier + required fallbacks list
  6. Component registry from DESIGN-SYSTEM.md (all registered variants)
  7. Integration requirements if applicable (HubSpot form IDs, Stripe config)
- **Component Compliance:** Must use registered variants from DESIGN-SYSTEM.md. New variants proposed in SUMMARY.md.
- **Output:** Built section code, SUMMARY.md with anti-slop self-check + component proposals
- **Anti-slop Self-Check:** Builder runs own 12-category quick score before reporting completion

- [ ] **Step 2: Verify spawn prompt contract is documented**
```bash
grep -c "motion\|responsive\|compatibility\|component registry\|integration" agents/pipeline/builder.md
```
Expected: 5+ matches

- [ ] **Step 3: Commit**
```bash
git add agents/pipeline/builder.md
git commit -m "feat: rewrite builder for worktree isolation, spawn prompt contract"
```

---

### Task 3: Rewrite creative-director agent

**Files:**
- Rewrite: `agents/pipeline/creative-director.md`

- [ ] **Step 1: Write new creative-director definition**

Key sections:
- **Pre-wave checkpoint:** Review PLAN.md files for motion, responsive, compat blocks present
- **Post-wave checkpoint:** Review built sections against DNA + archetype personality
- **Companion screens:** Push before/after comparisons, breakpoint side-by-side
- **BELOW_CREATIVE_BAR flag:** When section lacks archetype personality, writes GAP-FIX.md with creative improvements
- **Creative notes:** Writes future-wave guidance to CONTEXT.md

- [ ] **Step 2: Commit**
```bash
git add agents/pipeline/creative-director.md
git commit -m "feat: rewrite creative-director with companion and breakpoint review"
```

---

### Task 4: Rewrite quality-reviewer agent

**Files:**
- Rewrite: `agents/pipeline/quality-reviewer.md`

- [ ] **Step 1: Write new quality-reviewer definition**

Key sections:
- **72-point scoring:** 12 categories x 6 criteria (0-3 scale per criterion)
- **Categories:** Color System, Typography, Layout & Composition, Depth & Polish, Motion & Interaction, Creative Courage, UX Intelligence, Accessibility, Content Quality, Responsive Craft, Performance, Integration Quality
- **Weights:** Color (1.2x), Typography (1.2x), Creative Courage (1.2x), Layout (1.1x), Depth (1.1x), UX (1.1x), Accessibility (1.1x), all others (1.0x)
- **Hard Gates:** Motion exists, 4-breakpoint responsive, compat tier respected, component registry compliance
- **Penalty System:** Full penalty table from spec (missing signature -8, forbidden pattern -10, etc.)
- **Named Tiers:** Reject (<140), Baseline (140-169), Strong (170-199), SOTD-Ready (200-219), Honoree (220-234), SOTM-Ready (235+)
- **Cross-Section Consistency Audit:** Extract all cards, buttons, headings, grids across sections, flag dimension/spacing mismatches
- **Integration Quality:** UTK presence, webhook security, token exposure checks
- **Output:** GAP-FIX.md (design quality), CONSISTENCY-FIX.md (component consistency)
- **Companion:** Push score-dashboard.html with radar chart, tier badge, breakpoint screenshots

- [ ] **Step 2: Verify 12 categories documented**
```bash
grep -c "Color System\|Typography\|Layout.*Composition\|Depth.*Polish\|Motion.*Interaction\|Creative Courage\|UX Intelligence\|Accessibility\|Content Quality\|Responsive Craft\|Performance\|Integration Quality" agents/pipeline/quality-reviewer.md
```
Expected: 12

- [ ] **Step 3: Commit**
```bash
git add agents/pipeline/quality-reviewer.md
git commit -m "feat: rewrite quality-reviewer with 72-point gate and consistency audit"
```

---

### Task 5: Rewrite planner agent

**Files:**
- Rewrite: `agents/pipeline/planner.md`

- [ ] **Step 1: Write new planner definition**

Key sections:
- **MASTER-PLAN.md generation:** Wave map, dependency graph, beat assignments, layout pre-assignments
- **Per-section PLAN.md:** Now includes MANDATORY blocks:
  - `motion:` block (entrance, stagger, scroll_trigger, interactions, archetype_profile) -- auto-derived from beat + archetype
  - `responsive:` block (mobile_375, tablet_768, desktop_1024, ultrawide_1440) -- auto-derived from content type
  - `compatibility:` block (tier, required_fallbacks) -- from DNA
  - `integration:` block (hubspot_forms, stripe_elements, etc.) -- if applicable
- **Motion Intensity Tiers:** Hook=Heavy, Tease=Medium, Reveal=Heavy, Build=Medium, Peak=Maximum, Breathe=Minimal, Tension=Heavy, Proof=Light, Pivot=Medium, Close=Medium
- **Component Registry Init:** Creates initial DESIGN-SYSTEM.md skeleton during planning

- [ ] **Step 2: Commit**
```bash
git add agents/pipeline/planner.md
git commit -m "feat: rewrite planner with mandatory motion/responsive/compat blocks"
```

---

### Task 6: Rewrite researcher agent

**Files:**
- Rewrite: `agents/pipeline/researcher.md`

- [ ] **Step 1: Write new researcher definition**

Key changes:
- **6 tracks** (was 5): Industry, Design References, Component Patterns, Animation Techniques, Content Voice, Integration Research (NEW)
- **Background execution:** All tracks run as `run_in_background: true`
- **Integration track:** Researches HubSpot forms, Stripe flows, Shopify patterns, competitor integrations relevant to project

- [ ] **Step 2: Commit**
```bash
git add agents/pipeline/researcher.md
git commit -m "feat: rewrite researcher with 6 tracks and background execution"
```

---

### Task 7: Rewrite polisher agent

**Files:**
- Rewrite: `agents/pipeline/polisher.md`

- [ ] **Step 1: Write new polisher definition**

Key changes:
- Now handles TWO fix files: GAP-FIX.md (design) and CONSISTENCY-FIX.md (component consistency)
- 2-cycle remediation loop max per fix file
- Reports component registry updates needed to orchestrator

- [ ] **Step 2: Commit**
```bash
git add agents/pipeline/polisher.md
git commit -m "feat: rewrite polisher for GAP-FIX + CONSISTENCY-FIX remediation"
```

---

### Task 8: Create ai-ui-specialist agent

**Files:**
- Create: `agents/specialists/ai-ui-specialist.md`

- [ ] **Step 1: Write new specialist**

Sections:
- **Role:** Handles sections requiring AI interface patterns
- **Expertise:** Chat UIs (AI Elements), AI search, prompt playgrounds, model comparison, content generation UIs
- **Mandatory rules:** AI text never as raw {text}, always `<MessageResponse>` or `<Message>`. Uses AI SDK patterns (useChat, streamText). DNA-styled components.
- **Tools:** Read, Write, Edit, Bash, Grep, Glob
- **When spawned:** Orchestrator detects AI UI section in PLAN.md

- [ ] **Step 2: Commit**
```bash
git add agents/specialists/ai-ui-specialist.md
git commit -m "feat: add ai-ui-specialist agent for AI interface patterns"
```

---

### Task 9: Update 3 specialist agents

**Files:**
- Update: `agents/specialists/3d-specialist.md`
- Update: `agents/specialists/animation-specialist.md`
- Update: `agents/specialists/content-specialist.md`

- [ ] **Step 1: Add motion/responsive/compat awareness to each**

For each specialist, add sections about:
- Receiving motion block in spawn prompt and honoring it
- Building responsive for 4 breakpoints
- Respecting compatibility tier
- Using component registry variants

- [ ] **Step 2: Commit**
```bash
git add agents/specialists/
git commit -m "feat: update specialists with motion/responsive/compat awareness"
```

---

### Task 10: Update 3 protocol documents

**Files:**
- Update: `agents/protocols/agent-memory.md`
- Update: `agents/protocols/canary-check.md`
- Update: `agents/protocols/context-rot-prevention.md`

- [ ] **Step 1: Update agent-memory with decision log and artifact registry**

Add DECISIONS.md format (decision, rationale, date, agent). Add artifact registry section in CONTEXT.md.

- [ ] **Step 2: Update canary-check with decision memory verification**

Add check: can agent recall recent decisions from DECISIONS.md without reading?

- [ ] **Step 3: Update context-rot-prevention with hook-based layers**

Add Layer 0a (SessionStart injection), Layer 0b (PreToolUse skill injection), Layer 0c (UserPromptSubmit routing). These are zero-context-cost structural defenses enabled by the hook system.

- [ ] **Step 4: Commit**
```bash
git add agents/protocols/
git commit -m "feat: update protocols for v2 hook infrastructure and decision log"
```

---

### Task 11: Rewrite start-project command

**Files:**
- Rewrite: `commands/start-project.md`

- [ ] **Step 1: Write new command**

Key additions:
- TodoWrite for progress tracking across phases
- Background researcher agents (6 tracks, run_in_background)
- Visual companion screens: archetype picker, palette explorer, font preview, creative directions, compat tier picker
- Integration detection: auto-ask about HubSpot, Stripe, Shopify, WooCommerce, Propstack, AI features
- Compatibility tier selection: Modern/Broad/Legacy/Maximum (always asked)
- Device priority: Desktop-first/Mobile-first/Equal (always asked)
- Answers stored in PROJECT.md, propagated to DNA
- Command behavior contract: read STATE.md first, TodoWrite, PlanMode for direction changes, update STATE.md on completion, never suggest next command

- [ ] **Step 2: Commit**
```bash
git add commands/start-project.md
git commit -m "feat: rewrite start-project with TodoWrite, companion, integration detection"
```

---

### Task 12: Rewrite remaining 7 pipeline commands

**Files:**
- Rewrite: `commands/discuss.md`
- Rewrite: `commands/plan.md`
- Rewrite: `commands/build.md`
- Rewrite: `commands/iterate.md`
- Rewrite: `commands/bugfix.md`
- Rewrite: `commands/audit.md`
- Rewrite: `commands/status.md`

- [ ] **Step 1: Rewrite discuss.md**

Companion feature mockups, content voice samples. PlanMode for proposal approval. Command behavior contract.

- [ ] **Step 2: Rewrite plan.md**

EnterPlanMode gate. Generates mandatory motion/responsive/compat blocks. Initializes component registry. Command behavior contract.

- [ ] **Step 3: Rewrite build.md**

Agent Teams with parallel builders (worktree isolation). TodoWrite per-section. Companion dashboard (progress, scores, breakpoints, consistency). Command behavior contract.

- [ ] **Step 4: Rewrite iterate.md**

Brainstorm-first (2-3 approaches). Companion before/after at all breakpoints. Auto-reads GAP-FIX.md (no --from-gaps flag). Command behavior contract.

- [ ] **Step 5: Rewrite bugfix.md**

Diagnostic root cause analysis. Companion diagnostic overlay and breakpoint reproduction. Playwright screenshots. Command behavior contract.

- [ ] **Step 6: Rewrite audit.md**

72-point scoring. Lighthouse + axe-core. 4-breakpoint screenshots. Companion score dashboard with consistency matrix. Command behavior contract.

- [ ] **Step 7: Rewrite status.md**

Read STATE.md. Show progress in companion. Smart next-step via hook (not hardcoded). Command behavior contract.

- [ ] **Step 8: Commit all**
```bash
git add commands/
git commit -m "feat: rewrite all pipeline commands with TodoWrite, companion, Agent Teams"
```

---

### Task 13: Create 3 utility commands

**Files:**
- Create: `commands/sync-knowledge.md`
- Create: `commands/companion.md`
- Create: `commands/export.md`

- [ ] **Step 1: Write sync-knowledge command**

Description: Bidirectional sync between plugin skills and Obsidian knowledge vault. Argument-hint: direction (plugin-to-obsidian, obsidian-to-plugin, both). Workflow: detect vault path from .claude/genorah.local.md, transform formats, sync.

- [ ] **Step 2: Write companion command**

Description: Start or stop the visual companion server. Argument-hint: action (start, stop, status). Workflow: run start-server.sh or stop-server.sh, report URL.

- [ ] **Step 3: Write export command**

Description: Export current project to Obsidian vault format. Workflow: read all .planning/genorah/ artifacts, transform to vault notes with wiki-links and tags, write to .planning/genorah/vault/.

- [ ] **Step 4: Commit**
```bash
git add commands/
git commit -m "feat: add utility commands (sync-knowledge, companion, export)"
```

---

### Task 14: Validation pass

- [ ] **Step 1: Verify all agents reference current artifact names**
```bash
grep -r "gap-fix\|gaps.md\|--from-gaps" agents/ commands/ | grep -v "GAP-FIX.md" | grep -v "CONSISTENCY-FIX.md"
```
Expected: No results (all references use standardized names)

- [ ] **Step 2: Verify no agents suggest next command**
```bash
grep -ri "suggest.*next\|recommend.*running\|try running\|you should run" agents/pipeline/ | grep -v "canary\|diagnostic"
```
Expected: No results

- [ ] **Step 3: Verify all commands follow behavior contract**
```bash
for f in commands/*.md; do echo "=== $f ==="; grep -c "STATE.md\|TodoWrite\|never suggest" "$f"; done
```
Expected: Each file has 2+ matches

- [ ] **Step 4: Commit**
```bash
git add -A
git commit -m "chore: plan 2 complete -- pipeline core validated"
```

---

## Plan 2 Summary

14 tasks delivering:
- 7 rewritten pipeline agents (orchestrator, builder, creative-director, quality-reviewer, planner, researcher, polisher)
- 1 new specialist (ai-ui-specialist)
- 3 updated specialists
- 3 updated protocols
- 8 rewritten pipeline commands
- 3 new utility commands
- Zero hardcoded suggestions, standardized artifact names

**Next:** Plan 3 (Quality & Design Intelligence) or Plan 4 (Content Expansion) -- can run in parallel
